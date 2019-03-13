# [ZephJS](../RREADME.md) > Get Started > Building a Web Component Library with ZephJS

This guide details how to build a Web Component Library using ZephJS. This involves defining one or more custom Web Components and then bundling them together into a single unified file.  Additionally, Component Inheritance may also be of interest.

## Project Structure

It is recommended that you create a `components` folder within your project and place all the components within that. Additionally, ZephJS recommends keep JavaScript, HTML, and CSS as separate files with the same name.  For example, if one is creating the `my-button` component, one might have the following directory structure:

```text
compontents
  	my-button.js
	my-button.html
	my-button.css
```

This approach to organizing components keeps everything neatly together and consistently named.  Of course, this layout is merely a suggestion and other layouts are entirely feasible at the developers discretion.

Additionally, we recommend a single file near the top of your structure that imports all of your components together. This is a requirement for the bundler described below.

## Installation

In order to work with ZephJS one should first install it into their project.

#### Install node.js

ZephJS is built as a node.js application, so you will need nodejs installed. You can find installers at [nodejs.org](https://nodejs.org) for whatever Operating System you are using.

#### Install ZephJS from npm:
```
npm -g install zephjs
```

## Creating a Component

For each component in the component library one should create a separate component definition file.  Fortunately ZephJS makes this super easy with its Command Line Tool:

```shell
zeph create <component_name>
```

This will create the following files using the given `<component_name>`:

```text
<component-name>.js
<component-name>.html
<component-name>.css
```

THese files can then be populate appropriately.

If you are new to ZephJS it is strongly recommended you read the [Component Quick Start](./ComponentQuickStart.md) guide to learn about how to write ZephJS components.

## Bundling a Component Library

Once a collection of components has been defined, the next step is to bundle those components into a single javascript file to distribute to customers of the library. The ZephJS CLI tool has a helpful bundle utility to help you out.

```shell
zeph bundle <source_filename> <target_filename>
```

The tool will read in the `source_filename` provided and bundle it with ZephJS into a single file `target_filename`. This takes care of all the dependencies, all the `html()` and `css()` external file references, everything.  The result is a single nice neat package.

One can then distribute this package to customers as a nice self-contained entity.

#### A Single Entry Point

Often one wants to bundle multiple components, but the `bundle` tool can only take a single file entry point.  An easy work around for this is to create a single top-level inclusion file and use that as your entry point:

```javascript
import "./src/my-button.js";
import "./src/my-list.js";
import "./src/my-calander.js";
import "./src/my-chart.js";
```

This will cause the bundler to include all of the imported JavaScript references into the bundle thus bringing all the components together.

## Additional Topics

Component Library authors may be interested in the additional specific topics:

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
 - [ZephServices API](./ZephServices.md)

**Bundling**
  - [Bundling for Distribution](./ComponentBundling.md)

**Command Line Tool**
 - [Command Line Tool](./CLI.md)
