# [ZephJS](../README.md) > Writing Components > Component Creation

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- **Creating a New Component**
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

### Component Creation

The smallest ZephJS Component consist of a single `.js` file.

```
my-button.js
```

However, we recommend the practice of separating your JavaScript, HTML and CSS into separate files in the same directory with the same name.  This is a more organized way to handle your components.

```
my-button.js
my-button.html
my-button.css
```

### The Zeph Command Line Tool

To speed in your development and to encourage the practice of separating your components out, ZephJS provides a command line tool for creating a new component that gives you the very basic files you need.

```shell
zeph create <component-name> [filename]
```

This command takes one require argument and one optional argument:

 - `component-name`: The name you want to give the new component, that is the tag name it will be registered under.  This name must contain a dash ("-") character.
 - `filename`: Optional filename to write the component out as. If not provided ZephJS will use the `component-name` as the filename.

So for example:

```shell
zeph create my-button
```

Would create the following files in the current directory:

**my-button.js**
```javascript
 1:
 2:	/*
 3:	        Generated ZephS component: my-button
 4:
 5:	        ZephJS is copyright 2019, The Awesome Engineering Company
 6:	        and is released under the MIT licesne.
 7:	 */
 8:
 9:	import {ZephComponents,html,css} from "./Zeph.js";
10:
11:	ZephComponents.define("my-button",()=>{
12:	        html("./my-button.html");
13:	        css("./my-button.css");
14:
15:	        // Place your compnent defintion calls here. See the ZephJS documentation for more information.
16:	});
17:
```

**my-button.html**
```html
1:
2:	<!-- Place your ZephJS html code here. See the ZephJS documentation for more information. -->
3:
```

**my-button.css**
```css
1:
2:	/* Place your ZephJS CSS code here. See the ZephJS documentation for more information. */
3:
```
