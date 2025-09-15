"use strict";

let wwwroot = `.`;

exports.paths = {
    wwwroot: wwwroot,
    app: {
        root: `${wwwroot}/App`,
        src: `${wwwroot}/App/src`,
        dist: `${wwwroot}/App/dist`,
        js: `${wwwroot}/App/js`,
        maps: `${wwwroot}/App/maps`
    },
    pageTemplates: `${wwwroot}/_pageTemplates`,
    content: `${wwwroot}/Content`,
    contentDemos: `${wwwroot}/ContentDemos`,
    contentCowi: `${wwwroot}/ContentCowi`,
    scripts: `${wwwroot}/Scripts`,
    scriptsCowi: `${wwwroot}/ContentCowi`,
    fonts: `${wwwroot}/fonts`,
    font: `${wwwroot}/Content/font`,

    node: `${wwwroot}/node_modules`
};