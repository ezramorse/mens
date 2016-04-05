/*!
 * The MENS stack for isomorphic javascript web applications (Mithril, Express.js, Node.js, Socket.io)
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
 * @license     MIT
 * @dependencies camelcase chalk compression deepcopy domready express express-session mithril mithril-node-render moment-timezone msx socket.io socket.io-client uglify-js wolfy87-eventemitter
 * @dev-dependencies assert lorem-ipsum mocha request
 */

'use strict';

/**
 * Module dependencies
 */
var
	path        = require('path'),
	msx         = require('msx'),
	fs          = require('fs'),
	vm          = require('vm'),
	http        = require('http'),
	express     = require('express'),
	compression = require('compression'),
	socketio    = require('socket.io'),
	exSession   = require('express-session'),
	chalk       = require('chalk'),
	moment      = require('moment-timezone'),
	camelCase   = require('camelcase'),
	uglify      = require("uglify-js"),
	render      = require('mithril-node-render'),
	createSession = require(__dirname+'/lib/serverSession.js'),
	createHelper = require(__dirname+'/lib/serverHelper.js'),
	mSrc        = fs.readFileSync(require.resolve('mithril'), 'utf8'),
	eSrc        = fs.readFileSync(require.resolve('wolfy87-eventemitter'), 'utf8'),
	iSrc        = fs.readFileSync(require.resolve('socket.io-client/socket.io.js'), 'utf-8'),
	dSrc        = fs.readFileSync(require.resolve('domready'), 'utf-8');


/**
 *  Initialize Mithril Server - (funny path for travis tests)
 */
require(__dirname+'/lib/initServer.js')();


/**
 * Export a constructor That instantiates a new instance of the module
 */
module.exports = createMens;


/**
 * Create an instance of the mens stack
 *
 * @function createMens
 * @param {Object} config Configration Options
 */
function createMens(config) {
	return new mens(config);
}


/**
 * Private Variables
 */
var
	moduleTag   = 'MENS',
	logLevel    = 3,
	tz          = 'America/Los_Angeles',
	bodyTag     = '<!--MENS-->',
	sessionTag  = '<!--SESSION-->',
	titleTag    = '<!--TITLE-->',
	metaTag     = '<!--META-->',
	linkTag     = '<!--LINK-->',
	tab         = '\t',
	tpl         = '',
	rSrc        = '',
	componentsJS = '',
	templatesJS = '',
	controllersJS = '',
	customJS    = '',
	mensJS = '',
	logLevels   = ['red', 'yellow', 'green', 'gray'];


/**
 * MENS Stack Constructor
 *
 * @module mens
 * @param {Object} config Configuration Options
 */
