if (!window.customElements || !window.ShadowRoot) {
	/* eslint-disable no-console */
	console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
	/* eslint-enable no-console */
}

const $CONTEXT = Symbol('ZephContext');
const $SHADOW = Symbol('ZephShadowRoot');
const $VALUES = Symbol('ZephValues');
const $CHANGES = Symbol('ZephChanges');
const $ATTRIBUTES = Symbol("ZephAttrbitues");

const READY = true;

(function AttributeOverloader() {
	const proto = (HTMLElement as any).__proto__.prototype;

	const origSetAttribute = proto.setAttribute;
	const origGetAttribute = proto.getAttribute;
	
	proto.setAttribute = function(name:string, value:any) {
		Check.string(name,'name');
		Check.not.empty(name,'name');
	
		this[$ATTRIBUTES] = this[$ATTRIBUTES] || {};
		this[$ATTRIBUTES][name] = value;
	
		return origSetAttribute.call(this, name, value);
	};
	
	proto.getAttribute = function(name:string, preventCoercion = false) {
		Check.string(name,'name');
		Check.not.empty(name,'name');
	
		if (preventCoercion && this[$ATTRIBUTES] && this[$ATTRIBUTES][name] !== undefined) return this[$ATTRIBUTES][name];
		return origGetAttribute.call(this, name);
	};
})();	

class Check {
	static not = {
		// throw an exception if arg is undefined.
		undefined(arg: any, name: string): void {
			if (arg === undefined) throw new Error("Undefined " + name + ".");
		},

		// throw an exception if arg is null.
		null(arg: any, name: string): void {
			if (arg === null) throw new Error("Null " + name + ".");
		},

		// throw an exception if arg is undefined or null.
		uon(arg: any, name: string): void {
			Check.not.undefined(arg, name);
			Check.not.null(arg, name);
		},

		// throw an exception if arg is a string and it is empty.
		empty(arg: any, name: string): void {
			if (typeof arg === "string" && arg === "") throw new Error("Empty " + name + ".");
		},
	}

	// throw an exception if arg is not of the given type (via typeof).
	static type(arg: any, type: string, name: string): void {
		if (typeof arg !== type) throw new Error("Invalid " + name + "; must be a " + type + ".");
	}

	// throw an exception if arg is not a string.
	static string(arg: any, name: string): void {
		Check.type(arg, "string", name);
	}

	// throw an exception if arg is undefined or null, not a string, or empty.
	static posstr(arg: any, name: string): void {
		Check.not.uon(arg, name);
		Check.string(arg, name);
		Check.not.empty(arg, name);
	}

	// throw an exception if arg is not a number.
	static number(arg: any, name: string): void {
		Check.type(arg, "number", name);
	}

	// throw an exception if arg is not a boolean.
	static boolean(arg: any, name: string): void {
		Check.type(arg, "boolean", name);
	}

	// throw an exception if arg is not a function.
	static function(arg: any, name: string): void {
		if (!(arg instanceof Function)) throw new Error("Invalid " + name + "; must be a Function.");
	}

	// throw an exception if arg is not an array.
	static array(arg: any, type: string, name: string): void {
		if (!(arg instanceof Array)) throw new Error("Invalid " + name + "; must be an Array.");
	}
}

class Utils {
	constructor() {
		throw new Error('Singleton. Do not instantiate.');
	}

	static ready(): boolean {
		return READY;
	}

