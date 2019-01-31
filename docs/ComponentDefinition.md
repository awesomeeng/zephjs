# [ZephJS](../README.md) > Writing Components > Component Definition

## A ZephJS Component

In ZephJS a component is defines with a call to `ZephComponents.define()`. You call this with two arguments `name` and `definition` like this:

```
ZephComponents.define("hello-world",()=>{
	... the component definition ...
});
```

##### `name`

The `name` argument provides the identifier by which your new html element will be referenced.  So if the name argument is `jelly-bean`, the element would be referenced as `<jelly-bean></jelly-bean>`.

The name argument must be provided, may not be null or an empty string, and must contain at least one dash '-' character. This last rule is required by the Web Component specification to prevent conflicts with the pre-defined html components.  We recommend hte first part of your name be your library name like `mistral-button` for example. Thus all your elements will have the same starting prefix.

##### `definition`

The definition argument is a function which contains the call that describe the element, its content, its styling, and the behaviors associated with it. This is done by calling zero or more of the component definition methods inside your definition function.

The definition function is executed once, before your component is registered with the Custom Elements API. Each definition method you call, defines some aspect of the component, and together these become the Component Context.

Whenever the component is used within your html (or otherwise created), the Component Context is used to populate the new element.

Here's an example of a component showing a simple definition function.

```
ZephComponents.define("jelly-bean",()=>{
	html(`
		<div class="jelly">
			<div class="bean">
				Jelly Beans are yummy.
			</div>
		</div>
	`);
	css("./jelly-bean.css");
});
```

In the above example, we call the `html()` and the `css()` definition methods. The `html()` method adds some html to our component, and the `css()` adds some css styling to our component.

There is a lot you can do within the definition function, so read on to learn more!

## Component Lifecylce

A ZephJS Web Component has the following lifecylce:

initialized > created > added/removed/adopted > attributeChanged

The `initialized` lifecycle event occurs when the component is defined. It can be reacted to the with the `onInit()` component definition method.

The `created` lifecycle event occurs when the component is used to create a new element. It can be reacted to the with the `onCreate()` component definition method.

The `added` lifecycle event occurs when an element created from the coponent is added to the DOM at some point. It can be reacted to the with the `onAdd()` component definition method.

The `removed` lifecycle event occurs when an element created from the component is removed from the DOM. It can be reacted to the with the `onRemove()` component definition method.

The `adopted` lifecycle event occurs when an element created from the component is adopted by a different document. This is pretty rare, but provided if needed. It can be reacted to the with the `onAdopt()` component definition method.

The `atributeChanged` lifecycle event occurs when an element created from the component has an attribute that is added or removed or changed. It can be reacted to the with the `onAttribute()` component definition method.

There is no lifecylce event for rendering (as might be the case in other frameworks) or for destruction of an element.

## Component Definition Methods

#### `html(content)`

```
html(`
	<div class="jelly">
		<div class="bean">
			Jelly Beans are yummy.
		</div>
	</div>
`);
```
```
html("./jelly-bean.html");
```
Appends the given `content` (or what the `content` references) to the inner html body of the new element. Technically, the `content` is added to the Shadow DOM of the new element and thus not a direct descendant of the element. But ZephJS is trying to keep you from worrying about the Shadow DOM, so instead lets call it the "inner content" of the new element.

Multiple calls to `html()` within a single definition function will append each `content` (or what the `content` references) to the inner content of the new element. There is no overwrite behavior.

`content` [string]

If `content` is an absolute or relative path or URL, ZephJS will attempt to locate the referenced content and load that and use that as the content. This allows the html content to be placed in an external file and thus keeping your html separate from your JavaScript and from your CSS.

If `content` is not an absolute or relative path or URL it will be treated as just plain content text and used for the inner content of our new element.  This inner content may contain HTML markup or text or both.

#### `css(content)`

