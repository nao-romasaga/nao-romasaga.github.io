var _0x4b31=['.allOn\x20,\x20.allOff\x20,\x20.twitter-share-button','hide','.myinput','d-none','auth','onAuthStateChanged','TwitterAuthProvider','PROVIDER_ID','AuthUI','start','#firebaseui-auth-container','uid','<img>','attr','src','photoURL','width:40px;\x20heidht:40px;\x20\x20\x20\x20border-radius:\x2050%;','displayName','\x20さん:ログイン中','append','Char','Style','.onlyDisable','event','filter','stylecheck','OnlyDisable','.style','hasClass','nocheck','parent','addClass','click','.allType','ALL','each','removeClass','.filterButton','data-id','data-type','.allOn','data-rare','.allOff','#tabRare','Rarity','style-tab-disabled','style-tab-active','#tabChar','#tabGacha','#styleAreaRare','#styleAreaChar','#styleAreaGacha','style','width:33%','width:30%','tab','Gacha','#displaySummary','length','体\x20(','first','text','SS\x20','.SSPer','.SPer','.APer','https://twitter.com/intent/tweet?text=','&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー','.twitter-share-button','href','#modal01','fadeIn','css','animation','modal\x200.5s\x20forwards','fadeOut','#modalInner','modalClose\x200.5s\x20forwards','round','WeaponType','push','.myAll','.mySS','.myS','.myA','.allPer','toFixed','.my','floor','.myNext','Name','<br>','Holders','style_icon/','.png','<span>','clone','gacha','.all','.allS','assign','search','substr'];(function(_0x4b7674,_0x4f5075){var _0xa2dc30=function(_0x478bc9){while(--_0x478bc9){_0x4b7674['push'](_0x4b7674['shift']());}};_0xa2dc30(++_0x4f5075);}(_0x4b31,0xcb));var _0x201c=function(_0x50281a,_0xe08300){_0x50281a=_0x50281a-0x0;var _0x4f64fd=_0x4b31[_0x50281a];return _0x4f64fd;};let charFlg=![],styleFlg=![];let allCount={'SS':0x0,'S':0x0,'A':0x0};for(let key in WEPON_ATTR){allCount[key]=0x0;}let myCount={'SS':0x0,'S':0x0,'A':0x0};var sslist=[];var slist=[];var alist=[];var weponType=Object[_0x201c('0x0')]({},WEPON_ATTR);for(let key in weponType){weponType[key]=[];}var targetId;$(document)['ready'](function(_0x560f45){if(location[_0x201c('0x1')]!==''){targetId=location['search'][_0x201c('0x2')](0x1);_0x560f45(_0x201c('0x3'))[_0x201c('0x4')]();_0x560f45(_0x201c('0x5'))['removeClass'](_0x201c('0x6'));}firebase[_0x201c('0x7')](appUsers)[_0x201c('0x8')](_0x2c5241=>{if(!_0x2c5241){var _0x1008be={'signInSuccessUrl':'https://nao-romasaga.github.io/stylecheck.html','signInOptions':[firebase['auth'][_0x201c('0x9')][_0x201c('0xa')]]};var _0xdfda8b=new firebaseui[(_0x201c('0x7'))][(_0x201c('0xb'))](firebase['auth'](appUsers));_0xdfda8b[_0x201c('0xc')](_0x201c('0xd'),_0x1008be);}else{UID=_0x2c5241[_0x201c('0xe')];_0x560f45('#loginInfo')['hide']();let _0x54a162=_0x560f45(_0x201c('0xf'))[_0x201c('0x10')](_0x201c('0x11'),_0x2c5241[_0x201c('0x12')])[_0x201c('0x10')]('style',_0x201c('0x13'));let _0x4c42ea=_0x2c5241[_0x201c('0x14')]+_0x201c('0x15');_0x560f45(_0x201c('0xd'))['addClass']('bg-white\x20kadomaru')[_0x201c('0x16')](_0x54a162)[_0x201c('0x16')](_0x4c42ea);}});readFile(_0x201c('0x17'),function(_0x422f30){CHAR_MASTER=_0x422f30;charFlg=!![];if(charFlg&&styleFlg){display();}});readFile(_0x201c('0x18'),function(_0x46b3dc){STYLE_MASTER=_0x46b3dc;styleFlg=!![];if(charFlg&&styleFlg){display();}});});$(document)['on']('click',_0x201c('0x19'),function(){gtag(_0x201c('0x1a'),_0x201c('0x1b'),{'event_category':_0x201c('0x1c'),'event_label':_0x201c('0x1d'),'value':0x1});$(_0x201c('0x1e'))['each'](function(){if(!$(this)['parent']()[_0x201c('0x1f')](_0x201c('0x20'))){$(this)[_0x201c('0x21')]()[_0x201c('0x22')](_0x201c('0x6'));}});});$(document)['on'](_0x201c('0x23'),_0x201c('0x24'),function(){gtag(_0x201c('0x1a'),_0x201c('0x1b'),{'event_category':_0x201c('0x1c'),'event_label':_0x201c('0x25'),'value':0x1});$(_0x201c('0x1e'))[_0x201c('0x26')](function(){$(this)[_0x201c('0x21')]()[_0x201c('0x27')](_0x201c('0x6'));});});$(document)['on'](_0x201c('0x23'),_0x201c('0x28'),function(){let _0x5211b6=$(this)[_0x201c('0x10')](_0x201c('0x29'));gtag(_0x201c('0x1a'),_0x201c('0x1b'),{'event_category':_0x201c('0x1c'),'event_label':_0x5211b6,'value':0x1});$(_0x201c('0x1e'))[_0x201c('0x26')](function(){$(this)[_0x201c('0x21')]()[_0x201c('0x22')](_0x201c('0x6'));if($(this)[_0x201c('0x10')](_0x201c('0x2a'))===_0x5211b6){$(this)[_0x201c('0x21')]()[_0x201c('0x27')](_0x201c('0x6'));}});});function updateMyStyle(){if(UID!==undefined&&targetId===undefined){updateData('STYLECHECK',{'SS':sslist,'S':slist,'A':alist});}}$(document)['on'](_0x201c('0x23'),_0x201c('0x1e'),function(){if(targetId!==undefined){return;}let _0x1aaa04=$(this)[_0x201c('0x21')]()[_0x201c('0x1f')]('nocheck');let _0x103873=$(this)[_0x201c('0x10')]('data-rare');let _0x55d99a=$(this)[_0x201c('0x10')](_0x201c('0x29'));styleClick(_0x55d99a,_0x103873,_0x1aaa04);updateMyStyle();});$(document)['on'](_0x201c('0x23'),_0x201c('0x2b'),function(){let _0x3c15a0=$(this)['attr'](_0x201c('0x2c'));$(_0x201c('0x1e'))[_0x201c('0x26')](function(){if($(this)[_0x201c('0x10')]('data-rare')===_0x3c15a0&&!$(this)['hasClass'](_0x201c('0x6'))){let _0x32de37=$(this)['attr']('data-rare');let _0x19838f=$(this)[_0x201c('0x10')]('data-id');styleClick(_0x19838f,_0x32de37,!![]);}});updateMyStyle();});$(document)['on'](_0x201c('0x23'),_0x201c('0x2d'),function(){let _0x4fc37b=$(this)[_0x201c('0x10')](_0x201c('0x2c'));$(_0x201c('0x1e'))[_0x201c('0x26')](function(){if($(this)[_0x201c('0x10')](_0x201c('0x2c'))===_0x4fc37b&&!$(this)[_0x201c('0x1f')]('d-none')){let _0x29883e=$(this)[_0x201c('0x10')](_0x201c('0x2c'));let _0x23f98e=$(this)['attr'](_0x201c('0x29'));styleClick(_0x23f98e,_0x29883e,![]);}});updateMyStyle();});$(document)['on'](_0x201c('0x23'),_0x201c('0x2e'),function(){gtag('event','tab',{'event_category':_0x201c('0x1c'),'event_label':_0x201c('0x2f'),'value':0x1});$(_0x201c('0x2e'))[_0x201c('0x27')](_0x201c('0x30'))[_0x201c('0x22')](_0x201c('0x31'));$(_0x201c('0x32'))[_0x201c('0x22')](_0x201c('0x30'))[_0x201c('0x27')](_0x201c('0x31'));$(_0x201c('0x33'))[_0x201c('0x22')](_0x201c('0x30'))['removeClass']('style-tab-active');$(_0x201c('0x34'))[_0x201c('0x27')](_0x201c('0x6'));$(_0x201c('0x35'))[_0x201c('0x21')]()[_0x201c('0x22')](_0x201c('0x6'));$(_0x201c('0x36'))[_0x201c('0x21')]()[_0x201c('0x22')](_0x201c('0x6'));$(_0x201c('0x2e'))[_0x201c('0x10')](_0x201c('0x37'),_0x201c('0x38'));$(_0x201c('0x32'))[_0x201c('0x10')]('style',_0x201c('0x39'));$('#tabGacha')[_0x201c('0x10')](_0x201c('0x37'),'width:30%');});$(document)['on'](_0x201c('0x23'),'#tabChar',function(){gtag(_0x201c('0x1a'),_0x201c('0x3a'),{'event_category':_0x201c('0x1c'),'event_label':_0x201c('0x17'),'value':0x1});$(_0x201c('0x32'))[_0x201c('0x27')](_0x201c('0x30'))['addClass'](_0x201c('0x31'));$(_0x201c('0x2e'))[_0x201c('0x22')](_0x201c('0x30'))[_0x201c('0x27')](_0x201c('0x31'));$(_0x201c('0x33'))[_0x201c('0x22')](_0x201c('0x30'))[_0x201c('0x27')](_0x201c('0x31'));$(_0x201c('0x34'))[_0x201c('0x22')](_0x201c('0x6'));$(_0x201c('0x35'))[_0x201c('0x21')]()[_0x201c('0x27')]('d-none');$(_0x201c('0x36'))[_0x201c('0x21')]()[_0x201c('0x22')]('d-none');$(_0x201c('0x2e'))[_0x201c('0x10')]('style',_0x201c('0x39'));$(_0x201c('0x32'))['attr']('style',_0x201c('0x38'));$(_0x201c('0x33'))[_0x201c('0x10')]('style',_0x201c('0x39'));});$(document)['on'](_0x201c('0x23'),'#tabGacha',function(){gtag('event',_0x201c('0x3a'),{'event_category':_0x201c('0x1c'),'event_label':_0x201c('0x3b'),'value':0x1});$(_0x201c('0x32'))['addClass'](_0x201c('0x30'))[_0x201c('0x27')](_0x201c('0x31'));$(_0x201c('0x2e'))['addClass'](_0x201c('0x30'))[_0x201c('0x27')]('style-tab-active');$(_0x201c('0x33'))[_0x201c('0x27')](_0x201c('0x30'))[_0x201c('0x22')](_0x201c('0x31'));$(_0x201c('0x34'))[_0x201c('0x22')](_0x201c('0x6'));$(_0x201c('0x35'))[_0x201c('0x21')]()[_0x201c('0x22')](_0x201c('0x6'));$('#styleAreaGacha')['parent']()[_0x201c('0x27')](_0x201c('0x6'));$(_0x201c('0x2e'))[_0x201c('0x10')](_0x201c('0x37'),_0x201c('0x39'));$(_0x201c('0x32'))[_0x201c('0x10')](_0x201c('0x37'),'width:30%');$(_0x201c('0x33'))[_0x201c('0x10')]('style',_0x201c('0x38'));});$(document)['on'](_0x201c('0x23'),_0x201c('0x3c'),function(){let _0x43a4ca=allCount['SS']+allCount['S']+allCount['A'];let _0x2bc1be=sslist[_0x201c('0x3d')]+slist['length']+alist['length'];let _0x2cfcb5='%0D%0A';let _0x69a035='スタイル所持チェッカー\x20[ロマサガRS便利ツール]\x20'+_0x2cfcb5;_0x69a035+='全\x20'+_0x2bc1be+'体/'+_0x43a4ca+_0x201c('0x3e')+$('.allPer')[_0x201c('0x3f')]()[_0x201c('0x40')]()+'％）'+_0x2cfcb5;_0x69a035+=_0x201c('0x41')+sslist[_0x201c('0x3d')]+'体/'+allCount['SS']+_0x201c('0x3e')+$(_0x201c('0x42'))[_0x201c('0x3f')]()['text']()+'％）'+_0x2cfcb5;_0x69a035+='S\x20'+slist[_0x201c('0x3d')]+'体/'+allCount['S']+_0x201c('0x3e')+$(_0x201c('0x43'))['first']()[_0x201c('0x40')]()+'％）'+_0x2cfcb5;_0x69a035+='A\x20'+alist[_0x201c('0x3d')]+'体/'+allCount['A']+_0x201c('0x3e')+$(_0x201c('0x44'))[_0x201c('0x3f')]()[_0x201c('0x40')]()+'％）'+_0x2cfcb5;let _0x121b51=UID!==undefined?'?'+UID:'';let _0x36e86c=_0x201c('0x45')+_0x69a035+'&url=https://nao-romasaga.github.io/stylecheck.html'+_0x121b51+_0x201c('0x46');$(_0x201c('0x47'))['attr'](_0x201c('0x48'),_0x36e86c);$(_0x201c('0x49'))[_0x201c('0x4a')]();$('#modalInner')[_0x201c('0x4b')](_0x201c('0x4c'),_0x201c('0x4d'));return![];});$(document)['on']('click','.modalClose',function(){$(_0x201c('0x49'))[_0x201c('0x4e')]();$(_0x201c('0x4f'))[_0x201c('0x4b')](_0x201c('0x4c'),_0x201c('0x50'));return![];});let MASTER_LEVEL=[0x0,0x2,0x4,0x6,0x8,0xa,0xc,0xe,0x10,0x13,0x16,0x19,0x1c,0x1f,0x23,0x27,0x2b,0x30,0x35,0x3a,0x40,0x46,0x4c,0x53,0x5a,0x62,0x6a,0x73,0x7c,0x86,0x90,0x9b,0xa6,0xb2,0xbe,0xcb,0xd8];function getMasterLevel(_0x2fc4c2){let _0x4ab8c9=Number(_0x2fc4c2)*0x5;let _0x307fd3=0x1;for(let _0x4aadbf in MASTER_LEVEL){let _0x368ede=MASTER_LEVEL[_0x4aadbf];if(_0x4ab8c9<_0x368ede){break;}_0x307fd3=_0x4aadbf;}return Number(_0x307fd3)+0x1;}function calcPer(_0x38cc4f){return Math[_0x201c('0x51')](_0x38cc4f*0x2710)/0x64;}function styleClick(_0xc5367d,_0x220e59,_0x36c33b){let _0x51dc1e=STYLE_MASTER[_0xc5367d][_0x201c('0x52')];let _0x3f22b0=alist;if(_0x220e59==='SS'){_0x3f22b0=sslist;}else if(_0x220e59==='S'){_0x3f22b0=slist;}$('.'+_0xc5367d)[_0x201c('0x26')](function(){if(_0x36c33b){$(this)[_0x201c('0x21')]()[_0x201c('0x27')](_0x201c('0x20'));}else{$(this)[_0x201c('0x21')]()[_0x201c('0x22')]('nocheck');}});if(_0x36c33b){if(_0x3f22b0['indexOf'](_0xc5367d)===-0x1){_0x3f22b0[_0x201c('0x53')](_0xc5367d);}if(weponType[_0x51dc1e]['indexOf'](_0xc5367d)===-0x1){weponType[_0x51dc1e][_0x201c('0x53')](_0xc5367d);}}else{if(weponType[_0x51dc1e]['indexOf'](_0xc5367d)>-0x1){weponType[_0x51dc1e]=weponType[_0x51dc1e][_0x201c('0x1b')](_0x8cfb2a=>_0x8cfb2a!==_0xc5367d);}if(_0x220e59==='SS'){sslist=_0x3f22b0[_0x201c('0x1b')](_0x4b9feb=>_0x4b9feb!==_0xc5367d);}else if(_0x220e59==='S'){slist=_0x3f22b0[_0x201c('0x1b')](_0x3ca204=>_0x3ca204!==_0xc5367d);}else{alist=_0x3f22b0[_0x201c('0x1b')](_0x4b6136=>_0x4b6136!==_0xc5367d);}}$(_0x201c('0x54'))[_0x201c('0x40')](sslist[_0x201c('0x3d')]+slist[_0x201c('0x3d')]+alist[_0x201c('0x3d')]);$(_0x201c('0x55'))[_0x201c('0x40')](sslist[_0x201c('0x3d')]);$(_0x201c('0x56'))[_0x201c('0x40')](slist[_0x201c('0x3d')]);$(_0x201c('0x57'))['text'](alist['length']);let _0x1477b1=sslist['length']+slist[_0x201c('0x3d')]+alist[_0x201c('0x3d')];let _0x19b03=allCount['SS']+allCount['S']+allCount['A'];$(_0x201c('0x58'))[_0x201c('0x40')](calcPer(_0x1477b1/_0x19b03)[_0x201c('0x59')](0x2));$(_0x201c('0x42'))[_0x201c('0x40')](calcPer(sslist[_0x201c('0x3d')]/allCount['SS'])[_0x201c('0x59')](0x2));$(_0x201c('0x43'))[_0x201c('0x40')](calcPer(slist[_0x201c('0x3d')]/allCount['S'])[_0x201c('0x59')](0x2));$('.APer')[_0x201c('0x40')](calcPer(alist['length']/allCount['A'])[_0x201c('0x59')](0x2));for(let _0x59f005 in WEPON_ATTR){let _0xa95c53=Number(weponType[_0x59f005]['length']);$(_0x201c('0x5a')+_0x59f005)[_0x201c('0x40')](_0xa95c53);let _0x20c201=getMasterLevel(_0xa95c53);$('.myMlv'+_0x59f005)['text'](_0x20c201);let _0xda0c9d=MASTER_LEVEL[_0x20c201]-_0xa95c53*0x5;let _0x575cf9=_0xda0c9d>0x5?Math[_0x201c('0x5b')](_0xda0c9d/0x5)+0x1:0x1;$(_0x201c('0x5c')+_0x59f005)['text'](_0x575cf9);$('.myPer'+_0x59f005)[_0x201c('0x40')](calcPer(_0xa95c53/allCount[_0x59f005])[_0x201c('0x59')](0x2));}}function display(){let _0x4a35ef=[];for(let _0x4ff574 in CHAR_MASTER){let _0x4ea342=CHAR_MASTER[_0x4ff574];$(_0x201c('0x35'))[_0x201c('0x16')](_0x4ea342[_0x201c('0x5d')]+_0x201c('0x5e'));for(let _0x1d8ad6 of _0x4ea342[_0x201c('0x5f')]){let _0x74052e=STYLE_MASTER[_0x1d8ad6];let _0x3d6f24=_0x74052e['Rarity'];let _0x2e4a9b=STYLE_MASTER[_0x1d8ad6][_0x201c('0x52')];allCount[_0x3d6f24]++;allCount[_0x2e4a9b]++;let _0xde72f0=$('<button>')['addClass']('style')[_0x201c('0x22')](getStyleIconClass(_0x3d6f24))[_0x201c('0x22')](_0x1d8ad6)[_0x201c('0x10')]('style',getImgUrl(_0x201c('0x60')+_0x1d8ad6+_0x201c('0x61')))[_0x201c('0x10')](_0x201c('0x29'),_0x1d8ad6)['attr'](_0x201c('0x2c'),_0x3d6f24)[_0x201c('0x10')](_0x201c('0x2a'),_0x74052e['WeaponType']);let _0x40a779=$(_0x201c('0x62'))[_0x201c('0x22')](getStyleIconBgClass(_0x3d6f24))[_0x201c('0x22')](_0x201c('0x20'))[_0x201c('0x16')](_0xde72f0);$('#styleAreaChar')[_0x201c('0x16')](_0x40a779[_0x201c('0x63')]());$('#'+_0x3d6f24+'Area')['append'](_0x40a779[_0x201c('0x63')]());if(_0x4a35ef[_0x74052e[_0x201c('0x64')]]===undefined){_0x4a35ef[_0x74052e[_0x201c('0x64')]]={'SS':[],'S':[],'A':[]};}_0x4a35ef[_0x74052e[_0x201c('0x64')]][_0x3d6f24][_0x201c('0x53')](_0x40a779[_0x201c('0x63')]());}$(_0x201c('0x35'))[_0x201c('0x16')](_0x201c('0x5e'));}for(let _0x35da0c in _0x4a35ef){let _0x4b6cc3=_0x35da0c===''?'汎用':_0x35da0c;$('#styleAreaGacha')[_0x201c('0x16')](_0x4b6cc3+_0x201c('0x5e'));for(let _0x40a779 of _0x4a35ef[_0x35da0c]['SS']){$('#styleAreaGacha')['append'](_0x40a779);}for(let _0x40a779 of _0x4a35ef[_0x35da0c]['S']){$('#styleAreaGacha')[_0x201c('0x16')](_0x40a779);}for(let _0x40a779 of _0x4a35ef[_0x35da0c]['A']){$(_0x201c('0x36'))[_0x201c('0x16')](_0x40a779);}$(_0x201c('0x36'))[_0x201c('0x16')](_0x201c('0x5e'));}$(_0x201c('0x65'))[_0x201c('0x40')](allCount['SS']+allCount['S']+allCount['A']);$('.allSS')[_0x201c('0x40')](allCount['SS']);$(_0x201c('0x66'))[_0x201c('0x40')](allCount['S']);$('.allA')[_0x201c('0x40')](allCount['A']);for(let _0x1bddbb in WEPON_ATTR){$(_0x201c('0x65')+_0x1bddbb)['text'](allCount[_0x1bddbb]);}let _0x3e47fc=targetId!==undefined?targetId:UID;readStyleCheckData(_0x3e47fc,function(_0x2527a0){if(_0x2527a0!==null){sslist=_0x2527a0['SS']!==undefined?_0x2527a0['SS']:[];slist=_0x2527a0['S']!==undefined?_0x2527a0['S']:[];alist=_0x2527a0['A']!==undefined?_0x2527a0['A']:[];for(let _0x4d6a3c of sslist){styleClick(_0x4d6a3c,'SS',!![]);}for(let _0x31b59f of slist){styleClick(_0x31b59f,'S',!![]);}for(let _0x1ba14b of alist){styleClick(_0x1ba14b,'A',!![]);}}});}
