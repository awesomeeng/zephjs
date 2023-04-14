// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {zeph,html,css,attribute,property,bind,onCreate,onAdd,onRemove,onAdopt,onEvent} from "zephjs";
// bind

@zeph('my-button')
@html("./my-button.html")
@css("./my-button.css")
export default class MyButton extends HTMLElement {
	// @attribute
	private name = "";

	@attribute
	@bind("button > img","@src")
	private icon = "";

	@attribute('icon-placement')
	private iconPlacement = "left";
	
	// @attribute
	private disabled;

	// @property
	// @attribute("data-click-count")
	private clickCount:number = 0;

	constructor() {
		super();
	}	

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

	@onAdd
	added(element) {
		console.log("Button added");
	}

	@onRemove
	removed(element) {
		console.log("Button removed");
	}

	@onAdopt
	adopted(element) {
		console.log("Button adopt");
	}
}
