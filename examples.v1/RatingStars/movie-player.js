// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

/* eslint no-console: off */

import {ZephComponents} from "./Zeph.js";
import {html,css,asset} from "./Zeph.js";

ZephComponents.define("movie-player",()=>{
	html("./movie-player.html");
	css("./movie-player.css");

	asset("video","./Glow.mp4");
});
