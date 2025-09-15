import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ValueConversionsService = require("../services/value-conversions.service");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");
import VisualStatesService = require("../services/visual-states.service");

interface IWfWfBargraphParams extends IComponentBaseParams, ISignalArrayParams, IState, IChangedFieldAnimationParams {
    width: number;
    height: number;
    orientation: string;
    progressBarSize: string;
    cssClass: string;
    iconClass: string;
    titleText: string;
    format: string;
    maxRange: number;
    minRange: number;
    showTickLabels: boolean;
    unitLabel: boolean;
    valueLabel: boolean;
    signalName: string;
    maxRangeSignalName: string;
    minRangeSignalName: string;
}

class WfBargraphComponent extends ComponentBaseModel<IWfWfBargraphParams> {
    private signalArrayService: SignalArrayService;
    protected cssDisplayClass: KnockoutComputed<string>;
    protected statusCssClass: KnockoutComputed<string>;
    private midRangeValueFormated: KnockoutComputed<number>;
    private minRangeValueFormated: KnockoutComputed<any>;
    private maxRangeValueFormated: KnockoutComputed<any>;
    private midRangeValue: KnockoutComputed<number>;
    private minRangeValue: KnockoutComputed<any>;
    private maxRangeValue: KnockoutComputed<any>;
    private minRangeSignal: Signal;
    private maxRangeSignal: Signal;
    private minRangeSignalName: string;
    private maxRangeSignalName: string;

    private valueConversionsService: ValueConversionsService;

    private signalName: string;
    private currentSignalValue: KnockoutObservable<any>;
    private signal: Signal;
    private format: string;
    private formattedSignalValue: string | KnockoutObservable<any>;

    private width: string | number;
    private height: string;
    private orientation: string;
    private progressBarSize: string;
    
    private iconClass: string;
    private titleText: string;
    private maxRange: number;
    private minRange: number;
    private midRange: KnockoutObservable<number>;

    private showTickLabels: KnockoutObservable<boolean>;
    private unitLabel: KnockoutObservable<boolean>;
    private valueLabel: KnockoutObservable<boolean>;

    private maxValueVioliation: KnockoutObservable<boolean>;
    private minValueVioliation: KnockoutObservable<boolean>;

    private progressValue: KnockoutComputed<any>;
    protected states: VisualStatesService;
    private axisOrientation: KnockoutComputed<string>;
    private revertAxis: KnockoutComputed<boolean>;
    private isVertical: KnockoutComputed<boolean>;

    constructor(params: IWfWfBargraphParams) {
        super(params);

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.currentSignalValue = this.signalArrayService.signalValue;
        } else {
            this.currentSignalValue = this.signal.value;
        }

        // The formated value will is used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({
            numeralNumber: this.format
        });

        this.initializeComputeds();
        this.initializeStates();
        //this.initializeChangedFieldAnimation();
        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.valueConversionsService = new ValueConversionsService();

        this.maxValueVioliation = ko.observable(false);
        this.minValueVioliation = ko.observable(false);

        this.width = ko.unwrap(this.settings.width) || "100%";
        this.height = ko.unwrap(this.settings.height) + 'px' || "";
        this.orientation = ko.unwrap(this.settings.orientation) || "horizontal left";

        this.progressBarSize = ko.unwrap(this.settings.progressBarSize) || "";
        (this.settings as any).cssClassNormalState = ko.unwrap(this.settings.cssClass) || null;

        this.iconClass = ko.unwrap(this.settings.iconClass) || "";
        this.titleText = (ko.unwrap(this.settings.titleText) || "").stringPlaceholderResolver(this.objectID);

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";

        this.maxRange = ko.unwrap(this.settings.maxRange) || 100;
        this.minRange = ko.unwrap(this.settings.minRange) || 0;

        this.showTickLabels = ko.observable(ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false);
        this.unitLabel = ko.observable(ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true);
        this.valueLabel = ko.observable(ko.unwrap(this.settings.valueLabel) !== undefined ? ko.unwrap(this.settings.valueLabel) : true);

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.formattedSignalValue = '';
        this.currentSignalValue = ko.observable();
    }

    protected initializeComputeds() {

        this.axisOrientation = ko.computed(() =>{
            return this.orientation.indexOf("horizontal") !== -1 ? "bottom" : "right";
        }, this);

        this.revertAxis = ko.computed(() =>{
            return this.orientation.indexOf("right") !== -1 || this.orientation.indexOf("top") !== -1;
        }, this);

        this.isVertical = ko.computed(()=>{
            return !(this.orientation.indexOf("horizontal") !== -1);
        }, this);


        this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
        if (this.maxRangeSignalName)
            this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);

        this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
        if (this.minRangeSignalName)
            this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);

        this.maxRangeValue = ko.computed(() => {
            return this.maxRangeSignal ? _.isNumber(this.maxRangeSignal.value()) ? this.maxRangeSignal.value() : this.maxRange : this.maxRange;
        });

        this.maxRangeValueFormated = this.maxRangeValue.extend({
            numeralNumber: this.format
        });

        this.minRangeValue = ko.computed(() => {
            return this.minRangeSignal ? _.isNumber(this.minRangeSignal.value()) ? this.minRangeSignal.value() : this.minRange : this.minRange;
        });

        this.minRangeValueFormated = this.minRangeValue.extend({
            numeralNumber: this.format
        });

        this.midRangeValue = ko.computed(() => {
            return (this.maxRangeValue() + this.minRangeValue()) / 2;
        });

        this.midRangeValueFormated = this.midRangeValue.extend({
            numeralNumber: this.format
        });


        this.progressValue = ko.computed(() => {
            const signalValue = this.currentSignalValue();

            // Prevent the width of progressbar to be out of range 0 - 100%
            if (signalValue > this.maxRangeValue()) {
                this.maxValueVioliation(true);
                this.minValueVioliation(false);
                return "100%";
            } else if (signalValue < this.minRangeValue()) {
                this.minValueVioliation(true);
                this.maxValueVioliation(false);
                return "0%";
            }

            this.maxValueVioliation(false);
            this.minValueVioliation(false);

            // Calculate the width in a linear conversion to 0 - 100%
            var progressWidth = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRangeValue(), this.maxRangeValue(), 0, 100);
            return progressWidth + "%";

        });
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    //private initializeChangedFieldAnimation() {
    //    this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.currentSignalValue as KnockoutObservable<any>, this.cssDisplayClass);
    //    this.cssClass = ko.computed(() => {
    //        return this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
    //    });
    //}

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
        if (this.visualSecurityService)
            this.visualSecurityService.dispose();
        if (this.maxRangeSignal)
            await this.connector.unregisterSignals(this.maxRangeSignal);
        if (this.minRangeSignal)
            await this.connector.unregisterSignals(this.minRangeSignal);
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfBargraphComponent;
