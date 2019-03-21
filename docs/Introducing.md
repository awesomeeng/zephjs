# Introducing ZephJS

We are pleased to announce the release of [ZephJS](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)!

ZephJS is an extremely easy to use, simple to understand, ultra-light framework for defining and using Web Components. ZephJS is perfect for people writing component libraries, teams building applications or sites that just require a few custom components, or projects building whole applications that do not want the gigantic weight of a modern JavaScript browser framework. ZephJS simplifies the process of defining custom Web Components into a highly readable declarative structure that uses standard JavaScript, standard HTML markup, and standard CSS styling. And ZephJS weighs in at less than 20k minified!

Here's an example of using ZephJS to build a customized button:

##### my-button.js

```javascript
import {ZephComponents} from "./zeph.min.js";
import {html,css,attribute,property,bind,onCreate,onEvent} from "./zeph.min.js";

ZephComponents.define("my-button",()=>{
	html("./my-button.html");
	css("./my-button.css");

	attribute("icon","");
	attribute("icon-placement","left");
	attribute("disabled",undefined);

	property("clickCount",0);

	bind("@icon","button > img","@src");
	bind("@disabled","button");

	onCreate((element)=>{
		console.log("Element '"+element.getAttribute("name")+"' created!",element);
	});

	onEvent("click",(event,element)=>{
		if (element.hasAttribute("disabled")) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		element.clickCount += 1;

		console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
	});
});
```

ZephJS uses modern, standard JavaScript to make writing Web Components super easy to do. There is no mucking about with Shadow DOM or figuring out how to add encapsualted styles; Zeph handles all of that for you. Want to add an attribute to your Web Component? Zeph has you covered with its `attribute()` declaration.  Want that attribute to update a component in your Web Component's internal content? Zeph has you covered with support for Attribute/Property/Content binding. Want to handle a click event on a button nested in your Web Component's internal content? Zeph makes it easy to do so. Zeph provides all the tools you need to define and use modern Web Components.

## How ZephJS Works

At the heart of ZephJS is the `ZephComponents.define()` method to which you provide the name of your component and the definition of that component.  The definition is a standard JavaScript function within which you call a number of declarative definition methods to describe the content, style, and interactions of your Web Component.

The definition methods you call builds what ZephJS calls a "context" that describes the Web Component.  It uses this context to create a unique class which is used with the [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) to register the Web Component for usage in your HTML.  When the registered component is created (via tag usage or `document.createElement()`) the constructed class constructor is called and ZephJS populates the component as described in the context.

#### Definition Methods

There are currently seventeen different definition methods for you to describe your Web Component with ranging from providing HTML and CSS to handling events. Here are the some of the most useful...

> **html()** is used to add the internal content of your Web Component, that is all the HTML that makes up the inner workings of your component.

> **css()** is used to associate a set of internal CSS style rules to your content. These rules can target the internal content (provided by `html()` above) or the created element itself (with the `:host` and `:host()` psuedo-selectors.)

> **attribute()** adds an attribute to your custom element and associates an initial value with that attribute.

> **property()** adds a property to your custom element and associates an initial value with that property.

> **bind()** and **bindAt()** are used to watch for attribute/property/content changes in your element and then propagate the changed value to some other attribute/property/content of a different element. (See "Bindings" below.)

