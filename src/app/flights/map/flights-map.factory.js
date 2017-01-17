angular
	.module('flyingBye.flights')
	.factory('flightsMap', flightsMap);

flightsMap.$inject = ['$rootScope', '$window', '$state', '$q', '$compile', '$templateCache', 'offcanvas', 'airportsList', 'flightsQueryForm', 'flightsQuery', 'spinnerService'];

function flightsMap($rootScope, $window, $state, $q, $compile, $templateCache, offcanvas, airportsList, flightsQueryForm, flightsQuery, spinnerService) {
	var flightsMap = {};
	
	flightsMap.init = init;
	
	flightsMap.flights;
	flightsMap.map;
	flightsMap.flightsLayer;
	flightsMap.airportsLayer;
	flightsMap.originMarker;
	
	flightsMap.initializeMap = initializeMap;
	flightsMap.populateMap = populateMap;
	flightsMap.createAirportsLayer = createAirportsLayer;
	flightsMap.createOriginMarker = createOriginMarker;
	flightsMap.refreshMap = refreshMap;
	flightsMap.clearMap = clearMap;

	
	function init() {
		
		//set the path of the icons
		$window.L.Icon.Default.imagePath = "assets/media/images/";
		
		// assume a flights query has been performed before running (app.controller.js)
		flightsMap.flights = flightsQuery.getCheapestPerCity(flightsQuery.flights) || [];
		flightsMap.map = initializeMap(flightsMap.flights[0].origin);
		
		flightsMap.airportsLayer = flightsMap.createAirportsLayer();
		flightsMap.airportsLayer.addTo(flightsMap.map);
		
		flightsMap.originMarker = createOriginMarker(flightsMap.map, flightsMap.flights, flightsMap.airportsLayer);
		
		flightsMap.flightsLayer = flightsMap.populateMap(flightsMap.flights);
		flightsMap.flightsLayer.addTo(flightsMap.map);
		
		var deferred = $q.defer();
		deferred.resolve(flightsMap.map);
		return deferred.promise;
	}
	
	function initializeMap(originCity) {
		// setup the map
		var map = $window.L.map('flights-map', {
			preferCanvas: true,
			center:[originCity.latitude, originCity.longitude],
			zoom: 4
		});
		
		//setup the base layer
		var baseTileLayer = $window.L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: ['a','b','c'],
			maxZoom: 18
		});
		
		baseTileLayer.addTo(map);
		flightsMap.map = map;
		return map;
	}
	
	function populateMap(flights) {
		//setup markers and popups
		var destinations = [];
		
		var markerCluster = $window.L.markerClusterGroup({
			iconCreateFunction: function(cluster) {
				return markerClusterIcon(cluster);
			},
			showCoverageOnHover: false
		});
		
		var destinationIcon = $window.L.icon({
			iconUrl: 'assets/media/icons/landing-32x32.png',
			iconSize: [32, 32],
			iconAnchor: [16, 16],
			popupAnchor: [16, -2]
		});
		
		var Destination = $window.L.Marker.extend({
			options: {
				"city": '', // flight.destination.city
				"country": '', // flight.destination.country.name
				"IATA": '', // flight.destination.airport
				'price': '' // flight.price
			}
		});
		
		console.log('------');
		console.log("Populating map with " + flights.length + " flights");
		console.log('------');
		for (var i = 0; i < flights.length; i++) {
			
			var newScope = $rootScope.$new(); // use newScope to use a different scope among all popups
			newScope.flight = flights[i];
			newScope.flightDateRangeString = flightDateRangeString
			newScope.toggleDestinationResults = toggleDestinationResults
			
			var marker = new Destination([flights[i].destination.latitude, flights[i].destination.longitude], {
				icon: destinationIcon,
				city: flights[i].destination.city,
				country: flights[i].destination.country,
				IATA: flights[i].destination.airport,
				price: flights[i].destination.price
			});
			
			var popupTemplate = $templateCache.get('flights/map/popups/popup.tpl.html');
			var template = angular.element(popupTemplate);
			var linkFn = $compile(template); // a link function which is used to bind template (a DOM element/tree) to a scope
			var element = linkFn(newScope);
			
			marker.bindTooltip(newScope.flight.destination.city + " from $" + newScope.flight.price);
			marker.bindPopup(element[0], {
				maxWidth: 600,
				minWidth: 400
			});
			
			marker.on('click', function(event) {
				offcanvas.hide();
			});
			
			//markerCluster.addLayer(marker);
			destinations.push(marker);
			console.log("Adding Destination Marker: " + newScope.flight.destination.airport + " " + newScope.flight.destination.city + " " + newScope.flight.price);
		}
		flightsMap.flightsLayer = $window.L.layerGroup(destinations);
		//flightMap.flightsLayer = markerCluster;
		return flightsMap.flightsLayer;
		
		function markerClusterIcon(cluster) {
			var icon;
			var minPrice;
			
			for (var i = 0; i < cluster.getAllChildMarkers().length; i++) {
				if (!minPrice) {
					minPrice = cluster.getAllChildMarkers()[i].options.price;
				} else if (minPrice > cluster.getAllChildMarkers()[i].options.price){
					minPrice = cluster.getAllChildMarkers()[i].options.price;
				}
			}
			
			icon = $window.L.divIcon({
				className: 'destination-icon',
				html: '<div class="row align-middle">' + 
					      '<div class="column small-6">' +
			                  '<i class="fa fa-plane fa-2x" aria-hidden="true"></i>' +
			              '</div>' +
			              '<div class="column small-6">' +
			                  '<p>Flights from</p>' +
			                  '<p> $' + minPrice + '</p>' +
			              '</div>' +
			          '</div>'
			});
			
			return icon;
		}
	}
	
	function createAirportsLayer() {
		
		// assume airportsList.everyAirport has been populated by app.controller.js
		var airports = airportsList.everyAirport;
		var geojsonFeatures = [];
		
		for (var i = 0; i < airports.length; i++) {
			var geojsonFeature = {
				"type" : "Feature",
				"properties" : {
					"name": airports[i].name,
					"city": airports[i].city,
					"country": airports[i].country,
					"IATA": airports[i].IATA,
					"ICAO": airports[i].ICAO,
			        "latitude": airports[i].latitude,
			        "longitude": airports[i].longitude,
			        "altitude": airports[i].altitude,
			        "timezone": airports[i].timezone,
			        "DST": airports[i].DST,
			        "tz_database_timezone": airports[i].tz_database_timezone,
			        "formatted": airports[i].formatted
				},
				"geometry" : {
					"type" : "Point",
					"coordinates" : [airports[i].latitude, airports[i].longitude]
				}
			}
			geojsonFeatures.push(geojsonFeature);
		}
		
		var geojsonFeatureCollection = {
				"type" : "FeatureCollection",
				"features" : geojsonFeatures
		}
		
		flightsMap.airportsLayer = $window.L.geoJSON(geojsonFeatureCollection, {
			pointToLayer: function(feature, latlng) {
				return pointToLayer(feature, latlng);
			}
		});
		
		function pointToLayer(feature, latlng) {
			var circleMarkerOptions = {
				radius: 2.5,
				color: '#A1A398',
				opacity: 1.0,
				fillColor: '#A1A398',
				fillOpacity: 0.5,
				className: 'airport-circle-marker',
				clickable: false,
				interactive: false
			};
			
			var Airport = $window.L.CircleMarker.extend({
				options: {
					title: feature.properties.formatted	,
					name: feature.properties.name,
					city: feature.properties.city,
					country: feature.properties.country,
					IATA: feature.properties.IATA,
					ICAO: feature.properties.ICAO,
			        latitude: feature.properties.latitude,
			        longitude: feature.properties.longitude,
			        altitude: feature.properties.altitude,
			        timezone: feature.properties.timezone,
			        DST: feature.properties.DST,
			        tz_database_timezone: feature.properties.tz_database_timezone,
			        formatted: feature.properties.formatted	
				}
			});
			
			return new Airport([feature.properties.latitude, feature.properties.longitude], circleMarkerOptions);
		}

		return flightsMap.airportsLayer;
	}

	function createOriginMarker(map, flights, guideLayer) {
		var originIcon = $window.L.icon({
			iconUrl: 'assets/media/icons/takeoff-32x32.png',
			iconSize: [32, 32],
			iconAnchor: [16, 16],
			popupAnchor: [16, -2]
		});
		
		var originMarker = $window.L.marker([flights[0].origin.latitude, flights[0].origin.longitude], {
			icon: originIcon,
			draggable: true,
			riseOnHover: true,
			riseOffset: 1500,
			zIndexOffset: 1000
		});
		
		originMarker.bindTooltip(flights.length + " flights from " + flights[0].origin.city + " - " + flights[0].origin.airport);
		
		var snapOptions = {
			snapDistance: 50	
		};
		
		originMarker.addTo(map);
		originMarker.snapediting = new $window.L.Handler.MarkerSnap(map, originMarker, snapOptions);
		originMarker.snapediting.addGuideLayer(guideLayer);
		originMarker.snapediting.enable();
		
		originMarker.on('unsnap', function(event) {
			flightsQueryForm.clearAirports('origin');
		});
		
		originMarker.on('snap', function(event) {
			flightsQueryForm.clearAirports('origin');
			flightsQueryForm.setAirport(event.layer.options.IATA, 'origin');	
		});
		
		originMarker.on('dragend', function(event) {
			flightsMap.refreshMap(map, flightsMap.flightsLayer);
		});
		
		originMarker.on('click', function(event) {
			offcanvas.hide();
		});
		
		flightsMap.originMarker = originMarker;
		flightsMap.map = map;
		return flightsMap.originMarker;
	}
	
	function refreshMap(map, flightsLayer) {
		spinnerService.show('mapSpinner');
		spinnerService.show('offcanvasResultsSpinner');
		
		map = flightsMap.clearMap(map, flightsLayer);
		
		var flightsPromise = flightsQuery.getFlightsFromSkypicker();
		flightsPromise
			.then(function(flights) {
				flightsQuery.setFlights(flights);
				flightsMap.flights = flightsQuery.getCheapestPerCity(flightsQuery.flights);
				
				// change tooltip on origin marker
				flightsMap.originMarker.unbindTooltip().bindTooltip(flights.length + " flights from " + flights[0].origin.city + " - " + flights[0].origin.airport);
				
				flightsMap.flightsLayer = flightsMap.populateMap(flightsMap.flights);
				map.addLayer(flightsMap.flightsLayer);
				
				// re-center the map
				var latLng = $window.L.latLng(flightsMap.flights[0].origin.latitude, flightsMap.flights[0].origin.longitude)
				map.setView(latLng);
				
				flightsMap.map = map;
				return flightsMap.map;
			})
			.catch(function(err) {
				console.log(err);
			})
			.finally(function() {
				spinnerService.hide('mapSpinner');
				spinnerService.hide('offcanvasResultsSpinner');
			});
	}
	
	function clearMap(map, layer) {
		map.removeLayer(layer);
		flightsMap.map = map;
		return map;
	}
	
	function toggleDestinationResults(airport) {
		//toggle the offcanvas results
		offcanvas.show();
		
		// show offcanvasResultsSpinner
		spinnerService.show('offcanvasResultsSpinner');
		
		// set destination in the flights query form
		flightsQueryForm.clearAirports('destination');
		flightsQueryForm.setAirport(airport, 'destination');
		
		// create flexible flight dates
		var tripDates = flightsQueryForm.getTripDates();
		var dateFrom = angular.copy(tripDates['outbound']).subtract(3, 'd');
		var dateTo = angular.copy(tripDates['outbound']).add(3, 'd');
		var returnFrom = angular.copy(tripDates['return']).subtract(3, 'd');
		var returnTo = angular.copy(tripDates['return']).add(3, 'd');
		
		// set date range in the flights query form
		flightsQueryForm.setDateRange(dateFrom, dateTo, 'outbound');
		flightsQueryForm.setDateRange(returnFrom, returnTo, 'return');
		
		//run the flights query
		var flightsPromise = flightsQuery.getFlightsFromSkypicker();
		flightsPromise
			.then(function(flights) {
				flightsQuery.setFlights(flights);
				$state.go('app.home.hero.results');
			})
			.catch(function(error) {
				console.log(error);
			})
			.finally(function() {
				spinnerService.hide('offcanvasResultsSpinner');
			});
	}
	
	function flightDateRangeString(flight) {
		
		var clientTzDeparture = $window.moment.unix(flight.outbound_flight_time.departure_local);
		if (flight.return_flight_time.arrival_local) {
			var clientTzReturn = $window.moment.unix(flight.return_flight_time.arrival_local);
			return clientTzDeparture.format("MMM DD") + " - " + clientTzReturn.format("MMM DD");
		} else {
			return clientTzDeparture.format("MMM DD");
		}
	}
	
	return flightsMap;
}