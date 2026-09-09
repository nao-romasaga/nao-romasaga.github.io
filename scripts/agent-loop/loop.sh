#!/usr/bin/env bash
# agent-loop: Fable(調査) → Sonnet(実装) → 機械検証 → 失敗ならFableに差し戻し
#
# 使い方:
#   1) 対話セッション(Fable)で調査し scripts/agent-loop/work/plan.md を書かせる
#   2) feature ブランチ上で ./scripts/agent-loop/loop.sh を実行
#   3) 全イテレーション失敗時は work/history/ を確認して人間が判断
#
# plan.md 無しで丸ごと任せる場合:
#   TASK_DESCRIPTION="やりたいこと" ./scripts/agent-loop/loop.sh
#
# リセット(前タスクの成果物をアーカイブして初期化):
#   ./scripts/agent-loop/loop.sh reset

set -uo pipefail

ROOT=$(git rev-parse --show-toplevel)
DIR="$ROOT/scripts/agent-loop"
WORK="$DIR/work"
PLAN="$WORK/plan.md"
REPORT="$WORK/report.md"
STATE="$WORK/state.json"

cd "$ROOT"
mkdir -p "$WORK/history"

# ── reset サブコマンド ─────────────────────────────────────────
if [[ "${1:-}" == "reset" ]]; then
  if [[ -f "$PLAN" ]]; then
    STAMP=$(date +%Y%m%d-%H%M%S)
    mkdir -p "$WORK/history/archived-$STAMP"
    mv -f "$PLAN" "$REPORT" "$STATE" "$WORK/verify.log" "$WORK/sonnet.log" \
      "$WORK/history/archived-$STAMP/" 2>/dev/null
    echo "アーカイブ: work/history/archived-$STAMP/"
  fi
  echo "リセット完了"
  exit 0
fi

# ── ガード ─────────────────────────────────────────────────────
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo "ERROR: $BRANCH ブランチでは実行できません。feature ブランチを切ってください" >&2
  exit 1
fi
command -v jq >/dev/null || { echo "ERROR: jq が必要です" >&2; exit 1; }
command -v claude >/dev/null || { echo "ERROR: claude CLI が必要です" >&2; exit 1; }

# ── Phase 0: 調査 (plan.md が無い時のみ) ───────────────────────
if [[ ! -f "$PLAN" ]]; then
  if [[ -z "${TASK_DESCRIPTION:-}" ]]; then
    cat >&2 <<'USAGE'
ERROR: work/plan.md がありません。次のどちらかで用意してください:
  a) 対話セッション(Fable)で調査して plan.md を書かせる(推奨)
  b) TASK_DESCRIPTION="やりたいこと" ./scripts/agent-loop/loop.sh
USAGE
    exit 1
  fi
  echo "== Phase 0: Fable が調査して plan.md を作成 =="
  RESULT=$(claude -p "$(cat <<EOF
次のタスクをこのリポジトリで調査し、実装計画を scripts/agent-loop/work/plan.md に書け。

タスク: $TASK_DESCRIPTION

plan.md の要件:
- 冒頭に YAML フロントマターを置く:
  ---
  task: <一行要約>
  verify: <機械実行可能な検証コマンド。exit 0 が成功>
  max_iterations: 3
  ---
- 本文: 背景 / 変更対象ファイル / 実装手順(別セッションのSonnetが
  追加調査なしで実装できる粒度で具体的に) / 完了条件 / やってはいけないこと
- CLAUDE.md と DESIGN.md の規約に準拠すること
EOF
)" --model fable --output-format json \
    --allowedTools "Read,Glob,Grep,Write,Bash(git log:*),Bash(git diff:*),Bash(ls:*)")
  FABLE_ID=$(echo "$RESULT" | jq -r '.session_id // empty')
  [[ -f "$PLAN" ]] || { echo "ERROR: plan.md が生成されませんでした" >&2; exit 1; }
  jq -n --arg id "$FABLE_ID" '{fable_session_id:$id, iteration:0}' > "$STATE"
fi

# ── state.json 初期化 (対話セッションで plan.md を作った場合) ──
[[ -f "$STATE" ]] || jq -n '{fable_session_id:"", iteration:0}' > "$STATE"
FABLE_ID=$(jq -r '.fable_session_id // ""' "$STATE")

# ── plan.md のフロントマターをパース ───────────────────────────
VERIFY_CMD=$(sed -n 's/^verify:[[:space:]]*//p' "$PLAN" | head -1)
MAX=$(sed -n 's/^max_iterations:[[:space:]]*//p' "$PLAN" | head -1)
MAX=${MAX:-3}
if [[ -z "$VERIFY_CMD" ]]; then
  echo "ERROR: plan.md のフロントマターに verify: がありません" >&2
  exit 1
fi
echo "検証コマンド: $VERIFY_CMD"
echo "最大イテレーション: $MAX"

