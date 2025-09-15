import { IRegionConfiguration, RangeConfigurationType, IAxisConfiguration, ISeriesConfiguration, IHorizontalLineConfiguration, HorizontalLineConfigurationType, SeriesDisplayType, ChartType, ValuePosition, ILegendConfiguration, IScrollbarConfiguration } from "../../models/series-configuration.model";
import { ChartsUpdateService } from "./charts-update.service";
import Connector = require("../../../../services/connector");
import { ISeriesChartDataProviderFacade } from "../../providers/series-chart-data-provider.facade";

declare var am4core;
declare var am4charts;

export interface IChartsConfigurationService {
    createChart(): IChartsConfigurationService;
    addValueAxis(configuration: IAxisConfiguration): IChartsConfigurationService;
    addSeries(configuration: ISeriesConfiguration): IChartsConfigurationService;
    addScrollbarX(configuration: IScrollbarConfiguration): IChartsConfigurationService;
    addScrollbarY(configuration: IScrollbarConfiguration): IChartsConfigurationService;
    addCursor(): IChartsConfigurationService;
    addRange(configuration: IRegionConfiguration): IChartsConfigurationService;
    addDateAxis(): IChartsConfigurationService;
    addSubscriptions(): IChartsConfigurationService;
    addLegend(configuration: ILegendConfiguration): IChartsConfigurationService;
    addHorizontalLine(configuration: IHorizontalLineConfiguration, axis: string, value?: any): IChartsConfigurationService;
    addVerticalLine(id: string): IChartsConfigurationService;
    disableStartendchanged(): void;
    enableStartendchanged(): void;

    removeRange(name: string, axis: string): IChartsConfigurationService;
    removeValueAxis(name: string): IChartsConfigurationService;
    removeHorizontalLine(name: string, axis: string): IChartsConfigurationService;

    updateStartRanges(name: string, value: any, axis: string): IChartsConfigurationService;
    updateEndRanges(name: string, value: any, axis: string): IChartsConfigurationService;
    updateHorizontalLines(name: string, value: any, axis: string): IChartsConfigurationService;
    updateVerticalLine(id: string, name: string, date?: any): IChartsConfigurationService;

    resetData(data?: any[]): void;
    getData(): any[];
}

export class ChartsConfigurationService implements IChartsConfigurationService {
    public chart: any;

    private seriesUpdatesSubscription: KnockoutSubscription;
    private languageSubscription: KnockoutSubscription;
    private readonly chartsUpdateService: ChartsUpdateService;
    private readonly connector = new Connector();
    public readonly isLoading: KnockoutObservable<boolean>;
    public readonly chartLoading: KnockoutObservable<boolean>;

    private dateAxis: any;

    constructor(private readonly provider: ISeriesChartDataProviderFacade, private readonly id: string) {
        this.isLoading = provider.isLoading;
        this.chartsUpdateService = new ChartsUpdateService(this, provider);
        this.chartLoading = this.chartsUpdateService.chartLoading;
        this.chartsUpdateService.subscribe();
    }

    private removeAxisRangeBase(name: string, axis: string) {
        this.chart.yAxes.each(yAxis => {
            const range = _.find(yAxis.axisRanges.values as any[], (item) => item.id === name);
            if (range) {
                yAxis.axisRanges.removeValue(range);
                range.dispose();
            }
        });
        return this;
    }

    public removeRange(name: string, axis: string) {
        return this.removeAxisRangeBase(name, axis);
    }

    public updateEndRanges(name: string, value: any, axis: string) {
        const yAxes = _.find(this.chart.yAxes.values as any[], item => item.id === `valueAxis-${axis}`);
        if (yAxes) {
            for (const range of yAxes.axisRanges.values) {
                if (name === range.id) {
                    range.endValue = numeral(value).value();
                }
            }
        }
        return this;
    }

    public updateStartRanges(name: string, value: any, axis: string) {
        const yAxes = _.find(this.chart.yAxes.values as any[], item => item.id === `valueAxis-${axis}`);
        if (yAxes) {
            for (const range of yAxes.axisRanges.values) {
                if (name === range.id) {
                    range.value = numeral(value).value();
                }
            }
        }
        return this;
    }

