"use strict";

// ReSharper disable InconsistentNaming
var gutil = require("gulp-util");

exports.logError = (error) => {
    gutil.log(gutil.colors.red(error));
}

exports.logFiles = (files) => {
    gutil.log(gutil.colors.cyan(files.join("\n")));
}