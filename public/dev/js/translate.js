angular.module('translate', ['pascalprecht.translate']).config(function($translateProvider){

	$translateProvider.useStaticFilesLoader({
		prefix: '/i18n/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escape');

});