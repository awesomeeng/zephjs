// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint-disable no-console */

"use strict";

const Path = require("path");

const AwesomeCLI = require("@awesomeeng/awesome-cli");
const AwesomeServer = require("@awesomeeng/awesome-server");
const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

class Create extends AwesomeCLI.AbstractCommand {
	constructor() {
		super();

		this.addOption("port","string",4000,"Port number to serve on. Defaults to 4000.");
	}

	get title() {
		return "zeph > serve";
	}

	get description() {
		return "Creates a new Web Server on port 4000 for the purposes of testing.";
	}

	get usage() {
		return "zeph serve [--port <port>] [path_to_serve] [<path_to_server> ...]";
	}

	execute(args,options) {
		Log.start();

		let server = new AwesomeServer();

		server.addHTTPServer({
			hostname: "localhost",
			port: options.port
		});
		server.route("*","*",(path,request)=>{
			Log.access("Request "+request.method+" "+request.path+" from "+request.origin+".");
		});

		let zeph = AwesomeUtils.Module.resolve(module,"../../Zeph.js");
		if (!AwesomeUtils.FS.existsSync(zeph)) {
			console.error("Zeph.js was not found in the Zeph.js project root and is required. Please try reinstalling ZephJS from npm.");
			process.exit(1);
		}
		let zephmin = AwesomeUtils.Module.resolve(module,"../../../zeph.min.js");
		if (!AwesomeUtils.FS.existsSync(zephmin)) {
			console.error("zeph.min.js was not found in the Zeph.js project root and is required. Please try reinstalling ZephJS from npm.");
			process.exit(1);
		}
		let zephfull = AwesomeUtils.Module.resolve(module,"../../../zeph.full.js");
		if (!AwesomeUtils.FS.existsSync(zephfull)) {
			console.error("zeph.full.js was not found in the Zeph.js project root and is required. Please try reinstalling ZephJS from npm.");
			process.exit(1);
		}

		server.serve("/Zeph.js",zeph);
		server.serve("*/Zeph.js",zeph);
		server.serve("/zeph.min.js",zephmin);
		server.serve("*/zeph.min.js",zephmin);
		server.serve("/zeph.full.js",zephfull);
		server.serve("*/zeph.full.js",zephfull);
		Log.info("Serving ZephJS from "+Path.dirname(zephmin));

		let cwd = process.cwd();
		if (args.length<1) {
			server.serve("/*",cwd);
			Log.info("Serving /* from "+cwd);
		}
		else {
			args.forEach((arg)=>{
				let path,route;
				if (arg==="." || arg==="/" || arg==="./") {
					path = cwd;
					route = "/*";
				}
				else {
					path = Path.resolve(cwd,arg);
					route = ("/"+path.slice(cwd.length+1)).replace(/\/\.\//,"/");
				}

				if (path && route && AwesomeUtils.FS.existsSync(path)) {
					server.serve(route,path);
					Log.info("Serving "+route+" from "+path);
				}
				else {
					Log.warn("Path "+arg+" did not resolve to a valid file or directory; skipping.");
					return;
				}
			});
		}
		server.start();
	}
}

module.exports = Create;
