var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var dir_path = './app/';

var files = {
	css: {
		main: [
			'node_modules/@appbaseio/reactivebase/dist/css/style.min.css',
			dir_path+'assets/css/style.css'
		],
		sassFile: [dir_path+'assets/styles/*.scss'],
		sassPartials: [dir_path+'assets/styles/partials/**/*.scss']
	}
};

gulp.task('maincss', ['sass'], function() {
	return gulp.src(files.css.main)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function() {
	return gulp.src(files.css.sassFile)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest(dir_path+'assets/css'));
});

gulp.task('moveCss', ['maincss'], function() {
	return gulp.src([
			'node_modules/@appbaseio/reactivebase/dist/css/bootstrap.polyfill.min.css',
			'app/assets/css/bootstrap.polyfill.css'
		])
		.pipe(minifyCSS())
		.pipe(concat('bootstrap.polyfill.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('moveListCss', function() {
	return gulp.src(['examples/list/*.css'])
		.pipe(gulp.dest('dist/examplesCss'));
});

gulp.task('moveFonts', function() {
	return gulp.src([
			'node_modules/@appbaseio/reactivebase/dist/fonts/**/*',
			'app/assets/styles/fonts/**/*'
		])
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('moveImages', function() {
	return gulp.src([dir_path+'assets/images/*'])
		.pipe(gulp.dest('dist/images'));
});

gulp.task('compact', [
	'maincss',
	'moveCss',
	'moveFonts',
	'moveImages',
	'moveListCss'
]);

gulp.task('watchfiles', function() {
	gulp.watch(files.css.sassFile, ['moveCss']);
});

gulp.task('watchSassPartials', function() {
	gulp.watch(files.css.sassPartials, ['moveCss']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles', 'watchSassPartials']);
