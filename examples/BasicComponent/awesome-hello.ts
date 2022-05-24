// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {zeph,html,css} from "./Zeph.js";

@zeph('awesome-hello')
@html('<h1>hello world</h1>')
@css('h1 { background: red; display: block; }')
class AwesomeHello extends HTMLElement {
	constructor() {
		super();
		console.log('constructor');
	}
}

export default AwesomeHello;