# [ZephJS](../README.md) > Get Started > Building a Web Application using ZephJS

This guide details how to build a Web Application using ZephJS.  There are some specific consideration for building an application and this document will attempt to guide one around these issue.

## Project Structure

It is recommended that one create a `components` folder within the project and place all the custom components within that.  Additionally, ZephJS recommends keeping JavaScript, HTML, and CSS as separate files with the same name.  For example, if one is creating the `my-button` component, one might have the following directory structure:

```text
components
  	my-button.js
	my-button.html
	my-button.css
```

This approach to organizing components keeps everything neatly together and consistently named.  Of course, this layout is merely a suggestion and other layouts are entirely feasible at the developers discretion.

## Installation

In order to work with ZephJS one should first install it into their project.

#### Install node.js

ZephJS is built as a node.js application, so one will need nodejs installed.  You can find installers at [nodejs.org](https://nodejs.org) for whatever Operating System is being used.

#### Install ZephJS from npm:
```
npm -g install zephjs
```

## Application Top Level HTML

Create an entry point for the application, usually `index.html`.  Within this file include the following:

```html
<body>
	<script type="module">
		import "./components/main-component.js";
	</script>
	<main-component></main-component>
</body>
```

Where `main-component` is the name of the main component of the application.  This component defines the structure, layout and content of the application and all its sub-components.

## Main Component

The main component of your application defines the structure, layout, and content of your entire application.

```javascript
import "./sub-component-one.js";
import "./sub-component-two.js";
import "./sub-component-three.js";

import {ZephComponents,html,css} from "./Zeph.js";

ZephComponents.define("main-component", () => {
	html("./main-component.html");
	css("./main-component.css");
});

```

The three `import` statements at the top of the example illustrate the need to import any sub components to include in the main component. Likewise, any sub-sub-components used by `sub-component-one`, for example, would need to be imported by `sub-component-one`.

## Creating a Component

For each component in a project one should create a separate component definition file.  Fortunately ZephJS makes this super easy with its Command Line Tool:

```shell
zeph create <component_name>
```

This will create the following files using the given `<component_name>`:

```text
<component-name>.js
<component-name>.html
<component-name>.css
```

These files can then be populate appropriately.

If one is new to ZephJS, it is strongly recommended to read the [Component Quick Start](./ComponentQuickStart.md) guide to learn about how to write ZephJS components.

## Routing

Web Applications often need to deal with client side routing; that is displaying different versions of the application based on the url or other factors.  ZephJS can support routing by building custom elements that display their internal content differently depending on route.  Additionally, the ZephJS project also provides [zephjs-router](https://github.com/awesomeeng/zephjs-router) a simple routing element to get your started.

## Styling Considerations

Styling in ZephJS is handled via providing styling details with the `css()` definition method.  The content of the `css()` definition method is inserted into the shadow DOM of the custom element using a new style tag.  This means that the CSS provided will not leak out of the custom element at all.

Unfortunately, this also means that styling *INTO* the custom element is equally hard.  CSS currently does not provide a method to easy style into custom elements.  Some approaches solve this problem with [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). However, this approach has its own limitations.

Currently a new proposal called `::part` and `::theme` exists to alleviate some of these problems.  Read more about it in Monica Dinculescu's excellent primer at [https://meowni.ca/posts/part-theme-explainer/](https://meowni.ca/posts/part-theme-explainer/).

For now, ZephJS recommends that if one wants to create a custom style for say, a button, one would create a custom element, `my-button` for example, and include the specific styling in that.  Then within the HTML reuse the `<my-button>` element where ever one would use `<button>`.

## Additional Topics

Web Application authors may be interested in the additional specific topics:

- [Component Inheritance](./ComponentInheritance.md)
- [Bundling for Distribution](./ComponentBundling.md)

## Documentation

**Components**
 - [Quick Start](./ComponentQuickStart.md)
 - [Component Concepts](./ComponentConcepts.md)
 - [Creating a New Component](./ComponentCreation.md)
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

**Services**
 - [Services](./Services.md)

**APIs**
 - [API Documentaton](./API.md)

**Bundling**
  - [Bundling for Distribution](./ComponentBundling.md)

**Command Line Tool**
 - [Command Line Tool](./CLI.md)
