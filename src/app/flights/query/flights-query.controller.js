angular
	.module('flightApp.flights')
	.controller('FlightQueryController', FlightQueryController);

FlightQueryController.$inject = ['$scope', '$window', '$state', 'flightsQueryForm', 'flightsQuery', 'flexibleFlightResults', 'airportsList', 'spinnerService'];

function FlightQueryController($scope, $window, $state, flightsQueryForm, flightsQuery, flexibleFlightResults, airportsList, spinnerService) {
	
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
	}
	
	function refreshAirports(search) {
		var refreshPromise = airportsList.filterAirports(search);
		refreshPromise.then(function(airports) {
			$scope.airports = airports;
		});
	}
		
	function getFlights() {
		// handle the transition to a new page
		// send to full screen map if on small screen 
		var smallScreen = $window.matchMedia("(max-width: 39.9375em)");
		if (smallScreen.matches) {
			$state.go('app.flights.map');
		} else if ($state.includes('app.home')) {
			$state.go('app.home.map.results', {}, {reload: false});
		} else {
			// TODO handle route params for airport and radius city pairs and explicit dates vs stays
			var routeParams = {};
			routeParams['city_pair'] = flightsQueryForm['origin']['airports'][0];
			routeParams['outbound'] = flightsQueryForm['dates']['outbound']['date'].format("YYYY-MM-DD");
			routeParams['return'] = flightsQueryForm['dates']['return']['date'].format("YYYY-MM-DD");

			if (!$state.includes('app.flights.search')) {
				$state.go('app.flights.search', routeParams, {reload: false});	
			} else {
				spinnerService.show('mapSpinner');
			}
		}
		
		//run the flights query
		var flightsPromise = flightsQuery.getFlights();
		flightsPromise
			.then(function(flights) {
				flightsQuery.setFlights(flights);
				flexibleFlightResults.refresh();
			})
			.catch(function(error) {
				console.log("error in get flights from flights query controller");
				console.log(error);
			})
			.finally(function() {
			});
	}
	
	function setOrigin(airport) {
		flightsQueryForm.clearAirports('origin');
		flightsQueryForm.setAirport(airport.IATA, 'origin');
		formReady();
	}
	
	function setDestination(airport) {
		flightsQueryForm.clearAirports('destination');
		flightsQueryForm.setAirport(airport.IATA, 'destination');
		formReady();
	}
		
	function setBudget(budget) {
		flightsQueryForm.setBudget(budget);
		formReady();
	}
	
	function setPassengers(adults, children, infants) {
		flightsQueryForm.setPassengers(adults, children, infants);
		$scope['errors']['passengers'] = flightQueryForm['errors']['passengers'];
		formReady();
	}
	
	function showDatepicker(element_id) {
		angular.element(document.querySelector('#' + element_id)).addClass('show-datepicker');
	}
	
	function hideDatepicker(element_id) {
		angular.element(document.querySelector('#' + element_id)).removeClass('show-datepicker');
	}
	
	function formReady() {
		$scope.formReady = flightsQueryForm.formReady();
	}
	
	function returnDateStatus() {
		if (flightsQueryForm.flightType == 'round' && flightsQueryForm.dates.outbound.selected) {
			$scope.hideReturnCalendar = false;
		} else {
			$scope.hideReturnCalendar = true;
		}
		formReady();
	}
	
	///// Broadcast listeners
	function flightDateSet(evt, date, leg, errorMsg) {
		if (errorMsg) {
			$scope['errors']['dates'][leg] = errorMsg;
			$scope['dates'][leg]['selected'] = false;
		} else {
			$scope['dates'][leg]['date'] = date;
			$scope['dates'][leg]['selected'] = true;
		}
		
		returnDateStatus();
	}
	
	function passengersSet(evt, errorMsg) {
		if (errorMsg) {
			$scope['errors']['passengers'] = errorMsg;
		} else {
			$scope.adults = flightsQueryForm.passengers.adults;
			$scope.children = flightsQueryForm.passengers.children;
			$scope.infants = flightsQueryForm.passengers.infants;
		}
		formReady();
	}
	
	function flightsSet(evt, val) {
		init();
		formReady();
	}
	
	function flightsQueryFormUpdated(evt, val) {
		init();
		formReady();
	}
	
	init();
	
	// watch for changes to the flightsQueryForm
	$scope.$on('flightDateSet', flightDateSet);
	$scope.$on('passengersSet', passengersSet);
	$scope.$on('flightsSet', flightsSet);
	$scope.$on('flightsQueryFormUpdated', flightsQueryFormUpdated);
	
	$scope.$watch('dates.outbound.date', function(newValue, oldValue) {
		if (newValue) {
			flightsQueryForm.setFlightDate(newValue, 'outbound');
			flightsQueryForm.setDateRange(newValue.subtract(3, 'd'), newValue.add(3, 'd'), 'outbound');
			$scope['errors']['dates']['outbound'] = flightsQueryForm['errors']['dates']['outbound'];	
		}
		
	});
	
	$scope.$watch('dates.return.date', function(newValue, oldValue) {
		if (newValue) {
			flightsQueryForm.setFlightDate(newValue, 'return');
			flightsQueryForm.setDateRange(newValue.subtract(3, 'd'), newValue.add(3, 'd'), 'return');
			$scope['errors']['dates']['return'] = flightsQueryForm['errors']['dates']['return'];	
		}
	});
}