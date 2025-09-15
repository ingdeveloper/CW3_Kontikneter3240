import ComponentBaseModel = require("../../component-base.model");
import { IToolboxButton, DialogToolboxButtons } from "../models/toolbox-params.model";

interface WfHistoricalDataDialogToolboxParams extends IComponentBaseParams {
    groupName: string;
    controlName: string;
    showLabels: boolean;
    buttons: IToolboxButton<DialogToolboxButtons>[];
    css: string;
}

class WfHistoricalDataDialogToolboxComponent extends ComponentBaseModel<WfHistoricalDataDialogToolboxParams> {

    public groupName: string;
    public controlName: string;
    public css: string;
    public showLabels: boolean;
    public buttons: KnockoutObservableArray<any>;

    constructor(params: WfHistoricalDataDialogToolboxParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.groupName = this.settings.groupName || "default";
        this.controlName = this.settings.controlName || "default-controlName";
        this.showLabels = this.settings.showLabels || false;
        this.css = this.settings.css || "btn btn-default";

        this.buildButtonsArray();
    }

    public buildButtonsArray() {

        const buttons = (this.settings.buttons || []).map((item) => {
            return this.buildButtonsParams(item);
        });

        this.buttons = ko.observableArray(buttons);
    }

    public buildButtonsParams(button: IToolboxButton<DialogToolboxButtons>) {
        button.name = this.getButtonComponentName(button.button);
        button.groupName = this.groupName;
        button.controlName = this.controlName;
        button.showLabel = this.showLabels;
        button.css = this.css;
        return button;
    }


    public getButtonComponentName(buttonName: DialogToolboxButtons) {
        switch (buttonName) {
            case DialogToolboxButtons.Axes:
                return "wf-historical-data-dialog-axes";
            case DialogToolboxButtons.Data:
                return "wf-historical-data-dialog-data";
            case DialogToolboxButtons.Regions:
                return "wf-historical-data-dialog-regions";
            case DialogToolboxButtons.Devider:
                return "devider";
        }
    }
}

export = WfHistoricalDataDialogToolboxComponent;