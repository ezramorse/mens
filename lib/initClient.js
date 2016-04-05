/*!
 * A function that adds isomorphic helper functions to mithril and initializes the MENS stack
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
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
	m.lockHead      = true;
	m.route.mode    = "pathname";
	window.session  = window.createSession({client: m.socket});
	window.head     = document.querySelector('head');
	window.dataCache = {};


	// Create a listener for invalidating cached models
	m.socket.on('invalidateData', function (d) {

		// Check to see if the data is cached, and delete it
		var cacheKey = JSON.stringify(d.key);
		if (window.dataCache.hasOwnProperty(cacheKey))
			delete window.dataCache[d.key];

	});


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
	 */
	window.setTitle = function (t) {
		if (!m.firstDraw) {
			if (typeof t === "undefined") t = window.defaultTitle;

			document.title = t;
		}
	};


	/**
	 * Set the meta tags of the document
	 *
	 * @function window.setMeta
	 * @param {Array} m Document Meta Tags
	 */
	window.setMeta = function (meta) {
		if (m.lockHead)
			return;

		var d = typeof meta === "undefined";
		if (d)
			meta = window.defaultMeta;
		else if (!Array.isArray(meta))
			meta = [meta];

		var mt = window.head.querySelectorAll('meta[data-m]'), l=mt.length, j=meta.length, x=0, r = m.route();

		for (;x < l; x++)
			if (r != mt[x].getAttribute("data-m"))
				window.head.removeChild(mt[x]);

		for (x=0; x < j; x++) {
			var e = document.createElement("meta");
			for (var k in meta[x])
				e.setAttribute(k, meta[x][k]);

			e.setAttribute("data-m", d ? "*" : r);
			window.head.appendChild(e);
		}

	};


	/**
	 * Set the link tags of the document
	 *
	 * @function window.setLinks
	 * @param {Array} l Document Link Tags
	 */
	window.setLinks = function (links) {
		if (m.lockHead)
			return;

		var d = typeof links === "undefined";
		if (d)
			links = window.defaultLinks;
		else if (!Array.isArray(links))
			links = [links];

		var lt = window.head.querySelectorAll('link[data-m]'), l=lt.length, j=links.length, x=0, r = m.route();

		// Remove existing link tags
		for (;x < l; x++)
			if (r != lt[x].getAttribute("data-m"))
				window.head.removeChild(lt[x]);

		for (x=0; x < j; x++) {
			var e = document.createElement("link");
			for (var k in links[x])
				e.setAttribute(k, links[x][k]);

			e.setAttribute("data-m", d ? "*" : r);
			window.head.appendChild(e);
		}

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

		// Let's not redraw the screen at all for first draw if async data is required
		if (m.firstDraw) {
			if (!window.hasOwnProperty('drawCount'))
				window.drawCount = 0;
			else
				window.drawCount++;

			if (window.drawCount >= 1)
				m.firstDraw = false;

		}

		if (!m.firstDraw) {
			m.lockHead = false;
			window.setMeta();
			window.setLinks();
			window.setTitle();
		}

		c.session = window.session;
		c.flags = window.flags;
		c.setTitle = window.setTitle;
		c.setMeta = window.setMeta;
		c.setLinks = window.setLinks;

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

		// Check to see if the data is cached, and return it if found
		var cacheKey = JSON.stringify(d);

		if (window.dataCache.hasOwnProperty(cacheKey) && (window.dataTtl == 0 || (window.dataCache[cacheKey].expires > (new Date()).getTime()))) {
			console.log('[MENS] Cache Hit: ', cacheKey, window.dataCache[cacheKey].data);
			if (s) {
				m.redraw.strategy("diff");
				m.startComputation();
			}

			// Set the controller data
			for (var key in window.dataCache[cacheKey].data)
				if (c[key])
					c[key](window.dataCache[cacheKey].data[key]);

			if (x) x();

			if (s)
				m.endComputation();

			return;
		}

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

			if (window.dataTtl !== false)
				window.dataCache[cacheKey] = {expires: (new Date()).getTime() + window.dataTtl, data: res};

		});

		return m;
	};

};