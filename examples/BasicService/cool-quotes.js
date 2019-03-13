// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import "./cool-quote.js";
import {ZephComponents,html,css,onCreate} from "../../zeph.min.js";
import {QuoteService} from "./QuoteService.js";

ZephComponents.define("cool-quotes",()=>{
	html("./cool-quotes.html");
	css("./cool-quotes.css");

	onCreate(async (element,content)=>{
		[...content.querySelectorAll("cool-quote")].forEach((e)=>{
			e.remove();
		});

		try {
			let quotes = await QuoteService.getQuotes();
			quotes.forEach((entry)=>{
				let e = document.createElement("cool-quote");
				e.setAttribute("quote",entry.quote);
				e.setAttribute("person",entry.person);
				content.appendChild(e);
			});
		}
		catch (ex) {
			/* eslint-disable no-console */
			console.error(ex);
			/* eslint-enable no-console */

			let e = document.createElement("div");
			e.classList.add("error");
			e.innerText = "Error fetching quotes.";
			content.appendChild(e);
		}
	});
});
