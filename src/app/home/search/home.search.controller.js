angular
	.module('flyingBye.home')
	.controller('HomeSearchController', HomeSearchController);

HomeSearchController.$inject = ['$scope', 'airportsList'];

function HomeSearchController($scope, airportsList) {
	$scope.toggle = false;
	//$scope.selectedItem = [];
	//$scope.searchText = "";
	$scope.itemText = itemText;
	$scope.selectedItemChange = selectedItemChange;
	//$scope.airportsList = airportsList.query();
	$scope.searchTextChange = searchTextChange;
	$scope.querySearch = querySearch;
	$scope.departureDate = new Date();
	$scope.returnDate = new Date;
	$scope.today = new Date;
	
	
	function querySearch(str) {
		return airportsList.query().$promise.then(function(response) {
			var results = str ? response.filter(filterForAirportsList(str)) : response;
			return results;
		});
	}
	
	function searchTextChange(str) {
		console.log('Search text changed to ' + str);
	}
	
	function itemText(item) {
		var summary = item.city + ", " + item['country'] + " - " + item['name'] + " (" + item['IATA'] + ")";
		return summary;
	}
	
	function selectedItemChange(item) {
		// log the selectedItemChange in the console;
		console.log('Item changed to: ' + JSON.stringify(item, null, 4));
	}
		
	function filterForAirportsList(string) {
		var query = string.toLowerCase();
		
		return function filterFn(airport) {
			var summary = airport.city + ", " + airport.country + " - " + airport.name + " (" + airport.IATA + ")";
			return (summary.toLowerCase().indexOf(query) >= 0);
		};
	}
}
