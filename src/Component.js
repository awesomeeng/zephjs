// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $NAME = Symbol("name");
const $JS = Symbol("js");
const $HTML = Symbol("html");
const $CSS = Symbol("css");
const $ELEMENT = Symbol("element");

class Component {
	constructor(name,js,html,css) {
		this[$NAME] = name;
		this[$JS] = js;
		this[$HTML] = html;
		this[$CSS] = css;

		this[$ELEMENT] = (class ComponentElement extends HTMLElement {
			constructor() {
				super();

				let shadow  = this.attachShadow({
					mode:"open"
				});

				shadow.innerHTML = html;
			}
		});
		customElements.define(name,this[$ELEMENT]);
	}

	get name() {
		return this[$NAME];
	}

	createElement() {
		return document.createElement(this.name);
	}
}

module.exports = Component;
