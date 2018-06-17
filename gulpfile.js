var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

// Build
gulp.task('build', [], function() {
	return gulp.src('app/css/app.scss')
		.pipe(sass({outputstyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('app/css/'));
});

// Watch
gulp.task('watch', function() {
	gulp.watch('app/css/*.scss', ['build']);
});

// Server
gulp.task('webserver', function() {
	gulp.src('app')
		.pipe(webserver({
		livereload: false,
		directoryListing: false,
		open: true
	}));
});

gulp.task('run', ['build', 'webserver', 'watch']);

gulp.task('default', ['run']);