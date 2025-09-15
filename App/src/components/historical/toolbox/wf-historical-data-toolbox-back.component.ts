import ComponentBaseModel = require("../../component-base.model");
import Logger = require("../../../services/logger");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { SeriesChartDataProviderFacade, ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";

class WfHistoricalDataToolboxBackComponent extends ComponentBaseModel<IToolboxParams> {

    public provider: ISeriesChartDataProviderFacade;
    private loadingSubscription: KnockoutSubscription;
    
    public readonly isLoading = ko.observable(false);

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
        this.loadingSubscription = this.provider.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.isLoading(this.provider.isLoading());
    }

    public async onClicked() {
        this.provider.backAsync();
    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        this.loadingSubscription.dispose();
    }
}

export = WfHistoricalDataToolboxBackComponent;