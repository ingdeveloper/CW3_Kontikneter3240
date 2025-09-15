"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var del = require("del");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var bundles = require("../bundles/content").bundles;

gulp.task("clean-app-bundles", () => {
    return del(`${paths.app.dist}/**/*.*`).then(paths => {
        console.log("Deleted files and folders:\n");
        logging.logFiles(paths);
    });
});

