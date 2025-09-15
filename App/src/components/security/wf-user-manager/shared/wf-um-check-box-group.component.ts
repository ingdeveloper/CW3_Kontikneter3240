import ComponentBaseModel = require("../../../component-base.model");
import CheckBoxObs = require("./wf-um-check-box-obs-model");

interface IWfUmCheckBoxGroupParams extends IComponentBaseParams {
    textLabel: string;
    itemsList: KnockoutObservableArray<CheckBoxObs>;
}

class WfUmCheckBoxGroupComponent extends ComponentBaseModel<IWfUmCheckBoxGroupParams> {   
    private textLabel: string;
    private itemsList: KnockoutObservableArray<CheckBoxObs>;

    constructor(params: IWfUmCheckBoxGroupParams) {
        super(params);  
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.textLabel = this.settings.textLabel;
        this.itemsList = this.settings.itemsList;
    }

    selectAllItems() {
        this.itemsList().forEach(element => {
            element.Selected(true);
        });
    }

    unselectAllItems() {
        this.itemsList().forEach(element => {
            element.Selected(false);
        });
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfUmCheckBoxGroupComponent;
