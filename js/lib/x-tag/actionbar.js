(function(){xtag.register("x-actionbar",{events:{"command:delegate(x-action)":function(a){var b=this.getAttribute("group"),c=b?xtag.query(this.parentNode,'[for="'+b+'"]'):!1,d=document.querySelector('[data-action-group-modal="'+b+'"]'),e=this.getAttribute("command"),f=document.getElementById(this.getAttribute("data-modal-target"))||document.body;if(c&&!d){var g=document.createElement("x-overlay");g.setAttribute("data-click-remove",!0),f.appendChild(g),d=document.createElement("x-modal"),d.setAttribute("data-overlay",!0),d.setAttribute("data-action-group-modal",b),xtag.addEvents(g,{"command:delegate(x-action)":function(a){var b=this.getAttribute("command");c.forEach(function(a){a.getAttribute("command")==b&&xtag.fireEvent(a,"command",{command:b})}),a.stopImmediatePropagation()},modalhide:function(){f.removeChild(g)}}),c.forEach(function(a){d.appendChild(a.cloneNode(!1))}),g.appendChild(d)}else d&&f.removeChild(d.parentNode)}}});var a=function(a){xtag.fireEvent(this,"command",{command:this.getAttribute("command")})};xtag.register("x-action",{content:"<img /><label></label>",onCreate:function(){this.setAttribute("tabindex",0),this.label=this.getAttribute("label"),this.src=this.getAttribute("src")},events:{tap:a,"keyup:keypass(13)":a},setters:{src:function(a){this.firstElementChild.src=a,this.setAttribute("src",a)},label:function(a){this.lastElementChild.innerHTML=a,this.setAttribute("label",a)}}})})()