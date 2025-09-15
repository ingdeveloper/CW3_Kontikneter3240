import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");

interface IWfStateIndicatorParams extends IComponentBaseParams, IState {
    iconClass: string;
    iconSize: string;
    label: string;
}

class WfStateIndicatorComponent extends ComponentBaseModel<IWfStateIndicatorParams> {
    private iconSizeStyle: KnockoutComputed<string>;
    private states: VisualStatesService;
    private label: string;
    private iconSize: string;
    private iconClass: string;

    constructor(params: IWfStateIndicatorParams) {
        super(params)
        this.initializeComputeds();
        this.initializeStates();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.iconClass = this.settings.iconClass;
        this.iconSize = this.settings.iconSize;
        this.label = (ko.unwrap(this.settings.label) || "").stringPlaceholderResolver(this.objectID);

    }

    private initializeComputeds() {
        this.iconSizeStyle = ko.pureComputed(() => {
            if (this.iconSize) {
                return "font-size:" + this.iconSize + "px; line-height:" + this.iconSize + "px;" + "height:" + this.iconSize + "px;" + "width:" + this.iconSize + "px";
            }
            return null;
        });
    }

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfStateIndicatorComponent;
