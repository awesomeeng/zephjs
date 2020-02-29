# [ZephJS](../README.md) > Writing Components > Assets

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- [Creating a New Component](./ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- **Assets**
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./ComponentBundling.md)

### Assets

Often times a component will have need to reference and use external assets like images, audio clips, or videos.  In most component libraries these are externally packaged up and shipped along side the component script in a separate directory like "assets" or "resources".  But this can often be a little cumbersome and clunky.  So ZephJS fixes it for you.

Within your component definition you may use the `asset()` definition methods (outlined below).  With `asset()` you associate some `<img>`, `<audio>`, or `<video>` element within your internal content, with an external asset filename or URL.  When ZephJS encounters these it downloads the content of the filename of URL and injects it into the element's `src` attribute.  Additionally,  when you bundle your component using the ZephJS CLI bundle command, the bundler will go out and download those assets and store them inside your bundle as an encoded data url.  This means you end up with a single shippable `.js` file that contains all the JavaScript, HTML, CSS, **and assets** for your component or component library!

> Note that if you are running your ZephJS in a non-bundle format this works too, but during loading ZephJS will just fetch the content directly.

> Note that using assets in your ZephJS component definitions is entirely optional.  If you choose not to use them you will need to provide those assets in some other fashion to your component consumers.

There's a little bit more to it then that, but that's the basic idea.

### Important Warnings

ZephJS's `asset()` tag works by reading the asset content and converting it into BASE64 and then inserting that as a `data:` url into the `src` attribute of the element.  This should be used with care as this can bloat your assets by up to 4 times the size.  This can be especially impactful when dealing with audio and video.

### `asset()` Usage

You can use the `asset()` definition method to identify and use an asset with ZephJS. The `asset()` method looks like this:

```javascript
asset(".set", "./rating-stars.filled.png");
```

The trick to using `asset()` is that the resource must target zero or more elements within the internal content to be associated with.  Thus the first argument is a CSS Query Selector which will be applied against the internal content of the component.  All matching elements will then have the asset content associated with it.

The asset content is associated with an element by inserting the content as a `data:` url into the `src` attribute of the element if it is an `<img>`, `<audio>` or `<video>`.  Additionally, image types will be written to the `background-image` style if being applied against any other tag that is not a `<img>` tag.  Additionally, you may change the attribute used by supplying an alternative attribute name in the `target` option.

> **`image(selector,content)`**
 - **selector** [string]: A CSS Selector Query to identify where in your internal content you want to associate this resource.
 - **content** [string]: The content argument may be either a filename to a image file or it can be the image data (as a data: url) itself.  ZephJS will attempts to resolve and read the content argument and use the results of that is the read was successful.  If the read was not successful, the content is treated as raw content and used.
 - **options** [object|null]: OPTIONAL. An optional options object can be passed into the `css()` definition method.  This options object can have the following properties:
   - **target** [string]: The name of the attribute to modify with the `data:` url. Defaults to `src`.
