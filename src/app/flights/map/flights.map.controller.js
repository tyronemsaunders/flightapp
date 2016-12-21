angular
	.module('flyingBye.flights')
	.controller('FlightsMapController', FlightsMapController);

FlightsMapController.$inject = ['$scope', '$window'];

function FlightsMapController($scope, $window) {
	var map = $window.L.map('flights-map', {
		center:[29.7604, -95.3698],
		zoom: 4,
		scrollWheelZoom: false
	});
	
	var baseTileLayer = $window.L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: ['a','b','c'],
		maxZoom: 18
	});
	
	$scope.init = function() {
		//map.fitWorld();
		baseTileLayer.addTo(map);
	};
	
	$scope.init();
}