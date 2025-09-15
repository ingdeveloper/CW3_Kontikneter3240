"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var mergeStream = require("merge-stream");
// ReSharper enable InconsistentNaming
var deployment = require("../bundles/deployment").deployment;
var buildAppBundle = require("../actions/build-app-bundle");

gulp.task("build-app-bundles", () => {
    var tasks = [];
    for (let configuration in deployment) {
        if (deployment.hasOwnProperty(configuration)) {
            var task = buildAppBundle(configuration);
            if (task) {
                tasks.push(task);
            }
        }
    }

    return mergeStream(tasks);
});