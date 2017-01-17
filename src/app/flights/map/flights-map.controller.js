angular
	.module('flyingBye.flights')
	.controller('FlightsMapController', FlightsMapController);

FlightsMapController.$inject = ['$scope', '$window', 'flightsMap'];

function FlightsMapController($scope, $window, flightsMap) {
	
	//set the path of the icons
	$window.L.Icon.Default.imagePath = "assets/media/images/";
	
	$scope.map;
	
	$scope.refreshMap = refreshMap;
	$scope.clearMap = clearMap;
	
	
	function refreshMap() {
		$scope.map = flightsMap.refreshMap(flightsMap.map, flightsMap.flightsLayer);
	}
	
	function clearMap() {
		$scope.map = flightMap.clearMap(flightsMap.map, flightsMap.flightsLayer);
	}
}