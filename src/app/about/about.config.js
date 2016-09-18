angular
	.module('ngSassFoundation.about')
	.config(aboutConfig);

aboutConfig.$inject = ['$stateProvider'];

function aboutConfig($stateProvider) {
	$stateProvider
	
		.state('app.about', {
		    url : '/about',
		    views : {
		      "main@" : {
		    	  controller : 'AboutController',
		    	  templateUrl : 'about/about.tpl.html'
		      }
		    },
		    data : { 
		    	pageTitle : 'What is It?' 
		    }
		});
}