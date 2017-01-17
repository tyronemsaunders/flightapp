angular
	.module('flyingBye.flights')
	.controller('FlexibleFlightsGridController', FlexibleFlightsGridController);

FlexibleFlightsGridController.$inject = ['$scope', '$state', '$window', 'flexibleFlightResults'];

function FlexibleFlightsGridController($scope, $state, $window, flexibleFlightResults) {
	
	$scope.init = init;
	$scope.selectedDate = {};
	$scope.hoveredDate = {}
	$scope.journeys = [];
	$scope.returnDates = [];
	$scope.flexible;
	$scope.flights;
	
	$scope.selectDate = selectDate;
	$scope.mouseoverDate = mouseoverDate;
	$scope.mouseleaveDate = mouseleaveDate;
	$scope.highlightReturnLeg = highlightReturnLeg;
	$scope.highlightOutboundLeg = highlightOutboundLeg;
	$scope.isSelected = isSelected;
	$scope.isReturnDate = isReturnDate;
	$scope.isOutboundDate = isOutboundDate;
	
	function init() {
		$scope.flexible = ['-3', '-2', '-1', '0', '+1', '+2', '+3'];
		$scope.flights = flexibleFlightResults.flights;	
		$scope.selectedDate.outboundDiff = flexibleFlightResults.selected.outboundDiff;
		$scope.selectedDate.returnDiff = flexibleFlightResults.selected.returnDiff;
		buildGrid();
		setReturnDates();
	}
	
	function selectDate(outboundDiff, returnDiff) {
		$scope.selectedDate.outboundDiff = outboundDiff;
		$scope.selectedDate.returnDiff = returnDiff;
		
		var displayedFlights = $scope.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
		flexibleFlightResults.setSelected(outboundDiff, returnDiff);
		flexibleFlightResults.refreshDisplayed(displayedFlights);
		//$state.reload();
	}
	
	function mouseoverDate(outboundDiff, returnDiff) {
		$scope.hoveredDate.outboundDiff = outboundDiff;
		$scope.hoveredDate.returnDiff = returnDiff;
		
		if (outboundDiff == $scope.hoveredDate.outboundDiff && returnDiff == $scope.hoveredDate.returnDiff) {
			return true;
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
		// loop through the outbound flights
		for (var i = 0; i < $scope.journeys.length; i++) {
			var trip = $scope.journeys[i];
			
			// for each 
			for (var j = 0; j < $scope.flexible.length; j++) {
				
				for (var k = 0; k < trip['flights'].length; k++) {
					
					var flight = trip.flights[k];
					
					if (($scope.flexible[j] == flight['return']['difference']) && flight['return']['date']) {
						var obj = {};
						obj.date = flight['return']['date'];
						obj.difference = flight['return']['difference'];
						
						// only add unique return dates
						var unique = true;
						for (var l = 0; l < $scope.returnDates.length; l++) {
							// if the current object is found in the $scope array it is not unique
							if ($scope.returnDates[l].hasOwnProperty('difference') && ($scope.returnDates[l]['difference'] == obj.difference)) {
								unique = false;	
							}	
						}
						
						if (unique) {
							$scope.returnDates.push(obj);
						}
					}	
				} 
				
			}
		}
		
		// sort the $scope.returnDates object
		$scope.returnDates = $scope.returnDates.sort(function(a, b) {
			return a.date.unix() - b.date.unix()
		});
	}
	
	function buildGrid() {
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
		
		var outboundFlexibleDates = ['-3', '-2', '-1', '0', '+1', '+2', '+3'];
		var returnFlexibleDates = ['-3', '-2', '-1', '0', '+1', '+2', '+3'];
		
		// loop through outbound dates
		for (var i = 0; i < $scope.flexible.length; i++) {
			var obj = {};
			obj.outbound = {};
			obj.flights = [];
			
			//loop through return dates
			for (var j = 0; j < $scope.flexible.length; j++) {
				if ($scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]]) {
					
					// check unique outbound
					if (outboundFlexibleDates.indexOf($scope.flexible[i]) >= 0) {
						var start = outboundFlexibleDates.indexOf($scope.flexible[i])
						outboundFlexibleDates.splice(start, 1);
					}
					
					// check unique return
					if (returnFlexibleDates.indexOf($scope.flexible[j]) >= 0) {
						var start = returnFlexibleDates.indexOf($scope.flexible[i])
						returnFlexibleDates.splice(start, 1);
					}
					
					//set the outbound object details
					if (!obj.outbound.date && !obj.outbound.difference) {
						obj['outbound']['difference'] = $scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]].dates['outbound']['difference'];
						obj['outbound']['date'] = $scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]].dates['outbound']['date'];
					}
					
					var flightsObj = {};
					flightsObj['return'] = {};
					flightsObj['price'];
					
					// flights for flexible date combo
					var flexFlights = $scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]].data;
					
					flightsObj['return']['difference'] = $scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]].dates['return']['difference'];
					flightsObj['return']['date'] = $scope.flights['outbound' + $scope.flexible[i] + 'return' + $scope.flexible[j]].dates['return']['date'];
					flightsObj['price'] = flightPriceRange(flexFlights);
					
					obj.flights.push(flightsObj);
				} else {
					// flight combination was not returned
					var flightsObj = {};
					flightsObj['return'] = {};
					flightsObj['price'];
					
					// undefined values allow printing blank box
					flightsObj['return']['difference'] = $scope.flexible[j];
					flightsObj['return']['date'] = '';
					flightsObj['price'] = '';

					obj.flights.push(flightsObj);
				}
			}
			$scope.journeys.push(obj);
		}
		
		// remove missing dates from the journeys object
		for (var i; i < $scope.journeys.length; i++) {
			for (var j; j < $scope.journeys[i].flights.length; j++) {
				if (returnFlexibleDates.indexOf($scope.journeys[i].flights[j]['return']['difference']) >= 0) {
					//$scope.journeys[i].flights.splice(j, 1);
				}
			}
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
	
	$scope.init();
}