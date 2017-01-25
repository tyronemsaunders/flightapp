angular
	.module('flightApp.core')
	.factory('offcanvas', offcanvas);

//offcanvas.$inject = [''];

function offcanvas() {
	offcanvas = {};
	offcanvas.visible = false;
	offcanvas.toggle = toggleOffcanvas;
	offcanvas.show = showOffcanvas;
	offcanvas.hide = hideOffcanvas;
	offcanvas.welcomeHidden = false;
	
	function toggleOffcanvas() {
		offcanvas.visible = !offcanvas.visible;
	}
	
	function showOffcanvas() {
		offcanvas.visible = true;
	}
	
	function hideOffcanvas() {
		offcanvas.visible = false;
	}
	
	return offcanvas;
}