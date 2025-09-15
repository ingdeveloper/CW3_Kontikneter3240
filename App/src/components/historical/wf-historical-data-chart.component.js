var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../component-base.model", "./historical-data", "./services/charts-configuration/charts-configuration.service", "./models/toolbox-params.model", "../../services/connectorEnums"], function (require, exports, ComponentBaseModel, historical_data_1, charts_configuration_service_1, toolbox_params_model_1, connectorEnums_1) {
    "use strict";
    var WfHistoricalDatChartComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDatChartComponent, _super);
        function WfHistoricalDatChartComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.isLoading = ko.observable(false);
            _this.chartLoading = ko.observable(false);
            _this.hasTimestamps = ko.observable(false);
            _this.hasSeries = ko.observable(false);
            _this.startTooltip = ko.observable();
            _this.endTooltip = ko.observable();
            _this.hasTags = ko.pureComputed(function () {
                var loading = _this.isLoading();
                var chartLoading = _this.chartLoading();
                var hasSeries = _this.hasSeries();
                if (!_this.provider) {
                    return false;
                }
                return hasSeries || loading || chartLoading;
            });
            _this.hasData = ko.pureComputed(function () {
                var loading = _this.isLoading();
                var chartLoading = _this.chartLoading();
                var hasTimestamps = _this.hasTimestamps();
                var hasTags = _this.hasTags();
                if (!hasTags) {
                    return true;
                }
                if (!_this.provider) {
                    return false;
                }
                return hasTimestamps || loading || chartLoading;
            });
            _this.getProvidersAsync();
            return _this;
        }
        WfHistoricalDatChartComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.height = ko.unwrap(this.settings.height) || 300;
            this.groupName = ko.unwrap(this.settings.groupName) || ko.unwrap(this.id);
            this.controlName = ko.unwrap(this.settings.controlName) || ko.unwrap(this.id);
            this.dataToolboxShowLabels = ko.unwrap(this.settings.dataToolboxShowLabels) || false;
            this.dataToolboxButtons = ko.unwrap(this.settings.dataToolboxButtons) || [{ button: toolbox_params_model_1.ToolboxButtons.PauseResume }, { button: toolbox_params_model_1.ToolboxButtons.TimeSettings }, { button: toolbox_params_model_1.ToolboxButtons.Back }, { button: toolbox_params_model_1.ToolboxButtons.Forward }, { button: toolbox_params_model_1.ToolboxButtons.Devider }, { button: toolbox_params_model_1.ToolboxButtons.Export }, { button: toolbox_params_model_1.ToolboxButtons.LoadConfiguration }, { button: toolbox_params_model_1.ToolboxButtons.SaveConfiguration }];
            this.dialogToolboxShowLabels = ko.unwrap(this.settings.dialogToolboxShowLabels) || false;
            this.dialogToolboxButtons = ko.unwrap(this.settings.dialogToolboxButtons) || [{ button: toolbox_params_model_1.DialogToolboxButtons.Axes }, { button: toolbox_params_model_1.DialogToolboxButtons.Data }, { button: toolbox_params_model_1.DialogToolboxButtons.Regions }];
            ;
            this.configurationButtonPosition = ko.unwrap(this.settings.configurationButtonPosition) || "TopRight";
            this.title = ko.unwrap(this.settings.title) !== undefined ? ko.unwrap(this.settings.title) : "WEBfactory Chart";
            ;
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.showDateTimeTooltip = ko.unwrap(this.settings.showDateTimeTooltip) || false;
            this.dateTimeTooltipFormat = ko.unwrap(this.settings.dateTimeTooltipFormat) || "DD.MM.YYYY HH:mm:ss";
            this.panelVisibility = ko.unwrap(this.settings.panelVisibility) !== undefined ? ko.unwrap(this.settings.panelVisibility) : true;
            this.count = ko.unwrap(this.settings.count) !== undefined ? ko.unwrap(this.settings.count) : null;
            this.timeSeriesMode = ko.unwrap(this.settings.timeSeriesMode) !== undefined ? ko.unwrap(this.settings.timeSeriesMode) : connectorEnums_1.TimeSeriesMode.Offline;
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
        };
        WfHistoricalDatChartComponent.prototype.buildConfiguration = function () {
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
            };
        };
        WfHistoricalDatChartComponent.prototype.buildConfigurationSettings = function () {
            return {
                initialConfiguration: this.initialConfiguration,
                configurationName: this.configurationName,
                configurationNamespace: this.configurationNamespace,
                clientsideConfiguration: this.clientsideConfiguration
            };
        };
        WfHistoricalDatChartComponent.prototype.getProvidersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, historical_data_1.HistoricalData.seriesConnector.subscribeAsync(this.groupName, this.controlName, this.buildConfiguration(), this.buildConfigurationSettings())];
                        case 1:
                            _a.provider = _b.sent();
                            if (this.provider) {
                                this.provider.startGettingUpdates();
                                this.generateChart();
                                this.subscriptionTimestamps = this.provider.timestamps.subscribe(function () {
                                    _this.hasTimestamps(!!_this.provider.timestamps().length);
                                });
                                this.subscriptionSeries = this.provider.series.subscribe(function () {
                                    _this.hasSeries(!!_this.provider.series().length);
                                });
                                this.subscriptionStart = this.provider.start.subscribe(function (value) {
                                    _this.startTooltip(value);
                                });
                                this.subscriptionEnd = this.provider.end.subscribe(function (value) {
                                    _this.endTooltip(value);
                                });
                                this.startTooltip(this.provider.start());
                                this.endTooltip(this.provider.end());
                                this.hasSeries(!!this.provider.series().length);
                                this.hasTimestamps(!!this.provider.timestamps().length);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDatChartComponent.prototype.generateChart = function () {
            var _this = this;
            this.chartsConfigurationService = new charts_configuration_service_1.ChartsConfigurationService(this.provider, ko.unwrap(this.id));
            this.subscription = this.chartsConfigurationService.isLoading.subscribe(function (value) {
                _this.isLoading(value);
            });
            this.subscriptionChartLoading = this.chartsConfigurationService.chartLoading.subscribe(function (value) {
                _this.chartLoading(value);
            });
            this.isLoading(this.chartsConfigurationService.isLoading());
            this.chartLoading(this.chartsConfigurationService.chartLoading());
            this.chartsConfigurationService
                .createChart();
        };
        WfHistoricalDatChartComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    historical_data_1.HistoricalData.seriesConnector.unSubscribe(this.groupName, this.controlName);
                    this.chartsConfigurationService.dispose();
                    this.subscription.dispose();
                    this.subscriptionSeries.dispose();
                    this.subscriptionTimestamps.dispose();
                    this.subscriptionChartLoading.dispose();
                    this.subscriptionStart.dispose();
                    this.subscriptionEnd.dispose();
                    return [2 /*return*/];
                });
            });
        };
        return WfHistoricalDatChartComponent;
    }(ComponentBaseModel));
    return WfHistoricalDatChartComponent;
});
//# sourceMappingURL=wf-historical-data-chart.component.js.map