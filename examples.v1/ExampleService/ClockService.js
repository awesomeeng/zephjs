// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

import {ZephService} from "./Zeph.js";

const $FREQUENCY = Symbol("frequency");
const $NEXT = Symbol("next");
const $TIME = Symbol("time");

class ClockService extends ZephService {
	constructor() {
		super();

		this[$NEXT] = null;
		this[$TIME] = Date.now();
		this.frequency = 60000;
	}

	get frequency() {
		return this[$FREQUENCY];
	}

	set frequency(n=60000) {
		n = parseInt(n,10);
		if (n && !isNaN(parseInt(n))) this[$FREQUENCY] = n;

		this.update();
	}

	get time() {
		return this[$TIME];
	}

	update() {
		if (this[$NEXT]) clearTimeout(this[$NEXT]);
		this[$NEXT] = null;

		let time = Date.now();
		this[$TIME] = ((time/this.frequency)|0)*this.frequency;

		let next = this[$TIME]+this.frequency-Date.now();
		this[$NEXT] = setTimeout(this.update.bind(this),next);

		this.fire("updated",this[$TIME]);
	}
}

const instance = new ClockService();
export {instance as ClockService};
