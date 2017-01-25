angular
	.module('flyingBye.flights')
	.factory('skypickerFlightsQuery', skypickerFlightsQuery);

skypickerFlightsQuery.$inject = ['$resource', '$q', 'flightsQueryForm'];

function skypickerFlightsQuery($resource, $q, flightsQueryForm) {
	var query = {};
	
	query.getFlightsFromSkypicker = getFlightsFromSkypicker;
	
	function getFlightsFromSkypicker() {
		
		var deferred = $q.defer();
		
		var flightResults = $resource('https://api.skypicker.com/flights', {partner: 'picky', curr: 'USD'}, {
			query: {
				method: 'GET',
				params: paramsForSkypicker(),
				isArray: true,
				transformResponse: prepSkypickerResponse
			}
		});
		
		flightResults.query().$promise.then(getFlightsSuccess).catch(getFlightsError);

		function getFlightsSuccess(response) {
			deferred.resolve(response);
		}
		
		function getFlightsError(e) {
			console.log("Error getting flights from skypicker");
			console.log(e);
			console.log(JSON.stringify(e, null, 4));
			return deferred.reject(e);
		}
		
		function prepArray(array) {
			if (angular.isArray(array)) {
				return array.toString();
			} else {
				return null
			}
		}
		
		function paramsForSkypicker() {
			var params = {};
			
			if (flightsQueryForm.budget.selected) {
				params.price_from = 0;
				params.price_to = flightsQueryForm.budget.amount;
			}
			
			if (flightsQueryForm.oneForCity) {
				params.oneforcity = 1;
			}
			
			if (flightsQueryForm.origin.type == 'airport') {
				params.flyFrom = prepArray(flightsQueryForm.getAirport('origin'));
			} else if (flightsQueryForm.origin.type == 'radius') {
				params.longitudeFrom = flightsQueryForm.origin.longitude;
				params.latitudeFrom = flightsQueryForm.origin.latitude;
				params.radiusFrom = flightsQueryForm.origin.radius;
			}
			
			if (flightsQueryForm.destination.selected) {
				if (flightsQueryForm.destination.type == 'airport') {
					params.to = prepArray(flightsQueryForm.getAirport('destination'));
				} else if (flightsQueryForm.destination.type == 'radius') {
					params.longitudeTo = flightsQueryForm.destination.longitude;
					params.latitudeTo = flightsQueryForm.destination.latitude;
					params.radiusTo = flightsQueryForm.destination.radius;
				}
			}
			
			if (flightsQueryForm.dates.outbound.selected) {
				if (flightsQueryForm.dates.outbound.type == 'range') {
					params.dateFrom = flightsQueryForm.getDateRange('outbound').min;
					params.dateTo = flightsQueryForm.getDateRange('outbound').max;
				}
			}
			
			if (flightsQueryForm.dates['return'].selected) {
				if (flightsQueryForm.dates['return'].type == 'range') {
					params.returnFrom = flightsQueryForm.getDateRange('return').min;
					params.returnTo = flightsQueryForm.getDateRange('return').max;
				} else if (flightsQueryForm.dates['return'].type == 'stay') {
					params.daysInDestinationFrom = flightsQueryForm.getStay().min;
					params.daysInDestinationTo = flightsQueryForm.getStay().max;
				}
			}
			
			if (flightsQueryForm.flightType) {
				params.typeFlight = flightsQueryForm.flightType;
			} else {
				params.typeFlight = 'oneway';
			}
			
			if (flightsQueryForm.passengers.selected) {
				params.adults = flightsQueryForm.passengers.adults;
				params.children = flightsQueryForm.passengers.children;
				params.infants = flightsQueryForm.passengers.infants;
			}
			
			console.log("Skypicker params: " + JSON.stringify(params, null, 4));
			
			return params;
		}
		
		function prepSkypickerResponse(data, headersGetter, status) {
			var flight_info = [];
			data = JSON.parse(data);

			for (var i = 0; i < data.data.length; i++) {
				var flight = {};
				flight['origin'] = {};
				flight['origin']['country'] = {};
				flight['destination'] = {};
				flight['destination']['country'] = {};
				flight['seats'] = {};
				flight['bags_price'] = {};
				flight['route'] = {};
				flight['duration_minutes'] = {};
				flight['outbound_flight_time'] = {};
				flight['return_flight_time'] = {};
				
				flight.type_flights = data.data[i].type_flights;
				flight.deep_link = data.data[i].deep_link;
				flight.booking_token = data.data[i].booking_token;
				flight.origin.airport = data.data[i].flyFrom;
				flight.origin.city = data.data[i].cityFrom;
				flight.origin.country.code = data.data[i].countryFrom.code;
				flight.origin.country.name = data.data[i].countryFrom.name;
				flight.destination.airport = data.data[i].flyTo;
				flight.destination.city = data.data[i].cityTo;
				flight.destination.country.code = data.data[i].countryFrom.code;
				flight.destination.country.name = data.data[i].countryFrom.name;
				flight.duration_minutes['return'] = data.data[i].duration['return'] / 60;
				flight.duration_minutes.outbound = data.data[i].duration.departure / 60;
				flight.distance = data.data[i].distance;
				flight.seats.total_passengers = data.search_params.seats.passengers;
				flight.seats.infants = data.search_params.seats.infants;
				flight.seats.adults = data.search_params.seats.adults;
				flight.seats.children = data.search_params.seats.children;
				flight.price = data.data[i].conversion.USD;
				flight.currency = data.currency;
				flight['bags_price']['1'] = data.data[i]['bags_price']['1'];
				flight['bags_price']['2'] = data.data[i]['bags_price']['2'];
				flight.route.outbound = [];
				flight.route['return'] = [];
				
				for (var j = 0; j < data.data[i].route.length; j++) {
					
					var flight_leg = {};
					flight_leg['origin'] = {};
					flight_leg['destination'] = {};
					
					flight_leg.found_on = data.data[i].route[j].found_on;
					flight_leg.airline = data.data[i].route[j].airline;
					flight_leg.flight_no = data.data[i].route[j].flight_no;
					flight_leg.departure_time_UTC = data.data[i].route[j].dTimeUTC;
					flight_leg.departure_time_local = data.data[i].route[j].dTime;
					flight_leg.arrival_time_UTC = data.data[i].route[j].aTimeUTC;
					flight_leg.arrival_time_local = data.data[i].route[j].aTime;
					flight_leg.origin.airport = data.data[i].route[j].flyFrom;
					flight_leg.origin.city = data.data[i].route[j].cityFrom;
					flight_leg.origin.latitude = data.data[i].route[j].latFrom;
					flight_leg.origin.longitude = data.data[i].route[j].lngFrom;
					flight_leg.destination.airport = data.data[i].route[j].flyTo;
					flight_leg.destination.city = data.data[i].route[j].cityTo;
					flight_leg.destination.latitude = data.data[i].route[j].latTo;
					flight_leg.destination.longitude = data.data[i].route[j].lngTo;
						
					if (data.data[i].route[j]['return']) {
						//dealing with the return flight
						flight.route['return'].push(flight_leg);
					} else {
						//dealing with the outgoing flight
						flight.route.outbound.push(flight_leg);
					}
				}
				
				// sort the trip legs by departure time
				flight.route.outbound.sort(function(a, b) {
					return a.departure_time_UTC - b.departure_time_UTC;
				});
				var num_outbound_legs = flight.route.outbound.length;
				
				flight.route['return'].sort(function(a, b) {
					return a.departure_time_UTC - b.departure_time_UTC;
				});
				var num_return_legs = flight.route['return'].length;
				
				// add lat and long of origin
				flight.origin.latitude = flight.route.outbound[0].origin.latitude;
				flight.origin.longitude = flight.route.outbound[0].origin.longitude;
				// add departure and arrival of outgoing
				flight.outbound_flight_time.departure_UTC = flight.route.outbound[0].departure_time_UTC;
				flight.outbound_flight_time.departure_local = flight.route.outbound[0].departure_time_local;
				flight.outbound_flight_time.arrival_UTC = flight.route.outbound[num_outbound_legs - 1].arrival_time_UTC;
				flight.outbound_flight_time.arrival_local = flight.route.outbound[num_outbound_legs - 1].arrival_time_local;
				// add lat and long of dest
				flight.destination.latitude = flight.route['return'][0].origin.latitude;
				flight.destination.longitude = flight.route['return'][0].origin.longitude;
				// add departure and arrival of return
				flight.return_flight_time.departure_UTC = flight.route['return'][0].departure_time_UTC;
				flight.return_flight_time.departure_local = flight.route['return'][0].departure_time_local;
				flight.return_flight_time.arrival_UTC = flight.route['return'][num_return_legs - 1].arrival_time_UTC;
				flight.return_flight_time.arrival_local = flight.route['return'][num_return_legs - 1].arrival_time_local;
				
				flight_info.push(flight);
			}
			
			return flight_info;
		}
		
		return deferred.promise;
	}
	
	return query;
}