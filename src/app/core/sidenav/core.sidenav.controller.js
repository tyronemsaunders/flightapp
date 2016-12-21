angular
	.module('flyingBye.core')
	.controller('SideNavController', SideNavController);

SideNavController.$inject = ['$scope', '$mdSidenav'];

function SideNavController($scope, $mdSidenav) {
	$scope.closeSidenav = closeSidenav;
	
	function closeSidenav(component_id) {
		$mdSidenav(component_id, true).close().then(function() {
			// do some logging
			console.log("close #" + component_id + " completed");
		});
	}
}

