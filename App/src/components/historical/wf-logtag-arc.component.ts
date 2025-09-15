import ComponentBaseModel = require("../component-base.model");
import Signal = require("../../services/models/signal");
import ValueConversionsService = require("../services/value-conversions.service");

interface IPadding {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
}

/**
 * This interface contains the HTML parameters for the WfLogTagArcComponent.
 * 
 * @interface IWfInputParams
 * @extends {IComponentBaseParams}
 * @extends {IVisualSecurityParams}
 */
interface IWfLogTagArcParams extends IWfArcBaseParams {
    logTagName: string;
    paddings: IPadding;
    strokeWidth: number;
    showTickLines: boolean;
    showTickLabels: boolean;
    labelFormat: any;
    showSignalUnit: boolean;
    backgroundColor: string;
    foregroundColor: string;
    foregroundStrokeColor: string;
    backgroundStrokeColor: string;
    maxRangeSignalName: string;
    minRangeSignalName: string;

    startOffset: string;
    startOffsetIntervall: number;

    valueType: string;
}

class WfLogTagArcComponent extends ComponentBaseModel<IWfLogTagArcParams> {
    private signalName: string;
    private logTagName: string;

    private format: string;
    private width: number;
    private height: number;
    private paddings: IPadding;
    private innerRadius: number;
    private marginBottom: number;
    private startAngle: number;
    private endAngle: number;
    private strokeWidth: number;
    private majorTicks: number;
    private showTickLines: boolean;
    private showTickLabels: boolean;
    private hideFirstTickLabel: boolean;
    private hideLastTickLabel: boolean;
    private labelFormat: any;

    private minRange: number;
    private maxRange: number;

    private showValueLabel: boolean;
    private showSignalUnit: boolean;
    private r2d: number;

    private backgroundColor: string;
    private foregroundColor: string;
    private foregroundStrokeColor: string;
    private backgroundStrokeColor: string;

    private iconClass: string;
    private iconColor: string;
    private iconStyle: string;

    private maxRangeSignalName: string;
    private minRangeSignalName: string;

    private maxRangeSignal: Signal;
    private minRangeSignal: Signal;

    private maxRangeValue: KnockoutComputed<number>;
    private minRangeValue: KnockoutComputed<number>;
    private currentAngle: KnockoutComputed<number>;

    private formattedSignalValue: KnockoutObservable<any>;
    private currentSignalValue: KnockoutObservable<any>;

    private valueConversionsService: ValueConversionsService;

    private startOffset: string;
    private startOffsetIntervall: number;

    private fromDate: any;
    private toDate: any;

    private valueType: string;
    private logId: string;

    constructor(params: IWfLogTagArcParams) {
        super(params);

        this.currentSignalValue = ko.observable();

        this.initializeObservable();
        this.connector.getOnlineUpdates(); 
        this.getLogId();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.logTagName = (ko.unwrap(this.settings.logTagName) || '').stringPlaceholderResolver(this.objectID);

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
        this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 200;
        this.height = ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : 200;

        this.paddings = ko.unwrap(this.settings.paddings) ? ko.unwrap(this.settings.paddings) : { top: 10, right: 10, bottom: 10, left: 10 };

        this.innerRadius = ko.unwrap(this.settings.innerRadius) ? ko.unwrap(this.settings.innerRadius) : 0.7;
        this.marginBottom = ko.unwrap(this.settings.marginBottom) !== undefined ? ko.unwrap(this.settings.marginBottom) : (this.height * 0.25);
        this.strokeWidth = ko.unwrap(this.settings.strokeWidth) !== undefined ? ko.unwrap(this.settings.strokeWidth) : 1;

        this.valueConversionsService = new ValueConversionsService();

        this.r2d = Math.PI / 180;

        this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? ko.unwrap(this.settings.majorTicks) : 10;
        this.showTickLines = ko.unwrap(this.settings.showTickLines) !== undefined ? ko.unwrap(this.settings.showTickLines) : true;
        this.showTickLabels = ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false;
        this.hideFirstTickLabel = ko.unwrap(this.settings.hideFirstTickLabel) !== undefined ? ko.unwrap(this.settings.hideFirstTickLabel) : false;
        this.hideLastTickLabel = ko.unwrap(this.settings.hideLastTickLabel) !== undefined ? ko.unwrap(this.settings.hideLastTickLabel) : false;
        this.labelFormat = ko.unwrap(this.settings.labelFormat) || d3.format('g');

        this.minRange = ko.unwrap(this.settings.minRange) !== undefined ? ko.unwrap(this.settings.minRange) : 0;
        this.maxRange = ko.unwrap(this.settings.maxRange) !== undefined ? ko.unwrap(this.settings.maxRange) : 100;

        this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : -120;
        this.endAngle = ko.unwrap(this.settings.endAngle) !== undefined ? ko.unwrap(this.settings.endAngle) : 120;

        this.showValueLabel = ko.unwrap(this.settings.showValueLabel) !== undefined ? ko.unwrap(this.settings.showValueLabel) : true;
        this.showSignalUnit = ko.unwrap(this.settings.showSignalUnit) !== undefined ? ko.unwrap(this.settings.showSignalUnit) : true;

        this.backgroundColor = ko.unwrap(this.settings.backgroundColor) ? ko.unwrap(this.settings.backgroundColor) : "#CCCCCC";
        this.foregroundColor = ko.unwrap(this.settings.foregroundColor) ? ko.unwrap(this.settings.foregroundColor) : "#880000";
        this.foregroundStrokeColor = ko.unwrap(this.settings.foregroundStrokeColor) ? ko.unwrap(this.settings.foregroundStrokeColor) : "#FFFFFF";
        this.backgroundStrokeColor = ko.unwrap(this.settings.backgroundStrokeColor) ? ko.unwrap(this.settings.backgroundStrokeColor) : "#FFFFFF";

        this.iconClass = ko.unwrap(this.settings.iconClass) != null ? ko.unwrap(this.settings.iconClass) : 'wf wf-speed-gauge wf-2x';
        this.iconColor = ko.unwrap(this.settings.iconColor) ? ko.unwrap(this.settings.iconColor) : this.foregroundColor;
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) !== undefined ? ko.unwrap(this.settings.startOffsetIntervall) : 1;

