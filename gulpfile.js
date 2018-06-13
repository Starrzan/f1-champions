var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

//BUILD
gulp.task('build', [], function() {
	return gulp.src('app/css/app.scss')
		.pipe(sass({outputstyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('app/css/'));
});

// WATCH
gulp.task('watch', ['default'], function() {
	gulp.watch('app/css/**/*.scss', ['styles']);
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/img/**/*.{jpg,gif,png,svg}', ['images']);
});

gulp.task('default', ['run']);

// SERVER
gulp.task('webserver', function() {
	gulp.src('app')
		.pipe(webserver({
		livereload: false,
		directoryListing: false,
		open: true
	}));
});

gulp.task('run', ['build', 'webserver']);