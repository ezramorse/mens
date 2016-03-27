module.exports = function (params) {

	for (var k in params)
		this[k] = params[k];

	this.sections = {
		"contentHome" : {
			name: "Home",
			href: "/"
		},
		"contentComponents" : {
			name: "Components",
			href: "/components/"
		},
		"contentEvents" : {
			name: "Socket.io Events",
			href: "/events/"
		},
		"contentSession" : {
			name: "Session Wrapper",
			href: "/session/"
		},
		"contentData" : {
			name: "Asynchronous Data",
			href: "/data/"
		}
	};


	this.handleClick = function (idx) {
		var e = window.event;
		if (e && typeof e !== 'undefined') e.preventDefault();

		if (m.route() != idx)
			m.route(idx);
	};

	return this;
};