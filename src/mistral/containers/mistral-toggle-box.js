// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,mapAttributeToContent,onEventAt */

"use strict";

name("mistral-toggle-box");
html("./mistral-toggle-box.html");
css("./mistral-toggle-box.css");

mapAttributeToContent("title","div.title");
onEventAt("div.titlebar","click",(event,selected,element)=>{
	event.stopPropagation();
	event.stopImmediatePropagation();
	event.preventDefault();
	if (element.hasAttribute("disabled") && (element.getAttribute("disabled")===true || element.getAttribute("disabled")==="")) return;

	if (element.hasAttribute("opened")) element.removeAttribute("opened");
	else element.setAttribute("opened","");
});
