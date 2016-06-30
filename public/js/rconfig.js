require.config({
	baseUrl: "/js",
	paths: {
		'angular'         : '3p/angular/angular.min',
		'ngResource'      : '3p/angular-resource/angular-resource.min',
		'ngCookies'       : '3p/angular-cookies/angular-cookies.min',
		'uiRouter'        : '3p/angular-ui-router/release/angular-ui-router.min',
		'translate'       : '3p/angular-translate/angular-translate.min',
		'translateLoader' : '3p/angular-translate-loader-static-files/angular-translate-loader-static-files.min'
	},
	shim: {
		'translate'       : {deps: ['angular']},
		'uiRouter'        : {deps: ['angular']},
		'ngResource'      : {deps: ['angular']},
		'ngCookies'       : {deps: ['angular']},
		'translateLoader' : {deps: ['translate']},
		'translations'    : {deps: ['translateLoader']},
		'router'          : {deps: ['uiRouter']},
		'services'        : {deps: ['ngResource']},
		'controllers'     : {deps: ['ngCookies']},
		'client'          : {deps: ['router', 'controllers', 'services', 'translations']}
	}
});

require(['client']);