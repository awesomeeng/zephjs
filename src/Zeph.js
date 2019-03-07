// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

const $COMPONENTS = Symbol("components");
const $SERVICES = Symbol("services");
const $CONTEXT = Symbol("context");
const $CODE = Symbol("code");
const $ELEMENT = Symbol("element");
const $SHADOW = Symbol("shadow");
const $OBSERVER = Symbol("observer");
const $LISTENERS = Symbol("listeners");
const $PROXY = Symbol("proxy");

let CODE_CONTEXT = null;
let PENDING = {};
let FIREREADY = null;
let READY = false;

const IDENTITY_FUNCTION = (x)=>{ return x; };

const check = {
	not: {
		undefined: (arg,name)=>{
			if (arg===undefined) throw new Error("Undefined "+name+".");
		},
		null: (arg,name)=>{
			if (arg===null) throw new Error("Null "+name+".");
		},
		uon: (arg,name)=>{
			check.not.undefined(arg,name);
			check.not.null(arg,name);
		},
		empty: (arg,name)=>{
			if (typeof arg==="string" && arg==="") throw new Error("Empty "+name+".");
		}
	},
	type: (arg,type,name)=>{
		if (typeof arg!==type) throw new Error("Invalid "+name+"; must be a "+type+".");
	},
	string: (arg,name)=>{
		check.type(arg,"string",name);
	},
	number: (arg,name)=>{
		check.type(arg,"number",name);
	},
	boolean: (arg,name)=>{
		check.type(arg,"string",name);
	},
	function: (arg,type,name)=>{
		if (!(arg instanceof Function)) throw new Error("Invalid "+name+"; must be a Function.");
	},
	array: (arg,type,name)=>{
		if (!(arg instanceof Array)) throw new Error("Invalid "+name+"; must be an Array.");
	}
};

