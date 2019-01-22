// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,bindAttributes,onEvent */

"use strict";

name("mistral-toggle-button");
html("./mistral-toggle-button.html");
css("./mistral-toggle-button.css");

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
		return;
	}

	if (!element.hasAttribute("selected")) element.setAttribute("selected","");
	else element.removeAttribute("selected");

	element.value = !!element.hasAttribute("selected");
	element.setAttribute("value",element.value);
});
