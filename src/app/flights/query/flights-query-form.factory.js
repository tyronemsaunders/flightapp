angular
	.module('flyingBye.flights')
	.factory('flightsQueryForm', flightsQueryForm);

flightsQueryForm.$inject = ['$window'];

function flightsQueryForm($window) {
	var form = {};
	
	form.oneForCity = false;
	
	form.budget = {};
	form.budget.amount;
	form.budget.selected = false;
	
	// flight origin
	form.origin = {};
	form.origin.type; // options: "airport" or "radius"
	form.origin.airports = []; //array of IATA codes
	form.origin.longitude;
	form.origin.latitude;
	form.origin.radius;
	form.origin.selected = false;
	
	// flight destination
	form.destination = {};
	form.destination.type; // options: "airport" or "radius"
	form.destination.airports = []; //array of IATA codes
	form.destination.longitude;
	form.destination.latitude;
	form.destination.radius;
	form.destination.selected = false;
	
	form.dates = {};
	// outbound date
	form.dates.outbound = {};
	form.dates.outbound.type; // options: "range"
	form.dates.outbound.date; // momentjs
	form.dates.outbound.min; // "DD/MM/YYYY"
	form.dates.outbound.max; // "DD/MM/YYYY"
	form.dates.outbound.selected = false;
	
	// return dates
	form['dates']['return'] = {};
	form['dates']['return']['type']; //options: "stay" or "range"
	form['dates']['return']['date']; // momentjs
	form['dates']['return']['min']; // type = stay <int>; type = "range" <date> "DD/MM/YYYY"
	form['dates']['return']['max']; // type = stay <int>; type = "range" <date> "DD/MM/YYYY"
	form['dates']['return']['selected'] = false;
	
	form.flightType = 'round'; // oneway or round
	
	form.passengers = {};
	form.passengers.adults = 1;
	form.passengers.children = 0;
	form.passengers.infants = 0;
	form.passengers.selected = true; // initialized to true because we are initialized with one adult passenger
	
	form.setBudget = setBudget;
	form.clearAirports = clearAirports;
	form.setAirport = setAirport;
	form.getAirport = getAirport;
	form.setRadius = setRadius;
	form.setDateRange = setDateRange;
	form.getDateRange = getDateRange;
	form.getTripDates = getTripDates;
	form.setStay = setStay;
	form.setFlightDate = setFlightDate;
	form.setFlightType = setFlightType;
	form.setPassengers = setPassengers;
	form.setCheapestPer = setCheapestPer;
	form.userLocationForm = userLocationForm;
	
	form.errors = {};
	form.errors.dates = {};
	form['errors']['dates']['outbound'] = false;
	form['errors']['dates']['return'] = false;
	form['errors']['passengers'] = false;
	
	form.formReady = formReady;
	
	function setBudget(budget) {
		form.budget.amount = budget;
		form.budget.selected = true;
	}
	
	function clearAirports(leg) {
		form[leg].airports = [];
		form[leg].longitude = null;
		form[leg].latitude = null;
		form[leg].radius = null;
		form[leg].selected = false;
	}
	
	function setAirport(airport, leg) {
		form[leg].type = 'airport';
		form[leg].airports.push(airport);
		form[leg].selected = true;
	}
	
	function getAirport(leg) {
		if (form[leg].airports) {
			return form[leg].airports;	
		} else {
			return null;
		}
	}
	
	function setRadius(lat, lon, rad, leg) {
		form[leg].type = 'radius';
		form[leg].longitude = lon;
		form[leg].latitude = lat;
		form[leg].radius = rad;
	}
	
	function setFlightDate(date, leg) {
		var errorMsg;
		var today = $window.moment().hour(12).minute(0).second(0).millisecond(0);
		
		if (date < today) {
			errorMsg = 'Your travel dates cannot be earlier than today.';
		} else if ((date < form.dates.outbound.date) && (leg == 'return')) {
			errorMsg = 'You cannot set your return travel date earlier than your departure date.';
		} else {
			form.dates[leg].date = date;
		}
		
		if (errorMsg) {
			form.errors.dates[leg] = errorMsg;
			form.dates[leg].selected = false;
		} else {
			form.errors.dates[leg] = false;
			form.dates[leg].selected = true;
		}
	}
	
	function setDateRange(earliest, latest, leg) {
		// parameters are momentjs date objects
		var today = $window.moment().hour(12).minute(0).second(0).millisecond(0);
		var outboundJourney = getTripDates()['outbound'];
		var returnJourney = getTripDates()['return'];
		
		form.dates[leg].type = 'range';
		
		if (leg == 'outbound') {
			if (earliest.isBefore(today)) {
				form.dates[leg].min = today.format('DD/MM/YYYY');
			} else if (earliest.isAfter(outboundJourney)) {
				form.dates[leg].min = outboundJourney.format('DD/MM/YYYY');
			} else {
				form.dates[leg].min = earliest.format('DD/MM/YYYY');
			}
			
			if (latest.isBefore(today)) {
				form.dates[leg].max = today.format('DD/MM/YYYY');
			} else if (latest.isBefore(outboundJourney)) {
				form.dates[leg].max = outboundJourney.format('DD/MM/YYYY');
			} else {
				form.dates[leg].max = latest.format('DD/MM/YYYY');
			}
			
		} else if (leg == 'return') {

			if (earliest.isBefore(today)) {
				form.dates[leg].min = today.format('DD/MM/YYYY');
			} else if (earliest.isAfter(returnJourney)) {
				form.dates[leg].min = returnJourney.format('DD/MM/YYYY');
			} else {
				form.dates[leg].min = earliest.format('DD/MM/YYYY');
			}
			
			if (latest.isBefore(today)) {
				form.dates[leg].max = today.format('DD/MM/YYYY');
			} else if (latest.isBefore(outboundJourney)) {
				form.dates[leg].max = returnJourney.format('DD/MM/YYYY');
			} else {
				form.dates[leg].max = latest.format('DD/MM/YYYY');
			}
		}
	}
	
	function getDateRange(leg) {
		var range = {
				min: form.dates[leg].min,
				max: form.dates[leg].max 
			}
		return range;
	}

	function getTripDates() {
		var dates = {};
		dates['outbound'] = form['dates']['outbound']['date'];
		dates['return'] = form['dates']['return']['date'];

		return dates;
	}
	
	function setStay(min, max) {
		//parameters are integers for the nights to day in the destination
		form['dates']['return']['min'] = min;
		form['dates']['return']['max'] = max;
	}
	
	function getStay() {
		var stay = {
				min: form.dates['return'].min,
				max: form.dates['return'].max 
			}
		return stay;
	}
	
	function setFlightType(flightType) {
		form.flightType = flightType;
	}
	
	function setCheapestPer(bool) {
		form.oneForCity = bool;
	}
	
	function setPassengers(adults, children, infants) {
		form.passengers.adults = adults;
		form.passengers.children = children;
		form.passengers.infants = infants;
		
		if (form.passengers.adults || form.passengers.children || form.passengers.infants) {
			form.passengers.selected = true;
			form.errors.passengers = false;
		} else {
			form.passengers.selected = false;
			form.errors.passengers = "Please select at least one passenger.";
		}
	}
	
	function userLocationForm(location) {
		var today = $window.moment().hour(12).minute(0).second(0).millisecond(0);
		var outboundDate = angular.copy(today).add(0, 'w').add(1, 'd');
		var returnDate = angular.copy(today).add(0, 'w').add(4, 'd');
		
		form.clearAirports('origin');
		//userLocationPromise.then(userLocationSuccess).catch(userLocationError);
		userLocationSuccess(location);
		
		function userLocationSuccess(userLocationData) {
			form.setAirport(location.airport.IATA, 'origin');
			form.setFlightType('round');
			form.setPassengers(1, 0, 0);
			//form.setCheapestPer(true);
			form.setFlightDate(outboundDate, 'outbound');
			form.setFlightDate(returnDate, 'return');
			form.setDateRange(outboundDate, outboundDate, 'outbound');
			form.setDateRange(returnDate, returnDate, 'return');
			return form;
		}
		
		function userLocationError(e) {
			console.log(JSON.stringify(e, null, 4));
		}
	}
	
	function formReady() {
		if (form.origin.selected && form.dates.outbound.selected && form.passengers.selected) {
			if (form.flightType == 'oneway') {
				return true
			} else if (form.flightType == 'round' && form['dates']['return']['selected']) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	return form;
}