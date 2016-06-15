angular.module('wif',['ui.router','ngResource', 'ngCookies', 'controllers','services']).config(function($stateProvider){

	$stateProvider
		.state('search',{
			url:'/search',
			templateUrl:'tpl/search.tpl',
			controller:'SearchSpotsController'
		}).state('manage',{
		   url:'/manage',
		   templateUrl:'tpl/manage.tpl',
		   controller:'ManageSpotsController'
		}).state('about',{
			url:'/about',
			templateUrl:'tpl/about.tpl'
		});

}).run(function($state){
	$state.go('search');
});

angular.bootstrap(document.documentElement, ['wif']);