angular
	.module('flightApp.places')
	.factory('cities', cities);

cities.$inject = ['$resource', '$filter', '$q','helpers'];

function cities($resource, $filter, $q, helpers) {
	var cities = {};
	cities.getNearestCity = getNearestCity;
	
	var citiesList = $resource('assets/media/data/geonames-cities.json', {}, {
		query: {
			method: 'GET',
			isArray: true,
			cache: true
		}
	});
	
	function getNearestCity(lat, lon) {
		var deferred = $q.defer();
		var ignore = 100 * 1000; // ignore cities farther than 100 km
		var nearest;
		var result = {}
		
		
		citiesList.query()
			.$promise.then(function(data) {
				for (var i = 0; i < data.length; i++) {
					var distance = helpers.coordsDistance(lat, lon, data[i].latitude, data[i].longitude, 'm');
					if (distance < ignore) {
						nearest = data[i];
						ignore = distance;
					}
				}
				
				result.name = nearest.name;
				result.population = nearest.population;
				result.latitude = nearest.latitude;
				result.longitude = nearest.longitude;
				result.country = nearest.country;
				result.administrative_division_1 = nearest.administrative_division_1;
				result.administrative_division_2 = nearest.administrative_division_2;
				result.timezone = nearest.timezone;
				result.alternatenames = nearest.alternatenames;
				
				deferred.resolve(result);
			});
		
		return deferred.promise;
	}
	
	return cities;
}