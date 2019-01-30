// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css,bindAttribute} from "../../Zeph.js";

ZephComponents.define("cool-quote",()=>{
	html("./cool-quote.html");
	css("./cool-quote.css");

	bindAttribute("quote","div.quote","$");
	bindAttribute("person","div.person","$");
});
