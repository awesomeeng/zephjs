// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global requires,name,html,css,bindAttributes,onCreate,onEventAt */

"use strict";

const $BODY = Symbol("mistral-tab-body");
const $HEADER = Symbol("mistral-tab-header");

requires("mistral-tab");

name("mistral-tab-box");
html("./mistral-tab-box.html");
css("./mistral-tab-box.css");

bindAttributes("disabled",".tab-header");

onCreate((element,content)=>{
	let layout = element.getAttribute("layout") || "top";
	if (!element.hasAttribute("layout")) element.setAttribute("layout",layout);

	let header = content.querySelector(".header");

	let selected = element.querySelector("mistral-tab[selected]");
	let tabs = [...(element.querySelectorAll("mistral-tab"))];

	if (!selected) {
		selected = tabs[0];
		if (selected) selected.setAttribute("selected","");
	}

	tabs.forEach((tab)=>{
		let head = document.createElement("div");
		head[$BODY] = tab;
		tab[$HEADER] = head;
		if (tab.hasAttribute("selected")) head.setAttribute("selected","");
		head.classList.add("tab-header");
		head.textContent = tab.getAttribute("label") || tab.label || "Untitled";
		header.appendChild(head);
	});
});

onEventAt(".header > .tab-header","click",(event,selected,element,content)=>{
	if (element.hasAttribute("disabled")) return;

	let head = content.querySelector(".header > .tab-header[selected]");
	if (head) head.removeAttribute("selected");

	let body = element.querySelector("mistral-tab[selected]");
	if (body) body.removeAttribute("selected");

	selected.setAttribute("selected","");
	selected[$BODY].setAttribute("selected","");
});
