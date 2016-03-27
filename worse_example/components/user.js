module.exports = function (params) {

	var t = this;

	/**
	 * This is a required step that does the following:
	 * 1) Attach the session to controller, which is difficult due to isomorphic client/server differences
	 * 2) Sets an async flag, which determines on client if the screen will be immediately redrawn or delayed until the data comes
	 */
	m.init(t, params, true);

	// Setup Controller Properties
	t.handleNext = function (e) {
		e.preventDefault();
		window.bang(Math.floor(Math.random() * 7) + 1);
		m.extraFlags.pagesBrowsedTo(m.extraFlags.pagesBrowsedTo() + 1);
		m.route('/user/'+(parseInt(t.id())+1));
	};
	t.handleLast = function (e) {
		e.preventDefault();
		window.bang(Math.floor(Math.random() * 7) + 1);
		m.extraFlags.pagesBrowsedTo(m.extraFlags.pagesBrowsedTo() + 1);
		if (parseInt(t.id()) < 2)
			m.route('/');
		else
			m.route('/user/'+(parseInt(t.id())-1));
	};

	t.id             = m.prop(parseInt(params.id));
	t.info           = m.prop(false); // ASYNC DATA
	t.text           = m.prop(false); // ASYNC DATA
	t.details1       = m.prop(false); // ASYNC DATA
	t.details2       = m.prop(false); // ASYNC DATA
	t.slowDetails    = m.prop(false); // POST LOAD, ASYNC DATA

	// Set a default title
	t.setTitle("Information for...");

	m   // Get Asyncronous Data Required For Render (1 single complete model fetch should ideally translate to 1 page route)
		.fetch(t, {name: 'user', id: t.id()}, function () { t.setTitle("Information for "+t.info()); })
		.fetch(t, {name: 'user_details', id: t.id()})

		// Get Slow Asyncronous Data That Can Render Later (not good for SEO)
		.fetch(t, {name: 'user_async', id: t.id()}, false, true);

	return t;
};