angular
	.module('flyingBye.home')
	.controller('HomeHeroContentController', HomeHeroContentController);

HomeHeroContentController.$inject = ['$scope', 'helpers', 'appBootstrapFactory', 'flightsQuery'];

function HomeHeroContentController($scope, helpers, appBootstrapFactory, flightsQuery) {
	$scope.located = false;
	$scope.showPromos = false;
	$scope.userCity;
	$scope.specials = [];
	
	
	// watch for changes to the appBootstrapFactory
	$scope.$watch(
		function() {return appBootstrapFactory;},
		function(newApp, oldApp) {
			
			if (newApp.userLocation !== oldApp.userLocation) {
				$scope.userCity = newApp.userLocation.city.name;
				$scope.located = true;
			}
			
			if (newApp.flights !== oldApp.flights) {
				var flights = flightsQuery.getCheapestPerCity(newApp.flights);
				var numFlights = flights.length;
				
				// pick random flights to show on page
				for (var i = 0; i < 3; i++) {
					var obj = {};
					var random = helpers.getRandomInt(0, numFlights);
					obj['destination'] = flights[random].destination.city;
					obj['price'] = flights[random].price;
					obj['link'] = flights[random].deep_link;
					$scope.specials.push(obj);
				}
				$scope.showPromos = true;
			}
		}, true);
}