angular.module('app', ['router', 'controllers', 'services', 'translations']).run(function($state){

	$state.go('search');

});

angular.bootstrap(document.documentElement, ['app']);