# [ZephJS](../README.md) > FAQ

Here we present answers to some of the most common ZephJS questions.

If you have a question and it is not covered here, please feel free to submit an issue.  We will answer it as quickly as possible, and if appropriate, add it to the FAQ here.

## Technology

#### What technologies are used in ZephJS?

ZephJS is built for modern, forward, browsers and as such uses several very new browser specifications.  In particular ZephJS requires the following browser support:

 - JavaScript 2017 (ES8/ES2017)
   - Arrow Functions
   - Classes
   - let/const keywords
   - Promises
   - async/await
 - Fetch API
 - ES Modules
 - HTML Templates
 - Mutation Observer API
 - ShadowDOM API v1
 - Custom Elements API v1

If your browser does not support all of these technologies, you may be able to use a [Polyfill](./Polyfill.md) to provide this functionality.  Please read our [Polyfill Documentation](./Polyfill.md) for more details.

#### What technologies is ZephJS watching for future inclusion?

 - `::part()` and `::theme()` - These are two new CSS Pseudo-selectors that will allow component authors to expose parts of their components for styling.  The best read on this is [Monica Dinculescu's excellent article](https://meowni.ca/posts/part-theme-explainer/).

 - Constructable Style Sheets - This is a technique to allow stylesheets to be shared between the global space and each other; essentially allowing a component author to specify a global sheet that applies to all their elements and potentially exposes that for consumers.  Here's the [Constructable Style Sheet specification](https://wicg.github.io/construct-stylesheets/).

 - Decorators - Decorators are a programmatic way to apply syntactic sugar into JavaScript that exposes certain behaviors.  Decorators are available in languages like TypeScript and Java already.  ZephJS is watching to see how the specification plays out and considering how it could use decorators instead of definition methods in the future. Here's the [Decorators specification](https://github.com/tc39/proposal-decorators)

## Basic Usage

#### How do I define a custom element?

ZephJS makes this super easy... Simply call the `define()` method on the `ZephComponents` object, like this...

```javascript
import {ZephComponents} from "./Zeph.js";

ZephComponents.define("my-button",()=>{
	...
});
```

The `define()` method takes two arguments: the `name` of the component you want to define, and the `definition` of that component, which is a javascript function (arrow functions work great here).

Within your `definition` function, you use zero or more [definition methods](./ComponentDefinition.md) to describe your component.  The include methods for specifying the html, css, attributes, properties, and events... everything your component needs.

You can read more about [Component Definition](./ComponentDefinition.md) in our documentation.

#### How do I add HTML content?

Simple.  Within your component definition, you call the `html()` definition method.  This method takes as its first argument the HTML content your want to add, or a filename/URL reference to the HTML you want to add.

You can read more about [Adding HTML Content](./ComponentMarkup.md) in our documentation.

#### What's the difference between `element` and `content`?

ZephJS uses these terms a lot in the documentation, so it can be a little confusing:

**element** means a single element instance of a given component.  An element is the realization of the component you define.  Elements are defined using `ZephComponents.define()` but are actualized by using the tag name in the html or with `document.createElement()`.

**content** refers to the internal DOM content of an **element** that was defined with ZephJS. That is, all of the `html()` content specified within the component definition.

Another way to think of this is that **element** represents the element created and **content** represents everything internal to that element.

Technically, **element** is an instance of `HTMLElement`, a single DOM node.  **content** is a ShadowRoot interface which is the root node of a DOM subtree.  **element** can be treated just like any other element you are probably used to working with.  **content** is more like (and in fact is) a DocumentFragment that contains other nodes, as opposed to being a node itself.

#### How do I add CSS Styling?

CSS is magically handled by ZephJS to be super easy.  Within your component definition, you call the `css()` definition method.  This method takes as its first argument the CSS content your want to apply, or a filename/URL reference to the CSS you want to apply.

You can read more about [Adding CSS styling](./ComponentStyling.md) in our documentation.

#### Do I need to add attributes?

Technically, you do not need to use the `attribute()` definition method to add attributes.  Just adding them in the HTML or with `setAttribute` is fine.  `attribute()` is more of a convenient way to describe the attributes of your component.  It make the component more readable and it attributes more obvious.  It also will save you from having to provide a `onCreate` handler for setting default values.

You can read more about [Adding Attributes](./ComponentAttributes.md) in our documentation.

#### Do I need to add properties?

Using `property()` is optional, but again it is useful for making your component much more readable.  It also is a much simpler and cleaner way to set default values and do validation on changes.

You can read more about [Adding Properties](./ComponentProperties.md) in our documentation.

## Definition Methods

#### How does inheritance work with `from()`?

Normally JavaScript inheritance works by defining a class and saying that it extends from some other class.  However, with WebComponents things get a little chaotic when using this approach, so ZephJS does it slightly differently.

Say we have two components `my-button` and `my-icon-button`.  One might say that `my-icon-button` inherits from `my-button`.  The expected behavior would be that `my-button` produces a class which is then extended to create `my-icon-button`.

However, with ZephJS all components actually inherit directly from `HTMLElement`.  Instead, when using the `from()` method ZephJS clones the component context referenced by `from()` which contains a synopsis of everything in that components definition.  This cloned context is then used as the starting context for the extending component.  This produce a new context that is informed by the extended class, but augmented by the extending class.

ZephJS does this partially because of some of the weirdness with WebComponent inheritance, but it also means that component html, css, etc, are only downloaded once, and overall provides a cleaner inheritance structure.

The downside, of course, is there is no nice clear class inheritance structure in ZephJS.  Sorry.

You can read more about [Inheritance](./ComponentInheritance.md) in our documentation.

#### What are the rules around using `alias()`?

`alias()` provides a means to create duplicate tag names for a given component.  So long as the tag name provided by `alias()` is not already defined and conforms to the tag name requirements, have at it.  All tag names must contain at least one dash ("-") character.

#### Can `html()` be used multiple times? What happens?

Yes, you can call `html()` in a single component definition multiple times.  If done so, the content provided by `html()` is appended to one another, **unless specifically stated not to append**.

`html()` can take as its second argument an object of options.  One of those options `overwrite` if set to `true` will cause that `html()` call to **overwrite** all prior `html()` calls.  Any subsequent `html()` call is appended, again, unless `overwrite` is set.

#### Can `css()` be used multiple times?

Yes, you can call `css()` in a single component definition multiple times.  If done so, the styles provided by `css()` is appended to one another, **unless specifically stated not to append**.

`css()` can take as its second argument an object of options.  One of those options `overwrite` if set to `true` will cause that `css()` call to **overwrite** all prior `css()` calls.  Any subsequent `css()` call is appended, again, unless `overwrite` is set.

#### What happens if I define an `attribute()` multiple times?

If you define an attribute multiple times, the last definition wins.  That means the last default value and the last transform function will be the only ones that are applied.

#### What happens if I define a `property()` multiple times?

If you define a property multiple times, the last definition wins.  That means the last default value and the last transform function will be the only ones that are applied.

#### What is a lifecycle handler?

A component goes through a series of "lifecycle events" during its life...

**Definition** &rArr; **Initialization** &rArr; **Creation** &rArr; **Addition** | **Removal** | **Adoption** | **Attribute** | **Property**

This lifecycle can be tapped into with a Lifecycle Handler such as `onInit()` or `onRemove()`.  These handlers are executed as the component moves through its lifecycle and provide a key means to interact with the component.  That said, a lot of the ZephJS definition methods are built to provide a method to do certain things without having the write a lifecycle handler.  `property()`, `bind()`, `onEventAt()` to name a few, provide a means to do certain thins one might normally do with a lifecycle handler. Whenever possible, use the definition methods and save yourself the effort of using a lifecycle handler.

You can read more about [Component Lifecycle Handlers](./ComponentLifeCycleHandlers.md) in our documentation.

#### What happens if I use multiple lifecycle handlers like `onCreate()`?

Using multiple Lifecycle Handler calls for the same lifecycle event is supported and each handler will execute independent of the other handlers.

ZephJS does not guarantee that the handlers will execute in order.

#### What happens if I list a handler for an `onEvent()` multiple times?

You may provide multiple `onEvent()` and `onEventAt()` handlers for the same event (and same target elements). Each will execute independent of the others.

ZephJS does not guarantee that the handlers will execute in order.

## Bindings

#### How do bindings work?

Fundamentally a binding propagates some value from one element/content to another element/content.  The value can be driven by a changing attribute, property, or content of a source element.  This can then be propagated to some other attribute, property, or content of a target element.

For example, we can bind an attribute "value" of the custom element to propagate to the property "count" of a specific element ("div > .hello") within the internal content of that element, as shown here:

```javascript
bind("@value", "div > .hello", ".count");
```

Binding basically involve five things:

 - The **source element**, or the element being watched for a change. With `bind()` the source element is always the custom element itself, but with `bindAt()` you specify the source element as a CSS Query Selector string as the first argument.
 - The **source name** describes the attribute, property, or content you want to watch for a change.  Source Name uses a custom terminology to indicate what you are watching:
   - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
   - **Property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
   - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **Target element** is the element to which one wants the changed value propagated.
 - The **target name** is the attribute, property, or content to which the propagated value is written.  Target Name uses a custom terminology (the same as Source Name) to indicate to what you are writing:
   - **attribute** names always start with the "at" character ("@") as in `@my-attribute` or `@value`.
   - **Property** names always start with the dot/period character(".") as in `.myProperty` or `.value`.
   - **content** names are always just a single dollar sign character ("$") as in `$`.
 - **Transform Function** is an optional argument to `bind()` and `bindAt()` that can be used to validate or modify the changed value before it is written.

You can read more about [Bindings](./ComponentBindings.md) in our documentation.

#### How do I bind to an Attribute?

You can bind to an attribute of the element with the `bind()` method:

```javascript
bind(sourceName, targetElement, targetName, transformFunction = null);
```

Or to an element within the internal content with `bindAt()`:

```javascript
bind(sourceElement, sourceName, targetElement, targetName, transformFunction = null);

```

By providing an attribute descriptor for **sourceName** your are binding to that attribute.  Attribute descriptors start with the "@" character and are followed by the name of the attribute.  So for the "value" attribute, you would specify "@value".

You can read more about [Bindings](./ComponentBindings.md) in our documentation.

#### How do I bind to a Property?

You can bind to a property of the element with the `bind()` method:

```javascript
bind(sourceName, targetElement, targetName, transformFunction = null);
```

Or to an element within the internal content with `bindAt()`:

```javascript
bind(sourceElement, sourceName, targetElement, targetName, transformFunction = null);
```

By providing a property descriptor for **sourceName** your are binding to that property.  Property descriptors start with the "." character and are followed by the name of the property.  So for the "value" property, you would specify ".value".

You can read more about [Bindings](./ComponentBindings.md) in our documentation.

#### How do I bind to the content?

You can bind to the content of the element with the `bind()` method:

```javascript
bind(sourceName, targetElement, targetName, transformFunction = null);
```

Or to an element within the internal content with `bindAt()`:

```javascript
bind(sourceElement, sourceName, targetElement, targetName, transformFunction = null);
```

By providing the content descriptor for **sourceName** your are binding to that element's content. Content descriptors are the entire string of "$".

You can read more about [Bindings](./ComponentBindings.md) in our documentation.

#### What happens if my bind source or target returns multiple elements?

If a source or target for a `bind()` or `bindAt()` returns multiple matching elements, all elements are bound individually in all possible combinations.

#### What happens if my bind source or target returns no elements?

If a source or target for a `bind()` or a `bindAt()` returns no elements, nothing is bound.

#### Can I modify a specific part of the content using bind?

Yes and no.  Yes, if that content is selectable using a CSS Query Selector.  No if otherwise.  Basically, you can target a specific custom element or anything within that custom element's internal content to receive the propagated changes, but only if it is selectable.

## Events

#### What events can `onEvent()` and `onEventAt()` handle?

`onEvent()` and `onEventAt()` can receive any event that an element can recieve.  Here's a list: [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)

You can read more about [Event Handling](./ComponentEvents.md) in our documentation.

## Styling

#### How do I change the styles of a ZephJS defined component?

If you are the component author, you use the `ccs()` definition method to provide your component CSS that defines the style of your component.  Your CSS Selector Rules can reference the custom element itself with `:host` and `:host()` or otherwise generally apply to the internal content of your component.

If you are a component user, unless the component author intentionally wants you to modify the styling there is no way currently to address the inner content of a custom element via CSS Selector.  The internal elements content is intentionally isolated.  There are some promising things coming in the future to address this.  [Syling Web Components Using a Shard Style Sheet](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/) provides a good overview of the situation.  Also you can read [Monica Dinculescu's excellent article](https://meowni.ca/posts/part-theme-explainer/) about the upcoming `:part` and `:theme` for a lot more details.

You can read more about [Component Styling](./ComponentStyling.md) in our documentation.

## ZephJS Command Line Tool

#### What commands does the ZephjS CLI support?

Currently the ZephJS CLI supports the following commands:

 - **help**: Prints out help about the CLI.
 - **hello**: Creates the ZephJS Hello World example application in the current directory.
 - **create**: Given some component name, creates the scaffolding for that component to be built in the current directory.
 - **serve**: Spins up a HTTP server that serves files from the current directory. Useful for testing and debugging.
 - **bundle**: Given some component entry point (like `my-button.js`) bundles all of the JavaScript, HTML, CSS, and resources (images, fonts, etc) into a single JavaScript file for distribution or production runs.

You can read more about [The ZephJS CLI Tool](./CLI.md) in our documentation.

#### How does the `bundle` command work?

The `bundle` command is used to turn a ZephJS project spread across multiple files into a single cohesive JavaScript file for distribution or production systems.  It does this by parsing your ZephJS definition JavaScript and using [Rollup](https://rollupjs.org/guide) to merge it all together.  Additionally any `html()`, `css()` or resource reference (`image()`, `font()`, etc) that references a file has that file contents inlined into the JavaScript.  This means all the details necessary to distribute your component or component library gets bundled up into a single file.

#### I get a Windows Scripting Host error when I use the `zeph` command.  Am I doing something wrong?

This problem only occurs in Windows OS based machines and only if you are executing the `zeph` command in a directory that contains the `Zeph.js` file.  This occurs because at some point you indicated that the default behavior for JavaScript files in your Windows system should be to execute them via Windows Scripting Host.  Fortunately, there is an easy fix.

If you edit the `PATHEXT` environment variable and remove the `.js` portion of it, this will resolve the problem.  You may need to restart any open shells after doing this edit.

(To edit this environment variable go to Start > Type "Environment" > Select "Edit the System Environment Variables" > Click the "Environment Variables" button")
