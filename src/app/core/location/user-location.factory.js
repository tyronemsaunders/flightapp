angular
	.module('flyingBye.core')
	.factory('userLocation', userLocation);

userLocation.$inject = ['$window', '$q', '$resource', 'helpers', 'cities', 'airportsList'];

function userLocation($window, $q, $resource, helpers, cities, airportsList) {
	var location = {};
	location.getStoredPosition = getStoredPosition;
	location.getCurrentPosition = getCurrentPosition;
	
	function getStoredPosition() {
		console.log("Getting stored position...");
		if ($window.localStorage) {
			if ($window.localStorage.getItem('userLocation')) {
				var deferred = $q.defer();
				deferred.resolve(JSON.parse($window.localStorage.getItem('userLocation')));
				return deferred.promise;
			} else {
				return getCurrentPosition();
			}
		} else {
			return getCurrentPosition();
		}
	}
	
	function getCurrentPosition() {
		
		console.log("Getting current position...");
		
		var geolocationOptions = {};
		var deferred = $q.defer();
		
		// check for browswer support for HTML 5 Geolocation API
		if ($window.navigator.geolocation) {
			console.log("$window.navigator.geolocation is active");
			$window.navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
			
		} else {
			console.log("$window.navigator.geolocation is not active");
			// fallback to an IP address location lookup
			var nearestIpLocationPromise = getIpLocation();
			nearestIpLocationPromise.then(function(data) {
				return deferred.resolve(data);
			});
		}
		
		function geolocationSuccess(position) {
			console.log("HTML5 Geolocation API position: ");
			console.log(JSON.stringify(position, null, 4));
			
			var result = {};
			result.city = null;
			result.airport = null;
			result.latitude  = position.coords.latitude;
			result.longitude = position.coords.longitude;
			result.altitude = position.coords.altitude;
			result.accuracy = position.coords.accuracy;
			result.altitudeAccuracy = position.coords.altitudeAccuracy;
			result.heading = position.coords.heading;
			result.speed = position.coords.speed;
		    
		    // find nearest city and airport
		    var nearestCityPromise = cities.getNearestCity(position.coords.latitude, position.coords.longitude);
		    var airportsPromise = airportsList.getNearestAirport(position.coords.latitude, position.coords.longitude);
		    nearestCityPromise.then(function(city) {
		    	result.city = city;
		    	console.log("Nearest City: " + JSON.stringify(city, null, 4));
		    	return airportsPromise;
			})
			.then(function(airport) {
				result.airport = airport;
				$window.localStorage.setItem('userLocation', JSON.stringify(result));
				console.log("Nearest Airport: " + JSON.stringify(airport, null, 4));
				return deferred.resolve(result);
			}, function(error) {
				return deferred.resolve(result);
			});
		}
		
		function geolocationError(error) {
			console.log("HTML5 Geolocation API error code: " + error.code);
			console.log("HTML5 Geolocation API error message: " + error.message);
			console.log(JSON.stringify(error, null, 4));
			//ignore the geolocation service error and try the IP address fallback
			var nearestIpLocationPromise = getIpLocation();
			nearestIpLocationPromise.then(function(data) {
				return deferred.resolve(data);
			}, function(error) {
				return deferred.reject(error);
			});
		}
		
		return deferred.promise;
	}
	
	function getIpLocation() {
		var deferred = $q.defer();
		var result = {};
		
		var ipLocation = $resource('http://ip-api.com/json', {}, {
			query: {
				method: 'GET',
				isArray: false
			}
		});
		
		ipLocation.query()
			.$promise.then(function(data) {
				
				result.latitude  = data.lat;
				result.longitude = data.lon;
				
				// find nearest city and airport
			    var nearestCityPromise = cities.getNearestCity(data.lat, data.lon);
			    var airportsPromise = airportsList.getNearestAirport(data.lat, data.lon);
			    nearestCityPromise.then(function(city) {
			    	result.city = city;
			    	console.log("Nearest City: " + JSON.stringify(city, null, 4));
			    	return airportsPromise;
				})
				.then(function(airport) {
					result.airport = airport;
					$window.localStorage.setItem('userLocation', JSON.stringify(result));
					console.log("Nearest Airport: " + JSON.stringify(airport, null, 4));
					return deferred.resolve(result);
				}, function(error) {
					return deferred.resolve(result);
				});
			})
			.catch(function(e) {
				console.log(e);
			});
	
		return deferred.promise;
	}
	
	return location;
}