    public updateHorizontalLines(name: string, value: any, axis: string) {
        const id = `horizontalLine-${name}`;
        return this.updateStartRanges(id, value, axis)
    }

    public updateVerticalLine(id: string, name: string, date?: Date) {
        const verticalLineId = `verticalLine-${id}`;
        if (!this.dateAxis)
            return;

        const range = _.find(this.dateAxis.axisRanges.values as any[], (item) => item.id === verticalLineId);
        if (range && date) {
            range.grid.strokeOpacity = 0.6;
            range.label.fillOpacity = 0.8;
            range.label.strokeOpacity = 0.8;
            range.label.text = name;
            range.date = date;
            //  range.grid.tooltipText = value;
        }
        return this;
    }


    public addHorizontalLine(configuration: IHorizontalLineConfiguration, axis: string, staticValue: any = null) {
        const id = `horizontalLine-${configuration.name}`;
        const yAxis = _.find(this.chart.yAxes.values as any[], (item) => item.id === `valueAxis-${axis}`);

        const range = yAxis.axisRanges.create();
        range.id = id
        const value = configuration.type === HorizontalLineConfigurationType.Value ? (numeral(configuration.value).value() + numeral((configuration.offset || 0)).value()) : null;

        if (configuration.type === HorizontalLineConfigurationType.SignalMax || configuration.type === HorizontalLineConfigurationType.SignalMin) {
            range.value = numeral(staticValue).value() + numeral((configuration.offset || 0)).value();
        } else {
            if (value !== null) {
                range.value = value;
            }
        }

        range.grid.stroke = am4core.color(configuration.color);
        range.grid.strokeWidth = 2;
        range.grid.strokeOpacity = 1;

        range.label.text = configuration.name;
        range.label.fill = am4core.color(configuration.color);
        range.label.inside = true;
        range.label.verticalCenter = "bottom";

        return this;
    }

    public addVerticalLine(id: string) {
        const verticalLineId = `verticalLine-${id}`;
        const range = this.dateAxis.axisRanges.create();
        range.id = verticalLineId;
        range.grid.strokeDasharray = "5,2";
        range.label.inside = true;
        range.label.rotation = 90;
        range.label.horizontalCenter = "right";
        range.label.verticalCenter = "bottom";

        return this;
    }

    public addRange(configuration: IRegionConfiguration) {
        const yAxis = _.find(this.chart.yAxes.values as any[], (item) => item.id === `valueAxis-${configuration.axis}`);
        const range = yAxis.axisRanges.create();
        range.id = configuration.name;
        const startValue = configuration.startType == RangeConfigurationType.Value ? numeral(configuration.start).value() : null;
        const endValue = configuration.endType == RangeConfigurationType.Value ? numeral(configuration.end).value() : null;
        if (startValue !== null)
            range.value = startValue;
        if (endValue !== null)
            range.endValue = endValue;
        range.axisFill.fillOpacity = 1;
        range.axisFill.fill = am4core.color(configuration.color);
        range.label.fill = am4core.color(configuration.color).alternative;
        range.label.text = configuration.name;
        range.label.inside = true;
        range.label.verticalCenter = "middel";
        return this;
    }

    public addLegend(configuration: ILegendConfiguration) {
        if (configuration.show === true) {
            const legend = new am4charts.Legend();
            //  legend.useDefaultMarker = true;

            if (configuration.position != undefined) {
                legend.position = configuration.position;
            }
            if (configuration.verticalAlign != undefined) {
                legend.valign = configuration.verticalAlign;
            }
            if (configuration.contentAlign != undefined) {
                legend.contentAlign = configuration.contentAlign;
            }

            if (configuration.showValues === true) {
                for (const series of this.chart.series.values) {
                    series.legendSettings.valueText = "{valueY.close}";
                    series.legendSettings.itemValueText = "[bold]{valueY}[/bold]";
                }
            }
            this.chart.legend = legend;

        }
        return this;
    }

