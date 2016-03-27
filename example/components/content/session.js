module.exports = function (params) {

	this.flags = params.flags;
	this.session = params.session;

	this.makeHappy = function () {
		m.socket.emit('changeMood', {mood: 'happy'});
	};

	this.makeSad = function () {
		m.socket.emit('changeMood', {mood: 'sad'});
	};

	return this;
};