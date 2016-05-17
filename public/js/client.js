angular.module('wif',['ui.router','ngResource','wif.controllers','wif.services']).config(function($stateProvider){

	$stateProvider.state('spots',{
		url:'/spots',
		templateUrl:'tpl/spots.tpl',
		controller:'SpotsPageController'
	}).state('add',{
	   url:'/spots/add',
	   templateUrl:'tpl/add.tpl',
	   controller:'AddPageController'
	}).state('about',{
		url:'/about',
		templateUrl:'tpl/about.tpl',
		controller:'AboutPageController'
	});

}).run(function($state){$state.go('spots')});