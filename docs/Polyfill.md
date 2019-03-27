# [ZephJS](../README.md) > Polyfill

ZephJS is a modern Web Component framework for modern browsers. As such it requires certain forward technologies to work.  If the browser you are using does not support these, ZephJS may be able to fall back to a polyfill... possibly.

## Required Technologies

ZephJS requires the following forward technologies:

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

For browsers that support the first five (ES2017, Fetch, Mutation Observer, Fetch API, HTML Templates) but not the last two (Micrsoft Edge for example), ZephJS can be used in conjunction with the [webcomponents.org](https://www.webcomponents.org/introduction) polyfill.

## Using the Polyfill

To use the [webcomponents.org](https://www.webcomponents.org/introduction) polyfill with ZephJS, you simply need to include the following in your HTML prior to the the first ZephJS component.

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@^2/webcomponents-loader.js"></script>
```

Here's a full example from our [ExampleService example](./examples/EXampleService)

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>Zeph - Examples - ExampleService</title>
		<script src="https://unpkg.com/@webcomponents/webcomponentsjs@^2/webcomponents-loader.js"></script>
		<script src="./example-clock.js" type="module"></script>
	</head>
	<body>
		<example-clock></example-clock>
	</body>
</html>
```

Note that using the polyfill will add about 115k to your page load, which isn't really that bad, but still much heavier than ZephJS by itself.
