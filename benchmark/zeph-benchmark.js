// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import "./zeph-benchmark-row.js";

import {ZephComponents,onAdd} from "../../zeph.min.js";

ZephComponents.define("zeph-benchmark",()=>{
	const rows = 10000;

	const runAppendTest = (element,content)=>{
		while (content.firstChild) content.removeChild(content.firstChild);

		let start = Date.now();
		new Array(rows).fill(0).forEach(()=>{
			let e = document.createElement("zeph-benchmark-row");
			content.appendChild(e);
		});
		return Date.now()-start;
	};

	onAdd((element,content)=>{
		console.log("Running performance tests...");

		setTimeout(()=>{
			let passes = 10;
			let total = 0;
			new Array(passes).fill(0).forEach(()=>{
				let spent = runAppendTest(element,content);
				total += spent;
				console.log(rows+" rows appended: "+spent+" ms.");
			});
			console.log("Average Total Time: "+(total/passes)+" ms.");
		},1000);
	});
});
