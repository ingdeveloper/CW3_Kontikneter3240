"use strict";

var through = require("through2");
var gutil = require("gulp-util");
var modifyFilename = require("modify-filename");


var plugin = function(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, false);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError("gulp-rev", "Streaming not supported"));
            return;
        }
        const content = file.contents.toString();
        const json = extractJson(content, options);
        const code = `window.font2SvgMap = window.font2SvgMap || {}; _.extend(window.font2SvgMap, ${json});\n`;
        file.contents = new Buffer(code);
        this.push(file);

        cb();
    });
};

function getCharacterCode(unicodeEncodedText) {
    const rawText = unicodeEncodedText.replace(
        /\\u([0-9a-f]{4})/g,
        function(whole, group1) {
            return String.fromCharCode(parseInt(group1, 16));
        }
    );
    return rawText;
}

function extractJson(cssContent, options) {
    const regex = /(?:\.([\w\d_\-]+))\:before\s*[,]?(?:{\s*content:\s*"\\([^"]+)";)?/g;
    var match;
    const classes = [];
    while ((match = regex.exec(cssContent))) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // View your result using the m-variable.
        // eg m[0] etc.
        classes.unshift(match);
    }
    const fontItems = {};
    var code = null;
    for (let i = 0; i < classes.length; i++) {
        const item = classes[i];
        if (item.length === 3) code = item[2];
        const key = options.prefix + " " + item[1];
        fontItems[key] = {
            code: getCharacterCode(`\\u${code}`),
            cssClass: options.prefix
        };
    }

    return JSON.stringify(fontItems, null, 4);
}

module.exports = plugin;