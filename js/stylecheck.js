var _0x3261=['Rarity','style-tab-disabled','style-tab-active','#tabChar','#tabGacha','#styleAreaRare','#styleAreaChar','#styleAreaGacha','width:33%','width:30%','Char','Gacha','length','%0D%0A','スタイル所持チェッカー\x20[ロマサガRS便利ツール]\x20','体\x20(','first','SS\x20','.SSPer','text','.SPer','.APer','https://twitter.com/intent/tweet?text=','&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー','.twitter-share-button','fadeIn','#modalInner','css','animation','.modalClose','fadeOut','modalClose\x200.5s\x20forwards','round','WeaponType','indexOf','push','.mySS','.myS','.myA','.allPer','toFixed','.my','.myMlv','floor','.myPer','Name','<br>','gacha','<button>','style_icon/','data-type','<span>','clone','Area','log','.all','.allSS','.allS','readStyleCheckData\x20start','readStyleCheckData\x20end','assign','海賊イベント配布','SF2ピックアップガチャ','プラチナガチャ限定','2019.07.31.水着ガチャ','2019.07.31.水着配布','七英雄襲来','螺旋回廊ガチャ限定','キャンペーン配布','初期配布','2019.06.30.南国の楽園ガチャ','2019.06.30.南国の楽園配布','2019.05.29.ハーフアニバーサリーイベント(エミリア編)','2019.05.29.ハーフアニバーサリーイベント配布','2019.06.21.ハーフアニバーサリーイベント(ようせい編)','2019.06.21.ハーフアニバーサリーイベント配布','2019.06.09.ハーフアニバーサリーイベント(アセルス編)','201904.侯国学園イベント','201902.バレンタインデーイベント','201901.正月イベント','201812.クリスマスイベント2','201812.クリスマスイベント1','https://nao-romasaga.github.io/stylecheck.html','auth','TwitterAuthProvider','PROVIDER_ID','#firebaseui-auth-container','hide','<img>','attr','src','photoURL','style','\x20さん:ログイン中','addClass','bg-white\x20kadomaru','append','ready','search','substr','.myinput','removeClass','d-none','click','event','filter','stylecheck','OnlyDisable','.style','each','parent','nocheck','ALL','.filterButton','STYLECHECK','data-rare','data-id','.allOn','hasClass','.allOff','#tabRare','tab'];(function(_0x44f895,_0x10909e){var _0xf6faa0=function(_0x437d1a){while(--_0x437d1a){_0x44f895['push'](_0x44f895['shift']());}};_0xf6faa0(++_0x10909e);}(_0x3261,0xb6));var _0x326a=function(_0xf5869f,_0x8e3f5){_0xf5869f=_0xf5869f-0x0;var _0x16333e=_0x3261[_0xf5869f];return _0x16333e;};let allCount={'SS':0x0,'S':0x0,'A':0x0};for(let key in WEPON_ATTR){allCount[key]=0x0;}let myCount={'SS':0x0,'S':0x0,'A':0x0};var sslist=[];var slist=[];var alist=[];var weponType=Object[_0x326a('0x0')]({},WEPON_ATTR);for(let key in weponType){weponType[key]=[];}var gachaList=['海賊ピックアップガチャ',_0x326a('0x1'),_0x326a('0x2'),_0x326a('0x3'),'汎用',_0x326a('0x4'),_0x326a('0x5'),'ストーリー',_0x326a('0x6'),'常設イベント',_0x326a('0x7'),_0x326a('0x8'),_0x326a('0x9'),_0x326a('0xa'),_0x326a('0xb'),_0x326a('0xc'),_0x326a('0xd'),_0x326a('0xe'),_0x326a('0xf'),_0x326a('0x10'),'201905.GWイベント',_0x326a('0x11'),'201903.ホワイトデーイベント',_0x326a('0x12'),_0x326a('0x13'),_0x326a('0x14'),_0x326a('0x15')];function _noLoginInitial(){var _0x2a76cb={'signInSuccessUrl':_0x326a('0x16'),'signInOptions':[firebase[_0x326a('0x17')][_0x326a('0x18')][_0x326a('0x19')]]};var _0x361e98=new firebaseui[(_0x326a('0x17'))]['AuthUI'](firebase[_0x326a('0x17')](appUsers));_0x361e98['start'](_0x326a('0x1a'),_0x2a76cb);}function _initial(){$('#loginInfo')[_0x326a('0x1b')]();let _0x5ae4c0=$(_0x326a('0x1c'))[_0x326a('0x1d')](_0x326a('0x1e'),USER[_0x326a('0x1f')])[_0x326a('0x1d')](_0x326a('0x20'),'width:40px;\x20heidht:40px;\x20\x20\x20\x20border-radius:\x2050%;');let _0x2fa4ac=USER['displayName']+_0x326a('0x21');$(_0x326a('0x1a'))[_0x326a('0x22')](_0x326a('0x23'))[_0x326a('0x24')](_0x5ae4c0)[_0x326a('0x24')](_0x2fa4ac);display();}var targetId;$(document)[_0x326a('0x25')](function(_0x47cc70){if(location[_0x326a('0x26')]!==''){targetId=location[_0x326a('0x26')][_0x326a('0x27')](0x1);_0x47cc70('.allOn\x20,\x20.allOff\x20,\x20.twitter-share-button')[_0x326a('0x1b')]();_0x47cc70(_0x326a('0x28'))[_0x326a('0x29')](_0x326a('0x2a'));}});$(document)['on'](_0x326a('0x2b'),'.onlyDisable',function(){gtag(_0x326a('0x2c'),_0x326a('0x2d'),{'event_category':_0x326a('0x2e'),'event_label':_0x326a('0x2f'),'value':0x1});$(_0x326a('0x30'))[_0x326a('0x31')](function(){if(!$(this)[_0x326a('0x32')]()['hasClass'](_0x326a('0x33'))){$(this)[_0x326a('0x32')]()[_0x326a('0x22')]('d-none');}});});$(document)['on']('click','.allType',function(){gtag('event',_0x326a('0x2d'),{'event_category':_0x326a('0x2e'),'event_label':_0x326a('0x34'),'value':0x1});$(_0x326a('0x30'))[_0x326a('0x31')](function(){$(this)['parent']()[_0x326a('0x29')](_0x326a('0x2a'));});});$(document)['on'](_0x326a('0x2b'),_0x326a('0x35'),function(){let _0x46d356=$(this)[_0x326a('0x1d')]('data-id');gtag(_0x326a('0x2c'),_0x326a('0x2d'),{'event_category':'stylecheck','event_label':_0x46d356,'value':0x1});$(_0x326a('0x30'))[_0x326a('0x31')](function(){$(this)[_0x326a('0x32')]()[_0x326a('0x22')]('d-none');if($(this)[_0x326a('0x1d')]('data-type')===_0x46d356){$(this)[_0x326a('0x32')]()[_0x326a('0x29')](_0x326a('0x2a'));}});});function updateMyStyle(){if(UID!==undefined&&targetId===undefined){updateData(_0x326a('0x36'),{'SS':sslist,'S':slist,'A':alist},!![]);}}$(document)['on'](_0x326a('0x2b'),'.style',function(){if(targetId!==undefined){return;}let _0x5e47df=$(this)[_0x326a('0x32')]()['hasClass'](_0x326a('0x33'));let _0x2188f7=$(this)[_0x326a('0x1d')](_0x326a('0x37'));let _0x28a0cc=$(this)[_0x326a('0x1d')](_0x326a('0x38'));styleClick(_0x28a0cc,_0x2188f7,_0x5e47df);updateMyStyle();});$(document)['on'](_0x326a('0x2b'),_0x326a('0x39'),function(){let _0x5d85b3=$(this)[_0x326a('0x1d')](_0x326a('0x37'));$('.style')[_0x326a('0x31')](function(){if($(this)['attr']('data-rare')===_0x5d85b3&&!$(this)[_0x326a('0x3a')](_0x326a('0x2a'))){let _0x41729b=$(this)[_0x326a('0x1d')](_0x326a('0x37'));let _0x24a31d=$(this)[_0x326a('0x1d')]('data-id');styleClick(_0x24a31d,_0x41729b,!![]);}});updateMyStyle();});$(document)['on'](_0x326a('0x2b'),_0x326a('0x3b'),function(){let _0x2d3211=$(this)[_0x326a('0x1d')](_0x326a('0x37'));$(_0x326a('0x30'))['each'](function(){if($(this)[_0x326a('0x1d')](_0x326a('0x37'))===_0x2d3211&&!$(this)['hasClass'](_0x326a('0x2a'))){let _0x11a691=$(this)[_0x326a('0x1d')](_0x326a('0x37'));let _0x514607=$(this)[_0x326a('0x1d')](_0x326a('0x38'));styleClick(_0x514607,_0x11a691,![]);}});updateMyStyle();});$(document)['on'](_0x326a('0x2b'),_0x326a('0x3c'),function(){gtag('event',_0x326a('0x3d'),{'event_category':_0x326a('0x2e'),'event_label':_0x326a('0x3e'),'value':0x1});$(_0x326a('0x3c'))['removeClass'](_0x326a('0x3f'))[_0x326a('0x22')](_0x326a('0x40'));$(_0x326a('0x41'))[_0x326a('0x22')](_0x326a('0x3f'))[_0x326a('0x29')](_0x326a('0x40'));$(_0x326a('0x42'))[_0x326a('0x22')](_0x326a('0x3f'))['removeClass']('style-tab-active');$(_0x326a('0x43'))[_0x326a('0x29')](_0x326a('0x2a'));$(_0x326a('0x44'))['parent']()[_0x326a('0x22')]('d-none');$(_0x326a('0x45'))['parent']()[_0x326a('0x22')](_0x326a('0x2a'));$(_0x326a('0x3c'))[_0x326a('0x1d')](_0x326a('0x20'),_0x326a('0x46'));$('#tabChar')[_0x326a('0x1d')](_0x326a('0x20'),_0x326a('0x47'));$(_0x326a('0x42'))[_0x326a('0x1d')](_0x326a('0x20'),'width:30%');});$(document)['on'](_0x326a('0x2b'),_0x326a('0x41'),function(){gtag(_0x326a('0x2c'),_0x326a('0x3d'),{'event_category':_0x326a('0x2e'),'event_label':_0x326a('0x48'),'value':0x1});$('#tabChar')[_0x326a('0x29')](_0x326a('0x3f'))[_0x326a('0x22')](_0x326a('0x40'));$(_0x326a('0x3c'))['addClass']('style-tab-disabled')[_0x326a('0x29')](_0x326a('0x40'));$(_0x326a('0x42'))[_0x326a('0x22')](_0x326a('0x3f'))[_0x326a('0x29')](_0x326a('0x40'));$('#styleAreaRare')['addClass'](_0x326a('0x2a'));$(_0x326a('0x44'))[_0x326a('0x32')]()['removeClass'](_0x326a('0x2a'));$('#styleAreaGacha')[_0x326a('0x32')]()['addClass'](_0x326a('0x2a'));$(_0x326a('0x3c'))[_0x326a('0x1d')](_0x326a('0x20'),_0x326a('0x47'));$(_0x326a('0x41'))['attr'](_0x326a('0x20'),'width:33%');$('#tabGacha')['attr'](_0x326a('0x20'),_0x326a('0x47'));});$(document)['on']('click',_0x326a('0x42'),function(){gtag(_0x326a('0x2c'),_0x326a('0x3d'),{'event_category':_0x326a('0x2e'),'event_label':_0x326a('0x49'),'value':0x1});$(_0x326a('0x41'))[_0x326a('0x22')](_0x326a('0x3f'))[_0x326a('0x29')](_0x326a('0x40'));$(_0x326a('0x3c'))[_0x326a('0x22')](_0x326a('0x3f'))[_0x326a('0x29')]('style-tab-active');$(_0x326a('0x42'))[_0x326a('0x29')](_0x326a('0x3f'))[_0x326a('0x22')](_0x326a('0x40'));$('#styleAreaRare')[_0x326a('0x22')](_0x326a('0x2a'));$(_0x326a('0x44'))[_0x326a('0x32')]()[_0x326a('0x22')](_0x326a('0x2a'));$(_0x326a('0x45'))[_0x326a('0x32')]()[_0x326a('0x29')](_0x326a('0x2a'));$(_0x326a('0x3c'))[_0x326a('0x1d')]('style',_0x326a('0x47'));$(_0x326a('0x41'))['attr'](_0x326a('0x20'),_0x326a('0x47'));$('#tabGacha')[_0x326a('0x1d')](_0x326a('0x20'),_0x326a('0x46'));});$(document)['on'](_0x326a('0x2b'),'#displaySummary',function(){let _0x41df3d=allCount['SS']+allCount['S']+allCount['A'];let _0x1be8f8=sslist[_0x326a('0x4a')]+slist['length']+alist[_0x326a('0x4a')];let _0x1a8732=_0x326a('0x4b');let _0x534cc3=_0x326a('0x4c')+_0x1a8732;_0x534cc3+='全\x20'+_0x1be8f8+'体/'+_0x41df3d+_0x326a('0x4d')+$('.allPer')[_0x326a('0x4e')]()['text']()+'％）'+_0x1a8732;_0x534cc3+=_0x326a('0x4f')+sslist[_0x326a('0x4a')]+'体/'+allCount['SS']+_0x326a('0x4d')+$(_0x326a('0x50'))[_0x326a('0x4e')]()[_0x326a('0x51')]()+'％）'+_0x1a8732;_0x534cc3+='S\x20'+slist[_0x326a('0x4a')]+'体/'+allCount['S']+'体\x20('+$(_0x326a('0x52'))['first']()[_0x326a('0x51')]()+'％）'+_0x1a8732;_0x534cc3+='A\x20'+alist[_0x326a('0x4a')]+'体/'+allCount['A']+_0x326a('0x4d')+$(_0x326a('0x53'))[_0x326a('0x4e')]()[_0x326a('0x51')]()+'％）'+_0x1a8732;let _0x532df0=UID!==undefined?'?'+UID:'';let _0x2c130d=_0x326a('0x54')+_0x534cc3+'&url=https://nao-romasaga.github.io/stylecheck.html'+_0x532df0+_0x326a('0x55');$(_0x326a('0x56'))[_0x326a('0x1d')]('href',_0x2c130d);$('#modal01')[_0x326a('0x57')]();$(_0x326a('0x58'))[_0x326a('0x59')](_0x326a('0x5a'),'modal\x200.5s\x20forwards');return![];});$(document)['on'](_0x326a('0x2b'),_0x326a('0x5b'),function(){$('#modal01')[_0x326a('0x5c')]();$(_0x326a('0x58'))[_0x326a('0x59')](_0x326a('0x5a'),_0x326a('0x5d'));return![];});let MASTER_LEVEL=[0x0,0x2,0x4,0x6,0x8,0xa,0xc,0xe,0x10,0x13,0x16,0x19,0x1c,0x1f,0x23,0x27,0x2b,0x30,0x35,0x3a,0x40,0x46,0x4c,0x53,0x5a,0x62,0x6a,0x73,0x7c,0x86,0x90,0x9b,0xa6,0xb2,0xbe,0xcb,0xd8];function getMasterLevel(_0x590074){let _0xdbf470=Number(_0x590074)*0x5;let _0x54cc4b=0x1;for(let _0xba47aa in MASTER_LEVEL){let _0x34cd15=MASTER_LEVEL[_0xba47aa];if(_0xdbf470<_0x34cd15){break;}_0x54cc4b=_0xba47aa;}return Number(_0x54cc4b)+0x1;}function calcPer(_0x4b3cd7){return Math[_0x326a('0x5e')](_0x4b3cd7*0x2710)/0x64;}function styleClick(_0x25c29e,_0x427142,_0x2fb282){let _0x5574aa=STYLE_MASTER[_0x25c29e][_0x326a('0x5f')];let _0x5a8b00=alist;if(_0x427142==='SS'){_0x5a8b00=sslist;}else if(_0x427142==='S'){_0x5a8b00=slist;}$('.'+_0x25c29e)[_0x326a('0x31')](function(){if(_0x2fb282){$(this)[_0x326a('0x32')]()[_0x326a('0x29')](_0x326a('0x33'));}else{$(this)['parent']()[_0x326a('0x22')](_0x326a('0x33'));}});if(_0x2fb282){if(_0x5a8b00[_0x326a('0x60')](_0x25c29e)===-0x1){_0x5a8b00[_0x326a('0x61')](_0x25c29e);}if(weponType[_0x5574aa]['indexOf'](_0x25c29e)===-0x1){weponType[_0x5574aa][_0x326a('0x61')](_0x25c29e);}}else{if(weponType[_0x5574aa][_0x326a('0x60')](_0x25c29e)>-0x1){weponType[_0x5574aa]=weponType[_0x5574aa][_0x326a('0x2d')](_0x45d1d1=>_0x45d1d1!==_0x25c29e);}if(_0x427142==='SS'){sslist=_0x5a8b00[_0x326a('0x2d')](_0x32671c=>_0x32671c!==_0x25c29e);}else if(_0x427142==='S'){slist=_0x5a8b00[_0x326a('0x2d')](_0x3d3b7=>_0x3d3b7!==_0x25c29e);}else{alist=_0x5a8b00['filter'](_0x49ab3c=>_0x49ab3c!==_0x25c29e);}}$('.myAll')['text'](sslist[_0x326a('0x4a')]+slist[_0x326a('0x4a')]+alist['length']);$(_0x326a('0x62'))[_0x326a('0x51')](sslist['length']);$(_0x326a('0x63'))['text'](slist[_0x326a('0x4a')]);$(_0x326a('0x64'))[_0x326a('0x51')](alist[_0x326a('0x4a')]);let _0x3b805a=sslist[_0x326a('0x4a')]+slist[_0x326a('0x4a')]+alist[_0x326a('0x4a')];let _0x94d0=allCount['SS']+allCount['S']+allCount['A'];$(_0x326a('0x65'))[_0x326a('0x51')](calcPer(_0x3b805a/_0x94d0)[_0x326a('0x66')](0x2));$('.SSPer')[_0x326a('0x51')](calcPer(sslist[_0x326a('0x4a')]/allCount['SS'])[_0x326a('0x66')](0x2));$(_0x326a('0x52'))[_0x326a('0x51')](calcPer(slist[_0x326a('0x4a')]/allCount['S'])['toFixed'](0x2));$(_0x326a('0x53'))[_0x326a('0x51')](calcPer(alist[_0x326a('0x4a')]/allCount['A'])['toFixed'](0x2));for(let _0x50731f in WEPON_ATTR){let _0x5b6da1=Number(weponType[_0x50731f][_0x326a('0x4a')]);$(_0x326a('0x67')+_0x50731f)['text'](_0x5b6da1);let _0x1d9e14=getMasterLevel(_0x5b6da1);$(_0x326a('0x68')+_0x50731f)[_0x326a('0x51')](_0x1d9e14);let _0x491419=MASTER_LEVEL[_0x1d9e14]-_0x5b6da1*0x5;let _0x50a18d=_0x491419>0x5?Math[_0x326a('0x69')](_0x491419/0x5)+0x1:0x1;$('.myNext'+_0x50731f)[_0x326a('0x51')](_0x50a18d);$(_0x326a('0x6a')+_0x50731f)[_0x326a('0x51')](calcPer(_0x5b6da1/allCount[_0x50731f])['toFixed'](0x2));}}function display(){let _0x44e5b6=[];for(let _0x1b558a in CHAR_MASTER){let _0x2d44ac=CHAR_MASTER[_0x1b558a];$(_0x326a('0x44'))['append'](_0x2d44ac[_0x326a('0x6b')]+_0x326a('0x6c'));for(let _0x4c8d7f of _0x2d44ac['Holders']){let _0x5318f7=STYLE_MASTER[_0x4c8d7f];let _0xf9820e=_0x5318f7[_0x326a('0x3e')];var _0x418b73=_0x5318f7[_0x326a('0x6d')]===''?_0x326a('0x3'):_0x5318f7[_0x326a('0x6d')];let _0x4a541e=STYLE_MASTER[_0x4c8d7f][_0x326a('0x5f')];allCount[_0xf9820e]++;allCount[_0x4a541e]++;let _0x5952d5=$(_0x326a('0x6e'))[_0x326a('0x22')](_0x326a('0x20'))[_0x326a('0x22')](getStyleIconClass(_0xf9820e))[_0x326a('0x22')](_0x4c8d7f)['attr'](_0x326a('0x20'),getImgUrl(_0x326a('0x6f')+_0x4c8d7f+'.png'))['attr'](_0x326a('0x38'),_0x4c8d7f)[_0x326a('0x1d')](_0x326a('0x37'),_0xf9820e)[_0x326a('0x1d')](_0x326a('0x70'),_0x5318f7[_0x326a('0x5f')]);let _0x5c49d5=$(_0x326a('0x71'))[_0x326a('0x22')](getStyleIconBgClass(_0xf9820e))[_0x326a('0x22')](_0x326a('0x33'))['append'](_0x5952d5);$('#styleAreaChar')[_0x326a('0x24')](_0x5c49d5[_0x326a('0x72')]());$('#'+_0xf9820e+_0x326a('0x73'))[_0x326a('0x24')](_0x5c49d5['clone']());if(_0x44e5b6[_0x418b73]===undefined){_0x44e5b6[_0x418b73]={'SS':[],'S':[],'A':[]};}_0x44e5b6[_0x418b73][_0xf9820e]['push'](_0x5c49d5[_0x326a('0x72')]());}$(_0x326a('0x44'))[_0x326a('0x24')](_0x326a('0x6c'));}for(let _0x141a66 of gachaList){$(_0x326a('0x45'))[_0x326a('0x24')](_0x141a66+'<br>');console[_0x326a('0x74')](_0x141a66,_0x44e5b6[_0x141a66]);_0x44e5b6[_0x141a66]['SS']=_0x44e5b6[_0x141a66]['SS']===undefined?[]:_0x44e5b6[_0x141a66]['SS'];_0x44e5b6[_0x141a66]['S']=_0x44e5b6[_0x141a66]['S']===undefined?[]:_0x44e5b6[_0x141a66]['S'];_0x44e5b6[_0x141a66]['A']=_0x44e5b6[_0x141a66]['A']===undefined?[]:_0x44e5b6[_0x141a66]['A'];for(let _0x5c49d5 of _0x44e5b6[_0x141a66]['SS']){$(_0x326a('0x45'))[_0x326a('0x24')](_0x5c49d5);}for(let _0x5c49d5 of _0x44e5b6[_0x141a66]['S']){$(_0x326a('0x45'))[_0x326a('0x24')](_0x5c49d5);}for(let _0x5c49d5 of _0x44e5b6[_0x141a66]['A']){$(_0x326a('0x45'))['append'](_0x5c49d5);}$('#styleAreaGacha')[_0x326a('0x24')](_0x326a('0x6c'));}$(_0x326a('0x75'))['text'](allCount['SS']+allCount['S']+allCount['A']);$(_0x326a('0x76'))[_0x326a('0x51')](allCount['SS']);$(_0x326a('0x77'))[_0x326a('0x51')](allCount['S']);$('.allA')['text'](allCount['A']);for(let _0x22dfc6 in WEPON_ATTR){$(_0x326a('0x75')+_0x22dfc6)[_0x326a('0x51')](allCount[_0x22dfc6]);}let _0x37840a=targetId!==undefined?targetId:UID;console['log'](_0x326a('0x78'));readStyleCheckData(_0x37840a,function(_0x54ad9b){console[_0x326a('0x74')](_0x326a('0x79'),_0x54ad9b);if(_0x54ad9b!==null){sslist=_0x54ad9b['SS']!==undefined?_0x54ad9b['SS']:[];slist=_0x54ad9b['S']!==undefined?_0x54ad9b['S']:[];alist=_0x54ad9b['A']!==undefined?_0x54ad9b['A']:[];for(let _0x4c8d7f of sslist){styleClick(_0x4c8d7f,'SS',!![]);}for(let _0x4c8d7f of slist){styleClick(_0x4c8d7f,'S',!![]);}for(let _0x4c8d7f of alist){styleClick(_0x4c8d7f,'A',!![]);}}},!![]);}
