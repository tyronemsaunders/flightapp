angular
	.module('flyingBye')
	.controller('HomeHeroSidebarController', HomeHeroSidebarController);

HomeHeroSidebarController.$inject = ['$scope', '$window', '$timeout', 'flightsQueryForm', 'flightsQuery', 'flightsMap', 'airportsList'];

function HomeHeroSidebarController($scope, $window, $timeout, flightsQueryForm, flightsQuery, flightsMap, airportsList) {
	$scope.init = init;
	
	$scope.budget;
	$scope.dates = {};
	$scope['dates']['outbound'] = {};
	$scope['dates']['return'] = {};
	$scope['dates']['outbound']['selected'];
	$scope['dates']['return']['selected'];
	$scope['dates']['outbound']['date'];
	$scope['dates']['return']['date'];
	$scope.adults;
	$scope.children;
	$scope.infants;
	$scope.airports = [];
	$scope.origin = {selected: $scope.airports[0]};
	$scope.hideReturnCalendar;
	
	$scope.setFlightType = setFlightType;
	$scope.setBudget = setBudget;
	$scope.setOrigin = setOrigin;
	$scope.setPassengers = setPassengers;
	$scope.refreshAirports = refreshAirports;
	$scope.getFlights = getFlights;
	$scope.formReady = formReady;
	
	$scope.errors = {};
	$scope['errors']['dates'] = {};
	$scope['errors']['dates']['outbound'];
	$scope['errors']['dates']['return'];
	$scope['errors']['passengers'];
	
	function init() {
		$scope.setFlightType('round');
		$scope['dates']['outbound']['selected'] = flightsQueryForm['dates']['outbound']['selected'];
		$scope['dates']['return']['selected'] = flightsQueryForm['dates']['return']['selected'];
		$scope['dates']['outbound']['date'] = flightsQueryForm['dates']['outbound']['date'];
		$scope['dates']['return']['date'] = flightsQueryForm['dates']['return']['date'];
		$scope.hideReturnCalendar = true;
		$scope.adults = 1;
		$scope.children = 0;
		$scope.infants = 0;
		$scope.airports = [];
		
		$scope['errors']['dates']['outbound'] = false;
		$scope['errors']['dates']['return'] = false;
		$scope['errors']['passengers'] = false;
	}
	
	function setFlightType(type) {
		flightsQueryForm.setFlightType(type);
	}
	
	function setBudget(budget) {
		flightsQueryForm.setBudget(budget);
	}
	
	function setOrigin(airport) {
		flightsQueryForm.clearAirports('origin');
		flightsQueryForm.setAirport(airport.IATA, 'origin');
	}
	
	function setPassengers(adults, children, infants) {
		flightsQueryForm.setPassengers(adults, children, infants);
		$scope['errors']['passengers'] = flightQueryForm['errors']['passengers'];
	}
	
	function refreshAirports(search) {
		var refreshPromise = airportsList.filterAirports(search);
		refreshPromise.then(function(airports) {
			$scope.airports = airports;
		});
	}
	
	function getFlights() {
		//peelMap();
		flightsQuery.getFlightsFromSkypicker().then(function(flights) {
			flightsQuery.setFlights(flights);
			flightsMap.refreshMap(flightsMap.map, flightsMap.flightsLayer);
		});
	}
	
	function formReady() {
		return flightsQueryForm.formReady();
	}
	
	function peelMap() {
		$timeout(function() {
			angular.element('#map-preview').triggerHandler('click');
		});
	}
	
	$scope.init();
	
	// watch for changes to the flightsQueryForm
	$scope.$watch(
		function() {return flightsQueryForm;},
		function(newFlightsQueryForm, oldFlightsQueryForm) {
			
			$scope['dates']['outbound']['selected'] = newFlightsQueryForm['dates']['outbound']['selected'];
			$scope['dates']['outbound']['date'] = newFlightsQueryForm['dates']['outbound']['date'];
			
			$scope['dates']['return']['selected'] = newFlightsQueryForm['dates']['return']['selected'];
			$scope['dates']['return']['date'] = newFlightsQueryForm['dates']['return']['date'];
			
			$scope['errors']['dates']['outbound'] = newFlightsQueryForm['errors']['dates']['outbound'];
			$scope['errors']['dates']['return'] = newFlightsQueryForm['errors']['dates']['return'];
			$scope['errors']['passengers'] = newFlightsQueryForm['errors']['passengers'];
			
			// check the flight type to control the display of the return trip calendar
			if (newFlightsQueryForm.flightType == 'round' && newFlightsQueryForm.dates.outbound.selected) {
				$scope.hideReturnCalendar = false;
			} else {
				$scope.hideReturnCalendar = true;
			}
			
			$scope.formReady();
		}, true);
}