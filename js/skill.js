var _0x5d06=['突属性','熱属性','冷属性','陰属性','陽属性','マヒ付与','暗闇付与','スタン付与','睡眠付与','石化付与','混乱付与','腕力減少付与','体力減少付与','器用さ減少付与','素早さ減少付与','知力減少付与','精神減少付与','縦一列攻撃','横一列攻撃','味方単体対象','近接攻撃','遠距離攻撃','自身が対象','ファスト効果','ディレイ効果','技威力[E]','技威力[D]','技威力[S]','技威力[SS]','間接攻撃','浮遊特効','不死特効','植物特効','虫特効','骨特効','岩石特効','女性特効','獣特効','火精特効','スタン','狂戦士','器用さ','素早さ','敵全体','敵横一列','味方単体','SSS','カエル','skill_','Char','Skill','Style','all','database','goOffline','BattleType','PowerGrade','indexOf','push','ready','.selectJoken','hide','._FilterLink','click','toggleClass','filterActive','table#skill_holder_table\x20tbody\x20*','#skill_holder_list','html','concat','each','hasClass','href','attr','data-col','#skill_name_label','text','join','#skillList','#skill_damage_ranking','show','append','slideDown','.skill_select','data-id','#SKILL_TEMPLATE','d-none','.skillNameClass','<span>','icon_sm','Name','KakuseiSozai','Kakusei','find','.skillKakuseiArea','覚醒:','\x22\x20style=\x22width:25px;height:25px;\x20display:\x20inline-block;background-size:\x20contain;\x22>\u3000</span></span>','.iconArea','AttackAttributes','split','forEach','addClass','BadStatus','DeBuff','AttackDistance','AttackArea','敵単体','AttackKansetsu','Fast','[ファスト]','Delay','ConsumeBp','\x20威力:','SkillIryoku','.holderStyleArea','Holders','<div>','Rarity','style','style_icon/','width:35px;height:35px;','70px\x20!important;','width:70px;height:70px;','.png','\x20background-size:\x20','<p\x20class=\x27pad0\x20damage-label\x27>ダメージ\x20','culcDamage','</p>','<div\x20class=\x27style-label\x27>','</div>','html,body','animate','#holder_label','offset','top','remove','assign','sort','CharacterId','darkButton','border:initial;','toLocaleString','<button\x20class=\x22icon_info\x22\x20data-toggle=\x22tooltip\x22\x20data-placement=\x22top\x22\x20title=\x22','アビリティ倍率:','ability','culcKey','\x22></button>','<td\x20colspan=2>','\x20<small>','<tr>','width:80px','<td>','<br>','StyleAbility','small','[data-toggle=\x22tooltip\x22]','tooltip','FastDelay','fast','delay','KakuseiSearch','CriticalTargets','ファスト','#count_','length','slice','#PageTopBtn','css','bottom','scroll','scrollTop','stop','-10px','-200px','#weponLabel','skill_ken','skill_dken','skill_ono','skill_sken','skill_yari','skill_yumi','skill_kon','skill_tai','skill_tsue','skill_zan','skill_totsu','skill_da','skill_netsu','skill_rei','skill_rai','skill_in','skill_yo','skill_tantai','skill_tate','skill_yoko','skill_cyoku','skill_kan','skill_jishin','skill_mikata','skill_fast','skill_delay','skill_hi','skill_mizu','skill_kaze','skill_hikari','skill_yami','skill_sutan','skill_mahi','skill_doku','skill_sekika','skill_miryo','skill_nemuri','skill_konran','skill_kyosenshi','skill_kurayami','skill_deb_wan','skill_deb_tai','skill_deb_kiyo','skill_deb_chi','skill_deb_sei','skill_iryoku_d','skill_iryoku_c','skill_iryoku_a','skill_iryoku_s','skill_iryoku_sss','skill_iryoku_none','skill_crit_fuyu','skill_crit_fushi','skill_crit_suise','skill_crit_shoku','skill_crit_nin','skill_crit_jo','skill_crit_kaeru','skill_crit_kemo','skill_crit_fire','black','blue','green','orange','yellow','white','打属性'];(function(_0x2e4e91,_0xa9e967){var _0x36293c=function(_0x416a77){while(--_0x416a77){_0x2e4e91['push'](_0x2e4e91['shift']());}};_0x36293c(++_0xa9e967);}(_0x5d06,0xaf));var _0x19ed=function(_0xbf0de9,_0x88ce85){_0xbf0de9=_0xbf0de9-0x0;var _0x5b8ea0=_0x5d06[_0xbf0de9];return _0x5b8ea0;};var SKILL_MASTER,STYLE_MASTER,ABILITY_MASTER,CHAR_MASTER;var skillTypeList={};var optionList={'剣':_0x19ed('0x0'),'大剣':_0x19ed('0x1'),'斧':_0x19ed('0x2'),'小剣':_0x19ed('0x3'),'槍':_0x19ed('0x4'),'弓':_0x19ed('0x5'),'棍棒':_0x19ed('0x6'),'体術':_0x19ed('0x7'),'銃':'skill_ju','杖':_0x19ed('0x8'),'近':'skill_kin','遠':'skill_en','斬':_0x19ed('0x9'),'突':_0x19ed('0xa'),'打':_0x19ed('0xb'),'熱':_0x19ed('0xc'),'冷':_0x19ed('0xd'),'雷':_0x19ed('0xe'),'陰':_0x19ed('0xf'),'陽':_0x19ed('0x10'),'敵単体':_0x19ed('0x11'),'敵縦一列':_0x19ed('0x12'),'敵横一列':_0x19ed('0x13'),'直接':_0x19ed('0x14'),'間接':_0x19ed('0x15'),'敵全体':'skill_zentai','自身':_0x19ed('0x16'),'味方単体':_0x19ed('0x17'),'ファスト':_0x19ed('0x18'),'ディレイ':_0x19ed('0x19'),'火術':_0x19ed('0x1a'),'水術':_0x19ed('0x1b'),'風術':_0x19ed('0x1c'),'土術':'skill_tsuchi','光術':_0x19ed('0x1d'),'闇術':_0x19ed('0x1e'),'スタン':_0x19ed('0x1f'),'マヒ':_0x19ed('0x20'),'即死':'skill_sokushi','毒':_0x19ed('0x21'),'石化':_0x19ed('0x22'),'魅了':_0x19ed('0x23'),'眠り':_0x19ed('0x24'),'混乱':_0x19ed('0x25'),'狂戦士':_0x19ed('0x26'),'暗闇':_0x19ed('0x27'),'腕力':_0x19ed('0x28'),'体力':_0x19ed('0x29'),'器用さ':_0x19ed('0x2a'),'素早さ':'skill_deb_suba','知力':_0x19ed('0x2b'),'精神':_0x19ed('0x2c'),'E':'skill_iryoku_e','D':_0x19ed('0x2d'),'C':_0x19ed('0x2e'),'B':'skill_iryoku_b','A':_0x19ed('0x2f'),'S':_0x19ed('0x30'),'SS':'skill_iryoku_ss','SSS':_0x19ed('0x31'),'-':_0x19ed('0x32'),'浮遊':_0x19ed('0x33'),'不死':_0x19ed('0x34'),'水棲':_0x19ed('0x35'),'植物':_0x19ed('0x36'),'虫':'skill_crit_mushi','骨':'skill_crit_hone','岩石':'skill_crit_gan','人間':_0x19ed('0x37'),'女性':_0x19ed('0x38'),'カエル':_0x19ed('0x39'),'獣':_0x19ed('0x3a'),'火精':_0x19ed('0x3b')};let color=[_0x19ed('0x3c'),_0x19ed('0x3d'),_0x19ed('0x3e'),_0x19ed('0x3f'),'purple','red',_0x19ed('0x40'),_0x19ed('0x41')];let color2=['黒','青','緑','橙','紫','赤','黄','白'];var SKILL_NAME_LABEL={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬属性','da':_0x19ed('0x42'),'totsu':_0x19ed('0x43'),'netsu':_0x19ed('0x44'),'rei':_0x19ed('0x45'),'rai':'雷属性','in':_0x19ed('0x46'),'you':_0x19ed('0x47'),'doku':'毒付与','mahi':_0x19ed('0x48'),'kurayami':_0x19ed('0x49'),'sutan':_0x19ed('0x4a'),'nemuri':_0x19ed('0x4b'),'sekika':_0x19ed('0x4c'),'konran':_0x19ed('0x4d'),'miryo':'魅了付与','kyosenshi':'狂戦士付与','sokushi':'即死','deb_wan':_0x19ed('0x4e'),'deb_tai':_0x19ed('0x4f'),'deb_kiyo':_0x19ed('0x50'),'deb_suba':_0x19ed('0x51'),'deb_chi':_0x19ed('0x52'),'deb_sei':_0x19ed('0x53'),'zentai':'全体攻撃','tate':_0x19ed('0x54'),'yoko':_0x19ed('0x55'),'mikata':_0x19ed('0x56'),'kin':_0x19ed('0x57'),'en':_0x19ed('0x58'),'jishin':_0x19ed('0x59'),'fast':_0x19ed('0x5a'),'delay':_0x19ed('0x5b'),'iryoku_e':_0x19ed('0x5c'),'iryoku_d':_0x19ed('0x5d'),'iryoku_c':'技威力[C]','iryoku_b':'技威力[B]','iryoku_a':'技威力[A]','iryoku_s':_0x19ed('0x5e'),'iryoku_ss':_0x19ed('0x5f'),'iryoku_sss':'技威力[SSS]','kan':_0x19ed('0x60'),'cyoku':'直接攻撃','crit_fuyu':_0x19ed('0x61'),'crit_fushi':_0x19ed('0x62'),'crit_suise':'水棲特効','crit_shoku':_0x19ed('0x63'),'crit_mushi':_0x19ed('0x64'),'crit_hone':_0x19ed('0x65'),'crit_gan':_0x19ed('0x66'),'crit_nin':'人間特効','crit_jo':_0x19ed('0x67'),'crit_kaeru':'カエル特効','crit_kemo':_0x19ed('0x68'),'crit_fire':_0x19ed('0x69')};var SKILL_NAME_SEARCH={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬','da':'打','totsu':'突','netsu':'熱','rei':'冷','rai':'雷','in':'陰','yo':'陽','doku':'毒','mahi':'マヒ','kurayami':'暗闇','sutan':_0x19ed('0x6a'),'nemuri':'眠り','sekika':'石化','konran':'混乱','miryo':'魅了','kyosenshi':_0x19ed('0x6b'),'sokushi':'即死','deb_wan':'腕力','deb_tai':'体力','deb_kiyo':_0x19ed('0x6c'),'deb_suba':_0x19ed('0x6d'),'deb_chi':'知力','deb_sei':'精神','zentai':_0x19ed('0x6e'),'tate':'敵縦一列','yoko':_0x19ed('0x6f'),'mikata':_0x19ed('0x70'),'kin':'近','en':'遠','jishin':'自身','iryoku_e':'E','iryoku_d':'D','iryoku_c':'C','iryoku_b':'B','iryoku_a':'A','iryoku_s':'S','iryoku_ss':'SS','iryoku_sss':_0x19ed('0x71'),'crit_fuyu':'浮遊','crit_fushi':'不死','crit_suise':'水棲','crit_shoku':'植物','crit_mushi':'虫','crit_hone':'骨','crit_gan':'岩石','crit_nin':'人間','crit_jo':'女性','crit_kaeru':_0x19ed('0x72'),'crit_kemo':'獣','crit_fire':'火精'};for(let i in color){let c=color[i];optionList[c+'1']=_0x19ed('0x73')+c+'1';optionList[c+'2']=_0x19ed('0x73')+c+'2';optionList[c+'3']=_0x19ed('0x73')+c+'3';SKILL_NAME_LABEL[c+'1']=color2[i]+'砂';SKILL_NAME_LABEL[c+'2']=color2[i]+'石';SKILL_NAME_LABEL[c+'3']=color2[i]+'宝石';}for(let key in optionList){skillTypeList[optionList[key]]=[];}read();let SKILL_MASTER_LIST=[];async function read(){let _0x44f82e=readFile(_0x19ed('0x74'),function(_0x152f3b){CHAR_MASTER=_0x152f3b;});let _0x1b7a94=readFile(_0x19ed('0x75'),function(_0x3d291d){SKILL_MASTER=_0x3d291d;createSkillMasterList(SKILL_MASTER);countSkill(SKILL_MASTER);});let _0x4b50d0=readFile(_0x19ed('0x76'),function(_0x58b2b6){STYLE_MASTER=_0x58b2b6;});let _0x3aacf9=readFile('Ability',function(_0x1e70cc){ABILITY_MASTER=_0x1e70cc;});await Promise[_0x19ed('0x77')]([_0x44f82e,_0x1b7a94,_0x4b50d0,_0x3aacf9]);firebase[_0x19ed('0x78')]()['goOffline']();firebase[_0x19ed('0x78')](appUsers)[_0x19ed('0x79')]();}function filterList(_0x19777e,_0x573048,_0x5847bd){let _0x399b1=[_0x19ed('0x7a'),_0x19ed('0x7b')][_0x19ed('0x7c')](_0x5847bd)>-0x1?!![]:![];if(_0x5847bd==='AttackKansetsu'){for(let _0x22257b in _0x573048){_0x573048[_0x22257b]=_0x573048[_0x22257b]==='kan'?!![]:![];}_0x399b1=!![];}let _0x4018c9=[];for(let _0x3ee93 in _0x19777e){for(let _0x5ebe5a of _0x573048){if(_0x399b1&&_0x19777e[_0x3ee93][_0x5847bd]===_0x5ebe5a){_0x4018c9[_0x19ed('0x7d')](_0x19777e[_0x3ee93]);}else if(!_0x399b1&&_0x19777e[_0x3ee93][_0x5847bd][_0x19ed('0x7c')](_0x5ebe5a)>-0x1){_0x4018c9[_0x19ed('0x7d')](_0x19777e[_0x3ee93]);}}}return _0x4018c9;}$(document)[_0x19ed('0x7e')](function(_0x225a7f){_0x225a7f(_0x19ed('0x7f'))[_0x19ed('0x80')]();_0x225a7f(_0x19ed('0x81'))[_0x19ed('0x82')](function(){_0x225a7f(_0x19ed('0x7f'))[_0x19ed('0x80')]();_0x225a7f(this)[_0x19ed('0x83')](_0x19ed('0x84'));_0x225a7f(_0x19ed('0x85'))['remove']();_0x225a7f(_0x19ed('0x86'))[_0x19ed('0x87')]('');let _0x40463f=SKILL_MASTER_LIST[_0x19ed('0x88')]();let _0x357149={};let _0x9a3fc9=[];let _0x78e4ea=![];_0x225a7f(_0x19ed('0x81'))[_0x19ed('0x89')](function(){if(_0x225a7f(this)[_0x19ed('0x8a')](_0x19ed('0x84'))){_0x78e4ea=!![];let _0x27f63b=_0x225a7f(this)['attr'](_0x19ed('0x8b'))['substr'](0x1);let _0xc7fe19=_0x225a7f(this)[_0x19ed('0x8c')]('href')['substr'](0x7);_0x9a3fc9[_0x19ed('0x7d')](SKILL_NAME_LABEL[_0xc7fe19]);let _0xc65150=_0x225a7f(this)['attr'](_0x19ed('0x8d'));if(_0x357149[_0xc65150]===undefined){_0x357149[_0xc65150]=[];}let _0xc9a83b=SKILL_NAME_SEARCH[_0xc7fe19]!==undefined?SKILL_NAME_SEARCH[_0xc7fe19]:_0xc7fe19;_0x357149[_0xc65150][_0x19ed('0x7d')](_0xc9a83b);}});for(let _0x221dea in _0x357149){_0x40463f=filterList(_0x40463f,_0x357149[_0x221dea],_0x221dea);}_0x225a7f(_0x19ed('0x8e'))[_0x19ed('0x8f')](_0x9a3fc9[_0x19ed('0x90')]('&'));_0x225a7f('#skillList')[_0x19ed('0x80')]();_0x225a7f(_0x19ed('0x91'))[_0x19ed('0x87')]('');_0x225a7f(_0x19ed('0x92'))[_0x19ed('0x87')]('');countSkill(_0x40463f);if(_0x78e4ea){_0x225a7f(_0x19ed('0x7f'))[_0x19ed('0x93')]();for(let _0x59bae7 in _0x40463f){_0x225a7f(_0x19ed('0x91'))[_0x19ed('0x94')](skillLabelDiplay(_0x40463f[_0x59bae7]));}_0x225a7f(_0x19ed('0x91'))[_0x19ed('0x95')](0x12c);}});_0x225a7f(document)['on'](_0x19ed('0x82'),_0x19ed('0x96'),function(){var _0x456196=_0x225a7f(this)[_0x19ed('0x8c')](_0x19ed('0x97'));displaySkillHolders(_0x456196);});});function skillLabelDiplay(_0x36ae30){let _0x13f17c=$(_0x19ed('0x98'))['clone']()[_0x19ed('0x8c')]('id','')[_0x19ed('0x8c')](_0x19ed('0x97'),_0x36ae30['Id'])['removeClass'](_0x19ed('0x99'));_0x13f17c['find'](_0x19ed('0x9a'))['append']($(_0x19ed('0x9b'))['addClass'](_0x19ed('0x9c'))['addClass'](ICON_LIST[_0x36ae30['BattleType']])[_0x19ed('0x8f')]('\u3000'))[_0x19ed('0x94')](_0x36ae30[_0x19ed('0x9d')]);let _0x35a6d6=KAKUSEI_COLOR[_0x36ae30[_0x19ed('0x9e')]]+KAKUSEI_ICON[_0x36ae30[_0x19ed('0x9f')]];_0x13f17c[_0x19ed('0xa0')](_0x19ed('0xa1'))[_0x19ed('0x94')](_0x19ed('0xa2')+_0x36ae30[_0x19ed('0x9f')])[_0x19ed('0x94')]('\x20<span\x20class=\x22fukidashi\x22\x20style=\x22display:\x20inline-block\x22><span\x20class=\x22icon_'+_0x35a6d6+_0x19ed('0xa3'));let _0x496109=_0x13f17c['find'](_0x19ed('0xa4'));_0x36ae30[_0x19ed('0xa5')][_0x19ed('0xa6')](',')[_0x19ed('0xa7')](function(_0x3363b9){_0x496109[_0x19ed('0x94')]($(_0x19ed('0x9b'))['addClass'](_0x19ed('0x9c'))[_0x19ed('0xa8')](ICON_LIST[_0x3363b9])['text']('\u3000'));});if(_0x36ae30[_0x19ed('0xa9')]!=''){_0x496109[_0x19ed('0x94')]($(_0x19ed('0x9b'))[_0x19ed('0xa8')]('')[_0x19ed('0xa8')](_0x19ed('0x9c'))[_0x19ed('0xa8')](ICON_LIST[_0x36ae30[_0x19ed('0xa9')]])[_0x19ed('0x8f')]('\u3000'));}if(_0x36ae30['DeBuff']!=''){_0x496109['append']($(_0x19ed('0x9b'))[_0x19ed('0xa8')](_0x19ed('0x9c'))[_0x19ed('0xa8')](ICON_LIST[_0x36ae30[_0x19ed('0xaa')]+'低下'])[_0x19ed('0x8f')]('\u3000'));}if(_0x36ae30[_0x19ed('0xab')]!=='近'&&_0x36ae30[_0x19ed('0xac')]!==_0x19ed('0x6e')){_0x496109[_0x19ed('0x94')]('['+_0x36ae30[_0x19ed('0xab')]+']');}if(_0x36ae30[_0x19ed('0xac')]!==_0x19ed('0xad')){_0x496109[_0x19ed('0x94')]('['+AREA_SHORT[_0x36ae30[_0x19ed('0xac')]]+']');}if(_0x36ae30[_0x19ed('0xae')]){_0x496109[_0x19ed('0x94')]('[間接]');}if(_0x36ae30[_0x19ed('0xaf')]){_0x496109['append'](_0x19ed('0xb0'));}if(_0x36ae30[_0x19ed('0xb1')]){_0x496109[_0x19ed('0x94')]('[ディレイ]');}_0x13f17c[_0x19ed('0xa0')]('.iryokuArea')[_0x19ed('0x94')]('BP:'+_0x36ae30[_0x19ed('0xb2')])[_0x19ed('0x94')](_0x19ed('0xb3')+_0x36ae30['PowerGrade']+'('+_0x36ae30[_0x19ed('0xb4')]+')');let _0x1e610f=_0x13f17c[_0x19ed('0xa0')](_0x19ed('0xb5'));for(let _0x33e48d in _0x36ae30[_0x19ed('0xb6')]){let _0x5d441c=_0x36ae30[_0x19ed('0xb6')][_0x33e48d];let _0x3872c2=STYLE_MASTER[_0x5d441c];let _0x308fb7=$(_0x19ed('0xb7'))[_0x19ed('0xa8')]('style')[_0x19ed('0xa8')](getStyleIconClass(_0x3872c2[_0x19ed('0xb8')]))['attr'](_0x19ed('0xb9'),getImgUrl(_0x19ed('0xba')+_0x5d441c+'.png')+';\x20width:35px;height:35px;\x20background-size:\x2035px\x20!important;')['attr'](_0x19ed('0x97'),_0x5d441c);let _0x3708ac=$(_0x19ed('0x9b'))[_0x19ed('0x8c')](_0x19ed('0xb9'),_0x19ed('0xbb'))[_0x19ed('0xa8')](getStyleIconBgClass(_0x3872c2[_0x19ed('0xb8')]))[_0x19ed('0x94')](_0x308fb7);_0x1e610f[_0x19ed('0x94')](_0x3708ac);}return _0x13f17c;}var STYLE_ICON_BG_SIZE=_0x19ed('0xbc');var STYLE_ICON_SIZE=_0x19ed('0xbd');function createStyleIcon(_0x387fed,_0x8cfcac){let _0xf04566=_0x387fed['Id'];let _0x490c57=$(_0x19ed('0xb7'))[_0x19ed('0xa8')]('style')[_0x19ed('0xa8')](getStyleIconClass(_0x387fed['Rarity']))[_0x19ed('0x8c')](_0x19ed('0xb9'),getImgUrl(_0x19ed('0xba')+_0xf04566+_0x19ed('0xbe'))+';\x20'+STYLE_ICON_SIZE+_0x19ed('0xbf')+STYLE_ICON_BG_SIZE)[_0x19ed('0x8c')](_0x19ed('0x97'),_0xf04566);let _0x30a847=$(_0x19ed('0x9b'))[_0x19ed('0x8c')](_0x19ed('0xb9'),STYLE_ICON_SIZE)[_0x19ed('0xa8')](getStyleIconBgClass(_0x387fed[_0x19ed('0xb8')]))[_0x19ed('0x94')](_0x490c57);let _0x291b76=$(_0x19ed('0xb7'))[_0x19ed('0xa8')]('col-3\x20col-sm-2\x20text-center')[_0x19ed('0x94')](_0x30a847);if(_0x8cfcac[_0x19ed('0xb4')]!=='-'){_0x291b76[_0x19ed('0x94')](_0x19ed('0xc0')+_0x387fed[_0x19ed('0xc1')]+_0x19ed('0xc2'))[_0x19ed('0x94')](_0x19ed('0xc3')+_0x387fed['Name']+_0x19ed('0xc4'));}return _0x291b76;}function displaySkillHolders(_0x16f5d9){$(_0x19ed('0xc5'))[_0x19ed('0xc6')]({'scrollTop':$(_0x19ed('0xc7'))[_0x19ed('0xc8')]()[_0x19ed('0xc9')]});var _0x289651=SKILL_MASTER[_0x16f5d9];$(_0x19ed('0x85'))[_0x19ed('0xca')]();$(_0x19ed('0x86'))['html']('');let _0x2332ba=[];for(key in _0x289651[_0x19ed('0xb6')]){let _0x778846=_0x289651[_0x19ed('0xb6')][key];let _0x36aad0=STYLE_MASTER[_0x778846];let _0x4e8dd3=CHAR_MASTER[_0x36aad0['CharacterId']];let _0xc4bfc1=culcSkillDamageWithStyleBase(_0x4e8dd3,_0x36aad0,_0x289651);_0xc4bfc1=Object[_0x19ed('0xcb')](_0xc4bfc1,_0x36aad0);_0x2332ba[_0x19ed('0x7d')](_0xc4bfc1);}_0x2332ba[_0x19ed('0xcc')]((_0x1d19ac,_0xaa344a)=>{if(_0x1d19ac['culcDamage']>_0xaa344a[_0x19ed('0xc1')]){return-0x1;}return 0x1;});for(key in _0x2332ba){let _0xe82ab5=_0x2332ba[key];let _0x1bec45=createStyleIcon(_0xe82ab5,_0x289651);$('#skill_holder_list')[_0x19ed('0x94')](_0x1bec45);}let _0x30226e=[];let _0x1ed3be=[];for(key in _0x289651[_0x19ed('0xb6')]){let _0xef657c=STYLE_MASTER[_0x289651[_0x19ed('0xb6')][key]];let _0x4e8dd3=CHAR_MASTER[_0xef657c[_0x19ed('0xcd')]];for(key in _0x4e8dd3[_0x19ed('0xb6')]){let _0xb2aab5=STYLE_MASTER[_0x4e8dd3[_0x19ed('0xb6')][key]];if(_0x1ed3be['indexOf'](_0xb2aab5['Id'])>-0x1){continue;}_0x1ed3be[_0x19ed('0x7d')](_0xb2aab5['Id']);let _0xc4bfc1=culcSkillDamageWithStyleBase(_0x4e8dd3,_0xb2aab5,_0x289651);_0xc4bfc1=Object['assign'](_0xc4bfc1,_0xb2aab5);_0x30226e[_0x19ed('0x7d')](_0xc4bfc1);}}_0x30226e['sort']((_0x752653,_0xdcc756)=>{if(_0x752653[_0x19ed('0xc1')]>_0xdcc756[_0x19ed('0xc1')]){return-0x1;}return 0x1;});$(_0x19ed('0x92'))[_0x19ed('0x87')]('');for(key in _0x30226e){let _0x2de749=_0x30226e[key];let _0x1bec45=createStyleIcon(_0x2de749,_0x289651);$(_0x19ed('0x92'))[_0x19ed('0x94')](_0x1bec45);}for(key in _0x2332ba){let _0x155a62=_0x2332ba[key];let _0x778846=_0x155a62['Id'];let _0x4e03c9=getStyleBgColor(_0x155a62[_0x19ed('0xb8')]);let _0x4f76f5=$('<tr>')['addClass'](_0x4e03c9)[_0x19ed('0xa8')](_0x19ed('0xce'))[_0x19ed('0x8c')](_0x19ed('0xb9'),_0x19ed('0xcf'));let _0x2aae6f=$('<td>')[_0x19ed('0xa8')]('text-center');if(_0x289651[_0x19ed('0xb4')]!=='-'){_0x2aae6f[_0x19ed('0x94')]('<b>'+_0x155a62[_0x19ed('0xc1')][_0x19ed('0xd0')]()+'</b>');let _0x4f9ee0=_0x19ed('0xd1')+_0x19ed('0xd2')+_0x155a62[_0x19ed('0xd3')]+'%\x20'+_0x155a62[_0x19ed('0xd4')]+':'+_0x155a62['culcValue']+_0x19ed('0xd5');_0x2aae6f[_0x19ed('0x94')](_0x4f9ee0);}_0x4f76f5[_0x19ed('0x94')](_0x2aae6f);_0x4f76f5[_0x19ed('0x94')](_0x19ed('0xd6')+_0x155a62[_0x19ed('0x9d')]+_0x19ed('0xd7')+_0x155a62['AnotherName']+'</small></td>');let _0xdfbe07=$(_0x19ed('0xd8'))[_0x19ed('0xa8')](_0x4e03c9);let _0x35bcc3=$('<td>')[_0x19ed('0xa8')]('text-center');let _0x1a9e72=$('<div>')[_0x19ed('0xa8')](_0x19ed('0xb9'))[_0x19ed('0xa8')](getStyleIconClass(_0x155a62[_0x19ed('0xb8')]))[_0x19ed('0x8c')](_0x19ed('0xb9'),getImgUrl(_0x19ed('0xba')+_0x778846+_0x19ed('0xbe')))[_0x19ed('0x8c')]('data-id',_0x778846);let _0x58b16e=$(_0x19ed('0x9b'))[_0x19ed('0xa8')](getStyleIconBgClass(_0x155a62['Rarity']))[_0x19ed('0x8c')](_0x19ed('0xb9'),_0x19ed('0xd9'))['attr'](_0x19ed('0xb9'),'justify-content:\x20space-between;')[_0x19ed('0x94')](_0x1a9e72);_0x35bcc3[_0x19ed('0x94')](_0x58b16e);let _0x1625b1=$(_0x19ed('0xda'))['addClass']('small');_0x1625b1[_0x19ed('0x94')](_0x155a62[_0x19ed('0x75')][_0x19ed('0x90')](_0x19ed('0xdb')));let _0x582321=[];for(let _0x307257 in _0x155a62['StyleAbility']){_0x582321[_0x19ed('0x7d')](_0x155a62[_0x19ed('0xdc')][_0x307257]);}let _0x581bdc=$(_0x19ed('0xda'))[_0x19ed('0xa8')](_0x19ed('0xdd'));_0x581bdc[_0x19ed('0x94')](_0x582321[_0x19ed('0x90')]('<br>'));_0xdfbe07[_0x19ed('0x94')](_0x35bcc3);_0xdfbe07['append'](_0x1625b1);_0xdfbe07[_0x19ed('0x94')](_0x581bdc);$('table#skill_holder_table\x20tbody')[_0x19ed('0x94')](_0x4f76f5)[_0x19ed('0x94')](_0xdfbe07);}$(_0x19ed('0xde'))[_0x19ed('0xdf')]();}function createSkillMasterList(_0x3b1600){for(let _0x52c309 in _0x3b1600){if(_0x3b1600[_0x52c309][_0x19ed('0xaf')]){_0x3b1600[_0x52c309][_0x19ed('0xe0')]=_0x19ed('0xe1');}else if(_0x3b1600[_0x52c309][_0x19ed('0xaf')]){_0x3b1600[_0x52c309][_0x19ed('0xe0')]=_0x19ed('0xe2');}else{_0x3b1600[_0x52c309][_0x19ed('0xe0')]='';}_0x3b1600[_0x52c309][_0x19ed('0xe3')]=_0x3b1600[_0x52c309][_0x19ed('0x9e')]+_0x3b1600[_0x52c309][_0x19ed('0x9f')];if(_0x3b1600[_0x52c309][_0x19ed('0xb6')]!==undefined){SKILL_MASTER_LIST[_0x19ed('0x7d')](_0x3b1600[_0x52c309]);}}}function countSkill(_0x579437){let _0x2452e2={};for(let _0xcb32d4 in optionList){_0x2452e2[optionList[_0xcb32d4]]=[];}for(let _0x30827d in _0x579437){let _0x1e1165=_0x579437[_0x30827d];if(_0x1e1165[_0x19ed('0xb6')]!==undefined){_0x2452e2[optionList[_0x1e1165[_0x19ed('0x7a')]]][_0x19ed('0x7d')](_0x1e1165);_0x2452e2[optionList[_0x1e1165[_0x19ed('0xac')]]][_0x19ed('0x7d')](_0x1e1165);_0x2452e2[optionList[_0x1e1165[_0x19ed('0xab')]]][_0x19ed('0x7d')](_0x1e1165);_0x2452e2[optionList[_0x1e1165[_0x19ed('0x9e')]+_0x1e1165['Kakusei']]][_0x19ed('0x7d')](_0x1e1165);if(_0x1e1165[_0x19ed('0xe4')]!==''){let _0x33ceb7=_0x1e1165['CriticalTargets'][_0x19ed('0xa6')](',');for(let _0x224ad1 of _0x33ceb7){_0x2452e2[optionList[_0x224ad1]][_0x19ed('0x7d')](_0x1e1165);}}_0x2452e2[optionList[_0x1e1165[_0x19ed('0x7b')]]]['push'](_0x1e1165);if(_0x1e1165[_0x19ed('0xaf')]){_0x2452e2[optionList[_0x19ed('0xe5')]][_0x19ed('0x7d')](_0x1e1165);}if(_0x1e1165[_0x19ed('0xb1')]){_0x2452e2[optionList['ディレイ']][_0x19ed('0x7d')](_0x1e1165);}if(_0x1e1165['BadStatus']!=''){_0x2452e2[optionList[_0x1e1165[_0x19ed('0xa9')]]][_0x19ed('0x7d')](_0x1e1165);}if(_0x1e1165['DeBuff']!=''){_0x2452e2[optionList[_0x1e1165['DeBuff']]][_0x19ed('0x7d')](_0x1e1165);}let _0x304e6c=_0x1e1165[_0x19ed('0xae')]?_0x19ed('0x15'):_0x19ed('0x14');_0x2452e2[_0x304e6c][_0x19ed('0x7d')](_0x1e1165);let _0x3401bd=_0x1e1165[_0x19ed('0xa5')];_0x3401bd[_0x19ed('0xa6')](',')[_0x19ed('0xa7')](function(_0x18edb6){_0x2452e2[optionList[_0x18edb6]]['push'](_0x1e1165);});}}for(let _0x47be85 in optionList){let _0x30827d=optionList[_0x47be85];$(_0x19ed('0xe6')+_0x30827d)[_0x19ed('0x8f')](('\x20\x20'+_0x2452e2[_0x30827d][_0x19ed('0xe7')])[_0x19ed('0xe8')](-0x3));}}function sortSkill(_0x1cad2c){_0x1cad2c[_0x19ed('0xcc')](function(_0x47d1e9,_0x2ffe4e){if(_0x47d1e9[_0x19ed('0xb4')]==='-'){return 0x1;}else if(_0x47d1e9[_0x19ed('0xb4')]>_0x2ffe4e['SkillIryoku']){return-0x1;}else if(_0x47d1e9['SkillIryoku']<_0x2ffe4e[_0x19ed('0xb4')]){return 0x1;}else if(_0x47d1e9[_0x19ed('0xb2')]<_0x2ffe4e[_0x19ed('0xb2')]){return-0x1;}else if(_0x47d1e9[_0x19ed('0xb2')]>_0x2ffe4e[_0x19ed('0xb2')]){return 0x1;}else if(_0x47d1e9[_0x19ed('0xa5')]>_0x2ffe4e[_0x19ed('0xa5')]){return-0x1;}return 0x0;});return _0x1cad2c;}$(function(){var _0x2dc576=![];var _0x183c03=$(_0x19ed('0xe9'));_0x183c03[_0x19ed('0xea')](_0x19ed('0xeb'),'-200px');var _0x2dc576=![];$(window)[_0x19ed('0xec')](function(){if($(this)[_0x19ed('0xed')]()>0x64){if(_0x2dc576==![]){_0x2dc576=!![];_0x183c03[_0x19ed('0xee')]()[_0x19ed('0xc6')]({'bottom':_0x19ed('0xef')},0xc8);}}else{if(_0x2dc576){_0x2dc576=![];_0x183c03[_0x19ed('0xee')]()[_0x19ed('0xc6')]({'bottom':_0x19ed('0xf0')},0xc8);}}});_0x183c03[_0x19ed('0x82')](function(){$(_0x19ed('0xc5'))['animate']({'scrollTop':$(_0x19ed('0xf1'))[_0x19ed('0xc8')]()['top']});return![];});});
