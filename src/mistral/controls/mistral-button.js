// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,bindAttributes,onEvent */

"use strict";

name("mistral-button");
html("./mistral-button.html");
css("./mistral-button.css");

bindAttributes("autofocus","button");
bindAttributes("disabled","button");
bindAttributes("name","button");
bindAttributes("type","button");
bindAttributes("value","button");

onEvent("click",(event,element)=>{
	if (element.hasAttribute("disabled") && (element.getAttribute("disabled")===true || element.getAttribute("disabled")==="")) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
	}
});
