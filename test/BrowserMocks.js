// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-env node */

"use strict";

const NodeURL = require("url");

class CustomElements {
	define() {
	}
}

class Event {

}

class CustomEvent {

}

class HTMLElement {

}

global.window = {};

global.window.customElements = new CustomElements();
global.window.CustomEvent = CustomEvent;
global.window.Event = Event;
global.window.HTMLElement = Event;
global.window.URL = NodeURL.URL;

global.window.document = {};
global.window.document.URL = new NodeURL.URL("http://localhost/");
global.window.document.dispatchEvent = ()=>{};

Object.keys(global.window).forEach((key)=>{
	global[key] = global.window[key];
});
