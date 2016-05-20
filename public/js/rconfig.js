require.config({
	baseUrl: "/js",
	paths: {
		'angular'             : '3p/angular/angular.min',
		'aResource'           : '3p/angular-resource/angular-resource.min',
		'aRouter'             : '3p/angular-ui-router/release/angular-ui-router.min'
	},
	shim: {
		'controllers' : {deps: ['angular']},
		'services'    : {deps: ['angular']},
		'aResource'   : {deps: ['angular']},
		'aRouter'     : {deps: ['angular']},
		'client'      : {deps: ['aRouter', 'aResource', 'controllers', 'services']}
	}
});

require(['client']);