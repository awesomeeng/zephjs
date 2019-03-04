# ZephJS

ZephJS (commonly called just "Zeph" and pronounced "Zef") is an ultra-light framework for defining and using Web Components in your Web Pages and Applications. No need to learn TypeScript, no complex functional programming requirements, and only a tiny little bit of hidden magic.  With ZephJS you write components in plain JavaScript code, standard HTML markup, and standard CSS Styling.

## Justification

The promise of Web Components was that we would be able to easily load a component onto our web page and use it. But to date that promise has largely not been realized. The current Web Components standards lack an implemented method for easily loading components or component libraries, and writing a web component in JavaScript is far from an easy or straight-forward task.  Couple this with the current generation of web frameworks that add an insane amount of complexity to what was promised to be a very simple activity. Writing a web component should not require you to learn a new language (or superset language) or learn a new programming paradigm. It should be simple, obvious, and require no more effort than writing JavaScript/HTML/CSS does.

ZephJS aims to bring the promised ease of web components back to our community. It does so by living up to the following principals:

 - Make it easy for a component or component library to be used by others.
 - Use the standards and technologies that have made the web great.
 - Apply modern browser standards (Web Components, Shadow DOM, ElementOberserver, etc).
 - Make it super easy to read and understand.
 - Keep it incredibly small and light.

Please dont misunderstand us: React, Vue, Angular, Svelte (more people should use Svelte) all have their place. Very large web applications will always have a need for frameworks such as these. But a lot of sites don't need this kind of weight; they just want to drop in a handful of components and go.  And that's the space for which ZephJS was built.

## Features

ZephJS has the following features...

 - Easily define Web Components;
 - Uses 100% Standard Browser APIs;
 - Extremely readable;
 - Uses 100% Standard JavaScript/ES2018;
 - Uses 100% Standard HTML, inline or separated;
 - Uses 100% Standard CSS, inline or separated;
 - Encapsulated stlyes and content do not leak;
 - Components can extend other components;
 - Value propagation via Attribute/Property/Content binding;
 - Includes a simple Service Registry;
 - Supports building one off components;
 - or Supports building component libraries;
 - or Supports building entire applications;
 - Included CLI for easy new component scafolding;
 - Included Bundler (using Rollup) to package into a single distributable;
 - and ZephJS is just a few bytes over 32K!

