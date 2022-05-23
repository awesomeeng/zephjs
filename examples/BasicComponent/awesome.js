var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com
System.register("awesome-hello", ["zephjs"], function (exports_1, context_1) {
    "use strict";
    var zephjs_1, AwesomeHello;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (zephjs_1_1) {
                zephjs_1 = zephjs_1_1;
            }
        ],
        execute: function () {
            AwesomeHello = class AwesomeHello extends HTMLElement {
                constructor() {
                    super();
                    console.log('constructor');
                }
            };
            AwesomeHello = __decorate([
                zephjs_1.zeph,
                zephjs_1.html('<h1>hello world</h1>')
            ], AwesomeHello);
            exports_1("default", AwesomeHello);
        }
    };
});
