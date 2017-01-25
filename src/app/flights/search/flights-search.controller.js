angular
	.module('flyingBye.flights')
	.controller('FlightsSearchController', FlightsSearchController);

FlightsSearchController.$inject = ['$scope', '$location', '$timeout', '$anchorScroll', 'flightsMap', 'displayedFlightResults', 'spinnerService'];

function FlightsSearchController($scope, $location, $timeout, $anchorScroll, flightsMap, displayedFlightResults, spinnerService) {
	// TODO perform query from route parameters 
	
	///// Broadcast functions
	function mapInitialized(evt, val) {
		$timeout(function() {
			//$location.hash('flights-search-flexible-grid');
			//$anchorScroll();	
		}, 1000);
	}
	
	function initializedFlexibleResults(evt, val) {
		displayedFlightResults.init();	
	}
	
	$scope.$on('mapInitialized', mapInitialized);
	$scope.$on('initializedFlexibleResults', initializedFlexibleResults);
}