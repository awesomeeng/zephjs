# [ZephJS](../README.md) > Writing Components > Attributes

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Resources](./ComponentResources.md)
- **Attributes**
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Attributes

You can add an attribute to your custom element with the `attribute()` definition method.

The use case for `attribute()` is to define an attribute on the created custom element and set its initial value.  The thing to keep in mind is that when you are writing the component definition you have no access to the actual element created.  `attribute()` solves that case for you.  Using `attribute("xyz",123)` is both more readable and easier than using `onCreate((element,content)=>{ element.setAttribute("xyz",123); });`

> **`attribute(attributeName,initialValue)`**
 - **attributeName** [string]: The name of the attribute to add.  Attribute names are always lower-cased and must not be undefined, null, or empty string.
 - **initialValue** [*]: OPTIONAL. The initial value for the attribute. If no initial value is given, none is set.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	attribute("disabled",undefined);
});
```

All values set on an attribute are automatically cast to a string. If `initialValue` is undefined or null, the attribute is not actually set, but actively removed.

A note for boolean attributes.  Because all values are converted to strings for attributes, boolean attributes are a special case.  If a boolean attribute is set to "" (empty string) it is considered true.  If it is removed or otherwise not set, it is said to be false.

Attributes are added when the element is created (but prior to the create [Lifecycle Event](./ComponentLifecycleHandlers.md)).  Because of how Web Components work this means the attribute may have already been set if specified in the tag usage. If `initialValue` is provided and the attribute is already included in the element, the set value will win over the initialValue.
