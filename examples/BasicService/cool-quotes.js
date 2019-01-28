// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global Zeph,component,requires,html,css,onCreate */

"use strict";


component("cool-quotes",()=>{
	requires("cool-quote");
	requires("QuoteService");

	html("./cool-quotes.html");
	css("./cool-quotes.css");

	onCreate(async (element,content)=>{
		[...content.querySelectorAll("cool-quote")].forEach((e)=>{
			e.remove();
		});

		try {
			let quotes = await Zeph.services.quotes.getQuotes();
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
