angular
	.module('flyingBye')
	.controller('HomeHeroController', HomeHeroController);

HomeHeroController.$inject = ['$scope', 'offcanvas'];

function HomeHeroController($scope, offcanvas) {
	$scope.offcanvasVisible = offcanvasVisible;

	function offcanvasVisible() {
		if (offcanvas.visible) {
			return true;
		}
		return false;
	}
}