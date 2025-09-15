"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var concat = require("gulp-concat");
var srcMap = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify-es").default;
var newer = require("gulp-newer");
var debug = require("../debug");
var wrapper = require('gulp-wrapper');
var gulpif = require('gulp-if')

var paths = require("../paths").paths;
var logging = require("../logging");

function createScriptBundle(bundle, isRelease) {
    console.log("Creating bundle: ", bundle.name);
    return gulp
        //.src(bundle.files, { base: bundle.root })
        .src(bundle.files, { base: "./" })
        .pipe(plumber())
        .pipe(newer(`${bundle.root}/${bundle.name}.bundle.js`))
        .pipe(srcMap.init())
        .pipe(wrapper({
            header: '\r\n',
            footer: '\r\n'
        }))
        .pipe(concat(`${bundle.name}.bundle.js`))
        //.pipe(uglify({
        //    output: {
        //        max_line_len: 300000
        //    }
        //}))
        .pipe(srcMap.write(".", { includeContent: true, sourceRoot: "/WFSpa3/" }))
        .pipe(debug())
        .pipe(gulp.dest(`${bundle.root}/`))
        .on("error", logging.logError);
}

module.exports = createScriptBundle;