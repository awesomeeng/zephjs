// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/**
 * ZephJS is an easy, understandable, and ultra-light framework for
 * defining and using Web Components. It is perfect for people writing
 * component libraries, teams building applications or sites that just
 * require a few custom components, or projects building whole applications
 * that do not want all the weight of a modern JavaScript Browser framework.
 * ZephJS simplifies the process of defining custom Web Components into a
 * declarative highly readable structure that uses standard JavaScript,
 * standard HTML markup, and standard CSS Styling.
 *
 * ZephJS is often called just "Zeph" and pronounced "Zef".
 *
 * ZephJS is copyright 2018-present by The Awesome Engineering Company.
 * It is publically available under the MIT licenese as described
 * in the LICENSE file.
 */

if (!window.customElements || !window.ShadowRoot || !document.body.attachShadow) {
	/* eslint-disable no-console */
	console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
	/* eslint-enable no-console */
}

// Define Symbols for usage on various objects below
// Sometimes we reuse these symbols on different objects
// for different purposes, but always of a similar nature.
const $COMPONENTS = Symbol("components");
const $CONTEXT = Symbol("context");
const $CODE = Symbol("code");
const $ELEMENT = Symbol("element");
const $SHADOW = Symbol("shadow");
const $OBSERVER = Symbol("observer");
const $LISTENERS = Symbol("listeners");
const $PROXY = Symbol("proxy");

// Top level variables used by ZephJS but not exposed
let CODE_CONTEXT = null;
let DEFINITION_METHODS = null;
let PENDING = {};
let FIREREADY = null;
let READY = false;

// An identity function which returns exactly what is passed to it.
const IDENTITY_FUNCTION = (x)=>{ return x; };

// The check methods are quick usage functions for testing
// if certain type conditions are met and throwing an exception
// if not.  For example check.not.uon(x) will throw an exception
// if x is undefined or null.
const check = {
	not: {
		// throw an exception if arg is undefined.
		undefined: (arg,name)=>{
			if (arg===undefined) throw new Error("Undefined "+name+".");
		},
		// throw an exception if arg is null.
		null: (arg,name)=>{
			if (arg===null) throw new Error("Null "+name+".");
		},
		// throw an exception if arg is undefined or null.
		uon: (arg,name)=>{
			check.not.undefined(arg,name);
			check.not.null(arg,name);
		},
		// throw an exception if arg is a string and it is empty.
		empty: (arg,name)=>{
			if (typeof arg==="string" && arg==="") throw new Error("Empty "+name+".");
		}
	},
	// throw an exception if arg is not of the given type (via typeof).
	type: (arg,type,name)=>{
		if (typeof arg!==type) throw new Error("Invalid "+name+"; must be a "+type+".");
	},
	// throw an exception if arg is not a string.
	string: (arg,name)=>{
		check.type(arg,"string",name);
	},
	// throw an exception if arg is undefined or null, not a string, or empty.
	posstr: (arg,name)=>{
		check.not.uon(arg,name);
		check.string(arg,name);
		check.not.empty(arg,name);
	},
	// throw an exception if arg is not a number.
	number: (arg,name)=>{
		check.type(arg,"number",name);
	},
	// throw an exception if arg is not a boolean.
	boolean: (arg,name)=>{
		check.type(arg,"string",name);
	},
	// throw an exception if arg is not a function.
	function: (arg,type,name)=>{
		if (!(arg instanceof Function)) throw new Error("Invalid "+name+"; must be a Function.");
	},
	// throw an exception if arg is not an array.
	array: (arg,type,name)=>{
		if (!(arg instanceof Array)) throw new Error("Invalid "+name+"; must be an Array.");
	}
};

/**
 * @summary
 *
 * Common utilities for working with ZephJS.
 *
 * @alias ZephUtils
 * @namespace
 *
 */
