angular
	.module('flightApp')
	.controller('HomeHeroSidebarController', HomeHeroSidebarController);

HomeHeroSidebarController.$inject = ['$scope', '$window', '$state', '$timeout', 'flightsQueryForm', 'flightsQuery', 'flexibleFlightResults' ,'flightsMap', 'airportsList'];

function HomeHeroSidebarController($scope, $window, $state, $timeout, flightsQueryForm, flightsQuery, flexibleFlightResults, flightsMap, airportsList) {
	
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
	$scope.formReady = false;
	
	$scope.setBudget = setBudget;
	$scope.setOrigin = setOrigin;
	$scope.setPassengers = setPassengers;
	$scope.refreshAirports = refreshAirports;
	$scope.getFlights = getFlights;
	
	$scope.errors = {};
	$scope['errors']['dates'] = {};
	$scope['errors']['dates']['outbound'];
	$scope['errors']['dates']['return'];
	$scope['errors']['passengers'];
	
	function init() {
		
		setFlightType('round');
		
		$scope['dates']['outbound']['selected'] = flightsQueryForm['dates']['outbound']['selected'];
		$scope['dates']['return']['selected'] = flightsQueryForm['dates']['return']['selected'];
		$scope['dates']['outbound']['date'] = flightsQueryForm['dates']['outbound']['date'];
		$scope['dates']['return']['date'] = flightsQueryForm['dates']['return']['date'];
		$scope.hideReturnCalendar = true;
		$scope.formReady = false;
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
		formReady();
	}
	
	function setBudget(budget) {
		flightsQueryForm.setBudget(budget);
		formReady();
	}
	
	function setOrigin(airport) {
		flightsQueryForm.clearAirports('origin');
		flightsQueryForm.setAirport(airport.IATA, 'origin');
		formReady();
	}
	
	function setPassengers(adults, children, infants) {
		flightsQueryForm.setPassengers(adults, children, infants);
		$scope['errors']['passengers'] = flightQueryForm['errors']['passengers'];
		formReady();
	}
	
	function refreshAirports(search) {
		var refreshPromise = airportsList.filterAirports(search);
		refreshPromise.then(function(airports) {
			$scope.airports = airports;
		});
	}
	
	function getFlights() {
		
		// transition to flights page
		// send to full screen map if on small screen 
		var smallScreen = $window.matchMedia("(max-width: 39.9375em)");
		if (smallScreen.matches) {
			$state.go('app.flights.map');
		} else {
			// TODO handle route params for airport and radius city pairs and explicit dates vs stays
			var routeParams = {};
			routeParams['city_pair'] = flightsQueryForm['origin']['airports'][0];
			routeParams['outbound'] = flightsQueryForm['dates']['outbound']['date'].format("YYYY-MM-DD");
			routeParams['return'] = flightsQueryForm['dates']['return']['date'].format("YYYY-MM-DD");

			$state.go('app.flights.search', routeParams);
		}
		
		flightsQuery.getFlights().then(function(flights) {
			flightsQuery.setFlights(flights);
			flexibleFlightResults.refresh();	
			
		});
	}
	
	function formReady() {
		$scope.formReady = flightsQueryForm.formReady();
	}
	
	function returnDateStatus() {
		if ($scope.dates.outbound.selected) {
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
	
	init();
	
	// watch for changes to the flightsQueryForm
	$scope.$on('flightDateSet', flightDateSet);
	$scope.$on('passengersSet', passengersSet);
}