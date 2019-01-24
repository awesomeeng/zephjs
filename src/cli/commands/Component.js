// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeUtils = require("@awesomeeng/awesome-utils");


class Component extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();

		this.addCommand("create",AwesomeUtils.Module.resolve(module,"./component/Create.js"));
	}

	get title() {
		return "zeph > component";
	}

	get description() {
		return "Utilities for deling with ZephJS components.";
	}

	get usage() {
		return "zeph component <command>";
	}
}

module.exports = Component;
