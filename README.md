# ZephJS

ZephJS (commonly called just "Zeph" and pronounced "Zef") is an ultra-light framework for defining and using Web Components in your Web Pages and Applications. No need to learn TypeScript, no complex funcational programming requirements, and only a little bit of hidden magic.  With ZephJS you write components in plain JavaScript code, standard HTML markup, and standard CSS Styling.

## Justification

The promise of Web Components was that we would be able to just load a component onto our web page and use it. But to date, that promise has not been fulfilled.

At the same time, the rise of the complex Web Application Framework (aka Angular, React, Vue) is telling everyone that the only way to build web applications is thier way. But not every web page needs a big complex solution.

ZephJS aims to solve both those problems by being incredibly light, super easy to use, and dead simple to include.

## Usage

Mostly people using ZephJS do not even need to know how to use ZephJS. Instead they just want to include a collection of components built on top of ZephJS.  Fortunately, that means they can stop reading now and instead go read the instructions for that component collection.

If you are interested in finding a component collection, here is a list of known collections:

 - **[Mistral]()** - Mistral is the "default" collection that was built using ZephJS.

However, for those who want to build their own component collections, well, keep reading and we will walk your through building your own components.

## Build your first Component

Creating a component or a collection of components using ZephJS is super easy.

#### Step 1 - Install node.js

ZephJS is built as a node.js application, so you will need nodejs installed. You can find installers at [nodejs.org](https://nodejs.org) for whatever Operating System you are using.

#### Step 2 - Install ZephJS from npm:
```
npm install zephjs
```

#### Step 3 - Create a JavaScript file to contain your component:

```
// hello-world.js

name("hello-world");
html("./hello-world.html");
css("./hello-world.css");
```

#### Step 4 - Create a matching HTML markup file:

```
<!-- hello-world.html -->

<div class="hello">
	Hello
</div>
<div class="world">
	World
</div>
```

#### Step 5 - Create a matching CSS style file:

```
/* hello-world.css */

.hello {
	background: red;
	font-size: 48px;
}
.world {
	bakground: green;
	font-size: 48px;
}
```

#### Step 6 - Create an index.html file to bring it all together:

```
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>Hello World</title>
		<script src="zeph.min.js" type="text/javascript"></script>
		<script>
			document.addEventListener("zeph:initialized",()=>{
				Zeph.load("hello-world");
			});
		</script>
	</head>
	<body>
		<awesome-hello>Homer Simpson</awesome-hello>
	</body>
</html>
```

#### Step 7 - Run a Server

If you dont have a Web Server installed, dont sweat it. ZephJS's command line tool has you covered.

```
zeph serve
```

#### Step 8 - Have a Look

Surf your favorite web browser over to [http://localhost:4000](http://localhost:4000) and have a look at your work.
