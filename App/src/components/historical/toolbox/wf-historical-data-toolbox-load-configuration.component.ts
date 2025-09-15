import ComponentBaseModel = require("../../component-base.model");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { IHistoricalDataConfiguration } from "../models/historical-data-configuration.model";
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { ICommonConfiguration } from "../models/series-configuration.model";
import { TimeSeriesMode } from "../models/series.model";

class WfHistoricalDataToolboxLoadConfigurationComponent extends ComponentBaseModel<IToolboxParams> {

    private provider: ISeriesChartDataProviderFacade;
    private onErrorCallback: () => Promise<void> = null;
    private loadingSubscription: KnockoutSubscription;
    private timeSeriesMode: TimeSeriesMode;

    public readonly isLoading = ko.observable(false);
    public readonly dialogSettings = ko.observable(false);
    public readonly error = ko.observable(false);
    public readonly errorText = ko.observable("");

    public readonly pattern = ko.observable("");
    public readonly data = ko.observableArray<IHistoricalDataConfiguration<ICommonConfiguration>>([]);
    public readonly configurations = ko.computed(() => {
        return ko.utils.arrayFilter(this.data(), (item) => {
            return item.name.includes(this.pattern());
        });
    });

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
        this.loadingSubscription = this.provider.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.isLoading(this.provider.isLoading());
    }

    private async getConfigurationsAsync() {
        const configurations = await this.provider.listConfigurationsAsync();
        this.data(configurations);
    }

    private showError(errorText: string, callback: () => Promise<void>) {
        this.onErrorCallback = callback;
        this.closeSettings();
        this.error(true);
        this.errorText(errorText);
    }

    public closeError() {
        this.error(false);
        this.showSettings();
    }

    public async onError() {
        this.error(false);
        if (this.onErrorCallback) {
            await this.onErrorCallback();
        }
        this.showSettings();
    }

    public async onLoad(item: IHistoricalDataConfiguration<ICommonConfiguration>) {
        this.timeSeriesMode = null;
        await this.provider.loadConfigurationAsync(item.name, item.namespace);
        this.closeSettings();
    }

    public onDelete(item: IHistoricalDataConfiguration<ICommonConfiguration>) {
        this.showError(this.connector.translate('I4SCADA_Delete_Configuration_Confirmation')(),
            async () => {
                await this.provider.deleteConfigurationAsync(item.id, item.name);
            });
    }

    public onSettings() {
        this.dialogSettings(false);
    }

    public showSettings() {
        this.snapshotOnlineMode();
        this.getConfigurationsAsync();
        this.dialogSettings(true);
    }

    public closeSettings() {
        this.dialogSettings(false);
    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
        this.loadingSubscription.dispose();
    }
}

export = WfHistoricalDataToolboxLoadConfigurationComponent;