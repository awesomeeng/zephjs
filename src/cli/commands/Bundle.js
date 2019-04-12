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

// Parse our known mimetypes and add to our allowed
// asset extensions if the mimetype is an asset type.
const extensions = [];
(()=>{
	let image =[];
	let audio =[];
	let video =[];
	Object.keys(AwesomeUtils.MimeTypes.mimetypes).forEach((type)=>{
		let flavor = type.replace(/^([^/]+)\/.*$/g,"$1");
		if (flavor==="image") image.concat(AwesomeUtils.MimeTypes.getExtensionForType(type).split(" "));
		if (flavor==="audio") audio.concat(AwesomeUtils.MimeTypes.getExtensionForType(type).split(" "));
		if (flavor==="video") video.concat(AwesomeUtils.MimeTypes.getExtensionForType(type).split(" "));
	});

	([].concat(image,audio,video)).forEach((ext)=>{
		ext = "."+ext;
		extensions.push(ext);
	});
})();

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

				if (!quiet) console.log("\nWriting output to "+target+".\n");

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

const loader = function loader(url,rootDir,encoding="utf-8") {
	return new Promise(async (resolve,reject)=>{
		try {
			if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("ftp:")) {
				let tried = [];
				let response = null;
				while (true) {
					if (tried.indexOf(""+url)>-1) return reject("URL redirect created a circular reference and could not be resolved.");
					tried.push(url);

					response = await AwesomeUtils.Request.get(url);

					if (response.statusCode===200) break;
					else if (response.statusCode>300 && response.statusCode<=308) {
						let newurl = response.headers && response.headers["Location"] || response.headers && response.headers["location"] || null;
						if (newurl) {
							url = newurl;
							response = null;
							continue;
						}
						else {
							return reject("URL did not return anything.");
						}
					}
					else return reject("URL returned an error code: "+response.statusCode+": "+(response.status||""));
				}

				if (!response) return reject("URL did not return anything.");

				let data = await response.content;
				let mimetype = response.contentType;
				resolve({data,mimetype});
			}
			else {
				url = Path.resolve(rootDir,url);
				FS.readFile(url,{
					encoding: encoding
				},(err,data)=>{
					if (err) return reject(err);
					resolve({
						data,
						mimetype: null
					});
				});
			}
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const inlineReferences = async function inlineReferences(code,origin,quiet) {
	if (!quiet) console.log(origin);

	let root = Path.dirname(origin);

	let nodes = Acorn.parse(code,{
		ecmaVersion: 10,
		sourceType: "module"
	});

	let offset = 0;
	let paths = AwesomeUtils.Object.paths(nodes);
	await AwesomeUtils.Promise.series(paths,(path)=>{
		if (!path) return;

		return new Promise(async (resolve)=>{
			try {
				let node = AwesomeUtils.Object.get(nodes,path);
				if (typeof node==="object" && node.type && node.type==="CallExpression" && node.callee && node.callee.type==="Identifier") {

					let revised = null;
					if (node.callee.name==="html") revised = await inlineHTML(root,code,offset,node,quiet);
					else if (node.callee.name==="css") revised = await inlineCSS(root,code,offset,node,quiet);
					else if (node.callee.name==="asset") revised = await inlineAsset(root,code,offset,node,quiet);
					if (revised) {
						code = revised.code;
						offset = revised.offset;
					}
				}

				resolve();
			}
			catch (ex) {
				console.error("\nERROR: "+origin+": "+ex);
				process.exit();
			}
		});
	});

	return code;
};

const inlineHTML = function inlineHTML(root,code,offset,node,quiet) {
	return new Promise(async (resolve,reject)=>{
		try {
			if (!node) return resolve();

			if (!node.callee) return resolve();

			if (!node.callee.type) return resolve();
			if (node.callee.type!=="Identifier") return resolve();

			if (!node.callee.name) return resolve();
			if (node.callee.name!=="html") return resolve();

			if (!node.arguments) return resolve();
			if (!(node.arguments instanceof Array)) return resolve();

			let args = node.arguments;
			if (args.length<1) return resolve();

			let arg = args[0];
			if (!arg) return resolve();

			if (!arg.type) return reject("html() statement was not syntactically valid.");
			if (arg.type==="TemplateLiteral") return resolve(); // template literals are allowed for raw content.
			if (arg.type!=="Literal") return reject("html() statement may only be a string literal.");
			if (!arg.value) return resolve();

			let start = arg.start;
			let end = arg.end;
			let length = arg.value.length;
			let filename = arg.value;

			let data = null;
			if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
				if (!quiet) console.log("  "+filename);
				({data} = await loader(filename));
			}
			else {
				// data is not a filename and probably inline content.
				filename = resolveFilename(root,filename,[".html",".htm"]);
				if (!filename) return;

				if (!quiet) console.log("  "+filename);
				({data} = await loader(filename));
			}
			if (data===undefined || data===null) return reject("Could not find inline reference to "+filename+".");

			code = code.slice(0,start+offset)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end+offset);
			offset += (data.length-length);

			resolve({code,offset});
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const inlineCSS = function inlineCSS(root,code,offset,node,quiet) {
	return new Promise(async (resolve,reject)=>{
		try {
			if (!node) return resolve();

			if (!node.callee) return resolve();

			if (!node.callee.type) return resolve();
			if (node.callee.type!=="Identifier") return resolve();

			if (!node.callee.name) return resolve();
			if (node.callee.name!=="css") return resolve();

			if (!node.arguments) return resolve();
			if (!(node.arguments instanceof Array)) return resolve();

			let args = node.arguments;
			if (args.length<1) return resolve();

			let arg = args[0];
			if (!arg) return resolve();

			if (!arg.type || !arg.value) return reject("css() statement was not syntactically valid.");
			if (arg.type==="TemplateLiteral") return resolve(); // template literals are allowed for raw content.
			if (arg.type!=="Literal") return reject("css() statement may only be a string literal.");

			let start = arg.start;
			let end = arg.end;
			let length = arg.value.length;
			let filename = arg.value;

			let data = null;
			if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
				if (!quiet) console.log("  "+filename);
				({data} = await loader(filename));
			}
			else {
				// data is not a filename and probably inline content.
				filename = resolveFilename(root,filename,[".css"]);
				if (!filename) return;

				if (!quiet) console.log("  "+filename);
				({data} = await loader(filename));
			}
			if (data===undefined || data===null) return reject("Could not find inline reference to "+filename+".");

			code = code.slice(0,start+offset)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end+offset);
			offset += (data.length-length);

			resolve({code,offset});
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const inlineAsset = function inlineAsset(root,code,offset,node,quiet) {
	return new Promise(async (resolve,reject)=>{
		try {
			if (!node) return resolve();

			if (!node.callee) return resolve();

			if (!node.callee.type) return resolve();
			if (node.callee.type!=="Identifier") return resolve();

			if (!node.callee.name) return resolve();
			if (node.callee.name!=="asset") return resolve();

			if (!node.arguments) return resolve();
			if (!(node.arguments instanceof Array)) return resolve();

			let args = node.arguments;
			if (args.length<1) return resolve();

			let arg = args.length===1 ? args[0] : args[1];
			if (!arg) return resolve();

			if (!arg.type || !arg.value) return reject("asset() statement was not syntactically valid.");
			if (arg.type==="TemplateLiteral") return resolve(); // template literals are allowed for raw content.
			if (arg.type!=="Literal") return reject("asset() statement may only be a string literal.");

			let start = arg.start;
			let end = arg.end;
			let length = arg.value.length;
			let filename = arg.value;

			let data = null;
			let mimetype = null;
			if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
				if (!quiet) console.log("  "+filename);
				({data,mimetype} = await loader(filename,filename,null));
			}
			else {
				// data is not a filename and probably inline content.
				filename = resolveFilename(root,filename,extensions);

				if (!filename) return;

				if (!quiet) console.log("  "+filename);
				({data,mimetype} = await loader(filename,filename,null));

				if (!mimetype) mimetype = AwesomeUtils.MimeTypes.getTypeForExtension(Path.extname(filename));
			}
			if (!data) return reject("Could not find inline reference to "+filename+".");

			if (!mimetype) return reject("asset() could not associate valid mime type with filename: "+filename);
			data = "data:"+mimetype+";base64,"+data.toString("base64");

			code = code.slice(0,start+offset)+"`"+data+"`"+code.slice(end+offset);
			offset += (data.length-length);

			resolve({code,offset});
		}
		catch (ex) {
			return reject(ex);
		}
	});
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
