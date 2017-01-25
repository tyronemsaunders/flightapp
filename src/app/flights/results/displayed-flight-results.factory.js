angular
	.module('flightApp.flights')
	.factory('displayedFlightResults', displayedFlightResults);

displayedFlightResults.$inject = ['$rootScope', 'flexibleFlightResults', 'airportsList', 'cities', 'spinnerService'];

function displayedFlightResults($rootScope, flexibleFlightResults, airportsList, cities, spinnerService) {
	
	var factory = {};
	
	factory.init = init;
	
	factory.active;
	factory.display;
	
	factory.selected = {};
	factory.selected.outboundDiff;
	factory.selected.returnDiff;
	
	factory.initializeDisplay = initializeDisplay;
	factory.setSelected = setSelected;
	factory.refreshDisplay = refreshDisplay;
	factory.formatFlight = formatFlight;
	
	factory.priceRange = priceRange;
	factory.flightDuration = flightDuration;
	factory.layoverCount = layoverCount;
	factory.layoverDuration = layoverDuration;
	
	function init() {
		initializeDisplay();
	}
	
	function initializeDisplay() {
		// reset the display for initialization
		factory.selected = {};
		factory.selected.outboundDiff = null;
		factory.selected.returnDiff = null;
		//clear the active flights
		factory.active = null;
		// clear the displayed flights
		factory.display = null;
		
		// set the selected flight and the displayed list of flights
		// initialized the displayed list of flights
		if (flexibleFlightResults.flights['outbound0return0']) {
			
			// try to start with the queried flight
			factory.selected.outboundDiff = '0';
			factory.selected.returnDiff = '0';
			
			setSelected(0, 0);
			refreshDisplay(flexibleFlightResults.flights['outbound' + factory.selected.outboundDiff + 'return' + factory.selected.returnDiff].data);
		} else {
			
			// start with the first date in the flights object
			factory.selected.outBoundDiff = flexibleFlightResults.flights[Object.keys(flexibleFlightResults.flights)[0]].dates['outbound']['difference'];
			factory.selected.returnDiff = flexibleFlightResults.flights[Object.keys(flexibleFlightResults.flights)[0]].dates['return']['difference'];
			
			setSelected(factory.selected.outBoundDiff, factory.selected.returnDiff);
			refreshDisplay(flexibleFlightResults.flights['outbound' + factory.selected.outboundDiff + 'return' + factory.selected.returnDiff].data);
		}
	}
	
	function setSelected(outboundDiff, returnDiff) {
		if (flexibleFlightResults.flights['outbound' + outboundDiff + 'return' + returnDiff].data) {
			
			// reset the selected flights
			factory.selected = {};
			factory.selected.outboundDiff = null;
			factory.selected.returnDiff = null;
			
			// set the selected +/- days
			factory.selected.outboundDiff = outboundDiff;
			factory.selected.returnDiff = returnDiff;
			
			//clear the active flights
			factory.active = null;
			
			// set the active set of flight results and broadcast
			factory.active = flexibleFlightResults.flights['outbound' + factory.selected.outboundDiff + 'return' + factory.selected.returnDiff].data;
			$rootScope.$broadcast('setActiveFlights', true);
		}	
	}
	
	function refreshDisplay(flights) {
		
		// clear the displayed flights
		factory.display = null;
		
		//set the new displayed flights
		factory.display = flights;

		$rootScope.$broadcast('displayedFlightsRefreshed', true);
	}
	
	function formatFlight(flight) {
		var obj = {};
		var directions = Object.keys(flight.route);
		
		obj.price = flight.price;
		obj.type = flight.type_flights;
		obj.link = flight.deep_link;
		obj.directions = [];
		
		for (var i = 0; i < directions.length; i++) {
			var direction = {};
			//var origin = getNearestPlace(flight.route[directions[i]][0].origin.latitude, flight.route[directions[i]][0].origin.longitude);
			//var destination = getNearestPlace(flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.latitude, flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.longitude);
			
			direction.type = directions[i];
			direction.duration_total = flight.duration_minutes[directions[i]];
			direction.layovers = flight.route[directions[i]].length - 1;
			// origin
			direction.origin = {};
			direction.origin.timestamp = flight.route[directions[i]][0].departure_time_local;
			direction.origin.city = flight.route[directions[i]][0].origin.city;
			direction.origin.latitude = flight.route[directions[i]][0].origin.latitude;
			direction.origin.latitude = flight.route[directions[i]][0].origin.longitude;
			direction.origin.country = {};
			//direction.origin.country.code = origin.then(function(nearest) {return nearest.city.country.ISO;});//origin.city.country.ISO;
			//direction.origin.country.name = origin.then(function(nearest) {return nearest.city.country.country;}); //origin.city.country.country;
			direction.origin.airport = {};
			direction.origin.airport.IATA = flight.route[directions[i]][0].origin.airport;
			//direction.origin.airport.name = origin.then(function(nearest) {return nearest.airport.name;});//origin.airport.name;
			//destination
			direction.destination = {};
			direction.destination.timestamp = flight.route[directions[i]][flight.route[directions[i]].length - 1].arrival_time_local;
			direction.destination.city = flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.city;
			direction.destination.latitude = flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.latitude;
			direction.destination.longitude = flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.longitude;
			direction.destination.country = {};
			//direction.destination.country.code = destination.then(function(nearest) {return nearest.city.country.ISO;});//destination.city.country.ISO;
			//direction.destination.country.name = destination.then(function(nearest) {return nearest.city.country.country;});//destination.city.country.country;
			direction.destination.airport = {};
			direction.destination.airport.IATA = flight.route[directions[i]][flight.route[directions[i]].length - 1].destination.airport;
			//direction.destination.airport.name = destination.then(function(nearest) {return nearest.airport.name;});//destination.airport.name;
			
			direction.segments = [];
			
			for (var j = 0; j < flight.route[directions[i]].length; j++) {
				var flightSegment = {};
				var currentSegment = flight.route[directions[i]][j];
				//var segmentOrigin = getNearestPlace(currentSegment.origin.latitude, currentSegment.origin.longitude);
				//var segmentDestination = getNearestPlace(currentSegment.destination.latitude, currentSegment.destination.longitude);
				
				flightSegment.type = 'flight';
				flightSegment.airline = {};
				flightSegment.airline.logo = 'https://images.kiwi.com/airlines/32/' + currentSegment.airline + '.png';
				flightSegment.airline.name = currentSegment.airline; // currentSegment.airline is IATA two letter code
				flightSegment.airline.code = currentSegment.airline;
				flightSegment.flight_no = currentSegment.flight_no;
				flightSegment.departure_time = currentSegment.departure_time_local;
				flightSegment.arrival_time = currentSegment.arrival_time_local;
				flightSegment.duration = currentSegment.arrival_time_local - currentSegment.departure_time_local;
				// origin
				flightSegment.origin = {};
				flightSegment.origin.airport = {};
				flightSegment.origin.airport.IATA = currentSegment.origin.airport;
				//flightSegment.origin.airport.name = segmentOrigin.then(function(origin) {return origin.airport.name;});//segmentOrigin.airport.name;
				flightSegment.origin.city = currentSegment.origin.city;
				flightSegment.origin.latitude = currentSegment.origin.latitude;
				flightSegment.origin.longitude = currentSegment.origin.longitude;
				flightSegment.origin.country = {};
				//flightSegment.origin.country.code = segmentOrigin.then(function(origin) {return origin.city.country.ISO;});//segmentOrigin.city.country.ISO;
				//flightSegment.origin.country.name = segmentOrigin.then(function(origin) {return origin.city.country.country;});//segmentOrigin.city.country.country;
				//destination
				flightSegment.destination = {};
				flightSegment.destination.airport = {};
				flightSegment.destination.airport.IATA = currentSegment.destination.airport;
				//flightSegment.destination.airport.name = segmentDestination.then(function(destination) {return destination.airport.name;});//segmentDestination.airport.name;
				flightSegment.destination.city = currentSegment.destination.city;
				flightSegment.destination.latitude = currentSegment.destination.latitude;
				flightSegment.destination.longitude = currentSegment.destination.longitude;
				flightSegment.destination.country = {};
				//flightSegment.destination.country.code = segmentDestination.then(function(destination) {return destination.city.country.ISO;});//segmentDestination.city.country.ISO;
				//flightSegment.destination.country.name = segmentDestination.then(function(destination) {return destination.city.country.country;});//segmentDestination.city.country.country;
				
				direction.segments.push(flightSegment);
				
				if ((flight.route[directions[i]].length > 1) && (j < (flight.route[directions[i]].length - 1))) {
					// the trip has layovers
					var nextSegment = flight.route[directions[i]][j + 1];
					var layoverSegment = {};
					layoverSegment.type = 'layover';
					layoverSegment.departure_time = nextSegment.departure_time_local;
					layoverSegment.arrival_time = currentSegment.arrival_time_local;
					layoverSegment.duration = nextSegment.departure_time_local - currentSegment.arrival_time_local;
					layoverSegment.airport = {};
					layoverSegment.airport.IATA = currentSegment.destination.airport;
					//layoverSegment.airport.name = segmentDestination.then(function(destination) {return destination.airport.name;});//segmentDestination.airport.name;
					layoverSegment.city = currentSegment.destination.city;
					layoverSegment.latitude = currentSegment.destination.latitude;
					layoverSegment.longitude = currentSegment.destination.longitude;
					layoverSegment.country = {};
					//layoverSegment.country.code = segmentDestination.then(function(destination) {return destination.city.country.ISO;});//segmentDestination.city.country.ISO;
					//layoverSegment.country.name = segmentDestination.then(function(destination) {return destination.city.country.country;});//segmentDestination.city.country.country;
					
					direction.segments.push(layoverSegment);
				}
			}
			obj.directions.push(direction);
		}
		
		return obj;
	}
	
	function getNearestPlace(lat, lon) {
		var nearest = {};
		// find nearest city and airport
	    var nearestCity = cities.getNearestCity(lat, lon);
	    var nearestAirport = airportsList.getNearestAirport(lat, lon);
	    
	    return nearestCity.then(function(city) {
	    	nearest.city = city;
	    	return nearestAirport;
	    }).then(function(airport) {
	    	nearest.airport = airport;
	    	return nearest;
	    }).catch(function(err) {
	    	console.log("Error getting nearest place when trying to display flights");
	    	console.log(JSON.stringify(err, null, 4));
	    });
	}
	
	function priceRange() {
		var flights = factory.active;
		
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
		var flights = factory.active;
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
		var flights = factory.active;
		
		var range = {};
		range['min'];
		range['max'];
		
		var outboundSegments;
		var returnSegments;
		var layoverCount;
		
		for (var i = 0; i < flights.length; i++) {
			
			// count the number of outbound segments
			outboundSegments = flights[i].route['outbound'].length - 1;
			returnSegments = flights[i].route['return'].length - 1;
			
			//layoverCount is the leg with the max number of segments
			layoverCount = outboundSegments >= returnSegments ? outboundSegments : returnSegments;
			
			if (layoverCount == 0) {
				range['min'] == 0;
			} 
			
			if (range['min'] && (range['min'] > layoverCount)) {
				range['min'] = layoverCount;
			}
			
			if (range['max'] && (range['max'] < layoverCount)) {
				range['max'] = layoverCount;
			}
			
			if (!range['min']) {
				range['min'] = layoverCount;
			}
			
			if (!range['max']) {
				range['max'] = layoverCount;
			}
		}
	
		return range;
	}
	
	function layoverDuration() {
		var flights = factory.active;
		
		var range = {};
		range['min'];
		range['max'];

		var layoverMinutes = [];
		
		for (var i = 0; i < flights.length; i++) {
			
			if (flights[i].route['return'].length == 1) {
				layoverMinutes.push(0);
			} else {
				// return route has connections
				// loop through each flight segment on the return leg
				for (var j = 0; j < flights[i].route['return'].length - 1; j++) {
					
					var returnLayover = flights[i].route['return'][j + 1].departure_time_local - flights[i].route['return'][j].arrival_time_local;
					layoverMinutes.push(Math.floor(returnLayover / 60));
				}
			}
			
			if (flights[i].route['outbound'].length == 1) {
				// for direct flights set the range to 0
				layoverMinutes.push(0);
			} else {
				// outbound route has connections
				// loop through each flight segment on the outbound leg
				for (var k = 0; k < flights[i].route['outbound'].length - 1; k++) {
					var outboundLayover = flights[i].route['outbound'][k + 1].departure_time_local - flights[i].route['outbound'][k].arrival_time_local;
					layoverMinutes.push(Math.floor(outboundLayover / 60));
				}
			}
		}
		range['max'] = Math.max.apply(null, layoverMinutes);
		range['min'] = Math.min.apply(null, layoverMinutes);
		return range;
	}
	
	return factory;
}