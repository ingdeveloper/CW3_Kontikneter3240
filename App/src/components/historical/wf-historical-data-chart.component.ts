import ComponentBaseModel = require("../component-base.model");
import { HistoricalData } from "./historical-data";
import { ChartsConfigurationService } from "./services/charts-configuration/charts-configuration.service";
import { ISeriesConfiguration, IAxisConfiguration, IRegionConfiguration, ISeriesConfigurationSettings } from "./models/series-configuration.model";
import { IToolboxButton, ToolboxButtons, DialogToolboxButtons } from "./models/toolbox-params.model";
import { IWfHistoricalDatachartParams } from "./models/wf-historical-data-chart.params";
import { TimeSeriesMode } from "../../services/connectorEnums";
import { ISeriesChartDataProviderFacade, ISeriesChartDataProviderConfiguration } from "./providers/series-chart-data-provider.facade";

class WfHistoricalDatChartComponent extends ComponentBaseModel<IWfHistoricalDatachartParams> {

    private provider: ISeriesChartDataProviderFacade;
    private chartsConfigurationService: ChartsConfigurationService;

    public groupName: string;
    public controlName: string;
    public height: number;
    public dataToolboxShowLabels: boolean;
    public dataToolboxButtons: IToolboxButton<ToolboxButtons>[];
    public dialogToolboxShowLabels: boolean;
    public dialogToolboxButtons: IToolboxButton<DialogToolboxButtons>[];
    public configurationButtonPosition: "TopRight" | "BottomRight"; //| "BottomCenter" | "BottomLeft" | "MiddleLeft" | "MiddleRight"|"TopLeft" | "TopCenter" ;
    public title: string;
    public panelBarCssClass: string;
    public buttonBarCssClass: string;
    public showDateTimeTooltip: boolean;
    public dateTimeTooltipFormat: string;
    public panelVisibility: boolean;
    // configuration
    public count?: number;
    public timeSeriesMode?: TimeSeriesMode;
    //legend configuration
    public showLegend?: boolean;
    public showLegendValues?: boolean;
    public legendPosition?: "left" | "right" | "top" | "bottom";
    public legendVerticalAlign?: "top" | "middle" | "bottom" | "none";
    public legendContentAlign?: "left" | "center" | "right" | "none";
    //export configuration
    public exportCsvDelimiter?: string;
    public exportType?: ExportType;
    public exportDateTimeFormat?: string;
    // scrollbar configuration
    public scrollbarShowX?: boolean;
    public scrollbarShowY?: boolean;
    public series?: ISeriesConfiguration[];
    // Time Configuration
    public timeRanges?: CalendarTimeRanges;
    public timeRange?: Date;
    public start?: Date;
    public end?: Date;
    public startOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    public startOffsetInterval?: number;
    public endOffset?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    public endOffsetInterval?: number;
    public axes?: IAxisConfiguration[];
    public regions?: IRegionConfiguration[];
    // configuration settings
    public initialConfiguration?: string;
    public configurationName?: string;
    public configurationNamespace?: string;
    public clientsideConfiguration?: boolean;

    public minPolylineStep?: number;
    public layoutVertical?: boolean;

    public readonly isLoading = ko.observable(false);
    public readonly chartLoading = ko.observable(false);

    public subscription: KnockoutSubscription;
    public subscriptionChartLoading: KnockoutSubscription;

    public subscriptionTimestamps: KnockoutSubscription;
    public subscriptionSeries: KnockoutSubscription;

    public readonly hasTimestamps = ko.observable(false);
    public readonly hasSeries = ko.observable(false);

    public readonly startTooltip = ko.observable<Date>();
    public readonly endTooltip = ko.observable<Date>();

    public subscriptionStart: KnockoutSubscription;
    public subscriptionEnd: KnockoutSubscription;

    public readonly hasTags = ko.pureComputed(() => {
        const loading = this.isLoading();
        const chartLoading = this.chartLoading();
        const hasSeries = this.hasSeries();
        if (!this.provider) { return false; }
        return hasSeries || loading || chartLoading;
    });

    public readonly hasData = ko.pureComputed(() => {
        const loading = this.isLoading();
        const chartLoading = this.chartLoading();
        const hasTimestamps = this.hasTimestamps();
        const hasTags = this.hasTags();
        if (!hasTags) {
            return true;
        }
        if (!this.provider) { return false; }
        return hasTimestamps || loading || chartLoading;
    });