    public createChart() {
        am4core.options.minPolylineStep = this.provider.minPolylineStep;
        am4core.options.commercialLicense = true;
        this.chartLoading(true);
        if (this.chart) {
            this.chart.dispose();
        }

        if (this.languageSubscription) {
            this.languageSubscription.dispose();
        }

        this.chart = am4core.create(`wf-historical-data-chart-${ko.unwrap(this.id)}`, am4charts.XYChart);

        this.languageSubscription = this.connector.currentLanguageId.subscribe((lang) => {
            const id = this.connector.getAmchartsLanguage(lang);
            this.chart.language.locale = window["am4lang_" + id];
        });

        const id = this.connector.getAmchartsLanguage(this.connector.currentLanguageId());
        this.chart.language.locale = window["am4lang_" + id];

        // this.chart.preloader.disabled = true;
        this.chart.preloader.hidden = true;

        this.chart.modal.events.on("closed", () => {
            this.chartLoading(false);
        }, this);

        this.chart.preloader.events.on("shown", () => {
            this.chartLoading(true);
        }, this);

        this.chart.events.on("ready", async () => {
            this.provider.resolution(Math.max(this.chart.pixelWidth, 5000));
            this.chart.events.on("sizechanged", () => {
                this.provider.resolution(Math.max(this.chart.pixelWidth, 5000));
            });
            //startchanged
            this.dateAxis.events.on("startendchanged", _.debounce(this.chartsUpdateService.dateAxisChanged, 10));
            this.provider.startGettingUpdates();
        }, this);

        this.chart.events.on("beforedatavalidated", () => {
            this.disableStartendchanged();
            this.chartLoading(true);
        }, this);

        this.chart.events.on("datavalidated", () => {
            this.chartLoading(false);
            this.enableStartendchanged();
        }, this);

        this.addDateAxis()
            .addScrollbarX(this.provider.scrollbar())
            .addScrollbarY(this.provider.scrollbar());

        if (this.provider.layoutVertical === true) {
            this.chart.leftAxesContainer.layout = "vertical";
        }

        for (const axis of this.provider.axes()) {
            this.addValueAxis(axis);
        }

        for (const series of this.provider.series()) {
            this.addSeries(series);
        }

        for (const range of this.provider.regions()) {
            this.addRange(range);
        }

        this
            .addCursor()
            .addLegend(this.provider.legend())
            .addSubscriptions();

        this.resetData(this.provider.seriesUpdates);

        this.chartsUpdateService.addHorizontalLines();
        this.chartsUpdateService.addVerticalLines();

        return this;
    }

    public disableStartendchanged() {
        this.dateAxis.events.disableType("startendchanged");
    }
    public enableStartendchanged() {
        this.dateAxis.events.enableType("startendchanged");
    }

    public addDateAxis() {
        // Create axes
        this.dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        this.dateAxis.keepSelection = true;

        const dateTimeTooltipFormat = this.provider.chartDataProvider.configuration().dateTimeTooltipFormat || "M/d/yyyy";

        this.dateAxis.tooltipDateFormat = dateTimeTooltipFormat.replace(/DD/g, 'dd');

        return this;
    }

    public addCursor() {
        this.chart.cursor = new am4charts.XYCursor();
        return this;
    }

