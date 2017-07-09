const gulp = require('gulp');

gulp.task('build', () =>
	gulp.src([
		'./src/web/index.html',
	])
	.pipe(gulp.dest('./built/web/'))
);
