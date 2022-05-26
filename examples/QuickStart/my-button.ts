// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {zeph,html,css,attribute,property} from "./Zeph.js";
// bind,onCreate,onEvent

@zeph('my-button')
@html("./my-button.html")
@css("./my-button.css")
export default class MyButton extends HTMLElement {
	// @attribute
	// private icon = "";

	// @attribute('icon-placement')
	// private iconPlacement = "left";
	
	// @attribute
	// private disabled;

	@property
	@attribute("data-click-count")
	private clickCount = 0;

	constructor() {
		super();

		setInterval(()=>{
			console.log(100,"increment");
			this.clickCount += 1;
		},5000);
	}	

	// bind("@icon","button > img","@src");
	// bind("@disabled","button");

	// onCreate((element)=>{
	// 	console.log("Element '"+element.getAttribute("name")+"' created!",element);
	// });

	// onEvent("click",(event,element)=>{
	// 	if (element.hasAttribute("disabled")) {
	// 		event.stopPropagation();
	// 		event.preventDefault();
	// 		return;
	// 	}

	// 	element.clickCount += 1;

	// 	console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
	// });
	blah() {
		this.disabled = this.disabled;
		this.icon = this.icon;
		this.iconPlacement = this.iconPlacement
		this.clickCount = this.clickCount;
	}
}
