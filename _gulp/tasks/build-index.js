"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var mergeStream = require("merge-stream");
// ReSharper enable InconsistentNaming
var deployment = require("../bundles/deployment").deployment;
var buildBrandIndex = require("../actions/build-brand-index");

gulp.task("build-index", () => {
    var tasks = [];
    for (let configuration in deployment) {
        if (deployment.hasOwnProperty(configuration)) {
            tasks.push(buildBrandIndex(configuration));            
        }
    }

    return mergeStream(tasks);
});