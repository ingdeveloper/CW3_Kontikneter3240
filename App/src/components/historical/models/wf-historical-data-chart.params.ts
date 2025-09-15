import { ISeriesConfiguration, IAxisConfiguration, IRegionConfiguration, ISeriesConfigurationSettings } from "./series-configuration.model";
import { IToolboxButton, DialogToolboxButtons, ToolboxButtons } from "./toolbox-params.model";
import { TimeSeriesMode } from "../../../services/connectorEnums";

export interface IWfHistoricalDatachartParams extends IComponentBaseParams {
    groupName?: string;
    controlName?: string;
    height?: number;
    dataToolboxShowLabels: boolean;
    dataToolboxButtons: IToolboxButton<ToolboxButtons>[];
    dialogToolboxShowLabels: boolean;
    dialogToolboxButtons: IToolboxButton<DialogToolboxButtons>[];
    configurationButtonPosition: "TopRight" | "BottomRight";
    title: string;
    panelBarCssClass: string;
    buttonBarCssClass: string;
    showDateTimeTooltip: boolean;
    dateTimeTooltipFormat: string;
    panelVisibility: boolean;

    // configuration
    count?: number;
    timeSeriesMode?: TimeSeriesMode;

    //legend configuration
    showLegend?: boolean;
    showLegendValues?: boolean;
    legendPosition?: "left" | "right" | "top" | "bottom";
    legendVerticalAlign?: "top" | "middle" | "bottom" | "none";
    legendContentAlign?: "left" | "center" | "right" | "none";

    //export configuration
    exportCsvDelimiter?: string;
    exportType?: ExportType;
    exportDateTimeFormat?: string;

    // scrollbar configuration
    scrollbarShowX?: boolean;
    scrollbarShowY?: boolean;

    series?: ISeriesConfiguration[];

    // Time Configuration
    timeRanges?: CalendarTimeRanges;
    timeRange?: Date;
    start?: Date;
    end?: Date;
    startOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetInterval?: number;
    endOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    endOffsetInterval?: number;
    axes?: IAxisConfiguration[];

    regions?: IRegionConfiguration[];

    initialConfiguration?: string;
    configurationName?: string;
    configurationNamespace?: string;
    clientsideConfiguration?: boolean;

    minPolylineStep: number;
    layoutVertical: boolean;
}