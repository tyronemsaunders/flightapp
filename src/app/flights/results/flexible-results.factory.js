angular
	.module('flyingBye.flights')
	.factory('flexibleFlightResults', flexibleFlightResults);

flexibleFlightResults.$inject = ['$window', '$filter', 'flightsQuery', 'flightsQueryForm'];

function flexibleFlightResults($window, $filter, flightsQuery, flightsQueryForm) {
	var flightOutbound = flightsQueryForm['dates']['outbound']['date'].hour(12).minutes(0).seconds(0).milliseconds(0);
	var flightReturn = flightsQueryForm['dates']['return']['date'].hour(12).minutes(0).seconds(0).milliseconds(0);
	
	var results = {};
	
	results.flights = {};
	results.displayed;
	results.selected = {};
	results.selected.outboundDiff;
	results.selected.returnDiff;
	
	results.setSelected = setSelected;
	results.priceRange = priceRange;
	results.flightDuration = flightDuration;
	results.layoverCount = layoverCount;
	results.layoverDuration = layoverDuration;
	results.refreshDisplayed = refreshDisplayed;
	
	function init() {
		initializeFlights();
		
		// initialized the displayed list of flights
		if (results.flights['outbound0return0']) {
			// try to start with the selected flight
			results.selected.outboundDiff = '0';
			results.selected.returnDiff = '0';
			refreshDisplayed(results.flights['outbound' + results.selected.outboundDiff + 'return' + results.selected.returnDiff].data);
		} else {
			// start with the first date
			results.selected.outBoundDiff = results.flights[Object.keys(results.flights)[0]].dates['outbound']['difference'];
			results.selected.returnDiff = results.flights[Object.keys(results.flights)[0]].dates['return']['difference'];
			refreshDisplayed(results.flights['outbound' + results.selected.outboundDiff + 'return' + results.selected.returnDiff].data);
		}
	}
	
	function initializeFlights() {
		
		for (var i = 0; i < flightsQuery.flights.length; i++) {
			var outboundDate = function() {
				var obj = {};
				
				var flexibleDate = $window.moment.unix(flightsQuery.flights[i].outbound_flight_time.departure_local).hour(12).minutes(0).seconds(0).milliseconds(0);
				obj.date = flexibleDate;
				
				if (flexibleDate.diff(flightOutbound) > 0) {
					obj.difference = '+' + flexibleDate.diff(flightOutbound, 'days');
				} else {
					obj.difference = flexibleDate.diff(flightOutbound, 'days');
				}
				
				return obj;
			};
			
			var returnDate = function() {
				var obj = {};
				var flexibleDate = $window.moment.unix(flightsQuery.flights[i].return_flight_time.departure_local).hour(12).minutes(0).seconds(0).milliseconds(0);
				obj.date = flexibleDate;
				
				if (flexibleDate.diff(flightReturn) > 0) {
					obj.difference = '+' + flexibleDate.diff(flightReturn, 'days');
				} else {
					obj.difference = flexibleDate.diff(flightReturn, 'days');
				}
				
				return obj;
			};
			
			var outboundDate = outboundDate();
			var returnDate = returnDate();
			
			if (!results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference]) {
				// initialize the flexible results object
				results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference] = {};
				results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference].dates = {};
				results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference].data = []
				
			}
			
			results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference].dates['outbound'] = outboundDate;
			results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference].dates['return'] = returnDate;
			results.flights['outbound' + outboundDate.difference + 'return' + returnDate.difference].data.push(flightsQuery.flights[i]);
		}
	}
	
	function setSelected(outboundDiff, returnDiff) {
		results.selected.outboundDiff = outboundDiff;
		results.selected.returnDiff = returnDiff;
	}
	
	function priceRange() {
		var outboundDiff = results.selected.outboundDiff;
		var returnDiff = results.selected.returnDiff;
		var flights = results.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
		
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
	
	function flightDuration() {
		var outboundDiff = results.selected.outboundDiff;
		var returnDiff = results.selected.returnDiff;
		var flights = results.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
		
		var range = {};
		range['min'] = flights[0].duration_minutes.outbound;
		range['max'] = flights[0].duration_minutes.outbound;
		
		for (var i = 0; i < flights.length; i++) {
			if (flights[i]['duration_minutes']['outbound'] < range['min']) {
				range['min'] = flights[i]['duration_minutes']['outbound'];
			}
			
			if (flights[i]['duration_minutes']['return'] < range['min']) {
				range['min'] = flights[i]['duration_minutes']['return'];
			}
			
			if (flights[i]['duration_minutes']['outbound'] > range['max']) {
				range['max'] = flights[i]['duration_minutes']['outbound'];
			}
			
			if (flights[i]['duration_minutes']['return'] > range['max']) {
				range['max'] = flights[i]['duration_minutes']['return'];
			}
		}
		
		return range;
	}
	
	function layoverCount() {
		var outboundDiff = results.selected.outboundDiff;
		var returnDiff = results.selected.returnDiff;
		var flights = results.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
		
		var range = {};
		range['min'];
		range['max'];
		
		for (var i = 0; i < flights.length; i++) {
			
			if (flights[i].route['outbound'].length == 1) {
				range['min'] = 0;
				range['max'] = 0;
			} else {
				// outbound route has connections
				if (!range['min']) {
					range['min'] = flights[i].route['outbound'].length - 1;	
				} else if (flights[i].route['outbound'].length - 1 < range['min']) {
					range['min'] = flights[i].route['outbound'].length - 1;	
				}
				
				if (!range['max']) {
					range['max'] = flights[i].route['return'].length - 1;	
				} else if (flights[i].route['return'].length - 1 > range['max']) {
					range['max'] = flights[i].route['return'].length - 1;	
				}
			}
			
			if (flights[i].route['return'].length == 1) {
				range['min'] = 0;
				range['max'] = 0;
			} else {
				// return route has connections
				if (!range['min']) {
					range['min'] = flights[i].route['return'].length - 1;	
				} else if (flights[i].route['return'].length - 1 < range['min']) {
					range['min'] = flights[i].route['return'].length - 1;	
				}
				
				if (!range['max']) {
					range['max'] = flights[i].route['return'].length - 1;	
				} else if (flights[i].route['return'].length - 1 > range['max']) {
					range['max'] = flights[i].route['return'].length - 1;	
				}
			}
		}
		
		return range;
	}
	
	function layoverDuration() {
		var outboundDiff = results.selected.outboundDiff;
		var returnDiff = results.selected.returnDiff;
		var flights = results.flights['outbound' + outboundDiff + 'return' + returnDiff].data;
		
		var range = {};
		range['min'];
		range['max'];
		
		for (var i = 0; i < flights.length; i++) {
			
			if (flights[i].route['return'].length == 1) {
				range['min'] = 0;
				range['max'] = 0;
			} else {
				// return route has connections
				for (var j = 0; j < flights[i].route['return'].length - 1; j++) {
					
					var layover = flights[i].route['return'][j + 1].departure_time_local - flights[i].route['return'][j].arrival_time_local;
					
					if (!range['min']) {
						range['min'] = Math.floor(layover / 60);
					} else if (layover < range['min']) {
						range['min'] = Math.floor(layover / 60);
					} 
					
					if (!range['max']) {
						range['max'] = Math.floor(layover / 60);
					} else if (layover > range['max']) {
						range['max'] = Math.floor(layover / 60);
					} 
				}
			}
			
			if (flights[i].route['outbound'].length == 1) {
				// for direct flights set the range to 0
				range['min'] = 0;
				range['max'] = 0;
			} else {
				// outbound route has connections
				for (var j = 0; j < flights[i].route['outbound'].length - 1; j++) {
					var layover = flights[i].route['outbound'][j + 1].departure_time_local - flights[i].route['outbound'][j].arrival_time_local;
					
					if (!range['min']) {
						range['min'] = Math.floor(layover / 60);
					} else if (layover < range['min']) {
						range['min'] = Math.floor(layover / 60);
					} 
					
					if (!range['max']) {
						range['max'] = Math.floor(layover / 60);
					} else if (layover > range['max']) {
						range['max'] = Math.floor(layover / 60);
					} 
				}
			}
		}
		return range;
	}
	
	function refreshDisplayed(flights) {
		results.displayed = flights;
	}
	
	init();
	
	return results;
}