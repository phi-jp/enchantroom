/*
 * enchantroom.js
 */


;(function(global) {

	var socket = io.connect('http://'+location.host+':'+3000);

	socket.on('announce', function(data) {
		var data = JSON.parse(data);
		console.dir(data);
	});

	global.mainsocket = socket;

})(this);
