import ComponentBaseModel = require("../../component-base.model");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { TimeSeriesMode } from "../models/series.model";
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { IDialogItem } from "../models/dialog-item.model";

export abstract class WfHistoricalDataBaseModel<TItem extends IDialogItem, TConfiguration> extends ComponentBaseModel<IToolboxParams> {

    public provider: ISeriesChartDataProviderFacade;

    public css: string;
    public showLabel: boolean;

    public timeSeriesMode: TimeSeriesMode;
    private loadingSubscription: KnockoutSubscription;

    public readonly isLoading = ko.observable(false);
    public readonly items = ko.observableArray<TItem>([]);
    public readonly item = ko.observable<TItem>(null);

    public readonly errors = ko.validation.group([this.item, this.items], { deep: true, live: true, observable: true });

    public readonly dialog = ko.observable(false);
    protected readonly dialogSubscription: KnockoutSubscription;

    constructor(params: IToolboxParams) {
        super(params);
        this.getProvidersAsync();
        this.dialogSubscription = this.dialog.subscribe((value) => {
            value ? this.snapshotOnlineMode() : this.restoreOnlineMode();
        });
    }

    protected abstract createItem(item?: TConfiguration, isPersisted?: boolean): TItem;
    protected abstract getConfiguration(item: TItem): TConfiguration;
    protected abstract getProviderItems(): TConfiguration[];
    protected abstract updateProviderConfiguration(items: TConfiguration[]): void;
    protected abstract loadProviderAdditionalData(): void;

    private snapshotOnlineMode() {
        this.timeSeriesMode = this.provider.timeSeriesMode();
        if (this.timeSeriesMode === TimeSeriesMode.Online) {
            this.provider.updateTimeSeriesMode(TimeSeriesMode.Offline);
        }
    }

    private restoreOnlineMode() {
        this.provider.updateTimeSeriesMode(this.timeSeriesMode);
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

    public onClicked() {
        this.dialog(true);
        this.items(this.getProviderItems().slice().map(item => this.createItem(item, true)));
        this.setSelectedItem();
        this.loadProviderAdditionalData();
    }

    private setSelectedItem() {
        let item = _.first(this.items());
        this.item(item);
    }

    public onDialog() {
        this.updateProviderConfiguration(this.items().map(item => this.getConfiguration(item)));
        this.onClose();
    }

    public onClose() {
        this.items([]);
        this.dialog(false);
    }

    public onSelected(item: TItem) {
        this.item(item);
    }

    public onAdd = () => {
        let item = this.item();
        item = this.createItem();
        this.item(item);
        this.items.push(item);
    }

    public onDelete(item: TItem) {
        if (item === this.item()) {
            this.setSelectedItem();
        }

        this.items.remove(item);

        this.setSelectedItem();

        for (const item of this.items()) {
            item.notifySubscribers();
        }
    }

    protected async dispose() {
        this.dialogSubscription.dispose();
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
        this.loadingSubscription.dispose();
    }
}