    constructor(params: IWfHistoricalDatachartParams) {
        super(params);
        this.getProvidersAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.height = ko.unwrap(this.settings.height) || 300;
        this.groupName = ko.unwrap(this.settings.groupName) || ko.unwrap(this.id);
        this.controlName = ko.unwrap(this.settings.controlName) || ko.unwrap(this.id);

        this.dataToolboxShowLabels = ko.unwrap(this.settings.dataToolboxShowLabels) || false;
        this.dataToolboxButtons = ko.unwrap(this.settings.dataToolboxButtons) || [{ button: ToolboxButtons.PauseResume }, { button: ToolboxButtons.TimeSettings }, { button: ToolboxButtons.Back }, { button: ToolboxButtons.Forward }, { button: ToolboxButtons.Devider }, { button: ToolboxButtons.Export }, { button: ToolboxButtons.LoadConfiguration }, { button: ToolboxButtons.SaveConfiguration }] as IToolboxButton<ToolboxButtons>[];
        this.dialogToolboxShowLabels = ko.unwrap(this.settings.dialogToolboxShowLabels) || false;
        this.dialogToolboxButtons = ko.unwrap(this.settings.dialogToolboxButtons) || [{ button: DialogToolboxButtons.Axes }, { button: DialogToolboxButtons.Data }, { button: DialogToolboxButtons.Regions }] as IToolboxButton<DialogToolboxButtons>[];;

        this.configurationButtonPosition = ko.unwrap(this.settings.configurationButtonPosition) || "TopRight";
        this.title = ko.unwrap(this.settings.title) !== undefined ? ko.unwrap(this.settings.title) : "WEBfactory Chart";;

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";

        this.showDateTimeTooltip = ko.unwrap(this.settings.showDateTimeTooltip) || false;
        this.dateTimeTooltipFormat = ko.unwrap(this.settings.dateTimeTooltipFormat) || "DD.MM.YYYY HH:mm:ss";

        this.panelVisibility = ko.unwrap(this.settings.panelVisibility) !== undefined ? ko.unwrap(this.settings.panelVisibility) : true;


        this.count = ko.unwrap(this.settings.count) !== undefined ? ko.unwrap(this.settings.count) : null;
        this.timeSeriesMode = ko.unwrap(this.settings.timeSeriesMode) !== undefined ? ko.unwrap(this.settings.timeSeriesMode) : TimeSeriesMode.Offline;

        this.showLegend = ko.unwrap(this.settings.showLegend) !== undefined ? ko.unwrap(this.settings.showLegend) : true;
        this.showLegendValues = ko.unwrap(this.settings.showLegendValues) !== undefined ? ko.unwrap(this.settings.showLegendValues) : false;

        this.legendPosition = ko.unwrap(this.settings.legendPosition) !== undefined ? ko.unwrap(this.settings.legendPosition) : "bottom";
        this.legendVerticalAlign = ko.unwrap(this.settings.legendVerticalAlign) !== undefined ? ko.unwrap(this.settings.legendVerticalAlign) : "middle";
        this.legendContentAlign = ko.unwrap(this.settings.legendContentAlign) !== undefined ? ko.unwrap(this.settings.legendContentAlign) : "center";

        this.exportCsvDelimiter = ko.unwrap(this.settings.exportCsvDelimiter) !== undefined ? ko.unwrap(this.settings.exportCsvDelimiter) : ";";
        this.exportType = ko.unwrap(this.settings.exportType) !== undefined ? ko.unwrap(this.settings.exportType) : ExportType.Csv;
        this.exportDateTimeFormat = ko.unwrap(this.settings.exportDateTimeFormat) !== undefined ? ko.unwrap(this.settings.exportDateTimeFormat) : "yyyy.MM.dd HH:mm:ss";

        this.scrollbarShowX = ko.unwrap(this.settings.scrollbarShowX) !== undefined ? ko.unwrap(this.settings.scrollbarShowX) : false;
        this.scrollbarShowY = ko.unwrap(this.settings.scrollbarShowY) !== undefined ? ko.unwrap(this.settings.scrollbarShowY) : false;

        this.timeRanges = ko.unwrap(this.settings.timeRanges) !== undefined ? ko.unwrap(this.settings.timeRanges) : CalendarTimeRanges.Actual;
        this.timeRange = ko.unwrap(this.settings.timeRange) !== undefined ? ko.unwrap(this.settings.timeRange) : null;
        this.start = ko.unwrap(this.settings.start) !== undefined ? ko.unwrap(this.settings.start) : null;
        this.end = ko.unwrap(this.settings.end) !== undefined ? ko.unwrap(this.settings.end) : null;
        this.startOffset = ko.unwrap(this.settings.startOffset) !== undefined ? ko.unwrap(this.settings.startOffset) : "minutes";
        this.startOffsetInterval = ko.unwrap(this.settings.startOffsetInterval) !== undefined ? ko.unwrap(this.settings.startOffsetInterval) : 15;
        this.endOffset = ko.unwrap(this.settings.endOffset) !== undefined ? ko.unwrap(this.settings.endOffset) : "minutes";
        this.endOffsetInterval = ko.unwrap(this.settings.endOffsetInterval) !== undefined ? ko.unwrap(this.settings.endOffsetInterval) : 0;

        this.series = ko.unwrap(this.settings.series) !== undefined ? ko.unwrap(this.settings.series) : [];
        this.axes = ko.unwrap(this.settings.axes) !== undefined ? ko.unwrap(this.settings.axes) : [];
        this.regions = ko.unwrap(this.settings.regions) !== undefined ? ko.unwrap(this.settings.regions) : [];

        this.initialConfiguration = ko.unwrap(this.settings.initialConfiguration) || null;
        this.configurationName = ko.unwrap(this.settings.configurationName) !== undefined ? ko.unwrap(this.settings.configurationName) : null;
        this.configurationNamespace = ko.unwrap(this.settings.configurationNamespace) !== undefined ? ko.unwrap(this.settings.configurationNamespace) : null;
        this.clientsideConfiguration = ko.unwrap(this.settings.clientsideConfiguration) !== undefined ? ko.unwrap(this.settings.clientsideConfiguration) : false;

        this.minPolylineStep = ko.unwrap(this.settings.minPolylineStep) !== undefined ? ko.unwrap(this.settings.minPolylineStep) : 0.5;
        this.layoutVertical = ko.unwrap(this.settings.layoutVertical) !== undefined ? ko.unwrap(this.settings.layoutVertical) : false;
    }

