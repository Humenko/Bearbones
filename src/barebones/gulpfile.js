'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function (done) {
    return runSequence('clean', ['workflow-styles', 'workflow-scripts'], function () {
        done();
    });
});

gulp.task('default', function (done) {
    return runSequence('build', function () {
        done();
    });
});

gulp.task('clean', function () {
    return del(['./dist/']);
});

gulp.task('workflow-styles', function () {
    gulp.src('./src/sass/barebones.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename('barebones.min.css'))        
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('workflow-scripts', function () {
    gulp.src('./src/scripts/**/*')
        .pipe(sourcemaps.init())
        .pipe(concat('barebones.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename('barebones.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});
