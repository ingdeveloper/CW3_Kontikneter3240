import { IToolboxParams } from "../models/toolbox-params.model";
import { ISeriesConfiguration, IAxisConfiguration, SeriesDisplayType, ChartType, InterpolationTypes } from "../models/series-configuration.model";
import { SeriesItem } from "../models/series-item.model";
import { WfHistoricalDataBaseModel } from "./wf-historical-data-dialog-base.model";

class WfHistoricalDataDialogDataComponent extends WfHistoricalDataBaseModel<SeriesItem, ISeriesConfiguration> {

    private readonly axes = ko.observableArray<IAxisConfiguration>([]);
    public readonly displays = ko.observableArray<{ id: SeriesDisplayType, text: string }>([
        { id: SeriesDisplayType.Name, text: this.connector.translate("I4SCADA_Name") },
        { id: SeriesDisplayType.Alias, text: this.connector.translate("I4SCADA_Alias") },
        { id: SeriesDisplayType.Description, text: this.connector.translate("I4SCADA_Description") },
    ]);

    public readonly chartTypes = ko.observableArray<{ id: ChartType, text: string }>([
        { id: ChartType.Line, text: this.connector.translate("I4SCADA_Line") },
        { id: ChartType.StackedLine, text: this.connector.translate("I4SCADA_StackedLine") },
        { id: ChartType.Step, text: this.connector.translate("I4SCADA_Step") },
        { id: ChartType.Bar, text: this.connector.translate("I4SCADA_Bar") },
        { id: ChartType.StackedBar, text: this.connector.translate("I4SCADA_StackedBar") },
        { id: ChartType.Dots, text: this.connector.translate("I4SCADA_Dots") },
        { id: ChartType.LineDots, text: this.connector.translate("I4SCADA_LineDots") },
    ]);

    public readonly interpolations = ko.observableArray<{ id: InterpolationTypes, text: string }>([
        { id: InterpolationTypes.None, text: this.connector.translate("I4SCADA_None") },
        { id: InterpolationTypes.Linear, text: this.connector.translate("I4SCADA_Linear") },
        { id: InterpolationTypes.CubicSpline, text: this.connector.translate("I4SCADA_Cubic_spline") },
        { id: InterpolationTypes.Differential, text: this.connector.translate("I4SCADA_Differential") },
    ]);

    constructor(params: IToolboxParams) {
        super(params);
    }

    protected createItem(item: ISeriesConfiguration = {} as ISeriesConfiguration, isPersisted: boolean = false) {
        return new SeriesItem(this.provider, this.items, item, isPersisted);
    }
    protected getConfiguration(item: SeriesItem) {
        return item.configuration;
    }
    protected getProviderItems() {
        return this.provider.series();
    }
    protected updateProviderConfiguration(items: ISeriesConfiguration[]) {
        this.provider.updateSeriesConfigurationAsync(items);
    }
    protected loadProviderAdditionalData() {
        this.axes(this.provider.axes());
    }
}

export = WfHistoricalDataDialogDataComponent;