// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global component,html,css */

"use strict";

component("component-one",()=>{
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

component("component-two",()=>{
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

component("component-three",()=>{
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
