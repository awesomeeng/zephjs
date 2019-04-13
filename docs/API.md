## Classes

<dl>
<dt><a href="#ZephComponent">ZephComponent</a></dt>
<dd></dd>
<dt><a href="#ZephObserver">ZephObserver</a></dt>
<dd></dd>
<dt><a href="#ZephService">ZephService</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#ZephUtils">ZephUtils</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ZephComponents">ZephComponents</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#from">from(fromTagName)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#alias">alias(aliasName)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#html">html(content, [options])</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#css">css(content, [options])</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#asset">asset(selector, url, [options])</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#attribute">attribute(attributeName, initialValue)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#property">property(propertyName, initialValue, transformFunction)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#binding">binding(sourceName, targetElement, targetName, transformFunction)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#bindingAt">bindingAt(sourceElement, sourceName, targetElement, targetName, transformFunction)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onInit">onInit(listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onCreate">onCreate(listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onAdd">onAdd(listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onRemove">onRemove(listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onAdopt">onAdopt(listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onAttribute">onAttribute(attributeName, listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onProperty">onProperty(propertyName, listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onEvent">onEvent(eventName, listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onEventAt">onEventAt(selector, eventName, listener)</a> ⇒ <code>void</code></dt>
<dd></dd>
</dl>

<a name="ZephComponent"></a>

## ZephComponent
**Kind**: global class  
**Summary**: ZephJS's representation of a component and all its descriptive metadata.
This include the component name, its origin, the definition code, and the
context produce by executing the definition code. All of these items
are used to generate a unique Class which is used in by the
Custom Elements registry.

It should be noted that this is not the same as the Element produced when
using a component as an HTML tag or from document.createElement().
ZephComponent is the definition of that element, not the element itself.

ZephCompoonent is returned when you ask ZephComponents to get the
component.  

