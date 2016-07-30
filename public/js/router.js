angular.module('router', ['ui.router']).config(function ($stateProvider) {

	$stateProvider
		.state('search', {
			url        : '/search/:spotID',
			templateUrl: 'tpl/search.tpl',
			controller : 'SearchSpotsController'
		}).state('manage', {
			url        : '/manage/',
			templateUrl: 'tpl/manage.tpl',
			controller : 'ManageSpotsController'
		}).state('about', {
			url        : '/about/',
			templateUrl: 'tpl/about.tpl'
		});

});