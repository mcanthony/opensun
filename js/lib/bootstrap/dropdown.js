(function(a){var b;define(["jquery"],function(){return function(){!function(a){function b(){a(c).parent().removeClass("open")}var c='[data-toggle="dropdown"]',d=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};d.prototype={constructor:d,toggle:function(c){var d=a(this),e,f,g;if(d.is(".disabled, :disabled"))return;return f=d.attr("data-target"),f||(f=d.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,"")),e=a(f),e.length||(e=d.parent()),g=e.hasClass("open"),b(),g||e.toggleClass("open"),!1}},a.fn.dropdown=function(b){return this.each(function(){var c=a(this),e=c.data("dropdown");e||c.data("dropdown",e=new d(this)),typeof b=="string"&&e[b].call(c)})},a.fn.dropdown.Constructor=d,a(function(){a("html").on("click.dropdown.data-api",b),a("body").on("click.dropdown",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown.data-api",c,d.prototype.toggle)})}(window.jQuery)}.call(a),b})})(this)