## Contents
 - [Usage](#usage)
 - [Your First Component](#your_first_component)
 - [Writing Your Own Components](#writing-your-own-components)
 - [The Zeph Command Line Tool](#the-zeph-command-line-tool)
 - [Documentation](#documentation)
 - [Examples](#examples)
 - [Browser Compatability](#browser-compatability)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Usage

Mostly people using ZephJS do not even need to know how to use ZephJS or what it is. Instead they just want to include a collection of components built on top of ZephJS.  Fortunately, that means they can stop reading now and instead go read the instructions for that component collection.

If you are interested in finding a component collection, here is a list of known collections:

 - **[Mistral](https://github.com/awesomeeng/zephjs-mistral)** - Mistral is a component collection that was built as the test case for ZephJS. It is neither complete nor production ready and should be used only as an example.

Also, we have released some ZephJS supported elements and examples that may be of interest:

 - **[zephjs-router](https://github.com/awesomeeng/zephjs-router)** - An html content router built specifically for ZephJS with support for lazy loading.

 - **[zephjs-loading](https://github.com/awesomeeng/zephjs-loading)** - An example of how to build a loading screen to support ZephJS components.

However, for those who want to build their own component collections, well, keep reading and we will walk your through building your own components.

## Your First Component

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

If you don't have a Web Server installed, don't sweat it. ZephJS's command line tool has you covered.

```
zeph serve
```

#### Step 5 - Have a Look

Surf your favorite web browser over to [http://localhost:4000](http://localhost:4000) and have a look at your work.

## Writing Your Own Components

Now that we have seen a component in action, you are definately excited to try it. Fortunately, its super easy to do so and we've written you a great little Quick Start guide on how to write your own component.

**[The ZephJS Quick Start Guide](./docs/ComponentQuickStart.md)**

So head over there and start building awesome components!

## The Zeph Command Line Tool

ZephJS ships with a little command line tool (CLI) to help with your ZephJS related needs.  This is installed locally when you install ZephJS via npm and can be accessed with the shell command `zeph`.  It has the following syntax:

```shell
zeph <command>
```

There are a number of commands you can do. Very quickly:

 - **`hello`**: Generate the example hello world application.
 - **`create`**: Create a new component including .js, .html, and .css stub files.
 - **`serve`**: Run a small Web Server on http://localhost:4000 that will serve the current directory.
 - **`bundle`**: Bundle multiple ZephJS components into a single file.

> For more information, see our documentation on the [Zeph Command Line Interface](./docs/CLI.md).

## Documentation

**Components**
 - [Quick Start](./docs/ComponentQuickStart.md)
 - [Component Concepts](./docs/ComponentConcepts.md)
 - [Creating a New Component](./docs/ComponentCreation.md)
 - [Importing ZephJS](./docs/ComponentImporting.md)
 - [Defining the Component](./docs/ComponentDefinition.md)
 - [Inheritance](./docs/ComponentInheritance.md)
 - [HTML](./docs/ComponentMarkup.md)
 - [CSS](./docs/ComponentStyling.md)
 - [Attributes](./docs/ComponentAttributes.md)
 - [Properties](./docs/ComponentProperties.md)
 - [Lifecycle Handlers](./docs/ComponentLifecycleHandlers.md)
 - [Bindings](./docs/ComponentBindings.md)
 - [Event Handlers](./docs/ComponentEvents.md)

**Services**
 - [Services](./docs/Services.md)

**APIs**
 - [ZephComponents API](./docs/ZephComponents.md)
 - [ZephServices API](./docs/ZephServices.md)

**Bundling**
  - [Bundling for Distribution](./docs/ComponentBundling.md)

**Command Line Tool**
 - [Command Line Tool](./docs/CLI.md)

## Examples

ZephJS ships with a set of examples for your reference.

 - [QuickStartExample](./examples/QuickStartExample): Our example from the [Quick Start](./docs/ComponentQuickStart.md) guide.

 - [BasicComponent](./examples/BasicComponent): An example of a basic component.

 - [HelloBadge](./examples/HTTPSServer): A slightly bigger example of a component which uses a second component.

 - [ExampleCollection](./examples/ExampleCollection): An example of grouping several components together into a single file, called a collection.

 - [BasicService](./examples/BasicService): An example of using the ZephServices service registry.

## Browser Compatability

ZephJS is built on modern browser standards and thus requires a modern browser to work.  In particular it requires the following Web Standards: Shadow DOM v1, Custom Elements v1, Mutation Observer and Fetch.

The following browser compatability chart indicates which browsers are supported and which are not. (All browser statistics taken from [caniuse.com](https://caniuse.com) and used under the conditions of thier license.)

| Browser                     | Minimum Required Version | Notes
|-----------------------------|--------------------------|----------------------------
| Microsoft Internet Explorer | NOT SUPPORTED            | No support as of v11.
| Microsoft Edge              | NOT SUPPORTED            | No support as of v18, but in development
| **Firefox**                 | 63                       | |
| **Chrome**                  | 54                       | |
| **Safari**                  | 10.1                     | :host and ::slotted psuedo-selectors are buggy.
| **Opera**                   | 41                       | |
| **IOS Safari**              | 10.3                     | :host and ::slotted psuedo-selectors are buggy.
| **Android Browser**         | 67                       | |
| Blackberry Browser          | NOT SUPPORTED            | No support as ov v10.
| **Opera Mobile**            | 46                       | |
| **Chrome for Android**      | 71                       | |
| **Firefox for Android**     | 64                       | |
| IE Mobile                   | NOT SUPPORTED            | No support as of v11
| **UC Browser for Android**  | 11.8                     | |
| **Samsung Internet**        | 6.2                      | |
| QQBrowser                   | NOT SUPPORTED            | No support as of v1.2
| Baidu Browser               | NOT SUPPORTED            | No support as of v7.12
(Chart last updated Feb 25, 2019)

## The Awesome Engineering Company

ZephJS is written and maintained by The Awesome Engineering Company. We believe in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

ZephJS is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
