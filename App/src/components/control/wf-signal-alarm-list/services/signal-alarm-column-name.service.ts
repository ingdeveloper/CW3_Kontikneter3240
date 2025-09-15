import { ISignalAlarmListColumnParams } from "../models/signal-alarm-list-column.params";

export interface ISignalAlarmColumnNameServiceParams {
    columns: ISignalAlarmListColumnParams[];
}

export class SignalAlarmColumnNameService {

    private columnMappings: ISignalAlarmListColumnParams[];
    public columns: ISignalAlarmListColumnParams[];

    constructor(params: ISignalAlarmColumnNameServiceParams) {
        const mappings = ko.unwrap(params.columns) || this.getDefaultColumnItems();
        this.columnMappings = mappings.map(this.defaultText);
        this.columns = mappings.map(this.defaultText);
    }

    private defaultText(item: ISignalAlarmListColumnParams) {
        if (!item.text) {
            item.text = item.name;
        }
        return item;
    }

    private getDefaultColumnItem(item: string) {
        return {
            name: item,
            text: item
        } as ISignalAlarmListColumnParams;
    }

    public getSymbolicText = (column: string) => {
        const columnMapping = this.columns.find(x => x.name === column);
        if (columnMapping) {
            return `I4SCADA_signal_alarm_list_column_${columnMapping.text}`;
        } else {
            return `I4SCADA_signal_alarm_list_column_${column}`;
        }
    }

    public onSettingsApplied(columnsOrder: string[]) {
        this.columns = [];
        for (const column of columnsOrder) {
            const columnMapping = this.columnMappings.find(x => x.name === column);
            this.columns.push(columnMapping || this.getDefaultColumnItem(column));
        }
    }

    public loadConfig(columns: ISignalAlarmListColumnParams[]) {
        this.columns = [];
        columns = columns.map(this.defaultText);
        for (const column of columns) {
            const columnMapping = this.columnMappings.find(x => x.name === column.name);
            this.columns.push(columnMapping || column);
        }
    }

    public getColumnNames() {
        return this.columns.map(x => x.name);
    }

    public getDefaultColumnItems() {
        return ["AliasName", "Description", "Value", "Unit", "AlarmStatus", "AlarmProcessingAndDisplayStatus"].map(this.getDefaultColumnItem);
    }
}