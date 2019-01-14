// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

(()=>{
	const $NAME = Symbol("name");
	const $ORIGIN = Symbol("origin");
	const $CODE = Symbol("code");
	const $MARKUP = Symbol("markup");
	const $STYLE = Symbol("style");
	const $TEXT = Symbol("text");

	const COMPONENTS = {};
	const PENDING = {};

	const resolveURL = function resolve(path,baseurl=document.URL) {
		if (!path) throw new Error("Missing path.");
		if (!(path instanceof URL) && typeof path!=="string") throw new Error("Invalid path; must be a string or URL.");

		if (typeof path==="string") {
			if (path.startsWith("data:")) return new URL(path);
		}

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

			let origin = url;
			if (origin.toString().startsWith("data:")) origin = "data:";
			if (PENDING[origin]) return Promise.resolve();

			return Component.defineComponent(origin,url,asName);
		}

		static defineComponent(origin,js,asName) {
			return new Promise(async (resolve,reject)=>{
				try {
					PENDING[origin] = true;
					setTimeout(()=>{
						document.dispatchEvent(new CustomEvent("zeph:loading",{
							bubbles: false,
							detail: origin
						}));
					},0);

					let context = {};


					let code = await ComponentCode.generateComponentCode(origin,js,context,asName);
					if (!context.name && !context.pending) throw new Error("Invalid url; unable to load anything: "+origin);

					if (context.name) {
						let markup = await ComponentMarkup.generateComponentMarkup(origin,context.html || "");
						let style = await ComponentStyle.generateComponentStyle(origin,context.css || "");
						let clazz = ComponentClass.generateComponentClass(context,code,markup,style);

						context.name = context.name || name;
						if (asName) {
							if (asName.startsWith("*")) context.name = context.name+asName.slice(1);
							else if (asName.endsWith("*")) context.name = asName.slice(0,-1)+context.name;
							else context.name = asName;
						}
						if (!context.name) throw new Error("Component was not named.");
						if (context.name && context.name.indexOf("-")<0) throw new Error("Invalid name; must contain at least one dash character.");

						customElements.define(context.name,clazz);

						let component = new Component(origin,context.name,code,markup,style);
						COMPONENTS[context.name] = component;
					}

					delete PENDING[origin];
					setTimeout(()=>{
						document.dispatchEvent(new CustomEvent("zeph:loaded",{
							bubbles: false,
							detail: origin
						}));
					},0);
					if (Object.keys(PENDING).length<1) {
						setTimeout(()=>{
							if (Object.keys(PENDING).length>0) return;
							document.dispatchEvent(new CustomEvent("zeph:ready",{
								bubbles: false,
								detail: Object.keys(COMPONENTS)
							}));
						},5);
					}

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(url,name,code,markup,style) {
			this[$ORIGIN] = url;
			this[$NAME] = name;
			this[$CODE] = code;
			this[$MARKUP] = markup;
			this[$STYLE] = style;
		}

		get origin() {
			return this[$ORIGIN];
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

		undefine() {
			delete COMPONENTS[this.name];
			delete PENDING[this.origin];
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

					fire(context.create||[],this,this.shadowRoot);
				}

				connectedCallback() {
					fire(context.add||[],this,this.shadowRoot);
				}

				disconnectedCallback() {
					fire(context.remove||[],this,this.shadowRoot);
				}

				adoptedCallback() {
					fire(context.adopt||[],this,this.shadowRoot);
				}

				attributeChangedCallback(attribute,oldValue,newValue) {
					fire(context.attributes[attribute]||[],this,this.shadowRoot,oldValue,newValue);
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
		static generateComponentCode(origin,js,context={},asName=undefined) {
			return new Promise(async (resolve,reject)=>{
				try {
					let url;

					if (js.toString().startsWith("data:")) {
						js = js.toString().replace(/^data:.*,/,"");
					}

					if (isURLOrPath(js)) {
						url = resolveURL(js);
						if (url.pathname.endsWith(".js")) {
							origin = url;
							js = await fetchText(url);
						}
					}

					let code = new ComponentCode(origin||document.URL,js,context,asName);

					if (context.pending) {
						let promised = context.pending.filter((def)=>{
							return def instanceof Promise;
						});
						await Promise.all(promised);
					}

					resolve(code);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(origin,code,context,asName) {
			this[$ORIGIN] = origin;
			this[$TEXT] = code.toString();

			/* eslint-disable no-unused-vars */
			let define = this.define.bind(this,context,origin,asName);
			let requires = this.requires.bind(this,context,origin);
			let load = this.load.bind(this,context,origin);
			let name = this.name.bind(this,context);
			let from = this.from.bind(this,context);
			let html = this.html.bind(this,context);
			let css = this.css.bind(this,context);
			let onCreate = this.onCreate.bind(this,context);
			let onAdd = this.onAdd.bind(this,context);
			let onRemove = this.onRemove.bind(this,context);
			let onAttribute = this.onAttribute.bind(this,context);
			/* eslint-enable no-unused-vars */

			let func;
			if (typeof code==="string") {
				let wrapped = "()=>{"+code+"}";
				func = eval(wrapped);
			}
			else if (code instanceof Function) {
				func = eval(code.toString());
			}
			else {
				throw new Error("Code must be a string or a Function.");
			}

			func();
		}

		get text() {
			return this[$TEXT];
		}

		get origin() {
			return this[$ORIGIN];
		}

		define(context,origin,prefixOrSuffix,code,asName) {
			if (!code) throw new Error("Missing code.");
			if (!(code instanceof Function)) throw new Error("Invalid code; must be a Function.");
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			if (!asName && prefixOrSuffix && (prefixOrSuffix.endsWith("*") || prefixOrSuffix.startsWith("*"))) asName = prefixOrSuffix;

			let pending = Component.defineComponent(origin,code,asName);
			if (pending) {
				context.pending = context.pending || [];
				context.pending.push(pending);
			}
		}

		requires(context,baseurl,url,asName) {
			if (!url) throw new Error("Missing url.");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");
			if (typeof url==="string") url = resolveURL(url,baseurl);
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			url = resolveURL(url,baseurl);

			let pending = window.Zeph.load(url,asName);
			if (pending) {
				context.pending = context.pending || [];
				context.pending.push(pending);
			}
		}

		load(context,baseurl,url,asName) {
			this.requires(context,baseurl,url,asName);
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

		onAdopt(context,listener) {
			if (!listener) throw new Error("Missing listener function.");
			if (!(listener instanceof Function)) throw new Error("Invalid listener functionl must be a function.");

			context.adopt = context.adopt || [];
			context.adopt.push(listener);
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
		static generateComponentMarkup(origin,html) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(html)) {
						let url = resolveURL(html,origin);
						if (url.pathname.endsWith(".html")) {
							origin = url;
							html = await fetchText(url);
						}
					}

					let markup = new ComponentMarkup(origin||document.URL,html);
					resolve(markup);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(origin,markup) {
			this[$ORIGIN] = origin;
			this[$TEXT] = markup;
		}

		get text() {
			return this[$TEXT];
		}

		get origin() {
			return this[$ORIGIN];
		}
	}

	class ComponentStyle {
		static generateComponentStyle(origin,css) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(css)) {
						let url = resolveURL(css,origin);
						if (url.pathname.endsWith(".css")) {
							origin = url;
							css = await fetchText(url);
						}
					}

					let style = new ComponentMarkup(origin||document.URL,css);
					resolve(style);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(origin,style) {
			this[$ORIGIN] = origin;
			this[$TEXT] = style;
		}

		get text() {
			return this[$TEXT];
		}

		get origin() {
			return this[$ORIGIN];
		}
	}

	class ZephClass {
		get components() {
			return Object.keys(COMPONENTS);
		}

		getComponent(name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			return COMPONENTS[name];
		}

		load(url,asName) {
			if (!url) throw new Error("Missing url.");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");
			if (typeof url==="string") url = resolveURL(url);
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			return new Promise(async (resolve,reject)=>{
				try {
					await Component.generateComponent(url,asName);
					resolve();
				}
				catch (ex) {
					// let error = new Error("Error loading component '"+url+"' > "+ex.message);
					// error.stack = ex.stack;
					// error.stack = error.stack.split(/\r\n|\n/g);
					// error.stack.unshift("Zeph:load ("+name+")");
					// error.stack = error.stack.join("\n");
					// reject(error);
					reject(ex);
				}
			});
		}

		removeComponent(name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			let component = COMPONENTS[name];
			if (!component) return;

			component.undefine();
		}

		removeAllComponents() {
			let components = this.components;
			components.forEach((name)=>{
				this.removeComponent(name);
			});
		}
	}

	window.Zeph = new ZephClass();

	// do this last to let things know Zeph is ready.
	setTimeout(()=>{
		document.dispatchEvent(new CustomEvent("zeph:initialized",{
			bubbles: false
		}));
	},0);

})();