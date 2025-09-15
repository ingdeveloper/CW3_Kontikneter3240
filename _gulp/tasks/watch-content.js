"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var bundles = require("../bundles/content").bundles;

gulp.task("watch-content", () => {

    let files = [];
    for (let i = 0; i < bundles.length; i++) {

        files.push(bundles[i].files);
    }

    files = flatten(files);

    return gulp
        .watch(files, ["build-content-bundles"])
        .on("error", logging.logError);
});