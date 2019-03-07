# [ZephJS](../README.md) > Writing Components > Component Definition

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- **Defining the Component**
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Defining the Component

After we import ZephComponents and our definition methods, its time to define our component.  We do this by calling the `ZephComponents.define` method, like so:

```
ZephComponents.define("my-component",()=>{
	... your component definition ...
});
```

> `ZephComponents.define(name,definition)`
 - **name** [string]: The name of the component we are defining. The name becomes the tag name of our component. This argument is required and may not be undefined, null, or empty string. The name must be unique and it must have at least one dash ("-") character in it.
 - **definition** [Function]: The definition is a function that is executed before the component is defined and registered. Inside of the defintion function, we call the definition methods (that we imported previously) to describe how the component we are defining.

The ZephComponents define process works like this:

1. You define the component using `ZephComponents.define()`.
2. The definition function you pass as the second argument to `ZephComponents.define()` is executed and each definition method you include within it, describes some aspect of the definition. All of these definitions are used to build what we call a ComponentContext.
3. After the definition function has completed, ZephJS uses the ComponentContext to create a ComponentClass that describes the custom element you are defining.
4. ZephJS registers the component using the given name and ComponentClass using the [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

It is important to note that everything in the definition function is entirely optional. One could, if so desired, create a custom component without anything in the definition function at all.  It would be an incredibly boring component, but it is possible.

Here is an example of defining a component:

```
import {ZephComponents} from "./zeph.min.js";
import {html,css,attribute,bind,onEvent} from "./zeph.min.js";

ZephComponents.define("my-button",()=>{
	html("./my-button.html");
	css("./my-button.css");

	attribute("icon-placement","left");

	// Inherited from button.
	bind("@autofocus","button");
	bind("@disabled","button");
	bind("@name","button");
	bind("@value","button");

	onEvent("click",(event,element)=>{
		if (element.hasAttribute("disabled") && (element.getAttribute("disabled")===true || element.getAttribute("disabled")==="")) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
		}
	});
});
```
