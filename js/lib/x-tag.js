(function(){var a=document.getElementsByTagName("head")[0],b=function(){var a=window.getComputedStyle(document.documentElement,""),b=(Array.prototype.slice.call(a).join("").match(/moz|webkit|ms/)||a.OLink===""&&["o"])[0],c="WebKit|Moz|MS|O".match(new RegExp("("+b+")","i"))[1];return{dom:c,lowercase:b,css:"-"+b+"-",js:b[0].toUpperCase()+b.substr(1),keyframes:!!window.CSSKeyframesRule||!!window[c+"CSSKeyframesRule"]}}(),c=function(a,b,c){switch(xtag.typeOf(c)){case"object":xtag.typeOf(a[b])=="object"?xtag.merge(a[b],c):a[b]=xtag.clone(c);break;case"array":a[b]=xtag.toArray(c);break;default:a[b]=c}return a},d=function(a,b,c){return function(d){!!~b.match(/(\d+)/g).indexOf(String(d.keyCode))==(c=="keypass")&&a.apply(this,xtag.toArray(arguments))}};xtag={tags:{},tagList:[],callbacks:{},prefix:b,anchor:document.createElement("a"),tagOptions:{content:"",mixins:[],events:{},methods:{},getters:{},setters:{},onCreate:function(){},onInsert:function(){}},eventMap:{animationstart:["animationstart","oAnimationStart","MSAnimationStart","webkitAnimationStart"],transitionend:["transitionend","oTransitionEnd","MSTransitionEnd","webkitTransitionEnd"],tap:["ontouchend"in document?"touchend":"mouseup"]},pseudos:{delegate:function(a,b,c,d){var e=xtag.query(this,b).filter(function(a){return a==d.target||a.contains?a.contains(d.target):!1})[0];return e?function(){a.apply(e,xtag.toArray(arguments))}:!1},keystop:d,keypass:d,retain:function(a,b,c,d,e){var f=e[d];return function(){a(),typeof f!="undefined"&&(e[d]=f)}},preventable:function(a,b,c){return function(b){b.defaultPrevented||a.apply(this,xtag.toArray(arguments))}}},mixins:{request:{onInsert:function(){this.src=this.getAttribute("src")},getters:{"dataready:retain":function(){return this.xtag.dataready}},setters:{src:function(a){a&&(this.setAttribute("src",a),xtag.request(this,{url:a,method:"GET"}))},"dataready:retain":function(a){this.xtag.dataready=a,this.xtag.request&&this.xtag.request.readyState==4&&a.call(this,this.xtag.request)}}}},typeOf:function(a){return{}.toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase()},toArray:function(a){var b=Array.prototype.slice.call(a,0);return b.hasOwnProperty?b:[a]},hasClass:function(a,b){return!!~a.className.split(" ").indexOf(b)},addClass:function(a,b){return xtag.hasClass(a,b)||(a.className=a.className+" "+b),a},removeClass:function(a,b){return a.className=a.className.replace(new RegExp("(^|\\s)"+b+"(?:\\s|$)"),"$1"),a},toggleClass:function(a,b){return xtag.hasClass(a,b)?xtag.removeClass(a,b):xtag.addClass(a,b)},query:function(a,b){return xtag.toArray(a.querySelectorAll(b))},defineProperty:function(a,b,c,d){return document.documentElement.__defineGetter__?function(a,b,c,d){a["__define"+c[0].toUpperCase()+"etter__"](b,d)}:function(a,b,c,d){var e={configurable:!0};e[c]=d,Object.defineProperty(a,b,e)}}(),clone:function(a){var b=function(){};return b.prototype=a,new b},merge:function(a,b,d){if(xtag.typeOf(b)=="string")return c(a,b,d);for(var e=1,f=arguments.length;e<f;e++){var g=arguments[e];for(var h in g)c(a,h,g[h])}return a},wrap:function(a,b){return function(){var c=xtag.toArray(arguments);a.apply(this,c),b.apply(this,c)}},skipTransition:function(a,c,d){var e=b.js+"TransitionDuration";a.style[e]="0.001s",c.call(d),xtag.addEvent(a,"transitionend",function(){a.style[e]=""})},tagCheck:function(a){return a.tagName?xtag.tags[a.tagName.toLowerCase()]:!1},getOptions:function(a){return xtag.tagCheck(a)||xtag.tagOptions},register:function(a,c){xtag.tagList.push(a),xtag.tags[a]=xtag.merge({},xtag.tagOptions,xtag.applyMixins(c)),b.keyframes?xtag.attachKeyframe(a):xtag.domready&&xtag.query(document,a).forEach(function(a){f({target:a,animationName:"nodeInserted"})})},attachKeyframe:function(a){xtag.sheet.insertRule(a+b.properties,0)},extendElement:function(a){if(!a.xtag){a.xtag={};var b=xtag.getOptions(a);for(var c in b.methods)xtag.bindMethods(a,c,b.methods[c]);for(var c in b.setters)xtag.applyAccessor(a,c,"set",b.setters[c]);for(var c in b.getters)xtag.applyAccessor(a,c,"get",b.getters[c]);xtag.addEvents(a,b.events,b.eventMap),b.content&&(a.innerHTML=b.content),b.onCreate.call(a)}},bindMethods:function(a,b,c){a.xtag[b]=function(){return c.apply(a,xtag.toArray(arguments))}},applyMixins:function(a){return a.mixins&&a.mixins.forEach(function(b){var c=xtag.mixins[b];for(var d in c)switch(xtag.typeOf(c[d])){case"function":a[d]=a[d]?xtag.wrap(a[d],c[d]):c[d];break;case"object":a[d]=xtag.merge({},c[d],a[d]);break;default:a[d]=c[d]}}),a},applyAccessor:function(a,b,c,d){var e=b.split(":")[0];xtag.applyPseudos(a,b,function(){xtag.defineProperty(a,e,c,d)},[e,a])},applyPseudos:function(a,b,c,d){var e=c,d=xtag.toArray(d);b.match(":")&&b.replace(/:(\w*)(?:\(([^\)]*)\))?/g,function(b,f,g){if(e){var h=xtag.toArray(d);h.unshift(e,g,f);var i=xtag.pseudos[f].apply(a,h);e=i===!1?!1:i||c}}),e&&e.apply(a,d)},request:function(b,c){xtag.clearRequest(b);var d=b.xtag.request||{};b.xtag.request=c;var e=b.xtag.request,f=b.getAttribute("data-callback-key")||"callback=xtag.callbacks.";if(xtag.fireEvent(b,"beforerequest")===!1)return!1;if(d.url&&!c.update&&d.url.replace(new RegExp("&?("+f+"x[0-9]+)"),"")==b.xtag.request.url)return b.xtag.request=d,!1;b.setAttribute("src",b.xtag.request.url),xtag.anchor.href=c.url;if(xtag.anchor.hostname==window.location.hostname)e=xtag.merge(new XMLHttpRequest,e),e.onreadystatechange=function(){b.setAttribute("data-readystate",e.readyState),e.readyState==4&&e.status<400&&xtag.requestCallback(b,e)},["error","abort","load"].forEach(function(a){e["on"+a]=function(c){c.request=e,xtag.fireEvent(b,a,c)}}),e.open(e.method,e.url,!0),e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.send();else{var g=e.callbackID="x"+(new Date).getTime();b.setAttribute("data-readystate",e.readyState=0),xtag.callbacks[g]=function(a){e.status=200,e.readyState=4,e.responseText=a,xtag.requestCallback(b,e),delete xtag.callbacks[g],xtag.clearRequest(b)},e.script=document.createElement("script"),e.script.type="text/javascript",e.script.src=c.url=c.url+(~c.url.indexOf("?")?"&":"?")+f+g,e.script.onerror=function(a){b.setAttribute("data-readystate",e.readyState=4),b.setAttribute("data-requeststatus",e.status=400),xtag.fireEvent(b,"error",a)},a.appendChild(e.script)}b.xtag.request=e},requestCallback:function(a,b){if(b!=a.xtag.request)return xtag;a.setAttribute("data-readystate",b.readyState),a.setAttribute("data-requeststatus",b.status),xtag.fireEvent(a,"dataready",{request:b}),a.dataready&&a.dataready.call(a,b)},clearRequest:function(b){var c=b.xtag.request;if(!c)return xtag;c.script&&~xtag.toArray(a.children).indexOf(c.script)?a.removeChild(c.script):c.abort&&c.abort()},addEvent:function(a,b,c,d){var e=b.split(":")[0],f=(d||xtag.eventMap||{})[e]||[e];f.forEach(function(d){a.addEventListener(d,function(d){xtag.applyPseudos(a,b,c,[d,a])},!!~["focus","blur"].indexOf(d))})},addEvents:function(a,b,c){for(var d in b)xtag.addEvent(a,d,b[d],c)},fireEvent:function(a,b,c){var d=document.createEvent("Event");d.initEvent(b,!0,!0),a.dispatchEvent(xtag.merge(d,c))}};var e=document.createElement("style"),f=function(a){a.animationName=="nodeInserted"&&xtag.tagCheck(a.target)&&(xtag.extendElement(a.target),xtag.getOptions(a.target).onInsert.call(a.target))};e.type="text/css";if(b.keyframes){var g="animation-duration: 0.0001s;",h="animation-name: nodeInserted !important;";b.properties="{"+g+h+b.css+g+b.css+h+"}",xtag.eventMap.animationstart.forEach(function(a){document.addEventListener(a,f,!1)}),e.appendChild(document.createTextNode("@"+(b.keyframes?b.css:"")+"keyframes nodeInserted {"+"from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); }"+"}"))}else document.addEventListener("DOMContentLoaded",function(a){xtag.domready=!0,xtag.tagList[0]&&xtag.query(document,xtag.tagList).forEach(function(a){f({target:a,animationName:"nodeInserted"})})},!1),document.addEventListener("DOMNodeInserted",function(a){a.animationName="nodeInserted",f(a)},!1);a.appendChild(e),xtag.sheet=e.sheet;var i=document.createElement;document.createElement=function(a){var b=i.call(this,a);return xtag.tagCheck(b)&&xtag.extendElement(b),b}})()