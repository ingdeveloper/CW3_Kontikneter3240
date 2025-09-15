export interface IWfChart1Params extends IComponentBaseParams, IConfigurationParams, IConvertCsvParams, IStandaloneParameters {
    legendText: string;
    signalFilterText: string;
    chartWidth: number;
    chartHeight: number;
    chartType: "line" | "step" | "spline" | "bar" | "area" | "area-spline";
    headerVisibility: boolean;
    footerVisibility: boolean;
    statisticsVisibility: boolean;
    signalsButtonVisibility: boolean;
    settingsButtonVisibility: boolean;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    chartPaddingLeft: number;
    chartPaddingRight: number;
    chartPaddingTop: number;
    chartPaddingbottom: number;
    lines: IWfChart1Line[];
    y2AxisVisible: boolean;
    y1AxisMin: number,
    y1AxisMax: number;
    y1AxisMinSignal: boolean;
    y1AxisMaxSignal: boolean;
    y1AxisVisible: boolean;
    y2AxisMin: number;
    y2AxisMax: number;
    y2AxisMinSignal: boolean;
    y2AxisMaxSignal: boolean;
    y1AxisLabel: string;
    y1AxisInner: boolean;
    y1TickCount: number;
    y1TickFormat: (num: number) => string;
    y2AxisLabel: string;
    y2AxisInner: boolean;
    y2TickCount: number;
    y2TickFormat: (num: number) => string;
    x1AxisVisible: boolean;
    x1AxisLabel: string;
    x1AxisType: string;
    x1AxisTickFormat: string;
    x1AxisTickFit: boolean;
    x1TickCount: number;
    format: string;
    maxResults: number;
    maxSignalCount: number;
    title: string;
    x1GridVisible: boolean;
    y1GridVisible: boolean;
    subChartVisible: boolean;
    subChartHeight: number;
    legendVisible: boolean;
    legendPosition: string;
    pointsVisible: boolean;
    pointsRadius: number;
    zoomEnabled: boolean;
    zoomRescale: boolean;
    tooltipVisibility: boolean;
    autoUpdate: boolean;
    updateRate: number;
    startOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;
    getLatestLogdata: boolean;
    y1AxisColor: string;
    y2AxisColor: string;
    configurationProjectAuthorization: string;
    signalSelectionProjectAuthorization: string;
    exportProjectAuthorization: string;
    exportButtonVisibility: boolean;
    showOnlyOwnConfigurations: boolean;
    showIsStaticColumn: boolean;
    showDateTimeTooltip: boolean;
    dateTimeTooltipFormat: string;
    dbName: string;
}

export interface IChartLine {
    signalName: KnockoutObservable<string>;
    logTagName: KnockoutObservable<string>;
    color: KnockoutObservable<string>;
    axis: KnockoutObservable<string>;
    unit?: KnockoutObservable<string>;
    maxAxis?: KnockoutObservable<number>;
    minAxis?: KnockoutObservable<number>;
    legendText?: KnockoutObservable<string>;
    values?: KnockoutObservableArray<any>;
    minimum?: KnockoutObservable<number>;
    minimumFormated?: KnockoutObservable<number>;
    maximum?: KnockoutObservable<number>;
    maximumFormated?: KnockoutObservable<number>;
    average?: KnockoutObservable<number>;
    averageFormated?: KnockoutObservable<number>;
    lastValue?: KnockoutObservable<number>;
    lastValueFormated?: KnockoutObservable<number>;
    minimumTimestamp?: KnockoutObservable<Date>;
    maximumTimestamp?: KnockoutObservable<Date>;
    lastValueTimestamp?: KnockoutObservable<Date>;
    type?: KnockoutObservable<"line" | "step" | "spline" | "bar" | "area" | "area-spline">;
    isStatic?: KnockoutObservable<boolean>;
    logId?: string;
    signalId?: string;
    logTag?: string;
    staticLegendText?: KnockoutObservable<string>;
    staticUnitText?: KnockoutObservable<string>;
    signalFactor?: KnockoutObservable<number>;
    hide?: KnockoutObservable<boolean>;
}

export interface IChartPadding {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface IChartAxes {
    x: number;
    y: number;
    y2: number;
}

export interface IWfChart1Line {
    signalName: string;
    logTagName: string;
    axis: string;
    color: string;
    type: "line" | "step" | "spline" | "bar" | "area" | "area-spline";
    staticLegendText: string;
    staticUnitText: string;
    signalFactor: number;
    hide: boolean;
}

export interface IChartTooltip {
    show: boolean;
    contents: (chartthis, d, defaultTitleFormat, defaultValueFormat, color) => string;
}

export interface IChartAxisConfig {
    show?: boolean;
    label: { text?: string, position: string };
    inner?: boolean;
    tick: {
        count: number;
        format: ((num: number) => string) | string;
        fit?: boolean;
    };
    padding?: {
        top: number;
        bottom: number;
    };
    type?: string;
}

export interface IChartAxesConfig {
    y: IChartAxisConfig | string,
    y2: IChartAxisConfig | string,
    x: IChartAxisConfig | string,
}

export interface IAxisConfigration {
    maxValue: number;
    isMaxSignalDependent: boolean;
    minValue: number;
    isMinSignalDependent: boolean;
    label: string;

    color: string;
    visible: boolean;
    isDisplayedInner: boolean;
    tickCount: number;
    tickFormat: any;
    isGridVisible: boolean;
}

export interface IChartAxesConfiguration {
    x: IAxisConfigration;
    y1: IAxisConfigration;
    y2: IAxisConfigration;
}