// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {ZephComponents} from "./Zeph.js";
import {html,css,image,attribute,property,bind,onProperty,onEventAt} from "./Zeph.js";

ZephComponents.define("rating-stars",()=>{
	html("./rating-stars.html");
	css("./rating-stars.css");

	image(".set","./rating-stars.filled.png");
	image(".unset","./rating-stars.empty.png");

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

	onEventAt("div.star","click",(event,selected,element,content)=>{
		if (element.hasAttribute("disabled")) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		let value = [...content.querySelectorAll(".stars > div.star")].indexOf(selected)+1;
		if (element.hasAttribute("value") && parseInt(element.getAttribute("value"))===value) value = 0;

		element.setAttribute("value",value);
	});

	const update = (element,content)=>{
		let value = element.value;

		content.querySelectorAll(".stars > div.star").forEach((e,i)=>{
			e.removeAttribute("selected");
			if (value>i) e.setAttribute("selected","");
		});
	};
});
