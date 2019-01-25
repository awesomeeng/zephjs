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

			args.forEach((source)=>{
				this.readSource(source);
			});

			this.writeTarget(target);
		}
	}

	readSource(source) {
		source = Path.resolve(process.cwd(),source);
		if (this.refs[source]) return;

		console.log("Including "+source);

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

					let filename = content.value;
					if (filename.startsWith("ftp:") || filename.startsWith("http:") || filename.startsWith("https:")) {
						required.push(filename);
					}
					else if (filename.startsWith("/") || filename.startsWith("./") || filename.startsWith("../")) {
						filename = Path.resolve(Path.dirname(source),filename);
						required.push(filename);
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),filename))) {
						filename = Path.resolve(Path.dirname(source),filename);
						required.push(filename);
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),filename+".js"))) {
						filename = Path.resolve(Path.dirname(source),filename);
						required.push(filename+".js");
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

					let filename = content.value;
					if (filename.startsWith("ftp:") || filename.startsWith("http:") || filename.startsWith("https:")) {
						preloads.push(filename);
					}
					else if (filename.startsWith("/") || filename.startsWith("./") || filename.startsWith("../")) {
						filename = Path.resolve(Path.dirname(source),filename);
						preloads.push(filename);
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),filename))) {
						filename = Path.resolve(Path.dirname(source),filename);
						preloads.push(filename);
					}
					else if (AwesomeUtils.FS.existsSync(Path.resolve(Path.dirname(source),filename+".js"))) {
						filename = Path.resolve(Path.dirname(source),filename);
						preloads.push(filename);
					}
					else {
						console.error("ERROR: "+token.value+"() can only be a string of a url or a absolute or relative filename; skipping.");
						continue;
					}
				}
			}
		}

		(preloads||[]).forEach((source)=>{
			console.log("  with "+source);
		});

		this.makeReference(source,required,preloads);
	}

	makeReference(source,required,preloads) {
		let root = Path.dirname(source);
		this.refs[source] = {
			root,
			source,
			required,
			preloads
		};
		required.forEach((req)=>{
			req = Path.resolve(root,req);
			this.readSource(req);
		});
	}

	computeOrder(source) {
		if (!source) return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten(Object.keys(this.refs).map((source)=>{
			return this.computeOrder(source);
		}))));

		let ref = this.refs[source];
		if (!ref) throw new Error("Invalid reference "+source+"."+Object.keys(this.refs));

		return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten((ref.required||[]).map((source)=>{
			return this.computeOrder(source);
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

		this.writeHeader(target);
		this.writeZeph(target);
		this.writeCode(target,preloads,order);

		console.log();
		console.log("Bundle written to "+target+".");
	}

	writeHeader(target) {
		let data = `
/*

The following is a ZephJS Component Bundle and includes the ZephJS Library.
ZephJS is copyright 2019, by The Awesome Engineering Company
and is released publically under the MIT License. Any usage of the ZephJS
library must included this license heading, the copyright notice, and
a reference to the Zephjs website.

For more details about ZephJS, please visit https://zephjs.com

*/

`;
		FS.appendFileSync(target,data,{
			encoding: "utf-8",
			flags: "as"
		});
	}

	writeZeph(target) {
		let data = FS.readFileSync(AwesomeUtils.Module.resolve(module,"../../Zeph.js"));
		FS.appendFileSync(target,data,{
			encoding: "utf-8",
			flags: "as"
		});
	}

	writeCode(target,preloads,order) {
		let data = "";

		preloads.forEach((source)=>{
			let preloaded = loader(source);
			preloaded = preloaded.replace(/`/,"\\`");
			data += `Zeph.preload("${source}",\`${preloaded}\`);\n`;
		});

		order.forEach((ref)=>{
			let code = loader(ref.source);
			code = code.replace(/`/,"\\`");
			data += `Zeph.define(\`${code}\`);\n`;
		});

		data = `
document.addEventListener("zeph:initialized",()=>{
${data}
});`;

		FS.appendFileSync(target,data,{
			encoding: "utf-8",
			flags: "as"
		});
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
