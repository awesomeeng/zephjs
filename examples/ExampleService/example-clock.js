// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css,onCreate} from "./Zeph.js";
import {ClockService} from "./ClockService.js";

const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

ZephComponents.define("example-clock",()=>{
	html("./example-clock.html");
	css("./example-clock.css");

	onCreate((element,content)=>{
		let hr = content.querySelector("div.time > .hour");
		let mi = content.querySelector("div.time > .minute");
		let me = content.querySelector("div.time > .ampm");
		let dw = content.querySelector("div.date > .dow");
		let mo = content.querySelector("div.date > .month");
		let dy = content.querySelector("div.date > .day");
		let yr = content.querySelector("div.date > .year");

		let setTime = (time)=>{
			time = new Date(time);

			let hour = time.getHours()%12;
			if (hour===0) hour = 12;
			hr.textContent = (""+hour).padStart(2,"0");

			let minute = time.getMinutes();
			mi.textContent = (""+minute).padStart(2,"0");

			let ampm = time.getHour<12 ? "am" : "pm";
			me.textContent = ampm;
		};

		let setDate = (time)=>{
			time = new Date(time);

			let dow = DOW[time.getDay()];
			dw.textContent = dow;

			let month = MONTH[time.getMonth()];
			mo.textContent = month;

			let day = time.getDate();
			dy.textContent = day;

			let year = time.getFullYear();
			yr.textContent = year;
		};

		ClockService.on("updated",(event,time)=>{
			setTime(time);
			setDate(time);
		});

		setTime(ClockService.time);
		setDate(ClockService.time);
	});
});
