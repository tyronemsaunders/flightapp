angular
	.module('flightApp.flights')
	.factory('flexibleFlightResults', flexibleFlightResults);

flexibleFlightResults.$inject = ['$rootScope', '$window', 'flightsQuery', 'flightsQueryForm', 'spinnerService'];

function flexibleFlightResults($rootScope, $window, flightsQuery, flightsQueryForm, spinnerService) {
	
	var results = {};
	
	results.init = init;
	
	results.flights = {};
	
	results.minReturnDate;
	results.minOutboundDate;
	results.maxReturnDate;
	results.maxOutboundDate;
	
	results.outboundDateDifferences = [];
	results.returnDateDifferences = [];
	
	results.initializeFlights = initializeFlights;
	results.refresh = refresh;
	
	function init() {
		initializeFlights();
		setFlexibleDateDifferences();
		// broadcast the initialization of the flexible results
		$rootScope.$broadcast('initializedFlexibleResults', true);
	}
	
	function initializeFlights() {
		// reset the flights object for every new query to prevent pushing new flights onto an array of old flights
		results.flights = {};
		// reset the travel date extremes for every new query to prevent references from exisiting return dates from influencing the new query
		results.minOutboundDate = null;
		results.maxOutboundDate = null;
		results.minReturnDate = null;
		results.maxReturnDate = null;
		
		///////////////////////////////////////////////////////////////////////////
		// set the minimum and maximum travel dates
		// add flights to an object that has keys representing the minimum and maximum travel day combinations
		///////////////////////////////////////////////////////////////////////////
		
		var flightOutbound = angular.copy(flightsQueryForm['dates']['outbound']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
		var flightReturn = angular.copy(flightsQueryForm['dates']['return']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
		
		for (var i = 0; i < flightsQuery.flights.length; i++) {
			
			// get the unix time stamp for the travel dates
			var outboundTravelDate = flightsQuery.flights[i].outbound_flight_time.departure_local;
			var returnTravelDate = flightsQuery.flights[i].return_flight_time.departure_local;
			
			// create an object that holds the date as a momentjs object and the the +/- day difference from the originally selected flight
			var outboundDateObj = generateOutboundDateObj(outboundTravelDate);
			var returnDateObj = generateReturnDateObj(returnTravelDate);
			
			
			// initialize the +/- day difference property on the flights object
			if (!results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference]) {
				// initialize the flexible results object
				results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference] = {};
				results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference].dates = {};
				results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference].data = [];
			}
			
			results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference].dates['outbound'] = outboundDateObj;
			results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference].dates['return'] = returnDateObj;
			results.flights['outbound' + outboundDateObj.difference + 'return' + returnDateObj.difference].data.push(flightsQuery.flights[i]);
			
			// setup the minimum and maximum flexible dates (+/- travel days to search)
			setOutboundDateExtremes(outboundTravelDate);
			setReturnDateExtremes(returnTravelDate);
		}
		
		function generateOutboundDateObj(travelDate) {
			var obj = {};
			
			var flexibleDate = $window.moment.unix(travelDate).hour(12).minutes(0).seconds(0).milliseconds(0);
			obj.date = flexibleDate;
			
			if (flexibleDate.diff(flightOutbound, 'days') > 0) {
				obj.difference = '+' + flexibleDate.diff(flightOutbound, 'days');
			} else {
				obj.difference = flexibleDate.diff(flightOutbound, 'days');
			}
			
			return obj;
		}
		
		function generateReturnDateObj(travelDate) {
			var obj = {};
			var flexibleDate = $window.moment.unix(travelDate).hour(12).minutes(0).seconds(0).milliseconds(0);
			obj.date = flexibleDate;
			
			if (flexibleDate.diff(flightReturn, 'days') > 0) {
				obj.difference = '+' + flexibleDate.diff(flightReturn, 'days');
			} else {
				obj.difference = flexibleDate.diff(flightReturn, 'days');
			}
			
			return obj;
		}
		
		function setOutboundDateExtremes(travelDate) {
			var flexibleDate = $window.moment.unix(travelDate).hour(12).minutes(0).seconds(0).milliseconds(0);
			
			// set the min outbound date
			if (!results.minOutboundDate) {
				results.minOutboundDate = flexibleDate;
			} else if (flexibleDate.isBefore(results.minOutboundDate)) {
				results.minOutboundDate = flexibleDate;
			}
			
			// set the max outbound date
			if (!results.maxOutboundDate) {
				results.maxOutboundDate = flexibleDate;
			} else if (flexibleDate.isAfter(results.maxOutboundDate)) {
				results.maxOutboundDate = flexibleDate;
			}
		}
		
		function setReturnDateExtremes(travelDate) {
			var flexibleDate = $window.moment.unix(travelDate).hour(12).minutes(0).seconds(0).milliseconds(0);
			
			// set the min return date
			if (!results.minReturnDate) {
				results.minReturnDate = flexibleDate;
			} else if (flexibleDate.isBefore(results.minReturnDate)) {
				results.minReturnDate = flexibleDate;
			}
			
			// set the max outbound date
			if (!results.maxReturnDate) {
				results.maxReturnDate = flexibleDate;
			} else if (flexibleDate.isAfter(results.maxReturnDate)) {
				results.maxReturnDate = flexibleDate;
			}
		}
	}
	
	function setFlexibleDateDifferences() {
		////////////////////////////////////////////////////////////////////////////////////////////
		// create an array that represents the minimum and maximum flexible date day differences
		////////////////////////////////////////////////////////////////////////////////////////////

		// for every new query reset the flexible dates array to prevent the existing query from influencing the new query
		results.outboundDateDifferences = [];
		results.returnDateDifferences = [];
		
		var flightOutbound = angular.copy(flightsQueryForm['dates']['outbound']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
		var flightReturn = angular.copy(flightsQueryForm['dates']['return']['date'].hour(12).minutes(0).seconds(0).milliseconds(0));
		
		// create an array out of the minimum and maximum flexible date day differences
		for (var i = angular.copy(results.minOutboundDate); i.isSameOrBefore(results.maxOutboundDate, 'day'); i = i.add(1, 'd')) {
			
			if (i.diff(flightOutbound, 'days') > 0) {
				results.outboundDateDifferences.push('+' + i.diff(flightOutbound, 'days'));
			} else {
				results.outboundDateDifferences.push(i.diff(flightOutbound, 'days'));
			}
		}
		
		for (var j = angular.copy(results.minReturnDate); j.isSameOrBefore(results.maxReturnDate, 'day'); j = j.add(1, 'd')) {
			
			if (j.diff(flightReturn, 'days') > 0) {
				results.returnDateDifferences.push('+' + j.diff(flightReturn, 'days'));
			} else {
				results.returnDateDifferences.push(j.diff(flightReturn, 'days'));
			}
		}
		
		if (results.outboundDateDifferences.length > 1) {
			results.outboundDateDifferences = results.outboundDateDifferences.sort(function(a, b) {
				return parseInt(a) - parseInt(b);
			});	
		}
		
		if (results.returnDateDifferences.length > 1) {
			results.returnDateDifferences = results.returnDateDifferences.sort(function(a, b) {
				return parseInt(a) - parseInt(b);
			});	
		}
	}
	
	function refresh() {
		init();
	}
	
	return results;
}