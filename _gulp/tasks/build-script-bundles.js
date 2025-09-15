"use strict";

var gulp = require("gulp");
var mergeStream = require("merge-stream");
var argv = require("yargs").argv;

// ReSharper enable InconsistentNaming

var bundles = require("../bundles/scripts").bundles;
var createScriptBundle = require("../actions/create-script-bundle");

gulp.task("build-script-bundles", () => {

    var isRelease = argv.target === "release";
    const streams = [];

    for (let i = 0; i < bundles.length; i++) {
        const stream = createScriptBundle(bundles[i], isRelease);
        streams.push(stream);
    }

    return mergeStream(streams);
});