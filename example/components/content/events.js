module.exports = function (params) {

	this.params = params;

	this.ping = function () {
		m.poll('pingit', {}, function (d) { alert(d.response) });
	};

	return this;
};