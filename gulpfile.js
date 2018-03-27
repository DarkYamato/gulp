'use strict';

const gulp = require('gulp'),
 	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync'),
	  useref = require('gulp-useref'),
	  uglify = require('gulp-uglify'),
	  gulpif = require('gulp-if'),
	  concat = require('gulp-concat'),
	  plumber = require('gulp-plumber'),
	  sourcemaps = require('gulp-sourcemaps'),
	  cssnano = require('gulp-cssnano'),
	  rename = require('gulp-rename'),
	  imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      del = require('del');

gulp.task('sass', () => {
	gulp.src('src/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('main.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
         }))
		.pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('img', () => {
    gulp.src("src/img/*.+(jpg|jpeg|png|gif)")
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        })))
        .pipe(gulp.dest("dist/img/"))
});

gulp.task('fonts', () => {
  gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('watch', gulp.parallel('browserSync', 'sass'), () => {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
  gulp.watch('src/js/*.js', ['useref']);
  gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', ['img']);
  gulp.watch('src/fonts/**/*', ['fonts']);
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
});

gulp.task('useref', () => {
	gulp.src('src/*.html')
		  .pipe(plumber())
          .pipe(sourcemaps.init())
		  .pipe(gulpif('*.css', cssnano()))
		  .pipe(gulpif('*.js', uglify()))
          .pipe(useref())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  del(['dist/**/*', '!dist/img', '!dist/img/**/*'])
});

gulp.task('build', ['sass', 'useref', 'fonts', 'img']);

gulp.task('default', gulp.series('clean', gulp.parallel('build', 'watch')));
