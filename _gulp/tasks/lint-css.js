"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var mergeStream = require("merge-stream");
var plumber = require("gulp-plumber");
var changed = require("gulp-changed");
var csslint = require("gulp-csslint");
var filter = require("gulp-filter");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");

var bundles = require("../bundles/content").bundles;

function lintCssBundleFiles(bundle) {

    return gulp
        .src(bundle.files, { base: bundle.root })
        .pipe(plumber())
        .pipe(filter("**/*.css"))
        .pipe(csslint())
        .pipe(csslint.reporter());
}


gulp.task("lint-css", () => {
    const streams = [];
    for (let i = 0; i < bundles.length; i++) {
        const bundle = bundles[i];
        console.log("Linting bundle: ", bundle.name);
        let stream = lintCssBundleFiles(bundle);                
        streams.push(stream);
    }

    return mergeStream(streams);

});