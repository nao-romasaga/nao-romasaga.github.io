var _0x592f=['skill_rei','skill_in','skill_yo','skill_tantai','skill_yoko','skill_cyoku','skill_kan','skill_zentai','skill_jishin','skill_mikata','skill_delay','skill_mizu','skill_kaze','skill_tsuchi','skill_hikari','skill_yami','skill_sutan','skill_mahi','skill_sokushi','skill_doku','skill_sekika','skill_miryo','skill_nemuri','skill_konran','skill_kyosenshi','skill_deb_wan','skill_deb_tai','skill_deb_kiyo','skill_deb_suba','skill_deb_chi','skill_deb_sei','skill_iryoku_e','skill_iryoku_c','skill_iryoku_a','skill_iryoku_ss','skill_iryoku_sss','skill_iryoku_none','skill_crit_fuyu','skill_crit_fushi','skill_crit_suise','skill_crit_shoku','skill_crit_mushi','skill_crit_gan','skill_crit_nin','skill_crit_jo','skill_crit_kaeru','skill_crit_kemo','skill_crit_fish','black','blue','green','orange','purple','red','yellow','white','打属性','突属性','熱属性','雷属性','陰属性','陽属性','毒付与','マヒ付与','暗闇付与','睡眠付与','石化付与','混乱付与','魅了付与','狂戦士付与','腕力減少付与','体力減少付与','器用さ減少付与','素早さ減少付与','知力減少付与','全体攻撃','縦一列攻撃','横一列攻撃','味方単体対象','近接攻撃','遠距離攻撃','自身が対象','ファスト効果','ディレイ効果','技威力[E]','技威力[D]','技威力[C]','技威力[A]','技威力[SSS]','間接攻撃','直接攻撃','浮遊特効','虫特効','骨特効','岩石特効','獣特効','魚特効','悪魔特効','スタン','狂戦士','器用さ','素早さ','敵全体','敵縦一列','敵横一列','味方単体','SSS','カエル','skill_','skill_bp','Char','Skill','Style','Ability','all','database','goOffline','BattleType','ConsumeBp','indexOf','AttackKansetsu','kan','push','ready','.selectJoken','hide','._FilterLink','table#skill_holder_table\x20tbody\x20*','#skill_holder_list','html','concat','hasClass','attr','href','substr','data-col','#skill_name_label','join','#skillList','#skill_damage_ranking','#SKILL_NAME','show','SkillIryoku','Holders','length','append','slideDown','click','.skill_select','data-id','#SKILL_TEMPLATE','removeClass','d-none','find','<span>','addClass','icon_sm','text','Name','KakuseiSozai','Kakusei','.skillKakuseiArea','\x22\x20style=\x22width:25px;height:25px;\x20display:\x20inline-block;background-size:\x20contain;\x22>\u3000</span></span>','.iconArea','AttackAttributes','split','forEach','BadStatus','Buff','[HP回復]','DeBuff','AttackDistance','AttackArea','敵単体','[間接]','Fast','[ファスト]','.iryokuArea','BP:','\x20威力:','PowerGrade','.holderStyleArea','<div>','style','Rarity','style_icon/','.png',';\x20width:35px;height:35px;\x20background-size:\x2035px\x20!important;','width:35px;height:35px;','\x20background-size:\x20','<p\x20class=\x27pad0\x20damage-label\x27>ダメージ\x20','culcDamage','</p>','</div>','html,body','animate','top','<h5\x20style=\x22padding:top:\x205px;\x22>','</h5>','#SKILL_TEXT','FlavorText','remove','assign','sort','CharacterId','<tr>','darkButton','border:initial;','toLocaleString','</b>','<button\x20class=\x22icon_info\x22\x20data-toggle=\x22tooltip\x22\x20data-placement=\x22top\x22\x20title=\x22','アビリティ倍率:','culcKey','culcValue','\x22></button>','<td\x20colspan=2>','AnotherName','</small></td>','width:80px','<td>','small','<br>','StyleAbility','table#skill_holder_table\x20tbody','[data-toggle=\x22tooltip\x22]','tooltip','FastDelay','fast','Delay','delay','KakuseiSearch','CriticalTargets','ファスト','ディレイ','#count_','slice','#PageTopBtn','css','bottom','scroll','stop','-10px','-200px','#weponLabel','offset','skill_ken','skill_dken','skill_ono','skill_sken','skill_yari','skill_yumi','skill_kon','skill_tai','skill_ju','skill_tsue','skill_kin','skill_en','skill_zan','skill_da','skill_netsu'];(function(_0x2600ad,_0x292b65){var _0x44fd14=function(_0x2a24ea){while(--_0x2a24ea){_0x2600ad['push'](_0x2600ad['shift']());}};_0x44fd14(++_0x292b65);}(_0x592f,0xf5));var _0x1c59=function(_0x184cd0,_0x4c1742){_0x184cd0=_0x184cd0-0x0;var _0xa06465=_0x592f[_0x184cd0];return _0xa06465;};var SKILL_MASTER,STYLE_MASTER,ABILITY_MASTER,CHAR_MASTER;var skillTypeList={};var optionList={'剣':_0x1c59('0x0'),'大剣':_0x1c59('0x1'),'斧':_0x1c59('0x2'),'小剣':_0x1c59('0x3'),'槍':_0x1c59('0x4'),'弓':_0x1c59('0x5'),'棍棒':_0x1c59('0x6'),'体術':_0x1c59('0x7'),'銃':_0x1c59('0x8'),'杖':_0x1c59('0x9'),'近':_0x1c59('0xa'),'遠':_0x1c59('0xb'),'斬':_0x1c59('0xc'),'突':'skill_totsu','打':_0x1c59('0xd'),'熱':_0x1c59('0xe'),'冷':_0x1c59('0xf'),'雷':'skill_rai','陰':_0x1c59('0x10'),'陽':_0x1c59('0x11'),'敵単体':_0x1c59('0x12'),'敵縦一列':'skill_tate','敵横一列':_0x1c59('0x13'),'直接':_0x1c59('0x14'),'間接':_0x1c59('0x15'),'敵全体':_0x1c59('0x16'),'自身':_0x1c59('0x17'),'味方単体':_0x1c59('0x18'),'ファスト':'skill_fast','ディレイ':_0x1c59('0x19'),'火術':'skill_hi','水術':_0x1c59('0x1a'),'風術':_0x1c59('0x1b'),'土術':_0x1c59('0x1c'),'光術':_0x1c59('0x1d'),'闇術':_0x1c59('0x1e'),'スタン':_0x1c59('0x1f'),'マヒ':_0x1c59('0x20'),'即死':_0x1c59('0x21'),'毒':_0x1c59('0x22'),'石化':_0x1c59('0x23'),'魅了':_0x1c59('0x24'),'眠り':_0x1c59('0x25'),'混乱':_0x1c59('0x26'),'狂戦士':_0x1c59('0x27'),'暗闇':'skill_kurayami','腕力':_0x1c59('0x28'),'体力':_0x1c59('0x29'),'器用さ':_0x1c59('0x2a'),'素早さ':_0x1c59('0x2b'),'知力':_0x1c59('0x2c'),'精神':_0x1c59('0x2d'),'E':_0x1c59('0x2e'),'D':'skill_iryoku_d','C':_0x1c59('0x2f'),'B':'skill_iryoku_b','A':_0x1c59('0x30'),'S':'skill_iryoku_s','SS':_0x1c59('0x31'),'SSS':_0x1c59('0x32'),'-':_0x1c59('0x33'),'浮遊':_0x1c59('0x34'),'不死':_0x1c59('0x35'),'水棲':_0x1c59('0x36'),'植物':_0x1c59('0x37'),'虫':_0x1c59('0x38'),'骨':'skill_crit_hone','岩石':_0x1c59('0x39'),'人間':_0x1c59('0x3a'),'女性':_0x1c59('0x3b'),'カエル':_0x1c59('0x3c'),'獣':_0x1c59('0x3d'),'火精':'skill_crit_fire','魚':_0x1c59('0x3e'),'悪魔':'skill_crit_devil'};let color=[_0x1c59('0x3f'),_0x1c59('0x40'),_0x1c59('0x41'),_0x1c59('0x42'),_0x1c59('0x43'),_0x1c59('0x44'),_0x1c59('0x45'),_0x1c59('0x46')];let color2=['黒','青','緑','橙','紫','赤','黄','白'];var SKILL_NAME_LABEL={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬属性','da':_0x1c59('0x47'),'totsu':_0x1c59('0x48'),'netsu':_0x1c59('0x49'),'rei':'冷属性','rai':_0x1c59('0x4a'),'in':_0x1c59('0x4b'),'you':_0x1c59('0x4c'),'doku':_0x1c59('0x4d'),'mahi':_0x1c59('0x4e'),'kurayami':_0x1c59('0x4f'),'sutan':'スタン付与','nemuri':_0x1c59('0x50'),'sekika':_0x1c59('0x51'),'konran':_0x1c59('0x52'),'miryo':_0x1c59('0x53'),'kyosenshi':_0x1c59('0x54'),'sokushi':'即死','deb_wan':_0x1c59('0x55'),'deb_tai':_0x1c59('0x56'),'deb_kiyo':_0x1c59('0x57'),'deb_suba':_0x1c59('0x58'),'deb_chi':_0x1c59('0x59'),'deb_sei':'精神減少付与','zentai':_0x1c59('0x5a'),'tate':_0x1c59('0x5b'),'yoko':_0x1c59('0x5c'),'mikata':_0x1c59('0x5d'),'kin':_0x1c59('0x5e'),'en':_0x1c59('0x5f'),'jishin':_0x1c59('0x60'),'fast':_0x1c59('0x61'),'delay':_0x1c59('0x62'),'iryoku_e':_0x1c59('0x63'),'iryoku_d':_0x1c59('0x64'),'iryoku_c':_0x1c59('0x65'),'iryoku_b':'技威力[B]','iryoku_a':_0x1c59('0x66'),'iryoku_s':'技威力[S]','iryoku_ss':'技威力[SS]','iryoku_sss':_0x1c59('0x67'),'kan':_0x1c59('0x68'),'cyoku':_0x1c59('0x69'),'crit_fuyu':_0x1c59('0x6a'),'crit_fushi':'不死特効','crit_suise':'水棲特効','crit_shoku':'植物特効','crit_mushi':_0x1c59('0x6b'),'crit_hone':_0x1c59('0x6c'),'crit_gan':_0x1c59('0x6d'),'crit_nin':'人間特効','crit_jo':'女性特効','crit_kaeru':'カエル特効','crit_kemo':_0x1c59('0x6e'),'crit_fire':'火精特効','crit_fish':_0x1c59('0x6f'),'crit_devil':_0x1c59('0x70')};var SKILL_NAME_SEARCH={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬','da':'打','totsu':'突','netsu':'熱','rei':'冷','rai':'雷','in':'陰','yo':'陽','doku':'毒','mahi':'マヒ','kurayami':'暗闇','sutan':_0x1c59('0x71'),'nemuri':'眠り','sekika':'石化','konran':'混乱','miryo':'魅了','kyosenshi':_0x1c59('0x72'),'sokushi':'即死','deb_wan':'腕力','deb_tai':'体力','deb_kiyo':_0x1c59('0x73'),'deb_suba':_0x1c59('0x74'),'deb_chi':'知力','deb_sei':'精神','zentai':_0x1c59('0x75'),'tate':_0x1c59('0x76'),'yoko':_0x1c59('0x77'),'mikata':_0x1c59('0x78'),'kin':'近','en':'遠','jishin':'自身','iryoku_e':'E','iryoku_d':'D','iryoku_c':'C','iryoku_b':'B','iryoku_a':'A','iryoku_s':'S','iryoku_ss':'SS','iryoku_sss':_0x1c59('0x79'),'crit_fuyu':'浮遊','crit_fushi':'不死','crit_suise':'水棲','crit_shoku':'植物','crit_mushi':'虫','crit_hone':'骨','crit_gan':'岩石','crit_nin':'人間','crit_jo':'女性','crit_kaeru':_0x1c59('0x7a'),'crit_kemo':'獣','crit_fire':'火精','crit_fish':'魚','crit_devil':'悪魔'};for(let i in color){let c=color[i];optionList[c+'1']=_0x1c59('0x7b')+c+'1';optionList[c+'2']=_0x1c59('0x7b')+c+'2';optionList[c+'3']='skill_'+c+'3';SKILL_NAME_LABEL[c+'1']=color2[i]+'砂';SKILL_NAME_LABEL[c+'2']=color2[i]+'石';SKILL_NAME_LABEL[c+'3']=color2[i]+'宝石';}for(let i=0x1;i<=0x14;i++){optionList['bp'+i]=_0x1c59('0x7c')+i;SKILL_NAME_SEARCH['bp'+i]=i;}for(let key in optionList){skillTypeList[optionList[key]]=[];}read();let SKILL_MASTER_LIST=[];async function read(){let _0xea09ec=readFile(_0x1c59('0x7d'),function(_0x36b2d1){CHAR_MASTER=_0x36b2d1;});let _0xae697=readFile(_0x1c59('0x7e'),function(_0x43b54d){SKILL_MASTER=_0x43b54d;createSkillMasterList(SKILL_MASTER);countSkill(SKILL_MASTER);});let _0xeb75e2=readFile(_0x1c59('0x7f'),function(_0x109d0f){STYLE_MASTER=_0x109d0f;});let _0x3b668b=readFile(_0x1c59('0x80'),function(_0x366667){ABILITY_MASTER=_0x366667;});await Promise[_0x1c59('0x81')]([_0xea09ec,_0xae697,_0xeb75e2,_0x3b668b]);firebase[_0x1c59('0x82')]()[_0x1c59('0x83')]();firebase[_0x1c59('0x82')](appUsers)[_0x1c59('0x83')]();}function filterList(_0x1ddce6,_0x4ab401,_0x3f1597){let _0x29469e=[_0x1c59('0x84'),'PowerGrade',_0x1c59('0x85')][_0x1c59('0x86')](_0x3f1597)>-0x1?!![]:![];if(_0x3f1597===_0x1c59('0x87')){for(let _0x5577f4 in _0x4ab401){_0x4ab401[_0x5577f4]=_0x4ab401[_0x5577f4]===_0x1c59('0x88')?!![]:![];}_0x29469e=!![];}let _0x492b90=[];for(let _0x49ed48 in _0x1ddce6){for(let _0xf30aff of _0x4ab401){if(_0x29469e&&_0x1ddce6[_0x49ed48][_0x3f1597]===_0xf30aff){_0x492b90['push'](_0x1ddce6[_0x49ed48]);}else if(!_0x29469e&&_0x1ddce6[_0x49ed48][_0x3f1597]['indexOf'](_0xf30aff)>-0x1){_0x492b90[_0x1c59('0x89')](_0x1ddce6[_0x49ed48]);}}}return _0x492b90;}$(document)[_0x1c59('0x8a')](function(_0xc3d208){_0xc3d208(_0x1c59('0x8b'))[_0x1c59('0x8c')]();_0xc3d208(_0x1c59('0x8d'))['click'](function(){_0xc3d208(_0x1c59('0x8b'))[_0x1c59('0x8c')]();_0xc3d208(this)['toggleClass']('filterActive');_0xc3d208(_0x1c59('0x8e'))['remove']();_0xc3d208(_0x1c59('0x8f'))[_0x1c59('0x90')]('');let _0x3c100c=SKILL_MASTER_LIST[_0x1c59('0x91')]();let _0x199c57={};let _0x54ae20=[];let _0x166a7b=![];_0xc3d208(_0x1c59('0x8d'))['each'](function(){if(_0xc3d208(this)[_0x1c59('0x92')]('filterActive')){_0x166a7b=!![];let _0x4b6da1=_0xc3d208(this)[_0x1c59('0x93')](_0x1c59('0x94'))['substr'](0x1);let _0x2af79f=_0xc3d208(this)['attr'](_0x1c59('0x94'))[_0x1c59('0x95')](0x7);_0x54ae20[_0x1c59('0x89')](SKILL_NAME_LABEL[_0x2af79f]);let _0x115e64=_0xc3d208(this)['attr'](_0x1c59('0x96'));if(_0x199c57[_0x115e64]===undefined){_0x199c57[_0x115e64]=[];}let _0x22838d=SKILL_NAME_SEARCH[_0x2af79f]!==undefined?SKILL_NAME_SEARCH[_0x2af79f]:_0x2af79f;_0x199c57[_0x115e64]['push'](_0x22838d);}});for(let _0x4cafd1 in _0x199c57){_0x3c100c=filterList(_0x3c100c,_0x199c57[_0x4cafd1],_0x4cafd1);}countSkill(_0x3c100c);_0xc3d208(_0x1c59('0x97'))['text'](_0x54ae20[_0x1c59('0x98')]('&'));_0xc3d208(_0x1c59('0x99'))[_0x1c59('0x8c')]();_0xc3d208(_0x1c59('0x99'))[_0x1c59('0x90')]('');_0xc3d208(_0x1c59('0x9a'))['html']('');_0xc3d208(_0x1c59('0x9b'))['html']('');_0xc3d208('#SKILL_TEXT')[_0x1c59('0x90')]('');if(_0x166a7b){_0xc3d208(_0x1c59('0x8b'))[_0x1c59('0x9c')]();_0x3c100c['sort']((_0xca3c48,_0x4e1271)=>{if(_0xca3c48['ConsumeBp']>_0x4e1271['ConsumeBp']){return-0x1;}else if(_0xca3c48[_0x1c59('0x85')]<_0x4e1271[_0x1c59('0x85')]){return 0x1;}if(_0x4e1271[_0x1c59('0x9d')]==='-'||_0xca3c48[_0x1c59('0x9d')]>_0x4e1271[_0x1c59('0x9d')]){return-0x1;}else if(_0xca3c48[_0x1c59('0x9d')]==='-'||_0xca3c48[_0x1c59('0x9d')]<_0x4e1271[_0x1c59('0x9d')]){return 0x1;}if(_0xca3c48[_0x1c59('0x9e')][_0x1c59('0x9f')]>_0x4e1271['Holders'][_0x1c59('0x9f')]){return-0x1;}});for(let _0x18e5ba in _0x3c100c){_0xc3d208(_0x1c59('0x99'))[_0x1c59('0xa0')](skillLabelDiplay(_0x3c100c[_0x18e5ba]));}_0xc3d208(_0x1c59('0x99'))[_0x1c59('0xa1')](0x12c);}});_0xc3d208(document)['on'](_0x1c59('0xa2'),_0x1c59('0xa3'),function(){var _0x5e989f=_0xc3d208(this)[_0x1c59('0x93')](_0x1c59('0xa4'));displaySkillHolders(_0x5e989f);});});function skillLabelDiplay(_0x247caf){let _0x10378e=$(_0x1c59('0xa5'))['clone']()['attr']('id','')['attr'](_0x1c59('0xa4'),_0x247caf['Id'])[_0x1c59('0xa6')](_0x1c59('0xa7'));_0x10378e[_0x1c59('0xa8')]('.skillNameClass')[_0x1c59('0xa0')]($(_0x1c59('0xa9'))[_0x1c59('0xaa')](_0x1c59('0xab'))[_0x1c59('0xaa')](ICON_LIST[_0x247caf[_0x1c59('0x84')]])[_0x1c59('0xac')]('\u3000'))['append'](_0x247caf[_0x1c59('0xad')]);let _0x163255=KAKUSEI_COLOR[_0x247caf[_0x1c59('0xae')]]+KAKUSEI_ICON[_0x247caf[_0x1c59('0xaf')]];_0x10378e['find'](_0x1c59('0xb0'))[_0x1c59('0xa0')]('覚醒:'+_0x247caf[_0x1c59('0xaf')])[_0x1c59('0xa0')]('\x20<span\x20class=\x22fukidashi\x22\x20style=\x22display:\x20inline-block\x22><span\x20class=\x22icon_'+_0x163255+_0x1c59('0xb1'));let _0x2a2fcf=_0x10378e[_0x1c59('0xa8')](_0x1c59('0xb2'));_0x247caf[_0x1c59('0xb3')][_0x1c59('0xb4')](',')[_0x1c59('0xb5')](function(_0x5b5664){_0x2a2fcf[_0x1c59('0xa0')]($(_0x1c59('0xa9'))[_0x1c59('0xaa')](_0x1c59('0xab'))[_0x1c59('0xaa')](ICON_LIST[_0x5b5664])['text']('\u3000'));});if(_0x247caf[_0x1c59('0xb6')]!=''){_0x2a2fcf[_0x1c59('0xa0')]($(_0x1c59('0xa9'))['addClass']('')[_0x1c59('0xaa')](_0x1c59('0xab'))[_0x1c59('0xaa')](ICON_LIST[_0x247caf[_0x1c59('0xb6')]])[_0x1c59('0xac')]('\u3000'));}if(_0x247caf[_0x1c59('0xb7')]!=''){if(_0x247caf[_0x1c59('0xb7')]==='HP'){_0x2a2fcf['append'](_0x1c59('0xb8'));}else{let _0x4a1316=$(_0x1c59('0xa9'))[_0x1c59('0xaa')](_0x1c59('0xab'))[_0x1c59('0xaa')](ICON_LIST[_0x247caf[_0x1c59('0xb7')]+'上昇'])[_0x1c59('0xac')]('\u3000');_0x2a2fcf[_0x1c59('0xa0')](_0x4a1316);}}if(_0x247caf[_0x1c59('0xb9')]!=''){_0x2a2fcf[_0x1c59('0xa0')]($(_0x1c59('0xa9'))[_0x1c59('0xaa')](_0x1c59('0xab'))[_0x1c59('0xaa')](ICON_LIST[_0x247caf['DeBuff']+'低下'])[_0x1c59('0xac')]('\u3000'));}if(_0x247caf[_0x1c59('0xba')]!=='近'&&_0x247caf[_0x1c59('0xbb')]!==_0x1c59('0x75')){_0x2a2fcf[_0x1c59('0xa0')]('['+_0x247caf[_0x1c59('0xba')]+']');}if(_0x247caf[_0x1c59('0xbb')]!==_0x1c59('0xbc')){_0x2a2fcf[_0x1c59('0xa0')]('['+AREA_SHORT[_0x247caf[_0x1c59('0xbb')]]+']');}if(_0x247caf[_0x1c59('0x87')]){_0x2a2fcf[_0x1c59('0xa0')](_0x1c59('0xbd'));}if(_0x247caf[_0x1c59('0xbe')]){_0x2a2fcf[_0x1c59('0xa0')](_0x1c59('0xbf'));}if(_0x247caf['Delay']){_0x2a2fcf[_0x1c59('0xa0')]('[ディレイ]');}let _0x308ad7=_0x247caf[_0x1c59('0x9d')]===0x0?IRYOKU_LIST[_0x247caf['PowerGrade']]:_0x247caf[_0x1c59('0x9d')];_0x10378e[_0x1c59('0xa8')](_0x1c59('0xc0'))[_0x1c59('0xa0')](_0x1c59('0xc1')+_0x247caf['ConsumeBp'])[_0x1c59('0xa0')](_0x1c59('0xc2')+_0x247caf[_0x1c59('0xc3')]+'('+_0x308ad7+')');let _0x4f0737=_0x10378e[_0x1c59('0xa8')](_0x1c59('0xc4'));for(let _0x3e1d4a in _0x247caf[_0x1c59('0x9e')]){let _0x7186c8=_0x247caf[_0x1c59('0x9e')][_0x3e1d4a];let _0x45ba65=STYLE_MASTER[_0x7186c8];let _0x48c2e1=$(_0x1c59('0xc5'))[_0x1c59('0xaa')](_0x1c59('0xc6'))[_0x1c59('0xaa')](getStyleIconClass(_0x45ba65[_0x1c59('0xc7')]))[_0x1c59('0x93')](_0x1c59('0xc6'),getImgUrl(_0x1c59('0xc8')+_0x7186c8+_0x1c59('0xc9'))+_0x1c59('0xca'))[_0x1c59('0x93')]('data-id',_0x7186c8);let _0x3221a1=$(_0x1c59('0xa9'))['attr'](_0x1c59('0xc6'),_0x1c59('0xcb'))[_0x1c59('0xaa')](getStyleIconBgClass(_0x45ba65[_0x1c59('0xc7')]))[_0x1c59('0xa0')](_0x48c2e1);_0x4f0737['append'](_0x3221a1);}return _0x10378e;}var STYLE_ICON_BG_SIZE='70px\x20!important;';var STYLE_ICON_SIZE='width:70px;height:70px;';function createStyleIcon(_0x118fe7,_0xe36e48){let _0x2474b2=_0x118fe7['Id'];let _0x4a154e=$(_0x1c59('0xc5'))['addClass']('style')['addClass'](getStyleIconClass(_0x118fe7[_0x1c59('0xc7')]))[_0x1c59('0x93')]('style',getImgUrl(_0x1c59('0xc8')+_0x2474b2+_0x1c59('0xc9'))+';\x20'+STYLE_ICON_SIZE+_0x1c59('0xcc')+STYLE_ICON_BG_SIZE)[_0x1c59('0x93')](_0x1c59('0xa4'),_0x2474b2);let _0x566a51=$('<span>')[_0x1c59('0x93')](_0x1c59('0xc6'),STYLE_ICON_SIZE)[_0x1c59('0xaa')](getStyleIconBgClass(_0x118fe7[_0x1c59('0xc7')]))['append'](_0x4a154e);let _0x547413=$('<div>')[_0x1c59('0xaa')]('col-3\x20col-sm-2\x20text-center')[_0x1c59('0xa0')](_0x566a51);if(_0xe36e48[_0x1c59('0x9d')]!=='-'){_0x547413[_0x1c59('0xa0')](_0x1c59('0xcd')+_0x118fe7[_0x1c59('0xce')]+_0x1c59('0xcf'))[_0x1c59('0xa0')]('<div\x20class=\x27style-label\x27>'+_0x118fe7['Name']+_0x1c59('0xd0'));}return _0x547413;}function displaySkillHolders(_0x2b3151){$(_0x1c59('0xd1'))[_0x1c59('0xd2')]({'scrollTop':$('#SKILL_NAME')['offset']()[_0x1c59('0xd3')]});var _0x3039a0=SKILL_MASTER[_0x2b3151];$('#SKILL_NAME')[_0x1c59('0x90')](_0x1c59('0xd4')+_0x3039a0[_0x1c59('0xad')]+_0x1c59('0xd5'));$(_0x1c59('0xd6'))[_0x1c59('0x90')](''+_0x3039a0[_0x1c59('0xd7')]);$(_0x1c59('0x8e'))[_0x1c59('0xd8')]();$(_0x1c59('0x8f'))[_0x1c59('0x90')]('');let _0x1fd223=[];for(key in _0x3039a0[_0x1c59('0x9e')]){let _0x357e69=_0x3039a0[_0x1c59('0x9e')][key];let _0x2240da=STYLE_MASTER[_0x357e69];let _0x1a61e4=CHAR_MASTER[_0x2240da['CharacterId']];let _0x26530e=culcSkillDamageWithStyleBase(_0x1a61e4,_0x2240da,_0x3039a0);_0x26530e=Object[_0x1c59('0xd9')](_0x26530e,_0x2240da);_0x1fd223[_0x1c59('0x89')](_0x26530e);}_0x1fd223[_0x1c59('0xda')]((_0x242206,_0xa93548)=>{if(_0x242206[_0x1c59('0xce')]>_0xa93548[_0x1c59('0xce')]){return-0x1;}return 0x1;});for(key in _0x1fd223){let _0x32944e=_0x1fd223[key];let _0x39c591=createStyleIcon(_0x32944e,_0x3039a0);$(_0x1c59('0x8f'))[_0x1c59('0xa0')](_0x39c591);}let _0x283d5a=[];let _0x5630a6=[];for(key in _0x3039a0[_0x1c59('0x9e')]){let _0x56af65=STYLE_MASTER[_0x3039a0['Holders'][key]];let _0x1a61e4=CHAR_MASTER[_0x56af65[_0x1c59('0xdb')]];for(key in _0x1a61e4['Holders']){let _0x299116=STYLE_MASTER[_0x1a61e4[_0x1c59('0x9e')][key]];if(_0x5630a6['indexOf'](_0x299116['Id'])>-0x1){continue;}_0x5630a6[_0x1c59('0x89')](_0x299116['Id']);let _0x26530e=culcSkillDamageWithStyleBase(_0x1a61e4,_0x299116,_0x3039a0);_0x26530e=Object[_0x1c59('0xd9')](_0x26530e,_0x299116);_0x283d5a[_0x1c59('0x89')](_0x26530e);}}_0x283d5a['sort']((_0xb25d99,_0x3e532)=>{if(_0xb25d99['culcDamage']>_0x3e532[_0x1c59('0xce')]){return-0x1;}return 0x1;});$(_0x1c59('0x9a'))[_0x1c59('0x90')]('');for(key in _0x283d5a){let _0x5ca5ed=_0x283d5a[key];let _0x39c591=createStyleIcon(_0x5ca5ed,_0x3039a0);$(_0x1c59('0x9a'))['append'](_0x39c591);}for(key in _0x1fd223){let _0x48f207=_0x1fd223[key];let _0x357e69=_0x48f207['Id'];let _0x4d147d=getStyleBgColor(_0x48f207[_0x1c59('0xc7')]);let _0x1f0f46=$(_0x1c59('0xdc'))[_0x1c59('0xaa')](_0x4d147d)[_0x1c59('0xaa')](_0x1c59('0xdd'))[_0x1c59('0x93')](_0x1c59('0xc6'),_0x1c59('0xde'));let _0x40c633=$('<td>')[_0x1c59('0xaa')]('text-center');if(_0x3039a0['SkillIryoku']!=='-'){_0x40c633[_0x1c59('0xa0')]('<b>'+_0x48f207[_0x1c59('0xce')][_0x1c59('0xdf')]()+_0x1c59('0xe0'));let _0x34b802=_0x1c59('0xe1')+_0x1c59('0xe2')+_0x48f207['ability']+'%\x20'+_0x48f207[_0x1c59('0xe3')]+':'+_0x48f207[_0x1c59('0xe4')]+_0x1c59('0xe5');_0x40c633[_0x1c59('0xa0')](_0x34b802);}_0x1f0f46[_0x1c59('0xa0')](_0x40c633);_0x1f0f46[_0x1c59('0xa0')](_0x1c59('0xe6')+_0x48f207[_0x1c59('0xad')]+'\x20<small>'+_0x48f207[_0x1c59('0xe7')]+_0x1c59('0xe8'));let _0x52bdb1=$(_0x1c59('0xdc'))[_0x1c59('0xaa')](_0x4d147d);let _0x221b17=$('<td>')[_0x1c59('0xaa')]('text-center');let _0x1cb952=$(_0x1c59('0xc5'))['addClass'](_0x1c59('0xc6'))['addClass'](getStyleIconClass(_0x48f207[_0x1c59('0xc7')]))[_0x1c59('0x93')](_0x1c59('0xc6'),getImgUrl(_0x1c59('0xc8')+_0x357e69+_0x1c59('0xc9')))[_0x1c59('0x93')](_0x1c59('0xa4'),_0x357e69);let _0x1d2d6a=$(_0x1c59('0xa9'))[_0x1c59('0xaa')](getStyleIconBgClass(_0x48f207[_0x1c59('0xc7')]))['attr'](_0x1c59('0xc6'),_0x1c59('0xe9'))['attr'](_0x1c59('0xc6'),'justify-content:\x20space-between;')[_0x1c59('0xa0')](_0x1cb952);_0x221b17['append'](_0x1d2d6a);let _0x4eae82=$(_0x1c59('0xea'))['addClass'](_0x1c59('0xeb'));_0x4eae82['append'](_0x48f207[_0x1c59('0x7e')][_0x1c59('0x98')](_0x1c59('0xec')));let _0x19ed06=[];for(let _0x4e52b1 in _0x48f207[_0x1c59('0xed')]){_0x19ed06[_0x1c59('0x89')](_0x48f207[_0x1c59('0xed')][_0x4e52b1]);}let _0x2b55f5=$(_0x1c59('0xea'))['addClass']('small');_0x2b55f5[_0x1c59('0xa0')](_0x19ed06[_0x1c59('0x98')]('<br>'));_0x52bdb1[_0x1c59('0xa0')](_0x221b17);_0x52bdb1[_0x1c59('0xa0')](_0x4eae82);_0x52bdb1[_0x1c59('0xa0')](_0x2b55f5);$(_0x1c59('0xee'))[_0x1c59('0xa0')](_0x1f0f46)[_0x1c59('0xa0')](_0x52bdb1);}$(_0x1c59('0xef'))[_0x1c59('0xf0')]();}function createSkillMasterList(_0x5ba97f){for(let _0x5786db in _0x5ba97f){if(_0x5ba97f[_0x5786db][_0x1c59('0xbe')]){_0x5ba97f[_0x5786db][_0x1c59('0xf1')]=_0x1c59('0xf2');}else if(_0x5ba97f[_0x5786db][_0x1c59('0xf3')]){_0x5ba97f[_0x5786db][_0x1c59('0xf1')]=_0x1c59('0xf4');}else{_0x5ba97f[_0x5786db][_0x1c59('0xf1')]='';}_0x5ba97f[_0x5786db][_0x1c59('0xf5')]=_0x5ba97f[_0x5786db][_0x1c59('0xae')]+_0x5ba97f[_0x5786db]['Kakusei'];if(_0x5ba97f[_0x5786db][_0x1c59('0x9e')]!==undefined){SKILL_MASTER_LIST[_0x1c59('0x89')](_0x5ba97f[_0x5786db]);}}}function countSkill(_0x374877){let _0xd780bb={};for(let _0x3107af in optionList){_0xd780bb[optionList[_0x3107af]]=[];}for(let _0x458beb in _0x374877){let _0x5ac2df=_0x374877[_0x458beb];if(_0x5ac2df[_0x1c59('0x9e')]!==undefined){_0xd780bb[_0x1c59('0x7c')+_0x5ac2df[_0x1c59('0x85')]][_0x1c59('0x89')](_0x5ac2df);_0xd780bb[optionList[_0x5ac2df[_0x1c59('0x84')]]][_0x1c59('0x89')](_0x5ac2df);_0xd780bb[optionList[_0x5ac2df[_0x1c59('0xbb')]]][_0x1c59('0x89')](_0x5ac2df);_0xd780bb[optionList[_0x5ac2df[_0x1c59('0xba')]]]['push'](_0x5ac2df);_0xd780bb[optionList[_0x5ac2df['KakuseiSozai']+_0x5ac2df[_0x1c59('0xaf')]]][_0x1c59('0x89')](_0x5ac2df);if(_0x5ac2df[_0x1c59('0xf6')]!==''){let _0x15eefc=_0x5ac2df[_0x1c59('0xf6')][_0x1c59('0xb4')](',');for(let _0x4df302 of _0x15eefc){_0xd780bb[optionList[_0x4df302]][_0x1c59('0x89')](_0x5ac2df);}}_0xd780bb[optionList[_0x5ac2df['PowerGrade']]][_0x1c59('0x89')](_0x5ac2df);if(_0x5ac2df['Fast']){_0xd780bb[optionList[_0x1c59('0xf7')]][_0x1c59('0x89')](_0x5ac2df);}if(_0x5ac2df['Delay']){_0xd780bb[optionList[_0x1c59('0xf8')]][_0x1c59('0x89')](_0x5ac2df);}if(_0x5ac2df[_0x1c59('0xb6')]!=''){_0xd780bb[optionList[_0x5ac2df['BadStatus']]][_0x1c59('0x89')](_0x5ac2df);}if(_0x5ac2df['DeBuff']!=''){_0xd780bb[optionList[_0x5ac2df[_0x1c59('0xb9')]]]['push'](_0x5ac2df);}let _0x3ca58a=_0x5ac2df[_0x1c59('0x87')]?'skill_kan':_0x1c59('0x14');_0xd780bb[_0x3ca58a]['push'](_0x5ac2df);let _0x43ee5f=_0x5ac2df[_0x1c59('0xb3')];_0x43ee5f[_0x1c59('0xb4')](',')[_0x1c59('0xb5')](function(_0x107839){_0xd780bb[optionList[_0x107839]][_0x1c59('0x89')](_0x5ac2df);});}}for(let _0x362c76 in optionList){let _0x458beb=optionList[_0x362c76];$(_0x1c59('0xf9')+_0x458beb)[_0x1c59('0xac')](('\x20\x20'+_0xd780bb[_0x458beb][_0x1c59('0x9f')])[_0x1c59('0xfa')](-0x3));}}function sortSkill(_0x348dfb){_0x348dfb[_0x1c59('0xda')](function(_0x6845e7,_0x392947){if(_0x6845e7[_0x1c59('0x9d')]==='-'){return 0x1;}else if(_0x6845e7[_0x1c59('0x9d')]>_0x392947[_0x1c59('0x9d')]){return-0x1;}else if(_0x6845e7[_0x1c59('0x9d')]<_0x392947[_0x1c59('0x9d')]){return 0x1;}else if(_0x6845e7[_0x1c59('0x85')]<_0x392947['ConsumeBp']){return-0x1;}else if(_0x6845e7[_0x1c59('0x85')]>_0x392947[_0x1c59('0x85')]){return 0x1;}else if(_0x6845e7[_0x1c59('0xb3')]>_0x392947[_0x1c59('0xb3')]){return-0x1;}return 0x0;});return _0x348dfb;}$(function(){var _0xeea2ff=![];var _0x51a9f4=$(_0x1c59('0xfb'));_0x51a9f4[_0x1c59('0xfc')](_0x1c59('0xfd'),'-200px');var _0xeea2ff=![];$(window)[_0x1c59('0xfe')](function(){if($(this)['scrollTop']()>0x64){if(_0xeea2ff==![]){_0xeea2ff=!![];_0x51a9f4[_0x1c59('0xff')]()[_0x1c59('0xd2')]({'bottom':_0x1c59('0x100')},0xc8);}}else{if(_0xeea2ff){_0xeea2ff=![];_0x51a9f4[_0x1c59('0xff')]()[_0x1c59('0xd2')]({'bottom':_0x1c59('0x101')},0xc8);}}});_0x51a9f4[_0x1c59('0xa2')](function(){$(_0x1c59('0xd1'))[_0x1c59('0xd2')]({'scrollTop':$(_0x1c59('0x102'))[_0x1c59('0x103')]()['top']});return![];});});
