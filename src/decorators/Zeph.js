"use strict";
exports.__esModule = true;
exports.Zeph = void 0;
function Zeph(constructor) {
    console.log('Decorator : Zeph : Outer');
    return function () {
        console.log("asdf");
    };
}
exports.Zeph = Zeph;
exports["default"] = Zeph;
// function reportableClassDecorator {
// 	return class extends constructor {
// 		reportingURL = "http://www...";
// 	};
// }
