// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");
const FS = require("fs");

const Acorn = require("acorn");
const Rollup = require("rollup");

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

const BANNER = `/*

The following is a ZephJS Component Bundle and includes the ZephJS Library.
ZephJS is copyright 2018-PRESENT, by The Awesome Engineering Company, inc.
and is released publically under the MIT License. Any usage of the ZephJS
library must included this license heading, the copyright notice, and
a reference to the Zephjs website.

For more details about ZephJS, please visit https://zephjs.com

*/
`; // must be on its own line!

class Bundle extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();

		this.addOption("quiet","boolean",false,"Disable displaying information details during bundle operation. Defaults to false.");
		this.addOption("full","boolean",false,"Bundle the full version of ZephJS instead of the minimized version. Defaults to false.");
		this.addOptionShortcut("no-min","full");
	}

	get title() {
		return "zeph > bundle";
	}

	get description() {
		return "Bundle a collection of components into a single file.";
	}

	get usage() {
		return "zeph bundle [options] <source_filename> <target_filename>";
	}

	execute(args,options) {
		let quiet = options.quiet;
		let full = options.full;

		if (args.length===0) {
			this.help();
		}
		else {
			let source = args[0];
			if (!source) return console.error("You must provided a source filename.");
			source = Path.resolve(process.cwd(),source);
			if (!source.endsWith(".js")) source += ".js";

			let target = args[1];
			if (!target) return console.error("You must provided a target filename.");
			target = Path.resolve(process.cwd(),target);
			if (!target.endsWith(".js")) target += ".js";

			return this.rollup(source,target,quiet,full);
		}
	}

	rollup(source,target,quiet,full) {
		const zephmin = AwesomeUtils.Module.resolve(module,"../../../zeph.min.js");
		if (!AwesomeUtils.FS.existsSync(zephmin)) {
			console.error("zep.min.js was not found in the Zeph.js project root and is required. Please try reinstalling ZephJS from npm.");
			process.exit(1);
		}
		const zephfull = AwesomeUtils.Module.resolve(module,"../../../zeph.full.js");
		if (!AwesomeUtils.FS.existsSync(zephfull)) {
			console.error("zep.full.js was not found in the Zeph.js project root and is required. Please try reinstalling ZephJS from npm.");
			process.exit(1);
		}
		const zeph = full ? zephfull : zephmin;

		const resolvePlugin = {
			name: "rollup-zephjs-resolver-plugin",
			resolveId(source) {
				if (source.match(/(\/|\\)[Zz]eph(\.(min|full))?\.js$/)) return zeph;
				return null;
			}
		};

		const inlinePlugin = {
			name: "rollup-zephjs-inline-plugin",
			transform(code,origin) {
				return (origin.match(/(\/|\\)[Zz]eph(\.(min|full))?\.js$/)) ? null : inlineReferences(code,origin,quiet);
			}
		};

		return new Promise(async (resolve,reject)=>{
			try {
				let bundle = await Rollup.rollup({
					input: source,
					plugins: [
						resolvePlugin,
						inlinePlugin
					]
				});
				await bundle.write({
					file: target,
					format: "iife",
					banner: BANNER
				});

				if (!quiet) console.log("\nWriting output to "+target+".");

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

const loader = function loader(url,rootDir,encoding="utf-8") {
	if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("ftp:")) {
		// load via request
	}
	else {
		url = Path.resolve(rootDir,url);
		return FS.readFileSync(url,{
			encoding: encoding
		});
	}
};

const inlineReferences = function inlineReferences(code,origin,quiet) {
	if (!quiet) console.log(origin);

	let root = Path.dirname(origin);

	let nodes = Acorn.parse(code,{
		ecmaVersion: 10,
		sourceType: "module"
	});

	let offset = 0;
	let paths = AwesomeUtils.Object.paths(nodes);
	paths.forEach((path)=>{
		if (!path) return;

		let node = AwesomeUtils.Object.get(nodes,path);
		if (typeof node==="object" && node.type && node.type==="CallExpression" && node.callee && node.callee.type==="Identifier") {

			let revised = null;
			if (node.callee.name==="html") revised = inlineHTML(origin,root,code,offset,node,quiet);
			else if (node.callee.name==="css") revised = inlineCSS(origin,root,code,offset,node,quiet);
			else if (node.callee.name==="image") revised = inlineImage(origin,root,code,offset,node,quiet);
			if (revised) {
				code = revised.code;
				offset = revised.offset;
			}
		}
	});

	return code;
};

const errorOut = function errorOut(origin,msg,exit=false) {
	console.error("ERROR: "+origin+": "+msg);
	if (exit) process.exit();
};

const inlineHTML = function inlineHTML(origin,root,code,offset,node,quiet) {
	if (!node) return;

	if (!node.callee) return;

	if (!node.callee.type) return;
	if (node.callee.type!=="Identifier") return;

	if (!node.callee.name) return;
	if (node.callee.name!=="html") return;

	if (!node.arguments) return;
	if (!(node.arguments instanceof Array)) return;

	let args = node.arguments;
	if (args.length<1) return;

	let arg = args[0];
	if (!arg) return;

	if (!arg.type) return errorOut(origin,"html() statement was not syntactically valid.",true);
	if (arg.type==="TemplateLiteral") return; // template literals are allowed for raw content.
	if (arg.type!=="Literal") return errorOut(origin,"html() statement may only be a string literal.",true);
	if (!arg.value) return;

	let start = arg.start;
	let end = arg.end;
	let length = arg.value.length;
	let filename = arg.value;

	let data = null;
	if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
		if (!quiet) console.log("  "+filename);
		data = loader(filename);
	}
	else {
		// data is not a filename and probably inline content.
		filename = resolveFilename(root,filename,[".html",".htm"]);
		if (!filename) return;

		if (!quiet) console.log("  "+filename);
		data = loader(filename);
	}

	if (!data) {
		console.error("ERROR: "+origin+": Could not find inline reference to "+filename+".");
		process.exit();
	}

	code = code.slice(0,start+offset)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end+offset);
	offset += (data.length-length);

	return {code,offset};
};

const inlineCSS = function inlineCSS(origin,root,code,offset,node,quiet) {
	if (!node) return;

	if (!node.callee) return;

	if (!node.callee.type) return;
	if (node.callee.type!=="Identifier") return;

	if (!node.callee.name) return;
	if (node.callee.name!=="css") return;

	if (!node.arguments) return;
	if (!(node.arguments instanceof Array)) return;

	let args = node.arguments;
	if (args.length<1) return;

	let arg = args[0];
	if (!arg) return;

	if (!arg.type || !arg.value) return errorOut(origin,"css() statement was not syntactically valid.",true);
	if (arg.type==="TemplateLiteral") return; // template literals are allowed for raw content.
	if (arg.type!=="Literal") return errorOut(origin,"css() statement may only be a string literal.",true);

	let start = arg.start;
	let end = arg.end;
	let length = arg.value.length;
	let filename = arg.value;

	let data = null;
	if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
		if (!quiet) console.log("  "+filename);
		data = loader(filename);
	}
	else {
		// data is not a filename and probably inline content.
		filename = resolveFilename(root,filename,[".css"]);
		if (!filename) return;

		if (!quiet) console.log("  "+filename);
		data = loader(filename);
	}

	if (!data) {
		console.error("ERROR: "+origin+": Could not find inline reference to "+filename+".");
		process.exit();
	}

	code = code.slice(0,start+offset)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end+offset);
	offset += (data.length-length);

	return {code,offset};
};

