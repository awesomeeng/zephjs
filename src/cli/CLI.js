// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

class CLI extends AwesomeCLI.CommandCLI {
	constructor() {
		super();

		// this.addOption("something","boolean",true,"Toggles something on/off.");
		// this.addOption("another","string",null,"Provides input to your CLI.");
		// this.addOptionShortcut("a","another"); // maps --a to --another

		this.addCommand("component",AwesomeUtils.Module.resolve(module,"./commands/Component.js"));
		this.addCommand("comp",AwesomeUtils.Module.resolve(module,"./commands/Component.js"));
		this.addCommand("bundle",AwesomeUtils.Module.resolve(module,"./commands/Bundle.js"));
	}

	get title() {
		return "zeph";
	}

	get description() {
		return "ZephJS utility for working with web components.";
	}

	get usage() {
		return "zeph [command]";
	}
}

new CLI().run();
