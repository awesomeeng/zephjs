// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

const $COMPONENTS = Symbol("components");
const $SERVICES = Symbol("services");
const $NAME = Symbol("name");
const $CONTEXT = Symbol("context");
const $ELEMENT = Symbol("element");
const $SHADOW = Symbol("shadow");
const $OBSERVED = Symbol("observed");
const $OBSERVER = Symbol("observer");
const $LISTENERS = Symbol("listeners");
const $PROXY = Symbol("proxy");

let CODE_CONTEXT = null;
let PENDING = {};

const IDENTITY_FUNCTION = (x)=>{
	return x;
};

const not = {
	undefined: (arg,name)=>{
		if (arg===undefined) throw new Error("Undefined "+name+".");
	},
	null: (arg,name)=>{
		if (arg===null) throw new Error("Null "+name+".");
	},
	uon: (arg,name)=>{
		not.undefined(arg,name);
		not.null(arg,name);
	},
	empty: (arg,name)=>{
		if (typeof arg==="string" && arg==="") throw new Error("Empty "+name+".");
	},
	type: (arg,type,name)=>{
		if (typeof arg!==type) throw new Error("Invalid "+name+"; must be a "+type+".");
	},
	string: (arg,name)=>{
		not.type(arg,"string",name);
	},
	number: (arg,name)=>{
		not.type(arg,"number",name);
	},
	boolean: (arg,name)=>{
		not.type(arg,"string",name);
	},
	function: (arg,type,name)=>{
		if (!(arg instanceof Function)) throw new Error("Invalid "+name+"; must be a Function.");
	},
	array: (arg,type,name)=>{
		if (!(arg instanceof Array)) throw new Error("Invalid "+name+"; must be an Array.");
	}
};

