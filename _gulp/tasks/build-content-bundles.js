"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var mergeStream = require("merge-stream");
var concat = require("gulp-concat");
var gulpif = require("gulp-if");
var srcMap = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var minify = require("gulp-cssnano");
var newer = require("gulp-newer");
var cache = require("gulp-cached");
var remember = require("gulp-remember");
var debug = require("../debug");
var argv = require("yargs").argv;
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var bundles = require("../bundles/content").bundles;
var wrapper = require('gulp-wrapper');

function createStyleBundle(bundle, isRelease) {
    console.log("Creating bundle: ", bundle.name);
    console.log(isRelease);
    return gulp
        .src(bundle.files, {
            base: "./"
        })
        .pipe(plumber())
        .pipe(newer(`${bundle.root}/${bundle.name}.bundle.css`))
        .pipe(srcMap.init())
        .pipe(wrapper({
            header: '\r\n',
            footer: '\r\n'
        }))
        .pipe(concat(`${bundle.name}.bundle.css`))
        .pipe(srcMap.write(".", {
            includeContent: true,
            sourceRoot: "/WFSpa3/Content/"
        }))
        .pipe(debug())
        .pipe(gulp.dest(`${bundle.root}/`))
        .on("error", logging.logError);
}

gulp.task("build-content-bundles", ["copy-static-files"], () => {
    let streams = [];
    var isRelease = argv.target === "release";

    for (let i = 0; i < bundles.length; i++) {
        let stream = createStyleBundle(bundles[i], isRelease);
        streams.push(stream);
    }

    return mergeStream(streams);
});