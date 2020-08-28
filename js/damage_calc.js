var _0x2ed2 = ['masterPer', 'table#damageRangeTable\x20tbody\x20*', 'sken', '.ONOFF_BTN', '腕力+', '<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数1〜5</th>', '通常攻撃', 'click', '.param_label_teki', 'tsuchi', 'dp2', '<option>', 'sp2', '#ability', '#kuzureCheck', 'rj3', 'fa-toggle-off', 'dr1', 'dr2', '.DAMAGE', '#skill_rank', 'mizu', '#vit', 'PowerGrade', 'status', 'checked', '#jinkei\x20>\x20option', '#SAVE', 'statusCalc', 'STR', 'change', '.fas', '<tr>', 'append', 'quest', 'hide', '#agiOnlyChar', 'find', '\x20素早さ+', 'sort', 'hikari', 'rj1', 'toggleClass', 'data-id', 'DEX', 'master', 'tai', 'bg-success', 'hw1', 'Rarity', '<br>', 'INT', 'you', 'totsu', '#skill\x20option:selected', 'hasClass', 'data-type', '素早さ', 'jinkei', 'CharacterId', 'zan', '器用さ+', '#buffCheck', 'enemy', 'auth', '#jinkei_w', 'keys', '</td>', 'opacity-odd', '武器威力+', '.ENEMY_ST', 'uid', 'kaze', 'grade', 'as1', '#jinkei_s', 'hw2', 'database', 'map', 'forEach', '<td\x20class=\x22small\x20opacity\x20col-xs-1\x22\x20>', '<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数6〜10</th>', 'table#damageRankTable\x20tbody', 'Bonus', 'as2', 'show', 'SkillIryoku', 'undefined', 'styleId', 'slideUp', '#ability_list1', '#taijyutsu', '\x20/\x20速\x20', '通常攻撃(', '#jinkei_w_v', '.MLV', 'hs2', 'pl2', '#masterDamage', '#taisei_', '#weapon', '.RANK', 'MAX', '#skill_val', 'remove', '#skill', 'all', 'clone', '#HOLDERS_AREA', '\x20\x22\x20>', 'addClass', '#agi', '#resistDamage', 'damage', 'MASTER', '#ABILITY_AREA', '#jinkei_s_v', '.RESIST', 'tsue', 'ms2', 'skill', '#HOLDERS_AREA\x20.style', '.CLOSE_BTN', 'onAuthStateChanged', '.jinkei_label', 'ms1', '.GRADE', 'BattleType', '#master', '.WEAPON', '<td\x20class=\x22small\x20', '陣形:\x20', 'ds3', 'text-white', '.IRYOKU', '#jinkei_k_v', 'icon_btn_off', '.SKILL_NAME', 'floor', '\x20威力[', '<td\x20class=\x22opacity\x20col-xs-1\x22\x20colspan=5>', 'ds2', '#HISTORY_TEMPLATE', 'goOffline', 'dp4', 'Holders', 'inArray', '</tr>\x0a', '#str', 'bg-warning', 'text', '\x20体:', '\x20BP:', '#ability_other', '#enemy_vit', 'html', '#type\x20option:selected', 'yumi', 'as3', 'StyleAbility', '#ability_list4', '#type', 'sp3', 'resist', 'table#damageRangeTable\x20tbody', 'length', '</tr>', '\x20精:', 'unshift', 'push', '#jinkei_k', 'join', '.AB', 'dp1', 'removeClass', '\x20fa-toggle-on', '.ST', 'yami', 'opacity-even', '#jinkei', 'val', 'rank', 'parents', 'Per', '#ability_list2', 'MAXAGI', '器用さ', 'prop', '.MLV_PER', 'sp1', 'dp3', '#resist', '<th\x20class=\x22table-primary\x20col-xs-1\x22>平均</th>', 'rei', '#jinkei\x20:selected', 'Name', 'indexOf', 'name', 'ConsumeBp', 'round', '.ICON', '.vitCulc', 'children', '#param_label', 'mnd', '#strOnlyChar', 'weapon', 'd-none'];
(function(_0x206ce4, _0x2ed272) {
    var _0x530c1a = function(_0x325573) {
        while (--_0x325573) {
            _0x206ce4['push'](_0x206ce4['shift']());
        }
    };
    _0x530c1a(++_0x2ed272);
}(_0x2ed2, 0xec));
var _0x530c = function(_0x206ce4, _0x2ed272) {
    _0x206ce4 = _0x206ce4 - 0x0;
    var _0x530c1a = _0x2ed2[_0x206ce4];
    return _0x530c1a;
};
let SKILL_LIST = {
    '剣': [],
    '大剣': [],
    '斧': [],
    '小剣': [],
    '槍': [],
    '弓': [],
    '棍棒': [],
    '体術': [],
    '銃': [],
    '火術': [],
    '水術': [],
    '風術': [],
    '土術': [],
    '光術': [],
    '闇術': []
}
  , SKILL_MAP = {
    'ken': '剣',
    'dken': '大剣',
    'ono': '斧',
    'sken': '小剣',
    'yari': '槍',
    'yumi': '弓',
    'bou': '棍棒',
    'tai': '体術',
    'ju': '銃',
    'hi': '火術',
    'mizu': '水術',
    'kaze': 'kaze',
    'tsuchi': '土術',
    'hikari': '光術',
    'yami': '闇術'
}
  , DEX_LIST = ['yumi', 'sken', 'ju'];
