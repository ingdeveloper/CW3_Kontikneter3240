var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "durandal/system", "./services/logger", "durandal/app", "durandal/viewLocator", "plugins/router", "./services/portableConsole", "./pluginRegistry", "./baseApplication", "./knockoutExtenders/eSmartZoom"], function (require, exports, system, Logger, app, viewLocator, router, PortableConsole, PluginRegistry, baseApplication_1, ESmartZoom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.application = exports.SpaApplication = void 0;
    var SpaApplication = /** @class */ (function (_super) {
        __extends(SpaApplication, _super);
        function SpaApplication() {
            var _this = _super.call(this) || this;
            _this.setupAppTitle();
            _this.configurePlugins();
            _this.initDurandalBindingHandler();
            app.start()
                .then(function () {
                Logger.info(_this, "Application started");
                viewLocator.useConvention();
                return _this.loadShell();
            })
                .fail(Logger.handleError(_this));
            return _this;
        }
        SpaApplication.prototype.setupLogging = function () {
            var dynamicSystem = system;
            dynamicSystem.log = PortableConsole.info;
            dynamicSystem.warn = PortableConsole.warn;
            dynamicSystem.error = PortableConsole.error;
            _super.prototype.setupLogging.call(this);
        };
        SpaApplication.prototype.setupAppTitle = function () {
            app.title = null;
            router.updateDocumentTitle = function () {
            };
        };
        SpaApplication.prototype.configurePlugins = function () {
            Logger.info(this, "Configuring framework plugins");
            var standardWidgets = this.registerStandardWidgets();
            app.configurePlugins({
                router: true,
                dialog: true,
                widget: {
                    kinds: standardWidgets
                }
            });
            var dynRouter = router;
            dynRouter.handleInvalidRoute = function (route) {
                Logger.error(router, "Route '{0}' not found", null, route);
            };
        };
        SpaApplication.prototype.registerStandardWidgets = function () {
            return new PluginRegistry("src/widgets")
                .map("demoWidgetsList")
                .kinds;
        };
        SpaApplication.prototype.loadShell = function () {
            Logger.info(this, "Starting shell");
            app.setRoot('src/viewModels/shell', 'entrance');
        };
        //This allow apply knockout binding handler with delay, after when durandal view is active
        SpaApplication.prototype.initDurandalBindingHandler = function () {
            ESmartZoom.init();
        };
        return SpaApplication;
    }(baseApplication_1.BaseApplication));
    exports.SpaApplication = SpaApplication;
    exports.application = new SpaApplication();
});
//# sourceMappingURL=spaApplication.js.map