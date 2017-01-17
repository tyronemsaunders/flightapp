angular
	.module('flyingBye.flights')
	.config(flightsConfig);

flightsConfig.$inject = ['$stateProvider'];

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
function flightsConfig($stateProvider) {
	$stateProvider
	
		//app.home dot syntax creates a parent/child state
		.state('app.flights', {
			url : '/flights',
		    views : {
		      //target the view ui-view='main' in the unnamed root template (index.tpl.html)
		      //the other views in the unnamed root template are inherited.
		      "main@" : {
		    	  controller : 'FlightsController',
		    	  templateUrl : 'flights/flights.tpl.html'
		      }
		    },
		    data : { 
		    	//pageTitle will be handled by parent state 'app' in appCtrl
		    	pageTitle : 'Flights' 
		    }
		});
}