// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

(()=>{
	// const BASEPATH = [...document.querySelectorAll("script")].reduce((awesome,script)=>{
	// 	if (awesome) return awesome;
	// 	if (script.src && script.src.match(/AwesomeComponents\.min\.js/)) return script.src;
	// 	if (script.src && script.src.match(/AwesomeComponents\.js/)) return script.src;
	// 	return null;
	// },null);

	const $COMPONENTS = Symbol("components");
	const $NAME = Symbol("name");
	const $URL = Symbol("url");
	const $CODE = Symbol("code");
	const $MARKUP = Symbol("markup");
	const $STYLE = Symbol("style");
	const $TEXT = Symbol("text");

	const resolveURL = function resolve(path,baseurl=document.URL) {
		if (!path) throw new Error("Missing path.");
		if (!(path instanceof URL) && typeof path!=="string") throw new Error("Invalid path; must be a string or URL.");

		return new URL(path,baseurl);
	};

	const fetchText = function fetchText(url) {
		if (!url) throw new Error("Missing url.");

		return new Promise(async (resolve,reject)=>{
			try {
				let response = await fetch(url);
				if (response.ok) return resolve(await response.text());
				resolve(undefined);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	};

	const isURLOrPath = function isURLOrPath(s) {
		if (!s) return false;
		if (s instanceof URL) return true;
		if (typeof s!=="string") return false;

		if (s==="/") return true;
		if (s===".") return true;
		if (s==="..") return true;
		if (s.startsWith("/")) return true;
		if (s.startsWith("./")) return true;
		if (s.startsWith("../")) return true;
		if (s.startsWith("http://")) return true;
		if (s.startsWith("https://")) return true;
		if (s.startsWith("ftp://")) return true;

		return false;
	};

	class Component {
		static generateComponent(url,asName) {
			if (!url) throw new Error("Missing url.");
			if (!(url instanceof URL)) throw new Error("Invalid url; must be a URL.");
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			let name = url.pathname.split("/").slice(-1)[0];
			if (name.indexOf(".")<0) url.pathname = url.pathname + ".js";
			name = name.replace(/\..+$/,"");

			return new Promise(async (resolve,reject)=>{
				try {
					let context = {};
					let code = await ComponentCode.generateComponentCode(url,context);
					if (Object.keys(context).length<1) throw new Error("Invalid url; unable to import anything.");

					let markup = await ComponentMarkup.generateComponentMarkup(url,context.html || "");
					let style = await ComponentStyle.generateComponentStyle(url,context.css || "");
					let clazz = ComponentClass.generateComponentClass(context,code,markup,style);

					context.name = asName || context.name || name;
					if (!context.name) throw new Error("Component was not named.");
					if (context.name && context.name.indexOf("-")<0) throw new Error("Invalid name; must contain at least one dash character.");

					customElements.define(context.name,clazz);

					resolve(new Component(url,context.name));
				}
				catch (ex) {
					return reject(ex);
				}
			});

		}

		constructor(url,name,code,markup,style) {
			this[$URL] = url;
			this[$NAME] = name;
			this[$CODE] = code;
			this[$MARKUP] = markup;
			this[$STYLE] = style;
		}

		get url() {
			return this[$URL];
		}

		get name() {
			return this[$NAME];
		}

		get code() {
			return this[$CODE];
		}

		get markup() {
			return this[$MARKUP];
		}

		get style() {
			return this[$STYLE];
		}

		create() {
			return document.createElement(name);
		}
	}

	class ComponentClass {
		static generateComponentClass(context,code,markup,style) {
			let fire = (listeners,...args)=>{
				listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
				listeners.forEach((listener)=>{
					setTimeout(()=>{
						return listener.apply(listener,args);
					},0);
				});
			};

			const TO_BE_REPLACED = (class {});
			const componentElementClass = (class ComponentElement extends TO_BE_REPLACED {
				static get observedAttributes() {
					return context.observed;
				}

				constructor() {
					super();

					let shadow  = this.attachShadow({
						mode:"open"
					});

					shadow.innerHTML = markup.text;

					let styleElement = document.createElement("style");
					styleElement.textContent = style.text;
					shadow.appendChild(styleElement);

					fire(context.created||[]);
				}

				connectedCallback() {
					fire(context.add||[]);
				}

				disconnectedCallback() {
					fire(context.remove||[]);
				}

				adoptedCallback() {
					fire(context.adopted||[]);
				}

				attributeChangedCallback(attribute,oldValue,newValue) {
					fire(context.attributes[attribute]||[],oldValue,newValue);
				}
			});
			let c = "("+componentElementClass.toString().replace(/TO_BE_REPLACED/,context.from||"HTMLElement")+")";

			try {
				let clazz = eval(c);
				return clazz;
			}
			catch (ex) {
				throw ex;
			}
		}
	}

	class ComponentCode {
		static generateComponentCode(js,context={}) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(js)) {
						let url = resolveURL(js);
						if (url.pathname.endsWith(".js")) {
							js = await fetchText(url);
						}
					}

					let code = new ComponentCode(js,context);
					resolve(code);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(code,context) {
			this[$TEXT] = code;

			let func = "()=>{"+code+"}";
			func = eval(func);

			/* eslint-disable no-unused-vars */
			let name = this.name.bind(this,context);
			let from = this.from.bind(this,context);
			let html = this.html.bind(this,context);
			let css = this.css.bind(this,context);
			let onCreate = this.onCreate.bind(this,context);
			let onAdd = this.onAdd.bind(this,context);
			let onRemove = this.onRemove.bind(this,context);
			let onAttribute = this.onAttribute.bind(this,context);
			/* eslint-enable no-unused-vars */

			func();
		}

		get text() {
			return this[$TEXT];
		}

		name(context,name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			context.name = name;
		}

		from(context,element) {
			if (!element) throw new Error("Missing from element.");
			if (typeof element!=="string" && element!==HTMLElement && !HTMLElement.isPrototypeOf(element)) throw new Error("Invalid from element; must be a string.");

			let clazz = element===HTMLElement && element || HTMLElement.isPrototypeOf(element) && element || window[element];
			if (!clazz) throw new Error("Invalid from element; must be the name of or class of an existing subclass of HTMLElement.");
			if (clazz!==HTMLElement && !HTMLElement.isPrototypeOf(clazz)) throw new Error("Invlaid from name; must extend from HTMLElement.");

			context.from = clazz.name;
		}

		html(context,html) {
			if (!html) throw new Error("Missing html.");
			if (typeof html!=="string") throw new Error("Invalid html; must be a string.");

			context.html = html;
		}

		css(context,css) {
			if (!css) throw new Error("Missing css.");
			if (typeof css!=="string") throw new Error("Invalid css; must be a string.");

			context.css = css;
		}

		onCreate(context,listener) {
			if (!listener) throw new Error("Missing listener function.");
			if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

			context.create = context.create || [];
			context.create.push(listener);
		}

		onAdd(context,listener) {
			if (!listener) throw new Error("Missing listener function.");
			if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

			context.add = context.add || [];
			context.add.push(listener);
		}

		onRemove(context,listener) {
			if (!listener) throw new Error("Missing listener function.");
			if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

			context.remove = context.remove || [];
			context.remove.push(listener);
		}

		onAttribute(context,attribute,listener) {
			if (!listener) throw new Error("Missing listener function.");
			if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");
			if (!attribute) throw new Error("Missing attribute name.");
			if (typeof attribute!=="string") throw new Error("Invalid attribute name; must be a string.");

			context.observed.push(attribute);
			context.attributes = context.attributes || {};
			context.attributes[attribute] = context.attributes[attribute] || [];
			context.attributes[attribute].push(listener);
		}
	}

	class ComponentMarkup {
		static generateComponentMarkup(baseurl,html) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(html)) {
						let url = resolveURL(html,baseurl);
						if (url.pathname.endsWith(".html")) {
							html = await fetchText(url);
						}
					}

					let markup = new ComponentMarkup(html);
					resolve(markup);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(markup) {
			this[$TEXT] = markup;
		}

		get text() {
			return this[$TEXT];
		}
	}

	class ComponentStyle {
		static generateComponentStyle(baseurl,css) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(css)) {
						let url = resolveURL(css,baseurl);
						if (url.pathname.endsWith(".css")) {
							css = await fetchText(url);
						}
					}

					let style = new ComponentMarkup(css);
					resolve(style);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(style) {
			this[$TEXT] = style;
		}

		get text() {
			return this[$TEXT];
		}
	}

	class AwesomeComponents {
		constructor() {
			this[$COMPONENTS] = {};
		}

		get components() {
			return Object.keys(this[$COMPONENTS]);
		}

		getComponent(name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			return this[$COMPONENTS][name];
		}

		import(url,asName) {
			if (!url) throw new Error("Missing url.");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");
			if (typeof url==="string") url = resolveURL(url);
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			return new Promise(async (resolve,reject)=>{
				try {
					let component = await Component.generateComponent(url,asName);
					this[$COMPONENTS][component.name] = component;

					resolve(component);
				}
				catch (ex) {
					// let error = new Error("Error importing component '"+url+"' > "+ex.message);
					// error.stack = ex.stack;
					// error.stack = error.stack.split(/\r\n|\n/g);
					// error.stack.unshift("AwesomeComponents:import ("+name+")");
					// error.stack = error.stack.join("\n");
					// reject(error);
					reject(ex);
				}
			});
		}
	}

	window.AwesomeComponents = new AwesomeComponents();

	// do this last to let things know AwesomeComponents is ready.
	setTimeout(()=>{
		document.dispatchEvent(new Event("awesome:ready"));
	},0);

})();