const utils = {
	exists: (url)=>{
		not.uon(url,"url");
		not.empty(url,"url");

		return new Promise(async (resolve,reject)=>{
			try {
				let response = await fetch(url,{
					method: "HEAD"
				});
				if (response.ok) resolve(true);
				else resolve(false);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},
	fetch: (url)=>{
		not.uon(url,"url");
		not.empty(url,"url");

		return new Promise(async (resolve,reject)=>{
			try {
				let response = await fetch(url);
				if (response.ok) return resolve(response);
				resolve(undefined);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},
	fetchText: (url)=>{
		not.uon(url,"url");
		not.empty(url,"url");

		return new Promise(async (resolve,reject)=>{
			try {
				let response = await utils.fetch(url);
				if (!response) resolve(undefined);

				let text = await response.text();
				if (!text) resolve(undefined);

				resolve(text);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},
	resolve: (url,base=document.URL)=>{
		not.uon(url,"url");
		not.empty(url,"url");
		if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");

		try {
			if (typeof url==="string") {
				if (url.startsWith("data:")) return new URL(url);
			}

			return new URL(url,base);
		}
		catch (ex) {
			return null;
		}
	},
	resolveName(url,base=document.URL,extension=".js") {
		return new Promise(async (resolve,reject)=>{
			try {
				if (url.toString().match(/[\n\r\t<]/g)) return resolve(undefined);

				let resolved = utils.resolve(url,base);
				if (await utils.exists(resolved)) return resolve(resolved);

				if (await utils.exists(url)) return resolve(url);

				if (extension) {
					let resolvedextended = utils.resolve(extended,base);
					if (await utils.exists(resolvedextended)) return resolve(resolvedextended);

					let extended = url+extension;
					if (await utils.exists(extended)) return resolve(extended);
				}

				resolve(undefined);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},
	fire(listeners,...args) {
		listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
		listeners.forEach((listener)=>{
			setTimeout(()=>{
				return listener.apply(listener,args);
			},0);
		});
	},
	fireImmediately(listeners,...args) {
		listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
		listeners.forEach((listener)=>{
			return listener.apply(listener,args);
		});
	},
	getPropertyDescriptor(object,propertyName) {
		while (true) {
			if (object===null) return null;

			let desc = Object.getOwnPropertyDescriptor(object,propertyName);
			if (desc) return desc;

			object = Object.getPrototypeOf(object);
		}
	},
	propetize(object,propertyName,descriptor) {
		not.uon(object,"object");
		not.uon(propertyName,"propertyName");
		not.string(propertyName,"propertyName");
		not.uon(descriptor,"descriptor");

		let oldDesc = utils.getPropertyDescriptor(object,propertyName);
		let newDesc = Object.assign({},oldDesc||{},descriptor);

		Object.defineProperty(object,propertyName,newDesc);

		return newDesc;
	}
};

window.zu = utils;

class ZephComponent {
	constructor(name,context) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");
		not.uon(context,"context");

		this[$NAME] = name;
		this[$CONTEXT] = context;
		this[$ELEMENT] = null;
	}

	get name() {
		return this[$NAME];
	}

	get context() {
		return this[$CONTEXT];
	}

	get defined() {
		return !!this[$ELEMENT];
	}

	get customElementClass() {
		return this[$ELEMENT];
	}

	define() {
		return new Promise(async (resolve,reject)=>{
			try {
				let execution = new ZephComponentExecution(this.context);
				await execution.run();

				await Promise.all(this.context.pending);

				this[$ELEMENT] = ZephElementClass.generateClass(this.context);
				customElements.define(this.name,this[$ELEMENT]);

				utils.fire(this.context.init,this.name,this);

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

class ZephComponentContext {
	constructor(code,origin=document.URL.toString()) {
		not.uon(code,"code");
		not.function(code,"code");

		this.code = code;
		this.origin = origin;

		this.pending = [];
		this.html = [];
		this.css = [];
	}
}

class ZephComponentExecution {
	constructor(context) {
		not.uon(context,"context");
		this[$CONTEXT] = context;
	}

	run() {
		return new Promise(async (resolve,reject)=>{
			try {
				CODE_CONTEXT = this;
				await this.context.code.bind(this)();
				CODE_CONTEXT = null;

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	get context() {
		return this[$CONTEXT];
	}

	html(content) {
		let prom = new Promise(async (resolve,reject)=>{
			try {
				let url = await utils.resolveName(content,this.context.origin||document.URL.toString(),".html");
				if (url) content = await utils.fetchText(url);

				this.context.html.push(content);

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});

		this.context.pending.push(prom);
	}

	css(content) {
		let prom = new Promise(async (resolve,reject)=>{
			try {
				let url = await utils.resolveName(content,this.context.origin,".css");
				if (url) content = await utils.fetchText(url);

				this.context.css.push(content);

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});

		this.context.pending.push(prom);
	}

	attribute(attributeName,initialValue) {
		not.uon(attributeName,"attributeName");
		not.string(attributeName);

		this.context.attributes = this.context.attributes || {};
		if (this.context.attributes[name]) throw new Error("Attribute '"+attributeName+"' already defined for custom element; cannot have multiple definitions.");
		this.context.attributes[attributeName] = {
			attributeName,
			initialValue
		};
	}

	property(propertyName,initialValue,transformFunction) {
		not.uon(propertyName,"attributeName");
		not.string(propertyName);
		not.undefined(initialValue,"initialValue");

		this.context.properties = this.context.properties || {};
		if (this.context.properties[name]) throw new Error("Property '"+propertyName+"' already defined for custom element; cannot have multiple definitions.");
		this.context.properties[propertyName] = Object.assign(this.context.properties[propertyName]||{},{
			propertyName,
			initialValue,
			transformFunction
		});
	}

	binding(sourceName,targetElement,targetName,transformFunction) {
		return this.bindingAt(".",sourceName,targetElement,targetName,transformFunction);
	}

	bindingAt(sourceElement,sourceName,targetElement,targetName,transformFunction) {
		if (sourceElement && sourceName && targetElement && targetName===undefined) targetName = sourceName;

		not.uon(sourceElement,"sourceElement");
		if (typeof sourceElement!=="string" && !(sourceElement instanceof HTMLElement)) throw new Error("Invalid sourceElement; must be a string or an instance of HTMLElement.");

		not.uon(sourceName,"sourceName");
		not.string(sourceName,"sourceName");
		if (!sourceName.startsWith("$") && !sourceName.startsWith("@") && !sourceName.startsWith(".")) throw new Error("Invalid sourceName; must start with a '$' or a '@' or a '.'.");

		not.uon(targetElement,"targetElement");
		if (typeof targetElement!=="string" && !(targetElement instanceof HTMLElement)) throw new Error("Invalid targetElement; must be a string or an instance of HTMLElement.");

		not.uon(targetName,"targetName");
		not.string(targetName,"targetName");
		if (!targetName.startsWith("$") && !targetName.startsWith("@") && !targetName.startsWith(".")) throw new Error("Invalid targetName; must start with a '$' or a '@' or a '.'.");

		if (transformFunction===undefined || transformFunction===null) transformFunction = IDENTITY_FUNCTION;
		not.uon(transformFunction,"transformFunction");
		not.function(transformFunction,"transformFunction");

		this.context.bindings = this.context.bindings || [];
		this.context.bindings.push({
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

	onInit(listener) {
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.init = this.context.init || [];
		this.context.init.push(listener);
	}

	onCreate(listener) {
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.create = this.context.create || [];
		this.context.create.push(listener);
	}

	onAdd(listener) {
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.add = this.context.add || [];
		this.context.add.push(listener);
	}

	onRemove(listener) {
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.remove = this.context.remove || [];
		this.context.remove.push(listener);
	}

	onAdopt(listener) {
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.adopt = this.context.adopt || [];
		this.context.adopt.push(listener);
	}

	onAttribute(attribute,listener) {
		not.uon(attribute,"attribute");
		not.string(attribute,"attribute");
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.observed = this.context.observed || [];
		this.context.observed.push(attribute);
		this.context.attributes = this.context.attributes || {};
		this.context.attributes[attribute] = this.context.attributes[attribute] || [];
		this.context.attributes[attribute].push(listener);
	}

	onEvent(eventName,listener) {
		not.uon(eventName,"eventName");
		not.string(eventName,"eventName");
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.events = this.context.events || [];
		this.context.events.push({eventName,listener});
	}

	onEventAt(selector,eventName,listener) {
		not.uon(eventName,"eventName");
		not.string(eventName,"eventName");
		not.uon(listener,"listener");
		not.function(listener,"listener");
		this.context.eventsAt = this.context.eventsAt || [];
		this.context.eventsAt.push({selector,eventName,listener});
	}
}

class ZephElementClass {
	static generateClass(context) {
		const clazz = (class ZephCustomElement extends HTMLElement {
			static get observedAttributes() {
				return this[$OBSERVED];
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
				(context.html||[]).forEach((markup)=>{
					html += markup;
				});
				shadow.innerHTML = html;

				(context.css||[]).forEach((style)=>{
					let styleElement = document.createElement("style");
					styleElement.textContent = style;
					shadow.appendChild(styleElement);
				});

				if (context.attributes) {
					Object.values(context.attributes).forEach((attr)=>{
						let value = element.hasAttribute(attr.attributeName) ? element.getAttribute(attr.attributeName) : attr.initialValue;

						if (value===undefined || value===null) element.removeAttribute(attr.attributeName);
						else element.setAttribute(attr.attributeName,attr.transformFunction ? attr.transformFunction(value) : value);
					});
				}

				if (context.properties) {
					Object.values(context.properties).forEach((prop)=>{
						utils.propetize(element,prop.propertyName,{
							get: ()=>{
								return prop.value;
							},
							set: (value)=>{
								let val = prop.transformFunction ? prop.transformFunction(value) : value;
								(prop.changes||[]).forEach((listener)=>{
									listener(prop.propertyName,val,element,shadow);
								});
								prop.value = val;
							}
						});

						element[prop.propertyName] = element[prop.propertyName]!==undefined && prop.initialValue || element[prop.propertyName];
					});
				}

				// fire our create event. We need to do this here and immediately
				// so the onCreate handlers can do whatever setup they need to do
				// before we go off and register bindings and events.
				utils.fireImmediately(context.create,this,this.shadowRoot);

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
							else if (binding.target.name.startsWith(".")) {
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
								console.warn("Unable to handle binding to '"+binding.target.name+"'; Must start with '@' or '$' or '.'.");
								/* eslint-enable no-console */
								return;
							}

							if (!srcele[$OBSERVER]) {
								srcele[$OBSERVER] = new ZephElementObserver(srcele);
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
							else if (binding.source.name.startsWith(".")) {
								let name = binding.source.name.slice(1);

								context.properties = context.properties || {};
								if (!context.properties[name]) {
									context.properties[name] = {
										propertyName: name,
										changes: [],
										value: element[name]
									};

									let prop = context.properties[name];
									utils.propetize(element,name,{
										get: ()=>{
											return prop.value;
										},
										set: (value)=>{
											let val = prop.transformFunction ? prop.transformFunction(value) : value;
											(prop.changes||[]).forEach((listener)=>{
												listener(prop.propertyName,val,element,shadow);
											});
											prop.value = val;
										}
									});
								}

								let prop = context.properties[name];
								prop.changes = prop.changes || [];
								prop.changes.push((name,value)=>{
									handler(value);
								});
							}
							else if (binding.source.name==="$") {
								let value = srcele.textContent;
								handler(value,null,srcele);

								observer.addContentObserver(handler);
							}
							else {
								/* eslint-disable no-console */
								console.warn("Unable to handle binding to '"+binding.target.name+"'; Must start with '@' or '$' or '.'.");
								/* eslint-enable no-console */
								return;
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
				utils.fire(context.add,this,this.shadowRoot);
			}

			disconnectedCallback() {
				utils.fire(context.remove,this,this.shadowRoot);
			}

			adoptedCallback() {
				utils.fire(context.adopt,this,this.shadowRoot);
			}

			attributeChangedCallback(attribute,oldValue,newValue) {
				utils.fire(context.attributes[attribute],oldValue,newValue,this,this.shadowRoot);
			}
		});

		return clazz;
	}
}

class ZephElementObserver {
	constructor(element) {
		if (!element) throw new Error("Missing element.");
		if (!(element instanceof HTMLElement)) throw new Error("Invalid element; must be an instance of HTMLElement.");

		this.element = element;
		this.attributes = {};
		this.content = [];
		this.observer = new MutationObserver(this.handleMutation.bind(this));
	}

	addAttributeObserver(attribute,handler) {
		not.uon(attribute,"attribute");
		not.string(attribute,"attribute");
		not.uon(handler,"handler");
		not.function(handler,"handler");

		this.attributes[attribute] = this.attributes[attribute] || [];
		this.attributes[attribute].push(handler);
	}

	removeAttributeObserver(attribute,handler) {
		not.uon(attribute,"attribute");
		not.string(attribute,"attribute");
		not.uon(handler,"handler");
		not.function(handler,"handler");

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
		not.uon(handler,"handler");
		not.function(handler,"handler");

		this.content.push(handler);
	}

	removeContentObserver(handler) {
		not.uon(handler,"handler");
		not.function(handler,"handler");

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

class ZephComponents {
	constructor() {
		this[$COMPONENTS] = {};
		this[$PROXY] = new Proxy(this[$COMPONENTS],{
			has: (target,key)=>{
				return !!target[key];
			},
			get: (target,key)=>{
				return target[key] || undefined;
			},
			ownKeys: (target)=>{
				return Object.keys(target);
			}
		});
	}

	get components() {
		return this[$PROXY];
	}

	get names() {
		return Object.keys(this[$COMPONENTS]);
	}

	has(name) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		return !!this[$COMPONENTS][name];
	}

	get(name) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		return this[$COMPONENTS][name];
	}

	define(name,code) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		not.uon(code,"code");
		not.function(code,"code");

		if (this[$COMPONENTS][name]) throw new Error("Component already defined.");

		// Compute the origin by looking at an error's stack trace.
		let origin = document.URL.toString();
		let err = new Error();
		if (err.fileName) origin = err.filename;
		if (err.stack) {
			err = err.stack.split(/\r\n|\n/g);
			err = err.reverse();
			while (err.length>0) {
				let line = err.shift();
				if (!line) continue;
				if (!line.match(/\w+:/g)) continue;
				line = line.trim().replace(/^.*?(?=\w+:)/,"");
				line = line.replace(/:\d+$|:\d+\)$|:\d+:\d+$|:\d+:\d+\)$/,"");
				err = line;
				break;
			}
			origin = err;
		}

		PENDING["component:"+origin] = true;

		document.dispatchEvent(new CustomEvent("zeph:loading",{
			bubbles: false,
			detail: origin
		}));

		return new Promise(async (resolve,reject)=>{
			try {
				let context = new ZephComponentContext(code,origin);
				let component = new ZephComponent(name,context);
				await component.define();

				this[$COMPONENTS][name] = component;

				delete PENDING["component:"+origin];

				document.dispatchEvent(new CustomEvent("zeph:component:defined",{
					bubbles: false,
					detail: {name,component}
				}));
				document.dispatchEvent(new CustomEvent("zeph:loaded",{
					bubbles: false,
					detail: origin
				}));
				if (Object.keys(PENDING).length<1) {
					document.dispatchEvent(new CustomEvent("zeph:ready",{
						bubbles: false
					}));
				}

				resolve(component);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	undefine(name) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		let component = this[$COMPONENTS][name];
		if (!component) return;

		delete this[$COMPONENTS][name];

		document.dispatchEvent(new CustomEvent("zeph:component:undefined",{
			bubbles: false,
			detail: {name,component}
		}));
	}
}

class ZephService {
	constructor() {
		this[$LISTENERS] = new Map();

		this.on = this.addEventListener;
		this.once = (eventName,listener)=>{
			this.addEventListner(eventName,(eventName,...args)=>{
				this.removeEventListener(eventName,listener);
				listener.apply(listener,args);
			});
		};
	}

	fire(event,...args) {
		let listeners = this[$LISTENERS].get(event);
		(listeners||[]).forEach((listener)=>{
			setTimeout(()=>{
				listener.apply(listener,[event,...args]);
			},0);
		});
	}

	addEventListener(event,listener) {
		let listeners = this[$LISTENERS].get(event) || [];
		listeners.push(listener);
		this[$LISTENERS].set(event,listeners);
	}

	removeEventListener(event,listener) {
		let listeners = this[$LISTENERS].get(event) || [];
		listeners = listeners.filter((l)=>{
			return l!==listener;
		});
		this[$LISTENERS].set(event,listeners);
	}

	on(event,listener) {
		return this.addEventListener(event,listener);
	}

	once(event,listener) {
		return this.addEventListner(event,(event,...args)=>{
			this.removeEventListener(event,listener);
			listener.apply(listener,args);
		});
	}

	off(event,listener) {
		return this.removeEventListener(event,listener);
	}
}

class ZephServices {
	constructor() {
		this[$SERVICES] = {};
		this[$PROXY] = new Proxy(this[$SERVICES],{
			has: (target,key)=>{
				return !!target[key];
			},
			get: (target,key)=>{
				return target[key] || undefined;
			},
			ownKeys: (target)=>{
				return Object.keys(target);
			}
		});
	}

	get services() {
		return this[$PROXY];
	}

	get names() {
		return Object.keys(this[$SERVICES]);
	}

	has(name) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		return !!this[$SERVICES][name];
	}

	get(name) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		return this[$SERVICES][name];
	}

	register(name,service) {
		not.uon(name,"name");
		not.string(name,"name");
		not.empty(name,"name");

		not.uon(service,"service");
		if (!(service instanceof ZephService)) throw new Error("Invalid service; must be an instance of ZephService.");

		if (this[$SERVICES][name]) throw new Error("Service already registered.");

		this[$SERVICES][name] = service;

		document.dispatchEvent(new CustomEvent("zeph:service:registered",{
			bubbles: false,
			detail: {name,service}
		}));
	}

	unregister(name) {
		let service = this.get(name);
		if (service) {
			delete this[$SERVICES][name];

			document.dispatchEvent(new CustomEvent("zeph:service:unregistered",{
				bubbles: false,
				detail: {name}
			}));
		}
	}
}

const contextCall = function(name) {
	not.uon(name,"name");
	not.string(name,"name");
	not.empty(name,"name");

	let f = {[name]: function() {
		if (!CODE_CONTEXT) throw new Error(name+"() may only be used within the ZephComponent.define() method.");
		return CODE_CONTEXT[name].apply(CODE_CONTEXT,arguments);
	}}[name];

	return f;
};

const html = contextCall("html");
const css = contextCall("css");
const attribute = contextCall("attribute");
const property = contextCall("property");
const bind = contextCall("binding");
const bindAt = contextCall("bindingAt");
const onInit = contextCall("onInit");
const onCreate = contextCall("onCreate");
const onAdd = contextCall("onAdd");
const onRemove = contextCall("onRemove");
const onAdopt = contextCall("onAdopt");
const onAttribute = contextCall("onAttribute");
const onEvent = contextCall("onEvent");
const onEventAt = contextCall("onEventAt");

const zc = new ZephComponents();
const zs = new ZephServices();

export {ZephService};
export {zc as ZephComponents};
export {zs as ZephServices};
export {html,css,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onEvent,onEventAt};
