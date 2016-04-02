/*!
 * The MENS Server Helper Model provides functions to bind to the route controller
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
	createSession = require('./serverSession.js'),
	deepcopy = require('deepcopy');


/**
 * Private Variables
 */
var
	links = [],
	meta = [],
	title = '',
	t;

/**
 * Export a constructor That instantiates a new instance of the module
 */
module.exports = createHelper;


/**
 * Create an instance of the mens helper and add it to route parameters
 *
 * @function createHelper
 * @param {Object} config Configration Options
 */
function createHelper(config) {
	return new mensHelper(config);
}



/**
 * MENS Stack Helper Functions
 *
 * @module mensHelper
 * @param {Object} config Configuration Options
 */
function mensHelper(config) {

	t = this;

	t.req = config.req;
	t.settings = config.settings;

	t.session = createSession({session: t.req.session, sessionID: t.req.sessionID});

	// Set Default Values
	title = deepcopy(t.settings.title);
	links = deepcopy(t.settings.links);
	meta = deepcopy(t.settings.meta);

	t.flags = t.settings.flags;

}


/**
 * Bind Controller to object
 *
 * @method bindController
 * @param {object} c Route Controller
 */
mensHelper.prototype.bindController = function (c) {

	t.controller = c;

	// Setup Helper Functions on controller
	t.controller.setTitle = t.setTitle;
	t.controller.setLinks = t.setLinks;
	t.controller.setMeta = t.setMeta;
	t.controller.session = t.session;
	t.controller.flags = t.flags;

};


/**
 * Set the page title
 *
 * @method setTitle
 * @param {string} t Page Title
 */
mensHelper.prototype.setTitle = function (t) {
	title=t;
};


/**
 * Get the page title
 *
 * @method getTitle
 * @return {String} Page Title
 */
mensHelper.prototype.getTitle = function () {
	return title;
};


/**
 * Set the links for the page
 *
 * @method setLinks
 * @param {Array} l Array of link objects
 */
mensHelper.prototype.setLinks = function (l) {

	if (!Array.isArray(l)) l=[l];

	links=links.concat(l.map(function (l2) {
		l2['data-m']=t.req.originalUrl;
		return l2;
	})).filter(function (l2) {
		return (l2['data-m'] == t.req.originalUrl);
	});

};


/**
 * Set the meta tags for the page
 *
 * @method setMeta
 * @param {Array} m Array of link objects
 */
mensHelper.prototype.setMeta = function (m) {

	if (!Array.isArray(m)) m=[m];

	meta=meta.concat(m.map(function (m2) {
		m2['data-m']=t.req.originalUrl;
		return m2;
	})).filter(function (m2) {
		return (m2['data-m'] == t.req.originalUrl);
	});

};


/**
 * Create the meta tags text for the page
 *
 * @method metaToString
 * @return {String} Meta Tags
 */
mensHelper.prototype.metaToString = function () {
	var x= 0, s='', i = meta.length;
	for (;x < i; x++) {
		s += '<meta';
		for (var k in meta[x])
			s += ' '+k+'="'+meta[x][k]+'"';
		s += (!meta[x]['data-m'] ? ' data-m="*"' : '')+'/>\n\t';
	}
	return s;
};


/**
 * Create the link tags text for the page
 *
 * @method metaToString
 * @return {String} Link Tags
 */
mensHelper.prototype.linksToString = function () {

	var x= 0, s='', i = links.length;
	for (;x < i; x++) {
		s += '<link';
		for (var k in links[x])
			s += ' '+k+'="'+links[x][k]+'"';
		s += (!links[x]['data-m'] ? ' data-m="*"' : '')+'/>\n\t';
	}
	return s;
};


/**
 * Create a json string of the session variables
 *
 * @method sessionToString
 * @return {String} Session Tags
 */
mensHelper.prototype.sessionToString = function () {

	var s = {}, d = new Date().getTime(), sd = t.session.get();

	for (var k in sd)
		s[k] = {time: d, value: sd[k]}

	return JSON.stringify(s);
};