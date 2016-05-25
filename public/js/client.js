angular.module('wif',['ui.router','ngResource', 'ngCookies', 'controllers','services']).config(function($stateProvider){

	$stateProvider
		.state('search',{
			url:'/search',
			templateUrl:'tpl/search.tpl',
			controller:'SearchPageController'
		}).state('manage',{
		   url:'/manage',
		   templateUrl:'tpl/manage.tpl',
		   controller:'ManagePageController'
		}).state('about',{
			url:'/about',
			templateUrl:'tpl/about.tpl',
			controller:'AboutPageController'
		});

}).run(function($state){
	$state.go('search');
});

angular.bootstrap(document.documentElement, ['wif']);