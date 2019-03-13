// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

import {ZephService} from "../../zeph.min.js";

class QuoteService extends ZephService {
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

const instance = new QuoteService();
export {instance as QuoteService};
