angular.module( 'ngSassFoundation', [
  'mm.foundation',
  'templates',
  'ngSassFoundation.home',
  'ngSassFoundation.about',
  'ui.router',
  'ngAnimate'
])

//add inline annotation of the function with the names of dependencies as strings which will not get minified like function parameters
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  // urlRouterProvider.otherwise defines the path that is used when an invalid route is requested
  // in this app it it recommended to use parent.child syntax when defining states therefore the if the URL doesn't match for
  // child states the router falls back to the app state and this otherwise('/home') path
  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
  
  //$stateProvider.state registers the state configuration
  //state(name, stateConfig)
  .state('app', {
	  //explicitly specifiy views with the "views" config property by name
	  views: {
		  	//absolute name viewname@statename
		    //nothing following @ symbol because the root template (index.tpl.html) is unnamed
			'header@': {
				templateUrl: 'core/header/default_header.tpl.html'
			},
			'main@': {
				templateUrl: 'core/main/default_main.tpl.html'
			},
			'footer@': {
				templateUrl: 'core/footer/default_footer.tpl.html'
			},
			'off_canvas_left@': {
				templateUrl: 'core/offcanvas/default_offcanvas.tpl.html'
			}
		},
		//arbitrary data object
		data: {
			pageTitle : 'default'
		}
  });
}])

.run( function run () {
})

.controller('AppCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined(toState.data.pageTitle) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngSassFoundation' ;
    }
  });
}])
	
;