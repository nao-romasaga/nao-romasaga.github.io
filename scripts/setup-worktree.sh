#!/bin/bash
# git worktree 作成後に流す: テスト・dev サーバーが本体と同じに動く状態にする。
# 何度流してもよい（既にあるものは飛ばす）。使い方: worktree の中で `scripts/setup-worktree.sh`
set -eu
W=$(git rev-parse --show-toplevel)
M=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
[ "$W" = "$M" ] && { echo "ここは本体チェックアウトなので何もしない"; exit 0; }

mk() { # mk <リンク先> <パス>
  [ -e "$2" ] || [ -L "$2" ] && { echo "skip  $2"; return; }
  ln -s "$1" "$2"; echo "link  $2"
}

mk "$M/app/node_modules" "$W/app/node_modules"
# public/css・js・img は本体と同じ相対リンク（無いと dev サーバーで CSS が JSON 扱いになる）。実体は git 管理下の css/ js/
mk ../../css "$W/app/public/css"
mk ../../js "$W/app/public/js"
mkdir -p "$W/app/public/.empty-img"
mk .empty-img "$W/app/public/img"
# .nuxt が無いとテストが止まる
[ -d "$W/app/.nuxt" ] && echo "skip  app/.nuxt" || (cd "$W/app" && ./node_modules/.bin/nuxi prepare)

echo
echo "エンジンを同期するとき（BE の worktree から）:"
echo "  cd app && BATTLE_ENGINE_SRC=<BE の worktree>/packages/battle-engine/src npm run sync:battle-engine"
