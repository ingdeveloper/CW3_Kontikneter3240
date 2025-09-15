import { IToolboxParams } from "../models/toolbox-params.model";
import { IRegionConfiguration, IAxisConfiguration } from "../models/series-configuration.model";
import { WfHistoricalDataBaseModel } from "./wf-historical-data-dialog-base.model";
import { RegionItem } from "../models/region-item.model";

class WfHistoricalDataDialogRegionsComponent extends WfHistoricalDataBaseModel<RegionItem, IRegionConfiguration> {

    private readonly axes = ko.observableArray<IAxisConfiguration>([]);

    constructor(params: IToolboxParams) {
        super(params);
    }

    protected createItem(item: IRegionConfiguration = {} as IRegionConfiguration, isPersisted: boolean = false) {
        return new RegionItem(this.provider, this.items, item, isPersisted);
    }
    protected getConfiguration(item: RegionItem) {
        return item.configuration;
    }
    protected getProviderItems() {
        return this.provider.regions();
    }
    protected updateProviderConfiguration(items: IRegionConfiguration[]) {
        this.provider.updateRegionConfiguration(items);
    }
    protected loadProviderAdditionalData() {
        this.axes(this.provider.axes());
    }
}

export = WfHistoricalDataDialogRegionsComponent;