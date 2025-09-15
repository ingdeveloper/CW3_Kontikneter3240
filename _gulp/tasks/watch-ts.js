"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("watch-ts", shell.task(["npm run tsc-watch"]));
