define(["require", "exports"], function (require, exports) {
    "use strict";
    var ComponentRegistry = /** @class */ (function () {
        function ComponentRegistry(basePath) {
            this.basePath = basePath;
            console.info('Setting component registry root: ' + basePath);
        }
        ComponentRegistry.prototype.mapComponent = function (name, viewName, viewModelName) {
            viewName = viewName || name;
            viewModelName = viewModelName || viewName;
            var viewPath = "text!" + this.basePath + "/" + viewName + ".html";
            var viewModelPath = this.basePath + "/" + viewModelName;
            ko.components.register(name, {
                viewModel: { require: viewModelPath },
                template: { require: viewPath }
            });
            console.info('Registering component: ' + name + ' (' + viewModelPath + '|' + viewPath + ')');
            return this;
        };
        return ComponentRegistry;
    }());
    return ComponentRegistry;
});
//# sourceMappingURL=componentRegistry.js.map