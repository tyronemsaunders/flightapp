angular
	.module('flyingBye.core')
	.controller('HeaderController', HeaderController);

HeaderController.$inject = ['$scope', '$mdSidenav'];

function HeaderController($scope, $mdSidenav) {
	$scope.toggleSidenav = toggleSidenav;
	
	function toggleSidenav(component_id) {
		console.log("toggleSidenav clicked");
		$mdSidenav(component_id, true).toggle().then(function() {
			// do some logging
			console.log("toggle #" + component_id + " completed");
		});
	}
}

