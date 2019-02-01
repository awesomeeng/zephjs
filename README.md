# ZephJS

ZephJS (commonly called just "Zeph" and pronounced "Zef") is an ultra-light framework for defining and using Web Components in your Web Pages and Applications. No need to learn TypeScript, no complex funcational programming requirements, and only a little bit of hidden magic.  With ZephJS you write components in plain JavaScript code, standard HTML markup, and standard CSS Styling.

## Justification

The promise of Web Components was that we would be able to easily load a component onto our web page and use it. But to date that promise has not been fulfilled. The current Web Components standards lack an implemented method for easily loading components or component libraries, and writing a web component in JavaScript is far from an easy or straight-forward task.  Couple this with the current generation of web frameworks that add even more complexity to what was promised to be a very simple activity. Writing a web component should not require you to learn a new language (or superset language) or learn a new programming paradigm. It should be simple, obvious, and require no more effort than writing JavaScript/HTML/CSS does.

ZephJS aims to bring the promised ease of web components back to our community. It does so by living up the following principals:

 - Make it easy for a component or component library to be used by others.
 - Use the standards and technologies that have made the web great.
 - Apply modern browser standards (Web Components, Shadow DOM, ElementOberserver, etc).
 - Keep it incredibly small and light. ZephJS is currently less than 32k.

Please dont misunderstand us: React, Vue, Angular, Svelte (more people should use Svelte) all have their place. Very large web applications will always have a need for frameworks such as these. But a lot of sites dont need this kind of weight; they just want to drop in a handful of components and go.  And that's the space for which ZephJS was built.

