function damageStepCulc(type, str, agi, wepon, skill, rank, vit, master, ability, resist) {
    var dRange = [];
    for (i = 1; i <= 10; i++) {
        dRange.push(damage(type, str, agi, wepon, skill, rank, vit, master, ability, resist, i));
    }
    return dRange;
}

function damage(type, str, agi, wepon, skill, rank, vit, master, ability, resist, n) {
    //console.log(type, str, agi, wepon, skill, rank, vit, master, ability, resist, n);
    if (type !== "tai") {
        d1 = 1.5 * wepon + skill + ((skill - 5) * (1 + rank / 100));
        d2 = (4 * str) > (1.5 * vit) ? (1 + 4 * str - 1.5 * vit) : 1;
    } else {
        d1 = wepon + skill + ((skill - 5) * (1 + rank / 100));
        d2 = (2 * str + 2.5 * agi) > (1.2 * vit) ? 1 + 2 * str + 2.5 * agi - 1.2 * vit : 1;
        //console.log(2*str, 2.5*agi, 1.2*vit);
    }
    d3 = (1 / (1 + 0.008 * resist)) * (1 / 10) * (1 + (master + ability + n - 6) / 100);
    //console.log(d1, d2, d3);
    return Math.floor(d1 * d2 * d3);
}


function culcSkillDamageWithStyleBase(charInfo, styleInfo, skillInfo) {
    return culcSkillDamageWithStyle(charInfo, 45, styleInfo, 50, skillInfo, 99, 28, 5.5, 85, 0);
}
function culcSkillDamageWithStyle(charInfo, stBonus, styleInfo, styleLevel, skillInfo, rank, wepon, master, vit, resist) {
    let ability = 0;
    //極小:2% 小:5% 中:10% 大:15% 特大:30% 極大:50%
    for (let key in styleInfo['StyleAbilityIds']) {
        let abilityId = styleInfo['StyleAbilityIds'][key];
        if (["ID29d93221", "ID29d9322e"].indexOf(abilityId) > -1) {
            ability += 15;
        } else if (["ID29d93222", "ID29d9322f"].indexOf(abilityId) > -1) {
            ability += 10;
        } else if (["ID29d93223", "ID29d93230"].indexOf(abilityId) > -1) {
            ability += 5;
        } else if (abilityId === "ID29d93224") {
            ability += 2;
        }
    }
    // culcStyleBonus依存
    let PARAM = {};
    let styleBonus = culcStyleAddintional(styleInfo);
    PARAM['orgSTR'] = Number(charInfo['STR']) + stBonus;
    PARAM['orgDEX'] = Number(charInfo['DEX']) + stBonus;
    PARAM['orgAGI'] = Number(charInfo['AGI']) + stBonus;
    PARAM['orgINT'] = Number(charInfo['INT']) + stBonus;
    PARAM['STRPer'] = styleBonus["腕力"][styleLevel]["Per"];
    PARAM['DEXPer'] = styleBonus["器用さ"][styleLevel]["Per"];
    PARAM['AGIPer'] = styleBonus["素早さ"][styleLevel]["Per"];
    PARAM['INTPer'] = styleBonus["知力"][styleLevel]["Per"];
    PARAM['STRBonus'] = styleBonus["腕力"][styleLevel]["Bonus"];
    PARAM['DEXBonus'] = styleBonus["器用さ"][styleLevel]["Bonus"];
    PARAM['AGIBonus'] = styleBonus["素早さ"][styleLevel]["Bonus"];
    PARAM['INTBonus'] = styleBonus["知力"][styleLevel]["Bonus"];
    PARAM['str'] = addBonus(PARAM['orgSTR'], PARAM['STRPer'], PARAM['STRBonus']);
    PARAM['dex'] = addBonus(PARAM['orgDEX'], PARAM['DEXPer'], PARAM['DEXBonus']);
    PARAM['agi'] = addBonus(PARAM['orgAGI'], PARAM['AGIPer'], PARAM['AGIBonus']);
    PARAM['int'] = addBonus(PARAM['orgINT'], PARAM['INTPer'], PARAM['INTBonus']);
    PARAM['ability'] = ability;
    PARAM['rank'] = rank;
    PARAM['wepon'] = wepon;
    PARAM['master'] = master;
    PARAM['vit'] = vit;
    PARAM['resist'] = resist;

    let type = 'other';
    let culcValue = PARAM['str'];
    let culcKey = "腕";
    if ((skillInfo['SkillType'] === "術")) {
        culcValue = PARAM['int'];
        culcKey = "知";
    } else if (skillInfo['BattleType'] === '小剣' || skillInfo['BattleType'] === '弓') {
        culcValue = PARAM['dex'];
        culcKey = "器";
    }
    PARAM['culcKey'] = culcKey;
    PARAM['culcValue'] = culcValue;
    if (skillInfo['BattleType'] === "体術") {
        type = 'tai';
        PARAM['culcKey'] = "腕/速";
        PARAM['culcValue'] = culcValue + "/" + PARAM['agi'];
    }

    PARAM['culcDamage'] = damage(type, culcValue, PARAM['agi'], wepon, skillInfo['SkillIryoku'], rank, vit, master, ability, resist, 6);
    return PARAM;
}

function addBonus(org, per, add) {
    return Number(org) + Math.floor(org * per / 100) + Number(add);
}
