// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {zeph,html,css,attribute,property,onCreate,onEvent} from "./Zeph.js";
// bind

@zeph('my-button')
@html("./my-button.html")
@css("./my-button.css")
export default class MyButton extends HTMLElement {
	@attribute
	private name = "";

	@attribute
	private icon = "";

	@attribute('icon-placement')
	private iconPlacement = "left";
	
	@attribute
	private disabled;

	@property
	@attribute("data-click-count")
	private clickCount:number = 0;

	constructor() {
		super();
	}	

	// bind("@icon","button > img","@src");
	// bind("@disabled","button");

	@onCreate
	onCreate(element) {
		console.log("Element '"+element.getAttribute("name")+"' created!",element);
	}

	@onEvent("click")
	onClick(event,element) {
		if (this.hasAttribute("disabled")) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		this.clickCount += 1;

		console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
	}
}
