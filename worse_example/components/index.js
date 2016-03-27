module.exports = function (params) {

	var t = this;

	m.init(t, params);

	// Setup Controller Properties
	t.gotoUsers = function (e) {
		e.preventDefault();
		m.extraFlags.pagesBrowsedTo(m.extraFlags.pagesBrowsedTo() + 1);
		m.route('/user/1');
	};

	// Set a default title
	this.setTitle("The Loud Kitchen Sink");

	return t;

};