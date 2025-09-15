export enum TimeSeriesMode {
    Offline,
    Online
}

export interface ISeries {
    id: string;
    tag: string;
    signal: SignalDefinitionDTO;
    values: (number | string)[];
    corrections: (number | string)[];
}

export interface ISeriesUpdateData {
    timestamp: Date,
    [key: string]: any;
}