angular
	.module('flyingBye.flights')
	.controller('FlightResultsController', FlightResultsController);

FlightResultsController.$inject = ['$scope', '$window', 'flightsQueryForm', 'flightsQuery', 'airportsList'];

function FlightResultsController($scope, $window, flightsQueryForm, flightsQuery, airportsList) {
	$scope.init = init;
	
	$scope.budget;
	$scope.adults;
	$scope.children;
	$scope.infants;
	$scope.origin = {};
	$scope.destination = {};
	$scope['origin']['selected'];
	$scope['destination']['selected'];
	$scope.dates = {};
	$scope['dates']['outbound'] = {};
	$scope['dates']['return'] = {};
	$scope['dates']['outbound']['selected'];
	$scope['dates']['return']['selected'];
	$scope['dates']['outbound']['date'];
	$scope['dates']['return']['date'];
	$scope.hideReturnCalendar;
	$scope.airports;
	$scope.flights;
	
	$scope.refreshAirports = refreshAirports;
	$scope.getFlights = getFlights;
	$scope.setOrigin = setOrigin;
	$scope.setDestination = setDestination;
	
	$scope.showDatepicker = showDatepicker;
	$scope.hideDatepicker = hideDatepicker;
	$scope.setPassengers = setPassengers;
	$scope.setBudget = setBudget;
	$scope.formReady = formReady;
	
	$scope.errors = {};
	$scope['errors']['dates'] = {};
	$scope['errors']['dates']['outbound'];
	$scope['errors']['dates']['return'];
	$scope['errors']['passengers'];
	
	function init() {

		$scope.budget = flightsQueryForm.budget.amount || 10000;
		$scope.adults = flightsQueryForm.passengers.adults || 1;
		$scope.children = flightsQueryForm.passengers.children || 0;
		$scope.infants = flightsQueryForm.passengers.infants || 0;
		$scope.origin = {selected: flightsQueryForm.origin.airports[0]};
		$scope.destination = {selected: flightsQueryForm.destination.airports[0]};
		$scope['dates']['outbound']['selected'] = flightsQueryForm['dates']['outbound']['selected'];
		$scope['dates']['return']['selected'] = flightsQueryForm['dates']['return']['selected'];
		$scope['dates']['outbound']['date'] = flightsQueryForm['dates']['outbound']['date'];
		$scope['dates']['return']['date'] = flightsQueryForm['dates']['return']['date'];
		$scope.hideReturnCalendar = false;
		$scope.airports = [];
		$scope.flights = flightsQuery.flights;
	}
	
	function refreshAirports(search) {
		var refreshPromise = airportsList.filterAirports(search);
		refreshPromise.then(function(airports) {
			$scope.airports = airports;
		});
	}
		
	function getFlights() {
		// show offcanvasResultsSpinner
		spinnerService.show('offcanvasResultsSpinner');
		
		//run the flights query
		var flightsPromise = flightsQuery.getFlightsFromSkypicker();
		flightsPromise
			.then(function(flights) {
				flightsQuery.setFlights(flights)})
			.catch(function(error) {
				console.log(error);
			})
			.finally(function() {
				spinnerService.hide('offcanvasResultsSpinner');
			});
	}
	
	function setOrigin(airport) {
		flightsQueryForm.clearAirports('origin');
		flightsQueryForm.setAirport(airport.IATA, 'origin');
	}
	
	function setDestination(airport) {
		flightsQueryForm.clearAirports('destination');
		flightsQueryForm.setAirport(airport.IATA, 'destination');
	}
		
	function setBudget(budget) {
		flightsQueryForm.setBudget(budget);
	}
	
	function setPassengers(adults, children, infants) {
		flightsQueryForm.setPassengers(adults, children, infants);
		$scope['errors']['passengers'] = flightQueryForm['errors']['passengers'];
	}
	
	function showDatepicker(element_id) {
		angular.element(document.querySelector('#' + element_id)).addClass('show-datepicker');
	}
	
	function hideDatepicker(element_id) {
		angular.element(document.querySelector('#' + element_id)).removeClass('show-datepicker');
	}
	
	function formReady() {
		return flightsQueryForm.formReady();
	}
	
	$scope.init();
	
	$scope.$watch('dates.outbound.date', function(newValue, oldValue) {
		flightsQueryForm.setFlightDate(newValue, 'outbound');
		flightsQueryForm.setDateRange(newValue.subtract(3, 'd'), newValue.add(3, 'd'), 'outbound');
		$scope['errors']['dates']['outbound'] = flightsQueryForm['errors']['dates']['outbound'];
	});
	
	$scope.$watch('dates.return.date', function(newValue, oldValue) {
		flightsQueryForm.setFlightDate(newValue, 'return');
		flightsQueryForm.setDateRange(newValue.subtract(3, 'd'), newValue.add(3, 'd'), 'return');
		$scope['errors']['dates']['return'] = flightsQueryForm['errors']['dates']['return'];
	});
	
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