## Classes

<dl>
<dt><a href="#ZephComponent">ZephComponent</a></dt>
<dd><p>ZephJS&#39;s representation of a component and all its descriptive metadata.
This include the component name, its origin, the definition code, and the
context produce by executing the definition code. All of these items
are used to generate a unique Class which is used in by the
Custom Elements registry.</p>
<p>It should be noted that this is not the same as the Element produced when
using a component as an HTML tag or from document.createElement().
ZephComponent is the definition of that element, not the element itself.</p>
<p>ZephCompoonent is returned when you ask ZephComponents to get the
component.</p>
</dd>
<dt><a href="#ZephElementObserver">ZephElementObserver</a></dt>
<dd><p>Utility wrapper class for observing an element for changes.  This
uses the MutationObserver API internally and is largely just a
shell for it.</p>
</dd>
<dt><a href="#ZephService">ZephService</a></dt>
<dd><p>ZephService is a utility class you can inherit from to build
an eventable service, that is a service that can fire events.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#ZephUtils">ZephUtils</a></dt>
<dd><p>Common utilities for working with ZephJS.</p>
</dd>
<dt><a href="#ZephComponents">ZephComponents</a></dt>
<dd><p>Singleton instantiated by ZephJS.</p>
</dd>
</dl>

<a name="ZephComponent"></a>

## ZephComponent
ZephJS's representation of a component and all its descriptive metadata.
This include the component name, its origin, the definition code, and the
context produce by executing the definition code. All of these items
are used to generate a unique Class which is used in by the
Custom Elements registry.

It should be noted that this is not the same as the Element produced when
using a component as an HTML tag or from document.createElement().
ZephComponent is the definition of that element, not the element itself.

ZephCompoonent is returned when you ask ZephComponents to get the
component.

**Kind**: global class  

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

<a name="ZephElementObserver"></a>

## ZephElementObserver
Utility wrapper class for observing an element for changes.  This
uses the MutationObserver API internally and is largely just a
shell for it.

**Kind**: global class  

