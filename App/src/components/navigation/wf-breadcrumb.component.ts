import Connector = require("../../services/connector");
import Logger = require("../../services/logger");
import ComponentBaseModel = require("../component-base.model");

interface INavigationRoute {
    url: string;
    icon?: string;
    text: string;
    active: boolean;
    projectAuthorization?:string;
    childItems?: INavigationRoute[];
}

interface IWfBreadcrumbParams extends IComponentBaseParams {
    items: KnockoutObservableArray<INavigationRoute>;
}

class WfBreadcrumbComponent<TWfValueParams extends IWfBreadcrumbParams> extends ComponentBaseModel<IWfBreadcrumbParams>  {
    public items: KnockoutObservableArray<INavigationRoute>;

    constructor(params: TWfValueParams) {
        super(params)
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.items = this.settings.items || ko.observableArray([]);
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfBreadcrumbComponent;
