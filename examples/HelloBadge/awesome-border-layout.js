// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

// import "./awesome-border-layout.js";
// import {ZephComponents,html,css} from "./Zeph.js";
//
// ZephComponents.define("awesome-border-layout",()=>{
// 	html("./awesome-border-layout.html");
// 	css("./awesome-border-layout.css");
// });

import "./awesome-border-layout.js";
import { ZephComponent,html,css } from "./Zeph.js";

ZephComponent("awesome-border-layout",class AwesomeHelloBadge {
	constructor() {
		console.log("start awesome-border-layout");
		html("./awesome-border-layout.html");
		css("./awesome-border-layout.css");
		console.log("stop awesome-border-layout");
	}
});
