angular
	.module('flyingBye.flights')
	.controller('FlexibleFlightsGridController', FlexibleFlightsGridController);

FlexibleFlightsGridController.$inject = ['$scope', '$window', '$timeout', 'flexibleFlightResults', 'flightsQueryForm', 'displayedFlightResults', 'spinnerService'];

function FlexibleFlightsGridController($scope, $window, $timeout, flexibleFlightResults, flightsQueryForm, displayedFlightResults, spinnerService) {
	
	$scope.rendered;
	
	$scope.selectedDate = {};
	$scope.hoveredDate = {};
	$scope.journeys = [];
	$scope.returnDates = [];
	
	$scope.selectDate = selectDate;
	$scope.mouseoverDate = mouseoverDate;
	$scope.mouseleaveDate = mouseleaveDate;
	$scope.highlightReturnLeg = highlightReturnLeg;
	$scope.highlightOutboundLeg = highlightOutboundLeg;
	$scope.isSelected = isSelected;
	$scope.isReturnDate = isReturnDate;
	$scope.isOutboundDate = isOutboundDate;
	$scope.noFlights = noFlights;
	
	function init() {
		$scope.selectedDate.outboundDiff = displayedFlightResults.selected.outboundDiff;
		$scope.selectedDate.returnDiff = displayedFlightResults.selected.returnDiff;
		buildGrid();
		setReturnDates();
	}
	
	function selectDate(outboundDiff, returnDiff, price) {
		if (price) {

			$scope.selectedDate.outboundDiff = outboundDiff;
			$scope.selectedDate.returnDiff = returnDiff;
			
			if (flexibleFlightResults.flights['outbound' + outboundDiff + 'return' + returnDiff]) {
				var displayedFlights = flexibleFlightResults.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
				
				displayedFlightResults.setSelected(outboundDiff, returnDiff);
				displayedFlightResults.refreshDisplay(displayedFlights);
			}
		}
	}
	
	function noFlights(price) {
		if (price) {
			return false;
		} else {
			return true;
		}
	}
	
	function mouseoverDate(outboundDiff, returnDiff, price) {
		$scope.hoveredDate.outboundDiff = outboundDiff;
		$scope.hoveredDate.returnDiff = returnDiff;
		
		if (price) {
			if (outboundDiff == $scope.hoveredDate.outboundDiff && returnDiff == $scope.hoveredDate.returnDiff) {
				return true;
			} else {
				return false;
			}	
		} else {
			return false;
		}	
	}
	
	function mouseleaveDate() {
		$scope.hoveredDate.outboundDiff = null;
		$scope.hoveredDate.returnDiff = null;
	}
	
	function highlightReturnLeg(date) {
		if (date.difference == $scope.hoveredDate.returnDiff) {
			return true;
		} else{
			return false;
		}	
	}
	
	function highlightOutboundLeg(date) {
		if (date.difference == $scope.hoveredDate.outboundDiff) {
			return true;
		} else{
			return false;
		}	
	}
	
	function isSelected(outboundFlight, returnFlight) {
		if ((outboundFlight.difference == $scope.selectedDate.outboundDiff) && (returnFlight.difference == $scope.selectedDate.returnDiff)) {
			return true;
		} else {
			return false;
		}	
	}
	
	function isReturnDate(date) {
		if (date.difference == $scope.selectedDate.returnDiff) {
			return true;
		} else {
			return false;
		}	
	}
	
	function isOutboundDate(date) {
		if (date.difference == $scope.selectedDate.outboundDiff) {
			return true;
		} else {
			return false;
		}	
	}
	
	function setReturnDates() {
		// reset return dates on new query
		$scope.returnDates = [];
		
		for (var i = 0; i < flexibleFlightResults.returnDateDifferences.length; i++) {
			
			var flightReturn = angular.copy(flightsQueryForm['dates']['return']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
			var diff;
			var obj = {};
			
			diff = flexibleFlightResults.returnDateDifferences[i];
			
			obj.difference = diff;
			obj.date = flightReturn.add(parseInt(diff), 'd');
			
			$scope.returnDates.push(obj);
		}
		
		// sort the $scope.returnDates object
		$scope.returnDates = $scope.returnDates.sort(function(a, b) {
			return a.date.unix() - b.date.unix()
		});

	}
	
	function buildGrid() {
		// reset on new query
		$scope.journeys = [];
		
		/**
		 * build an array of json objects as follows:
		 * var obj = [{
		 * 	"outbound": {"date": date, "difference": int},
		 *  "flights" : [{
		 *   "return": {"date": date, "difference": int}
		 *   "price": price
		 *  }]
		 * }]
		 */
		// loop through outbound dates
		for (var i = 0; i < flexibleFlightResults.outboundDateDifferences.length; i++) {
			var obj = {};
			obj.outbound = {};
			obj.flights = [];
			
			var flightOutbound = angular.copy(flightsQueryForm['dates']['outbound']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
			var diff;
			
			diff = flexibleFlightResults.outboundDateDifferences[i];
			
			obj.outbound.difference = diff;
			obj.outbound.date = flightOutbound.add(parseInt(diff), 'd');
			
			//loop through return dates
			for (var j = 0; j < flexibleFlightResults.returnDateDifferences.length; j++) {
				var flightsObj = {};
				flightsObj['return'] = {};
				flightsObj['price'];
				
				if (flexibleFlightResults.flights['outbound' + flexibleFlightResults.outboundDateDifferences[i] + 'return' + flexibleFlightResults.returnDateDifferences[j]]) {
					
					var currentFlights = flexibleFlightResults.flights['outbound' + flexibleFlightResults.outboundDateDifferences[i] + 'return' + flexibleFlightResults.returnDateDifferences[j]];
					
					flightsObj['return']['difference'] = currentFlights.dates['return']['difference'];
					flightsObj['return']['date'] = currentFlights.dates['return']['date'];
					flightsObj['price'] = flightPriceRange(currentFlights.data);
					
					obj.flights.push(flightsObj);
				} else {
					
					// undefined values allow printing blank box
					flightsObj['return']['difference'] = flexibleFlightResults.returnDateDifferences[j];
					flightsObj['return']['date'] = null;
					flightsObj['price'] = null;

					obj.flights.push(flightsObj);
				}
			}
	
			$scope.journeys.push(obj);
		}
	}
	
	function flightPriceRange(flights) {
		var range = {};
		range['min'] = flights[0].price;
		range['max']= flights[0].price;
		
		for (var i = 0; i < flights.length; i++) {
			if (flights[i].price < range['min']) {
				range['min'] = flights[i].price; 
			}
			
			if (flights[i].price > range['max']) {
				range['max'] = flights[i].price; 
			}
		}
		
		return range;
	}
	
	function initializeLoadingSpinner() {
		$timeout(function() {
			spinnerService.show('flexibleGridSpinner');	
		});
	}
	
	///// Broadcast listener functions
	function setActiveFlights(evt, val) {
		init();
		spinnerService.hide('flexibleGridSpinner');
	}
	
	initializeLoadingSpinner();
	$scope.$on('setActiveFlights', setActiveFlights);
}