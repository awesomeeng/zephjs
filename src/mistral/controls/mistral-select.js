// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global requires,name,html,css,bindAttributeToContent,onEvent */

"use strict";

requires("./mistral-button");

name("mistral-select");
html("./mistral-select.html");
css("./mistral-select.css");

bindAttributeToContent("label","mistral-button > .label");

onEvent("click",(event,element)=>{
	if (element.hasAttribute("opened")) element.removeAttribute("opened");
	else element.setAttribute("opened","");
});
