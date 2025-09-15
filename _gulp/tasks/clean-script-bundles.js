"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var del = require("del");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");
var bundles = require("../bundles/scripts").bundles;

gulp.task("clean-script-bundles", () => {

    var bundleFiles = flatten(bundles.map((bundle) =>[
        `${bundle.root}/${bundle.name}.bundle.js`,
        `${bundle.root}/${bundle.name}.bundle-min.js`,
        `${bundle.root}/${bundle.name}.bundle.js.map`
    ]));

    return del(bundleFiles).then(paths => {
        console.log("Deleted files and folders:\n");
        logging.logFiles(paths);
    });
});