* [ZephComponent](#ZephComponent)
    * [.context](#ZephComponent+context) ⇒ <code>Object</code>
    * [.name](#ZephComponent+name) ⇒ <code>String</code>
    * [.origin](#ZephComponent+origin) ⇒ <code>String</code>
    * [.code](#ZephComponent+code) ⇒ <code>String</code> \| <code>function</code>
    * [.defined](#ZephComponent+defined) ⇒ <code>boolean</code>
    * [.customElementClass](#ZephComponent+customElementClass) ⇒ <code>ZephElementClass</code>
    * [.define()](#ZephComponent+define) ⇒ <code>Promise</code>


* * *

<a name="ZephComponent+context"></a>

### zephComponent.context ⇒ <code>Object</code>
The context object that was built by executing the component definition.
Depending on when this member is examined, the context might be
very simple or very complex; it depends on whether or not the
ZephComponent has been "defined".  Prior to being "defined" the
definition code has not yet been executed and thus the context will
have very little in it.  Once "defined" the code will have been
executed and the resulting context populated.

This is an object with a number of highly specialized fields that
are used when the element is created.  As such, changing it
is not allowed.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+name"></a>

### zephComponent.name ⇒ <code>String</code>
The name of the component, which is also the tag-name used in HTML for
the component.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+origin"></a>

### zephComponent.origin ⇒ <code>String</code>
The origin, in string form, of where the component was defined,
or the best guess as to where that is.  Origin is not always
going to be super accurate, but its tries its best.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+code"></a>

### zephComponent.code ⇒ <code>String</code> \| <code>function</code>
The code that is to be or was executed for this component when defined.  This
will either be a string or a Function, depending on what was passed
to the define method.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+defined"></a>

### zephComponent.defined ⇒ <code>boolean</code>
Returns true if the ZephComponent was "defined" and has a registered
custom element class.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+customElementClass"></a>

### zephComponent.customElementClass ⇒ <code>ZephElementClass</code>
Returns the custom element class that was used to register the
component with the CustomElements registry.

**Kind**: instance property of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephComponent+define"></a>

### zephComponent.define() ⇒ <code>Promise</code>
Executes the code, which in turn builds the context, which is
given to ZephElementClass.generateClass() to generate a unique
class representation for this component.  This class is then
used along with the name, to register the custom element.

**Kind**: instance method of [<code>ZephComponent</code>](#ZephComponent)  

* * *

<a name="ZephObserver"></a>

## ZephObserver
**Kind**: global class  
**Summary**: Utility wrapper class for observing an element for changes.  This
uses the MutationObserver API internally and is largely just a
shell for it.  

* [ZephObserver](#ZephObserver)
    * [new ZephObserver(element)](#new_ZephObserver_new)
    * [.addAttributeObserver(attribute, handler)](#ZephObserver+addAttributeObserver) ⇒ <code>void</code>
    * [.removeAttributeObserver(attribute, handler)](#ZephObserver+removeAttributeObserver) ⇒ <code>void</code>
    * [.removeAllAttributeObservers(attribute)](#ZephObserver+removeAllAttributeObservers) ⇒ <code>void</code>
    * [.addContentObserver(handler)](#ZephObserver+addContentObserver) ⇒ <code>void</code>
    * [.removeContentObserver(handler)](#ZephObserver+removeContentObserver) ⇒ <code>void</code>
    * [.removeAllContentObservers()](#ZephObserver+removeAllContentObservers) ⇒ <code>void</code>
    * [.start()](#ZephObserver+start) ⇒ <code>void</code>
    * [.stop()](#ZephObserver+stop) ⇒ <code>void</code>
    * [.handleMutation(records)](#ZephObserver+handleMutation) ⇒ <code>void</code>
    * [.handleAttributeMutation(record)](#ZephObserver+handleAttributeMutation) ⇒ <code>void</code>
    * [.handleContentMutation(record)](#ZephObserver+handleContentMutation) ⇒ <code>void</code>


* * *

<a name="new_ZephObserver_new"></a>

### new ZephObserver(element)
Create an Element Observer for a given element. This does not
actually start the observation, just sets it up. You must call
start() to begin the observation.


| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 


* * *

<a name="ZephObserver+addAttributeObserver"></a>

### zephObserver.addAttributeObserver(attribute, handler) ⇒ <code>void</code>
Adds a handler to fire on an attribute change.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>string</code> | 
| handler | <code>function</code> | 


* * *

<a name="ZephObserver+removeAttributeObserver"></a>

### zephObserver.removeAttributeObserver(attribute, handler) ⇒ <code>void</code>
Removes a specific attribute handler.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>String</code> | 
| handler | <code>function</code> | 


* * *

<a name="ZephObserver+removeAllAttributeObservers"></a>

### zephObserver.removeAllAttributeObservers(attribute) ⇒ <code>void</code>
Removes all attribute handlers.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>String</code> | 


* * *

<a name="ZephObserver+addContentObserver"></a>

### zephObserver.addContentObserver(handler) ⇒ <code>void</code>
Adds a handler to fire on any content change.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="ZephObserver+removeContentObserver"></a>

### zephObserver.removeContentObserver(handler) ⇒ <code>void</code>
Removes a specific content handler.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="ZephObserver+removeAllContentObservers"></a>

### zephObserver.removeAllContentObservers() ⇒ <code>void</code>
Remove all content handlers.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

* * *

<a name="ZephObserver+start"></a>

### zephObserver.start() ⇒ <code>void</code>
Start the observer watching the element.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

* * *

<a name="ZephObserver+stop"></a>

### zephObserver.stop() ⇒ <code>void</code>
Stop the observer watching the element.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

* * *

<a name="ZephObserver+handleMutation"></a>

### zephObserver.handleMutation(records) ⇒ <code>void</code>
Function to read the mutation event and parcel it
out to the correct handlers.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| records | <code>Array</code> | 


* * *

<a name="ZephObserver+handleAttributeMutation"></a>

### zephObserver.handleAttributeMutation(record) ⇒ <code>void</code>
Executes the apropriate attribute handlers.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| record | <code>Object</code> | 


* * *

<a name="ZephObserver+handleContentMutation"></a>

### zephObserver.handleContentMutation(record) ⇒ <code>void</code>
Executes the appropriate content handlers.

**Kind**: instance method of [<code>ZephObserver</code>](#ZephObserver)  

| Param | Type |
| --- | --- |
| record | <code>Object</code> | 


* * *

<a name="ZephService"></a>

## *ZephService*
**Kind**: global abstract class  
**Summary**: ZephService is a utility class you can inherit from to build
an eventable service, that is a service that can fire events.  

* *[ZephService](#ZephService)*
    * *[new ZephService()](#new_ZephService_new)*
    * *[.fire(event, ...args)](#ZephService+fire) ⇒ <code>void</code>*
    * *[.addEventListener(event, listener)](#ZephService+addEventListener)*
    * *[.removeEventListener(event, listener)](#ZephService+removeEventListener) ⇒ <code>void</code>*
    * *[.on(event, listener)](#ZephService+on) ⇒ <code>void</code>*
    * *[.once(event, listener)](#ZephService+once) ⇒ <code>void</code>*
    * *[.off(event, listener)](#ZephService+off) ⇒ <code>void</code>*


* * *

<a name="new_ZephService_new"></a>

### *new ZephService()*
Create a new service.


* * *

<a name="ZephService+fire"></a>

### *zephService.fire(event, ...args) ⇒ <code>void</code>*
Fire a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| ...args | <code>\*</code> | 


* * *

<a name="ZephService+addEventListener"></a>

### *zephService.addEventListener(event, listener)*
Register a listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+removeEventListener"></a>

### *zephService.removeEventListener(event, listener) ⇒ <code>void</code>*
Remove a listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+on"></a>

### *zephService.on(event, listener) ⇒ <code>void</code>*
Register a listener for a specific event. Same as addEventListener.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+once"></a>

### *zephService.once(event, listener) ⇒ <code>void</code>*
Registers a one time listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+off"></a>

### *zephService.off(event, listener) ⇒ <code>void</code>*
Remove a listener for a specific event. Same as removeEventListener.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephUtils"></a>

## ZephUtils : <code>object</code>
**Kind**: global namespace  
**Summary**: Common utilities for working with ZephJS.  

* [ZephUtils](#ZephUtils) : <code>object</code>
    * [.ready()](#ZephUtils.ready) ⇒ <code>boolean</code>
    * [.tryprom(f)](#ZephUtils.tryprom) ⇒ <code>Promise</code>
    * [.exists(url)](#ZephUtils.exists) ⇒ <code>Promise</code>
    * [.fetch(url)](#ZephUtils.fetch) ⇒ <code>Promise</code>
    * [.fetchText(url)](#ZephUtils.fetchText) ⇒ <code>Promise</code>
    * [.fetchBinary(url)](#ZephUtils.fetchBinary) ⇒ <code>Promise</code>
    * [.resolve(url, [base])](#ZephUtils.resolve) ⇒ <code>URL</code>
    * [.resolveName(url, [base], [extension])](#ZephUtils.resolveName) ⇒ <code>Promise</code>
    * [.parseDataURL(url)](#ZephUtils.parseDataURL) ⇒ <code>Object</code>


* * *

<a name="ZephUtils.ready"></a>

### ZephUtils.ready() ⇒ <code>boolean</code>
Returns true if ZephJS is in the "ready" state. ZephJS is in the "ready"
state if ZephJS is loaded and all ZephComponents.define() methods are
believed to be complete.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

* * *

<a name="ZephUtils.tryprom"></a>

### ZephUtils.tryprom(f) ⇒ <code>Promise</code>
A utility function to execute the given function f in the context of a
nice clean try/catch block. This really is here just to save a bunch of
characters in ZephJS when minimized.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| f | <code>function</code> | 


* * *

<a name="ZephUtils.exists"></a>

### ZephUtils.exists(url) ⇒ <code>Promise</code>
Performs a HEAD fetch request to determine if a given URL "exists". Returns
a promise that will resolve to true or false depending on the result.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| url | <code>URL</code> | 


* * *

<a name="ZephUtils.fetch"></a>

### ZephUtils.fetch(url) ⇒ <code>Promise</code>
A simplified fetch wrapper.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| url | <code>URL</code> | 


* * *

<a name="ZephUtils.fetchText"></a>

### ZephUtils.fetchText(url) ⇒ <code>Promise</code>
Fetch but also resolves the content as plaintext. Useful for reading
HTML and CSS files.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| url | <code>URL</code> | 


* * *

<a name="ZephUtils.fetchBinary"></a>

### ZephUtils.fetchBinary(url) ⇒ <code>Promise</code>
Fetch but also resolves the content as binary. Useful for reading
Images, audio, video, etc. Returns an object which contains the data
and the contentType.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| url | <code>URL</code> | 


* * *

<a name="ZephUtils.resolve"></a>

### ZephUtils.resolve(url, [base]) ⇒ <code>URL</code>
Given some URL resolves it against a base url to ensure correct pathing.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type | Default |
| --- | --- | --- |
| url | <code>URL</code> |  | 
| [base] | <code>URL</code> | <code>document.URL</code> | 


* * *

<a name="ZephUtils.resolveName"></a>

### ZephUtils.resolveName(url, [base], [extension]) ⇒ <code>Promise</code>
Given a simple name, resolve it against a base URL and then
find out if it exists or not.  ZephJS uses this to determine where
something are located.  This can produce upwards of four separate
network requests.  However, ZephJS only tries that if absolutely
necessary.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type | Default |
| --- | --- | --- |
| url | <code>URL</code> |  | 
| [base] | <code>URL</code> | <code>document.URL</code> | 
| [extension] | <code>String</code> | <code>&quot;.js&quot;</code> | 


* * *

<a name="ZephUtils.parseDataURL"></a>

### ZephUtils.parseDataURL(url) ⇒ <code>Object</code>
Given some data: url this function returns the contentType and data
from that url.

**Kind**: static method of [<code>ZephUtils</code>](#ZephUtils)  

| Param | Type |
| --- | --- |
| url | <code>URL</code> | 


* * *

<a name="ZephComponents"></a>

## ZephComponents : <code>object</code>
**Kind**: global namespace  
**Summary**: Define the ZephComponents singleton which is our exposed
API for defining new components.  

* [ZephComponents](#ZephComponents) : <code>object</code>
    * [.components](#ZephComponents+components) ⇒ <code>Array</code>
    * [.names](#ZephComponents+names) ⇒ <code>Array</code>
    * [.has(name)](#ZephComponents+has) ⇒ <code>Boolean</code>
    * [.get(name)](#ZephComponents+get) ⇒ [<code>ZephComponent</code>](#ZephComponent)
    * [.waitFor(name)](#ZephComponents+waitFor) ⇒ <code>Promise</code>
    * [.define(name, code)](#ZephComponents+define) ⇒ <code>Promise</code>
    * [.undefine(name)](#ZephComponents+undefine) ⇒ <code>void</code>


* * *

<a name="ZephComponents+components"></a>

### zephComponents.components ⇒ <code>Array</code>
Returns an array of all components defined with ZephJS.

**Kind**: instance property of [<code>ZephComponents</code>](#ZephComponents)  

* * *

<a name="ZephComponents+names"></a>

### zephComponents.names ⇒ <code>Array</code>
Returns an array of all component names defined with ZephJS.

**Kind**: instance property of [<code>ZephComponents</code>](#ZephComponents)  

* * *

<a name="ZephComponents+has"></a>

### zephComponents.has(name) ⇒ <code>Boolean</code>
Returns true if a component of a given name is already defined or
in the process of being defined.

**Kind**: instance method of [<code>ZephComponents</code>](#ZephComponents)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 


* * *

<a name="ZephComponents+get"></a>

### zephComponents.get(name) ⇒ [<code>ZephComponent</code>](#ZephComponent)
Returns the ZephComponent for a component of the given name, if
the component has been registered.

**Kind**: instance method of [<code>ZephComponents</code>](#ZephComponents)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 


* * *

<a name="ZephComponents+waitFor"></a>

### zephComponents.waitFor(name) ⇒ <code>Promise</code>
Returns a promise that resolve when the component of the given name
completes its definition and registration process.  This is useful
to ensure that component XYZ exists and is avialable before going
off and doing something.  Most of the time this is unneceessary
and ZephJS will take care of it.

**Kind**: instance method of [<code>ZephComponents</code>](#ZephComponents)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 


* * *

<a name="ZephComponents+define"></a>

### zephComponents.define(name, code) ⇒ <code>Promise</code>
Used to define a new ZephJS component of the given name with
the given definition.

Component names must be strings and must have at least one
dash character within them.

The code argument represents a function that within it defines
the component through the use of one or more definition methods.

The code argument has the signature

		`(methods) => {}`

where `methods` is an object which contains all of the definition
methods one can use within a definition function. This is provided
for developers who would prefer to access the definition methods
via destructuring in the definition argument rather than importing
each with an import statement. Either approach is valid and both
can be used interchangable:

	```javascript
	import {ZephComponents} from "./zeph.min.js";

	ZephComponents.define("my-button",({html,css,attribute})=>{
		html("./my-button.html");
		css("./my-button.css");

		attribute("icon","");
	});
	```

This returns a promise that will resolve when all of the definition
and registration is complete.  In most cases waiting for the
promise to resolve is unnecessary, but it is provided in case
you need to block until it is complete.

**Kind**: instance method of [<code>ZephComponents</code>](#ZephComponents)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 
| code | <code>String</code> \| <code>function</code> | 


* * *

<a name="ZephComponents+undefine"></a>

### zephComponents.undefine(name) ⇒ <code>void</code>
Removes a ZephJS component.  It is very important to note here that
the Custom Elements API does not provide a facility to unregister
a component once it has been registered.  This function then does
not actually remove the component, only ZephJS's awareness of it.

**Kind**: instance method of [<code>ZephComponents</code>](#ZephComponents)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 


* * *

<a name="from"></a>

## from(fromTagName) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method used for inheriting from another ZephComponent.  Inheritence
works by cloning the inherited components Context, and then appending the
new components context on top of that.  Inheritence does not actually
inherit in the classic object oriented approach.  

| Param | Type |
| --- | --- |
| fromTagName | <code>String</code> | 


* * *

<a name="alias"></a>

## alias(aliasName) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method used to provide one or more alias names for a componet.  In
essence, when the component is registered with the Custome Element registry,
if there are any aliases, those names are also registered at the same time
using a clone of the original method.

Aliases are useful if you need a component to have multiple tag names or
shortcut names.  

| Param | Type |
| --- | --- |
| aliasName | <code>String</code> | 


* * *

<a name="html"></a>

## html(content, [options]) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to provide HTML content to a component when it is
created.  The HTML provided becomes the content of the new element's
Shadow DOM (and is refered to through this documentation as "the
content").

The html() Definition Method can take either a url or relative filename
or the actual HTML as string content. if a url or relative filename
is given, ZephJS will download that url content, if possible, and use
that as the content.  This allows developers to separate thier HTML
from the Component Definition JavaScript.

Each call to the html() Definition Method will be appended together
to form a single block of HTML content.  However, you may specify the
option "overwrite" in the options object as "true" and the html()
definition methods, to that point, will be overwritten by the given
content.  (It should be noted that subsequent html() calls after
and overwrite are appended to the overwrite content.)

Another option "noRemote" if set to true, will prevent ZephJS
from downloading the html() content if it is a valid url or relative
filename and just treat it like a literal content string.  This
can be useful as sometimes ZephJS does not always know the difference
between referenced content and literal content and may try
to guess and load things that dont exist.  

| Param | Type | Default |
| --- | --- | --- |
| content | <code>string</code> |  | 
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.overwrite] | <code>boolean</code> | <code>false</code> | 
| [options.noRemote] | <code>boolean</code> | <code>false</code> | 


* * *

<a name="css"></a>

## css(content, [options]) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to provide CSS content to a component when it is
created.  The CSS provided becomes a <style></style> element within
the new element's Shadow DOM.

The css() Definition Method can take either a url or relative filename
or the actual CSS as string content. if a url or relative filename
is given, ZephJS will download that url content, if possible, and use
that as the content.  This allows developers to separate thier CSS
from the Component Definition JavaScript.

Each call to the css() Definition Method will be appended together
to form a single block of CSS content.  However, you may specify the
option "overwrite" in the options object as "true" and the css()
definition methods, to that point, will be overwritten by the given
content.  (It should be noted that subsequent css() calls after
and overwrite are appended to the overwrite content.)

Another option "noRemote" if set to true, will prevent ZephJS
from downloading the css() content if it is a valid url or relative
filename and just treat it like a literal content string.  This
can be useful as sometimes ZephJS does not always know the difference
between referenced content and literal content and may try
to guess and load things that dont exist.  

| Param | Type | Default |
| --- | --- | --- |
| content | <code>string</code> |  | 
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.overwrite] | <code>boolean</code> | <code>false</code> | 
| [options.noRemote] | <code>boolean</code> | <code>false</code> | 


* * *

<a name="asset"></a>

## asset(selector, url, [options]) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to associate some external asset like
an image, audio clip, or video, with some element within
the components internal content.

In order for asset() to assoicate you must provide both
the CSS Query Selector you want to associate to, and a
url or filename to the external asset you want associated.

The association is done by converting the asset into its
base64 encoded binary data and making it part of a data:
url.  This url is then associated with the appropriate
`src` attribute on the selected elements. (The associating
attribute can be changed with the `target` option.)

asset() is really powerful for bundling purposes as the
CLI bundle command will download the asset and inline
the content as a data: url this allowing one to ship
both the component and its dependant resources.

It should be noted, however, that using this approach can
explode your asset sizes by up to 4 times and is not
recommended in all scenarios.  

| Param | Type | Default |
| --- | --- | --- |
| selector | <code>string</code> |  | 
| url | <code>string</code> |  | 
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.target] | <code>boolean</code> | <code>false</code> | 


* * *

<a name="attribute"></a>

## attribute(attributeName, initialValue) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to define an attribute on the new element. This
method takes the attribute name and an initial value (or "undefined"
if no value specified.)

Using this method to define an attribute is strictly optional, but it will
save having to buildout an onCreate() method and set attributes there.

The initial value passed in is set ONLY IF the element does not already
have a value set for the attribute.  Setting an initial value of "undefined"
means that the attribute is actively removed from the element. Also,
please note that attribute values are strings and any non-string passed
in will be converted to a string.  If you are trying to set a boolean
attribute value like "disabled" which is present or not, but has no
actual value, set it to an empty string ("") for true, and remove it (
by setting it to "undefined" for false.)  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 
| initialValue | <code>\*</code> | 


* * *

<a name="property"></a>

## property(propertyName, initialValue, transformFunction) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to create a new property on the element object. This
method takes the property name, an initial value, and an optional
transform function.

Using this method to define a property is strictly optional, but it will
save having to buildout an onCreate() method and set properties there.

The initial value passed in is set ONLY IF the element does not already
have a value set for the property.

The transform function, if given, will be executed any time the
property is changed.  It takes a single argument, x, which is the new
value. Whatever it returns, will be what is set on the property. You can
also through an exception in the transform function which would prevent
the set from occuring; this can be useful in validation.  

| Param | Type |
| --- | --- |
| propertyName | <code>string</code> | 
| initialValue | <code>\*</code> | 
| transformFunction | <code>function</code> | 


* * *

<a name="binding"></a>

## binding(sourceName, targetElement, targetName, transformFunction) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to bind one part of the new element or its content
to some other part of the new element or its content. Bindings are a
useful way to avoid having to write a lot of custom code to do
some very common actions in custom elements.  They are highly
recommended over custom code.

Bindings work thusly:

I want to bind changes to X on element Y to modify A on element B.

X can be an attribute, property, or the content of element Y.
Y can be the custom element itself or any part of its internal content.

A can be an attribute, property, or the content of element B.
B can be the custom element itself or any part of its internal content.

With the bind() definition method, Y is always the custom element itself.
With the bindAt() definition method, Y is specified by a CSS selector.

You specify X and A using a special syntax to tell ZephJS whether
it is an attribute, a property, or the content that you are watching
or modifying.

  Attributes have the form "@<attribute-name>" like this:

    "@value"

  Properties have the form ".<property-name>" like this:

    ".value"

  Content has the form "$" and has nothing more to it:

    "$"

You specify Y and B using a CSS Query Selector string.  If you specify
"." as the entirety of the CSS Query Selector string, ZephJS will return
the custom element itself.  Also, note that if the CSS Query Selector
string matches multiple elements, all elements will be bound.

The bind() method has the following signature:

  bind(sourceName,targetElement,targetName,transformFunction)

sourceName is the X from above; it identifies the attribute, property,
or content you want to watch for changes.  When the given attribute,
property, or content changes, the binding will propagate the change
to the target (A and B).

targetElement is the B from above an is a CSS Query Selector string.
It may match multiple elements and if so, each becomes a target.  If
the string "." is used the target is the custom element itself.

targetName is the X from above; it identifies the attribute, property,
or content you want to modify when a change occurs. targetName is
optional and if left out the sourceName will also be used as the
targetName, saving a little typing.

transformFunction is an optional function that if given will be
executed when the change is triggered.  It recieves the value being
set and whatever it returns is set instead.  Also, an exception
thrown in the transformFunction will cause the binding to not
set and thus prevent it.  

| Param | Type |
| --- | --- |
| sourceName | <code>string</code> | 
| targetElement | <code>string</code> | 
| targetName | <code>string</code> | 
| transformFunction | <code>function</code> | 


* * *

<a name="bindingAt"></a>

## bindingAt(sourceElement, sourceName, targetElement, targetName, transformFunction) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to bind one part of the new element or its content
to some other part of the new element or its content. Bindings are a
useful way to avoid having to write a lot of custom code to do
some very common actions in custom elements.  They are highly
recommended over custom code.

Bindings work thusly:

I want to bind changes to X on element Y to modify A on element B.

X can be an attribute, property, or the content of element Y.
Y can be the custom element itself or any part of its internal content.

A can be an attribute, property, or the content of element B.
B can be the custom element itself or any part of its internal content.

With the bind() definition method, Y is always the custom element itself.
With the bindAt() definition method, Y is specified by a CSS selector.

You specify X and A using a special syntax to tell ZephJS whether
it is an attribute, a property, or the content that you are watching
or modifying.

  Attributes have the form "@<attribute-name>" like this:

    "@value"

  Properties have the form ".<property-name>" like this:

    ".value"

  Content has the form "$" and has nothing more to it:

    "$"

You specify Y and B using a CSS Query Selector string.  If you specify
"." as the entirety of the CSS Query Selector string, ZephJS will return
the custom element itself.  Also, note that if the CSS Query Selector
string matches multiple elements, all elements will be bound.

The bindAt() method has the following signature:

  bindAt(sourceElement,sourceName,targetElement,targetName,transformFunction)

sourceElement is the Y from above; it identifies the custom element or
some element in the internal content to be watched. sourceElement is a
CSS Query Selector string. If multiple elements match, each is bound
as described.If the string "." is used the source is the custom element
itself.

sourceName is the X from above; it identifies the attribute, property,
or content you want to watch for changes.  When the given attribute,
property, or content changes, the binding will propagate the change
to the target (A and B).

targetElement is the B from above an is a CSS Query Selector string.
It may match multiple elements and if so, each becomes a target.  If
the string "." is used the target is the custom element itself.

targetName is the X from above; it identifies the attribute, property,
or content you want to modify when a change occurs. targetName is
optional and if left out the sourceName will also be used as the
targetName, saving a little typing.

transformFunction is an optional function that if given will be
executed when the change is triggered.  It recieves the value being
set and whatever it returns is set instead.  Also, an exception
thrown in the transformFunction will cause the binding to not
set and thus prevent it.  

| Param | Type |
| --- | --- |
| sourceElement | <code>string</code> | 
| sourceName | <code>string</code> | 
| targetElement | <code>string</code> | 
| targetName | <code>string</code> | 
| transformFunction | <code>function</code> | 


* * *

<a name="onInit"></a>

## onInit(listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Initialized
Lifecycle event.  If multiple onInit() methods are called, each
will execute in order.

The Initialized Lifecycle event occurs after a component is registered
with the Custom Element Registry, but before any instances of the
components have been created.  As such, the onInit() method
does not have access to the element or its content.

The function passed to onInit() is executed with the signature

  (name,component)

- name is the component name,
- componet is the ZephComponent instance describing the component.  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 


* * *

<a name="onCreate"></a>

## onCreate(listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Created
Lifecycle event.  If multiple onCreate() methods are called, each
will execute in order.

The Created Lifecycle event occurs after an element of the component
is created via document.createElement() or through tag usage.

The function passed to onCreate() is executed with the signature

  (element,content)

- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 


* * *

<a name="onAdd"></a>

## onAdd(listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Add
Lifecycle event.  If multiple onAdd() methods are called, each
will execute in order.

The Add Lifecycle event occurs when an element of the component
is add to a document or document fragment.

The function passed to onAdd() is executed with the signature

  (element,content)

- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 


* * *

<a name="onRemove"></a>

## onRemove(listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Remove
Lifecycle event.  If multiple onRemove() methods are called, each
will execute in order.

The Remove Lifecycle event occurs when an element of the component
is remove from a document or document fragment.

The function passed to onRemove() is executed with the signature

  (element,content)

- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 


* * *

<a name="onAdopt"></a>

## onAdopt(listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Adopt
Lifecycle event.  If multiple onAdopt() methods are called, each
will execute in order.

The Adopt Lifecycle event occurs when an element of the component
is adopted by a new document or document fragment. It is very
rarely needed.

The function passed to onAdopt() is executed with the signature

  (element,content)

- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 


* * *

<a name="onAttribute"></a>

## onAttribute(attributeName, listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Attribute
Lifecycle event.  If multiple onAttribute() methods are called, each
will execute in order.

The Attribute Lifecycle event occurs when an element of the component
has an attribute that is changed.

The function passed to onAttribute() is executed with the signature

  (attributeName,value,element,content)

- attributeName is the name of the changed attribute.
- value is the new value being changed to.
- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| attributeName | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="onProperty"></a>

## onProperty(propertyName, listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register a function to execute on the Property
Lifecycle event.  If multiple onProperty() methods are called, each
will execute in order.

The Property Lifecycle event occurs when an element of the component
has an property that is changed.

The function passed to onProperty() is executed with the signature

  (propertyName,value,element,content)

- propertyName is the name of the changed attribute.
- value is the new value being changed to.
- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| propertyName | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="onEvent"></a>

## onEvent(eventName, listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register an event handler to execute on some event.
Events are just as you would expect them, but onEvent() and onEventAt()
allows you to define the handlers without needing to write complicated
onCreate() functions to deal with it.

onEvent() attaches an event handler for the given event name to the
custom element itself. For example:

  onEvent("click",myClickHandler);

Would execute myClickHandler when the custom element receives a click
event.

The given listener executes with the following signature:

  (event,element,content)

- event is the event object.
- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| eventName | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="onEventAt"></a>

## onEventAt(selector, eventName, listener) ⇒ <code>void</code>
**Kind**: global function  
**Summary**: Definition Method to register an event handler to execute on some event.
Events are just as you would expect them, but onEvent() and onEventAt()
allows you to define the handlers without needing to write complicated
onCreate() functions to deal with it.

onEventAt() attaches an event handler for the given event name to the
all elements that match a given CSS Query Selector. For example:

  onEventAt("div > button.active","click",myClickHandler);

Would execute myClickHandler when any matching internal content element
receives a click event. If the selector matches more than one element
each element gets the event handler attach to it, so be careful.

The given listener executes with the following signature:

  (event,selected,element,content)

- event is the event object.
- selected it the element that matched the selector.
- element is the custom element.
- content is the Document Fragment of the internal content.  

| Param | Type |
| --- | --- |
| selector | <code>String</code> | 
| eventName | <code>String</code> | 
| listener | <code>function</code> | 


* * *

