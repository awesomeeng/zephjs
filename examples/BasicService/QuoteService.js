// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global service */

"use strict";

class QuoteServices extends window.Zeph.AbstractService {
	getQuotes() {
		return new Promise(async (resolve,reject)=>{
			try {
				let response = await fetch("./quotes.json");
				if (response.ok) return resolve(await response.json());
				resolve(undefined);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

service("quotes",new QuoteServices());
