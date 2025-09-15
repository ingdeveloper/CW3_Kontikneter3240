import { IChartsConfigurationService } from "./charts-configuration.service";
import { IRegionConfiguration, RangeConfigurationType, HorizontalLineConfigurationType } from "../../models/series-configuration.model";
import { ISeriesUpdateData } from "../../models/series.model";
import Logger = require("../../../../services/logger");
import Connector = require("../../../../services/connector");
import Signal = require("../../../../services/models/signal");
import { ISeriesChartDataProviderFacade } from "../../providers/series-chart-data-provider.facade";

declare var document;

export class ChartsUpdateService {

    private seriesSubscription: KnockoutSubscription;
    private rangesSubscription: KnockoutSubscription;
    private startValuesSubscription: KnockoutSubscription;
    private endValuesSubscription: KnockoutSubscription;

    private readonly connector = new Connector();
    private statisticsSubscriptions: KnockoutSubscription[] = [];
    private signals: Signal[] = [];

    private cursorsSubscriptions: KnockoutSubscription[] = [];
    private cursorsSignals: Signal[] = [];

    private hidden = false;

    public chartLoading = ko.observable(true);
    //  .extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });

    public get isHidden() {
        return this.hidden;
    }

    constructor(
        private readonly chartsConfigurationService: IChartsConfigurationService,
        private readonly provider: ISeriesChartDataProviderFacade) {
    }

    public subscribe() {
        let hidden: string;
        let visibilityChange: string;

        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        document.addEventListener(visibilityChange, () => {
            if (document[hidden]) {
                this.hidden = true;
            } else {
                this.hidden = false;
            }
        }, false);


        this.seriesSubscription = this.provider.series.subscribe(() => {
            this.disposeStatisticsSubscription();
            this.disposeCursorSubscription();
            this.chartsConfigurationService.createChart();
            this.subscribeStatisticsSignals();
            this.subscribeCursorSignals();
        });

        this.rangesSubscription = this.provider.regions.subscribe((x) => {
            const items = x as any[];
            const added = items.filter(x => x.status === "added" && !('moved' in x));
            const deleted = items.filter(x => x.status === "deleted" && !('moved' in x));

            for (const item of deleted) {
                this.chartsConfigurationService.removeRange(item.value.name, item.value.axis);
            }

            for (const add of added) {
                const item: IRegionConfiguration = add.value;
                this.chartsConfigurationService.addRange(item);
            }

            //    this.createChart();
        }, null, "arrayChange");

        this.seriesSubscription = this.provider.axes.subscribe(() => {
            this.disposeStatisticsSubscription();
            this.disposeCursorSubscription();
            this.chartsConfigurationService.createChart();
            this.subscribeStatisticsSignals();
            this.subscribeCursorSignals();
        });


        this.startValuesSubscription = this.provider.subscribeStartValues((update) => {
            const regions = _.filter(this.provider.regions(), item => item.startType === RangeConfigurationType.Signal && item.start === update.name);
            for (const range of regions) {
                this.chartsConfigurationService.updateStartRanges(range.name, update.value, range.axis);
            }
        });

        this.endValuesSubscription = this.provider.subscribeEndValues((update) => {
            const regions = _.filter(this.provider.regions(), item => item.endType === RangeConfigurationType.Signal && item.end === update.name);
            for (const range of regions) {
                this.chartsConfigurationService.updateEndRanges(range.name, update.value, range.axis);
            }
        });

        this.subscribeStatisticsSignals();
        this.subscribeCursorSignals();
    }

    private getHorizontalLineConfigurationType(type: HorizontalLineConfigurationType) {
        switch (type) {
            case HorizontalLineConfigurationType.IntervalAvg:
                return "avg";
            case HorizontalLineConfigurationType.IntervalMax:
                return "max";
            case HorizontalLineConfigurationType.IntervalMin:
                return "min";
        }
    }

