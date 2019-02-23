# [ZephJS](../README.md) > Writing Components > Bindings

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- **Bindings**
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Bindings

A particular case of [Lifecycle Handlers](./ComponentLifecycleHandlers.md) comes up fairly often when using ZephJS and that is the process of binding an attribute or property to another attribute or property within the internal content of the component.  For example one might be tempted to write:

```
onAttribute((element,content)=>{
	let value = element.getAttribute("my-attribute");
	content.querySelector(".some-content-element").setAttribute("my-attribute",value);
});
```

This is fine, but it gets a bit unwieldy.  Fortunately, ZephJS has a better solution for you: Bindings.

A Binding links a source attribute, property, or the content, to a target attribute, property, or content.  When the source attribute, property, or content changes, the target attribute, property, or content is updated.

So instead of our four (4) lines of code from above, we can do the same one simple line.

```
bind("@my-attribute",".some-content-element");
```

This example is the same as the previous code, but much simpler to read and understand.  In it we are binding the attribute `my-attribute` on the custom element to the attribute of the same name on any internal content element that matches `.some-content-element`. When the attribute on the element changes, the internal content element is update automatically.

There are two versions of bindings: `bind()` and `bindAt()`.  `bind()` will bind an attribute, property, or content of the element to something else. `bindAt()` will bind an attribute, property, or content of any element in the internal content that matches some given selector.

`bind()` and `bindAt()` are described below, but there a few key pieces we want to talk about first:

 - Bindings work by watching a **source** element, for some change and then copying that change to the **target** element.

 - Bindings are always one way: if **source** changes, **target** is updated.  If **target** changes, **source** is not updated. However, by adding a second inverse binding this becomes possible.

 - The last argument to a binding is an optional `transformFunction` which will be called before the bound value is copied. This function allows you to transform what you are writing to the **target**.

 - Bindings take a name argument that identifies what we are binding to: an attribute, a property, or the content.  This is a string argument and it has a special structure:
	 - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
	 - **Property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
	 - **content** names are always just a single dollar sign character ("$") as in `$`.

`bind()` and `bindAt()` are fundamentally the same, but they differ in which source element they are binding.  `bind()` binds the created custom element, while `bindAt()` takes a selector string as its first argument to identify the internal content element(s) it will bind against.

If the `bindAt()` source selector or the `bind()` or `bindAt()` target selector matches multiple element in the internal content, the binding will apply to all of them equally.  For example, if your target selected say `div`, then all matching `<div>` tags within the internal content would get the copied value.

Also, a selector can be used to select the custom element itself by being just ".".

#### `bind()`

Bind the given `sourceName` on the custom element to the given `targetName` on any internal content element that matches the `targetSelector`.

> **`bind(sourceName,targetSelector,targetName,transformFunction)`**
 - **sourceName** [string]: The name of the attribute, property, or content, we want to watch for changes.  `sourceName` is a binding identifier string and thus must identify what type of object it is binding to:
	 - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
	 - **property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
	 - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **targetSelector** [string]: A selector string to identify what target elements we want to bind to. The selector is evaluated at the time of the binding change, so it can be dynamic. The selector may also match multiple elements, in which case each element would get the binding change.  Finally, if the selector string is just `.` it will match the custom element instead of an element in the internal content.
 - **targetName** [string]: OPTIONAL. The name of the attribute, property, or content, we want to watch for changes.  If `targetName` is not provided, the `sourceName` value is used, allowing one to shortcut having to retype the same thing twice.  `targetName` is a binding identifier string and thus must identify what type of object it is binding to:
	 - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
	 - **property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
	 - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **tranformFunction** [Function]: OPTIONAL. A function that will execute before the changed value is written. The function gets the value as its sole argument, and whatever it returns will replace the written value.  The `transformFunction` is completely optional and if not provided no transform will occur.  If the `transformFunction` throw an exception, the binding will not update the target at all, thus allowing one to shortcircuit the binding update.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	bind("my-attribute",".some-internal-element");
});
```

#### `bindAt()`

Bind the given `sourceName` of all internal content elements that match the given `sourceSelector` of the custom element to the given `targetName` on any internal content element that matches the `targetSelector`.

> **`bindAt(sourceSelector,sourceName,targetSelector,targetName,transformFunction)`**
 - **sourceSelector** [string]: A selector string to identify what source elements we want to bind to. The selector is evaluated at the time of component creation, so elements added later will not be included. The selector may match multiple elements, in which case each element would watch for changes.  Finally, if the selector string is just `.` it will match the custom element instead of an element in the internal content, esentially the same as calling `bind()` instead of `bindAt()`.
 - **sourceName** [string]: The name of the attribute, property, or content, we want to watch for changes.  `sourceName` is a binding identifier string and thus must identify what type of object it is binding to:
	 - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
	 - **property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
	 - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **targetSelector** [string]: A selector string to identify what target elements we want to bind to. The selector is evaluated at the time of the binding change, so it can be dynamic. The selector may also match multiple elements, in which case each element would get the binding change.  Finally, if the selector string is just `.` it will match the custom element instead of an element in the internal content.
 - **targetName** [string]: OPTIONAL. The name of the attribute, property, or content, we want to watch for changes.  If `targetName` is not provided, the `sourceName` value is used, allowing one to shortcut having to retype the same thing twice.  `targetName` is a binding identifier string and thus must identify what type of object it is binding to:
	 - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
	 - **property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
	 - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **tranformFunction** [Function]: OPTIONAL. A function that will execute before the changed value is written. The function gets the value as its sole argument, and whatever it returns will replace the written value.  The `transformFunction` is completely optional and if not provided no transform will occur.  If the `transformFunction` throw an exception, the binding will not update the target at all, thus allowing one to shortcircuit the binding update.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	bindAt("div.my-element","my-attribute",".some-internal-element");
});
```
