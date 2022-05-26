import { zeph, html, css } from "./Zeph.js";

@zeph('awesome-border-layout')
@html('./AwesomeBorderLayout.html')
@css('./AwesomeBorderLayout.css')
export default class AwesomeBorderLayout extends HTMLElement {
}
