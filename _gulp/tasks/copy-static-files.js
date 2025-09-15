"use strict";

// ReSharper disable InconsistentNaming

var gulp = require("gulp");
var mergeStream = require("merge-stream");
var plumber = require("gulp-plumber");
var debug = require("../debug");

// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var staticFiles = require("../bundles/static-files");

gulp.task("copy-static-files", () => {

    const copyTasks = staticFiles.map(entry => gulp.src(entry.from)
        .pipe(plumber())
        .pipe(debug())
        .pipe(gulp.dest(entry.to)));
    return mergeStream(copyTasks);
});