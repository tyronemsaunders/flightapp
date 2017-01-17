angular
	.module('flyingBye.flights')
	.controller('FlightFilterController', FlightFilterController);

FlightFilterController.$inject = ['$scope', '$window', '$filter', 'flexibleFlightResults', 'flightsQueryForm'];

function FlightFilterController($scope, $window, $filter, flexibleFlightResults, flightsQueryForm) {
	$scope.init = init;
	
	$scope.price = {
		min: flexibleFlightResults.priceRange().min || 0,
		max: flexibleFlightResults.priceRange().max || flightsQueryForm.budget.amount,
		options: {
			floor: flexibleFlightResults.priceRange().min || 0,
			ceil: flexibleFlightResults.priceRange().max || flightsQueryForm.budget.amount,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: $scope.filterByPrice
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
			onEnd: $scope.filterByArrivalTime
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
			onEnd: $scope.filterByDepartureTime
		}	
	}
	
	$scope.layoverDuration = {
		value: flexibleFlightResults.layoverDuration().max,
		options: {
			floor: flexibleFlightResults.layoverDuration().min,
			ceil: flexibleFlightResults.layoverDuration().max,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: $scope.filterByLayoverDuration
		}	
	}
	
	$scope.flightDuration = {
		min: flexibleFlightResults.flightDuration().min,
		max: flexibleFlightResults.flightDuration().max,
		options: {
			floor: flexibleFlightResults.flightDuration().min,
			ceil: flexibleFlightResults.flightDuration().max,
			hideLimitLabels: true,
			hidePointerLabels: true,
			onEnd: $scope.filterByFlightDuration
		}	
	}
	
	$scope.layoverCount = [];
	$scope.layovers = 0;
	
	$scope.filterByPrice = filterByPrice;
	$scope.filterByArrivalTime = filterByArrivalTime;
	$scope.filterByDepartureTime = filterByDepartureTime;
	$scope.filterByFlightDuration = filterByFlightDuration;
	$scope.filterByLayoverDuration = filterByLayoverDuration;
	$scope.filterByLayoverCount = filterByLayoverCount;
	$scope.formatTimeOfDay = formatTimeOfDay;
	$scope.formatMinutesElapsed = formatMinutesElapsed;
	
	function init() {
		for (var i = flexibleFlightResults.layoverCount().min; i == flexibleFlightResults.layoverCount().min; i++) {
			$scope.layoverCount.push(i);
		}
	}
	
	function filterByPrice() {
		var array = flexibleFlightResults.displayed;
		var maxPrice = {
				price : "<" + $scope.price.max
		};
		var minPrice = {
				price : ">" + $scope.price.min
		};
			
		var result = $filter('filter')(array, maxPrice);
		result = $filter('filter')(result, minPrice);
		
		flexibleFlightResults.refreshDisplayed(result);
	}
	
	function filterByArrivalTime() {
		var array = flexibleFlightResults.displayed;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			var arrival = $window.moment.unix(value.outbound_flight_time.arrival_local);
			var arrivalMin = arrival.hours(0).minutes($scope.arrival.min).seconds(0).milliseconds(0);
			var arrivalMax = arrival.hours(0).minutes($scope.arrival.max).seconds(0).milliseconds(0);
			
			if (arrival.isBefore(arrivalMax) && arrival.isAfter(arrivalMin)) {
				return true;
			} else {
				return false;
			}
		});
		
		flexibleFlightResults.refreshDisplayed(result);
	}
	
	function filterByDepartureTime() {
		var array = flexibleFlightResults.displayed;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			var departure = $window.moment.unix(value.outbound_flight_time.departure_local);
			var departureMin = departure.hours(0).minutes($scope.departure.min).seconds(0).milliseconds(0);
			var departureMax = departure.hours(0).minutes($scope.departure.max).seconds(0).milliseconds(0);
			
			if (departure.isBefore(departureMax) && departure.isAfter(departureMin)) {
				return true;
			} else {
				return false;
			}
		});
		
		flexibleFlightResults.refreshDisplayed(result);
	}
	
	function filterByFlightDuration() {
		var array = flexibleFlightResults.displayed;
		var minOutbound = {
			duration_minutes: {
				outbound: ">" + $scope.flightDuration.min
			}	
		}
		
		var maxOutbound = {
			duration_minutes: {
				outbound: "<" + $scope.flightDuration.max
			}	
		}
		
		var minReturn = {
			duration_minutes: {
				"return": ">" + $scope.flightDuration.min
			}	
		}
		
		var maxReturn = {
			duration_minutes: {
				"return": "<" + $scope.flightDuration.max
			}	
		}
		
		var result = $filter('filter')(array, minOutbound);
		result = $filter('filter')(result, maxOutbound);
		result = $filter('filter')(result, minReturn);
		result = $filter('filter')(result, maxReturn);
		
		flexibleFlightResults.refreshDisplayed(result);
	}
	
	function filterByLayoverDuration() {
		
	}
	
	function filterByLayoverCount() {
		var array = flexibleFlightResults.displayed;
		
		var result = $filter('filter')(array, function(value, index, arr) {
			if ($scope.layovers == (value['route']['outbound'].length - 1) && $scope.layovers == (value['route']['return'].length - 1)) {
				return true;
			} else {
				return false;
			}
		});
		
		flexibleFlightResults.refreshDisplayed(result);
	}
	
	function formatTimeOfDay(minutes) {
		return $window.moment().hours(0).minutes(minutes).seconds(0).milliseconds(0).format('LT');
	}
	
	function formatMinutesElapsed(minutes) {
		return $window.moment.duration(minutes, "minutes").format("h [Hrs.] mm [Min.]");
	}
	
	$scope.init();
	
}