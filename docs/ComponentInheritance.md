# [ZephJS](../README.md) > Writing Components > Inheritance

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- **Inheritance**
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Resources](./ComponentResources.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Inheritance

It is possible using ZephJS for one component to inherit from another component.  For example, `my-flashy-button` could inherit from `my-button`. We say "my-flashy-button inherits from my-button." This means that `my-flashy-button` has all of the definition of `my-button` plus its own definition.

Inheritance is a really powerful feature of ZephJS, but it does has its own limitations and draw backs.  And under no circumstances can you inherit from a component that is not defined with ZephJS. For example, it is not possible to inherit from a `<div>` tag as that is not defined in ZephJS.

In order to inherit from another component we use the `from()` definition method.

> **`from(fromTagName)`**
- **fromTagName** [string]: The tag-name of the ZephJS defined component to inherit from.

```javascript
ZephComponents.define("my-flashy-button",()=>{
	from("my-button");

	html("my-flashy-button.html");
});
```

### Importing Parent Class

It is highly recommend you import the class from which you are inheriting before you do the inheritence. So our example directly above should really be

```javascript
import "./my-button";

ZephComponents.define("my-flashy-button",()=>{
	from("my-button");

	html("my-flashy-button.html");
});
```

If you are extending a third party ZephJS based component that is loaded another way, just make sure the loading happens before the inheritance.  ZephJS returns a promise when defining a component, and so when you inherit ZephJS will make sure that the promise from the parent component has resolved first.

### Inheritance Behaviors

In ZephJS when one component inherits from another the component definition of the parent class is first copied and then augmented with the component definition of the child class.  This can lead to some interesting things to be aware of:

 1. The `html()` of both classes is applied, with the parent class' `html()` being written first.  On some occasions this is not desirable, so the `html()` method has a means to `overwrite` instead of appending.

 1. The `css()` of both classes is applied, with the parent class' `css()` being written first. On some occasions this is not desirable, so the `css()` method has a means to `overwriter` instead of appending.

 1. Attributes defined with `attribute()` are applied from the parent first, then the child. If a child defines an attribute that the parent has already defined, the child will overwrite the initialValue.

 1. Properties defined with `property()` are applied from the parent first, then the child. If a child defines a property that the parent has already defined, the child will overwrite the initialValue.

 1. Lifecylcle handlers from both the parent and child classes are all fired. Parent class handlers are fired first, then the child class handlers.

 1. Both parent and child `bind()` and `bindAt()` bindings are executed for changes. If a child defines an exact binding that the parent also defined, the child will overwirte the parent binding and the child will be the only binding used.

 1. Event handlers from both the parent and child classes are all fired. Parent class handlers are fired first, then the child class handlers.
