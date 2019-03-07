# [ZephJS](../README.md) > Writing Components > Quick Start

A ZephJS Component can be built in ten (10) super easy steps which we are going to run through really quickly.  This is intended to be just a quick introduction.  For more information, each of these steps has a lot more detailed documentation which you can find in the [Sections](#sections) above.

### Our Example Component

There is no better way to start then to jump into the code, so here is the component we are going to build in our Quick Start guide.  Very simply, it is a custom Button called `<my-button>` that easily allows the addition of an icon. Nothing fancy.

Our component is made up of three separate files:
 - `my-button.js` which describes the component;
 - `my-button.html` which contains the internal content of our component;
 - and `my-button.css` which styles the component and the internal content.

After we look at the code we will break it down piece by piece.

> The code below is also available in our examples as [QuickStartExample](../examples/QuickStartExample). You can execute this code by going into that directory and executing the `zeph serve` command, and then visiting [http://localhost:4000](http://localhost:4000).

##### my-button.js

```javascript
 1:	import {ZephComponents} from "./zeph.min.js";
 2:	import {html,css,attribute,property,bind,onCreate,onEvent} from "./zeph.min.js";
 3:
 4:	ZephComponents.define("my-button",()=>{
 5:		html("./my-button.html");
 6:		css("./my-button.css");
 7:
 8:		attribute("icon","");
 9:		attribute("icon-placement","left");
10:		attribute("disabled",undefined);
11:
12:		property("clickCount",0);
13:
14:		bind("@icon","button > img","@src");
15:		bind("@disabled","button");
16:
17:		onCreate((element)=>{
18:			console.log("Element '"+element.getAttribute("name")+"' created!",element);
19:		});
20:
21:		onEvent("click",(event,element)=>{
22:			if (element.hasAttribute("disabled")) {
23:				event.stopPropagation();
24:				event.preventDefault();
25:				return;
26:			}
27:
28:			element.clickCount += 1;
29:
30:			console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
31:		});
32:	});
```

##### my-button.html

```html
1:	<button>
2:		<img/>
3:		<span>
4:			<slot></slot>
5:		</span>
6:	</button>
```

##### my-button.css

```css
01:	button {
02:		display: flex;
03:		flex-direction: row;
04:		border: 2px outset #66CCFF;
05:		border-radius: 3px;
06:		background: #DDEEFF;
07:		cursor: pointer;
08:		height: 100%;
09:		padding: 2px 5px;
10:		font-size: 14pt;
11:		align-items: center;
12:	}
13:
14:	button > img {
15:		flex: 0 0 auto;
16:		margin: 2px 0px 2px 5px;
17:	}
18:
19:	button > span {
20:		flex: 0 1 auto;
21:		align-items: center;
22:		justify-content: center;
23:	}
24:
25:	button[disabled] {
26:		border-color: #AAAAAA;
27:		cursor: not-allowed;
28:	}
29:
30:	button:hover:not([disabled]) {
31:		border-color: #3399FF;
32:		background: #66CCFF;
33:	}
34:
35:	button:active:not([disabled]) {
36:		background: #DDEEFF;
37:	}
38:
39:	:host([icon-placement=right]) button {
40:		flex-direction: row-reverse;
41:	}
42:
43:	:host(:not([icon-placement=right])) button > img {
44:		margin: 2px 5px 2px 0px;
45:	}
```

### Creating a New Component

We are going to need three files for writing our component:

 - `my-button.js`: A JavaScript file for defining our component.
 - `my-button.html`: An HTML file for providing our component content.
 - `my-button.css`: For styling our component and its content.

ZephJS provides a super fast way to generate stubs of these files using the Zeph Command Line Interface tool.  You can do this now if you wish to do so, or create these files by hand.

```shell
zeph create my-button
```

> Learn More: [Creating a New Component](./docs/ComponentCreation.md)

> Learn More: [Zeph Command Line Interface](./docs/CLI.md)

### Importing ZephJS

Next we edit our `my-button.js` file. We need to import the pieces we need to define a component. At the bare minimum we need to import the `ZephComponents` object, which contains our `define()` function we are going to use in the next step.

In this particular example we are also using:

 - `html`
 - `css`
 - `attribute`
 - `property`
 - `bind`
 - `onCreate`
 - and `onEvent`

```javascript
 1:	import {ZephComponents} from "./zeph.min.js";
 2:	import {html,css,attribute,property,bind,onCreate,onEvent} from "./zeph.min.js";
```

> Learn More: [Importing ZephJS](./ComponentImporting.md).

### Define The Component

The primary purpose of ZephJS is to easily create new Custom Elements. Once we have the `ZephComponents` object imported, we can use it to do just that with the `ZephComponents.define()` method. This method takes the `name` of the component we are defining (eg. `my-button`), and the `definition` which is a function wherein we describe the parts of our custom element.

In our example, the definition is everything from line 5 to line 31 and we will cover each of these lines below.

```javascript
 4:	ZephComponents.define("my-button",()=>{
	 ...
32:	});
```

> Learn More: [Defining the Component](./ComponentDefining.md).

### Inheritance

It is beyond the scope of our Quick Start Example, but we wanted to just mention a word about inheritance.  ZephJS allows one component, say out `my-button` componnent to inherit from another ZephJS defined component, if desired. Inheritance has its own definition method and rules, so if that is something you are interested in, please read the [Inheritance documentation](./ComponentInheritance.md).

> Learn More: [Inheritance](./ComponentInheritance.md).

### Add HTML

We add HTML to our component definition with the `html()` definition method. This method can take a string of HTML or it can reference an external file. We recommend the latter approach as it keeps your code a lot cleaner.

In the example we reference the `./my-button.html` file which contains our separated HTML markup code.

```javascript
 5:		html("./my-button.html");
```

The HTML for our code is pretty straight forward:

```html
1:	<button>
2:		<img/>
3:		<span>
4:			<slot></slot>
5:		</span>
6:	</button>
```

We have a `button` tag that has an `img` tag for an icon and a `span` tag for our text. The `slot` tag might be new to you; it is used to indicate where the content contained by our `my-button` element gets inserted. Dont worry too much about it for now if you are unfamiliar with the concept.

ZephJS uses 100% standard HTML. There is no special templating languange or virtual rendering system or the like.

Also worth noting is that our `img` tag has no `src` attribute. This is intentional as we will be populating the `src` attribute a touch later.

> Learn More: [HTML](./ComponentMarkup.md).

### Add CSS

We add styling information (CSS) to our component definition with the `css()` definition method. This method can take a string of CSS or it can reference an external file. We recommend the latter approach as it keeps your code a lot cleaner.

In the example we reference the `./my-button.css` file which contains our separated CSS styling.

```javascript
 6:		css("./my-button.css");
```

The CSS for our code is also pretty straight forward, if a little verbose:

```css
01:	button {
02:		display: flex;
03:		flex-direction: row;
04:		border: 2px outset #66CCFF;
05:		border-radius: 3px;
06:		background: #DDEEFF;
07:		cursor: pointer;
08:		height: 100%;
09:		padding: 2px 5px;
10:		font-size: 14pt;
11:		align-items: center;
12:	}
13:
14:	button > img {
15:		flex: 0 0 auto;
16:		margin: 2px 0px 2px 5px;
17:	}
18:
19:	button > span {
20:		flex: 0 1 auto;
21:		align-items: center;
22:		justify-content: center;
23:	}
24:
25:	button[disabled] {
26:		border-color: #AAAAAA;
27:		cursor: not-allowed;
28:	}
29:
30:	button:hover:not([disabled]) {
31:		border-color: #3399FF;
32:		background: #66CCFF;
33:	}
34:
35:	button:active:not([disabled]) {
36:		background: #DDEEFF;
37:	}
38:
39:	:host([icon-placement=right]) button {
40:		flex-direction: row-reverse;
41:	}
42:
43:	:host(:not([icon-placement=right])) button > img {
44:		margin: 2px 5px 2px 0px;
45:	}
```

ZephJS uses is 100% standard CSS. There is no special dialect of CSS or compilation step needed.

The CSS applies to the internal content of the element, or with the usage of the `:host` psuedo-selector, the custom element itself. About the only confusing bit of our CSS is this `:host()` psuedo-selector. `:host` and `:host()`  allows our CSS to style the custom element itself.

> Learn More: [CSS](./ComponentCSS.md).

### Add Attrbitues

Next, we add Attributes to our component definition with the `attribute()` definition method. Doing this step is completely optional, but it will help your component be cleaner.

The `attribute()` call takes an `attributeName` string (case-insensitive) and an optional `initialValue`.

Our example here is adding three (3) attributes: `icon`, `icon-placement`, and `disabled`.

```javascript
 8:		attribute("icon","");
 9:		attribute("icon-placement","left");
10:		attribute("disabled",undefined);
```

It is worth noting that the initial value is only used if the attribute is not set in the tag usage. So in our example if we had `<my-button icon-placement="right">` the `left` value on line 9 would not be used.

> Learn More: [Attributes](./ComponentAttributes.md).

### Add Properties

Like attributes we can add Properties to our component definition with the `property()` definition method. Properties are values placed on the custom element itself and different then attributes. Doing this step is completely optional, but it will help your component be cleaner. It is also a good place for initializing properties without the need to have an `onCreate()` handler.

The `property()` call takes a `propertyName` string (case-sensative) and an optional `initialValue`.

We add one (1) property in the example, `clickCount`, and set its initial value to `0`.

```javascript
12:		property("clickCount",0);
```

It is worth noting that the initial value is only used if the property is not set in the element prior to creation.

> Learn More: [Properties](./ComponentProperties.md).

### Add Lifecycle Handlers

A Component has a Lifecycle that it goes through:

**Definition** &rArr; **Initialization** &rArr; **Creation** &rArr; **Addition** | **Removal** | **Adoption** | **Attribute** | **Property**

Each of these stages has an associated Lifecycle Event to which our code can respond. This is done using the `onInit()`, `onCreate()`, `onAdd()`, `onRemove()`, `onAdopt()`, `onAttribute()`, or `onProperty()` definition methods. Each of these methods takes a handler function as its sole argument, and that function is executed when the named Lifecycle Event occurs. Using on of these methods is entirely optional and in most cases completely unnecessary.

In our example, we are using the `onCreate()` Lifecycle Handler to log a brief message out.

```javascript
17:		onCreate((element)=>{
18:			console.log("Element '"+element.getAttribute("name")+"' created!",element);
19:		});
```

> Learn More: [Lifecycle Handlers](./ComponentLifecycleHandlers.md).

### Add Bindings

On very common use case that ZephJS tries to make easier is when something changes on or in our custom element we want to copy that changed value to some other part of our custom element or our custom element's internal content.  That's what Bindings are for.

We use the `bind()` and `bindAt()` definition methods in our component definition to signal that when X changes, copy it to Y.

You can `bind()` to an attribute, a property, or the content of the custom element. You can also `bindAt()` to an attribute, property, or the content of some element in the internal content of the custom element.

In our example we do two(2) bind calls:
 - The first binds the attribute `icon` to the internal content `img` tags `src` attribute. Thus changes to our `icon` attribute, including the initial one, get propagated down to our internal `img` tag.
 - The second binds the attribute `disabled` to the internal `button` element, ensuring that the disabled behavior will translate forward into our internal content's button.

```javascript
14:		bind("@icon","button > img","@src");
15:		bind("@disabled","button");
```

Bindings are one of the more complicated pieces of ZephJS so we strongly encourage you to read the [Bindings](./ComponentBindings.md) documentation.

> Learn More: [Binding](./ComponentBindings.md).

### Add Event Handlers

The last piece to cover is adding an Event Handler to our component definition with the `onEvent()` or `onEventAt()` definition methods. Whenever some action from an external entity (like the user) occurs on our custom element, an event will occur. Using our Event Handlers we can respond to those actions by changing the custom element or its internal content in some manner.

`onEvent()` takes two arguments: the `eventName` we want to handle, and the `handler` function to execute when the event occurs.

In our example below we want to respond to a `click` event on our custom element. Within that handler we are doing three things: If the element is disabled, stop doing anything. Otherwise, incremenet the clickCount property and log the counter out.

```javascript
21:		onEvent("click",(event,element)=>{
22:			if (element.hasAttribute("disabled")) {
23:				event.stopPropagation();
24:				event.preventDefault();
25:				return;
26:			}
27:
28:			element.clickCount += 1;
29:
30:			console.log("Button '"+element.getAttribute("name")+"' clicked "+element.clickCount+" times.");
31:		});
```

> Learn More: [Event Handlers](./ComponentEventHandlers.md).

### Putting it All Together

That's it.  Thats our `my-button` component. And now that you understand the basics you can being to see how easy and understandable Web Components can be with ZephJS.

One last thing though, if you want to write something to test out `my-button` you can do so with a simple HTML file.  This is the `index.html` from our example code:

```html
01: <!DOCTYPE html>
02: <html lang="en" dir="ltr">
03: 	<head>
04: 		<meta charset="utf-8">
05: 		<title>Zeph - Examples - HelloBadge</title>
06: 		<script src="./my-button.js" type="module"></script>
07: 	</head>
08: 	<body>
09: 		<my-button name="regular">I'm a Button!</my-button>
10: 		</br>
11: 		<my-button name="disabled" disabled>I'm a Disabled Button!</my-button>
12: 		</br>
13: 		<my-button name="left-icon" icon="./my-button.png">I'm a Left Icon Button!</my-button>
14: 		</br>
15: 		<my-button name="right-icon" icon="./my-button.png" icon-placement="right">I'm a Right Icon Button!</my-button>
16: 	</body>
17: </html>
```

The lines to pay attention to here are Line 6, where we import our `my-button` element, and Line 9, 11, 13, and 15 that all use it.

### What's Next?

After you have the quick start down we strongly encourage you to continue reading with the next sections of our guide [Component Concepts](./Component Concepts.md).

 - **Quick Start**
 - [Component Concepts](./ComponentConcepts.md)
 - [Creating a New Component](./docs/ComponentCreation.md)
 - [Importing ZephJS](./ComponentImporting.md)
 - [Defining the Component](./ComponentDefinition.md)
 - [Inheritance](./ComponentInheritance.md)
 - [HTML](./ComponentMarkup.md)
 - [CSS](./ComponentStyling.md)
 - [Attributes](./ComponentAttributes.md)
 - [Properties](./ComponentProperties.md)
 - [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
 - [Bindings](./ComponentBindings.md)
 - [Event Handlers](./ComponentEvents.md)
 - [Bundling for Distribution](./docs/ComponentBundling.md)
