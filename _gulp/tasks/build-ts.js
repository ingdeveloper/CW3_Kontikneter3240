"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var shell = require("gulp-shell");

var runTsPipeline = require("../actions/run-ts-pipeline");

gulp.task("build-ts", shell.task(["npm run tsc"]));
