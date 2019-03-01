# [ZephJS](../README.md) > Bundling

### Sections

- [Quick Start](./ComponentQuickStart.md)
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
- **Bundling for Distribution**

### Bundling

A common use case of ZephJS is to build a collection of useful components, bundle them into a single script, and distribute that script. The ZephJS CLI tool has a helpful bundle utility to help you out.

```shell
zeph bundle <source_filename> <target_filename>
```

The tool will read in the `source_filename` provided and bundle it with ZephJS into a single file `target_filename`. This takes care of all the dependencies, all the `html()` and `css()` external file references, everything.  You end up with a single nice neat package.

You can then distribute this package to your customers as a nice self-contained entity.

### A Single Entry Point

Often you want to bundle multiple components, but the `bundle` tool can only take a single file entry point.  An easy work around for this is to create a single top-level inclusion file and use that as your entry point:

```javascript
import "./src/my-button";
import "./src/my-list";
import "./src/my-calander";
import "./src/my-chart";
```

When this example is bundled, you end up with a single file that contains ZephJS, my-button, my-list, my-calander, and my-chart.

### Using ZephJS Bundle

You can run the bundler with the ZephJS command line tool. The bundler has the following syntax:

```shell
zeph bundle <source_filename> <target_filename>
```

The bundler will perform the following actions:
 - Read the source file.
 - Read all known dependencies.
 - Parse each file and replace any `html()` or `css()` external references with inline content from those references.
 - Assemble all the files, including ZephJS, into a single file.
 - Write it out the target file given.

The bundler WILL NOT:
 - Handle other external references or resources.

The bundled file may be included in your web page, simply by using a script tag:

```html
<script src="my-bundle.js" type="module"></script>
```

### Some Useful Tips

 - If you are using external HTML and CSS files, which we highly recommend, the bundler will look for these references, read the external file, and replace them with the actual content.  As such, the `html()` and `css()` definition methods should only have a single string literal of the relative path to the external file.  Anything more complicated will cause the bundler to fail.

 ```javascript
 ZephComponents.define("my-button",()=>{
	 html("./abc.html"); // good
	 html("./abc"+"html"); // bad
	 html("<div></div>"); // good
	 html("./"+this.name+".html"); // bad

	 css("./abc.css"); // good
	 css("./abc"+"css"); // bad
	 css(" { color: red; }"); // good
	 css("./"+this.name+".css"); // bad
 });
 ```

 - The bundler does not handle external resource files like images or font files. You will still need to account for these yourself.
