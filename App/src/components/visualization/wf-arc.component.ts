import Signal = require("../../services/models/signal");
import ValueConversionsService = require("../services/value-conversions.service");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfArcParams extends IWfArcBaseParams {
    strokeWidth: number;
    paddings: { top: number, right: number, bottom: number, left: number };
    showTickLines: boolean;
    showTickLabels: boolean;
    labelFormat: (n: number) => string;
    computedValue: any;
    showSignalUnit: boolean;
    backgroundColor: string;
    foregroundColor: string;
    foregroundStrokeColor: string;
    backgroundStrokeColor: string;
}

class WfArcComponent extends ComponentBaseModel<IWfArcParams> {
    private signalArrayService: SignalArrayService;
    private maxRangeValue: KnockoutComputed<any>;
    private minRangeValue: KnockoutComputed<any>;
    private minRangeSignal: Signal;
    private minRangeSignalName: string;
    private maxRangeSignal: Signal;

    private format: string;
    private signalName: string;
    private currentSignalValue: KnockoutObservable<number>;
    private signal: Signal;
    private r2d: number;
    private height: number;
    private width: number;
    private paddings: { top: number, right: number, bottom: number, left: number };
    private marginBottom: string | number;
    private strokeWidth: number;
    private innerRadius: number;
    private majorTicks: number;
    private showTickLines: boolean;
    private showTickLabels: boolean;
    private hideFirstTickLabel: boolean;
    private hideLastTickLabel: boolean;
    private labelFormat: (n: number) => string;
    private minRange: number;
    private maxRange: number;
    private maxRangeSignalName: string;

    private startAngle: number;
    private endAngle: number;
    private showValueLabel: boolean;
    private showSignalUnit: boolean;
    private backgroundColor: string;
    private foregroundColor: string;
    private foregroundStrokeColor: string;
    private backgroundStrokeColor: string;
    private iconClass: string;
    private iconColor: string;
    private iconStyle: string;
    private computedValue: any;
    private formattedSignalValue: KnockoutObservable<any>;
    private currentAngle: KnockoutComputed<number>;

    private valueConversionsService: ValueConversionsService;

    constructor(params: IWfArcParams) {
        super(params);

        if (this.signalName) {

            this.signal = this.connector.getSignal(this.signalName);
            this.initializeSignalArray();

            if (this.signalArrayService.isArray) {
                this.currentSignalValue = this.signalArrayService.signalValue;
            } else {
                this.currentSignalValue = this.signal.value;
            }

            this.connector.getOnlineUpdates(); 
        }

        // If an static value will be shown, the computedVAlue should be configured 
        if (this.computedValue !== null) {
            this.currentSignalValue = ko.observable(this.computedValue);
        }

        // The formated value will be used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({ numeralNumber: this.format });

        this.initializeComputeds();
        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.valueConversionsService = new ValueConversionsService();

        this.r2d = Math.PI / 180;
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.format = ko.unwrap(this.settings.format) || "0,0.[00]";
        this.height = ko.unwrap(this.settings.height) !== undefined? ko.unwrap(this.settings.height) : 200;
        this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 200;
        this.paddings = ko.unwrap(this.settings.paddings) ? ko.unwrap(this.settings.paddings) : { top: 10, right: 10, bottom: 10, left: 10 };

        this.marginBottom = ko.unwrap(this.settings.marginBottom) !== undefined ? ko.unwrap(this.settings.marginBottom) : (this.height * -0.25) + "px";
        this.strokeWidth = ko.unwrap(this.settings.strokeWidth) !== undefined ? ko.unwrap(this.settings.strokeWidth) : 1;
        this.innerRadius = ko.unwrap(this.settings.innerRadius) !== undefined ? Math.max(Math.min(ko.unwrap(this.settings.innerRadius), 1), 0) : 0.70;

        this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? ko.unwrap(this.settings.majorTicks) : 10;
        this.showTickLines = ko.unwrap(this.settings.showTickLines) !== undefined ? ko.unwrap(this.settings.showTickLines) : true;
        this.showTickLabels = ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false;
        this.labelFormat = this.settings.labelFormat || d3.format('g');


        this.hideFirstTickLabel = ko.unwrap(this.settings.hideFirstTickLabel) !== undefined ? ko.unwrap(this.settings.hideFirstTickLabel) : false;
        this.hideLastTickLabel = ko.unwrap(this.settings.hideLastTickLabel) !== undefined ? ko.unwrap(this.settings.hideLastTickLabel) : false;

        this.minRange = ko.unwrap(this.settings.minRange) !== undefined ? ko.unwrap(this.settings.minRange) : 0;
        this.maxRange = ko.unwrap(this.settings.maxRange) !== undefined ? ko.unwrap(this.settings.maxRange) : 100;

        this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : -120;
        this.endAngle = ko.unwrap(this.settings.endAngle) !== undefined ? ko.unwrap(this.settings.endAngle) : 120;

        this.computedValue = ko.unwrap(this.settings.computedValue) ? ko.unwrap(this.settings.computedValue) : null;

        this.showValueLabel = ko.unwrap(this.settings.showValueLabel) !== undefined ? ko.unwrap(this.settings.showValueLabel) : true;
        this.showSignalUnit = ko.unwrap(this.settings.showSignalUnit) !== undefined ? ko.unwrap(this.settings.showSignalUnit) : true;

        this.backgroundColor = ko.unwrap(this.settings.backgroundColor) || "#CCCCCC";
        this.foregroundColor = ko.unwrap(this.settings.foregroundColor) || "#880000";
        this.foregroundStrokeColor = ko.unwrap(this.settings.foregroundStrokeColor) || "#FFFFFF";
        this.backgroundStrokeColor = ko.unwrap(this.settings.backgroundStrokeColor) || "#FFFFFF";

        this.iconClass = ko.unwrap(this.settings.iconClass) || 'wf wf-speed-gauge wf-2x';
        this.iconColor = ko.unwrap(this.settings.iconColor) || this.foregroundColor;
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";
    }

    protected initializeComputeds() {

        this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
        if (this.maxRangeSignalName)
            this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);

        this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
        if (this.minRangeSignalName)
            this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);

        this.maxRangeValue = ko.computed(() => {
            return this.maxRangeSignal ? _.isNumber(this.maxRangeSignal.value()) ? this.maxRangeSignal.value() : this.maxRange : this.maxRange;
        });

        this.minRangeValue = ko.computed(() => {
            return this.minRangeSignal ? _.isNumber(this.minRangeSignal.value()) ? this.minRangeSignal.value() : this.minRange : this.minRange;
        });

        // If an static value will be shown, the computedVAlue should be configured 
        if (this.computedValue !== null) {
            this.currentSignalValue = ko.observable(this.computedValue);
        }

        // The formated value will be used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({
            numeralNumber: this.format
        });

        this.currentAngle = ko.computed(() => {
            var value = this.currentSignalValue();

            // Prevent the angle to be out of the predefined range
            if (value > this.maxRangeValue()) {
                //this.maxValueVioliation(true);
                //this.minValueVioliation(false);
                return this.endAngle;
            }

            if (value < this.minRangeValue()) {
                //this.minValueVioliation(true);
                //this.maxValueVioliation(false);
                return this.startAngle;
            }

            //this.maxValueVioliation(false);
            //this.minValueVioliation(false);

            // Otherwise calculate and return the angle
            var degree = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
            return degree;

        });
    }


    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected async dispose() {
        await super.dispose();

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

export = WfArcComponent;
