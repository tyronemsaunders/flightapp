angular
	.module('flyingBye.home')
	.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', '$state'];

function HomeController($scope, $state) {
	$state.go('app.home.map');
}

