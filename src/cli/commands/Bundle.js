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

		this.addOption("target","string",null,"Directs where to write the resulting bundle. Defaults to stdout.");
		this.addOption("no-zeph","boolean",false,"If set, the ZephJS library will not be included in the bundle.");

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

	execute(args,options) {
		this.refs = {};

		let quiet = options.quiet || !options.target;

		if (args.length===0) {
			this.help();
		}
		else {
			let target = options.target || null;
			if (target) {
				target = Path.resolve(process.cwd(),target);
				if (!target.endsWith(".js")) target += ".js";
			}

			// read our source arguments
			args.forEach((name)=>{
				this.readSource(name,process.cwd(),quiet);
			});

			// process each ref's html and css tags and inline them if needed.
			Object.values(this.refs).forEach((ref)=>{
				this.processTokens(ref,quiet);
			});

			// Compute ordering based on required references
			let order = this.computeOrder();

			this.writeTarget(order,target,options,quiet);
		}
	}

	readSource(source,rootDir,quiet) {
		source = source && Path.resolve(rootDir,source) || Path.resolve(rootDir,name);
		if (!AwesomeUtils.FS.existsSync(source)) {
			if (!source.endsWith(".js") && AwesomeUtils.FS.existsSync(source+".js")) {
				source += ".js";
			}
			else {
				console.error("Unable to find source reference "+source);
				process.exit();
			}
		}
		if (this.refs[source]) return;

		if (!quiet) console.log("Including  "+source);

		let root = Path.dirname(source);

		let code = FS.readFileSync(source);
		if (code instanceof Buffer) code = code.toString("utf-8");

		let tokens = [...Acorn.tokenizer(code,{
			ecmaVersion: 10
		})];

		let required = [];
		tokens.forEach((token,i)=>{
			if (!token || !token.type || !token.type.label || !token.value) return;
			if (token.type.label==="name" && (token.value==="load" || token.value==="requires")) {
				let content = tokens[i+2];
				let following = tokens[i+3];
				if (!content || !content.type || !content.type.label || !content.value) {
					console.error("ERROR: "+source+": load or requires statement was not syntactically valid.");
					process.exit();
				}
				if (content.type.label!=="string" || !following || !following.type || !following.type.label || following.type.label!==")") {
					console.error("ERROR: "+source+": load or requires statement may only be a string literal.");
					process.exit();
				}
				let req = this.readSource(content.value,root,quiet);
				if (req) required.push(req);
			}
		});

		let ref = {
			root,
			source,
			tokens,
			required,
			code
		};
		this.refs[source] = ref;

		return ref;
	}

	processTokens(ref,quiet) {
		let offset = 0;

		ref.tokens.forEach((token,i)=>{
			if (!token || !token.type || !token.type.label || !token.value) return;
			if (token.type.label==="name" && (token.value==="load" || token.value==="requires")) {
				let pos = i;
				let next;
				while (pos<ref.tokens.length) {
					next = ref.tokens[pos];
					if (next && next.type && next.type.label && next.type.label===";") break;
					pos += 1;
				}
				if (!next) {
					console.error("ERROR: "+ref.source+": "+token.value+"() statement was not syntactically valid.");
					process.exit();
				}

				let start = token.start+offset;
				let end = next.end+offset;

				let code = ref.code;
				code = code.slice(0,start)+"/*"+code.slice(start,end)+"*/"+code.slice(end);
				ref.code = code;

				offset += 4;

			}
			else if (token.type.label==="name" && (token.value==="html" || token.value==="css")) {
				let content = ref.tokens[i+2];
				let following = ref.tokens[i+3];
				if (!content || !content.type || !content.type.label || !content.value) {
					console.error("ERROR: "+ref.source+": "+token.value+"() statement was not syntactically valid.");
					process.exit();
				}
				if (content.type.label!=="string" || !following || !following.type || !following.type.label || following.type.label!==")") {
					console.error("ERROR: "+ref.source+": "+token.value+"() statement may only be a string literal.");
					process.exit();
				}

				let filename = content.value;
				let data = null;
				if (filename.startsWith("http:") || filename.startsWith("https:") || filename.startsWith("ftp:")) {
					if (!quiet) console.log("Inlining   "+filename);
					data = loader(filename);
				}
				else {
					filename = Path.resolve(ref.root,filename);
					if (!AwesomeUtils.FS.existsSync(filename)) {
						filename += ".js";
						if (!AwesomeUtils.FS.existsSync(filename)) {
							// data is not a filename and probably inline content.
							return;
						}
					}
					if (!quiet) console.log("Inlining   "+filename);
					data = loader(filename);
				}

				if (!data) {
					console.error("ERROR: "+ref.source+": Could not find inline reference to "+filename+".");
					process.exit();
				}

				let start = content.start+offset;
				let end = content.end+offset;

				let code = ref.code;
				code = code.slice(0,start)+"`"+data.replace(/`/g,"\\`")+"`"+code.slice(end);
				ref.code = code;

				offset += (data.length-content.value.length);
			}
		});
	}

	computeOrder(source) {
		if (!source) return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten(Object.keys(this.refs).map((source)=>{
			return this.computeOrder(source);
		}))));

		let ref = this.refs[source];
		if (!ref) {
			console.error("ERROR: Invalid reference "+source+".");
			process.exit();
		}

		return AwesomeUtils.Array.unique(AwesomeUtils.Array.compact(AwesomeUtils.Array.flatten((ref.required||[]).map((ref)=>{
			return this.computeOrder(ref.source);
		}).concat(ref))));
	}

	writeTarget(refs,target,options,quiet) {
		if (AwesomeUtils.FS.existsSync(target)) FS.unlinkSync(target);

		// generate the header
		if (!quiet) console.log("Outputting Header");
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
		let zeph = "";
		if (!options["no-zeph"]) {
			if (!quiet) console.log("Outputting Zeph.js");
			zeph = FS.readFileSync(AwesomeUtils.Module.resolve(module,"../../Zeph.js"));
		}
		else {
			if (!quiet) console.log("Skipping   Zeph.js");
		}

		// generate the components
		let components = "";
		refs.forEach((ref)=>{
			if (!quiet) console.log("Outputting "+ref.source);
			let code = ref.code.replace(/`/g,"\\`");
			let origin = Path.basename(ref.source);
			components += `Zeph.define(\`${code}\`,null,"${origin}");\n`;
		});

		// Now write it all out
		let data = `
${header}

let existing = window.Zeph;
${zeph}

document.addEventListener("zeph:initialized",()=>{
	let Zeph = window.Zeph;
	window.Zeph = existing;

	${components}
});
`;

		// Write it all out to target.
		if (target) {
			if (!quiet) console.log("\nWritten    "+target+".");
			FS.appendFileSync(target,data,{
				encoding: "utf-8",
				flags: "as"
			});

		}
		else {
			process.stdout.write(data);
			process.stdout.write("\n");
		}
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

module.exports = Bundle;
