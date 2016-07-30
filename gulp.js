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
			'!node_modules/**/*.js',
			'!public/js/3p/**/*.js'
		])
			.pipe(glp.eslint())
			.pipe(glp.eslint.format())
			.pipe(glp.eslint.failAfterError());
	});

	gulp.task('js', function (cb) {

		/* glp.requirejs.optimize({
			//preserveLicenseComments: false,
			appDir: staticPath + '/js',
			dir: webPath + '/js',
			mainConfigFile: staticPath + '/js/require-config.js',
			baseUrl: '../js'
		}, cb()); */

		cb();

	});

}(require('gulp'), require('gulp-load-plugins')));