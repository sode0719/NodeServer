/**************************************************
* modules laod
*************************************************/
const gulp       = require( "gulp" );
const watch      = require( "gulp-watch" );
const sass       = require( "gulp-sass" );
const riot       = require( "gulp-riot" );
const browserify = require( "browserify" );
const watchify   = require( "watchify" );
const uglify     = require( "gulp-uglify" );
const source     = require( "vinyl-source-stream" );
const buffer     = require( "vinyl-buffer" );

/**************************************************
* path
*************************************************/
const jsSrcPath   = "./src/js";
const jsDestPath  = "./public/js";
const cssSrcPath  = "./src/scss";
const cssDestPath = "./public/css";
const riotSrcPath = "./src/tag";
const riotDestPath = "./public/riot";

/**************************************************
* tasks
*************************************************/

gulp.task("default", ["watch", "watchify", "sass", "riot"]);

/**
* watch
*/
gulp.task( "watch", function() {
  gulp.watch( jsSrcPath  + "/*.js", () => {
    gulp.start(["watchify"]);
  });

  gulp.watch( cssSrcPath + "/*.scss", () => {
    gulp.start(["sass"]);
  });

  gulp.watch( riotSrcPath + "/*.tag", () => {
    gulp.start(["riot"]);
  });

} );

/**
* browserify
*/
gulp.task( "browserify", function() {
  return jscompile( false );
} );

/**
* watchify
*/
gulp.task( "watchify", function() {
  return jscompile( true );
} );

function jscompile( is_watch ) {
  var bundler;
  if ( is_watch ) {
    bundler = watchify( browserify( jsSrcPath + "/script.js" ) );
  } else {
    bundler = browserify( jsSrcPath + "/script.js" );
  }

  function rebundle() {
    return bundler
    .bundle()
    .pipe( source( "bundle.js" ) )
    .pipe( buffer() )
    .pipe( uglify() )
    .pipe( gulp.dest( jsDestPath ) );
  }
  bundler.on( "update", function() {
    rebundle();
  } );
  bundler.on( "log", function( message ) {
    console.log( message );
  } );
  return rebundle();
}

/**
 * sass
 */
gulp.task( "sass", function() {
    return gulp.src( cssSrcPath + "/*.scss" )
        .pipe(sass())
        .pipe( gulp.dest( cssDestPath ) );
} );

/**
 * riot
 */
 gulp.task("riot", () => {
   gulp.src(riotSrcPath  + "/*.tag")
       .pipe(riot())
       .pipe(gulp.dest(riotDestPath));
 });
