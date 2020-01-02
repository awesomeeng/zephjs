// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

// import "./awesome-border-layout.js";
// import * as Zeph from "./Zeph.js";
//
// Zeph.ZephComponents.define("awesome-hello-badge",()=>{
// 	Zeph.html("./awesome-hello-badge.html");
// 	Zeph.css("./awesome-hello-badge.css");
// });

import "./awesome-border-layout.js";
import { ZephComponent,html,css } from "./Zeph.js";

ZephComponent("awesome-hello-badge",class AwesomeHelloBadge {
	constructor() {
		console.log("start awesome-hello-badge");
		html("./awesome-hello-badge.html");
		css("./awesome-hello-badge.css");
		console.log("stop awesome-hello-badge");
	}
});
