var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};
$jscomp.polyfill=function(a,b,c,e){if(b){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];d in c||(c[d]={});c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(a){function b(){this.batch_=null}function c(a){return a instanceof d?a:new d(function(b,c){b(a)})}if(a&&!$jscomp.FORCE_POLYFILL_PROMISE)return a;b.prototype.asyncExecute=function(a){if(null==this.batch_){this.batch_=[];var b=this;this.asyncExecuteFunction(function(){b.executeBatch_()})}this.batch_.push(a)};var e=$jscomp.global.setTimeout;b.prototype.asyncExecuteFunction=function(a){e(a,0)};b.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var a=
this.batch_;this.batch_=[];for(var b=0;b<a.length;++b){var c=a[b];a[b]=null;try{c()}catch(m){this.asyncThrow_(m)}}}this.batch_=null};b.prototype.asyncThrow_=function(a){this.asyncExecuteFunction(function(){throw a;})};var d=function(a){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var b=this.createResolveAndReject_();try{a(b.resolve,b.reject)}catch(l){b.reject(l)}};d.prototype.createResolveAndReject_=function(){function a(a){return function(h){c||(c=!0,a.call(b,h))}}var b=this,c=!1;
return{resolve:a(this.resolveTo_),reject:a(this.reject_)}};d.prototype.resolveTo_=function(a){if(a===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof d)this.settleSameAsPromise_(a);else{a:switch(typeof a){case "object":var b=null!=a;break a;case "function":b=!0;break a;default:b=!1}b?this.resolveToNonPromiseObj_(a):this.fulfill_(a)}};d.prototype.resolveToNonPromiseObj_=function(a){var b=void 0;try{b=a.then}catch(l){this.reject_(l);return}"function"==typeof b?
this.settleSameAsThenable_(b,a):this.fulfill_(a)};d.prototype.reject_=function(a){this.settle_(2,a)};d.prototype.fulfill_=function(a){this.settle_(1,a)};d.prototype.settle_=function(a,b){if(0!=this.state_)throw Error("Cannot settle("+a+", "+b+"): Promise already settled in state"+this.state_);this.state_=a;this.result_=b;this.executeOnSettledCallbacks_()};d.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var a=0;a<this.onSettledCallbacks_.length;++a)k.asyncExecute(this.onSettledCallbacks_[a]);
this.onSettledCallbacks_=null}};var k=new b;d.prototype.settleSameAsPromise_=function(a){var b=this.createResolveAndReject_();a.callWhenSettled_(b.resolve,b.reject)};d.prototype.settleSameAsThenable_=function(a,b){var c=this.createResolveAndReject_();try{a.call(b,c.resolve,c.reject)}catch(m){c.reject(m)}};d.prototype.then=function(a,b){function c(a,b){return"function"==typeof a?function(b){try{e(a(b))}catch(p){h(p)}}:b}var e,h,k=new d(function(a,b){e=a;h=b});this.callWhenSettled_(c(a,e),c(b,h));return k};
d.prototype["catch"]=function(a){return this.then(void 0,a)};d.prototype.callWhenSettled_=function(a,b){function c(){switch(d.state_){case 1:a(d.result_);break;case 2:b(d.result_);break;default:throw Error("Unexpected state: "+d.state_);}}var d=this;null==this.onSettledCallbacks_?k.asyncExecute(c):this.onSettledCallbacks_.push(c)};d.resolve=c;d.reject=function(a){return new d(function(b,c){c(a)})};d.race=function(a){return new d(function(b,d){for(var e=$jscomp.makeIterator(a),h=e.next();!h.done;h=
e.next())c(h.value).callWhenSettled_(b,d)})};d.all=function(a){var b=$jscomp.makeIterator(a),e=b.next();return e.done?c([]):new d(function(a,d){function h(b){return function(c){f[b]=c;k--;0==k&&a(f)}}var f=[],k=0;do f.push(void 0),k++,c(e.value).callWhenSettled_(h(f.length-1),d),e=b.next();while(!e.done)})};return d},"es6","es3");
$jscomp.polyfill("Promise.prototype.finally",function(a){return a?a:function(a){return this.then(function(b){return Promise.resolve(a()).then(function(){return b})},function(b){return Promise.resolve(a()).then(function(){throw b;})})}},"es9","es3");$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};
$jscomp.SymbolClass=function(a,b){this.$jscomp$symbol$id_=a;$jscomp.defineProperty(this,"description",{configurable:!0,writable:!0,value:b})};$jscomp.SymbolClass.prototype.toString=function(){return this.$jscomp$symbol$id_};$jscomp.Symbol=function(){function a(c){if(this instanceof a)throw new TypeError("Symbol is not a constructor");return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX+(c||"")+"_"+b++,c)}var b=0;return a}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("Symbol.iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.asyncIterator;a||(a=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("Symbol.asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.underscoreProtoCanBeSet=function(){var a={a:!0},b={};try{return b.__proto__=a,b.a}catch(c){}return!1};
$jscomp.setPrototypeOf="function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;$jscomp.generator={};$jscomp.generator.ensureIteratorResultIsObject_=function(a){if(!(a instanceof Object))throw new TypeError("Iterator result "+a+" is not an object");};
$jscomp.generator.Context=function(){this.isRunning_=!1;this.yieldAllIterator_=null;this.yieldResult=void 0;this.nextAddress=1;this.finallyAddress_=this.catchAddress_=0;this.finallyContexts_=this.abruptCompletion_=null};$jscomp.generator.Context.prototype.start_=function(){if(this.isRunning_)throw new TypeError("Generator is already running");this.isRunning_=!0};$jscomp.generator.Context.prototype.stop_=function(){this.isRunning_=!1};
$jscomp.generator.Context.prototype.jumpToErrorHandler_=function(){this.nextAddress=this.catchAddress_||this.finallyAddress_};$jscomp.generator.Context.prototype.next_=function(a){this.yieldResult=a};$jscomp.generator.Context.prototype.throw_=function(a){this.abruptCompletion_={exception:a,isException:!0};this.jumpToErrorHandler_()};$jscomp.generator.Context.prototype["return"]=function(a){this.abruptCompletion_={"return":a};this.nextAddress=this.finallyAddress_};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks=function(a){this.abruptCompletion_={jumpTo:a};this.nextAddress=this.finallyAddress_};$jscomp.generator.Context.prototype.yield=function(a,b){this.nextAddress=b;return{value:a}};$jscomp.generator.Context.prototype.yieldAll=function(a,b){var c=$jscomp.makeIterator(a),e=c.next();$jscomp.generator.ensureIteratorResultIsObject_(e);if(e.done)this.yieldResult=e.value,this.nextAddress=b;else return this.yieldAllIterator_=c,this.yield(e.value,b)};
$jscomp.generator.Context.prototype.jumpTo=function(a){this.nextAddress=a};$jscomp.generator.Context.prototype.jumpToEnd=function(){this.nextAddress=0};$jscomp.generator.Context.prototype.setCatchFinallyBlocks=function(a,b){this.catchAddress_=a;void 0!=b&&(this.finallyAddress_=b)};$jscomp.generator.Context.prototype.setFinallyBlock=function(a){this.catchAddress_=0;this.finallyAddress_=a||0};$jscomp.generator.Context.prototype.leaveTryBlock=function(a,b){this.nextAddress=a;this.catchAddress_=b||0};
$jscomp.generator.Context.prototype.enterCatchBlock=function(a){this.catchAddress_=a||0;a=this.abruptCompletion_.exception;this.abruptCompletion_=null;return a};$jscomp.generator.Context.prototype.enterFinallyBlock=function(a,b,c){c?this.finallyContexts_[c]=this.abruptCompletion_:this.finallyContexts_=[this.abruptCompletion_];this.catchAddress_=a||0;this.finallyAddress_=b||0};
$jscomp.generator.Context.prototype.leaveFinallyBlock=function(a,b){var c=this.finallyContexts_.splice(b||0)[0];if(c=this.abruptCompletion_=this.abruptCompletion_||c){if(c.isException)return this.jumpToErrorHandler_();void 0!=c.jumpTo&&this.finallyAddress_<c.jumpTo?(this.nextAddress=c.jumpTo,this.abruptCompletion_=null):this.nextAddress=this.finallyAddress_}else this.nextAddress=a};$jscomp.generator.Context.prototype.forIn=function(a){return new $jscomp.generator.Context.PropertyIterator(a)};
$jscomp.generator.Context.PropertyIterator=function(a){this.object_=a;this.properties_=[];for(var b in a)this.properties_.push(b);this.properties_.reverse()};$jscomp.generator.Context.PropertyIterator.prototype.getNext=function(){for(;0<this.properties_.length;){var a=this.properties_.pop();if(a in this.object_)return a}return null};$jscomp.generator.Engine_=function(a){this.context_=new $jscomp.generator.Context;this.program_=a};
$jscomp.generator.Engine_.prototype.next_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_.next,a,this.context_.next_);this.context_.next_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.return_=function(a){this.context_.start_();var b=this.context_.yieldAllIterator_;if(b)return this.yieldAllStep_("return"in b?b["return"]:function(a){return{value:a,done:!0}},a,this.context_["return"]);this.context_["return"](a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.throw_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"],a,this.context_.next_);this.context_.throw_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.yieldAllStep_=function(a,b,c){try{var e=a.call(this.context_.yieldAllIterator_,b);$jscomp.generator.ensureIteratorResultIsObject_(e);if(!e.done)return this.context_.stop_(),e;var d=e.value}catch(k){return this.context_.yieldAllIterator_=null,this.context_.throw_(k),this.nextStep_()}this.context_.yieldAllIterator_=null;c.call(this.context_,d);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.nextStep_=function(){for(;this.context_.nextAddress;)try{var a=this.program_(this.context_);if(a)return this.context_.stop_(),{value:a.value,done:!1}}catch(b){this.context_.yieldResult=void 0,this.context_.throw_(b)}this.context_.stop_();if(this.context_.abruptCompletion_){a=this.context_.abruptCompletion_;this.context_.abruptCompletion_=null;if(a.isException)throw a.exception;return{value:a["return"],done:!0}}return{value:void 0,done:!0}};
$jscomp.generator.Generator_=function(a){this.next=function(b){return a.next_(b)};this["throw"]=function(b){return a.throw_(b)};this["return"]=function(b){return a.return_(b)};$jscomp.initSymbolIterator();this[Symbol.iterator]=function(){return this}};$jscomp.generator.createGenerator=function(a,b){var c=new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));$jscomp.setPrototypeOf&&$jscomp.setPrototypeOf(c,a.prototype);return c};
$jscomp.asyncExecutePromiseGenerator=function(a){function b(b){return a.next(b)}function c(b){return a["throw"](b)}return new Promise(function(e,d){function k(a){a.done?e(a.value):Promise.resolve(a.value).then(b,c).then(k,d)}k(a.next())})};$jscomp.asyncExecutePromiseGeneratorFunction=function(a){return $jscomp.asyncExecutePromiseGenerator(a())};$jscomp.asyncExecutePromiseGeneratorProgram=function(a){return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))};
var tableLimit=15,CHAR_MASTER,STYLE_MASTER=[],table;initialLoad();var tableData=[];
function initialLoad(){var a,b,c,e,d,k,h,v,l,m,r,t,f,w,n,p,q,g;return $jscomp.asyncExecutePromiseGeneratorProgram(function(u){if(1==u.nextAddress)return a=readFile("Style",function(a){STYLE_MASTER=a}),b=readFile("Char",function(a){CHAR_MASTER=a}),u.yield(Promise.all([b,a]),2);firebase.database().goOffline();firebase.database(appUsers).goOffline();for(c in STYLE_MASTER){e=CONST_STYLE_BONUS_VAL[STYLE_MASTER[c].Rarity];d={};k=$jscomp.makeIterator(PARAM_KEY);for(h=k.next();!h.done;h=k.next())v=h.value,
d[v]=0;for(l in e)if(m=STYLE_MASTER[c].StyleBonus[l],"\u5168\u80fd\u529b\u5024"===m)for(r=$jscomp.makeIterator(PARAM_KEY),h=r.next();!h.done;h=r.next())t=h.value,d[t]+=e[l];else d[PARAM_KEY[PARAM_NAME.indexOf(m)]]+=e[l];f={};w=STYLE_MASTER[c].Id;n=STYLE_MASTER[w].CharacterId;f.Id=c;f.CharId=n;f.Name="<small>"+STYLE_MASTER[c].Name+"<br>"+STYLE_MASTER[c].AnotherName+"</small>";f.rare_icon="./img/icon/icon_"+STYLE_MASTER[c].Rarity+".png";f.style_icon="./img/style_icon/"+STYLE_MASTER[c].IllustId+".png";
f.Series=CHAR_MASTER[n].Series;f.WeaponType="./img/icon/"+ICON_LIST[CHAR_MASTER[n].WeaponType]+".png";f.RareFilter=STYLE_MASTER[c].Rarity;f.SeriesFilter=CHAR_MASTER[n].Series;f.WeaponTypeFilter=ICON_LIST[CHAR_MASTER[n].WeaponType];p=$jscomp.makeIterator(PARAM_KEY);for(q=p.next();!q.done;q=p.next())g=q.value,f["OrgStyleBonusLv50"+g]=STYLE_MASTER[c]["StyleBonusLv50"+g],f["OrgStylePlusLv50"+g]=d[g],f["StyleBonusLv50"+g]=STYLE_MASTER[c]["StyleBonusLv50"+g],f["StyleBonusLv50"+g]+=0<d[g]?"%+"+d[g]:"%",
f["org"+g]=STYLE_MASTER[c]["Limit"+g],f["Limit"+g]=99===STYLE_MASTER[c]["Limit"+g]?"?":LIMIT_BASE+STYLE_MASTER[c]["Limit"+g],f["Max"+g]="?"===f["Limit"+g]?"?":Math.floor(f["Limit"+g]*(1+Number(STYLE_MASTER[c]["StyleBonusLv50"+g])/100))+Number(d[g]);tableData.push(f)}drawTable();u.jumpToEnd()})}
$(".baseValue").click(function(){$(".baseValue").each(function(){$(this).removeClass("icon_btn_off");$(this).addClass("icon_btn_on")});$(this).addClass("icon_btn_off");BASE=Number($(this).attr("data-id"));for(var a in tableData)for(var b=$jscomp.makeIterator(PARAM_KEY),c=b.next();!c.done;c=b.next())c=c.value,tableData[a]["Limit"+c]=99===tableData[a]["org"+c]?"?":BASE+tableData[a]["org"+c],tableData[a]["Max"+c]="?"===tableData[a]["Limit"+c]?"?":Math.floor(tableData[a]["Limit"+c]*(1+Number(tableData[a]["OrgStyleBonusLv50"+
c])/100))+tableData[a].OrgStylePlusLv50;sort=table.getSorters();drawTable();filter();table.setSort(sort)});$(".filterList").click(function(){$(this).parent().toggleClass("filterActive");void 0!==table&&(filter(),gtag("event","clickFilter",{event_category:"limitdata",event_label:$(this).attr("href").substr(1),value:1}))});
function filter(){var a=[],b=[],c=[];$(".filterList").each(function(){var d=$(this).attr("data-type"),e=$(this).attr("href").substr(1);$(this).parent().hasClass("filterActive")&&("WeaponTypeFilter"===d?a.push({field:d,type:"=",value:e}):"RareFilter"===d?c.push({field:d,type:"=",value:e}):b.push({field:d,type:"=",value:e}))});table.clearFilter();var e=[];0<a.length&&e.push(a);0<b.length&&e.push(b);0<c.length&&e.push(c);table.setFilter(e)}
function drawTable(){$("#example-table").remove();$("#example-table-display").append('<div id="example-table" style="width:100%"></div>');var a={align:"right",sortable:!0,sorter:"number",minWidth:40,width:40},b={align:"left",sortable:!0,sorter:"number",minWidth:75,width:75};table=new Tabulator("#example-table",{height:"630px",layout:"fitData",data:tableData,tooltips:!1,history:!0,pagination:"local",paginationSize:tableLimit,initialSort:[],autoResize:!1,resizableRows:!1,resizableColumns:!1,columns:[{title:"",
field:"style_icon",width:45,frozen:!0,formatter:"image",formatterParams:{height:"40px",width:"40px"}},{title:"",field:"rare_icon",formatter:"image",formatterParams:{height:"30px",width:"30px"}},{title:"",field:"Id",visible:!1},{title:"",field:"UserId",visible:!1},{title:"",field:"RareFilter",visible:!1},{title:"",field:"SeriesFilter",visible:!1},{title:"",field:"WeaponTypeFilter",visible:!1},{title:"rank",field:"rank",visible:!1},{title:"\u4f5c\u54c1",field:"Series",width:30,responsive:10},{title:"\u6b66\u5668",
field:"WeaponType",width:30,formatter:"image",formatterParams:{height:"30px",width:"30px"}},{title:"\u540d\u524d",field:"Name",formatter:"html"},Object.assign({title:"\u8155",field:"LimitSTR"},a),Object.assign({title:"\u4f53",field:"LimitVIT"},a),Object.assign({title:"\u5668",field:"LimitDEX"},a),Object.assign({title:"\u901f",field:"LimitAGI"},a),Object.assign({title:"\u77e5",field:"LimitINT"},a),Object.assign({title:"\u7cbe",field:"LimitMND"},a),Object.assign({title:"\u611b",field:"LimitAI"},a),
Object.assign({title:"\u9b45",field:"LimitMI"},a),Object.assign({title:"\u8155% (Lv50)",field:"StyleBonusLv50STR"},b),Object.assign({title:"\u4f53% (Lv50)",field:"StyleBonusLv50VIT"},b),Object.assign({title:"\u5668% (Lv50)",field:"StyleBonusLv50DEX"},b),Object.assign({title:"\u901f% (Lv50)",field:"StyleBonusLv50AGI"},b),Object.assign({title:"\u77e5% (Lv50)",field:"StyleBonusLv50INT"},b),Object.assign({title:"\u7cbe% (Lv50)",field:"StyleBonusLv50MND"},b),Object.assign({title:"\u611b% (Lv50)",field:"StyleBonusLv50AI"},
b),Object.assign({title:"\u9b45% (Lv50)",field:"StyleBonusLv50MI"},b),Object.assign({title:"\u8155(Lv50)",field:"MaxSTR"},b),Object.assign({title:"\u4f53(Lv50)",field:"MaxVIT"},b),Object.assign({title:"\u5668(Lv50)",field:"MaxDEX"},b),Object.assign({title:"\u901f(Lv50)",field:"MaxAGI"},b),Object.assign({title:"\u77e5(Lv50)",field:"MaxINT"},b),Object.assign({title:"\u7cbe(Lv50)",field:"MaxMND"},b),Object.assign({title:"\u611b(Lv50)",field:"MaxAI"},b),Object.assign({title:"\u9b45(Lv50)",field:"MaxMI"},
b)]})};