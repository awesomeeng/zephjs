// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

import {ZephService,ZephServices} from "../../Zeph.js";

class QuoteServices extends ZephService {
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

ZephServices.register("quotes",new QuoteServices());
