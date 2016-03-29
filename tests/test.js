var
	request = require("request"),
	mocha = require("mocha"),
	assert = require("assert");

// Copied from example server
var
	path = require('path'),
	mens = require(__dirname+path.sep+'../index.js');

var server = mens({
	logLevel: 3,
	port: 80,
	components: __dirname+path.sep+'..'+path.sep+'example'+path.sep+'components',
	routes: __dirname+path.sep+'..'+path.sep+'example'+path.sep+'serverRoutes.js',

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


var base_url = "http://localhost:80/"





describe("Server Setup", function() {
	describe("Check Server Object", function() {
		it("is not null", function(done) {
			assert.notEqual(null, server);
			done();
		});
	});
});



describe("Parses Templates", function() {
	describe("Check for mithril components", function() {
		it("is greater than 0", function(done) {
			assert.notEqual(0, Object.keys(m.components).length);
			done();
		});
	});
});


describe("Example Server: Index", function() {
	describe("GET /", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

describe("Example Server: m.js", function() {
	describe("GET /m.js", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

describe("Example Server: Components", function() {
	describe("GET /components/", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

describe("Example Server: Events", function() {
	describe("GET /events/", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

describe("Example Server: Session", function() {
	describe("GET /session/", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

describe("Example Server: Data", function() {
	describe("GET /data/", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});

