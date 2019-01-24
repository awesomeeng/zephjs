// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

(()=>{
	const $NAME = Symbol("name");
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

		if (typeof path==="string") {
			if (path.startsWith("data:")) return new URL(path);
		}

		return new URL(path,baseurl);
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
		if (s.startsWith("/")) return true;
		if (s.startsWith("./")) return true;
		if (s.startsWith("../")) return true;
		if (s.startsWith("http://")) return true;
		if (s.startsWith("https://")) return true;
		if (s.startsWith("ftp://")) return true;

		return false;
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

	class Component {
		static generateComponent(url,asName) {
			notUON(url,"url");
			notEmpty(url,"url");
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
							ex.message = "Error when defining component "+context.name+": "+ex.message;
							return reject(ex);
						}

						let component = new Component(origin,context.name,code,markups,styles);
						COMPONENTS[context.name] = component;

						fireImmediately(context.init,component,context);
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
								if (binding.target.type==="attribute") {
									handler = (value)=>{
										value = binding.transform(value);
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (value===undefined) {
												target.removeAttribute(binding.target.name);
											}
											else if (target.getAttribute(binding.target.name)!==value) {
												target.setAttribute(binding.target.name,value);
											}
										});
									};
								}
								else if (binding.target.type==="content") {
									handler = (value)=>{
										value = binding.transform(value);
										if (value===undefined) return;
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (target.textContent!==value) target.textContent = value===undefined || value===null ? "" : value;
										});
									};
								}
								else if (binding.target.type==="property") {
									handler = (value)=>{
										value = binding.transform(value);
										let targets = binding.target.element instanceof HTMLElement && [binding.target.element] || [...shadow.querySelectorAll(binding.target.element)] || [];
										targets.forEach((target)=>{
											if (value===undefined) {
												delete target[binding.target.name];
											}
											else if (target[binding.target.name]!==value) {
												target[binding.target.name] = value;
											}
										});
									};
								}
								if (!handler) return;

								if (!srcele[$OBSERVER]) {
									srcele[$OBSERVER] = new ElementObserver(srcele);
									srcele[$OBSERVER].start();
								}

								// first we run the handler for the initial alignment,
								// then we register the observer.
								let observer = srcele[$OBSERVER];
								if (binding.source.type==="attribute") {
									if (srcele.hasAttribute(binding.source.name)) {
										let value =  srcele.getAttribute(binding.source.name);
										handler(value,binding.source.name,srcele);
									}

									observer.addAttributeObserver(binding.source.name,handler);
								}
								else if (binding.source.type==="content") {
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
			if (code===undefined || code===null) throw new Error("No code for component definition.");

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
			let binding = this.binding.bind(this,context);
			let bindAttributes = this.bindAttributes.bind(this,context);
			let bindAttributeToAttribute = this.bindAttributeToAttribute.bind(this,context);
			let bindAttributeToContent = this.bindAttributeToContent.bind(this,context);
			let bindAttributeToProperty = this.bindAttributeToProperty.bind(this,context);
			let bindContentToAttribute = this.bindContentToAttribute.bind(this,context);
			let bindContents = this.bindContents.bind(this,context);
			let bindContentToContent = this.bindContentToContent.bind(this,context);
			let bindContentToProperty = this.bindContentToProperty.bind(this,context);
			let bindOtherAttributes = this.bindOtherAttributes.bind(this,context);
			let bindOtherAttributeToAttribute = this.bindOtherAttributeToAttribute.bind(this,context);
			let bindOtherAttributeToContent = this.bindOtherAttributeToContent.bind(this,context);
			let bindOtherAttributeToProperty = this.bindOtherAttributeToProperty.bind(this,context);
			let bindOtherContentToAttribute = this.bindOtherContentToAttribute.bind(this,context);
			let bindOtherContents = this.bindOtherContents.bind(this,context);
			let bindOtherContentToContent = this.bindOtherContentToContent.bind(this,context);
			let bindOtherContentToProperty = this.bindOtherContentToProperty.bind(this,context);
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
			notUON(code,"code");
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
			notUON(url,"url");
			notEmpty(url,"url");
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
			notUON(name,"name");
			notEmpty(name,"name");
			notString(name,"name");

			context.name = name;
		}

		from(context,element) {
			notUON(element,"element");
			if (typeof element!=="string" && element!==HTMLElement && !HTMLElement.isPrototypeOf(element)) throw new Error("Invalid from element; must be a string.");

			let clazz = element===HTMLElement && element || HTMLElement.isPrototypeOf(element) && element || window[element];
			if (!clazz) throw new Error("Invalid from element; must be the name of or class of an existing subclass of HTMLElement.");
			if (clazz!==HTMLElement && !HTMLElement.isPrototypeOf(clazz)) throw new Error("Invlaid from name; must extend from HTMLElement.");

			context.from = clazz.name;
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

		binding(context,sourceElement,sourceType,sourceName,targetElement,targetType,targetName,transformFunction) {
			notUON(sourceElement,"sourceElement");
			if (typeof sourceElement!=="string" && !(sourceElement instanceof HTMLElement)) throw new Error("Invalid sourceElement; must be a string or an instance of HTMLElement.");

			notUON(sourceType,"sourceType");
			notString(sourceType,"sourceType");
			sourceType = sourceType.toLowerCase();
			if (sourceType!=="attribute" && sourceType!=="content") throw new Error("Invalid sourceType; must be 'attribute' or 'content'.");

			notUON(sourceName,"sourceName");
			notString(sourceName,"sourceName");

			notUON(targetElement,"targetElement");
			if (typeof targetElement!=="string" && !(targetElement instanceof HTMLElement)) throw new Error("Invalid targetElement; must be a string or an instance of HTMLElement.");

			notUON(targetType,"targetType");
			notString(targetType,"targetType");
			targetType = targetType.toLowerCase();
			if (targetType!=="attribute" && targetType!=="content" && targetType!=="property") throw new Error("Invalid targetType; must be 'attribute' or 'content' or 'property'.");

			notUON(targetName,"targetName");
			notString(targetName,"targetName");

			notUON(transformFunction,"transformFunction");
			notFunction(transformFunction,"transformFunction");

			context.bindings = context.bindings || [];
			context.bindings.push({
				source: {
					element: sourceElement,
					type: sourceType,
					name: sourceName
				},
				target: {
					element: targetElement,
					type: targetType,
					name: targetName
				},
				transform: transformFunction
			});
		}

		bindAttributes(context,sourceName,targetElement,targetName=sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","attribute",sourceName,targetElement,"attribute",targetName,transformFunction);
		}

		bindAttributeToAttribute(context,sourceName,targetElement,targetName=sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","attribute",sourceName,targetElement,"attribute",targetName,transformFunction);
		}

		bindAttributeToContent(context,sourceName,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","attribute",sourceName,targetElement,"content",".",transformFunction);
		}

		bindAttributeToProperty(context,sourceName,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","attribute",sourceName,targetElement,"property",targetName,transformFunction);
		}

		bindContentToAttribute(context,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","content",targetElement,"attribute",targetName,transformFunction);
		}

		bindContents(context,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","content",".",targetElement,"content",".",transformFunction);
		}

		bindContentToContent(context,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","content",".",targetElement,"content",".",transformFunction);
		}

		bindContentToProperty(context,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,".","content",".",targetElement,"property",targetName,transformFunction);
		}

		bindOtherAttributes(context,sourceElement,sourceName,targetElement,targetName=sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"attribute",sourceName,targetElement,"attribute",targetName,transformFunction);
		}

		bindOtherAttributeToAttribute(context,sourceElement,sourceName,targetElement,targetName=sourceName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"attribute",sourceName,targetElement,"attribute",targetName,transformFunction);
		}

		bindOtherAttributeToContent(context,sourceElement,sourceName,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"attribute",sourceName,targetElement,"content",".",transformFunction);
		}

		bindOtherAttributeToProperty(context,sourceElement,sourceName,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"attribute",sourceName,targetElement,"property",targetName,transformFunction);
		}

		bindOtherContentToAttribute(context,sourceElement,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"content",targetElement,"attribute",targetName,transformFunction);
		}

		bindOtherContents(context,sourceElement,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"content",".",targetElement,"content",".",transformFunction);
		}

		bindOtherContentToContent(context,sourceElement,targetElement,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"content",".",targetElement,"content",".",transformFunction);
		}

		bindOtherContentToProperty(context,sourceElement,targetElement,targetName,transformFunction=(x)=>{ return x; }) {
			return this.binding(context,sourceElement,"content",".",targetElement,"property",targetName,transformFunction);
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

	class ZephClass {
		get components() {
			return Object.keys(COMPONENTS);
		}

		getComponent(name) {
			notUON(name,"name");
			notString(name,"name");

			return COMPONENTS[name];
		}

		load(url,asName) {
			notUON(url,"url");
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
	}

	window.Zeph = new ZephClass();

	// do this last to let things know Zeph is ready.
	setTimeout(()=>{
		document.dispatchEvent(new CustomEvent("zeph:initialized",{
			bubbles: false
		}));
	},0);
})();
