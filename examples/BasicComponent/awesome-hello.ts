// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {zeph,html,css} from "./Zeph.js";

@zeph('awesome-hello')
@html('./awesome-hello.html')
@css('./awesome-hello.css')
class AwesomeHello extends HTMLElement {
	constructor() {
		super();
		console.log('constructor');
	}
}

export default AwesomeHello;