## Contents
 - [Usaage](#usage)
 - [Build Your First Component](#build_your_first_component)
 - [Breaking Down a Component](#servers)
 - [Documentation](#documentation)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)
 -
## Usage

Mostly people using ZephJS do not even need to know how to use ZephJS or what it is. Instead they just want to include a collection of components built on top of ZephJS.  Fortunately, that means they can stop reading now and instead go read the instructions for that component collection.

If you are interested in finding a component collection, here is a list of known collections:

 - **[Mistral](https://github.com/awesomeeng/zephjs-mistral)** - Mistral is the "default" collection that was built using ZephJS.

However, for those who want to build their own component collections, well, keep reading and we will walk your through building your own components.

## Build your first Component

Creating a component in ZephJS is super easy.

#### Step 1 - Install node.js

ZephJS is built as a node.js application, so you will need nodejs installed. You can find installers at [nodejs.org](https://nodejs.org) for whatever Operating System you are using.

#### Step 2 - Install ZephJS from npm:
```
npm -g install zephjs
```

#### Step 3 - Create the "Hello" example using the ZephJS Command Line tool:
```
zeph hello
```

#### Step 4 - Run a Server

If you dont have a Web Server installed, dont sweat it. ZephJS's command line tool has you covered.

```
zeph serve
```

#### Step 5 - Have a Look

Surf your favorite web browser over to [http://localhost:4000](http://localhost:4000) and have a look at your work.

## Breaking Down a Component

Now that we have seen a component in action, lets take a quick look at what makes it tick.

### What is a Web Component?

A Web Component is a set of Browser API standards for defining custom html elements that encapsulate their content (HTML), styling (CSS) and behavior (JavaScript) into a unified, reusable, HTML-compliant package.  You create a Web Component by defining a custom element name and supplying it with content, styling, and behaviors.

However, as is often the case with browser standards, using Web Components can be a little confusing and esorteric.  ZephJS aims to solve that by defining a simple, lightweight wrapper around these standards and abstracting away the confusing bits. Using ZephJS makes your components simple and clean, easy to read and work with.  ZephJS is not the only solution out there to do this, but we think it's the best.

You can learn more about Web Components at the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

### ZephJS Conventions

ZephJS does not enforce any specific conventions to how you layout your code, however, we do make the following recommendations:

 - Try to define only one component per `.js` file. Sometimes there are really good reasons to break this rule though.
 - Try to separate your markup/HTML code into a separate `.html` file that lives in the same directory and shares the same name.
 - Try to separate your style/CSS code into a separate `.css` file that lives in the same directory and shares the same name.
 - When in doubt, keep it simple!

### ZephJS Components

A ZephJS Component is created by calling `ZephComponents.define(name,definition)`.  The `name` argument provides the name of the custom element you are defining; and it must contain at least one dash '-' character.  The `definition` argument provides all the the details about the component and how it works; it is a function and within that function you make various definition method calls to describe your component: its content, its styling, and its behaviors.

When you ran the `zeph hello` command, ZephJS created a `hello-world.js` file that describes the `<hello-world>` component we are going to use. Let's take a look at that code now:

```
 1: import {ZephComponents,html,css,bindAttribute,onEventAt} from "./Zeph.js";
 2:
 3: ZephComponents.define("hello-world",()=>{
 4:   html("./hello-world.html");
 5:   css("./hello-world.css");
 6:
 7:   bindAttribute("name",".output .name","$");
 8:
 9:   onEventAt("input","keyup",(event,selected,element)=>{
10:     let value = selected.value;
11:     if (!value) element.removeAttribute("name");
12:     else element.setAttribute("name",value);
13:   });
14: });
```

 - Line 1 imports our objects and methods from ZephJS.  There's a lot more of these and we will cover them all in a bit.

 - Line 3 is our component definition. We are defining a component called `hello-world` with the given definition.

 - Lines 4-13 describe the definition methods for defining that component.

 - Line 4 states that our component will have the given HTML. This can be a string of HTML or a filename to an external source of HTML as shown here.

 - Line 5 states that our component will have the given CSS. This can be a string of CSS or a filename to an external source of CSS as shown here.

 - Line 6 binds the attribute `name` of the component we are creating, to the attribute of another component in our internal HTML.  We cover binding in much great detail in our [Component Bindings](./docs/ComponentBindings.md) documentation.

 - Lines 9-13 describe an event handler for our custom element. Specifically we are going to listen for a `keyup` Event At a specific element in our internal html content. When the keyup event occurs, the given function will execute. We cover event handling in much greater detail in our [Component Events](./docs/ComponentEvents.md) documentation.

There is a whole lot more you can do in a component definition and it is all covered in our [Component Definition](./docs/ComponentDefinition.md), but for now lets move on.

### ZephJS Component HTML

In our above component definition we used the `html()` method to specify the HTML we use to make up the internals of our custom element.  In the Hello example, we reference the `./hello-world.html` file. Here's what that file looks like:

```
<div class="input">
	<div>
		<label for="name">Enter your first name...</label>
		<input type="text" name="name"></input>
	</div>
</div>
<div class="output">
	<div class="hello">Hello there <span class="name"></span>!</div>
	<div class="greeting">It is a pleasure to meet you.</div>
</div>
```

As you can see, the HTML we use is plain HTML. ZephJS has no special markup templating language or the like. It is 100% plain HTML. You can write any HTML you want (even no HTML at all) including references to other custom elements.

The HTML you specify becomes the "content" HTML of the component we are defining. And this is where one of the great Web Components Standards comes into play: Shadow DOM. Shadow DOM allows any HTML Element to define a shadow structure that houses an entirely isolated DOM structure of HTML. This shadow HTML is used in rendering the custom element.

ZephJS doesn't want you to worry too much about the Shadow DOM technology, so we handle all of the shadow details for you.  That said, there are some nuances to working with a Shadow DOM. We cover Shadow DOM in more detail in our [Component Markup](./docs/ComponentMarkup.md) documentation.

### ZephJS Component CSS

Like the HTML in our Hello example, we use the `css()` method to specify the CSS we use to style our custom element. In the Hello example, we reference the `hello-world.css` file. Here's what that file looks like:

```
:host {
	font-family: sans-serif;
}

.input {
	width: 400px;
	margin: 10px;
	padding: 10px;
	border: 1px solid black;
	background: #C0C0C0;
}

.input label {
	display: block;
	font-size: 18px;
}

.input input {
	display: block;
	font-size: 18px;
	font-weight: bold;
	border: 2px solid black;
	border-radius: 2px;
	background: #FFFFAA;
	width: 100%;
	padding: 5px 10px;
	box-sizing: border-box;
}

.output {
	width: 400px;
	display: grid;
	grid-row-gap: 10px;
	border: 1px solid black;
	background: #E0E0E0;
	margin: 10px;
	overflow: hidden;
	padding: 10px;
	word-break: break-word;
	opacity: 0;
	transition: opacity: 1s;
}

.output .hello {
	font-size: 24px;
}

.output .hello .name {
	font-weight: bold;
	text-transform: capitalize;
}

.output .greeting {
	font-size: 24px;
}

:host([name]) .output {
	opacity: 1;
	transition: opacity: 1s;
}
```

The CSS we use in our `css()` method (or external file) is 100% standard CSS. There are a few selectors like `:host` and `:host()` that might be new to you, but are standard CSS selectors.

Like the HTML of our custom element, the CSS your provide is inserted into the Shadow DOM for this element. This means that it only applies to styling the custom element itself or the elements within the shadow. Styles within a custom element do not leak out to external elements.

We cover a lot more stuff about using CSS in custom components in our [Component Styling](./docs/ComponentStyling.md) documentation.

### All Together Now

## Documentation

Definitions
 - [Component Definition](./docs/ComponentDefinition.md)
 - [Component Markup](./docs/ComponentMarkup.md)
 - [Component Styling](./docs/ComponentStyling.md)
 - [Component Bindings](./docs/ComponentBindings.md)
 - [Component Events](./docs/ComponentEvents.md)

Services
 - [Services](./docs/Services.md)

APIs
 - [ZephComponents API](./docs/ZephComponents.md)
 - [ZephServices API](./docs/ZephServices.md)

Command Line Tool
 - [Command Line Tool](./docs/CLI.md)

## Examples

ZephJS ships with a set of examples for your reference.

 - [BasicComponent](./examples/BasicComponent): An example of a basic component.

 - [HelloBadge](./examples/HTTPSServer): A slightly bigger example of a component which uses a second component.

 - [ExampleCollection](./examples/ExampleCollection): An example of grouping several components together into a single file, called a collection.

 - [BasicService](./examples/BasicService): An example of using the ZephServices service registry.

## The Awesome Engineering Company

ZephJS is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

ZephJS is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
