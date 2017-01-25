angular
	.module('flightApp.core')
	.factory('appBootstrapFactory', appBootstrapFactory);

appBootstrapFactory.$inject = ['$rootScope', '$timeout'];

function appBootstrapFactory($rootScope, $timeout) {
	var app = {};
	app.mapReady = false;
	app.bootstrapped = false;
	
	app.setMapStatus = setMapStatus;
	app.setUserLocation = setUserLocation;
	app.broadcastFlightBootstrapping = broadcastFlightBootstrapping;
	
	function setMapStatus(val) {
		app.mapReady = val;
		$rootScope.$broadcast('mapBootstrapped', val);
	}
	
	function setUserLocation(location) {
		$timeout(function() {
			$rootScope.$broadcast('userLocationFound', location);
		});
	}
	
	function broadcastFlightBootstrapping(val) {
		$timeout(function() {
			$rootScope.$broadcast('flightsBootstrapped', val);
		});
	}
	
	return app;
}