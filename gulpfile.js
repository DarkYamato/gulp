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
    	return gulp.src('src/scss/main.scss')
    		.pipe(plumber())
    		.pipe(sourcemaps.init())
    		.pipe(sass())
    		.pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
             }))
    		.pipe(cssnano())
            .pipe(rename({ suffix: '.min' }))
    		.pipe(sourcemaps.write())
    		.pipe(gulp.dest('dist/css/'))
    		// .pipe(browserSync.reload({
    		// 	stream: true
    		// }))
    });

    gulp.task('img', () => {
        return gulp.src("src/assets/img/*.+(jpg|jpeg|png|gif)")
            .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true
            })))
            .pipe(gulp.dest("dist/img/"))
    });

    gulp.task('fonts', () => {
        return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
    });

    gulp.task('assets', () => {
        return gulp.src('src/assets/*.html', {since: gulp.lastRun('assets')})
        .pipe(gulp.dest('dist'))
    })
//
// gulp.task('watch', gulp.series('browserSync', 'sass'), () => {
//   gulp.watch('src/scss/**/*.scss', ['sass']);
//   gulp.watch('src/*.html', browserSync.reload);
//   gulp.watch('src/js/**/*.js', browserSync.reload);
//   gulp.watch('src/js/*.js', ['useref']);
//   gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', ['img']);
//   gulp.watch('src/fonts/**/*', ['fonts']);
// });
//
// gulp.task('browserSync', () => {
//     browserSync.init({
//         server: {
//             baseDir: "src"
//         }
//     });
// });

    gulp.task('scripts', () => {
	       return gulp.src('src/js/one.js', 'src/js/two.js')
		         .pipe(plumber())
                 .pipe(sourcemaps.init())
                 .pipe(concat('main.js'))
		         .pipe(uglify())
                 .pipe(rename({ suffix: '.min' }))
                 .pipe(sourcemaps.write())
                 .pipe(gulp.dest('dist/js/'));
    });

    gulp.task('watch', () => {
        gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
        gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', gulp.series('img'));
        gulp.watch('src/assets/**/*.*', gulp.series('assets'));
    })

    gulp.task('clean', () => {
            return del(['dist/**/*', '!dist/assets/img', '!dist/img/**/*'])
    });

    gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'scripts', 'fonts', 'assets', 'img')));

    gulp.task('dev', gulp.series('build', 'watch'));
