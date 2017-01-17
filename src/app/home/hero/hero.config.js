angular
	.module('flyingBye.home')
	.config(homeHeroConfig);

homeHeroConfig.$inject = ['$stateProvider'];

function homeHeroConfig($stateProvider) {
	$stateProvider
	
	.state('app.home.hero', {
		views: {
			"overlay-offcanvas@app.home" : {
				controller: 'OffcanvasFlightResultsController',
				templateUrl : 'home/hero/offcanvas/flight-results/offcanvas-flight-results.tpl.html'
		    },
			"hero-welcome@app.home" : {
				controller: 'HomeHeroContentController',
				templateUrl: 'home/hero/content/hero-welcome.tpl.html'
		    },
		    "hero-map@app.home" : {
		    	controller: 'FlightsMapController',
				templateUrl: 'flights/map/flights-map.tpl.html'
		    },
		    "hero-sidebar@app.home" : {
		    	controller: 'HomeHeroSidebarController',
		    	templateUrl: 'home/hero/sidebar/hero-sidebar.tpl.html'
		    },
		    "main-offcanvas@" : {
		    	controller: 'OffcanvasCalendarController',
		    	templateUrl: 'home/hero/offcanvas/calendar/offcanvas-calendar.tpl.html'
		    }
		}
	})
	.state('app.home.hero.map', {
		views: {
			"hero-map@app.home" : {
		    	controller: 'FlightsMapController',
				templateUrl: 'flights/map/flights-map.tpl.html'
		    }
		}
	})
	.state('app.home.hero.results', {
		views: {
			"original-search@app.home.hero" : {
				controller: 'FlightResultsController',
				templateUrl: 'flights/query/horizontal-flights-query-form.tpl.html'
			},
			"filter-options@app.home.hero" : {
				controller: 'FlightFilterController',
				templateUrl: 'flights/filter/horizontal-flights-filter-form.tpl.html'
			},
			"flexible-results@app.home.hero" : {
				controller: 'FlexibleFlightsGridController',
				templateUrl: 'flights/results/flexible-grid/flexible-flights-grid.tpl.html'
			},
			"results-list@app.home.hero" : {
				template: 'flights/results/list/flights-list.tpl.html'
			}
		}
	});
}