    public addHorizontalLines() {
        for (const series of this.provider.series()) {
            if (series.horizontalLines) {
                for (const horizontalLine of series.horizontalLines) {
                    let staticValue = null;
                    if (horizontalLine.type === HorizontalLineConfigurationType.SignalMax) {
                        staticValue = this.provider.getSeriesData(`${series.signalName}/${series.tag}`).signal.Maximum
                    }
                    if (horizontalLine.type === HorizontalLineConfigurationType.SignalMin) {
                        staticValue = this.provider.getSeriesData(`${series.signalName}/${series.tag}`).signal.Minimum
                    }
                    this.chartsConfigurationService.addHorizontalLine(horizontalLine, series.axis, staticValue);
                }
            }
        }
    }

    public addVerticalLines() {
        for (const series of this.provider.series()) {
            if (series.cursors) {
                for (const cursor of series.cursors) {
                    this.chartsConfigurationService.addVerticalLine(`${this.provider.name}-${series.name}-${cursor.name}`);
                }
            }
        }
    }

    //https://www.amcharts.com/demos/stacked-area/
    private subscribeCursorSignals() {
        for (const series of this.provider.series()) {
            if (series.cursors) {
                for (let cursor of series.cursors) {

                    const localSignalNameValue = `local://${this.provider.name}->${this.provider.controlName}->${series.name}->CURSOR->${cursor.name}->Value`;
                    const localSignalNameTimestamp = `local://${this.provider.name}->${this.provider.controlName}->${series.name}->CURSOR->${cursor.name}->Timestamp`;

                    const signalValue = this.connector.getSignal(localSignalNameValue);
                    const signalTimestamp = this.connector.getSignal(localSignalNameTimestamp);

                    this.cursorsSignals.push(signalValue);
                    this.cursorsSignals.push(signalTimestamp);

                    if (signalValue) {
                        const subscription1 = signalValue.value.subscribe(value => {
                            if (value !== "n/a" && signalTimestamp.value() !== "n/a") {
                                this.chartsConfigurationService.updateVerticalLine(`${this.provider.name}-${series.name}-${cursor.name}`, cursor.name, signalTimestamp.value());
                            }

                        });
                        this.cursorsSubscriptions.push(subscription1);
                        if (signalTimestamp && signalTimestamp.value() !== "n/a") {
                            this.chartsConfigurationService.updateVerticalLine(`${this.provider.name}-${series.name}-${cursor.name}`, cursor.name, signalTimestamp.value());
                        }

                    }

                    if (signalTimestamp) {
                        const subscription2 = signalTimestamp.value.subscribe(value => {
                            if (value !== "n/a" && signalValue.value() !== "n/a") {
                                this.chartsConfigurationService.updateVerticalLine(`${this.provider.name}-${series.name}-${cursor.name}`, cursor.name, value);
                            }
                        });
                        this.cursorsSubscriptions.push(subscription2);
                        if (signalValue && signalValue.value() !== "n/a") {
                            this.chartsConfigurationService.updateVerticalLine(`${this.provider.name}-${series.name}-${cursor.name}`, cursor.name, signalTimestamp.value());
                        }

                    }

                }
            }
        }
    }

    private subscribeStatisticsSignals() {
        for (const series of this.provider.series()) {
            if (series.horizontalLines) {
                for (const horizontalLine of series.horizontalLines) {
                    if (horizontalLine.type === HorizontalLineConfigurationType.IntervalAvg || horizontalLine.type === HorizontalLineConfigurationType.IntervalMax || horizontalLine.type === HorizontalLineConfigurationType.IntervalMin) {
                        const localSignalName = `local://${this.provider.name}->${series.signalName}/${series.tag}->${this.getHorizontalLineConfigurationType(horizontalLine.type)}`;
                        const signal = this.connector.getSignal(localSignalName);
                        this.signals.push(signal);
                        if (signal) {
                            const subscription = signal.value.subscribe(value => {
                                this.chartsConfigurationService.updateHorizontalLines(horizontalLine.name, value, series.axis);
                            });
                            this.statisticsSubscriptions.push(subscription);
                        }
                    }
                }
            }
        }
    }

