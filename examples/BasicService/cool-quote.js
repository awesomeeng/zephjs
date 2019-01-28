// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global component,html,css,bindAttribute */

"use strict";

component("cool-quote",()=>{
	html("./cool-quote.html");
	css("./cool-quote.css");

	bindAttribute("quote","div.quote","$");
	bindAttribute("person","div.person","$");
});
