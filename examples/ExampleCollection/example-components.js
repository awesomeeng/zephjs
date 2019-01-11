// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global define,name,html,css */

"use strict";

define(()=>{
	name("component-one");
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

define(()=>{
	name("component-two");
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

define(()=>{
	name("component-three");
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
