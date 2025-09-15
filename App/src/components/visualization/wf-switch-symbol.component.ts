import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfStateSymbolParams extends IComponentBaseParams, IState, ICssClassStateParams {
    lineThickness: number;
    switchType: string;

}

class WfSwitchGearComponent extends ComponentBaseModel<IWfStateSymbolParams> {
    private statusCssClass: KnockoutComputed<string>;
    private cssClassNames: string[];
    private states: VisualStatesService;
    public lineThickness;
    public switchType;

    constructor(params: IWfStateSymbolParams) {
        super(params);
        this.initializeStates();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.multipleCss;
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.lineThickness = ko.unwrap(this.settings.lineThickness) !== undefined ? ko.unwrap(this.settings.lineThickness) : 1;
        this.switchType = ko.unwrap(this.settings.switchType) || 'switch-gear-box switch-gear-breaker';

    }

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfSwitchGearComponent;