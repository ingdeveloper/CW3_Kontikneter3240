"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var plumber = require("gulp-plumber");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");

gulp.task("watch-app", () => {
    return gulp
        .watch(`${paths.app.src}/**/*.js`, ["build-app-bundles"]);
});