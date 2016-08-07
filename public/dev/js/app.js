define([ 'ngTranslate', 'translateLoader', 'translate', 'router', 'controllers/controllers', 'services/services' ], function () {

	angular.module('app', [ 'translate', 'router', 'controllers', 'services' ]).run(function ($state) { $state.go('search'); });

	angular.bootstrap(document.documentElement, ['app']);

});