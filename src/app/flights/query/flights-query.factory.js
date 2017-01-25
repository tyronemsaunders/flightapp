angular
	.module('flightApp.flights')
	.factory('flightsQuery', flightsQuery);

flightsQuery.$inject = ['$rootScope', '$resource', '$q', 'flightsQueryForm',  'skypickerFlightsQuery'];

function flightsQuery($rootScope, $resource, $q, flightsQueryForm, skypickerFlightsQuery) {
	var query = {};
	query.flights;
	
	query.setFlights = setFlights;
	query.getFlights = getFlights;
	query.getCheapestPerCity = getCheapestPerCity;
	
	function getFlights() {
		return skypickerFlightsQuery.getFlightsFromSkypicker();
	}
	
	function setFlights(flights) {
		query.flights = flights;
		$rootScope.$broadcast('flightsSet', true);
	}
	
	function getCheapestPerCity(flights) {
		var cheapestPer = [];
		var uniqueAirports = [];

		for (var i = 0; i < flights.length; i++) {
			if (uniqueAirports.indexOf(flights[i].destination.airport) < 0) {
				uniqueAirports.push(flights[i].destination.airport);
				cheapestPer.push(flights[i]);
			} else {
				for (var j = 0; j < cheapestPer.length; j++) {
					if (flights[i].destination.airport == cheapestPer[j].destination.airport) {
						// check for a cheaper flight for the city
						if (cheapestPer[j].price > flights[i].price) {
							//remove the more expensive city
							cheapestPer.splice(j, 1);
							cheapestPer.push(flights[i]);
						}
					}
				}
			}
		}
		return cheapestPer;
	}
	
	return query;
}