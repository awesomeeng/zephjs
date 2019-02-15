# [ZephJS](../README.md) > Writing Components > How To Write a Component with ZephJS

Building Web Components using the Web Component standards can be a little confusing, a little esorteric. The standards were written, not for the general usage, but for the library authors that would provide libraries to build Web Components.  This means that there is a depth of knowledge required that should not really be required for doing what should be a very simple task.

That's where ZephJS comes in.  ZephJS is one such library meant to make building Web Components intuititve and easy.  Zeph does this by abstracting away the essorteric, remaining true to the fundamentals of the Web and relying on the technologies that have made the Web successful for over two decades.

Of course, like all libraries, ZephJS has its own way of doing things.  Hopefully, these are straight forward and understandable and try to stay out of your way as much as possible.

The first question that comes up when talking about ZephJS is "how do I write a component?"  This document serves as an answer to that question and more generally an introduction to using ZephJS.
There are nine easy steps to writing a component:

 - [Importing ZephJS](#importing-zephjs)
 - [Defining the Component](#defining-the-component)
 - [Add HTML](#add-html)
 - [Add CSS](#add-css)
 - [Add Attributes](#add-attributes)
 - [Add Properties](#add-properties)
 - [Add Bindings](#add-bindings)
 - [Add Lifecycle Handlers](#add-lifecycle-handlers)
 - [Add Event Handlers](#add-event-handlers)

### Importing ZephJS

Writing a web component with ZephJS is done with the ZephComponents library.  To use ZephComponents we must first import it into our JavaScript:

```
import {ZephComponents} from "./Zeph.js";
```

Additionally, all of the the definition methods we are going to use in our component definition need to be imported as well.  You could just wildcard this, but we prefer to call this out specifically.

```
import {ZephComponents} from "./Zeph.js";
import {html,css,attribute,property} from "./Zeph.js";
```

The following definition methods can be included, but it is best to only call.

 - html
 - css
 - attribute
 - property
 - onCreate
 - onAdd
 - onRemove
 - onAdopt
 - onAttribute
 - bind
 - bindAt
 - onInit
 - onEvent
 - onEventAt

We talk more about what each of these definition methods do below.

### Defining the Component

After we import ZephComponents and our definition methods, its time to define our component.  We do this by calling the `ZephComponents.define` method, like so:

```
ZephComponents.define("my-component",()=>{
});
```

`ZephComponents.define()` take two arguments:

 - **name** [string]: The name of the component we are defining. The name becomes the tag name of our component. This argument is required and may not be undefined, null, or empty string. The name must be unique and it must have at least one dash ("-") character in it.
 - **definition** [Function]: The definition is a function that is executed before the component is defined and registered. Inside of the defintion function, we call the definition methods (that we imported above) to describe how the component we are defining.

The ZephComponents define process works like this:

1. You define the component using `ZephComponents.define()`.
2. The definition function you pass as the second argument to `ZephComponents.define()` is executed and each definition method you include within it, describes some aspect of the definition. All of these definitions are used to build what we call a Component Context.
3. After the definition function has completed, ZephJS uses the ComponentContext to create a Component Class that describes the custom element you are defining.
4. ZephJS registers the component using the given name and Component Class using the [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

It is important to note that everything in the definition function is entirely optional. One could, if so desired, create a custom component without anything in the definition function at all.  It would be an incredibly boring component, but it is possible.

### Add HTML

A component without any content is a little boring, so next let us add some content.  We add content with our `html()` definition method.

`html()` takes one argument:

 - **content** [string]: The content argument may be either a filename to an HTML file that contains the content or it can be the content itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful. If the read was not successful, the content is treated as raw content and used.

```
 ZephComponents.define("my-component",()=>{
	 html("./my-component.html");
 });
```
```
ZephComponents.define("my-component",()=>{
	html(`
		<div>
			<span>Hello</span>
			</span>World</span>
		</div>
	`);
});
```

ZephJS uses 100% standard HTML. There is no special templating languange or virtual rendering system or the like. No inline `${blah}` variables are supported If you want the content to change based on some property changing, you will need to do this yourself; fortunately ZephJS gives you some helpful ways to do this.

As we know, when writing HTML we use a Tag which may contain inner content.  To address how to do that HTML provides the `<slot>` element. You use the `<slot>` element to declare where in the internal html (that defined by the `html()` definition method) the inner content is to be placed.  For example:

```
ZephComponents.define("my-component",()=>{
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

There is, of course, more to it then that, but this is enough to get you started.  If you want to know more about `<slot>` and how to use it, check out [this article](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

The html content you provide is used to define the internal content of the custom element.  Technically, the content gets inserted into the element's ShadowRoot and is thus masked from the main DOM structure. (ShadowRoot is part of the Shadow DOM standard API. See the [documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) for more details.)

You can use other custom components (whether created with ZephJS or not) within the html.

Additionally, you may call the `html()` definition method multiple times.  Each call gets appended to the previous call.

Using a `html()` definition method is not required.

### Add CSS

Adding CSS via the component definition is identical to the `html()` component definition.

`css()` takes one argument:

 - **content** [string]: The content argument may be either a filename to a CSS file that contains the CSS or it can be the CSS itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful. If the read was not successful, the content is treated as raw content and used.

```
 ZephComponents.define("my-component",()=>{
	 css("./my-component.css");
 });
```
```
ZephComponents.define("my-component",()=>{
	css(`
		div.myDiv {
			background: orange;
		}
	`);
});
```

ZephJS uses 100% standard CSS. There is no special css dervived language or shortcuts provided.

The CSS your provide for your custom element is ONLY for the custom element.  It does not leak out.

Likewise, the CSS does not leak in. That is, there is no way currently to address the inner content of a custom element via CSS Selector.  (Please read Monica Dinculescu's excellent article about the upcoming :part and :theme for a lot more details.)

You can style the custom element itself with the `:host` psuedo-selector. You can learn more about `:host` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) and about `:host()` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:host()).

You may call the css() definition method multiple times. Each call gets appended to the previous call.

Using a `css()` definition method is not required.

### Add Attributes

You can add an attribute to your custom element with the `attribute()` definition method. `attribute()` takes two arguments:`

 - **attrbitueName** [string]: The name of the attribute to add.  Attributes names are always lower-cased and must not be undefined, null, or empty string.

 - **initialValue** [*]:

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	attribute("disabled",undefined);
});
```

The use case for `attribute()` is to define an attribute and set its initial value. Technically speaking, this definition method is completely unnecessary.  We included it for readability purposes and potentially for future usage.

All values set on an attribute are automatically cast to a string. If `initialValue` is undefined or null, the attribute is not actually set, but actively removed.

If `initialValue` is provided and the attribute is already included in the element, the set value will win over the initialValue.

### Add Properties

You may also add properties to your custom element. `property` takes three arguments:

 - **propertyName** [string]:

 - **initialValue** [*]:

 - **transformFunction** [Function] (OPTIONAL):

```
ZephComponents.define("my-component",()=>{
	html("./my-component.html");
	css("./my-component.css");

	property("hello",1234);
	property("world","world",(value)=>{
		return value + "!";
	});
});
```

The use case for `property()` is to define a property and set its initial value. Technically speaking, the definition method is unnecessary, but defining properties allows you to define a transform function that gets called whenever the property is set which can be used to validate or transform the value.

If `initialValue` is provided and the propertyu is already included in the element, the set value will win over the initialValue.

### Add Lifecycle Handlers

A custom element has the following lifecycle:

 - **Definition**: Definition happens when you define a component via the `ZephComponents.define()` call. It is where you definition methods are executed and the Component Context is created. This will only occur once for each custom element defined.

 - **Initialization**: Occurs after an element is defined and registered with the Custom Elements API. This is directly following the Definition lifecycle event. This will only occur once for each custom element defined.

 - **Creation**: Occurs when someone instantiates a new instance of your custom element.  Each usage of your element in the html occurs an creation lifecycle event. This will occur multiple times for a given custom element, once for each time it is instanced.

 - **Addition** | **Removal** | **Adoption**: Occurs when an element is added or removed or adopted (moved from one document to another) to the DOM. This may occur multiple times for a single element as it moves around the DOM.

 - **Attribute**: Occurs when a given attribute changes. The may occur multiple times for a single element, as the attributes change.

You may tap into all of these Lifecycles in your component definition using the associated definition method:

 - **`onInit(handler)`** is associated with the Initialization Lifecylce event.  `onInit()` is good for follow-up work when defining a component.
	 - **handler** [Function]: The function executed when the Initialization Lifecycle event occurs.

 ```
 ZephComponents.define("my-component",()=>{
 	html("./my-component.html");
 	css("./my-component.css");

 	onInit(()=>{
		... do something ...
	});
 });
 ```

 - **`onCreate()`** is associated with the Creation Lifecylce event.  `onCreate()` is good for changing an element when it is instantiated.

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

 - **`onAdd()`** is associated with the Added Lifecylce event.  `onAdd()` is good for changing an element when it is added to the DOM.

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

 - **`onRemove()`** is associated with the Removed Lifecylce event.  `onRemove()` is good for changing an element when it is removed from the DOM.

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
 - **`onAdopt()`** is associated with the Adopted Lifecylce event.  `onAdopt()` is good for changing an element when it is Adopted by a new DOM.

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
 - **`onAttribute()`** is associated with the Attribute Lifecylce event.  `onAttribute()` is good for changing an element when a given attribute changes.

	 - **attributeName** [string]: The name of the attribute to observe for changes. This may not be undefined or null or empty string.

	 - **handler** [Function]: The function executed when the Attribute Lifecycle event occurs.  The function has the signature `(element,content)` where `element` is the created element and `content` is the internal Shadow DOM based on any `html()` calls.

 ```
 ZephComponents.define("my-component",()=>{
	 html("./my-component.html");
	 css("./my-component.css");

	 onAttribute((element,content)=>{
	 	 ... do something ...
	 });
 });
 ```

### Add Bindings

A particular use case comes up around watching attributes for changes and then propagating those changes to another part of the internal DOM of your custom element.  This could be done with the `onAttribute()` lifecylce handler, but since its such a common need, there is probably a better way. Once we started thinking about this case we also saw a need for not just watching attributes, but watcinhg content and properties as well.

That's where bindings come in. Bindings let you bind one part of your element or internal content to another part of your element or internal content.  You can bind an attribute, a property, or the content of your element or an internal content element, to an attribute, property, or content of the element or inner content elements.

A binding works like a copy function; it copies the value the attrbiute, property, or content of X to the attribute, property, or content of Y.  Additionally, each binding can be provided with a transformFunction, that is a function which is passed the value after it is copied.  The value returned by the transformFunction is the value which is set on the receiving end of the binding. This allows you to further enrich, format, or augment the binding value as it copies.

Bindings only update when the source of the binding (element and attribute/property/content) change.

Once you start thinking with bindings, doing certain things becomes super easy because ZephJS handles most of the work for you.

 - Copy an attrbiute of your custom element into a property of your custom element.
 - And vice-versa.
 - Copy an attribute of your custom element into the content property of an internal content element.
 - Copy a property from an internal content element to a different internal content element.

### Add Event Handlers
