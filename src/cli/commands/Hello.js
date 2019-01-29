// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");
const FS = require("fs");

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

class Create extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();
	}

	get title() {
		return "zeph > hello";
	}

	get description() {
		return "Creates the ZephJS Hello World example.";
	}

	get usage() {
		return "zeph hello";
	}

	execute(args/*,options*/) {
		if (args.length!==0) {
			this.help();
		}
		else {
			let js = args[1] || Path.resolve(process.cwd(),"./hello-world.js");
			let rootname = Path.basename(js,".js");
			let rootdir = Path.dirname(js);
			let index = Path.resolve(rootdir,"index.html");
			let html = Path.resolve(rootdir,rootname+".html");
			let css = Path.resolve(rootdir,rootname+".css");

			if (AwesomeUtils.FS.existsSync(index)) return console.error("File "+index+" already exists. Stopping to prevent overwritting.");
			if (AwesomeUtils.FS.existsSync(js)) return console.error("File "+js+" already exists. Stopping to prevent overwritting.");
			if (AwesomeUtils.FS.existsSync(html)) return console.error("File "+html+" already exists. Stopping to prevent overwritting.");
			if (AwesomeUtils.FS.existsSync(css)) return console.error("File "+css+" already exists. Stopping to prevent overwritting.");

			FS.writeFileSync(index,`
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>Hello World</title>

		<!-- Loads the ZephJS runtime -->
		<script src="Zeph.js" type="text/javascript"></script>

		<!-- Loads the hello-world component once ZephJS is ready. -->
		<script>
			document.addEventListener("zeph:initialized",()=>{
				Zeph.load("hello-world");
			});
		</script>

	</head>
	<body>
		<hello-world></hello-world>
	</body>
</html>
`);

			FS.writeFileSync(js,`
/*
	Generated ZephS component: hello-world

	ZephJS is copyright 2019, The Awesome Engineering Company
	and is released under the MIT licesne.
 */

/* global component,services,html,css,define,requires,load,bindAttribute,bindContent,bindAttributeAt,bindContentAt,onInit,onCreate,onAdd,onRemove,onAttribute,onEvent,onEventAt */

"use strict";

component("hello-world",()=>{
	html("./hello-world.html");
	css("./hello-world.css");

	bindAttribute("name",".output .name","$");

	onEventAt("input","keyup",(event,selected,element)=>{
		let value = selected.value;
		if (!value) element.removeAttribute("name");
		else element.setAttribute("name",value);
	});
});
`);

			FS.writeFileSync(html,`
<div class="input">
	<div>
		<label for="name">Enter your first name...</label>
		<input type="text" name="name"></input>
	</div>
</div>
<div class="output">
	<div class="hello">Hello there <span class="name"></span>!</div>
	<div class="greeting">It is a pleasure to meet you.</div>
</div>
`);

			FS.writeFileSync(css,`
:host {
	font-family: sans-serif;
}

.input {
	width: 400px;
	margin: 10px;
	padding: 10px;
	border: 1px solid black;
	background: #C0C0C0;
}

.input label {
	display: block;
	font-size: 18px;
}

.input input {
	display: block;
	font-size: 18px;
	font-weight: bold;
	border: 2px solid black;
	border-radius: 2px;
	background: #FFFFAA;
	width: 100%;
	padding: 5px 10px;
	box-sizing: border-box;
}

.output {
	width: 400px;
	display: grid;
	grid-row-gap: 10px;
	border: 1px solid black;
	background: #E0E0E0;
	margin: 10px;
	overflow: hidden;
	padding: 10px;
	word-break: break-word;
	opacity: 0;
	transition: opacity: 1s;
}

.output .hello {
	font-size: 24px;
}

.output .hello .name {
	font-weight: bold;
	text-transform: capitalize;
}

.output .greeting {
	font-size: 24px;
}

:host([name]) .output {
	opacity: 1;
	transition: opacity: 1s;
}
`);

			console.log("Created index.html.");
			console.log("Created component hello-world.");
			console.log("    JS > "+js);
			console.log("    HTML > "+html);
			console.log("    CSS > "+css);
		}
	}
}

module.exports = Create;
