var
	path = require('path'),
	mens = require('mens');

var server = mens({
        logLevel: 3,
        port: 80,
        components: __dirname+path.sep+'components',
        routes: __dirname+path.sep+'serverRoutes.js',

		// This is a fake "modeler" to stand in for a mongoDB library
		modeler: function (data, session, callback) {
			if (data['name'] == 'fast_data')
				callback({'data1': 'Fast Data'});
			else
				setTimeout(function () {
					callback({'data2': 'Slow Data'});
				}, 1000);
		},

		// This socket handler will recieve all new clients for binding event listeners
		socketHandler: function (client, session) {
			client.on('changeMood', function (d) {
				session.set('mood', d.mood);
			});

			client.on('pingit', function (d) {
				client.emit(d.key, {response: 'Pong at ' + (new Date()).getTime()});
			});
		}
});
