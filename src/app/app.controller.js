angular
	.module('ngSassFoundation')
	.controller('AppController', AppController);

AppController.$inject = ['$scope', '$location'];

function AppController($scope, $location) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if (angular.isDefined(toState.data.pageTitle)) {
			$scope.pageTitle = toState.data.pageTitle + ' | ngSassFoundation' ;
		}
	});
}