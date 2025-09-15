import { IToolboxParams } from "../models/toolbox-params.model";
import { ValuePosition, IAxisConfiguration } from "../models/series-configuration.model";
import { AxesItem } from "../models/axis-item.model";
import { WfHistoricalDataBaseModel } from "./wf-historical-data-dialog-base.model";

class WfHistoricalDataDialogAxesComponent extends WfHistoricalDataBaseModel<AxesItem, IAxisConfiguration> {


    public readonly valuePositions = ko.observableArray<{ id: ValuePosition, text: string }>([
        { id: ValuePosition.Outside, text: this.connector.translate("I4SCADA_Outside") },
        { id: ValuePosition.Inside, text: this.connector.translate("I4SCADA_Inside") }
    ]);

    constructor(params: IToolboxParams) {
        super(params);
    }

    protected createItem(item: IAxisConfiguration = {} as IAxisConfiguration, isPersisted: boolean = false) {
        return new AxesItem(this.provider, this.items, item, isPersisted);
    }
    protected getConfiguration(item: AxesItem) {
        return item.configuration;
    }
    protected getProviderItems(): IAxisConfiguration[] {
        return this.provider.axes();
    }
    protected updateProviderConfiguration(items: IAxisConfiguration[]) {
        this.provider.updateAxesConfiguration(items);
    }

    protected loadProviderAdditionalData() {

    }

}

export = WfHistoricalDataDialogAxesComponent;