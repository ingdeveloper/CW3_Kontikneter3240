"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var bundles = require("../bundles/scripts").bundles;

gulp.task("watch-scripts", () => {

    let files = [];
    for (let i = 0; i < bundles.length; i++) {

        files.push(bundles[i].files);
    }

    files = flatten(files);

    return gulp
        .watch(files, ["build-script-bundles"])
        .on("error", logging.logError);
});