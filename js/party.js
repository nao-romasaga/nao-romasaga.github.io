const _0x2579=['char-loser2','icon_btn_on','show','.SUM','2章VH2以降','background:\x20url(','width','#dot','Seicho','filter','Fix','#STYLE_SEICHO','.tab-content','.filterList','val','status-bgcolor','icon/icon_base_','charInput','編成中','.yubi','cancel','#NOW_PARTYNUM','btmdot','database','css','each','#QUEST_CHOISE','.SIMPLE_HIDE','#PARTY','modal\x200.5s\x20forwards','remove','dot','fadeOut','#allParamConfirm','slideToggle','#_icon_toku','clone','substr','.baseDispChange','removeAttr','<img\x20src=\x22','.CHAR_DOT','slideDown','Holders','遠征がおすすめだよ','.questList','goOnline','STYLE_SEICHO','.style','getMonth','find','まで</div>','[data-toggle=\x22tooltip\x22]','.dot','#SHOW_ONLY_CHOISE','change','style_cutin/','limit','click','status_plus','.modalClose','#footer_left','data-charId','showModal','HP:\x20','.paramButton','.inputArea','animate','char-aruku-left2','#CHAR_TEMPLATE_PARENT','.char-aruku-left2','AVG','#SHOW_ONLY_MYSTYLE_INFO','.PARENT_TABLE','ready','.dot-base-circle','.fButton','save','data-styleId','icon_nocheck','getTime','.png','#footer_right','SIMPLE_MODE','getHours','hasClass','#NOW_QUEST','VH15以降','\x22\x20style=\x22height:10px;\x22>','.initialShow','filterActive','icon_btn_off','trigger','#modal01','WeaponType','indexOf','.allparams','icon_btn_positive','start','.series-button','TwitterAuthProvider','DISPLAY/PARTY','この内容を反映してもよろしいですか？','.icon_btn_positive','.char','PARTY','が入力されました<br>','.INPUT_DISP_CHANGE','slice','getDate','.charTable','https://nao-romasaga.github.io/party.html','fa-toggle-on','.charUnset','<div>','.charTmpl','splice','.FOOTER_CLOSE_ARROW','char-winner','scroll','SUM','hide','\x20体力:','#btmdot','data-pm','floor','\x22\x20style=\x22position:absolute;\x20left:0;\x20top:\x200px;\x20height:22px\x22>','scrollLeft','#SHOW_ONLY_MYSTYLE','<br>','.DISP_TABLE','#SHOW_SIMPLE_DISPLAY','icon/icon_ind_','offset','INPUT_AREA','#allParamConfirmInner','.styleInfoArea','append','#CHAR_CHOISE','Rarity','.limit','push','Series','length','data-href','2章VH5以降','html','.IKKATSU_INFO','swing','CHAR','#JINKEI','.fas','partyNowStyle','fuchidori-yellow\x20kari-bgcolor','NOWHP','2章VH4以降','.LIMIT','.BASE_HP','.ICON_TD','DotId','status_minus','新外伝1以降','fuchidori-blue\x20fix-bgcolor','getMinutes','toLowerCase','.NOW_BASE','#loginInfo','modalClose\x200.5s\x20forwards','.btn_close','SEL','ONLY_MYSTYLE','display:\x20block;','data-input','.charTableParent','RECO','#PARTY_FOOTER','.tabArea','<img\x20class=\x22\x22\x20src=\x22','slideUp','#CHAR_TEMPLATE','.hanei','Limit',')\x20no-repeat;\x20position:\x20relative;','icon/icon_','addClass','.CHAR_STATUS','toggleClass','NOW','all','2章VH3以降','.AVG','.isLogin','char-winner2','removeClass','partyOtherStyle','icon_btn_negative','.dotList\x20.dot-base','before','.fukidashiInput','.CHAR_SAVE','VH14以降','parent','.baseValue','.CHECK_COVER','#float-footer','top','char','#quest','#FOOTER_CHAR','.RECO','腕力:\x20','#LIMIT_TEMPLATE','.openMenu','partyOtherStyle\x20','charTmpl','text','ID4e2c8','dot/','style','split','fa-toggle-off','parents','data-param','fast','attr','.style_icon_bg_base','animation','saveChar','tooltip','#firebaseui-auth-container','\x20margin-left:0px;\x20position:\x20relative;','auth','.initialHide','.charParam','.noLogin','Name','PROVIDER_ID','.openMenu,\x20.nowData\x20>\x20td','data-charid','d-none','\x20魅力:','html,body','event','AuthUI','pop','\x20素早さ:','party','#allSubmit','LIMIT\x20limit','SIM','data-id','Ind','器用さ:\x20'];(function(_0x4f9ea1,_0x25794c){const _0x5b6750=function(_0x2f9ad3){while(--_0x2f9ad3){_0x4f9ea1['push'](_0x4f9ea1['shift']());}};_0x5b6750(++_0x25794c);}(_0x2579,0x1b2));const _0x5b67=function(_0x4f9ea1,_0x25794c){_0x4f9ea1=_0x4f9ea1-0x0;let _0x5b6750=_0x2579[_0x4f9ea1];return _0x5b6750;};var BASE_SKILL_LIST=[],USE_SKILL_LIST=[],NOW_CHAR={},NOW_CHAR_ID='',NOW_STYLE={},MY_STYLE=[],IS_SET_MY_STYLE=![],IS_SHOW_MY_STYLE=!![],IS_SIMPLE_MODE=![],IS_SHOW_ONLY_CHOISE_STYLE=![],NOW_PARTY=0x0,PARTY_LIST=[[]],BASE=LIMIT_BASE,BASE_HP=(BASE+0x1a)*0xa,UID,dotStyle=_0x5b67('0x31'),DISPLAY_OPTION={'Q':'','BS':'','RE':0x1,'SIM':0x0,'SEL':0x0},DISP_UPDATE_FLG=![];function _noLoginInitial(){var _0x23b21e={'signInSuccessUrl':_0x5b67('0xb7'),'signInOptions':[firebase[_0x5b67('0x32')][_0x5b67('0xac')][_0x5b67('0x37')]]},_0x187572=new firebaseui[(_0x5b67('0x32'))][(_0x5b67('0x3e'))](firebase[_0x5b67('0x32')](appUsers));_0x187572[_0x5b67('0xaa')](_0x5b67('0x30'),_0x23b21e);}async function _initial(){$(_0x5b67('0x35'))[_0x5b67('0xc1')](),$(_0x5b67('0xa'))[_0x5b67('0xc')](_0x5b67('0x3a')),$(_0x5b67('0xee'))['hide'](),loginCard(_0x5b67('0x30')),await init();}async function init(){let _0x373151=readUserData('STYLECHECK',function(_0x2e5faf){let _0x16c36d=_0x2e5faf===null||_0x2e5faf['A']===undefined?[]:_0x2e5faf['A'],_0x5196f3=_0x2e5faf===null||_0x2e5faf['S']===undefined?[]:_0x2e5faf['S'],_0x1872d7=_0x2e5faf===null||_0x2e5faf['SS']===undefined?[]:_0x2e5faf['SS'];MY_STYLE=_0x16c36d['concat'](_0x5196f3)['concat'](_0x1872d7);}),_0x163cf5=readUserData(_0x5b67('0xb1'),async function(_0x1e2edb){_0x1e2edb===null?PARTY_LIST=[[]]:(PARTY_LIST=_0x1e2edb,$(_0x5b67('0x5d'))[_0x5b67('0x22')](PARTY_LIST[NOW_PARTY]['length']));}),_0xbee8d6=readUserData(_0x5b67('0xad'),async function(_0x340ac9){_0x340ac9!==null&&(DISPLAY_OPTION=_0x340ac9);});updateDisplayDB(),dispChar2(CHAR_MASTER),$(_0x5b67('0x64'))[_0x5b67('0x4a')](),$(_0x5b67('0x7c'))[_0x5b67('0x2f')](),await Promise[_0x5b67('0x7')]([_0x163cf5,_0x373151,_0xbee8d6]),IS_SET_MY_STYLE=MY_STYLE[_0x5b67('0xd7')]>0x0;IS_SET_MY_STYLE?(IS_SHOW_MY_STYLE=!![],$(_0x5b67('0x90'))['hide']()):(IS_SHOW_MY_STYLE=![],$(_0x5b67('0xc8'))[_0x5b67('0xc1')]());if(PARTY_LIST===null){DISP_UPDATE_FLG=!![];return;}await renderParty(),$(_0x5b67('0x33'))['removeClass']('d-none'),$('.questList')[_0x5b67('0xfa')](),$('.questListNow')['slideDown'](),$(_0x5b67('0xa1'))[_0x5b67('0xfa')]();var _0x25cbbe=new Date(),_0xfe928f=Math[_0x5b67('0xc5')](_0x25cbbe[_0x5b67('0x98')]()/0x3e8);for(var _0x5eea3c in EVENT_ABILITY){if(_0x5eea3c>_0xfe928f){var _0x288167=new Date(_0x5eea3c*0x3e8),_0x2641b9=_0x288167[_0x5b67('0x79')]()+0x1,_0x75ff7d=_0x288167[_0x5b67('0xb5')](),_0x3e0894=('0'+_0x288167[_0x5b67('0x9c')]())[_0x5b67('0xb4')](-0x2),_0x18822b=('0'+_0x288167[_0x5b67('0xeb')]())[_0x5b67('0xb4')](-0x2),_0x2365e1=$(_0x5b67('0xba'))[_0x5b67('0xd1')]('<div>'+_0x2641b9+'/'+_0x75ff7d+'\x20'+_0x3e0894+':'+_0x18822b+_0x5b67('0x7b'));$(_0x5b67('0x6b'))['append'](_0x2365e1);for(var _0xe8f112 of EVENT_ABILITY[_0x5eea3c]){$(_0x5b67('0x6b'))[_0x5b67('0xd1')]($('.'+_0xe8f112)['first']()[_0x5b67('0x14')]()['clone']());}}}setDisplayOption(),setLimitData();}function setDisplayOption(){DISPLAY_OPTION['Q']!==''&&($(_0x5b67('0x6e'))[_0x5b67('0x61')](function(){if($(this)[_0x5b67('0x2b')](_0x5b67('0x45'))==DISPLAY_OPTION['Q'])return $(this)[_0x5b67('0xa4')]('click'),![];}),DISPLAY_OPTION['BS']!==''&&$(_0x5b67('0x1a')+DISPLAY_OPTION['Q'])[_0x5b67('0x7a')](_0x5b67('0x15'))[_0x5b67('0x61')](function(){if($(this)['attr'](_0x5b67('0x45'))==DISPLAY_OPTION['BS'])return $(this)[_0x5b67('0xa4')](_0x5b67('0x82')),![];})),DISPLAY_OPTION['RE']===0x0&&$('#SHOW_ONLY_MYSTYLE')[_0x5b67('0xa4')](_0x5b67('0x82')),DISPLAY_OPTION[_0x5b67('0xf1')]===0x1&&$(_0x5b67('0x7e'))[_0x5b67('0xa4')]('click'),DISPLAY_OPTION[_0x5b67('0x44')]===0x1&&$(_0x5b67('0xcb'))[_0x5b67('0xa4')](_0x5b67('0x82')),DISP_UPDATE_FLG=!![];}$(document)[_0x5b67('0x92')](function(_0x49815b){_0x49815b(_0x5b67('0x85'))['hide'](),_0x49815b('#footer_right')[_0x5b67('0xc1')](),_0x49815b(_0x5b67('0x55'))[_0x5b67('0x82')](function(){_0x49815b('.dotList')[_0x5b67('0x3')](_0x5b67('0x3a'));let _0x2ed3b8=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0xd8'));_0x49815b('#'+_0x2ed3b8)[_0x5b67('0xc')]('d-none'),!_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0x94'))[_0x5b67('0x9d')]('filterActive')&&(_0x49815b(_0x5b67('0x55'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0x7a')]('.fButton')[_0x5b67('0xc')](_0x5b67('0xa2'));}),_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0x94'))[_0x5b67('0x5')](_0x5b67('0xa2')));}),initialHide(),_0x49815b(_0x5b67('0x54'))['on'](_0x5b67('0x82'),function(){}),_0x49815b(_0x5b67('0x85'))['click'](function(){_0x49815b(_0x5b67('0xf7'))['animate']({'scrollLeft':0x0},_0x5b67('0x2a'),'swing');}),_0x49815b('#footer_right')[_0x5b67('0x82')](function(){var _0x47e649=_0x49815b(_0x5b67('0xf7'))[_0x5b67('0x4e')](),_0x4d5eb6=Math[_0x5b67('0xc5')](_0x47e649/0x3c),_0x4eca98=PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')],_0x9f0fab=(_0x4eca98-_0x4d5eb6)*0x3c;_0x49815b('#PARTY_FOOTER')['animate']({'scrollLeft':_0x9f0fab},_0x5b67('0x2a'),_0x5b67('0xdc'));}),_0x49815b(_0x5b67('0xf7'))[_0x5b67('0xbf')](function(){var _0x3bf41c=_0x49815b(_0x5b67('0xf7'))[_0x5b67('0x4e')](),_0x1b702b=Math[_0x5b67('0xc5')](_0x3bf41c/0x3c),_0x1ffe6d=PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')],_0x5ed6c0=(_0x1ffe6d-_0x1b702b-0x1)*0x3c;_0x49815b(this)[_0x5b67('0xc7')]()<0x14?_0x49815b(_0x5b67('0x85'))[_0x5b67('0xc1')]():_0x49815b(_0x5b67('0x85'))[_0x5b67('0x4a')](),_0x49815b(this)[_0x5b67('0xc7')]()>_0x5ed6c0?_0x49815b(_0x5b67('0x9a'))['hide']():_0x49815b(_0x5b67('0x9a'))[_0x5b67('0x4a')]();}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0xb3'),function(){_0x49815b(this)['toggleClass'](_0x5b67('0x49')),_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0xa3')),_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0xdf'))[_0x5b67('0x5')]('fa-toggle-on')['toggleClass'](_0x5b67('0x27')),_0x49815b(this)[_0x5b67('0x28')](_0x5b67('0x8a'))[_0x5b67('0x7a')]('.DISP_VERTICAL')['toggleClass'](_0x5b67('0x3a')),_0x49815b(this)[_0x5b67('0x28')](_0x5b67('0x8a'))[_0x5b67('0x7a')](_0x5b67('0xca'))[_0x5b67('0x5')]('d-none');}),_0x49815b(document)['on'](_0x5b67('0x82'),'.btmdot',function(){var _0x58c4c7=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'));if(DISPLAY_OPTION[_0x5b67('0x44')]===0x1){var _0x349330=_0x49815b(_0x5b67('0x4f')+_0x58c4c7)['parents'](_0x5b67('0xf5'))[_0x5b67('0x7a')](_0x5b67('0x4'));_0x49815b(_0x5b67('0x3c'))[_0x5b67('0x8b')]({'scrollTop':_0x349330[_0x5b67('0xcd')]()[_0x5b67('0x18')]-0x28},0x1f4,'swing');}else _0x49815b(_0x5b67('0x3c'))[_0x5b67('0x8b')]({'scrollTop':_0x49815b(_0x5b67('0x4f')+_0x58c4c7)[_0x5b67('0xcd')]()[_0x5b67('0x18')]},0x1f4,'swing');}),_0x49815b(document)['on']('click','#FOOTER_CLOSE',function(){_0x49815b(_0x5b67('0xbd'))[_0x5b67('0x5')](_0x5b67('0x3a')),_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0xa9'))[_0x5b67('0x5')](_0x5b67('0xe')),_0x49815b('#FOOTER_PARTY')[_0x5b67('0x6a')]();}),_0x49815b(document)['on'](_0x5b67('0x82'),'#FOOTER_QUEST',function(){_0x49815b('html,body')[_0x5b67('0x8b')]({'scrollTop':_0x49815b(_0x5b67('0x62'))[_0x5b67('0xcd')]()[_0x5b67('0x18')]},0x1f4,_0x5b67('0xdc'));}),_0x49815b(document)['on']('click',_0x5b67('0x1b'),function(){_0x49815b(_0x5b67('0x3c'))[_0x5b67('0x8b')]({'scrollTop':_0x49815b(_0x5b67('0xd2'))[_0x5b67('0xcd')]()[_0x5b67('0x18')]},0x1f4,_0x5b67('0xdc'));}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0xc8'),function(){_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0xf2')),_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0x49')),_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0xa3')),_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0xdf'))['toggleClass']('fa-toggle-on')['toggleClass'](_0x5b67('0x27')),_0x49815b(this)[_0x5b67('0x9d')](_0x5b67('0xf2'))?IS_SHOW_MY_STYLE=!![]:IS_SHOW_MY_STYLE=![],DISPLAY_OPTION['RE']=Number(IS_SHOW_MY_STYLE),updateDisplayDB(),_0x2b5321();}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0x7e'),function(){_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0x9b')),_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0x49')),_0x49815b(this)[_0x5b67('0x5')]('icon_btn_off'),_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0xdf'))[_0x5b67('0x5')]('fa-toggle-on')[_0x5b67('0x5')](_0x5b67('0x27')),_0x49815b(this)[_0x5b67('0x9d')]('SIMPLE_MODE')?IS_SHOW_ONLY_CHOISE_STYLE=!![]:IS_SHOW_ONLY_CHOISE_STYLE=![],DISPLAY_OPTION['SEL']=Number(IS_SHOW_ONLY_CHOISE_STYLE),updateDisplayDB(),_0x2b5321();});function _0x2b5321(){var _0x172622=[];_0x49815b(_0x5b67('0xe4'))[_0x5b67('0x61')](function(){var _0x6332f7=_0x49815b(this)[_0x5b67('0x2b')]('data-styleid');if(!IS_SHOW_MY_STYLE&&!IS_SHOW_ONLY_CHOISE_STYLE)return _0x49815b(this)['removeClass'](_0x5b67('0x3a')),!![];if(IS_SHOW_MY_STYLE&&MY_STYLE['indexOf'](_0x6332f7)==-0x1)_0x49815b(this)[_0x5b67('0x3')](_0x5b67('0x3a')),_0x172622[_0x5b67('0xd5')](_0x6332f7);else IS_SHOW_ONLY_CHOISE_STYLE&&_0x49815b(this)[_0x5b67('0x9d')](_0x5b67('0xd'))?_0x49815b(this)['addClass'](_0x5b67('0x3a')):_0x49815b(this)[_0x5b67('0xc')](_0x5b67('0x3a'));}),_0x49815b(_0x5b67('0x2c'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0xc')](_0x5b67('0x3a'));var _0x5ade5e=_0x49815b(this)[_0x5b67('0x2b')]('data-id');_0x172622[_0x5b67('0xa7')](_0x5ade5e)>-0x1&&_0x49815b(this)[_0x5b67('0x3')]('d-none');});}_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0xcb'),function(){_0x49815b(this)[_0x5b67('0x5')](_0x5b67('0x9b')),_0x49815b(this)[_0x5b67('0x5')]('icon_btn_on'),_0x49815b(this)[_0x5b67('0x5')]('icon_btn_off'),_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0xdf'))[_0x5b67('0x5')](_0x5b67('0xb8'))[_0x5b67('0x5')]('fa-toggle-off'),_0x49815b(this)[_0x5b67('0x9d')](_0x5b67('0x9b'))?IS_SIMPLE_MODE=!![]:IS_SIMPLE_MODE=![],DISPLAY_OPTION[_0x5b67('0x44')]=Number(IS_SIMPLE_MODE),updateDisplayDB(),IS_SIMPLE_MODE?_0x49815b(_0x5b67('0x63'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0x3')](_0x5b67('0x3a'));}):_0x49815b(_0x5b67('0x63'))[_0x5b67('0x61')](function(){_0x49815b(this)['removeClass'](_0x5b67('0x3a'));});}),_0x49815b(document)['on']('click',_0x5b67('0x12'),function(){let _0xedb904=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'));_0x49815b(this)[_0x5b67('0xc')](_0x5b67('0xa9'))[_0x5b67('0x3')](_0x5b67('0xe')),_0x49815b(this)[_0x5b67('0xfa')](0xc8,function(){_0x49815b(this)['slideDown'](0xc8),updateDB(_0xedb904),saveCharData(_0xedb904);});}),_0x49815b(document)['on']('click',_0x5b67('0x89'),function(){let _0x1c7797=_0x49815b(this)['parent']()['find'](_0x5b67('0x34')),_0x4663ed=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0xc4'))==='plus'?0x1:-0x1,_0x5a45ed=_0x1c7797[_0x5b67('0x56')](),_0x325baf=Number(_0x5a45ed)+_0x4663ed;_0x1c7797[_0x5b67('0x56')](_0x325baf),updateDisplayStatus(_0x49815b(this),_0x325baf);}),_0x49815b(document)['on'](_0x5b67('0x7f'),_0x5b67('0x34'),function(){var _0x2fbbb3=_0x49815b(this)[_0x5b67('0x56')]();_0x49815b(this)[_0x5b67('0x56')](Number(_0x2fbbb3)),updateDisplayStatus(_0x49815b(this),_0x49815b(this)[_0x5b67('0x56')]());}),_0x49815b(_0x5b67('0x7c'))[_0x5b67('0x2f')](),_0x49815b(document)['on']('click',_0x5b67('0x38'),function(){let _0x8b8545=_0x49815b(this)['attr'](_0x5b67('0x45'))!==undefined?_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45')):_0x49815b(this)[_0x5b67('0x14')]()[_0x5b67('0x2b')](_0x5b67('0x45'));NOW_CHAR=CHAR_MASTER[_0x8b8545],_0x49815b(_0x5b67('0xb6'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x39'))!==_0x8b8545&&_0x49815b(this)['find'](_0x5b67('0x11'))[_0x5b67('0xfa')]();});let _0x1c1ce1=_0x49815b(_0x5b67('0xbb')+_0x8b8545)[_0x5b67('0x7a')]('.fukidashiInput')['attr'](_0x5b67('0x25'));_0x1c1ce1===_0x5b67('0xf3')&&saveCharData(_0x8b8545),_0x49815b('.charTmpl'+_0x8b8545)[_0x5b67('0x7a')](_0x5b67('0x11'))[_0x5b67('0x6a')](0xfa);}),_0x49815b(document)['on']('click',_0x5b67('0xf0'),function(){closeInput(_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45')),!![]);}),_0x49815b(document)['on'](_0x5b67('0x82'),'#PARTY_RESET',function(){var _0x3bb95a=[];for(let _0x310a46 in PARTY_LIST[NOW_PARTY]){var _0x5b1fb9=PARTY_LIST[NOW_PARTY][_0x310a46][_0x5b67('0x19')];_0x3bb95a[_0x5b67('0xd5')](_0x5b1fb9);}for(_0x5b1fb9 of _0x3bb95a){charUnset(_0x5b1fb9);}}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0xb9'),function(){let _0x44b135=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'));charUnset(_0x44b135);}),_0x49815b(document)['on']('click',_0x5b67('0xfc'),function(){showModal(_0x49815b(this)['parents'](_0x5b67('0x91'))[_0x5b67('0x7a')](_0x5b67('0xa8')));}),_0x49815b(document)['on'](_0x5b67('0x7f'),_0x5b67('0xa8'),function(){showModal(_0x49815b(this));}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0xf'),async function(){firebase[_0x5b67('0x5f')]()[_0x5b67('0x76')](),firebase[_0x5b67('0x5f')](appUsers)[_0x5b67('0x76')]();let _0x44a7ea=_0x49815b(this)['find'](_0x5b67('0xb0'))[_0x5b67('0x2b')](_0x5b67('0x45')),_0x325aed=getCharFromPartyList(_0x44a7ea);if(PARTY_LIST[NOW_PARTY]['length']>=PARTY_LIMIT||_0x325aed!==-0x1){while(PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')]>PARTY_LIMIT){let _0xc59d1=PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')],_0x1f979c=PARTY_LIST[NOW_PARTY][_0xc59d1-0x1][_0x5b67('0x19')];charUnset(_0x1f979c),PARTY_LIST[NOW_PARTY][_0x5b67('0x3f')]();}_0x49815b(this)[_0x5b67('0x7a')](_0x5b67('0xb0'))[_0x5b67('0xc')](_0x5b67('0x8c'))[_0x5b67('0xc')](_0x5b67('0xb'))[_0x5b67('0x3')](_0x5b67('0x48'));return;}NOW_CHAR['Id']!==undefined&&closeInput(NOW_CHAR['Id'],!![]),NOW_CHAR=CHAR_MASTER[_0x44a7ea],_0x49815b('#NOW_PARTYNUM')[_0x5b67('0x22')](PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')]+0x1),_0x49815b(_0x5b67('0xd0'))[_0x5b67('0x4a')](),selectDotHensei(NOW_CHAR),readUserDataWithId(_0x5b67('0xdd'),_0x44a7ea,async function(_0x24845e){await displayCharInfo(CHAR_MASTER[_0x44a7ea],_0x24845e);var _0x29238a=NOW_CHAR[_0x5b67('0x73')][0x0];for(var _0x29238a of NOW_CHAR[_0x5b67('0x73')]){if(IS_SHOW_MY_STYLE){if(MY_STYLE['indexOf'](_0x29238a)>-0x1){NOW_STYLE=STYLE_MASTER[_0x29238a];break;}}else{NOW_STYLE=STYLE_MASTER[_0x29238a];break;}}await displayStyleInfo(NOW_CHAR['Id'],_0x29238a),PARTY_LIST[NOW_PARTY][_0x5b67('0xd5')]({'char':_0x44a7ea,'style':_0x29238a});var _0x2835ea=_0x49815b(_0x5b67('0xf7'))[_0x5b67('0x4e')](),_0x374d9c=Math[_0x5b67('0xc5')](_0x2835ea/0x3c),_0x38a434=PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')];_0x38a434>_0x374d9c&&_0x49815b(_0x5b67('0x9a'))[_0x5b67('0x4a')](),_0x49815b('.charTmpl'+_0x44a7ea)['find'](_0x5b67('0x8a'))[_0x5b67('0xc')]('d-none')[_0x5b67('0x72')](0x1f4),setLimitData(_0x44a7ea),updatePartyDB();}),_0x49815b('[data-toggle=\x22tooltip\x22]')[_0x5b67('0x2f')]();}),_0x49815b(document)['on'](_0x5b67('0x82'),_0x5b67('0x78'),async function(){let _0x320d79=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'));NOW_STYLE=STYLE_MASTER[_0x320d79],await displayStyleInfo(NOW_CHAR['Id'],_0x320d79);let _0x521156=getCharFromPartyList(NOW_CHAR['Id']);PARTY_LIST[NOW_PARTY][_0x521156][_0x5b67('0x25')]=_0x320d79,updatePartyDB();}),_0x49815b(_0x5b67('0x84'))[_0x5b67('0x82')](function(){if(_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'))==='ok'){gtag(_0x5b67('0x3d'),_0x5b67('0x87'),{'event_category':_0x5b67('0x41'),'event_label':_0x5b67('0x95'),'value':0x1});let _0x320eaa=_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x86')),_0x20a759=splitParam(_0x49815b(this)[_0x5b67('0x2b')]('data-input'),0x0);for(let _0x95d8ef in _0x20a759){_0x49815b('.charInput'+PARAM_KEY_HP[_0x95d8ef]+_0x320eaa)[_0x5b67('0x61')](function(_0x20b78e,_0x3cda47){_0x49815b(_0x3cda47)[_0x5b67('0x56')](_0x20a759[_0x95d8ef]);}),_0x49815b(_0x5b67('0xb0')+PARAM_KEY_HP[_0x95d8ef]+_0x320eaa)[_0x5b67('0x61')](function(_0x44749d,_0x15b9de){_0x49815b(_0x15b9de)[_0x5b67('0x22')](_0x20a759[_0x95d8ef]);});}updateDB();}else gtag('event','showModal',{'event_category':_0x5b67('0x41'),'event_label':_0x5b67('0x5c'),'value':0x1});return _0x49815b(_0x5b67('0xa5'))[_0x5b67('0x68')](),_0x49815b(_0x5b67('0xcf'))[_0x5b67('0x60')](_0x5b67('0x2d'),_0x5b67('0xef')),![];}),_0x49815b('.baseDispChange')[_0x5b67('0x82')](function(){_0x49815b(_0x5b67('0x6e'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0xc')](_0x5b67('0x49')),_0x49815b(this)[_0x5b67('0x3')]('icon_btn_off');}),_0x49815b(this)[_0x5b67('0xc')](_0x5b67('0xa3')),_0x49815b(this)[_0x5b67('0x3')](_0x5b67('0x49')),questId=Number(_0x49815b(this)['attr']('data-id')),DISPLAY_OPTION['Q']=questId,updateDisplayDB(),_0x49815b(_0x5b67('0x75'))[_0x5b67('0xfa')](),_0x49815b(_0x5b67('0x1a')+questId)[_0x5b67('0x72')]();}),_0x49815b('.baseValue')[_0x5b67('0x82')](function(){_0x49815b(_0x5b67('0x15'))[_0x5b67('0x61')](function(){_0x49815b(this)[_0x5b67('0xc')]('icon_btn_on'),_0x49815b(this)['addClass']('icon_btn_off');}),_0x49815b(this)['removeClass'](_0x5b67('0xa3')),_0x49815b(this)[_0x5b67('0x3')](_0x5b67('0x49')),BASE=Number(_0x49815b(this)[_0x5b67('0x2b')](_0x5b67('0x45'))),BASE_HP=(BASE+0x1a)*0xa,DISPLAY_OPTION['BS']=BASE,updateDisplayDB(),setLimitData(),_0x49815b(_0x5b67('0x9e'))[_0x5b67('0x22')](_0x49815b(this)[_0x5b67('0x22')]()+('\x20(HP'+BASE_HP+')')),_0x49815b('.BASE_HP')[_0x5b67('0x22')](BASE_HP),_0x49815b(_0x5b67('0xed'))[_0x5b67('0x22')](BASE);});});async function renderParty(){let _0x3456f8=0x0;PARTY_LIST[0x0]=PARTY_LIST[0x0][_0x5b67('0x51')](_0x14296e=>CHAR_MASTER[_0x14296e[_0x5b67('0x19')]]!==undefined);let _0x2c58cc=PARTY_LIST[0x0][_0x3456f8],_0x1c4617=0x0,_0xf2524a=[];while(_0x2c58cc!==undefined){let _0x3366f5=_0x2c58cc[_0x5b67('0x19')],_0x51d111=_0x2c58cc[_0x5b67('0x25')];NOW_CHAR=CHAR_MASTER[_0x3366f5],selectDotHensei(CHAR_MASTER[_0x3366f5]);let _0x11c603=asyncReadUserDataWithId('CHAR',_0x3366f5,async function(_0xa6d3ff){await displayCharInfo(CHAR_MASTER[_0x3366f5],_0xa6d3ff),await displayStyleInfo(_0x3366f5,_0x51d111);if(_0x1c4617===PARTY_LIST[0x0]['length']){}closeInput(_0x3366f5,![]);});_0xf2524a[_0x5b67('0xd5')](_0x11c603),_0x2c58cc=PARTY_LIST[0x0][++_0x3456f8];}var _0x196d42=$(_0x5b67('0xf7'))[_0x5b67('0x4e')](),_0x4ff424=Math[_0x5b67('0xc5')](_0x196d42/0x3c),_0x1a4d01=PARTY_LIST[0x0][_0x5b67('0xd7')];_0x1a4d01>_0x4ff424&&$('#footer_right')['show'](),await Promise[_0x5b67('0x7')](_0xf2524a);}function closeInput(_0x484aa2,_0x4e275d=![]){$(_0x5b67('0xbb')+_0x484aa2)[_0x5b67('0x7a')]('.fukidashiInput')[_0x5b67('0xfa')](0xfa),_0x4e275d&&saveCharData(_0x484aa2);}function updateDisplayStatus(_0x740b3b,_0x2c73b0){var _0x1984a1=_0x740b3b[_0x5b67('0x28')](_0x5b67('0xb6'))[_0x5b67('0x7a')](_0x5b67('0x12'));_0x1984a1[_0x5b67('0xc')](_0x5b67('0xe'))[_0x5b67('0x3')](_0x5b67('0xa9'));let _0x56d67c=_0x740b3b[_0x5b67('0x28')](_0x5b67('0xb6')),_0x44ce74=_0x56d67c[_0x5b67('0x2b')]('data-charid'),_0x13c073=_0x740b3b[_0x5b67('0x2b')](_0x5b67('0x29'));$('.char'+_0x13c073+_0x44ce74)[_0x5b67('0x61')](function(){$(this)[_0x5b67('0x22')](_0x2c73b0);}),$('.charInput'+_0x13c073+_0x44ce74)[_0x5b67('0x61')](function(){$(this)[_0x5b67('0x56')](_0x2c73b0);}),updateDB(_0x44ce74);}function charUnset(_0x26dfb5){let _0x37bdcd=CHAR_MASTER[_0x26dfb5];selectDotReset(_0x37bdcd),$(_0x5b67('0xbb')+_0x26dfb5)[_0x5b67('0x28')](_0x5b67('0xf5'))[_0x5b67('0xfa')](0x1f4,function(){$(_0x5b67('0x64'))[_0x5b67('0x7a')](_0x5b67('0xbb')+_0x26dfb5)['parents']('.charTableParent')[_0x5b67('0x66')]();}),$(_0x5b67('0x17'))['find'](_0x5b67('0xc3')+_0x26dfb5)[_0x5b67('0x14')]()[_0x5b67('0x66')](),$(_0x5b67('0xde')+_0x26dfb5)[_0x5b67('0x66')]();let _0x3b30c8=getCharFromPartyList(_0x26dfb5);_0x3b30c8!==-0x1&&(PARTY_LIST[NOW_PARTY][_0x5b67('0xbc')](_0x3b30c8,0x1),$(_0x5b67('0x5d'))[_0x5b67('0x22')](PARTY_LIST[NOW_PARTY]['length']));updatePartyDB(),saveCharData(_0x26dfb5);var _0x5cb49d=$(_0x5b67('0xf7'))[_0x5b67('0x4e')](),_0x204d35=Math[_0x5b67('0xc5')](_0x5cb49d/0x3c),_0x3a55cf=PARTY_LIST[NOW_PARTY][_0x5b67('0xd7')];_0x3a55cf<=_0x204d35&&($('#footer_left')[_0x5b67('0xc1')](),$('#footer_right')[_0x5b67('0xc1')]());}function getCharFromPartyList(_0x4947f1){for(let _0x4c4105 in PARTY_LIST[NOW_PARTY]){if(PARTY_LIST[NOW_PARTY][_0x4c4105][_0x5b67('0x19')]===_0x4947f1)return _0x4c4105;}return-0x1;}function updateDB(_0x45cf01){let _0x4ea268=_0x45cf01===undefined?NOW_CHAR['Id']:_0x45cf01;for(let _0x5194a0 of PARAM_KEY_HP){let _0x569286=$(_0x5b67('0xb0')+_0x5194a0+_0x4ea268)['first']()[_0x5b67('0x22')]();CHAR_MASTER[_0x4ea268][_0x5b67('0x6')+_0x5194a0]=Number(_0x569286);}NOW_CHAR_ID!==_0x4ea268&&(NOW_CHAR_ID!==''&&saveCharData(NOW_CHAR_ID),NOW_CHAR_ID=_0x4ea268),setLimitData(_0x4ea268);}function updatePartyDB(){updateData(_0x5b67('0xb1'),PARTY_LIST);}function updateDisplayDB(){DISP_UPDATE_FLG&&updateData('DISPLAY/PARTY',DISPLAY_OPTION);}function showModal(_0x2d5b46){gtag(_0x5b67('0x3d'),'showModal',{'event_category':_0x5b67('0x41'),'event_label':_0x5b67('0x4a'),'value':0x1}),$(_0x5b67('0x42'))[_0x5b67('0x2b')](_0x5b67('0xf4'),$(_0x2d5b46)[_0x5b67('0x56')]()),$(_0x5b67('0x42'))[_0x5b67('0x2b')](_0x5b67('0x86'),$(_0x2d5b46)[_0x5b67('0x2b')](_0x5b67('0x45')));let _0x171229=splitParam($(_0x2d5b46)['val'](),'不明'),_0x2dcc09='';return _0x2dcc09+=_0x5b67('0x88')+_0x171229[0x0]+'<br>',_0x2dcc09+=_0x5b67('0x1d')+_0x171229[0x1]+_0x5b67('0xc2')+_0x171229[0x2]+_0x5b67('0xc9'),_0x2dcc09+=_0x5b67('0x47')+_0x171229[0x3]+_0x5b67('0x40')+_0x171229[0x4]+_0x5b67('0xc9'),_0x2dcc09+='知力:\x20'+_0x171229[0x5]+'\x20精神:'+_0x171229[0x6]+_0x5b67('0xc9'),_0x2dcc09+='\u3000愛:\x20'+_0x171229[0x7]+_0x5b67('0x3b')+_0x171229[0x8]+_0x5b67('0xc9'),_0x2dcc09+=_0x5b67('0xb2'),_0x2dcc09+=_0x5b67('0xae'),$(_0x5b67('0x69'))[_0x5b67('0xda')](_0x2dcc09),$('#modal01')['fadeIn'](),$(_0x5b67('0xcf'))['css'](_0x5b67('0x2d'),_0x5b67('0x65')),![];}function setLimitData(_0xafece5=undefined){$(_0x5b67('0xe4'))[_0x5b67('0x61')](function(){let _0x1105b9=$(this)[_0x5b67('0x2b')](_0x5b67('0x96')),_0x1b81a0=STYLE_MASTER[_0x1105b9],_0x53c906=$(_0x5b67('0xd4')+_0x1105b9),_0x26acfe=_0x53c906[_0x5b67('0x2b')](_0x5b67('0x86'));if(_0xafece5!==undefined&&_0x26acfe!=_0xafece5)return!![];let _0x50d936=0x0;for(let _0x387252 of PARAM_KEY){let _0x19fe6e=_0x1b81a0[_0x5b67('0x0')+_0x387252],_0x55f619=CHAR_MASTER[_0x26acfe][_0x5b67('0x6')+_0x387252]!==undefined?CHAR_MASTER[_0x26acfe][_0x5b67('0x6')+_0x387252]:CHAR_MASTER[_0x26acfe][_0x387252];_0x50d936+=_0x55f619;let _0x1f2ab5=_0x1b81a0[_0x5b67('0x0')+_0x387252]!==0x63?BASE+Number(_0x19fe6e)-Number(_0x55f619):'?';_0x53c906[_0x5b67('0x7a')]('.'+_0x387252)[_0x5b67('0x61')](function(){$(this)[_0x5b67('0xc')](_0x5b67('0x83'))['removeClass'](_0x5b67('0xe8'));if(_0x1f2ab5==='?')$(this)[_0x5b67('0x3')]('status_question');else{if(_0x1f2ab5>0x0)$(this)[_0x5b67('0x3')](_0x5b67('0x83'));else _0x1f2ab5<0x0&&$(this)[_0x5b67('0x3')]('status_minus');}$(this)[_0x5b67('0x22')](_0x1f2ab5);});let _0x33bad=_0x1b81a0[_0x5b67('0x46')+_0x387252]!==undefined?_0x1b81a0[_0x5b67('0x46')+_0x387252]:0x1;var _0x3d9836=getImgPath(_0x5b67('0xcc')+_0x33bad+_0x5b67('0x99'));let _0x2faff1=_0x5b67('0x70')+_0x3d9836+_0x5b67('0xa0');_0x53c906[_0x5b67('0x7a')]('.'+_0x387252+_0x5b67('0x50'))['each'](function(){let _0x27c9ae=BASE+Number(_0x19fe6e),_0x379079=Number(_0x19fe6e)-CHAR_MASTER[_0x26acfe][_0x387252];$(this)[_0x5b67('0xda')](_0x2faff1+'\x20'+_0x27c9ae+'\x20('+_0x379079+')');});}let _0x49d278=(_0x50d936-0x171)/0x8,_0x45c202='+'+_0x49d278;if(_0x50d936===0x171)_0x45c202=0x0;else _0x49d278<0x0&&(_0x45c202=_0x49d278);let _0x27e587=_0x5b67('0x74');if(_0x49d278>=0x29)_0x27e587=_0x5b67('0xd9');else{if(_0x49d278>=0x26)_0x27e587=_0x5b67('0xe3');else{if(_0x49d278>=0x23)_0x27e587=_0x5b67('0x8');else{if(_0x49d278>=0x20)_0x27e587=_0x5b67('0x4c');else{if(_0x49d278>=0x1d)_0x27e587='2章VH1以降';else{if(_0x49d278>=0x1a)_0x27e587=_0x5b67('0xe9');else{if(_0x49d278>=0x17)_0x27e587=_0x5b67('0x9f');else{if(_0x49d278>=0x14)_0x27e587=_0x5b67('0x13');else _0x49d278>0x12&&(_0x27e587='VH13以降');}}}}}}}$(_0x5b67('0x4b')+_0x26acfe)[_0x5b67('0x22')](_0x50d936),$(_0x5b67('0x9')+_0x26acfe)['text'](_0x45c202),$(_0x5b67('0x1c')+_0x26acfe)[_0x5b67('0x22')](_0x27e587);});}function saveCharData(_0x4216c8){$('.charTmpl'+_0x4216c8)[_0x5b67('0x7a')](_0x5b67('0xaf'))[_0x5b67('0xc')]('icon_btn_positive')[_0x5b67('0x3')](_0x5b67('0xe')),update={};let _0x26f6f5=0x0;for(let _0x58cdf8 of PARAM_KEY){let _0x923d2a=Number(CHAR_MASTER[_0x4216c8][_0x5b67('0x6')+_0x58cdf8]);_0x923d2a=isNaN(_0x923d2a)||_0x923d2a>LIMIT_BASE+0x10?0x0:_0x923d2a,_0x26f6f5+=_0x923d2a,update[_0x58cdf8]=_0x923d2a;}let _0x5bcc4a=Number(CHAR_MASTER[_0x4216c8][_0x5b67('0xe2')]);update['HP']=isNaN(_0x5bcc4a)||_0x5bcc4a>HP_LIMIT?0x0:_0x5bcc4a,gtag(_0x5b67('0x3d'),_0x5b67('0x2e'),{'event_category':_0x5b67('0x41'),'event_label':CHAR_MASTER[_0x4216c8][_0x5b67('0x36')],'value':0x1});if(_0x26f6f5>0x0)updateData('CHAR/'+_0x4216c8,update);else{}}function initialHide(){$(_0x5b67('0x64'))[_0x5b67('0xc1')](),$(_0x5b67('0xf8'))[_0x5b67('0xc1')](),$(_0x5b67('0xd0'))[_0x5b67('0xc1')]();}async function displayCharInfo(_0x303fbd,_0x398784){let _0x46acf7=_0x303fbd['Id'],_0x28337b=$(_0x5b67('0x8d'))[_0x5b67('0x6c')]()[_0x5b67('0xc')](_0x5b67('0x3a'))[_0x5b67('0x6f')]('id');IS_SIMPLE_MODE&&_0x28337b['find'](_0x5b67('0x63'))[_0x5b67('0x3')](_0x5b67('0x3a'));let _0x1be6b4=$(_0x5b67('0xfb'))[_0x5b67('0x6c')]()[_0x5b67('0xc')](_0x5b67('0x3a'))[_0x5b67('0x6f')]('id')[_0x5b67('0x3')](_0x5b67('0x21')+_0x46acf7)[_0x5b67('0x2b')](_0x5b67('0x86'),_0x46acf7);_0x1be6b4['find']('.btn_close')[_0x5b67('0x2b')]('data-id',_0x46acf7),_0x1be6b4[_0x5b67('0x7a')]('.charUnset')[_0x5b67('0x2b')]('data-id',_0x46acf7),_0x28337b['find']('.charUnset')[_0x5b67('0x2b')]('data-id',_0x46acf7),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0xb0'))[_0x5b67('0x14')]()[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0xa8'))[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0x12'))[_0x5b67('0x2b')]('data-id',_0x46acf7),_0x1be6b4[_0x5b67('0x7a')]('.SUM')['attr'](_0x5b67('0x45'),_0x46acf7)['addClass']('SUM'+_0x46acf7),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0x9'))[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7)['addClass'](_0x5b67('0x8f')+_0x46acf7),_0x1be6b4[_0x5b67('0x7a')]('.RECO')[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7)[_0x5b67('0x3')](_0x5b67('0xf6')+_0x46acf7);var _0x1d1a90=_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0x91'));_0x1d1a90[_0x5b67('0x7a')](_0x5b67('0xdb'))[_0x5b67('0xfa')](),_0x1d1a90[_0x5b67('0x7a')](_0x5b67('0x5b'))[_0x5b67('0x82')](function(){$(this)[_0x5b67('0x28')](_0x5b67('0x91'))['find'](_0x5b67('0xdb'))[_0x5b67('0x6a')]();}),_0x28337b[_0x5b67('0x7a')](_0x5b67('0xe5'))[_0x5b67('0xda')](BASE_HP),_0x28337b[_0x5b67('0x7a')](_0x5b67('0x4b'))['attr'](_0x5b67('0x45'),_0x46acf7)[_0x5b67('0x3')](_0x5b67('0xc0')+_0x46acf7),_0x28337b['find'](_0x5b67('0x9'))[_0x5b67('0x2b')]('data-id',_0x46acf7)[_0x5b67('0x3')]('AVG'+_0x46acf7),_0x28337b[_0x5b67('0x7a')](_0x5b67('0x1c'))[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7)[_0x5b67('0x3')]('RECO'+_0x46acf7),_0x28337b[_0x5b67('0x7a')](_0x5b67('0x1f'))[_0x5b67('0x2b')]('data-id',_0x46acf7),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0x53'))[_0x5b67('0x2b')]('id',_0x5b67('0x77')+_0x46acf7);if(_0x398784!==null)for(let _0x26736f of PARAM_KEY_HP){_0x303fbd[_0x5b67('0x6')+_0x26736f]=Number(_0x398784[_0x26736f]);}else{if(_0x398784===null)for(let _0x4d5aec of PARAM_KEY){_0x303fbd['NOW'+_0x4d5aec]=0x0;}}let _0x585496=_0x1be6b4[_0x5b67('0x7a')]('.nowData');_0x585496[_0x5b67('0x2b')](_0x5b67('0x45'),_0x46acf7);for(let _0x8337bb of PARAM_KEY_HP){_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0xb0')+_0x8337bb)[_0x5b67('0xc')]('char'+_0x8337bb)[_0x5b67('0x3')](_0x5b67('0x59')+_0x8337bb+_0x46acf7)[_0x5b67('0x56')](_0x303fbd[_0x5b67('0x6')+_0x8337bb]),_0x585496['find']('.'+_0x8337bb)[_0x5b67('0xc')]('char'+_0x8337bb)[_0x5b67('0x3')](_0x5b67('0x19')+_0x8337bb+_0x46acf7)['text'](_0x303fbd[_0x5b67('0x6')+_0x8337bb]);}var _0x506c42=[];for(let _0x29e048 of _0x303fbd[_0x5b67('0x73')]){_0x506c42[_0x5b67('0xd5')](STYLE_MASTER[_0x29e048]);}var _0x155ab4=sortStyleId(_0x506c42);for(let _0x53444a of _0x155ab4){let _0x1580bc=STYLE_MASTER[_0x53444a],_0x4a8d46=getStyleIcon(_0x1580bc[_0x5b67('0xd3')],_0x53444a,_0x303fbd[_0x5b67('0xa6')]);_0x1be6b4[_0x5b67('0x7a')]('.STYLE_ICON')[_0x5b67('0xd1')](_0x4a8d46);let _0x447952=$(_0x5b67('0x1e'))[_0x5b67('0x6c')]()['removeClass'](_0x5b67('0x3a'))[_0x5b67('0x6f')]('id')[_0x5b67('0x3')](_0x5b67('0x43')+_0x53444a)[_0x5b67('0x2b')](_0x5b67('0x96'),_0x53444a)[_0x5b67('0x2b')](_0x5b67('0x86'),_0x46acf7);IS_SET_MY_STYLE&&IS_SHOW_MY_STYLE&&MY_STYLE[_0x5b67('0xa7')](_0x53444a)==-0x1&&(_0x447952[_0x5b67('0x3')](_0x5b67('0x3a')),_0x4a8d46[_0x5b67('0x3')](_0x5b67('0x3a')));var _0x2582c4=getImgPath(_0x5b67('0x80')+_0x53444a+_0x5b67('0x99')),_0x1eecb1=getImgPath(_0x5b67('0x2')+_0x1580bc[_0x5b67('0xd3')]+_0x5b67('0x99')),_0x40fb6a=$(_0x5b67('0xf9')+_0x1eecb1+_0x5b67('0xc6'));_0x447952[_0x5b67('0x7a')](_0x5b67('0xe6'))['append'](_0x40fb6a)[_0x5b67('0x2b')](_0x5b67('0x25'),'background:url('+_0x2582c4+')\x20no-repeat;\x20background-size:cover;\x20background-position:\x20calc(50%\x20+\x2020px);');var _0xce71f5=_0x447952[_0x5b67('0x6c')]();_0xce71f5[_0x5b67('0x3')](_0x5b67('0xce')),_0xce71f5[_0x5b67('0x3')](_0x5b67('0x57'));let _0x27aca0=_0x1580bc[_0x5b67('0x52')]==='f',_0x40e3ef=_0x1580bc[_0x5b67('0x52')]==='c';for(let _0x1edb59 of PARAM_KEY){let _0x5c16f0=_0x1580bc[_0x5b67('0x0')+_0x1edb59];if(_0x5c16f0===0x63)_0x447952[_0x5b67('0x7a')]('.'+_0x1edb59)[_0x5b67('0x22')]('?');else{let _0x4564f3=BASE+Number(_0x5c16f0),_0xeb70a6=Number(_0x5c16f0)-_0x303fbd[_0x1edb59],_0xc69b49='';if(_0x27aca0||_0x1580bc[_0x5b67('0x52')+_0x1edb59]=='k'||_0x1580bc[_0x5b67('0x52')+_0x1edb59]=='f'||_0xeb70a6===0x0)_0xc69b49=_0x5b67('0xea');else!_0x40e3ef&&(_0xc69b49=_0x5b67('0xe1'));_0xce71f5['find']('.'+_0x1edb59)['addClass'](_0xc69b49)[_0x5b67('0xc')](_0x1edb59)[_0x5b67('0x3')](_0x1edb59+_0x5b67('0x50'));}}_0x1be6b4[_0x5b67('0xd1')](_0x447952),_0x1be6b4[_0x5b67('0x7a')](_0x5b67('0x53')+_0x46acf7)[_0x5b67('0x10')](_0xce71f5);}var _0x5ba958=getCharBase2('',_0x303fbd['DotId'],_0x303fbd[_0x5b67('0x36')],'',![]),_0x294f10=_0x5ba958[_0x5b67('0x6c')]();_0x5ba958[_0x5b67('0x7a')](_0x5b67('0x8e'))['addClass']('char-winner2')[_0x5b67('0xc')]('char-aruku-left2')['removeAttr']('id')[_0x5b67('0x2b')]('id',_0x5b67('0x67')+_0x303fbd['Id']),_0x28337b[_0x5b67('0x7a')](_0x5b67('0x71'))['append'](_0x5ba958[_0x5b67('0x6c')]()),_0x28337b[_0x5b67('0x7a')](_0x5b67('0x4'))[_0x5b67('0xd1')](_0x1be6b4),$(_0x5b67('0x64'))[_0x5b67('0xd1')](_0x28337b);var _0x4ecf22=_0x294f10['clone']();_0x4ecf22[_0x5b67('0x7a')](_0x5b67('0xb0'))[_0x5b67('0x2b')]('id',_0x5b67('0x5e')+_0x303fbd['Id'])[_0x5b67('0x2b')](_0x5b67('0x45'),_0x303fbd['Id'])[_0x5b67('0x3')](_0x5b67('0x5e')),$(_0x5b67('0x17'))[_0x5b67('0xd1')](_0x4ecf22[_0x5b67('0x6c')]());}async function displayStyleInfo(_0x12bfec,_0x356755){let _0x3add88=STYLE_MASTER[_0x356755];if(_0x3add88===null)return;$('.charTmpl'+_0x12bfec)[_0x5b67('0x2b')]('data-styleId',_0x356755),$(_0x5b67('0xbb')+_0x12bfec)[_0x5b67('0x7a')](_0x5b67('0x78'))['each'](function(){let _0x4d2d34=$(this)[_0x5b67('0x2b')](_0x5b67('0x45'));$(this)['find']('.CHECK_COVER')[_0x5b67('0x3')](_0x5b67('0x97'));if(_0x356755===_0x4d2d34){$(this)[_0x5b67('0x7a')](_0x5b67('0x16'))['removeClass'](_0x5b67('0x97'));return;}});var _0xa9ecaa=[];$(_0x5b67('0xbb')+_0x12bfec)[_0x5b67('0x7a')]('.LIMIT')[_0x5b67('0x61')](function(){if($(this)['hasClass'](_0x5b67('0xce')))return;var _0x117473=IS_SHOW_ONLY_CHOISE_STYLE?'d-none':'';$(this)[_0x5b67('0x9d')](_0x5b67('0x81')+_0x356755)?$(this)[_0x5b67('0xc')](_0x5b67('0x20')+_0x117473)[_0x5b67('0x3')](_0x5b67('0xe0')):$(this)[_0x5b67('0x3')](_0x5b67('0x20')+_0x117473)['removeClass'](_0x5b67('0xe0'));});let _0xdca865=$(_0x5b67('0x4f')+_0x12bfec),_0x2a0cae=_0x3add88[_0x5b67('0xe7')],_0x5a6632=_0x2a0cae!==_0x5b67('0x23')?_0x2a0cae:'ID4e2c9';var _0x35fc3f=getImgPath(_0x5b67('0x24')+_0x5a6632+_0x5b67('0x99'));_0xdca865[_0x5b67('0x2b')]('style',_0x5b67('0x4d')+_0x35fc3f+_0x5b67('0x1'));var _0x10e86b=getImgPath(_0x5b67('0x58')+_0x3add88[_0x5b67('0xd3')][_0x5b67('0xec')]()+_0x5b67('0x99'));_0xdca865[_0x5b67('0x14')]()[_0x5b67('0x7a')](_0x5b67('0x93'))[_0x5b67('0x2b')]('src',_0x10e86b),_0xdca865[_0x5b67('0xd7')]>0x0&&animeReset(_0xdca865,_0x5b67('0xbe'));}function splitParam(_0x301935,_0x552ba6){k=/,|\.|\s|\t/g;let _0xeee4cb=_0x301935[_0x5b67('0x26')](k);_0xeee4cb[_0x5b67('0xd7')]===0x1&&(x=_0x301935[_0x5b67('0xd7')]-0x10,_0xeee4cb[0x0]=_0x301935[_0x5b67('0x6d')](0x0,x),_0xeee4cb[0x1]=_0x301935['substr'](x,0x2),_0xeee4cb[0x2]=_0x301935[_0x5b67('0x6d')](x+0x2,0x2),_0xeee4cb[0x3]=_0x301935[_0x5b67('0x6d')](x+0x4,0x2),_0xeee4cb[0x4]=_0x301935[_0x5b67('0x6d')](x+0x6,0x2),_0xeee4cb[0x5]=_0x301935[_0x5b67('0x6d')](x+0x8,0x2),_0xeee4cb[0x6]=_0x301935[_0x5b67('0x6d')](x+0xa,0x2),_0xeee4cb[0x7]=_0x301935[_0x5b67('0x6d')](x+0xc,0x2),_0xeee4cb[0x8]=_0x301935[_0x5b67('0x6d')](x+0xe,0x2));for(let _0x29787a=0x0;_0x29787a<0x9;_0x29787a++){(_0xeee4cb[_0x29787a]===undefined||_0xeee4cb[_0x29787a]==='')&&(_0xeee4cb[_0x29787a]=_0x552ba6);}return _0xeee4cb;}function selectDotReset(_0x34551f){$(_0x5b67('0x7d')+_0x34551f[_0x5b67('0xe7')])['removeClass'](_0x5b67('0xb'))[_0x5b67('0x3')](_0x5b67('0x8c'))[_0x5b67('0x7a')](_0x5b67('0xab'))[_0x5b67('0x22')](_0x34551f[_0x5b67('0xd6')]);}function selectDotHensei(_0x297513){$('.dot'+_0x297513[_0x5b67('0xe7')])[_0x5b67('0xc')](_0x5b67('0x8c'))[_0x5b67('0xc')](_0x5b67('0x48'))[_0x5b67('0x3')](_0x5b67('0xb'))[_0x5b67('0x7a')]('.series-button')['text'](_0x5b67('0x5a'));}