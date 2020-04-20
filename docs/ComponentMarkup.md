# [ZephJS](../README.md) > Writing Components > HTML

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- **HTML**
- [CSS](./ComponentStyling.md)
- [Resources](./ComponentAssets.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./ComponentBundling.md)

### HTML

We add content to a custom element with our `html()` definition method.

> **`html(content, options)`**
 - **content** [string]: The content argument may be either a filename to an HTML file that contains the content or it can be the content itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful.  If the read was not successful, the content is treated as raw content and used.
 - **options** [object|null]: OPTIONAL.  An optional options object can be passed into the `html()` definition method.  This options object can have the following properties:
	 - **overwrite** [boolean]: If set to true, the html content provided will overwrite any previous `html()` content.  If false, the content is appended.  This is useful when inheriting from another component.  Defaults to false
	 - **noRemote** [boolean]: If set to true, the `html()`` content always be treated as raw content and never as a filename.

```
ZephComponents.define("my-component", () => {
	html("./my-component.html");
});
```
```
ZephComponents.define("my-component", () => {
	html(`
		<div>
			<span>Hello</span>
			</span>World</span>
		</div>
	`);
});
```

ZephJS uses 100% standard HTML. There is no special templating language or virtual rendering system or the like.  No inline `${blah}` variables are supported. If you want the content to change based on some property changing, you will need to do this yourself.  (Fortunately ZephJS gives you some helpful ways to do this with [Bindings](./ComponentBindings.md).)

As we know, when writing HTML we use an HTML tag which may contain inner content.  A custom element needs to know how to place this inner content and HTML provides the `<slot>` element to do this.  You use the `<slot>` element to declare where in the internal content (that defined by the `html()` definition method) the inner content is to be placed.  For example:

```
ZephComponents.define("my-component", () => {
	html(`
		<div class="inner-content">
			<slot></slot>
		</div>
	`);
});
```
```
<my-component>
	Hello There!
</my-component>
```

Produces (in essence) the following html:

```
<div class="inner-content">
	Hello There!
</div>
```

There is, of course, more to it than that, but this is enough to get you started.  If you want to know more about `<slot>` and how to use it, check out this MDN Article [Using Templates and Slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

The html content you provide is used to define the internal content of the custom element.  Technically, the content gets inserted into the element's ShadowRoot and is thus masked from the main DOM structure. (ShadowRoot is part of the Shadow DOM standard API.  See our [Component Concepts](./ComponentConcepts.md) document for a quick overview.)

You can use other custom elements (whether created with ZephJS or not) within the html supplied to the `html()` definition method.  It is usually best to ensure that the needed element is defined first. We recommend you do so by importing it thus:

```
import "./another-component.js";

import {ZephComponents} from "./Zeph.js";
import {html} from "./Zeph.js";

ZephComponents.define("my-component", () => {
	html(`
		<another-component>
		</another-component>
	`);
});
```

Additionally, you may call the `html()` definition method multiple times.  Each call gets appended to the previous call.

Using a `html()` definition method is not required.
