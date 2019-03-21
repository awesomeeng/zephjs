# [ZephJS](../README.md) > Services

A common need when using ZephJS is to define functional services to work with your components.  In this approach a component provides the view of the data and the service provides the data itself.

Initially ZephJS had a simple service registry layer which would allow one to couple a service to a given name, and then various ZephJS components could request the service and use it.  Ultimately this was overkill for ZephJS and it was removed. However, services are still a big part of application development and ZephJS provides some support for using that paradigm.

## An Example

Let us describe services by using a simple example: suppose we wanted to write a service that would provide the current time but only notify the component when the minute changes, instead of some fixed amount of time like every 100 milliseconds.

> This entire example can be found here: [BasicService Example](../examples/BasicService)

Here is our entire ClockService, which emits an "updated" event every minute (Every 60000 milliseconds) as close to the minute change as the JavaScript execution queue will allow.

```javascript
import {ZephService} from "../../zeph.min.js";

const $FREQUENCY = Symbol("frequency");
const $NEXT = Symbol("next");
const $TIME = Symbol("time");

class ClockService extends ZephService {
	constructor() {
		super();

		this[$NEXT] = null;
		this[$TIME] = Date.now();
		this.frequency = 60000;
	}

	get frequency() {
		return this[$FREQUENCY];
	}

	set frequency(n=60000) {
		n = parseInt(n,10);
		if (n && !isNaN(parseInt(n))) this[$FREQUENCY] = n;

		this.update();
	}

	get time() {
		return this[$TIME];
	}

	update() {
		if (this[$NEXT]) clearTimeout(this[$NEXT]);
		this[$NEXT] = null;

		let time = Date.now();
		this[$TIME] = ((time/this.frequency)|0)*this.frequency;

		let next = this[$TIME]+this.frequency-Date.now();
		this[$NEXT] = setTimeout(this.update.bind(this),next);

		this.fire("updated",this[$TIME]);
	}
}

const instance = new ClockService();
export {instance as ClockService};
```

We start, by importing ZephService from ZephJS.  ZephService provides all the event firing and event handling functionality that we need.

```javascript
import {ZephService} from "../../zeph.min.js";
```

> Read more about [ZephService's API](#zephservice-api) below.

Next, we create a new class, ClockService, that extends ZephService.  The only trick to this is that in our `constructor()` method we need to call `super()`.

```javascript
class ClockService extends ZephService {
	constructor() {
		super();
		...
	}
...
}
```

Otherwise, our service can do whatever it wants.  In our case we are setting up a timer to execute at the top of every minute. This in turn updates the time and fires our "updated" event.

```javascript
this.fire("updated",this[$TIME]);
```

The final thing to do with a service is to export it.  In most cases you want to export a singleton of the service, thus you must first create that instance and then export that as the given name of your service. This is shown in the last two lines of our sample code:

```javascript
const instance = new ClockService();
export {instance as ClockService};
```

## Using a Service

Once you have created a service as described above, using it in your code is as simple as importing it:

```javascript
import {ClockService} from "./ClockService.js";
```

We can then use the service however we wish, such as asking for the time:

```javascript
let time = ClockService.time;
```

Whatever you expose in your class as a getter, setter, or method, is available to the service consumer.  Additionally, the service consumer can register listeners with `addEventListener()`, `on()`, or `once()`, or remove event listeners with `removeEventListener()` or `off()`.

## ZephService API

ZephService provides the scaffolding your service will need to emit and handle events.  This includes

> **`fire(eventName,...args)`** For emitting an event of the given name with any number of arguments.

> **`addEventListner(eventName,listener)`** Add a listener for a given event name.

> **`removeEventListener(eventName,listener)`** Remove a listener for a given event name.

> **`on(eventName,listener)`** The same as `addEventListener()`.  Provided for convenience.

> **`once(eventName,listener)`** A special case of `addEventListner()`, this will fire once for a given event and then remove itself.

> **`off(eventName,listener)`** The same as `removeEventListener()`.  Provided for convenience.
