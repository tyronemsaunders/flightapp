angular
	.module('flyingBye')
	.controller('HomeHeroController', HomeHeroController);

HomeHeroController.$inject = ['$scope', '$state', '$window', 'offcanvas'];

function HomeHeroController($scope, $state, $window, offcanvas) {
	$scope.offcanvasVisible = offcanvasVisible;

	function offcanvasVisible() {
		if (offcanvas.visible) {
			return true;
		}
		return false;
	}
}