```
css(`
.jelly {
	bakcground: green;
}
.bean {
	background: orange;
}
`);
```
```
css("./jelly-bean.css");
```
Appends the given `content` (or what the `content` references) to the inner css of the new element. Technically, the `content` is added to the Shadow DOM of the new element as a `<style>` element and thus not a direct descendant of the element. This means the `content` css will only apply to the inner content html. There are some nuances to this though, so make sure to read the [Component Styling](./ComponentStyling.md) documentation.

Multiple calls to `css()` within a single definition function will append each `content` (or what the `content` references) to the inner css of the new element. There is no overwrite behavior.

`content` [string]

If `content` is an absolute or relative path or URL, ZephJS will attempt to locate the referenced content and load that and use that as the content. This allows the css content to be placed in an external file and thus keeping your css separate from your JavaScript and from your HTML.

If `content` is not an absolute or relative path or URL it will be treated as just plain content text and used for the inner content of our new element.  This inner content may contain standard CSS.

#### `onInit(handler)`

```
onInit((name,component)=>{
	... do something ...
});
```

The `onInit` component definition method takes a function which is executed when the component is first initialized; that is when the component definition has been executed and the component has been registered with the Custom Elements API.  You may want to read the [Component Lifecycle](#component_lifecylce) section above.

This function will only ever be executed once for any given component.

This function is executed before any elements are created from the component.

Mostly one would use this function for initializing global state for a component.

'handler' [function]

The handler function is executed when the `initialized` lifecycle event occurs.  The function gets two arguments: `name` and `component`.

 - `name` [string] is the name of the component registered.
 - `component` [ZephComponent] is the component object that does the registering.

#### `onCreate(handler)`

```
onCreate((element,content)=>{
	... do something ...
});
```

The `onCreate` component definition method takes a function which is executed when a new element is created from a component; this would include the element being added textually to the DOM.  You may want to read the [Component Lifecycle](#component_lifecylce) section above.

This function will be executed once for each element created.

One would use this function to do initial setup for an element or otherwise create state for that element.

'handler' [function]

The handler function is executed when the `created` lifecycle event occurs.  The function gets two arguments: `element` and `content`.

 - `element` [HTMLElement] The element created.
 - `content` [ShadowRoot] THe element created shadow root.

The `element` is the actual created element.

The `content` is the shadow root of the created element into which the inner content has been placed. The `content` allows one to query against it via `querySelector` and `querySelectorAll` for the purposes of interacting with the inner content.

#### `onAdd(handler)`

```
onAdd((element,content)=>{
	... do something ...
});
```

The `onAdd` component definition method takes a function which is executed an element created from the component is added to a DOM node. You may want to read the [Component Lifecycle](#component_lifecylce) section above.

This function will be executed any time the element is added/appended into a DOM node. So, if the element is added initially and then moved to a different parent, this function would execute twice.

One would use this function to adjustments to the element based on where it is placed in the DOM.

'handler' [function]

The handler function is executed when the `added` lifecycle event occurs.  The function gets two arguments: `element` and `content`.

 - `element` [HTMLElement] The element added.
 - `content` [ShadowRoot] THe element added shadow root.

The `element` is the actual added element.

The `content` is the shadow root of the added element into which the inner content has been placed. The `content` allows one to query against it via `querySelector` and `querySelectorAll` for the purposes of interacting with the inner content.

#### `onRemove(handler)`

```
onRemove((element,content)=>{
	... do something ...
});
```

The `onRemove` component definition method takes a function which is executed an element created from the component is removed to a DOM node. You may want to read the [Component Lifecycle](#component_lifecylce) section above.

This function will be executed any time the element is removed from a DOM node. So, if the element is added initially and then moved to a different parent, this function would execute once (removal from the first parent).

One would use this function to adjustments to the element based on where it is placed in the DOM.

'handler' [function]

The handler function is executed when the `removed` lifecycle event occurs.  The function gets two arguments: `element` and `content`.

 - `element` [HTMLElement] The element removed.
 - `content` [ShadowRoot] THe element removed shadow root.

The `element` is the actual removed element.

The `content` is the shadow root of the removed element into which the inner content has been placed. The `content` allows one to query against it via `querySelector` and `querySelectorAll` for the purposes of interacting with the inner content.

#### `onAdopt(handler)`

```
onAdopt((element,content)=>{
	... do something ...
});
```

The `onAdopt` component definition method takes a function which is executed an element created from the component is adopted by a different document. This is a very rare event, but provided for completeness. You may want to read the [Component Lifecycle](#component_lifecylce) section above.

One would use this function to adjustments to the element based on where it is placed in the DOM.

'handler' [function]

The handler function is executed when the `adopted` lifecycle event occurs.  The function gets two arguments: `element` and `content`.

 - `element` [HTMLElement] The element adopted.
 - `content` [ShadowRoot] THe element adopted shadow root.

The `element` is the actual adopted element.

The `content` is the shadow root of the adopted element into which the inner content has been placed. The `content` allows one to query against it via `querySelector` and `querySelectorAll` for the purposes of interacting with the inner content.

#### `onAttribute(attributeName,handler)`

```
onAttribute("title",(oldValue,newValue,element,content)=>{
	... do something ...
});
```

The `onAttribute` component definition method takes a function which is executed on an element created from the component when the given attribute is added/removed/changed. You may want to read the [Component Lifecycle](#component_lifecylce) section above.

One would use this function to adjustments to the attribute change

`attributeName` [string]

The name of the attribute to watch for changes. The name is required and may not be an empty string or wildcard character.

'handler' [function]

The handler function is executed when the `adopted` lifecycle event occurs.  The function gets four arguments: `oldValue`, `vewValue, `element` and `content`.

 - `oldValue` [*] The old value of the attribute, if any.
 - `newValue` [*] The new value of the attribute, if any.
 - `element` [HTMLElement] The element adopted.
 - `content` [ShadowRoot] THe element adopted shadow root.

THe `oldValue` represent the prior value of the attribute prior to this event.  It may be null if the attribute is being added.

THe `newValue` represent the current value of the attribute. It may be null if the attribute is being removed.

The `element` is the effected element.

The `content` is the shadow root of the effected element into which the inner content has been placed. The `content` allows one to query against it via `querySelector` and `querySelectorAll` for the purposes of interacting with the inner content.

#### `bindAttribute(sourceAttributeName,targetSelector,targetLocation,transformFunction)`

```
bindAttribute("value","div > .wrapper > input");
```
```
bindAttribute("label","label","for");
```
```
bindAttribute("title","span.title","$");
```
```
bindAttribute("data-url","img","src",(value)=>{
	return value+".jpeg";
});
```

One particular use case for attribute events (See `onAttribute()`) is to propagate the value of the changed attribute into the inner content of the new element.  Instead of forcing developers to write handlers for each Attribute, ZephJS provide the `bindAttribute` call. You tell it what attribute on the new element it should trigger on and where you want the attribute value to be propagated to within your inner content.  ZephJS takes care of everything else.

`sourceAttributeName` [string]

The name of the attribute to watch.  If the attribute is created, removed, or changed, the new value of the attribute (or null in the event of a removal) is propagated as directed.

`targetSelector` [string]

The CSS selector of all elements to which this attribute value needs to be assigned. This is the same string structure that `querySelector` and `querySelectorAll` use and you can learn more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors).

The target selector may return multiple elements and `bindAttribute` will propagate the value to each of them.

`targetLocation` [string]

The target location identifies the attribute, property, or content you want to write the value to on the given targets.  You specify this as a string with the first character a special symbol to indicate if this is an attribute '@', or a property '.', or the content '$'.

 - To write to an attribute your `targetLocation` string must start with the '@' character and then be followed by the attribute name.
 - To write to a property your `targetLocation` string must start with the '.' character and then be followed by the property name.
 - To write to the content your `targetLocation` string must be '$' and nothing else.

If no `targetLocation` is provided, the default is to write to an attribute of the same name as `sourceAttributeName`.

`tranformFunction` [function]

If a `transformFunction` is given, the function is executed on the attribute create/remove/change. The function gets a single argument of the value for the change, and whatever is returned by the function is used as the write value.

If no `transformFunction` is given, the create/remove/changed value is used without transformation.