        this.fromDate = ko.observable(moment().startOf('minute').subtract(this.startOffsetIntervall, this.startOffset).toDate());
        this.toDate = ko.observable(moment());

        this.valueType = ko.unwrap(this.settings.valueType) !== undefined ? ko.unwrap(this.settings.valueType) : "Max"; //calues: Max, Min, Avg
    }

    private initializeObservable() {

        this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
        if (this.maxRangeSignalName)
            this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);

        this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
        if (this.minRangeSignalName)
            this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);

        this.maxRangeValue = ko.computed(() => {
            return this.maxRangeSignal ? _.isNumber(this.maxRangeSignal.value()) ? this.maxRangeSignal.value() : this.maxRange : this.maxRange;
        }, this);

        this.minRangeValue = ko.computed(() => {
            return this.minRangeSignal ? _.isNumber(this.minRangeSignal.value()) ? this.minRangeSignal.value() : this.minRange : this.minRange;
        }, this);

        // The formated value will be used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({ numeralNumber: this.format });

        this.currentAngle = ko.computed(() => {
            var value = this.currentSignalValue();

            // Prevent the angle to be out of the predefined range
            if (value > this.maxRangeValue()) {
                return this.endAngle;
            }

            if (value < this.minRangeValue()) {
                return this.startAngle;
            }

            // Otherwise calculate and return the angle
            var degree = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
            return degree;

        }, this);
    }

    private async getLogId() {
        try {
            if (!this.logTagName)
                return;

            var definition = await this.connector.getSignalDefinition(this.signalName) as SignalDefinitionDTO;
            if (!definition)
                return;

            var logs = definition.Logs;
            var log = _.findWhere(logs, { LogTag: this.logTagName, Active: true }) as LogDTO;
            if (!log)
                return;

            this.logId = log.ID;

            this.getData();
        } catch (error) {
            this.connector.handleError(WfLogTagArcComponent)(error);
        }
    }

    private async getData() {

        var filter: LogStatisticsFilterDTO = {
            LogIDs: [this.logId],
            StartDate: moment(this.fromDate()).toMSDateTimeOffset(),
            EndDate: moment(this.toDate()).toMSDateTimeOffset()
        }

        try {
            var logValues = await this.connector.getLogStatistics(filter) as LogStatisticsDTO[];
            if (!logValues || logValues.length === 0)
                return;

            var logValue = logValues[0];

            switch (this.valueType) {
                case "Max":
                    if (logValue.Maximum) {
                        this.currentSignalValue(logValue.Maximum.Value.EditedValue ? logValue.Maximum.Value.EditedValue : logValue.Maximum.Value.Value);
                        break;
                    }
                case "Min":
                    if (logValue.Minimum) {
                        this.currentSignalValue(logValue.Minimum.Value.EditedValue ? logValue.Minimum.Value.EditedValue : logValue.Minimum.Value.Value);
                        break;
                    }
                case "Avg":
                    if (logValue.Average) {
                        this.currentSignalValue(logValue.Average.Value.EditedValue ? logValue.Average.Value.EditedValue : logValue.Average.Value.Value);
                        break;
                    }
            }
        } catch (error) {
            this.connector.handleError(WfLogTagArcComponent)(error);
        }
    }

    /**
     *  Place here signal cleanup functionality.
     * 
     * @protected
     * @returns 
     * 
     * @memberOf WfInputComponent
     */
    protected async dispose() {

        if (this.visualSecurityService)
            this.visualSecurityService.dispose();
        if (this.maxRangeSignal)
            this.connector.unregisterSignals(this.maxRangeSignal);
        if (this.minRangeSignal)
            this.connector.unregisterSignals(this.minRangeSignal);
    }
}

export = WfLogTagArcComponent;