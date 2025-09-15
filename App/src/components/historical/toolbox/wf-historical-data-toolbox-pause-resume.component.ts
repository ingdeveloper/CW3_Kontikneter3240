import ComponentBaseModel = require("../../component-base.model");
import { HistoricalData } from "../historical-data";
import { TimeSeriesMode } from "../models/series.model";
import { IToolboxParams } from "../models/toolbox-params.model";
import { SeriesChartDataProviderFacade, ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";


class WfHistoricalDataToolboxPauseResumeComponent extends ComponentBaseModel<IToolboxParams> {

    public provider: ISeriesChartDataProviderFacade;
    private subscription: KnockoutSubscription;
    private loadingSubscription: KnockoutSubscription;

    public readonly isLoading = ko.observable(false);
    public readonly timeSeriesMode = ko.observable(TimeSeriesMode.Online);

    public css: string;
    public showLabel: boolean;

    constructor(params: IToolboxParams) {
        super(params);
        this.getProvidersAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.css = this.settings.css || "btn btn-default";
        this.showLabel = this.settings.showLabel || false;
    }

    private async getProvidersAsync() {
        this.provider = await HistoricalData.seriesConnector.subscribeAsync(this.settings.groupName, this.settings.controlName);
        this.subscription = this.provider.timeSeriesMode.subscribe((configuration) => {
            this.geTimeSeriesModeSettings(configuration);
        });
        this.geTimeSeriesModeSettings(this.provider.timeSeriesMode());
        this.loadingSubscription = this.provider.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.isLoading(this.provider.isLoading());
    }

    private geTimeSeriesModeSettings(configuration: TimeSeriesMode) {
        this.timeSeriesMode(configuration);
    }

    private async updateTimeSeriesModeSettings() {
        this.provider.updateTimeSeriesMode(this.timeSeriesMode());
    }

    public onToggleTimeSeriesMode() {
        let mode = this.timeSeriesMode();
        if (mode === TimeSeriesMode.Online) {
            mode = TimeSeriesMode.Offline;
        } else {
            mode = TimeSeriesMode.Online;
        }
        this.timeSeriesMode(mode);
        this.updateTimeSeriesModeSettings();
    }

    public async onRefreshData() {
        await HistoricalData.seriesConnector.requestDataAsync(this.provider.provider);
    }

    protected async dispose() {
        this.subscription.dispose();
        this.loadingSubscription.dispose();
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
    }
}

export = WfHistoricalDataToolboxPauseResumeComponent;