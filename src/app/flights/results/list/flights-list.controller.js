angular
	.module('flightApp.flights')
	.controller('FlightsListController', FlightsListController);

FlightsListController.$inject = ['$scope', '$window', '$timeout', 'flexibleFlightResults', 'displayedFlightResults', 'spinnerService'];

function FlightsListController($scope, $window, $timeout, flexibleFlightResults, displayedFlightResults, spinnerService) {
	
	
	$scope.flights = [];
	$scope.showFlightDetails = false;
	$scope.flightDetailsVisibility = $scope.showFlightDetails ? 'Hide flight details' : 'View flight details';
	
	$scope.formatDate = formatDate;
	$scope.formatTimeOfDay = formatTimeOfDay;
	$scope.formatMinutesElapsed = formatMinutesElapsed;
	$scope.formatSecondsElapsed = formatSecondsElapsed;
	
	function refreshFlightsList() {
		// reset the flights list
		$scope.flights = [];
		flightsList();
	}
	
	function flightsList() {
		for (var i = 0; i < displayedFlightResults.display.length; i++) {
			var flight = displayedFlightResults.display[i];
			var formattedFlight = displayedFlightResults.formatFlight(flight);
			$scope.flights.push(formattedFlight);
		}
	}
	
	function formatDate(timestamp) {
		return $window.moment.unix(timestamp).format("ddd, MMM D, YYYY");
	}
	
	function formatTimeOfDay(timestamp) {
		return $window.moment.unix(timestamp).format('LT');
	}
	
	function formatMinutesElapsed(minutes) {
		return $window.moment.duration(minutes, "minutes").format("h [Hrs.] mm [Min.]");
	}
	
	function formatSecondsElapsed(seconds) {
		return $window.moment.duration(seconds, "seconds").format("h [Hrs.] mm [Min.]");
	}
	
	function initializeLoadingSpinner() {
		$timeout(function() {
			spinnerService.show('flightsListSpinner');	
		});
		
	}
	
	///// broadcast functions
	function displayedFlightsRefreshed(evt, val) {
		refreshFlightsList();
		spinnerService.hide('flightsListSpinner');
	}
	
	initializeLoadingSpinner();
	$scope.$on('displayedFlightsRefreshed', displayedFlightsRefreshed);
	/*
	var flight = {
			directions: [{
				type: "",
				duration_total: "",
				layovers: "",
				origin: {
					timestamp: "",
					date: "",
					time: "",
					airport: {
						IATA: "",
						name: ""
					},
					city: ""
				},
				destination: {
					timestamp: "",
					date: "",
					time: "",
					airport: {
						IATA: "",
						name: ""
					},
					city: ""
				},
				segments: [{
					type: "flight",
					airline: {
						logo: "",
						name: "",
						code: ""
					},
					flight_no: "",
					departure_time: "",
					arrival_time: "",
					duration: "",
					origin: {
						airport: {
							IATA: "",
							name: ""
						},
						city: ""
					},
					destination: {
						airport: {
							IATA: "",
							name: ""
						},
						city: ""
					}
				},
				{
					type: "layover",
					departure_time: "",
					arrival_time: "",
					duration: "",
					airport: {
						IATA: "",
						name: ""
					},
					city: ""
					
				}]
			}],
			price: "",
			type: "",
			link: ""
	}
	*/
}