    public addValueAxis(configuration: IAxisConfiguration) {
        // Create value axis
        const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.id = `valueAxis-${configuration.name}`;
        valueAxis.marginTop = 10;
        valueAxis.marginBottom = 10;
        valueAxis.align = "right";

        valueAxis.renderer.line.strokeOpacity = 1;

        if (configuration.color !== undefined) {
            valueAxis.renderer.line.stroke = am4core.color(configuration.color);
            valueAxis.renderer.labels.template.fill = am4core.color(configuration.color);
            valueAxis.title.fill = am4core.color(configuration.color);
        }

        valueAxis.renderer.grid.template.stroke = configuration.gridThickness == undefined ? valueAxis.renderer.grid.template.stroke : am4core.color(configuration.gridColor);;

        valueAxis.renderer.opposite = false;

        valueAxis.renderer.line.strokeWidth = configuration.thickness == undefined ? valueAxis.renderer.line.strokeWidth : configuration.thickness;
        valueAxis.renderer.grid.template.strokeWidth = configuration.gridThickness == undefined ? valueAxis.renderer.grid.template.strokeWidth : configuration.gridThickness;

        if (configuration.minGridDistance != undefined) {
            valueAxis.renderer.minGridDistance = configuration.minGridDistance;
        }

        if (valueAxis.renderer.grid.template.strokeWidth <= 0) {
            valueAxis.renderer.grid.template.disabled = false;
        }

        if (configuration.valuePosition == undefined || configuration.valuePosition === ValuePosition.Outside) {
            valueAxis.renderer.inside = false;
        }

        if (configuration.valuePosition === ValuePosition.Inside) {
            valueAxis.renderer.inside = true;
        }

        if (configuration.showLabels === false) {
            valueAxis.renderer.labels.template.adapter.add("text", () => {
                return "";
            });
        }

        if (configuration.showLastLabel === false) {
            valueAxis.renderer.maxLabelPosition = 0.95;
        }

        if (configuration.showFirstLabel === false) {
            valueAxis.renderer.minLabelPosition = 0.05;
        }

        if (configuration.useIntegerValues === true) {
            valueAxis.maxPrecision = 0;
        }

        if (configuration.digits != undefined) {
            let format = "#,###.";
            for (let index = 0; index < configuration.digits; index++) {
                format = `${format}#`
            }
            valueAxis.numberFormatter.numberFormat = format;
        }

        if (configuration.scientific === true) {
            valueAxis.numberFormatter.numberFormat = `${valueAxis.numberFormatter.numberFormat}e`;
        }

        valueAxis.renderer.inversed = !!configuration.inversed;
        valueAxis.renderer.opposite = !!configuration.opposite;

        valueAxis.title.text = configuration.name;

        if (configuration.titleRotation != undefined) {
            valueAxis.title.rotation = configuration.titleRotation;
        }

        if (configuration.labelRotation != undefined) {
            valueAxis.renderer.labels.template.rotation = configuration.labelRotation;
        }

        valueAxis.logarithmic = !!configuration.logarithmic;

        if (configuration.min != undefined) {
            valueAxis.min = configuration.min
        }
        if (configuration.max != undefined) {
            valueAxis.max = configuration.max
        }

        this.linkSeries(valueAxis);

        return this;
    }

    public removeHorizontalLine(name: string, axis: string) {
        name = `horizontalLine-${name}`
        return this.removeAxisRangeBase(name, axis);
    }

    public removeValueAxis(name: string) {
        const axis = _.find(this.chart.yAxes.values as any[], (item) => item.id === `valueAxis-${name}`);
        if (axis) {
            this.chart.yAxes.removeValue(axis);
            axis.dispose();
        }
        return this;
    }

    public addSeries(configuration: ISeriesConfiguration) {

        let series = null;

        switch (configuration.chartType) {

            case ChartType.Step:
                series = this.chart.series.push(new am4charts.StepLineSeries());
                break;
            case ChartType.Bar:
                series = this.chart.series.push(new am4charts.ColumnSeries());
                break;
            case ChartType.StackedBar:
                series = this.chart.series.push(new am4charts.ColumnSeries());
                series.stacked = true;
                break;
            case ChartType.StackedLine:
                series = this.chart.series.push(new am4charts.LineSeries());
                series.stacked = true;
                break;
            case ChartType.Dots:
                series = this.chart.series.push(new am4charts.LineSeries());
                const dots = series.bullets.push(new am4charts.CircleBullet());
                dots.circle.strokeWidth = 0;
                dots.circle.radius = 3;
                if (configuration.strokeColor != undefined) {
                    dots.circle.fill = am4core.color(configuration.strokeColor);
                }
                series.strokeOpacity = 0;
                break;
            case ChartType.LineDots:
                series = this.chart.series.push(new am4charts.LineSeries());
                const lineDots = series.bullets.push(new am4charts.CircleBullet());
                lineDots.circle.strokeWidth = 0;
                lineDots.circle.radius = 3;
                if (configuration.strokeColor != undefined) {
                    lineDots.circle.fill = am4core.color(configuration.strokeColor);
                }
                break;
            default:
                series = this.chart.series.push(new am4charts.LineSeries());
                break;
        }

        const valueAxis = _.find(this.chart.yAxes.values as any[], (item) => item.id === `valueAxis-${configuration.axis}`);
        if (valueAxis) {
            series.yAxis = valueAxis;
        }
        series.id = configuration.name;

        if (configuration.thickness !== undefined) {
            series.strokeWidth = configuration.thickness;
        }

        series.dataFields.valueY = configuration.name;
        series.dataFields.dateX = "timestamp";

        if (configuration.digits != undefined) {
            let format = "#,###.";
            for (let index = 0; index < configuration.digits; index++) {
                format += "#";
            }
            series.tooltipText = `[#000]{name}: {valueY.formatNumber('${format}')}[/]`;
        } else {
            series.tooltipText = "[#000]{name}: {valueY}[/]";
        }

        series.tooltip.background.fill = am4core.color("#FFF");
        series.tooltip.getStrokeFromObject = true;
        series.tooltip.getFillFromObject = false;

        if (configuration.fillColor != undefined && configuration.fillColor !== "transparent") {
            series.fillOpacity = 1;
            series.fill = am4core.color(configuration.fillColor);
        } else {
            series.fillOpacity = 0;
        }

        if (configuration.chartType !== ChartType.Dots) {
            if (configuration.strokeColor != undefined && configuration.strokeColor !== "transparent") {
                series.strokeOpacity = 1;
                series.stroke = am4core.color(configuration.strokeColor);
            } else {
                series.strokeOpacity = 0;
            }
        }

        const seriesData = this.provider.getSeriesData(`${configuration.signalName}/${configuration.tag}`);

        if (!seriesData)
            return this;

        const signal = seriesData.signal;

        switch (configuration.display) {
            case SeriesDisplayType.Alias:
                series.name = signal.Alias || signal.AliasName;
                break;
            case SeriesDisplayType.Description:
                series.name = signal.Description;
                break;
            default:
                series.name = configuration.name;
                break;
        }
        return this;
    }

