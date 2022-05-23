if (!window.customElements || !window.ShadowRoot) {
    /* eslint-disable no-console */
    console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
    /* eslint-enable no-console */
}
const $CONTEXT = Symbol('ZephJSContext');
function Zeph(name) {
    console.log('Decorator : Zeph : Outer', arguments);
    return function (ctor) {
        console.log('Decorator : Zeph : Inner');
        const componentClass = class ZephComponent extends ctor {
            constructor() {
                super();
            }
        };
        const componentName = name || ctor.name || null;
        if (!componentName)
            throw new Error('Unable to figure our the name for this component. Please provide the name via the @zeph(<name>) argument, or provided a class name.');
        const context = componentClass[$CONTEXT] = componentClass[$CONTEXT] || {};
        context.name = componentName;
        context.class = componentClass;
        context.parentClass = ctor;
        window.customElements.define(context.name, context.class);
    };
}
function Html(contentOrFilename) {
    console.log('Decorator : HTML : Outer');
    return function () {
        console.log('Decorator : HTML : Inner');
    };
}
export { Zeph, Zeph as ZEPH, Zeph as zeph };
export { Html, Html as HTML, Html as html };
