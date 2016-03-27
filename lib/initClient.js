/*!
 * A function that adds isomorphic helper functions to mithril and initializes the MENS stack
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
 * @email       me@ezramorse.com
 * @version     0.1.0
 * @license     MIT
 */

module.exports = function () {

	// Create the socket.io connection and store it in the mithril object for ease
	m.socket = io.connect();


	/**
	 * Initialize Public Variables
	 */
	m.web           = true;
	m.firstDraw     = true;
	m.route.mode    = "pathname";
	window.session  = window.createSession({client: m.socket});


	/**
	 * Create an event emitter
	 *
	 * @function m.emitter
	 * @return event emitter
	 */
	m.emitter = function () {
		return new EventEmitter
	};


	/**
	 * Set the title tag of the document
	 *
	 * @function window.setTitle
	 * @param {String} t Title
	 * @chainable
	 */
	window.setTitle = function (t) {
		if (!m.firstDraw) document.title = t; return m;
	};


	/**
	 * Initialize the mithril instance for the next route controller, specifically by setting up the global session holder
	 *
	 * @function m.init
	 * @param {Object} c Controller
	 * @param {Object} p Controller Parameters
	 * @chainable
	 */
	m.init = function (c, p) {

		// By default, switching routes redraws the entire screen. Let's not do that.
		// Let's not redraw the screen at all for first draw
		if (m.firstDraw) {
			if (!window.hasOwnProperty('drawCount'))
				window.drawCount = 0;
			else
				window.drawCount++;

			if (window.drawCount >= 1)
				m.firstDraw = false;
		}

		c.session = window.session;
		c.flags = window.flags;
		c.setTitle = window.setTitle;

		return m;

	};

	/**
	 * Emit an event and Execute a Callback on the Response
	 *
	 * @function m.poll
	 * @param {string} e Event Name
	 * @param {Object} d Data to emit
	 * @param {Function} x Callback after modeler fetching
	 * @chainable
	 */
	m.poll = function (e, d, x) {

		// Set a unique callback event to listen for
		var k = e+"_" + Math.floor(new Date().getUTCMilliseconds() * 1000 * Math.random()), route = m.route();

		m.socket.on(k, function (res) {
			// Stop listening to the custom event
			m.socket.off(k);

			// Ignore if route has changed
			if (m.route() != route)
				return;

			// Execute intended callback
			if (x)
				x(res);

		});

		d.key = k;

		m.socket.emit(e, d);

		return m;

	};

	/**
	 * Fetch Asyncronous Data During Rendering
	 *
	 * @function m.fetch
	 * @param {Object} c Mithril Controller
	 * @param {Object} d Model Description to fetch
	 * @param {Function} x Callback after modeler fetching
	 * @param {Boolean} a Flag to determine if this data is required for initial render
	 * @chainable
	 */
	m.fetch = function (c, d, x, a) {

		// Do not redraw until after all required data has finshed being fetched if on first draw
		if (!a && m.firstDraw)
			m.redraw.strategy("none");

		// If there is no socket connection established, delay execution
		if (typeof m.socket.id === 'undefined') { setTimeout(function () { m.fetch(c,d,x,a); }, 10);  return m; }

		// Create a variable to track fetches in the controller
		if (!c.mensFetch) c.mensFetch = [];

		// Track the fetch and if it is required for the first render
		var idx = c.mensFetch.length, route = m.route();

		c.mensFetch[idx]=(a ? 2 : 1);

		m.poll('getModel', d, function (res) {

			// Mark the fetch as finished
			c.mensFetch[idx] = 0;

			var s = true;

			// Do not redraw on first draw if waiting for any more non-async data (or glitches will appear
			if (m.firstDraw) {
				for (var i = 0; i < c.mensFetch.length; i++)
					if (c.mensFetch[i] == 1) {
						s = false;
						break;
					}

				// If all required pieces are found, flag the first draw
				if (s) m.firstDraw = false;

			}

			if (s) {
				m.redraw.strategy("diff");
				m.startComputation();
			}

			// Set the controller data
			for (var key in res)
				if (c[key])
					c[key](res[key]);

			if (x) x();

			if (s)
				m.endComputation();

		});

		return m;
	};

};