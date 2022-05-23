// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com
/* eslint-disable no-console */
"use strict";
const Path = require("path");
const FS = require("fs");
const AwesomeUtils = require("@awesomeeng/awesome-utils");
const AwesomeCLI = require("@awesomeeng/awesome-cli");
class Create extends AwesomeCLI.AbstractCommand {
    constructor() {
        super();
        this.addOption("nozeph", "boolean", false, "Do not copy ZephJS into the local folder when creating a new component.");
        this.addOptionShortcut("no-zeph", "nozeph");
    }
    get title() {
        return "zeph > create";
    }
    get description() {
        return "Create a new component with default JS, HTML, and CSS files.";
    }
    get usage() {
        return "zeph create [options] <name> [filename]";
    }
    execute(args, options) {
        if (args.length === 0) {
            this.help();
        }
        else {
            let name = args[0];
            if (name.indexOf("-") < 0) {
                console.error("Component names must have a dash character '-' in them.");
                process.exit(1);
            }
            let js = args[1] || Path.resolve(process.cwd(), "./" + name + ".js");
            let rootname = Path.basename(js, ".js");
            let rootdir = Path.dirname(js);
            let html = Path.resolve(rootdir, rootname + ".html");
            let htmlpath = "./" + rootname + ".html";
            let css = Path.resolve(rootdir, rootname + ".css");
            let csspath = "./" + rootname + ".css";
            let zephmin = Path.resolve(rootdir, "zeph.min.js");
            let zephminsource = AwesomeUtils.Module.resolve(module, "../../../zeph.min.js");
            let zephfull = Path.resolve(rootdir, "Zeph.js");
            let zephfullsource = AwesomeUtils.Module.resolve(module, "../../../src/Zeph.js");
            if (AwesomeUtils.FS.existsSync(js))
                return console.error("File " + js + " already exists. Stopping to prevent overwritting.");
            if (AwesomeUtils.FS.existsSync(html))
                return console.error("File " + html + " already exists. Stopping to prevent overwritting.");
            if (AwesomeUtils.FS.existsSync(css))
                return console.error("File " + css + " already exists. Stopping to prevent overwritting.");
            if (!options.nozeph && !AwesomeUtils.FS.existsSync(zephmin)) {
                FS.writeFileSync(zephmin, FS.readFileSync(zephminsource));
                console.log("Copied zeph.min.js locally.");
            }
            if (!options.nozeph && !AwesomeUtils.FS.existsSync(zephfull)) {
                FS.writeFileSync(zephfull, FS.readFileSync(zephfullsource));
                console.log("Copied Zeph.js locally.");
            }
            let index = Path.resolve(rootdir, "index.html");
            if (!AwesomeUtils.FS.existsSync(index)) {
                FS.writeFileSync(index, `
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>${name}</title>

		<!-- Loads the ${name} component. -->
		<script src="${name}.js" type="module"></script>
	</head>
	<body>
		<${name}></${name}>
	</body>
</html>
`);
                console.log("Create example index.html file.");
            }
            FS.writeFileSync(js, `
/*
	Generated ZephS component: ${name}

	ZephJS is copyright 2019, The Awesome Engineering Company
	and is released under the MIT licesne.
 */

import {ZephComponents,html,css} from "./Zeph.js";

ZephComponents.define("${name}",()=>{
	html("${htmlpath}");
	css("${csspath}");

	// Place your compnent defintion calls here. See the ZephJS documentation for more information.
});
`);
            FS.writeFileSync(html, `
<!-- Place your ZephJS html code here. See the ZephJS documentation for more information. -->
`);
            FS.writeFileSync(css, `
/* Place your ZephJS CSS code here. See the ZephJS documentation for more information. */
`);
            console.log("Created component " + name + ".");
            console.log("    JS > " + js);
            console.log("    HTML > " + html);
            console.log("    CSS > " + css);
        }
    }
}
module.exports = Create;
