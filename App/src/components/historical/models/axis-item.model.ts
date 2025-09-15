import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";
import { ValuePosition, IAxisConfiguration } from "./series-configuration.model";
import Connector = require("../../../services/connector");
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { IDialogItem } from "../models/dialog-item.model";

declare var uuid;

export class AxesItem implements IDialogItem {

    private readonly connector = new Connector();

    private isUnique(value: string) {
        const axisItem = this;
        if (axisItem.isPersisted.peek())
            return true;

        const item = _.find(this.axes.peek(), (x) => {
            if (axisItem === x) {
                return false;
            }
            return x.name() === value;
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

    public readonly color = ko.observable<string>(null)
        .extend({ required: true });
    public readonly thickness = ko.observable<string>(null)
        .extend({ number: true });
    public readonly gridColor = ko.observable<string>(null)
        .extend({ required: false });
    public readonly gridThickness = ko.observable<string>(null)
        .extend({ number: true });
    public readonly valuePosition = ko.observable<ValuePosition>(ValuePosition.Outside)
        .extend({ required: true });
    public readonly showLabels = ko.observable<boolean>(false);
    public readonly showFirstLabel = ko.observable<boolean>(true);
    public readonly showLastLabel = ko.observable<boolean>(true);
    public readonly useIntegerValues = ko.observable<boolean>(true);
    public readonly inversed = ko.observable<boolean>(false);
    public readonly opposite = ko.observable<boolean>(false);
    public readonly digits = ko.observable<string>(null)
        .extend({ number: true });
    public readonly titleRotation = ko.observable<string>(null)
        .extend({ number: true });
    public readonly labelRotation = ko.observable<string>(null)
        .extend({ number: true });
    public readonly logarithmic = ko.observable<boolean>(false);
    public readonly scientific = ko.observable<boolean>(false);
    public readonly minGridDistance = ko.observable<string>(null)
        .extend({ number: true });
    public readonly min = ko.observable<string>(null)
        .extend({ number: true });
    public readonly max = ko.observable<string>(null)
        .extend({ number: true });

    public readonly isPersisted = ko.observable(false);

    public readonly isDeletable = ko.pureComputed(() => {
        if (this.isPersisted()) {
            if (_.find(this.provider.series(), series => series.axis === this.name()))
                return false;
            if (_.find(this.provider.regions(), range => range.axis === this.name()))
                return false;
        }
        return true;
    });

    public get configuration() {
        return {
            name: this.name(),
            color: this.color(),
            gridColor: this.color(),
            thickness: this.thickness() === "" || this.thickness() === null ? null : parseInt(this.thickness()),
            gridThickness: this.gridThickness() === "" || this.gridThickness() === null ? null : parseInt(this.gridThickness()),
            valuePosition: this.valuePosition() == undefined ? ValuePosition.Outside : this.valuePosition(),
            showLabels: this.showLabels() == undefined ? true : this.showLabels(),
            showFirstLabel: this.showFirstLabel() == undefined ? true : this.showFirstLabel(),
            showLastLabel: this.showLastLabel() == undefined ? true : this.showLastLabel(),
            useIntegerValues: this.useIntegerValues() == undefined ? false : this.useIntegerValues(),
            logarithmic: this.logarithmic() == undefined ? false : this.logarithmic(),
            inversed: this.inversed() == undefined ? false : this.inversed(),
            scientific: this.scientific() == undefined ? false : this.scientific(),
            opposite: this.opposite() == undefined ? false : this.opposite(),
            digits: this.digits() === "" || this.digits() === null ? null : parseInt(this.digits()),
            minGridDistance: this.minGridDistance() === "" || this.minGridDistance() === null ? null : parseInt(this.minGridDistance()),
            titleRotation: this.titleRotation() === "" || this.titleRotation() === null ? null : parseInt(this.titleRotation()),
            labelRotation: this.labelRotation() === "" || this.labelRotation() === null ? null : parseInt(this.labelRotation()),
            min: this.min() === "" || this.min() === null ? null : parseInt(this.min()),
            max: this.max() === "" || this.max() === null ? null : parseInt(this.max())
        } as IAxisConfiguration
    }

    constructor(
        private readonly provider: ISeriesChartDataProviderFacade,
        private readonly axes: KnockoutObservableArray<AxesItem>,
        item: IAxisConfiguration = {} as IAxisConfiguration,
        isPersisted: boolean = false) {
        this.isPersisted(isPersisted);
        const name = `axis${Math.random().toString(36).substr(2, 3)}`;
        this.name(item.name == undefined ? name : item.name);
        this.color(item.color == undefined ? ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
        this.thickness(item.thickness == undefined ? null : item.thickness.toString());
        this.gridThickness(item.gridThickness == undefined ? null : item.gridThickness.toString());
        this.gridColor(item.gridColor == undefined ? ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.gridColor);
        this.valuePosition(item.valuePosition == undefined ? ValuePosition.Outside : item.valuePosition);
        this.showLabels(item.showLabels == undefined ? true : item.showLabels);
        this.showFirstLabel(item.showFirstLabel == undefined ? true : item.showFirstLabel);
        this.showLastLabel(item.showLastLabel == undefined ? true : item.showLastLabel);
        this.useIntegerValues(item.useIntegerValues == undefined ? false : item.useIntegerValues);
        this.inversed(item.inversed == undefined ? false : item.inversed);
        this.opposite(item.opposite == undefined ? false : item.opposite);
        this.digits(item.digits == undefined ? null : item.digits.toString());
        this.minGridDistance(item.minGridDistance == undefined ? null : item.minGridDistance.toString());
        this.titleRotation(item.titleRotation == undefined ? null : item.titleRotation.toString());
        this.labelRotation(item.labelRotation == undefined ? null : item.labelRotation.toString());
        this.logarithmic(item.logarithmic == undefined ? false : item.logarithmic);
        this.scientific(item.scientific == undefined ? false : item.scientific);
        this.min(item.min == undefined ? null : item.min.toString());
        this.max(item.max == undefined ? null : item.max.toString());
    }

    public notifySubscribers() {
        this.name.notifySubscribers();
    }
}