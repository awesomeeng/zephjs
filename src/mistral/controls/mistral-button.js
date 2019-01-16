// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,mapAttribute,onEvent */

"use strict";

name("mistral-button");
html("./mistral-button.html");
css("./mistral-button.css");

mapAttribute("autofocus","button");
mapAttribute("disabled","button");
mapAttribute("name","button");
mapAttribute("type","button");
mapAttribute("value","button");

onEvent("click",(event,element)=>{
	if (element.hasAttribute("disabled") && (element.getAttribute("disabled")===true || element.getAttribute("disabled")==="")) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
	}
});
