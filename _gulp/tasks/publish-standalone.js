"use strict";
var gulp = require("gulp");
var plumber = require("gulp-plumber");
var debug = require("../debug");
var async = require("async");
var del = require("del");
var deleteEmpty = require('delete-empty');
var rename = require("gulp-rename");
var path = require("path");
var extractAppVersion = require("../actions/extract-app-version");
var paths = require("../paths").paths;

function publishFiles(destDir, callback) {
    let glob = [
        `${paths.scripts}/*.bundle.*`,
        `${paths.app.dist}/release-standalone.js`,
        `${paths.fonts}/**/*.*`,
        `${paths.content}/**/{(*.*),@(*.bundle.css),!(*.css)}`
    ];

    gulp.src(glob, { base: paths.wwwroot })
        .pipe(plumber())
        .pipe(debug())
        .pipe(gulp.dest(destDir))
        .on("end", callback);
}

function publishIndex(destDir, callback) {
    gulp.src("index-release-standalone.html")
        .pipe(rename(`index.html`))
        .pipe(debug())
        .pipe(gulp.dest(destDir))
        .on("end", callback);
}

function cleanupFiles(destDir, callback) {
    let patterns = [
        `${destDir}/**/*.map`,
        `${destDir}/**/*.less`,
        `${destDir}/**/*.scss`,
        `${destDir}/**/*.sass`
    ];

    del(patterns, { force: true })
        .then(() => {
            callback();
        });
}

function cleanupEmptyFolders(destDir, callback) {
    deleteEmpty.sync(`${destDir}/`, { force: true });
    callback();
}

gulp.task("publish-standalone",
    ["build-app-bundles", "build-standalone-content-bundles", "build-script-bundles", "build-index", "clean-standalone"],
    (cb) => {
        var version = extractAppVersion();
        var destDir = `${paths.wwwroot}/releases/${version}/standalone`;

        var streams = [
            (callback) => publishFiles(destDir, callback),
            (callback) => publishIndex(destDir, callback),
            (callback) => cleanupFiles(destDir, callback),
            (callback) => cleanupEmptyFolders(destDir, callback)
        ];

        async.series(streams,
            (err, values) => {
                if (err) {
                    cb(err);
                } else {
                    cb();
                }
            });

    });