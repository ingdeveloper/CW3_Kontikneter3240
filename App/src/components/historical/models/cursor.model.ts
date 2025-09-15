import { ICursorConfiguration } from "./series-configuration.model";
import Connector = require("../../../services/connector");
import { IDialogItem } from "./dialog-item.model";

export class Cursor implements IDialogItem {
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

    public readonly timestamp = ko.observable<Date>(null);
    public readonly offsetInterval = ko.observable<string>(null);
    public readonly offset = ko.observable<"seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years">("minutes");

    constructor(private readonly lines: KnockoutObservableArray<Cursor>, item: ICursorConfiguration = {} as ICursorConfiguration) {
        const name = `cursor_${Math.random().toString(36).substr(2, 3)}`;
        this.name(item.name == undefined ? name : item.name);
        this.timestamp(item.timestamp == undefined ? null : moment(item.timestamp).toDate());
        this.offsetInterval(item.offsetInterval == undefined ? null : item.offsetInterval.toString());
        this.offset(item.offset == undefined ? "minutes" : item.offset);
        this.timestamp.extend({ required: { onlyIf: () => { return this.offsetInterval() == null } } });
        this.offsetInterval.extend({ required: { onlyIf: () => { return this.timestamp() == null } } });
        this.offset.extend({ required: { onlyIf: () => { return this.timestamp() == null } } });
    }

    public get configuration() {
        return {
            name: this.name(),
            timestamp: this.timestamp() == undefined ? null : moment(this.timestamp()).toDate(),
            offsetInterval: parseInt(this.offsetInterval()),
            offset: this.offset(),
        } as ICursorConfiguration
    }
    
    public notifySubscribers() {
        this.name.notifySubscribers();
    }
}