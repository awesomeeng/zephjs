# [ZephJS](../README.md) > Writing Components > CSS

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- **CSS**
- [Resources](./ComponentAssets.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### CSS

Adding CSS via component definition is identical to the `html()` component definition except we use the `css()` definition method.

> **`css(content,options)`**
 - **content** [string]: The content argument may be either a filename to a CSS file that contains the CSS or it can be the CSS itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful. If the read was not successful, the content is treated as raw content and used.
 - **options** [object|null]: OPTIONAL. An optional options object can be passed into the `css()` definition method. This options object can have the following properties:
	 - **overwrite** [boolean]: If set to true, the css content provided will overwrite any previous `css()` content.  If false, the content is appended. This is useful when inheriting from another component. Defaults to false
	 - **noRemote** [boolean]: If set to true, the `css()` content will always be treated as raw content and never as a filename.


```
ZephComponents.define("my-component",()=>{
	css("./my-component.css");
});
```
```
ZephComponents.define("my-component",()=>{
	css(`
		div.myDiv {
			background: orange;
		}
	`);
});
```

ZephJS uses 100% standard CSS. There is no special css dervived language or shortcuts provided.

The CSS you provide for your custom element is ONLY for the custom element.  It does not leak out. (See our [Component Concepts](./ComponentConcepts.md) documentation for more details about Encapsulation.) Likewise, the CSS does not leak in. That is, there is no way currently to address the inner content of a custom element via CSS Selector.  (Please read [Monica Dinculescu's excellent article](https://meowni.ca/posts/part-theme-explainer/) about the upcoming :part and :theme for a lot more details.)

Your CSS can style the custom element itself with the `:host` psuedo-selector. You can learn more about `:host` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) and about `:host()` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:host()).

You may call the css() definition method multiple times. Each call gets appended to the previous call.

Using a `css()` definition method is not required.

Currently when the component is created all of the style information gets inserted as `<style>` elements within the ShadowRoot.  This means that it can be selected via query selector or, more importantly, accidentally selected by querySelectorAll("*").  We mention this so you are not surprised later by additional html elements in your ShadowRoot that you might not have expected.
