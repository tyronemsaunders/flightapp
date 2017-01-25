angular
	.module('flightApp.flights')
	.controller('FlightFilterController', FlightFilterController);

FlightFilterController.$inject = ['$scope', '$window', '$filter', '$timeout', 'flightsQueryForm', 'displayedFlightResults', 'spinnerService'];

function FlightFilterController($scope, $window, $filter, $timeout, flightsQueryForm, displayedFlightResults, spinnerService) {
	
	$scope.rendered;
	
	$scope.price = {
		min: 0,
		max: flightsQueryForm.budget.amount || 10000,
		options: {
			floor: 0,
			ceil: flightsQueryForm.budget.amount || 10000,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: function () {
				$scope.filterByPrice();
			}
		}	
	}
	
	$scope.arrival = {
		min: 0,
		max: 1439, // minutes in a day
		options: {
			floor: 0,
			ceil: 1439,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: function() {
				$scope.filterByArrivalTime();
			}
		}	
	}
	
	$scope.departure = {
		min: 0,
		max: 1439, //minutes in a day
		options: {
			floor: 0,
			ceil: 1439,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: function() {
				$scope.filterByDepartureTime();
			}
		}	
	}
	
	$scope.layoverDuration = {
		value: 0,
		options: {
			floor: 0,
			ceil: 0,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: function() {
				$scope.filterByLayoverDuration();
			}
		}	
	}
	
	$scope.flightDuration = {
		min: 0,
		max: 0,
		options: {
			floor: 0,
			ceil: 0,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: function() {
				$scope.filterByFlightDuration();
			}
		}	
	}
	
	$scope.layoverList = [];
	$scope.layovers;
	
	$scope.filterByPrice = filterByPrice;
	$scope.filterByArrivalTime = filterByArrivalTime;
	$scope.filterByDepartureTime = filterByDepartureTime;
	$scope.filterByFlightDuration = filterByFlightDuration;
	$scope.filterByLayoverDuration = filterByLayoverDuration;
	$scope.filterByLayoverCount = filterByLayoverCount;
	$scope.formatTimeOfDay = formatTimeOfDay;
	$scope.formatMinutesElapsed = formatMinutesElapsed;
	
	function init() {
		$scope.price.min = displayedFlightResults.priceRange().min;
		$scope.price.max = displayedFlightResults.priceRange().max;
		$scope.price.options.floor = displayedFlightResults.priceRange().min;
		$scope.price.options.ceil = displayedFlightResults.priceRange().max;
		
		$scope.layoverDuration.value = displayedFlightResults.layoverDuration().max;
		$scope.layoverDuration.options.floor = displayedFlightResults.layoverDuration().min;
		$scope.layoverDuration.options.ceil = displayedFlightResults.layoverDuration().max;
		
		$scope.flightDuration.min = displayedFlightResults.flightDuration().min;
		$scope.flightDuration.max = displayedFlightResults.flightDuration().max;
		$scope.flightDuration.options.floor = displayedFlightResults.flightDuration().min;
		$scope.flightDuration.options.ceil = displayedFlightResults.flightDuration().max;
		
		$scope.layoverList = [];
		for (var i = displayedFlightResults.layoverCount().min; i <= displayedFlightResults.layoverCount().max; i++) {
			$scope.layoverList.push(i);
		}
	}
	
	function filterByPrice() {
		var array = displayedFlightResults.active;
		console.log($scope.price.min);
		console.log($scope.price.max);

		var result = $filter('filter')(array, function(value, index, arr) {
			if (value.price >= $scope.price.min && value.price <= $scope.price.max) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function filterByArrivalTime() {
		var array = displayedFlightResults.active;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			var arrival_local = $window.moment.unix(value.outbound_flight_time.arrival_local);
			var arrivalMin = angular.copy(arrival_local).hours(0).minutes($scope.arrival.min).seconds(0).milliseconds(0);
			var arrivalMax = angular.copy(arrival_local).hours(0).minutes($scope.arrival.max).seconds(0).milliseconds(0);
			
			if (arrival_local.isAfter(arrivalMin) && arrival_local.isBefore(arrivalMax)) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function filterByDepartureTime() {
		var array = displayedFlightResults.active;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			var departure_local = $window.moment.unix(value.outbound_flight_time.departure_local);
			var departureMin = angular.copy(departure_local).hours(0).minutes($scope.departure.min).seconds(0).milliseconds(0);
			var departureMax = angular.copy(departure_local).hours(0).minutes($scope.departure.max).seconds(0).milliseconds(0);
			
			if (departure_local.isAfter(departureMin) && departure_local.isBefore(departureMax)) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function filterByFlightDuration() {
		var array = displayedFlightResults.active;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			if (value['duration_minutes']['outbound'] >= $scope.flightDuration.min && 
					value['duration_minutes']['return'] >= $scope.flightDuration.min && 
					value['duration_minutes']['outbound'] <= $scope.flightDuration.max &&
					value['duration_minutes']['return'] <= $scope.flightDuration.max) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function filterByLayoverDuration() {
		var array = displayedFlightResults.active;
		var outboundFilter;
		var returnFilter;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			if ($scope.layoverDuration.value == 0 && (value.route['return'].length == 1 && value.route['outbound'].length == 1)) {
				return true;
			}
			
			for (var i = 0; i < value.route['outbound'].length - 1; i++) {
				var outboundLayover = value.route['outbound'][i + 1].departure_time_local - value.route['outbound'][i].arrival_time_local;
				if ($scope.layoverDuration.value >= Math.floor(outboundLayover / 60)) {
					outboundFilter = true;
				} else {
					outboundFilter = false;
				}
			}
			
			for (var i = 0; i < value.route['return'].length - 1; i++) {
				var returnLayover = value.route['return'][i + 1].departure_time_local - value.route['return'][i].arrival_time_local;				
				if ($scope.layoverDuration.value >= Math.floor(returnLayover / 60)) {
					returnFilter = true;
				} else {
					returnFilter = false;
				}
			}
			
			if (outboundFilter && returnFilter) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function filterByLayoverCount(stops) {
		var array = displayedFlightResults.active;
		var result = $filter('filter')(array, function(value, index, arr) {
			if ((stops == (value['route']['outbound'].length - 1)) && (stops == (value['route']['return'].length - 1))) {
				return true;
			} else {
				return false;
			}
		});
		
		displayedFlightResults.refreshDisplay(result);
	}
	
	function formatTimeOfDay(minutes) {
		return $window.moment().hours(0).minutes(minutes).seconds(0).milliseconds(0).format('LT');
	}
	
	function formatMinutesElapsed(minutes) {
		return $window.moment.duration(minutes, "minutes").format("h [Hrs.] mm [Min.]");
	}
	
	function initializeLoadingSpinner() {
		$timeout(function() {
			spinnerService.show('flightFilterSpinner');	
		});
		
	}
	
	///// Broadcast listener functions
	function setActiveFlights(evt, val) {
		init();	
		spinnerService.hide('flightFilterSpinner');
	}
	
	initializeLoadingSpinner();
	$scope.$on('setActiveFlights', setActiveFlights);
}