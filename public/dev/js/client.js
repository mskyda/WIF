define([
	'ngTranslate',
	'translateLoader'
], function () {

	angular.module('app', [ 'router', 'translate', 'controllers', 'services' ]).run(function ($state) {

		$state.go('search');

	});

	angular.bootstrap(document.documentElement, ['app']);

});