# MENS Stack

## Lightweight, Lowly Opinionated, Isomorphic Javascript Framework for Rapid Prototyping Reactive Web Apps

* [Mithril.js](http://mithril.js.org/)
* [Express](http://expressjs.com/)
* [Node.js](https://nodejs.org/en)
* [Socket.io](http://socket.io/)

MENS is a complete toolkit for quickly building **fast** isomorphic javascript web applications, such that there is little to no
differentiation between coding on the frontend and the backend. This framework has utilities to handle asynchronous
data, sharing of session variables for client-side rendering, JSX (or just HTML) templating and event-driven programming
(via socket.io). MENS takes an extreme KISS approach by simply bridging together a variety of useful, synergistic
javascript libraries to create an elegant isomorphic javascript server.

**Use Cases:** Social media web applications with interactive communities, multi-user administration tools, mobile
applications, etc. (anything requiring interactivity, speed, reactive interfaces and high concurrency)

## Installation
```
npm install mens
```

## Basic Usage
```js
var
	mens = require("mens"),
	path = require("path");

var server = mens({
	port: 80,
	components: process.cwd()+path.sep+'components',
	routes: process.cwd()+path.sep+'serverRoutes.js'
});
```

Such that _components_ is a subdirectory of js/jsx files pairs and _routes_ exports a key/value object of routes to
mithril javascript components.

### Arguments
| Name | Default | Description |
| :--------------- | :-------------- | :-------------------------------------------------------- |
| **logLevel** | 3 | Integer 1-4, with 4 being the most verbose |
| **tz** | 'America/Los_Angeles' | Timezone for logging and utilities |
| **port** | 80 | Httpd Port to listen on |
| **sessionStore** | null | Accepts session storage object for adapting REDIS, etc. |
| **sessionSecret** | 'kneeboard fat' | Session Secret |
| **sessionName** | 'sid' | Session Name |
| **static** | null | Path to static assets (goes to express) |
| **modeler** | null | **fn(data, session, callback)** to lookup a record matching _data_, which is returned to the client using **callback(result)**|
| **socketHandler** | null | **fn(socket.io client, session)** for binding custom events when a new socket.io client connects |
| **components** | null | Path to a components directory |
| **routes** | null | Full Path to a routes definition file |
| **template** | null | Full Path to the main wrapper template, containing an HTML wrapper with <!--TITLE-->, <!--SESSION--> and <!--MENS--> tags. The <!--MENS--> tag should be within an element of id "**mens-content**" |
| **customJS** | null | Full Path to custom javascript to run after components are defined |
| **minify** | true | Flag to toggle off uglification of the source js served to the client |

**Note:** Many included javascript files should contain full paths, because these files will both be *required* and read into memory
for compiling the client source.

## Templating and Components

By passing a **components** directory into the mens constructor, this directory will be recursively searched for *js*
and *jsx* files. JSX files will be compiled into views and JS files will stored as controllers. Consider the following
example, assuming **components** argument has the value "components":

**file: components/hello/world.jsx**
```html
<div>
	<h1>Hello {ctrl.world()}</h1>
</div>
```

**file: components/hello/world.js**
```js
module.exports = function (params) {

	m.init(this, params);

	this.world = m.prop('World!');

	return this;
}
```

Parsing these files results in:

* m.views.helloWorld
* m.controllers.helloWorld
* m.components.helloWorld

## Routes

By supplying a path/filename in the **routes** property of the mens constructor, these routes will be setup in the webserver
to render the components they are attached to. While you can use the built in templating engine, any valid mithril
controller/view component will also work. Assuming **routes** has the value "serverRoutes.js":

**file: serverRoutes.js**
```js
module.exports = {
	'/' : m.components.helloWorld,
	'/mens' : {
		controller: function (params) {
			m.init(this, params);

			this.world = m.prop('Mens!');

			return this;
		},
		view: m.views.helloWorld
	}
}
```

The routes file can also declare global shared flags (accessible to each route controller and via *m.flags*) by using
the following format:
```js
var flags = { world: m.prop('world!')};

module.exports = {
	'routes' : {
		'/' : {
			controller: function (params) {
				m.init(this, params);

				this.flags = flags.world // Or m.flags.world;

				return this;
			},
			view: m.views.helloWorld
		}
	},
	'flags' : flags
};
```

While JSX templates can contain **m.component** declarations, all asynchronous data variables should be initialized and
passed from the route controller into the children components. This allows the route controller to properly
control its overall redraw strategy

## Asynchronous Data


### m.fetch(ctrl, data, callback, skipForRenderFlag)

Components can render asynchronous data on both the server and the client by using **m.fetch** in the route controller
after **m.init** has been called, with no significant isomorphic considerations. A single fetched "model" should
represent all data needed to render a specific route, which is ideal for noSQL databases such as mongoDB.

```js
module.exports = function (params) {

	m.init(this, params);

	this.datum1 = m.prop(false);
	this.datum2 = m.prop(false);

	m.fetch(this, {id: 1}, function (d) { console.log('Recieved datum 1:', d) });
	m.fetch(this, {id: 2}, function (d) { console.log('Recieved datum 2:', d) }, true); // This data will not be required for rendering on the server

	return this;
}
```

On the server, this controller will not render the item until all required *m.fetch* calls have resolved. On the client,
if the page is rendered isomorphically, the redraw strategy will be "diff" and the page will render instantly (so
developers must account for templating missing/pending data with appropriate loading icons and language).

### Modelers

The **modeler** property passed into the MENS constructor requires *fn(data, session, callback)*, such that *data* is a description
of the data to lookup, *session* is the wrapped session of the active user and *callback* is used to deliver the result
back to the client/server. The result must be an object with property names matching the controllers'' *m.prop* properties.

For the previous controller, the following modeler on the server would return appropriate results:

```js
function (data, session, callback) {

	if (data.id == 1)
		callback({datum1: 'This is fast data'});
	else if (data.id == 2)
		setTimeout(function () { callback({datum2: 'This is slow data'}) }, 500);
}
```

Modelers can adapt any type of asynchronous or synchronous data storage, or something generic as detailed above.

**Note:** When a page is rendered on the server and the client sets up the route, the client must redraw the page in
order to bind onclick events. Therefore, the client must have the same data as the server to mount the route. To achieve
this, either 1) the served page must contain the model's data or 2) the client must make redundant *m.fetch* calls.
To reduce the size of crawled pages, MENS implements the second approach until there is a mithril solution; an
efficient modeler should then cache results to avoid redundant database lookups.


## Socket.io Events and Polling

The MENS stack implements socket.io for all communication between the client and the server (as a full replacement for
ajax end points). On the client, the socket is exposed in **m.socket**. Here is an example of a controller that can
 emit to the server on an *onclick={ctrl.doAction}*:

```js
modules.exports = function (params) {
	m.init(this, params);
	this.doAction = function () {
		m.socket.emit('someAction', {foo: 'bar'});
	}
}
```

### The Socket Handler

The **socketHandler** property passed into the MENS constructor requires *fn(client, session)*, where *client*  is the
socket.io client and *session* is the wrapped session of the active user. In order to receive the aforementioned event,
the following *socketHandler* would work:

```js
function (client, session) {
	client.on('someAction', function (d) {
		// Do Something Now on the server
	});
}
```

### Polling

The *m.fetch* utilizes **m.poll(event, data, callback)**, which sends a special event to the server and listens for a 1 time response. In
order to poll, the server must have a socket handler setup to properly respond:

**Client Side Controller:**
```js
modules.exports = function (params) {
	m.init(this, params);
	this.doAction = function () {
		m.poll('someAction', {foo: 'bar'}, function (res) { console.log('Here Is My Response', res); });   // Expects {bar: 'foo'}
	}
}
```

**Server Side Socket Handler**
```js
function (client, session) {
	client.on('someAction', function (d) {
		client.emit(d.key, {bar: 'foo'});
	});
}
```

## Sessions

The MENS stack uses Express Session middleware to create the session, and shares this with Socket.io. The session is
then wrapped in a mensSession object, which is shared with the client (available at *window.session*). On the server &
client, the session is passed into the route controllers as a parameter and bound to the object when
**m.init(this, params)** is ran in the controller.

The wrapped session allows the server to share session variables seamlessly with the client, which may be needed for
rendering (user names or profile images, for example). The session is only mutable on the server and no sensative
session information should ever be shared with the client.

### mensSession Wrapper

| Method | Client-Side | Description |
| :--------------- | :-------------- | :-------------------------------------------------------- |
| **get(key)** | true | Returns the session variable at *key*. If *key* is null, all values are returned |
| **set(key, value)** | false | Sets *key* to *value*, and emits the update to the client |
| **clear(key)** | false | Clears value at *key*, and emits the update to the client |

## m (mithril.js) Augmentations

| Property | Description |
| :--------------- | :-------------------------------------------------------- |
| **m.socket** | Socket.io connection (client only) |
| **m.web** | Global check flag for non-isomorphic compliant code |
| **m.firstDraw** | Internal flag for setting redraw strategy on initial route mounting with required async data (client only) |
| **m.emitter** | Returns a new event-emitter object |
| **m.init** | Allows controllers isomorphic access to sessions and global flags. Reserved for future use |
| **m.poll** | Creates a bidirectional poll over sockets between the client and server (client only) |
| **m.fetch** | Fetches data from the modeler using *m.poll* |

In addition, *m.init* will also add **setTitle(title)** function to the route controllers, for updating the document
title. This function is not bound to the mithril object, because mithril is used globally on the server side.

## Todo
* meta tags
* Route caching & invalidation
* Client-Side modeler data caching and socket.io based invalidation
* Source code watches for real time updates, with event driven *m.js* refreshes on the client side
* Solve initial route mounting without redundant modeler polling (or sending data with the page)

## Questions & Contributions

Please fork and contribute, and send feedback & examples to [me@ezramorse.com](mailto:me@ezramorse.com) of any type
of isomorphic web application built with the mens stack.

## Credits

Special thanks for Stephan Hoyer for some mithril isomorphic javascript examples and utilities, as well as Leo Horie
for mithril (of course!). Many thanks to the node.js community!
