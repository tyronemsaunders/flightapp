angular
	.module('flyingBye.flights')
	.controller('FlightsMapController', FlightsMapController);

FlightsMapController.$inject = ['$window', '$scope', '$state', '$stateParams', '$timeout', 'offcanvas', 'flightsMap', 'flightsQueryForm', 'spinnerService'];

function FlightsMapController($window, $scope, $state, $stateParams, $timeout, offcanvas, flightsMap, flightsQueryForm, spinnerService) {
	
	//set the path of the icons
	$window.L.Icon.Default.imagePath = "assets/media/images/";
	
	$scope.hideResults = hideResults;
	$scope.allCities = allCities;
	
	function init() {
		if ($state.includes('app.flights.map') || $state.includes('app.flights.search')) {
			if (flightsMap.map) {
				flightsMap.map.remove();
				flightsMap.init();
				$timeout(function() {
					spinnerService.hide('mapSpinner');	
				});
			}
		}
	}
	
	function allCities() {
		flightsQueryForm.clearAirports('destination');
		flightsMap.refreshMap(flightsMap.map, flightsMap.flightsLayer);
	}
	
	function activate() {
		if ($stateParams.refresh) {
			init();	
		}
	}
	
	function hideResults() {
		if (offcanvas.visible) {
			$state.go('app.home.map');
			offcanvas.hide();	
		}
	}
	
	function initializeLoadingSpinner() {
		$timeout(function() {
			spinnerService.show('mapSpinner');	
		});
		
	}
	
	///// Broadcast functions
	function initializedFlexibleResults(evt, val) {
		init();	
	}
	
	initializeLoadingSpinner();
	activate();
	$scope.$on('initializedFlexibleResults', initializedFlexibleResults);
}