function mens(config) {

	// Create alias for scope changes
	var t = this;

	// Set Log Level
	logLevel = config.logLevel || logLevel;

	// Set timezone
	tz = config.tz || tz;

	// Setup Session
	var sessionMiddleware = exSession({
		store: config.sessionStore || null,
		secret: config.sessionSecret || 'kneeboard fat',
		name: config.sessionName || 'sid',
		resave: true,
		saveUninitialized: true
	});

	// Compile the JSX templates and components into usable objects
	if (config.components)
		t.buildComponents(config.components);

	// Execute and compile in custom code
	if (config.customJS) {
		customJS = '(function () { var module = {}; ' + fs.readFileSync(config.customJS, 'utf8') + ';\nmodule.exports();})();\n';
		try {
			vm.runInThisContext(customJS);
			mensJS += '' + customJS;
		} catch (e) {
			this.log('Error Running Custom JS: ' + e.message, 1);
			console.log(e.stack);
		}
	}

	// Create Client Side Source Code For Initializing MENS stack
	rSrc = '(function(w) { var module = {};' + fs.readFileSync(__dirname + path.sep + 'lib' + path.sep + 'clientSession.js', 'utf8') + ';\nw.createSession=module.exports;})(window);\n' +
		'(function() { var module = {};' + fs.readFileSync(__dirname + path.sep + 'lib' + path.sep + 'initClient.js', 'utf8') + ';\nmodule.exports();})();\n' +
		'(function(w) { var module = {};' + fs.readFileSync(config.routes || config.settings, 'utf8') + ';\nvar routes = module.exports; if (module.exports.routes) routes = routes.routes; if (module.exports.flags) window.flags = m.flags = module.exports.flags || {}; window.defaultTitle = module.exports.title || "";  window.defaultMeta = module.exports.meta || []; window.dataTtl = (module.exports.dataTtl || 60)*1000; window.defaultLinks = module.exports.links || [];  m.route(document.getElementById("mens-content"), "/", routes);})(window);\n';

	// Setup HTTP Server
	this.app = express();
	this.server = http.createServer(this.app);
	this.io = socketio(this.server);

	// Bridge Sessions Together
	this.io.use(function (socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next)
	});
	this.app.use(sessionMiddleware);

	// Setup Middleware
	this.app.use(compression());

	this.server.listen(config.port || 80, config.host || '0.0.0.0', function () {
		var details = t.server.address();
		t.log('HTTP Server Listening at ' + details.address + '::' + details.port, 3);
	});

	// Add modeler to global mithril
	if ('modeler' in config)
		m.modeler = config.modeler;

	// Load Template
	tpl = fs.readFileSync(config.template ? config.template : __dirname + path.sep + 'wrapper.tpl', 'utf8');

	// Initialize Routes & Handle backwards compatibility
	var settings = {}, routes = {};
	config.settings = config.settings || config.routes;
	if (config.settings) {
		routes = require(config.settings);

		if (!routes.routes)
			settings.routes = routes;
		else {
			settings = routes;
			routes = settings.routes;
		}

	}

	// Setup Default Page Variables
	settings.title = settings.title || '';
	settings.meta  = settings.meta || {};
	settings.links = settings.links || {};
	settings.flags = m.flags = settings.flags || {};

	for (var route in routes)
		(function (route, app) {
			app.get(route, function (req, res) {

				// Create a Helper For the Controller
				var helper = req.params._helper = createHelper({req: req, settings: settings});

				// Create controller instance
				var ctrl = routes[route].controller(req.params);

				// Define response renderer
				var response = function () {

					res.setHeader('Content-Type', 'text/html');
					res.setHeader('Cache-Control', 'no-cache');
					res.write(tpl.replace(bodyTag, render(routes[route].view(ctrl))).replace(sessionTag, helper.sessionToString()).replace(titleTag, helper.getTitle()).replace(metaTag, helper.metaToString()).replace(linkTag, helper.linksToString()));
					res.flush();
					res.end();
				};

				if ('modeler' in m && 'mensFetch' in ctrl) {

					// Check to see if there are any active fetches
					var waiting = false;
					for (var x = 0; x < ctrl.mensFetch.length; x++) {
						if (ctrl.mensFetch[x]) {
							waiting = true;
							// Set an event to watch for fetch to finish
							ctrl.mensFetch[x].once('finished', function (data) {

								for (var x = 0; x < ctrl.mensFetch.length; x++)
									if (ctrl.mensFetch[x]) return;

								// If all fetches are finished, return the rendered page
								response();
							});
						}
					}

					if (!waiting)
						response();

				} else
					response();

			});
		})(route, this.app);


	// Setup Static Content
	if ('static' in config)
		this.app.use(express.static(config.static));


	// Update mithril source client side for diff drawing and passing params into root controller
	mSrc = mSrc.replace('var controller = new (component.controller || noop)()',
		'm.redraw.strategy("diff");' +
		'var controller = new (component.controller || noop)(m.route.param())');

	// Setup m.js route
	if (!config.hasOwnProperty('minify') || config.minify) {
		var finalM = uglify.minify(dSrc + ';\n' + iSrc + ';\n' + mSrc + ';\n' + eSrc + ';\n' + mensJS + ';\n' + rSrc, {
			mangle: true,
			fromString: true,
			compress: {
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_console: false
			}
		});

		this.log('M Source Minified', 3);
	}else
		var finalM = {code: dSrc+';\n'+iSrc+';\n'+mSrc+';\n'+eSrc+';\n'+mensJS+';\n'+rSrc};

	// @TODO, cache this content
	this.app.get('/m.js', function (req, res) {
		res.setHeader('Content-Type', 'text/javascript');
		res.write(finalM.code);
		res.flush();
		res.end();
		res.end(finalM.code);
	});


	// Bind socket io received events to handler declared in config
	this.io.on('connection', function (client) {

		var session = createSession({session: client.request.session, sessionID: client.request.sessionID, isSocket: true});

		m.sessionMap[client.request.sessionID] = {lastActive: new Date().getTime(), client: client};

		// Ensure that modeler will get the request and the callback will emit the proper key
		if (m.modeler)
			client.on('getModel', function (data) {
				m.sessionMap[client.request.sessionID].lastActive = new Date().getTime();
				m.modeler(data, session, function (result) {
					client.emit(data.key, result);
				});
			});

		if ('socketHandler' in config)
			config.socketHandler(client, session);
	});

}


