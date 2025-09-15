import { SeriesDisplayType, ChartType, InterpolationTypes, ISeriesConfiguration, IHorizontalLineConfiguration, ICursorConfiguration } from "./series-configuration.model";
import Connector = require("../../../services/connector");
import { HorizontalLine } from "./horizontal-line.model";
import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { Cursor } from "./cursor.model";
import { IDialogItem } from "./dialog-item.model";

declare var uuid;

export class SeriesItem implements IDialogItem {

    private readonly connector = new Connector();

    private isUnique(value: string) {
        const seriesItem = this;
        if (seriesItem.isPersisted.peek())
            return true;

        const item = _.find(this.series.peek(), (x) => {
            if (seriesItem !== x) {
                return x.name.peek() === value;
            }
            return false;
        });
        return !item;
    }

    // dialog values

    public readonly name = ko.observable<string>(null)
        .extend({
            required: true,
            validation: [
                {
                    validator: (value: string) => this.isUnique(value),
                    message: this.connector.translate("I4SCADA_is_not_unique")()
                }
            ]
        });
    public readonly fillColor = ko.observable<string>(null)
        .extend({ required: false });
    public readonly strokeColor = ko.observable<string>(null)
        .extend({ required: true });
    public readonly signalName = ko.observable<string>(null)
        .extend({ required: true });
    public readonly tag = ko.observable<string>(null)
        .extend({ required: true });
    public readonly axis = ko.observable<string>(null)
        .extend({ required: true });
    public readonly display = ko.observable<SeriesDisplayType>(null)
        .extend({ required: true });
    public readonly thickness = ko.observable<string>(null)
        .extend({ required: true, number: true });
    public readonly chartType = ko.observable<ChartType>(null)
        .extend({ required: true, number: true });
    public readonly digits = ko.observable<string>(null)
        .extend({ number: true });
    public readonly digital = ko.observable<boolean>(null)
        .extend({ required: true });
    public readonly digitalBit = ko.observable<string>(null)
        .extend({ required: true, number: true });
    public readonly invertDigitalRepresentation = ko.observable<boolean>(null)
        .extend({ required: true });
    public readonly interpolation = ko.observable<InterpolationTypes>(null)
        .extend({ required: true });
    public readonly horizontalLines = ko.observableArray<HorizontalLine>([])
    public readonly cursors = ko.observableArray<Cursor>([])

    public readonly isPersisted = ko.observable(false);

    public readonly isDeletable = ko.pureComputed(() => {
        return true;
    });

    public get configuration() {
        return {
            name: this.name(),
            axis: this.axis(),
            signalName: this.signalName(),
            tag: this.tag(),
            fillColor: this.fillColor(),
            strokeColor: this.strokeColor(),
            display: this.display(),
            thickness: parseInt(this.thickness()),
            chartType: this.chartType(),
            digital: this.digital(),
            digitalBit: parseInt(this.digitalBit()),
            invertDigitalRepresentation: this.invertDigitalRepresentation(),
            digits: this.digits() === "" || this.digits() === null ? null : parseInt(this.digits()),
            interpolation: this.interpolation(),
            horizontalLines: this.horizontalLines().map(x => x.configuration),
            cursors: this.cursors().map(x => x.configuration)
        } as ISeriesConfiguration;
    }

    constructor(
        private readonly provider: ISeriesChartDataProviderFacade,
        private readonly series: KnockoutObservableArray<SeriesItem>,
        private readonly item: ISeriesConfiguration = {} as ISeriesConfiguration,
        isPersisted: boolean = false) {
        this.isPersisted(isPersisted);

        const axis = _.first(this.provider.axes());
        const name = `series_${Math.random().toString(36).substr(2, 3)}`;
        this.name(item.name == undefined ? name : item.name);
        this.fillColor(item.fillColor);
        this.strokeColor(item.strokeColor == undefined ? ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.strokeColor);
        this.tag(item.tag);
        this.signalName(item.signalName);
        this.axis(item.axis || (axis ? axis.name : null));
        this.display(item.display == undefined ? SeriesDisplayType.Name : item.display);
        this.thickness(item.thickness == undefined ? "1" : item.thickness.toString());
        this.chartType(item.chartType == undefined ? ChartType.Line : item.chartType);
        this.setHorizontalLineConfiguration(item.horizontalLines || []);
        this.setCursorConfiguration(item.cursors || []);
        this.digital(item.digital || false);
        this.digitalBit(item.digitalBit == undefined ? "0" : item.digitalBit.toString());
        this.invertDigitalRepresentation(item.invertDigitalRepresentation || false);
        this.digits(item.digits == undefined ? null : item.digits.toString());
        this.interpolation(item.interpolation == undefined ? InterpolationTypes.None : item.interpolation);
    }

    private setHorizontalLineConfiguration(configuration: IHorizontalLineConfiguration[]) {
        this.horizontalLines((configuration || []).map(item => new HorizontalLine(this.horizontalLines, item)));
    }

    private setCursorConfiguration(configuration: ICursorConfiguration[]) {
        this.cursors((configuration || []).map(item => new Cursor(this.cursors, item)));
    }
        
    public notifySubscribers() {
        this.name.notifySubscribers();
    }
}