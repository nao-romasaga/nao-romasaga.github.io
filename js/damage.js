var _0x285c=['orgINT','INTBonus','STRBonus','DEX','DEXBonus','ID29d9322f','str','orgSTR','Per','ID29d93391','ID29d933e8','orgAI','Name','素早さ','MIBonus','floor','#V_VAL','push','#KEI_VAL','DEXPer','ID29d93384','ID29d93380','StyleAbilityIds','STRPer','SkillType','AttackAttributes','4\x20*\x20(腕or器)\x20-\x201.5','\x20*\x20','ID29d9322e','text','WeaponType','tai','int','ID29d93225','vit','AGIBonus','#ST_VAL','\x20=\x20','ID29d93389','round','orgMI','ID29d9335d','dex','ID29d9322b','orgDEX','ID29d93224','ID29d93233','#ML_VAL','ability','\x20<span\x20style=\x22font-size:20px;\x20color:rgba(133,220,88);\x22>HP+','indexOf','</span>','器用さ','#SK_VAL','toFixed','culcKey','Bonus','MIPer','\x20魅:','#AB_VAL','#W_VAL','ID29d9339b','ID29d93223','#RNK_CONST','#RK_VAL','#D3','ID29d93399','resist','AIPer','<br>愛:','カウンター状態','orgAGI','ID29d93385','FlavorText','BattleType','#D1','SkillIryoku','ID29d93222','<span\x20style=\x22font-size:30px;\x20color:rgba(133,220,88);\x22>HP+','INT','3.6\x20×\x20器用さ\x20-\x201.25','(仮)','#RE_CONST','INTPer','#ST_CONST','#RE_VAL','2\x20×\x20腕力\x20+\x202.5\x20×\x20素早さ\x20-\x201.2','#D2','ID29d93234','ID29d93221','ID29d93235','rank','culcValue','AIBonus','culcDamage','#WP_CONST','\x20+\x20','other','agi','dispValue'];(function(_0x29e91e,_0x285c7c){var _0x3f97b8=function(_0x82c4e3){while(--_0x82c4e3){_0x29e91e['push'](_0x29e91e['shift']());}};_0x3f97b8(++_0x285c7c);}(_0x285c,0x114));var _0x3f97=function(_0x29e91e,_0x285c7c){_0x29e91e=_0x29e91e-0x0;var _0x3f97b8=_0x285c[_0x29e91e];return _0x3f97b8;};var MAX_WEAPON=0x20;var AVG_MASTERLV=0x9;var kaifukuSkill={'ID77c8104':0xf,'ID69925f8':0xf,'ID77c811c':0xf,'ID69618c7':0x19,'ID69c3326':0x19,'ID68ffe4f':0x5,'ID694921e':0xf,'ID69aacaf':0xf,'ID6918503':0xf,'ID69618df':0x19};function damageStepCulc(_0x8c64e2,_0x4eea43,_0x25179c,_0x13e5c2,_0x3c84da,_0x922e3d,_0x18c854,_0x1594bb,_0x250f99,_0x4d1625){var _0x4c1452=[];for(i=0x1;i<=0xa;i++){_0x4c1452[_0x3f97('0x29')](damage(_0x8c64e2,_0x4eea43,_0x25179c,_0x13e5c2,_0x3c84da,_0x922e3d,_0x18c854,_0x1594bb,_0x250f99,_0x4d1625,i));}return _0x4c1452;}function damage(_0x3f8873,_0x33a059,_0x22fbac,_0x42e2ae,_0x3fdfaa,_0x1f6611,_0x5130da,_0x2c0ff3,_0x57d82d,_0x216d33,_0x9e4707){_0x33a059=Number(_0x33a059);_0x22fbac=Number(_0x22fbac);_0x42e2ae=Number(_0x42e2ae);_0x3fdfaa=Number(_0x3fdfaa);_0x1f6611=Number(_0x1f6611);_0x5130da=Number(_0x5130da);_0x2c0ff3=Number(_0x2c0ff3);_0x57d82d=Number(_0x57d82d);_0x216d33=Number(_0x216d33);var _0x3ea712=(_0x3fdfaa-0x5)*(0x1+_0x1f6611/0x64);var _0x317145=1.5;if(_0x3f8873===_0x3f97('0x37')){$(_0x3f97('0x8'))['text'](_0x3f97('0xa'));_0x317145=0x1;damage1=_0x42e2ae+_0x3fdfaa+_0x3ea712;damage2=0x2*_0x33a059+2.5*_0x22fbac>1.2*_0x5130da?0x1+0x2*_0x33a059+2.5*_0x22fbac-1.2*_0x5130da:0x1;$(_0x3f97('0x54'))['text']((0x2*_0x33a059+2.5*_0x22fbac)['toFixed'](0x2));$('#V_VAL')[_0x3f97('0x35')]((1.2*_0x5130da)['toFixed'](0x2));}else if(_0x3f8873==='ju'){$(_0x3f97('0x8'))[_0x3f97('0x35')](_0x3f97('0x4'));_0x317145=1.9;damage1=1.9*_0x42e2ae+_0x3fdfaa+_0x3ea712;damage2=3.6*_0x33a059>1.25*_0x5130da?0x1+3.6*_0x33a059-1.25*_0x5130da:0x1;$('#W_VAL')[_0x3f97('0x35')]((3.6*_0x33a059)['toFixed'](0x2));$(_0x3f97('0x28'))[_0x3f97('0x35')]((1.25*_0x5130da)['toFixed'](0x2));}else{$(_0x3f97('0x8'))['text'](_0x3f97('0x32'));_0x317145=1.5;damage1=1.5*_0x42e2ae+_0x3fdfaa+_0x3ea712;damage2=0x4*_0x33a059>1.5*_0x5130da?0x1+0x4*_0x33a059-1.5*_0x5130da:0x1;$(_0x3f97('0x54'))[_0x3f97('0x35')]((0x4*_0x33a059)[_0x3f97('0x4e')](0x2));$('#V_VAL')['text']((1.5*_0x5130da)[_0x3f97('0x4e')](0x2));}$(_0x3f97('0x13'))[_0x3f97('0x35')](_0x317145);$('#WP_VAL')[_0x3f97('0x35')]((_0x317145*_0x42e2ae)['toFixed'](0x2));$(_0x3f97('0x3c'))[_0x3f97('0x35')](damage2);$(_0x3f97('0x4d'))[_0x3f97('0x35')](_0x3fdfaa+_0x3f97('0x14')+_0x3ea712[_0x3f97('0x4e')](0x2)+_0x3f97('0x3d')+(_0x3fdfaa+_0x3ea712)[_0x3f97('0x4e')](0x2));$(_0x3f97('0x58'))[_0x3f97('0x35')](_0x3fdfaa-0x5+_0x3f97('0x33')+(0x1+_0x1f6611/0x64)+_0x3f97('0x3d')+(_0x3fdfaa-0x5)*(0x1+_0x1f6611/0x64));$(_0x3f97('0x57'))['text'](0x64+_0x1f6611);damage3=0x1/(0x1+0.008*_0x216d33)*(0x1/0xa)*(0x1+(_0x2c0ff3+_0x57d82d+_0x9e4707-0x6)/0x64);$(_0x3f97('0x9'))[_0x3f97('0x35')](Math[_0x3f97('0x3f')](0x1/(0x1+0.008*_0x216d33)*0x2710)/0x64);$(_0x3f97('0x6'))[_0x3f97('0x35')](_0x216d33);$(_0x3f97('0x47'))[_0x3f97('0x35')](Math[_0x3f97('0x3f')](_0x2c0ff3*0xa)/0xa);$(_0x3f97('0x53'))[_0x3f97('0x35')](_0x57d82d);$(_0x3f97('0x2a'))[_0x3f97('0x35')](((0x1+(_0x2c0ff3+_0x57d82d)/0x64)*0x64)[_0x3f97('0x4e')](0x2));$(_0x3f97('0x63'))[_0x3f97('0x35')](damage1[_0x3f97('0x4e')](0x2));$(_0x3f97('0xb'))[_0x3f97('0x35')](damage2[_0x3f97('0x4e')](0x2));$(_0x3f97('0x59'))[_0x3f97('0x35')](damage3['toFixed'](0x2));return Math['floor'](damage1*damage2*damage3);}function culcSkillDamageWithStyleBase(_0xd83460,_0x3fb759,_0x1675b1){return culcSkillDamageWithStyle(_0xd83460,LIMIT_BASE,_0x3fb759,0x32,_0x1675b1,0x63,MAX_WEAPON,AVG_MASTERLV,0x55,0x0);}function culcSkillDamageWithStyle(_0x1e2bb8,_0x4e87f1,_0x2a0227,_0x42e533,_0x4c1c3c,_0x1ac18d,_0x78a916,_0x1187ec,_0xf0fcf2,_0x37cb9c){let _0x1268d0=0x0;let _0x35bce6=0x0;let _0x24a075={};let _0x25c37c=culcStyleAddintional(_0x2a0227);for(let _0x133ebf in _0x2a0227[_0x3f97('0x2e')]){let _0x3c34b5=_0x2a0227[_0x3f97('0x2e')][_0x133ebf];if([_0x3f97('0xd'),_0x3f97('0x34'),_0x3f97('0x41')][_0x3f97('0x4a')](_0x3c34b5)>-0x1){_0x1268d0+=0xf;}else if([_0x3f97('0x2d'),_0x3f97('0x60'),_0x3f97('0x2c')][_0x3f97('0x4a')](_0x3c34b5)>-0x1){_0x1268d0+=0x14;}else if([_0x3f97('0x1'),_0x3f97('0x1d'),'ID29d9338c',_0x3f97('0x55'),_0x3f97('0x39')][_0x3f97('0x4a')](_0x3c34b5)>-0x1){_0x1268d0+=0xa;}else if(_0x3c34b5==_0x3f97('0x3e')&&_0x4c1c3c[_0x3f97('0x31')][_0x3f97('0x4a')]('熱')>-0x1){_0x1268d0+=0xa;}else if(_0x3c34b5==_0x3f97('0x21')&&_0x4c1c3c[_0x3f97('0x31')][_0x3f97('0x4a')]('冷')>-0x1){_0x1268d0+=0xa;}else if(_0x3c34b5=='ID29d9339e'&&_0x4c1c3c[_0x3f97('0x31')][_0x3f97('0x4a')]('陰')>-0x1){_0x1268d0+=0xa;}else if(_0x3c34b5==_0x3f97('0x22')&&_0x4c1c3c['AttackAttributes'][_0x3f97('0x4a')]('雷')>-0x1){_0x1268d0+=0xa;}else if([_0x3f97('0x56'),'ID29d93230',_0x3f97('0x5a')][_0x3f97('0x4a')](_0x3c34b5)>-0x1){_0x1268d0+=0x5;}else if(_0x3c34b5===_0x3f97('0x45')){_0x1268d0+=0x2;}else if(_0x3c34b5===_0x3f97('0x43')&&_0x4c1c3c[_0x3f97('0x61')][_0x3f97('0x4a')](_0x3f97('0x5e'))>-0x1){_0x1268d0+=0x32;}else if(_0x3c34b5==='ID29d9322c'&&_0x4c1c3c['FlavorText'][_0x3f97('0x4a')](_0x3f97('0x5e'))>-0x1){_0x1268d0+=0x1e;}}let _0x25a840=0x0;_0x24a075[_0x3f97('0x23')]=Number(_0x1e2bb8['AI'])+_0x4e87f1;_0x24a075['orgMI']=Number(_0x1e2bb8['MI'])+_0x4e87f1;_0x24a075[_0x3f97('0x5c')]=_0x25c37c['愛'][_0x42e533][_0x3f97('0x20')];_0x24a075[_0x3f97('0x51')]=_0x25c37c['魅力'][_0x42e533][_0x3f97('0x20')];_0x24a075[_0x3f97('0x11')]=_0x25c37c['愛'][_0x42e533]['Bonus'];_0x24a075['MIBonus']=_0x25c37c['魅力'][_0x42e533][_0x3f97('0x50')];_0x24a075['ai']=addBonus(_0x24a075[_0x3f97('0x23')],_0x24a075[_0x3f97('0x5c')],_0x24a075[_0x3f97('0x11')]);_0x24a075['mi']=addBonus(_0x24a075[_0x3f97('0x40')],_0x24a075[_0x3f97('0x51')],_0x24a075[_0x3f97('0x26')]);var _0x137b83=![];if(kaifukuSkill[_0x4c1c3c['Id']]!==undefined){_0x25a840=kaifukuSkill[_0x4c1c3c['Id']];_0x137b83=!![];}else if(_0x4c1c3c[_0x3f97('0x61')][_0x3f97('0x4a')]('HPを回復する')>-0x1){_0x25a840=_0x4c1c3c[_0x3f97('0x0')];for(let _0x1fbce8 in _0x2a0227[_0x3f97('0x2e')]){let _0x69811a=_0x2a0227['StyleAbilityIds'][_0x1fbce8];if([_0x3f97('0x46')][_0x3f97('0x4a')](_0x69811a)>-0x1){_0x35bce6+=0xf;}else if([_0x3f97('0xc')][_0x3f97('0x4a')](_0x69811a)>-0x1){_0x35bce6+=0xa;}else if(_0x69811a===_0x3f97('0xe')){_0x35bce6+=0x5;}}_0x24a075['mi']=0x64;}_0x24a075[_0x3f97('0x1f')]=Number(_0x1e2bb8['STR'])+_0x4e87f1;_0x24a075['orgDEX']=Number(_0x1e2bb8[_0x3f97('0x1b')])+_0x4e87f1;_0x24a075[_0x3f97('0x5f')]=Number(_0x1e2bb8['AGI'])+_0x4e87f1;_0x24a075[_0x3f97('0x18')]=Number(_0x1e2bb8[_0x3f97('0x3')])+_0x4e87f1;_0x24a075[_0x3f97('0x2f')]=_0x25c37c['腕力'][_0x42e533][_0x3f97('0x20')];_0x24a075[_0x3f97('0x2b')]=_0x25c37c[_0x3f97('0x4c')][_0x42e533][_0x3f97('0x20')];_0x24a075['AGIPer']=_0x25c37c[_0x3f97('0x25')][_0x42e533]['Per'];_0x24a075[_0x3f97('0x7')]=_0x25c37c['知力'][_0x42e533][_0x3f97('0x20')];_0x24a075['STRBonus']=_0x25c37c['腕力'][_0x42e533][_0x3f97('0x50')];_0x24a075['DEXBonus']=_0x25c37c[_0x3f97('0x4c')][_0x42e533][_0x3f97('0x50')];_0x24a075[_0x3f97('0x3b')]=_0x25c37c['素早さ'][_0x42e533]['Bonus'];_0x24a075[_0x3f97('0x19')]=_0x25c37c['知力'][_0x42e533][_0x3f97('0x50')];_0x24a075[_0x3f97('0x1e')]=addBonus(_0x24a075['orgSTR'],_0x24a075[_0x3f97('0x2f')],_0x24a075[_0x3f97('0x1a')]);_0x24a075[_0x3f97('0x42')]=addBonus(_0x24a075[_0x3f97('0x44')],_0x24a075[_0x3f97('0x2b')],_0x24a075[_0x3f97('0x1c')]);_0x24a075['agi']=addBonus(_0x24a075[_0x3f97('0x5f')],_0x24a075['AGIPer'],_0x24a075[_0x3f97('0x3b')]);_0x24a075[_0x3f97('0x38')]=addBonus(_0x24a075['orgINT'],_0x24a075[_0x3f97('0x7')],_0x24a075[_0x3f97('0x19')]);_0x24a075[_0x3f97('0x48')]=_0x1268d0;_0x24a075['weapon']=_0x78a916;_0x24a075['master']=_0x1187ec;_0x24a075[_0x3f97('0x3a')]=_0xf0fcf2;_0x24a075[_0x3f97('0x5b')]=_0x37cb9c;_0x24a075[_0x3f97('0x30')]=_0x4c1c3c[_0x3f97('0x30')];if(_0x4c1c3c[_0x3f97('0x24')]==='通常攻撃'){_0x1ac18d=0x1;_0x4c1c3c[_0x3f97('0x62')]=_0x2a0227[_0x3f97('0x36')];}_0x24a075[_0x3f97('0xf')]=_0x1ac18d;_0x24a075[_0x3f97('0x62')]=_0x4c1c3c[_0x3f97('0x62')];let _0x30aecb=_0x3f97('0x15');let _0x1b229b=_0x24a075[_0x3f97('0x1e')];let _0x5d90c1=''+_0x24a075[_0x3f97('0x1e')];let _0x287f41='腕';if(_0x4c1c3c[_0x3f97('0x30')]==='術'){_0x1b229b=_0x24a075[_0x3f97('0x38')];_0x5d90c1=''+_0x24a075[_0x3f97('0x38')];_0x287f41='知';}else if(['小剣','弓','銃'][_0x3f97('0x4a')](_0x4c1c3c['BattleType'])>-0x1){_0x1b229b=_0x24a075['dex'];_0x5d90c1=''+_0x24a075[_0x3f97('0x42')];_0x287f41='器';}_0x24a075[_0x3f97('0x4f')]=_0x287f41;_0x24a075[_0x3f97('0x10')]=_0x1b229b;_0x24a075[_0x3f97('0x17')]=_0x287f41+':'+_0x5d90c1;if(_0x4c1c3c[_0x3f97('0x62')]==='銃'){_0x30aecb='ju';}if(_0x4c1c3c[_0x3f97('0x62')]==='体術'){_0x30aecb=_0x3f97('0x37');_0x24a075[_0x3f97('0x4f')]='腕/速';_0x24a075[_0x3f97('0x10')]=_0x1b229b+'/'+_0x24a075['agi'];_0x24a075[_0x3f97('0x17')]+='\x20速:'+_0x24a075[_0x3f97('0x16')];}if(_0x25a840>0x0){if(_0x137b83){_0x24a075[_0x3f97('0x17')]+=_0x3f97('0x5d')+_0x24a075['ai'];_0x24a075[_0x3f97('0x17')]+=_0x3f97('0x52')+_0x24a075['mi'];}else{_0x24a075[_0x3f97('0x17')]='愛:'+_0x24a075['ai'];_0x24a075[_0x3f97('0x17')]+='<br>魅:'+_0x24a075['mi']+_0x3f97('0x5');}}if(_0x4c1c3c[_0x3f97('0x0')]>0x0){_0x24a075[_0x3f97('0x12')]=damage(_0x30aecb,_0x1b229b,_0x24a075[_0x3f97('0x16')],_0x78a916,_0x4c1c3c[_0x3f97('0x0')],_0x24a075[_0x3f97('0xf')],_0xf0fcf2,_0x1187ec,_0x1268d0,_0x37cb9c,0x6);}else{_0x24a075[_0x3f97('0x12')]=0x0;}if(_0x25a840>0x0){if(_0x137b83){var _0x5607db=getHeal(_0x137b83,0x0,_0x25a840,0x0,_0x24a075['ai'],_0x24a075['mi'],_0x35bce6);_0x24a075[_0x3f97('0x12')]+=_0x3f97('0x49')+_0x5607db[0x5]+_0x3f97('0x4b');}else{var _0x5607db=getHeal(_0x137b83,_0x78a916,_0x25a840,_0x1ac18d,_0x24a075['ai'],_0x24a075['mi'],_0x35bce6);_0x24a075[_0x3f97('0x12')]=_0x3f97('0x2')+_0x5607db[0x5]+_0x3f97('0x4b');}}return _0x24a075;}function getHeal(_0x4eb0f1,_0x393d1e,_0x12a80b,_0x1a8047,_0x465c40,_0x9deb2b,_0x340ef7){var _0x200b48=[];if(_0x4eb0f1){for(var _0x550d19=0x1;_0x550d19<=0xa;_0x550d19++){var _0xae9eb5=Math[_0x3f97('0x27')]((0x46+_0x12a80b+(_0x12a80b-0x5)*1.01)*(_0x465c40+_0x9deb2b)*(0x1+(_0x340ef7+_0x550d19-0x6)/0x64)/0x3c);_0x200b48['push'](_0xae9eb5);}}else{for(var _0x550d19=0x1;_0x550d19<=0xa;_0x550d19++){var _0xae9eb5=Math[_0x3f97('0x27')]((0x46+1.5*_0x393d1e+_0x12a80b+(_0x12a80b-0x5)*(0x1+_0x1a8047/0x64))*(_0x465c40+_0x9deb2b)*(0x1+(_0x340ef7+_0x550d19-0x6)/0x64)/0x3c);_0x200b48[_0x3f97('0x29')](_0xae9eb5);}}return _0x200b48;}