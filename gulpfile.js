var gulp = require('gulp');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var runSequence = require('run-sequence');
var proxy = require('proxy-middleware');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var usemin = require('gulp-usemin');
var ts = require('gulp-typescript');
var merge = require('merge2');

var paths = {
  css: ['node_modules/bootstrap/dist/css/**/*.css', 'node_modules/magnific-popup/dist/**/*.css'],
  sass: ['app/css/**/*.scss'],
  assets: ['app/**/*.html', 'app/css/**/*.css', 'app/.htaccess', 'app/img/**/*', 'app/api/**/*']
};

gulp.task('clean', function () {
  return del(['dist']);
});

var watchifyBundle;
var bundle = (function () {
  var browserify = require('browserify');
  var tsify = require('tsify');
  var gutil = require('gulp-util');
  var assign = require('lodash.assign');
  var watchify = require('watchify');
  var buffer = require('vinyl-buffer');
  var source = require('vinyl-source-stream');

  var customOpts = {
    entries: './app/js/app.tsx',
    debug: true,
    paths: ['./app/js', './node_modules'],
    plugin: [tsify]
  };
  var opts = assign({}, watchify.args, customOpts);
  watchifyBundle = watchify(browserify(opts));
  
  var bundleClosure = function () {
    gutil.log("Starting '", gutil.colors.cyan("\bbrowserify"), "\b'...");
    return watchifyBundle.bundle()
    .on('error', function (error) { gutil.log(error.toString()); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/js'))
      .pipe(connect.reload());
  };

  watchifyBundle.on('update', bundleClosure);
  watchifyBundle.on('time', function (time) {
    gutil.log("Finished '", gutil.colors.cyan("\bbrowserify"), "\b' after", gutil.colors.magenta(time + " ms"));
  });
  return bundleClosure;
})();

gulp.task('ts', bundle);

gulp.task('watchify-close', function () {
  if (watchifyBundle !== undefined) watchifyBundle.close();
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('assets', function () {
  return gulp.src(paths.assets, {base: 'app'})
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('usemin', function () {
  return gulp.src('dist/index.html')
    .pipe(usemin({
      css: [cssnano],
      js: [uglify],
      inlinejs: [uglify],
      inlinecss: [cssnano, 'concat']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('connect', function () {
  return connect.server({
    root: 'dist',
    port: 8080,
    livereload: true,
    middleware: function () {
      function createProxy(path) {
        return proxy({
          port: 8081,
          pathname: path,
          route: path
        });
      }
      return [createProxy('/api')];
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('build', ['sass', 'ts', 'css', 'assets']);
gulp.task('dist', function (callback) {
  runSequence('clean', 'build', 'usemin', 'watchify-close', callback);
});
gulp.task('server', ['build', 'connect', 'watch']);
gulp.task('default', ['server']);
