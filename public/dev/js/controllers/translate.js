angular.module('controllers').controller('TranslateController', function ($scope, $translate, $cookies) {

	var browserLang = (navigator.language || navigator.userLanguage).slice(0, 2);

	$scope.langs = {
		'en': 'English',
		'ru': 'Русский',
		'de': 'Deutsch'
		/* 'pl': 'Polski' */
	};

	$scope.siteLang = $cookies.get('wif.siteLang') || ($scope.langs[browserLang] ? browserLang : 'en');

	$scope.$watch('siteLang', function () {

		if ($scope.siteLang !== $translate.use()) {

			$cookies.put('wif.siteLang', $scope.siteLang);

			$translate.use($scope.siteLang);

		}

	});

});