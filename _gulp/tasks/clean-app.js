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

function cleanupFiles(destDir, callback) {
    del(`${destDir}/**/*.*`, { force: true })
        .then((files) => {
            console.log(files);
            callback();
        });
}

function cleanupEmptyFolders(destDir, callback) {
    deleteEmpty.sync(`${destDir}/`, { force: true });
    callback();
}

gulp.task("clean-app",
    (cb) => {
        var version = extractAppVersion();
        var destDir = `${paths.wwwroot}/../releases/${version}/app`;

        var streams = [
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