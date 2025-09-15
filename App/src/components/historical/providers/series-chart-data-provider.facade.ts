import { IChartConfiguration, ILegendConfiguration, IExportConfiguration, IScrollbarConfiguration, IAxisConfiguration, IRegionConfiguration, ISeriesConfiguration, ITimeConfiguration, ICommonConfiguration } from "../models/series-configuration.model";
import { TimeSeriesMode, ISeriesUpdateData, ISeries } from "../models/series.model";
import { IHistoricalDataConfiguration } from "../models/historical-data-configuration.model";
import { IHistoricalDataSignalUpdate } from "../models/historical-data-signal-update.model";
import { SeriesDataProvider } from "./series-data-provider";
import { SeriesChartDataProvider } from "./series-chart-data-provider";
import { SeriesSubscriptionItem } from "./series-subscription-item";

export interface ISeriesDataProviderFacade<TConfiguration> {
    provider: SeriesDataProvider;

    requestData(): void;
    filter(data: ISeriesUpdateData[]): ISeriesUpdateData[];
    addData(data: DatedLogValuesDTO[], seriesNames: string[]): void;
    startGettingUpdates(): void;
    updateTimeSeriesMode(timeSeriesMode: TimeSeriesMode): void;
    updateSeriesTimeConfigurationAsync(configuration: ITimeConfiguration): Promise<void>;

    loadConfigurationAsync(name: string, namespace?: string): Promise<void>
    deleteConfigurationAsync(id: string, name?: string): Promise<void>
    updateConfigurationAsync(name: string): Promise<void>

    listConfigurationsAsync(): Promise<IHistoricalDataConfiguration<TConfiguration>[]>;
    getConfigurationAsync(name: string): Promise<IHistoricalDataConfiguration<TConfiguration>>

    timeConfiguration: KnockoutObservable<ITimeConfiguration>;
    timeSeriesMode: KnockoutObservable<TimeSeriesMode>;
    start: KnockoutObservable<Date>;
    end: KnockoutObservable<Date>;
    resolution: KnockoutObservable<number>;
    isLoading: KnockoutObservable<boolean>;
    timestamps: KnockoutObservableArray<Date>;
    configurationName: string;
    configurationNamespace: string;
    initialConfiguration: string;
    lock: boolean;
    name: string;

    seriesUpdates: ISeriesUpdateData[];
    updates: KnockoutObservable<ISeriesUpdateData[]>;

    getSeriesData(key: string): ISeries
    seriesDataKeys: string[]
}

export interface ISeriesDataProviderFacadeConfiguration extends ICommonConfiguration {

}

export interface ISeriesChartDataProviderConfiguration extends IChartConfiguration, ISeriesDataProviderFacadeConfiguration {

}

export interface ISeriesChartDataProviderFacade extends ISeriesDataProviderFacade<ISeriesChartDataProviderConfiguration> {
    chartDataProvider: SeriesChartDataProvider;
    legend: KnockoutObservable<ILegendConfiguration>;
    export: KnockoutObservable<IExportConfiguration>;
    scrollbar: KnockoutObservable<IScrollbarConfiguration>;
    axes: KnockoutObservableArray<IAxisConfiguration>;
    regions: KnockoutObservableArray<IRegionConfiguration>;
    series: KnockoutObservableArray<ISeriesConfiguration>;
    controlName: string;
    minPolylineStep: number;
    layoutVertical: boolean;

    updateAxesConfiguration(configuration: IAxisConfiguration[]): void;
    updateCursorData(series: string, coursor: string, data: LogValueDTO, date: Date): void;
    updateSeriesConfigurationAsync(configuration: ISeriesConfiguration[]): Promise<void>;
    updateRegionConfiguration(configuration: IRegionConfiguration[]): void;
    updateStatisticsData(data: LogStatisticsDTO[], seriesNames: string[]): void;
    backAsync(): Promise<void>;
    forwardAsync(): Promise<void>;
    requestCountAsync(start: Date, end: Date): Promise<number>;
    requestZoomUpdateAsync(start: Date, end: Date): Promise<DatedLogValuesDTO[]>;

    createConfigurationAsync(name: string): Promise<void>
    subscribeStartValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string): KnockoutSubscription;
    subscribeEndValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string): KnockoutSubscription;
}

export class SeriesChartDataProviderFacade implements ISeriesChartDataProviderFacade {
    public readonly resolution: KnockoutObservable<number>;
    public readonly timeSeriesMode: KnockoutObservable<TimeSeriesMode>;
    public readonly isLoading: KnockoutObservable<boolean>;
    public readonly updates: KnockoutObservable<ISeriesUpdateData[]>;
    public readonly seriesData: { [name: string]: SeriesSubscriptionItem; };
    public readonly start: KnockoutObservable<Date>;
    public readonly end: KnockoutObservable<Date>;
    public readonly timeConfiguration: KnockoutObservable<ITimeConfiguration>;
    public readonly legend: KnockoutObservable<ILegendConfiguration>;
    public readonly export: KnockoutObservable<IExportConfiguration>;
    public readonly scrollbar: KnockoutObservable<IScrollbarConfiguration>;
    public readonly axes: KnockoutObservableArray<IAxisConfiguration>;
    public readonly regions: KnockoutObservableArray<IRegionConfiguration>;
    public readonly series: KnockoutObservableArray<ISeriesConfiguration>;
    public readonly timestamps: KnockoutObservableArray<Date>;

    public getSeriesData(key: string) {
        return this.provider.getSeriesData(key);
    }
    public get seriesDataKeys() {
        return this.provider.seriesDataKeys;
    }

    public get seriesUpdates() {
        return this.chartDataProvider.seriesUpdates;
    }

    public get minPolylineStep() {
        return this.chartDataProvider.configuration().minPolylineStep;
    }

    public get layoutVertical() {
        return this.chartDataProvider.configuration().layoutVertical;
    }

    public get configurationName() {
        return this.provider.configurationName;
    }

    public get configurationNamespace() {
        return this.provider.configurationNamespace;
    }

    public get initialConfiguration() {
        return this.provider.initialConfiguration;
    }

    public get controlName() {
        return this.chartDataProvider.name;
    }

    public get name() {
        return this.provider.name;
    }

    public get lock() {
        return this.provider.lock;
    }

    constructor(
        readonly provider: SeriesDataProvider,
        readonly chartDataProvider: SeriesChartDataProvider) {

        this.resolution = provider.resolution;
        this.timeSeriesMode = provider.timeSeriesMode;
        this.isLoading = provider.isLoading;

        this.updates = chartDataProvider.updates;
        this.start = this.provider.start;
        this.end = this.provider.end;
        this.timestamps = this.provider.timestamps;
        this.timeConfiguration = this.provider.timeConfiguration;

        this.legend = this.chartDataProvider.legend;
        this.export = this.chartDataProvider.export;
        this.scrollbar = this.chartDataProvider.scrollbar;
        this.axes = this.chartDataProvider.axes;
        this.regions = this.chartDataProvider.regions;
        this.series = this.chartDataProvider.series;
    }
    public filter(data: ISeriesUpdateData[]): ISeriesUpdateData[] {
        return this.chartDataProvider.filter(data);
    }

    public updateTimeSeriesMode(timeSeriesMode: TimeSeriesMode): void {
        this.provider.updateTimeSeriesMode(timeSeriesMode);
    }
    public async updateSeriesTimeConfigurationAsync(configuration: ITimeConfiguration): Promise<void> {
        await this.provider.updateSeriesTimeConfigurationAsync(configuration);
    }
    public async backAsync(): Promise<void> {
        await this.provider.backAsync();
    }
    public async forwardAsync(): Promise<void> {
        await this.provider.forwardAsync();
    }
    public async loadConfigurationAsync(name: string, namespace: string = ""): Promise<void> {
        const configuration = await this.provider.getConfigurationAsync<ISeriesChartDataProviderConfiguration>(name, namespace);
        this.provider.updateConfigurationTarget(name, namespace);
        await this.provider.loadNewConfigurationAsync(configuration.configuration);
        await this.chartDataProvider.loadNewConfigurationAsync(configuration.configuration);
    }

    public async listConfigurationsAsync() {
        return await this.provider.listConfigurationsAsync<ISeriesChartDataProviderConfiguration>();
    }

    public async deleteConfigurationAsync(id: string, name: string = null): Promise<void> {
        await this.provider.deleteConfigurationAsync(id, name);
    }
    public async updateConfigurationAsync(name: string): Promise<void> {
        const configuration: ISeriesChartDataProviderConfiguration = _.extend({}, this.provider.configuration(), this.chartDataProvider.configuration());
        await this.provider.updateConfigurationAsync(name, configuration);
    }
    public async getConfigurationAsync(name: string): Promise<IHistoricalDataConfiguration<ISeriesChartDataProviderConfiguration>> {
        return await this.provider.getConfigurationAsync(name);
    }
    public async createConfigurationAsync(name: string): Promise<void> {
        const configuration: ISeriesChartDataProviderConfiguration = _.extend({}, this.provider.configuration(), this.chartDataProvider.configuration());
        return await this.provider.createConfigurationAsync(name, configuration);
    }
    public subscribeStartValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string): KnockoutSubscription {
        return this.chartDataProvider.subscribeStartValues(callback, target, event);
    }
    public subscribeEndValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string): KnockoutSubscription {
        return this.chartDataProvider.subscribeEndValues(callback, target, event);
    }
    public async requestCountAsync(start: Date, end: Date): Promise<number> {
        return await this.chartDataProvider.requestCountAsync(start, end);
    }
    public async requestZoomUpdateAsync(start: Date, end: Date): Promise<DatedLogValuesDTO[]> {
        return await this.chartDataProvider.requestZoomUpdateAsync(start, end);
    }
    public updateAxesConfiguration(configuration: IAxisConfiguration[]): void {
        this.chartDataProvider.updateAxesConfiguration(configuration);
    }
    public updateCursorData(series: string, coursor: string, data: LogValueDTO, date: Date): void {
        this.chartDataProvider.updateCursorData(series, coursor, data, date);
    }
    public async updateSeriesConfigurationAsync(configuration: ISeriesConfiguration[]): Promise<void> {
        await this.chartDataProvider.updateSeriesConfigurationAsync(configuration);
    }
    public updateRegionConfiguration(configuration: IRegionConfiguration[]): void {
        this.chartDataProvider.updateRegionConfiguration(configuration);
    }
    public startGettingUpdates() {
        this.provider.startGettingUpdates();
    }
    public addData(data: DatedLogValuesDTO[], seriesNames: string[]): void {
        this.provider.addData(data, seriesNames);
    }
    public updateStatisticsData(data: LogStatisticsDTO[], seriesNames: string[]): void {
        this.provider.updateStatisticsData(data, seriesNames);
    }

    public requestData(): void {
        this.provider.requestData();
    }
}