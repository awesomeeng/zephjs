// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,css,onCreate */

"use strict";

name("mistral-reset");
css("./mistral-reset.css");

let style = null;

onCreate((element,content)=>{
	if (style) return;

	style = content.querySelector("style");
	if (!style) return;

	document.head.prepend(style);
});
