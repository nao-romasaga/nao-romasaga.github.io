var _0x4610=['.SUM','#styleLabelRow','css','lightgreen','#STYLE_TEMPLATE','STYLE_ROW','background-color','rgba(0,0,0,\x200.2)','.IMG','最大値','STYLE_MAX','after','NONE','.YOUR','.LIMIT','.YOURSUM','.LIMITSUM','.USER_RANK_DISP','list','kyogiList','#USER_RANK','before','<tr\x20class=\x27USER_RANK_DISP\x27\x20style=\x27background-color:red;\x20color:white;\x27><td\x20colspan=11>協議中</td></tr>','text-center\x20USER_RANK_DISP','UserId','MATCH','bg-white','pt)<br>入力内容を再確認するか画像付きで報告お願い致します','<td\x20class=\x27paramCell2\x27>','<i\x20class=\x22fas\x20fa-crown\x22>','</i>','<td\x20class=\x27paramCell2\x20small\x27>','</td>','<td\x20class=\x27paramCell2\x27\x20style=\x27','.STYLE_MAX','<td\x20class=\x27paramCell2\x27\x20style=\x27background-color:red;\x20color:white;\x27>','.rankingTweet','UNMATCH','pt)<br>ランキング反映待機中...','登録がありません','#MY_RANK','でランキング','腕/体/器/速/知/精/愛/魅/合計','STR','VIT','DEX','slice','AGI','MND','育成ランキング\x20[ロマサガRS便利ツール]\x20','https://twitter.com/intent/tweet?text=','&url=https://nao-romasaga.github.io/ourchar.html?','&hashtags=','@nao_romasaga_rs\x20育成ランキング\x20協議解除申請\x20','.kaijoTweet','OUR_CHAR/LIST','Char','#CHAR_COUNT','Dot','Series','WeaponType','WeaponTypeFilter','search','#RANKKING_TABLE','#example-table','indexOf','<img\x20src=\x22./img/dot/','icon','<span\x20class=\x22icon_mini_zokusei\x20','\x22></span>','desc','#example-table-display','<div\x20id=\x22example-table\x22\x20style=\x22width:100%\x22></div>','right','number','local','SeriesFilter','MAXSTR','MAXVIT','assign','MAXDEX','MAXAGI','MAXINT','MAXAI','MAXMI','<span\x20class=\x22hidden\x20pcBlock\x22>合</span>計','AVG','登録数','setFilter','auth','onAuthStateChanged','TwitterAuthProvider','PROVIDER_ID','AuthUI','start','uid','.noLogin','hide','.isLogin','removeClass','d-none','#loginInfo','<img>','src','photoURL','attr','style','width:40px;\x20heidht:40px;\x20\x20\x20\x20border-radius:\x2050%;','displayName','\x20さん:ログイン中','#firebaseui-auth-container','addClass','bg-white\x20kadomaru','append','.filterList','click','toggleClass','filterActive','event','clickFilter','href','substr','floor','random','.dotBackground','each','data-type','parent','hasClass','push','clearFilter','MAXSUM','join','length','\x20&\x20','<br>','#label1','html','.tabulator-header,\x20.tabulator-footer,\x20.tabulator-page','.tabulator-cell','find','tabulator-field','Name','clickChar','html,body','animate','#badge','offset','top','swing','#initialHide','.MAX','MAXHP','.MAXSUM','text','rank','#INPUT_COUNT','size','remove','#charDot','<span\x20class=\x22char\x20dot_mid\x20dot\x20char-winner\x22\x20style=\x22background:\x20url(./img/dot/','DotId','.png)\x20no-repeat;\x20margin:\x200\x2010px;\x22></span>','.charName','.png)\x20no-repeat;\x20margin:\x200\x2010px;','clone','removeAttr','.rare','./img/icon/icon_','Rarity','.png','.icn','./img/style_icon/','Limit'];(function(_0x2bd3a5,_0x33b67e){var _0x501938=function(_0x25d155){while(--_0x25d155){_0x2bd3a5['push'](_0x2bd3a5['shift']());}};_0x501938(++_0x33b67e);}(_0x4610,0x107));var _0x1f70=function(_0x1142db,_0x3c913e){_0x1142db=_0x1142db-0x0;var _0xe5aa34=_0x4610[_0x1142db];return _0xe5aa34;};var tableLimit=0xf;var RANK_LIMIT=0x14;var MY_DATA_LIST=[];var CHAR_RANK,CHAR_MASTER,STYLE_MASTER=[];var table;firebase[_0x1f70('0x0')](appUsers)[_0x1f70('0x1')](_0x2fa956=>{if(!_0x2fa956){var _0x3ce282={'signInSuccessUrl':'https://nao-romasaga.github.io/ourchar.html','signInOptions':[firebase[_0x1f70('0x0')][_0x1f70('0x2')][_0x1f70('0x3')]]};var _0x5bd6af=new firebaseui[(_0x1f70('0x0'))][(_0x1f70('0x4'))](firebase['auth'](appUsers));_0x5bd6af[_0x1f70('0x5')]('#firebaseui-auth-container',_0x3ce282);}else{UID=_0x2fa956[_0x1f70('0x6')];$(_0x1f70('0x7'))[_0x1f70('0x8')]();$(_0x1f70('0x9'))[_0x1f70('0xa')](_0x1f70('0xb'));$(_0x1f70('0xc'))[_0x1f70('0x8')]();let _0x11a9ca=$(_0x1f70('0xd'))['attr'](_0x1f70('0xe'),_0x2fa956[_0x1f70('0xf')])[_0x1f70('0x10')](_0x1f70('0x11'),_0x1f70('0x12'));let _0x418fda=_0x2fa956[_0x1f70('0x13')]+_0x1f70('0x14');$(_0x1f70('0x15'))[_0x1f70('0x16')](_0x1f70('0x17'))[_0x1f70('0x18')](_0x11a9ca)[_0x1f70('0x18')](_0x418fda);}});$(_0x1f70('0x19'))[_0x1f70('0x1a')](function(){$(this)['parent']()[_0x1f70('0x1b')](_0x1f70('0x1c'));if(table===undefined){return;}filter();gtag(_0x1f70('0x1d'),_0x1f70('0x1e'),{'event_category':'ourchar','event_label':$(this)['attr'](_0x1f70('0x1f'))[_0x1f70('0x20')](0x1),'value':0x1});});let rand=Math[_0x1f70('0x21')](Math[_0x1f70('0x22')]()*0x5);$(_0x1f70('0x23'))[_0x1f70('0x16')]('bg'+(rand+0x1));function filter(){let _0x48bbcc=[];let _0x13c76e=[];let _0x2e7b13=[];let _0x4534ea=[];$('.filterList')[_0x1f70('0x24')](function(){let _0x2d35bc=$(this)[_0x1f70('0x10')](_0x1f70('0x25'));let _0x2c664c=$(this)[_0x1f70('0x10')](_0x1f70('0x1f'))[_0x1f70('0x20')](0x1);if($(this)[_0x1f70('0x26')]()[_0x1f70('0x27')](_0x1f70('0x1c'))){if(_0x2d35bc==='WeaponTypeFilter'){_0x48bbcc[_0x1f70('0x28')]({'field':_0x2d35bc,'type':'=','value':_0x2c664c});_0x2e7b13[_0x1f70('0x28')]($(this)[_0x1f70('0x10')]('data-label'));}else{_0x13c76e[_0x1f70('0x28')]({'field':_0x2d35bc,'type':'=','value':_0x2c664c});_0x4534ea['push'](_0x2c664c);}}});let _0x512749='';table[_0x1f70('0x29')]();let _0x5118a6=[{'field':_0x1f70('0x2a'),'type':'>','value':0x0}];if(_0x48bbcc['length']>0x0){_0x5118a6[_0x1f70('0x28')](_0x48bbcc);_0x512749+='武器種:'+_0x2e7b13[_0x1f70('0x2b')](',');}if(_0x13c76e[_0x1f70('0x2c')]>0x0){_0x5118a6[_0x1f70('0x28')](_0x13c76e);if(_0x512749!==''){_0x512749+=_0x1f70('0x2d');}_0x512749+=_0x4534ea[_0x1f70('0x2b')](',');}if(_0x512749!==''){_0x512749+=_0x1f70('0x2e');}$(_0x1f70('0x2f'))[_0x1f70('0x30')](_0x512749);table['setFilter'](_0x5118a6);changeId2Dot();}$(document)['on'](_0x1f70('0x1a'),_0x1f70('0x31'),function(){changeId2Dot();});$(document)['on'](_0x1f70('0x1a'),_0x1f70('0x32'),function(){$(this)[_0x1f70('0x26')]()[_0x1f70('0x33')]('.tabulator-cell')[_0x1f70('0x24')](async function(){let _0x1406f1=$(this)['text']();let _0x12e0d5=$(this)[_0x1f70('0x10')](_0x1f70('0x34'));if(_0x1406f1['indexOf']('ID')>-0x1){dispRanking(_0x1406f1);}else if(_0x12e0d5===_0x1f70('0x35')){gtag(_0x1f70('0x1d'),_0x1f70('0x36'),{'event_category':'ourchar','event_label':_0x1406f1,'value':0x1});}});$(_0x1f70('0x37'))[_0x1f70('0x38')]({'scrollTop':$(_0x1f70('0x39'))[_0x1f70('0x3a')]()[_0x1f70('0x3b')]},0x1f4,_0x1f70('0x3c'));});async function dispRanking(_0x1bf779){$(_0x1f70('0x3d'))[_0x1f70('0xa')](_0x1f70('0xb'));let _0x23060a={'STR':0x0,'VIT':0x0,'DEX':0x0,'AGI':0x0,'INT':0x0,'MND':0x0,'AI':0x0,'MI':0x0,'SUM':0x0};for(let _0x46b0ab of PARAM_KEY){_0x23060a[_0x46b0ab]=CHAR_MASTER[_0x1bf779]['MAX'+_0x46b0ab]===-0x63?'?':LIMIT_BASE+Number(CHAR_MASTER[_0x1bf779]['MAX'+_0x46b0ab]);}var _0x3bd9e3=0x0;for(let _0x44b883 in CHAR_RANK){if(CHAR_RANK[_0x44b883]['Id']===_0x1bf779){for(let _0x46b0ab of PARAM_KEY){$(_0x1f70('0x3e')+_0x46b0ab)['text'](CHAR_RANK[_0x44b883]['MAX'+_0x46b0ab]);}_0x3bd9e3=CHAR_RANK[_0x44b883][_0x1f70('0x3f')];$(_0x1f70('0x40'))[_0x1f70('0x41')](CHAR_RANK[_0x44b883][_0x1f70('0x2a')]);$('#RANK_COUNT')[_0x1f70('0x41')](CHAR_RANK[_0x44b883][_0x1f70('0x42')]);$(_0x1f70('0x43'))['text'](CHAR_RANK[_0x44b883][_0x1f70('0x44')]);break;}}let _0x18e5de='';let _0x12cde7='';let _0x3ae1e1='%0D%0A';$('.STYLE_ROW')[_0x1f70('0x45')]();$(_0x1f70('0x46'))[_0x1f70('0x30')](_0x1f70('0x47')+CHAR_MASTER[_0x1bf779][_0x1f70('0x48')]+_0x1f70('0x49'));_0x18e5de=CHAR_MASTER[_0x1bf779][_0x1f70('0x35')];$(_0x1f70('0x4a'))[_0x1f70('0x41')](_0x18e5de);$('#charDotAruku')[_0x1f70('0x10')]('style','background:\x20url(./img/dot/'+CHAR_MASTER[_0x1bf779][_0x1f70('0x48')]+_0x1f70('0x4b'));for(let _0x3941d4 of CHAR_MASTER[_0x1bf779]['Holders']){let _0x38e285=await getStyleInfo(_0x3941d4);let _0x4a63ce=$('#STYLE_TEMPLATE')[_0x1f70('0x4c')]();_0x4a63ce[_0x1f70('0x4d')]('id');_0x4a63ce['addClass']('STYLE_ROW');_0x4a63ce[_0x1f70('0xa')]('d-none');_0x4a63ce[_0x1f70('0x33')](_0x1f70('0x4e'))[_0x1f70('0x10')](_0x1f70('0xe'),_0x1f70('0x4f')+_0x38e285[_0x1f70('0x50')]+_0x1f70('0x51'));_0x4a63ce[_0x1f70('0x33')](_0x1f70('0x52'))[_0x1f70('0x10')](_0x1f70('0xe'),_0x1f70('0x53')+_0x38e285['IllustId']+_0x1f70('0x51'));let _0x425e69=0x0;for(let _0x46b0ab of PARAM_KEY){let _0x1434cd=LIMIT_BASE+Number(_0x38e285['Limit'+_0x46b0ab]);if(_0x38e285[_0x1f70('0x54')+_0x46b0ab]<0x63){_0x425e69+=_0x1434cd;}else{_0x1434cd='?';}_0x4a63ce[_0x1f70('0x33')]('.'+_0x46b0ab)[_0x1f70('0x41')](_0x1434cd);}_0x4a63ce['find'](_0x1f70('0x55'))['text'](_0x425e69);$(_0x1f70('0x56'))['after'](_0x4a63ce);}$('.STYLE_ROW')['each'](function(){for(let _0x46b0ab of PARAM_KEY){let _0x811607=$(this)[_0x1f70('0x33')]('.'+_0x46b0ab);if(_0x811607[_0x1f70('0x41')]()==_0x23060a[_0x46b0ab]){_0x811607[_0x1f70('0x57')]('background-color',_0x1f70('0x58'));}}});let _0x27c0fb=$(_0x1f70('0x59'))[_0x1f70('0x4c')]();_0x27c0fb[_0x1f70('0x4d')]('id')[_0x1f70('0x16')](_0x1f70('0x5a'))[_0x1f70('0xa')](_0x1f70('0xb'))[_0x1f70('0x57')](_0x1f70('0x5b'),_0x1f70('0x5c'));_0x27c0fb[_0x1f70('0x33')](_0x1f70('0x5d'))[_0x1f70('0x30')](_0x1f70('0x5e'));let _0x566c20=0x0;for(let _0x46b0ab of PARAM_KEY){_0x566c20+=_0x23060a[_0x46b0ab]!=='?'?_0x23060a[_0x46b0ab]:0x0;_0x27c0fb[_0x1f70('0x33')]('.'+_0x46b0ab)[_0x1f70('0x41')](_0x23060a[_0x46b0ab]);}_0x27c0fb[_0x1f70('0x33')](_0x1f70('0x55'))[_0x1f70('0x41')](_0x566c20);_0x27c0fb[_0x1f70('0x33')](_0x1f70('0x55'))[_0x1f70('0x16')](_0x1f70('0x5f'));$('#styleLabelRow')[_0x1f70('0x60')](_0x27c0fb);let _0x578069=await getMyCharData(_0x1bf779);let _0x163c67='UNMATCH';if(_0x578069===null){_0x163c67=_0x1f70('0x61');_0x578069={'STR':0x0,'VIT':0x0,'DEX':0x0,'AGI':0x0,'INT':0x0,'MND':0x0,'AI':0x0,'MI':0x0};}let _0xd037da=0x0;for(let _0x46b0ab of PARAM_KEY){_0xd037da+=Number(_0x578069[_0x46b0ab]);$(_0x1f70('0x62')+_0x46b0ab)[_0x1f70('0x41')](_0x578069[_0x46b0ab]);let _0x599391=_0x23060a[_0x46b0ab]==='?'?'?':_0x23060a[_0x46b0ab]-_0x578069[_0x46b0ab];$(_0x1f70('0x63')+_0x46b0ab)[_0x1f70('0x41')](_0x599391);}$(_0x1f70('0x64'))[_0x1f70('0x41')](_0xd037da);$(_0x1f70('0x65'))[_0x1f70('0x41')](_0x566c20===0x0?'?':_0x566c20-_0xd037da);let _0x113c34=_0xd037da;let _0x264a5b=await getUserCharData(_0x1bf779);let _0x594ca8='';let _0x370be9=0x1;let _0x523a4f=0x3e7;$(_0x1f70('0x66'))['remove']();let _0x3c0c8b=[_0x264a5b[_0x1f70('0x67')],_0x264a5b[_0x1f70('0x68')]];for(let _0x1234d8 in _0x3c0c8b){if(_0x1234d8=='1'&&_0x3c0c8b[_0x1234d8]!==undefined){$(_0x1f70('0x69'))[_0x1f70('0x6a')](_0x1f70('0x6b'));}for(let _0x44b883 in _0x3c0c8b[_0x1234d8]){let _0xd037da=0x0;for(let _0x46b0ab of PARAM_KEY){_0xd037da+=Number(_0x3c0c8b[_0x1234d8][_0x44b883][_0x46b0ab]);}if(_0x523a4f>_0xd037da){_0x523a4f=_0xd037da;nowrank=Number(_0x44b883)+0x1;}if(_0x523a4f>_0x113c34){_0x370be9=nowrank+0x1;}if(_0x1234d8==='1'){nowrank='協議中';}let _0x5374ca=$('<tr>')[_0x1f70('0x16')](_0x1f70('0x6c'));if(UID===_0x3c0c8b[_0x1234d8][_0x44b883][_0x1f70('0x6d')]){_0x163c67=_0x1f70('0x6e');_0x5374ca[_0x1f70('0x16')](_0x1f70('0x6f'));if(_0x1234d8!=='1'){_0x594ca8=nowrank+'位('+_0xd037da+'pt)';_0x12cde7=nowrank+'位';}else{_0x12cde7=nowrank;_0x594ca8=nowrank+'('+_0xd037da+_0x1f70('0x70');}}if(_0x44b883>=RANK_LIMIT){continue;}_0x5374ca['append'](_0x1f70('0x71')+nowrank+'\x20</td>');let _0x3eacc2='';let _0x5d50b6=_0x3c0c8b[_0x1234d8][_0x44b883]['HP']===undefined?'-':_0x3c0c8b[_0x1234d8][_0x44b883]['HP'];if(_0x3bd9e3===_0x5d50b6){_0x5d50b6=_0x1f70('0x72')+_0x5d50b6+_0x1f70('0x73');}_0x5374ca[_0x1f70('0x18')](_0x1f70('0x74')+_0x5d50b6+_0x1f70('0x75'));for(let _0x46b0ab of PARAM_KEY){let _0x3c2092='';if(_0x23060a[_0x46b0ab]>0x0&&_0x3c0c8b[_0x1234d8][_0x44b883][_0x46b0ab]>_0x23060a[_0x46b0ab]){_0x3c2092='\x20background-color:red;\x20color:white;';}_0x5374ca['append'](_0x1f70('0x76')+_0x3c2092+'\x27>'+_0x3c0c8b[_0x1234d8][_0x44b883][_0x46b0ab]+'</td>');}if(Number($(_0x1f70('0x77'))[_0x1f70('0x41')]())-0xa>_0xd037da){_0x5374ca[_0x1f70('0x18')](_0x1f70('0x74')+_0xd037da+_0x1f70('0x75'));}else{_0x5374ca[_0x1f70('0x18')](_0x1f70('0x78')+_0xd037da+_0x1f70('0x75'));}$('#USER_RANK')[_0x1f70('0x6a')](_0x5374ca);}}$(_0x1f70('0x79'))[_0x1f70('0x26')]()[_0x1f70('0xa')]('d-none');if(_0x163c67===_0x1f70('0x7a')){_0x12cde7='暫定'+_0x370be9+'位';_0x594ca8='暫定'+_0x370be9+'位('+_0x113c34+_0x1f70('0x7b');}else if(_0x163c67===_0x1f70('0x61')){$(_0x1f70('0x79'))[_0x1f70('0x26')]()[_0x1f70('0x16')](_0x1f70('0xb'));_0x594ca8=_0x1f70('0x7c');}$(_0x1f70('0x7d'))['html'](_0x594ca8);let _0x24295e=_0x18e5de+_0x1f70('0x7e')+_0x12cde7+'!!'+_0x3ae1e1;_0x24295e+=_0x1f70('0x7f')+_0x3ae1e1;_0x24295e+=('0'+_0x578069[_0x1f70('0x80')])['slice'](-0x2)+'/';_0x24295e+=('0'+_0x578069[_0x1f70('0x81')])['slice'](-0x2)+'/';_0x24295e+=('0'+_0x578069[_0x1f70('0x82')])[_0x1f70('0x83')](-0x2)+'/';_0x24295e+=('0'+_0x578069[_0x1f70('0x84')])[_0x1f70('0x83')](-0x2)+'/';_0x24295e+=('0'+_0x578069['INT'])[_0x1f70('0x83')](-0x2)+'/';_0x24295e+=('0'+_0x578069[_0x1f70('0x85')])[_0x1f70('0x83')](-0x2)+'/';_0x24295e+=('0'+_0x578069['AI'])['slice'](-0x2)+'/';_0x24295e+=('0'+_0x578069['MI'])[_0x1f70('0x83')](-0x2)+'/';_0x24295e+=('0'+_0xd037da)[_0x1f70('0x83')](-0x3)+_0x3ae1e1;let _0xa55921='ロマサガRS便利ツール,ロマサガRS育成ランキング';let _0x2c7361=_0x1f70('0x86')+_0x3ae1e1+_0x24295e;let _0x11c71d=_0x1f70('0x87')+_0x2c7361+_0x1f70('0x88')+_0x1bf779+_0x1f70('0x89')+_0xa55921;$(_0x1f70('0x79'))['attr'](_0x1f70('0x1f'),_0x11c71d);let _0x323045=_0x1f70('0x8a')+_0x3ae1e1+_0x24295e;let _0x1c8c62=_0x1f70('0x87')+_0x323045+_0x1f70('0x88')+_0x1bf779+_0x1f70('0x89')+_0xa55921;$(_0x1f70('0x8b'))[_0x1f70('0x10')](_0x1f70('0x1f'),_0x1c8c62);}readAnalyzeFile(_0x1f70('0x8c'),function(_0x4d423a){CHAR_RANK=_0x4d423a;if(CHAR_RANK!==undefined&&CHAR_MASTER!==undefined){init();}});readFile(_0x1f70('0x8d'),function(_0x36d274){CHAR_MASTER=_0x36d274;if(CHAR_RANK!==undefined&&CHAR_MASTER!==undefined){init();}});function init(){$(_0x1f70('0x8e'))[_0x1f70('0x41')](CHAR_RANK['length']);let _0x573ce1=0x3e7;let _0x652da3=0x1;for(let _0x289c86 in CHAR_RANK){let _0x5670f2=CHAR_RANK[_0x289c86]['Id'];CHAR_RANK[_0x289c86][_0x1f70('0x48')]=_0x1f70('0x8f')+CHAR_MASTER[_0x5670f2][_0x1f70('0x48')];CHAR_RANK[_0x289c86][_0x1f70('0x35')]=CHAR_MASTER[_0x5670f2][_0x1f70('0x35')];CHAR_RANK[_0x289c86][_0x1f70('0x90')]=CHAR_MASTER[_0x5670f2][_0x1f70('0x90')];CHAR_RANK[_0x289c86][_0x1f70('0x91')]=ICON_LIST[CHAR_MASTER[_0x5670f2]['WeaponType']];CHAR_RANK[_0x289c86]['SeriesFilter']=CHAR_MASTER[_0x5670f2][_0x1f70('0x90')];CHAR_RANK[_0x289c86][_0x1f70('0x92')]=ICON_LIST[CHAR_MASTER[_0x5670f2][_0x1f70('0x91')]];if(_0x573ce1>Number(CHAR_RANK[_0x289c86]['size'])){_0x573ce1=Number(CHAR_RANK[_0x289c86][_0x1f70('0x44')]);_0x652da3=Number(_0x289c86)+0x1;}CHAR_RANK[_0x289c86][_0x1f70('0x42')]=_0x652da3;}drawTable(CHAR_RANK);if(location[_0x1f70('0x93')]!==''){let _0x592739=location[_0x1f70('0x93')]['substr'](0x1);if(CHAR_MASTER[_0x592739]!==undefined){dispRanking(_0x592739);$(_0x1f70('0x37'))[_0x1f70('0x38')]({'scrollTop':$(_0x1f70('0x94'))['offset']()[_0x1f70('0x3b')]},0x1f4,_0x1f70('0x3c'));}}}function changeId2Dot(){$(_0x1f70('0x95'))['find'](_0x1f70('0x32'))[_0x1f70('0x24')](function(){let _0x4ba6fd=$(this)[_0x1f70('0x41')]();if(_0x4ba6fd[_0x1f70('0x96')](_0x1f70('0x8f'))>-0x1){let _0x4163f7=_0x1f70('0x97')+_0x4ba6fd[_0x1f70('0x20')](0x3)+'.png\x22\x20style=\x22object-position:\x20-10px\x20-10px\x22>';$(this)[_0x1f70('0x30')](_0x4163f7);}else if(_0x4ba6fd[_0x1f70('0x96')](_0x1f70('0x98'))>-0x1){let _0x3b3821=_0x1f70('0x99')+_0x4ba6fd+_0x1f70('0x9a');$(this)['html'](_0x3b3821);}});}function drawTable(_0x550894,_0x108734){let _0x1a7861=_0x108734===undefined?_0x1f70('0x9b'):_0x108734;$(_0x1f70('0x95'))[_0x1f70('0x45')]();$(_0x1f70('0x9c'))[_0x1f70('0x18')](_0x1f70('0x9d'));let _0x2865e3={'align':_0x1f70('0x9e'),'sortable':!![],'sorter':_0x1f70('0x9f'),'minWidth':0x1e,'width':0x1e};table=new Tabulator(_0x1f70('0x95'),{'layout':'fitColumns','data':_0x550894,'tooltips':![],'history':!![],'pagination':_0x1f70('0xa0'),'paginationSize':tableLimit,'initialSort':[{'column':_0x1f70('0x44'),'dir':_0x1a7861}],'autoResize':![],'resizableRows':![],'resizableColumns':![],'responsiveLayout':!![],'columns':[{'title':'','field':'DotId','width':0x1e,'frozen':!![]},{'title':'','field':'Id','visible':![]},{'title':'','field':'UserId','visible':![]},{'title':'','field':_0x1f70('0xa1'),'visible':![]},{'title':'','field':_0x1f70('0x92'),'visible':![]},{'title':_0x1f70('0x42'),'field':_0x1f70('0x42'),'visible':![]},{'title':'名前','field':_0x1f70('0x35'),'responsive':0x8},{'title':'作品','field':_0x1f70('0x90'),'width':0x1e,'responsive':0xa},{'title':'武器','field':'WeaponType','width':0x1e,'responsive':0x9},{'title':'HP','field':'MAXHP','align':_0x1f70('0x9e'),'sortable':!![],'sorter':'number','minWidth':0x1e,'width':0x28,'responsive':0x7},Object['assign']({'title':'腕','field':_0x1f70('0xa2')},_0x2865e3),Object['assign']({'title':'体','field':_0x1f70('0xa3')},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'器','field':_0x1f70('0xa5')},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'速','field':_0x1f70('0xa6')},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'知','field':_0x1f70('0xa7')},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'精','field':'MAXMND'},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'愛','field':_0x1f70('0xa8')},_0x2865e3),Object[_0x1f70('0xa4')]({'title':'魅','field':_0x1f70('0xa9')},_0x2865e3),{'title':_0x1f70('0xaa'),'field':_0x1f70('0x2a'),'sortable':!![],'sorter':_0x1f70('0x9f')},{'title':'平均','field':_0x1f70('0xab'),'sortable':!![],'sorter':_0x1f70('0x9f'),'responsive':0xb},{'title':_0x1f70('0xac'),'field':_0x1f70('0x44'),'responsive':0xb}]});table[_0x1f70('0xad')](_0x1f70('0x2a'),'>',0x0);changeId2Dot();}
