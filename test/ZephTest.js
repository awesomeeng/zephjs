// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

/* eslint-env node,mocha */

"use strict";

const assert = require("assert");

require("./BrowserMocks");
require("../src/Zeph");

describe("Zeph",function(){
	afterEach(()=>{
		window.Zeph.removeAllComponents();
	});

	it("methods",function(){
		assert(window.Zeph);
		assert(window.Zeph.load);
		assert(window.Zeph.define);
		assert(window.Zeph.components);
		assert(window.Zeph.getComponent);
		assert(window.Zeph.removeComponent);
		assert(window.Zeph.removeAllComponents);
	});

	it("load",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{});
		`);

		assert(window.Zeph.components.indexOf("test-component")>-1);
		assert(window.Zeph.getComponent("test-component"));

		let component = window.Zeph.getComponent("test-component");
		assert(component);
		assert.equal(component.name,"test-component");
		assert(component.origin);
		assert(component.code);
		assert(component.markup);
		assert(component.style);
	});

	it("undefine",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{});
		`);
		assert(window.Zeph.components.indexOf("test-component")>-1);

		window.Zeph.removeComponent("test-component");
		assert(window.Zeph.components.indexOf("test-component")<0);
	});

	it("collections",async function(){
		await window.Zeph.load(`data:,
			component("component-one",()=>{});
			component("component-two",()=>{});
			component("component-three",()=>{});
		`);
		assert.deepStrictEqual(window.Zeph.components,["component-one","component-two","component-three"]);
	});

	it("markup",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{
				html("this is html.");
			});
		`);
		let component = window.Zeph.getComponent("test-component");
		assert.equal(component.markup[0].text,"this is html.");
	});

	it("style",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{
				css("this is css.");
			});
		`);
		let component = window.Zeph.getComponent("test-component");
		assert.equal(component.style[0].text,"this is css.");
	});

	it("as",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{});
		`,"my-test-comp");
		assert(window.Zeph.getComponent("my-test-comp"));
		assert(!window.Zeph.getComponent("test-component"));
	});

	it("as prefix",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{});
		`,"wonderful-*");
		assert(window.Zeph.getComponent("wonderful-test-component"));
		assert(!window.Zeph.getComponent("test-component"));
	});

	it("as suffix",async function(){
		await window.Zeph.load(`data:,
			component("test-component",()=>{});
		`,"*-wonderful");
		assert(window.Zeph.getComponent("test-component-wonderful"));
		assert(!window.Zeph.getComponent("test-component"));
	});

	it("as collection prefix",async function(){
		await window.Zeph.load(`data:,
			component("component-one",()=>{});
			component("component-two",()=>{});
			component("component-three",()=>{});
		`,"testing-*");
		assert.deepStrictEqual(window.Zeph.components,["testing-component-one","testing-component-two","testing-component-three"]);
	});

	it("as collection suffix",async function(){
		await window.Zeph.load(`data:,
			component("component-one",()=>{});
			component("component-two",()=>{});
			component("component-three",()=>{});
		`,"*-for-testing");
		assert.deepStrictEqual(window.Zeph.components,["component-one-for-testing","component-two-for-testing","component-three-for-testing"]);
	});
});
