if (!window.customElements || !window.ShadowRoot) {
    /* eslint-disable no-console */
    console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
    /* eslint-enable no-console */
}
const $CONTEXT = Symbol('ZephContext');
const $SHADOW = Symbol('ZephShadowRoot');
const $VALUES = Symbol('ZephValues');
const $CHANGES = Symbol('ZephChanges');
const READY = true;
class Check {
    static not = {
        // throw an exception if arg is undefined.
        undefined(arg, name) {
            if (arg === undefined)
                throw new Error("Undefined " + name + ".");
        },
        // throw an exception if arg is null.
        null(arg, name) {
            if (arg === null)
                throw new Error("Null " + name + ".");
        },
        // throw an exception if arg is undefined or null.
        uon(arg, name) {
            Check.not.undefined(arg, name);
            Check.not.null(arg, name);
        },
        // throw an exception if arg is a string and it is empty.
        empty(arg, name) {
            if (typeof arg === "string" && arg === "")
                throw new Error("Empty " + name + ".");
        },
    };
    // throw an exception if arg is not of the given type (via typeof).
    static type(arg, type, name) {
        if (typeof arg !== type)
            throw new Error("Invalid " + name + "; must be a " + type + ".");
    }
    // throw an exception if arg is not a string.
    static string(arg, name) {
        Check.type(arg, "string", name);
    }
    // throw an exception if arg is undefined or null, not a string, or empty.
    static posstr(arg, name) {
        Check.not.uon(arg, name);
        Check.string(arg, name);
        Check.not.empty(arg, name);
    }
    // throw an exception if arg is not a number.
    static number(arg, name) {
        Check.type(arg, "number", name);
    }
    // throw an exception if arg is not a boolean.
    static boolean(arg, name) {
        Check.type(arg, "boolean", name);
    }
    // throw an exception if arg is not a function.
    static function(arg, name) {
        if (!(arg instanceof Function))
            throw new Error("Invalid " + name + "; must be a Function.");
    }
    // throw an exception if arg is not an array.
    static array(arg, type, name) {
        if (!(arg instanceof Array))
            throw new Error("Invalid " + name + "; must be an Array.");
    }
}
class Utils {
    constructor() {
        throw new Error('Singleton. Do not instantiate.');
    }
    static ready() {
        return READY;
    }
    static tryprom(f) {
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
    static exists(url, options = {}) {
        if (url === undefined || url === null || url === "")
            return Promise.resolve(false);
        options = Object.assign({}, options, {
            method: "HEAD"
        });
        return Utils.tryprom(async (resolve) => {
            let response = await fetch(url, options);
            if (response.ok)
                resolve(true);
            else
                resolve(false);
        });
    }
    static fetch(url, options = {}) {
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(async (resolve) => {
            let response = await fetch(url, options);
            if (response.ok)
                return resolve(response);
            resolve(undefined);
        });
    }
    static fetchText(url, options = {}) {
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(async (resolve) => {
            let response = await Utils.fetch(url, options);
            if (!response)
                resolve(undefined);
            let text = await response.text();
            resolve(text);
        });
    }
    static fetchBinary(url, options = {}) {
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(async (resolve) => {
            let response = await Utils.fetch(url, options);
            if (!response)
                resolve(undefined);
            let contentType = response.headers && response.headers.get("Content-Type") || null;
            let data = await response.arrayBuffer();
            resolve({ data, contentType });
        });
    }
    static resolve(url, base = document.URL) {
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        if (!(url instanceof URL) && typeof url !== "string")
            throw new Error("Invalid url; must be a string or URL.");
        try {
            if (typeof url === "string" && url.startsWith("data:"))
                return "" + new URL(url);
            return "" + new URL(url, base);
        }
        catch (ex) {
            return null;
        }
    }
    static resolveName(url, base = document.URL, extension = ".js") {
        let urlstr = "" + url;
        if (urlstr.match(/^data:/))
            return Promise.resolve("" + new URL(url));
        if (!urlstr.match(/^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//))
            return Promise.resolve(null);
        if (url instanceof URL)
            url = "" + url;
        return Utils.tryprom(async (resolve) => {
            let resolved = Utils.resolve(url, base);
            if (!resolved)
                return null;
            resolved = "" + resolved;
            if (await Utils.exists(resolved))
                return resolve(resolved);
            if (extension) {
                let extended = url + extension;
                let resolveExtended = Utils.resolve(extended, base);
                if (!resolveExtended)
                    return resolve(null);
                if (await Utils.exists(resolveExtended))
                    return resolve(resolveExtended);
                if (await Utils.exists(extended))
                    return resolve(extended);
            }
            resolve(undefined);
        });
    }
    static parseDataURL(url) {
        Check.not.uon(url, "url");
        if (!(url instanceof URL))
            throw new Error("Invalid url.");
        if (url.protocol !== "data:")
            return null;
        if (!url.href)
            return null;
        let match = url.href.match(/^data:([^;]+)(([^;]+;)?;base64)?,(.*)$/);
        let contentType = match && match[1] || "";
        let data = match && match[4] || null;
        return {
            contentType,
            data
        };
    }
}
class ZephContext {
    static contextify(target) {
        let context = target[$CONTEXT] || target.prototype && target.prototype[$CONTEXT] || target.__proto__ && target.__proto__[$CONTEXT];
        context = target[$CONTEXT] = context || new ZephContext();
        return context;
    }
    name = null;
    html = null;
    attributes = {};
    properties = {};
    onCreate = [];
    onAdd = [];
    onRemove = [];
    onAdopt = [];
    onEvent = [];
    onEventHandlers = {};
    constructor() {
    }
    instantiate(element) {
        this.applyStyle(element);
        this.applyContent(element);
        this.applyAttributes(element);
        this.applyProperties(element);
        this.applyOnEventHandlers(element);
    }
    createGetterSetter(element, propName, value = undefined, changeHandler) {
        const values = element[$VALUES] = element[$VALUES] || {};
        values[propName] = value;
        const changes = element[$CHANGES] = element[$CHANGES] || [];
        if (changeHandler && changeHandler instanceof Function)
            changes.push(changeHandler);
        let descriptor = Object.getOwnPropertyDescriptor(element, propName);
        if (!descriptor[$CONTEXT]) {
            descriptor = {
                configurable: true,
                enumerable: true,
                get: () => {
                    return values[propName];
                },
                set: function (value) {
                    const changes = this[$CHANGES] || [];
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
    async applyStyle(element) {
        if (!element)
            return;
        const context = element[$CONTEXT];
        if (!context)
            return;
        if (!context.css)
            return;
        if (context.css instanceof Promise) {
            await context.css;
        }
        const shadow = element[$SHADOW];
        let clone = context.css.template.content.cloneNode(true);
        if (shadow) {
            [...shadow.childNodes].forEach((child) => {
                if (child.tagName === 'STYLE')
                    child.remove();
            });
            shadow.appendChild(clone);
        }
        else {
            [...element.childNodes].forEach((child) => {
                if (child.tagName === 'STYLE')
                    child.remove();
            });
            element.appendChild(clone);
        }
    }
    async applyContent(element) {
        if (!element)
            return;
        const context = element[$CONTEXT];
        if (!context)
            return;
        if (!context.html)
            return;
        if (context.html instanceof Promise) {
            await context.html;
        }
        const shadow = element[$SHADOW];
        let clone = context.html.template.content.cloneNode(true);
        if (shadow) {
            [...shadow.childNodes].forEach((child) => {
                if (child.tagName !== 'STYLE')
                    child.remove();
            });
            shadow.appendChild(clone);
        }
        else {
            [...element.childNodes].forEach((child) => {
                if (child.tagName !== 'STYLE')
                    child.remove();
            });
            element.appendChild(clone);
        }
    }
    applyAttributes(element) {
        Object.keys(this.attributes).forEach((attrName) => {
            const propName = this.attributes[attrName];
            const existingPropValue = element[propName];
            const existingAttrValue = element.getAttribute(attrName);
            let value = existingPropValue;
            if (existingAttrValue !== undefined && existingAttrValue !== null)
                value = existingAttrValue;
            const changeHandler = (element, changePropName, value) => {
                if (propName !== changePropName)
                    return;
                if (value === null || value === undefined)
                    element.removeAttribute(attrName);
                else
                    element.setAttribute(attrName, value);
            };
            this.createGetterSetter(element, propName, value, changeHandler);
            changeHandler(element, propName, value);
        });
    }
    applyProperties(element) {
        Object.keys(this.properties).forEach((propName) => {
            const existingPropValue = element[propName];
            const value = existingPropValue;
            this.createGetterSetter(element, propName, value);
        });
    }
    applyOnEventHandlers(element) {
        this.onEvent.forEach(({ eventType, selector, handler }) => {
            const e = selector && element && element.querySelector(selector) || element || null;
            e.addEventListener(eventType, (event) => {
                try {
                    handler.call(element, event, e);
                }
                catch (ex) {
                    console.error(ex);
                }
            });
        });
    }
    executeOnCreate(element, shadowRoot) {
        this.onCreate.forEach((handler) => {
            try {
                handler.call(element, element);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
    executeOnAdd(element, shadowRoot) {
        this.onAdd.forEach((handler) => {
            try {
                handler.call(element, element);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
    executeOnRemove(element, shadowRoot) {
        this.onRemove.forEach((handler) => {
            try {
                handler.call(element, element);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
    executeOnAdopt(element, shadowRoot) {
        this.onAdopt.forEach((handler) => {
            try {
                handler.call(element, element);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
}
function Zeph(name) {
    return function (ctor) {
        const elementName = name || null;
        if (!elementName)
            throw new Error('ZephJS Components must have a name and it must have a dash character. Please provide the name via the @zeph(<name>) argument.');
        if (elementName.indexOf("-") < 0)
            throw new Error('ZephJS Component must have a dash character in their element names. This is required, by the underlying WebComponents customElements.define call.');
        if (!(ctor instanceof HTMLElement) && !(ctor.prototype instanceof HTMLElement))
            throw new Error('ZephJS Components must extend HTML or a child that extends HTLMElement.');
        const context = ZephContext.contextify(ctor);
        context.elementName = elementName;
        context.parentClass = ctor;
        const elementClass = class ZephElement extends ctor {
            static get observedAttributes() {
                return Object.keys(context && context.attributes || {});
            }
            constructor() {
                super();
                // element exist as this. populate it.
                const element = this;
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
                const shadow = this[$SHADOW];
                context.executeOnAdd(this, shadow);
            }
            disconnectedCallback() {
                const context = ZephContext.contextify(this);
                const shadow = this[$SHADOW];
                context.executeOnRemove(this, shadow);
            }
            adoptedCallback() {
                const context = ZephContext.contextify(this);
                const shadow = this[$SHADOW];
                context.executeOnAdopt(this, shadow);
            }
            attributeChangedCallback(attributeName, oldValue, newValue) {
                const context = ZephContext.contextify(this);
                const propName = (context.attributes || {})[attributeName] || attributeName;
                console.log(1, attributeName, oldValue, newValue);
                const value = this.getAttribute(attributeName, true) || newValue;
                console.log(2, value);
                if (this[propName] !== newValue)
                    this[propName] = newValue;
            }
        };
        elementClass[$CONTEXT] = context;
        context.elementClass = elementClass;
        window.customElements.define(elementName, elementClass);
        return elementClass;
    };
}
function Html(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        const context = ZephContext.contextify(ctor);
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                const prom = Utils.tryprom(async (resolve) => {
                    let url = await Utils.resolveName(content, context.origin || document.URL.toString(), ".html");
                    if (url)
                        content = await Utils.fetchText(url);
                    let template = document.createElement("template");
                    template.innerHTML = content;
                    context.html = { template, options };
                    resolve();
                });
                context.html = prom;
            }
            catch (err) {
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
function Css(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        const context = ZephContext.contextify(ctor);
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                const prom = Utils.tryprom(async (resolve) => {
                    let url = await Utils.resolveName(content, context.origin || document.URL.toString(), ".css");
                    if (url)
                        content = await Utils.fetchText(url);
                    let template = document.createElement("template");
                    template.innerHTML = "<style>\n" + content + "\n</style>";
                    context.css = { template, options };
                    resolve();
                });
                context.css = prom;
            }
            catch (err) {
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
function Attribute(target, name) {
    if (!target)
        throw new Error('Zeph @attribute decorator can not be called with emtpy arguments. Call it without the parenthesis, or provide the name as the sole argument.');
    const attrFunc = function (attrName, target, propName) {
        const context = ZephContext.contextify(target);
        context.attributes = context.attributes || {};
        if (context.attributes[attrName])
            throw new Error("Zeph @attribute decorator of the name '" + attrName + "' is already in use.");
        context.attributes[attrName] = propName;
    };
    if (typeof target === 'string') {
        return attrFunc.bind(null, target);
    }
    else {
        attrFunc("" + name, target, "" + name);
    }
}
function Property(target, name) {
    if (!target)
        throw new Error('Zeph @property decorator can not be called with emtpy arguments. Call it without the parenthesis, or provide the name as the sole argument.');
    const propFunc = function (attrName, target, propName) {
        const context = ZephContext.contextify(target);
        context.properties = context.properties || {};
        if (context.properties[attrName])
            throw new Error("Zeph @property decorator of the name '" + attrName + "' is already in use.");
        context.properties[attrName] = propName;
    };
    if (typeof target === 'string') {
        return propFunc.bind(null, target);
    }
    else {
        propFunc("" + name, target, "" + name);
    }
}
function onCreate(target = null, name = "") {
    const createFunc = function (target, name) {
        if (!name)
            throw new Error('ZephJS @onCreate must be called on a method.');
        const handler = target[name];
        if (!handler || !(handler instanceof Function))
            throw new Error('ZephJS @onCreate must be called on a method.');
        const context = ZephContext.contextify(target);
        context.onCreate = context.onCreate || [];
        context.onCreate.push(handler);
    };
    if (target)
        return createFunc(target, name);
    else
        return createFunc;
}
function onAdd(target = null, name = "") {
    const addFunc = function (target, name) {
        if (!name)
            throw new Error('ZephJS @onAdd must be called on a method.');
        const handler = target[name];
        if (!handler || !(handler instanceof Function))
            throw new Error('ZephJS @onAdd must be called on a method.');
        const context = ZephContext.contextify(target);
        context.onAdd = context.onAdd || [];
        context.onAdd.push(handler);
    };
    if (target)
        return addFunc(target, name);
    else
        return addFunc;
}
function onRemove(target = null, name = "") {
    const removeFunc = function (target, name) {
        if (!name)
            throw new Error('ZephJS @onRemove must be called on a method.');
        const handler = target[name];
        if (!handler || !(handler instanceof Function))
            throw new Error('ZephJS @onRemove must be called on a method.');
        const context = ZephContext.contextify(target);
        context.onRemove = context.onRemove || [];
        context.onRemove.push(handler);
    };
    if (target)
        return removeFunc(target, name);
    else
        return removeFunc;
}
function onAdopt(target = null, name = "") {
    const adoptFunc = function (target, name) {
        if (!name)
            throw new Error('ZephJS @onAdopt must be called on a method.');
        const handler = target[name];
        if (!handler || !(handler instanceof Function))
            throw new Error('ZephJS @onAdopt must be called on a method.');
        const context = ZephContext.contextify(target);
        context.onAdopt = context.onAdopt || [];
        context.onAdopt.push(handler);
    };
    if (target)
        return adoptFunc(target, name);
    else
        return adoptFunc;
}
function onEvent(target = null, methodName = "", eventType = null, selector = "") {
    if (typeof eventType !== 'string')
        eventType = "click";
    if (!selector)
        selector = "";
    const eventFunc = function (target, methodName) {
        const context = ZephContext.contextify(target);
        const handler = target[methodName];
        context.onEvent = context.onEvent || [];
        context.onEvent.push({
            eventType,
            selector,
            handler,
        });
    };
    if (typeof target === "string")
        return eventFunc;
    else
        return eventFunc(target, methodName);
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
