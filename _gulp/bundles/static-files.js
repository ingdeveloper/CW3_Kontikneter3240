"use strict";
var paths = require("../paths").paths;

module.exports = [{
    from: `${paths.node}/font-awesome/fonts/**/*.*`,
    to: `${paths.fonts}`
    },
    {
        from: `${paths.node}/bootstrap/fonts/**/*.*`,
        to: `${paths.fonts}`
    },
    {
        from: `${paths.node}/jquery-contextmenu/dist/font/**/*.*`,
        to: `${paths.font}`
    }
];