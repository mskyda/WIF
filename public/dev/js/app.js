define([ 'ngTranslate', 'translateLoader', 'router', 'controllers', 'services', 'translate' ], function () {

	angular.module('app', [ 'router', 'controllers', 'services', 'translate' ]).run(function ($state) {

		$state.go('search');

	});

	angular.bootstrap(document.documentElement, ['app']);

});