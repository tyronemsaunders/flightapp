angular
	.module('flyingBye')
	.controller('AppController', AppController);

AppController.$inject = ['$scope', '$location', 'appBootstrapFactory', 'userLocation', 'flightsQueryForm', 'airportsList', 'flightsQuery', 'flightsMap'];

function AppController($scope, $location, appBootstrapFactory, userLocation, flightsQueryForm, airportsList, flightsQuery, flightsMap) {
	
	$scope.init = init;
	
	function init() {
		userLocation.getStoredPosition()
			.then(prepLocationBasedFlightQueryForm)
			.then(setGlobalAirports)
			.then(locationBasedFlightQuery)
			.then(bootstrapFlightsMap)
			.catch(errorHandler)
			.finally(finalHandler);
	}
	
	function prepLocationBasedFlightQueryForm(location) {
		appBootstrapFactory.userLocation = location;
		return flightsQueryForm.userLocationForm(location);
	}
	
	function setGlobalAirports() {
		return airportsList.allAirports().then(function(airports) {
			airportsList.setAllAirports(airports);
			return airports;
		});
	}
	
	function locationBasedFlightQuery() {
		return flightsQuery.getFlightsFromSkypicker().then(function(flights) {
			console.log("Bootstrapping flights query returned: " +  flights.length + " flights");
			flightsQuery.setFlights(flights);
			appBootstrapFactory.flights = flights;
			return flights;	
		});
	}
	
	function bootstrapFlightsMap(flights) {
		return flightsMap.init().then(function(map) {
			console.log("Map initiatied");
			appBootstrapFactory.mapReady = true;
		})
	}
	
	function errorHandler(err) {
		console.log(JSON.stringify(err, null, 4));
	}
	
	function finalHandler() {
		console.log("Finished bootstrapping");
	}
	
	$scope.init();
	
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if (angular.isDefined(toState.data.pageTitle)) {
			$scope.pageTitle = toState.data.pageTitle + ' | Flying Bye' ;
		}
	});
}