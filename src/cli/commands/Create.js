// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");
const FS = require("fs");

const AwesomeCLI = require("@awesomeeng/awesome-cli");

class Create extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();
	}

	get title() {
		return "zeph > create";
	}

	get description() {
		return "Create a new component with default JS, HTML, and CSS files.";
	}

	get usage() {
		return "zeph create <name> [filename]";
	}

	execute(args/*,options*/) {
		if (args.length===0) {
			this.help();
		}
		else {
			let name = args[0];
			if (name.indexOf("-")<0) {
				console.error("Component names must have a dash character '-' in them.");
				process.exit(1);
			}

			let js = args[1] || Path.resolve(process.cwd(),"./"+name+".js");
			let rootname = Path.basename(js,".js");
			let rootdir = Path.dirname(js);
			let html = Path.resolve(rootdir,rootname+".html");
			let htmlpath = "./"+rootname+".html";
			let css = Path.resolve(rootdir,rootname+".css");
			let csspath = "./"+rootname+".css";

			FS.writeFileSync(js,`
/*
	Generated ZephS component: ${name}

	ZephJS is copyright 2019, The Awesome Engineering Company
	and is released under the MIT licesne.
 */

/* global name, from, html, css, define, requires, load, onInit, onCreate, onAdd, onRemove, onAttribute, onEvent, onEventAt, binding, bindAttributes, bindAttributeToAttribute, bindAttributeToContent, bindAttributeToProperty, bindContentToAttribute, bindContents, bindContentToContent, bindContentToProperty, bindOtherAttributes, bindOtherAttributeToAttribute, bindOtherAttributeToContent, bindOtherAttributeToProperty, bindOtherContentToAttribute, bindOtherContents, bindOtherContentToContent, bindOtherContentToProperty */

"use strict";

name("${name}");
html("${htmlpath}");
css("${csspath}");

// Place your JS code here. See the ZephJS documentation for more information.

`);

			FS.writeFileSync(html,`
<!-- Place your ZephJS html code here. See the ZephJS documentation for more information. -->
`);

			FS.writeFileSync(css,`
/* Place your ZephJS CSS code here. See the ZephJS documentation for more information. */
`);

			console.log("Created component "+name+".");
			console.log("    JS > "+js);
			console.log("    HTML > "+html);
			console.log("    CSS > "+css);
		}
	}
}

module.exports = Create;
