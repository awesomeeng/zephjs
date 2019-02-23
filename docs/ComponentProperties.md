# [ZephJS](../README.md) > Writing Components > Properties

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- **Properties**
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Properties

You can add a property to your custom element with the `property()` definition method.

The use case for `property()` is to define a property on the created custom element and set its initial value. The thing to keep in mind is that when you are writing the component definition you have no access to the actual element created.  `property()` solves that case for you.  Using `property("xyz",123)` is both more readable and easier than using `onCreate((element,content)=>{ element.xyz = 123; });`

> **`property(propertyName,initialValue)`**
 - **propertyName** [string]: The name of the property to add.  Property names must not be undefined, null, or empty string.
 - **initialValue** [*]: OPTIONAL. The initial value for the property. If no initial value is given, none is set.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	property("disabled",undefined);
});
```

A property may have any type value desired including undefined or null.

Properties are added when the element is created (but prior to the create [Lifecycle Event](./ComponentLifecycleHandlers.md)).  Because of how Web Components work this means the property may have already been set if specified elsewhere. If `initialValue` is provided and the property is already set on the element, the set value will win over the initialValue.

If you use `property()` on an already existing element property like `innerHTML` or the like, ZephJS will attempt to handle it correctly, although there could be some weird use cases around this. Use with care.
