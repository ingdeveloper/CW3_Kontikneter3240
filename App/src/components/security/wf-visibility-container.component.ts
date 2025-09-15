import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfVisibilityContainerParams extends IComponentBaseParams {

}

class WfVisibilityContainerComponent extends ComponentBaseModel<IWfVisibilityContainerParams> {


    constructor(params: IWfVisibilityContainerParams) {
        super(params)
        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();

    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfVisibilityContainerComponent;
