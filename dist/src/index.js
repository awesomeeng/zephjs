if (!window.customElements || !window.ShadowRoot) {
    /* eslint-disable no-console */
    console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
    /* eslint-enable no-console */
}
const $COMPONENT = Symbol('ZephComponent');
const $SHADOW = Symbol('ShadowRoot');
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
class ZephComponent {
    name = null;
    html = null;
    constructor() {
    }
    async restyle(element) {
        if (!element)
            return;
        const component = element[$COMPONENT];
        if (!component)
            return;
        if (!component.css)
            return;
        if (component.css instanceof Promise) {
            await component.css;
        }
        const shadow = element[$SHADOW];
        let clone = component.css.template.content.cloneNode(true);
        if (shadow) {
            console.log(1);
            [...shadow.childNodes].forEach((child) => {
                console.log(2, child.tagName, child);
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
    async repaint(element) {
        if (!element)
            return;
        const component = element[$COMPONENT];
        if (!component)
            return;
        if (!component.html)
            return;
        if (component.html instanceof Promise) {
            await component.html;
        }
        const shadow = element[$SHADOW];
        let clone = component.html.template.content.cloneNode(true);
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
}
function Zeph(name) {
    return function (ctor) {
        const elementName = name || ctor.name || null;
        if (!elementName)
            throw new Error('Unable to figure our the name for this component. Please provide the name via the @zeph(<name>) argument, or provided a class name.');
        const component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        component.elementName = elementName;
        component.parentClass = ctor;
        const elementClass = class ZephElement extends ctor {
            constructor() {
                super();
                // element exist as this. populate it.
                const element = this;
                element[$COMPONENT] = component;
                let shadow = null;
                if (!component.disableShadowRoot) {
                    shadow = this.shadowRoot || this.attachShadow({
                        mode: "open"
                    });
                }
                element[$SHADOW] = shadow;
                component.restyle(this);
                component.repaint(this);
            }
        };
        elementClass[$COMPONENT] = component;
        component.elementClass = elementClass;
        window.customElements.define(elementName, elementClass);
        return elementClass;
    };
}
function Html(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        const component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                const prom = Utils.tryprom(async (resolve) => {
                    let url = await Utils.resolveName(content, component.origin || document.URL.toString(), ".html");
                    if (url)
                        content = await Utils.fetchText(url);
                    let template = document.createElement("template");
                    template.innerHTML = content;
                    component.html = { template, options };
                    resolve();
                });
                component.html = prom;
            }
            catch (err) {
                console.error("Unable to resolve or otherwise load '" + content + "'.", err);
            }
        }
        else {
            let template = document.createElement("template");
            template.innerHTML = content;
            component.html = { template, options };
        }
    };
}
function Css(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        const component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                const prom = Utils.tryprom(async (resolve) => {
                    let url = await Utils.resolveName(content, component.origin || document.URL.toString(), ".css");
                    if (url)
                        content = await Utils.fetchText(url);
                    let template = document.createElement("template");
                    template.innerHTML = "<style>\n" + content + "\n</style>";
                    component.css = { template, options };
                    resolve();
                });
                component.css = prom;
            }
            catch (err) {
                console.error("Unable to resolve or otherwise load '" + content + "'.", err);
            }
        }
        else {
            let template = document.createElement("template");
            template.innerHTML = "<style>\n" + content + "\n</style>";
            component.css = { template, options };
            // component.regenerateHTML(component);
        }
    };
}
export { Zeph, Zeph as ZEPH, Zeph as zeph };
export { Html, Html as HTML, Html as html };
export { Css, Css as CSS, Css as css };