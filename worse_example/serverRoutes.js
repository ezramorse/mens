var flags = {};

module.exports = {
	flags: flags,
	routes: {
		'/': m.components.index,
		'/user/:id': m.components.user
	}
};