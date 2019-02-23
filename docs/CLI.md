# [ZephJS](../README.md) > Command Line Interface

ZephJS ships with a little command line tool (CLI) to help with your ZephJS related needs.  This is installed locally when you install ZephJS via npm and can be accessed with the shell command `zeph`.  It has the following syntax:

```shell
zeph <command>
```

There are a number of commands you can do and each is detailed below.

### `zeph help`

```shell
zeph [command] help
```

Displays the ZephJS CLI Tool help interface.

If you provide a valid command followed by the word `help` ZephJS will display help for the specific command.

### `zeph hello`

```shell
zeph hello
```

Generate the ZephJS hello-world example component. hello-world is a very, very simple example of using ZephJS.

### `zeph create`

```shell
zeph create <component-name> [filename]
```

The `create` command is used to create scafolding for a new component. This command takes one require argument and one optional argument:

 - `component-name`: The name you want to give the new component, that is the tag name it will be registered under.  This name must contain a dash ("-") character.
 - `filename`: Optional filename to write the component out as. If not provided ZephJS will use the `component-name` as the filename.

So for example:

```shell
zeph create my-button
```

Would create the following files in the current directory:

**my-button.js**
```javascript
 1:
 2:	/*
 3:	        Generated ZephS component: my-button
 4:
 5:	        ZephJS is copyright 2019, The Awesome Engineering Company
 6:	        and is released under the MIT licesne.
 7:	 */
 8:
 9:	import {ZephComponents,html,css} from "./Zeph.js";
10:
11:	ZephComponents.define("my-button",()=>{
12:	        html("./my-button.html");
13:	        css("./my-button.css");
14:
15:	        // Place your compnent defintion calls here. See the ZephJS documentation for more information.
16:	});
17:
```

**my-button.html**
```html
1:
2:	<!-- Place your ZephJS html code here. See the ZephJS documentation for more information. -->
3:
```

**my-button.css**
```css
1:
2:	/* Place your ZephJS CSS code here. See the ZephJS documentation for more information. */
3:
```

### `zeph serve`

```shell
zeph serve [--port <port>] [path_to_serve] [<path_to_serve> ...]
```

The `serve` command spins up a small HTTP Server on localhost for the given port (defaults to 4000).  This HTTP Server will then serve the current directory.  You can provide additional other directories to serve as needed.

The command has the following optional arguments:

 - **`-port <port>`**: Provide an alternate port to serve from. By default port 4000 is used.
 - **`path_to_serve`**: Zero or more alternate paths to serve.

Internally the `serve` command uses both [AwesomeServer](https://github.com/awesomeeng/awesome-server) and [AwesomeLog](https://github.com/awesomeeng/awesome-log) if you are interested in either of those libraries.

### `zeph bundle`

```shell
zeph bundle <source_filename> <target_filename>
```

A common use case of ZephJS is to build a collection of useful components, bundle them into a single script, and distribute that script. The ZephJS CLI tool has a helpful bundle utility to help you out.

The tool will read in the `source_filename` provided and bundle it with ZephJS into a single file `target_filename`. This takes care of all the dependencies, all the `html()` and `css()` external file references, everything.  You end up with a single nice neat package.

You can then distribute this package to your customers as a nice self-contained entity.

> There is a lot more information on the `bundle` command in our [Bundling for Distribution](./ComponentBundling.md) documentation. We highly recommend you read it if Bundling is something you are interested in doing.
