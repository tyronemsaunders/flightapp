angular
	.module('flyingBye.core')
	.factory('appBootstrapFactory', appBootstrapFactory);

appBootstrapFactory.$inject = [];

function appBootstrapFactory() {
	var app = {};
	app.userLocation;
	app.flights;
	app.map;
	app.mapReady = false;
	
	app.setMapStatus;
	
	function setMapStatus(val) {
		app.mapReady = val;
	}
	
	return app;
}