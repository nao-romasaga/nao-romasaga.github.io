var _0x211b=['#skill_rank','ConsumeBp','<option>','click','#ability','.ONOFF_BTN','rei','skill','val','\x20fa-toggle-on','bg-warning','.charOnly','find','ds1','BattleType','#weapon','Name','onAuthStateChanged','#agi','dr1','ds3','\x20bg-primary\x20text-white','<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数6〜10</th>','#vit','.culcList','removeClass','rai','hide','#jinkei_s','器用さ+','#master','icon_btn_on','opacity-even','mizu','.vitCulc','checked','MASTER','push','hs2','sken','\x20体:','dp1','icon_btn_off','totsu','text','yumi','#ability_list4','pl1','\x20精:','auth','素早さ+','map','\x20威力[','#resist','sp1','#param_label','#jinkei_s_v','length','tsue','#masterDamage','vit','#type','器用さ','tsuchi','sort','#jinkei_w_v','floor','change','#jinkei_w','remove','#ability_list2','dp4','#jinkei_k','<th\x20class=\x22table-primary\x20small\x20col-xs-1\x22>乱数1〜5</th>','dp2','.param_label_teki','mnd','武器威力+','#kuzureCheck','dp3','#jinkei_k_v','#skill','prop','yami','hikari','ds2','#str','unshift','SkillIryoku','hjc','</td>','as1','toggleClass','uid','inArray','\x20\x22\x20>','#taijyutsu','you','rj2','#enemy_vit','ken','陣形:\x20','通常攻撃','zan','ms2','#holystone','#taisei_','sp3','sp2','round','append','#resistDamage','show','.damage','removeAttr','attr','addClass','netsu','#buffCheck','ms1','<td\x20class=\x22small\x20opacity\x20col-xs-1\x22\x20>','<th\x20class=\x22table-primary\x20col-xs-1\x22>平均</th>','腕力+','tai','table#damageRangeTable\x20tbody\x20*','<td\x20class=\x22small\x20','#jinkei\x20:selected','#ability_list3','#strOnlyChar','.jinkei_label','</tr>','bg-success','rj3','<td\x20class=\x22opacity\x20col-xs-1\x22\x20colspan=5>','<tr>','text-white','#jinkei\x20>\x20option','database','all','hs1','table#damageRangeTable\x20tbody','kaze','通常攻撃(','</tr>\x0a','as2','forEach','#jinkei','jinkei','undefined'];(function(_0x852cea,_0x211bb1){var _0x5878ff=function(_0xb71f61){while(--_0xb71f61){_0x852cea['push'](_0x852cea['shift']());}};_0x5878ff(++_0x211bb1);}(_0x211b,0x86));var _0x5878=function(_0x852cea,_0x211bb1){_0x852cea=_0x852cea-0x0;var _0x5878ff=_0x211b[_0x852cea];return _0x5878ff;};let SKILL_LIST={'剣':[],'大剣':[],'斧':[],'小剣':[],'槍':[],'弓':[],'棍棒':[],'体術':[],'銃':[],'火術':[],'水術':[],'風術':[],'土術':[],'光術':[],'闇術':[]};let DEX_LIST=[_0x5878('0x3c'),_0x5878('0x36'),'ju'];var MY_MASTER_LV={'ken':0x1,'dken':0x1,'ono':0x1,'sken':0x1,'yumi':0x1,'yari':0x1,'ju':0x1,'kon':0x1,'tai':0x1,'tsue':0x1};if(typeof firebase!==_0x5878('0xe')){firebase[_0x5878('0x40')](appUsers)[_0x5878('0x20')](_0x41912b=>{if(_0x41912b){USER=_0x41912b;UID=_0x41912b[_0x5878('0x6c')];initial();}});}function createSkillOption(_0x493a75){var _0x3b5f0d={};_0x493a75[_0x5878('0xb')](function(_0x583898){let _0x26f26c=_0x583898[_0x5878('0x67')];if(_0x26f26c!=='-'&&_0x26f26c>0x0){_0x3b5f0d[_0x583898[_0x5878('0x1f')]+'\x20BP:'+_0x583898[_0x5878('0x10')]+_0x5878('0x43')+_0x583898['PowerGrade']+']:'+_0x26f26c]=_0x583898['Id'];}});return _0x3b5f0d;}async function initial(){let _0x567020=readUserData(_0x5878('0x33'),function(_0x149f1e){if(_0x149f1e!==null){MY_MASTER_LV=_0x149f1e;$(_0x5878('0x2d'))[_0x5878('0x17')](MY_MASTER_LV[_0x5878('0x73')]);setMasterDamageRate();}});await Promise[_0x5878('0x4')]([_0x567020]);firebase[_0x5878('0x3')]()['goOffline']();firebase['database'](appUsers)['goOffline']();}$(function(){$('#taijyutsu')[_0x5878('0x2a')]();$(_0x5878('0x31'))[_0x5878('0x2a')]();$(_0x5878('0x53'))['hide']();$('#jinkei_k')[_0x5878('0x2a')]();$(_0x5878('0x2b'))[_0x5878('0x2a')]();$(_0x5878('0x1a'))[_0x5878('0x2a')]();for(let _0x593090 in ENEMY_DATA){let _0x246860=ENEMY_DATA[_0x593090];let _0x4fc3f9=_0x246860['quest']+'\x20'+_0x246860['name']+_0x5878('0x37')+_0x246860['vit']+_0x5878('0x3f')+_0x246860[_0x5878('0x5b')];$option=$(_0x5878('0x11'),{'value':_0x593090,'text':_0x4fc3f9});$('#enemy_vit')[_0x5878('0x7d')]($option);}for(let _0x3c0114 in SKILL_MASTER){let _0x3b0c93=SKILL_MASTER[_0x3c0114];SKILL_LIST[_0x3b0c93[_0x5878('0x1d')]][_0x5878('0x34')](_0x3b0c93);}let _0x512503=0x0;for(let _0x1c5a12 in SKILL_LIST){SKILL_LIST[_0x1c5a12][_0x5878('0x4f')](function(_0x3d7950,_0x4aefc4){if(_0x3d7950[_0x5878('0x67')]==='-'||_0x4aefc4[_0x5878('0x67')]==='-'||_0x3d7950[_0x5878('0x67')]>_0x4aefc4[_0x5878('0x67')]){return-0x1;}else if(_0x3d7950[_0x5878('0x67')]<_0x4aefc4[_0x5878('0x67')]||_0x3d7950[_0x5878('0x10')]>_0x4aefc4[_0x5878('0x10')]){return 0x1;}else{return-0x1;}});SKILL_LIST[_0x1c5a12][_0x5878('0x66')]({'Id':'ID'+_0x512503++,'ConsumeBp':0x0,'Name':_0x5878('0x8')+_0x1c5a12+')','PowerGrade':'E','SkillIryoku':0x7,'SkillType':'技'});}addOption(createSkillOption(SKILL_LIST['剣']),_0x5878('0x16'));setDefaultSkillIryoku();$(_0x5878('0x60'))[_0x5878('0x52')](function(){setDefaultSkillIryoku();let _0x115f0f=$('#skill\x20option:selected')[_0x5878('0x3b')]();if(_0x115f0f['indexOf'](_0x5878('0x75'))!==-0x1){$(_0x5878('0xf'))[_0x5878('0x17')](0x1);}else{}});$(_0x5878('0x2d'))[_0x5878('0x52')](function(){type=$(_0x5878('0x4c'))[_0x5878('0x17')]();if($[_0x5878('0x6d')](type,['hi',_0x5878('0x30'),_0x5878('0x4e'),_0x5878('0x7'),_0x5878('0x63'),'yami'])>-0x1){type=_0x5878('0x49');}MY_MASTER_LV[type]=$(_0x5878('0x2d'))['val']();setMasterDamageRate();});$(_0x5878('0x4c'))['change'](function(){type=$(_0x5878('0x4c'))[_0x5878('0x17')]();if($['inArray'](type,['hi',_0x5878('0x30'),'tsuchi',_0x5878('0x7'),_0x5878('0x63'),_0x5878('0x62')])>-0x1){type=_0x5878('0x49');}$(_0x5878('0x2d'))[_0x5878('0x17')](MY_MASTER_LV[type]);setMasterDamageRate();type_tx=$('#type\x20option:selected')['text']();$(_0x5878('0x60'))['children']()['remove']();addOption(createSkillOption(SKILL_LIST[type_tx]),_0x5878('0x16'));setDefaultSkillIryoku();$(_0x5878('0x2'))[_0x5878('0x54')]();if(type===_0x5878('0x49')){$('.param_label_teki')[_0x5878('0x3b')]('精神');$(_0x5878('0x90'))[_0x5878('0x3b')]('知');}else{$(_0x5878('0x5a'))[_0x5878('0x3b')]('体力');$(_0x5878('0x90'))['text']('腕');}if(type===_0x5878('0x49')){$(_0x5878('0x46'))['text']('知力');$('#taijyutsu')[_0x5878('0x2a')]();addOption(jJinkei,_0x5878('0xd'));}else if($[_0x5878('0x6d')](type,DEX_LIST)>-0x1){$('#param_label')[_0x5878('0x3b')](_0x5878('0x4d'));$(_0x5878('0x6f'))[_0x5878('0x2a')]();addOption(kJinkei,_0x5878('0xd'));}else if(type==='tai'){$(_0x5878('0x46'))[_0x5878('0x3b')]('腕力');$('#taijyutsu')[_0x5878('0x7f')]();addOption(sJinkei,_0x5878('0xd'));}else{$(_0x5878('0x46'))[_0x5878('0x3b')]('腕力');$(_0x5878('0x6f'))[_0x5878('0x2a')]();addOption(wJinkei,_0x5878('0xd'));}jinkeiHosei();});$(_0x5878('0xc'))[_0x5878('0x52')](function(){jinkeiHosei();});$(_0x5878('0x44'))['change'](function(){var _0x38c742=$(_0x5878('0x44'))['val']();$(_0x5878('0x7e'))[_0x5878('0x17')](Math[_0x5878('0x7c')](0x1/(0x1+0.008*_0x38c742)*0x64*0x64)/0x64);});$(_0x5878('0x80'))['change'](function(){culc();});$(_0x5878('0x27'))['change'](function(){culc();});$(_0x5878('0x72'))[_0x5878('0x52')](function(){let _0x4d0854=$(_0x5878('0x72'))[_0x5878('0x17')]();if(_0x4d0854==='x'){return;}let _0x145810=ENEMY_DATA[_0x4d0854];type=$('#type')[_0x5878('0x17')]();if($[_0x5878('0x6d')](type,['hi','mizu',_0x5878('0x4e'),_0x5878('0x7'),_0x5878('0x63'),_0x5878('0x62')])>-0x1){$(_0x5878('0x26'))[_0x5878('0x17')](_0x145810[_0x5878('0x5b')]);}else{$(_0x5878('0x26'))[_0x5878('0x17')](_0x145810[_0x5878('0x4b')]);}for(let _0x3b840d of[_0x5878('0x76'),'da',_0x5878('0x3a'),_0x5878('0x84'),_0x5878('0x15'),_0x5878('0x29'),'in',_0x5878('0x70')]){setTaisei($(_0x5878('0x79')+_0x3b840d),_0x145810[_0x3b840d]);}culc();});$(_0x5878('0x85'))[_0x5878('0x12')](function(){jinkeiHosei();});});function setDefaultSkillIryoku(){let _0x1665d7=$('#skill\x20option:selected')[_0x5878('0x17')]();let _0x45fc74=SKILL_MASTER[_0x1665d7];let _0x1a0b09=_0x45fc74===undefined?0x7:_0x45fc74[_0x5878('0x67')];$('#skill_val')[_0x5878('0x17')](_0x1a0b09);}var isTokkou=![];var isGinka=![];var isFuramenko=![];var isRyuden=![];var isBuff=![];$(document)['on'](_0x5878('0x12'),_0x5878('0x14'),function(){setCond($(this)[_0x5878('0x82')]('data-type'),$(this)['hasClass'](_0x5878('0x39')));$(this)[_0x5878('0x1b')]('.fas')[_0x5878('0x6b')]('fa-toggle-off')[_0x5878('0x6b')](_0x5878('0x18'));$(this)['toggleClass'](_0x5878('0x39'))[_0x5878('0x6b')](_0x5878('0x2e'));culc();});function setCond(_0x383bce,_0x16b6e3){switch(_0x383bce){case'tk':isTokkou=_0x16b6e3;break;case'gi':isGinka=_0x16b6e3;break;case'fu':isFuramenko=_0x16b6e3;break;case'ry':isRyuden=_0x16b6e3;break;case'bf':isBuff=_0x16b6e3;break;}}function culc(){let _0x1c2867=Number($(_0x5878('0x8f'))[_0x5878('0x17')]());let _0x5e9d0d=isBuff?Math[_0x5878('0x51')](_0x1c2867*0.2):0x0;let _0x44a80a=Number($('#ability_list1')[_0x5878('0x17')]());let _0x4cad36=Number($(_0x5878('0x55'))['val']());let _0x318f60=Number($(_0x5878('0x8e'))[_0x5878('0x17')]());let _0x666148=Number($(_0x5878('0x3d'))[_0x5878('0x17')]());let _0x5d5e94=Number($(_0x5878('0x78'))['val']());let _0x5cf1e3=_0x44a80a+_0x4cad36+_0x318f60+_0x666148+_0x5d5e94;if(isTokkou){_0x5cf1e3+=0x14;}if(isFuramenko){_0x5cf1e3+=0x23;$(_0x5878('0x5d'))[_0x5878('0x81')](_0x5878('0x32'));}else if(isGinka){_0x5cf1e3+=0xf;}if(isRyuden){_0x5cf1e3+=0xa;}$(_0x5878('0x13'))[_0x5878('0x17')](_0x5cf1e3);var _0x5d0502=Number($(_0x5878('0x1e'))[_0x5878('0x17')]());var _0x1de9d8=Number($(_0x5878('0x13'))[_0x5878('0x17')]());var _0x5c8b11=Number($(_0x5878('0x44'))[_0x5878('0x17')]());var _0x2c4658=Number($('#skill_val')[_0x5878('0x17')]());var _0x4e7f9e=Number($(_0x5878('0xf'))['val']());var _0x4dc6d3=$('#type')[_0x5878('0x17')]();var _0x479271=Number($(_0x5878('0x26'))['val']());var _0x210b75=masterLevel($('#master')['val']())*0x64;setMasterDamageRate();var _0x31274b=getStrAgi();var _0x57104e=_0x31274b[0x0];_0x57104e+=_0x5e9d0d;var _0x1ee8c9=_0x31274b[0x1];dRange=damageStepCulc(_0x4dc6d3,_0x57104e,_0x1ee8c9,_0x5d0502,_0x2c4658,_0x4e7f9e,_0x479271,_0x210b75,_0x1de9d8,_0x5c8b11);dispDamageRange(dRange);}function setMasterDamageRate(){var _0x2668de=masterLevel($(_0x5878('0x2d'))[_0x5878('0x17')]())*0x64;$(_0x5878('0x4a'))[_0x5878('0x17')](Math[_0x5878('0x7c')](_0x2668de*0x64)/0x64);}function damageColor(_0x12fd17,_0x530ed0,_0xc4350b,_0x1493c7){if(_0x12fd17>0x0&&(_0x12fd17==_0x530ed0||_0x12fd17==_0xc4350b)){_0x1493c7[_0x5878('0x28')](_0x5878('0x19'));_0x1493c7['addClass'](_0x5878('0x92'));_0x1493c7[_0x5878('0x83')](_0x5878('0x1'));}else if(_0x12fd17>0x0){_0x1493c7[_0x5878('0x83')](_0x5878('0x19'));_0x1493c7[_0x5878('0x28')](_0x5878('0x92'));_0x1493c7[_0x5878('0x28')](_0x5878('0x1'));}else{_0x1493c7[_0x5878('0x28')](_0x5878('0x19'));_0x1493c7[_0x5878('0x28')](_0x5878('0x92'));_0x1493c7[_0x5878('0x28')](_0x5878('0x1'));}}function patternReCulc(){var _0x31085c=Number($(_0x5878('0x1e'))[_0x5878('0x17')]());var _0x16511d=Number($(_0x5878('0x13'))[_0x5878('0x17')]())/0x64;var _0x128e84=Number($(_0x5878('0x44'))[_0x5878('0x17')]());var _0x24f055=Number($('#skill_val')[_0x5878('0x17')]());var _0x198ee4=Number($(_0x5878('0xf'))[_0x5878('0x17')]());var _0x4e4361=$('#type')[_0x5878('0x17')]();var _0x5381a5=Number($(_0x5878('0x26'))[_0x5878('0x17')]());var _0x44d2fb=masterLevel($(_0x5878('0x2d'))[_0x5878('0x17')]());var _0x305598=[];var _0x3364e0=$(_0x5878('0xc'))[_0x5878('0x17')]();var _0x27d9ae=$(_0x5878('0x8f'))[_0x5878('0x17')]()!=0x0?getJinkei():{'フリーファイト':0x0};for(key in _0x27d9ae){$(_0x5878('0xc'))[_0x5878('0x17')](_0x27d9ae[key]);jinkeiHosei();var _0x42d250=getStrAgi();var _0x220ec5=_0x42d250[0x0];var _0x328659=_0x42d250[0x1];var _0x20f004=damageStepCulc(_0x4e4361,_0x220ec5,_0x328659,_0x31085c,_0x24f055,_0x198ee4,_0x5381a5,_0x44d2fb,_0x16511d,_0x128e84);var _0x59888c={'name':_0x5878('0x74')+key,'d1':_0x20f004[0x0],'d10':_0x20f004[0x9],'avg':arrayAvg(_0x20f004),'jinkei':_0x27d9ae[key]};_0x305598[_0x5878('0x34')](_0x59888c);}$(_0x5878('0xc'))['val'](_0x3364e0);jinkeiHosei();var _0x173eff=Number($(_0x5878('0x65'))[_0x5878('0x17')]());var _0x2a696d=Number($(_0x5878('0x21'))[_0x5878('0x17')]());var _0x1e2a89=_0x173eff;var _0x49fc86=_0x2a696d;var _0x327e8f='';if(_0x4e4361!==_0x5878('0x8a')){var _0x327e8f=$[_0x5878('0x6d')](_0x4e4361,DEX_LIST)>-0x1?_0x5878('0x2c'):_0x5878('0x89');[...Array(0x3)][_0x5878('0x42')]((_0x1de9ab,_0x19dfec)=>{if($(_0x5878('0xc'))[_0x5878('0x17')]()!='0'){var _0x901987=getStrAgi();var _0x3a21a7=_0x901987[0x0];}var _0x85abc9=getFieldSTR(_0x3a21a7+_0x19dfec+0x1,_0x2a696d,v);var _0x364080=baseDamageCulc(_0x85abc9);var _0x241753=damageStepCulc(_0x4e4361,_0x3a21a7,_0x328659,_0x31085c,_0x24f055,_0x198ee4,_0x5381a5,_0x44d2fb,_0x16511d,_0x128e84);var _0x353f18={'name':_0x327e8f+(_0x19dfec+0x1),'d1':_0x364080};_0x305598[_0x5878('0x34')](_0x353f18);});}else{[...Array(0x3)][_0x5878('0x42')]((_0x204062,_0x403431)=>{if($(_0x5878('0xc'))[_0x5878('0x17')]()!='0'){var _0xa80b9c=getJinkeiStrAgi();_0x1e2a89=_0xa80b9c[0x0];_0x49fc86=_0xa80b9c[0x1];}var _0x4b1e9b=getFieldSTR(_0x1e2a89+_0x403431+0x1,_0x49fc86,v);var _0xb21e3e=baseDamageCulc(_0x4b1e9b);var _0x582f3a={'name':_0x5878('0x89')+(_0x403431+0x1),'d1':_0xb21e3e};_0x305598['push'](_0x582f3a);_0x4b1e9b=getFieldSTR(_0x1e2a89,_0x49fc86+_0x403431+0x1,v);_0xb21e3e=baseDamageCulc(_0x4b1e9b);_0x582f3a={'name':_0x5878('0x41')+(_0x403431+0x1),'d1':_0xb21e3e};_0x305598[_0x5878('0x34')](_0x582f3a);_0x4b1e9b=getFieldSTR(_0x1e2a89+_0x403431+0x1,_0x49fc86+_0x403431+0x1,v);_0xb21e3e=baseDamageCulc(_0x4b1e9b);_0x582f3a={'name':_0x5878('0x89')+(_0x403431+0x1)+'\x20素早さ+'+(_0x403431+0x1),'d1':_0xb21e3e};_0x305598['push'](_0x582f3a);});}var _0x260351=Number($(_0x5878('0x1e'))[_0x5878('0x17')]());var _0x315c7d=wepK;[...Array(0x3)][_0x5878('0x42')]((_0x1f7a71,_0x5d88da)=>{if($(_0x5878('0xc'))[_0x5878('0x17')]()!='0'){var _0x30efcf=getJinkeiStrAgi();_0x1e2a89=_0x30efcf[0x0];_0x49fc86=_0x30efcf[0x1];}var _0x1ebe53=getFieldSTR(_0x1e2a89,_0x2a696d,v);if(_0x4e4361==0x3){wepK=(_0x260351+0x9+_0x5d88da+0x1)/10.5;}else{wepK=(_0x260351+0x6+_0x5d88da+0x1)/0x7;}var _0x24577d=baseDamageCulc(_0x1ebe53);var _0xd9ab11={'name':_0x5878('0x5c')+(_0x5d88da+0x1),'d1':_0x24577d};_0x305598[_0x5878('0x34')](_0xd9ab11);});wepK=_0x315c7d;dispDamageRank(_0x305598);}function getStrAgi(){var _0x16866e=Number($(_0x5878('0x65'))[_0x5878('0x17')]());var _0x27d50f=Number($('#agi')['val']());if($('#jinkei')['val']()!='0'){var _0x242f47=Number($(_0x5878('0x8f'))[_0x5878('0x17')]());var _0x16af06=Number($('#agiOnlyChar')[_0x5878('0x17')]());var _0x1a551a=_0x16866e-_0x242f47;var _0x548e23=_0x27d50f-_0x16af06;var _0x3cb2d8=Number($(_0x5878('0x50'))['val']());var _0x54f2a6=Number($('#jinkei_s_v')[_0x5878('0x17')]());if($[_0x5878('0x6d')](type,DEX_LIST)>-0x1){_0x3cb2d8=Number($(_0x5878('0x5f'))[_0x5878('0x17')]());}var _0x415682=getJinkeiStrAgi(_0x242f47,_0x3cb2d8,_0x16af06,_0x54f2a6);_0x16866e=_0x415682[0x0]+_0x1a551a;_0x27d50f=_0x415682[0x1]+_0x548e23;}return[_0x16866e,_0x27d50f];}function dispDamageRange(_0x22b3b2){$(_0x5878('0x8b'))[_0x5878('0x54')]();var _0x522188='';var _0x281890='';var _0xe8edc7=0x0;for(i=0x0;i<0x5;i++){_0x522188+=_0x5878('0x87')+number_format(_0x22b3b2[i])+_0x5878('0x69');_0xe8edc7+=_0x22b3b2[i];}for(i=0x5;i<_0x22b3b2[_0x5878('0x48')];i++){_0x281890+=_0x5878('0x87')+number_format(_0x22b3b2[i])+_0x5878('0x69');_0xe8edc7+=_0x22b3b2[i];}$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x0'));$('table#damageRangeTable\x20tbody')[_0x5878('0x7d')](_0x5878('0x88'));$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x94')+number_format(Math[_0x5878('0x7c')](_0xe8edc7/_0x22b3b2[_0x5878('0x48')]))+'</td>');$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x91'));$('table#damageRangeTable\x20tbody')[_0x5878('0x7d')](_0x5878('0x0'));$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x58'));$(_0x5878('0x6'))[_0x5878('0x7d')](_0x522188);$(_0x5878('0x6'))[_0x5878('0x7d')]('</tr>\x0a');$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x0'));$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x25'));$(_0x5878('0x6'))[_0x5878('0x7d')](_0x281890);$(_0x5878('0x6'))[_0x5878('0x7d')](_0x5878('0x9'));}function dispDamageRank(_0x9671a8){_0x9671a8['sort'](function(_0x329352,_0x5399d3){if(_0x329352['d1']>_0x5399d3['d1'])return-0x1;if(_0x329352['d1']<=_0x5399d3['d1'])return 0x1;});var _0x15abd2=$(_0x5878('0x8d'))[_0x5878('0x17')]();$('table#damageRankTable\x20tbody\x20*')['remove']();_0x9671a8['forEach'](function(_0x133701,_0x5c82da,_0x3eeff3){var _0x2b9f7c=_0x5c82da%0x2==0x0?_0x5878('0x2f'):'opacity-odd';if(_0x15abd2==_0x133701['jinkei']){_0x2b9f7c+=_0x5878('0x24');}var _0x43163e='';_0x43163e+=_0x5878('0x0');_0x43163e+=_0x5878('0x8c')+_0x2b9f7c+_0x5878('0x6e')+_0x133701['name']+_0x5878('0x69');_0x43163e+=_0x5878('0x8c')+_0x2b9f7c+'\x20\x22\x20>'+Math['round'](_0x133701['d1']*1.045)+'</td>';_0x43163e+=_0x5878('0x8c')+_0x2b9f7c+_0x5878('0x6e')+Math['round'](_0x133701['d1'])+_0x5878('0x69');_0x43163e+=_0x5878('0x9');$('table#damageRankTable\x20tbody')[_0x5878('0x7d')](_0x43163e);});}function Compare(_0x2bb3e3,_0x2c7a70){return arr[_0x2bb3e3]-arr[_0x2c7a70];}function jinkeiHosei(){var _0x33ac8e=$(_0x5878('0xc'))['val']();$(_0x5878('0x53'))[_0x5878('0x2a')]();$(_0x5878('0x57'))['hide']();$(_0x5878('0x2b'))['hide']();$(_0x5878('0x50'))['val'](0x0);$('#jinkei_k_v')[_0x5878('0x17')](0x0);$('#jinkei_s_v')[_0x5878('0x17')](0x0);$(_0x5878('0x1a'))[_0x5878('0x2a')]();let _0x4365bc=$(_0x5878('0x85'))[_0x5878('0x61')](_0x5878('0x32'));if(_0x33ac8e!='0'||_0x4365bc){$(_0x5878('0x1a'))['show']();}if($[_0x5878('0x6d')](_0x33ac8e,[_0x5878('0x22'),_0x5878('0x68'),_0x5878('0x45'),_0x5878('0x7b'),_0x5878('0x6a'),_0x5878('0xa'),_0x5878('0x1c'),_0x5878('0x64'),'rj1',_0x5878('0x38'),_0x5878('0x5e')])>-0x1){$(_0x5878('0x53'))[_0x5878('0x7f')]();var _0x1f66f7={'as1':0x32,'ds2':0x32,'dr1':0x19,'hjc':0x19,'sp1':0x19,'sp2':0x19,'as2':0x19,'ds1':0x19,'rj1':0x19,'dp1':0x19,'dp3':0x19};$(_0x5878('0x50'))[_0x5878('0x17')](_0x1f66f7[_0x33ac8e]);}type=$('#type')[_0x5878('0x17')]();if($[_0x5878('0x6d')](type,['hi',_0x5878('0x30'),_0x5878('0x4e'),_0x5878('0x7'),_0x5878('0x63'),_0x5878('0x62')])>-0x1){if($[_0x5878('0x6d')](_0x33ac8e,['pl2',_0x5878('0x77'),'ds2'])>-0x1){$(_0x5878('0x53'))[_0x5878('0x7f')]();var _0x1f66f7={'pl2':0x32,'ms2':0x32,'ds2':-0x19};$(_0x5878('0x50'))[_0x5878('0x17')](_0x1f66f7[_0x33ac8e]);}}if($[_0x5878('0x6d')](_0x33ac8e,[_0x5878('0x35'),_0x5878('0x22'),'hw2',_0x5878('0x38'),_0x5878('0x59'),_0x5878('0x5e')])>-0x1){$(_0x5878('0x57'))[_0x5878('0x7f')]();var _0x1f66f7={'hs2':0x32,'hw2':0x32,'dp2':0x32,'dr1':0x19,'dp1':0x19,'dp3':0x19};$(_0x5878('0x5f'))['val'](_0x1f66f7[_0x33ac8e]);}if($[_0x5878('0x6d')](_0x33ac8e,['ic',_0x5878('0x5'),'hs2','dr1','hw1',_0x5878('0x86'),'hw2','dr2','hjs','as3',_0x5878('0x93'),_0x5878('0x23'),_0x5878('0x45'),_0x5878('0x7b'),_0x5878('0x7a'),_0x5878('0x3e'),'pl2',_0x5878('0x77'),'rs','rj1',_0x5878('0x71'),_0x5878('0x93'),_0x5878('0x38'),_0x5878('0x56')])>-0x1){$(_0x5878('0x2b'))['show']();var _0x1f66f7={'ic':-0x32,'hs2':-0x32,'sp3':-0x32,'pl2':-0x32,'dp1':-0x32,'hw2':-0x19,'hjs':-0x19,'as3':-0x19,'rj3':-0x19,'ds3':-0x19,'ms2':-0x19,'dp4':-0x19,'dr2':-0xa,'rj3':-0xa,'sp1':0x32,'rs':0x32,'hs1':0x19,'dr1':0x19,'sp2':0x19,'pl1':0x19,'rj1':0x19,'hw1':0xf,'ms1':0xf,'rj2':0xa};$(_0x5878('0x47'))[_0x5878('0x17')](_0x1f66f7[_0x33ac8e]);}}