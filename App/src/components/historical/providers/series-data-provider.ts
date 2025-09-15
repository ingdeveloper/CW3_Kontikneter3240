import Logger = require("../../../services/logger");
import SignalsService = require("../../../services/signalsService");

import { IHistoricalDataConfigurationService } from "../models/historical-data-configuration.model";
import { HistoricalDataConfigurationService } from "../services/historical-data-configuration.service";
import { HistoricalDataStatisticsService } from "../services/historical-data-statistics.service";
import { ISeriesUpdateData, TimeSeriesMode, ISeries } from "../models/series.model";
import { ICommonConfiguration, ITimeConfiguration, ISeriesConfigurationSettings } from "../models/series-configuration.model";
import { TimeRangeService } from "../../services/time-range.service";
import { HistoricalDataConfigurationLocalService } from "../services/historical-data-configuration-local.service";
import { SeriesSubscriptionItem } from "./series-subscription-item";

export class SeriesDataProvider {

    private historicalDataConfigurationService: IHistoricalDataConfigurationService = new HistoricalDataConfigurationService();
    private readonly historicalDataStatisticsService = new HistoricalDataStatisticsService(this);

    public lock = true;
    private _referenceCount = 0;
    private updating = false;
    public readonly resolution = ko.observable<number>(null);
    public readonly isLoading = ko.observable(false);

    public readonly updates: KnockoutObservable<ISeriesUpdateData[]> = ko.observable([]);
    private _seriesUpdates: ISeriesUpdateData[] = [];
    private seriesData: { [name: string]: SeriesSubscriptionItem; } = {};

    public get seriesUpdates() {
        return this._seriesUpdates;
    }
    public getSeriesData(key: string) {
        if (key in this.seriesData) {
            return this.seriesData[key].item;
        } else {
            return null;
        }
    }
    public get seriesDataKeys() {
        return Object.keys(this.seriesData)
    }
    public readonly requestRefresh: KnockoutObservable<Date> = ko.observable(null)
        .extend({ rateLimit: { timeout: 1000, method: "notifyWhenChangesStop" } });

    public readonly timestamps: KnockoutObservableArray<Date> = ko.observableArray([]);

    public readonly configuration = ko.observable<ICommonConfiguration>({} as ICommonConfiguration);
    public readonly timeConfiguration = ko.observable<ITimeConfiguration>({} as ITimeConfiguration);
    public readonly timeSeriesMode = ko.observable<TimeSeriesMode>({} as TimeSeriesMode);
    public readonly configurationSettings = ko.observable<ISeriesConfigurationSettings>({} as ISeriesConfigurationSettings);

    public readonly start = ko.observable<Date>(null);
    public readonly end = ko.observable<Date>(null);

    public get name() {
        return this._name;
    }

    public get ids() {
        const ids = [];
        for (const key in this.seriesData) {
            ids.push(this.seriesData[key].item.id);
        }
        return ids;
    }

    public get isUpdating() {
        return this.updating;
    }

    public get lastTimestamp() {
        if (this.timestamps() == null || !this.timestamps().length) {
            return null;
        }
        return _.max(this.timestamps());
    }


    constructor(private _name: string) {

    }

    private getLogId(signal: SignalDefinitionDTO, tag: string) {
        const definitionLog = _.find(signal.Logs, (log) => {
            return log.LogTag === tag;
        });
        return definitionLog.ID || null;
    }

    public async subscribeSeriesAsync(signalName: string, tag: string) {
        const key = `${signalName}/${tag}`
        if (!(key in this.seriesData)) {
            const filter = {
                ServerNames: [],
                AliasNames: [signalName],
                LogTags: [],
                ResultsFilter: SignalDefinitionResultsFilter.Basic | SignalDefinitionResultsFilter.Extended | SignalDefinitionResultsFilter.Group | SignalDefinitionResultsFilter.Logs
            } as GetSignalDefinitionsFilterDTO;

            const signals = await SignalsService.getSignalDefinitions(filter, 0, 1);
            const signal = _.first(signals);

            try {
                const id = this.getLogId(signal, tag);
                const series = { id: id, corrections: [], values: [], signal: signal, tag: tag } as ISeries;
                this.seriesData[key] = new SeriesSubscriptionItem(series);
            } catch (error) {
                console.warn(`The Signal Tag combination does not exsist: ${signalName}/${tag}`);
                delete this.seriesData[key];
            } finally {
                this.requestData();
            }
        }
        this.historicalDataStatisticsService.addLocalSignals(key);
        if (this.seriesData[key]) {
            this.seriesData[key].addSubscriber();
            return this.seriesData[key];
        }
        return null;
    }

