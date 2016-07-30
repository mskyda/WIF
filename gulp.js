(function (gulp, gulpLoadPlugins) {

	'use strict';

	var	glp = gulpLoadPlugins({ pattern: '*', lazy: true });

	gulp.task('default', function (cb) {

		glp.runSequence('lint', /* 'test', */'build', cb);

	});

	gulp.task('build', function (cb) {

		glp.runSequence('js', cb);

	});

	gulp.task('lint', function () {
		return gulp.src([
			'**/*.js',
			'!public/dev/js/3p/**/*.js',
			'!node_modules/**/*.js',
			'!public/dist/**/*.js'
		])
			.pipe(glp.eslint())
			.pipe(glp.eslint.format())
			.pipe(glp.eslint.failAfterError());
	});

	gulp.task('js', function (cb) {

		require('requirejs').optimize({
			optimize: 'uglify2', // method
			appDir  : 'public/dev/js', // input
			baseUrl : '.', // path
			dir     : 'public/dist/js', // output

			paths: {
				'angular'        : '3p/angular/angular.min',
				'ngResource'     : '3p/angular-resource/angular-resource.min',
				'ngCookies'      : '3p/angular-cookies/angular-cookies.min',
				'uiRouter'       : '3p/angular-ui-router/release/angular-ui-router.min',
				'ngTranslate'    : '3p/angular-translate/angular-translate.min',
				'translateLoader': '3p/angular-translate-loader-static-files/angular-translate-loader-static-files.min'
			},
			shim: {
				'ngTranslate'    : { deps: ['angular']},
				'uiRouter'       : { deps: ['angular']},
				'ngResource'     : { deps: ['angular']},
				'ngCookies'      : { deps: ['angular']},
				'translateLoader': { deps: ['ngTranslate']},
				'translate'      : { deps: ['translateLoader']},
				'router'         : { deps: ['uiRouter']},
				'services'       : { deps: ['ngResource']},
				'controllers'    : { deps: ['ngCookies']}
			},

			removeCombined: true, // remove files which were nested

			findNestedDependencies: true, // deep check for deps

			modules: [{
				name   : 'client',
				include: ['3p/requirejs/require']
			}],

			uglify2: {
				output  : { beautify: false },
				compress: {
					sequences    : true,  // join consecutive statemets with the “comma operator”
					properties   : true,  // optimize property access: a["foo"] → a.foo
					dead_code    : true,  // discard unreachable code
					drop_debugger: true,  // discard “debugger” statements
					unsafe       : false, // some unsafe optimizations
					conditionals : true,  // optimize if-s and conditional expressions
					comparisons  : true,  // optimize comparisons
					evaluate     : true,  // evaluate constant expressions
					booleans     : true,  // optimize boolean expressions
					loops        : true,  // optimize loops
					unused       : true,  // drop unused variables/functions
					hoist_funs   : true,  // hoist function declarations
					hoist_vars   : false, // hoist variable declarations
					if_return    : true,  // optimize if-s followed by return/continue
					join_vars    : true,  // join var declarations
					cascade      : true,  // try to cascade `right` into `left` in sequences
					side_effects : true,  // drop side-effect-free statements
					warnings     : false  // warn about potentially dangerous optimizations/code
				},
				warnings: false,
				mangle  : false // uglify (shorten) names of vars and params
			}

		}, function(){ cb(); });

	});

}(require('gulp'), require('gulp-load-plugins')));