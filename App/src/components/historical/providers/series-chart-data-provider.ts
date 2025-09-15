import Logger = require("../../../services/logger");
// import Connector = require("../../../services/connector");

import { ISeriesConfiguration, IRegionConfiguration, IAxisConfiguration, RangeConfigurationType, ILegendConfiguration, IScrollbarConfiguration, ICursorConfiguration, IExportConfiguration, IChartConfiguration } from "../models/series-configuration.model";
import { ISeriesUpdateData, ISeries } from "../models/series.model";
import { HistoricalDataRangeSignalService } from "../services/historical-data-range-signal.service";
import { IHistoricalDataSignalUpdate } from "../models/historical-data-signal-update.model";
import { HistoricalDataDigitalFilter, HistoricalDataInvertFilter } from "../filters/historical-data.filter";
import { HistoricalDataCursorsService } from "../services/historical-data-cursors.service";
import { SeriesDataProvider } from "./series-data-provider";
import { SeriesConnector } from "../services/series-connector";

export class SeriesChartDataProvider {
    // private readonly connector = new Connector();
    private readonly historicalDataRangeSignalService = new HistoricalDataRangeSignalService();
    private readonly historicalDataCursorsService = new HistoricalDataCursorsService(this);

    public readonly resolution: KnockoutObservable<number>;

    public readonly configuration = ko.observable<IChartConfiguration>({} as IChartConfiguration);
    public readonly legend = ko.observable<ILegendConfiguration>({} as ILegendConfiguration);
    public readonly export = ko.observable<IExportConfiguration>({} as IExportConfiguration);
    public readonly scrollbar = ko.observable<IScrollbarConfiguration>({} as IScrollbarConfiguration);
    public readonly axes = ko.observableArray<IAxisConfiguration>([]);
    public readonly regions = ko.observableArray<IRegionConfiguration>([]);
    public readonly series = ko.observableArray<ISeriesConfiguration>([]);

    private readonly axesSubscription: KnockoutSubscription;
    private readonly seriesSubscription: KnockoutSubscription;
    private readonly rangesSubscription: KnockoutSubscription;
    private readonly updateSubscription: KnockoutSubscription;

    private _referenceCount = 0;

    public readonly updates: KnockoutObservable<ISeriesUpdateData[]> = ko.observable([]);

    public get ids() {
        const ids = [];
        for (let series of this.series()) {
            const seriedData = this.provider.getSeriesData(`${series.signalName}/${series.tag}`);
            if (seriedData) {
                ids.push(seriedData.id);
            }
        }
        return ids;
    }

    public get name() {
        return this._name;
    }

    public get providerName() {
        return this.provider.name;
    }

    public get isUpdating() {
        return this.provider.isUpdating;
    }

    public get seriesUpdates() {
        return this.buildSeriesUpdates(this.provider.seriesUpdates);
    }

    public get provider() {
        return this._provider;
    }

    constructor(private _name: string,
        private readonly _provider: SeriesDataProvider,
        private readonly seriesConnector: SeriesConnector) {

        this.seriesSubscription = this.series.subscribe(async (x) => {
            const items = x as any[];
            const deleted = items.filter(x => x.status === "deleted" && !('moved' in x));
            const added = items.filter(x => x.status === "added" && !('moved' in x));

            await this.onRemovedSeriesAsync(deleted);
            await this.onAddedSeriesAsync(added);

            if (deleted.length > 0 || added.length > 0) {
                this.series.valueHasMutated();
            }

        }, null, "arrayChange");

        this.axesSubscription = this.axes.subscribe((x) => {
            const items = x as any[];
            const deleted = items.filter(x => x.status === "deleted" && !('moved' in x));
            const added = items.filter(x => x.status === "added" && !('moved' in x));

            for (const axis of deleted) {
                const newValue = _.find(added, x => x.index === axis.index).value;
                this.onRenameAxis(axis.value.name, newValue.name);
            }

            for (const axis of deleted) {
                this.onRemoveAxis(axis.value.name);
            }

        }, null, "arrayChange");

        this.rangesSubscription = this.regions.subscribe((x) => {
            const items = x as any[];
            const deleted = items.filter(x => x.status === "deleted" && !('moved' in x));
            if (deleted.length > 0) {
                this.onRemoveRegions();
            }

        }, null, "arrayChange");

        this.updateSubscription = this.provider.updates.subscribe((value) => {
            let updates = this.buildSeriesUpdates(value);
            updates = this.filter(updates);
            this.updates(updates);
        });

        this.resolution = this.provider.resolution;
    }

