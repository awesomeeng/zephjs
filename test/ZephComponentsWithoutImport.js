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

describe("ZephComponents without Importing Defintion Methods",function(){
	beforeEach(()=>{
		ZephComponents.names.forEach((name)=>{
			ZephComponents.undefine(name);
		});
	});

	it("methods",function(){
		assert(ZephComponents);
		assert(ZephComponents.components);
		assert(ZephComponents.names);
		assert(ZephComponents.has);
		assert(ZephComponents.get);
		assert(ZephComponents.define);
		assert(ZephComponents.undefine);
	});

	it("definition methods",async function(){
		await ZephComponents.define("text-component0",({from,alias,html,css,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt})=>{
			assert(from);
			assert(alias);
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
			assert(onProperty);
			assert(onEvent);
			assert(onEventAt);
		});
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
		let component = await ZephComponents.define("test-component2",({html,css,attribute,property,bind,bindAt,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt})=>{
			html("<div></div>",{
				noRemote: true
			});
			css("/*some css*/",{
				noRemote: true
			});

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
			onProperty("def",()=>{});

			onEvent("click",()=>{});
			onEventAt("div","click",()=>{});
		});

		assert(component);

		assert(component.name);
		assert.equal(component.name,"test-component2");

		assert(!component.from);

		assert(component.customElementClass);

		assert(component.context);

		assert(component.context.origin);

		assert(component.context.html);
		assert.equal(component.context.html.length,1);
		assert(component.context.html[0]);
		assert(component.context.html[0].template);

		assert(component.context.css);
		assert.equal(component.context.css.length,1);
		assert(component.context.css[0]);
		assert(component.context.css[0].template);

		assert(component.context.attributes);
		assert(component.context.attributes.xyz);
		assert.equal(component.context.attributes.xyz.initialValue,123);
		assert(component.context.attributes.def);
		assert.equal(component.context.attributes.def.initialValue,"abc");

		assert(component.context.properties);
		assert(component.context.properties.xyz);
		assert.equal(component.context.properties.xyz.propertyName,"xyz");
		assert.equal(component.context.properties.xyz.initialValue,456);
		assert.equal(component.context.properties.xyz.changes.length,0);
		assert(component.context.properties.def);
		assert.equal(component.context.properties.def.propertyName,"def");
		assert.equal(component.context.properties.def.initialValue,"ghi");
		assert.equal(component.context.properties.def.changes.length,1);

		assert(component.context.bindings);
		assert.equal(Object.keys(component.context.bindings).length,2);
		assert.equal(component.context.bindings[".:@xyz>div:@xyz"].source.element,".");
		assert.equal(component.context.bindings[".:@xyz>div:@xyz"].source.name,"@xyz");
		assert.equal(component.context.bindings[".:@xyz>div:@xyz"].target.element,"div");
		assert.equal(component.context.bindings[".:@xyz>div:@xyz"].target.name,"@xyz");
		assert.equal(component.context.bindings["div:@xyz>div:.xyz"].source.element,"div");
		assert.equal(component.context.bindings["div:@xyz>div:.xyz"].source.name,"@xyz");
		assert.equal(component.context.bindings["div:@xyz>div:.xyz"].target.element,"div");
		assert.equal(component.context.bindings["div:@xyz>div:.xyz"].target.name,".xyz");

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
		assert.equal(component.context.events[0].eventName,"click");
		assert.equal(component.context.eventsAt[0].eventName,"click");
	});

	it("inheritance",async function(){
		await ZephComponents.define("test-parent3",({html,css,attribute,property,bind,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onEvent,onEventAt})=>{
			html("<div>parent</div>",{
				noRemote: true
			});
			css("/*parent css*/",{
				noRemote: true
			});
			attribute("xyz",123);
			property("xyz",456);
			bind("@xyz","div");
			onInit(()=>{});
			onCreate(()=>{});
			onAdd(()=>{});
			onRemove(()=>{});
			onAdopt(()=>{});
			onAttribute("xyz",()=>{});
			onEvent("click",()=>{});
			onEventAt("div","click",()=>{});
		});
		let component = await ZephComponents.define("test-component3",({from,html,css,attribute,property,bind,onInit,onCreate,onAdd,onRemove,onAdopt,onAttribute,onProperty,onEvent,onEventAt})=>{
			from("test-parent3");
			html("<div>child</div>",{
				noRemote: true
			});
			css("/*child css*/",{
				noRemote: true
			});
			attribute("xyz",123);
			property("xyz",456);
			bind("@xyz","div");
			onInit(()=>{});
			onCreate(()=>{});
			onAdd(()=>{});
			onRemove(()=>{});
			onAdopt(()=>{});
			onAttribute("xyz",()=>{});
			onProperty("xyz",()=>{});
			onEvent("click",()=>{});
			onEventAt("div","click",()=>{});
		});

		assert(component);

		assert(component.name);
		assert.equal(component.name,"test-component3");

		assert(component.customElementClass);

		assert(component.context);

		assert(component.context.name);
		assert.equal(component.context.name,"test-component3");

		assert(component.context.from);
		assert.equal(component.context.from,"test-parent3");

		assert(component.context.origin);

		assert(component.context.html);
		assert.equal(component.context.html.length,2);
		assert(component.context.html[0]);
		assert(component.context.html[1]);

		assert(component.context.css);
		assert.equal(component.context.css.length,2);
		assert(component.context.css[0]);
		assert(component.context.css[1]);

		assert(component.context.attributes);
		assert.equal(Object.keys(component.context.attributes).length,1);
		assert(component.context.attributes.xyz);
		assert(component.context.properties);
		assert.equal(Object.keys(component.context.properties).length,1);
		assert(component.context.properties.xyz);

		assert(component.context.bindings);
		assert.equal(Object.keys(component.context.bindings).length,1);

		assert(component.context.lifecycle);
		assert(component.context.lifecycle.init);
		assert.equal(component.context.lifecycle.init.length,2);
		assert(component.context.lifecycle.create);
		assert.equal(component.context.lifecycle.create.length,2);
		assert(component.context.lifecycle.add);
		assert.equal(component.context.lifecycle.add.length,2);
		assert(component.context.lifecycle.remove);
		assert.equal(component.context.lifecycle.remove.length,2);
		assert(component.context.lifecycle.adopt);
		assert.equal(component.context.lifecycle.adopt.length,2);
		assert(component.context.lifecycle.init[0]);
		assert(component.context.lifecycle.create[0]);
		assert(component.context.lifecycle.add[0]);
		assert(component.context.lifecycle.remove[0]);
		assert(component.context.lifecycle.adopt[0]);
		assert(component.context.lifecycle.init[1]);
		assert(component.context.lifecycle.create[1]);
		assert(component.context.lifecycle.add[1]);
		assert(component.context.lifecycle.remove[1]);
		assert(component.context.lifecycle.adopt[1]);

		assert(component.context.lifecycle.attributes);
		assert.equal(Object.keys(component.context.lifecycle.attributes).length,1);
		assert.equal(component.context.lifecycle.attributes.xyz.length,2);
		assert(component.context.lifecycle.attributes.xyz[0]);
		assert(component.context.lifecycle.attributes.xyz[1]);

		assert(component.context.events);
		assert.equal(component.context.events.length,2);
		assert(component.context.events[0]);
		assert(component.context.events[1]);

		assert(component.context.eventsAt);
		assert.equal(component.context.eventsAt.length,2);
		assert(component.context.eventsAt[0]);
		assert(component.context.eventsAt[1]);
	});
});
