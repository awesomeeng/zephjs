// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {ZephComponents} from "./Zeph.js";
import {html,css,attribute,property,bind,onCreate,onEvent} from "./Zeph.js";

ZephComponents.define("my-button",()=>{
	html("./my-button.html");
	css("./my-button.css");

	attribute("icon","");
	attribute("icon-placement","left");
	attribute("disabled",undefined);

	property("clickCount",0);

	bind("@icon","button > img","@src");
	bind("@disabled","button");

	onCreate((element)=>{
		console.log("Element '"+element.getAttribute("name")+"' created!",element);
	});

	onEvent("click",(event,element)=>{
		if (element.hasAttribute("disabled")) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		element.clickCount += 1;

		console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
	});
});
