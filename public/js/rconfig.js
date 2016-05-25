require.config({
	baseUrl: "/js",
	paths: {
		'angular'    : '3p/angular/angular.min',
		'ngResource' : '3p/angular-resource/angular-resource.min',
		'ngCookies'  : '3p/angular-cookies/angular-cookies.min',
		'uiRouter'   : '3p/angular-ui-router/release/angular-ui-router.min'
	},
	shim: {
		'controllers' : {deps: ['angular']},
		'services'    : {deps: ['angular']},
		'ngResource'  : {deps: ['angular']},
		'ngCookies'   : {deps: ['angular']},
		'uiRouter'    : {deps: ['angular']},
		'client'      : {deps: ['ngResource', 'ngCookies', 'uiRouter', 'controllers', 'services']}
	}
});

require(['client']);