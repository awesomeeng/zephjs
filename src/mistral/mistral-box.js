// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,onCreate */

"use strict";

name("mistral-box");
html("./mistral-box.html");
css("./mistral-box.css");

onCreate((element,content)=>{
	// If we are already inside of a mistral-box, we do not
	// want to duplicate the style rules, so we remove the
	// style from the descendant node.
	let ancestors = [];
	let pn = element.parentNode;
	while (pn) {
		ancestors.push(pn);
		pn = pn.parentNode;
	}

	let ancestor = ancestors.reduce((found,ancestor)=>{
		if (found) return found;
		if (Object.getPrototypeOf(element)===Object.getPrototypeOf(ancestor)) return ancestor;
		return null;
	},null);

	if (ancestor) content.querySelctor("style").remove();

	let slot = content.querySelector("slot");
	slot.remove();

	element.querySelectorAll("*").forEach((child)=>{
		content.appendChild(child);
	});

});
