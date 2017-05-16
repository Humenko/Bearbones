'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var panini = require('panini');
var browser = require('browser-sync');
var htmlhint = require("gulp-htmlhint");

gulp.task('build', function (done) {
    return runSequence('clean', ['panini', 'workflow-images', 'workflow-styles', 'workflow-scripts'], function () {
        done();
    });
});

gulp.task('default', function (done) {
    return runSequence('build', 'browser', 'watch', function () {
        done();
    });
});

gulp.task('clean', function () {
    return del(['./dist/']);
});

gulp.task('workflow-images', function () {
    return gulp.src('./src/www/img/dist/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/img/'))
});

gulp.task('workflow-styles', function () {
    return gulp.src('./src/www/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('workflow-scripts', function () {
    return gulp.src('./src/barebones//src/scripts/**/*')
        .pipe(sourcemaps.init())
        .pipe(concat('barebones.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename('barebones.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('htmlhint', function () {
    return gulp.src("./dist/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter())
});

gulp.task('panini', function () {
    return gulp.src('./src/www/pages/**/*.html')
        .pipe(panini({
            root: './src/www/pages/',
            layouts: './src/www/layouts/',
            partials: './src/www/partials/',
            helpers: './src/www/helpers/',
            data: './src/www/data/'
        }))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('panini:refresh', function (done) {
    panini.refresh();

    return done();
});

gulp.task('browser', function (done) {
    browser.init({
        server: './dist/',
        port: 8300
    });
    return done();
});

gulp.task('browser:reload', function (done) {
    browser.reload();
    return done();
});

gulp.task('watch', function () {
    gulp.watch(['./src/www/sass/**/*.scss','./src/barebones/**/*.scss'],
        function () {
            runSequence('workflow-styles', 'browser:reload');
        });
    gulp.watch(['./src/www/{layouts,partials,pages,helpers,data}/**/*'], 
        function () {
            runSequence('panini', 'panini:refresh', 'browser:reload');
        });
});