    public addScrollbarX(configuration: IScrollbarConfiguration) {
        if (configuration.showX !== true) {
            return this;
        }
        const scrollbarX = new am4core.Scrollbar();
        scrollbarX.updateWhileMoving = false;
        this.chart.scrollbarX = scrollbarX;
        return this;
    }

    public addScrollbarY(configuration: IScrollbarConfiguration) {
        if (configuration.showY !== true) {
            return this;
        }
        const scrollbarY = new am4core.Scrollbar();
        this.chart.scrollbarY = scrollbarY;
        return this;
    }

    public addSubscriptions() {
        if (!this.seriesUpdatesSubscription)
            this.seriesUpdatesSubscription = this.provider.updates.subscribe((x) => {
                // some workaround to get the startEnd date correctly set
                if (this.chart.data.length <= 2) {
                    this.resetData(this.provider.seriesUpdates);
                } else if (x.length > 0) {
                    this.chart.addData(x, 0);
                } else {
                    this.resetData();
                }
                if (!this.chartsUpdateService.isHidden) {
                    const toRemove = this.chart.data.length - this.provider.timestamps().length - 2;
                    if (toRemove > 0) {
                        this.chart.removeData(toRemove);
                    }
                }
            });

        return this;
    }

    private addStartEndDate(cartData: any[]) {
        const dummyItems = _.filter(cartData, x => Object.keys(x).length === 1);
        if (dummyItems.length < 2) {
            const data = [];
            if (this.provider.start()) {
                data.push({ timestamp: moment(this.provider.start()).toDate() });
            }
            if (this.provider.end()) {
                data.push({ timestamp: moment(this.provider.end()).toDate() });
            }

            cartData.push(...data);
            cartData.sort((a, b) => {
                return (new Date(a.timestamp).getTime()) - (new Date(b.timestamp).getTime());
            });
        }
    }

    public dispose() {
        this.languageSubscription.dispose();
        this.chartsUpdateService.dispose();
        this.seriesUpdatesSubscription.dispose();
        this.chart.dispose();
    }

    public resetData(cartData: any[] = []) {
        this.disableStartendchanged();
        this.addStartEndDate(cartData);
        this.chart.data = cartData;
    }

    public getData(): any[] {
        return this.chart.data;
    }

    private linkSeries(valueAxis: any) {
        const seriesConfiguration = _.filter(this.provider.series(), (item) => `valueAxis-${item.axis}` === valueAxis.id);
        for (const series of seriesConfiguration) {
            if (valueAxis) {
                const cartSeries = _.find(this.chart.series.values as any[], (item) => item.id === series.name);
                if (cartSeries)
                    cartSeries.yAxis = valueAxis;
            }
        }
    }

}