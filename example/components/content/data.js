module.exports = function (params) {

	for (var k in params)
		this[k] = params[k];


	return this;
};