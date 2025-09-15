import { HorizontalLineConfigurationType, IHorizontalLineConfiguration } from "./series-configuration.model";
import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";
import Connector = require("../../../services/connector");
import { IDialogItem } from "./dialog-item.model";

declare var uuid;

export class HorizontalLine implements IDialogItem {
    private readonly connector = new Connector();

    private isUnique(value: string) {
        const axisItem = this;
        const item = _.find(this.lines.peek(), (x) => {
            if (axisItem !== x) {
                return x.name.peek() === value;
            }
            return false;
        });
        return !item;
    }


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
    public readonly color = ko.observable<string>(ChartsColoringService.GetColor())
        .extend({ required: true });
    public readonly offset = ko.observable<string>();
    public readonly type = ko.observable<HorizontalLineConfigurationType>(HorizontalLineConfigurationType.Value)
        .extend({ required: true });
    public readonly value = ko.observable<string>()
        .extend({
            required: {
                onlyIf: () => {
                    return this.type() === HorizontalLineConfigurationType.Value;
                }
            }
        });

    constructor(private readonly lines: KnockoutObservableArray<HorizontalLine>, item: IHorizontalLineConfiguration = {} as IHorizontalLineConfiguration) {
        const name = `line_${Math.random().toString(36).substr(2, 3)}`;
        this.name(item.name == undefined ? name : item.name);
        this.offset(item.offset == undefined ? null : item.offset.toString());
        this.type(item.type == undefined ? HorizontalLineConfigurationType.Value : item.type);
        this.color(item.color == undefined ? ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
        this.value(item.value == undefined ? null : item.value);
    }

    public get configuration() {
        return {
            color: this.color(),
            name: this.name(),
            offset: this.offset(),
            type: this.type(),
            value: this.value()
        } as IHorizontalLineConfiguration
    }
        
    public notifySubscribers() {
        this.name.notifySubscribers();
    }
}