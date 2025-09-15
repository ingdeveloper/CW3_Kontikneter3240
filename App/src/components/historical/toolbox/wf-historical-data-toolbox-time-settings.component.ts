import ComponentBaseModel = require("../../component-base.model");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { ITimeConfiguration } from "../models/series-configuration.model";
import { TimeSeriesMode } from "../models/series.model";


class WfHistoricalDataToolboxTimeSettingsComponent extends ComponentBaseModel<IToolboxParams> {

    public provider: ISeriesChartDataProviderFacade;
    private subscription: KnockoutSubscription;
    private loadingSubscription: KnockoutSubscription;
    private timeSeriesMode: TimeSeriesMode;

    public readonly isLoading = ko.observable(false);
    public readonly dialogSettings = ko.observable(false);

    public readonly start = ko.observable<Date>();
    public readonly end = ko.observable<Date>();
    public readonly selectedRange = ko.observable<CalendarTimeRanges>();
    public readonly timeRangeDate = ko.observable<Date>();
    public readonly startOffset = ko.observable<"seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years">();
    public readonly startOffsetInterval = ko.observable<number>();
    public readonly endOffset = ko.observable<"seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years">();
    public readonly endOffsetInterval = ko.observable<number>();

    public css: string;
    public showLabel: boolean;

    constructor(params: IToolboxParams) {
        super(params);
        this.dialogSettings.subscribe(x => {
            if (x === false) {
                this.restoreOnlineMode();
            }
        })
        this.getProvidersAsync();
    }

    private snapshotOnlineMode() {
        this.timeSeriesMode = this.provider.timeSeriesMode();
        if (this.timeSeriesMode === TimeSeriesMode.Online) {
            this.provider.updateTimeSeriesMode(TimeSeriesMode.Offline);
        }
    }

    private restoreOnlineMode() {
        if (this.timeSeriesMode !== null) {
            this.provider.updateTimeSeriesMode(this.timeSeriesMode);
        }
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.css = this.settings.css || "btn btn-default";
        this.showLabel = this.settings.showLabel || false;
    }

    private async getProvidersAsync() {
        this.provider = await HistoricalData.seriesConnector.subscribeAsync(this.settings.groupName, this.settings.controlName);
        this.subscription = this.provider.timeConfiguration.subscribe((configuration) => {
            this.getTimeSettings(configuration);
        });
        this.getTimeSettings(this.provider.timeConfiguration());
        this.loadingSubscription = this.provider.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.isLoading(this.provider.isLoading());
    }

    private getTimeSettings(configuration: ITimeConfiguration) {
        this.start(configuration.start ? new Date(configuration.start): configuration.start);
        this.end(configuration.end ? new Date(configuration.end): configuration.end);
        this.selectedRange(configuration.timeRanges);
        this.timeRangeDate(configuration.timeRange ? new Date(configuration.timeRange): configuration.timeRange);
        this.startOffset(configuration.startOffset);
        this.startOffsetInterval(configuration.startOffsetInterval);
        this.endOffset(configuration.endOffset);
        this.endOffsetInterval(configuration.endOffsetInterval);
    }

    private async updateTimeSettingsAsync() {
        await this.provider.updateSeriesTimeConfigurationAsync({
            startOffsetInterval: this.startOffsetInterval(),
            timeRange: this.timeRangeDate(),
            end: this.end(),
            endOffset: this.endOffset(),
            start: this.start(),
            endOffsetInterval: this.endOffsetInterval(),
            startOffset: this.startOffset(),
            timeRanges: this.selectedRange()
        });
    }

    public onSettings() {
        this.dialogSettings(false);
        this.updateTimeSettingsAsync();
    }

    public showSettings() {
        this.snapshotOnlineMode();
        this.dialogSettings(true);
    }

    public closeSettings() {
        this.dialogSettings(false);
    }

    protected async dispose() {
        this.subscription.dispose();
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        var dialog = $(document).find('#modal-time-settings-' + ko.unwrap(this.id));
        dialog.remove();
        this.loadingSubscription.dispose();
    }
}

export = WfHistoricalDataToolboxTimeSettingsComponent;