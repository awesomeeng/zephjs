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

		let cjs = new ComponentJS(js);
		let env = cjs.execute();

		let container = this;

		let fire = (listeners,...args)=>{
			listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
			listeners.forEach((listener)=>{
				setTimeout(()=>{
					return listener.apply(listener,args);
				},0);
			});
		};

		/* eslint no-undef: off */
		const TO_BE_REPLACED = (class {});
		const componentElementClass = (class ComponentElement extends TO_BE_REPLACED {
			static get observedAttributes() {
				return env.observed;
			}

			constructor() {
				super();

				let shadow  = this.attachShadow({
					mode:"open"
				});

				shadow.innerHTML = html;

				fire(env.created||[]);
			}

			connectedCallback() {
				fire(env.add||[]);
			}

			disconnectedCallback() {
				fire(env.remove||[]);
			}

			adoptedCallback() {
				fire(env.adopted||[]);
			}

			attributeChangedCallback(attribute,oldValue,newValue) {
				fire(env.attributes[attribute]||[],oldValue,newValue);
			}
		});
		let c = "("+componentElementClass.toString().replace(/TO_BE_REPLACED/,env.from)+")";
		this[$ELEMENT] = eval(c);
		customElements.define(name,this[$ELEMENT]);
	}

	get name() {
		return this[$NAME];
	}

	create() {
		return document.createElement(this.name);
	}
}

const $ENV = Symbol("env");

class ComponentJS {
	constructor(js="") {
		this[$JS] = js;
		this[$ENV] = null;
	}

	execute() {
		if (this[$ENV]) return this[$ENV];

		let func = "(from,onCreate,onAdd,onRemove,onAttribute)=>{"+this[$JS]+"}";
		func = eval(func);

		let env = {
			from: "HTMLElement",
			observed: []
		};
		let from = this.from.bind(this,env);
		let onCreate = this.onCreate.bind(this,env);
		let onAdd = this.onAdd.bind(this,env);
		let onRemove = this.onRemove.bind(this,env);
		let onAttribute = this.onAttribute.bind(this,env);
		func(from,onCreate,onAdd,onRemove,onAttribute);

		this[$ENV] = env;

		return env;
	}

	from(env,element) {
		if (!element) throw new Error("Missing from element.");
		if (typeof element!=="string" && element!==HTMLElement && !HTMLElement.isPrototypeOf(element)) throw new Error("Invalid from element; must be a string.");

		let clazz = element===HTMLElement && element || HTMLElement.isPrototypeOf(element) && element || window[element];
		if (!clazz) throw new Error("Invalid from element; must be the name of or class of an existing subclass of HTMLElement.");
		if (clazz!==HTMLElement && !HTMLElement.isPrototypeOf(clazz)) throw new Error("Invlaid from name; must extend from HTMLElement.");

		env.from = clazz.name;
	}

	onCreate(env,listener) {
		if (!listener) throw new Error("Missing listener function.");
		if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

		env.create = env.create || [];
		env.create.push(listener);
	}

	onAdd(env,listener) {
		if (!listener) throw new Error("Missing listener function.");
		if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

		env.add = env.add || [];
		env.add.push(listener);
	}

	onRemove(env,listener) {
		if (!listener) throw new Error("Missing listener function.");
		if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

		env.remove = env.remove || [];
		env.remove.push(listener);
	}

	onAttribute(env,attribute,listener) {
		if (!listener) throw new Error("Missing listener function.");
		if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");
		if (!attribute) throw new Error("Missing attribute name.");
		if (typeof attribute!=="string") throw new Error("Invalid attribute name; must be a string.");

		env.observed.push(attribute);
		env.attributes = env.attributes || {};
		env.attributes[attribute] = env.attributes[attribute] || [];
		env.attributes[attribute].push(listener);
	}
}

module.exports = Component;
