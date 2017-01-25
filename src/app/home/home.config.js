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
		    	  controller : 'HomeHeroController',
		    	  templateUrl : 'home/hero/hero.tpl.html'
		      },
		      "home-query@app.home" : {
		    	  controller: 'FlightQueryController',
		    	  templateUrl: 'flights/query/one-row-flights-query-form.tpl.html'
		      },
		      "content@app.home" : {
		    	  template : ''
		      },
		      "hero-welcome@app.home" : {
		    	  controller: 'HomeHeroContentController',
		    	  templateUrl: 'home/hero/content/hero-welcome.tpl.html'
		      },
		      "hero-sidebar@app.home" : {
		    	  controller: 'HomeHeroSidebarController',
		    	  templateUrl: 'home/hero/sidebar/hero-sidebar.tpl.html'
		      },
		      "main-offcanvas@" : {
		    	  controller: 'OffcanvasCalendarController',
		    	  templateUrl: 'home/hero/offcanvas/calendar/offcanvas-calendar.tpl.html'
		      },
		      "overlay-offcanvas@app.home" : {
		    	  controller: 'OffcanvasFlightResultsController',
		    	  templateUrl : 'home/hero/offcanvas/flight-results/offcanvas-flight-results.tpl.html'
		      }
		    },
		    data : { 
		    	//pageTitle will be handled by parent state 'app' in appCtrl
		    	pageTitle : 'Embrace your randomness' 
		    }
		})
		.state('app.home.map', {
			views: {
			  "hero-map@app.home" : {
		    	  controller: 'FlightsMapController',
		    	  templateUrl: 'flights/map/flights-map.tpl.html'
		      }
			}
		})
		.state('app.home.map.results', {
			views: {
		      "original-search@app.home" : {
		    	  controller: 'FlightQueryController',
		    	  templateUrl: 'flights/query/two-row-flights-query-form.tpl.html'
		      },
		      "filter-options@app.home" : {
		    	  controller: 'FlightFilterController',
		    	  templateUrl: 'flights/filter/horizontal-flights-filter-form.tpl.html'
		      },
		      "flexible-results@app.home" : {
		    	  controller: 'FlexibleFlightsGridController',
		    	  templateUrl: 'flights/results/flexible-grid/flexible-flights-grid.tpl.html'
		      },
		      "results-list@app.home" : {
		    	  controller: 'FlightsListController',
		    	  templateUrl: 'flights/results/list/flights-list.tpl.html'
		      }
			}
		});
}