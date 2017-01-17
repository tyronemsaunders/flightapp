/**
 * @desc datepicker directive
 * @example <input selected="day" datepicker></calendar>
 * 
 */

angular
	.module('flyingBye')
	.directive('datepicker', datepicker);

// directive factory function returns an object with options to tell $compile how the directive should behave
function datepicker() {
	var directive = {
			restrict: 'A', // only matches attribute name
			templateUrl: 'components/datepicker/datepicker.tpl.html',
			link: link,
			scope: {
				datepicker: "@", // used for a unique id to toggle the datepicker.  The "datepicker" attribute of the directive definition matches that of the template.
				selected: "=" // "selected" corresponds to the directives isolate scope, "=" tells $compile to bind to selected on the outer scope <input selected="day" datepicker></calendar>
			}
	};
	return directive;
	
	// link registers DOM listeners and updates the DOM
	// scope in this directive references components/datepicker/datepicker.tpl.html
	function link(scope) {
		// set the selected day based on the day selected in the controller or use today
		scope.selected = setMidday(scope.selected || moment());
		// copy the selected date to set the month
		scope.month = scope.selected.clone();
		
		// start the calendar on the selected day's month
		var monthStart = scope.selected.clone();
		// generate the current start date for the calendar's initial month
		monthStart.date(1);
		//start the month on a Sunday could be last few days of the month preceeding the selected date
		setMidday(monthStart.day(0));
		// build the selected month
		// build month sets a list of weeks on the scope
		buildMonth(scope, monthStart, scope.month)
		
		// select on ng-click
		scope.select = function(day) {
			scope.selected = day.date;
		}
		
		scope.previousMonth = function() {
			var previous = scope.month.clone();
			// set "previous" to the month before the selected month
			setMiddaySunday(previous.month(previous.month()-1).date(1));
			//set selected month (on the scope object) to the previous month
			scope.month.month(scope.month.month()-1);
			buildMonth(scope, previous, scope.month);
		}
		
		scope.nextMonth = function() {
			var next = scope.month.clone();
			setMiddaySunday(next.month(next.month()+1).date(1));
			scope.month.month(scope.month.month()+1);
			buildMonth(scope, next, scope.month);
		}
		
		// set the time to noon
		function setMidday(date) {
			return date.hour(12).minute(0).second(0).millisecond(0);
		}
		
		function setMiddaySunday(date) {
			return date.day(0).hour(12).minute(0).second(0).millisecond(0);
		}
		
		function buildMonth(scope, start, month) {
			scope.weeks = [];
			var done = false;
			//copy the start of the calendar month (1st of the month or Sunday of preceeding months last week)
			var date = start.clone();
			//return zero-indexed month of the selected date, jan = 0
			var monthIndex = date.month();
			var count = 0;
			while (!done) {
				// add and array of days to the weeks array
				scope.weeks.push({
					// date is the first sunday
					days: buildWeek(date.clone(), month)
				});
				// add one week to the existing moment
				date.add(1, 'w');
				// increment count
				// exit loop when week is greater than 3 and date.add() pushes into the next month
				done = count++ > 2 && monthIndex !== date.month();
				monthIndex = date.month();
			}
		}
		
		// date passed in is the sunday that starts the week
		// month is the month of the selected day
		function buildWeek(date, month) {
			var days = [];
			for (var i = 0; i < 7; i++) {
				days.push({
					// get the day of the month "dddd" = full day name
					name: date.format("dd").substring(0, 1),
					// get the number date of the week
					number: date.date(),
					// month of displayed calendar might not be the same as the selected month
					isCurrentMonth: date.month() === month.month(),
					// check if the calendar day is today
					isToday: date.isSame(new Date(), 'day'),
					// store the momentjs object day of the week
					date: date
				});
				date = date.clone();
				// increment the day of the week
				date.add(1, 'd');
			}
			return days;
		}
	}
}