// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css,bind} from "../../Zeph.js";

ZephComponents.define("cool-quote",()=>{
	html("./cool-quote.html");
	css("./cool-quote.css");

	bind("@quote","div.quote","$");
	bind("@person","div.person","$");
});
