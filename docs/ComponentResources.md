# [ZephJS](../README.md) > Writing Components > Resources

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./docs/ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- **Resources**
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Resources

Often times a component will have need to reference and use external resources like images, fonts, audio, or videos.  In most component libraries these are externally packaged up and shipped along side the component script.  But this can often be a little cumbersome and clunky.  So ZephJS fixes it for you.

Within your component definition you may use one of the resource definition methods (outlined below).  Then, when you bundle your component using the ZephJS CLI bundle command, the bundler will go out and download those resources and store them inside your bundle as an encoded data url.

> Note that if you are running your ZephJS in a non-bundle format this works too, but during loading ZephJS will just fetch the content directly.

> Note that using resources in your ZephJS component definitions is entirely optional. If you choose not to use them you will need to provide those resources in some other fashion to your component consumers.

There's a little bit more to it then that, but that's the basic idea.

The following resources can currently be defined:

 - Images with the `image()` definition method.

### Images

You can use the `image()` definition method to identify and use an image resource with ZephJS. This is entirely optional, but will make for bundling your components to be a much cleaner, easier thing.

The `image()` method looks like this:

```javascript
image(".set","./rating-stars.filled.png");
```

The trick to using `image()` resources is that the resource must target zero or more elements within the internal content to be associated with.  Thus the first argument is a CSS Query Selector which will be applied against the internal content of the component. All matching elements will then have the image content associated with it.

How the image content is associated with an element is dependent on the optional `target` option. This option can be either "auto", "tag", or "style".  If "tag" and the element is an `<img>` element, the content is placed into the `src` attribute of the element.  If "style", the content is placed into the `background-image` style field.  If "auto" the content is placed into the `src` attribute if the element is an `<img>` element, otherwise, it is placed into the `background-image` style field.

> **`image(selector,content)`**
 - **selector** [string]: A CSS Selector Query to identify where in your internal content you want to associate this resource.
 - **content** [string]: The content argument may be either a filename to a image file or it can be the image data (as a data: url) itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful. If the read was not successful, the content is treated as raw content and used.
 - **options** [object|null]: OPTIONAL. An optional options object can be passed into the `css()` definition method. This options object can have the following properties:
   - **target** [string]: Can be either "auto", "tag", or "style".  If set to "auto" or "tag" and the element matched by selector is an `<img>` tag, the content will be placed into that element's `src` attribute.  Otherwise, the content will be placed into the element's `background-image` style field. `target` defaults to "auto" if not given.
   - **noRemote** [boolean]: If set to true, the `css()` content will always be treated as raw content and never as a filename.
