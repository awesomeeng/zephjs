// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,mapAttribute,onCreate */

"use strict";

name("mistral-form");
html("./mistral-form.html");
css("./mistral-form.css");

// inherited from FORM
mapAttribute("accept","input");
mapAttribute("accept-charset","input");
mapAttribute("action","input");
mapAttribute("autocapitalize","input");
mapAttribute("autocomplete","input");
mapAttribute("enctype","input");
mapAttribute("method","input");
mapAttribute("name","input");
mapAttribute("novalidate","input");
mapAttribute("target","input");

onCreate((element)=>{
	let makePath = function makePath(start,end) {
		if (start===end) return "";
		let name = start.name || undefined;
		if (name===undefined) return "";
		if (start.parentElement===document) return name;
		return makePath(start.parentElement,end)+"."+name;
	};

	Object.defineProperty(element,"value",{
		get: ()=>{
			let value = {};
			[...element.querySelectorAll("*")].forEach((e)=>{
				console.log(1,e,makePath(e,element));
				let name = e.name || e.getAttribute("name") || null;
				if (!name) return;

				let val = e.value || e.getAttribute("value") || undefined;
				if (val!==undefined) value[name] = val;
			});
			return value;
		},
		set: (value)=>{
			[...element.querySelectorAll("*")].forEach((e)=>{
				let name = e.name || e.getAttribute("name") || null;
				if (!name) return;
				let val = value && value[name];
				if (val!==undefined && val!==null) {
					e.setAttribute("value",val);
					e.value = val;
				}
				else if (val===0) {
					e.setAttribute("value",0);
					e.value = 0;
				}
				else {
					e.setAttribute("value","");
					e.value = "";
				}
			});
		}
	});
});
