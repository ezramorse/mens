/**
 * Here is a persistent store of values that I can share between views
 *
 * Because the redraw strategy is set to "diff" for speed, many components down stream will not be redrawn (navigation for example). Because of this, the new controller
 * will not be passed into them when the components are initialized. Using shared global storage that each controller can alter will enable retroactively rendered components
 * to behave correctly when flags change.
 *
 * This is a compromise to take full advantage of the VDOM with a "diff" vs an "all" on route changes. It may be cleaner to have a shared storage global and rely on
 * variables in the 'window' context (on the client), but cannot work on the server
 *
 * The flags will still need to be passed to children as ctrl properties
 */
var flags = {
	section: m.prop("contentHome")
};

var meta = [
	{name: "description", content: "Isomorphic Mithril Javascript Framework"},
	{name: "keywords", content: "isomorpic, mithril, javascript, framework"}
];

var links = [
	{rel: "icon", type: "image/png", href: "https://cdn2.iconfinder.com/data/icons/emoticons-17/24/emoticons-04-128.png" }
];

module.exports = {
	title: 'Mens Stack',
	flags: flags,
	meta: meta,
	links: links,
	routes: {
		// Let's just route everything to the same basic wrapper view, and use the controller to set a global flag.
		'/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('The Isomorphic MENS Stack');
				flags.section('contentHome');
				return this;
			}, view: m.views.page2column
		},
		'/about/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('About The MENS Stack');
				flags.section('contentAbout');
				return this;
			}, view: m.views.page2column
		},
		'/components/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('Templating and Components');
				flags.section('contentComponents');
				return this;
			}, view: m.views.page2column
		},
		'/events/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('Using Events');
				flags.section('contentEvents');
				return this;
			}, view: m.views.page2column
		},
		'/session/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('The Session Wrapper');
				flags.section('contentSession');
				return this;
			}, view: m.views.page2column
		},
		'/data/': {
			controller: function (params) {
				m.init(this, params)
				this.setTitle('Asynchronous Data and Isomorphism');
				flags.section('contentData');

				this.data1 = m.prop(false);
				this.data2 = m.prop(false);

				m.fetch(this, {name:'fast_data'});
				m.fetch(this, {name:'slow_data'}, false, true);

				return this;
			}, view: m.views.page2column
		},
		'/faq/': {
			controller: function (params) {
				m.init(this, params);
				this.setTitle('Questions and Answers');
				flags.section('contentFaq');
				return this;
			}, view: m.views.page2column
		}
	}
};