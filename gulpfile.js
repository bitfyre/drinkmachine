var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var deploy = require('gulp-gh-pages');
var gulp = require('gulp');
var jade = require('gulp-jade');
var notify = require('gulp-notify');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');

gulp.task('html', function(){
  gulp.src(path.join(__dirname, 'src/**/*.html.jade'))
    .pipe(rename({
      // Strips .jade extension leaving .html
      extname: ''
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.join(__dirname, 'build')))
    .pipe(notify({
      message: 'HTML built'
    }))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('css', function() {
  gulp.src(path.join(__dirname, 'src/css/**/*.css.scss'))
    .pipe(sass({
      style: 'expanded',
      //sourceComments: 'map',
      errLogToConsole: true,
      onError: function(err) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
      }
    }))
    .pipe(
      autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9')
    )
    .pipe(rename({
      extname: ''
    }))
    .pipe(gulp.dest(path.join(__dirname, 'build/css')))
    .pipe(notify({
      message: 'CSS built'
    }))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  return gulp.src(path.join(__dirname, 'src/js/app.js'))
    .pipe(gulpWebpack(require('./webpack.config.js'), webpack))
    .pipe(gulp.dest(path.join(__dirname, 'build/js')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function() {
  gulp.src(
    [
      path.join(__dirname, '/src/images/*.*')
    ]
  ).pipe(gulp.dest(path.join(__dirname, 'build/images')));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: path.join(__dirname, 'build')
    },
    host: 'localhost',
    port: 1337,
    open: false
  });
});

gulp.task('watch',
  [
    'html',
    'css',
    'js',
    'browser-sync'
  ],
  function() {
    gulp.watch(path.join(__dirname, 'src/**/*.jade'), ['html']);
    gulp.watch(path.join(__dirname, 'src/css/**/*.scss'), ['css']);
    gulp.watch(path.join(__dirname, 'src/js/**/*.js'), ['js']);
});

gulp.task('deploy', function () {
  return gulp.src(path.join(__dirname, 'build/**/*'))
    .pipe(deploy());
});
