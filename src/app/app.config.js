angular
	.module('flyingBye')
	.config(appConfig);

//$inject is used to manually identify dependences to safeguard agains minification issues and avoid creating long list of inline dependencies
appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

function appConfig($stateProvider, $urlRouterProvider, $qProvider) {
	
	//$qProvider.errorOnUnhandledRejections(false);
	
	// urlRouterProvider.otherwise defines the path that is used when an invalid route is requested
	// in this app it it recommended to use parent.child syntax when defining states therefore the if the URL doesn't match for
	// child states the router falls back to the app state and this otherwise('/home') path
	$urlRouterProvider
		.otherwise('/home');
	  
	$stateProvider
		//$stateProvider.state registers the state configuration
		//state(name, stateConfig)
		.state('app', {
			//explicitly specifiy views with the "views" config property by name
			views : {
				//absolute name viewname@statename
				//nothing following @ symbol because the root template (index.tpl.html) is unnamed
				'header@' : {
					templateUrl: 'default/header/header.tpl.html'
				},
				'main@' : {
					template: '<h1>Main Section</h1>'
				},
				'main-offcanvas@' : {
					template: '<h1>Main Off Canvas</h1>'
				},
				'footer@' : {
					templateUrl: 'default/footer/footer.tpl.html'
				},
				'site-offcanvas@' : {
					templateUrl: 'default/offcanvas/site-offcanvas.tpl.html'
				}
			},
			//arbitrary data object
			data : {
				pageTitle : 'Embrace your randomness'
			}
		});
}