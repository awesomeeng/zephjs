// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global requires,name,html,css,bindAttributeToContent,bindAttributeToProperty,onEvent,onCreate */

"use strict";

requires("./mistral-button");

name("mistral-select");
html("./mistral-select.html");
css("./mistral-select.css");

bindAttributeToContent("label","mistral-button > .label");
bindAttributeToProperty("value",".","value");

onCreate((element)=>{
	if (!element.hasAttribute("value")) element.setAttribute("value","");
});

onEvent("click",(event,element,content)=>{
	if (!element.hasAttribute("opened")) {
		element.setAttribute("opened","");
		content.querySelector("mistral-button").setAttribute("pressed","");
	}
	else {
		element.removeAttribute("opened");
		content.querySelector("mistral-button").removeAttribute("pressed");

		if (event.target!==element) {
			let pn = event.target;
			while (pn) {
				if (pn.parentNode===element) break;
				pn = pn.parentNode;
			}

			let value = pn && pn.getAttribute("value") || pn && pn.getAttribute("name") || pn && pn.textContent || null;
			element.setAttribute("value",value);
		}
	}
});
