/*!
 * A function that declares mithril as a global variable and adds isomorphic helper functions to it
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
 * @email       me@ezramorse.com
 * @version     0.1.0
 * @license     MIT
 */

var events = require('events'),
	m = require('mithril'),
	path = require('path'),
	createSession = require(__dirname+path.sep+'serverSession.js');

module.exports = function () {

	/**
	 *  Setup mithril as a global so that routes/modules can see it
	 */
	global.m = m;


	/**
	 * Add Public Variables
	 */
	m.web  = false;
	m.sessionMap = {};

	/**
	 * Create an event emitter
	 *
	 * @function m.emitter
	 * @return event emitter
	 */
	m.emitter = function () { return new events.EventEmitter };


	/**
	 * Initialize the mithril instance for the next route controller, specifically by setting up the global session holder
	 *
	 * @function m.init
	 * @param {Object} c Controller
	 * @param {Object} p Controller Parameters
	 * @chainable
	 */
	m.init = function (c, p) {

		c.session = p.sessionWrapper;
		c.flags = p.mensFlags;
		c.setTitle = p.setTitle;

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

		// Do nothing. There is no reason to poll on the server side

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
		// Skip if there is no modeler or data is not required
		if (m.modeler && !a) {

			// Create a variable to track fetches in the controller
			if (!c.mensFetch) c.mensFetch = [];

			var e = m.emitter(), idx = c.mensFetch.length;
			c.mensFetch[idx]=e;

			m.modeler(d, c.session, function (res) {

				// Set the controller data
				for (var key in res)
					if (c[key])
						c[key](res[key]);

				// Perform the callback
				if (x) x();

				// Flag fetch as finished
				c.mensFetch[idx] = false;

				// Let renderer know data has been fetched
				e.emit('finished');

			});

		}
		return m;
	};

};