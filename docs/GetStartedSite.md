# [ZephJS](../README.md) > Get Started > Building a Web Site with Custom Components using ZephJS

This guide details how to build a Web Site with Custom Components using ZephJS. One would build a Web Site as per normal, but also have a folder dedicated to defining custom components which can be included into a Web Site using `<script>` tags.

## Project Structure

It is recommended to create a `components` folder within the project and place all the custom components within that. Additionally, ZephJS recommends keeping JavaScript, HTML, and CSS as separate files with the same name.  For example, if one is creating the `my-button` component, one might have the following directory structure:

```text
compontents
  	my-button.js
	my-button.html
	my-button.css
```

This approach to organizing components keeps everything neatly together and consistently named.  Of course, this layout is merely a suggestion and other layouts are entirely feasible at the developers discretion.

## Installation

In order to work with ZephJS one should first install it into their project.

#### Install node.js

ZephJS is built as a node.js application, so one will need nodejs installed. You can find installers at [nodejs.org](https://nodejs.org) for whatever Operating System is being used.

#### Install ZephJS from npm:
```
npm -g install zephjs
```

## Creating a Component

For each component in the project one should create a separate component definition file.  Fortunately ZephJS makes this super easy with its Command Line Tool:

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

If one is new to ZephJS it is strongly recommended to read the [Component Quick Start](./ComponentQuickStart.md) guide to learn about how to write ZephJS components.

## Using Custom Components

To use a custom component with your Web Site, it is recommended to include it early within the HTML header. Here's an example of using the `my-button` component...

```html
<script type="module">
	import "./my-button.js";
</script>
```

Once imported thus, the `<my-button>` component will be available to use within the Web Site HTML as needed. One may, of course, have multiple `import` statements bringing multiple components into an application.

## Additional Topics

Web Site authors may be interested in the additional specific topics:

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
 - [ZephComponents API](./ZephComponents.md)

**Bundling**
  - [Bundling for Distribution](./ComponentBundling.md)

**Command Line Tool**
 - [Command Line Tool](./CLI.md)