    private buildSeriesUpdates(data: ISeriesUpdateData[]) {
        if (data == null)
            return data;

        const dictonary: { [name: string]: string; } = {};
        for (const series of this.series()) {
            dictonary[series.name] = `${series.signalName}/${series.tag}`;
        }
        const result = [];
        for (const item of data) {
            const object = {} as any;
            for (let key of Object.keys(dictonary)) {
                if (key in dictonary) {
                    if (item[dictonary[key]] !== undefined) {
                        object[key] = item[dictonary[key]];
                    }
                }
            }
            if (Object.keys(object).length > 0) {
                object.timestamp = item.timestamp;
                result.push(object);
            }
        }
        return result;
    }

    private async onAddedSeriesAsync(added: any[]) {
        for (const series of added) {
            await this.provider.subscribeSeriesAsync(series.value.signalName, series.value.tag);
        }
    }

    private async onRemovedSeriesAsync(added: any[]) {
        const promises: Promise<any>[] = [];
        for (const series of added) {
            this.historicalDataCursorsService.removeLocalSignalsAsync(`${series.value.signalName}/${series.value.tag}`);
            promises.push(this.provider.unSubscribeSeriesAsync(`${series.value.signalName}/${series.value.tag}`));
        }

        for (let promise of promises) {
            await promise;
        }
    }
    public filter(data: ISeriesUpdateData[]) {
        for (const series of this.series()) {
            const digitalFilter = new HistoricalDataDigitalFilter(series.digitalBit);
            const invertFilter = new HistoricalDataInvertFilter();
            if (series.digital === true) {
                const filtered = digitalFilter.filter(data.map(x => x[series.name]));
                for (let index = 0; index < data.length; index++) {
                    data[index][series.name] = filtered[index];
                }
            }

            if (series.invertDigitalRepresentation === true) {
                const filtered = invertFilter.filter(data.map(x => x[series.name]));
                for (let index = 0; index < data.length; index++) {
                    data[index][series.name] = filtered[index];
                }
            }
        }
        return data;
    }


    public updateCursorData(series: string, coursor: string, data: LogValueDTO, date: Date) {
        this.historicalDataCursorsService.updateData(series, coursor, data, date);
    }

    public getCursorFilterData() {
        let filter = [] as { series: ISeries, name: string, cursor: ICursorConfiguration }[];
        for (let series of this.series()) {
            if (series.cursors) {
                for (const cursor of series.cursors) {
                    const seriesData = this.provider.getSeriesData(`${series.signalName}/${series.tag}`)
                    if (seriesData) {
                        filter.push({ series: seriesData, name: series.name, cursor: cursor });
                    }
                }
            }
        }
        return filter;
    }

    public onRenameAxis(oldName: string, newName: string) {
        if (oldName != newName) {
            if (this.configuration().series) {
                const newSeries = this.configuration().series;
                for (const series of newSeries) {
                    if (series.axis === oldName) {
                        series.axis = newName;
                    }
                }
                this.updateSeriesConfigurationAsync(newSeries);
            }

            if (this.configuration().regions) {
                const newRegions = this.configuration().regions;
                for (const region of newRegions) {
                    if (region.axis === oldName) {
                        region.axis = newName;
                    }
                }
                this.updateRegionConfiguration(newRegions);
            }
        }
    }