const ZephUtils = {
	ready: ()=>{
		return READY;
	},
	exists: (url)=>{
		if (url===undefined || url===null || url==="") return Promise.resolve(false);

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
		check.not.uon(url,"url");
		check.not.empty(url,"url");

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
		check.not.uon(url,"url");
		check.not.empty(url,"url");

		return new Promise(async (resolve,reject)=>{
			try {
				let response = await ZephUtils.fetch(url);
				if (!response) resolve(undefined);

				let text = await response.text();
				resolve(text);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},
	resolve: (url,base=document.URL)=>{
		check.not.uon(url,"url");
		check.not.empty(url,"url");
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

				let resolved = ZephUtils.resolve(url,base);
				if (await ZephUtils.exists(resolved)) return resolve(resolved);

				if (await ZephUtils.exists(url)) return resolve(url);

				if (extension) {
					let extended = url+extension;
					let resolvedextended = ZephUtils.resolve(extended,base);
					if (await ZephUtils.exists(resolvedextended)) return resolve(resolvedextended);

					if (await ZephUtils.exists(extended)) return resolve(extended);
				}

				resolve(undefined);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
};

class ZephComponent {
	constructor(name,origin,code) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");
		check.not.uon(origin,"origin");
		check.string(origin,"origin");
		check.not.empty(origin,"origin");
		check.not.uon(code,"code");
		check.function(code,"code");

		let context = {};
		context.name = name;
		context.origin = origin;

		this[$CODE] = code;
		this[$CONTEXT] = context;
		this[$ELEMENT] = null;
	}

	get context() {
		return this[$CONTEXT];
	}

	get name() {
		return this.context.name;
	}

	get origin() {
		return this.context.origin;
	}

	get code() {
		return this[$CODE];
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
				let execution = new ZephComponentExecution(this.context,this.code);
				await execution.run();

				// if we are inheriting we need to update the context
				// to reflect the inheritance.
				if (this.context.from) {
					let from = ZephComponents.get(this.context.from);
					if (!from) throw new Error("Component '"+this.context.from+"' not found; inheritence by '"+this.context.name+"' is not possible.");
					this[$CONTEXT] = extend({},from.context,this.context);
				}

				await Promise.all(this.context.pending||[]);

				this[$ELEMENT] = ZephElementClass.generateClass(this.context);
				customElements.define(this.name,this[$ELEMENT]);

				fire(this.context && this.context.lifecycle && this.context.lifecycle.init || [],this.name,this);

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

class ZephComponentExecution {
	constructor(context,code) {
		check.not.uon(context,"context");
		check.not.uon(code,"code");
		check.function(code,"code");

		this[$CONTEXT] = context;
		this[$CODE] = code;
	}

	run() {
		return new Promise(async (resolve,reject)=>{
			try {
				CODE_CONTEXT = this;
				await this[$CODE].bind(this)();
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

	from(fromTagName) {
		check.not.uon(fromTagName,"fromTagName");
		check.not.empty(fromTagName,"fromTagName");
		check.string(fromTagName,"fromTagName");

		this.context.pending = this.context.pending || [];
		this.context.pending.push(ZephComponents.waitFor(fromTagName));

		this.context.from = fromTagName;
	}

	html(content,options={}) {
		options = Object.assign({
			overwrite: false,
			noRemote: false
		},options||{});

		let prom = new Promise(async (resolve,reject)=>{
			try {
				if (!options.noRemote) {
					let url = await ZephUtils.resolveName(content,this.context.origin||document.URL.toString(),".html");
					if (url) content = await ZephUtils.fetchText(url);
				}

				this.context.html = this.context.html || [];
				this.context.html.push({content,options});

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});

		this.context.pending = this.context.pending || [];
		this.context.pending.push(prom);
	}

	css(content,options={}) {
		options = Object.assign({
			overwrite: false,
			noRemote: false
		},options||{});

		let prom = new Promise(async (resolve,reject)=>{
			try {
				if (!options.noRemote) {
					let url = await ZephUtils.resolveName(content,this.context.origin,".css");
					if (url) content = await ZephUtils.fetchText(url);
				}

				this.context.css = this.context.css || [];
				this.context.css.push({content,options});

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});

		this.context.pending = this.context.pending || [];
		this.context.pending.push(prom);
	}

	attribute(attributeName,initialValue) {
		check.not.uon(attributeName,"attributeName");
		check.string(attributeName);

		this.context.attributes = this.context.attributes || {};
		if (this.context.attributes[attributeName]) throw new Error("Attribute '"+attributeName+"' already defined for custom element; cannot have multiple definitions.");
		this.context.attributes[attributeName] = {
			attributeName,
			initialValue
		};
	}

	property(propertyName,initialValue,transformFunction) {
		check.not.uon(propertyName,"propertyName");
		check.string(propertyName);

		this.context.properties = this.context.properties || {};
		if (this.context.properties[propertyName]) throw new Error("Property '"+propertyName+"' already defined for custom element; cannot have multiple definitions.");
		this.context.properties[propertyName] = Object.assign(this.context.properties[propertyName]||{},{
			propertyName,
			initialValue,
			transformFunction,
			changes: []
		});
	}

	binding(sourceName,targetElement,targetName,transformFunction) {
		return this.bindingAt(".",sourceName,targetElement,targetName,transformFunction);
	}

	bindingAt(sourceElement,sourceName,targetElement,targetName,transformFunction) {
		if (sourceElement && sourceName && targetElement && targetName===undefined) targetName = sourceName;

		check.not.uon(sourceElement,"sourceElement");
		if (typeof sourceElement!=="string" && !(sourceElement instanceof HTMLElement)) throw new Error("Invalid sourceElement; must be a string or an instance of HTMLElement.");

		check.not.uon(sourceName,"sourceName");
		check.string(sourceName,"sourceName");
		if (!sourceName.startsWith("$") && !sourceName.startsWith("@") && !sourceName.startsWith(".")) throw new Error("Invalid sourceName; must start with a '$' or a '@' or a '.'.");

		check.not.uon(targetElement,"targetElement");
		if (typeof targetElement!=="string" && !(targetElement instanceof HTMLElement)) throw new Error("Invalid targetElement; must be a string or an instance of HTMLElement.");

		check.not.uon(targetName,"targetName");
		check.string(targetName,"targetName");
		if (!targetName.startsWith("$") && !targetName.startsWith("@") && !targetName.startsWith(".")) throw new Error("Invalid targetName; must start with a '$' or a '@' or a '.'.");

		if (transformFunction===undefined || transformFunction===null) transformFunction = IDENTITY_FUNCTION;
		check.not.uon(transformFunction,"transformFunction");
		check.function(transformFunction,"transformFunction");

		let name = sourceElement+":"+sourceName+">"+targetElement+":"+targetName;

		this.context.bindings = this.context.bindings || {};
		this.context.bindings[name] = {
			source: {
				element: sourceElement,
				name: sourceName
			},
			target: {
				element: targetElement,
				name: targetName
			},
			transform: transformFunction
		};
	}

	onInit(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.init = this.context.lifecycle.init || [];
		this.context.lifecycle.init.push(listener);
	}

	onCreate(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.create = this.context.lifecycle.create || [];
		this.context.lifecycle.create.push(listener);
	}

	onAdd(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.add = this.context.lifecycle.add || [];
		this.context.lifecycle.add.push(listener);
	}

	onRemove(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.remove = this.context.lifecycle.remove || [];
		this.context.lifecycle.remove.push(listener);
	}

	onAdopt(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.adopt = this.context.lifecycle.adopt || [];
		this.context.lifecycle.adopt.push(listener);
	}

	onAttribute(attributeName,listener) {
		check.not.uon(attributeName,"attribute");
		check.string(attributeName,"attribute");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");

		this.context.observed = this.context.observed || [];
		this.context.observed.push(attributeName);

		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.attributes = this.context.lifecycle.attributes || {};
		this.context.lifecycle.attributes[attributeName] = this.context.lifecycle.attributes[attributeName] || [];
		this.context.lifecycle.attributes[attributeName].push(listener);
	}

	onProperty(propertyName,listener) {
		check.not.uon(propertyName,"attribute");
		check.string(propertyName,"attribute");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");

		this.context.properties = this.context.properties || {};
		if (!this.context.properties[propertyName]) this.property(propertyName,undefined);
		this.context.properties[propertyName].changes.push(listener);
	}

	onEvent(eventName,listener) {
		check.not.uon(eventName,"eventName");
		check.string(eventName,"eventName");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.events = this.context.events || [];
		this.context.events.push({eventName,listener});
	}

	onEventAt(selector,eventName,listener) {
		check.not.uon(eventName,"eventName");
		check.string(eventName,"eventName");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.eventsAt = this.context.eventsAt || [];
		this.context.eventsAt.push({selector,eventName,listener});
	}
}

class ZephElementClass {
	static generateClass(context) {
		const clazz = (class ZephCustomElement extends HTMLElement {
			static get observedAttributes() {
				return context && context.observed || [];
			}

			constructor() {
				super();

				let element = this;
				this[$ELEMENT] = element;

				let shadow = this.shadowRoot || this.attachShadow({
					mode:"open"
				});
				this[$SHADOW] = shadow;

				let css = shadow.querySelector("style");
				if (css) css = css.textContent;
				else css = "";

				let html = shadow.innerHTML;
				(context.html||[]).forEach((markup)=>{
					let content = markup.content;
					let options = markup.options;

					if (options.overwrite) html = content;
					else html += content;
				});
				shadow.innerHTML = html;

				(context.css||[]).forEach((style)=>{
					let content = style.content;
					let options = style.options;

					if (options.overwrite) css = content;
					else css += content+"\n";
				});
				if (css) {
					let styleElement = document.createElement("style");
					styleElement.textContent = css;
					shadow.appendChild(styleElement);
				}

				// All of the below, setting attributes, properties, bindings,
				// must happen AFTER the constructor is complete or it violates
				// the custom elements spec and will throw weird errors when
				// you create new elements with document.createElement()
				//
				// so, we do this as a timeout.
				setTimeout(()=>{
					if (context.attributes) {
						Object.values(context.attributes).forEach((attr)=>{
							let value = element.hasAttribute(attr.attributeName) ? element.getAttribute(attr.attributeName) : attr.initialValue;

							if (value===undefined || value===null) element.removeAttribute(attr.attributeName);
							else element.setAttribute(attr.attributeName,attr.transformFunction ? attr.transformFunction(value) : value);
						});
					}

					if (context.properties) {
						Object.values(context.properties).forEach((prop)=>{
							let value = element[prop.propertyName]!==undefined ? element[prop.propertyName] : prop.initialValue;

							propetize(element,prop.propertyName,{
								get: ($super)=>{
									if ($super) return $super();
									return value;
								},
								set: (val,$super)=>{
									val = prop.transformFunction ? prop.transformFunction(val) : val;
									if ($super) val = $super(val);
									value = val;

									(prop.changes||[]).forEach((listener)=>{
										listener(prop.propertyName,val,element,shadow);
									});
								}
							});

							element[prop.propertyName] = element[prop.propertyName]===undefined ? prop.initialValue : element[prop.propertyName];
						});
					}

					// fire our create event. We need to do this here and immediately
					// so the onCreate handlers can do whatever setup they need to do
					// before we go off and register bindings and events.
					fireImmediately(context && context.lifecycle && context.lifecycle.create || [],this,this.shadowRoot);

					if (context.bindings) {
						Object.keys(context.bindings).forEach((name)=>{
							let binding = context.bindings[name];
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
										propetize(element,name,{
											get: ($super)=>{
												if ($super) return $super();
												return prop.value;
											},
											set: (value,$super)=>{
												let val = prop.transformFunction ? prop.transformFunction(value) : value;
												if ($super) $super(val);
												prop.value = val;

												(prop.changes||[]).forEach((listener)=>{
													listener(prop.propertyName,val,element,shadow);
												});
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
				},0);
			}

			get element() {
				return this[$ELEMENT];
			}

			get content() {
				return this[$SHADOW];
			}

			connectedCallback() {
				fire(context && context.lifecycle && context.lifecycle.add || [],this,this.shadowRoot);
			}

			disconnectedCallback() {
				fire(context && context.lifecycle && context.lifecycle.remove || [],this,this.shadowRoot);
			}

			adoptedCallback() {
				fire(context && context.lifecycle && context.lifecycle.adopt || [],this,this.shadowRoot);
			}

			attributeChangedCallback(attributeName,oldValue,newValue) {
				fire(context && context.lifecycle && context.lifecycle.attributes && context.lifecycle.attributes[attributeName] || [],oldValue,newValue,this,this.shadowRoot);
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
		check.not.uon(attribute,"attribute");
		check.string(attribute,"attribute");
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

		this.attributes[attribute] = this.attributes[attribute] || [];
		this.attributes[attribute].push(handler);
	}

	removeAttributeObserver(attribute,handler) {
		check.not.uon(attribute,"attribute");
		check.string(attribute,"attribute");
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

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
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

		this.content.push(handler);
	}

	removeContentObserver(handler) {
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

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

class ZephComponentsClass {
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
		this[$OBSERVER] = [];
	}

	get components() {
		return this[$PROXY];
	}

	get names() {
		return Object.keys(this[$COMPONENTS]);
	}

	has(name) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		return !!this[$COMPONENTS][name];
	}

	get(name) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		return this[$COMPONENTS][name];
	}

	waitFor(name) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		if (this[$COMPONENTS][name]) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			this[$OBSERVER].push({name,resolve,reject});
		});
	}

	define(name,code) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		check.not.uon(code,"code");
		check.function(code,"code");

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
				let component = new ZephComponent(name,origin,code);
				await component.define();

				this[$COMPONENTS][name] = component;
				this[$OBSERVER] = this[$OBSERVER].filter((waiting)=>{
					if (waiting.name===name) waiting.resolve();
					return waiting.name!==name;
				});

				delete PENDING["component:"+origin];

				document.dispatchEvent(new CustomEvent("zeph:component:defined",{
					bubbles: false,
					detail: {name,component}
				}));
				document.dispatchEvent(new CustomEvent("zeph:loaded",{
					bubbles: false,
					detail: origin
				}));
				fireZephReady();

				resolve(component);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	undefine(name) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

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

class ZephServicesClass {
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
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		return !!this[$SERVICES][name];
	}

	get(name) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		return this[$SERVICES][name];
	}

	register(name,service) {
		check.not.uon(name,"name");
		check.string(name,"name");
		check.not.empty(name,"name");

		check.not.uon(service,"service");
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

const extend = function extend(target,...sources) {
	if (target===undefined || target===null) target = {};
	sources.forEach((source)=>{
		Object.keys(source).forEach((key)=>{
			let val = source[key];
			let tgt = target[key];
			if (val===undefined) return;
			else if (val===null) target[key] = null;
			else if (val instanceof Promise) target[key] = val;
			else if (val instanceof Function) target[key] = val;
			else if (val instanceof RegExp) target[key] = val;
			else if (val instanceof Date) target[key] = new Date(val);
			else if (val instanceof Array) target[key] = [].concat(tgt||[],val);
			else if (typeof val==="object") target[key] = extend(tgt,val);
			else target[key] = val;
		});
	});
	return target;
};
window.glen = extend;

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

const fireZephReady = function fireZephReady() {
	if (FIREREADY) clearTimeout(FIREREADY);
	FIREREADY = setTimeout(()=>{
		if (Object.keys(PENDING).length<1) {
			READY = true;
			document.dispatchEvent(new CustomEvent("zeph:ready",{
				bubbles: false
			}));
		}
	},10);
};

const getPropertyDescriptor = function getPropertyDescriptor(object,propertyName) {
	while (true) {
		if (object===null) return null;

		let desc = Object.getOwnPropertyDescriptor(object,propertyName);
		if (desc) return desc;

		object = Object.getPrototypeOf(object);
	}
};

const propetize = function propetize(object,propertyName,descriptor) {
	check.not.uon(object,"object");
	check.not.uon(propertyName,"propertyName");
	check.string(propertyName,"propertyName");
	check.not.uon(descriptor,"descriptor");

	let oldDesc = getPropertyDescriptor(object,propertyName);
	let newDesc = Object.assign({},oldDesc||{},descriptor);

	if (oldDesc && descriptor.get) {
		delete newDesc.value;
		delete newDesc.writable;
		newDesc.get = ()=>{
			let $super = oldDesc.get || null;
			return descriptor.get($super);
		};
	}
	if (oldDesc && descriptor.set) {
		delete newDesc.writable;
		newDesc.set = (value)=>{
			let $super = oldDesc.set || null;
			return descriptor.set(value,$super);
		};
	}

	Object.defineProperty(object,propertyName,newDesc);

	return newDesc;
};

const contextCall = function(name) {
	check.not.uon(name,"name");
	check.string(name,"name");
	check.not.empty(name,"name");

	let f = {[name]: function() {
		if (!CODE_CONTEXT) throw new Error(name+"() may only be used within the ZephComponent.define() method.");
		return CODE_CONTEXT[name].apply(CODE_CONTEXT,arguments);
	}}[name];

	return f;
};

const from = contextCall("from");
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
const onProperty = contextCall("onProperty");
const onEvent = contextCall("onEvent");
const onEventAt = contextCall("onEventAt");

const ZephComponents = new ZephComponentsClass();
const ZephServices = new ZephServicesClass();

export {ZephComponents,ZephService,ZephServices,ZephUtils};
export {from,html,css,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt};

window.Zeph = {
	ZephComponents,
	ZephServices,
	ZephService,
	ZephUtils
};
