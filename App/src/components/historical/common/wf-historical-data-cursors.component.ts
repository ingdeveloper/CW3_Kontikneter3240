import ComponentBaseModel = require("../../component-base.model");
import { Cursor } from "../models/cursor.model";


interface IWfHistoricalDataHorizontalLineParams extends IComponentBaseParams {
    configuration: KnockoutObservableArray<Cursor>;
}

class WfHistoricalDataCursorsComponent extends ComponentBaseModel<IWfHistoricalDataHorizontalLineParams> {

    public offsets = [
        { id: "seconds", name: this.connector.translate("I4SCADA_seconds")() },
        { id: "minutes", name: this.connector.translate("I4SCADA_minutes")() },
        { id: "hours", name: this.connector.translate("I4SCADA_hours")() },
        { id: "days", name: this.connector.translate("I4SCADA_days")() },
        { id: "weeks", name: this.connector.translate("I4SCADA_weeks")() },
        { id: "months", name: this.connector.translate("I4SCADA_months")() },
        { id: "years", name: this.connector.translate("I4SCADA_years")() },
    ];

    public readonly cursors: KnockoutObservableArray<Cursor>;

    constructor(params: IWfHistoricalDataHorizontalLineParams) {
        super(params);
        this.cursors = this.settings.configuration;
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    public onDelete(item: Cursor) {
        this.cursors.remove(item);
    }

    public onAdd() {
        const item = new Cursor(this.cursors);
        this.cursors.push(item);
    }

    protected async dispose() {

    }
}

export = WfHistoricalDataCursorsComponent;