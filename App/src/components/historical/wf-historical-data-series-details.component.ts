
import ComponentBaseModel = require("../component-base.model");
import { HistoricalData } from "./historical-data";
import { ISeriesConfiguration, ICommonConfiguration, IChartConfiguration } from "./models/series-configuration.model";
import { ISeriesChartDataProviderFacade } from "./providers/series-chart-data-provider.facade";
import { TimeSeriesMode } from "../../services/connectorEnums";

enum SeriesDetailsDisplayMode {
    Row,
    Column,
    Card
}

type FieldType = "SeriesName" | "SignalName" | "SignalAlias" | "SignalDescription" | "SignalMin" | "SignalMax" | "SeriesMin" | "SeriesMax" | "SeriesAvg" | "Unit" | "LastValue" | "LastTimestamp";

interface IWfHistoricalDataSeriesDetailsParams extends IComponentBaseParams {
    displayMode: SeriesDetailsDisplayMode;
    fields: FieldType[],
    groupName: string,
    controlName: string,
    ignoreCommonConfiguration: boolean,
    ignoreChartConfiguration: boolean,
    timeSeriesMode?: TimeSeriesMode;
    series: ISeriesConfiguration[];
    timeRanges?: CalendarTimeRanges;
    timeRange?: Date;
    start?: Date;
    end?: Date;
    startOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetInterval?: number;
    endOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    endOffsetInterval?: number;
}

class WfHistoricalDataSeriesDetailsComponent extends ComponentBaseModel<IWfHistoricalDataSeriesDetailsParams> {
    public provider: ISeriesChartDataProviderFacade;
    public groupName: string;
    public controlName: string;

    public displayMode: SeriesDetailsDisplayMode;
    public fields: FieldType[];
    public series = ko.observable<ISeriesConfiguration[]>([]);
    public seriesNames: string[] = [];
    public subsciption: KnockoutSubscription;

    // Time Configuration
    public timeSeriesMode?: TimeSeriesMode;
    public seriesConfiguration?: ISeriesConfiguration[];
    public timeRanges?: CalendarTimeRanges;
    public timeRange?: Date;
    public start?: Date;
    public end?: Date;
    public startOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    public startOffsetInterval?: number;
    public endOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    public endOffsetInterval?: number;

    public ignoreCommonConfiguration?: boolean;
    public ignoreChartConfiguration?: boolean;

    constructor(params: IWfHistoricalDataSeriesDetailsParams) {
        super(params);
        this.getProvidersAsync();
    }

