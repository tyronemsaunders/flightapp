angular.module( 'ngSassFoundation.about', [
  'ui.router'
])

.config(['$stateProvider', function config($stateProvider) {
  $stateProvider
  .state( 'app.about', {
    url: '/about',
    views: {
      "main@": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
}])

.controller( 'AboutCtrl', ['$scope', function AboutCtrl($scope) {
  
}])

;
