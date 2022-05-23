function Zeph(constructor) {
    console.log('Decorator : Zeph : Outer');
    return function () {
        console.log("asdf");
    };
}
export default Zeph;
export { Zeph };
// function reportableClassDecorator {
// 	return class extends constructor {
// 		reportingURL = "http://www...";
// 	};
// }
