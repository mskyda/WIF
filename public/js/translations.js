angular.module('translations', ['pascalprecht.translate']).config(function($translateProvider){

	$translateProvider.useStaticFilesLoader({
		prefix: '/i18n/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escape');

	var availableLangs = ['en', 'ru'/*, 'de', 'pl'*/],
		browserLang = (navigator.language || navigator.userLanguage).slice(0,2);

	$translateProvider.preferredLanguage(availableLangs.indexOf(browserLang) !== -1 ? browserLang : availableLangs[0]);
});
