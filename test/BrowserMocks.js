// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-env node */

"use strict";

const NodeURL = require("url");

const $TYPE = Symbol("type");
const $DETAILS = Symbol("details");

const listeners = {};

class CustomElements {
	define() {
	}
}

class Event {
	constructor(type,details) {
		this[$TYPE] = type;
		this[$DETAILS] = details;

		return Object.assign({
			type
		},details);
	}
}

class CustomEvent extends Event {
	constructor(type,details) {
		super(type,details);

		return this;
	}
}

class Element {
	constructor(type) {
		this.tagName = type;
		this.innerHTML = "";
	}

	get textContent() {
		return this.innerHTML;
	}

	set textContent(s) {
		this.innerHTML = s;
	}
}

const dispatchEvent = function fire(event) {
	let ls = listeners[event.type] || [];
	ls.forEach((l)=>{
		l.apply(event,[event]);
	});
};

const addEventListener = function addEventListener(eventType,listener) {
	listeners[eventType] = listeners[eventType] || [];
	listeners[eventType].push(listener);
};

const removeEventListener = function removeEventListener(eventType,listener) {
	listeners[eventType] = listeners[eventType] || [];
	listeners[eventType] = listeners.filter((l)=>{
		return l!==listener;
	});
};

const createElement = function createElement(type) {
	return new Element(type);
};

const importNode = function createElement(src) {
	let tgt = new Element(src.tagName);
	tgt.innerHTML = src.innerHTML;
	return tgt;
};

const fetch = function fetch() {
	return Promise.resolve({
		statusCode: 404
	});
};

global.window = {};

global.window.customElements = new CustomElements();
global.window.CustomEvent = CustomEvent;
global.window.Event = Event;
global.window.HTMLElement = Event;
global.window.URL = NodeURL.URL;
global.window.fetch = fetch;

global.window.document = {};
global.window.document.URL = new NodeURL.URL("http://localhost/");
global.window.document.dispatchEvent = dispatchEvent;
global.window.document.addEventListener = addEventListener;
global.window.document.removeEventListener = removeEventListener;
global.window.document.createElement = createElement;
global.window.document.importNode = importNode;

Object.keys(global.window).forEach((key)=>{
	global[key] = global.window[key];
});
