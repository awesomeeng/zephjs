// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global from,onCreate,onAdd,onRemove,onAttribute */

"use strict";

from(HTMLElement);

onCreate(()=>{
	console.log("main create");
});

onAdd(()=>{
	console.log("main add");
});

onRemove(()=>{
	console.log("main remove");
});

onAttribute("hello",(...args)=>{
	console.log("main hello changed",args);
});

onAttribute("world",(...args)=>{
	console.log("main world changed",args);
});
