"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");

gulp.task("watch-index", () => {
    return gulp
        .watch(`${paths.wwwroot}/_pageTemplates/**/*.*`, ["build-index"])
        .on("error", logging.logError);
});