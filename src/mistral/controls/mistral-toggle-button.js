// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,mapAttribute,onEvent */

"use strict";

name("mistral-toggle-button");
html("./mistral-toggle-button.html");
css("./mistral-toggle-button.css");

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
		return;
	}

	let old = element.hasAttribute("selected");
	let gnu = !old;

	if (gnu) element.setAttribute("selected","");
	else element.removeAttribute("selected");

	element.dispatchEvent(new CustomEvent("change",{
		bubbles: false,
		detail: {
			value: gnu
		}
	}));
});
