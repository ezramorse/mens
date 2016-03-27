module.exports = function () {

	/**
	 * Create a persistant state store. No controllers or views should mutate this store, unless an explicit controller action (onclick, etc) is called.
	 * Otherwise the server will update it. This is a good way to initialize global flags that should exist, regardless of the active route. Sometimes
	 * flags could be used on multiple routes.
	 *
	 * Often, it can be more appropriate to store persistent data specific to the user in the shared session wrapper or as part of the flags export in the routes definition
	 *
	 */
	m.extraFlags = {
		pagesBrowsedTo: m.prop(1)
	};

	// This is how to override a JSX template turned into a component
	m.components.user.view = function (ctrl) {

		console.log('Override Code');

		return m.views.user(ctrl);
	};

	/**
	 * More Custom Code can be put here. To work on window, check "m.web" to make sure you are on the client.
	 *
	 * Its useful to augment the "m" object if you need variables/functions available on both the server and client
	 */

};