require.config({
	baseUrl: "js/",
	paths: {
		'jquery'           : '3p/jquery',
		'underscore'       : '3p/underscore',
		'angular'          : '3p/angular'
	},
	shim: {
		'app': {deps: ['jquery', 'underscore', 'angular']}
	}
});

require(['app']);