    private transformData(data: DatedLogValuesDTO[], seriesNames: string[]) {
        const updates: ISeriesUpdateData[] = []
        for (let i = 0; i < data.length; i++) {
            const values = data[i].Values.map(item => item ? item.Value : undefined);
            const corrections = data[i].Values.map(item => item ? item.EditedValue : undefined);
            const timestamp = data[i].EntriesDate as Date;

            if (seriesNames.length != values.length) {
                Logger.info(this, "Skipped addData");
                return;
            }

            const updateItem: ISeriesUpdateData = {
                timestamp: timestamp
            }

            for (let i = 0; i < values.length; i++) {
                updateItem[seriesNames[i]] = corrections[i] || values[i];
            }
            updates.push(updateItem);
        }
        return this.provider.filter(updates);
    }

    public dateAxisChanged = async (ev) => {
        this.chartLoading(true);
        _.delay(async () => {
            try {
                if (!ev.target.minZoomed) {
                    this.chartLoading(false);
                    return;
                }
                if (!ev.target.maxZoomed) {
                    this.chartLoading(false);
                    return;
                }

                let start = new Date(ev.target.minZoomed);
                let end = new Date(ev.target.maxZoomed);

                if (ev.target.zoomFactor <= 1) {
                    // remove added zoom data on zoom reset.
                    if (this.provider.seriesUpdates.length !== this.chartsConfigurationService.getData().length) {
                        this.chartsConfigurationService.resetData(this.provider.seriesUpdates);
                        return;
                    }
                    this.chartLoading(false);
                    return;
                }

                let count = null;
                count = await this.provider.requestCountAsync(start, end);

                if (count !== null) {
                    const startTime = start.getTime();
                    const endTime = end.getTime();

                    let cartData = this.chartsConfigurationService.getData().slice();

                    const items = cartData.filter((x) => {
                        if (!x.timestamp) return false;
                        return x.timestamp.getTime() >= startTime && x.timestamp.getTime() <= endTime;
                    });

                    const startIndex = cartData.indexOf(_.first(items));
                    const endIndex = cartData.indexOf(_.last(items));
                    const valueCountToReplace = (endIndex - startIndex) + 1;

                    if ((valueCountToReplace < count) && (startIndex > 0 && endIndex > 0)) {
                        const data = await this.provider.requestZoomUpdateAsync(start, end);
                        (cartData as any[]).splice(startIndex, valueCountToReplace, ...this.transformData(data, this.provider.series().map(x => x.name)));
                        cartData.sort((a, b) => {
                            return (new Date(a.timestamp).getTime()) - (new Date(b.timestamp).getTime());
                        });
                        this.chartsConfigurationService.resetData(cartData);

                    } else {
                        this.chartLoading(false);
                    }
                } else {
                    this.chartLoading(false);
                }

            } catch (error) {
                Logger.error(this, error);
                this.chartLoading(false);
            }
        }, 100);
    }

    public disposeStatisticsSubscription() {
        for (const statisticsSubscription of this.statisticsSubscriptions) {
            statisticsSubscription.dispose();
        }
        this.connector.unregisterSignals(...this.signals);
        this.signals = [];
        this.statisticsSubscriptions = [];
    }

    public disposeCursorSubscription() {
        for (const cursorSubscription of this.cursorsSubscriptions) {
            cursorSubscription.dispose();
        }
        this.connector.unregisterSignals(...this.signals);
        this.cursorsSignals = [];
        this.cursorsSubscriptions = [];
    }

    public dispose() {
        this.disposeStatisticsSubscription();
        this.disposeCursorSubscription();
        this.startValuesSubscription.dispose();
        this.endValuesSubscription.dispose();
        this.seriesSubscription.dispose();
        this.rangesSubscription.dispose();
    }

}