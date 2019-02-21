// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

/* eslint-env node,mocha */

"use strict";

// we need to use ESM here because our browser module
// uses ES6 modules, which node doesnt support.

/* eslint-disable no-global-assign */
require = require("esm")(module/*, options*/);
/* eslint-enable no-global-assign */

// BrowserMocks fakes the window and document Object
// for us so we can run these tests in node.
require("./BrowserMocks");

const assert = require("assert");

const ZephService = require("../src/Zeph.js").ZephService;
const ZephServices = require("../src/Zeph.js").ZephServices;

describe("Zeph",function(){
	it("methods",function(){
		assert(ZephService);
		assert(ZephServices);
		assert(ZephServices.services);
		assert(ZephServices.names);
		assert(ZephServices.has);
		assert(ZephServices.get);
		assert(ZephServices.register);
		assert(ZephServices.unregister);
	});

	it("register/unregister",function(){
		let test1 = new (class TestService extends ZephService {
			constructor() {
				super();
			}

			getSomething() {
				return "something";
			}
		})();

		assert(ZephServices.names.indexOf("test1")<0);
		assert(!ZephServices.has("test1"));
		assert(!ZephServices.get("test1"));

		ZephServices.register("test1",test1);
		assert(ZephServices.names.indexOf("test1")>-1);
		assert(ZephServices.has("test1"));
		assert(ZephServices.get("test1"));

		ZephServices.unregister("test1");
		assert(ZephServices.names.indexOf("test1")<0);
		assert(!ZephServices.has("test1"));
		assert(!ZephServices.get("test1"));
	});

	it("encapsulation",function(){
		let test1 = new (class TestService extends ZephService {
			constructor() {
				super();
			}

			getSomething() {
				return "something";
			}
		})();
		let test2 = new (class TestService extends ZephService {
			constructor() {
				super();
			}

			getSomething() {
				return "something else";
			}
		})();

		ZephServices.register("test1",test1);
		ZephServices.register("test2",test2);

		assert.equal(ZephServices.services.test1.getSomething(),"something");
		assert.equal(ZephServices.services.test2.getSomething(),"something else");
		assert.equal(ZephServices.services.test1.getSomething(),"something");
		assert.equal(ZephServices.services.test1.getSomething(),"something");
		assert.equal(ZephServices.services.test2.getSomething(),"something else");
		assert.equal(ZephServices.services.test1.getSomething(),"something");
		assert.equal(ZephServices.services.test1.getSomething(),"something");
		assert.equal(ZephServices.services.test2.getSomething(),"something else");
		assert.equal(ZephServices.services.test2.getSomething(),"something else");
		assert.equal(ZephServices.services.test2.getSomething(),"something else");

		ZephServices.unregister("test1");
		ZephServices.unregister("test2");
	});

	it("events",function(done){
		let test1 = new (class TestService extends ZephService {
			constructor() {
				super();
			}

			getSomething() {
				return "something";
			}
		})();

		let x = 2;
		document.addEventListener("zeph:service:registered",()=>{
			x *= 7;
			assert.equal(x,14);
		});
		document.addEventListener("zeph:service:unregistered",()=>{
			x -= 1;

			assert.equal(x,13);

			done();
		});

		ZephServices.register("test1",test1);
		ZephServices.unregister("test1");
	});
});
