define(["require", "exports", "plugins/widget"], function (require, exports, widget) {
    "use strict";
    var PluginRegistry = /** @class */ (function () {
        function PluginRegistry(basePath) {
            this.kinds = [];
            this.basePath = basePath;
            console.info('Setting plugin registry root: ' + basePath);
        }
        PluginRegistry.prototype.map = function (name) {
            var viewPath = this.basePath + "/" + name + "/view";
            var viewModelPath = this.basePath + "/" + name + "/viewmodel";
            widget.mapKind(name, viewPath, viewModelPath);
            this.kinds.push(name);
            return this;
        };
        PluginRegistry.prototype.mapComponent = function (name, viewName, viewModelName) {
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
        return PluginRegistry;
    }());
    return PluginRegistry;
});
//# sourceMappingURL=pluginRegistry.js.map