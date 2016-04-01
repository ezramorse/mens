/*!
 * The MENS Server Session Module which bridges select session variables on the web and the backend. This creates a pseudo session object to safely share a few variables in an easy manner
 *
 * @author      Ezra Morse <me@ezramorse.com>
 * @copyright   (c) 2016 Ezra Morse
 * @license     MIT
 */

'use strict';


/**
 * Module dependencies
 */
var
	crypto = require('crypto');

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

	this.session = config.session;
	this.sessionID = config.sessionID;
	this.isSocket = config.isSocket;
	if (!this.session.shared)
		this.session.shared = [];

}


/**
 * Set isomorphic datashare
 *
 * @method set
 * @param {string} key Variable Name
 * @param {mixed} data Data to Store
 * @chainable
 */
mensSession.prototype.set = function (key, data) {

	this.session[key] = data;

	if (this.session.shared.indexOf(key) === -1)
		this.session.shared.push(key);

	if (m.sessionMap[this.sessionID])
		m.sessionMap[this.sessionID].client.emit('sessionSet', {key: key, value: data, time: new Date().getTime()});

	if (this.isSocket)
		this.session.save();

	return this;

};


/**
 * Get isomorphic datashare by key or all
 *
 * @method get
 * @param {string} key Variable Name
 * @return {mixed} data at key
 */
mensSession.prototype.get = function (key) {

	if (key) {
		if (this.session.shared.indexOf(key) !== -1)
			return this.session[key];
		else
			return null;
	} else {
		var i = 0, l = this.session.shared.length, d= {};
		for (; i < l; i++) {
			d[this.session.shared[i]] = this.session[this.session.shared[i]];
		}

		return d;
	}
};


/**
 * Clear isometric datashare by key
 *
 * @method clear
 * @param {string} key Variable Name
 * @chainable
 */
mensSession.prototype.clear = function (key) {

	if (this.session.shared.indexOf(key) === -1) {
		this.session.shared.splice(this.session.shared.indexOf(key), 1);
		delete req.session[key];

		if (m.sessionMap[this.sessionID])
			m.sessionMap[this.sessionID].client.emit('sessionClear', {key: key});

		if (this.isSocket)
			this.session.save();

	}

	return this;
};