var _0x509c=['change','#skill\x20option:selected','text','indexOf','通常攻撃','#skill_rank','#type','#type\x20option:selected','remove','#jinkei\x20>\x20option','inArray','tsuchi','hikari','yami','.param_label_teki','.jinkei_label','log','mizu','kaze','#param_label','jinkei','器用さ','tai','show','#resist','val','#resistDamage','.damage','.culcList','#vit','zan','netsu','rei','#taisei_','#tokkouCheck','prop','#kuzureCheck','#ryudenCheck','checked','#ability_list1','#ability_list2','#ability_list3','#ability_list4','#holystone','#ability','#wepon','#skill_val','#master','#masterDamage','round','removeClass','bg-warning','addClass','text-white','bg-success','#jinkei','#strOnlyChar','陣形:\x20','push','#str','#agi','器用さ+','腕力+','map','素早さ+','\x20素早さ+','武器威力+','#agiOnlyChar','#jinkei_s_v','#jinkei_k_v','table#damageRangeTable\x20tbody\x20*','<td\x20class=\x22small\x20opacity\x20col-xs-1\x22\x20>','</td>','length','<th\x20class=\x22table-primary\x20col-xs-1\x22>平均</th>','table#damageRangeTable\x20tbody','<td\x20class=\x22opacity\x20col-xs-1\x22\x20colspan=5>','</tr>','<tr>','<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数1〜5</th>','</tr>\x0a','sort','#jinkei\x20:selected','opacity-even','opacity-odd','\x20bg-primary\x20text-white','<td\x20class=\x22small\x20','\x20\x22\x20>','table#damageRankTable\x20tbody','#jinkei_w_v','hs2','dr1','hw1','ms1','hw2','dr2','hjs','as3','rj3','ds3','hjc','sp2','sp3','pl1','pl2','ms2','as1','as2','ds1','rj1','rj2','yumi','sken','forEach','Name','\x20BP:','ConsumeBp','PowerGrade','#taijyutsu','hide','#jinkei_w','#jinkei_k','#jinkei_s','.charOnly','quest','name','\x20体:','vit','\x20精:','mnd','<option>','#enemy_vit','append','Skill','BattleType','SkillIryoku','通常攻撃(','skill','database','goOffline','#skill'];(function(_0x404503,_0x40dba2){var _0x4fffc2=function(_0x18c61b){while(--_0x18c61b){_0x404503['push'](_0x404503['shift']());}};_0x4fffc2(++_0x40dba2);}(_0x509c,0xfc));var _0x1a13=function(_0x2bc17e,_0x2070ea){_0x2bc17e=_0x2bc17e-0x0;var _0x4bc4fc=_0x509c[_0x2bc17e];return _0x4bc4fc;};let SKILL_MASTER;let SKILL_LIST={'剣':[],'大剣':[],'斧':[],'小剣':[],'槍':[],'弓':[],'棍棒':[],'体術':[],'銃':[],'火術':[],'水術':[],'風術':[],'土術':[],'光術':[],'闇術':[]};let DEX_LIST=[_0x1a13('0x0'),_0x1a13('0x1'),'ju'];function createSkillOption(_0x5e32ab){var _0x5b5af2={};_0x5e32ab[_0x1a13('0x2')](function(_0x3ae28f){let _0x1d01ea=_0x3ae28f['SkillIryoku'];if(_0x1d01ea!=='-'&&_0x1d01ea>0x0){_0x5b5af2[_0x3ae28f[_0x1a13('0x3')]+_0x1a13('0x4')+_0x3ae28f[_0x1a13('0x5')]+'\x20威力['+_0x3ae28f[_0x1a13('0x6')]+']:'+_0x1d01ea]=_0x3ae28f['Id'];}});return _0x5b5af2;}$(function(){$(_0x1a13('0x7'))[_0x1a13('0x8')]();$('.vitCulc')[_0x1a13('0x8')]();$(_0x1a13('0x9'))[_0x1a13('0x8')]();$(_0x1a13('0xa'))[_0x1a13('0x8')]();$(_0x1a13('0xb'))[_0x1a13('0x8')]();$(_0x1a13('0xc'))[_0x1a13('0x8')]();for(let _0x8d6299 in ENEMY_DATA){let _0x1bab5f=ENEMY_DATA[_0x8d6299];let _0x31af53=_0x1bab5f[_0x1a13('0xd')]+'\x20'+_0x1bab5f[_0x1a13('0xe')]+_0x1a13('0xf')+_0x1bab5f[_0x1a13('0x10')]+_0x1a13('0x11')+_0x1bab5f[_0x1a13('0x12')];$option=$(_0x1a13('0x13'),{'value':_0x8d6299,'text':_0x31af53});$(_0x1a13('0x14'))[_0x1a13('0x15')]($option);}readFile(_0x1a13('0x16'),function(_0x38a9a1){SKILL_MASTER=_0x38a9a1;for(let _0x768420 in _0x38a9a1){let _0x5c9f61=_0x38a9a1[_0x768420];SKILL_LIST[_0x5c9f61[_0x1a13('0x17')]]['push'](_0x5c9f61);}let _0x51c023=0x0;for(let _0x2b3efa in SKILL_LIST){SKILL_LIST[_0x2b3efa]['sort'](function(_0xce722b,_0x329fd2){if(_0xce722b[_0x1a13('0x18')]==='-'||_0x329fd2[_0x1a13('0x18')]==='-'||_0xce722b[_0x1a13('0x18')]>_0x329fd2[_0x1a13('0x18')]){return-0x1;}else if(_0xce722b[_0x1a13('0x18')]<_0x329fd2[_0x1a13('0x18')]||_0xce722b[_0x1a13('0x5')]>_0x329fd2[_0x1a13('0x5')]){return 0x1;}else{return-0x1;}});SKILL_LIST[_0x2b3efa]['unshift']({'Id':'ID'+_0x51c023++,'ConsumeBp':0x0,'Name':_0x1a13('0x19')+_0x2b3efa+')','PowerGrade':'E','SkillIryoku':0x7,'SkillType':'技'});}addOption(createSkillOption(SKILL_LIST['剣']),_0x1a13('0x1a'));setDefaultSkillIryoku();if(ENEMY_DATA!==undefined&&SKILL_MASTER!==undefined){firebase[_0x1a13('0x1b')]()[_0x1a13('0x1c')]();firebase[_0x1a13('0x1b')](appUsers)[_0x1a13('0x1c')]();}});$(_0x1a13('0x1d'))[_0x1a13('0x1e')](function(){setDefaultSkillIryoku();let _0x2615f9=$(_0x1a13('0x1f'))[_0x1a13('0x20')]();if(_0x2615f9[_0x1a13('0x21')](_0x1a13('0x22'))!==-0x1){$(_0x1a13('0x23'))['val'](0x1);}else{}});$(_0x1a13('0x24'))[_0x1a13('0x1e')](function(){type=$('#type')['val']();type_tx=$(_0x1a13('0x25'))[_0x1a13('0x20')]();$('#skill')['children']()[_0x1a13('0x26')]();addOption(createSkillOption(SKILL_LIST[type_tx]),_0x1a13('0x1a'));setDefaultSkillIryoku();$(_0x1a13('0x27'))[_0x1a13('0x26')]();if($[_0x1a13('0x28')](type,['hi','mizu',_0x1a13('0x29'),'kaze',_0x1a13('0x2a'),_0x1a13('0x2b')])>-0x1){$(_0x1a13('0x2c'))[_0x1a13('0x20')]('精神');$(_0x1a13('0x2d'))[_0x1a13('0x20')]('知');}else{$('.param_label_teki')[_0x1a13('0x20')]('体力');$(_0x1a13('0x2d'))[_0x1a13('0x20')]('腕');}console[_0x1a13('0x2e')](type);if($[_0x1a13('0x28')](type,['hi',_0x1a13('0x2f'),_0x1a13('0x29'),_0x1a13('0x30'),'hikari',_0x1a13('0x2b')])>-0x1){$(_0x1a13('0x31'))[_0x1a13('0x20')]('知力');$(_0x1a13('0x7'))[_0x1a13('0x8')]();addOption(jJinkei,_0x1a13('0x32'));}else if($[_0x1a13('0x28')](type,DEX_LIST)>-0x1){$(_0x1a13('0x31'))[_0x1a13('0x20')](_0x1a13('0x33'));$(_0x1a13('0x7'))[_0x1a13('0x8')]();addOption(kJinkei,_0x1a13('0x32'));}else if(type===_0x1a13('0x34')){$(_0x1a13('0x31'))[_0x1a13('0x20')]('腕力');$(_0x1a13('0x7'))[_0x1a13('0x35')]();addOption(sJinkei,_0x1a13('0x32'));}else{$(_0x1a13('0x31'))[_0x1a13('0x20')]('腕力');$('#taijyutsu')[_0x1a13('0x8')]();addOption(wJinkei,_0x1a13('0x32'));}jinkeiHosei();});$('#jinkei')['change'](function(){jinkeiHosei();});$(_0x1a13('0x36'))[_0x1a13('0x1e')](function(){var _0x4a1c65=$(_0x1a13('0x36'))[_0x1a13('0x37')]();$(_0x1a13('0x38'))[_0x1a13('0x37')](Math['round'](0x1/(0x1+0.008*_0x4a1c65)*0x64*0x64)/0x64);});$(_0x1a13('0x39'))[_0x1a13('0x1e')](function(){culc();});$(_0x1a13('0x3a'))[_0x1a13('0x1e')](function(){culc();});$('#enemy_vit')[_0x1a13('0x1e')](function(){let _0x20c320=$(_0x1a13('0x14'))[_0x1a13('0x37')]();if(_0x20c320==='x'){return;}let _0x35e846=ENEMY_DATA[_0x20c320];type=$(_0x1a13('0x24'))[_0x1a13('0x37')]();if($[_0x1a13('0x28')](type,['hi',_0x1a13('0x2f'),_0x1a13('0x29'),_0x1a13('0x30'),_0x1a13('0x2a'),_0x1a13('0x2b')])>-0x1){$(_0x1a13('0x3b'))[_0x1a13('0x37')](_0x35e846[_0x1a13('0x12')]);}else{$(_0x1a13('0x3b'))[_0x1a13('0x37')](_0x35e846[_0x1a13('0x10')]);}for(let _0x3b5fc5 of[_0x1a13('0x3c'),'da','totsu',_0x1a13('0x3d'),_0x1a13('0x3e'),'rai','in','you']){setTaisei($(_0x1a13('0x3f')+_0x3b5fc5),_0x35e846[_0x3b5fc5]);}culc();});$('.culcCheck')['click'](function(){culc();});});function setDefaultSkillIryoku(){let _0x25dca7=$(_0x1a13('0x1f'))[_0x1a13('0x37')]();let _0x5c1ca6=SKILL_MASTER[_0x25dca7];let _0x3c8723=_0x5c1ca6===undefined?0x7:_0x5c1ca6[_0x1a13('0x18')];$('#skill_val')[_0x1a13('0x37')](_0x3c8723);}function culc(){let _0x2fc72a=$(_0x1a13('0x40'))[_0x1a13('0x41')]('checked');let _0x325b76=$(_0x1a13('0x42'))['prop']('checked');let _0x4349a0=$(_0x1a13('0x43'))[_0x1a13('0x41')](_0x1a13('0x44'));let _0x3444ee=Number($(_0x1a13('0x45'))[_0x1a13('0x37')]());let _0x67327=Number($(_0x1a13('0x46'))[_0x1a13('0x37')]());let _0x4fe55a=Number($(_0x1a13('0x47'))['val']());let _0x4fd702=Number($(_0x1a13('0x48'))[_0x1a13('0x37')]());let _0x334da0=Number($(_0x1a13('0x49'))[_0x1a13('0x37')]());let _0x10e770=_0x3444ee+_0x67327+_0x4fe55a+_0x4fd702+_0x334da0;if(_0x2fc72a){_0x10e770+=0x14;}if(_0x325b76){_0x10e770+=0xf;}if(_0x4349a0){_0x10e770+=0xa;}$(_0x1a13('0x4a'))[_0x1a13('0x37')](_0x10e770);var _0xb939fb=Number($(_0x1a13('0x4b'))[_0x1a13('0x37')]());var _0x5670a9=Number($('#ability')['val']());var _0x46ad39=Number($(_0x1a13('0x36'))[_0x1a13('0x37')]());var _0xb05ac=Number($(_0x1a13('0x4c'))[_0x1a13('0x37')]());var _0x3df01e=Number($(_0x1a13('0x23'))[_0x1a13('0x37')]());var _0x1068e5=$(_0x1a13('0x24'))['val']();var _0x2baa8a=Number($(_0x1a13('0x3b'))[_0x1a13('0x37')]());var _0xfcfd00=masterLevel($(_0x1a13('0x4d'))['val']())*0x64;$(_0x1a13('0x4e'))[_0x1a13('0x37')](Math[_0x1a13('0x4f')](_0xfcfd00*0x64)/0x64);var _0x251d79=getStrAgi();var _0x570479=_0x251d79[0x0];var _0x31a9fd=_0x251d79[0x1];dRange=damageStepCulc(_0x1068e5,_0x570479,_0x31a9fd,_0xb939fb,_0xb05ac,_0x3df01e,_0x2baa8a,_0xfcfd00,_0x5670a9,_0x46ad39);dispDamageRange(dRange);}function damageColor(_0xcdb8bd,_0x1303a0,_0x4bfe7f,_0x2d8db9){if(_0xcdb8bd>0x0&&(_0xcdb8bd==_0x1303a0||_0xcdb8bd==_0x4bfe7f)){_0x2d8db9[_0x1a13('0x50')](_0x1a13('0x51'));_0x2d8db9[_0x1a13('0x52')]('bg-success');_0x2d8db9[_0x1a13('0x52')](_0x1a13('0x53'));}else if(_0xcdb8bd>0x0){_0x2d8db9[_0x1a13('0x52')]('bg-warning');_0x2d8db9['removeClass'](_0x1a13('0x54'));_0x2d8db9[_0x1a13('0x50')](_0x1a13('0x53'));}else{_0x2d8db9[_0x1a13('0x50')]('bg-warning');_0x2d8db9[_0x1a13('0x50')](_0x1a13('0x54'));_0x2d8db9[_0x1a13('0x50')]('text-white');}}function patternReCulc(){var _0x567339=Number($(_0x1a13('0x4b'))['val']());var _0x1461a0=Number($(_0x1a13('0x4a'))[_0x1a13('0x37')]())/0x64;var _0x49e851=Number($(_0x1a13('0x36'))[_0x1a13('0x37')]());var _0x53076e=Number($('#skill_val')[_0x1a13('0x37')]());var _0x896988=Number($(_0x1a13('0x23'))['val']());var _0x38a206=$(_0x1a13('0x24'))[_0x1a13('0x37')]();var _0x15d743=Number($(_0x1a13('0x3b'))[_0x1a13('0x37')]());var _0x116120=masterLevel($(_0x1a13('0x4d'))[_0x1a13('0x37')]());var _0x468385=[];var _0x3f4ec3=$(_0x1a13('0x55'))['val']();var _0x3e6361=$(_0x1a13('0x56'))[_0x1a13('0x37')]()!=0x0?getJinkei():{'フリーファイト':0x0};for(key in _0x3e6361){$(_0x1a13('0x55'))[_0x1a13('0x37')](_0x3e6361[key]);jinkeiHosei();var _0x136560=getStrAgi();var _0x12825b=_0x136560[0x0];var _0x439951=_0x136560[0x1];var _0x1b5852=damageStepCulc(_0x38a206,_0x12825b,_0x439951,_0x567339,_0x53076e,_0x896988,_0x15d743,_0x116120,_0x1461a0,_0x49e851);var _0x3aaa4a={'name':_0x1a13('0x57')+key,'d1':_0x1b5852[0x0],'d10':_0x1b5852[0x9],'avg':arrayAvg(_0x1b5852),'jinkei':_0x3e6361[key]};_0x468385[_0x1a13('0x58')](_0x3aaa4a);}$(_0x1a13('0x55'))[_0x1a13('0x37')](_0x3f4ec3);jinkeiHosei();var _0x9b237=Number($(_0x1a13('0x59'))[_0x1a13('0x37')]());var _0x1a1ea7=Number($(_0x1a13('0x5a'))[_0x1a13('0x37')]());var _0x5c0c43=_0x9b237;var _0x415a5a=_0x1a1ea7;var _0x41a61a='';if(_0x38a206!==_0x1a13('0x34')){var _0x41a61a=$[_0x1a13('0x28')](_0x38a206,DEX_LIST)>-0x1?_0x1a13('0x5b'):_0x1a13('0x5c');[...Array(0x3)][_0x1a13('0x5d')]((_0x4b8c49,_0x3a6fc6)=>{if($(_0x1a13('0x55'))[_0x1a13('0x37')]()!='0'){var _0x136560=getStrAgi();var _0x12825b=_0x136560[0x0];}var _0x259624=getFieldSTR(_0x12825b+_0x3a6fc6+0x1,_0x1a1ea7,v);var _0x5f205a=baseDamageCulc(_0x259624);var _0x1b5852=damageStepCulc(_0x38a206,_0x12825b,_0x439951,_0x567339,_0x53076e,_0x896988,_0x15d743,_0x116120,_0x1461a0,_0x49e851);var _0x3aaa4a={'name':_0x41a61a+(_0x3a6fc6+0x1),'d1':_0x5f205a};_0x468385[_0x1a13('0x58')](_0x3aaa4a);});}else{[...Array(0x3)][_0x1a13('0x5d')]((_0x7b68e1,_0x3a0bfa)=>{if($(_0x1a13('0x55'))[_0x1a13('0x37')]()!='0'){var _0x2ed1f8=getJinkeiStrAgi();_0x5c0c43=_0x2ed1f8[0x0];_0x415a5a=_0x2ed1f8[0x1];}var _0x4e6cb8=getFieldSTR(_0x5c0c43+_0x3a0bfa+0x1,_0x415a5a,v);var _0x4dd447=baseDamageCulc(_0x4e6cb8);var _0x3aaa4a={'name':_0x1a13('0x5c')+(_0x3a0bfa+0x1),'d1':_0x4dd447};_0x468385[_0x1a13('0x58')](_0x3aaa4a);_0x4e6cb8=getFieldSTR(_0x5c0c43,_0x415a5a+_0x3a0bfa+0x1,v);_0x4dd447=baseDamageCulc(_0x4e6cb8);_0x3aaa4a={'name':_0x1a13('0x5e')+(_0x3a0bfa+0x1),'d1':_0x4dd447};_0x468385[_0x1a13('0x58')](_0x3aaa4a);_0x4e6cb8=getFieldSTR(_0x5c0c43+_0x3a0bfa+0x1,_0x415a5a+_0x3a0bfa+0x1,v);_0x4dd447=baseDamageCulc(_0x4e6cb8);_0x3aaa4a={'name':_0x1a13('0x5c')+(_0x3a0bfa+0x1)+_0x1a13('0x5f')+(_0x3a0bfa+0x1),'d1':_0x4dd447};_0x468385[_0x1a13('0x58')](_0x3aaa4a);});}var _0x3ac1e8=Number($(_0x1a13('0x4b'))[_0x1a13('0x37')]());var _0x42d8db=wepK;[...Array(0x3)]['map']((_0xb41896,_0x7cc961)=>{if($(_0x1a13('0x55'))[_0x1a13('0x37')]()!='0'){var _0x5e797a=getJinkeiStrAgi();_0x5c0c43=_0x5e797a[0x0];_0x415a5a=_0x5e797a[0x1];}var _0x4c64b0=getFieldSTR(_0x5c0c43,_0x1a1ea7,v);if(_0x38a206==0x3){wepK=(_0x3ac1e8+0x9+_0x7cc961+0x1)/10.5;}else{wepK=(_0x3ac1e8+0x6+_0x7cc961+0x1)/0x7;}var _0x36c2f1=baseDamageCulc(_0x4c64b0);var _0x3aaa4a={'name':_0x1a13('0x60')+(_0x7cc961+0x1),'d1':_0x36c2f1};_0x468385[_0x1a13('0x58')](_0x3aaa4a);});wepK=_0x42d8db;dispDamageRank(_0x468385);}function getStrAgi(){var _0x208d71=Number($(_0x1a13('0x59'))[_0x1a13('0x37')]());var _0xb0baf9=Number($(_0x1a13('0x5a'))[_0x1a13('0x37')]());if($('#jinkei')[_0x1a13('0x37')]()!='0'){var _0x4ea4a5=Number($(_0x1a13('0x56'))['val']());var _0x6bd42b=Number($(_0x1a13('0x61'))[_0x1a13('0x37')]());var _0x2ad283=_0x208d71-_0x4ea4a5;var _0x38e2ed=_0xb0baf9-_0x6bd42b;var _0x1adf20=Number($('#jinkei_w_v')[_0x1a13('0x37')]());var _0x23b2e0=Number($(_0x1a13('0x62'))[_0x1a13('0x37')]());if($[_0x1a13('0x28')](type,DEX_LIST)>-0x1){_0x1adf20=Number($(_0x1a13('0x63'))['val']());}var _0x4e0d00=getJinkeiStrAgi(_0x4ea4a5,_0x1adf20,_0x6bd42b,_0x23b2e0);_0x208d71=_0x4e0d00[0x0]+_0x2ad283;_0xb0baf9=_0x4e0d00[0x1]+_0x38e2ed;}return[_0x208d71,_0xb0baf9];}function dispDamageRange(_0x259a08){$(_0x1a13('0x64'))[_0x1a13('0x26')]();var _0x194f24='';var _0x18d206='';var _0x309feb=0x0;for(i=0x0;i<0x5;i++){_0x194f24+=_0x1a13('0x65')+number_format(_0x259a08[i])+_0x1a13('0x66');_0x309feb+=_0x259a08[i];}for(i=0x5;i<_0x259a08[_0x1a13('0x67')];i++){_0x18d206+=_0x1a13('0x65')+number_format(_0x259a08[i])+_0x1a13('0x66');_0x309feb+=_0x259a08[i];}$('table#damageRangeTable\x20tbody')['append']('<tr>');$('table#damageRangeTable\x20tbody')[_0x1a13('0x15')](_0x1a13('0x68'));$(_0x1a13('0x69'))['append'](_0x1a13('0x6a')+number_format(Math[_0x1a13('0x4f')](_0x309feb/_0x259a08[_0x1a13('0x67')]))+_0x1a13('0x66'));$(_0x1a13('0x69'))[_0x1a13('0x15')](_0x1a13('0x6b'));$(_0x1a13('0x69'))['append'](_0x1a13('0x6c'));$(_0x1a13('0x69'))[_0x1a13('0x15')](_0x1a13('0x6d'));$(_0x1a13('0x69'))[_0x1a13('0x15')](_0x194f24);$('table#damageRangeTable\x20tbody')[_0x1a13('0x15')](_0x1a13('0x6e'));$(_0x1a13('0x69'))['append'](_0x1a13('0x6c'));$(_0x1a13('0x69'))[_0x1a13('0x15')]('<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数6〜10</th>');$(_0x1a13('0x69'))[_0x1a13('0x15')](_0x18d206);$('table#damageRangeTable\x20tbody')[_0x1a13('0x15')](_0x1a13('0x6e'));}function dispDamageRank(_0x4f07c7){_0x4f07c7[_0x1a13('0x6f')](function(_0x34e693,_0x4cfed3){if(_0x34e693['d1']>_0x4cfed3['d1'])return-0x1;if(_0x34e693['d1']<=_0x4cfed3['d1'])return 0x1;});var _0x3b5164=$(_0x1a13('0x70'))[_0x1a13('0x37')]();$('table#damageRankTable\x20tbody\x20*')[_0x1a13('0x26')]();_0x4f07c7['forEach'](function(_0x210638,_0x294813,_0x399252){var _0x5dccca=_0x294813%0x2==0x0?_0x1a13('0x71'):_0x1a13('0x72');if(_0x3b5164==_0x210638['jinkei']){_0x5dccca+=_0x1a13('0x73');}var _0x1b51be='';_0x1b51be+=_0x1a13('0x6c');_0x1b51be+=_0x1a13('0x74')+_0x5dccca+_0x1a13('0x75')+_0x210638[_0x1a13('0xe')]+_0x1a13('0x66');_0x1b51be+='<td\x20class=\x22small\x20'+_0x5dccca+_0x1a13('0x75')+Math[_0x1a13('0x4f')](_0x210638['d1']*1.045)+'</td>';_0x1b51be+=_0x1a13('0x74')+_0x5dccca+_0x1a13('0x75')+Math[_0x1a13('0x4f')](_0x210638['d1'])+_0x1a13('0x66');_0x1b51be+=_0x1a13('0x6e');$(_0x1a13('0x76'))[_0x1a13('0x15')](_0x1b51be);});}function Compare(_0xec5970,_0x3f4487){return arr[_0xec5970]-arr[_0x3f4487];}function jinkeiHosei(){var _0x22e7ca=$(_0x1a13('0x55'))['val']();$(_0x1a13('0x9'))['hide']();$('#jinkei_k')[_0x1a13('0x8')]();$(_0x1a13('0xb'))[_0x1a13('0x8')]();$(_0x1a13('0x77'))['val'](0x0);$(_0x1a13('0x63'))[_0x1a13('0x37')](0x0);$(_0x1a13('0x62'))[_0x1a13('0x37')](0x0);$(_0x1a13('0xc'))[_0x1a13('0x8')]();if(_0x22e7ca!='0'){$('.charOnly')['show']();}if(_0x22e7ca=='ic'){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$('#jinkei_s_v')['val'](-0x32);}if(_0x22e7ca=='hs1'){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$('#jinkei_s_v')['val'](0x19);}if(_0x22e7ca==_0x1a13('0x78')){$(_0x1a13('0xa'))[_0x1a13('0x35')]();$(_0x1a13('0x63'))['val'](0x32);$(_0x1a13('0xb'))['show']();$('#jinkei_s_v')['val'](-0x32);}if(_0x22e7ca==_0x1a13('0x79')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$('#jinkei_s_v')[_0x1a13('0x37')](0x19);$('#jinkei_k')[_0x1a13('0x35')]();$(_0x1a13('0x63'))[_0x1a13('0x37')](0x19);$(_0x1a13('0x9'))[_0x1a13('0x35')]();$('#jinkei_w_v')[_0x1a13('0x37')](0x19);}if(_0x22e7ca==_0x1a13('0x7a')||_0x22e7ca==_0x1a13('0x7b')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0xf);}if(_0x22e7ca==_0x1a13('0x7c')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](-0x19);$(_0x1a13('0xa'))[_0x1a13('0x35')]();$('#jinkei_k_v')[_0x1a13('0x37')](0x32);}if(_0x22e7ca==_0x1a13('0x7d')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](-0xa);}if($[_0x1a13('0x28')](_0x22e7ca,[_0x1a13('0x7e'),_0x1a13('0x7f'),_0x1a13('0x80'),_0x1a13('0x81')])>-0x1){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](-0x19);}if(_0x22e7ca==_0x1a13('0x82')){$(_0x1a13('0x9'))[_0x1a13('0x35')]();$(_0x1a13('0x77'))['val'](0x19);}if(_0x22e7ca=='sp1'){$(_0x1a13('0x9'))[_0x1a13('0x35')]();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x19);$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0x32);}if(_0x22e7ca==_0x1a13('0x83')){$('#jinkei_w')['show']();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x19);$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0x19);}if(_0x22e7ca==_0x1a13('0x84')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$('#jinkei_s_v')[_0x1a13('0x37')](-0x32);}if(_0x22e7ca==_0x1a13('0x85')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))['val'](0x19);}if(_0x22e7ca==_0x1a13('0x86')||_0x22e7ca==_0x1a13('0x87')){type=$(_0x1a13('0x24'))['val']();if($[_0x1a13('0x28')](type,['hi',_0x1a13('0x2f'),_0x1a13('0x29'),_0x1a13('0x30'),_0x1a13('0x2a'),_0x1a13('0x2b')])>-0x1){$(_0x1a13('0x9'))['show']();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x32);}$(_0x1a13('0xb'))[_0x1a13('0x35')]();$('#jinkei_s_v')[_0x1a13('0x37')](-0x32);}if(_0x22e7ca=='rs'){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0x32);}if(_0x22e7ca==_0x1a13('0x88')){$(_0x1a13('0x9'))['show']();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x32);}if(_0x22e7ca==_0x1a13('0x89')||_0x22e7ca==_0x1a13('0x8a')){$(_0x1a13('0x9'))[_0x1a13('0x35')]();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x19);}if(_0x22e7ca==_0x1a13('0x8b')){$(_0x1a13('0x9'))[_0x1a13('0x35')]();$(_0x1a13('0x77'))[_0x1a13('0x37')](0x19);$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0x19);}if(_0x22e7ca==_0x1a13('0x8c')){$(_0x1a13('0xb'))[_0x1a13('0x35')]();$(_0x1a13('0x62'))[_0x1a13('0x37')](0xa);}if(_0x22e7ca=='ds2'){$(_0x1a13('0x9'))['show']();if($[_0x1a13('0x28')](type,['hi','mizu','tsuchi',_0x1a13('0x30'),'hikari',_0x1a13('0x2b')])>-0x1){$(_0x1a13('0x77'))[_0x1a13('0x37')](-0x19);}else{$('#jinkei_w_v')[_0x1a13('0x37')](0x32);}}}
