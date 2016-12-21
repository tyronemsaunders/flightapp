angular
	.module('flyingBye.places')
	.factory('airportsList', airportsList);

airportsList.$inject = ['$resource'];

function airportsList($resource) {
	return $resource('assets/media/data/openflights-airports.json', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
}