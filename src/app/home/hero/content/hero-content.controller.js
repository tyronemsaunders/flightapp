angular
	.module('flightApp.home')
	.controller('HomeHeroContentController', HomeHeroContentController);

HomeHeroContentController.$inject = ['$scope', '$state', 'helpers', 'offcanvas', 'appBootstrapFactory', 'flightsQuery'];

function HomeHeroContentController($scope, $state, helpers, offcanvas, appBootstrapFactory, flightsQuery) {
	$scope.located = false;
	$scope.showPromos = false;
	$scope.userCity;
	$scope.specials = [];
	$scope.mapReady = false
	$scope.hidePanel = false;
	
	$scope.slidePanel = slidePanel;
	
	function init() {
		if (offcanvas.welcomeHidden) {
			slidePanel();
		}	
	}
	
	function slidePanel() {
		$scope.hidePanel = true;
		offcanvas.welcomeHidden = true;
	}
	
	function userLocationFound(evt, location) {
		$scope.userCity = location.city.name;
		$scope.located = true;
	}
	
	function mapBootstrapped(evt, val) {
		$scope.mapReady = val;
	}
	
	function flightsBootstrapped(evt, val) {
		if (val) {
			var flights = flightsQuery.getCheapestPerCity(flightsQuery.flights);
			var numFlights = flights.length;
			var unique = [];
			
			// pick random flights to show on page, not guaranteed to be unique
			for (var i = 0; i < 3; i++) {
				var obj = {};
				var random = helpers.getRandomInt(0, numFlights);
				
				if (unique.indexOf(random) < 0) {
					unique.push(random);
					obj['destination'] = flights[random].destination.city;
					obj['price'] = flights[random].price;
					obj['link'] = flights[random].deep_link;
					$scope.specials.push(obj);
				} 
			}
			
			$scope.showPromos = true;
		}
	}
	
	init();
	
	// watch for changes to the appBootstrapFactory
	$scope.$on('userLocationFound', userLocationFound);
	$scope.$on('mapBootstrapped', mapBootstrapped);
	$scope.$on('flightsBootstrapped', flightsBootstrapped);
}