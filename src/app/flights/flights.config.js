angular
	.module('flightApp.flights')
	.config(flightsConfig);

flightsConfig.$inject = ['$stateProvider'];

function flightsConfig($stateProvider) {
	$stateProvider
		.state('app.flights', {
			url: '/flights',
		    views: {
		      "main@" : {
		    	  controller: 'FlightsController',
		    	  templateUrl: 'flights/flights.tpl.html'
		      },
		      "flights-page-form@app.flights": {
		    	  controller: 'FlightQueryController',
		    	  templateUrl: 'flights/query/one-row-flights-query-form.tpl.html'
		      }
		    },
		    data: { 
		    	pageTitle: 'Flights' 
		    }
		})
		.state('app.flights.search', {
			url: '/:city_pair/:outbound/:return',
			views: {
				"main@": {
					controller: 'FlightsSearchController',
					templateUrl: 'flights/search/flights-search.tpl.html'
				},
				"flights-search-map@app.flights.search": {
					controller: 'FlightsMapController',
			    	templateUrl: 'flights/map/flights-map.tpl.html'
				},
				"flights-search-query@app.flights.search": {
					controller: 'FlightQueryController',
			    	templateUrl: 'flights/query/one-row-flights-query-form.tpl.html'
				},
				"flights-search-filter@app.flights.search": {
					controller: 'FlightFilterController',
			    	templateUrl: 'flights/filter/horizontal-flights-filter-form.tpl.html'
				},
				"flights-search-flexible-grid@app.flights.search": {
					controller: 'FlexibleFlightsGridController',
			    	templateUrl: 'flights/results/flexible-grid/flexible-flights-grid.tpl.html'
				},
				"flights-search-list@app.flights.search": {
					controller: 'FlightsListController',
			    	templateUrl: 'flights/results/list/flights-list.tpl.html'
				}
			}
		})
		.state('app.flights.map', {
			url: '/map?refresh',
			views: {
				"main@": {
					templateUrl: 'flights/map/fullscreen-map.tpl.html'
				},
				"fullscreen-map@app.flights.map": {
					controller: 'FlightsMapController',
			    	templateUrl: 'flights/map/flights-map.tpl.html'
				}
			}
		});
}