const utils = {
	/**
	 * Returns true if ZephJS is in the "ready" state. ZephJS is in the "ready"
	 * state if ZephJS is loaded and all ZephComponents.define() methods are
	 * believed to be complete.
	 *
	 * @return {boolean}
	 */
	ready: ()=>{
		return READY;
	},

	/**
	 * A utility function to execute the given function f in the context of a
	 * nice clean try/catch block. This really is here just to save a bunch of
	 * characters in ZephJS when minimized.
	 *
	 * @param  {Function} f
	 * @return {Promise}
	 */
	tryprom: (f)=>{
		check.not.uon(f,"argument");
		check.function(f,"argument");

		return new Promise((resolve,reject)=>{
			try {
				f(resolve,reject);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	},

	/**
	 * Performs a HEAD fetch request to determine if a given URL "exists". Returns
	 * a promise that will resolve to true or false depending on the result.
	 *
	 * @param  {URL} url
	 * @return {Promise}
	 */
	exists: (url)=>{
		if (url===undefined || url===null || url==="") return Promise.resolve(false);

		return utils.tryprom(async (resolve)=>{
			let response = await fetch(url,{
				method: "HEAD"
			});
			if (response.ok) resolve(true);
			else resolve(false);
		});
	},

	/**
	 * A simplified fetch wrapper.
	 *
	 * @param  {URL} url
	 * @return {Promise}
	 */
	fetch: (url)=>{
		check.not.uon(url,"url");
		check.not.empty(url,"url");

		return utils.tryprom(async (resolve)=>{
			let response = await fetch(url);
			if (response.ok) return resolve(response);
			resolve(undefined);
		});
	},

	/**
	 * Fetch but also resolves the content as plaintext. Useful for reading
	 * HTML and CSS files.
	 *
	 * @param  {URL} url
	 * @return {Promise}
	 */
	fetchText: (url)=>{
		check.not.uon(url,"url");
		check.not.empty(url,"url");

		return utils.tryprom(async (resolve)=>{
			let response = await utils.fetch(url);
			if (!response) resolve(undefined);

			let text = await response.text();
			resolve(text);
		});
	},

	/**
	 * Fetch but also resolves the content as binary. Useful for reading
	 * Images, audio, video, etc. Returns an object which contains the data
	 * and the contentType.
	 *
	 * @param  {URL} url
	 * @return {Promise}
	 */
	fetchBinary: (url)=>{
		check.not.uon(url,"url");
		check.not.empty(url,"url");

		return utils.tryprom(async (resolve)=>{
			let response = await utils.fetch(url);
			if (!response) resolve(undefined);

			let contentType = response.headers && response.headers.get("Content-Type") || null;

			let data = await response.arrayBuffer();
			resolve({data,contentType});
		});
	},

	/**
	 * Given some URL resolves it against a base url to ensure correct pathing.
	 *
	 * @param  {URL} url
	 * @param  {URL} [base=document.URL]
	 * @return {URL}
	 */
	resolve: (url,base=document.URL)=>{
		check.not.uon(url,"url");
		check.not.empty(url,"url");

		if (!(url instanceof URL) && typeof url!=="string") throw new Error("Invalid url; must be a string or URL.");

		try {
			if (typeof url==="string" && url.startsWith("data:")) return new URL(url);
			return new URL(url,base);
		}
		catch (ex) {
			return null;
		}
	},

	/**
	 * Given a simple name, resolve it against a base URL and then
	 * find out if it exists or not.  ZephJS uses this to determine where
	 * something are located.  This can produce upwards of four separate
	 * network requests.  However, ZephJS only tries that if absolutely
	 * necessary.
	 *
	 * @param  {URL} url
	 * @param  {URL} [base=document.URL]
	 * @param  {String} [extension=".js"]
	 * @return {Promise}
	 */
	resolveName(url,base=document.URL,extension=".js") {
		let urlstr = ""+url;
		if (urlstr.match(/^data:/)) return Promise.resolve(new URL(url));
		if (!urlstr.match(/^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//)) return Promise.resolve(undefined);

		return utils.tryprom(async (resolve)=>{
			let resolved = utils.resolve(url,base);
			if (await utils.exists(resolved)) return resolve(resolved);

			if (await utils.exists(url)) return resolve(url);

			if (extension) {
				let extended = url+extension;
				let resolvedextended = utils.resolve(extended,base);
				if (await utils.exists(resolvedextended)) return resolve(resolvedextended);

				if (await utils.exists(extended)) return resolve(extended);
			}

			resolve(undefined);
		});
	},

	/**
	 * Given some data: url this function returns the contentType and data
	 * from that url.
	 *
	 * @param  {URL} url
	 * @return {Object}
	 */
	parseDataURL(url) {
		check.not.uon(url,"url");
		if (!(url instanceof URL)) throw new Error("Invalid url.");
		if (url.protocol!=="data:") return null;
		if (!url.href) return null;

		let match = url.href.match(/^data:([^;]+)(([^;]+;)?;base64)?,(.*)$/);
		let contentType = match && match[1] || "";
		let data = match && match[4] || null;
		return {
			contentType,
			data
		};
	}
};

/**
 * @summary
 *
 * ZephJS's representation of a component and all its descriptive metadata.
 * This include the component name, its origin, the definition code, and the
 * context produce by executing the definition code. All of these items
 * are used to generate a unique Class which is used in by the
 * Custom Elements registry.
 *
 * It should be noted that this is not the same as the Element produced when
 * using a component as an HTML tag or from document.createElement().
 * ZephComponent is the definition of that element, not the element itself.
 *
 * ZephCompoonent is returned when you ask ZephComponents to get the
 * component.
 *
 * @class
 */
class ZephComponent {
	constructor(name,origin,code) {
		check.posstr(name,"name");
		check.posstr(name,"origin");
		check.not.uon(code,"code");
		check.function(code,"code");

		let context = {};
		context.name = name;
		context.origin = origin;

		this[$CODE] = code;
		this[$CONTEXT] = context;
		this[$ELEMENT] = null;
	}

	/**
	 * The context object that was built by executing the component definition.
	 * Depending on when this member is examined, the context might be
	 * very simple or very complex; it depends on whether or not the
	 * ZephComponent has been "defined".  Prior to being "defined" the
	 * definition code has not yet been executed and thus the context will
	 * have very little in it.  Once "defined" the code will have been
	 * executed and the resulting context populated.
	 *
	 * This is an object with a number of highly specialized fields that
	 * are used when the element is created.  As such, changing it
	 * is not allowed.
	 *
	 * @return {Object}
	 */
	get context() {
		return this[$CONTEXT];
	}

	/**
	 * The name of the component, which is also the tag-name used in HTML for
	 * the component.
	 *
	 * @return {String}
	 */
	get name() {
		return this.context.name;
	}

	/**
	 * The origin, in string form, of where the component was defined,
	 * or the best guess as to where that is.  Origin is not always
	 * going to be super accurate, but its tries its best.
	 *
	 * @return {String}
	 */
	get origin() {
		return this.context.origin;
	}

	/**
	 * The code that is to be or was executed for this component when defined.  This
	 * will either be a string or a Function, depending on what was passed
	 * to the define method.
	 *
	 * @return {String|Function}
	 */
	get code() {
		return this[$CODE];
	}

	/**
	 * Returns true if the ZephComponent was "defined" and has a registered
	 * custom element class.
	 *
	 * @return {boolean}
	 */
	get defined() {
		return !!this[$ELEMENT];
	}

	/**
	 * Returns the custom element class that was used to register the
	 * component with the CustomElements registry.
	 *
	 * @return {ZephElementClass}
	 */
	get customElementClass() {
		return this[$ELEMENT];
	}

	/**
	 * Executes the code, which in turn builds the context, which is
	 * given to ZephElementClass.generateClass() to generate a unique
	 * class representation for this component.  This class is then
	 * used along with the name, to register the custom element.
	 *
	 * @return {Promise}
	 */
	define() {
		return utils.tryprom(async (resolve)=>{
			let execution = new ZephComponentExecution(this.context,this.code);
			await execution.run();

			await Promise.all(this.context.pending||[]);

			// if we are inheriting we need to update the context
			// to reflect the inheritance.
			if (this.context.from) {
				let from = ZephComponents.get(this.context.from);
				if (!from) throw new Error("Component '"+this.context.from+"' not found; inheritence by '"+this.context.name+"' is not possible.");

				await Promise.all(from.context.pending||[]);

				this[$CONTEXT] = extend({},from.context,this.context);
			}

			this[$ELEMENT] = ZephElementClass.generateClass(this.context);
			customElements.define(this.name,this[$ELEMENT]);
			(this.context.aliases||[]).forEach((aliasName)=>{
				const aliasClass = (class AliasClass extends this[$ELEMENT]{
					constructor() {
						super();
					}
				});
				customElements.define(aliasName,aliasClass);
			});

			fire(this.context && this.context.lifecycle && this.context.lifecycle.init || [],this.name,this);

			resolve();
		});
	}
}

/**
 * @private
 *
 * A container class for all of the exposed methods that are
 * used in component definition.  These are called on the given CODE_CONTEXT
 * when the definition code is executed.
 */
class ZephComponentExecution {
	/**
	 * Takes the starting context and the code to be executed.
	 *
	 * @param {Object} context
	 * @param {String|Function} code
	 */
	constructor(context,code) {
		check.not.uon(context,"context");
		check.not.uon(code,"code");
		check.function(code,"code");

		this[$CONTEXT] = context;
		this[$CODE] = code;
	}

	/**
	 * Executes the code for the component, which in turn builds out
	 * the context by calling the definition methods.
	 *
	 * @return {Promise}
	 */
	run() {
		return utils.tryprom(async (resolve)=>{
			CODE_CONTEXT = this;
			await this[$CODE].bind(this)(DEFINITION_METHODS);
			CODE_CONTEXT = null;

			resolve();
		});
	}

	/**
	 * Returns the context.
	 *
	 * @return {Object}
	 */
	get context() {
		return this[$CONTEXT];
	}

	/**
	 * @summary
	 *
	 * Definition Method used for inheriting from another ZephComponent.  Inheritence
	 * works by cloning the inherited components Context, and then appending the
	 * new components context on top of that.  Inheritence does not actually
	 * inherit in the classic object oriented approach.
	 *
	 * @param  {String} fromTagName
	 * @return {void}
	 * @exports from
	 * @kind function
	 */
	from(fromTagName) {
		check.posstr(fromTagName,"fromTagName");

		this.context.pending = this.context.pending || [];
		this.context.pending.push(ZephComponents.waitFor(fromTagName));

		this.context.from = fromTagName;
	}

	/**
 	 * @summary
 	 *
	 * Definition Method used to provide one or more alias names for a componet.  In
	 * essence, when the component is registered with the Custome Element registry,
	 * if there are any aliases, those names are also registered at the same time
	 * using a clone of the original method.
	 *
	 * Aliases are useful if you need a component to have multiple tag names or
	 * shortcut names.
	 *
	 * @param  {String} aliasName
	 * @return {void}
	 *
	 * @exports alias
	 * @kind function
	 */
	alias(aliasName) {
		check.posstr(aliasName,"aliasName");

		this.context.aliases = this.context.aliases || new Set();
		this.context.aliases.add(aliasName);
	}

	/**
	 * @summary
	 *
	 * Definition Method to provide HTML content to a component when it is
	 * created.  The HTML provided becomes the content of the new element's
	 * Shadow DOM (and is refered to through this documentation as "the
	 * content").
	 *
	 * The html() Definition Method can take either a url or relative filename
	 * or the actual HTML as string content. if a url or relative filename
	 * is given, ZephJS will download that url content, if possible, and use
	 * that as the content.  This allows developers to separate thier HTML
	 * from the Component Definition JavaScript.
	 *
	 * Each call to the html() Definition Method will be appended together
	 * to form a single block of HTML content.  However, you may specify the
	 * option "overwrite" in the options object as "true" and the html()
	 * definition methods, to that point, will be overwritten by the given
	 * content.  (It should be noted that subsequent html() calls after
	 * and overwrite are appended to the overwrite content.)
	 *
	 * Another option "noRemote" if set to true, will prevent ZephJS
	 * from downloading the html() content if it is a valid url or relative
	 * filename and just treat it like a literal content string.  This
	 * can be useful as sometimes ZephJS does not always know the difference
	 * between referenced content and literal content and may try
	 * to guess and load things that dont exist.
	 *
	 * @param  {string} content
	 * @param  {Object} [options={}]
	 * @param  [options.overwrite=false] {boolean}
	 * @param  [options.noRemote=false] {boolean}
	 * @return {void}
	 *
	 * @exports html
	 * @kind function
	 */
	html(content,options={}) {
		options = Object.assign({
			overwrite: false,
			noRemote: false
		},options||{});

		let prom = utils.tryprom(async (resolve)=>{
			if (!options.noRemote) {
				let url = await utils.resolveName(content,this.context.origin||document.URL.toString(),".html");
				if (url) content = await utils.fetchText(url);
			}

			let template = document.createElement("template");
			template.innerHTML = content;

			this.context.html = this.context.html || [];
			this.context.html.push({template,options});

			resolve();
		});

		this.context.pending = this.context.pending || [];
		this.context.pending.push(prom);
	}

	/**
	 * @summary
	 *
	 * Definition Method to provide CSS content to a component when it is
	 * created.  The CSS provided becomes a <style></style> element within
	 * the new element's Shadow DOM.
	 *
	 * The css() Definition Method can take either a url or relative filename
	 * or the actual CSS as string content. if a url or relative filename
	 * is given, ZephJS will download that url content, if possible, and use
	 * that as the content.  This allows developers to separate thier CSS
	 * from the Component Definition JavaScript.
	 *
	 * Each call to the css() Definition Method will be appended together
	 * to form a single block of CSS content.  However, you may specify the
	 * option "overwrite" in the options object as "true" and the css()
	 * definition methods, to that point, will be overwritten by the given
	 * content.  (It should be noted that subsequent css() calls after
	 * and overwrite are appended to the overwrite content.)
	 *
	 * Another option "noRemote" if set to true, will prevent ZephJS
	 * from downloading the css() content if it is a valid url or relative
	 * filename and just treat it like a literal content string.  This
	 * can be useful as sometimes ZephJS does not always know the difference
	 * between referenced content and literal content and may try
	 * to guess and load things that dont exist.
	 *
	 * @param  {string} content
	 * @param  {Object} [options={}]
	 * @param  [options.overwrite=false] {boolean}
	 * @param  [options.noRemote=false] {boolean}
	 * @return {void}
	 *
	 * @exports css
	 * @kind function
	 */
	css(content,options={}) {
		options = Object.assign({
			overwrite: false,
			noRemote: false
		},options||{});

		let prom = utils.tryprom(async (resolve)=>{
			if (!options.noRemote) {
				let url = await utils.resolveName(content,this.context.origin,".css");
				if (url) content = await utils.fetchText(url);
			}

			let template = document.createElement("template");
			template.innerHTML = "<style>\n"+content+"\n</style>";

			this.context.css = this.context.css || [];
			this.context.css.push({template,options});

			resolve();
		});

		this.context.pending = this.context.pending || [];
		this.context.pending.push(prom);
	}

	/**
	 * @summary
	 *
	 * Definition Method to associate some external asset like
	 * an image, audio clip, or video, with some element within
	 * the components internal content.
	 *
	 * In order for asset() to assoicate you must provide both
	 * the CSS Query Selector you want to associate to, and a
	 * url or filename to the external asset you want associated.
	 *
	 * The association is done by converting the asset into its
	 * base64 encoded binary data and making it part of a data:
	 * url.  This url is then associated with the appropriate
	 * `src` attribute on the selected elements. (The associating
	 * attribute can be changed with the `target` option.)
	 *
	 * asset() is really powerful for bundling purposes as the
	 * CLI bundle command will download the asset and inline
	 * the content as a data: url this allowing one to ship
	 * both the component and its dependant resources.
	 *
	 * It should be noted, however, that using this approach can
	 * explode your asset sizes by up to 4 times and is not
	 * recommended in all scenarios.
	 *
	 * @param {string} selector
	 * @param {string} url
	 * @param {Object} [options={}]
	 * @param  [options.target=false] {boolean}
	 * @return {void}
	 *
	 * @exports asset
	 * @kind function
	 */
	asset(selector,url,options={}) {
		check.not.uon(selector,"selector");
		check.string(selector,"selector");
		check.not.empty(selector,"selector");
		check.not.uon(url,"content");

		let urlstr = ""+url;
		if (!urlstr.match(/^data:|^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//)) throw new Error("Url must be a valid url (http, https, ftp), or a relative filename, or a data url.");

		options = Object.assign({
			target: "src"
		},options||{});

		let prom = utils.tryprom(async (resolve)=>{
			url = await utils.resolveName(url,this.context.origin,"");

			let response;
			if (url && url.protocol==="data:") {
				response = utils.parseDataURL(url);
			}
			else {
				response = await utils.fetchBinary(url);

				// source: https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
				response.data = btoa([].reduce.call(new Uint8Array(response.data),(p,c)=>{
					return p+String.fromCharCode(c);
				},''));
			}

			this.context.assets = this.context.assets || [];
			this.context.assets.push({
				selector,
				contentType: response && response.contentType || null,
				data: response && response.data || null,
				options
			});

			resolve();
		});

		this.context.pending = this.context.pending || [];
		this.context.pending.push(prom);
	}

	/**
	 * @summary
	 *
	 * Definition Method to define an attribute on the new element. This
	 * method takes the attribute name and an initial value (or "undefined"
	 * if no value specified.)
	 *
	 * Using this method to define an attribute is strictly optional, but it will
	 * save having to buildout an onCreate() method and set attributes there.
	 *
	 * The initial value passed in is set ONLY IF the element does not already
	 * have a value set for the attribute.  Setting an initial value of "undefined"
	 * means that the attribute is actively removed from the element. Also,
	 * please note that attribute values are strings and any non-string passed
	 * in will be converted to a string.  If you are trying to set a boolean
	 * attribute value like "disabled" which is present or not, but has no
	 * actual value, set it to an empty string ("") for true, and remove it (
	 * by setting it to "undefined" for false.)
	 *
	 * @param  {string} attributeName
	 * @param  {*} initialValue
	 * @return {void}
	 *
	 * @exports attribute
	 * @kind function
	 */
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

	/**
	 * @summary
	 *
	 * Definition Method to create a new property on the element object. This
	 * method takes the property name, an initial value, and an optional
	 * transform function.
	 *
	 * Using this method to define a property is strictly optional, but it will
	 * save having to buildout an onCreate() method and set properties there.
	 *
	 * The initial value passed in is set ONLY IF the element does not already
	 * have a value set for the property.
	 *
	 * The transform function, if given, will be executed any time the
	 * property is changed.  It takes a single argument, x, which is the new
	 * value. Whatever it returns, will be what is set on the property. You can
	 * also through an exception in the transform function which would prevent
	 * the set from occuring; this can be useful in validation.
	 *
	 * @param  {string} propertyName
	 * @param  {*} initialValue
	 * @param  {Function} transformFunction
	 * @return {void}
	 *
	 * @exports property
	 * @kind function
	 */
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

	/**
	 * @summary
	 *
	 * Definition Method to bind one part of the new element or its content
	 * to some other part of the new element or its content. Bindings are a
	 * useful way to avoid having to write a lot of custom code to do
	 * some very common actions in custom elements.  They are highly
	 * recommended over custom code.
	 *
	 * Bindings work thusly:
	 *
	 * I want to bind changes to X on element Y to modify A on element B.
	 *
	 * X can be an attribute, property, or the content of element Y.
	 * Y can be the custom element itself or any part of its internal content.
	 *
	 * A can be an attribute, property, or the content of element B.
	 * B can be the custom element itself or any part of its internal content.
	 *
	 * With the bind() definition method, Y is always the custom element itself.
	 * With the bindAt() definition method, Y is specified by a CSS selector.
	 *
	 * You specify X and A using a special syntax to tell ZephJS whether
	 * it is an attribute, a property, or the content that you are watching
	 * or modifying.
	 *
	 *   Attributes have the form "@<attribute-name>" like this:
	 *
	 *     "@value"
	 *
	 *   Properties have the form ".<property-name>" like this:
	 *
	 *     ".value"
	 *
	 *   Content has the form "$" and has nothing more to it:
	 *
	 *     "$"
	 *
	 * You specify Y and B using a CSS Query Selector string.  If you specify
	 * "." as the entirety of the CSS Query Selector string, ZephJS will return
	 * the custom element itself.  Also, note that if the CSS Query Selector
	 * string matches multiple elements, all elements will be bound.
	 *
	 * The bind() method has the following signature:
	 *
	 *   bind(sourceName,targetElement,targetName,transformFunction)
	 *
	 * sourceName is the X from above; it identifies the attribute, property,
	 * or content you want to watch for changes.  When the given attribute,
	 * property, or content changes, the binding will propagate the change
	 * to the target (A and B).
	 *
	 * targetElement is the B from above an is a CSS Query Selector string.
	 * It may match multiple elements and if so, each becomes a target.  If
	 * the string "." is used the target is the custom element itself.
	 *
	 * targetName is the X from above; it identifies the attribute, property,
	 * or content you want to modify when a change occurs. targetName is
	 * optional and if left out the sourceName will also be used as the
	 * targetName, saving a little typing.
	 *
	 * transformFunction is an optional function that if given will be
	 * executed when the change is triggered.  It recieves the value being
	 * set and whatever it returns is set instead.  Also, an exception
	 * thrown in the transformFunction will cause the binding to not
	 * set and thus prevent it.
	 *
	 * @param  {string} sourceName
	 * @param  {string} targetElement
	 * @param  {string} targetName
	 * @param  {Function} transformFunction
	 * @return {void}
	 *
	 * @exports binding
	 * @kind function
	 */
	binding(sourceName,targetElement,targetName,transformFunction) {
		return this.bindingAt(".",sourceName,targetElement,targetName,transformFunction);
	}

	/**
	 * @summary
	 *
	 * Definition Method to bind one part of the new element or its content
	 * to some other part of the new element or its content. Bindings are a
	 * useful way to avoid having to write a lot of custom code to do
	 * some very common actions in custom elements.  They are highly
	 * recommended over custom code.
	 *
	 * Bindings work thusly:
	 *
	 * I want to bind changes to X on element Y to modify A on element B.
	 *
	 * X can be an attribute, property, or the content of element Y.
	 * Y can be the custom element itself or any part of its internal content.
	 *
	 * A can be an attribute, property, or the content of element B.
	 * B can be the custom element itself or any part of its internal content.
	 *
	 * With the bind() definition method, Y is always the custom element itself.
	 * With the bindAt() definition method, Y is specified by a CSS selector.
	 *
	 * You specify X and A using a special syntax to tell ZephJS whether
	 * it is an attribute, a property, or the content that you are watching
	 * or modifying.
	 *
	 *   Attributes have the form "@<attribute-name>" like this:
	 *
	 *     "@value"
	 *
	 *   Properties have the form ".<property-name>" like this:
	 *
	 *     ".value"
	 *
	 *   Content has the form "$" and has nothing more to it:
	 *
	 *     "$"
	 *
	 * You specify Y and B using a CSS Query Selector string.  If you specify
	 * "." as the entirety of the CSS Query Selector string, ZephJS will return
	 * the custom element itself.  Also, note that if the CSS Query Selector
	 * string matches multiple elements, all elements will be bound.
	 *
	 * The bindAt() method has the following signature:
	 *
	 *   bindAt(sourceElement,sourceName,targetElement,targetName,transformFunction)
	 *
	 * sourceElement is the Y from above; it identifies the custom element or
	 * some element in the internal content to be watched. sourceElement is a
	 * CSS Query Selector string. If multiple elements match, each is bound
	 * as described.If the string "." is used the source is the custom element
	 * itself.
	 *
	 * sourceName is the X from above; it identifies the attribute, property,
	 * or content you want to watch for changes.  When the given attribute,
	 * property, or content changes, the binding will propagate the change
	 * to the target (A and B).
	 *
	 * targetElement is the B from above an is a CSS Query Selector string.
	 * It may match multiple elements and if so, each becomes a target.  If
	 * the string "." is used the target is the custom element itself.
	 *
	 * targetName is the X from above; it identifies the attribute, property,
	 * or content you want to modify when a change occurs. targetName is
	 * optional and if left out the sourceName will also be used as the
	 * targetName, saving a little typing.
	 *
	 * transformFunction is an optional function that if given will be
	 * executed when the change is triggered.  It recieves the value being
	 * set and whatever it returns is set instead.  Also, an exception
	 * thrown in the transformFunction will cause the binding to not
	 * set and thus prevent it.
	 * @param  {string} sourceElement
	 * @param  {string} sourceName
	 * @param  {string} targetElement
	 * @param  {string} targetName
	 * @param  {Function} transformFunction
	 * @return {void}
	 *
	 * @exports bindingAt
	 * @kind function
	 */
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

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Initialized
	 * Lifecycle event.  If multiple onInit() methods are called, each
	 * will execute in order.
	 *
	 * The Initialized Lifecycle event occurs after a component is registered
	 * with the Custom Element Registry, but before any instances of the
	 * components have been created.  As such, the onInit() method
	 * does not have access to the element or its content.
	 *
	 * The function passed to onInit() is executed with the signature
	 *
	 *   (name,component)
	 *
	 * - name is the component name,
	 * - componet is the ZephComponent instance describing the component.
	 *
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onInit
	 * @kind function
	 */
	onInit(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.init = this.context.lifecycle.init || [];
		this.context.lifecycle.init.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Created
	 * Lifecycle event.  If multiple onCreate() methods are called, each
	 * will execute in order.
	 *
	 * The Created Lifecycle event occurs after an element of the component
	 * is created via document.createElement() or through tag usage.
	 *
	 * The function passed to onCreate() is executed with the signature
	 *
	 *   (element,content)
	 *
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
 	 *
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onCreate
	 * @kind function
	 */
	onCreate(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.create = this.context.lifecycle.create || [];
		this.context.lifecycle.create.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Add
	 * Lifecycle event.  If multiple onAdd() methods are called, each
	 * will execute in order.
	 *
	 * The Add Lifecycle event occurs when an element of the component
	 * is add to a document or document fragment.
	 *
	 * The function passed to onAdd() is executed with the signature
	 *
	 *   (element,content)
	 *
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onAdd
	 * @kind function
	 */
	onAdd(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.add = this.context.lifecycle.add || [];
		this.context.lifecycle.add.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Remove
	 * Lifecycle event.  If multiple onRemove() methods are called, each
	 * will execute in order.
	 *
	 * The Remove Lifecycle event occurs when an element of the component
	 * is remove from a document or document fragment.
	 *
	 * The function passed to onRemove() is executed with the signature
	 *
	 *   (element,content)
	 *
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onRemove
	 * @kind function
	 */
	onRemove(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.remove = this.context.lifecycle.remove || [];
		this.context.lifecycle.remove.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Adopt
	 * Lifecycle event.  If multiple onAdopt() methods are called, each
	 * will execute in order.
	 *
	 * The Adopt Lifecycle event occurs when an element of the component
	 * is adopted by a new document or document fragment. It is very
	 * rarely needed.
	 *
	 * The function passed to onAdopt() is executed with the signature
	 *
	 *   (element,content)
	 *
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onAdopt
	 * @kind function
	 */
	onAdopt(listener) {
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.lifecycle = this.context.lifecycle || {};
		this.context.lifecycle.adopt = this.context.lifecycle.adopt || [];
		this.context.lifecycle.adopt.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Attribute
	 * Lifecycle event.  If multiple onAttribute() methods are called, each
	 * will execute in order.
	 *
	 * The Attribute Lifecycle event occurs when an element of the component
	 * has an attribute that is changed.
	 *
	 * The function passed to onAttribute() is executed with the signature
	 *
	 *   (attributeName,value,element,content)
	 *
	 * - attributeName is the name of the changed attribute.
	 * - value is the new value being changed to.
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {String} attributeName
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onAttribute
	 * @kind function
	 */
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

	/**
	 * @summary
	 *
	 * Definition Method to register a function to execute on the Property
	 * Lifecycle event.  If multiple onProperty() methods are called, each
	 * will execute in order.
	 *
	 * The Property Lifecycle event occurs when an element of the component
	 * has an property that is changed.
	 *
	 * The function passed to onProperty() is executed with the signature
	 *
	 *   (propertyName,value,element,content)
	 *
	 * - propertyName is the name of the changed attribute.
	 * - value is the new value being changed to.
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {String} propertyName
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onProperty
	 * @kind function
	 */
	onProperty(propertyName,listener) {
		check.not.uon(propertyName,"attribute");
		check.string(propertyName,"attribute");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");

		this.context.properties = this.context.properties || {};
		if (!this.context.properties[propertyName]) this.property(propertyName,undefined);
		this.context.properties[propertyName].changes.push(listener);
	}

	/**
	 * @summary
	 *
	 * Definition Method to register an event handler to execute on some event.
	 * Events are just as you would expect them, but onEvent() and onEventAt()
	 * allows you to define the handlers without needing to write complicated
	 * onCreate() functions to deal with it.
	 *
	 * onEvent() attaches an event handler for the given event name to the
	 * custom element itself. For example:
	 *
	 *   onEvent("click",myClickHandler);
	 *
	 * Would execute myClickHandler when the custom element receives a click
	 * event.
	 *
	 * The given listener executes with the following signature:
	 *
	 *   (event,element,content)
	 *
	 * - event is the event object.
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {String} eventName
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onEvent
	 * @kind function
	 */
	onEvent(eventName,listener) {
		check.not.uon(eventName,"eventName");
		check.string(eventName,"eventName");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.events = this.context.events || [];
		this.context.events.push({eventName,listener});
	}

	/**
	 * @summary
	 *
	 * Definition Method to register an event handler to execute on some event.
	 * Events are just as you would expect them, but onEvent() and onEventAt()
	 * allows you to define the handlers without needing to write complicated
	 * onCreate() functions to deal with it.
	 *
	 * onEventAt() attaches an event handler for the given event name to the
	 * all elements that match a given CSS Query Selector. For example:
	 *
	 *   onEventAt("div > button.active","click",myClickHandler);
	 *
	 * Would execute myClickHandler when any matching internal content element
	 * receives a click event. If the selector matches more than one element
	 * each element gets the event handler attach to it, so be careful.
	 *
	 * The given listener executes with the following signature:
	 *
	 *   (event,selected,element,content)
	 *
	 * - event is the event object.
	 * - selected it the element that matched the selector.
	 * - element is the custom element.
	 * - content is the Document Fragment of the internal content.
	 *
	 * @param  {String} selector
	 * @param  {String} eventName
	 * @param  {Function} listener
	 * @return {void}
	 *
	 * @exports onEventAt
	 * @kind function
 	 */
	onEventAt(selector,eventName,listener) {
		check.not.uon(eventName,"eventName");
		check.string(eventName,"eventName");
		check.not.uon(listener,"listener");
		check.function(listener,"listener");
		this.context.eventsAt = this.context.eventsAt || [];
		this.context.eventsAt.push({selector,eventName,listener});
	}
}

/**
 * @private
 *
 * The ZephElementClass is the static factory class for build the unique
 * custom element class that is used to register the custom element you
 * defined.  The Custom Elements Registry requires a class be passed
 * to it that is instantiated when the element is created.  This class
 * is what builds those classes.
 *
 * It is worth noting that within this produced class is all the code
 * that translates a context into an actual component.
 */
class ZephElementClass {
	/**
	 * Given a context, return a class that implements that
	 * context to build a new element of our custom variety.
	 *
	 * @param  {Object} context
	 * @return {Class}
	 */
	static generateClass(context) {
		let setup = null;
		let setupqueue = [];

		const clazz = (class ZephCustomElement extends HTMLElement {
			/**
			 * Used by the Custom Elements Registry to know which attributes
			 * should cause attribute events.
			 *
			 * @return {Array}
			 */
			static get observedAttributes() {
				return context && context.observed || [];
			}

			/**
			 * Construct a new element from our context. Never called
			 * directly, but instead called when a new element is created
			 * of the given name.
			 */
			constructor() {
				super();

				// create and store our element
				let element = this;
				this[$ELEMENT] = element;

				// create and store out element internal content.
				let shadow = this.shadowRoot || this.attachShadow({
					mode:"open"
				});
				this[$SHADOW] = shadow;

				// Take our context.html and add it as our
				// internal content. If some pre-existing
				// style did exist (see above) then this would
				// destroy it.
				(context.html||[]).forEach((markup)=>{
					let template = markup.template;
					let options = markup.options;

					if (options.overwrite) shadow.innerHTML = "";

					let clone = document.importNode(template.content,true);
					shadow.appendChild(clone);
				});

				// Now, a new style tag and populate it with our CSS.
				let styleElements = [];
				(context.css||[]).forEach((style)=>{
					let template = style.template;
					let options = style.options;

					if (options.overwrite) {
						styleElements.forEach((e)=>{
							[...e.children].forEach((ec)=>{
								ec.remove();
							});
						});
					}

					let clone = document.importNode(template.content,true);
					styleElements.push(clone);
					shadow.appendChild(clone);
				});

				// Handle assets
				if (context.assets) {
					context.assets.forEach((asset)=>{
						let data = asset.data;
						let type = asset.contentType;
						let elements = asset.selector==="." && [element] || [...shadow.querySelectorAll(asset.selector)] || [];
						let srcstr = "data:"+type+";base64,"+data;
						let urlstr = "url('"+srcstr+"')";

						let target = asset.options && asset.options.target || "src";
						let flavor = type.replace(/^([^/]+)\/.*$/g,"$1");

						elements.forEach((e)=>{
							let tag = e.tagName.toLowerCase();
							if (flavor==="image" && tag!=="img") e.style.backgroundImage = urlstr;
							else e.setAttribute(target,srcstr);
						});
					});
				}

				// All of the remaining, setting attributes, properties, bindings,
				// must happen AFTER the constructor is complete or it violates
				// the custom elements spec and will throw weird errors when
				// you create new elements with document.createElement()
				//
				// so, we do this as a timeout.
				//
				// But instead of a single timeout for each created element,
				// we create a queue of pending created elements and
				// a single timeout for all pending created elements. The
				// single timeout can process a bunch of pending elements
				// at one go around and we are less blocked by the event
				// queue.
				setupqueue.push({element,shadow,context});
				if (setup) return;
				setup = setTimeout(()=>{
					let all = setupqueue;
					setupqueue = [];

					setup = null;

					all.forEach(({element,shadow,context})=>{
						zephPopulateElement(element,shadow,context);
					});
				},0);
			}

			/**
			 * Return the element for this component.
			 *
			 * @return {HTMLElement}
			 */
			get element() {
				return this[$ELEMENT];
			}

			/**
			 * Return the internal content Shadow DOM node.
			 * @return {DocumentFragment}
			 */
			get content() {
				return this[$SHADOW];
			}

			/**
			 * Called by the Custom Element API when the element is
			 * added to a document or document fragment.
			 *
			 * @return {void}
			 */
			connectedCallback() {
				fire(context && context.lifecycle && context.lifecycle.add || [],this,this.shadowRoot);
			}

			/**
			 * Called by the Custom Element API when the element is
			 * removed from a document or document fragment.
			 *
			 * @return {void}
			 */
			disconnectedCallback() {
				fire(context && context.lifecycle && context.lifecycle.remove || [],this,this.shadowRoot);
			}

			/**
			 * Called by the Custom Element API when the element is
			 * adopted by a document or document fragment.
			 *
			 * @return {void}
			 */
			adoptedCallback() {
				fire(context && context.lifecycle && context.lifecycle.adopt || [],this,this.shadowRoot);
			}

			/**
			 * Called by the Custom Element API when the element has
			 * and attribute that is being observed change.
			 *
			 * @param  {String} attributeName
			 * @param  {*} oldValue
			 * @param  {*} newValue
			 * @return {void}
			 */
			attributeChangedCallback(attributeName,oldValue,newValue) {
				fire(context && context.lifecycle && context.lifecycle.attributes && context.lifecycle.attributes[attributeName] || [],oldValue,newValue,this,this.shadowRoot);
			}
		});

		return clazz;
	}
}

/**
 * @private
 *
 * This function handles setting up a new element when the
 * Component constructor is called.  It is everything beyond
 * creating the shadow dom and adding the html, css, and assets.
 * It is called by the timeout which is setup in the constructor.
 *
 * @param  {HTMLElement} element
 * @param  {ShadowRoot} shadow
 * @param  {object} context
 * @return {void}
 */
const zephPopulateElement = function zephPopulateElement(element,shadow,context) {
	// Add our attributes
	if (context.attributes) {
		Object.values(context.attributes).forEach((attr)=>{
			let value = element.hasAttribute(attr.attributeName) ? element.getAttribute(attr.attributeName) : attr.initialValue;

			if (value===undefined || value===null) element.removeAttribute(attr.attributeName);
			else element.setAttribute(attr.attributeName,attr.transformFunction ? attr.transformFunction(value) : value);
		});
	}

	// Add our properties
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
	fireImmediately(context && context.lifecycle && context.lifecycle.create || [],element,shadow);

	// register our bindings
	if (context.bindings) {
		Object.keys(context.bindings).forEach((name)=>{
			let binding = context.bindings[name];
			if (!binding) return;

			let srcele = binding.source.element;
			if (srcele===".") srcele = [element];
			else if (typeof srcele==="string") srcele = [...shadow.querySelectorAll(srcele)];
			else if (srcele instanceof HTMLElement) srcele = [srcele];

			let srcname = binding.source.name;

			let tgtele = binding.target.element;
			if (tgtele===".") tgtele = element;

			let tgtname = binding.target.name;

			let transform = binding.transform;

			srcele.forEach((srcele)=>{
				let handler;
				if (tgtname.startsWith("@")) {
					handler = (value)=>{
						let name = tgtname.slice(1);
						value = transform(value);
						let targets = tgtele instanceof HTMLElement && [tgtele] || [...shadow.querySelectorAll(tgtele)] || [];
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
				else if (tgtname.startsWith(".")) {
					handler = (value)=>{
						let name = tgtname.slice(1);
						value = transform(value);
						let targets = tgtele instanceof HTMLElement && [tgtele] || [...shadow.querySelectorAll(tgtele)] || [];
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
				else if (tgtname==="$") {
					handler = (value)=>{
						value = transform(value);
						if (value===undefined) return;
						let targets = tgtele instanceof HTMLElement && [tgtele] || [...shadow.querySelectorAll(tgtele)] || [];
						targets.forEach((target)=>{
							if (target.textContent!==value) target.textContent = value===undefined || value===null ? "" : value;
						});
					};
				}
				else {
					/* eslint-disable no-console */
					console.warn("Unable to handle binding to '"+tgtname+"'; Must start with '@' or '$' or '.'.");
					/* eslint-enable no-console */
					return;
				}

				if (!srcele[$OBSERVER]) {
					srcele[$OBSERVER] = new ZephObserver(srcele);
					srcele[$OBSERVER].start();
				}

				// first we run the handler for the initial alignment,
				// then we register the observer.
				let observer = srcele[$OBSERVER];
				if (srcname.startsWith("@")) {
					let name = srcname.slice(1);
					if (srcele.hasAttribute(name)) {
						let value =  srcele.getAttribute(name);
						handler(value,name,srcele);
					}

					observer.addAttributeObserver(name,handler);
				}
				else if (srcname.startsWith(".")) {
					let name = srcname.slice(1);

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
				else if (srcname==="$") {
					let value = srcele.textContent;
					handler(value,null,srcele);

					observer.addContentObserver(handler);
				}
				else {
					/* eslint-disable no-console */
					console.warn("Unable to handle binding to '"+tgtname+"'; Must start with '@' or '$' or '.'.");
					/* eslint-enable no-console */
					return;
				}
			});
		});
	}

	// register events from onEvent
	if (context.events) {
		context.events.forEach((obj)=>{
			element.addEventListener(obj.eventName,(event)=>{
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
};

/**
 * @summary
 *
 * Utility wrapper class for observing an element for changes.  This
 * uses the MutationObserver API internally and is largely just a
 * shell for it.
 *
 * @class
 */
class ZephObserver {
	/**
	 * Create an Element Observer for a given element. This does not
	 * actually start the observation, just sets it up. You must call
	 * start() to begin the observation.
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		if (!element) throw new Error("Missing element.");
		if (!(element instanceof HTMLElement)) throw new Error("Invalid element; must be an instance of HTMLElement.");

		this.element = element;
		this.attributes = {};
		this.content = [];
		this.observer = new MutationObserver(this.handleMutation.bind(this));
	}

	/**
	 * Adds a handler to fire on an attribute change.
	 *
	 * @param {string} attribute
	 * @param {Function} handler
	 * @return {void}
	 */
	addAttributeObserver(attribute,handler) {
		check.not.uon(attribute,"attribute");
		check.string(attribute,"attribute");
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

		this.attributes[attribute] = this.attributes[attribute] || [];
		this.attributes[attribute].push(handler);
	}

	/**
	 * Removes a specific attribute handler.
	 *
	 * @param  {String} attribute
	 * @param  {Function} handler
	 * @return {void}
	 */
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

	/**
	 * Removes all attribute handlers.
	 *
	 * @param  {String} attribute
	 * @return {void}
	 */
	removeAllAttributeObservers(attribute) {
		if (attribute && typeof attribute!=="string") throw new Error("Invalid attribute; must be a string.");
		if (!attribute) this.attributes = {};
		else delete this.attributes[attribute];
	}

	/**
	 * Adds a handler to fire on any content change.
	 *
	 * @param {Function} handler
	 * @return {void}
	 */
	addContentObserver(handler) {
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

		this.content.push(handler);
	}

	/**
	 * Removes a specific content handler.
	 *
	 * @param  {Function} handler
	 * @return {void}
	 */
	removeContentObserver(handler) {
		check.not.uon(handler,"handler");
		check.function(handler,"handler");

		this.content = this.content.filter((h)=>{
			return h!==handler;
		});
	}

	/**
	 * Remove all content handlers.
	 *
	 * @return {void}
	 */
	removeAllContentObservers() {
		this.content = [];
	}

	/**
	 * Start the observer watching the element.
	 *
	 * @return {void}
	 */
	start() {
		this.observer.observe(this.element,{
			attributes: true,
			characterData: true,
			childList: true
		});
	}

	/**
	 * Stop the observer watching the element.
	 *
	 * @return {void}
	 */
	stop() {
		this.observer.disconnect();
	}

	/**
	 * Function to read the mutation event and parcel it
	 * out to the correct handlers.
	 *
	 * @param  {Array} records
	 * @return {void}
	 */
	handleMutation(records) {
		records.forEach((record)=>{
			if (record.type==="attributes") this.handleAttributeMutation(record);
			else this.handleContentMutation(record);
		});
	}

	/**
	 * Executes the apropriate attribute handlers.
	 *
	 * @param  {Object} record
	 * @return {void}
	 */
	handleAttributeMutation(record) {
		let name = record.attributeName;
		if (!this.attributes[name] || this.attributes[name].length<1) return;

		let value = this.element.getAttribute(name);
		this.attributes[name].forEach((handler)=>{
			handler(value,name,this.element);
		});
	}

	/**
	 * Executes the appropriate content handlers.
	 *
	 * @param  {Object} record
	 * @return {void}
	 */
	handleContentMutation(/*record*/) {
		if (this.content.length<1) return;
		let value = this.element.textContent;

		this.content.forEach((handler)=>{
			handler(value,this.element);
		});
	}
}

/**
 * @summary
 *
 * Define the ZephComponents singleton which is our exposed
 * API for defining new components.
 *
 * @alias ZephComponents
 * @namespace
 */
class ZephComponentsClass {
	/**
	 * @private
	 *
	 * Singleton instantiated by ZephJS.
	 */
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

	/**
	 * Returns an array of all components defined with ZephJS.
	 *
	 * @return {Array}
	 */
	get components() {
		return this[$PROXY];
	}

	/**
	 * Returns an array of all component names defined with ZephJS.
	 * @return {Array}
	 */
	get names() {
		return Object.keys(this[$COMPONENTS]);
	}

	/**
	 * Returns true if a component of a given name is already defined or
	 * in the process of being defined.
	 *
	 * @param  {String}  name
	 * @return {Boolean}
	 */
	has(name) {
		check.posstr(name,"name");

		return !!this[$COMPONENTS][name];
	}

	/**
	 * Returns the ZephComponent for a component of the given name, if
	 * the component has been registered.
	 * @param  {String} name
	 * @return {ZephComponent}
	 */
	get(name) {
		check.posstr(name,"name");

		return this[$COMPONENTS][name];
	}

	/**
	 * Returns a promise that resolve when the component of the given name
	 * completes its definition and registration process.  This is useful
	 * to ensure that component XYZ exists and is avialable before going
	 * off and doing something.  Most of the time this is unneceessary
	 * and ZephJS will take care of it.
	 *
	 * @param  {String} name
	 * @return {Promise}
	 */
	waitFor(name) {
		check.posstr(name,"name");

		if (this[$COMPONENTS][name]) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			this[$OBSERVER].push({name,resolve,reject});
		});
	}

	/**
	 * Used to define a new ZephJS component of the given name with
	 * the given definition.
	 *
	 * Component names must be strings and must have at least one
	 * dash character within them.
	 *
	 * The code argument represents a function that within it defines
	 * the component through the use of one or more definition methods.
	 *
	 * The code argument has the signature
	 *
	 * 		`(methods) => {}`
	 *
	 * where `methods` is an object which contains all of the definition
	 * methods one can use within a definition function. This is provided
	 * for developers who would prefer to access the definition methods
	 * via destructuring in the definition argument rather than importing
	 * each with an import statement. Either approach is valid and both
	 * can be used interchangable:
	 *
	 * 	```javascript
	 * 	import {ZephComponents} from "./zeph.min.js";
	 *
	 * 	ZephComponents.define("my-button",({html,css,attribute})=>{
	 * 		html("./my-button.html");
	 * 		css("./my-button.css");
	 *
	 * 		attribute("icon","");
	 * 	});
	 * 	```
	 *
	 * This returns a promise that will resolve when all of the definition
	 * and registration is complete.  In most cases waiting for the
	 * promise to resolve is unnecessary, but it is provided in case
	 * you need to block until it is complete.
	 *
	 * @param  {String} name
	 * @param  {String|Function} code
	 * @return {Promise}
	 */
	define(name,code) {
		check.posstr(name,"name");

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

		document.dispatchEvent(new CustomEvent("zeph:component:loading",{
			bubbles: false,
			detail: name
		}));

		return utils.tryprom(async (resolve)=>{
			let component = new ZephComponent(name,origin,code);
			this[$COMPONENTS][name] = component;
			await component.define();

			this[$OBSERVER] = this[$OBSERVER].filter((waiting)=>{
				if (waiting.name===name) waiting.resolve();
				return waiting.name!==name;
			});

			delete PENDING["component:"+origin];

			document.dispatchEvent(new CustomEvent("zeph:component:defined",{
				bubbles: false,
				detail: {name,component}
			}));
			fireZephReady();

			resolve(component);
		});
	}

	/**
	 * Removes a ZephJS component.  It is very important to note here that
	 * the Custom Elements API does not provide a facility to unregister
	 * a component once it has been registered.  This function then does
	 * not actually remove the component, only ZephJS's awareness of it.
	 *
	 * @param  {String} name
	 * @return {void}
	 */
	undefine(name) {
		check.posstr(name,"name");

		let component = this[$COMPONENTS][name];
		if (!component) return;

		delete this[$COMPONENTS][name];

		document.dispatchEvent(new CustomEvent("zeph:component:undefined",{
			bubbles: false,
			detail: {name,component}
		}));
	}
}

/**
 * @summary
 *
 * ZephService is a utility class you can inherit from to build
 * an eventable service, that is a service that can fire events.
 *
 * @class
 * @abstract
 */
class ZephService {
	/**
	 * Create a new service.
	 */
	constructor() {
		this[$LISTENERS] = new Map();
	}

	/**
	 * Fire a specific event.
	 *
	 * @param  {String} event
	 * @param  {*} args
	 * @return {void}
	 */
	fire(event,...args) {
		let listeners = this[$LISTENERS].get(event);
		(listeners||[]).forEach((listener)=>{
			setTimeout(()=>{
				listener.apply(listener,[event,...args]);
			},0);
		});
	}

	/**
	 * Register a listener for a specific event.
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	addEventListener(event,listener) {
		let listeners = this[$LISTENERS].get(event) || [];
		listeners.push(listener);
		this[$LISTENERS].set(event,listeners);
	}

	/**
	 * Remove a listener for a specific event.
	 *
	 * @param  {String} event
	 * @param  {Function} listener
	 * @return {void}
	 */
	removeEventListener(event,listener) {
		let listeners = this[$LISTENERS].get(event) || [];
		listeners = listeners.filter((l)=>{
			return l!==listener;
		});
		this[$LISTENERS].set(event,listeners);
	}

	/**
	 * Register a listener for a specific event. Same as addEventListener.
	 *
	 * @param  {String} event
	 * @param  {Function} listener
	 * @return {void}
	 */
	on(event,listener) {
		return this.addEventListener(event,listener);
	}

	/**
	 * Registers a one time listener for a specific event.
	 * @param  {String} event
	 * @param  {Function} listener
	 * @return {void}
	 */
	once(event,listener) {
		return this.addEventListner(event,(event,...args)=>{
			this.removeEventListener(event,listener);
			listener.apply(listener,args);
		});
	}

	/**
	 * Remove a listener for a specific event. Same as removeEventListener.
	 * @param  {String} event
	 * @param  {Function} listener
	 * @return {void}
	 */
	off(event,listener) {
		return this.removeEventListener(event,listener);
	}
}

/**
 * @private
 *
 * Internal function for extending an element.
 *
 * @param  {Object} target
 * @param  {Object} sources
 * @return {Object}
 */
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

/**
 * @private
 *
 * Internal function for firing an event.
 *
 * @param  {Array} listeners
 * @param  {*} args
 * @return {void}
 */
const fire = function fire(listeners,...args) {
	listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
	listeners.forEach((listener)=>{
		setTimeout(()=>{
			return listener.apply(listener,args);
		},0);
	});
};

/**
 * @private
 *
 * Internal function for firing an event but doing it inline instead
 * of in a timeout.
 *
 * @param  {Array} listeners
 * @param  {*} args
 * @return {void}
 */
const fireImmediately = function fireImmediately(listeners,...args) {
	listeners = listeners && !(listeners instanceof Array) && [listeners] || listeners || [];
	listeners.forEach((listener)=>{
		return listener.apply(listener,args);
	});
};

/**
 * @private
 *
 * Internal function for firing the zeph:ready event.
 *
 * @return {void}
 */
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

/**
 * @private
 *
 * Internal function for getting a given property descriptor on a given
 * object or any of its prototypes.
 *
 * @param  {Object} object
 * @param  {String} propertyName
 * @return {Object}
 */
const getPropertyDescriptor = function getPropertyDescriptor(object,propertyName) {
	while (true) {
		if (object===null) return null;

		let desc = Object.getOwnPropertyDescriptor(object,propertyName);
		if (desc) return desc;

		object = Object.getPrototypeOf(object);
	}
};

/**
 * @private
 *
 * Internal function that will turn an existing property into
 * something we can listen for changes on.
 *
 * @param  {Object} object
 * @param  {String} propertyName
 * @param  {Object} descriptor
 * @return {Object}
 */
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

/**
 * @private
 *
 * Internal function for calling the Definition Methods around
 * a specific context when used.
 *
 * @param  {String} name
 * @return {Function}
 */
const contextCall = function(name) {
	check.posstr(name,"name");

	let f = {[name]: function() {
		if (!CODE_CONTEXT) throw new Error(name+"() may only be used within the ZephComponent.define() method.");
		return CODE_CONTEXT[name].apply(CODE_CONTEXT,arguments);
	}}[name];

	return f;
};

// Our Definition Methods
const from = contextCall("from");
const alias = contextCall("alias");
const html = contextCall("html");
const css = contextCall("css");
const asset = contextCall("asset");
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

// Our ZephComponents singleton.
const ZephComponents = new ZephComponentsClass();

// Exports
export {ZephComponents,ZephObserver,ZephService,utils as ZephUtils};
export {from,alias,html,css,asset,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt};

// Bind window.Zeph to our libs as well.
window.Zeph = {
	ZephComponents,
	ZephObserver,
	ZephService,
	ZephUtils: utils
};

// build our DEFINITION_METHODS object that gets used
// to pass methods into define
DEFINITION_METHODS = {
	from,alias,html,css,asset,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt
};
