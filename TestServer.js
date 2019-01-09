// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

// This is a server for running AwesomeComponents in a test mode.
// DO NOT USE OUTSIDE OF DEVELOPMENT.

"use strict";

/* eslint-env node */

const Log = require("@awesomeeng/awesome-log");
Log.start();

const AwesomeServer = require("@awesomeeng/awesome-server");

const $SERVER = Symbol("server");

class Server {
	constructor() {
		this[$SERVER] = new AwesomeServer();
	}

	get server() {
		return this[$SERVER];
	}

	start() {
		this.server.addHTTPServer({
			hostname: "localhost",
			port: 4000
		});
		this.server.route("*","*",(path,request)=>{
			Log.access("Request "+request.path+" from "+request.origin+".");
		});
		this.server.serve("/*",process.cwd());
		this.server.start();
	}
}

let server = new Server();
server.start();
