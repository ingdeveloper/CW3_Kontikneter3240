import ComponentBaseModel = require("../../component-base.model");
import { IToolboxButton, ToolboxButtons } from "../models/toolbox-params.model";

interface WfHistoricalDataToolboxParams extends IComponentBaseParams {
    groupName: string;
    controlName: string;
    showLabels: boolean;
    buttons: IToolboxButton<ToolboxButtons>[];
    css: string;
}

class WfHistoricalDataToolboxComponent extends ComponentBaseModel<WfHistoricalDataToolboxParams> {

    public groupName: string;
    public controlName: string;
    public css: string;
    public showLabels: boolean;
    public buttons: KnockoutObservableArray<any>;

    constructor(params: WfHistoricalDataToolboxParams) {
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

    public buildButtonsParams(button: IToolboxButton<ToolboxButtons>) {
        button.name = this.getButtonComponentName(button.button);
        button.groupName = this.groupName;
        button.controlName = this.controlName;
        button.showLabel = this.showLabels;
        button.css = this.css;
        return button;
    }

    public getButtonComponentName(buttonName: ToolboxButtons) {
        switch (buttonName) {
            case ToolboxButtons.Export:
                return "wf-historical-data-toolbox-export";
            case ToolboxButtons.PauseResume:
                return "wf-historical-data-toolbox-pause-resume";
            case ToolboxButtons.TimeSettings:
                return "wf-historical-data-toolbox-time-settings";
            case ToolboxButtons.LoadConfiguration:
                return "wf-historical-data-toolbox-load-configuration";
            case ToolboxButtons.SaveConfiguration:
                return "wf-historical-data-toolbox-save-configuration";
            case ToolboxButtons.Back:
                return "wf-historical-data-toolbox-back";
            case ToolboxButtons.Forward:
                return "wf-historical-data-toolbox-forward";
            case ToolboxButtons.Devider:
                return "devider";
        }
    }

    protected async dispose() {
    }
}

export = WfHistoricalDataToolboxComponent;