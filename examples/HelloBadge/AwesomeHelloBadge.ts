// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import { zeph, html, css } from "./Zeph.js";
import "./AwesomeBorderLayout.js";

@zeph("awesome-hello-badge")
@html('./AwesomeHelloBadge.html')
@css('./AwesomeHelloBadge.css')
export default class AwesomeHelloBadge extends HTMLElement {
}
