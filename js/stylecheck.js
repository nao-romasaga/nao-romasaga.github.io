var _0x2fa8=['https://twitter.com/intent/tweet?text=','&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー','.twitter-share-button','href','#modal01','fadeIn','css','animation','.modalClose','fadeOut','#modalInner','round','WeaponType','indexOf','push','.myAll','.mySS','.myA','toFixed','.SPer','.myMlv','floor','.myNext','Name','<br>','Holders','Rarity','gacha','<button>','style_icon/','.png','data-type','<span>','clone','Area','log','.all','.allS','.allA','assign','2019.10.21.イベント配布','2019.10.11.ピックアップガチャ','常設イベント','プラチナガチャ限定','クエストドロップ','ストーリー','七英雄襲来','螺旋回廊ガチャ限定','初期配布','2019.09.19.Awardピックアップガチャ3','2019.09.19.Awardイベント配布','2019.09.10.Awardピックアップガチャ2','2019.08.30.Awardピックアップガチャ','2019.08.30.Awardイベント配布','2019.08.22.海賊イベント配布','2019.07.31.水着ガチャ','2019.07.31.水着配布','2019.06.30.南国の楽園ガチャ','2019.06.30.南国の楽園配布','2019.05.29.ハーフアニバーサリーイベント(エミリア編)','2019.05.29.ハーフアニバーサリーイベント配布','2019.06.21.ハーフアニバーサリーイベント(ようせい編)','2019.06.21.ハーフアニバーサリーイベント配布','2019.06.09.ハーフアニバーサリーイベント(アセルス編)','201905.GWイベント','201903.ホワイトデーイベント','201902.バレンタインデーイベント','201901.正月イベント','201812.クリスマスイベント2','auth','TwitterAuthProvider','AuthUI','start','#firebaseui-auth-container','#loginInfo','attr','src','photoURL','style','width:40px;\x20heidht:40px;\x20\x20\x20\x20border-radius:\x2050%;','displayName','\x20さん:ログイン中','addClass','append','ready','search','substr','.allOn\x20,\x20.allOff\x20,\x20.twitter-share-button','hide','.myinput','d-none','click','.onlyDisable','event','filter','stylecheck','OnlyDisable','.style','each','parent','hasClass','nocheck','.allType','ALL','removeClass','.filterButton','data-id','data-rare','.allOn','.allOff','#tabRare','tab','style-tab-disabled','style-tab-active','#tabChar','#tabGacha','#styleAreaChar','width:33%','width:30%','Char','#styleAreaRare','#styleAreaGacha','Gacha','length','体\x20(','.allPer','first','text','SS\x20','.SSPer','.APer'];(function(_0x40a06f,_0x3de5a2){var _0x3f511e=function(_0x2b0097){while(--_0x2b0097){_0x40a06f['push'](_0x40a06f['shift']());}};_0x3f511e(++_0x3de5a2);}(_0x2fa8,0x1b0));var _0x44d3=function(_0x19098,_0x23f503){_0x19098=_0x19098-0x0;var _0x49e8ad=_0x2fa8[_0x19098];return _0x49e8ad;};let allCount={'SS':0x0,'S':0x0,'A':0x0};for(let key in WEPON_ATTR){allCount[key]=0x0;}let myCount={'SS':0x0,'S':0x0,'A':0x0};var sslist=[];var slist=[];var alist=[];var weponType=Object[_0x44d3('0x0')]({},WEPON_ATTR);for(let key in weponType){weponType[key]=[];}var gachaList=['2019.10.21.ピックアップガチャ',_0x44d3('0x1'),_0x44d3('0x2'),'2019.09.30.ハロウィンガチャ','2019.09.30.ハロウィンイベント配布',_0x44d3('0x3'),_0x44d3('0x4'),'汎用',_0x44d3('0x5'),_0x44d3('0x6'),_0x44d3('0x7'),_0x44d3('0x8'),'キャンペーン配布',_0x44d3('0x9'),_0x44d3('0xa'),_0x44d3('0xb'),_0x44d3('0xc'),_0x44d3('0xd'),_0x44d3('0xe'),_0x44d3('0xf'),_0x44d3('0x10'),_0x44d3('0x11'),_0x44d3('0x12'),_0x44d3('0x13'),_0x44d3('0x14'),_0x44d3('0x15'),_0x44d3('0x16'),_0x44d3('0x17'),_0x44d3('0x18'),_0x44d3('0x19'),'201904.侯国学園イベント',_0x44d3('0x1a'),_0x44d3('0x1b'),_0x44d3('0x1c'),_0x44d3('0x1d'),'201812.クリスマスイベント1'];function _noLoginInitial(){var _0x156bca={'signInSuccessUrl':'https://nao-romasaga.github.io/stylecheck.html','signInOptions':[firebase[_0x44d3('0x1e')][_0x44d3('0x1f')]['PROVIDER_ID']]};var _0x2ed4c6=new firebaseui['auth'][(_0x44d3('0x20'))](firebase[_0x44d3('0x1e')](appUsers));_0x2ed4c6[_0x44d3('0x21')](_0x44d3('0x22'),_0x156bca);}function _initial(){$(_0x44d3('0x23'))['hide']();let _0x2644a1=$('<img>')[_0x44d3('0x24')](_0x44d3('0x25'),USER[_0x44d3('0x26')])[_0x44d3('0x24')](_0x44d3('0x27'),_0x44d3('0x28'));let _0x3f900a=USER[_0x44d3('0x29')]+_0x44d3('0x2a');$(_0x44d3('0x22'))[_0x44d3('0x2b')]('bg-white\x20kadomaru')[_0x44d3('0x2c')](_0x2644a1)['append'](_0x3f900a);intialMyStyle();}var targetId;$(document)[_0x44d3('0x2d')](function(_0x3d781d){display();if(location[_0x44d3('0x2e')]!==''){targetId=location[_0x44d3('0x2e')][_0x44d3('0x2f')](0x1);_0x3d781d(_0x44d3('0x30'))[_0x44d3('0x31')]();_0x3d781d(_0x44d3('0x32'))['removeClass'](_0x44d3('0x33'));}});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x35'),function(){gtag(_0x44d3('0x36'),_0x44d3('0x37'),{'event_category':_0x44d3('0x38'),'event_label':_0x44d3('0x39'),'value':0x1});$(_0x44d3('0x3a'))[_0x44d3('0x3b')](function(){if(!$(this)[_0x44d3('0x3c')]()[_0x44d3('0x3d')](_0x44d3('0x3e'))){$(this)[_0x44d3('0x3c')]()[_0x44d3('0x2b')](_0x44d3('0x33'));}});});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x3f'),function(){gtag(_0x44d3('0x36'),_0x44d3('0x37'),{'event_category':_0x44d3('0x38'),'event_label':_0x44d3('0x40'),'value':0x1});$(_0x44d3('0x3a'))[_0x44d3('0x3b')](function(){$(this)['parent']()[_0x44d3('0x41')](_0x44d3('0x33'));});});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x42'),function(){let _0x315ad7=$(this)[_0x44d3('0x24')](_0x44d3('0x43'));gtag(_0x44d3('0x36'),_0x44d3('0x37'),{'event_category':_0x44d3('0x38'),'event_label':_0x315ad7,'value':0x1});$('.style')[_0x44d3('0x3b')](function(){$(this)[_0x44d3('0x3c')]()['addClass'](_0x44d3('0x33'));if($(this)[_0x44d3('0x24')]('data-type')===_0x315ad7){$(this)[_0x44d3('0x3c')]()[_0x44d3('0x41')](_0x44d3('0x33'));}});});function updateMyStyle(){if(UID!==undefined&&targetId===undefined){updateData('STYLECHECK',{'SS':sslist,'S':slist,'A':alist},!![]);}}$(document)['on'](_0x44d3('0x34'),'.style',function(){if(targetId!==undefined){return;}let _0xf5f70c=$(this)['parent']()[_0x44d3('0x3d')]('nocheck');let _0xd4c5d4=$(this)['attr'](_0x44d3('0x44'));let _0x1d82d9=$(this)[_0x44d3('0x24')](_0x44d3('0x43'));styleClick(_0x1d82d9,_0xd4c5d4,_0xf5f70c);updateMyStyle();});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x45'),function(){let _0x4f45c7=$(this)['attr'](_0x44d3('0x44'));$(_0x44d3('0x3a'))[_0x44d3('0x3b')](function(){if($(this)[_0x44d3('0x24')](_0x44d3('0x44'))===_0x4f45c7&&!$(this)['hasClass'](_0x44d3('0x33'))){let _0x4901a8=$(this)[_0x44d3('0x24')]('data-rare');let _0x2e33f5=$(this)[_0x44d3('0x24')](_0x44d3('0x43'));styleClick(_0x2e33f5,_0x4901a8,!![]);}});updateMyStyle();});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x46'),function(){let _0x3b8d17=$(this)[_0x44d3('0x24')](_0x44d3('0x44'));$('.style')[_0x44d3('0x3b')](function(){if($(this)[_0x44d3('0x24')](_0x44d3('0x44'))===_0x3b8d17&&!$(this)[_0x44d3('0x3d')](_0x44d3('0x33'))){let _0x44350f=$(this)['attr']('data-rare');let _0x3f6d86=$(this)[_0x44d3('0x24')](_0x44d3('0x43'));styleClick(_0x3f6d86,_0x44350f,![]);}});updateMyStyle();});$(document)['on']('click',_0x44d3('0x47'),function(){gtag('event',_0x44d3('0x48'),{'event_category':_0x44d3('0x38'),'event_label':'Rarity','value':0x1});$('#tabRare')['removeClass'](_0x44d3('0x49'))[_0x44d3('0x2b')](_0x44d3('0x4a'));$(_0x44d3('0x4b'))[_0x44d3('0x2b')](_0x44d3('0x49'))['removeClass'](_0x44d3('0x4a'));$(_0x44d3('0x4c'))['addClass']('style-tab-disabled')[_0x44d3('0x41')](_0x44d3('0x4a'));$('#styleAreaRare')[_0x44d3('0x41')](_0x44d3('0x33'));$(_0x44d3('0x4d'))[_0x44d3('0x3c')]()[_0x44d3('0x2b')](_0x44d3('0x33'));$('#styleAreaGacha')[_0x44d3('0x3c')]()['addClass']('d-none');$('#tabRare')['attr']('style',_0x44d3('0x4e'));$(_0x44d3('0x4b'))[_0x44d3('0x24')]('style','width:30%');$(_0x44d3('0x4c'))[_0x44d3('0x24')](_0x44d3('0x27'),_0x44d3('0x4f'));});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x4b'),function(){gtag(_0x44d3('0x36'),_0x44d3('0x48'),{'event_category':_0x44d3('0x38'),'event_label':_0x44d3('0x50'),'value':0x1});$(_0x44d3('0x4b'))[_0x44d3('0x41')](_0x44d3('0x49'))[_0x44d3('0x2b')]('style-tab-active');$(_0x44d3('0x47'))[_0x44d3('0x2b')](_0x44d3('0x49'))[_0x44d3('0x41')](_0x44d3('0x4a'));$('#tabGacha')[_0x44d3('0x2b')](_0x44d3('0x49'))[_0x44d3('0x41')](_0x44d3('0x4a'));$(_0x44d3('0x51'))[_0x44d3('0x2b')]('d-none');$(_0x44d3('0x4d'))[_0x44d3('0x3c')]()[_0x44d3('0x41')](_0x44d3('0x33'));$(_0x44d3('0x52'))[_0x44d3('0x3c')]()['addClass']('d-none');$('#tabRare')['attr'](_0x44d3('0x27'),_0x44d3('0x4f'));$(_0x44d3('0x4b'))[_0x44d3('0x24')]('style',_0x44d3('0x4e'));$(_0x44d3('0x4c'))[_0x44d3('0x24')](_0x44d3('0x27'),_0x44d3('0x4f'));});$(document)['on']('click',_0x44d3('0x4c'),function(){gtag(_0x44d3('0x36'),_0x44d3('0x48'),{'event_category':_0x44d3('0x38'),'event_label':_0x44d3('0x53'),'value':0x1});$('#tabChar')[_0x44d3('0x2b')]('style-tab-disabled')['removeClass'](_0x44d3('0x4a'));$(_0x44d3('0x47'))[_0x44d3('0x2b')]('style-tab-disabled')['removeClass'](_0x44d3('0x4a'));$(_0x44d3('0x4c'))[_0x44d3('0x41')](_0x44d3('0x49'))['addClass'](_0x44d3('0x4a'));$(_0x44d3('0x51'))[_0x44d3('0x2b')]('d-none');$('#styleAreaChar')[_0x44d3('0x3c')]()[_0x44d3('0x2b')]('d-none');$(_0x44d3('0x52'))[_0x44d3('0x3c')]()[_0x44d3('0x41')](_0x44d3('0x33'));$(_0x44d3('0x47'))[_0x44d3('0x24')](_0x44d3('0x27'),'width:30%');$('#tabChar')[_0x44d3('0x24')](_0x44d3('0x27'),_0x44d3('0x4f'));$(_0x44d3('0x4c'))[_0x44d3('0x24')](_0x44d3('0x27'),_0x44d3('0x4e'));});$(document)['on'](_0x44d3('0x34'),'#displaySummary',function(){let _0x4da028=allCount['SS']+allCount['S']+allCount['A'];let _0x28997e=sslist['length']+slist[_0x44d3('0x54')]+alist[_0x44d3('0x54')];let _0x6c56db='%0D%0A';let _0xea62f0='スタイル所持チェッカー\x20[ロマサガRS便利ツール]\x20'+_0x6c56db;_0xea62f0+='全\x20'+_0x28997e+'体/'+_0x4da028+_0x44d3('0x55')+$(_0x44d3('0x56'))[_0x44d3('0x57')]()[_0x44d3('0x58')]()+'％）'+_0x6c56db;_0xea62f0+=_0x44d3('0x59')+sslist[_0x44d3('0x54')]+'体/'+allCount['SS']+_0x44d3('0x55')+$(_0x44d3('0x5a'))[_0x44d3('0x57')]()[_0x44d3('0x58')]()+'％）'+_0x6c56db;_0xea62f0+='S\x20'+slist[_0x44d3('0x54')]+'体/'+allCount['S']+_0x44d3('0x55')+$('.SPer')[_0x44d3('0x57')]()[_0x44d3('0x58')]()+'％）'+_0x6c56db;_0xea62f0+='A\x20'+alist[_0x44d3('0x54')]+'体/'+allCount['A']+_0x44d3('0x55')+$(_0x44d3('0x5b'))[_0x44d3('0x57')]()[_0x44d3('0x58')]()+'％）'+_0x6c56db;let _0x419527=UID!==undefined?'?'+UID:'';let _0x3424a7=_0x44d3('0x5c')+_0xea62f0+'&url=https://nao-romasaga.github.io/stylecheck.html'+_0x419527+_0x44d3('0x5d');$(_0x44d3('0x5e'))[_0x44d3('0x24')](_0x44d3('0x5f'),_0x3424a7);$(_0x44d3('0x60'))[_0x44d3('0x61')]();$('#modalInner')[_0x44d3('0x62')](_0x44d3('0x63'),'modal\x200.5s\x20forwards');return![];});$(document)['on'](_0x44d3('0x34'),_0x44d3('0x64'),function(){$(_0x44d3('0x60'))[_0x44d3('0x65')]();$(_0x44d3('0x66'))[_0x44d3('0x62')](_0x44d3('0x63'),'modalClose\x200.5s\x20forwards');return![];});let MASTER_LEVEL=[0x0,0x2,0x4,0x6,0x8,0xa,0xc,0xe,0x10,0x13,0x16,0x19,0x1c,0x1f,0x23,0x27,0x2b,0x30,0x35,0x3a,0x40,0x46,0x4c,0x53,0x5a,0x62,0x6a,0x73,0x7c,0x86,0x90,0x9b,0xa7,0xb3,0xc0,0xce,0xdc,0xeb,0xfb,0x10b,0x11c,0x12e,0x141,0x155,0x169,0x17e,0x194,0x1ab,0x1c3,0x1dc];function getMasterLevel(_0xaa82e1){let _0x5a5653=Number(_0xaa82e1)*0x5;let _0x13a5de=0x1;for(let _0x56ac7e in MASTER_LEVEL){let _0x1a8686=MASTER_LEVEL[_0x56ac7e];if(_0x5a5653<_0x1a8686){break;}_0x13a5de=_0x56ac7e;}return Number(_0x13a5de)+0x1;}function calcPer(_0x5a0e62){return Math[_0x44d3('0x67')](_0x5a0e62*0x2710)/0x64;}function styleClick(_0x2acf1b,_0x5d99e4,_0x165f04){let _0x23302d=STYLE_MASTER[_0x2acf1b][_0x44d3('0x68')];let _0x144a5d=alist;if(_0x5d99e4==='SS'){_0x144a5d=sslist;}else if(_0x5d99e4==='S'){_0x144a5d=slist;}$('.'+_0x2acf1b)['each'](function(){if(_0x165f04){$(this)[_0x44d3('0x3c')]()[_0x44d3('0x41')](_0x44d3('0x3e'));}else{$(this)[_0x44d3('0x3c')]()[_0x44d3('0x2b')](_0x44d3('0x3e'));}});if(_0x165f04){if(_0x144a5d[_0x44d3('0x69')](_0x2acf1b)===-0x1){_0x144a5d[_0x44d3('0x6a')](_0x2acf1b);}if(weponType[_0x23302d][_0x44d3('0x69')](_0x2acf1b)===-0x1){weponType[_0x23302d][_0x44d3('0x6a')](_0x2acf1b);}}else{if(weponType[_0x23302d][_0x44d3('0x69')](_0x2acf1b)>-0x1){weponType[_0x23302d]=weponType[_0x23302d][_0x44d3('0x37')](_0x27ab1b=>_0x27ab1b!==_0x2acf1b);}if(_0x5d99e4==='SS'){sslist=_0x144a5d[_0x44d3('0x37')](_0x23552a=>_0x23552a!==_0x2acf1b);}else if(_0x5d99e4==='S'){slist=_0x144a5d[_0x44d3('0x37')](_0x49545f=>_0x49545f!==_0x2acf1b);}else{alist=_0x144a5d[_0x44d3('0x37')](_0x521503=>_0x521503!==_0x2acf1b);}}$(_0x44d3('0x6b'))[_0x44d3('0x58')](sslist[_0x44d3('0x54')]+slist['length']+alist[_0x44d3('0x54')]);$(_0x44d3('0x6c'))[_0x44d3('0x58')](sslist[_0x44d3('0x54')]);$('.myS')[_0x44d3('0x58')](slist[_0x44d3('0x54')]);$(_0x44d3('0x6d'))[_0x44d3('0x58')](alist[_0x44d3('0x54')]);let _0x39411b=sslist[_0x44d3('0x54')]+slist[_0x44d3('0x54')]+alist[_0x44d3('0x54')];let _0x57b6a3=allCount['SS']+allCount['S']+allCount['A'];$(_0x44d3('0x56'))[_0x44d3('0x58')](calcPer(_0x39411b/_0x57b6a3)['toFixed'](0x2));$(_0x44d3('0x5a'))[_0x44d3('0x58')](calcPer(sslist[_0x44d3('0x54')]/allCount['SS'])[_0x44d3('0x6e')](0x2));$(_0x44d3('0x6f'))[_0x44d3('0x58')](calcPer(slist[_0x44d3('0x54')]/allCount['S'])[_0x44d3('0x6e')](0x2));$('.APer')[_0x44d3('0x58')](calcPer(alist[_0x44d3('0x54')]/allCount['A'])['toFixed'](0x2));for(let _0x3fc0c9 in WEPON_ATTR){let _0x4a74d7=Number(weponType[_0x3fc0c9]['length']);$('.my'+_0x3fc0c9)[_0x44d3('0x58')](_0x4a74d7);let _0x3a5e2d=getMasterLevel(_0x4a74d7);$(_0x44d3('0x70')+_0x3fc0c9)[_0x44d3('0x58')](_0x3a5e2d);let _0x45b211=MASTER_LEVEL[_0x3a5e2d]-_0x4a74d7*0x5;let _0x4f2e52=_0x45b211>0x5?Math[_0x44d3('0x71')](_0x45b211/0x5)+0x1:0x1;$(_0x44d3('0x72')+_0x3fc0c9)[_0x44d3('0x58')](_0x4f2e52);$('.myPer'+_0x3fc0c9)[_0x44d3('0x58')](calcPer(_0x4a74d7/allCount[_0x3fc0c9])['toFixed'](0x2));}}function display(){let _0x1281ec=[];for(let _0x2963cb in CHAR_MASTER){let _0x27321e=CHAR_MASTER[_0x2963cb];$(_0x44d3('0x4d'))['append'](_0x27321e[_0x44d3('0x73')]+_0x44d3('0x74'));for(let _0x1c5e86 of _0x27321e[_0x44d3('0x75')]){let _0x5b0ce6=STYLE_MASTER[_0x1c5e86];let _0x435065=_0x5b0ce6[_0x44d3('0x76')];var _0x44e547=_0x5b0ce6[_0x44d3('0x77')]===''?_0x44d3('0x4'):_0x5b0ce6[_0x44d3('0x77')];let _0x2ed4f4=STYLE_MASTER[_0x1c5e86]['WeaponType'];allCount[_0x435065]++;allCount[_0x2ed4f4]++;let _0x3ea950=$(_0x44d3('0x78'))[_0x44d3('0x2b')](_0x44d3('0x27'))['addClass'](getStyleIconClass(_0x435065))[_0x44d3('0x2b')](_0x1c5e86)[_0x44d3('0x24')]('style',getImgUrl(_0x44d3('0x79')+_0x1c5e86+_0x44d3('0x7a')))['attr'](_0x44d3('0x43'),_0x1c5e86)['attr'](_0x44d3('0x44'),_0x435065)[_0x44d3('0x24')](_0x44d3('0x7b'),_0x5b0ce6[_0x44d3('0x68')]);let _0x599408=$(_0x44d3('0x7c'))[_0x44d3('0x2b')](getStyleIconBgClass(_0x435065))[_0x44d3('0x2b')](_0x44d3('0x3e'))[_0x44d3('0x2c')](_0x3ea950);$(_0x44d3('0x4d'))[_0x44d3('0x2c')](_0x599408[_0x44d3('0x7d')]());$('#'+_0x435065+_0x44d3('0x7e'))[_0x44d3('0x2c')](_0x599408[_0x44d3('0x7d')]());if(_0x1281ec[_0x44e547]===undefined){_0x1281ec[_0x44e547]={'SS':[],'S':[],'A':[]};}_0x1281ec[_0x44e547][_0x435065]['push'](_0x599408[_0x44d3('0x7d')]());}$('#styleAreaChar')[_0x44d3('0x2c')]('<br>');}for(let _0x43c430 of gachaList){$(_0x44d3('0x52'))[_0x44d3('0x2c')](_0x43c430+'<br>');console[_0x44d3('0x7f')](_0x43c430,_0x1281ec[_0x43c430]);_0x1281ec[_0x43c430]['SS']=_0x1281ec[_0x43c430]['SS']===undefined?[]:_0x1281ec[_0x43c430]['SS'];_0x1281ec[_0x43c430]['S']=_0x1281ec[_0x43c430]['S']===undefined?[]:_0x1281ec[_0x43c430]['S'];_0x1281ec[_0x43c430]['A']=_0x1281ec[_0x43c430]['A']===undefined?[]:_0x1281ec[_0x43c430]['A'];for(let _0x599408 of _0x1281ec[_0x43c430]['SS']){$(_0x44d3('0x52'))[_0x44d3('0x2c')](_0x599408);}for(let _0x599408 of _0x1281ec[_0x43c430]['S']){$(_0x44d3('0x52'))[_0x44d3('0x2c')](_0x599408);}for(let _0x599408 of _0x1281ec[_0x43c430]['A']){$(_0x44d3('0x52'))[_0x44d3('0x2c')](_0x599408);}$('#styleAreaGacha')['append'](_0x44d3('0x74'));}$(_0x44d3('0x80'))['text'](allCount['SS']+allCount['S']+allCount['A']);$('.allSS')[_0x44d3('0x58')](allCount['SS']);$(_0x44d3('0x81'))[_0x44d3('0x58')](allCount['S']);$(_0x44d3('0x82'))[_0x44d3('0x58')](allCount['A']);for(let _0x1cda66 in WEPON_ATTR){$(_0x44d3('0x80')+_0x1cda66)[_0x44d3('0x58')](allCount[_0x1cda66]);}}function intialMyStyle(){let _0x3df8f5=targetId!==undefined?targetId:UID;readStyleCheckData(_0x3df8f5,function(_0x562e79){if(_0x562e79!==null){sslist=_0x562e79['SS']!==undefined?_0x562e79['SS']:[];slist=_0x562e79['S']!==undefined?_0x562e79['S']:[];alist=_0x562e79['A']!==undefined?_0x562e79['A']:[];for(let _0x4dd551 of sslist){styleClick(_0x4dd551,'SS',!![]);}for(let _0x17fc78 of slist){styleClick(_0x17fc78,'S',!![]);}for(let _0x4f7260 of alist){styleClick(_0x4f7260,'A',!![]);}}},!![]);}