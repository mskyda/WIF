angular.module('translations', ['pascalprecht.translate']).config(function ($translateProvider) {

	$translateProvider.translations('EN', {
		slogan: 'From fisher to fisher.'
	});

	$translateProvider.translations('DE', {
		slogan: 'Angler zum Angler.'
	});

	$translateProvider.preferredLanguage('EN');

});
