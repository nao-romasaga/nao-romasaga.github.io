var _0x5b96=['culcDamage','rank','push','log','floor','StyleAbilityIds','ID29d93221','ID29d9322e','indexOf','ID29d93223','ID29d93230','ID29d93224','STR','orgDEX','DEX','orgAGI','AGI','INT','STRPer','Per','DEXPer','AGIPer','素早さ','INTPer','STRBonus','Bonus','DEXBonus','器用さ','AGIBonus','dex','agi','int','orgINT','INTBonus','ability','wepon','master','resist','SkillType','通常攻撃','BattleType','WeaponType','other','culcKey','culcValue','tai','腕/速','SkillIryoku'];(function(_0x3f7d8f,_0x4a4026){var _0x7dd331=function(_0x5817f5){while(--_0x5817f5){_0x3f7d8f['push'](_0x3f7d8f['shift']());}};_0x7dd331(++_0x4a4026);}(_0x5b96,0x1e2));var _0x147a=function(_0x40f17f,_0x53e585){_0x40f17f=_0x40f17f-0x0;var _0x3b3208=_0x5b96[_0x40f17f];return _0x3b3208;};function damageStepCulc(_0x23c354,_0x12beac,_0xe1d6,_0x1fa315,_0x2283bf,_0x113310,_0x6c5a16,_0xe2a818,_0x1403e4,_0x17ec22){var _0x55bccc=[];for(i=0x1;i<=0xa;i++){_0x55bccc[_0x147a('0x0')](damage(_0x23c354,_0x12beac,_0xe1d6,_0x1fa315,_0x2283bf,_0x113310,_0x6c5a16,_0xe2a818,_0x1403e4,_0x17ec22,i));}return _0x55bccc;}function damage(_0x152f2d,_0x200f66,_0x4c9a1f,_0x212202,_0x17d4ce,_0x3b8cae,_0x2314d1,_0xb829cf,_0x2db8c5,_0x4875a2,_0x1b256e){if(_0x152f2d==='tai'){damage1=_0x212202+_0x17d4ce+(_0x17d4ce-0x5)*(0x1+_0x3b8cae/0x64);damage2=0x2*_0x200f66+2.5*_0x4c9a1f>1.2*_0x2314d1?0x1+0x2*_0x200f66+2.5*_0x4c9a1f-1.2*_0x2314d1:0x1;}else if(_0x152f2d==='ju'){damage1=1.9*_0x212202+_0x17d4ce+(_0x17d4ce-0x5)*(0x1+_0x3b8cae/0x64);damage2=3.6*_0x200f66>1.25*_0x2314d1?0x1+3.6*_0x200f66-1.25*_0x2314d1:0x1;}else{damage1=1.5*_0x212202+_0x17d4ce+(_0x17d4ce-0x5)*(0x1+_0x3b8cae/0x64);damage2=0x4*_0x200f66>1.5*_0x2314d1?0x1+0x4*_0x200f66-1.5*_0x2314d1:0x1;}damage3=0x1/(0x1+0.008*_0x4875a2)*(0x1/0xa)*(0x1+(_0xb829cf+_0x2db8c5+_0x1b256e-0x6)/0x64);console[_0x147a('0x1')](damage1,damage2,damage3);return Math[_0x147a('0x2')](damage1*damage2*damage3);}function culcSkillDamageWithStyleBase(_0x175ce3,_0x27c0d5,_0x22f2a4){return culcSkillDamageWithStyle(_0x175ce3,0x2d,_0x27c0d5,0x32,_0x22f2a4,0x63,0x1c,5.5,0x55,0x0);}function culcSkillDamageWithStyle(_0x150767,_0x3016c0,_0x2a3ca1,_0x4de4f9,_0x37bde4,_0xa4bb25,_0xc07c64,_0x278648,_0xb234d2,_0x266b31){let _0x486070=0x0;for(let _0x514d71 in _0x2a3ca1[_0x147a('0x3')]){let _0x151db9=_0x2a3ca1[_0x147a('0x3')][_0x514d71];if([_0x147a('0x4'),_0x147a('0x5')][_0x147a('0x6')](_0x151db9)>-0x1){_0x486070+=0xf;}else if(['ID29d93222','ID29d9322f'][_0x147a('0x6')](_0x151db9)>-0x1){_0x486070+=0xa;}else if([_0x147a('0x7'),_0x147a('0x8')][_0x147a('0x6')](_0x151db9)>-0x1){_0x486070+=0x5;}else if(_0x151db9===_0x147a('0x9')){_0x486070+=0x2;}}let _0x25bafc={};let _0x36f606=culcStyleAddintional(_0x2a3ca1);_0x25bafc['orgSTR']=Number(_0x150767[_0x147a('0xa')])+_0x3016c0;_0x25bafc[_0x147a('0xb')]=Number(_0x150767[_0x147a('0xc')])+_0x3016c0;_0x25bafc[_0x147a('0xd')]=Number(_0x150767[_0x147a('0xe')])+_0x3016c0;_0x25bafc['orgINT']=Number(_0x150767[_0x147a('0xf')])+_0x3016c0;_0x25bafc[_0x147a('0x10')]=_0x36f606['腕力'][_0x4de4f9][_0x147a('0x11')];_0x25bafc[_0x147a('0x12')]=_0x36f606['器用さ'][_0x4de4f9][_0x147a('0x11')];_0x25bafc[_0x147a('0x13')]=_0x36f606[_0x147a('0x14')][_0x4de4f9]['Per'];_0x25bafc[_0x147a('0x15')]=_0x36f606['知力'][_0x4de4f9][_0x147a('0x11')];_0x25bafc[_0x147a('0x16')]=_0x36f606['腕力'][_0x4de4f9][_0x147a('0x17')];_0x25bafc[_0x147a('0x18')]=_0x36f606[_0x147a('0x19')][_0x4de4f9][_0x147a('0x17')];_0x25bafc[_0x147a('0x1a')]=_0x36f606[_0x147a('0x14')][_0x4de4f9][_0x147a('0x17')];_0x25bafc['INTBonus']=_0x36f606['知力'][_0x4de4f9][_0x147a('0x17')];_0x25bafc['str']=addBonus(_0x25bafc['orgSTR'],_0x25bafc[_0x147a('0x10')],_0x25bafc[_0x147a('0x16')]);_0x25bafc[_0x147a('0x1b')]=addBonus(_0x25bafc[_0x147a('0xb')],_0x25bafc[_0x147a('0x12')],_0x25bafc[_0x147a('0x18')]);_0x25bafc[_0x147a('0x1c')]=addBonus(_0x25bafc[_0x147a('0xd')],_0x25bafc['AGIPer'],_0x25bafc[_0x147a('0x1a')]);_0x25bafc[_0x147a('0x1d')]=addBonus(_0x25bafc[_0x147a('0x1e')],_0x25bafc[_0x147a('0x15')],_0x25bafc[_0x147a('0x1f')]);_0x25bafc[_0x147a('0x20')]=_0x486070;_0x25bafc[_0x147a('0x21')]=_0xc07c64;_0x25bafc[_0x147a('0x22')]=_0x278648;_0x25bafc['vit']=_0xb234d2;_0x25bafc[_0x147a('0x23')]=_0x266b31;_0x25bafc[_0x147a('0x24')]=_0x37bde4[_0x147a('0x24')];if(_0x37bde4['Name']===_0x147a('0x25')){_0xa4bb25=0x1;_0x37bde4[_0x147a('0x26')]=_0x2a3ca1[_0x147a('0x27')];}_0x25bafc['rank']=_0xa4bb25;_0x25bafc['BattleType']=_0x37bde4[_0x147a('0x26')];let _0x2d6981=_0x147a('0x28');let _0x17c7bc=_0x25bafc['str'];let _0x2587a1='腕';if(_0x37bde4[_0x147a('0x24')]==='術'){_0x17c7bc=_0x25bafc[_0x147a('0x1d')];_0x2587a1='知';}else if(['小剣','弓','銃'][_0x147a('0x6')](_0x37bde4[_0x147a('0x26')])>-0x1){_0x17c7bc=_0x25bafc[_0x147a('0x1b')];_0x2587a1='器';}_0x25bafc[_0x147a('0x29')]=_0x2587a1;_0x25bafc[_0x147a('0x2a')]=_0x17c7bc;if(_0x37bde4[_0x147a('0x26')]==='銃'){_0x2d6981='ju';}if(_0x37bde4['BattleType']==='体術'){_0x2d6981=_0x147a('0x2b');_0x25bafc[_0x147a('0x29')]=_0x147a('0x2c');_0x25bafc['culcValue']=_0x17c7bc+'/'+_0x25bafc[_0x147a('0x1c')];}if(_0x37bde4[_0x147a('0x2d')]>0x0){console[_0x147a('0x1')](_0x147a('0x2e'),_0x2d6981,_0x17c7bc,_0x25bafc[_0x147a('0x1c')],_0xc07c64,_0x37bde4[_0x147a('0x2d')],_0x25bafc[_0x147a('0x2f')],_0xb234d2,_0x278648,_0x486070,_0x266b31,0x6);_0x25bafc[_0x147a('0x2e')]=damage(_0x2d6981,_0x17c7bc,_0x25bafc[_0x147a('0x1c')],_0xc07c64,_0x37bde4[_0x147a('0x2d')],_0x25bafc[_0x147a('0x2f')],_0xb234d2,_0x278648,_0x486070,_0x266b31,0x6);}else{_0x25bafc[_0x147a('0x2e')]=0x0;}return _0x25bafc;}