angular
	.module('flyingBye.home')
	.controller('OffcanvasFlightResultsController', OffcanvasFlightResultsController);

OffcanvasFlightResultsController.$inject = ['$scope', 'offcanvas'];

function OffcanvasFlightResultsController($scope, offcanvas) {
	$scope.close = close;
	
	function close() {
		offcanvas.hide();
	}
}