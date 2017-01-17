angular
	.module('flyingBye')
	.controller('HomeHeroController', HomeHeroController);

HomeHeroController.$inject = ['$scope', '$state', '$window', 'offcanvas'];

function HomeHeroController($scope, $state, $window, offcanvas) {
	$scope.init = init;
	$scope.peel;
	$scope.tween;
	$scope.offcanvasVisible = offcanvasVisible;
	
	function init() {
		var p = new $window.Peel('#hero-content');
		
		p.setCorner(Peel.Corners.TOP_LEFT);
		p.setPeelPosition(100, 100);
		p.setFadeThreshold(0.9);
		p.setPeelPath(100, 100, p.width, p.height);
		p.t = 0;
		var tween = new $window.TweenLite(p, 0.5, {
			t: 1,
			paused: true,
			ease: Power2.easeIn,
			onUpdate: function() {
				p.setTimeAlongPath(this.target.t);
				if (p.getAmountClipped() === 1) {
					p.removeEvents();
				}
			}
		});
		
		$scope.peel = p;
		$scope.tween = tween;
		
		var clickTarget = angular.element(document.querySelector('#map-preview'));
		$scope.peel.handlePress(function(evt) {
			//start the animation
			clickTarget[0].style.display = 'none';
			$scope.tween.seek(0);
			$scope.tween.play();
		}, clickTarget[0]);
	}

	function offcanvasVisible() {
		if (offcanvas.visible) {
			return true;
		}
		return false;
	}
	
	$scope.init();
}