# [ZephJS](../README.md) > Writing Components > Coding


### Componenet Methods

**name(name)**: Set the name of the component being created. This method must be included if you are specifying a new component.
 - **name**: [string] The name
 - returns **void**
 - example: `name("mistral-text-field");`
 - note: This may be called multiple times for a single component, but only the last one will apply.

**from(componentClass)**: Indicate the class that this component should extend.  Currently this only supports
HTMLElement.
 - **componentClass**: [class<HTMLElement>] The component class.
 - returns **void**
 - example: `from(HTMLElement);`
 - note: This may be called multiple times for a single component, but only the last one will apply.

**requires(url)**: Require another component be loaded before this component can be regitered.  This is primarily
need if you use a custom component inside of the component you are defining.
 - **url**: [string] The URL or relative path to the required component.
 - returns **void**
 - example: `requires("./mistral-text-field");`
 - note: This may be called multiple times for a single component, and all will apply.

**html(source)**: Indicate the html to be used for this new component. This can either be a url to the HTML file or the html string itself.
 - **source**: [string] A reference to the html file or the html content itself.
 - returns **void**
 - example: `html("./mistral-text-field.html");`
 - example: `html("<div><slot></slot></div>");`
 - note: This may be called multiple times for a single component, but only the last one will apply.

**css(source)**: Indicate the css to be used for this new component. This can either be a url to the HTML file or the css string itself.
 - **source**: [string] A reference to the css file or the css content itself.
 - returns **void**
 - example: `css("./mistral-text-field.css");`
 - example: `css("div { background: red; }");`
 - note: This may be called multiple times for a single component, but only the last one will apply.

**onCreate(listener)**: Indicate a function, the listener, that should be executed whenever this component is created via a call to `component.create()`, `document.createElement()` or any other means elements are created.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(element,content)
 - returns **void**
 - example: `onCreate((element,content)=>{ ... });`-
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onAdd(listener)**: Indicate a function, the listener, that should be executed whenever this component is added/appended to a parent component.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(element,content)
 - returns **void**
 - example: `onAdd((element,content)=>{ ... });`-
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onRemove(listener)**: Indicate a function, the listener, that should be exectued whenever this component is removed from a parent component.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(element,content)
 - returns **void**
 - example: `onRemove((element,content)=>{ ... });`-
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onAdopt(listener)**: Indicate a function, the listener, that should be executed whenever this component is adopted by a a new document. This is a very rare situation, and probably not likely to be encountered.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(element,content)
 - returns **void**
 - example: `onAdopt((element,content)=>{ ... });`-
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onAttribute(attribute,listener)**: Indicate a function, the listener, that should be executed whenever the given attribute for this component is changed.
 - **attribute**: [string] The attribute name to be observed for changes.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(oldValue,newValue,element,content)
 - returns **void**
 - example: `onAttribute("source",(oldValue,newValue,element,content)=>{ ... });`-
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onEvent(eventName,listener)**: Indicate a function, the listener, that should be executed whenever the given event occurs on this component. `onEvent()` is about listening for events to the created component.  See `onEventAt()`` for listening for events on children of the created component.
 - **eventName**: [string] The event name to trigger this listener.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(event,element,content)
 - returns **void**
 - example: `onEvent("click",(event,element,content)=>{ ... });`
 - note: This may be called multiple times for a single component, and each listener will be fired.

**onEventAt(selector,eventName,listener)**: Indicate a function, the listener, that should executed whenever the given event occurs on all child components of this component that match the given selector. `onEventAt()` is about handling events on child components of the created component.
 - **selector**: [string] The `querySelector()` string for matching children of this component to register the event against.
 - **eventName**: [string] The event name to trigger this listener.
 - **listener**: [Function] The listener executed.
   - **execution signature**: listener(event,element,content)
 - returns **void**
 - example: `onEventAt(".title","click",(event,element,content)=>{ ... });`
 - note: This may be called multiple times for a single component, and each listener will be fired.

**mapAttribute(attribute,selector,targetAttribute,transform)**: A utility function that will watch for changes to a given attribute on this component, and then mirror those changes on any child component of this component that matches the given selector.  Useful for propagating attribute changes from the created component to underlying wrapped components.
 - **attribute**: [string] The attribute name to be observed for changes.
 - **selector**: [string] The `querySelector()` string for matching children of this component to which to copy the attribute value.
 - **targetAttribute**: [string] OPTIONAL. The attribute name on the selected element to which to write the value. If not provided, the same name will be used.
 - **transform**: [function] OPTIONAL. A function to transform the value before writing it.
 - returns **void**
 - example: `mapAttribute("disabled",".my-input-control");`
 - example: `mapAttribute("value",".something","x-axis-value",(x)=>{ return x*2; });`
 - note: This may be called multiple times for a single component, and each listener will be fired.

**mapAttributeToContent(name)**: A utility function that will watch for changes to a given attribute on this component, and then mirror those changes as the content of any child component of this component that matches the given selector.  Useful for propagating attribute changes from the created component to underlying wrapped components.
 - **attribute**: [string] The attribute name to be observed for changes.
 - **selector**: [string] The `querySelector()` string for matching children of this component to which to copy the attribute value.
 - **transform**: [function] OPTIONAL. A function to transform the value before writing it.
 - returns **void**
 - example: `mapAttributeToContent("title",".titlebar > .title");`
 - example: `mapAttributeToContent("value",".something",(x)=>{ return x*2; });`
 - note: This may be called multiple times for a single component, and each listener will be fired.