/**
 * A logger for the Mens Stack
 *
 * @method log
 * @param {string} message Log message
 * @param {int} level Severity of the message (lowest is most severe)
 * @param {string} tag Module where message occurs
 * @chainable
 */
mens.prototype.log = function(message, level, tag) {

	if (level <= logLevel) {

		var time = moment().tz(tz).format();

		if (level < logLevels.length)
			var color = logLevels[(level-1)];
		else
			var color = logLevels[logLevels.length-1];

		tag = tag || moduleTag;

		console.log(time, tab, chalk[color]('['+tag+']'), tab, chalk.white.bold(message));

	}

	return this;

};


/**
 * Build Mithril Components
 *
 * @method buildComponents
 * @param {string} directory Path to the template directory
 * @param {string} node Current Node
 * @chainable
 */
mens.prototype.buildComponents = function(directory, node) {

	if (!node) {
		node = '';
		componentsJS = ";\nm.components={};";
		templatesJS = ";\nm.views={};";
		controllersJS = ";\nm.controllers={};";
	}

	try {

		var files = fs.readdirSync(directory), components = {}, views = {};

		for (var x = 0; x < files.length; x++) {
			var s = fs.statSync(directory+path.sep+files[x]);
			if (s.isFile()) {
				var k = false;

				if (files[x].indexOf('jsx', files[x].length - 3) != -1) {
					var k = camelCase(node + ' ' + files[x].substring(0, files[x].length - 4))
					templatesJS += 'm.views.' + k + '=function(ctrl){return ' + msx.transform(fs.readFileSync(directory + path.sep + files[x], {encoding: 'utf8'}), {harmony: true}) + '};\n';
					views[k] = true;
				} else if (files[x].indexOf('js', files[x].length - 2) != -1) {
					var k = camelCase(node + ' ' + files[x].substring(0, files[x].length - 3));
					controllersJS += 'm.controllers.' + k + '=(function(){var module = {};' + fs.readFileSync(directory + path.sep + files[x], {encoding: 'utf8'}) + '; return module.exports; })();\n';
					components[k] = true;
				}

				if (k && components[k] && views[k])
					componentsJS += 'm.components.' + k + '= {controller: m.controllers.'+k+', view: m.views.'+k+'};\n';

			} else if (s.isDirectory()) {
				this.buildComponents(directory+path.sep+files[x], (node!='' ? node+' '+files[x] : files[x]));
			}

		}

		if (node == '') {
			mensJS = templatesJS+';\n'+controllersJS+';\n'+componentsJS+';\n';
			vm.runInThisContext(mensJS);
			this.log('Templates Compiled', 3);
		}
	} catch (e) {
		this.log('Error Loading Component Directory: '+ e.message, 1);
		console.log(e.stack);
	}

	return this;

};