    public async unSubscribeSeriesAsync(key: string) {
        if (key in this.seriesData) {
            this.seriesData[key].releaseSubscriber();
            if (!this.seriesData[key].hasSubscribers()) {
                this.historicalDataStatisticsService.removeLocalSignalsAsync(key);
                delete this.seriesData[key];
                this.requestData();
            }
        }
    }

    public get configurationName() {
        return this.configurationSettings().configurationName;
    }

    public get configurationNamespace() {
        return this.configurationSettings().configurationNamespace || "";
    }

    public get initialConfiguration() {
        return this.configurationSettings().initialConfiguration;
    }

    public get clientsideConfiguration() {
        return this.configurationSettings().clientsideConfiguration;
    }

    public addData(data: DatedLogValuesDTO[], seriesNames: string[]) {
        const updates: ISeriesUpdateData[] = []

        for (let i = 0; i < data.length; i++) {
            const values = data[i].Values.map(item => item ? item.Value : undefined);
            const corrections = data[i].Values.map(item => item ? item.EditedValue : undefined);
            const timestamp = data[i].EntriesDate as Date;

            if (seriesNames.length != values.length) {
                Logger.info(this, "Skipped addData");
                return;
            }

            this.addSingelData(timestamp, values, corrections, seriesNames);

            const updateItem: ISeriesUpdateData = {
                timestamp: timestamp
            }

            for (let j = 0; j < values.length; j++) {
                const value = corrections[j] || values[j];
                updateItem[seriesNames[j]] = value;
                if (value != undefined) {
                    this.historicalDataStatisticsService.updateLastValue(seriesNames[j], value, timestamp);
                }
            }
            updates.push(updateItem);
        }
        this.timestamps.valueHasMutated();
        this._seriesUpdates.push(...updates);
        this.updates(updates);
    }

    public removeData(start: Date) {
        const index = _.findIndex(this.timestamps(), (date) => date >= start);

        if (index < 0)
            return;

        for (let key in this.seriesData) {
            this.seriesData[key].item.values.splice(0, index - 1);
            this.seriesData[key].item.corrections.splice(0, index - 1);
        }

        this._seriesUpdates.splice(0, index - 1);
        this.timestamps().splice(0, index - 1);
        this.timestamps.valueHasMutated();
    }

    private addSingelData(timestamp: Date, values: (number | string)[], corrections: (number | string)[], seriesNames: string[]) {
        if (timestamp) {
            for (let i = 0; i < seriesNames.length; i++) {
                this.seriesData[seriesNames[i]].item.values.push(values[i]);
                this.seriesData[seriesNames[i]].item.corrections.push(corrections[i]);
            }
            this.timestamps().push(timestamp);
        }
    }

    public requestData() {
        this.isLoading(true);
        this.requestRefresh(new Date());
    }

    public startGettingUpdates() {
        this.updating = true;
    }

    public updateStatisticsData(data: LogStatisticsDTO[], seriesNames: string[]) {
        this.historicalDataStatisticsService.updateData(data, seriesNames);
    }

    public async backAsync() {
        const range = TimeRangeService.getRangeDates(this.configuration().timeRanges,
            this.configuration().timeRange,
            this.configuration().start,
            this.configuration().end,
            this.configuration().startOffsetInterval,
            this.configuration().startOffset,
            this.configuration().endOffsetInterval,
            this.configuration().endOffset);

        const diff = moment(range.endDate).diff(range.startDate, "milliseconds");

        const end = moment(range.startDate).toDate();
        const start = moment(range.startDate)
            .subtract(diff, "milliseconds")
            .toDate();
        this.configuration().start = start;
        this.configuration().end = end;
        this.configuration().timeRanges = CalendarTimeRanges.Custom;
        this.updateTimeSeriesMode(TimeSeriesMode.Offline);
        await this.updateSeriesTimeConfigurationAsync(this.configuration());
    }

