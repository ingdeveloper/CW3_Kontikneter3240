
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

type FieldType = "CursorName" | "CursorValue" | "CursorTimestamp";

interface IWfHistoricalDataSeriesDetailsParams extends IComponentBaseParams {
    displayMode: SeriesDetailsDisplayMode;
    fields: FieldType[];
    groupName: string;
    controlName: string;
    ignoreCommonConfiguration: boolean;
    ignoreChartConfiguration: boolean;
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
        this.fields = ko.unwrap(this.settings.fields) != undefined ? ko.unwrap(this.settings.fields) : ["CursorName", "CursorValue", "CursorTimestamp"];

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

        this.ignoreCommonConfiguration = ko.unwrap(this.settings.ignoreCommonConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreCommonConfiguration) : true;
        this.ignoreChartConfiguration = ko.unwrap(this.settings.ignoreChartConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreChartConfiguration) : true;
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
            case "CursorName":
                return true;
        }
        return false;
    }

    public isDynamicField(name: FieldType) {
        switch (name) {
            case "CursorValue":
            case "CursorTimestamp":
                return true;
        }
        return false;
    }

    public getDynamicFieldSignalName(name: FieldType, seriesName: string, cursorName: string) {
        switch (name) {
            case "CursorValue":
                return `local://${this.groupName}->${this.controlName}->${seriesName}->CURSOR->${cursorName}->Value`;
            case "CursorTimestamp":
                return `local://${this.groupName}->${this.controlName}->${seriesName}->CURSOR->${cursorName}->Timestamp`;
        }
    }

    public getStaticFieldValue(name: FieldType, seriesName: string, cursorName: string) {
        const series = _.find(this.series(), item => item.name === seriesName);
        const cursor = _.find(series.cursors, item => item.name === cursorName);

        if (!series)
            return "";

        switch (name) {
            case "CursorName":
                return cursor.name;
        }
    }
}

export = WfHistoricalDataSeriesDetailsComponent;