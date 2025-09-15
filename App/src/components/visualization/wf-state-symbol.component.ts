import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfStateSymbolParams extends IComponentBaseParams, IState, ICssClassStateParams {

}

class WfStateSymbolComponent extends ComponentBaseModel<IWfStateSymbolParams> {
    private statusCssClass: KnockoutComputed<string>;
    private cssClassNames: string[];
    private states: VisualStatesService;

    constructor(params: IWfStateSymbolParams) {
        super(params);
        this.initializeStates();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfStateSymbolComponent;
