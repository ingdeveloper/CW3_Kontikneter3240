import Connector = require("../../../services/connector");

import { ISeriesConfigurationSettings, IChartConfiguration, ITimeConfiguration, ICommonConfiguration, ISeriesConfiguration, IAxisConfiguration, IRegionConfiguration } from "../models/series-configuration.model";
import { SeriesDataProviderFactory, SeriesChartDataProviderFactory } from "../factories/series-data-provider.factory";
import { SeriesConfigurationFactory, SeriesChartConfigurationFactory } from "../factories/series-configuration.factory";

import { TimeRangeService } from "../../services/time-range.service";

import Logger = require("../../../services/logger");
import LogValuesFilter = require("../../../services/models/logValuesFilter");

import { TimeSeriesMode } from "../models/series.model";
import { SeriesConfigurationSettingsFactory } from "../factories/series-configuration-settings.factory";
import { SeriesDataProvider } from "../providers/series-data-provider";
import { ISeriesChartDataProviderFacade, ISeriesChartDataProviderConfiguration, SeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { SeriesChartDataProvider } from "../providers/series-chart-data-provider";

export class SeriesConnector {

    private readonly connector = new Connector();

    private readonly providers: { [name: string]: SeriesDataProvider; } = {};
    private readonly controlProviders: { [name: string]: SeriesChartDataProvider; } = {};

    private readonly refreshSubscriptions: { [name: string]: KnockoutSubscription; } = {};

    private readonly seriesConfigurationFactory = new SeriesConfigurationFactory();
    private readonly seriesChartConfigurationFactory = new SeriesChartConfigurationFactory();

    private readonly seriesConfigurationSettingsFactory = new SeriesConfigurationSettingsFactory();

    private readonly seriesDataProviderFactory = new SeriesDataProviderFactory();
    private readonly seriesChartDataProviderFactory = new SeriesChartDataProviderFactory();

    private static readonly PollInterval = 3000;
    private timer: number = null;
    private polling = true;
    private lock = false;

    private requestPromise: Promise<void>;
    private subscribePromise: Promise<ISeriesChartDataProviderFacade>;

    constructor() {
        this.start();
    }

    public async subscribeAsync(
        name: string,
        comtrolName: string,
        configuration: ISeriesChartDataProviderConfiguration = null,
        configurationSettings: ISeriesConfigurationSettings = null): Promise<ISeriesChartDataProviderFacade> {
        return await this.subscribeAsyncByConfiguration(name, comtrolName, configuration, configuration, configurationSettings);
    }

    public async subscribeAsyncByConfiguration(
        name: string,
        comtrolName: string,
        commonConfiguration: ICommonConfiguration = null,
        chartConfiguration: IChartConfiguration = null,
        configurationSettings: ISeriesConfigurationSettings = null): Promise<ISeriesChartDataProviderFacade> {

        if (name === undefined)
            throw new Error("Subscription failed, name is not defined.");
        if (comtrolName === undefined)
            throw new Error("Subscription failed, comtrolName is not defined.");

        try {
            await this.subscribePromise;
            let promise = this.subscribePromise = this.subscribeAsyncBase(name, comtrolName, commonConfiguration, chartConfiguration, configurationSettings);
            return await promise;
        } catch (error) {
            console.error(error);
        }
    }

    private async subscribeAsyncBase(
        name: string,
        comtrolName: string,
        commonConfiguration: ICommonConfiguration = null,
        chartConfiguration: IChartConfiguration = null,
        configurationSettings: ISeriesConfigurationSettings = null): Promise<ISeriesChartDataProviderFacade> {

        let defaultConfiguration = this.seriesConfigurationFactory.create(commonConfiguration);
        let defaultSeriesChartConfiguration = this.seriesChartConfigurationFactory.create(chartConfiguration);

        let defaultConfigurationSettings = this.seriesConfigurationSettingsFactory.create(configurationSettings);

        let provider: SeriesDataProvider = null;
        let controlProvider: SeriesChartDataProvider = null;

        if (name in this.providers) {
            if (configurationSettings && defaultConfigurationSettings) {
                this.providers[name].configurationSettings(defaultConfigurationSettings);
                this.providers[name].reloadHistoricalDataConfigurationService();
            }
            if (commonConfiguration && defaultConfiguration) {
                this.providers[name].configuration(defaultConfiguration);
                this.seriesDataProviderFactory.update(this.providers[name], defaultConfiguration);
            }
        } else {
            this.providers[name] = this.seriesDataProviderFactory.create(name, defaultConfiguration, defaultConfigurationSettings);
            this.refreshSubscriptions[name] = this.providers[name].requestRefresh.subscribe(() => {
                this.requestDataAsync(this.providers[name]);
            });
        }

        if (this.providers[name]) {
            this.providers[name].addSubscriber();
        }
        provider = this.providers[name];

        await this.subscribePromise;
        if (comtrolName in this.controlProviders) {
            if (chartConfiguration && defaultSeriesChartConfiguration) {
                this.validateAndCleanSeriesConfiguration(defaultSeriesChartConfiguration)
                this.controlProviders[comtrolName].configuration(defaultSeriesChartConfiguration);
                this.seriesChartDataProviderFactory.update(this.controlProviders[comtrolName], defaultSeriesChartConfiguration);

            }
        } else {
            this.validateAndCleanSeriesConfiguration(defaultSeriesChartConfiguration)
            this.controlProviders[comtrolName] = await this.seriesChartDataProviderFactory.createAsync(comtrolName, this, provider, defaultSeriesChartConfiguration);

            if (provider.initialConfiguration !== null) {
                const configuration = await provider.getConfigurationAsync<ISeriesChartDataProviderConfiguration>(provider.initialConfiguration, provider.configurationNamespace);
                if (configuration) {
                    provider.updateConfigurationTarget(configuration.name, provider.configurationNamespace);
                    await provider.loadNewConfigurationAsync(configuration.configuration);
                    await this.controlProviders[comtrolName].loadNewConfigurationAsync(configuration.configuration);
                }
            }
        }

        if (this.controlProviders[comtrolName]) {
            this.controlProviders[comtrolName].addSubscriber();
        }

        controlProvider = this.controlProviders[comtrolName];

        return new SeriesChartDataProviderFacade(provider, controlProvider);
    }

    public unSubscribe(name: string, controlName: string) {
        if (name in this.providers) {
            this.providers[name].releaseSubscriber();
            if (!this.providers[name].hasSubscribers()) {
                this.providers[name].dispose();
                delete this.providers[name];
                this.refreshSubscriptions[name].dispose();
                delete this.refreshSubscriptions[name];
            }
        }
        if (controlName in this.controlProviders) {
            this.controlProviders[controlName].releaseSubscriber();
            if (!this.controlProviders[controlName].hasSubscribers()) {
                this.controlProviders[controlName].dispose();
                delete this.controlProviders[controlName];
            }
        }
    }

    private start() {
        Logger.info(this, `Starting historical data connector.`);
        this.polling = true;
        this.pollDataAsync();
    }

    private stop() {
        Logger.info(this, `Stopping historical data connector.`);
        clearTimeout(this.timer);
        this.timer = null;
        this.polling = false;
    }

    private validateAndCleanSeriesConfiguration(configuration: IChartConfiguration) {
        const isValid = this.validateSeriesConfiguration(configuration);
        if (isValid === false) {
            this.cleanSeriesConfiguration(configuration);
        }
    }

    private validateSeriesConfiguration(configuration: IChartConfiguration) {
        Logger.info(this, `Validate series configuration.`);
        if (!configuration.series) {
            return true;
        }

        const seriesNames = _.uniq(_.pluck(configuration.series, "name"));
        if (configuration.series.length !== seriesNames.length) {
            Logger.warn(this, `Duplicate series names.`);
            return false;
        }

        const axesNames = _.uniq(_.pluck(configuration.axes, "name"));
        if (configuration.axes.length !== axesNames.length) {
            Logger.warn(this, `Duplicate axis names.`);
            return false;
        }
        const regionNames = _.uniq(_.pluck(configuration.regions, "name"));
        if (configuration.regions.length !== regionNames.length) {
            Logger.warn(this, `Duplicate range names.`);
            return false;
        }
        return true;
    }

    private cleanSeriesConfiguration(configuration: IChartConfiguration) {
        configuration.series = _.uniq<ISeriesConfiguration, string>(configuration.series, _.property("name"));
        configuration.axes = _.uniq<IAxisConfiguration, string>(configuration.axes, _.property("name"));
        configuration.regions = _.uniq<IRegionConfiguration, string>(configuration.regions, _.property("name"));
    }

    private async pollDataAsync() {
        if (!this.polling) return;

        if (Object.keys(this.providers).length > 0) {
            // Logger.info(this, `Start requesting historical data.`);
            await this.requestOnlineDataAsync();
            // Logger.info(this, `Finished requesting historical data.`);
        }
        if (!this.polling) return;

        clearTimeout(this.timer);
        this.timer = null;

        this.timer = window.setTimeout(() => {
            this.pollDataAsync();
        }, SeriesConnector.PollInterval);
    }

    public async requestCountAsync(provider: SeriesChartDataProvider, start: Date, end: Date) {
        const filter = this.getHistoricalStatisticsFilterModel(provider.ids, start, end);
        return await this.connector.getLogValuesCount(filter);
    }

    public async requestSpecificDataAsync(provider: SeriesChartDataProvider, start: Date, end: Date) {
        if (this.lock) {
            Logger.info(this, "Skipped requesting historical data because request is running.");
            return;
        }
        if (!provider.isUpdating) {
            Logger.info(this, "Skipped requesting historical data because updating is not enabled.");
            return;
        }
        const filter = this.getHistoricalDataFilterModel(provider.ids, start, end, null);

        if (filter.logIds().length === 0) {
            Logger.info(this, "Skipped requesting historical data because log IDs specified.");
            return;
        }

        Logger.info(this, `Request specific historical data for provider ${provider.name}, start: ${moment(filter.startDate()).format()}, end: ${moment(filter.endDate()).format()}`);

        return await this.connector.getPeekLogValues(filter, provider.resolution());
    }


    public async requestDataAsync(provider: SeriesDataProvider, forceRefresh = true) {
        try {
            provider.isLoading(true);
            if (this.requestPromise) {
                await this.requestPromise;
            }
            this.requestPromise = this.requestDataAsyncBase(provider, forceRefresh);
            await this.requestPromise;
            this.requestPromise = null;
        }
        catch (error) {
            Logger.error(this, error);
        }
        finally {
            provider.isLoading(false);
        }
    }

    private async requestDataAsyncBase(provider: SeriesDataProvider, forceRefresh = true) {
        if (this.lock) {
            Logger.info(this, "Skipped requesting historical data because request is running.");
            return;
        }
        if (!provider.isUpdating) {
            Logger.info(this, "Skipped requesting historical data because updating is not enabled.");
            return;
        }

        this.setDates(provider);
        const statisticsPromise = this.requestLogStatisticsAsync(provider);
        const lastValueBeforePromise = this.requestCursorDataAsync(provider);
        const dataPromise = this.requestLogDataAsync(provider, forceRefresh);
        await statisticsPromise;
        await lastValueBeforePromise;
        await dataPromise;
    }


    private async requestLogStatisticsAsync(provider: SeriesDataProvider) {
        const filter = this.getHistoricalStatisticsFilter(provider);

        if (filter.LogIDs.length === 0)
            return;

        Logger.info(this, `Request historical data statistics for provider ${provider.name}, start: ${moment(filter.StartDate).format()}, end: ${moment(filter.EndDate).format()}`);

        const statisticsFilter = this.getHistoricalStatisticsFilter(provider);
        const data = await this.connector.getLogStatistics(statisticsFilter);
        this.updateStatisticsData(provider, data);
    }

    private async requestLastValuesBeforeDateAsync(provider: SeriesChartDataProvider) {
        const filters = this.getLastValuesBeforeDateFilters(provider);

        if (filters.length === 0)
            return;

        Logger.info(this, `Request historical cursor data for provider ${provider.name}`);

        let promises = [] as Promise<DatedLogValuesDTO[]>[];

        for (const filter of filters) {
            promises.push(this.connector.getLastValuesBeforeDate([filter.filter], filter.date));
        }

        for (let i = 0; i < filters.length; i++) {
            const filter = filters[i];
            const data = await promises[i];
            this.updateCursorData(provider, filter.series, filter.coursor, data[0].Values[0], moment(filter.date).toDate());
        }
    }

    private async requestLogDataAsync(provider: SeriesDataProvider, forceRefresh = true) {
        const filter = this.getHistoricalDataFilter(provider, forceRefresh);

        if (filter.logIds().length === 0)
            return;
        Logger.info(this, `Request historical data for provider ${provider.name}, start: ${moment(filter.startDate()).format()}, end: ${moment(filter.endDate()).format()}`);

        let data: DatedLogValuesDTO[];

        if (provider.resolution() === null) {
            data = await this.connector.getLogValues(filter);
        } else {
            data = await this.connector.getPeekLogValues(filter, provider.resolution());
        }

        this.addDataToProvider(provider, data, true);
        const timeRangeDates = this.getRangeDates(provider.configuration());
        provider.removeData(timeRangeDates.startDate);
    }

    private async requestOnlineDataAsync() {
        this.lock = true;
        const filters = this.getHistoricalDataFilters(true);

        for (let name in filters) {
            const filter = filters[name];
            if (filter.logIds().length === 0) {
                Logger.info(this, `Skipped requesting online data for provider ${name} because provider filter has no logs for signals.`);
                continue;
            }

            if (this.providers[name].lock === true) {
                Logger.info(this, `Skipped requesting online data for provider ${name} because provider is changing configuration.`);
                continue;
            }

            if (!this.providers[name].isUpdating) {
                Logger.info(this, `Skipped requesting online data for provider ${name} because updating is not enabled.`);
                continue;
            }

            if (this.providers[name].isLoading() === true) {
                Logger.info(this, `Skipped requesting online data for provider ${name} because chart is loading.`);
                continue;
            }

            Logger.info(this, `Request online data for provider ${name}, start: ${moment(filter.startDate()).format()}, end: ${moment(filter.endDate()).format()}`);
            this.setDates(this.providers[name]);
            const promise = this.connector.getLogValues(filter);
            const statisticsPromise = this.requestLogStatisticsAsync(this.providers[name]);
            const lastValueBeforePromise = this.requestCursorDataAsync(this.providers[name]);
            try {
                const data = await promise;
                await statisticsPromise;
                await lastValueBeforePromise;
                if (name in this.providers) {
                    const provider = this.providers[name];
                    this.addDataToProvider(provider, data);
                    const timeRangeDates = this.getRangeDates(provider.configuration());
                    provider.removeData(timeRangeDates.startDate);
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.lock = false;
            }
        }
        this.lock = false;
    }

    private async requestCursorDataAsync(provider: SeriesDataProvider) {
        const promises: Promise<void>[] = []
        for (let key in this.controlProviders) {
            if (this.controlProviders[key].provider === provider) {
                promises.push(this.requestLastValuesBeforeDateAsync(this.controlProviders[key]));
            }
        }
        await Promise.all(promises);
    }

    private updateStatisticsData(provider: SeriesDataProvider, data: LogStatisticsDTO[]) {
        Logger.info(this, `Adding statistics data to provider ${provider.name}.`);
        provider.updateStatisticsData(data, provider.seriesDataKeys);
    }

    private updateCursorData(provider: SeriesChartDataProvider, series: string, coursor: string, data: LogValueDTO, date: Date) {
        Logger.info(this, `Adding coursor data to provider ${provider.name}, series ${series}, coursor ${coursor}.`);
        provider.updateCursorData(series, coursor, data, date);
    }

    private addDataToProvider(provider: SeriesDataProvider, data: DatedLogValuesDTO[], foreceReset = false) {
        if (data.length === 0)
            return;
        Logger.info(this, `Adding ${data.length} intervals to historical data from provider ${provider.name}.`);
        if (foreceReset == true) {
            provider.removeAllData();
        }
        provider.addData(data, provider.seriesDataKeys);
    }

    private getLastValuesBeforeDateFilters(provider: SeriesChartDataProvider) {
        const filters = [] as { filter: SignalLogTagFilterDTO, date: moment.Moment, series: string, coursor: string }[]
        const filterData = provider.getCursorFilterData();
        for (let filter of filterData) {
            let date = filter.cursor.timestamp;
            if (filter.cursor.offsetInterval) {
                date = moment().subtract(filter.cursor.offset || "minutes", 0 || filter.cursor.offsetInterval).toDate();
            }
            filters.push({
                filter: this.getLastValuesBeforeDateModel(filter.series.signal.ID, filter.series.tag),
                date: moment(date),
                series: filter.name,
                coursor: filter.cursor.name
            });
        }
        return filters;
    }

    private getHistoricalStatisticsFilter(provider: SeriesDataProvider) {
        const timeRangeDates = this.getRangeDates(provider.configuration());
        return this.getHistoricalStatisticsFilterModel(provider.ids, timeRangeDates.startDate, timeRangeDates.endDate);
    }

    private getLastValuesBeforeDateModel(ids: string, logTag: string) {
        return {
            SignalID: ids,
            LogTag: logTag
        } as SignalLogTagFilterDTO
    }

    private getHistoricalStatisticsFilterModel(ids: string[], start: Date, end: Date) {
        return {
            LogIDs: ids,
            StartDate: moment(start).toMSDateTimeOffset(),
            EndDate: moment(end).toMSDateTimeOffset(),
        } as LogStatisticsFilterDTO
    }

    private getHistoricalDataFilterModel(ids: string[], start: Date, end: Date, count: number) {
        return new LogValuesFilter(ids, moment(start), moment(end), count, LogValuesSortOrder.DateAscending);
    }

    public getHistoricalDataFilter(provider: SeriesDataProvider, forceRefresh: boolean = false) {
        const configuration = provider.configuration();
        const timeRangeDates = this.getRangeDates(configuration);
        let start = this.getNextStartDate(configuration.timeSeriesMode, provider.lastTimestamp, timeRangeDates.startDate, forceRefresh);
        return this.getHistoricalDataFilterModel(provider.ids, start, timeRangeDates.endDate, configuration.count);
    }

    private getNextStartDate(timeSeriesMode: TimeSeriesMode, lastTimestamp: Date, startDate: Date, forceRefresh: boolean) {
        if (timeSeriesMode === TimeSeriesMode.Online && !forceRefresh) {
            if (lastTimestamp) {
                return moment(lastTimestamp).add(1, "milliseconds").toDate();
            }
        }
        return startDate;
    }

    private getHistoricalDataFilters(online: boolean) {
        const filters: { [name: string]: LogValuesFilter; } = {};

        for (let name in this.providers) {
            const provider = this.providers[name];
            const configuration = provider.configuration();
            if (online && configuration.timeSeriesMode === TimeSeriesMode.Offline) {
                continue;
            }
            const filter = this.getHistoricalDataFilter(provider);
            filters[name] = filter;
        }
        return filters;
    }

    private setDates(provider: SeriesDataProvider) {
        const timeRangeDates = this.getRangeDates(provider.configuration());
        provider.start(timeRangeDates.startDate);
        provider.end(timeRangeDates.endDate);
    }

    private getRangeDates(configuration: ITimeConfiguration) {
        return TimeRangeService.getRangeDates(configuration.timeRanges,
            configuration.timeRange,
            configuration.start,
            configuration.end,
            configuration.startOffsetInterval,
            configuration.startOffset,
            configuration.endOffsetInterval,
            configuration.endOffset);
    }
}