    private async getProvidersAsync() {
        this.provider = await HistoricalData.seriesConnector.subscribeAsyncByConfiguration(this.groupName, this.controlName, this.buildCommonConfiguration(), this.buildChartConfiguration());
        this.provider.startGettingUpdates();
        this.subsciption = this.provider.series.subscribe((value) => {
            this.series(value);
        });
        this.series(this.provider.series());
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.groupName = ko.unwrap(this.settings.groupName) || ko.unwrap(this.id);
        this.controlName = ko.unwrap(this.settings.controlName) || ko.unwrap(this.id);
        this.displayMode = ko.unwrap(this.settings.displayMode) != undefined ? ko.unwrap(this.settings.displayMode) : SeriesDetailsDisplayMode.Row;
        this.fields = ko.unwrap(this.settings.fields) != undefined ? ko.unwrap(this.settings.fields) : ["SeriesName", "SignalAlias", "LastValue", "LastTimestamp"];

        this.timeSeriesMode = ko.unwrap(this.settings.timeSeriesMode) !== undefined ? ko.unwrap(this.settings.timeSeriesMode) : TimeSeriesMode.Offline;
        this.timeRanges = ko.unwrap(this.settings.timeRanges) !== undefined ? ko.unwrap(this.settings.timeRanges) : CalendarTimeRanges.Actual;
        this.timeRange = ko.unwrap(this.settings.timeRange) !== undefined ? ko.unwrap(this.settings.timeRange) : null;
        this.start = ko.unwrap(this.settings.start) !== undefined ? ko.unwrap(this.settings.start) : null;
        this.end = ko.unwrap(this.settings.end) !== undefined ? ko.unwrap(this.settings.end) : null;
        this.startOffset = ko.unwrap(this.settings.startOffset) !== undefined ? ko.unwrap(this.settings.startOffset) : "minutes";
        this.startOffsetInterval = ko.unwrap(this.settings.startOffsetInterval) !== undefined ? ko.unwrap(this.settings.startOffsetInterval) : 15;
        this.endOffset = ko.unwrap(this.settings.endOffset) !== undefined ? ko.unwrap(this.settings.endOffset) : "minutes";
        this.endOffsetInterval = ko.unwrap(this.settings.endOffsetInterval) !== undefined ? ko.unwrap(this.settings.endOffsetInterval) : 0;
        this.seriesConfiguration = ko.unwrap(this.settings.series) !== undefined ? ko.unwrap(this.settings.series) : [];

        this.ignoreChartConfiguration = ko.unwrap(this.settings.ignoreChartConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreChartConfiguration) : true;
        this.ignoreCommonConfiguration = ko.unwrap(this.settings.ignoreCommonConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreCommonConfiguration) : true;
    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.groupName, this.controlName);
        this.subsciption.dispose();
    }

    private buildCommonConfiguration() {
        if (this.ignoreCommonConfiguration) {
            return null;
        }
        return {
            end: this.end,
            endOffset: this.endOffset,
            endOffsetInterval: this.endOffsetInterval,
            start: this.start,
            startOffsetInterval: this.startOffsetInterval,
            startOffset: this.startOffset,
            timeRange: this.timeRange,
            timeRanges: this.timeRanges
        } as ICommonConfiguration
    }

    private buildChartConfiguration() {
        if (this.ignoreChartConfiguration) {
            return null;
        }
        return {
            series: this.seriesConfiguration,
            timeSeriesMode: this.timeSeriesMode
        } as IChartConfiguration
    }

    public isStaticField(name: FieldType) {
        switch (name) {
            case "SeriesName":
            case "SignalAlias":
            case "SignalDescription":
            case "SignalMax":
            case "SignalMin":
            case "SignalName":
            case "Unit":
                return true;
        }
        return false;
    }

    public isDynamicField(name: FieldType) {
        switch (name) {
            case "LastTimestamp":
            case "LastValue":
            case "SeriesAvg":
            case "SeriesMin":
            case "SeriesMax":
                return true;
        }
        return false;
    }

    public getDynamicFieldSignalName(name: FieldType, item: ISeriesConfiguration) {

        if (!item) {
            return "";
        }

        switch (name) {
            case "LastTimestamp":
                return `local://${this.groupName}->${item.signalName}/${item.tag}->last-timestamp`;
            case "LastValue":
                return `local://${this.groupName}->${item.signalName}/${item.tag}->last-value`;
            case "SeriesAvg":
                return `local://${this.groupName}->${item.signalName}/${item.tag}->avg`
            case "SeriesMin":
                return `local://${this.groupName}->${item.signalName}/${item.tag}->min`
            case "SeriesMax":
                return `local://${this.groupName}->${item.signalName}/${item.tag}->max`
        }

    }

    public getStaticFieldValue(name: FieldType, seriesName: string) {
        const series = _.find(this.series(), item => item.name === seriesName);
        if (!series)
            return "";

        let key = `${series.signalName}/${series.tag}`;
        const seriesData = this.provider.getSeriesData(key);

        if (!seriesData)
            return "";

        switch (name) {
            case "SeriesName":
                return series.name;
            case "SignalAlias":
                return seriesData.signal.AliasName;
            case "SignalDescription":
                return seriesData.signal.Description;
            case "SignalMax":
                return seriesData.signal.Maximum;
            case "SignalMin":
                return seriesData.signal.Minimum;
            case "SignalName":
                return seriesData.signal.Name;
            case "Unit":
                return seriesData.signal.Unit;
            default:
                return "";
        }
    }
}

export = WfHistoricalDataSeriesDetailsComponent;