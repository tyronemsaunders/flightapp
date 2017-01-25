angular
	.module('flyingBye.home')
	.controller('OffcanvasFlightResultsController', OffcanvasFlightResultsController);

OffcanvasFlightResultsController.$inject = ['$scope', '$state', 'offcanvas', 'displayedFlightResults', 'spinnerService'];

function OffcanvasFlightResultsController($scope, $state, offcanvas, displayedFlightResults, spinnerService) {
	$scope.close = close;
	
	function close() {
		$state.go('app.home.map');
		offcanvas.hide();	
	}
	
	///// Broadcast functions
	function initializedFlexibleResults(evt, val) {
		displayedFlightResults.init();
	}
	
	$scope.$on('initializedFlexibleResults', initializedFlexibleResults);
}