var _0x4778=['</b>','アビリティ倍率:','ability','culcKey','culcValue','\x22></button>','<td\x20colspan=2>','\x20<small>','AnotherName','</small></td>','text-center','style_icon/','width:80px','justify-content:\x20space-between;','<br>','StyleAbility','[data-toggle=\x22tooltip\x22]','FastDelay','fast','delay','KakuseiSearch','CriticalTargets','ファスト','ディレイ','#count_','slice','#PageTopBtn','css','bottom','-200px','scroll','scrollTop','stop','animate','-10px','skill_dken','skill_ono','skill_sken','skill_yari','skill_yumi','skill_kon','skill_tai','skill_ju','skill_tsue','skill_kin','skill_en','skill_zan','skill_da','skill_rai','skill_in','skill_yo','skill_tantai','skill_yoko','skill_cyoku','skill_kan','skill_jishin','skill_mikata','skill_fast','skill_delay','skill_hi','skill_mizu','skill_kaze','skill_tsuchi','skill_hikari','skill_yami','skill_sutan','skill_sokushi','skill_doku','skill_sekika','skill_miryo','skill_kurayami','skill_deb_wan','skill_deb_tai','skill_deb_kiyo','skill_deb_suba','skill_deb_chi','skill_iryoku_e','skill_iryoku_d','skill_iryoku_b','skill_iryoku_s','skill_iryoku_ss','skill_iryoku_sss','skill_crit_fuyu','skill_crit_fushi','skill_crit_suise','skill_crit_hone','skill_crit_gan','skill_crit_nin','skill_crit_kaeru','skill_crit_kemo','skill_crit_fire','black','blue','green','orange','purple','red','yellow','white','打属性','突属性','熱属性','冷属性','雷属性','陽属性','マヒ付与','睡眠付与','石化付与','混乱付与','狂戦士付与','腕力減少付与','体力減少付与','器用さ減少付与','素早さ減少付与','知力減少付与','縦一列攻撃','横一列攻撃','味方単体対象','近接攻撃','遠距離攻撃','ディレイ効果','技威力[E]','技威力[D]','技威力[C]','技威力[B]','技威力[A]','技威力[S]','技威力[SS]','技威力[SSS]','間接攻撃','直接攻撃','浮遊特効','水棲特効','植物特効','虫特効','骨特効','岩石特効','人間特効','女性特効','カエル特効','獣特効','火精特効','スタン','狂戦士','器用さ','素早さ','敵全体','敵縦一列','敵横一列','味方単体','SSS','カエル','skill_','skill_bp','Char','Skill','Style','Ability','database','goOffline','BattleType','PowerGrade','ConsumeBp','AttackKansetsu','kan','push','ready','hide','._FilterLink','click','.selectJoken','toggleClass','table#skill_holder_table\x20tbody\x20*','remove','#skill_holder_list','concat','each','hasClass','attr','href','substr','data-col','#skill_name_label','text','join','#skillList','html','show','sort','SkillIryoku','Holders','length','append','#SKILL_TEMPLATE','clone','data-id','removeClass','d-none','.skillNameClass','<span>','addClass','icon_sm','Name','KakuseiSozai','Kakusei','find','.skillKakuseiArea','覚醒:','\x22\x20style=\x22width:25px;height:25px;\x20display:\x20inline-block;background-size:\x20contain;\x22>\u3000</span></span>','AttackAttributes','split','forEach','BadStatus','DeBuff','AttackDistance','AttackArea','敵単体','[間接]','Fast','Delay','.iryokuArea','BP:','\x20威力:','.holderStyleArea','<div>','style','Rarity','width:35px;height:35px;','70px\x20!important;','width:70px;height:70px;','.png','col-3\x20col-sm-2\x20text-center','</p>','<div\x20class=\x27style-label\x27>','</div>','html,body','#holder_label','offset','top','CharacterId','assign','culcDamage','indexOf','#skill_damage_ranking','<b>','toLocaleString'];(function(_0x4a4095,_0xc675e4){var _0x311366=function(_0xc91eb4){while(--_0xc91eb4){_0x4a4095['push'](_0x4a4095['shift']());}};_0x311366(++_0xc675e4);}(_0x4778,0x119));var _0x1e05=function(_0x1dd770,_0xebd012){_0x1dd770=_0x1dd770-0x0;var _0x18d1f5=_0x4778[_0x1dd770];return _0x18d1f5;};var SKILL_MASTER,STYLE_MASTER,ABILITY_MASTER,CHAR_MASTER;var skillTypeList={};var optionList={'剣':'skill_ken','大剣':_0x1e05('0x0'),'斧':_0x1e05('0x1'),'小剣':_0x1e05('0x2'),'槍':_0x1e05('0x3'),'弓':_0x1e05('0x4'),'棍棒':_0x1e05('0x5'),'体術':_0x1e05('0x6'),'銃':_0x1e05('0x7'),'杖':_0x1e05('0x8'),'近':_0x1e05('0x9'),'遠':_0x1e05('0xa'),'斬':_0x1e05('0xb'),'突':'skill_totsu','打':_0x1e05('0xc'),'熱':'skill_netsu','冷':'skill_rei','雷':_0x1e05('0xd'),'陰':_0x1e05('0xe'),'陽':_0x1e05('0xf'),'敵単体':_0x1e05('0x10'),'敵縦一列':'skill_tate','敵横一列':_0x1e05('0x11'),'直接':_0x1e05('0x12'),'間接':_0x1e05('0x13'),'敵全体':'skill_zentai','自身':_0x1e05('0x14'),'味方単体':_0x1e05('0x15'),'ファスト':_0x1e05('0x16'),'ディレイ':_0x1e05('0x17'),'火術':_0x1e05('0x18'),'水術':_0x1e05('0x19'),'風術':_0x1e05('0x1a'),'土術':_0x1e05('0x1b'),'光術':_0x1e05('0x1c'),'闇術':_0x1e05('0x1d'),'スタン':_0x1e05('0x1e'),'マヒ':'skill_mahi','即死':_0x1e05('0x1f'),'毒':_0x1e05('0x20'),'石化':_0x1e05('0x21'),'魅了':_0x1e05('0x22'),'眠り':'skill_nemuri','混乱':'skill_konran','狂戦士':'skill_kyosenshi','暗闇':_0x1e05('0x23'),'腕力':_0x1e05('0x24'),'体力':_0x1e05('0x25'),'器用さ':_0x1e05('0x26'),'素早さ':_0x1e05('0x27'),'知力':_0x1e05('0x28'),'精神':'skill_deb_sei','E':_0x1e05('0x29'),'D':_0x1e05('0x2a'),'C':'skill_iryoku_c','B':_0x1e05('0x2b'),'A':'skill_iryoku_a','S':_0x1e05('0x2c'),'SS':_0x1e05('0x2d'),'SSS':_0x1e05('0x2e'),'-':'skill_iryoku_none','浮遊':_0x1e05('0x2f'),'不死':_0x1e05('0x30'),'水棲':_0x1e05('0x31'),'植物':'skill_crit_shoku','虫':'skill_crit_mushi','骨':_0x1e05('0x32'),'岩石':_0x1e05('0x33'),'人間':_0x1e05('0x34'),'女性':'skill_crit_jo','カエル':_0x1e05('0x35'),'獣':_0x1e05('0x36'),'火精':_0x1e05('0x37')};let color=[_0x1e05('0x38'),_0x1e05('0x39'),_0x1e05('0x3a'),_0x1e05('0x3b'),_0x1e05('0x3c'),_0x1e05('0x3d'),_0x1e05('0x3e'),_0x1e05('0x3f')];let color2=['黒','青','緑','橙','紫','赤','黄','白'];var SKILL_NAME_LABEL={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬属性','da':_0x1e05('0x40'),'totsu':_0x1e05('0x41'),'netsu':_0x1e05('0x42'),'rei':_0x1e05('0x43'),'rai':_0x1e05('0x44'),'in':'陰属性','you':_0x1e05('0x45'),'doku':'毒付与','mahi':_0x1e05('0x46'),'kurayami':'暗闇付与','sutan':'スタン付与','nemuri':_0x1e05('0x47'),'sekika':_0x1e05('0x48'),'konran':_0x1e05('0x49'),'miryo':'魅了付与','kyosenshi':_0x1e05('0x4a'),'sokushi':'即死','deb_wan':_0x1e05('0x4b'),'deb_tai':_0x1e05('0x4c'),'deb_kiyo':_0x1e05('0x4d'),'deb_suba':_0x1e05('0x4e'),'deb_chi':_0x1e05('0x4f'),'deb_sei':'精神減少付与','zentai':'全体攻撃','tate':_0x1e05('0x50'),'yoko':_0x1e05('0x51'),'mikata':_0x1e05('0x52'),'kin':_0x1e05('0x53'),'en':_0x1e05('0x54'),'jishin':'自身が対象','fast':'ファスト効果','delay':_0x1e05('0x55'),'iryoku_e':_0x1e05('0x56'),'iryoku_d':_0x1e05('0x57'),'iryoku_c':_0x1e05('0x58'),'iryoku_b':_0x1e05('0x59'),'iryoku_a':_0x1e05('0x5a'),'iryoku_s':_0x1e05('0x5b'),'iryoku_ss':_0x1e05('0x5c'),'iryoku_sss':_0x1e05('0x5d'),'kan':_0x1e05('0x5e'),'cyoku':_0x1e05('0x5f'),'crit_fuyu':_0x1e05('0x60'),'crit_fushi':'不死特効','crit_suise':_0x1e05('0x61'),'crit_shoku':_0x1e05('0x62'),'crit_mushi':_0x1e05('0x63'),'crit_hone':_0x1e05('0x64'),'crit_gan':_0x1e05('0x65'),'crit_nin':_0x1e05('0x66'),'crit_jo':_0x1e05('0x67'),'crit_kaeru':_0x1e05('0x68'),'crit_kemo':_0x1e05('0x69'),'crit_fire':_0x1e05('0x6a')};var SKILL_NAME_SEARCH={'ken':'剣','dken':'大剣','ono':'斧','yari':'槍','sken':'小剣','yumi':'弓','kon':'棍棒','tai':'体術','ju':'銃','hi':'火術','mizu':'水術','kaze':'風術','tsuchi':'土術','hikari':'光術','yami':'闇術','zan':'斬','da':'打','totsu':'突','netsu':'熱','rei':'冷','rai':'雷','in':'陰','yo':'陽','doku':'毒','mahi':'マヒ','kurayami':'暗闇','sutan':_0x1e05('0x6b'),'nemuri':'眠り','sekika':'石化','konran':'混乱','miryo':'魅了','kyosenshi':_0x1e05('0x6c'),'sokushi':'即死','deb_wan':'腕力','deb_tai':'体力','deb_kiyo':_0x1e05('0x6d'),'deb_suba':_0x1e05('0x6e'),'deb_chi':'知力','deb_sei':'精神','zentai':_0x1e05('0x6f'),'tate':_0x1e05('0x70'),'yoko':_0x1e05('0x71'),'mikata':_0x1e05('0x72'),'kin':'近','en':'遠','jishin':'自身','iryoku_e':'E','iryoku_d':'D','iryoku_c':'C','iryoku_b':'B','iryoku_a':'A','iryoku_s':'S','iryoku_ss':'SS','iryoku_sss':_0x1e05('0x73'),'crit_fuyu':'浮遊','crit_fushi':'不死','crit_suise':'水棲','crit_shoku':'植物','crit_mushi':'虫','crit_hone':'骨','crit_gan':'岩石','crit_nin':'人間','crit_jo':'女性','crit_kaeru':_0x1e05('0x74'),'crit_kemo':'獣','crit_fire':'火精'};for(let i in color){let c=color[i];optionList[c+'1']=_0x1e05('0x75')+c+'1';optionList[c+'2']='skill_'+c+'2';optionList[c+'3']=_0x1e05('0x75')+c+'3';SKILL_NAME_LABEL[c+'1']=color2[i]+'砂';SKILL_NAME_LABEL[c+'2']=color2[i]+'石';SKILL_NAME_LABEL[c+'3']=color2[i]+'宝石';}for(let i=0x3;i<=0x10;i++){optionList['bp'+i]=_0x1e05('0x76')+i;SKILL_NAME_SEARCH['bp'+i]=i;}for(let key in optionList){skillTypeList[optionList[key]]=[];}read();let SKILL_MASTER_LIST=[];async function read(){let _0x2d2dca=readFile(_0x1e05('0x77'),function(_0x50ed){CHAR_MASTER=_0x50ed;});let _0x40ac0c=readFile(_0x1e05('0x78'),function(_0x2669c4){SKILL_MASTER=_0x2669c4;createSkillMasterList(SKILL_MASTER);countSkill(SKILL_MASTER);});let _0x1f9851=readFile(_0x1e05('0x79'),function(_0x215e7d){STYLE_MASTER=_0x215e7d;});let _0x5bcb1c=readFile(_0x1e05('0x7a'),function(_0x3f0b97){ABILITY_MASTER=_0x3f0b97;});await Promise['all']([_0x2d2dca,_0x40ac0c,_0x1f9851,_0x5bcb1c]);firebase[_0x1e05('0x7b')]()[_0x1e05('0x7c')]();firebase[_0x1e05('0x7b')](appUsers)[_0x1e05('0x7c')]();}function filterList(_0x1188cb,_0x45c200,_0x216f7f){let _0x4d12cc=[_0x1e05('0x7d'),_0x1e05('0x7e'),_0x1e05('0x7f')]['indexOf'](_0x216f7f)>-0x1?!![]:![];if(_0x216f7f===_0x1e05('0x80')){for(let _0x304d52 in _0x45c200){_0x45c200[_0x304d52]=_0x45c200[_0x304d52]===_0x1e05('0x81')?!![]:![];}_0x4d12cc=!![];}let _0x345d6d=[];for(let _0x131df3 in _0x1188cb){for(let _0x189673 of _0x45c200){if(_0x4d12cc&&_0x1188cb[_0x131df3][_0x216f7f]===_0x189673){_0x345d6d[_0x1e05('0x82')](_0x1188cb[_0x131df3]);}else if(!_0x4d12cc&&_0x1188cb[_0x131df3][_0x216f7f]['indexOf'](_0x189673)>-0x1){_0x345d6d[_0x1e05('0x82')](_0x1188cb[_0x131df3]);}}}return _0x345d6d;}$(document)[_0x1e05('0x83')](function(_0x10d9ee){_0x10d9ee('.selectJoken')[_0x1e05('0x84')]();_0x10d9ee(_0x1e05('0x85'))[_0x1e05('0x86')](function(){_0x10d9ee(_0x1e05('0x87'))[_0x1e05('0x84')]();_0x10d9ee(this)[_0x1e05('0x88')]('filterActive');_0x10d9ee(_0x1e05('0x89'))[_0x1e05('0x8a')]();_0x10d9ee(_0x1e05('0x8b'))['html']('');let _0x411ed4=SKILL_MASTER_LIST[_0x1e05('0x8c')]();let _0x271d91={};let _0x2fb1cf=[];let _0x6d974d=![];_0x10d9ee(_0x1e05('0x85'))[_0x1e05('0x8d')](function(){if(_0x10d9ee(this)[_0x1e05('0x8e')]('filterActive')){_0x6d974d=!![];let _0x262a29=_0x10d9ee(this)[_0x1e05('0x8f')](_0x1e05('0x90'))['substr'](0x1);let _0x1d3990=_0x10d9ee(this)['attr']('href')[_0x1e05('0x91')](0x7);_0x2fb1cf[_0x1e05('0x82')](SKILL_NAME_LABEL[_0x1d3990]);let _0x21eb3f=_0x10d9ee(this)[_0x1e05('0x8f')](_0x1e05('0x92'));if(_0x271d91[_0x21eb3f]===undefined){_0x271d91[_0x21eb3f]=[];}let _0x388736=SKILL_NAME_SEARCH[_0x1d3990]!==undefined?SKILL_NAME_SEARCH[_0x1d3990]:_0x1d3990;_0x271d91[_0x21eb3f][_0x1e05('0x82')](_0x388736);}});for(let _0x39cf50 in _0x271d91){_0x411ed4=filterList(_0x411ed4,_0x271d91[_0x39cf50],_0x39cf50);}_0x10d9ee(_0x1e05('0x93'))[_0x1e05('0x94')](_0x2fb1cf[_0x1e05('0x95')]('&'));_0x10d9ee(_0x1e05('0x96'))[_0x1e05('0x84')]();_0x10d9ee(_0x1e05('0x96'))[_0x1e05('0x97')]('');_0x10d9ee('#skill_damage_ranking')[_0x1e05('0x97')]('');countSkill(_0x411ed4);if(_0x6d974d){_0x10d9ee(_0x1e05('0x87'))[_0x1e05('0x98')]();_0x411ed4[_0x1e05('0x99')]((_0x1dd62b,_0x474df8)=>{if(_0x1dd62b[_0x1e05('0x7f')]>_0x474df8[_0x1e05('0x7f')]){return-0x1;}else if(_0x474df8['SkillIryoku']==='-'||_0x1dd62b['SkillIryoku']>_0x474df8['SkillIryoku']){return-0x1;}else if(_0x1dd62b[_0x1e05('0x9a')]==='-'||_0x1dd62b[_0x1e05('0x9a')]<_0x474df8[_0x1e05('0x9a')]){return 0x1;}else if(_0x1dd62b[_0x1e05('0x9b')][_0x1e05('0x9c')]>_0x474df8[_0x1e05('0x9b')]['length']){return-0x1;}return 0x1;});for(let _0x57e06c in _0x411ed4){_0x10d9ee(_0x1e05('0x96'))[_0x1e05('0x9d')](skillLabelDiplay(_0x411ed4[_0x57e06c]));}_0x10d9ee(_0x1e05('0x96'))['slideDown'](0x12c);}});_0x10d9ee(document)['on'](_0x1e05('0x86'),'.skill_select',function(){var _0x3ee912=_0x10d9ee(this)[_0x1e05('0x8f')]('data-id');displaySkillHolders(_0x3ee912);});});function skillLabelDiplay(_0x16a463){let _0x27abbb=$(_0x1e05('0x9e'))[_0x1e05('0x9f')]()[_0x1e05('0x8f')]('id','')[_0x1e05('0x8f')](_0x1e05('0xa0'),_0x16a463['Id'])[_0x1e05('0xa1')](_0x1e05('0xa2'));_0x27abbb['find'](_0x1e05('0xa3'))[_0x1e05('0x9d')]($(_0x1e05('0xa4'))[_0x1e05('0xa5')](_0x1e05('0xa6'))[_0x1e05('0xa5')](ICON_LIST[_0x16a463[_0x1e05('0x7d')]])[_0x1e05('0x94')]('\u3000'))[_0x1e05('0x9d')](_0x16a463[_0x1e05('0xa7')]);let _0x337c82=KAKUSEI_COLOR[_0x16a463[_0x1e05('0xa8')]]+KAKUSEI_ICON[_0x16a463[_0x1e05('0xa9')]];_0x27abbb[_0x1e05('0xaa')](_0x1e05('0xab'))[_0x1e05('0x9d')](_0x1e05('0xac')+_0x16a463[_0x1e05('0xa9')])['append']('\x20<span\x20class=\x22fukidashi\x22\x20style=\x22display:\x20inline-block\x22><span\x20class=\x22icon_'+_0x337c82+_0x1e05('0xad'));let _0x3f3677=_0x27abbb[_0x1e05('0xaa')]('.iconArea');_0x16a463[_0x1e05('0xae')][_0x1e05('0xaf')](',')[_0x1e05('0xb0')](function(_0x3637b5){_0x3f3677[_0x1e05('0x9d')]($(_0x1e05('0xa4'))[_0x1e05('0xa5')](_0x1e05('0xa6'))[_0x1e05('0xa5')](ICON_LIST[_0x3637b5])[_0x1e05('0x94')]('\u3000'));});if(_0x16a463[_0x1e05('0xb1')]!=''){_0x3f3677[_0x1e05('0x9d')]($(_0x1e05('0xa4'))[_0x1e05('0xa5')]('')[_0x1e05('0xa5')](_0x1e05('0xa6'))[_0x1e05('0xa5')](ICON_LIST[_0x16a463[_0x1e05('0xb1')]])[_0x1e05('0x94')]('\u3000'));}if(_0x16a463[_0x1e05('0xb2')]!=''){_0x3f3677[_0x1e05('0x9d')]($(_0x1e05('0xa4'))[_0x1e05('0xa5')](_0x1e05('0xa6'))['addClass'](ICON_LIST[_0x16a463[_0x1e05('0xb2')]+'低下'])[_0x1e05('0x94')]('\u3000'));}if(_0x16a463[_0x1e05('0xb3')]!=='近'&&_0x16a463['AttackArea']!==_0x1e05('0x6f')){_0x3f3677[_0x1e05('0x9d')]('['+_0x16a463[_0x1e05('0xb3')]+']');}if(_0x16a463[_0x1e05('0xb4')]!==_0x1e05('0xb5')){_0x3f3677[_0x1e05('0x9d')]('['+AREA_SHORT[_0x16a463[_0x1e05('0xb4')]]+']');}if(_0x16a463[_0x1e05('0x80')]){_0x3f3677['append'](_0x1e05('0xb6'));}if(_0x16a463[_0x1e05('0xb7')]){_0x3f3677[_0x1e05('0x9d')]('[ファスト]');}if(_0x16a463[_0x1e05('0xb8')]){_0x3f3677[_0x1e05('0x9d')]('[ディレイ]');}_0x27abbb[_0x1e05('0xaa')](_0x1e05('0xb9'))[_0x1e05('0x9d')](_0x1e05('0xba')+_0x16a463[_0x1e05('0x7f')])[_0x1e05('0x9d')](_0x1e05('0xbb')+_0x16a463[_0x1e05('0x7e')]+'('+_0x16a463[_0x1e05('0x9a')]+')');let _0x5bcf36=_0x27abbb[_0x1e05('0xaa')](_0x1e05('0xbc'));for(let _0x36622a in _0x16a463['Holders']){let _0x566eed=_0x16a463[_0x1e05('0x9b')][_0x36622a];let _0x262bd1=STYLE_MASTER[_0x566eed];let _0x40f8a0=$(_0x1e05('0xbd'))[_0x1e05('0xa5')](_0x1e05('0xbe'))[_0x1e05('0xa5')](getStyleIconClass(_0x262bd1[_0x1e05('0xbf')]))[_0x1e05('0x8f')]('style',getImgUrl('style_icon/'+_0x566eed+'.png')+';\x20width:35px;height:35px;\x20background-size:\x2035px\x20!important;')['attr']('data-id',_0x566eed);let _0xceaea=$('<span>')[_0x1e05('0x8f')](_0x1e05('0xbe'),_0x1e05('0xc0'))[_0x1e05('0xa5')](getStyleIconBgClass(_0x262bd1[_0x1e05('0xbf')]))[_0x1e05('0x9d')](_0x40f8a0);_0x5bcf36[_0x1e05('0x9d')](_0xceaea);}return _0x27abbb;}var STYLE_ICON_BG_SIZE=_0x1e05('0xc1');var STYLE_ICON_SIZE=_0x1e05('0xc2');function createStyleIcon(_0x3df369,_0x5a04f4){let _0x3c74f2=_0x3df369['Id'];let _0x21affc=$(_0x1e05('0xbd'))[_0x1e05('0xa5')](_0x1e05('0xbe'))['addClass'](getStyleIconClass(_0x3df369[_0x1e05('0xbf')]))[_0x1e05('0x8f')](_0x1e05('0xbe'),getImgUrl('style_icon/'+_0x3c74f2+_0x1e05('0xc3'))+';\x20'+STYLE_ICON_SIZE+'\x20background-size:\x20'+STYLE_ICON_BG_SIZE)['attr'](_0x1e05('0xa0'),_0x3c74f2);let _0x294d7d=$(_0x1e05('0xa4'))['attr'](_0x1e05('0xbe'),STYLE_ICON_SIZE)[_0x1e05('0xa5')](getStyleIconBgClass(_0x3df369[_0x1e05('0xbf')]))[_0x1e05('0x9d')](_0x21affc);let _0x1b807c=$(_0x1e05('0xbd'))['addClass'](_0x1e05('0xc4'))[_0x1e05('0x9d')](_0x294d7d);if(_0x5a04f4['SkillIryoku']!=='-'){_0x1b807c[_0x1e05('0x9d')]('<p\x20class=\x27pad0\x20damage-label\x27>ダメージ\x20'+_0x3df369['culcDamage']+_0x1e05('0xc5'))[_0x1e05('0x9d')](_0x1e05('0xc6')+_0x3df369['Name']+_0x1e05('0xc7'));}return _0x1b807c;}function displaySkillHolders(_0x35e1f6){$(_0x1e05('0xc8'))['animate']({'scrollTop':$(_0x1e05('0xc9'))[_0x1e05('0xca')]()[_0x1e05('0xcb')]});var _0x523089=SKILL_MASTER[_0x35e1f6];$(_0x1e05('0x89'))[_0x1e05('0x8a')]();$('#skill_holder_list')[_0x1e05('0x97')]('');let _0x26d2bf=[];for(key in _0x523089['Holders']){let _0x455196=_0x523089[_0x1e05('0x9b')][key];let _0x15f61b=STYLE_MASTER[_0x455196];let _0x4fa84d=CHAR_MASTER[_0x15f61b[_0x1e05('0xcc')]];let _0x2542e1=culcSkillDamageWithStyleBase(_0x4fa84d,_0x15f61b,_0x523089);_0x2542e1=Object[_0x1e05('0xcd')](_0x2542e1,_0x15f61b);_0x26d2bf[_0x1e05('0x82')](_0x2542e1);}_0x26d2bf[_0x1e05('0x99')]((_0x17034e,_0x4ae7bc)=>{if(_0x17034e['culcDamage']>_0x4ae7bc[_0x1e05('0xce')]){return-0x1;}return 0x1;});for(key in _0x26d2bf){let _0x2df1bb=_0x26d2bf[key];let _0x1c08d1=createStyleIcon(_0x2df1bb,_0x523089);$(_0x1e05('0x8b'))['append'](_0x1c08d1);}let _0x1883da=[];let _0x4f13bd=[];for(key in _0x523089[_0x1e05('0x9b')]){let _0xef9198=STYLE_MASTER[_0x523089[_0x1e05('0x9b')][key]];let _0x4fa84d=CHAR_MASTER[_0xef9198[_0x1e05('0xcc')]];for(key in _0x4fa84d[_0x1e05('0x9b')]){let _0x5439c8=STYLE_MASTER[_0x4fa84d['Holders'][key]];if(_0x4f13bd[_0x1e05('0xcf')](_0x5439c8['Id'])>-0x1){continue;}_0x4f13bd[_0x1e05('0x82')](_0x5439c8['Id']);let _0x2542e1=culcSkillDamageWithStyleBase(_0x4fa84d,_0x5439c8,_0x523089);_0x2542e1=Object[_0x1e05('0xcd')](_0x2542e1,_0x5439c8);_0x1883da[_0x1e05('0x82')](_0x2542e1);}}_0x1883da[_0x1e05('0x99')]((_0x2b55e3,_0x409cc9)=>{if(_0x2b55e3[_0x1e05('0xce')]>_0x409cc9[_0x1e05('0xce')]){return-0x1;}return 0x1;});$(_0x1e05('0xd0'))[_0x1e05('0x97')]('');for(key in _0x1883da){let _0x33fda9=_0x1883da[key];let _0x1c08d1=createStyleIcon(_0x33fda9,_0x523089);$(_0x1e05('0xd0'))[_0x1e05('0x9d')](_0x1c08d1);}for(key in _0x26d2bf){let _0x4354f4=_0x26d2bf[key];let _0x455196=_0x4354f4['Id'];let _0x3d3d8a=getStyleBgColor(_0x4354f4[_0x1e05('0xbf')]);let _0x521fbf=$('<tr>')[_0x1e05('0xa5')](_0x3d3d8a)[_0x1e05('0xa5')]('darkButton')[_0x1e05('0x8f')](_0x1e05('0xbe'),'border:initial;');let _0x1345f1=$('<td>')['addClass']('text-center');if(_0x523089[_0x1e05('0x9a')]!=='-'){_0x1345f1['append'](_0x1e05('0xd1')+_0x4354f4[_0x1e05('0xce')][_0x1e05('0xd2')]()+_0x1e05('0xd3'));let _0x29b296='<button\x20class=\x22icon_info\x22\x20data-toggle=\x22tooltip\x22\x20data-placement=\x22top\x22\x20title=\x22'+_0x1e05('0xd4')+_0x4354f4[_0x1e05('0xd5')]+'%\x20'+_0x4354f4[_0x1e05('0xd6')]+':'+_0x4354f4[_0x1e05('0xd7')]+_0x1e05('0xd8');_0x1345f1[_0x1e05('0x9d')](_0x29b296);}_0x521fbf[_0x1e05('0x9d')](_0x1345f1);_0x521fbf[_0x1e05('0x9d')](_0x1e05('0xd9')+_0x4354f4[_0x1e05('0xa7')]+_0x1e05('0xda')+_0x4354f4[_0x1e05('0xdb')]+_0x1e05('0xdc'));let _0x2d61af=$('<tr>')[_0x1e05('0xa5')](_0x3d3d8a);let _0x5bd01d=$('<td>')[_0x1e05('0xa5')](_0x1e05('0xdd'));let _0x4bf2c1=$(_0x1e05('0xbd'))[_0x1e05('0xa5')](_0x1e05('0xbe'))[_0x1e05('0xa5')](getStyleIconClass(_0x4354f4['Rarity']))[_0x1e05('0x8f')](_0x1e05('0xbe'),getImgUrl(_0x1e05('0xde')+_0x455196+_0x1e05('0xc3')))[_0x1e05('0x8f')]('data-id',_0x455196);let _0x317bdd=$(_0x1e05('0xa4'))[_0x1e05('0xa5')](getStyleIconBgClass(_0x4354f4['Rarity']))[_0x1e05('0x8f')](_0x1e05('0xbe'),_0x1e05('0xdf'))['attr'](_0x1e05('0xbe'),_0x1e05('0xe0'))[_0x1e05('0x9d')](_0x4bf2c1);_0x5bd01d[_0x1e05('0x9d')](_0x317bdd);let _0x3ccd1f=$('<td>')[_0x1e05('0xa5')]('small');_0x3ccd1f[_0x1e05('0x9d')](_0x4354f4[_0x1e05('0x78')][_0x1e05('0x95')](_0x1e05('0xe1')));let _0x216d8b=[];for(let _0x1895f9 in _0x4354f4[_0x1e05('0xe2')]){_0x216d8b[_0x1e05('0x82')](_0x4354f4[_0x1e05('0xe2')][_0x1895f9]);}let _0x5cd9b8=$('<td>')[_0x1e05('0xa5')]('small');_0x5cd9b8[_0x1e05('0x9d')](_0x216d8b[_0x1e05('0x95')](_0x1e05('0xe1')));_0x2d61af[_0x1e05('0x9d')](_0x5bd01d);_0x2d61af[_0x1e05('0x9d')](_0x3ccd1f);_0x2d61af['append'](_0x5cd9b8);$('table#skill_holder_table\x20tbody')[_0x1e05('0x9d')](_0x521fbf)[_0x1e05('0x9d')](_0x2d61af);}$(_0x1e05('0xe3'))['tooltip']();}function createSkillMasterList(_0x1d558c){for(let _0x370ce6 in _0x1d558c){if(_0x1d558c[_0x370ce6][_0x1e05('0xb7')]){_0x1d558c[_0x370ce6][_0x1e05('0xe4')]=_0x1e05('0xe5');}else if(_0x1d558c[_0x370ce6][_0x1e05('0xb8')]){_0x1d558c[_0x370ce6]['FastDelay']=_0x1e05('0xe6');}else{_0x1d558c[_0x370ce6]['FastDelay']='';}_0x1d558c[_0x370ce6][_0x1e05('0xe7')]=_0x1d558c[_0x370ce6][_0x1e05('0xa8')]+_0x1d558c[_0x370ce6][_0x1e05('0xa9')];if(_0x1d558c[_0x370ce6][_0x1e05('0x9b')]!==undefined){SKILL_MASTER_LIST[_0x1e05('0x82')](_0x1d558c[_0x370ce6]);}}}function countSkill(_0x294e3f){let _0x1ee545={};for(let _0x23b35d in optionList){_0x1ee545[optionList[_0x23b35d]]=[];}for(let _0x3f941d in _0x294e3f){let _0x5632d0=_0x294e3f[_0x3f941d];if(_0x5632d0[_0x1e05('0x9b')]!==undefined){_0x1ee545[_0x1e05('0x76')+_0x5632d0[_0x1e05('0x7f')]][_0x1e05('0x82')](_0x5632d0);_0x1ee545[optionList[_0x5632d0[_0x1e05('0x7d')]]][_0x1e05('0x82')](_0x5632d0);_0x1ee545[optionList[_0x5632d0[_0x1e05('0xb4')]]][_0x1e05('0x82')](_0x5632d0);_0x1ee545[optionList[_0x5632d0[_0x1e05('0xb3')]]][_0x1e05('0x82')](_0x5632d0);_0x1ee545[optionList[_0x5632d0[_0x1e05('0xa8')]+_0x5632d0['Kakusei']]]['push'](_0x5632d0);if(_0x5632d0[_0x1e05('0xe8')]!==''){let _0x3ad0a2=_0x5632d0[_0x1e05('0xe8')][_0x1e05('0xaf')](',');for(let _0x352712 of _0x3ad0a2){_0x1ee545[optionList[_0x352712]][_0x1e05('0x82')](_0x5632d0);}}_0x1ee545[optionList[_0x5632d0[_0x1e05('0x7e')]]][_0x1e05('0x82')](_0x5632d0);if(_0x5632d0['Fast']){_0x1ee545[optionList[_0x1e05('0xe9')]]['push'](_0x5632d0);}if(_0x5632d0['Delay']){_0x1ee545[optionList[_0x1e05('0xea')]]['push'](_0x5632d0);}if(_0x5632d0[_0x1e05('0xb1')]!=''){_0x1ee545[optionList[_0x5632d0[_0x1e05('0xb1')]]][_0x1e05('0x82')](_0x5632d0);}if(_0x5632d0[_0x1e05('0xb2')]!=''){_0x1ee545[optionList[_0x5632d0[_0x1e05('0xb2')]]][_0x1e05('0x82')](_0x5632d0);}let _0x50497d=_0x5632d0[_0x1e05('0x80')]?_0x1e05('0x13'):'skill_cyoku';_0x1ee545[_0x50497d][_0x1e05('0x82')](_0x5632d0);let _0x32425b=_0x5632d0[_0x1e05('0xae')];_0x32425b[_0x1e05('0xaf')](',')[_0x1e05('0xb0')](function(_0x58a8cf){_0x1ee545[optionList[_0x58a8cf]]['push'](_0x5632d0);});}}for(let _0x15b088 in optionList){let _0x3f941d=optionList[_0x15b088];$(_0x1e05('0xeb')+_0x3f941d)[_0x1e05('0x94')](('\x20\x20'+_0x1ee545[_0x3f941d][_0x1e05('0x9c')])[_0x1e05('0xec')](-0x3));}}function sortSkill(_0x238c50){_0x238c50[_0x1e05('0x99')](function(_0x21fd91,_0x4a3083){if(_0x21fd91[_0x1e05('0x9a')]==='-'){return 0x1;}else if(_0x21fd91['SkillIryoku']>_0x4a3083[_0x1e05('0x9a')]){return-0x1;}else if(_0x21fd91[_0x1e05('0x9a')]<_0x4a3083[_0x1e05('0x9a')]){return 0x1;}else if(_0x21fd91[_0x1e05('0x7f')]<_0x4a3083['ConsumeBp']){return-0x1;}else if(_0x21fd91[_0x1e05('0x7f')]>_0x4a3083[_0x1e05('0x7f')]){return 0x1;}else if(_0x21fd91[_0x1e05('0xae')]>_0x4a3083[_0x1e05('0xae')]){return-0x1;}return 0x0;});return _0x238c50;}$(function(){var _0x375d6f=![];var _0x4dbf6e=$(_0x1e05('0xed'));_0x4dbf6e[_0x1e05('0xee')](_0x1e05('0xef'),_0x1e05('0xf0'));var _0x375d6f=![];$(window)[_0x1e05('0xf1')](function(){if($(this)[_0x1e05('0xf2')]()>0x64){if(_0x375d6f==![]){_0x375d6f=!![];_0x4dbf6e[_0x1e05('0xf3')]()[_0x1e05('0xf4')]({'bottom':_0x1e05('0xf5')},0xc8);}}else{if(_0x375d6f){_0x375d6f=![];_0x4dbf6e['stop']()['animate']({'bottom':'-200px'},0xc8);}}});_0x4dbf6e[_0x1e05('0x86')](function(){$(_0x1e05('0xc8'))[_0x1e05('0xf4')]({'scrollTop':$('#weponLabel')[_0x1e05('0xca')]()[_0x1e05('0xcb')]});return![];});});
