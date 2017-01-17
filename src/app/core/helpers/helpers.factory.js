angular
	.module('flyingBye.core')
	.factory('helpers', helpers);

helpers.$inject = [];

function helpers() {
	helpers = {};
	helpers.getRandomInt = getRandomInt;
	helpers.coordsDistance = coordsDistance;
	
	// Returns a random integer between min (included) and max (excluded)
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}
	
	function coordsDistance(lat1, lon1, lat2, lon2, units) {
		//https://www.math.ksu.edu/~dbski/writings/haversine.pdf
		
		var R = 6371008.8 // earth radius in meters
		if (units = 'km') {
			R = R / 1000;
		}
		lat1 = degToRadians(lat1);
		lon1 = degToRadians(lon1);
		lat2 = degToRadians(lat2);
		lon2 = degToRadians(lon2);
		//convert spherical coordinates to cartesian coordinates
		var cartX1 = R * Math.cos(lat1) * Math.cos(lon1);
		var cartY1 = R * Math.cos(lat1) * Math.sin(lon1);
		var cartZ1 = R * Math.sin(lat1);
		var cartX2 = R * Math.cos(lat2) * Math.cos(lon2);
		var cartY2 = R * Math.cos(lat2) * Math.sin(lon2);
		var cartZ2 = R * Math.sin(lat2);
		
		// from the three-dimensional Pythagorean theorem the Euclidean distance "drilling through the earth" can be found with lat and lon coordinates converted to cartesian coordinates
		// calculate Euclidean Distance "drilling through earth, not on surface"
		var euclideanDistance = Math.sqrt(
			((cartX1 - cartX2) * (cartX1 - cartX2)) +
			((cartY1 - cartY2) * (cartY1 - cartY2)) +
			((cartZ1 - cartZ2) * (cartZ1 - cartZ2))
		);
		
		// the central angle forms a triangle with the Euclidean distance with the spherical distance forming a "dome"
		// derived from triangles
		var sineCentralAngle = (euclideanDistance/(2 * R * R)) * (Math.sqrt((4 * R * R) - (euclideanDistance * euclideanDistance)));
		var centralAngle = Math.asin(sineCentralAngle);
		
		// distance along the surface of the Earth is Radius multiplied by central angle
		var arc = centralAngle * R;
		
		return arc;
		
		function degToRadians(num) {
			return num * (Math.PI / 180);
		}
	}
	
	return helpers;
}