// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

/* eslint-env node,mocha */

"use strict";

const assert = require("assert");

require("./BrowserMocks");
require("../src/AwesomeComponents");

describe("AwesomeComponents",function(){
	afterEach(()=>{
		window.AwesomeComponents.removeAllComponents();
	});

	it("methods",function(){
		assert(window.AwesomeComponents);
		assert(window.AwesomeComponents.import);
		assert(window.AwesomeComponents.components);
		assert(window.AwesomeComponents.getComponent);
		assert(window.AwesomeComponents.removeComponent);
		assert(window.AwesomeComponents.removeAllComponents);
	});

	it("import",async function(){
		await window.AwesomeComponents.import(`data:,
			name("test-component");
		`);
		assert(window.AwesomeComponents.components.indexOf("test-component")>-1);
		assert(window.AwesomeComponents.getComponent("test-component"));

		let component = window.AwesomeComponents.getComponent("test-component");
		assert(component);
		assert.equal(component.name,"test-component");
		assert(component.origin);
		assert(component.code);
		assert(component.markup);
		assert(component.style);
	});

	it("undefine",async function(){
		await window.AwesomeComponents.import(`data:,
			name("test-component");
		`);
		assert(window.AwesomeComponents.components.indexOf("test-component")>-1);

		window.AwesomeComponents.removeComponent("test-component");
		assert(window.AwesomeComponents.components.indexOf("test-component")<0);
	});

	it("collections",async function(){
		await window.AwesomeComponents.import(`data:,
			define(()=>{
				name("component-one");
			});

			define(()=>{
				name("component-two");
			});

			define(()=>{
				name("component-three");
			});
		`);
		assert.deepStrictEqual(window.AwesomeComponents.components,["component-one","component-two","component-three"]);
	});

	it("markup",async function(){
		await window.AwesomeComponents.import(`data:,
			name("test-component");
			html("this is html.");
		`);
		let component = window.AwesomeComponents.getComponent("test-component");
		assert.equal(component.markup.text,"this is html.");
	});

	it("style",async function(){
		await window.AwesomeComponents.import(`data:,
			name("test-component");
			css("this is css.");
		`);
		let component = window.AwesomeComponents.getComponent("test-component");
		assert.equal(component.style.text,"this is css.");
	});

	it("as",async function(){
		await window.AwesomeComponents.import(`data:,
			name("test-component");
		`,"my-test-comp");
		assert(window.AwesomeComponents.getComponent("my-test-comp"));
		assert(!window.AwesomeComponents.getComponent("test-component"));
	});


});
