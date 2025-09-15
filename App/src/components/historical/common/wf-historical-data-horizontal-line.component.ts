import ComponentBaseModel = require("../../component-base.model");
import { HorizontalLineConfigurationType } from "../models/series-configuration.model";
import { HorizontalLine } from "../models/horizontal-line.model";

interface IWfHistoricalDataHorizontalLineParams extends IComponentBaseParams {
    configuration: KnockoutObservableArray<HorizontalLine>;
}

class WfHistoricalDataHorizontalLineComponent extends ComponentBaseModel<IWfHistoricalDataHorizontalLineParams> {

    public types = [
        { id: HorizontalLineConfigurationType.Value, name: this.connector.translate("I4SCADA_Value")() },
        { id: HorizontalLineConfigurationType.SignalMin, name: this.connector.translate("I4SCADA_SignalMin")() },
        { id: HorizontalLineConfigurationType.SignalMax, name: this.connector.translate("I4SCADA_SignalMax")() },
        { id: HorizontalLineConfigurationType.IntervalMin, name: this.connector.translate("I4SCADA_IntervalMin")() },
        { id: HorizontalLineConfigurationType.IntervalMax, name: this.connector.translate("I4SCADA_IntervalMax")() },
        { id: HorizontalLineConfigurationType.IntervalAvg, name: this.connector.translate("I4SCADA_IntervalAvg")() }
    ];

    public readonly horizontalLines: KnockoutObservableArray<HorizontalLine>;

    constructor(params: IWfHistoricalDataHorizontalLineParams) {
        super(params);
        this.horizontalLines = this.settings.configuration;
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    public onDelete(item: HorizontalLine) {
        this.horizontalLines.remove(item);
    }

    public onAdd() {
        const item = new HorizontalLine(this.horizontalLines);
        this.horizontalLines.push(item);
    }

    protected async dispose() {

    }
}

export = WfHistoricalDataHorizontalLineComponent;