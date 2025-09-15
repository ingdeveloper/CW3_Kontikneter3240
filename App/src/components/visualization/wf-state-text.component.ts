import VisualStatesService = require("../services/visual-states.service");
import ChangedFieldAnimationService = require("../services/changed-field-animation.service");

import ComponentBaseModel = require("../component-base.model");

interface IWfStateTextParams extends IComponentBaseParams, IState, ISymbolicTextStateParams, IChangedFieldAnimationParams {

}

class WfStateTextComponent extends ComponentBaseModel<IWfStateTextParams> {
    private css: KnockoutComputed<string>;
    private statusText: KnockoutComputed<string>;
    private states: VisualStatesService;
    protected changedFieldAnimationService: ChangedFieldAnimationService;

    constructor(params: IWfStateTextParams) {
        super(params);
        this.initializeStates();
        this.initializeChangedFieldAnimation();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusText = this.states.statusText;
        this.css = this.states.css;
    }

    private initializeChangedFieldAnimation() {
        this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.statusText as KnockoutObservable<any>, this.css);
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    protected async dispose() {
        await super.dispose();
        await this.changedFieldAnimationService.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfStateTextComponent;
