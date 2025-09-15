import { TimeSeriesMode } from "./series.model";

export interface IChartConfiguration extends ISeriesLineConfiguration, ISeriesAxesConfiguration, ISeriesRegionConfiguration {
    export?: IExportConfiguration;
    scrollbar?: IScrollbarConfiguration;
    legend?: ILegendConfiguration;
    minPolylineStep?: number;
    layoutVertical?: boolean;
    dateTimeTooltipFormat?: string;
}

export interface ICommonConfiguration extends ITimeConfiguration {
    count?: number;
    timeSeriesMode?: TimeSeriesMode;
}

export interface ITimeConfiguration {
    //offline & online mode
    timeRanges?: CalendarTimeRanges;
    timeRange?: Date;
    start?: Date;
    end?: Date;
    startOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetInterval?: number;
    endOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    endOffsetInterval?: number;
}

//line configuration
export interface ISeriesLineConfiguration {
    series?: ISeriesConfiguration[];
}

//alarm configuration
export interface ISeriesAlarmConfiguration {
    alarms?: IAlarmConfiguration[];
}

//axes configuration
export interface ISeriesAxesConfiguration {
    axes?: IAxisConfiguration[];
}

//Line configuration
export interface ISeriesConfiguration {
    signalName: string;
    tag: string;
    name: string;
    axis?: string;
    fillColor?: string;
    strokeColor?: string;
    display?: SeriesDisplayType;
    thickness?: number;
    chartType?: ChartType;
    digital?: boolean;
    digitalBit?: number;
    invertDigitalRepresentation?: boolean;
    digits?: number;
    interpolation?: InterpolationTypes;
    horizontalLines?: IHorizontalLineConfiguration[];
    cursors?: ICursorConfiguration[];
}

//Alarm configuration
export interface IAlarmConfiguration {
    signalName: string;
    tag: string;
    name: string;
}

//region configuration
export interface ISeriesRegionConfiguration {
    regions?: IRegionConfiguration[];
}

export interface ISeriesConfigurationSettings {
    initialConfiguration?: string;
    configurationName?: string;
    configurationNamespace?: string;
    clientsideConfiguration?: boolean;
}

export interface IRegionConfiguration {
    name: string;
    color: string;
    axis: string;
    start: string;
    startType: RangeConfigurationType;
    end: string;
    endType: RangeConfigurationType;
}

export interface IHorizontalLineConfiguration {
    name: string;
    color?: string;
    offset?: string;
    value?: string;
    type: HorizontalLineConfigurationType;
}

export interface ICursorConfiguration {
    name: string;
    timestamp?: Date;
    offsetInterval?: number;
    offset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
}

export enum HorizontalLineConfigurationType {
    SignalMin,
    SignalMax,
    Value,
    IntervalMin,
    IntervalMax,
    IntervalAvg
}

export enum RangeConfigurationType {
    Value,
    Signal
}

export interface IAxisConfiguration {
    name: string;
    color?: string;
    gridColor?: string;
    thickness?: number;
    gridThickness?: number;
    valuePosition?: ValuePosition;
    useIntegerValues?: boolean;
    showLabels?: boolean;
    showFirstLabel?: boolean;
    showLastLabel?: boolean;
    inversed?: boolean;
    opposite?: boolean;
    digits?: number;
    titleRotation?: number;
    labelRotation?: number;
    logarithmic?: boolean;
    scientific?: boolean;
    minGridDistance?: number;
    min?: number;
    max?: number;
}

export interface ILegendConfiguration {
    show?: boolean;
    showValues?: boolean;
    position?: "left" | "right" | "top" | "bottom";
    verticalAlign?: "top" | "middle" | "bottom" | "none";
    contentAlign?: "left" | "center" | "right" | "none";
}

export interface IExportConfiguration {
    csvDelimiter?: string;
    exportType?: ExportType;
    dateTimeFormat?: string;
}

export interface IScrollbarConfiguration {
    showX?: boolean;
    showY?: boolean;
}

export enum SeriesDisplayType {
    Name,
    Alias,
    Description
}

export enum ChartType {
    Line,
    StackedLine,
    Dots,
    LineDots,
    Step,
    Bar,
    StackedBar
}

export enum InterpolationTypes {
    None,
    Linear,
    CubicSpline,
    Differential
}

export enum ValuePosition {
    Outside,
    Inside
}