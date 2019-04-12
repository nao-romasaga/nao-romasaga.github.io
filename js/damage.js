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
