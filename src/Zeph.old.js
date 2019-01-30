// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

(()=>{
	const $NAME = Symbol("name");
	const $ASNAME = Symbol("asName");
	const $ORIGIN = Symbol("origin");
	const $ELEMENT = Symbol("element");
	const $SHADOW = Symbol("shadow");
	const $CODE = Symbol("code");
	const $MARKUP = Symbol("markup");
	const $STYLE = Symbol("style");
	const $TEXT = Symbol("text");
	const $OBSERVER = Symbol("observer");

	const COMPONENTS = {};
	const PENDING = {};
	const SERVICES = {};

	/* eslint-disable no-unused-vars */
	const notUndefined = function notUndefined(arg,name) {
		if (arg===undefined) throw new Error("Undefined "+name+".");
	};

	const notNull = function notNull(arg,name) {
		if (arg===null) throw new Error("Null "+name+".");
	};

	const notUON = function notUON(arg,name) {
		notUndefined(arg,name);
		notNull(arg,name);
	};

	const notEmpty = function notEmpty(arg,name) {
		if (typeof arg==="string" && arg==="") throw new Error("Empty "+name+".");
	};

	const notType = function notType(arg,type,name) {
		if (typeof arg!==type) throw new Error("Invalid "+name+"; must be a "+type+".");
	};

	const notString = function notString(arg,name) {
		notType(arg,"string",name);
	};

	const notNumber = function notNumber(arg,name) {
		notType(arg,"number",name);
	};

	const notBoolean = function notBoolean(arg,name) {
		notType(arg,"string",name);
	};

	const notFunction = function notFunction(arg,type,name) {
		if (!(arg instanceof Function)) throw new Error("Invalid "+name+"; must be a Function.");
	};

	const notArray = function notArray(arg,type,name) {
		if (!(arg instanceof Array)) throw new Error("Invalid "+name+"; must be an Array.");
	};
	/* eslint-enable no-unused-vars */

	const resolveURL = function resolve(path,baseurl=document.URL) {
		notUON(path,"path");
		notEmpty(path,"path");
		if (!(path instanceof URL) && typeof path!=="string") throw new Error("Invalid path; must be a string or URL.");

		try {
			if (typeof path==="string") {
				if (path.startsWith("data:")) return new URL(path);
			}

			return new URL(path,baseurl);
		}
		catch (ex) {
			return null;
		}
	};

	const fetchText = function fetchText(url) {
		notUON(url,"url");
		notEmpty(url,"url");

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
		if (s.startsWith("/") && !s.startsWith("/*") && !s.startsWith("//")) return true;
		if (s.startsWith("./")) return true;
		if (s.startsWith("../")) return true;
		if (s.startsWith("http://")) return true;
		if (s.startsWith("https://")) return true;
		if (s.startsWith("ftp://")) return true;
		if (s.indexOf(" ")<0) return true;

		try {
			new URL(s);
		}
		catch (ex) {
			return false;
		}

		return true;
	};

	const fire = function fire(listeners,...args) {
		listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
		listeners.forEach((listener)=>{
			setTimeout(()=>{
				return listener.apply(listener,args);
			},0);
		});
	};

	const fireImmediately = function fireImmediately(listeners,...args) {
		listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
		listeners.forEach((listener)=>{
			return listener.apply(listener,args);
		});
	};

	class ZephContainer {
		constructor(origin,code,asName) {
			notUON(origin,"origin");
			notString(origin,"origin");
			notEmpty(origin,"origin");

			notUON(code,"code");
			if (typeof code!=="string" && !(code instanceof Function)) throw new Error("Invalid code; must be a string or a function.");

			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");

			this[$ORIGIN] = origin;
			this[$CODE] = code;
			this[$ASNAME] = asName || null;
		}

		run() {
			return new Promise(async (resolve,reject)=>{
				try {
					let origin = this[$ORIGIN];
					let asName = this[$ASNAME];

					if (PENDING[origin]) return resolve();
					PENDING[origin] = true;

					document.dispatchEvent(new CustomEvent("zeph:loading",{
						bubbles: false,
						detail: origin
					}));

					let code = this[$CODE];
					let context = {
						components: [],
						services: [],
						loads: []
					};

					/* eslint-disable no-unused-vars */
					let component = this.component.bind(this,context,origin,asName);
					let service = this.service.bind(this,context,origin);
					let load = this.load.bind(this,context,origin);
					/* eslint-enable no-unused-vars */

					let func;
					if (typeof code==="string") {
						let wrapped = "()=>{"+code+"}";
						try {
							func = eval(wrapped);
						}
						catch (ex) {
							let stack = ex.stack;
							let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
							line += 6;
							throw new Error("Syntax Error in compontent() code for "+origin+", line "+line+": "+ex.message);
						}
					}
					else if (code instanceof Function) {
						try {
							func = eval(code.toString());
						}
						catch (ex) {
							let stack = ex.stack;
							let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
							line += 6;
							throw new Error("Syntax Error in compontent() code for "+origin+", line "+line+": "+ex.message);
						}
					}
					else {
						throw new Error("Code must be a string or a Function.");
					}

					try {
						func();
					}
					catch (ex) {
						let stack = ex.stack;
						let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
						line += 6;
						throw new Error("Execution Error in compontent() code for "+origin+", line "+line+": "+ex.message);
					}

					await Promise.all(context.components||[]);
					await Promise.all(context.services||[]);
					await Promise.all(context.loads||[]);

					document.dispatchEvent(new CustomEvent("zeph:loaded",{
						bubbles: false,
						detail: origin
					}));

					delete PENDING[origin];
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

		component(context,origin,asName,name,code) {
			notUON(origin,"origin");
			notString(origin,"origin");
			notEmpty(origin,"origin");

			notUON(name,"name");
			notString(name,"name");
			notEmpty(name,"name");

			notUON(code,"code");
			notFunction(code,"code");

			let component = Component.createComponent(origin,name,code,asName);
			if (!component) throw new Error("No component created for "+name+" component.");

			context.components.push(component);
		}

		service(context,origin,name,service) {
			notUON(name,"name");
			notString(name,"name");
			notEmpty(name,"name");

			notUON(service,"service");
			if (typeof service!=="object") throw new Error("Service must be an object.");
			if (service instanceof Function) throw new Error("Service must not be a function.");
			if (service instanceof Array) throw new Error("Service must not be an Array.");

			let srvc = window.Zeph.registerService(name,service);
			context.services.push(srvc);
		}

		load(context,origin,url,asName) {
			notUON(url,"url");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("load() url must be a URL or a string.");

			if (isURLOrPath(url)) {
				let resolved = resolveURL(url,origin);
				if (resolved) url = resolved;
			}

			let load = window.Zeph.load(url,asName);
			context.loads.push(load);
		}
	}

	class Component {
		static createComponent(origin,name,code,asName) {
			return new Promise(async (resolve,reject)=>{
				try {
					let component;
					let context = {};
					code = await ComponentCode.generateComponentCode(origin,code,context,asName);

					let markups = await Promise.all((context.html||[]).map((html)=>{
						return ComponentMarkup.generateComponentMarkup(origin,html || "");

					}));
					let styles = await Promise.all((context.css||[]).map((css)=>{
						return ComponentStyle.generateComponentStyle(origin,css || "");

					}));
					let clazz = ComponentClass.generateComponentClass(context,code,markups,styles);

					context.name = context.name || name;
					if (asName) {
						if (asName.startsWith("*")) context.name = context.name+asName.slice(1);
						else if (asName.endsWith("*")) context.name = asName.slice(0,-1)+context.name;
						else context.name = asName;
					}
					if (!context.name) throw new Error("Component was not named.");
					if (context.name && context.name.indexOf("-")<0) throw new Error("Invalid name; must contain at least one dash character.");

					try {
						customElements.define(context.name,clazz);
					}
					catch (ex) {
						return reject(new Error("Error when defining component "+context.name+" at "+origin+": "+ex.message));
					}

					component = new Component(origin,context.name,code,markups,styles);
					COMPONENTS[context.name] = component;

					fireImmediately(context.init,component,context);

					document.dispatchEvent(new CustomEvent("zeph:component",{
						bubbles: false,
						detail: component
					}));

					resolve(component);
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
		static generateComponentClass(context,code,markups,styles) {
			const TO_BE_REPLACED = (class {});
			const componentElementClass = (class ComponentElement extends TO_BE_REPLACED {
				static get observedAttributes() {
					return context.observed;
				}

				constructor() {
					super();

					let element = this;
					this[$ELEMENT] = element;

					let shadow  = this.attachShadow({
						mode:"open"
					});
					this[$SHADOW] = shadow;

					let html = shadow.innerHTML;
					(markups||[]).forEach((markup)=>{
						html += markup.text;
					});
					shadow.innerHTML = html;

					(styles||[]).forEach((style)=>{
						let styleElement = document.createElement("style");
						styleElement.textContent = style.text;
						shadow.appendChild(styleElement);
					});

					// fire our create event. We need to do this here and immediately
					// so the onCreate handlers can do whatever setup they need to do
					// before we go off and register bindings and events.
					fireImmediately(context.create,this,this.shadowRoot);

					if (context.bindings) {
						context.bindings.forEach((binding)=>{
							if (!binding) return;

							if (binding.target.element===".") binding.target.element = element;

							let srcele = binding.source.element;
							if (srcele===".") srcele = [element];
							else if (typeof srcele==="string") srcele = [...shadow.querySelectorAll(srcele)];
							else if (srcele instanceof HTMLElement) srcele = [srcele];

							srcele.forEach((srcele)=>{
								let handler;
								if (binding.target.name.startsWith("@")) {
									handler = (value)=>{
										let name = binding.target.name.slice(1);
										value = binding.transform(value);
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (value===undefined) {
												target.removeAttribute(name);
											}
											else if (target.getAttribute(name)!==value) {
												target.setAttribute(name,value);
											}
										});
									};
								}
								else if (binding.target.name.startsWith("#")) {
									handler = (value)=>{
										let name = binding.target.name.slice(1);
										value = binding.transform(value);
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (value===undefined) {
												delete target[name];
											}
											else if (target[name]!==value) {
												target[name] = value;
											}
										});
									};
								}
								else if (binding.target.name==="$") {
									handler = (value)=>{
										value = binding.transform(value);
										if (value===undefined) return;
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (target.textContent!==value) target.textContent = value===undefined || value===null ? "" : value;
										});
									};
								}
								else {
									/* eslint-disable no-console */
									console.warn("Unable to handle binding to '"+binding.target.name+"'; Must start with '@' or '$' or '#'.");
									/* eslint-enable no-console */
									return;
								}

								if (!srcele[$OBSERVER]) {
									srcele[$OBSERVER] = new ElementObserver(srcele);
									srcele[$OBSERVER].start();
								}

								// first we run the handler for the initial alignment,
								// then we register the observer.
								let observer = srcele[$OBSERVER];
								if (binding.source.name.startsWith("@")) {
									let name = binding.source.name.slice(1);
									if (srcele.hasAttribute(name)) {
										let value =  srcele.getAttribute(name);
										handler(value,name,srcele);
									}

									observer.addAttributeObserver(name,handler);
								}
								else if (binding.source.name==="$") {
									let value = srcele.textContent;
									handler(value,null,srcele);

									observer.addContentObserver(handler);
								}
							});
						});
					}

					// register events from onEvent
					if (context.events) {
						context.events.forEach((obj)=>{
							this.addEventListener(obj.eventName,(event)=>{
								obj.listener.call(element,event,element,shadow);
							});
						});
					}

					// register events from onEventAt
					if (context.eventsAt) {
						context.eventsAt.forEach((obj)=>{
							let selected = [...shadow.querySelectorAll(obj.selector)];
							selected.forEach((sel)=>{
								sel.addEventListener(obj.eventName,(event)=>{
									obj.listener.call(sel,event,sel,element,shadow);
								});
							});
						});
					}
				}

				get element() {
					return this[$ELEMENT];
				}

				get content() {
					return this[$SHADOW];
				}

				connectedCallback() {
					fire(context.add,this,this.shadowRoot);
				}

				disconnectedCallback() {
					fire(context.remove,this,this.shadowRoot);
				}

				adoptedCallback() {
					fire(context.adopt,this,this.shadowRoot);
				}

				attributeChangedCallback(attribute,oldValue,newValue) {
					fire(context.attributes[attribute],oldValue,newValue,this,this.shadowRoot);
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
		static generateComponentCode(origin,code,context={}) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (code.toString().startsWith("data:")) {
						code = code.toString().replace(/^data:.*?,/,"");
					}

					if (isURLOrPath(code)) {
						let url = resolveURL(code);
						if (url && url.pathname.endsWith(".code")) {
							origin = url;
							code = await fetchText(url);
						}
					}

					let codeClass = new ComponentCode(origin||document.URL,code,context);

					if (context.pending) {
						let promised = context.pending.filter((def)=>{
							return def instanceof Promise;
						});
						await Promise.all(promised);
					}

					resolve(codeClass);
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		constructor(origin,code,context) {
			if (code===undefined || code===null) throw new Error("No code for component definition.");

			this[$ORIGIN] = origin;
			this[$TEXT] = code.toString();

			/* eslint-disable no-unused-vars */
			let requires = this.requires.bind(this,context,origin);
			let load = this.load.bind(this,context,origin);
			let html = this.html.bind(this,context);
			let css = this.css.bind(this,context);
			let binding = this.binding.bind(this,context);
			let bindAttribute = this.bindAttribute.bind(this,context);
			let bindContent = this.bindContent.bind(this,context);
			let bindAttributeAt = this.bindAttributeAt.bind(this,context);
			let bindContentAt = this.bindContentAt.bind(this,context);
			let onInit = this.onInit.bind(this,context);
			let onCreate = this.onCreate.bind(this,context);
			let onAdd = this.onAdd.bind(this,context);
			let onRemove = this.onRemove.bind(this,context);
			let onAttribute = this.onAttribute.bind(this,context);
			let onEvent = this.onEvent.bind(this,context);
			let onEventAt = this.onEventAt.bind(this,context);
			/* eslint-enable no-unused-vars */

			let func;
			if (typeof code==="string") {
				let wrapped = "()=>{"+code+"}";
				try {
					func = eval(wrapped);
				}
				catch (ex) {
					let stack = ex.stack;
					let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
					line += 6;
					throw new Error("Syntax Error in compontent() code for "+origin+", line "+line+": "+ex.message);
				}
			}
			else if (code instanceof Function) {
				try {
					func = eval(code.toString());
				}
				catch (ex) {
					let stack = ex.stack;
					let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
					line += 6;
					throw new Error("Syntax Error in compontent() code for "+origin+", line "+line+": "+ex.message);
				}
			}
			else {
				throw new Error("Code must be a string or a Function.");
			}

			try {
				func();
			}
			catch (ex) {
				let stack = ex.stack;
				let line = parseInt(stack.replace(/\r\n|\n/g,"").replace(/.*at eval.*<anonymous>:(\d+).*/,"$1"));
				line += 6;
				throw new Error("Execution Error in compontent() code for "+origin+", line "+line+": "+ex.message);
			}
		}

		get text() {
			return this[$TEXT];
		}

		get origin() {
			return this[$ORIGIN];
		}

		requires(context,baseurl,url,asName) {
			notUON(url,"url");
			notEmpty(url,"url");
			if (!url) throw new Error("Missing url.");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			if (isURLOrPath(url)) {
				let resolved = resolveURL(url,baseurl);
				if (resolved) url = resolved;
			}

			let pending = window.Zeph.load(url,asName);
			if (pending) {
				context.pending = context.pending || [];
				context.pending.push(pending);
			}
		}

		load(context,baseurl,url,asName) {
			this.requires(context,baseurl,url,asName);
		}

		html(context,html) {
			notUON(html,"html");
			notString(html,"html");

			context.html = context.html || [];
			context.html.push(html);
		}

		css(context,css) {
			notUON(css,"css");
			notString(css,"css");

			context.css = context.css || [];
			context.css.push(css);
		}

		binding(context,sourceElement,sourceName,targetElement,targetName,transformFunction) {
			notUON(sourceElement,"sourceElement");
			if (typeof sourceElement!=="string" && !(sourceElement instanceof HTMLElement)) throw new Error("Invalid sourceElement; must be a string or an instance of HTMLElement.");

			notUON(sourceName,"sourceName");
			notString(sourceName,"sourceName");
			if (!sourceName.startsWith("$") && !sourceName.startsWith("@") && !sourceName.startsWith("#")) throw new Error("Invalid sourceName; must start with a '$' or a '@' or a '#'.");

			notUON(targetElement,"targetElement");
			if (typeof targetElement!=="string" && !(targetElement instanceof HTMLElement)) throw new Error("Invalid targetElement; must be a string or an instance of HTMLElement.");


			notUON(targetName,"targetName");
			notString(targetName,"targetName");
			if (!targetName.startsWith("$") && !targetName.startsWith("@") && !targetName.startsWith("#")) throw new Error("Invalid targetName; must start with a '$' or a '@' or a '#'.");

			notUON(transformFunction,"transformFunction");
			notFunction(transformFunction,"transformFunction");

			context.bindings = context.bindings || [];
			context.bindings.push({
				source: {
					element: sourceElement,
					name: sourceName
				},
				target: {
					element: targetElement,
					name: targetName
				},
				transform: transformFunction
			});
		}

		bindAttribute(context,sourceName,targetElement,targetName="@"+sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","@"+sourceName,targetElement,targetName,transformFunction);
		}

		bindContent(context,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","$",targetElement,targetName,transformFunction);
		}

		bindAttributeAt(context,sourceElement,sourceName,targetElement,targetName="@"+sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"@"+sourceName,targetElement,targetName,transformFunction);
		}

		bindContentAt(context,sourceElement,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"$",targetElement,"$",transformFunction);
		}

		onInit(context,listener) {
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.init = context.init || [];
			context.init.push(listener);
		}

		onCreate(context,listener) {
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.create = context.create || [];
			context.create.push(listener);
		}

		onAdd(context,listener) {
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.add = context.add || [];
			context.add.push(listener);
		}

		onRemove(context,listener) {
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.remove = context.remove || [];
			context.remove.push(listener);
		}

		onAdopt(context,listener) {
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.adopt = context.adopt || [];
			context.adopt.push(listener);
		}

		onAttribute(context,attribute,listener) {
			notUON(attribute,"attribute");
			notString(attribute,"attribute");
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.observed = context.observed || [];
			context.observed.push(attribute);
			context.attributes = context.attributes || {};
			context.attributes[attribute] = context.attributes[attribute] || [];
			context.attributes[attribute].push(listener);
		}

		onEvent(context,eventName,listener) {
			notUON(eventName,"eventName");
			notString(eventName,"eventName");
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.events = context.events || [];
			context.events.push({eventName,listener});
		}

		onEventAt(context,selector,eventName,listener) {
			notUON(eventName,"eventName");
			notString(eventName,"eventName");
			notUON(listener,"listener");
			notFunction(listener,"listener");
			context.eventsAt = context.eventsAt || [];
			context.eventsAt.push({selector,eventName,listener});
		}
	}

	class ComponentMarkup {
		static generateComponentMarkup(origin,html) {
			return new Promise(async (resolve,reject)=>{
				try {
					if (isURLOrPath(html)) {
						let url = resolveURL(html,origin);
						if (url && url.pathname.endsWith(".html")) {
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
						if (url && url.pathname.endsWith(".css")) {
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

	class ElementObserver {
		constructor(element) {
			if (!element) throw new Error("Missing element.");
			if (!(element instanceof HTMLElement)) throw new Error("Invalid element; must be an instance of HTMLElement.");

			this.element = element;
			this.attributes = {};
			this.content = [];
			this.observer = new MutationObserver(this.handleMutation.bind(this));
		}

		addAttributeObserver(attribute,handler) {
			notUON(attribute,"attribute");
			notString(attribute,"attribute");
			notUON(handler,"handler");
			notFunction(handler,"handler");

			this.attributes[attribute] = this.attributes[attribute] || [];
			this.attributes[attribute].push(handler);
		}

		removeAttributeObserver(attribute,handler) {
			notUON(attribute,"attribute");
			notString(attribute,"attribute");
			notUON(handler,"handler");
			notFunction(handler,"handler");

			if (!this.attributes[attribute]) return;
			this.attributes[attribute] = this.attributes[attribute].filter((h)=>{
				return h!==handler;
			});
			if (this.attributes[attribute].length<1) delete this.attributes[attribute];
		}

		removeAllAttributeObservers(attribute) {
			if (attribute && typeof attribute!=="string") throw new Error("Invalid attribute; must be a string.");
			if (!attribute) this.attributes = {};
			else delete this.attributes[attribute];
		}

		addContentObserver(handler) {
			notUON(handler,"handler");
			notFunction(handler,"handler");

			this.content.push(handler);
		}

		removeContentObserver(handler) {
			notUON(handler,"handler");
			notFunction(handler,"handler");

			this.content = this.content.filter((h)=>{
				return h!==handler;
			});
		}

		removeAllContentObservers() {
			this.content = [];
		}

		start() {
			this.observer.observe(this.element,{
				attributes: true,
				characterData: true,
				childList: true
			});
		}

		stop() {
			this.observer.disconnect();
		}

		handleMutation(records) {
			records.forEach((record)=>{
				if (record.type==="attributes") this.handleAttributeMutation(record);
				else this.handleContentMutation(record);
			});
		}

		handleAttributeMutation(record) {
			let name = record.attributeName;
			if (!this.attributes[name] || this.attributes[name].length<1) return;

			let value = this.element.getAttribute(name);
			this.attributes[name].forEach((handler)=>{
				handler(value,name,this.element);
			});
		}

		handleContentMutation(/*record*/) {
			if (this.content.length<1) return;
			let value = this.element.textContent;

			this.content.forEach((handler)=>{
				handler(value,this.element);
			});
		}
	}

	class AbstractService {
		constructor() {
		}
	}

	class ZephClass {
		get AbstractService() {
			return AbstractService;
		}

		get components() {
			return Object.keys(COMPONENTS);
		}

		get services() {
			return SERVICES;
		}

		getComponent(name) {
			notUON(name,"name");
			notString(name,"name");

			return COMPONENTS[name];
		}

		load(url,asName) {
			notUON(url,"url");
			if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");

			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			return new Promise(async (resolve,reject)=>{
				try {
					let code = "";
					let origin = document.URL.toString();

					if (url.toString().startsWith("data:")) {
						code = url.toString().replace(/^data:.*?,/,"");
						origin = document.URL.toString()+":[inline]";
					}
					else if (isURLOrPath(url)) {
						let ext = url.toString().match(/\.[^/]+/) ? url.toString().replace(/^.*\.([^/]*)$/,"$1") : "";
						if (!ext) {
							let resolved = resolveURL(url.toString()+".js");
							if (resolved) url = resolved;
						}

						let resolved = resolveURL(url);
						if (resolved) url = resolved;

						try {
							code = await fetchText(url);
							origin = url.toString();
						}
						catch (ex) {
							return reject("Unable to resolve "+url.toString()+".");
						}
					}
					else {
						code = url;
						origin = document.URL.toString()+":[inline]";
					}

					let container = new ZephContainer(origin,code,asName);
					await container.run();

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

		define(code,asName,origin) {
			notUON(code,"code");
			if (typeof code!=="string" && !(code instanceof Function)) throw new Error("Invalid code; must be a string or a Function.");
			if (asName && typeof asName!=="string") throw new Error("Invalid asName; must be a string.");
			if (asName && asName.indexOf("-")<0) throw new Error("Invalid asName; must contain at least one dash character.");

			return new Promise(async (resolve,reject)=>{
				try {
					let container = new ZephContainer(origin,code,asName);
					await container.run();

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		removeComponent(name) {
			notUON(name,"name");
			notString(name,"name");

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

		registerService(name,service) {
			notUON(name,"name");
			notString(name,"name");
			notEmpty(name,"name");

			notUON(service,"service");
			if (typeof service!=="object") throw new Error("Service must be an object.");
			if (service instanceof Function) throw new Error("Service must not be a function.");
			if (service instanceof Array) throw new Error("Service must not be an Array.");

			SERVICES[name] = service;
		}

		unregisterService(name) {
			notUON(name,"name");
			notString(name,"name");
			notEmpty(name,"name");

			delete SERVICES[name];
		}

		getService(name) {
			notUON(name,"name");
			notString(name,"name");
			notEmpty(name,"name");

			return SERVICES[name] || null;
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
