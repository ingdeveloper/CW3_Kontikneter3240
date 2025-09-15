import ComponentBaseModel = require("../../component-base.model");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";


class WfHistoricalDataToolboxSaveConfigurationComponent extends ComponentBaseModel<IToolboxParams> {

    private provider: ISeriesChartDataProviderFacade;
    private onErrorCallback: () => Promise<void> = null;
    private loadingSubscription: KnockoutSubscription;

    public readonly isLoading = ko.observable(false);
    public readonly dialogSettings = ko.observable(false);
    public readonly error = ko.observable(false);
    public readonly errorText = ko.observable("");
    public readonly newName = ko.observable("");

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
    }

    public async onSettings() {
        if (this.newName().length < 1)
            return;

        this.closeSettings();
        const item = await this.provider.getConfigurationAsync(this.newName());
        if (item) {
            this.showError(this.connector.translate('I4SCADA_Overwrite_Configuration_Confirmation')(),
                async () => {
                    await this.provider.updateConfigurationAsync(this.newName());
                });
        } else {
            await this.provider.createConfigurationAsync(this.newName());
        }
    }

    public showSettings() {
        this.newName(this.provider.configurationName || "");
        this.dialogSettings(true);
    }

    public closeSettings() {
        this.dialogSettings(false);
    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
        var dialog = $(document).find('#wf-config-error-dialog-' + ko.unwrap(this.id));
        dialog.remove();
        this.loadingSubscription.dispose();
    }
}

export = WfHistoricalDataToolboxSaveConfigurationComponent;