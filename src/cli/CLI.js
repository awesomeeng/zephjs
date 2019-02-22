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

		this.addCommand("create",AwesomeUtils.Module.resolve(module,"./commands/Create.js"));
		this.addCommand("hello",AwesomeUtils.Module.resolve(module,"./commands/Hello.js"));
		this.addCommand("helloworld",AwesomeUtils.Module.resolve(module,"./commands/Hello.js"));
		this.addCommand("new",AwesomeUtils.Module.resolve(module,"./commands/Create.js"));
		this.addCommand("bundle",AwesomeUtils.Module.resolve(module,"./commands/Bundle.js"));
		this.addCommand("serve",AwesomeUtils.Module.resolve(module,"./commands/Serve.js"));
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

	run(args,options) {
		({args,options} = this.init(args,options));

		if (args.length<1) {
			this.help();
			return Promise.resolve();
		}
		else {
			return super.run(args,options);
		}
	}
}

new CLI().run();