sonnet_prompt() {
  cat <<'EOF'
scripts/agent-loop/work/plan.md を読み、記載どおり忠実に実装せよ。

厳守事項:
- 計画に書かれていない調査・設計変更・スコープ拡大は禁止
- 手順どおり実装できない/前提が崩れている場合は、ファイルを変更せずに
  その理由を report に status: BLOCKED で書いて終了せよ
- CLAUDE.md と DESIGN.md の規約に準拠すること

完了したら scripts/agent-loop/work/report.md に次の形式で報告せよ:
---
status: SUCCESS | FAILED | BLOCKED
changed_files:
  - <変更したファイルのパス>
notes: <実装中に気づいたこと・計画との差異>
blocked_reason: <BLOCKED の場合のみ: 計画のどこが実行不能だったか>
---
EOF
}

feedback_prompt() {
  local iter=$1
  cat <<EOF
実装イテレーション $iter が失敗した。原因を再調査し、
scripts/agent-loop/work/plan.md を修正せよ。
検証コマンド(verify:)自体が不適切ならそれも直すこと。
plan.md は別セッションの Sonnet が追加調査なしで実装できる粒度を保つこと。

Sonnet の報告 (work/report.md):
$(cat "$REPORT" 2>/dev/null || echo "(report.md なし: Sonnet が報告を書かずに終了)")

検証ログ (末尾50行):
$(tail -50 "$WORK/verify.log" 2>/dev/null || echo "(検証ログなし)")
EOF
}

# ── メインループ ───────────────────────────────────────────────
for ((i = 1; i <= MAX; i++)); do
  echo ""
  echo "===== iteration $i / $MAX ====="

  # Phase 1: 実装 (Sonnet・毎回まっさらなコンテキスト)
  echo "== Phase 1: Sonnet が実装 =="
  rm -f "$REPORT"
  claude -p "$(sonnet_prompt)" --model sonnet \
    --allowedTools "Read,Glob,Grep,Edit,Write,Bash(node:*),Bash(ls:*),Bash(git status:*),Bash(git diff:*),Bash(git add:*),Bash(git commit:*)" \
    > "$WORK/sonnet.log" 2>&1
  echo "Sonnet 終了 (ログ: work/sonnet.log)"

  # Phase 2: 機械検証 (トークン消費ゼロ)
  echo "== Phase 2: 検証 =="
  VERIFY_OK=0
  if bash -c "$VERIFY_CMD" > "$WORK/verify.log" 2>&1; then
    VERIFY_OK=1
  fi
  REPORT_OK=0
  grep -q '^status:[[:space:]]*SUCCESS' "$REPORT" 2>/dev/null && REPORT_OK=1

  if [[ $VERIFY_OK -eq 1 && $REPORT_OK -eq 1 ]]; then
    jq --argjson i "$i" '.iteration = $i | .status = "success"' "$STATE" > "$STATE.tmp" && mv "$STATE.tmp" "$STATE"
    echo ""
    echo "✅ iteration $i で成功！人間の最終確認をどうぞ:"
    echo "   - 変更内容: git diff / git log"
    echo "   - Sonnet の報告: work/report.md"
    exit 0
  fi
  echo "❌ 失敗 (verify: $VERIFY_OK, report SUCCESS: $REPORT_OK)"

  # イテレーションの成果物をアーカイブ
  mkdir -p "$WORK/history/iter-$i"
  cp -f "$PLAN" "$REPORT" "$WORK/verify.log" "$WORK/sonnet.log" \
    "$WORK/history/iter-$i/" 2>/dev/null

  # 最終イテレーションなら差し戻しせず終了
  if (( i == MAX )); then
    break
  fi

  # Phase 3: Fable に差し戻し (調査セッションの記憶を保持)
  echo "== Phase 3: Fable が再調査して plan.md を修正 =="
  FABLE_ARGS=(--model fable --output-format json
    --allowedTools "Read,Glob,Grep,Write,Bash(git log:*),Bash(git diff:*),Bash(ls:*)")
  if [[ -n "$FABLE_ID" ]]; then
    RESULT=$(claude -p --resume "$FABLE_ID" "$(feedback_prompt "$i")" "${FABLE_ARGS[@]}")
  else
    # 対話セッションで plan.md を作った場合、初回差し戻しで調査セッションを新設
    RESULT=$(claude -p "$(feedback_prompt "$i")" "${FABLE_ARGS[@]}")
  fi
  NEW_ID=$(echo "$RESULT" | jq -r '.session_id // empty')
  [[ -n "$NEW_ID" ]] && FABLE_ID=$NEW_ID
  jq --arg id "$FABLE_ID" --argjson i "$i" \
    '.fable_session_id = $id | .iteration = $i | .status = "retrying"' \
    "$STATE" > "$STATE.tmp" && mv "$STATE.tmp" "$STATE"
done

echo ""
echo "❌ ${MAX}回のイテレーションすべて失敗。人間の判断が必要です:"
echo "   - 各回の記録: work/history/iter-*/"
echo "   - 最新の計画: work/plan.md"
exit 1
