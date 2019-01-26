// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");
const FS = require("fs");

const Acorn = require("acorn");

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

class Bundle extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();

		this.refs = {};
	}

	get title() {
		return "zeph > bundle";
	}

	get description() {
		return "Bundle a collection of components into a single file.";
	}

	get usage() {
		return "zeph bundle <target-file> <filename> [<filename>...]";
	}

	execute(args/*,options*/) {
		this.refs = {};

		if (args.length===0) {
			this.help();
		}
		else {
			let target = args.shift();
			target = Path.resolve(process.cwd(),target);
			if (!target.endsWith(".js")) target += ".js";

			args.forEach((name)=>{
				this.readSource(name);
			});

			this.writeTarget(target);
		}
	}

	readSource(name,source) {
		source = source && Path.resolve(process.cwd(),source) || Path.resolve(process.cwd(),name);
		if (this.refs[source]) return;

		if (!AwesomeUtils.FS.existsSync(source)) {
			if (!source.endsWith(".js") && AwesomeUtils.FS.existsSync(source+".js")) {
				source += ".js";
			}
			else {
				console.error("Unable to find source reference "+source);
				process.exit(1);
			}
		}

		console.log("Including "+name);

		let required = [];
		let preloads = [];

		let data = FS.readFileSync(source);
		if (data instanceof Buffer) data = data.toString("utf-8");

		let tokens = [...Acorn.tokenizer(data,{
			ecmaVersion: 10
		})];

		let pos = 0;
		while(pos<tokens.length) {
			let token = tokens[pos];
			pos += 1;

			if (token && token.type && token.type.label && token.value) {
				if (token.type.label==="name" && (token.value==="load" || token.value==="requires")) {
					let content = tokens[pos+1];
					pos += 2;

					if (content.type.label!=="string") {
						console.error("ERROR: "+token.value+"() can only contain a string argument; skipping.");
						continue;
					}

					let name = content.value;
					if (name.startsWith("ftp:") || name.startsWith("http:") || name.startsWith("https:")) {
						required.push({
							name,
							source: name
						});
					}
					else if (name.startsWith("/") || name.startsWith("./") || name.startsWith("../")) {
						let src = Path.resolve(Path.dirname(source),name);
						required.push({
							name,
							source: src
						});
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),name))) {
						let src = Path.resolve(Path.dirname(source),name);
						required.push({
							name,
							source: src
						});
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),name+".js"))) {
						name += ".js";
						let src = Path.resolve(Path.dirname(source),name);
						required.push({
							name,
							source: src
						});
					}
					else {
						continue;
					}
				}
				if (token.type.label==="name" && (token.value==="html" || token.value==="css")) {
					let content = tokens[pos+1];
					pos += 2;

					if (content.type.label!=="string") {
						continue;
					}

					let name = content.value;
					if (name.startsWith("ftp:") || name.startsWith("http:") || name.startsWith("https:")) {
						preloads.push({
							name,
							source: name
						});
					}
					else if (name.startsWith("/") || name.startsWith("./") || name.startsWith("../")) {
						let src = Path.resolve(Path.dirname(source),name);
						preloads.push({
							name,
							source: src
						});
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),name))) {
						let src = Path.resolve(Path.dirname(source),name);
						preloads.push({
							name,
							source: src
						});
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),name+".js"))) {
						let src = Path.resolve(Path.dirname(source),name+".js");
						preloads.push({
							name,
							source: src
						});
					}
					else {
						console.error("ERROR: "+token.value+"() can only be a string of a url or a absolute or relative filename; skipping.");
						continue;
					}
				}
			}
		}

		(preloads||[]).forEach((preload)=>{
			console.log("  with "+preload.name);
		});

		this.makeReference(name,source,required,preloads);
	}

	makeReference(name,source,required,preloads) {
		let root = Path.dirname(source);
		this.refs[name] = {
			name,
			root,
			source,
			required,
			preloads
		};
		required.forEach((req)=>{
			let src = Path.resolve(root,req.source);
			this.readSource(req.name,src);
		});
	}

	computeOrder(source) {
		if (!source) return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten(Object.keys(this.refs).map((source)=>{
			return this.computeOrder(source);
		}))));

		let ref = this.refs[source];
		if (!ref && !source.endsWith(".js") && this.refs[source+".js"]) {
			source += ".js";
			ref = this.refs[source];
		}
		if (!ref) {
			console.error("ERROR: Invalid reference "+source+".");
			process.exit(1);
		}

		return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten((ref.required||[]).map((ref)=>{
			return this.computeOrder(ref.name);
		}).concat(ref))));
	}

	writeTarget(target) {
		if (AwesomeUtils.FS.existsSync(target)) FS.unlinkSync(target);

		let order = this.computeOrder();
		let preloads = AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten(Object.keys(this.refs).map((source)=>{
			let ref = this.refs[source];
			return ref.preloads||[];
		}))));

		console.log();

		// generate the header
		let header = `
/*

The following is a ZephJS Component Bundle and includes the ZephJS Library.
ZephJS is copyright 2019, by The Awesome Engineering Company
and is released publically under the MIT License. Any usage of the ZephJS
library must included this license heading, the copyright notice, and
a reference to the Zephjs website.

For more details about ZephJS, please visit https://zephjs.com

*/

`;

		// Load the ZephJS library
		let zeph = FS.readFileSync(AwesomeUtils.Module.resolve(module,"../../Zeph.js"));

		// generate the preloads
		let loadFirst = "";
		preloads.forEach((preload)=>{
			let preloaded = loader(preload.source);
			preloaded = preloaded.replace(/`/,"\\`");
			loadFirst += `Zeph.preload("${preload.name}",\`${preloaded}\`);\n`;
		});

		// generate the components
		let comps = "";
		order.forEach((ref)=>{
			let code = loader(ref.source);
			code = code.replace(/`/,"\\`");
			comps += `Zeph.define(\`${code}\`);\n`;
		});

		// Now write it all out
		let data = `
${header}

let existing = window.Zeph;
${zeph}
let Zeph = window.Zeph;
window.Zeph = existing;

document.addEventListener("zeph:initialized",()=>{
	${loadFirst}
	${comps}
});
`;

		// Write it all out to target.
		FS.appendFileSync(target,data,{
			encoding: "utf-8",
			flags: "as"
		});

		console.log();
		console.log("Bundle written to "+target+".");
	}
}

const loader = function loader(url,rootDir) {
	if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("ftp:")) {
		// load via request
		console.log("Downloading "+url);
	}
	else {
		url = Path.resolve(rootDir,url);
		console.log("Reading "+url);
		return FS.readFileSync(url,{
			encoding: "utf-8"
		});
	}
};

module.exports = Bundle;
