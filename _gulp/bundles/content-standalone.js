"use strict";

var paths = require("../paths").paths;

let contentRoot = `${paths.content}`;

exports.bundles = [
    {
        name: "styles",
        root: contentRoot,
        files: [
            `${contentRoot}/bootstrap.min.css`,
            `${contentRoot}/bootstrap-theme.min.css`,            
            `${paths.node}/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css`,
            `${paths.node}/font-awesome/css/font-awesome.css`,
            `${contentRoot}/wficonfont.css`,
            `${contentRoot}/wfhvacfont.css`,
            `${contentRoot}/wfpidfont.css`,
            `${contentRoot}/wfvalvesfont.css`,
            `${contentRoot}/wfprimitivesfont.css`,
            `${contentRoot}/wfelectricsymbolsfont.css`,
            `${paths.node}/durandal/css/durandal.css`,
            `${paths.node}/code-prettify/src/prettify.css`,
            `${paths.node}/toastr/toastr.scss`,
            `${paths.node}/bootstrap-slider/dist/css/bootstrap-slider.css`,
            `${paths.node}/c3/c3.css`,
            `${paths.node}/animate.css/animate.min.css`,
            `${paths.node}/bootstrap-select/dist/css/bootstrap-select.css`,
            `${paths.node}/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css`,
            `${paths.node}/virtual-keyboard/dist/css/keyboard.min.css`,
            `${paths.node}/virtual-keyboard/dist/css/keyboard-basic.min.css`,
            `${paths.node}/virtual-keyboard/dist/css/keyboard-dark.min.css`
        ]
    },
    {
        name: "custom",
        root: contentRoot + "/custom",
        files: [
            `${contentRoot}/custom/splash.css`,
            `${contentRoot}/custom/bootstrap-extensions.css`,
            `${contentRoot}/custom/app.css`,
            `${contentRoot}/custom/nav.css`,
            `${contentRoot}/custom/settings-bar.css`,
            `${contentRoot}/custom/media-queries.css`,
            `${contentRoot}/custom/components.css`,
            `${contentRoot}/custom/wf-switch-gear.components.css`,
            `${contentRoot}/custom/wf-switch-symbol.components.css`,
            `${contentRoot}/custom/wf-switch-transformer.components.css`,
            `${contentRoot}/custom/widgets.css`,
            `${contentRoot}/custom/animations.css`,
            `${contentRoot}/custom/colors.css`,
            `${contentRoot}/custom/states-colors.css`,
            `${contentRoot}/custom/modifiers.css`,
            `${contentRoot}/custom/modifiers.animations.css`,
            `${contentRoot}/custom/modifiers.flexbox.css`,
            `${contentRoot}/custom/modifiers.margin.css`,
            `${contentRoot}/custom/modifiers.padding.css`,
            `${contentRoot}/custom/modifiers.positioning.css`,
            `${contentRoot}/custom/modifiers.sizing.css`,
            `${contentRoot}/custom/modifiers.transformation.css`,
            `${contentRoot}/custom/smart-editor.css`
        ]
    }
];