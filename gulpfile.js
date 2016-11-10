//--------------------------------------------------
// modules laod
//--------------------------------------------------
const gulp    = require('gulp');
const watch   = require('gulp-watch');
const sass    = require('gulp-sass');
const babel   = require('gulp-babel');
const plumber = require('gulp-plumber');

//--------------------------------------------------
// path
//--------------------------------------------------
const jsSrcPath   = './src/js';
const jsDestPath  = './public/js';
const cssSrcPath  = './src/scss';
const cssDestPath = './public/css';

//--------------------------------------------------
// tasks
//--------------------------------------------------
gulp.task('default', ['watch', 'sass', 'babel']);

//--------------------------------------------------
// watch
//--------------------------------------------------
gulp.task( 'watch', function() {
  gulp.watch(jsSrcPath  + '/*.js', () => {
    gulp.start(['babel']);
  });

  gulp.watch(cssSrcPath + '/*.scss', () => {
    gulp.start(['sass']);
  });

});

//--------------------------------------------------
// babel
//--------------------------------------------------
gulp.task('babel', () => {
  gulp.src(jsSrcPath + '/*.js')
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulp.dest(jsDestPath));
});

//--------------------------------------------------
// sass
//--------------------------------------------------
gulp.task( 'sass', function() {
  return gulp.src(cssSrcPath + '/*.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest(cssDestPath));
});
