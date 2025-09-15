import Connector = require("../../services/connector");
import WfValueComponent = require("./wf-value.component");

/**
 * This interface contains the HTML parameters for the WfValueDisplayComponent.
 * 
 * @interface IWfValueDisplayParams
 * @extends {IComponentBaseParams}
 * @extends {}
 * @extends {IChangedFieldAnimationParams}
 */
interface IWfValueDisplayParams extends IComponentBaseParams, IChangedFieldAnimationParams, IState, ISignalArrayParams {
    format: string;
    isAlphanumeric: boolean;
    unitLabel: boolean;
    staticUnitText: string;
    signalName: string;
    isDateTime: boolean
    dateTimeFormat: string;
    signalValueFactor: number;

    iconClass: string;
    displayClass: string;
    displaySize: string;
    label: string;
    signalNameLabel: boolean;
    iconStyle: string;
    textStyle: string;
}


class WfValueDisplayComponent extends WfValueComponent<IWfValueDisplayParams> {
    css: KnockoutComputed<string>;

    private iconClass: string;
    private displayClass: string;
    private displaySize: string;
    private label: string;
    private signalNameLabel: boolean;
    private iconStyle: string;
    private textStyle: string;

    constructor(params: IWfValueDisplayParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.iconClass = ko.unwrap(this.settings.iconClass) || null;
        this.displayClass = ko.unwrap(this.settings.displayClass) || '';
        this.displaySize = ko.unwrap(this.settings.displaySize) ? "input-group-" + ko.unwrap(this.settings.displaySize) : "";
        this.label = (ko.unwrap(this.settings.label) || '').stringPlaceholderResolver(this.objectID);
        this.signalNameLabel = ko.unwrap(this.settings.signalNameLabel) !== undefined ? ko.unwrap(this.settings.signalNameLabel) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
        this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || '').stringPlaceholderResolver(this.objectID);

        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
    }

    protected initializeStates() {
        super.initializeStates();
        this.css = this.states.css;
        this.cssDisplayClass = ko.computed(() => {
            return this.css() + " " + this.displayClass || "";
        }, this);
    }

    /**
     * Place here signal cleanup functionality.
     * 
     * @protected
     * @returns 
     * 
     * @memberOf WfValueDisplayComponent
     */
    protected async dispose() {
        await super.dispose();
    }
}

export = WfValueDisplayComponent;
