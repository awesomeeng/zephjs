# [ZephJS](../README.md) > Writing Components > Importing ZephJS

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- **Importing ZephJS**
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Importing ZephJS

Writing a web component with ZephJS is done with the ZephComponents library.  To use ZephComponents we must first import it into our JavaScript:

```
import {ZephComponents} from "./zeph.min.js";
```

Additionally, all of the the definition methods we are going to use in our component definition need to be imported as well.  You could just wildcard this, but we prefer to call this out specifically.

```
import {ZephComponents} from "./zeph.min.js";
import {html,css,attribute,property} from "./zeph.min.js";
```

The following items can be imported from ZephJS:

 - ZephComponents
 - ZephService
 - ZephObservable
 - ZephUtils

The following definition methods can be imported from ZephJS:

 - **from**: Used to make a ZephJS component inherit from another ZephJS component.

 - **alias**: Used to create alternative or shortcut name for a given component.

 - **html**: Sets the HTML content of the element we are defining.

 - **css**: Sets the CSS content of the element we are defining.

 - **attribute**: Adds an attribute to the element we are defining.

 - **property**: Adds a property to the element we are defining.

 - **onInit**: Adds a handler for the Initialization Lifecycle Event the element we are defining.

 - **onCreate**: Adds a handler for the Creation Lifecycle Event the element we are defining.

 - **onAdd**: Adds a handler for the Addition Lifecycle Event the element we are defining.

 - **onRemove**: Adds a handler for the Removal Lifecycle Event the element we are defining.

 - **onAdopt**: Adds a handler for the Adoption Lifecycle Event the element we are defining.

 - **onAttribute**: Adds a handler for the Attribute Lifecycle Event the element we are defining.

 - **bind**: Bind an attribute, property, or content of the element we are defining to another attribute, property, or content of the element we are defining or its internal content.

 - **bindAt**: Bind an attribute, property, or content of the element we are defining or its internal content to another attribute, property, or content of the element we are defining or its internal content.

 - **onEvent**: Handle an event that occurs on the element we are defining.

 - **onEventAt**: Handle an event that occurs on the internal content of an element we are defining.

### Definition Method without Importing

Some users of ZephJS can find the need to `import` all of the definition methods a little confusion or not to thier taste and thus Zeph supports an alternate approach for using Definition Methods. (Note that you will still need to import ZephComponents.)

```javascript
import {ZephComponents} from "./zeph.min.js";

ZephComponents.define("my-button",({html,css,attribute,onCreate})=>{
	html("./my-button.html");
	css("./my-button.css");

	attribute("icon","");

	onCreate(()=>{
		...
	});
});
```

In this case instead of using `import` to get the definition methods, we are using destructuring on the definition function to get the definition methods. ZephJS will hand an object containing all of the definition methods to the definiction function you provide to `ZephComponents.define()`.

Both `import` or the destructuring approach work identically, so this is purely a style descision for you the developer. ZephJS even allows you to mixed both approaches if you wanted.

### Wildcard Importing

A third approach to importing is the use of a wildcard character with your `import` statement.  For example:

```javascript
import * as Zeph from "./zeph.min.js";

Zeph.ZephComponents.define("my-button",()=>{
	Zeph.html("./my-button.html");
	Zeph.css("./my-button.css");

	Zeph.attribute("icon","");

	Zeph.onCreate(()=>{
		...
	});
});
```

This is an alternative, although it may make the code slightly more cumbersome to read.
