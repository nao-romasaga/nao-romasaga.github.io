var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var c=0;return function(){return c<a.length?{done:!1,value:a[c++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var c="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return c?c.call(a):$jscomp.arrayIterator(a)};
$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,c,b){a!=Array.prototype&&a!=Object.prototype&&(a[c]=b.value)};
$jscomp.polyfill=function(a,c,b,d){if(c){b=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in b||(b[e]={});b=b[e]}a=a[a.length-1];d=b[a];c=c(d);c!=d&&null!=c&&$jscomp.defineProperty(b,a,{configurable:!0,writable:!0,value:c})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(a){function c(){this.batch_=null}function b(a){return a instanceof e?a:new e(function(b,c){b(a)})}if(a&&!$jscomp.FORCE_POLYFILL_PROMISE)return a;c.prototype.asyncExecute=function(a){if(null==this.batch_){this.batch_=[];var b=this;this.asyncExecuteFunction(function(){b.executeBatch_()})}this.batch_.push(a)};var d=$jscomp.global.setTimeout;c.prototype.asyncExecuteFunction=function(a){d(a,0)};c.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var a=
this.batch_;this.batch_=[];for(var b=0;b<a.length;++b){var c=a[b];a[b]=null;try{c()}catch(l){this.asyncThrow_(l)}}}this.batch_=null};c.prototype.asyncThrow_=function(a){this.asyncExecuteFunction(function(){throw a;})};var e=function(a){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var b=this.createResolveAndReject_();try{a(b.resolve,b.reject)}catch(f){b.reject(f)}};e.prototype.createResolveAndReject_=function(){function a(a){return function(h){c||(c=!0,a.call(b,h))}}var b=this,c=!1;
return{resolve:a(this.resolveTo_),reject:a(this.reject_)}};e.prototype.resolveTo_=function(a){if(a===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof e)this.settleSameAsPromise_(a);else{a:switch(typeof a){case "object":var b=null!=a;break a;case "function":b=!0;break a;default:b=!1}b?this.resolveToNonPromiseObj_(a):this.fulfill_(a)}};e.prototype.resolveToNonPromiseObj_=function(a){var b=void 0;try{b=a.then}catch(f){this.reject_(f);return}"function"==typeof b?
this.settleSameAsThenable_(b,a):this.fulfill_(a)};e.prototype.reject_=function(a){this.settle_(2,a)};e.prototype.fulfill_=function(a){this.settle_(1,a)};e.prototype.settle_=function(a,b){if(0!=this.state_)throw Error("Cannot settle("+a+", "+b+"): Promise already settled in state"+this.state_);this.state_=a;this.result_=b;this.executeOnSettledCallbacks_()};e.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var a=0;a<this.onSettledCallbacks_.length;++a)g.asyncExecute(this.onSettledCallbacks_[a]);
this.onSettledCallbacks_=null}};var g=new c;e.prototype.settleSameAsPromise_=function(a){var b=this.createResolveAndReject_();a.callWhenSettled_(b.resolve,b.reject)};e.prototype.settleSameAsThenable_=function(a,b){var c=this.createResolveAndReject_();try{a.call(b,c.resolve,c.reject)}catch(l){c.reject(l)}};e.prototype.then=function(a,b){function c(a,b){return"function"==typeof a?function(b){try{d(a(b))}catch(w){h(w)}}:b}var d,h,n=new e(function(a,b){d=a;h=b});this.callWhenSettled_(c(a,d),c(b,h));return n};
e.prototype["catch"]=function(a){return this.then(void 0,a)};e.prototype.callWhenSettled_=function(a,b){function c(){switch(d.state_){case 1:a(d.result_);break;case 2:b(d.result_);break;default:throw Error("Unexpected state: "+d.state_);}}var d=this;null==this.onSettledCallbacks_?g.asyncExecute(c):this.onSettledCallbacks_.push(c)};e.resolve=b;e.reject=function(a){return new e(function(b,c){c(a)})};e.race=function(a){return new e(function(c,d){for(var f=$jscomp.makeIterator(a),h=f.next();!h.done;h=
f.next())b(h.value).callWhenSettled_(c,d)})};e.all=function(a){var c=$jscomp.makeIterator(a),d=c.next();return d.done?b([]):new e(function(a,h){function f(b){return function(c){e[b]=c;l--;0==l&&a(e)}}var e=[],l=0;do e.push(void 0),l++,b(d.value).callWhenSettled_(f(e.length-1),h),d=c.next();while(!d.done)})};return e},"es6","es3");
$jscomp.polyfill("Promise.prototype.finally",function(a){return a?a:function(a){return this.then(function(b){return Promise.resolve(a()).then(function(){return b})},function(b){return Promise.resolve(a()).then(function(){throw b;})})}},"es9","es3");$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};
$jscomp.SymbolClass=function(a,c){this.$jscomp$symbol$id_=a;$jscomp.defineProperty(this,"description",{configurable:!0,writable:!0,value:c})};$jscomp.SymbolClass.prototype.toString=function(){return this.$jscomp$symbol$id_};$jscomp.Symbol=function(){function a(b){if(this instanceof a)throw new TypeError("Symbol is not a constructor");return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX+(b||"")+"_"+c++,b)}var c=0;return a}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("Symbol.iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.asyncIterator;a||(a=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("Symbol.asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.underscoreProtoCanBeSet=function(){var a={a:!0},c={};try{return c.__proto__=a,c.a}catch(b){}return!1};
$jscomp.setPrototypeOf="function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(a,c){a.__proto__=c;if(a.__proto__!==c)throw new TypeError(a+" is not extensible");return a}:null;$jscomp.generator={};$jscomp.generator.ensureIteratorResultIsObject_=function(a){if(!(a instanceof Object))throw new TypeError("Iterator result "+a+" is not an object");};
$jscomp.generator.Context=function(){this.isRunning_=!1;this.yieldAllIterator_=null;this.yieldResult=void 0;this.nextAddress=1;this.finallyAddress_=this.catchAddress_=0;this.finallyContexts_=this.abruptCompletion_=null};$jscomp.generator.Context.prototype.start_=function(){if(this.isRunning_)throw new TypeError("Generator is already running");this.isRunning_=!0};$jscomp.generator.Context.prototype.stop_=function(){this.isRunning_=!1};
$jscomp.generator.Context.prototype.jumpToErrorHandler_=function(){this.nextAddress=this.catchAddress_||this.finallyAddress_};$jscomp.generator.Context.prototype.next_=function(a){this.yieldResult=a};$jscomp.generator.Context.prototype.throw_=function(a){this.abruptCompletion_={exception:a,isException:!0};this.jumpToErrorHandler_()};$jscomp.generator.Context.prototype["return"]=function(a){this.abruptCompletion_={"return":a};this.nextAddress=this.finallyAddress_};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks=function(a){this.abruptCompletion_={jumpTo:a};this.nextAddress=this.finallyAddress_};$jscomp.generator.Context.prototype.yield=function(a,c){this.nextAddress=c;return{value:a}};$jscomp.generator.Context.prototype.yieldAll=function(a,c){var b=$jscomp.makeIterator(a),d=b.next();$jscomp.generator.ensureIteratorResultIsObject_(d);if(d.done)this.yieldResult=d.value,this.nextAddress=c;else return this.yieldAllIterator_=b,this.yield(d.value,c)};
$jscomp.generator.Context.prototype.jumpTo=function(a){this.nextAddress=a};$jscomp.generator.Context.prototype.jumpToEnd=function(){this.nextAddress=0};$jscomp.generator.Context.prototype.setCatchFinallyBlocks=function(a,c){this.catchAddress_=a;void 0!=c&&(this.finallyAddress_=c)};$jscomp.generator.Context.prototype.setFinallyBlock=function(a){this.catchAddress_=0;this.finallyAddress_=a||0};$jscomp.generator.Context.prototype.leaveTryBlock=function(a,c){this.nextAddress=a;this.catchAddress_=c||0};
$jscomp.generator.Context.prototype.enterCatchBlock=function(a){this.catchAddress_=a||0;a=this.abruptCompletion_.exception;this.abruptCompletion_=null;return a};$jscomp.generator.Context.prototype.enterFinallyBlock=function(a,c,b){b?this.finallyContexts_[b]=this.abruptCompletion_:this.finallyContexts_=[this.abruptCompletion_];this.catchAddress_=a||0;this.finallyAddress_=c||0};
$jscomp.generator.Context.prototype.leaveFinallyBlock=function(a,c){var b=this.finallyContexts_.splice(c||0)[0];if(b=this.abruptCompletion_=this.abruptCompletion_||b){if(b.isException)return this.jumpToErrorHandler_();void 0!=b.jumpTo&&this.finallyAddress_<b.jumpTo?(this.nextAddress=b.jumpTo,this.abruptCompletion_=null):this.nextAddress=this.finallyAddress_}else this.nextAddress=a};$jscomp.generator.Context.prototype.forIn=function(a){return new $jscomp.generator.Context.PropertyIterator(a)};
$jscomp.generator.Context.PropertyIterator=function(a){this.object_=a;this.properties_=[];for(var c in a)this.properties_.push(c);this.properties_.reverse()};$jscomp.generator.Context.PropertyIterator.prototype.getNext=function(){for(;0<this.properties_.length;){var a=this.properties_.pop();if(a in this.object_)return a}return null};$jscomp.generator.Engine_=function(a){this.context_=new $jscomp.generator.Context;this.program_=a};
$jscomp.generator.Engine_.prototype.next_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_.next,a,this.context_.next_);this.context_.next_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.return_=function(a){this.context_.start_();var c=this.context_.yieldAllIterator_;if(c)return this.yieldAllStep_("return"in c?c["return"]:function(a){return{value:a,done:!0}},a,this.context_["return"]);this.context_["return"](a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.throw_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"],a,this.context_.next_);this.context_.throw_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.yieldAllStep_=function(a,c,b){try{var d=a.call(this.context_.yieldAllIterator_,c);$jscomp.generator.ensureIteratorResultIsObject_(d);if(!d.done)return this.context_.stop_(),d;var e=d.value}catch(g){return this.context_.yieldAllIterator_=null,this.context_.throw_(g),this.nextStep_()}this.context_.yieldAllIterator_=null;b.call(this.context_,e);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.nextStep_=function(){for(;this.context_.nextAddress;)try{var a=this.program_(this.context_);if(a)return this.context_.stop_(),{value:a.value,done:!1}}catch(c){this.context_.yieldResult=void 0,this.context_.throw_(c)}this.context_.stop_();if(this.context_.abruptCompletion_){a=this.context_.abruptCompletion_;this.context_.abruptCompletion_=null;if(a.isException)throw a.exception;return{value:a["return"],done:!0}}return{value:void 0,done:!0}};
$jscomp.generator.Generator_=function(a){this.next=function(c){return a.next_(c)};this["throw"]=function(c){return a.throw_(c)};this["return"]=function(c){return a.return_(c)};$jscomp.initSymbolIterator();this[Symbol.iterator]=function(){return this}};$jscomp.generator.createGenerator=function(a,c){var b=new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(c));$jscomp.setPrototypeOf&&$jscomp.setPrototypeOf(b,a.prototype);return b};
$jscomp.asyncExecutePromiseGenerator=function(a){function c(b){return a.next(b)}function b(b){return a["throw"](b)}return new Promise(function(d,e){function g(a){a.done?d(a.value):Promise.resolve(a.value).then(c,b).then(g,e)}g(a.next())})};$jscomp.asyncExecutePromiseGeneratorFunction=function(a){return $jscomp.asyncExecutePromiseGenerator(a())};$jscomp.asyncExecutePromiseGeneratorProgram=function(a){return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))};
var BASE_SKILL_LIST=[],USE_SKILL_LIST=[],NOW_CHAR={},NOW_CHAR_ID="",NOW_STYLE={},NOW_PARTY=0,PARTY_LIST=[[]],BASE=LIMIT_BASE,UID,dotStyle=" margin-left:0px; position: relative;",EVENT_ABILITY={1563735600:["dotID36a38","dotID35d54","dotID39274","dotID377e4"],156555E4:["dotID94f34","dotID94f98","dotID94ffc","dotID95060"],1565809200:["dotID33518","dotID7c8f8","dotIDad764","dotID33ce8","dotID33770"]};
function _noLoginInitial(){var a={signInSuccessUrl:"https://nao-romasaga.github.io/party.html",signInOptions:[firebase.auth.TwitterAuthProvider.PROVIDER_ID]};(new firebaseui.auth.AuthUI(firebase.auth(appUsers))).start("#firebaseui-auth-container",a)}
function _initial(){var a,c;return $jscomp.asyncExecutePromiseGeneratorProgram(function(b){$(".noLogin").hide();$(".isLogin").removeClass("d-none");$("#loginInfo").hide();a=$("<img>").attr("src",USER.photoURL).attr("style","width:40px; heidht:40px;    border-radius: 50%;");c=USER.displayName+" \u3055\u3093:\u30ed\u30b0\u30a4\u30f3\u4e2d";$("#firebaseui-auth-container").addClass("bg-white kadomaru").append(a).append(c);return b.yield(init(),0)})}
function init(){var a,c,b,d,e,g,n,h,f,l,r,t,m;return $jscomp.asyncExecutePromiseGeneratorProgram(function(q){if(1==q.nextAddress)return a=readUserData("PARTY",function(a){return $jscomp.asyncExecutePromiseGeneratorProgram(function(b){PARTY_LIST=null===a?[[]]:a;b.jumpToEnd()})}),dispChar(CHAR_MASTER),$("#charData").show(),$('[data-toggle="tooltip"]').tooltip(),q.yield(Promise.all([a]),2);if(3!=q.nextAddress)return null===PARTY_LIST?q["return"]():q.yield(renderParty(),3);$(".initialHide").removeClass("d-none");
$(".initialShow").slideUp();c=new Date;b=Math.floor(c.getTime()/1E3);for(d in EVENT_ABILITY)if(d>b)for(console.log(b,d,EVENT_ABILITY[d]),e=new Date(1E3*d),g=e.getMonth()+1,n=e.getDate(),h=("0"+e.getHours()).slice(-2),f=("0"+e.getMinutes()).slice(-2),l=$("<div>").append("<div>"+g+"/"+n+" "+h+":"+f+"\u307e\u3067</div>"),$("#_icon_toku").append(l),r=$jscomp.makeIterator(EVENT_ABILITY[d]),t=r.next();!t.done;t=r.next())m=t.value,$("#_icon_toku").append($("."+m).first().clone());setLimitData();q.jumpToEnd()})}
function renderParty(){var a,c,b,d,e;return $jscomp.asyncExecutePromiseGeneratorProgram(function(g){a=0;PARTY_LIST[0]=PARTY_LIST[0].filter(function(a){return void 0!==CHAR_MASTER[a["char"]]});c=PARTY_LIST[0][a];b=[];for(d={};void 0!==c;)d.$jscomp$loop$prop$charId$14=c["char"],d.$jscomp$loop$prop$styleId$15=c.style,NOW_CHAR=CHAR_MASTER[d.$jscomp$loop$prop$charId$14],selectDotHensei(CHAR_MASTER[d.$jscomp$loop$prop$charId$14]),e=asyncReadUserDataWithId("CHAR",d.$jscomp$loop$prop$charId$14,function(a){return function(b){return $jscomp.asyncExecutePromiseGeneratorProgram(function(c){if(1==
c.nextAddress)return c.yield(displayCharInfo(CHAR_MASTER[a.$jscomp$loop$prop$charId$14],b),2);if(3!=c.nextAddress)return c.yield(displayStyleInfo(a.$jscomp$loop$prop$charId$14,a.$jscomp$loop$prop$styleId$15),3);closeInput(a.$jscomp$loop$prop$charId$14,!1);c.jumpToEnd()})}}(d)),b.push(e),c=PARTY_LIST[0][++a],d={$jscomp$loop$prop$charId$14:d.$jscomp$loop$prop$charId$14,$jscomp$loop$prop$styleId$15:d.$jscomp$loop$prop$styleId$15};return g.yield(Promise.all(b),0)})}
function closeInput(a,c){c=void 0===c?!1:c;$(".charTmpl"+a).find(".fukidashiInput").slideUp(250);c&&saveCharData(a)}
$(document).ready(function(a){function c(b,c){var d=b.parents(".charTable").attr("data-charid"),h=b.attr("data-param");a(".char"+h+d).each(function(){a(this).text(c)});a(".charInput"+h+d).each(function(){a(this).val(c)});e(d)}function b(b){var c=CHAR_MASTER[b];a(".charTmpl"+b).parents(".charTableParent").slideUp(500);selectDotReset(c);a("#PARTY").find(".charTmpl"+b).remove();a("#JINKEI"+b).remove();c=d(b);-1!==c&&PARTY_LIST[NOW_PARTY].splice(c,1);g();saveCharData(b)}function d(a){for(var b in PARTY_LIST[NOW_PARTY])if(PARTY_LIST[NOW_PARTY][b]["char"]===
a)return b;return-1}function e(b){b=void 0===b?NOW_CHAR.Id:b;for(var c=$jscomp.makeIterator(PARAM_KEY_HP),d=c.next();!d.done;d=c.next()){d=d.value;var e=a(".char"+d+b).first().text();CHAR_MASTER[b]["NOW"+d]=Number(e)}NOW_CHAR_ID!==b&&(""!==NOW_CHAR_ID&&saveCharData(NOW_CHAR_ID),NOW_CHAR_ID=b);setLimitData()}function g(){updateData("PARTY",PARTY_LIST)}function n(b){gtag("event","showModal",{event_category:"party",event_label:"show",value:1});a("#allSubmit").attr("data-input",a(b).val());a("#allSubmit").attr("data-charId",
a(b).attr("data-id"));b=splitParam(a(b).val(),"\u4e0d\u660e");var c="HP: "+b[0]+"<br>";c+="\u8155\u529b: "+b[1]+" \u4f53\u529b:"+b[2]+"<br>";c+="\u5668\u7528\u3055: "+b[3]+" \u7d20\u65e9\u3055:"+b[4]+"<br>";c+="\u77e5\u529b: "+b[5]+" \u7cbe\u795e:"+b[6]+"<br>";c+="\u3000\u611b: "+b[7]+" \u9b45\u529b:"+b[8]+"<br>";c+="\u304c\u5165\u529b\u3055\u308c\u307e\u3057\u305f<br>\u3053\u306e\u5185\u5bb9\u3092\u53cd\u6620\u3057\u3066\u3082\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f";a("#allParamConfirm").html(c);
a("#modal01").fadeIn();a("#allParamConfirmInner").css("animation","modal 0.5s forwards");return!1}a(".filterList").click(function(){a(".weaponList").addClass("d-none");var b=a(this).attr("href").substr(1);a(this).parent().hasClass("filterActive")?(a(".SeriesChoise").removeClass("d-none"),a(".filterList").each(function(){a(this).parent().removeClass("filterActive")})):(a(".SeriesChoise").addClass("d-none"),a("#_"+b).removeClass("d-none"),a(".filterList").each(function(){a(this).parent().removeClass("filterActive")}),
a(this).parent().toggleClass("filterActive"))});initialHide();a(".tab-content").on("click",function(){});a(document).on("click",".paramButton",function(){var b=a(this).parent().find(".charParam"),d="plus"===a(this).attr("data-pm")?1:-1,e=b.val();d=Number(e)+d;b.val(d);c(a(this),d)});a(document).on("click",".CHAR_SAVE",function(){var b=a(this).attr("data-id");a(this).removeClass("icon_btn_on").addClass("icon_btn_off");a(this).slideUp(200,function(){a(this).slideDown(200);a(this).removeClass("icon_btn_off").addClass("icon_btn_on");
e(b);saveCharData(b)})});a(document).on("change",".charParam",function(){c(a(this),a(this).val())});a('[data-toggle="tooltip"]').tooltip();a(document).on("click",".openMenu, .nowData > td",function(){setLimitData();var b=void 0!==a(this).attr("data-id")?a(this).attr("data-id"):a(this).parent().attr("data-id");NOW_CHAR=CHAR_MASTER[b];"display: block;"===a(".charTmpl"+b).find(".fukidashiInput").attr("style")&&saveCharData(b);a(".charTmpl"+b).find(".fukidashiInput").slideToggle(250)});a(document).on("click",
".btn_close",function(){closeInput(a(this).attr("data-id"),!0)});a(document).on("click",".charUnset",function(){var c=a(this).attr("data-id");b(c)});a(document).on("click",".tab-content .char, .weaponList  .char",function(){var c=this,e,l,r,n,m;return $jscomp.asyncExecutePromiseGeneratorProgram(function(f){firebase.database().goOnline();firebase.database(appUsers).goOnline();e=a(c).attr("data-id");l=d(e);if(PARTY_LIST[NOW_PARTY].length>=PARTY_LIMIT||-1!==l){for(;PARTY_LIST[NOW_PARTY].length>PARTY_LIMIT;)r=
PARTY_LIST[NOW_PARTY].length,n=PARTY_LIST[NOW_PARTY][r-1]["char"],b(n),PARTY_LIST[NOW_PARTY].pop();a(c).removeClass("char-aruku").addClass("char-loser");return f["return"]()}void 0!==NOW_CHAR.Id&&closeInput(NOW_CHAR.Id,!0);NOW_CHAR=CHAR_MASTER[e];m=NOW_CHAR.Holders[0];NOW_STYLE=STYLE_MASTER[m];PARTY_LIST[NOW_PARTY].push({"char":e,style:m});a(".styleInfoArea").show();selectDotHensei(NOW_CHAR);readUserDataWithId("CHAR",e,function(b){return $jscomp.asyncExecutePromiseGeneratorProgram(function(c){if(1==
c.nextAddress)return c.yield(displayCharInfo(CHAR_MASTER[e],b),2);if(3!=c.nextAddress)return c.yield(displayStyleInfo(NOW_CHAR.Id,m),3);a(".charTmpl"+e).find(".inputArea").removeClass("d-none").slideDown(500);a("html,body").animate({scrollTop:a(".charTmpl"+e).offset().top},500,"swing");setLimitData();g();c.jumpToEnd()})});a('[data-toggle="tooltip"]').tooltip();f.jumpToEnd()})});a(document).on("click",".style",function(){var b=this,c,e;return $jscomp.asyncExecutePromiseGeneratorProgram(function(f){if(1==
f.nextAddress)return c=a(b).attr("data-id"),NOW_STYLE=STYLE_MASTER[c],f.yield(displayStyleInfo(NOW_CHAR.Id,c),2);e=d(NOW_CHAR.Id);PARTY_LIST[NOW_PARTY][e].style=c;g();f.jumpToEnd()})});a(document).on("click",".hanei",function(){n(a(this).parent().find(".allparams"))});a(document).on("change",".allparams",function(){n(a(this))});a(".modalClose").click(function(){if("ok"===a(this).attr("data-id")){gtag("event","showModal",{event_category:"party",event_label:"save",value:1});var b=a(this).attr("data-charId"),
c=splitParam(a(this).attr("data-input"),0),d={},g;for(g in c)d.$jscomp$loop$prop$i$18=g,a(".charInput"+PARAM_KEY_HP[d.$jscomp$loop$prop$i$18]+b).each(function(b){return function(d,e){a(e).val(c[b.$jscomp$loop$prop$i$18])}}(d)),a(".char"+PARAM_KEY_HP[d.$jscomp$loop$prop$i$18]+b).each(function(b){return function(d,e){a(e).text(c[b.$jscomp$loop$prop$i$18])}}(d)),d={$jscomp$loop$prop$i$18:d.$jscomp$loop$prop$i$18};e()}else gtag("event","showModal",{event_category:"party",event_label:"cancel",value:1});
a("#modal01").fadeOut();a("#allParamConfirmInner").css("animation","modalClose 0.5s forwards");return!1});a(".baseValue").click(function(){a(".baseValue").each(function(){a(this).removeClass("icon_btn_off");a(this).addClass("icon_btn_on")});a(this).addClass("icon_btn_off");BASE=Number(a(this).attr("data-id"));setLimitData()})});
function setLimitData(){$(".LIMIT").each(function(){var a=this,c,b,d,e,g,n,h,f,l,r,t,m,q,p;return $jscomp.asyncExecutePromiseGeneratorProgram(function(w){c=$(a).attr("data-styleId");b=STYLE_MASTER[c];d=$(".limit"+c);e=d.attr("data-charId");g=0;n={};h=$jscomp.makeIterator(PARAM_KEY);for(f=h.next();!f.done;n={$jscomp$loop$prop$limitValue$20:n.$jscomp$loop$prop$limitValue$20},f=h.next())l=f.value,r=b["Limit"+l],t=void 0!==CHAR_MASTER[e]["NOW"+l]?CHAR_MASTER[e]["NOW"+l]:CHAR_MASTER[e][l],g+=t,n.$jscomp$loop$prop$limitValue$20=
99!==b["Limit"+l]?BASE+Number(r)-Number(t):"?",d.find("."+l).each(function(a){return function(){$(this).removeClass("status_plus").removeClass("status_minus");"?"!==a.$jscomp$loop$prop$limitValue$20&&(0<a.$jscomp$loop$prop$limitValue$20?$(this).addClass("status_plus"):0>a.$jscomp$loop$prop$limitValue$20&&$(this).addClass("status_minus"));$(this).text(a.$jscomp$loop$prop$limitValue$20)}}(n));m=(g-369)/8;q="+"+m;369===g?q=0:0>m&&(q=m);p="\u9060\u5f81";16<=m?p="\u5916\u4f1d2-3\u4ee5\u964d(+18)":15<m?
p="\u5916\u4f1d1-5\u4ee5\u964d(+17)":14<m?p="\u5916\u4f1d1(\u6700\u5927:+16)":12<m?p="VH12(\u6700\u5927:+15)":8<m?p="VH11(\u6700\u5927:+13)":5<m?p="VH10(\u6700\u5927:+11)":0<m?p="VH9(\u6700\u5927:+9)":-3<m?p="VH415(\u6700\u5927:+0)":-6<m&&(p="H712(\u6700\u5927:-2)");$(".SUM"+e).text(g);$(".AVG"+e).text(q);$(".RECO"+e).text(p);w.jumpToEnd()})})}
function saveCharData(a){update={};for(var c=0,b=$jscomp.makeIterator(PARAM_KEY),d=b.next();!d.done;d=b.next()){d=d.value;var e=Number(CHAR_MASTER[a]["NOW"+d]);e=isNaN(e)||e>LIMIT_BASE+16?0:e;c+=e;update[d]=e}b=Number(CHAR_MASTER[a].NOWHP);update.HP=isNaN(b)||930<b?0:b;0<c?(updateData("CHAR/"+a,update),gtag("event","saveChar",{event_category:"party",event_label:CHAR_MASTER[a].Name,value:1})):console.log("\u5408\u8a08\u5024\u304c0\u306e\u305f\u3081\u4fdd\u5b58\u3092\u30b9\u30ad\u30c3\u30d7\u3057\u307e\u3057\u305f\u3002",
update)}function initialHide(){$("#charData").hide();$(".tabArea").hide();$(".styleInfoArea").hide()}
function displayCharInfo(a,c){var b,d,e,g,n,h,f,l,r,t,m,q,p,w,z,v,y,D,E,u,B,x,C,A,F,G,H,I;return $jscomp.asyncExecutePromiseGeneratorProgram(function(J){b=a.Id;d=$("#CHAR_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl"+b).attr("data-charId",b);d.find(".charName").html(a.Name);d.find(".icon_btn_on").attr("data-id",b);d.find(".charUnset").attr("data-id",b);d.find(".openMenu").attr("data-id",b);d.find(".char").parent().attr("data-id",b);d.find(".allparams").attr("data-id",
b);d.find(".CHAR_SAVE").attr("data-id",b);d.find(".SUM").attr("data-id",b).addClass("SUM"+b);d.find(".AVG").attr("data-id",b).addClass("AVG"+b);d.find(".RECO").attr("data-id",b).addClass("RECO"+b);d.find("#insotsu").parent().attr("data-id",b);d.find("#insotsu").attr("id","insotsu"+b).attr("name","roleType"+b);d.find("#baby").attr("id","baby"+b).attr("name","roleType"+b);d.find(".insotsuLabel").attr("for","insotsu"+b);d.find(".babyLabel").attr("for","baby"+b);e=a.DotId;g="ID4e2c8"!==e?e:"ID4e2c9";
n=getImgUrl("dot/"+g+".png")+dotStyle;d.find(".dot_mid").attr("style",n);if(null!==c)for(h=$jscomp.makeIterator(PARAM_KEY_HP),f=h.next();!f.done;f=h.next())l=f.value,a["NOW"+l]=Number(c[l]);else if(null===c)for(r=$jscomp.makeIterator(PARAM_KEY),f=r.next();!f.done;f=r.next())t=f.value,a["NOW"+t]=0;m=d.find(".nowData");m.attr("data-id",b);q=$jscomp.makeIterator(PARAM_KEY_HP);for(f=q.next();!f.done;f=q.next())p=f.value,d.find(".char"+p).removeClass("char"+p).addClass("charInput"+p+b).val(a["NOW"+p]),
m.find("."+p).removeClass("char"+p).addClass("char"+p+b).text(a["NOW"+p]);w=$jscomp.makeIterator(a.Holders);for(z=w.next();!z.done;z=w.next()){v=z.value;y=STYLE_MASTER[v];D=$("<button>").addClass("style").addClass(getStyleIconClass(y.Rarity)).attr("style",getImgUrl("style_icon/"+v+".png")).attr("data-id",v);E=$("<span>").addClass(getStyleIconBgClass(y.Rarity)).append(D);d.find(".STYLE_ICON").append(E);u=$("#LIMIT_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("LIMIT limit"+v).attr("data-styleId",
v).attr("data-charId",b);u.find(".rare").attr("src","./img/icon/icon_"+y.Rarity+".png");u.find(".icn").attr("src","./img/style_icon/"+v+".png");u.find(".cin").attr("src","./img/style_cutin/"+v+".png");B=$jscomp.makeIterator(PARAM_KEY);for(f=B.next();!f.done;f=B.next())x=f.value,C=y["Limit"+x],99===C?u.find("."+x).text("?"):(A=BASE+Number(C)-Number(a["NOW"+x]),u.find("."+x).text(A),0<A?u.find("."+x).addClass("status_plus"):0>A&&u.find("."+x).addClass("status_minus"));d.append(u)}F=$("#JINKEI").children().length+
1;G='<p class="series-button text-center" style="width:30px; margin-bottom:0px;">'+F+"</p>";H='<span class="char-winner char dot_mid dot" style="'+getImgUrl("dot/"+g+".png")+"\" data-charId='"+b+"' data-styleId=''></span>";$("#JINKEI").append($("<div>").addClass("JINKEI"+b).append(G+H));I=$("<div class='charTableParent'>").append(d);$("#PARTY").append(I);J.jumpToEnd()})}
function displayStyleInfo(a,c){var b,d,e,g;return $jscomp.asyncExecutePromiseGeneratorProgram(function(n){b=STYLE_MASTER[c];if(null===b)return n["return"]();$(".charTmpl"+a).attr("data-styleId",c);$(".charTmpl"+a).find(".style").each(function(){var a=$(this).attr("data-id");$(this).parent().addClass("opacity_nocheck");c===a&&$(this).parent().removeClass("opacity_nocheck")});$(".charTmpl"+a).find(".LIMIT").each(function(){$(this).hasClass("limit"+c)?$(this).removeClass("inputArea").attr("style","border: 1px solid #faf0b4"):
$(this).addClass("inputArea d-lg-table-row").attr("style","border: 0px")});d=b.DotId;e="ID4e2c8"!==d?d:"ID4e2c9";g=$(".charTmpl"+a).find(".char");g.attr("style",getImgUrl("dot/"+e+".png")+dotStyle);0<g.length&&animeReset(g,"char-winner");n.jumpToEnd()})}function getSmallIcon(a){var c=$("<button>").addClass(getStyleIconClass(a.Rarity)+"_small").attr("style",getImgUrl("style_icon/"+a.Id+".png"));return $("<span>").addClass(getStyleIconBgClass(a.Rarity)).attr("style","height: 30px;").append(c)}
function splitParam(a,c){k=/,|\.|\s|\t/g;var b=a.split(k);1===b.length&&(b[0]=a.substr(0,3),b[1]=a.substr(3,2),b[2]=a.substr(5,2),b[3]=a.substr(7,2),b[4]=a.substr(9,2),b[5]=a.substr(11,2),b[6]=a.substr(13,2),b[7]=a.substr(15,2),b[8]=a.substr(17,2));for(var d=0;8>d;d++)if(void 0===b[d]||""===b[d])b[d]=c;return b}function selectDotReset(a){$(".dot"+a.DotId).removeClass("char-winner").addClass("char-aruku").find(".series-button").text(a.Series)}
function selectDotHensei(a){$(".dot"+a.DotId).removeClass("char-aruku").removeClass("char-loser").addClass("char-winner").find(".series-button").text("\u7de8\u6210\u4e2d")};