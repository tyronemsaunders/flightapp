angular
	.module('flightApp.home')
	.controller('OffcanvasCalendarController', OffcanvasCalendarController);

OffcanvasCalendarController.$inject = ['$scope', '$window', 'flightsQueryForm'];

function OffcanvasCalendarController($scope, $window, flightsQueryForm) {
	$scope.init = init;
	$scope.dates = {};
	$scope['dates']['outbound'] = {};
	$scope['dates']['outbound']['date'];
	$scope['dates']['return'] = {};
	$scope['dates']['return']['date'];
	$scope.hideReturnCalendar;
	
	$scope.errors = {};
	$scope['errors']['dates'] = {};
	$scope['errors']['dates']['outbound'];
	$scope['errors']['dates']['return'];

	
	function init() {
		$scope['dates']['outbound']['date'] = flightsQueryForm.getTripDates()['outbound'];
		$scope['dates']['return']['date'] = flightsQueryForm.getTripDates()['return'];
		$scope['errors']['dates']['outbound'] = false;
		$scope['errors']['dates']['return'] = false;
		$scope.hideReturnCalendar = true;
	}
	
	function returnCalendarStatus() {
		if (flightsQueryForm.flightType == 'round' && flightsQueryForm.dates.outbound.selected) {
			$scope.hideReturnCalendar = false;
		} else {
			$scope.hideReturnCalendar = true;
		}
	}
	
	///// Broadcast listeners
	function flightDateSet(evt, date, leg, errorMsg) {
		if (errorMsg) {
			$scope['errors']['dates'][leg] = errorMsg;
		} else {
			$scope['dates'][leg]['date'] = date;
		}
		
		returnCalendarStatus();
	}
	
	$scope.init();
	
	// watch for changes to the flightsQueryForm
	$scope.$on('flightDateSet', flightDateSet);
	
	//use watches because ng-model is not being used on the calendar directive
	$scope.$watch('dates.outbound.date', function(newValue, oldValue) {
		if (newValue) {
			flightsQueryForm.setFlightDate(newValue, 'outbound');
			flightsQueryForm.setDateRange(newValue, newValue, 'outbound');
			$scope['errors']['dates']['outbound'] = flightsQueryForm['errors']['dates']['outbound'];	
		}
	});
	
	$scope.$watch('dates.return.date', function(newValue, oldValue) {
		if (newValue) {
			flightsQueryForm.setFlightDate(newValue, 'return');
			flightsQueryForm.setDateRange(newValue, newValue, 'return');
			$scope['errors']['dates']['return'] = flightsQueryForm['errors']['dates']['return'];	
		}
	});
}