angular
	.module('flyingBye.places')
	.factory('airportsList', airportsList);

airportsList.$inject = ['$resource', '$filter', '$q', 'helpers'];

function airportsList($resource, $filter, $q, helpers) {
	var airportsList = {};
	airportsList.everyAirport;
	airportsList.setAllAirports = setAllAirports;
	airportsList.filterAirports = filterAirports;
	airportsList.allAirports = allAirports;
	airportsList.getNearestAirport = getNearestAirport;
	
	var airports = $resource('assets/media/data/commercial-passenger-airports.json', {}, {
		query: {
			method: 'GET',
			isArray: true,
			cache: true
		}
	});
	
	function filterAirports(search) {
		if (!search) {
			return [];
		}
		
		var deferred = $q.defer();
		var limit = 10;
		var index = 0;
		var expression = {formatted: search};
		
		airports.query()
			.$promise.then(function(data) {
				var list = $filter('filter')(data, expression);
				list = $filter('limitTo')(list, limit, index);
				deferred.resolve(list);
			}, function(error) {
				deferred.resolve([]);
			});
		
		return deferred.promise;
	}
	
	function allAirports() {
		var deferred = $q.defer();
		
		airports.query()
			.$promise.then(function(data) {
				deferred.resolve(data);
			}, function(error) {
				deferred.resolve([]);
			});
	
		return deferred.promise;
	}
	
	function setAllAirports(airports) {
		airportsList.everyAirport = airports; 
	}
	
	function getNearestAirport(lat, lon) {
		var deferred = $q.defer();
		var ignore = 500 * 1000; // ignore airports farther than 500 km
		var nearest;
		
		airports.query()
			.$promise.then(function(data) {
				for (var i = 0; i < data.length; i++) {
					var distance = helpers.coordsDistance(lat, lon, data[i].latitude, data[i].longitude, 'm');
					if (distance < ignore) {
						nearest = data[i];
						ignore = distance;
					}
				}
				deferred.resolve(nearest);
			});
		
		return deferred.promise;
	}
	
	return airportsList;
}