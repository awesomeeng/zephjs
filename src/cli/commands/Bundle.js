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
	}

	get title() {
		return "zeph > bundle";
	}

	get description() {
		return "Bundle a collection of components into a single file.";
	}

	get usage() {
		return "zeph bundle [--quiet] <source_filename> <target_filename>";
	}

	execute(args,options) {
		let quiet = options.quiet;

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

			return this.rollup(source,target,quiet);
		}
	}

	rollup(source,target,quiet) {
		const zeph = AwesomeUtils.Module.resolve(module,"../../Zeph.js");

		const resolvePlugin = {
			name: "rollup-zephjs-resolver-plugin",
			resolveId(source) {
				if (source.match(/(\/|\\)[Zz]eph\.js$/)) return zeph;
				return null;
			}
		};

		const inlinePlugin = {
			name: "rollup-zephjs-inline-plugin",
			transform(code,origin) {
				return (origin.match(/(\/|\\)[Zz]eph\.js$/)) ? null : inlineReferences(code,origin,quiet);
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

const loader = function loader(url,rootDir) {
	if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("ftp:")) {
		// load via request
	}
	else {
		url = Path.resolve(rootDir,url);
		return FS.readFileSync(url,{
			encoding: "utf-8"
		});
	}
};

const inlineReferences = function inlineReferences(code,origin,quiet) {
	if (!quiet) console.log(origin);

	let root = Path.dirname(origin);

	let tokens = [...Acorn.tokenizer(code,{
		ecmaVersion: 10
	})];

	let offset = 0;
	tokens.forEach((token,i)=>{
		if (!token || !token.type || !token.type.label || !token.value) return;
		if (token.type.label==="name" && (token.value==="html" || token.value==="css") && tokens[i+1] && tokens[i+1].type && tokens[i+1].type.label && tokens[i+1].type.label==="(") {
			let content = tokens[i+2];
			let following = tokens[i+3];
			if (!content || !content.type || !content.type.label) {
				console.error("ERROR: "+origin+": "+token.value+"() statement was not syntactically valid.");
				process.exit();
			}

			let filename;
			if (content.type.label==="`" && following && following.type && following.type.label && following.type.label==="template") {
				filename = following.value;
			}
			else if (content.type.label==="string" && following && following.type && following.type.label && following.type.label===")") {
				filename = content.value;
			}
			else {
				console.log(0,code);
				console.log(0,tokens[i]);
				console.log(1,tokens[i+1]);
				console.log(2,tokens[i+2]);
				console.log(3,tokens[i+3]);
				console.error("ERROR: "+origin+": "+token.value+"() statement may only be a string literal.");
				process.exit();
			}

			let data = null;
			if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
				if (!quiet) console.log("  "+filename);
				data = loader(filename);
			}
			else {
				filename = Path.resolve(root,filename);
				if (!AwesomeUtils.FS.existsSync(filename)) {
					filename += ".js";
					if (!AwesomeUtils.FS.existsSync(filename)) {
						// data is not a filename and probably inline content.
						return;
					}
				}
				if (!quiet) console.log("  "+filename);
				data = loader(filename);
			}

			if (!data) {
				console.error("ERROR: "+origin+": Could not find inline reference to "+filename+".");
				process.exit();
			}

			let start = content.start+offset;
			let end = content.end+offset;

			code = code.slice(0,start)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end);
			offset += (data.length-content.value.length);
		}
	});

	return code;
};

module.exports = Bundle;
