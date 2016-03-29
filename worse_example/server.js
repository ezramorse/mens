/**
 * To illustrate the power of MENS, this is an example of an incredibly annoying site that cannot be done without
 * isomorphic javascript. Ambient code can execute while new pages are browsed, and data is being sent in via
 * websockets.
 */


var path = require('path'),
    crypto = require('crypto'),
    gen = require('lorem-ipsum'),
    mens = require('mens');


Math.seed = function(s) {
	var m_w  = s;
	var m_z  = 987654321;
	var mask = 0xffffffff;

	return function() {
		m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
		m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

		var result = ((m_z << 16) + m_w) & mask;
		result /= 4294967296;

		return result + 0.5;
	}
};


/**
 * Custom Async-simulating modeling object
 *
 * @function modeler
 * @param {Object} data Model to lookup
 * @param {Object} session Session wrapper for ACL
 * @param {Function} callback Function used to return value
 */
var modeler = function (data, session, callback) {
	var f = session.get('fetches');
	if (f)
		session.set('fetches', f+1);
	else
		session.set('fetches', 1);

	switch (data.name) {
		case 'user':
			var res = {
				text: gen({
					paragraphLowerBound: 3,
					count:20,
					random: Math.seed(data.id)
				}),
				info: crypto.createHash('md5').update(data.id.toString()).digest("hex")
			};
			callback(res);
			break;

		case 'user_details':
			var res = {
				details1: 'Detail 1 For ' + data.id,
				details2: 'Detail 2 For ' + data.id
			};
			setTimeout(function() {
				callback(res);
			},500);
			break;

		case 'user_async':
			var res = {
				slowDetails: 'This Information On '+data.id+' Took A Long Time To Find'
			};
			// Simulate long async data lookup
			setTimeout(function() {
				callback(res);
			}, 1000);
			break;
	}
};

// Socket IO Event Handler
var handler = function (client, session) {

};

var server = mens({
        logLevel: 3,
        tz: 'America/Los_Angeles',
        port: 80,
        host: '0.0.0.0',
        static: __dirname+path.sep+'static',
        sessionStore: null,
        sessionSecret: 'kneeboard fat',
        sessionName: 'sid',
        modeler: modeler,
        socketHandler: handler,
        components: __dirname+path.sep+'components',
		customJS: __dirname+path.sep+'custom.js',
        routes: __dirname+path.sep+'serverRoutes.js',
        template: __dirname+path.sep+'static'+path.sep+'wrapper.tpl'
});
