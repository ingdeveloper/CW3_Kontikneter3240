import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import ChangedFieldAnimationService = require("../services/changed-field-animation.service");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfSensorParams extends IComponentBaseParams, IState, ICssClassStateParams, IChangedFieldAnimationParams, ISignalArrayParams {
    valueLabelPosition: "right" | "left";
    sensorShape: "circle" | "square";
    signalName: string;
    setpointSignalName: string;
    format: string;
    staticUnitText: string;
    sensorText: string;
    unitLabel: boolean;
    pointerLength: number;
    pointerRotation: number;
}

class WfSensorComponent extends ComponentBaseModel<IWfSensorParams> {
    private signalArraySetpointService: SignalArrayService;
    private signalArrayService: SignalArrayService;
    private cssClass: KnockoutComputed<string>;
    private changedFieldAnimationServiceSetpoint: ChangedFieldAnimationService;
    private changedFieldAnimationService: ChangedFieldAnimationService;

    private setpointSignalValue: KnockoutObservable<any>;
    private setpointSignal: Signal;
    private signalValue: KnockoutObservable<any>;
    private signal: Signal;
    private pointerRotation: number;
    private pointerLength: number;
    private unitLabel: boolean;
    private sensorText: string;
    private staticUnitText: string;
    private format: string;
    private setpointSignalName: string;
    private signalName: string;
    private sensorShape: string;
    private valueLabelPosition: string;

    private statusCssClass: KnockoutComputed<string>;
    private cssClassNames: string[];
    private states: VisualStatesService;

    constructor(params: IWfSensorParams) {
        super(params);
        this.initializeStates();

        if (this.signalName)
            this.signal = this.connector.getSignal(ko.unwrap(this.signalName));
        if (this.setpointSignalName)
            this.setpointSignal = this.connector.getSignal(ko.unwrap(this.setpointSignalName));

        this.initializeSignalArray();

        if (this.signalName) {
            if (this.signalArrayService.isArray) {
                this.signalValue = this.signalArrayService.signalValue;
            } else {
                this.signalValue = this.signal.value.extend({ numeralNumber: this.format });
            }
        }

        if (this.setpointSignalName) {
            if (this.signalArraySetpointService.isArray) {
                this.setpointSignalValue = this.signalArraySetpointService.signalValue;
            } else {
                this.setpointSignalValue = this.setpointSignal.value.extend({ numeralNumber: this.format });
            }
        }
        
        this.initializeChangedFieldAnimation();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.valueLabelPosition = ko.unwrap(this.settings.valueLabelPosition) || "right";
        this.sensorShape = ko.unwrap(this.settings.sensorShape) || "circle"; // square
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
        this.signalName = (ko.unwrap(this.settings.signalName) || "").stringPlaceholderResolver(this.objectID);
        this.setpointSignalName = (ko.unwrap(this.settings.setpointSignalName) || "").stringPlaceholderResolver(this.objectID);
        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";

        this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || "").stringPlaceholderResolver(this.objectID);
        this.sensorText = (ko.unwrap(this.settings.sensorText) || "T").stringPlaceholderResolver(this.objectID);
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true;

        this.pointerLength = ko.unwrap(this.settings.pointerLength) !== undefined ? ko.unwrap(this.settings.pointerLength) : 20;
        this.pointerRotation = ko.unwrap(this.settings.pointerRotation) || 0;

        
    }

    private initializeChangedFieldAnimation() {
        this.settings.additionalCssForAnimation = 'wf-sensor-value-' + this.valueLabelPosition;
        if (this.signalName) {
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, 'wf-sensor-value-' + this.valueLabelPosition);
        }
        if (this.setpointSignalName) {
            this.changedFieldAnimationServiceSetpoint = new ChangedFieldAnimationService(this.settings, this.setpointSignalValue, 'wf-sensor-value-' + this.valueLabelPosition);
        }

        this.cssClass = ko.computed(() => {
            return (this.signalName ? this.changedFieldAnimationService.cssClass() || "" : "") + " " + (this.setpointSignalName ? this.changedFieldAnimationServiceSetpoint.cssClass() || "" : "");
        });
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        this.signalArraySetpointService = new SignalArrayService(this.settings, this.setpointSignal);
    }

    protected async dispose() {
        if (this.changedFieldAnimationService)
            await this.changedFieldAnimationService.dispose();
        if (this.changedFieldAnimationServiceSetpoint)
            await this.changedFieldAnimationServiceSetpoint.dispose();
        await super.dispose();
        if (!this.signal) {
            await this.connector.unregisterSignals(this.signal);
        }
        if (!this.setpointSignal) {
            await this.connector.unregisterSignals(this.setpointSignal);
        }
        await this.states.unregisterSignals();
    }
}

export = WfSensorComponent;