	static tryprom<T>(f: Function): Promise<T> {
		Check.not.uon(f, "argument");
		Check.function(f, "argument");

		return new Promise((resolve, reject) => {
			try {
				f(resolve, reject);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	static exists(url: string, options = {}): Promise<boolean> {
		if (url === undefined || url === null || url === "") return Promise.resolve(false);

		options = Object.assign({}, options, {
			method: "HEAD"
		});

		return Utils.tryprom(async (resolve: Function) => {
			let response = await fetch(url, options);
			if (response.ok) resolve(true);
			else resolve(false);
		});
	}

	static fetch(url: string, options = {}): Promise<any> {
		Check.not.uon(url, "url");
		Check.not.empty(url, "url");

		return Utils.tryprom(async (resolve: Function) => {
			let response = await fetch(url, options);
			if (response.ok) return resolve(response);
			resolve(undefined);
		});
	}

	static fetchText(url: string, options = {}): Promise<string> {
		Check.not.uon(url, "url");
		Check.not.empty(url, "url");

		return Utils.tryprom(async (resolve: Function) => {
			let response: any = await Utils.fetch(url, options);
			if (!response) resolve(undefined);

			let text = await response.text();
			resolve(text);
		});
	}

	static fetchBinary(url: string, options = {}): Promise<Buffer> {
		Check.not.uon(url, "url");
		Check.not.empty(url, "url");

		return Utils.tryprom(async (resolve: Function) => {
			let response: any = await Utils.fetch(url, options);
			if (!response) resolve(undefined);

			let contentType = response.headers && response.headers.get("Content-Type") || null;

			let data = await response.arrayBuffer();
			resolve({ data, contentType });
		});
	}
	static resolve(url: string | URL, base = document.URL): string | null {
		Check.not.uon(url, "url");
		Check.not.empty(url, "url");

		if (!(url instanceof URL) && typeof url !== "string") throw new Error("Invalid url; must be a string or URL.");

		try {
			if (typeof url === "string" && url.startsWith("data:")) return "" + new URL(url);
			return "" + new URL(url, base);
		}
		catch (ex) {
			return null;
		}
	}

	static resolveName(url: string | URL, base = document.URL, extension = ".js"): Promise<null | string> {
		let urlstr = "" + url;
		if (urlstr.match(/^data:/)) return Promise.resolve("" + new URL(url));
		if (!urlstr.match(/^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//)) return Promise.resolve(null);

		if (url instanceof URL) url = "" + url;

		return Utils.tryprom(async (resolve: Function) => {
			let resolved = Utils.resolve(url, base);
			if (!resolved) return null;
			resolved = "" + resolved;

			if (await Utils.exists(resolved)) return resolve(resolved);

			if (extension) {
				let extended = url + extension;
				let resolveExtended = Utils.resolve(extended, base);
				if (!resolveExtended) return resolve(null);
				if (await Utils.exists(resolveExtended)) return resolve(resolveExtended);

				if (await Utils.exists(extended)) return resolve(extended);
			}

			resolve(undefined);
		});
	}

	static parseDataURL(url: URL) {
		Check.not.uon(url, "url");
		if (!(url instanceof URL)) throw new Error("Invalid url.");
		if (url.protocol !== "data:") return null;
		if (!url.href) return null;

		let match = url.href.match(/^data:([^;]+)(([^;]+;)?;base64)?,(.*)$/);
		let contentType = match && match[1] || "";
		let data = match && match[4] || null;
		return {
			contentType,
			data
		};
	}
}

type ZephContextEventType = {
	eventType: string,
	selector: string,
	handler: Function;
}

class ZephContext {
	static contextify(target: any) {
		let context = target[$CONTEXT] || target.prototype && target.prototype[$CONTEXT] || target.__proto__ && target.__proto__[$CONTEXT];
		context = target[$CONTEXT] = context || new ZephContext();
		return context;
	}

	name = null;
	html = null;
	attributes: Record<string, any> = {};
	properties: Record<string, boolean> = {};
	onCreate: Function[] = []
	onAdd: Function[] = []
	onRemove: Function[] = []
	onAdopt: Function[] = []
	onEvent: ZephContextEventType[] = [];
	onEventHandlers: Record<string,Function> = {};

	public constructor() {
	}

	public instantiate(element: any) {
		this.applyStyle(element);
		this.applyContent(element);
		this.applyAttributes(element);
		this.applyProperties(element);
		this.applyOnEventHandlers(element);
	}

	private createGetterSetter(element: any, propName: string, value: any = undefined, changeHandler?: (element: any, propName: string, value: any) => void) {
		const values = element[$VALUES] = element[$VALUES] || {};
		values[propName] = value;

		const changes = element[$CHANGES] = element[$CHANGES] || [];
		if (changeHandler && changeHandler instanceof Function) changes.push(changeHandler);

		let descriptor: any = Object.getOwnPropertyDescriptor(element, propName);
		if (!descriptor[$CONTEXT]) {
			descriptor = {
				configurable: true,
				enumerable: true,
				get: () => {
					return values[propName];
				},
				set: function (value: any) {
					const changes:any[] = this[$CHANGES] || [];
					values[propName] = value;
					(changes || []).forEach(changeHandler => changeHandler(element, propName, value));
				},
			};
		}
		// we dont store anything in context, but we need to know the descriptor was set by us.
		descriptor[$CONTEXT] = true;

		// const existing = Object.getOwnPropertyDescriptor(element,propName);
		Object.defineProperty(element, propName, descriptor);
	}

	private async applyStyle(element: any) {
		if (!element) return;

		const context = element[$CONTEXT];
		if (!context) return;
		if (!context.css) return;

		if (context.css instanceof Promise) {
			await context.css;
		}

		const shadow = element[$SHADOW];

		let clone = context.css.template.content.cloneNode(true);

		if (shadow) {
			[...shadow.childNodes].forEach((child: any) => {
				if (child.tagName === 'STYLE') child.remove();
			})
			shadow.appendChild(clone);
		}
		else {
			[...element.childNodes].forEach((child: any) => {
				if (child.tagName === 'STYLE') child.remove();
			})
			element.appendChild(clone);
		}
	}

	private async applyContent(element: any) {
		if (!element) return;

		const context = element[$CONTEXT];
		if (!context) return;
		if (!context.html) return;

		if (context.html instanceof Promise) {
			await context.html;
		}

		const shadow = element[$SHADOW];

		let clone = context.html.template.content.cloneNode(true);

		if (shadow) {
			[...shadow.childNodes].forEach((child: any) => {
				if (child.tagName !== 'STYLE') child.remove();
			})
			shadow.appendChild(clone);
		}
		else {
			[...element.childNodes].forEach((child: any) => {
				if (child.tagName !== 'STYLE') child.remove();
			})
			element.appendChild(clone);
		}
	}

	private applyAttributes(element: any) {
		Object.keys(this.attributes).forEach((attrName: string) => {
			const propName: string = this.attributes[attrName];

			const existingPropValue = element[propName];
			const existingAttrValue = element.getAttribute(attrName);
			let value = existingPropValue;
			if (existingAttrValue !== undefined && existingAttrValue !== null) value = existingAttrValue;

			const changeHandler = (element: any, changePropName: string, value: any) => {
				if (propName !== changePropName) return;

				if (value === null || value === undefined) element.removeAttribute(attrName);
				else element.setAttribute(attrName, value);
			};

			this.createGetterSetter(element, propName, value, changeHandler);

			changeHandler(element, propName, value);
		});
	}

	private applyProperties(element: any) {
		Object.keys(this.properties).forEach((propName: string) => {
			const existingPropValue = element[propName];
			const value = existingPropValue;

			this.createGetterSetter(element, propName, value);
		});
	}

	private applyOnEventHandlers(element: any) {
		this.onEvent.forEach(({eventType,selector,handler}) => {
			const e = selector && element && element.querySelector(selector) || element || null;
			e.addEventListener(eventType,(event:Event)=>{
				try {
					handler.call(element,event,e);
				} catch (ex) {
					console.error(ex);
				}
			});
		});

	}

	public executeOnCreate(element: any, shadowRoot: any) {
		this.onCreate.forEach((handler:Function)=>{
			try {
				handler.call(element, element);
			} catch (ex) {
				console.error(ex);
			}
		});
	}

	public executeOnAdd(element:any, shadowRoot:any) {
		this.onAdd.forEach((handler:Function)=>{
			try {
				handler.call(element, element);
			} catch (ex) {
				console.error(ex);
			}
		});
	}

	public executeOnRemove(element: any, shadowRoot: any) {
		this.onRemove.forEach((handler:Function)=>{
			try {
				handler.call(element, element);
			} catch (ex) {
				console.error(ex);
			}
		});
	}

	public executeOnAdopt(element: any, shadowRoot: any) {
		this.onAdopt.forEach((handler:Function)=>{
			try {
				handler.call(element, element);
			} catch (ex) {
				console.error(ex);
			}
		});
	}

}

function Zeph(name?: string): any {
	return function (ctor: any) {
		const elementName = name || null;
		if (!elementName) throw new Error('ZephJS Components must have a name and it must have a dash character. Please provide the name via the @zeph(<name>) argument.');
		if (elementName.indexOf("-") < 0) throw new Error('ZephJS Component must have a dash character in their element names. This is required, by the underlying WebComponents customElements.define call.');

		if (!(ctor instanceof HTMLElement) && !(ctor.prototype instanceof HTMLElement)) throw new Error('ZephJS Components must extend HTML or a child that extends HTLMElement.')

		const context = ZephContext.contextify(ctor as any);
		context.elementName = elementName;
		context.parentClass = ctor;

		const elementClass: any = class ZephElement extends (ctor as any) {
			static get observedAttributes(): string[] {
				return Object.keys(context && context.attributes || {});
			}

			constructor() {
				super();

				// element exist as this. populate it.

				const element = (this as any);

				let shadow = null;
				if (!context.disableShadowRoot) {
					shadow = element.shadowRoot || element.attachShadow({
						mode: "open"
					});
				}
				element[$CONTEXT] = context;
				element[$SHADOW] = shadow;

				// instantiate our`
				context.instantiate(element);

				// fire onCreate events
				context.executeOnCreate(element);

				return element;
			}

			connectedCallback() {
				const context = ZephContext.contextify(this);
				const shadow = (this as any)[$SHADOW];
				context.executeOnAdd(this,shadow);
			}

			disconnectedCallback() {
				const context = ZephContext.contextify(this);
				const shadow = (this as any)[$SHADOW];
				context.executeOnRemove(this, shadow);
			}

			adoptedCallback() {
				const context = ZephContext.contextify(this);
				const shadow = (this as any)[$SHADOW];
				context.executeOnAdopt(this, shadow);
			}
			
			attributeChangedCallback(attributeName:string, oldValue:any, newValue:any) {
				console.log(3,attributeName);
				const context = ZephContext.contextify(this);
				const propName = (context.attributes || {})[attributeName] || attributeName;
				const value = this.getAttribute(attributeName,true) || newValue;
				// if (this[propName]!==newValue) this[propName] = value;
			}
		}

		elementClass[$CONTEXT] = context;
		context.elementClass = elementClass;

		window.customElements.define(elementName, elementClass);

		return elementClass;
	}
}

function Html(content: string, options?: any): any {
	options = Object.assign({
		noRemote: false
	}, options || {});

	return function (ctor: any): any {
		const context = ZephContext.contextify(ctor);

		if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
			try {
				const prom = Utils.tryprom(async (resolve: Function) => {
					let url = await Utils.resolveName(content, context.origin || document.URL.toString(), ".html");
					if (url) content = await Utils.fetchText(url);

					let template = document.createElement("template");
					template.innerHTML = content;

					context.html = { template, options };

					resolve();
				});
				context.html = prom;
			} catch (err) {
				console.error("Unable to resolve or otherwise load '" + content + "'.", err);
			}
		}
		else {
			let template = document.createElement("template");
			template.innerHTML = content;

			context.html = { template, options };
		}

		return ctor;
	};
}

function Css(content: string, options?: any): any {
	options = Object.assign({
		noRemote: false
	}, options || {});

	return function (ctor: any): any {
		const context = ZephContext.contextify(ctor);

		if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
			try {
				const prom = Utils.tryprom(async (resolve: Function) => {
					let url = await Utils.resolveName(content, context.origin || document.URL.toString(), ".css");
					if (url) content = await Utils.fetchText(url);

					let template = document.createElement("template");
					template.innerHTML = "<style>\n" + content + "\n</style>";

					context.css = { template, options };

					resolve();
				});
				context.css = prom;
			} catch (err) {
				console.error("Unable to resolve or otherwise load '" + content + "'.", err);
			}
		}
		else {
			let template = document.createElement("template");
			template.innerHTML = "<style>\n" + content + "\n</style>";

			context.css = { template, options };
		}

		return ctor;
	};
}

function Attribute(target: any, name?: string): any {
	if (!target) throw new Error('Zeph @attribute decorator can not be called with emtpy arguments. Call it without the parenthesis, or provide the name as the sole argument.');
	const attrFunc = function (attrName: string, target: any, propName: string): void {
		const context = ZephContext.contextify(target);

		context.attributes = context.attributes || {};
		if (context.attributes[attrName]) throw new Error("Zeph @attribute decorator of the name '" + attrName + "' is already in use.");

		context.attributes[attrName] = propName;
	}

	if (typeof target === 'string') {
		return (attrFunc as any).bind(null, target);
	}
	else {
		attrFunc("" + name, target, "" + name);
	}
}

function Property(target: any, name?: string): any {
	if (!target) throw new Error('Zeph @property decorator can not be called with emtpy arguments. Call it without the parenthesis, or provide the name as the sole argument.');
	const propFunc = function (attrName: string, target: any, propName: string): void {
		const context = ZephContext.contextify(target);

		context.properties = context.properties || {};
		if (context.properties[attrName]) throw new Error("Zeph @property decorator of the name '" + attrName + "' is already in use.");

		context.properties[attrName] = propName;
	}

	if (typeof target === 'string') {
		return (propFunc as any).bind(null, target);
	}
	else {
		propFunc("" + name, target, "" + name);
	}
}

function onCreate(target: any = null, name: string = ""): any {
	const createFunc = function (target: any, name: string): void {
		if (!name) throw new Error('ZephJS @onCreate must be called on a method.');

		const handler = target[name];
		if (!handler || !(handler instanceof Function)) throw new Error('ZephJS @onCreate must be called on a method.');

		const context = ZephContext.contextify(target);

		context.onCreate = context.onCreate || [];
		context.onCreate.push(handler)
	}

	if (target) return createFunc(target,name);
	else return createFunc;
}

function onAdd(target: any = null, name: string = ""): any {
	const addFunc = function (target: any, name: string): void {
		if (!name) throw new Error('ZephJS @onAdd must be called on a method.');

		const handler = target[name];
		if (!handler || !(handler instanceof Function)) throw new Error('ZephJS @onAdd must be called on a method.');

		const context = ZephContext.contextify(target);

		context.onAdd = context.onAdd || [];
		context.onAdd.push(handler)
	}

	if (target) return addFunc(target, name);
	else return addFunc;
}

function onRemove(target: any = null, name: string = ""): any {
	const removeFunc = function (target: any, name: string): void {
		if (!name) throw new Error('ZephJS @onRemove must be called on a method.');

		const handler = target[name];
		if (!handler || !(handler instanceof Function)) throw new Error('ZephJS @onRemove must be called on a method.');

		const context = ZephContext.contextify(target);

		context.onRemove = context.onRemove || [];
		context.onRemove.push(handler)
	}

	if (target) return removeFunc(target, name);
	else return removeFunc;
}

function onAdopt(target: any = null, name: string = ""): any {
	const adoptFunc = function (target: any, name: string): void {
		if (!name) throw new Error('ZephJS @onAdopt must be called on a method.');

		const handler = target[name];
		if (!handler || !(handler instanceof Function)) throw new Error('ZephJS @onAdopt must be called on a method.');

		const context = ZephContext.contextify(target);

		context.onAdopt = context.onAdopt || [];
		context.onAdopt.push(handler)
	}

	if (target) return adoptFunc(target, name);
	else return adoptFunc;
}

function onEvent(target:any = null, methodName: string = "", eventType: any = null, selector: string = ""): any {
	if (typeof eventType!=='string') eventType = "click";
	if (!selector) selector = "";

	const eventFunc = function (target: any, methodName:string): void {
		const context = ZephContext.contextify(target);

		const handler = target[methodName]

		context.onEvent = context.onEvent || [];
		context.onEvent.push({
			eventType,
			selector,
			handler,
		});
	}

	if (typeof target==="string") return eventFunc;
	else return eventFunc(target,methodName);
}

export { Zeph, Zeph as ZEPH, Zeph as zeph };
export { Html, Html as HTML, Html as html };
export { Css, Css as CSS, Css as css };
export { Attribute, Attribute as ATTRIBUTE, Attribute as attribute, Attribute as Attr, Attribute as ATTR, Attribute as attr };
export { Property, Property as PROPERTY, Property as property, Property as Prop, Property as PROP, Property as prop };
export { onCreate, onCreate as ONCREATE, onCreate as oncreate };
export { onAdd, onAdd as ONADD, onAdd as onadd };
export { onRemove, onRemove as ONREMOVE, onRemove as onremove };
export { onAdopt, onAdopt as ONADOPT, onAdopt as onadopt };
export { onEvent, onEvent as ONEVENT, onEvent as onevent };


