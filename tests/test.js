var
	example = require("mens/example/server.js"),
	request = require("request"),
	mocha = require("mocha"),
	assert = require("assert");

var base_url = "http://localhost:80/"

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

