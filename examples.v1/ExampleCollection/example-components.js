// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css} from "./Zeph.js";

ZephComponents.define("component-one",()=>{
	html(`
		<div class="one">
			I am component one!
		</div>
	`);
	css(`
		:host {
			background: #FF0000;
		}
	`);
});

ZephComponents.define("component-two",()=>{
	html(`
		<div class="two">
			I am component two!
		</div>
	`);
	css(`
		:host {
			background: #FF0000;
		}
	`);
});

ZephComponents.define("component-three",()=>{
	html(`
		<div class="three">
			I am component three!
		</div>
	`);
	css(`
		:host {
			background: #FF0000;
		}
	`);
});
