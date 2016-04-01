/*!
 * The MENS Client Session Module which bridges select session variables on the web and the backend. This creates a pseudo session object to safely share a few variables in an easy manner
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
 * @license     MIT
 */

'use strict';


/**
 * Export a constructor That instantiates a new instance of the module
 */
module.exports = createSession;

/**
 * Create an instance of the mens session wrapper
 *
 * @function createSession
 * @param {Object} config Configration Options
 */
function createSession(config) {
	return new mensSession(config);
}


/**
 * MENS Stack Session Constructor
 *
 * @module mensSession
 * @param {Object} config Configuration Options
 */
function mensSession(config) {

	var t = this;

	if (!window.sessionData)
		window.sessionData = {};


	t.session = window.sessionWrapper = {};
	t.client = config.client;


	// Initialize session data
	for (var k in window.sessionData)
		t.session[k] = {time: window.sessionData[k].time, value: window.sessionData[k].value}


	// Set Client Set Listener
	t.client.on('sessionSet', function (d) {
		if (!t.session[d.key])
			t.session[d.key] = {time: 0, value: null};

		if (d.time > t.session[d.key].time) {
			if (m.redraw.strategy() != "none")
				m.startComputation();

			t.session[d.key].value = d.value;

			if (m.redraw.strategy() != "none")
				m.endComputation();
		}
	});


	// Set Client Clear Listener
	t.client.on('sessionClear', function (d) {
		if (m.redraw.strategy() != "none")
 			m.startComputation();

		delete t.session[d.key];

		if (m.redraw.strategy() != "none")
			m.endComputation();
	});

}


/**
 * Get isomorphic datashare by key or all
 *
 * @method get
 * @param {string} key Variable Name
 * @return {mixed} data at key
 */
mensSession.prototype.get = function (key) {

	if (key) {
		if (key in this.session)
			return this.session[key].value;
		else
			return null;
	} else {
		for (var k in this.session)
			d[k] = this.session[k].value;

		return d;
	}
};