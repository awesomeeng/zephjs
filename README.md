<a href="https://www.npmjs.com/package/zephjs">![npm](https://img.shields.io/npm/v/zephjs.svg "npm Details")</a>
<a href="./LICENSE">![GitHub](https://img.shields.io/github/license/awesomeeng/zephjs.svg "License Details")</a>
<a href="http://npm-stats.com/~packages/zephjs">![npm](https://img.shields.io/npm/dt/zephjs.svg "npm download stats")</a>
<a href="https://github.com/awesomeeng/zephjs/graphs/contributors">![GitHub contributors](https://img.shields.io/github/contributors-anon/awesomeeng/zephjs.svg "Github Contributors")</a>
<a href="https://github.com/awesomeeng/zephjs/commits/master">![GitHub last commit](https://img.shields.io/github/last-commit/awesomeeng/zephjs.svg "Github Commit Log")</a>
<a href="https://twitter.com/zeph_js">![Twitter Follow](https://img.shields.io/twitter/follow/zeph_js.svg "Follow us on Twitter!")</a>
<br/><a href="https://nodejs.org/en/">![node](https://img.shields.io/node/v/zephjs.svg "NodeJS")</a>
<a href="https://github.com/awesomeeng/zephjs/issues">![GitHub issues](https://img.shields.io/github/issues/awesomeeng/zephjs.svg "Github Issues")</a>
<a href="https://snyk.io/vuln/search?type=npm&q=zephjs">![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/awesomeeng/zephjs.svg "Synk Vulnerabilities Database")</a>
<a href="https://libraries.io/npm/zephjs">![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/zephjs.svg "Libraries.io Page")</a>

#  ZephJS

ZephJS is an easy, understandable, and ultra-light framework for defining and using Web Components. It is perfect for people writing component libraries, teams building applications or sites that just require a few custom components, or projects building whole applications that do not want all the weight of a modern JavaScript Browser framework. ZephJS simplifies the process of defining custom Web Components into a declarative highly readable structure that uses standard JavaScript, standard HTML markup, and standard CSS Styling.

ZephJS is often called just "Zeph" and pronounced "Zef".

## Justification

The promise of Web Components was that one would be able to easily load a component onto a web page and use it. But to date that promise has largely not been realized. The current Web Components standards lack an implemented method for easily loading components or component libraries, and writing a web component in JavaScript is far from an easy or straight-forward task.  Couple this with the current generation of web frameworks that add an insane amount of complexity to what was promised to be a very simple activity. Writing a web component should be simple, obvious, and require no more effort than writing JavaScript/HTML/CSS does.

ZephJS aims to bring the promised ease of web components back to the community. It does so by living up to the following principals:

 - Define new components simply in a readable, declarative manner.
 - Make it easy for a component or component library to be used by others.
 - Use the standards and technologies that have made the web great.
 - Never try to outwit the browser.
 - Keep it incredibly small and light.

## Features

ZephJS has the following features...

 - Easily define Web Components;
 - Extremely readable declarative syntax;
 - Uses 100% Standard Browser APIs;
 - Uses 100% Standard JavaScript/ES2018;
 - Uses 100% Standard HTML, inline or separated;
 - Uses 100% Standard CSS, inline or separated;
 - Encapsulated stlyes and content do not leak;
 - Components can extend other components;
 - Value propagation via Attribute/Property/Content binding;
 - Supports building one-off components;
 - or Supports building component libraries;
 - or Supports building entire applications;
 - Included CLI for easy new component scafolding;
 - Included Bundler (using Rollup) to package into a single distributable;
 - and ZephJS is under 20k minified!

## Get Started

ZephJS has four different use cases that are addressable as one gets started:

 - **[Using a Web Component Library](./docs/GetStartedUsing.md)** built on top of ZephJS;
 - **[Building a Web Component Library](./docs/GetStartedLibrary.md)** on top of ZephJS;
 - **[Building a Web Site with Custom Components](./docs/GetStartedSite.md)** using ZephjS;
 - **[Building a Web Application](./docs/GetStartedApplication.md)** using ZephJS.

Pick the best way to get started for you and start using ZephJS today!

## Additional Information

##### Documnetation

ZephJS Provides a ton of documentation to help you use it...

**Getting Started**
 - [Introducing ZephJS](./docs/Introducing.md)
 - [Component Quick Start Guide](./docs/ComponentQuickStart.md)
 - [Frequently Asked Questions](./docs/FAQ.md)

**Components**
 - [Component Quick Start Guide](./docs/ComponentQuickStart.md)
 - [Component Concepts](./docs/ComponentConcepts.md)
 - [Creating a New Component](./docs/ComponentCreation.md)
 - [Importing ZephJS](./docs/ComponentImporting.md)
 - [Defining the Component](./docs/ComponentDefinition.md)
 - [Inheritance](./docs/ComponentInheritance.md)
 - [HTML](./docs/ComponentMarkup.md)
 - [CSS](./docs/ComponentStyling.md)
 - [Resources](./docs/ComponentAssets.md)
 - [Attributes](./docs/ComponentAttributes.md)
 - [Properties](./docs/ComponentProperties.md)
 - [Lifecycle Handlers](./docs/ComponentLifecycleHandlers.md)
 - [Bindings](./docs/ComponentBindings.md)
 - [Event Handlers](./docs/ComponentEvents.md)

**Services**
 - [Services](./docs/Services.md)

**APIs**
 - [API Documentation](./docs/API.md)

**Bundling**
  - [Bundling for Distribution](./docs/ComponentBundling.md)

**Command Line Tool**
 - [Command Line Tool](./docs/CLI.md)

##### Command Line Reference

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

##### Examples

ZephJS ships with a set of examples for your reference.

 - [QuickStartExample](./examples/QuickStartExample): Our example from the [Quick Start](./docs/ComponentQuickStart.md) guide.

 - [BasicComponent](./examples/BasicComponent): An example of a basic component.

 - [HelloBadge](./examples/HTTPSServer): A slightly bigger example of a component which uses a second component.

 - [ExampleCollection](./examples/ExampleCollection): An example of grouping several components together into a single file, called a collection.

 - [ExampleService](./examples/ExampleService): An example of using the ZephService class to build a re-usable service.

 - [RatingStars](./examples/RatingStars): An example of using resources and bundling.

## Browser Compatability

ZephJS is built on modern browser standards and thus requires a modern browser to work.  In particular it requires the following Web Standards: Shadow DOM v1, Custom Elements v1, Mutation Observer, and Fetch.

The following browser compatability chart indicates which browsers are supported and which are not. (All browser statistics taken from [caniuse.com](https://caniuse.com) and used under the conditions of thier license.)

| Browser                     | Minimum Required Version | Notes
|-----------------------------|--------------------------|----------------------------
| **Firefox**                 | 63                       | |
| **Chrome**                  | 54                       | |
| **Safari**                  | 10.1                     | :host and ::slotted psuedo-selectors are buggy.
| **Opera**                   | 41                       | |
| **Microsoft Edge**          | 15 (with Polyfill)       | Requires use of Polymer polyfill. See [ZephJS Polyfill Documentation](./docs/Polyfill.md).
| Microsoft Internet Explorer | NOT SUPPORTED            | |
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

ZephJS is written and maintained by The Awesome Engineering Company. The Awesome Engineering Company believes in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

If you need help working with ZephJS, please do not hesitate to reach out for help.  Submit an issue with your help request and we will answer as quickly as we can!

Also, if you find any bugs or typos, please make sure to submit an issue as well.

## License

ZephJS is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
