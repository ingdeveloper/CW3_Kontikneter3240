"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var argv = require("yargs").argv;
var plumber = require("gulp-plumber");
var newer = require("gulp-newer");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var debug = require("../debug");
// ReSharper enable InconsistentNaming
var deployment = require("../bundles/deployment").deployment;

gulp.task("set-index", ["build-index"], () => {

    var configuration = argv.configuration;    
    if (!configuration) {
        console.log("No configuration name specified. 'debug-app' configuration will be set as default.");
        configuration = 'debug-app';

    }
    
    configuration = configuration.toLowerCase();
    var force = (argv.force || "false").toLowerCase() === "true";
    
    return (gulp.src(`./index-${configuration}.html`))
        .pipe(plumber())
        .pipe(gulpif(!force, newer(`./index.html`)))
        .pipe(rename(`./index.html`))
        .pipe(debug())
        .pipe(gulp.dest(`./`));
});