var MY_MASTER_LV = {
    'ken': 0x1,
    'dken': 0x1,
    'ono': 0x1,
    'sken': 0x1,
    'yumi': 0x1,
    'yari': 0x1,
    'ju': 0x1,
    'kon': 0x1,
    'tai': 0x1,
    'tsue': 0x1
}
  , CALC_OPTION = {
    'styleId': '',
    'weapon': 0x0,
    'master': '',
    'masterPer': '',
    'ab': 0x0,
    'enemy': 0x0,
    'resist': 0x0,
    'damage': 0x0,
    'name': _0x530c('0xba'),
    'grade': 'E',
    'iryoku': 0x7,
    'rank': 0x1,
    'status': '',
    'statusCalc': ''
};
typeof firebase !== _0x530c('0x3b') && firebase[_0x530c('0x24')](appUsers)[_0x530c('0x5f')](_0x1aaccf=>{
    _0x1aaccf && (USER = _0x1aaccf,
    UID = _0x1aaccf[_0x530c('0x2b')],
    initial());
}
);
function createSkillOption(list) {
    var result = {};
    list.forEach(function (rows) {
        let iryoku = rows['SkillIryoku'];
        if (iryoku !== "-" && iryoku > 0) {
            // 0:種別、1:威力、2:Name、3:Grade、4:BP、5:覚醒
            result[rows['Name'] + " BP:" + rows['ConsumeBp'] + " 威力[" + rows['PowerGrade'] + "]:" + iryoku] = rows['Id'];
        }
    });
    console.log(result);
    return result;
}
async function initial() {
    let _0xf93a6c = readUserData(_0x530c('0x56'), function(_0x2bfb68) {
        _0x2bfb68 !== null && (MY_MASTER_LV = _0x2bfb68,
        $(_0x530c('0x64'))[_0x530c('0x98')](MY_MASTER_LV['ken']),
        setMasterDamageRate());
    });
    await Promise[_0x530c('0x4e')]([_0xf93a6c]),
    firebase[_0x530c('0x31')]()[_0x530c('0x73')](),
    firebase[_0x530c('0x31')](appUsers)['goOffline']();
}
$(function() {
    $(_0x530c('0x3f'))['hide'](),
    $(_0x530c('0xad'))[_0x530c('0x7')](),
    $(_0x530c('0x25'))['hide'](),
    $(_0x530c('0x8e'))[_0x530c('0x7')](),
    $(_0x530c('0x2f'))[_0x530c('0x7')]();
    for (let _0x656d32 in ENEMY_DATA) {
        let _0x134002 = ENEMY_DATA[_0x656d32]
          , _0x8db69e = _0x134002[_0x530c('0x6')] + '\x20' + _0x134002['name'] + _0x530c('0x7b') + _0x134002['vit'] + _0x530c('0x8b') + _0x134002['mnd'];
        $option = $(_0x530c('0xbf'), {
            'value': _0x656d32,
            'text': _0x8db69e
        }),
        $(_0x530c('0x7e'))[_0x530c('0x5')]($option);
    }
    for (let _0x2ebb13 in SKILL_MASTER) {
        let _0x3380ed = SKILL_MASTER[_0x2ebb13];
        if (_0x3380ed[_0x530c('0x63')] == '杖')
            continue;
        SKILL_LIST[_0x3380ed[_0x530c('0x63')]][_0x530c('0x8d')](_0x3380ed);
    }
    let _0x221943 = 0x0;
    for (let _0x2a23af in SKILL_LIST) {
        SKILL_LIST[_0x2a23af]['sort'](function(_0x262567, _0x2bd40c) {
            if (_0x262567[_0x530c('0x3a')] === '-' || _0x2bd40c[_0x530c('0x3a')] === '-' || _0x262567[_0x530c('0x3a')] > _0x2bd40c[_0x530c('0x3a')])
                return -0x1;
            else
                return _0x262567[_0x530c('0x3a')] < _0x2bd40c[_0x530c('0x3a')] || _0x262567[_0x530c('0xaa')] > _0x2bd40c[_0x530c('0xaa')] ? 0x1 : -0x1;
        }),
        SKILL_LIST[_0x2a23af][_0x530c('0x8c')]({
            'Id': 'ID' + _0x221943++,
            'ConsumeBp': 0x0,
            'Name': _0x530c('0x41') + _0x2a23af + ')',
            'PowerGrade': 'E',
            'SkillIryoku': 0x7,
            'SkillType': '技'
        });
    }
    addOption(createSkillOption(SKILL_LIST['剣']), _0x530c('0x5c')),
    setDefaultSkillIryoku(),
    $('#skill')[_0x530c('0x2')](function() {
        $(_0x530c('0x50'))[_0x530c('0x7f')](''),
        $(_0x530c('0x57'))['html'](''),
        setDefaultSkillIryoku();
        let _0x1cb849 = $(_0x530c('0x1a'))[_0x530c('0x7a')]();
        if (_0x1cb849[_0x530c('0xa8')](_0x530c('0xba')) !== -0x1)
            $(_0x530c('0xc8'))[_0x530c('0x98')](0x1),
            CALC_OPTION[_0x530c('0xa9')] = '通常攻撃',
            CALC_OPTION[_0x530c('0x2d')] = 'E',
            CALC_OPTION[_0x530c('0x99')] = 0x1;
        else {
            let _0x1cbe9e = $(_0x530c('0x1a'))[_0x530c('0x98')]()
              , _0x2e9272 = SKILL_MASTER[_0x1cbe9e];
            CALC_OPTION[_0x530c('0xa9')] = _0x2e9272[_0x530c('0xa7')],
            CALC_OPTION['grade'] = _0x2e9272[_0x530c('0xcb')];
            let _0x3e241d = [];
            for (key in _0x2e9272[_0x530c('0x75')]) {
                let _0x3cef93 = _0x2e9272[_0x530c('0x75')][key]
                  , _0x4da7ec = STYLE_MASTER[_0x3cef93]
                  , _0x1fb274 = CHAR_MASTER[_0x4da7ec['CharacterId']];
                for (styleIds of _0x1fb274[_0x530c('0x75')]) {
                    _0x3e241d[_0x530c('0x8d')](styleIds);
                }
            }
            _0x3e241d = _0x3e241d['filter'](function(_0x3ebfbe, _0x20d0ad, _0x2e860e) {
                return _0x2e860e[_0x530c('0xa8')](_0x3ebfbe) === _0x20d0ad;
            });
            for (styleId of _0x3e241d) {
                styleInfo = STYLE_MASTER[styleId];
                let _0x2d04ba = getStyleIcon(styleInfo['Rarity'], styleId, '', !![]);
                $('#HOLDERS_AREA')[_0x530c('0x5')](_0x2d04ba);
            }
        }
    }),
    $(document)['on'](_0x530c('0xbb'), _0x530c('0x5e'), function() {
        $(this)[_0x530c('0x9a')]('.bg-simple')[_0x530c('0x3d')](0x12c, function() {
            $(this)['remove']();
        });
    }),
    $(document)['on'](_0x530c('0xbb'), _0x530c('0x5d'), function() {
        type = $('#type')['val'](),
        target = _0x530c('0x1'),
        target2 = '腕力';
        if ($[_0x530c('0x76')](type, ['hi', _0x530c('0xc9'), 'tsuchi', 'kaze', _0x530c('0xc'), _0x530c('0x95')]) > -0x1)
            type = _0x530c('0x5a'),
            target = _0x530c('0x17'),
            target2 = '知力';
        else
            (type === 'ju' || type === 'sken' || type === _0x530c('0x81')) && (target = _0x530c('0x10'),
            target2 = '器用さ');
        styleId = $(this)['attr'](_0x530c('0xf')),
        CALC_OPTION['styleId'] = styleId,
        styleInfo = STYLE_MASTER[styleId],
        charInfo = CHAR_MASTER[styleInfo[_0x530c('0x1f')]];
        let _0x260e48 = culcStyleAddintional(styleInfo)
          , _0x4ec290 = charInfo[_0x530c('0x4a') + target] + LIMIT_BASE
          , _0x19ec5f = _0x260e48[target2][0x32][_0x530c('0x9b')]
          , _0x474fa2 = _0x260e48[target2][0x32][_0x530c('0x37')]
          , _0x458b35 = addBonus(_0x4ec290, _0x19ec5f, _0x474fa2);
        $(_0x530c('0xb1'))[_0x530c('0x98')](_0x4ec290),
        $('#str')['val'](_0x458b35);
        let _0xe330d = charInfo[_0x530c('0x9d')] + LIMIT_BASE
          , _0x17655f = addBonus(_0xe330d, _0x260e48['素早さ'][0x32][_0x530c('0x9b')], _0x260e48[_0x530c('0x1d')][0x32]['Bonus']);
        $('#agiOnlyChar')[_0x530c('0x98')](_0xe330d),
        $('#agi')[_0x530c('0x98')](_0x17655f);
        var _0x54bd02 = [];
        for (lv of Object[_0x530c('0x26')](styleInfo['StyleAbility'])) {
            _0x54bd02[_0x530c('0x8d')](styleInfo[_0x530c('0x83')][lv]);
        }
        $('#ABILITY_AREA')[_0x530c('0x7f')](_0x54bd02[_0x530c('0x8f')](_0x530c('0x16'))),
        initialCalc();
    }),
    $(_0x530c('0x64'))[_0x530c('0x2')](function() {
        type = $(_0x530c('0x85'))[_0x530c('0x98')](),
        $[_0x530c('0x76')](type, ['hi', _0x530c('0xc9'), _0x530c('0xbd'), _0x530c('0x2c'), _0x530c('0xc'), _0x530c('0x95')]) > -0x1 && (type = 'tsue'),
        MY_MASTER_LV[type] = $('#master')[_0x530c('0x98')](),
        setMasterDamageRate();
    }),
    $('#type').change(function () {
        type = $("#type").val();
        // 技リストを更新する
        type_tx = $('#type option:selected').text();
        $('#skill').children().remove();
        // addOption(createSkillOption(SKILL_LIST[type_tx]), "skill");
        addOption(createSkillOption(SKILL_LIST[SKILL_MAP[type]]), "skill");
        setDefaultSkillIryoku();

        // 影響のある陣形を入れ替える
        $('#jinkei > option').remove();
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            //console.log($(".param_label_teki"), 1, type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $(".param_label_teki").text("精神");
            $(".jinkei_label").text("知");
        } else {
            //console.log($(".param_label_teki"), 2, type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $(".param_label_teki").text("体力");
            $(".jinkei_label").text("腕");
        }
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            //console.log(type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $("#param_label").text("知力");
            $("#taijyutsu").hide();
            addOption(jJinkei, "jinkei");
        } else if ($.inArray(type, ["yumi", "sken"]) > 0) {
            $("#param_label").text("器用さ");
            $("#taijyutsu").hide();
            addOption(kJinkei, "jinkei");
        } else if (type === "tai") {
            $("#param_label").text("腕力");
            $("#taijyutsu").show();
            addOption(sJinkei, "jinkei");
        } else {
            $("#param_label").text("腕力");
            $("#taijyutsu").hide();
            addOption(wJinkei, "jinkei");
        }
        // 必要な陣形が変わるので対応
        jinkeiHosei();
    }),
    $(_0x530c('0x97'))[_0x530c('0x2')](function() {
        jinkeiHosei();
    }),
    $(_0x530c('0xa3'))[_0x530c('0x2')](function() {
        var _0x312577 = $(_0x530c('0xa3'))[_0x530c('0x98')]();
        $(_0x530c('0x54'))[_0x530c('0x98')](Math[_0x530c('0xab')](0x1 / (0x1 + 0.008 * _0x312577) * 0x64 * 0x64) / 0x64);
    }),
    $(_0x530c('0xcf'))['click'](function() {
        $history = $(_0x530c('0x72'))[_0x530c('0x4f')]()['removeAttr']('id')['removeClass'](_0x530c('0xb3')),
        styleId = CALC_OPTION[_0x530c('0x3c')];
        if (styleId != '') {
            styleInfo = STYLE_MASTER[styleId];
            let _0x1723f1 = getStyleIcon(styleInfo[_0x530c('0x15')], styleId, '', !![]);
            $history[_0x530c('0x9')](_0x530c('0xac'))['append'](_0x1723f1);
        }
        $history[_0x530c('0x9')](_0x530c('0x62'))[_0x530c('0x7a')](CALC_OPTION['grade']),
        $history['find'](_0x530c('0x65'))[_0x530c('0x7a')](CALC_OPTION[_0x530c('0xb2')]),
        $history[_0x530c('0x9')](_0x530c('0x43'))[_0x530c('0x7a')](CALC_OPTION[_0x530c('0x11')]),
        $history[_0x530c('0x9')](_0x530c('0xa0'))[_0x530c('0x7a')](CALC_OPTION[_0x530c('0xb4')]),
        $history[_0x530c('0x9')](_0x530c('0x90'))[_0x530c('0x7a')](CALC_OPTION['ab']),
        $history[_0x530c('0x9')](_0x530c('0x2a'))[_0x530c('0x7a')](CALC_OPTION['enemy']),
        $history[_0x530c('0x9')](_0x530c('0xc7'))[_0x530c('0x7a')](number_format(CALC_OPTION[_0x530c('0x55')])),
        $history[_0x530c('0x9')](_0x530c('0x94'))['text'](CALC_OPTION[_0x530c('0xcc')]),
        $history[_0x530c('0x9')](_0x530c('0x6d'))[_0x530c('0x7a')](CALC_OPTION[_0x530c('0xa9')]),
        $history[_0x530c('0x9')](_0x530c('0x6a'))[_0x530c('0x7a')](CALC_OPTION['iryoku']),
        $history['find'](_0x530c('0x49'))[_0x530c('0x7a')](CALC_OPTION[_0x530c('0x99')]),
        $history[_0x530c('0x9')]('.ST_CALC')['text'](CALC_OPTION[_0x530c('0x0')]),
        $history[_0x530c('0x9')](_0x530c('0x59'))['text'](CALC_OPTION[_0x530c('0x87')]),
        $('#HISTORY_AREA')[_0x530c('0x5')]($history);
    }),
    $('.damage')[_0x530c('0x2')](function() {
        initialCalc();
    }),
    $('.culcList')['change'](function() {
        initialCalc();
    }),
    $('#enemy_vit')[_0x530c('0x2')](function() {
        let _0x321dc6 = $(_0x530c('0x7e'))['val']();
        if (_0x321dc6 === 'x')
            return;
        let _0x1f0479 = ENEMY_DATA[_0x321dc6];
        type = $(_0x530c('0x85'))[_0x530c('0x98')]();
        $[_0x530c('0x76')](type, ['hi', _0x530c('0xc9'), _0x530c('0xbd'), _0x530c('0x2c'), 'hikari', 'yami']) > -0x1 ? $(_0x530c('0xca'))['val'](_0x1f0479[_0x530c('0xb0')]) : $(_0x530c('0xca'))[_0x530c('0x98')](_0x1f0479['vit']);
        for (let _0x228366 of [_0x530c('0x20'), 'da', _0x530c('0x19'), 'netsu', _0x530c('0xa5'), 'rai', 'in', _0x530c('0x18')]) {
            setTaisei($(_0x530c('0x47') + _0x228366), _0x1f0479[_0x228366]);
        }
        culc();
    }),
    $(_0x530c('0x22'))[_0x530c('0xbb')](function() {
        jinkeiHosei();
    });
});
function setDefaultSkillIryoku() {
    let _0x22f195 = $(_0x530c('0x1a'))[_0x530c('0x98')]()
      , _0x1ac8e3 = SKILL_MASTER[_0x22f195]
      , _0x3b9dcf = _0x1ac8e3 === undefined ? 0x7 : _0x1ac8e3[_0x530c('0x3a')];
    $(_0x530c('0x4b'))[_0x530c('0x98')](_0x3b9dcf);
}
var isTokkou = ![]
  , isGinka = ![]
  , isFuramenko = ![]
  , isRyuden = ![]
  , isBuff = ![];
