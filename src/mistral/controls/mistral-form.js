// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,bindAttributes,onCreate */

"use strict";

name("mistral-form");
html("./mistral-form.html");
css("./mistral-form.css");

// inherited from FORM
bindAttributes("accept","input");
bindAttributes("accept-charset","input");
bindAttributes("action","input");
bindAttributes("autocapitalize","input");
bindAttributes("autocomplete","input");
bindAttributes("enctype","input");
bindAttributes("method","input");
bindAttributes("name","input");
bindAttributes("novalidate","input");
bindAttributes("target","input");

onCreate((element)=>{
	let get = (elements,value=null)=>{
		elements.forEach((child)=>{
			if (!child) return;
			let name = child.name || child.getAttribute("name") || null;
			let val = child.value || child.getAttribute("value") || undefined;
			if (name!==undefined && name!==null && val!==undefined) {
				value = value || {};
				value[name] = val;
			}
			else if (name!==undefined && name!==null) {
				val = get([...child.children]);
				if (val!==undefined && val!==null) value[name] = val;
			}
			else {
				get([...child.children],value);
			}
		});
		return value;
	};

	let set = (elements,value)=>{
		elements.forEach((child)=>{
			if (!child) return;
			let name = child.name || child.getAttribute("name") || null;
			if (name!==undefined && name!==null) {
				let val = value[name];
				if (val!==undefined && typeof val!=="object") {
					child.setAttribute("value",val);
				}
				else if (typeof val==="object"){
					set([...child.children],val);
				}
			}
			else {
				set([...child.children],value);
			}
		});
	};

	Object.defineProperty(element,"value",{
		get: ()=>{
			return get([...element.children],{});
		},
		set: (value)=>{
			set([...element.children],value);
		}
	});

	this.value = {fields: { username: "glen"}};
});
