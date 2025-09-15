var fs = require("fs");
var stripBom = require('strip-bom');

var paths = require("../paths").paths;

function extractAppVersion() {
    var projectFilePath = `${paths.wwwroot}/package.json`;

    var project = JSON.parse(fs.readFileSync(projectFilePath));
    return project.version;    
}

module.exports = extractAppVersion;