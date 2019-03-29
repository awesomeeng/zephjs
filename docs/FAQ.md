# [ZephJS](../README.md) > FAQ

Here we present answers to some of the most common ZephJS questions.

If you have a question and it is not covered here, please feel free to submit an issue.  We will answer it as quickly as possible, and if appropriate, add it to the FAQ here.

## Technology

#### What technologies are used in ZephJS?

ZephJS is built for modern, forward, browsers and as such uses several very new browser specifications.  In particular ZephJS requires the following browser support:

 - JavaScript 2017 (ES8/ES2017)
   - Arrow Functions
   - Classes
   - let/const keywords
   - Promises
   - async/await
 - Fetch API
 - ES Modules
 - HTML Templates
 - Mutation Observer API
 - ShadowDOM API v1
 - Custom Elements API v1

If your browser does not support all of these technologies, you may be able to use a [Polyfill](./Polyfill.md) to provide this functionality.  Please read our [Polyfill Documentation](./Polyfill.md) for more details.

#### What technologies is ZephJS watching for future inclusion?

 - `::part()` and `::theme()` - These are two new CSS Psuedo-selectors that will allow component authors to expose parts of their components for styling.  The best read on this is [Monica Dinculescu's excellent article](https://meowni.ca/posts/part-theme-explainer/).

 - Constructable Style Sheets - This is a technique to allow stylesheets to be shared between the global space and each other; essentially allowing a component author to specify a global sheet that applies to all thier elements and potentially exposes that for consumers.  Here's the [Constructable Style Sheet specification](https://wicg.github.io/construct-stylesheets/).

## Basic Usage

#### How do I define a custom element?

#### How do I add HTML content?

#### What's the difference between `element` and `content`?

#### How do I add CSS Styling?

#### Do I need to add attributes?

#### Do I need to add properties?

## Definition Methods

#### How does inheritence work with `from()`?

#### What are the rules around using `alias()`?

#### Can `html()` be used multiple times? What happens?

#### Can `css()` be used multiple times?

#### What happens if I define an `attribute()` multiple times?

#### What happens if I define a `property()` multiple times?

#### What is a lifecylce handler?

#### What happens if I use multiple lifecylce handlers like `onCreate()`?

#### What happens if I list a handler for an `onEvent()` multiple times?

## Bindings

#### How do bindings work?

#### How do I bind to an Attribute?

#### How do I bind to a Property?

#### How do I bind to the content?

#### What happens if my bind source or target returns multiple elements?

#### What happens if my bind source or target returns no elements?

#### Can I modify a specific part of the content using bind?

## Events

#### What events can `onEvent()` and `onEventAt()` handle?

## Styling

#### How do I change the styles of a ZephJS defined component?

If you are the component author, you use the `ccs()` definition method to provide your component CSS that defines the style of your component.  Your CSS Selector Rules can reference the custom element itself with `:host` and `:host()` or otherwise generally apply to the internal content of your component.

If you are a component user, unless the component author intentionally wants you to modify the styling there is no way currently to address the inner content of a custom element via CSS Selector.  The internal elements content is intentionally isolated. There are some promising things coming in the future to address this. [Syling Web Components Using a Shard Style Sheet](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/) provides a good overview of the situation.  Also you can read [Monica Dinculescu's excellent article](https://meowni.ca/posts/part-theme-explainer/) about the upcoming :part and :theme for a lot more details.

#### How do I use CSS Variables to allow content styling of my custom element?

## ZephJS Command Line Tool