$(document)['on']('click', _0x530c('0xb7'), function() {
    setCond($(this)['attr'](_0x530c('0x1c')), $(this)[_0x530c('0x1b')](_0x530c('0x6c'))),
    $(this)[_0x530c('0x9')](_0x530c('0x3'))[_0x530c('0xe')](_0x530c('0xc4'))[_0x530c('0xe')](_0x530c('0x93')),
    $(this)[_0x530c('0xe')](_0x530c('0x6c'))[_0x530c('0xe')]('icon_btn_on'),
    initialCalc();
});
function setCond(_0x11c97d, _0x13522c) {
    switch (_0x11c97d) {
    case 'tk':
        isTokkou = _0x13522c;
        break;
    case 'gi':
        isGinka = _0x13522c;
        break;
    case 'fu':
        isFuramenko = _0x13522c;
        break;
    case 'ry':
        isRyuden = _0x13522c;
        break;
    case 'bf':
        isBuff = _0x13522c;
        break;
    }
}
function initialCalc() {
    let _0x21d0c3 = Number($(_0x530c('0xb1'))[_0x530c('0x98')]())
      , _0x1d7cb5 = isBuff ? Math[_0x530c('0x6e')](_0x21d0c3 * 0.2) : 0x0
      , _0x77fdc5 = Number($(_0x530c('0x3e'))[_0x530c('0x98')]())
      , _0x3f28a1 = Number($(_0x530c('0x9c'))[_0x530c('0x98')]())
      , _0x44ccda = Number($('#ability_list3')['val']())
      , _0x243652 = Number($(_0x530c('0x84'))[_0x530c('0x98')]())
      , _0x3542e2 = Number($(_0x530c('0x7d'))[_0x530c('0x98')]())
      , _0x4907f9 = Number($('#holystone')['val']())
      , _0x371e00 = _0x77fdc5 + _0x3f28a1 + _0x44ccda + _0x243652 + _0x3542e2 + _0x4907f9;
    isTokkou && (_0x371e00 += 0x14);
    if (isFuramenko)
        _0x371e00 += 0x23,
        $(_0x530c('0xc2'))['removeAttr'](_0x530c('0xcd'));
    else
        isGinka && (_0x371e00 += 0xf);
    isRyuden && (_0x371e00 += 0xa);
    $(_0x530c('0xc1'))[_0x530c('0x98')](_0x371e00);
    var _0x327a5f = Number($(_0x530c('0x48'))['val']())
      , _0x350a20 = Number($(_0x530c('0xc1'))['val']())
      , _0xe06b5b = Number($(_0x530c('0xa3'))[_0x530c('0x98')]())
      , _0x5a4111 = Number($(_0x530c('0x4b'))[_0x530c('0x98')]())
      , _0x2fbcb1 = Number($(_0x530c('0xc8'))[_0x530c('0x98')]())
      , _0x51e26c = $(_0x530c('0x85'))['val']()
      , _0x3fbf86 = Number($(_0x530c('0xca'))[_0x530c('0x98')]())
      , _0x4f1d11 = masterLevel($('#master')[_0x530c('0x98')]()) * 0x64;
    setMasterDamageRate();
    var _0x37af9a = getStrAgi()
      , _0x130a8e = _0x37af9a[0x0];
    _0x130a8e += _0x1d7cb5;
    var _0x405733 = _0x37af9a[0x1]
      , _0x629a13 = Number($('#str')['val']())
      , _0x119df9 = Number($(_0x530c('0x53'))['val']());
    dRange = damageStepCulc(_0x51e26c, _0x130a8e, _0x405733, _0x327a5f, _0x5a4111, _0x2fbcb1, _0x3fbf86, _0x4f1d11, _0x350a20, _0xe06b5b),
    dispDamageRange(dRange);
    if (_0x51e26c === 'tai')
        st = '腕\x20' + _0x629a13 + _0x530c('0x40') + _0x119df9,
        stCalc = '腕\x20' + _0x130a8e + '\x20/\x20速\x20' + _0x405733;
    else {
        if (_0x51e26c === 'ju' || _0x51e26c === _0x530c('0xb6') || _0x51e26c === _0x530c('0x81'))
            st = '器\x20' + _0x629a13,
            stCalc = '器\x20' + _0x130a8e;
        else
            _0x51e26c === _0x530c('0x5a') ? (st = '知\x20' + _0x629a13,
            stCalc = '知\x20' + _0x130a8e) : (st = '腕\x20' + _0x629a13,
            stCalc = '腕\x20' + _0x130a8e);
    }
    CALC_OPTION[_0x530c('0xb2')] = _0x327a5f,
    CALC_OPTION[_0x530c('0x11')] = $(_0x530c('0x64'))[_0x530c('0x98')](),
    CALC_OPTION[_0x530c('0xb4')] = _0x4f1d11,
    CALC_OPTION['ab'] = _0x350a20,
    CALC_OPTION[_0x530c('0x23')] = _0x3fbf86,
    CALC_OPTION[_0x530c('0x87')] = _0xe06b5b,
    CALC_OPTION[_0x530c('0x55')] = dRange[0x5],
    CALC_OPTION['iryoku'] = _0x5a4111,
    CALC_OPTION[_0x530c('0x99')] = _0x2fbcb1,
    CALC_OPTION[_0x530c('0xcc')] = st,
    CALC_OPTION[_0x530c('0x0')] = stCalc;
}
function setMasterDamageRate() {
    var _0x136d26 = masterLevel($(_0x530c('0x64'))[_0x530c('0x98')]()) * 0x64
      , _0x830b03 = Math[_0x530c('0xab')](_0x136d26 * 0x64) / 0x64;
    CALC_OPTION[_0x530c('0x11')] = $(_0x530c('0x64'))[_0x530c('0x98')](),
    CALC_OPTION[_0x530c('0xb4')] = _0x830b03,
    $(_0x530c('0x46'))[_0x530c('0x98')](_0x830b03);
}
function damageColor(_0x380520, _0x27a6f1, _0x4c01fb, _0x35b867) {
    if (_0x380520 > 0x0 && (_0x380520 == _0x27a6f1 || _0x380520 == _0x4c01fb))
        _0x35b867['removeClass'](_0x530c('0x79')),
        _0x35b867[_0x530c('0x52')]('bg-success'),
        _0x35b867[_0x530c('0x52')](_0x530c('0x69'));
    else
        _0x380520 > 0x0 ? (_0x35b867[_0x530c('0x52')]('bg-warning'),
        _0x35b867[_0x530c('0x92')]('bg-success'),
        _0x35b867['removeClass'](_0x530c('0x69'))) : (_0x35b867[_0x530c('0x92')](_0x530c('0x79')),
        _0x35b867['removeClass'](_0x530c('0x13')),
        _0x35b867[_0x530c('0x92')](_0x530c('0x69')));
}
function patternReCulc() {
    var _0x1b8599 = Number($('#weapon')[_0x530c('0x98')]())
      , _0x35bf8a = Number($('#ability')[_0x530c('0x98')]()) / 0x64
      , _0x5bb897 = Number($('#resist')['val']())
      , _0x3222a3 = Number($(_0x530c('0x4b'))['val']())
      , _0x59a9f5 = Number($(_0x530c('0xc8'))['val']())
      , _0x362a9e = $(_0x530c('0x85'))[_0x530c('0x98')]()
      , _0x1010c2 = Number($(_0x530c('0xca'))[_0x530c('0x98')]())
      , _0x314a65 = masterLevel($(_0x530c('0x64'))[_0x530c('0x98')]())
      , _0x1a9666 = []
      , _0x19b768 = $(_0x530c('0x97'))[_0x530c('0x98')]()
      , _0x17f47a = $(_0x530c('0xb1'))[_0x530c('0x98')]() != 0x0 ? getJinkei() : {
        'フリーファイト': 0x0
    };
    for (key in _0x17f47a) {
        $(_0x530c('0x97'))[_0x530c('0x98')](_0x17f47a[key]),
        jinkeiHosei();
        var _0x4a842e = getStrAgi()
          , _0x2f0c49 = _0x4a842e[0x0]
          , _0x1399d4 = _0x4a842e[0x1]
          , _0x31f341 = damageStepCulc(_0x362a9e, _0x2f0c49, _0x1399d4, _0x1b8599, _0x3222a3, _0x59a9f5, _0x1010c2, _0x314a65, _0x35bf8a, _0x5bb897)
          , _0x2de8a9 = {
            'name': _0x530c('0x67') + key,
            'd1': _0x31f341[0x0],
            'd10': _0x31f341[0x9],
            'avg': arrayAvg(_0x31f341),
            'jinkei': _0x17f47a[key]
        };
        _0x1a9666[_0x530c('0x8d')](_0x2de8a9);
    }
    $('#jinkei')['val'](_0x19b768),
    jinkeiHosei();
    var _0x308c1e = Number($(_0x530c('0x78'))[_0x530c('0x98')]())
      , _0x5093b4 = Number($(_0x530c('0x53'))['val']())
      , _0x3bf781 = _0x308c1e
      , _0x23ebd4 = _0x5093b4
      , _0x467661 = '';
    if (_0x362a9e !== _0x530c('0x12')) {
        var _0x467661 = $[_0x530c('0x76')](_0x362a9e, DEX_LIST) > -0x1 ? _0x530c('0x21') : _0x530c('0xb8');
        [...Array(0x3)][_0x530c('0x32')]((_0x4cab51,_0x49ac5c)=>{
            if ($(_0x530c('0x97'))[_0x530c('0x98')]() != '0')
                var _0x4793b4 = getStrAgi()
                  , _0x523d6c = _0x4793b4[0x0];
            var _0x4e122f = getFieldSTR(_0x523d6c + _0x49ac5c + 0x1, _0x5093b4, v)
              , _0x437bee = baseDamageCulc(_0x4e122f)
              , _0x38fcc4 = damageStepCulc(_0x362a9e, _0x523d6c, _0x1399d4, _0x1b8599, _0x3222a3, _0x59a9f5, _0x1010c2, _0x314a65, _0x35bf8a, _0x5bb897)
              , _0x59e816 = {
                'name': _0x467661 + (_0x49ac5c + 0x1),
                'd1': _0x437bee
            };
            _0x1a9666[_0x530c('0x8d')](_0x59e816);
        }
        );
    } else
        [...Array(0x3)][_0x530c('0x32')]((_0x357122,_0x572565)=>{
            if ($(_0x530c('0x97'))[_0x530c('0x98')]() != '0') {
                var _0x4fb370 = getJinkeiStrAgi();
                _0x3bf781 = _0x4fb370[0x0],
                _0x23ebd4 = _0x4fb370[0x1];
            }
            var _0x167b7c = getFieldSTR(_0x3bf781 + _0x572565 + 0x1, _0x23ebd4, v)
              , _0x169b1f = baseDamageCulc(_0x167b7c)
              , _0x3c0d16 = {
                'name': _0x530c('0xb8') + (_0x572565 + 0x1),
                'd1': _0x169b1f
            };
            _0x1a9666['push'](_0x3c0d16),
            _0x167b7c = getFieldSTR(_0x3bf781, _0x23ebd4 + _0x572565 + 0x1, v),
            _0x169b1f = baseDamageCulc(_0x167b7c),
            _0x3c0d16 = {
                'name': '素早さ+' + (_0x572565 + 0x1),
                'd1': _0x169b1f
            },
            _0x1a9666['push'](_0x3c0d16),
            _0x167b7c = getFieldSTR(_0x3bf781 + _0x572565 + 0x1, _0x23ebd4 + _0x572565 + 0x1, v),
            _0x169b1f = baseDamageCulc(_0x167b7c),
            _0x3c0d16 = {
                'name': '腕力+' + (_0x572565 + 0x1) + _0x530c('0xa') + (_0x572565 + 0x1),
                'd1': _0x169b1f
            },
            _0x1a9666[_0x530c('0x8d')](_0x3c0d16);
        }
        );
    var _0x2474f8 = Number($('#weapon')['val']())
      , _0x20ea89 = wepK;
    [...Array(0x3)][_0x530c('0x32')]((_0x1aa307,_0x347c9e)=>{
        if ($('#jinkei')[_0x530c('0x98')]() != '0') {
            var _0x3a5f77 = getJinkeiStrAgi();
            _0x3bf781 = _0x3a5f77[0x0],
            _0x23ebd4 = _0x3a5f77[0x1];
        }
        var _0x3c3c05 = getFieldSTR(_0x3bf781, _0x5093b4, v);
        _0x362a9e == 0x3 ? wepK = (_0x2474f8 + 0x9 + _0x347c9e + 0x1) / 10.5 : wepK = (_0x2474f8 + 0x6 + _0x347c9e + 0x1) / 0x7;
        var _0x592265 = baseDamageCulc(_0x3c3c05)
          , _0x23856a = {
            'name': _0x530c('0x29') + (_0x347c9e + 0x1),
            'd1': _0x592265
        };
        _0x1a9666['push'](_0x23856a);
    }
    ),
    wepK = _0x20ea89,
    dispDamageRank(_0x1a9666);
}
function getStrAgi() {
    var _0x3556c9 = Number($(_0x530c('0x78'))[_0x530c('0x98')]())
      , _0x5dd0a0 = Number($(_0x530c('0x53'))['val']());
    if ($(_0x530c('0x97'))['val']() != '0') {
        var _0x1327dc = Number($(_0x530c('0xb1'))[_0x530c('0x98')]())
          , _0x3c8fe7 = Number($(_0x530c('0x8'))[_0x530c('0x98')]())
          , _0x10097c = _0x3556c9 - _0x1327dc
          , _0xa65e19 = _0x5dd0a0 - _0x3c8fe7
          , _0x4114e6 = Number($(_0x530c('0x42'))[_0x530c('0x98')]())
          , _0x328c2a = Number($(_0x530c('0x58'))[_0x530c('0x98')]());
        $[_0x530c('0x76')](type, DEX_LIST) > -0x1 && (_0x4114e6 = Number($(_0x530c('0x6b'))['val']()));
        var _0x95ec39 = getJinkeiStrAgi(_0x1327dc, _0x4114e6, _0x3c8fe7, _0x328c2a);
        _0x3556c9 = _0x95ec39[0x0] + _0x10097c,
        _0x5dd0a0 = _0x95ec39[0x1] + _0xa65e19;
    }
    return [_0x3556c9, _0x5dd0a0];
}
function dispDamageRange(_0x1977ea) {
    $(_0x530c('0xb5'))[_0x530c('0x4c')]();
    var _0x33fdb5 = ''
      , _0x272426 = ''
      , _0x225015 = 0x0;
    for (i = 0x0; i < 0x5; i++) {
        _0x33fdb5 += _0x530c('0x34') + number_format(_0x1977ea[i]) + '</td>',
        _0x225015 += _0x1977ea[i];
    }
    for (i = 0x5; i < _0x1977ea[_0x530c('0x89')]; i++) {
        _0x272426 += _0x530c('0x34') + number_format(_0x1977ea[i]) + _0x530c('0x27'),
        _0x225015 += _0x1977ea[i];
    }
    $(_0x530c('0x88'))[_0x530c('0x5')](_0x530c('0x4')),
    $('table#damageRangeTable\x20tbody')[_0x530c('0x5')](_0x530c('0xa4')),
    $('table#damageRangeTable\x20tbody')[_0x530c('0x5')](_0x530c('0x70') + number_format(Math[_0x530c('0xab')](_0x225015 / _0x1977ea[_0x530c('0x89')])) + _0x530c('0x27')),
    $(_0x530c('0x88'))[_0x530c('0x5')](_0x530c('0x8a')),
    $('table#damageRangeTable\x20tbody')['append'](_0x530c('0x4')),
    $(_0x530c('0x88'))['append'](_0x530c('0xb9')),
    $('table#damageRangeTable\x20tbody')['append'](_0x33fdb5),
    $(_0x530c('0x88'))[_0x530c('0x5')]('</tr>\x0a'),
    $(_0x530c('0x88'))[_0x530c('0x5')](_0x530c('0x4')),
    $(_0x530c('0x88'))[_0x530c('0x5')](_0x530c('0x35')),
    $('table#damageRangeTable\x20tbody')[_0x530c('0x5')](_0x272426),
    $('table#damageRangeTable\x20tbody')['append'](_0x530c('0x77'));
}
function dispDamageRank(_0x43e4dc) {
    _0x43e4dc[_0x530c('0xb')](function(_0x50ede0, _0x4a0cb9) {
        if (_0x50ede0['d1'] > _0x4a0cb9['d1'])
            return -0x1;
        if (_0x50ede0['d1'] <= _0x4a0cb9['d1'])
            return 0x1;
    });
    var _0x5dbd5d = $(_0x530c('0xa6'))[_0x530c('0x98')]();
    $('table#damageRankTable\x20tbody\x20*')['remove'](),
    _0x43e4dc[_0x530c('0x33')](function(_0x152052, _0x15fb7b, _0x4806ef) {
        var _0x424046 = _0x15fb7b % 0x2 == 0x0 ? _0x530c('0x96') : _0x530c('0x28');
        _0x5dbd5d == _0x152052['jinkei'] && (_0x424046 += '\x20bg-primary\x20text-white');
        var _0x7af269 = '';
        _0x7af269 += _0x530c('0x4'),
        _0x7af269 += _0x530c('0x66') + _0x424046 + '\x20\x22\x20>' + _0x152052['name'] + _0x530c('0x27'),
        _0x7af269 += _0x530c('0x66') + _0x424046 + '\x20\x22\x20>' + Math[_0x530c('0xab')](_0x152052['d1'] * 1.045) + _0x530c('0x27'),
        _0x7af269 += _0x530c('0x66') + _0x424046 + _0x530c('0x51') + Math['round'](_0x152052['d1']) + _0x530c('0x27'),
        _0x7af269 += _0x530c('0x77'),
        $(_0x530c('0x36'))[_0x530c('0x5')](_0x7af269);
    });
}
function Compare(_0x15c247, _0xdf22d5) {
    return arr[_0x15c247] - arr[_0xdf22d5];
}
function jinkeiHosei() {
    var _0x2eac50 = $(_0x530c('0x97'))['val']();
    $(_0x530c('0x25'))[_0x530c('0x7')](),
    $(_0x530c('0x8e'))[_0x530c('0x7')](),
    $(_0x530c('0x2f'))[_0x530c('0x7')](),
    $(_0x530c('0x42'))[_0x530c('0x98')](0x0),
    $('#jinkei_k_v')[_0x530c('0x98')](0x0),
    $(_0x530c('0x58'))[_0x530c('0x98')](0x0);
    let _0x35f0ff = $(_0x530c('0x22'))[_0x530c('0x9f')](_0x530c('0xcd'));
    if (_0x2eac50 != '0' || _0x35f0ff) {}
    if ($[_0x530c('0x76')](_0x2eac50, [_0x530c('0xc5'), 'hjc', 'sp1', _0x530c('0xc0'), _0x530c('0x2e'), _0x530c('0x38'), 'ds1', _0x530c('0x71'), _0x530c('0xd'), _0x530c('0x91'), _0x530c('0xa2')]) > -0x1) {
        $('#jinkei_w')[_0x530c('0x39')]();
        var _0x2f8d62 = {
            'as1': 0x32,
            'ds2': 0x32,
            'dr1': 0x19,
            'hjc': 0x19,
            'sp1': 0x19,
            'sp2': 0x19,
            'as2': 0x19,
            'ds1': 0x19,
            'rj1': 0x19,
            'dp1': 0x19,
            'dp3': 0x19
        };
        $('#jinkei_w_v')[_0x530c('0x98')](_0x2f8d62[_0x2eac50]);
    }
    type = $(_0x530c('0x85'))[_0x530c('0x98')]();
    if ($['inArray'](type, ['hi', _0x530c('0xc9'), _0x530c('0xbd'), _0x530c('0x2c'), _0x530c('0xc'), _0x530c('0x95')]) > -0x1) {
        if ($[_0x530c('0x76')](_0x2eac50, [_0x530c('0x45'), _0x530c('0x5b'), _0x530c('0x71')]) > -0x1) {
            $('#jinkei_w')['show']();
            var _0x2f8d62 = {
                'pl2': 0x32,
                'ms2': 0x32,
                'ds2': -0x19
            };
            $(_0x530c('0x42'))[_0x530c('0x98')](_0x2f8d62[_0x2eac50]);
        }
    }
    if ($[_0x530c('0x76')](_0x2eac50, [_0x530c('0x44'), _0x530c('0xc5'), _0x530c('0x30'), _0x530c('0x91'), _0x530c('0xbe'), _0x530c('0xa2')]) > -0x1) {
        $(_0x530c('0x8e'))['show']();
        var _0x2f8d62 = {
            'hs2': 0x32,
            'hw2': 0x32,
            'dp2': 0x32,
            'dr1': 0x19,
            'dp1': 0x19,
            'dp3': 0x19
        };
        $(_0x530c('0x6b'))[_0x530c('0x98')](_0x2f8d62[_0x2eac50]);
    }
    if ($[_0x530c('0x76')](_0x2eac50, ['ic', 'hs1', _0x530c('0x44'), _0x530c('0xc5'), _0x530c('0x14'), _0x530c('0x61'), _0x530c('0x30'), _0x530c('0xc6'), 'hjs', _0x530c('0x82'), _0x530c('0xc3'), _0x530c('0x68'), _0x530c('0xa1'), 'sp2', _0x530c('0x86'), 'pl1', _0x530c('0x45'), _0x530c('0x5b'), 'rs', _0x530c('0xd'), 'rj2', 'rj3', _0x530c('0x91'), _0x530c('0x74')]) > -0x1) {
        $(_0x530c('0x2f'))[_0x530c('0x39')]();
        var _0x2f8d62 = {
            'ic': -0x32,
            'hs2': -0x32,
            'sp3': -0x32,
            'pl2': -0x32,
            'dp1': -0x32,
            'hw2': -0x19,
            'hjs': -0x19,
            'as3': -0x19,
            'rj3': -0x19,
            'ds3': -0x19,
            'ms2': -0x19,
            'dp4': -0x19,
            'dr2': -0xa,
            'rj3': -0xa,
            'sp1': 0x32,
            'rs': 0x32,
            'hs1': 0x19,
            'dr1': 0x19,
            'sp2': 0x19,
            'pl1': 0x19,
            'rj1': 0x19,
            'hw1': 0xf,
            'ms1': 0xf,
            'rj2': 0xa
        };
        $(_0x530c('0x58'))[_0x530c('0x98')](_0x2f8d62[_0x2eac50]);
    }
}