    private buildConfiguration() {
        return {
            axes: this.axes,
            count: this.count,
            end: this.end,
            endOffset: this.endOffset,
            endOffsetInterval: this.endOffsetInterval,
            export: {
                csvDelimiter: this.exportCsvDelimiter,
                dateTimeFormat: this.exportDateTimeFormat,
                exportType: this.exportType
            },
            legend: {
                show: this.showLegend,
                showValues: this.showLegendValues,
                position: this.legendPosition,
                verticalAlign: this.legendVerticalAlign,
                contentAlign: this.legendContentAlign
            },
            regions: this.regions,
            scrollbar: {
                showX: this.scrollbarShowX,
                showY: this.scrollbarShowY,
            },
            series: this.series,
            start: this.start,
            startOffsetInterval: this.startOffsetInterval,
            startOffset: this.startOffset,
            timeRange: this.timeRange,
            timeRanges: this.timeRanges,
            timeSeriesMode: this.timeSeriesMode,
            minPolylineStep: this.minPolylineStep,
            layoutVertical: this.layoutVertical,
            dateTimeTooltipFormat: this.dateTimeTooltipFormat
        } as ISeriesChartDataProviderConfiguration;
    }

    private buildConfigurationSettings() {
        return {
            initialConfiguration: this.initialConfiguration,
            configurationName: this.configurationName,
            configurationNamespace: this.configurationNamespace,
            clientsideConfiguration: this.clientsideConfiguration
        } as ISeriesConfigurationSettings;
    }

    private async getProvidersAsync() {
        this.provider = await HistoricalData.seriesConnector.subscribeAsync(this.groupName, this.controlName, this.buildConfiguration(), this.buildConfigurationSettings());

        if (this.provider) {
            this.provider.startGettingUpdates();
            this.generateChart();

            this.subscriptionTimestamps = this.provider.timestamps.subscribe(() => {
                this.hasTimestamps(!!this.provider.timestamps().length);
            });

            this.subscriptionSeries = this.provider.series.subscribe(() => {
                this.hasSeries(!!this.provider.series().length);
            });

            this.subscriptionStart = this.provider.start.subscribe((value) => {
                this.startTooltip(value);
            });

            this.subscriptionEnd = this.provider.end.subscribe((value) => {
                this.endTooltip(value);
            });

            this.startTooltip(this.provider.start());
            this.endTooltip(this.provider.end());
            this.hasSeries(!!this.provider.series().length);
            this.hasTimestamps(!!this.provider.timestamps().length);
        }

    }

    public generateChart() {
        this.chartsConfigurationService = new ChartsConfigurationService(this.provider, ko.unwrap(this.id));
        this.subscription = this.chartsConfigurationService.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.subscriptionChartLoading = this.chartsConfigurationService.chartLoading.subscribe((value) => {
            this.chartLoading(value);
        });

        this.isLoading(this.chartsConfigurationService.isLoading());
        this.chartLoading(this.chartsConfigurationService.chartLoading());

        this.chartsConfigurationService
            .createChart();

    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.groupName, this.controlName);
        this.chartsConfigurationService.dispose();
        this.subscription.dispose();
        this.subscriptionSeries.dispose();
        this.subscriptionTimestamps.dispose();
        this.subscriptionChartLoading.dispose();
        this.subscriptionStart.dispose();
        this.subscriptionEnd.dispose();
    }
}

export = WfHistoricalDatChartComponent;