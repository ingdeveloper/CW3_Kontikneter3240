"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var gulpif = require('gulp-if');  //neu amueller
var plumber = require("gulp-plumber");
var consolidate = require("gulp-consolidate");
var rename = require("gulp-rename");
var newer = require("gulp-newer");
var stripBom = require("strip-bom");
var debug = require("../debug");
var fs = require("fs");
var swig = require("swig");
var deployment = require("../bundles/deployment").deployment;
var extractAppVersion = require("./extract-app-version");

function buildBrandIndex(configurationName) {
    if (!configurationName) {
        throw "No configuration name specified";
    }

    var appVersion = extractAppVersion();
    configurationName = configurationName.toLowerCase();
    console.log(`Configuration name: ${configurationName}`);
    const definition = deployment[configurationName];
    definition.splashContents = stripBom(fs.readFileSync(definition.splashFile, "utf8"));
    definition.isDebug = definition.debug;
    definition.appVersion = appVersion;
    definition.configurationName = configurationName;       
    definition.buildDate = new Date();//.toString();  //NEU amueller 9.07.2018
    
    var fileName = `./index-${configurationName}.html`;

    swig.setDefaults({ autoescape: false });

	var condition = function (file) {
        if (file == './index-release-app.html') {
            return false;
            //bei der Datei FALSE zurückgeben, damit die newer-Funktion NICHT ausgeführt wird.
            //Dann wird die Datei auf jeden Fall neu erstellt
            //und das build-Datum eingetragen
        }else{
            return true;
        }
    };
    return gulp.src(definition.indexFile)
        .pipe(plumber())
        .pipe(gulpif(condition(fileName), newer(fileName)))    //Änderung 16.07.2018 amueller: wenn gulpif == true, dann wird newer ausgeführt.
        .pipe(consolidate("swig", definition))
        .pipe(rename(fileName))       
        .pipe(debug())
        .pipe(gulp.dest(`./`));
}

module.exports = buildBrandIndex;