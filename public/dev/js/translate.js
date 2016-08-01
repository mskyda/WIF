angular.module('translate', ['pascalprecht.translate']).config(function($translateProvider){

	$translateProvider.useStaticFilesLoader({
		prefix: '/js/i18n/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escape');

});