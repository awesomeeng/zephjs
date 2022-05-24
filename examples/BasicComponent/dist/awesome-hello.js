// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { zeph, html, css } from "./Zeph.js";
let AwesomeHello = class AwesomeHello extends HTMLElement {
    constructor() {
        super();
        console.log('constructor');
    }
};
AwesomeHello = __decorate([
    zeph('awesome-hello'),
    html('./awesome-hello.html'),
    css('./awesome-hello.css')
], AwesomeHello);
export default AwesomeHello;
