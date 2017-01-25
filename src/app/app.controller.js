angular
	.module('flyingBye')
	.controller('AppController', AppController);

AppController.$inject = ['$scope', '$state', 'appBootstrapFactory', 'userLocation', 'flightsQueryForm', 'airportsList', 'flightsQuery', 'flightsMap', 'spinnerService'];

function AppController($scope, $state, appBootstrapFactory, userLocation, flightsQueryForm, airportsList, flightsQuery, flightsMap, spinnerService) {
	
	function init() {
		if (!appBootstrapFactory.bootstrapped) {
			$state.go('app.home.map');
			userLocation.getStoredPosition()
				.then(prepLocationBasedFlightQueryForm)
				.then(setGlobalAirports)
				.then(locationBasedFlightQuery)
				.then(bootstrapFlightsMap)
				//.catch(errorHandler)
				.finally(finalHandler);	
		}
	}
	
	function prepLocationBasedFlightQueryForm(location) {
		appBootstrapFactory.setUserLocation(location);
		return flightsQueryForm.userLocationForm(location);
	}
	
	function setGlobalAirports() {
		return airportsList.allAirports().then(function(airports) {
			airportsList.setAllAirports(airports);
			return airports;
		});
	}
	
	function locationBasedFlightQuery() {
		return flightsQuery.getFlights().then(function(flights) {
			console.log("Bootstrapping flights query returned: " +  flights.length + " flights");
			flightsQuery.setFlights(flights);
			appBootstrapFactory.broadcastFlightBootstrapping(true);
			return flights;	
		});
	}
	
	function bootstrapFlightsMap() {
		return flightsMap.init().then(function(map) {
			console.log("Map initiatied");
			appBootstrapFactory.setMapStatus(true);
		})
		.catch(function(e) {
			console.log("Error bootstrapping flights map");
			console.log(e);
		})
		.finally(function() {
			spinnerService.hide('mapSpinner');
		});
	}
	
	function errorHandler(err) {
		console.log("errors in AppController");
		console.log(JSON.stringify(err, null, 4));
	}
	
	function finalHandler() {
		appBootstrapFactory.bootstrapped = true
		console.log("Finished bootstrapping");
	}
	
	init();
	
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if (angular.isDefined(toState.data.pageTitle)) {
			$scope.pageTitle = toState.data.pageTitle + ' | Flying Bye' ;
		}
	});
}