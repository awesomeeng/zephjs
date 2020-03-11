# [ZephJS](../README.md) > Writing Components > Component Concepts

### Sections

- [Quick Start](./ComponentQuickStart.md)
- **Component Concepts**
- [Creating a New Component](./ComponentCreation.md)
- [Importing ZephJS](./ComponentImporting.md)
- [Defining the Component](./ComponentDefinition.md)
- [Inheritance](./ComponentInheritance.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Resources](./ComponentAssets.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./ComponentBundling.md)

### Understanding Core Concepts

Before jumping right into ZephJS it is a good idea to understand a few of the core concepts involved, both with ZephJS and with the underlying Web Standards ZephJS employs.

### Terminology

Throughout the ZephJS documentation we are going to use terms like Component, Element, etc.  Here's a quick glossary how these terms relate to ZephJS.

 - **Web Components**: Web Components is a set of browser standards set to work together to enable the creation of encapsulated custom elements for reuse.  You can learn more about Web Components at the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

 - **Component**: A component in ZephJS is a combination of its Component Name and the Component Definition.  This is represented internally by the ZephComponent class.

 - **Component Name**: The component name is a string the associates the Component to the HTML it is used in.  The Component Name is the HTML tag name once the Component is registered.  The name must contain at least one dash character, as per the Custom Elements API.

 - **Component Definition**: A component Definition is a function that is executed to describe the Component.  Inside of this function one uses zero or more Definition Methods.  When the Definition Methods are executed, they populate the Component Context which in turn is used to populate the Element when the Component is instantiated.

 - **Definition Method**: A Definition Method is one of the predefined methods one uses inside of the Component Definition to describe the Component. Examples of a Definition Method include `html()`, `css()`, `attribute()`, `onAdd()` and the like.

 - **Component Context**: The Component Context is a descriptive object of the Component that is used when the Component is instantiated.  During this instantiation, ZephJS goes through the Component Context and does various things based on the Component Definition.  For example, the the `html()` Definition Method was called in the Component Definition, during instantiation the contents of that `html()` call are append into the ShadowRoot of our new element.

 - **Element**: When we use Element, we mean any instance of an HTML element, including any Custom Element defined with ZephJS.  In many cases we use `element` in ZephJS handlers (Lifecycle Handlers, Event Handlers) to refer to the custom element itself.

 - **Custom Element**: In ZephJS nomenclature Custom Element always refers to a custom element defined with ZephJS.

 - **Internal Content**: Internal content is the HTML added to a Component with the `html()` Definition Method.  In may cases we use `content` in ZephJS handlers (Lifecycle Handlers, EventHandlers) to refer to this internal content.  Internal content so referenced is an instance of a Shadow DOM and behaves as a DOM node for purposes of iteration and updates.

 - **Tag**: Any HTML tag of the form `<tag-name>`.

 - **Attribute**: Any HTML attribute placed on a tag such as `<tag-name some-attribute="123">`.

 - **Property**: Any property on an Element.

 - **Content**: Unless specifically called Internal Content (see above), Content usually refers to the `innerHTML` value of an Element.  This includes all child node and child text nodes.

 - **ShadowRoot**: See [Shadow DOM](#shadow-dom) below.

 - **Lifecycle**: A Component goes through a series of lifecycle events as it is defined, initialized, created, etc.  Please read [Component Lifecycle](#component-lifecycle) below.

 - **Event**: An event occurs when some outside system or force (the user for example) interacts with a Component.  A left mouse click, for example, is an Event.

### ZephJS Concepts

#### Component Lifecycle

A custom element built with ZephJS has the following lifecycle, meaning it moves through the following stages at some point.  Each of these lifecycles has an associated Lifecycle Event. These events can be tapped within the component definition for you to use as needed.

**Definition** &rArr; **Initialization** &rArr; **Creation** &rArr; **Addition** | **Removal** | **Adoption** | **Attribute** | **Property**

 - **Definition**: Definition happens when you define a component via the `ZephComponents.define()` call.  It is where your definition methods are executed and the ComponentContext is created.  This will only occur once for each custom element defined.

 - **Initialization**: Occurs after an element is defined and registered with the Custom Elements API.  This is directly following the Definition lifecycle event.  This will only occur once for each custom element defined.

 - **Creation**: Occurs when someone instantiates a new instance of your custom element.  Each usage of your element in the html occurs a creation lifecycle event.  This will occur multiple times for a given custom element, once for each time it is instanced.

 - **Addition** | **Removal** | **Adoption**: Each of these occurs when an element is added or removed or adopted (moved from one document to another) to the DOM.  This may occur multiple times for a single element as it moves around the DOM.  For example, if I move a custom element from one DOM node to another both the Removal and Addition lifecycle events will occur.

 - **Attribute**: Occurs when a given attribute changes.  This may occur multiple times for a single custom element as the attributes changes on that element.

 - **Property**: Occurs when a ZephJS defined property of the element changes.  This may occur multiple times for a single custom element as the property changes over time.

#### ZephJS Events

ZephJS has several events it will fire on the `document` as it performs various functions.  You can tap into these events with `document.addEventListener()` like any other event.

 - **zeph:ready**: Fired after your page is loaded and there are no more `zeph:component:loading` events without a matching `zeph:component:defined` event.  Essentially this is ZephJS saying it believes all of the components are defined are ready to use.

 - **zeph:component:loading**: Fired when `ZephComponents.define()` is called, but before it is complete.  `ZephComponents.define()` can have internal definition methods that need to read data and as such returns a promise that will resolve when the definition when everything has read and is complete.

 - **zeph:component:defined**: Fired when `ZephComponents.define()` is complete and all dependent promises to define the component (such as loading html or css) have completed.

 - **zeph:component:undefined**: Fired when a component is actively undefined from ZephJS by way of the `ZephComponents.undefine()` method.  While a component may be undefined by ZephJS, there is currently no way to remove it from the Custom Element registry.

#### ZephJS Conventions

ZephJS does not enforce any specific conventions to how you layout your code, however, we do make the following recommendations:

 - Try to define only one component per `.js` file. Sometimes there are really good reasons to break this rule though.
 - Try to separate your markup/HTML code into a separate `.html` file that lives in the same directory and shares the same name.
 - Try to separate your style/CSS code into a separate `.css` file that lives in the same directory and shares the same name.
 - When in doubt, keep it simple!

### Web Component Concepts

#### What is a Web Component?

A Web Component is a set of Browser API standards for defining custom HTML elements that encapsulate their content (HTML), styling (CSS) and behavior (JavaScript) into a unified, reusable, HTML-compliant package.  You create a Web Component by defining a custom element name and supplying it with content, styling, and behaviors.

However, as is often the case with browser standards, using Web Components can be a little confusing and esoteric.  ZephJS aims to solve that by defining a simple, lightweight wrapper around these standards and abstracting away the confusing bits.  Using ZephJS makes your components simple and clean, easy to read, and easy to work with.  ZephJS is not the only solution out there to do this, but we think it's the best.

> See [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for more details.

#### Custom Elements Registry

The Custom Elements Registry is the API by which new custom elements are registered with the browser for use.  It involves calling the `customElements.define()` method with the name of the element you are defining and the class (which inherits from HTMLElement) for the element.  When the custom element is instantiated (by adding the tag or element to the DOM), the class you registered is instantiated via its constructor.

> See [MDN Using Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) for more details.

#### Shadow DOM

Shadow DOM is the system by which custom elements encapsulate thier HTML and CSS and prevent those items from leaking outside of the custom element.  For example, setting a CSS style for a custom element to make its background red will not make the background red of other element outside of the custom element.

Each element in your DOM may also have an associated ShadowRoot, which captures the encapsulated HTML and CSS within it.  This ShadowRoot is itself a DOM structure and can be manipulated just like the regular browser DOM but it is otherwise disassociated from the browser DOM.

> See [MDN Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) for more details.
