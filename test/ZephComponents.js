// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

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

const ZephComponents = require("../src/Zeph.js").ZephComponents;
const {html,css,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onEvent,onEventAt} = require("../src/Zeph.js");

describe("Zeph",function(){
	it("methods",function(){
		assert(ZephComponents);
		assert(ZephComponents.components);
		assert(ZephComponents.names);
		assert(ZephComponents.has);
		assert(ZephComponents.get);
		assert(ZephComponents.define);
		assert(ZephComponents.undefine);
	});

	it("definition methods",function(){
		assert(html);
		assert(css);
		assert(attribute);
		assert(property);
		assert(bind);
		assert(bindAt);
		assert(onInit);
		assert(onCreate);
		assert(onAdd);
		assert(onRemove);
		assert(onAdopt);
		assert(onAttribute);
		assert(onEvent);
		assert(onEventAt);
	});

	it("define/undefine",async function(){
		assert(ZephComponents.names.indexOf("test-component1")<0);
		assert(!ZephComponents.has("test-component1"));
		assert(!ZephComponents.get("test-component1"));

		await ZephComponents.define("test-component1",()=>{});
		assert(ZephComponents.names.indexOf("test-component1")>-1);
		assert(ZephComponents.has("test-component1"));
		assert(ZephComponents.get("test-component1"));

		await ZephComponents.undefine("test-component1");
		assert(ZephComponents.names.indexOf("test-component1")<0);
		assert(!ZephComponents.has("test-component1"));
		assert(!ZephComponents.get("test-component1"));
	});

	it("context",async function(){
		let component = await ZephComponents.define("test-component1",()=>{
			html("<div></div>");
			css("/*some css*/");

			attribute("xyz",123);
			attribute("def","abc");

			property("xyz",456);
			property("def","ghi");

			bind("@xyz","div");
			bindAt("div","@xyz","div",".xyz");

			onInit(()=>{});
			onCreate(()=>{});
			onAdd(()=>{});
			onRemove(()=>{});
			onAdopt(()=>{});
			onAttribute("xyz",()=>{});

			onEvent("click",()=>{});
			onEventAt("div","click",()=>{});
		});

		assert(component);
		assert(component.name);
		assert(component.customElementClass);
		assert(component.context);
		assert(component.context.origin);
		assert(component.context.html);
		assert(component.context.css);
		assert(component.context.attributes);
		assert(component.context.attributes.xyz);
		assert(component.context.attributes.def);
		assert(component.context.bindings);
		assert(component.context.lifecycle);
		assert(component.context.lifecycle.init);
		assert(component.context.lifecycle.create);
		assert(component.context.lifecycle.add);
		assert(component.context.lifecycle.remove);
		assert(component.context.lifecycle.adopt);
		assert(component.context.lifecycle.attributes);
		assert(component.context.lifecycle.init[0]);
		assert(component.context.lifecycle.create[0]);
		assert(component.context.lifecycle.add[0]);
		assert(component.context.lifecycle.remove[0]);
		assert(component.context.lifecycle.adopt[0]);
		assert(component.context.lifecycle.attributes);
		assert(component.context.lifecycle.attributes.xyz);
		assert(component.context.lifecycle.attributes.xyz[0]);
		assert(component.context.events);
		assert(component.context.events[0]);
		assert(component.context.eventsAt);
		assert(component.context.eventsAt[0]);

		assert.equal(component.name,"test-component1");
		assert.equal(component.context.attributes.xyz.initialValue,123);
		assert.equal(component.context.attributes.def.initialValue,"abc");
		assert.equal(component.context.bindings.length,2);
		assert.deepStrictEqual(component.context.html,["<div></div>"]);
		assert.deepStrictEqual(component.context.css,["/*some css*/"]);
		assert.equal(component.context.bindings[0].source.element,".");
		assert.equal(component.context.bindings[0].source.name,"@xyz");
		assert.equal(component.context.bindings[0].target.element,"div");
		assert.equal(component.context.bindings[0].target.name,"@xyz");
		assert.equal(component.context.bindings[1].source.element,"div");
		assert.equal(component.context.bindings[1].source.name,"@xyz");
		assert.equal(component.context.bindings[1].target.element,"div");
		assert.equal(component.context.bindings[1].target.name,".xyz");
		assert.equal(component.context.events[0].eventName,"click");
		assert.equal(component.context.eventsAt[0].eventName,"click");
	});
});
