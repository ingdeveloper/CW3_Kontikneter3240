"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var del = require("del");
var logging = require("../logging");
// ReSharper enable InconsistentNaming

gulp.task("clean-index", () => {
    return del("./index*.html").then(paths => {
        console.log("Deleted files:\n");
        logging.logFiles(paths);
    });
});