// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {ZephComponents} from "./Zeph.js";
import {html,css,attribute,property,bind,onProperty,onEvent} from "./Zeph.js";

ZephComponents.define("rating-stars",()=>{
	html("./rating-stars.html");
	css("./rating-stars.css");

	attribute("value","0");
	attribute("disabled",undefined);

	property("value",0);

	bind("@value",".",".value",(value)=>{
		value = parseInt(value);
		if (!value || isNaN(value)) value = 0;
		return value;
	});

	onProperty("value",(name,value,element,content)=>{
		update(element,content);
	});

	onEvent("click",(event,element)=>{
		if (element.hasAttribute("disabled")) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		console.log("click",event);
	});

	const update = (element,content)=>{
		let value = element.value;

		content.querySelectorAll("div.star").forEach((e,i)=>{
			let has = e.hasAttribute("selected");
			if (value>i && !has) e.setAttribute("selected","");
			else e.removeAttribute("selected");
		});
	};
});
