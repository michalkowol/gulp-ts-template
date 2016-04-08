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
  ts: ['app/js/**/*.ts', 'app/js/**/*.tsx', 'typings/browser.d.ts'],
  js: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/react-dom/dist/react-dom.min.js', 'node_modules/react/dist/react.min.js', 'node_modules/director/build/director.min.js', 'node_modules/systemjs/dist/system.js'],
  css: ['node_modules/bootstrap/dist/css/**/*.css', 'node_modules/magnific-popup/dist/**/*.css'],
  sass: ['app/css/**/*.scss'],
  assets: ['app/**/*.html', 'app/css/**/*.css', 'app/.htaccess', 'app/img/**/*', 'app/api/**/*']
};

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('ts', function () {
  var tsProject = ts.createProject('tsconfig.json');
  var tsResult = gulp.src(paths.ts)
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));
 
  return merge([ 
    tsResult.dts.pipe(gulp.dest('dist/js')),
    tsResult.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('dist/js'))
  ]).pipe(connect.reload());
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

gulp.task('assets', function () {
  return gulp.src(paths.assets.concat(paths.js), {base: 'app'})
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
  gulp.watch(paths.ts, ['ts']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('build', ['sass', 'ts', 'css', 'js', 'assets']);
gulp.task('dist', function (callback) {
  runSequence('clean', 'build', 'usemin', callback);
});
gulp.task('server', ['build', 'connect', 'watch']);
gulp.task('default', ['server']);
