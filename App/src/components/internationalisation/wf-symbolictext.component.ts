import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfSymbolicTextParams extends IComponentBaseParams {
    symbolicText: string;
}

class WfSymbolicTextComponent extends ComponentBaseModel<IWfSymbolicTextParams> {

    private symbolicText: KnockoutObservable<string> | string;

    constructor(params: IWfSymbolicTextParams) {
        super(params);

    }

    protected initializeSettings() {
        super.initializeSettings();

        this.symbolicText = this.connector.translate((this.settings.symbolicText || '').stringPlaceholderResolver(this.objectID));
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfSymbolicTextComponent;