const inlineImage = function inlineImage(origin,root,code,offset,node,quiet) {
	if (!node) return;

	if (!node.callee) return;

	if (!node.callee.type) return;
	if (node.callee.type!=="Identifier") return;

	if (!node.callee.name) return;
	if (node.callee.name!=="image") return;

	if (!node.arguments) return;
	if (!(node.arguments instanceof Array)) return;

	let args = node.arguments;
	if (args.length<1) return;

	let arg = args.length===1 ? args[0] : args[1];
	if (!arg) return;

	if (!arg.type || !arg.value) return errorOut(origin,"image() statement was not syntactically valid.",true);
	if (arg.type==="TemplateLiteral") return; // template literals are allowed for raw content.
	if (arg.type!=="Literal") return errorOut(origin,"image() statement may only be a string literal.",true);

	let start = arg.start;
	let end = arg.end;
	let length = arg.value.length;
	let filename = arg.value;

	let data = null;
	if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
		if (!quiet) console.log("  "+filename);
		data = loader(filename,filename,null);
	}
	else {
		// data is not a filename and probably inline content.
		filename = resolveFilename(root,filename,[".png",".gif",".jpg",".jpeg",".apng",".svg",".icon",".ico",".bmp"]);
		if (!filename) return;

		if (!quiet) console.log("  "+filename);
		data = loader(filename,filename,null);
	}

	if (!data) {
		console.error("ERROR: "+origin+": Could not find inline reference to "+filename+".");
		process.exit();
	}

	data = "data:image/png;base64,"+data.toString("base64");

	code = code.slice(0,start+offset)+"`"+data+"`"+code.slice(end+offset);
	offset += (data.length-length);

	return {code,offset};
};

const resolveFilename = function resolveFilename(root,filename,extensions) {
	if (!root || !filename) return null;

	let possible = Path.resolve(root,filename);
	if (AwesomeUtils.FS.existsSync(possible)) return possible;
	if (!extensions) return null;
	if (!(extensions instanceof Array)) extensions = [extensions];

	return extensions.reduce((possible,ext)=>{
		if (possible) return possible;

		if (!ext) return null;
		if (!ext.startsWith(".")) ext = "."+ext;

		possible = Path.resolve(root,possible+ext);
		if (AwesomeUtils.FS.existsSync(possible)) return possible;

		return null;
	},null);
};

module.exports = Bundle;
