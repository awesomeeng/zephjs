// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

(()=>{
	const $COMPONENT = Symbol("Component");
	const $COMPONENTS = Symbol("components");
	const $REQUIRED = Symbol("required");
	const $AWESOMEPATH = Symbol("awesomePath");

	class AwesomeComponents {
		constructor() {
			this[$AWESOMEPATH] = [...document.querySelectorAll("script")].reduce((awesome,script)=>{
				if (awesome) return awesome;
				if (script.src && script.src.match(/AwesomeComponents\.min\.js/)) return script.src;
				if (script.src && script.src.match(/AwesomeComponents\.js/)) return script.src;
				return null;
			},null);

			this[$REQUIRED] = {};
			this[$COMPONENTS] = {};
		}

		get Component() {
			return this[$COMPONENT];
		}

		init() {
			return new Promise(async (resolve,reject)=>{
				try {
					delete this.init;

					this[$COMPONENT] = await this.require("awesome:Component.js");

					document.dispatchEvent(new Event("awesome:ready"));

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		}

		resolve(path) {
			if (!path) throw new Error("Missing path.");
			if (!(path instanceof URL) && typeof path!=="string") throw new Error("Invalid path; must be a string or URL.");

			if (path.startsWith("awesome:")) return new URL(path.slice(8),this[$AWESOMEPATH]);
			return new URL(path,document.URL);
		}

		require(path) {
			if (!path) throw new Error("Missing path.");
			if (!(path instanceof URL) && typeof path!=="string") throw new Error("Invalid path; must be a string or URL.");

			return new Promise(async (resolve,reject)=>{
				try {
					path = this.resolve(path);

					let content = await fetchAsText(path);
					if (!content) throw new Error("Unable to import '"+path+"'.");

					let func = "(resolve,require,module)=>{\n"+content+"\n}\n";
					func = eval(func);

					let res = this.resolve.bind(this);
					let req = this.require.bind(this);
					let mod = {};
					func(res,req,mod);
					let result = mod && mod.exports || undefined;
					this[$REQUIRED][path] = result;

					resolve(result);
				}
				catch (ex) {
					let error = new Error("Error requiring url '"+path+"' > "+ex.message);
					error.stack = ex.stack;
					error.stack = error.stack.split(/\r\n|\n/g);
					error.stack.unshift("AwesomeComponents:require ("+path+")");
					error.stack = error.stack.join("\n");
					reject(error);
				}
			});
		}

		define(name,js,html,css) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			if (name.indexOf("-")<0) name = "awesome-"+name;

			let component = this[$COMPONENTS][name] = new this.Component(name,js,html,css);
			return component;
		}

		undefine(name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

		}

		async import(name) {
			if (!name) throw new Error("Missing name.");
			if (typeof name!=="string") throw new Error("Invalid name; must be a string.");

			if (name.indexOf("-")<0) name = "awesome-"+name;

			if (this[$COMPONENTS][name]) return this[$COMPONENTS][name];

			if (name.endsWith(".js")) return fetchJS.call(this,name);
			if (name.endsWith(".html")) return fetchHTML.call(this,name);
			if (name.endsWith(".css")) return fetchCSS.call(this,name);

			let js = await fetchJS.call(this,"./"+name+".js");
			let html = await fetchJS.call(this,"./"+name+".html");
			let css = await fetchJS.call(this,"./"+name+".css");

			try {
				return this.define(name,js,html,css);
			}
			catch (ex) {
				let error = new Error("Error importing component '"+name+"' > "+ex.message);
				error.stack = ex.stack;
				error.stack = error.stack.split(/\r\n|\n/g);
				error.stack.unshift("AwesomeComponents:import ("+name+")");
				error.stack = error.stack.join("\n");
				throw error;
			}
		}

		unrequire(url) {
			if (!url) throw new Error("Missing url.");
			if (typeof url!=="string") throw new Error("Invalid url; must be a string.");

			delete this[$REQUIRED][url];
		}
	}

	const fetchAsText = function fetchAsText(url) {
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

	const fetchJS = function fetchJS(url) {
		if (!url) throw new Error("Missing url.");
		if (typeof url!=="string") throw new Error("Invalid url; must be a string.");

		url = this.resolve(url);
		if (this[$REQUIRED][url]) return this[$REQUIRED][url];

		let content = fetchAsText(url);
		this[$REQUIRED][url] = content;
		return content;
	};

	const fetchHTML = function fetchHTML(url) {
		if (!url) throw new Error("Missing url.");
		if (typeof url!=="string") throw new Error("Invalid url; must be a string.");

		url = this.resolve(url);
		if (this[$REQUIRED][url]) return this[$REQUIRED][url];

		let content = fetchAsText(url);
		this[$REQUIRED][url] = content;
		return content;
	};

	const fetchCSS = function fetchCSS(url) {
		if (!url) throw new Error("Missing url.");
		if (typeof url!=="string") throw new Error("Invalid url; must be a string.");

		url = this.resolve(url);
		if (this[$REQUIRED][url]) return this[$REQUIRED][url];

		let content = fetchAsText(url);
		this[$REQUIRED][url] = content;
		return content;
	};

	window.AwesomeComponents = new AwesomeComponents();
	(async ()=>{
		await window.AwesomeComponents.init();
		delete window.AwesomeComponents.init;
	})();
})();
