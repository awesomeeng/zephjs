"use strict";
exports.__esModule = true;
exports.HTML = void 0;
function HTML() {
    console.log('Decorator : HTML : Outer');
    return function () {
        console.log('Decorator : HTML : Inner');
    };
}
exports.HTML = HTML;
exports["default"] = HTML;