    public async forwardAsync() {
        const range = TimeRangeService.getRangeDates(this.configuration().timeRanges,
            this.configuration().timeRange,
            this.configuration().start,
            this.configuration().end,
            this.configuration().startOffsetInterval,
            this.configuration().startOffset,
            this.configuration().endOffsetInterval,
            this.configuration().endOffset);

        const diff = moment(range.endDate).diff(range.startDate, "milliseconds");

        const start = moment(range.endDate).toDate();
        const end = moment(range.endDate)
            .add(diff, "milliseconds")
            .toDate();
        this.configuration().start = start;
        this.configuration().end = end;
        this.configuration().timeRanges = CalendarTimeRanges.Custom;
        this.updateTimeSeriesMode(TimeSeriesMode.Offline);
        await this.updateSeriesTimeConfigurationAsync(this.configuration());
    }

    public updateTimeSeriesMode(timeSeriesMode: TimeSeriesMode) {
        this.configuration().timeSeriesMode = timeSeriesMode;
        this.timeSeriesMode(timeSeriesMode);
        this.configuration.valueHasMutated();
    }

    public async updateSeriesTimeConfigurationAsync(configuration: ITimeConfiguration) {
        this.configuration().timeRanges = configuration.timeRanges;
        this.configuration().timeRange = configuration.timeRange;
        this.configuration().start = configuration.start;
        this.configuration().end = configuration.end;
        this.configuration().startOffset = configuration.startOffset;
        this.configuration().startOffsetInterval = configuration.startOffsetInterval;
        this.configuration().endOffset = configuration.endOffset;
        this.configuration().endOffsetInterval = configuration.endOffsetInterval;
        this.removeAllData();
        this.timeConfiguration(configuration);
        this.configuration.valueHasMutated();
        if (this.updating) {
            this.requestData();
        }
    }

    public removeAllData() {
        for (let key in this.seriesData) {
            this.seriesData[key].item.values = [];
            this.seriesData[key].item.corrections = [];
        }
        this.timestamps.removeAll();
        this._seriesUpdates = [];
        this.updates([]);
    }

    public updateConfigurationTarget(name: string, namespace: string = "") {
        this.configurationSettings().configurationName = name;
        this.configurationSettings().configurationNamespace = namespace;
        this.configurationSettings.valueHasMutated();
    }

    public async loadNewConfigurationAsync(configuration: ICommonConfiguration) {
        this.removeAllData();
        this.configuration(configuration);
        this.timeConfiguration(configuration);
        this.timeSeriesMode(this.configuration().timeSeriesMode);
    }

    public async listConfigurationsAsync<T>() {
        let data = await this.historicalDataConfigurationService.listAsync<T>(this.configurationNamespace);
        return data;
    }

    public async deleteConfigurationAsync(id: string, name: string = null) {
        await this.historicalDataConfigurationService.deleteAsync(this.clientsideConfiguration ? name : id, this.configurationNamespace);
    }

    public async updateConfigurationAsync<T>(name: string, configuration: T) {
        await this.historicalDataConfigurationService.updateAsync(name, configuration, this.configurationNamespace);
        this.updateConfigurationTarget(name, this.configurationNamespace);
    }

    public async getConfigurationAsync<T>(name: string, namespace: string = null) {
        return await this.historicalDataConfigurationService.getAsync<T>(name, namespace || this.configurationNamespace);
    }

    public async createConfigurationAsync<T>(name: string, configuration: T) {
        await this.historicalDataConfigurationService.createAsync(name, configuration, this.configurationNamespace);
        this.updateConfigurationTarget(name, this.configurationNamespace);
    }

    public reloadHistoricalDataConfigurationService() {
        if (this.clientsideConfiguration) {
            this.historicalDataConfigurationService = new HistoricalDataConfigurationLocalService();
        }
        else {
            this.historicalDataConfigurationService = new HistoricalDataConfigurationService();
        }
    }

    public dispose() {
        this.historicalDataStatisticsService.dispose();
    }

    public addSubscriber() {
        this._referenceCount++;
        Logger.info(this, `Subscribed to ${this._name} SeriesDataProvider [total subscriptions: ${this._referenceCount}]`);
    }

    public releaseSubscriber() {
        this._referenceCount = Math.max(this._referenceCount - 1, 0);
        Logger.info(this, `Unsubscribed from ${this._name} SeriesDataProvider [total subscriptions: ${this._referenceCount}]`);
    }

    public hasSubscribers() {
        return this._referenceCount > 0;
    }
}