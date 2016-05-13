require.config({
	baseUrl: "js/",
	paths: {
		'jquery'              : '3p/jquery',
		'underscore'          : '3p/underscore',
		'angular'             : '3p/angular',
		'aResource'           : '3p/angular-resource',
		'aRouter'             : '3p/angular-ui-router'
	},
	shim: {
		'controllers' : {deps: ['angular']},
		'services'    : {deps: ['angular']},
		'aResource'   : {deps: ['angular']},
		'aRouter'     : {deps: ['angular']},
		'app'         : {deps: ['jquery', 'underscore', 'aRouter', 'aResource', 'controllers', 'services']}
	}
});

require(['app']);