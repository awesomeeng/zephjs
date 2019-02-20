# [ZephJS](../README.md) > Writing Components > Event Handlers

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- **Event Handlers**

### Event Handlers

Part of building custom web components is to deal with what happens when one interacts with them.  These interactions, a mouse click, a focus traversal, a key press, etc, are exposed by ZephJS with the `onEvent()` and `onEventAt()` definition methods.

Both methods take the name of the event to capture, and a handler to execute when that event occurs.  For example:

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onEvent("click",(event,element,content)=>{
		... do something ...
	});
});
```

`onEvent()` and `onEventAt()` are fundamentally the same, but they differ in which element they are watching.  `onEvent()` watches the created custom element for events, while `onEventAt()` takes a selector string as its first argument to identify the internal content element(s) it will watch.

#### `onEvent()`

Watch the custom element for the given `eventName`.

> **`onEvent(eventName,handler)`**
 - **eventName** [string]: The event name to watch for. This can be any valid or custom event trigger by the DOM Event system that would occur on elements: [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events).
 - **handler** [Function]: The function to execute when the given eventName occurs. The function has the signature `(event,element,content)` where `event` is the triggering event object, where `element` is the created element, and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onEvent("click",(event,element,content)=>{
		... do something ...
	});
});
```

#### `onEventAt()`


Watch all internal content elements that match the `selector` for the given `eventName`.

> **`onEventAt(selector,eventName,handler)`**
 - **targetSelector** [string]: A selector string to match against the internal content. If multiple elements match, each will be watched for the event.
 - **eventName** [string]: The event name to watch for. This can be any valid or custom event trigger by the DOM Event system that would occur on elements: [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events).
 - **handler** [Function]: The function to execute when the given eventName occurs. The function has the signature `(event,element,content)` where `event` is the triggering event object, where `element` is the created element, and `content` is the internal Shadow DOM based on any `html()` calls.

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	onEventAt(".my-button","click",(event,element,content)=>{
		... do something ...
	});
});
```