* [ZephElementObserver](#ZephElementObserver)
    * [new ZephElementObserver(element)](#new_ZephElementObserver_new)
    * [.addAttributeObserver(attribute, handler)](#ZephElementObserver+addAttributeObserver) ⇒ <code>void</code>
    * [.removeAttributeObserver(attribute, handler)](#ZephElementObserver+removeAttributeObserver) ⇒ <code>void</code>
    * [.removeAllAttributeObservers(attribute)](#ZephElementObserver+removeAllAttributeObservers) ⇒ <code>void</code>
    * [.addContentObserver(handler)](#ZephElementObserver+addContentObserver) ⇒ <code>void</code>
    * [.removeContentObserver(handler)](#ZephElementObserver+removeContentObserver) ⇒ <code>void</code>
    * [.removeAllContentObservers()](#ZephElementObserver+removeAllContentObservers) ⇒ <code>void</code>
    * [.start()](#ZephElementObserver+start) ⇒ <code>void</code>
    * [.stop()](#ZephElementObserver+stop) ⇒ <code>void</code>
    * [.handleMutation(records)](#ZephElementObserver+handleMutation) ⇒ <code>void</code>
    * [.handleAttributeMutation(record)](#ZephElementObserver+handleAttributeMutation) ⇒ <code>void</code>
    * [.handleContentMutation(record)](#ZephElementObserver+handleContentMutation) ⇒ <code>void</code>


* * *

<a name="new_ZephElementObserver_new"></a>

### new ZephElementObserver(element)
Create an Element Observer for a given element. This does not
actually start the observation, just sets it up. You must call
start() to begin the observation.


| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 


* * *

<a name="ZephElementObserver+addAttributeObserver"></a>

### zephElementObserver.addAttributeObserver(attribute, handler) ⇒ <code>void</code>
Adds a handler to fire on an attribute change.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>string</code> | 
| handler | <code>function</code> | 


* * *

<a name="ZephElementObserver+removeAttributeObserver"></a>

### zephElementObserver.removeAttributeObserver(attribute, handler) ⇒ <code>void</code>
Removes a specific attribute handler.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>String</code> | 
| handler | <code>function</code> | 


* * *

<a name="ZephElementObserver+removeAllAttributeObservers"></a>

### zephElementObserver.removeAllAttributeObservers(attribute) ⇒ <code>void</code>
Removes all attribute handlers.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| attribute | <code>String</code> | 


* * *

<a name="ZephElementObserver+addContentObserver"></a>

### zephElementObserver.addContentObserver(handler) ⇒ <code>void</code>
Adds a handler to fire on any content change.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="ZephElementObserver+removeContentObserver"></a>

### zephElementObserver.removeContentObserver(handler) ⇒ <code>void</code>
Removes a specific content handler.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="ZephElementObserver+removeAllContentObservers"></a>

### zephElementObserver.removeAllContentObservers() ⇒ <code>void</code>
Remove all content handlers.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

* * *

<a name="ZephElementObserver+start"></a>

### zephElementObserver.start() ⇒ <code>void</code>
Start the observer watching the element.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

* * *

<a name="ZephElementObserver+stop"></a>

### zephElementObserver.stop() ⇒ <code>void</code>
Stop the observer watching the element.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

* * *

<a name="ZephElementObserver+handleMutation"></a>

### zephElementObserver.handleMutation(records) ⇒ <code>void</code>
Function to read the mutation event and parcel it
out to the correct handlers.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| records | <code>Array</code> | 


* * *

<a name="ZephElementObserver+handleAttributeMutation"></a>

### zephElementObserver.handleAttributeMutation(record) ⇒ <code>void</code>
Executes the apropriate attribute handlers.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| record | <code>Object</code> | 


* * *

<a name="ZephElementObserver+handleContentMutation"></a>

### zephElementObserver.handleContentMutation(record) ⇒ <code>void</code>
Executes the appropriate content handlers.

**Kind**: instance method of [<code>ZephElementObserver</code>](#ZephElementObserver)  

| Param | Type |
| --- | --- |
| record | <code>Object</code> | 


* * *

<a name="ZephService"></a>

## ZephService
ZephService is a utility class you can inherit from to build
an eventable service, that is a service that can fire events.

**Kind**: global class  

* [ZephService](#ZephService)
    * [new ZephService()](#new_ZephService_new)
    * [.fire(event, ...args)](#ZephService+fire) ⇒ <code>void</code>
    * [.addEventListener(event, listener)](#ZephService+addEventListener)
    * [.removeEventListener(event, listener)](#ZephService+removeEventListener) ⇒ <code>void</code>
    * [.on(event, listener)](#ZephService+on) ⇒ <code>void</code>
    * [.once(event, listener)](#ZephService+once) ⇒ <code>void</code>
    * [.off(event, listener)](#ZephService+off) ⇒ <code>void</code>


* * *

<a name="new_ZephService_new"></a>

### new ZephService()
Create a new service.


* * *

<a name="ZephService+fire"></a>

### zephService.fire(event, ...args) ⇒ <code>void</code>
Fire a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| ...args | <code>\*</code> | 


* * *

<a name="ZephService+addEventListener"></a>

### zephService.addEventListener(event, listener)
Register a listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+removeEventListener"></a>

### zephService.removeEventListener(event, listener) ⇒ <code>void</code>
Remove a listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+on"></a>

### zephService.on(event, listener) ⇒ <code>void</code>
Register a listener for a specific event. Same as addEventListener.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+once"></a>

### zephService.once(event, listener) ⇒ <code>void</code>
Registers a one time listener for a specific event.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephService+off"></a>

### zephService.off(event, listener) ⇒ <code>void</code>
Remove a listener for a specific event. Same as removeEventListener.

**Kind**: instance method of [<code>ZephService</code>](#ZephService)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 


* * *

<a name="ZephUtils"></a>

## ZephUtils
Common utilities for working with ZephJS.

**Kind**: global constant  

* [ZephUtils](#ZephUtils)
    * [.ready()](#ZephUtils.ready) ⇒ <code>boolean</code>
    * [.tryprom(f)](#ZephUtils.tryprom) ⇒ <code>Promise</code>
    * [.exists(url)](#ZephUtils.exists) ⇒ <code>Promise</code>
    * [.fetch(url)](#ZephUtils.fetch) ⇒ <code>Promise</code>
    * [.fetchText(url)](#ZephUtils.fetchText) ⇒ <code>Promise</code>
    * [.resolve(url, [base])](#ZephUtils.resolve) ⇒ <code>URL</code>
    * [.resolveName(url, [base], [extension])](#ZephUtils.resolveName) ⇒ <code>Promise</code>


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

<a name="ZephComponents"></a>

## ZephComponents
Singleton instantiated by ZephJS.

**Kind**: global constant  

* [ZephComponents](#ZephComponents)
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

