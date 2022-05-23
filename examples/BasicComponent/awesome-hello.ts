// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {zeph,html} from "./Zeph.js";

@zeph('awesome-hello')
@html('<h1>hello world</h1>')
class AwesomeHello extends HTMLElement {
	constructor() {
		super();
		console.log('constructor');
	}
}

export default AwesomeHello;