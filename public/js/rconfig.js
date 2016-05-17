require.config({
	baseUrl: "/js",
	paths: {
		'jquery'              : '3p/jquery/dist/jquery.min',
		'underscore'          : '3p/underscore/underscore-min',
		'angular'             : '3p/angular/angular',
		'aResource'           : '3p/angular-resource/angular-resource.min',
		'aRouter'             : '3p/angular-ui-router/release/angular-ui-router.min'
	},
	shim: {
		'controllers' : {deps: ['angular']},
		'services'    : {deps: ['angular']},
		'aResource'   : {deps: ['angular']},
		'aRouter'     : {deps: ['angular']},
		'client'      : {deps: ['jquery', 'underscore', 'aRouter', 'aResource', 'controllers', 'services']}
	}
});

require(['client']);