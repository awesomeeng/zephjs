let CONTEXT = null;

class ZephComponent {
	static register(name,cls) {
		if (!name) throw new Error("Missing name argument.");
		if (typeof name!=="string") throw new Error("Invalid name argument; must be a string.");
		if (name.indexOf("-")<1) throw new Error("Invalid name argument; must contain a dash character and the dash may not start the name.");

		if (!cls) throw new Error("Missing class argument.");
		if (!(cls instanceof Function)) throw new Error("Invalid class argument; must be a class.");
		if (!(/^class/.test(cls.toString()))) throw new Error("Invalid class argument; must be a class.");
		// if (!(Object.prototype.isPrototypeOf.call(HTMLElement,cls))) throw new Error("Invalid class argument; must inherit from HTMLElement.");

		let context = {};

		let first = true;
		try {
			new cls();
		}
		catch (ex) {
			console.warn("Error when registering ZephComponent.",ex);
			throw ex;
		}

		let gencls = (class GeneratedZephComponent extends HTMLElement {
			constructor() {
				super();

				console.log("inside gen class","start");
				let instance = contextNew(context,cls);
				console.log("inside gen class","stop");
			}
		});


		window.customElements.define(name,gencls);
		console.log("ZephJS","Registered",name);
	}
}

const contextNew = function contextNew(context,cls,args) {
	CONTEXT = context;
	let instance = new cls(...args);
	CONTEXT = null;
	return instance;
};

const html = function() {
	console.log("html",arguments,CONTEXT);
};
const css = function() {
	console.log("css",arguments,CONTEXT);
};

export { ZephComponent, html, css };
