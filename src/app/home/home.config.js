angular
	.module('flyingBye.home')
	.config(homeConfig);

homeConfig.$inject = ['$stateProvider'];

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
function homeConfig($stateProvider) {
	$stateProvider
	
		//app.home dot syntax creates a parent/child state
		.state('app.home', {
			url : '/home',
		    views : {
		      //target the view ui-view='main' in the unnamed root template (index.tpl.html)
		      //the other views in the unnamed root template are inherited.
		      "main@" : {
		    	  controller : 'HomeController',
		    	  templateUrl : 'home/home.tpl.html'
		      },
		      "hero@app.home" : {
		    	  templateUrl : 'home/hero/hero.tpl.html'
		      },
		      "search@app.home" : {
		    	  controller : 'HomeSearchController',
		    	  templateUrl : 'home/search/search.tpl.html'
		      },
		      "results@app.home" : {
		    	  templateUrl : 'home/results/results.tpl.html'
		      },
		      "filter_results@app.home" : {
		    	  templateUrl : 'home/results/results.filter_results.tpl.html'
		      }
		    },
		    data : { 
		    	//pageTitle will be handled by parent state 'app' in appCtrl
		    	pageTitle : 'Home' 
		    }
		})
		.state('app.home.map', {
			views: {
				"view_results@app.home" : {
					controller: 'FlightsMapController',
					templateUrl : 'flights/map/flights.map.tpl.html'
				}
			}
		})
		.state('app.home.list', {
			views: {
				"view_results@app.home" : {
					templateUrl : 'flights/list/flights.list.tpl.html'
				}
			}
		});
}