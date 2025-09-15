import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";
import { IRegionConfiguration } from "./series-configuration.model";
import Connector = require("../../../services/connector");
import { ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";
import { IDialogItem } from "./dialog-item.model";

declare var uuid;

export class RegionItem implements IDialogItem {

    private readonly connector = new Connector();

    private isUnique(value: string) {
        const regionItem = this;
        if (regionItem.isPersisted.peek())
            return true;

        const item = _.find(this.regions.peek(), (x) => {
            if (regionItem !== x) {
                return x.name.peek() === value;
            }
            return false;
        });
        return !item;
    }

    // dialog values
    public readonly startType = ko.observable<string>("0");
    public readonly endType = ko.observable<string>("0");
    public readonly start = ko.observable<any | string>(null)
        .extend({ required: true });
    public readonly end = ko.observable<any | string>(null)
        .extend({ required: true });
    public readonly name = ko.observable<string>(null)
        .extend({
            required: true,
            validation: [
                {
                    validator: (value: string) => this.isUnique(value),
                    message: this.connector.translate("I4SCADA_is_not_unique")()
                }
            ]
        })

    public readonly axis = ko.observable<string>(null)
        .extend({ required: true });
    public readonly color = ko.observable<string>(ChartsColoringService.GetColor())
        .extend({ required: true });
    public readonly startTypeSubscription = this.startType.subscribe(() => {
        this.start("0");
    });
    public readonly endTypeSubscription = this.endType.subscribe(() => {
        this.end("0");
    });

    public readonly isPersisted = ko.observable(false);

    public readonly isDeletable = ko.pureComputed(() => {
        if (_.find(this.provider.series(), series => series.axis === this.name()))
            return false;
        if (_.find(this.provider.regions(), range => range.axis === this.name()))
            return false;
        return true;
    });

    public get configuration() {
        return {
            name: this.name(),
            axis: this.axis(),
            color: this.color(),
            start: this.start(),
            startType: this.startType() == "1" ? 1 : 0,
            end: this.end(),
            endType: this.endType() == "1" ? 1 : 0
        } as IRegionConfiguration
    }

    constructor(
        private readonly provider: ISeriesChartDataProviderFacade,
        private readonly regions: KnockoutObservableArray<RegionItem>,
        item: IRegionConfiguration = {} as IRegionConfiguration,
        isPersisted: boolean = false) {
        this.isPersisted(isPersisted);

        const axis = _.first(this.provider.axes());
        const axisName = axis ? axis.name : undefined;

        const name = `region_${Math.random().toString(36).substr(2, 3)}`;
        this.name(item.name || name);
        this.axis(item.axis || axisName);
        this.color(item.color == undefined ? ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
        this.startType(item.startType == undefined ? "0" : item.startType.toString());
        this.endType(item.endType == undefined ? "0" : item.endType.toString());
        this.start(item.start);
        this.end(item.end);
    }

    public notifySubscribers() {
        this.name.notifySubscribers();
    }
}