    public onRemoveAxis(name: string) {
        const axis = _.find(this.axes(), x => x.name === name);
        if (axis) {
            //update
            return;
        }

        const series = _.filter(this.series(), x => x.axis === name);
        const regions = _.filter(this.regions(), x => x.axis === name);
        for (const item of series) {
            this.series.remove(item);
            const index = this.configuration().series.indexOf(item);
            if (index >= 0)
                this.configuration().series.splice(index, 1);
        }
        for (const item of regions) {
            this.regions.remove(item);
            const index = this.configuration().regions.indexOf(item);
            if (index >= 0)
                this.configuration().regions.splice(index, 1);
        }
        this.configuration.valueHasMutated();
    }

    public onRemoveRegions() {
        this.updateRangeSignals(this.regions());
    }

    public async createSeriesAsync(configuration: ISeriesConfiguration[] = null) {
        Logger.info(this, `Createing Series for ${this.name}.`);
        this.provider.lock = true;
        if (configuration) {
            let config = configuration.slice();
            this.configuration().series = config;
            this.series(config);
        }

        if (this.series()) {
            this.historicalDataCursorsService.removeAllLocalSignals();
            this.historicalDataCursorsService.addLocalSignals();
        }
        this.configuration.valueHasMutated();
        this.provider.lock = false;
    }

    public addSubscriber() {
        this._referenceCount++;
        Logger.info(this, `Subscribed to ${this._name} SeriesChartDataProvider [total subscriptions: ${this._referenceCount}]`);
    }

    public releaseSubscriber() {
        this._referenceCount = Math.max(this._referenceCount - 1, 0);
        Logger.info(this, `Unsubscribed from ${this._name} SeriesChartDataProvider [total subscriptions: ${this._referenceCount}]`);
    }

    public hasSubscribers() {
        return this._referenceCount > 0;
    }

    public async requestCountAsync(start: Date, end: Date) {
        return await this.seriesConnector.requestCountAsync(this, start, end);
    }

    public async requestZoomUpdateAsync(start: Date, end: Date) {
        return await this.seriesConnector.requestSpecificDataAsync(this, start, end);
    }

    public async updateSeriesConfigurationAsync(configuration: ISeriesConfiguration[]) {
        await this.createSeriesAsync(configuration);
    }

    public updateAxesConfiguration(configuration: IAxisConfiguration[]) {
        const config = configuration.slice();
        this.configuration().axes = config;
        this.axes(config);
        this.configuration.valueHasMutated();
    }

    public updateRegionConfiguration(configuration: IRegionConfiguration[]) {
        const config = configuration.slice();
        this.configuration().regions = config;
        this.regions(config);
        this.configuration.valueHasMutated();
        this.updateRangeSignals(config);
    }

    public subscribeStartValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string) {
        return this.historicalDataRangeSignalService.subscribeStartValues(callback, target, event);
    }

    public subscribeEndValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string) {
        return this.historicalDataRangeSignalService.subscribeEndValues(callback, target, event);
    }

    private updateRangeSignals(configuration: IRegionConfiguration[]) {
        this.historicalDataRangeSignalService.removeAllEndSignals();
        this.historicalDataRangeSignalService.removeAllStartSignals();
        for (const config of configuration) {
            if (config.startType === RangeConfigurationType.Signal) {
                this.historicalDataRangeSignalService.addStartSignal(config.start);
            }
            if (config.endType === RangeConfigurationType.Signal) {
                this.historicalDataRangeSignalService.addEndSignal(config.end);
            }
        }
    }

    public async loadNewConfigurationAsync(configuration: IChartConfiguration) {
        this.configuration(configuration);
        this.axes(this.configuration().axes);
        this.regions(this.configuration().regions);
        this.legend(this.configuration().legend);
        this.export(this.configuration().export);
        this.scrollbar(this.configuration().scrollbar);
        await this.createSeriesAsync(this.configuration().series);
    }

    public dispose() {
        this.axesSubscription.dispose();
        this.seriesSubscription.dispose();
        this.rangesSubscription.dispose();
        this.updateSubscription.dispose();
        this.historicalDataCursorsService.dispose();
        this.historicalDataRangeSignalService.dispose();
    }
}