> **onInit()** / **onCreate()** / **onAdd()** / **onRemove()** / **onAdopt()** all allow you to provide a callback function to execute when certain [ZephJS Lifecycle events](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentConcepts.md#component-lifecycle) occur. For example, `onAdd(myAddHandler)` would execute when the element is added to some Document or DocumentFragement.

> **onAttribute()** is used to execute a callback if a given attribute on the element is changed.

> **onProperty()** is likewise used to execute a callback if a given property of the element is changed.

> **onEvent()** and **onEventAt()** are used to execute some callback handler when a given event (like a mouse click or a keystroke) occurs.

There are a few other definition methods, but these are the key ones. If you want to know more, check out the [ZephJS Quick Start guide](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentQuickStart.md) or the [ZephJS API documentation](https://github.com/awesomeeng/zephjs/blob/master/docs/API.md)

#### Inline vs Separated Content

With both the `html()` and `css()` definition methods you may either provide the content inline as a string, or you may provide a URL or relative filename.  If the latter, ZephJS will go out and load the URL or relative filename and use that as the content for the call.

ZephJS highly recomends you use the relative filename approach.  This allows you to separate your code, content, and style information cleanly.

Additionally, ZephJS provides a [bundler tool](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentBundling.md) that will read your component(s) and all of the associated `html()` and `css()` file references and bundle them into a single usable JavaScript file for production systems or distribution. This means keeping your code clean and separated can be done without impacting your external performance.

#### Bindings

Due to the ZephJS design goal to "Never try to outwit the browser", ZephJS does not provide inline binding template strings the way most of the big JavaScript frameworks do. However, ZephJS does provide bindings rooted to the element or an element within the web components internal content. To do so you provide the source element you want to watch, what you want to watch on that source element (attribute, property, or content), the target element to propagate the change to, and what on the target element to propagate to (attribute, property, or content).

Here are a few examples:

```javascript
bind("@value","div > input.username","@value");
```

This would bind the Attribute "value" on the custom element to propagate any changes to the attribute "value" on the element "div > input.username" within the internal content.

You could even shorten this by dropping the last argument; ZephJS will use the source name ("@value") for the target name, if not provided.

```javascript
bind("@value","div > input.username");
```

Here's another example:

```javascript
bindAt("button",".clickCount","div > span.counter","$");
```

This would bind the property "clickCount" on the "button" element to propagate any changes to the content (specified here as "$") of the "div > span.counter" element.

Bindings use a special notation to determine if you are refering to an Attribute, a Property, or the content of an element, but once you understand the rules of the notation it is pretty easy to read:

 - An Attribute is prefixed by the "@" character as in "@value".
 - A Property is prefixed by the "." character as in ".value".
 - The content of an element is specified by the entire string "$".

Bindings are a really simple, but highly useful way to move information around in your Web Component without having to worry about all the boilerplate details to do so.  It is yet another example of how ZephJS tries to simplify the heavy lifting for you.

#### Events

When you are defining a Web Component you are defining the details about an element that will be created later.  As such, adding events around those elements is normally non-trivial.  ZephJS, however, makes it super easy with the `onEvent()` and `onEventAt()` definition methods.

First, you tell ZephJS what element you want to watch for events: the `onEvent()` method watches the custom element itself, while the `onEventAt()` method takes a CSS Query Selector string as its first argument and matches it against any element within its internal content.

Next, of course, you give the name of the event you want to watch for, such as "click" or "keyup" or "dragstart".  Any event that would occur on an element can be used.

Finally, you provide a callback function to execute when the event occurs.  This callback function receives the event object, but it also receives the custom element itself and the internal content, allowing you to interact with all the pieces of the web component.

## Getting Started

So that is the basics of ZephJS the extremely easy to use, simple to understand, ultra-light framework for defining and using Web Components. We have covered all the key features of ZephJS, but there is, of course, lots more.  Fortunately ZephJS has provided a ton of documentation to read and learn about all the in's and out's of building Web Components.

We recommend you get started here, with our Quick Start Guide:

- [Quick Start Guide](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentQuickStart.md)

But if you are more interested in a specific area...

 - Components
   - [Component Concepts](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentConcepts.md)
   - [Creating a New Component](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentCreation.md)
   - [Importing ZephJS](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentImporting.md)
   - [Defining the Component](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentDefinition.md)
   - [Inheritance](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentInheritance.md)
   - [HTML](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentMarkup.md)
   - [CSS](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentStyling.md)
   - [Attributes](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentAttributes.md)
   - [Properties](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentProperties.md)
   - [Lifecycle Handlers](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentLifecycleHandlers.md)
   - [Bindings](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentBindings.md)
   - [Event Handlers](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentEvents.md)
 - Services
   - [Services](https://github.com/awesomeeng/zephjs/blob/master/docs/Services.md)
 - API
   - [API Documentation](https://github.com/awesomeeng/zephjs/blob/master/docs/ZephComponents.md)
 - Bundling
   - [Bundling for Distribution](https://github.com/awesomeeng/zephjs/blob/master/docs/ComponentBundling.md)
 - Command Line Tool
   - [Command Line Tool](https://github.com/awesomeeng/zephjs/blob/master/docs/CLI.md)

Naturally though, there is no better way to learn ZephJS then to roll up the proverbial sleves and try it out...

You can start by checking out the [ZephJS repository](https://github.com/awesomeeng/zephjs).  From there you can learn all about the details of ZephJS including how to install it and get started using it.

## Reaching Out

We are super excited about ZephJS and really want to hear from you.  Feel free to drop us a line, file a bug, submit a PR, whatever.  We would love to hear what you are doing with ZephJS and all the multitude of ways you find it cool.
