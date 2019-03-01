# [ZephJS](../README.md) > Writing Components > Lifecycle Handlers

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- **Lifecycle Handlers**
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Component Lifecycle

A custom element built with ZephJS has the following lifecycle, meaning it moves through the following stages at some point.  Each of these lifecylces has an associated Lifecycle Event. These events can be tapped within the component definition for you to use as needed.

**Definition** &rArr; **Initialization** &rArr; **Creation** &rArr; **Addition** | **Removal** | **Adoption** | **Attribute**

 - **Definition**: Definition happens when you define a component via the `ZephComponents.define()` call. It is where your definition methods are executed and the ComponentContext is created. This will only occur once for each custom element defined.

 - **Initialization**: Occurs after an element is defined and registered with the Custom Elements API. This is directly following the Definition lifecycle event. This will only occur once for each custom element defined.

 - **Creation**: Occurs when someone instantiates a new instance of your custom element.  Each usage of your element in the html occurs a creation lifecycle event. This will occur multiple times for a given custom element, once for each time it is instanced.

 - **Addition** | **Removal** | **Adoption**: Each of these occurs when an element is added or removed or adopted (moved from one document to another) to the DOM. This may occur multiple times for a single element as it moves around the DOM. For example, if I move a custom element from one DOM node to another both the Removal and Addition lifecycle events will occur.

 - **Attribute**: Occurs when a given attribute changes. The may occur multiple times for a single custom element as the attributes changes on that element.

### Lifecycle Handlers

You may tap into all of these Lifecycles in your component definition using the associated definition method:

#### Definition

There is no assicated Lifecylce Handler for the Definition Lifecycle event, because the component defintion function is in and of itself that event.

#### Initialization

The `onInit()` definition method is associated with the Initialization Lifecylce event.  `onInit()` is good for follow-up work when defining a component.

> **`onInit(handler)`**
 - **handler** [Function]: The function executed when the Initialization Lifecycle event occurs. The function has the signature `(name,component)` where `name` is the tag name being defined and the `component` is the ZephComponent class which wraps the component itself.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onInit((name,zephComponent)=>{
		... do something ...
	});
});
```

#### Creation

The `onCreate(handler)` definition method is associated with the Creation Lifecylce event.  `onCreate()` is good for dynamically changing an element when it is instantiated.

> **`onCreate(handler)`**
 - **handler** [Function]: The function executed when the Creation Lifecycle event occurs.  The function has the signature `(element,content)` where `element` is the created element and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onCreate((element,content)=>{
		... do something ...
	});
});
```

#### Addition

The `onAdd(handler)` definition method is associated with the Added Lifecylce event.  `onAdd()` is good for changing an element when it is added to the DOM.

> **`onAdd(handler)`**
 - **handler** [Function]: The function executed when the Added Lifecycle event occurs.  The function has the signature `(element,content)` where `element` is the created element and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onAdd((element,content)=>{
		... do something ...
	});
});
```

#### Removal

The `onRemove(handler)` definition method is associated with the Removed Lifecylce event.  `onRemove()` is good for changing an element when it is removed from the DOM.

> **`onRemove(handler)`**
 - **handler** [Function]: The function executed when the Removed Lifecycle event occurs.  The function has the signature `(element,content)` where `element` is the created element and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onRemove((element,content)=>{
		... do something ...
	});
});
```

#### Adoption

The `onAdopt(handler)` definition method is associated with the Adopted Lifecylce event.  `onAdopt()` is good for changing an element when it is Adopted by a new DOM.

> **`onAdopt(handler)`**
 - **handler** [Function]: The function executed when the Adopted Lifecycle event occurs.  The function has the signature `(element,content)` where `element` is the created element and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onAdopt((element,content)=>{
		... do something ...
	});
});
```

#### Attribute

The `onAttribute(attributeName,handler)` definition method is associated with the Attribute Lifecylce event.  `onAttribute()` is good for changing an element when a given attribute changes.

> **`onAttribute(attributeName,handler)`**
 - **attributeName** [string]: The name of the attribute to observe for changes. This may not be undefined or null or empty string.
 - **handler** [Function]: The function executed when the Attribute Lifecycle event occurs.  The function has the signature `(oldValue,newValue,element,content)` where `oldValue` is the value prior to the attribute change, `newValue` is the value being set, `element` is the created element, and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onAttribute((oldValue,newValue,element,content)=>{
		... do something ...
	});
});
```
