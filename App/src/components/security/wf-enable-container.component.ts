import Connector = require("../../services/connector");

import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");

interface IWfEnableContainerParams extends IComponentBaseParams {

    disableOverlayColor?: string;
}

class WfEnableContainerComponent extends ComponentBaseModel<IWfEnableContainerParams> {

    private disableOverlayColor: string;

    private isEnabled: KnockoutComputed<boolean>;

    constructor(params: IWfEnableContainerParams) {
        super(params)

        this.connector.getOnlineUpdates(); 

        this.initializeComputeds();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.disableOverlayColor = ko.unwrap(this.settings.disableOverlayColor) || "rgba(255,255,255,.5)";
    }

    private initializeComputeds() {
        this.isEnabled = ko.computed(() => {
            return !this.isDisabled();
        }, this);
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfEnableContainerComponent;
