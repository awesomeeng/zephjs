"use strict";
// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
/* eslint no-console: off */
var zephjs_1 = require("zephjs");
// bind
var MyButton = /** @class */ (function (_super) {
    __extends(MyButton, _super);
    function MyButton() {
        var _this = _super.call(this) || this;
        // attribute
        _this.nameysdg = "";
        _this.icon = "";
        // attribute('icon-placement')
        _this.iconPlacement = "left";
        // property
        // attribute("data-click-count")
        _this.clickCount = 0;
        return _this;
    }
    // bind("@disabled","button");
    MyButton.prototype.onCreate = function (element) {
        console.log("Element '" + element.getAttribute("name") + "' created!", element);
    };
    MyButton.prototype.onClick = function (event, element) {
        if (this.hasAttribute("disabled")) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        this.clickCount += 1;
        console.log("Button '" + element.getAttribute("name") + "' clicked " + element.clickCount + " times.");
    };
    MyButton.prototype.added = function (element) {
        console.log("Button added");
    };
    MyButton.prototype.removed = function (element) {
        console.log("Button removed");
    };
    MyButton.prototype.adopted = function (element) {
        console.log("Button adopt");
    };
    __decorate([
        zephjs_1.attribute,
        (0, zephjs_1.bind)("button > img", "@src")
    ], MyButton.prototype, "icon");
    __decorate([
        zephjs_1.onCreate
    ], MyButton.prototype, "onCreate");
    __decorate([
        (0, zephjs_1.onEvent)("click")
    ], MyButton.prototype, "onClick");
    __decorate([
        zephjs_1.onAdd
    ], MyButton.prototype, "added");
    __decorate([
        zephjs_1.onRemove
    ], MyButton.prototype, "removed");
    __decorate([
        zephjs_1.onAdopt
    ], MyButton.prototype, "adopted");
    MyButton = __decorate([
        (0, zephjs_1.zeph)('my-button'),
        (0, zephjs_1.html)("./my-button.html"),
        (0, zephjs_1.css)("./my-button.css")
    ], MyButton);
    return MyButton;
}(HTMLElement));
exports["default"] = MyButton;
