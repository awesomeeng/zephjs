// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");
const FS = require("fs");

const Acorn = require("acorn");

const AwesomeCLI = require("@awesomeeng/awesome-cli");

class Bundle extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();
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
		if (args.length===0) {
			this.help();
		}
		else {
			let target = args.shift();
			target = Path.resolve(process.cwd(),target);

			args.forEach((source)=>{
				source = Path.resolve(process.cwd(),source);
				console.log("Including "+source);

				let data = FS.readFileSync(source);
				if (data instanceof Buffer) data = data.toString("utf-8");

				let tokens = [];
				let tokenizer = Acorn.tokenizer(data,{
					ecmaVersion: 10,
					onToken: tokens
				});

				let offset = 0;
				while(true) {
					let token = tokenizer.getToken();
					if (token.type && token.type.label && token.type.label==="eof") break;

					if (token && token.type && token.type.label && token.value) {
						if (token.type.label==="name" && token.value==="html") {
							tokenizer.getToken();
							let content = tokenizer.getToken();
							let loaded = loader(content.value,Path.dirname(source));
							if (loaded instanceof Buffer) loaded = loaded.toString("utf-8");
							data = data.substring(0,offset+content.start) + '`' + loaded + '`' + data.substring(offset+content.end);
							offset += (loaded.length)-(content.value.length);
						}
						if (token.type.label==="name" && token.value==="css") {
							tokenizer.getToken();
							let content = tokenizer.getToken();
							let loaded = loader(content.value,Path.dirname(source));
							if (loaded instanceof Buffer) loaded = loaded.toString("utf-8");
							data = data.substring(0,offset+content.start) + '`' + loaded.replace(/`/,"\\`") + '`' + data.substring(offset+content.end);
							offset += (loaded.length)-(content.value.length);
						}
					}
				}

				console.log("define(\""+data+"\");");
			});

		}
	}
}

const loader = function loader(url,rootDir) {
	if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("ftp:")) {
		// load via request
		console.log("    Downloading "+url);
	}
	else {
		url = Path.resolve(rootDir,url);
		console.log("    Reading "+url);
		return FS.readFileSync(url);
	}
};

module.exports = Bundle;
