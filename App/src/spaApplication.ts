import system = require('durandal/system');
import Logger = require("./services/logger");
import app = require('durandal/app');
import viewLocator = require('durandal/viewLocator');
import router = require('plugins/router');
import PortableConsole = require("./services/portableConsole");
import { Deferred } from "./services/deferred";
import PluginRegistry = require("./pluginRegistry");
import { BaseApplication } from "./baseApplication";
import ESmartZoom = require("./knockoutExtenders/eSmartZoom");

export class SpaApplication extends BaseApplication {
    constructor() {
        super();
        this.setupAppTitle();
        this.configurePlugins();
        this.initDurandalBindingHandler();

        app.start()
            .then(() => {
                Logger.info(this, "Application started");
                viewLocator.useConvention();
                return this.loadShell();
            })
            .fail(Logger.handleError(this));
    }

    protected setupLogging() {
        var dynamicSystem: any = system;
        dynamicSystem.log = PortableConsole.info;
        dynamicSystem.warn = PortableConsole.warn;
        dynamicSystem.error = PortableConsole.error;
        super.setupLogging();
    }

    private setupAppTitle() {
        app.title = null;
        router.updateDocumentTitle = () => {
        };
    }

    private configurePlugins() {
        Logger.info(this, "Configuring framework plugins");
        var standardWidgets = this.registerStandardWidgets();

        app.configurePlugins({
            router: true,
            dialog: true,
            widget: {
                kinds: standardWidgets
            }
        });

        var dynRouter: any = router;
        dynRouter.handleInvalidRoute = (route: string) => {
            Logger.error(router, "Route '{0}' not found", null, route);
        };
    }

    private registerStandardWidgets() {
        return new PluginRegistry("src/widgets")
            .map("demoWidgetsList")
            .kinds;
    }

    private loadShell() {
        Logger.info(this, "Starting shell");
        app.setRoot('src/viewModels/shell', 'entrance');
    }

    //This allow apply knockout binding handler with delay, after when durandal view is active
    private initDurandalBindingHandler(): any {
        ESmartZoom.init();
    }
}

export var application = new SpaApplication();