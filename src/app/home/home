/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngSassFoundation.home', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(['$stateProvider', function config( $stateProvider ) {
  
	$stateProvider
	
	//app.home dot syntax creates a parent/child state
	.state('app.home', {
	    url: '/home',
	    views: {
	      //target the view ui-view='main' in the unnamed root template (index.tpl.html)
	      //the other views in the unnamed root template are inherited.
	      "main@": {
	    	  controller: 'HomeCtrl',
	    	  templateUrl: 'home/home.tpl.html'
	      }
	    },
	    data:{ 
	    	//pageTitle will be handled by parent state 'app' in appCtrl
	    	pageTitle: 'Home' 
	    }
	});
}])

/**
 * And of course we define a controller for our route.
 */
.controller('HomeCtrl', ['$scope', function HomeController($scope) {

}])

;

