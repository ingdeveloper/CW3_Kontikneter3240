// Anderung
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "src/components/services/convert-csv.service", "src/decorators/busyIndicator", "src/components/component-base.model", "src/components/services/secured.service", "src/components/services/standalone-parameters-replacement.service", "src/services/connectorEnums", "src/services/http"], function (require, exports, ConvertCsvService, BusyIndicator, ComponentBaseModel, SecuredService, StandaloneParametersReplacementService, connectorEnums_1, HttpService) {
    "use strict";
    var ccwLogValuesFilter = /** @class */ (function () {
        function ccwLogValuesFilter(logIds, startDate, endDate, maxResults, sortOrder, dbName, isI4Scada) {
            if (maxResults === void 0) { maxResults = null; }
            if (sortOrder === void 0) { sortOrder = LogValuesSortOrder.DateAscending; }
            if (dbName === void 0) { dbName = ""; }
            if (isI4Scada === void 0) { isI4Scada = null; }
            this.logIds = ko.observableArray();
            this.startDate = ko.observable();
            this.endDate = ko.observable();
            this.maxResults = ko.observable();
            this.sortOrder = ko.observable();
            this.dbName = ko.observable();
            this.isI4Scada = ko.observable();
            this.logIds(logIds);
            this.startDate(startDate);
            this.endDate(endDate);
            this.maxResults(maxResults);
            this.sortOrder(sortOrder);
            this.dbName(dbName);
            this.isI4Scada(isI4Scada);
        }
        ccwLogValuesFilter.prototype.toDto = function () {
            var dto = {
                LogID: this.logIds(),
                StartDate: moment(this.startDate()).toMSDateTimeOffset(),
                EndDate: moment(this.endDate()).toMSDateTimeOffset(),
                SortOrder: this.sortOrder(),
                MaxResults: this.maxResults(),
                DbName: this.dbName(),
                IsI4Scada: this.isI4Scada()
            };
            return dto;
        };
        return ccwLogValuesFilter;
    }());
    var ObservableAxisConfigration = /** @class */ (function () {
        function ObservableAxisConfigration() {
            this.maxValue = ko.observable();
            this.isMaxSignalDependent = ko.observable();
            this.minValue = ko.observable();
            this.isMinSignalDependent = ko.observable();
            this.label = ko.observable();
            this.color = ko.observable();
            this.visible = ko.observable();
            this.isDisplayedInner = ko.observable();
            this.tickCount = ko.observable();
            this.tickFormat = ko.observable();
            this.isGridVisible = ko.observable();
        }
        return ObservableAxisConfigration;
    }());
    var ObservableChartAxesConfiguration = /** @class */ (function () {
        function ObservableChartAxesConfiguration() {
        }
        return ObservableChartAxesConfiguration;
    }());
    var WfChart1Component = /** @class */ (function (_super) {
        __extends(WfChart1Component, _super);
        function WfChart1Component(params) {
            var _this = _super.call(this, params) || this;
            _this.y2AxisLabelInput = ko.observable();
            _this.y2AxisMinValueInput = ko.observable();
            _this.y2AxisMinIsSignalDependentInput = ko.observable();
            _this.y2AxisMaxValueInput = ko.observable();
            _this.y2AxisMaxIsSignalDependentInput = ko.observable();
            _this.y1AxisLabelInput = ko.observable();
            _this.y1AxisMinValueInput = ko.observable();
            _this.y1AxisMinIsSignalDependentInput = ko.observable();
            _this.y1AxisMaxValueInput = ko.observable();
            _this.y1AxisMaxIsSignalDependentInput = ko.observable();
            _this.x1AxisLabelInput = ko.observable();
            _this.isChartZoomed = ko.observable(false);
            _this.zoomZurueckArray = new Array();
            _this.minMaxAvgValues = new Array();
            _this.onSubchartZoomChanged = function (chart, domain) {
                this.generatedChartObject = chart;
                var zoomStart = moment(domain[0]);
                var zoomEnd = moment(domain[1]);
                var chartIntervalStart = moment(this.firstDisplayedDate()).add(this.updateRate, "milliseconds");
                var chartIntervalEnd = moment(this.lastDisplayedDate()).subtract(this.updateRate, "milliseconds");
                this.isChartZoomed(!zoomStart.isSameOrBefore(chartIntervalStart) || !zoomEnd.isSameOrAfter(chartIntervalEnd));
                if (this.isChartZoomed() && this.isRealTimeUpdating()) {
                    this.isAutoUpdating(true);
                }
                if (!this.isChartZoomed() && this.autoUpdate()) {
                    this.isAutoUpdating(false);
                    this.handleAutoUpdate();
                }
            };
            _this.resetChartZoom = function () {
                if (this.generatedChartObject) {
                    this.generatedChartObject.unzoom();
                }
                this.isChartZoomed(false);
            };
            _this.getTooltipContents = function (chartthis, d, defaultTitleFormat, defaultValueFormat, color) {
                var $$ = this;
                var config = $$.config ? $$.config : {};
                var titleFormat = config.tooltip_format_title || $$.timeAxisFormat() || defaultTitleFormat;
                var nameFormat = config.tooltip_format_name ||
                    function (name) {
                        return name;
                    };
                var valueFormat = config.tooltip_format_value || defaultValueFormat;
                var text = "";
                var i;
                var title;
                var backgroundColor;
                var unit;
                var cssClass = $$.CLASS ? $$.CLASS : {};
                var tooltipHeader = cssClass.tooltip ? cssClass.tooltip : "c3-tooltip";
                var tooltipMainRow = cssClass.tooltipName ? cssClass.tooltipName : "";
                if (chartthis.length === 0)
                    return "";
                for (i = 0; i < chartthis.length; i++) {
                    var point = chartthis[i];
                    var line = _.find($$.lines(), function (line, index) {
                        return $$.getChartLineName(line, index) === point.id;
                    });
                    if (!line)
                        continue;
                    backgroundColor = ko.unwrap(line.color);
                    if (line.staticUnitText() != null) {
                        unit = line.staticUnitText();
                    }
                    else {
                        unit = line.unit();
                    }
                    if (!text) {
                        title = $$.getFormatedDateString(point.x, titleFormat);
                        text =
                            "<table class='" +
                                tooltipHeader +
                                "'>" +
                                (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                    }
                    text += $$.addTooltipRowInformation(point, tooltipMainRow, { name: point.name, value: $$.getFormatedValue(point.value, unit) }, nameFormat, valueFormat, backgroundColor, 5, true, true);
                }
                return text + "</table>";
            };
            _this.refreshChartObject = _.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.setChartObject();
                    return [2 /*return*/];
                });
            }); }, 200);
            _this.convertCsvService = new ConvertCsvService(_this.settings);
            // console.log(params);
            console.log("CONSTRUKTOR");
            _this.chartId = 'myChart-' + uuid.v4();
            _this.versionenChartId = ko.observable('versionen_myChart-' + uuid.v4());
            _this.getHideConfigInit = false;
            _this.initSignalNamen(params);
            _this.loadInitialConfiguration();
            return _this;
        }
        WfChart1Component.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.initializeObservables();
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.showOnlyOwnConfigurations =
                this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.showIsStaticColumn = this.settings.showIsStaticColumn || false;
            this.showDateTimeTooltip = this.settings.showDateTimeTooltip || false;
            this.dateTimeTooltipFormat =
                this.settings.dateTimeTooltipFormat !== undefined ? this.settings.dateTimeTooltipFormat : "DD.MM.YYYY HH:mm:ss";
            //#region configuration project authorization
            this.configurationProjectAuthorization = (ko.unwrap(this.settings.configurationProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
            this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
            //#endregion
            //#region signal selection project authorization
            this.signalSelectionProjectAuthorization = (ko.unwrap(this.settings.signalSelectionProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
            this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
            //#endregion
            //#region export project authorization
            this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
            this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
            //#endregion
            this.showDialog = ko.observable(false);
            this.showSignalsDialog = ko.observable(false);
            this.legendText = ko.unwrap(this.settings.legendText) || "AliasName";
            this.signalFilterText = ko.unwrap(this.settings.signalFilterText) || "AliasName";
            this.busyContext = new BusyIndicator(this);
            this.languageId = this.connector.currentLanguageId ? this.connector.currentLanguageId : ko.observable(9);
            this.languageId.subscribe(function () {
                // Reload the signal information on language change
                _this.getSignalInformations(true);
            });
            this.placeHolderID = ko.computed(function () {
                return "#" + ko.unwrap(_this.id);
            });
            this.chartWidth = ko.observable(ko.unwrap(this.settings.chartWidth));
            this.chartHeight = ko.observable(ko.unwrap(this.settings.chartHeight)) || undefined;
            this.chartType = ko.observable(ko.unwrap(this.settings.chartType) || "line"); //line, step, spline, bar, area, area-spline
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.footerVisibility = ko.observable(ko.unwrap(this.settings.footerVisibility) !== undefined ? ko.unwrap(this.settings.footerVisibility) : false);
            this.statisticsVisibilityIntern = ko.observable(ko.unwrap(this.settings.statisticsVisibility) !== undefined ? ko.unwrap(this.settings.statisticsVisibility) : false);
            this.statisticsVisibility = ko.computed(function () {
                var anzeigen = ko.unwrap(_this.statisticsVisibilityIntern);
                return anzeigen;
            });
            this.btnStatisticCss = ko.computed(function () {
                var css = 'btn btn-default';
                if (ko.unwrap(_this.statisticsVisibility)) {
                    css = 'btn btn-info';
                }
                return css;
            });
            this.signalsButtonVisibility = ko.observable(ko.unwrap(this.settings.signalsButtonVisibility) !== undefined
                ? ko.unwrap(this.settings.signalsButtonVisibility)
                : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined
                ? ko.unwrap(this.settings.settingsButtonVisibility)
                : true);
            this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined
                ? ko.unwrap(this.settings.configurationButtonVisibility)
                : true);
            this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined
                ? ko.unwrap(this.settings.exportButtonVisibility)
                : true);
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.LogTagTrend;
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            // DEPRECATED PROPERTY
            // Property "buttonBarCss" is deprecated. Please use "buttonBarCssClass" instead.
            this.buttonBarCss = ko.unwrap(this.settings.buttonBarCssClass) || "";
            this.chartPadding = ko.observable({
                left: ko.unwrap(this.settings.chartPaddingLeft),
                right: ko.unwrap(this.settings.chartPaddingRight),
                top: ko.unwrap(this.settings.chartPaddingTop),
                bottom: ko.unwrap(this.settings.chartPaddingbottom)
            });
            this.lines = ko.observableArray();
            this.showSecondAxis = ko.computed(function () {
                return ko.unwrap(_this.settings.y2AxisVisible) !== undefined
                    ? ko.unwrap(_this.settings.y2AxisVisible)
                    : _.any(_this.lines(), function (line) {
                        return line.axis().toLowerCase() === "y2";
                    });
            }, this);
            this.showFirstAxis = ko.computed(function () {
                return ko.unwrap(_this.settings.y1AxisVisible) !== undefined
                    ? ko.unwrap(_this.settings.y1AxisVisible)
                    : _.any(_this.lines(), function (line) {
                        return line.axis().toLowerCase() !== "y2";
                    });
            }, this);
            this.removePaddingForY = ko.pureComputed(function () {
                return ko.unwrap(_this.chartAxes().y1().minValue) ||
                    ko.unwrap(_this.chartAxes().y1().maxValue) ||
                    ko.unwrap(_this.chartAxes().y1().isMinSignalDependent) ||
                    ko.unwrap(_this.chartAxes().y1().isMaxSignalDependent)
                    ? true
                    : false;
            });
            this.removePaddingForY2 = ko.pureComputed(function () {
                return ko.unwrap(_this.chartAxes().y2().minValue) ||
                    ko.unwrap(_this.chartAxes().y2().maxValue) ||
                    ko.unwrap(_this.chartAxes().y2().isMinSignalDependent) ||
                    ko.unwrap(_this.chartAxes().y2().isMaxSignalDependent)
                    ? true
                    : false;
            });
            this.initializeAxesConfigurationFromSettigs(this.settings);
            this.dbName = ko.unwrap(this.settings.dbName) || "";
            this.activeSubchart = ko.observable(false);
            this.logsAlsDurchschnittswerte = ko.unwrap(this.settings.logsAlsDurchschnittswerte) || false;
            this.tooltipPosition = ko.observable(this.settings.tooltipPosition || "line"); //line, step, spline, bar, area, area-spline
            this.axisLabels = ko.computed(function () {
                return {
                    x: _this.chartAxes()
                        .x()
                        .label() || "",
                    y: _this.chartAxes()
                        .y1()
                        .label() || "",
                    y2: _this.chartAxes()
                        .y2()
                        .label() || ""
                };
            }, this);
            this.maxValueForAxises = ko.pureComputed(function () {
                var triggerY1MaxSignal = _this.chartAxes()
                    .y1()
                    .isMaxSignalDependent();
                var triggerY2MaxSignal = _this.chartAxes()
                    .y2()
                    .isMaxSignalDependent();
                var value = {
                    x: undefined,
                    y: undefined,
                    y2: undefined
                };
                var lines = ko.toJS(_this.lines);
                if (triggerY1MaxSignal) {
                    var axisY = _.findWhere(lines, { axis: "y1" });
                    if (axisY !== undefined)
                        value.y = Number(ko.unwrap(axisY.maxAxis));
                }
                else if (_this.chartAxes()
                    .y1()
                    .maxValue()) {
                    value.y = Number(_this.chartAxes()
                        .y1()
                        .maxValue());
                }
                if (triggerY2MaxSignal) {
                    var axisY2 = _.findWhere(lines, { axis: "y2" });
                    if (axisY2 !== undefined)
                        value.y2 = Number(ko.unwrap(axisY2.maxAxis));
                }
                else if (_this.chartAxes()
                    .y2()
                    .maxValue()) {
                    value.y2 = Number(_this.chartAxes()
                        .y2()
                        .maxValue());
                }
                _this.isI4Scada = ko.unwrap(_this.settings.isI4Scada);
                return value;
            }, this);
            this.minValueForAxises = ko.pureComputed(function () {
                var triggerY1MinSignal = _this.chartAxes()
                    .y1()
                    .isMinSignalDependent();
                var triggerY2MinSignal = _this.chartAxes()
                    .y2()
                    .isMinSignalDependent();
                var value = {
                    x: undefined,
                    y: undefined,
                    y2: undefined
                };
                var lines = ko.toJS(_this.lines);
                if (triggerY1MinSignal) {
                    var axisY = _.findWhere(lines, { axis: "y1" });
                    if (axisY !== undefined)
                        value.y = Number(ko.unwrap(axisY.minAxis));
                }
                else if (_this.chartAxes()
                    .y1()
                    .minValue()) {
                    value.y = Number(_this.chartAxes()
                        .y1()
                        .minValue());
                }
                if (triggerY2MinSignal) {
                    var axisY2 = _.findWhere(lines, { axis: "y2" });
                    if (axisY2 !== undefined)
                        value.y2 = Number(ko.unwrap(axisY2.minAxis));
                }
                else if (_this.chartAxes()
                    .y2()
                    .minValue()) {
                    value.y2 = Number(_this.chartAxes()
                        .y2()
                        .minValue());
                }
                return value;
            });
            this.axisConfig = ko.pureComputed(function () {
                var config = {
                    y: {
                        show: _this.chartAxes()
                            .y1()
                            .visible(),
                        label: {
                            position: "outer-middle"
                            // inner-top : default
                            // inner-middle
                            // inner-bottom
                            // outer-top
                            // outer-middle
                            // outer-bottom
                        },
                        inner: _this.chartAxes()
                            .y1()
                            .isDisplayedInner(),
                        max: _this.maxValueForAxises().y,
                        min: _this.minValueForAxises().y,
                        tick: {
                            count: _this.chartAxes()
                                .y1()
                                .tickCount(),
                            format: _this.chartAxes()
                                .y1()
                                .tickFormat() || d3.format(".1f")
                        },
                        padding: _this.removePaddingForY() ? { top: 0, bottom: 0 } : null
                    },
                    y2: {
                        label: {
                            position: "outer-middle"
                            // inner-top : default
                            // inner-middle
                            // inner-bottom
                            // outer-top
                            // outer-middle
                            // outer-bottom
                        },
                        inner: _this.chartAxes()
                            .y2()
                            .isDisplayedInner(),
                        max: _this.maxValueForAxises().y2,
                        min: _this.minValueForAxises().y2,
                        tick: {
                            count: _this.chartAxes()
                                .y2()
                                .tickCount(),
                            format: _this.chartAxes()
                                .y2()
                                .tickFormat() || d3.format(".1f")
                        },
                        padding: _this.removePaddingForY2() ? { top: 0, bottom: 0 } : null
                    },
                    x: {
                        show: _this.chartAxes()
                            .x()
                            .visible(),
                        label: {
                            position: "outer-center"
                            // inner-right : default
                            // inner-center
                            // inner-left
                            // outer-right
                            // outer-center
                            // outer-left
                        },
                        type: ko.unwrap(_this.settings.x1AxisType) || "timeseries",
                        tick: {
                            format: _this.chartAxes()
                                .x()
                                .tickFormat() || "%H:%M:%S %d.%m.%Y",
                            fit: ko.unwrap(_this.settings.x1AxisTickFit) !== undefined ? ko.unwrap(_this.settings.x1AxisTickFit) : false,
                            count: _this.chartAxes()
                                .x()
                                .tickCount()
                        }
                    }
                };
                return config;
            });
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.maxResults = ko.observable(ko.unwrap(this.settings.maxResults) ? ko.unwrap(this.settings.maxResults) : 500);
            this.maxSignalCount = ko.observable(ko.unwrap(this.settings.maxSignalCount) ? ko.unwrap(this.settings.maxSignalCount) : 50);
            this.title = ko.observable((ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "CCW Chart").stringPlaceholderResolver(this.objectID));
            this.axisesColor = ko.pureComputed(function () {
                var self = _this;
                var colors = {};
                _.each(self.lines(), function (line, index) {
                    colors[self.getChartLineName(line, index)] = ko.unwrap(line.color);
                });
                return colors;
            });
            this.sizeConfig = ko.observable({
                height: this.chartHeight(),
                width: this.chartWidth()
            });
            this.gridConfig = ko.observable({
                x: {
                    show: this.chartAxes()
                        .x()
                        .isGridVisible()
                },
                y: {
                    show: this.chartAxes()
                        .y1()
                        .isGridVisible()
                }
            });
            var self = this;
            this.activeSubchart(ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : false);
            this.subChartConfig = ko.observable({
                show: this.activeSubchart(),
                size: {
                    height: ko.unwrap(this.settings.subChartHeight) || 50
                },
                onbrush: function (domain) {
                    self.onSubchartZoomChanged(this, domain);
                }
            });
            this.legendConfig = ko.observable({
                show: ko.unwrap(this.settings.legendVisible) !== undefined ? ko.unwrap(this.settings.legendVisible) : true,
                position: ko.unwrap(this.settings.legendPosition) || "bottom"
                // item: {  //wenn es aktiviert werdem soll, dann im Header-Bereich das item mit definieren
                //   onclick: (id) => {
                //     return this.onclickLegend(id);
                //   }
                // }
            });
            this.transitionDuration = ko.observable(0);
            this.pointsConfig = ko.observable({
                show: ko.unwrap(this.settings.pointsVisible) !== undefined ? ko.unwrap(this.settings.pointsVisible) : false,
                r: ko.unwrap(this.settings.pointsRadius) || 2.0
            });
            this.zoomConfig = ko.observable({
                enabled: ko.unwrap(this.settings.zoomEnabled) !== undefined ? ko.unwrap(this.settings.zoomEnabled) : false,
                rescale: ko.unwrap(this.settings.zoomRescale) !== undefined ? ko.unwrap(this.settings.zoomRescale) : true
            });
            this.tooltip = ko.observable({
                show: ko.unwrap(this.settings.tooltipVisibility) !== undefined ? ko.unwrap(this.settings.tooltipVisibility) : true,
                contents: function (chartthis, d, defaultTitleFormat, defaultValueFormat, color) {
                    return _this.getTooltipContents(chartthis, d, defaultTitleFormat, defaultValueFormat, color);
                },
                // position : undefined
                position: function (data, width, height, element) {
                    return _this.getTooltipPosition(data, width, height, element);
                }
                // position: this.getTooltipPosition(data, width, height, element)
                // position: function (data, width, height, element) {
                //   var top = d3.mouse(element)[1] + 15;
                //   console.log(top);
                //   top = 0;
                //   var left = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width'));
                //   console.log(left);
                //   left = 10;
                //   return { top: top, left: 90 };
                // }
            });
            this.pollTimer = null;
            this.isAutoUpdating = ko.observable(false);
            this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
            this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);
            this.isRealTimeUpdating = ko.pureComputed(function () {
                return _this.autoUpdate() && !_this.isAutoUpdating();
            }, this);
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset) : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall)
                ? ko.unwrap(this.settings.startOffsetIntervall)
                : 30;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset) : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall)
                ? ko.unwrap(this.settings.endOffsetIntervall)
                : 0;
            this.startDate = ko.observable(moment()
                .subtract(this.startOffsetIntervall, this.startOffset)
                .toDate());
            this.endDate = ko.observable(moment().toDate());
            this.startDateInput = ko.observable(this.startDate());
            this.endDateInput = ko.observable(this.endDate());
            this.maxResultsInput = ko.observable(this.maxResults());
            this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
            this.selectedRangeInput = ko.observable(this.selectedRange());
            this.timeRangeDateInput = ko.observable();
            this.getLatestLogdata =
                this.settings.getLatestLogdata != undefined ? ko.unwrap(this.settings.getLatestLogdata) : true;
            this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);
            this.timeAxisFormat = ko.observable(ko.unwrap(this.settings.x1AxisTickFormat) || "%H:%M:%S %d.%m.%Y");
            this.values = ko.observableArray();
            this.timeStamps = ko.observableArray();
            this.axes = ko.pureComputed(function () {
                var self = _this;
                var axes = {};
                _.each(self.lines(), function (line, index) {
                    axes[_this.getChartLineName(line, index)] = line.axis() && line.axis().toLowerCase() === "y2" ? "y2" : "y";
                });
                return axes;
            }, this);
            this.yAxisStyles = ko.pureComputed(function () {
                var y1AxisStyles = "#wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y line, #wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y path { stroke: " +
                    _this.chartAxes()
                        .y1()
                        .color() +
                    "} #wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y text { fill: " +
                    _this.chartAxes()
                        .y1()
                        .color() +
                    "}";
                var y2AxisStyles = "#wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y2 line, #wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y2 path { stroke: " +
                    _this.chartAxes()
                        .y2()
                        .color() +
                    "} #wf-chart-" +
                    ko.unwrap(_this.id) +
                    " .c3 .c3-axis.c3-axis-y2 text { fill: " +
                    _this.chartAxes()
                        .y2()
                        .color() +
                    "}";
                return y1AxisStyles + " " + y2AxisStyles;
            }, this);
            this.data = ko.observableArray([]);
            this.hasData = ko.pureComputed(function () {
                // console.log("ccwChart hasData");
                // console.log(this.data() && this.timeStamps && this.timeStamps().length > 1);
                return _this.data() && _this.timeStamps && _this.timeStamps().length > 1;
            });
            this.firstDisplayedDate = ko.pureComputed(function () {
                return _this.hasData() ? _this.timeStamps()[1] : _this.startDate();
            });
            this.lastDisplayedDate = ko.pureComputed(function () {
                return _this.hasData() ? _.last(_this.timeStamps()) : _this.endDate();
            });
            this.hasMorePoints = ko.observable(false);
            this.legendNames = ko.computed(function () {
                var self = _this;
                var names = {};
                _.each(self.lines(), function (line, index) {
                    names[self.getChartLineName(line, index)] = line.legendText();
                });
                return names;
            });
            this.lineTypes = ko.computed(function () {
                var self = _this;
                var types = {};
                _.each(self.lines(), function (line, index) {
                    types[self.getChartLineName(line, index)] = line.type();
                });
                return types;
            }, this);
            this.minValue = ko.computed(function () {
                var min = _.min(ko.unwrap(_this.values));
                return _.isFinite(min) ? min : "-";
            });
            //Parameter "hide" lesen und in Array packen. Linie werden bei Init versteckt dargestellt. amueller 30.06.2020
            // this.getHideConfig = ko.computed(() => {
            //   var self = this;
            //   var hideConfig = [];
            //   _.each(self.lines(), (line, index) => {
            //     if ((line.hide() == true)) {
            //       hideConfig.push(self.getChartLineName(line, index));
            //     }
            //   });
            //   console.log("GetHideConfig()");
            //   console.log(hideConfig);
            //   // console.log(self.lines());
            //   return hideConfig;
            // }, this);
            this.c3Chart = ko.observable(this.getC3ChartObject());
            this.minValueTimestamp = ko.computed(function () {
                var timeStampIndex = _.indexOf(ko.unwrap(_this.values), ko.unwrap(_this.minValue));
                var timeStamp = _this.timeStamps()[timeStampIndex];
                return timeStamp;
            });
            this.maxValue = ko.computed(function () {
                var max = _.max(ko.unwrap(_this.values));
                return _.isFinite(max) ? max : "-";
            });
            this.maxValueTimestamp = ko.computed(function () {
                var timeStampIndex = _.indexOf(ko.unwrap(_this.values), ko.unwrap(_this.maxValue));
                var timeStamp = _this.timeStamps()[timeStampIndex];
                return timeStamp;
            });
            this.averageValue = ko.computed(function () {
                var sum = 0;
                if (_this.values().length === 0) {
                    return "";
                }
                ko.utils.arrayForEach(_this.values(), function (item) {
                    if (!isNaN(item)) {
                        sum += parseFloat(item);
                    }
                });
                return sum / _this.values().length;
            });
            //this.lines.subscribe(this.refreshChartData(), this);
            this.selectedLines = ko.observableArray([]);
            this.isSignalLoading = ko.observable(false);
            this.isLoading = ko.observable(true);
            this.showHistoryManage = ko.computed(function () {
                return !_this.autoUpdate() || _this.isAutoUpdating();
            });
            //this.monitorIsTabVisible();//Workaround:A bag in c3 chart. Memory leak, when tab is inactive
            this.btnZoomZurueckEnable = ko.observable(false);
            this.btnZoomZurueckBackgColor = ko.observable("btn btn-default");
            this.overlayDivLeft = ko.observable('0px');
            this.overlayDivWidth = ko.observable('0px');
            this.overlayDivHeight = ko.observable((ko.unwrap(this.chartHeight()) - 60) + 'px'); //60px ist die Fläche für die X-Achse
            this.overlayDivTop = ko.observable('15px');
            this.onMouseOverLeft = 0;
            this.overlayDivClientX1 = ko.observable(0);
            this.overlayDivClientX2 = ko.observable(0);
            this.overlayDivShow = ko.observable(false);
            this.zoomZurueckArrayLen = ko.observable(0);
            this.startDateOld = new Date();
            this.endDateOld = new Date();
            //this.c3Chart = ko.observable(this.getC3ChartObject());
        };
        WfChart1Component.prototype.monitorIsTabVisible = function () {
            var _this = this;
            // Set the name of the hidden property and the change event for visibility
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                // Opera 12.10 and Firefox 18 and later support
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }
            else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            }
            else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
            }
            else {
                // Handle page visibility change
                document.addEventListener(visibilityChange, function () {
                    if (!_this.autoUpdate())
                        return;
                    if (document[hidden])
                        _this.isAutoUpdating(true);
                    // must stopp chart
                    else
                        _this.isAutoUpdating(false); // must run chart
                    _this.handleAutoUpdate();
                });
            }
        };
        WfChart1Component.prototype.toggleIsAutoUpdating = function () {
            this.isAutoUpdating(!this.isAutoUpdating());
            this.handleAutoUpdate();
        };
        WfChart1Component.prototype.triggerRefreshChartData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            this.zoomZurueckArray = []; //lösche Array
                            this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
                            this.btnZoomZurueckEnable(false);
                            this.btnZoomZurueckBackgColor("btn btn-default");
                            // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
                            if (ko.unwrap(this.getLatestLogdata) === true) {
                                this.startDate(moment()
                                    .subtract(this.startOffsetIntervall, this.startOffset)
                                    .toDate());
                                this.startDateInput(this.startDate());
                                this.selectedRangeInput(CalendarTimeRanges.Custom);
                                this.timeRangeDateInput(this.startDate());
                                this.endDate(moment()
                                    .add(this.endOffsetIntervall, this.endOffset)
                                    .toDate());
                                this.endDateInput(this.endDate());
                            }
                            console.log("Trigger Refresh Data");
                            return [4 /*yield*/, this.getSignalInformations()];
                        case 1:
                            _a.sent();
                            this.refreshChartData();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.refreshChartData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getLogValues()];
                        case 1:
                            _a.sent();
                            this.handleAutoUpdate();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.handleAutoUpdate = function () {
            var _this = this;
            if (this.autoUpdate() && !this.isAutoUpdating()) {
                this.startDate(moment()
                    .subtract(this.startOffsetIntervall, this.startOffset)
                    .toDate());
                this.endDate(moment()
                    .add(this.endOffsetIntervall, this.endOffset)
                    .toDate());
                if (this.pollTimer) {
                    clearTimeout(this.pollTimer);
                }
                this.pollTimer = setTimeout(function () {
                    _this.refreshChartData();
                }, this.updateRate);
            }
        };
        WfChart1Component.prototype.getSignalInformations = function (updateLegendText) {
            if (updateLegendText === void 0) { updateLegendText = undefined; }
            return __awaiter(this, void 0, void 0, function () {
                var aliases, logTags, _a, _b, line, definitions, _loop_1, this_1, _c, _d, line, error_1;
                var e_1, _e, e_2, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            aliases = [];
                            logTags = [];
                            try {
                                for (_a = __values(this.lines()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    line = _b.value;
                                    if (!line.logId || !line.unit() || updateLegendText) {
                                        aliases.push(line.signalName());
                                        logTags.push(line.logTagName());
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.connector.getSignalDefinitions(aliases)];
                        case 2:
                            definitions = _g.sent();
                            _loop_1 = function (line) {
                                var definition = _.find(definitions, function (def) {
                                    return line.signalName() === def.AliasName;
                                });
                                if (!definition)
                                    return "continue";
                                line.signalId = definition.ID;
                                if (line.staticLegendText() != null) {
                                    line.legendText(line.staticLegendText());
                                }
                                else {
                                    line.legendText(this_1.getLegendText(definition, line));
                                }
                                line.maxAxis(definition.Maximum);
                                line.minAxis(definition.Minimum);
                                if (line.staticUnitText() != null) {
                                    line.unit(line.staticUnitText());
                                }
                                else {
                                    line.unit(definition.Unit);
                                }
                                var definitionLog = _.find(definition.Logs, function (log) {
                                    return log.LogTag === line.logTagName();
                                });
                                line.logId = definitionLog ? definitionLog.ID : "";
                                line.logTag = definitionLog ? definitionLog.LogTag : "";
                            };
                            this_1 = this;
                            try {
                                for (_c = __values(this.lines()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    line = _d.value;
                                    _loop_1(line);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _g.sent();
                            this.connector.handleError(WfChart1Component)(error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            // this.isLoading(false);
                            console.log("finally");
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.getLogValues = function () {
            return __awaiter(this, void 0, void 0, function () {
                var logIds, _a, _b, line, maxResults, filter, urlMinMaxAvg, minMaxAvgObj, error1_1, url, logValuesObj, logValues, _c, _d, line, tmpTimeStamps, values, values_1, values_1_1, row, i_1, logValueDto, signalNameFromLine, myv, i, error_2, error1_2;
                var e_3, _e, e_4, _f, e_5, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            logIds = [];
                            try {
                                for (_a = __values(this.lines()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    line = _b.value;
                                    if (line && line.logId) {
                                        logIds.push(line.logId);
                                        // console.log(line.logId);
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            // console.log("myLines");
                            // console.log(this.lines());
                            // console.log(logIds);
                            if (logIds.length <= 0) {
                                // alert("Das Chart hat keine gültigen Log-Signalnamen!");
                                toastr.error("Das Chart hat keine gültigen Log-Signalnamen!");
                            }
                            maxResults = Number(this.maxResults()) + 1;
                            filter = new ccwLogValuesFilter(logIds, moment(ko.unwrap(this.startDate)), moment(ko.unwrap(this.endDate)), maxResults, ko.unwrap(this.sortOrder), ko.unwrap(this.dbName), ko.unwrap(this.isI4Scada));
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 3, , 4]);
                            urlMinMaxAvg = "/WsGetChart/WsLogValue.svc/js/ccwGetMinMaxAvg";
                            return [4 /*yield*/, HttpService.post(urlMinMaxAvg, filter)];
                        case 2:
                            minMaxAvgObj = _h.sent();
                            this.minMaxAvgValues = minMaxAvgObj.ccwGetMinMaxAvgResult.Values;
                            return [3 /*break*/, 4];
                        case 3:
                            error1_1 = _h.sent();
                            this.connector.handleError(WfChart1Component)(error1_1);
                            return [3 /*break*/, 4];
                        case 4:
                            _h.trys.push([4, 13, , 14]);
                            url = "/WsGetChart/WsLogValue.svc/js/ccwGetLogValues";
                            // var url = `/WsGetChart/WsRezept.svc/js/Eugen`;
                            if (this.logsAlsDurchschnittswerte) {
                                url = "/WsGetChart/WsLogValue.svc/js/ccwGetLogValuesAverage"; //Durchschnittswerte liefern
                            }
                            return [4 /*yield*/, HttpService.post(url, filter)];
                        case 5:
                            logValuesObj = _h.sent();
                            logValues = logValuesObj.ccwGetLogValuesResult.Values;
                            try {
                                // console.log(logValues);
                                for (_c = __values(this.lines()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    line = _d.value;
                                    line.values = ko.observableArray([]);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            tmpTimeStamps = [];
                            values = logValues;
                            // this.hasMorePoints(logValues.length > this.maxResults());
                            if (values.length <= 0)
                                toastr.info("Keine Chart-Daten vorhanden!");
                            try {
                                for (values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                                    row = values_1_1.value;
                                    tmpTimeStamps.push(new Date(row.EntriesDate));
                                    // die einzelnen Reihen abfragen
                                    for (i_1 = 0; i_1 < row.Values.length; i_1++) {
                                        // wenn der Parameter "Signal-Faktor" angegeben wird, dann muss der Anzeigewert auf der Kurve neu berechnet werden
                                        if ((this.lines()[i_1].signalFactor() != null) && (row.Values[i_1] != null)) {
                                            row.Values[i_1] = row.Values[i_1] * ko.unwrap(this.lines()[i_1].signalFactor());
                                        }
                                        logValueDto = row.Values[i_1] != null ? row.Values[i_1] : null;
                                        if (row.Values[i_1] != null) {
                                            // wenn in der Datenbank kein Wert gefunden wurde, wird die Zahl 1234567.89 übertragen. Dann den aktuellen Wert (Connector) anzeigen
                                            if (Number(logValueDto) == 1234567.89) {
                                                signalNameFromLine = this.lines()[i_1].signalName();
                                                console.log("Wert von Index [" + i_1 + "] ist 1234567.89 und der SignalName ist " + signalNameFromLine);
                                                // console.log(signalNameFromLine);
                                                // console.log(typeof signalNameFromLine);
                                                logValueDto = this.connector.getSignal(signalNameFromLine).value();
                                                myv = logValueDto;
                                                // console.log(myv);
                                            }
                                        }
                                        this.lines()[i_1].values.push(logValueDto);
                                    }
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (values_1_1 && !values_1_1.done && (_g = values_1.return)) _g.call(values_1);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                            if (!this.showIsStaticColumn) return [3 /*break*/, 11];
                            for (i = 0; i < this.lines().length; i++) {
                                if (ko.unwrap(!this.lines()[i].isStatic)) {
                                    this.lines()[i].values.unshift(null);
                                    this.lines()[i].values.push(null);
                                }
                            }
                            _h.label = 6;
                        case 6:
                            _h.trys.push([6, 8, 9, 10]);
                            return [4 /*yield*/, this.setStaticValues(this.lines(), ko.unwrap(this.startDate))];
                        case 7:
                            _h.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_2 = _h.sent();
                            this.connector.handleError(WfChart1Component)(error_2);
                            return [3 /*break*/, 10];
                        case 9:
                            this.updateChartTimestamps(tmpTimeStamps);
                            return [7 /*endfinally*/];
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            this.updateChartTimestamps(tmpTimeStamps);
                            _h.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            error1_2 = _h.sent();
                            this.connector.handleError(WfChart1Component)(error1_2);
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.updateChartTimestamps = function (tmpTimeStamps) {
            if (this.showIsStaticColumn) {
                tmpTimeStamps.push(ko.unwrap(this.startDate));
                tmpTimeStamps.unshift(ko.unwrap(this.endDate));
            }
            this.timeStamps(tmpTimeStamps);
            this.timeAxisFormat(this.getTimeAxisFormat(this.timeStamps()));
            this.updateChartData();
        };
        WfChart1Component.prototype.setStaticValues = function (lines, firstDate) {
            return __awaiter(this, void 0, void 0, function () {
                var staticLines, filter, data, i, line, firstValue, lastValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            staticLines = lines.filter(function (line) {
                                return line.isStatic();
                            });
                            if (!_.any(staticLines))
                                return [2 /*return*/];
                            filter = staticLines.map(function (line) {
                                return {
                                    SignalID: line.signalId,
                                    LogTag: line.logTag
                                };
                            });
                            return [4 /*yield*/, this.connector.getLastValuesBeforeDate(filter, moment(firstDate))];
                        case 1:
                            data = _a.sent();
                            for (i = 0; i < staticLines.length; i++) {
                                line = staticLines[i];
                                firstValue = data[i].Values[0].Value ? data[i].Values[0].Value : data[i].Values[0].Value2;
                                line.values.push(firstValue);
                                lastValue = _.find(line.values(), function (num) {
                                    return num !== null;
                                });
                                line.values.unshift(lastValue);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.updateChartData = function () {
            var _this = this;
            var self = this;
            // Add the X-Axis identifier as first item in timestamp array if it's hasn't been added already
            if (this.timeStamps()[0] !== "x") {
                this.timeStamps.unshift("x");
            }
            var newData = [];
            newData.push(this.timeStamps());
            var ccwMinMaxAvgValue = this.minMaxAvgValues; //Variable zuweisen
            _.each(this.lines(), function (line, index) {
                var values = [self.getChartLineName(line, index)].concat(line.values());
                newData.push(values);
                var ccwMinMaxAvgIndexValues = ccwMinMaxAvgValue.length > 0 ? ccwMinMaxAvgValue[index] : null;
                _this.updateLineValueDependencies(line, ccwMinMaxAvgIndexValues); //Übergabe jetzt mit Array von den MIN-MAX-AVG-Werten
            });
            this.data(newData);
            this.refreshChartObject();
        };
        WfChart1Component.prototype.getFormatedDateString = function (date, timeFormat) {
            var formatedTimeFormat = d3.time.format(timeFormat);
            return formatedTimeFormat(moment(date).toDate());
        };
        WfChart1Component.prototype.getFormatedValue = function (value, unit) {
            var displayValue = isNaN(value) || value === null ? "-" : parseFloat(value);
            return displayValue === "-" ? "-- " + unit : window.numeral(displayValue).format(this.format) + " " + unit;
        };
        WfChart1Component.prototype.addTooltipRowInformation = function (point, tooltipName, item, nameFormat, valueFormat, backgroundColor, leftPadding, showColorIndicator, showValue) {
            var colorIndicator = "<span style='background-color:" + backgroundColor + "'> </span>";
            var rowText = "<tr class='" + tooltipName + "-" + point.id + "'>";
            rowText +=
                "<td class='name' style='padding-left:" +
                    leftPadding +
                    "px'>" +
                    (showColorIndicator ? colorIndicator : "") +
                    nameFormat(item.name) +
                    "</td>";
            rowText += "<td class='value'>" + item.value + "</td>";
            rowText += "</tr>";
            return rowText;
        };
        WfChart1Component.prototype.getTimeAxisFormat = function (timestamps) {
            // if Auto then adjust axis accordingly
            var value = "%H:%M:%S %d.%m.%Y";
            var minSeriesDate = _.first(timestamps);
            var startDate = moment(minSeriesDate || new Date());
            var maxSeriesDate = _.last(timestamps);
            var endDate = moment(maxSeriesDate || new Date());
            // HEY, HEY, HEY!!! Magic numbers ahead!! Do not change them,
            // unless your're realy sure of the consequences!!
            if (endDate.diff(startDate, "years", true) >= 4.85) {
                value = "%Y";
            }
            else if (endDate.diff(startDate, "months", true) >= 4.8) {
                value = "%m.%Y";
            }
            else if (endDate.diff(startDate, "days") >= 6) {
                value = "%d.%m.%Y";
            }
            else if (endDate.diff(startDate, "days") >= 2) {
                value = "%H:%M:%S %d.%m.%Y";
            }
            return value;
        };
        WfChart1Component.prototype.updateLineValueDependencies = function (line, ccwMinMaxAvgValue) {
            var min;
            var max;
            var lastValue;
            var sum = 0;
            var minTimestamp;
            var maxTimestamp;
            var lastValueTimestamp;
            var avr;
            var avr2;
            var values = line.values() || [];
            var timestamps = this.timeStamps() || [];
            //therefore first value in values array sometimes is null
            var index = 0;
            for (var i = 0; i < values.length; i++)
                if (values[i] !== undefined && values[i] !== null) {
                    index = i;
                    break;
                }
            min = max = values[i];
            lastValue = values.length > 0 ? values[values.length - 1] : null;
            minTimestamp = maxTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
            lastValueTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
            // Falls ein ungültiges Ergebnis vorhanden/empfangen ist, dann die alte Auswertung nehmen
            if (ccwMinMaxAvgValue == null) {
                _.each(values, function (value, index) {
                    if (value && value > max) {
                        max = value;
                        maxTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
                    }
                    if (value && value < min) {
                        min = value;
                        minTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
                    }
                    if (value)
                        sum += value;
                    avr = values.length > 0 ? sum / values.length : min;
                });
            }
            else {
                if ((ccwMinMaxAvgValue.Min != undefined) && (ccwMinMaxAvgValue.Min != null)) {
                    min = ccwMinMaxAvgValue.Min.Value;
                }
                if ((ccwMinMaxAvgValue.Min != undefined) && (ccwMinMaxAvgValue.Min != null)) {
                    minTimestamp = ccwMinMaxAvgValue.Min.Date;
                }
                if ((ccwMinMaxAvgValue.Max != undefined) && (ccwMinMaxAvgValue.Max != null)) {
                    max = ccwMinMaxAvgValue.Max.Value;
                }
                if ((ccwMinMaxAvgValue.Max != undefined) && (ccwMinMaxAvgValue.Max.Date != null)) {
                    maxTimestamp = ccwMinMaxAvgValue.Max.Date;
                }
                if ((ccwMinMaxAvgValue.Avg != undefined) && (ccwMinMaxAvgValue.Avg != null)) {
                    avr2 = ccwMinMaxAvgValue.Avg;
                }
                else {
                    avr2 = lastValue;
                }
                avr = values.length > 0 ? avr2 : min;
            }
            line.minimum(min);
            line.maximum(max);
            line.minimumTimestamp(minTimestamp);
            line.maximumTimestamp(maxTimestamp);
            line.average(avr);
            line.lastValue(lastValue);
            line.lastValueTimestamp(lastValueTimestamp);
        };
        WfChart1Component.prototype.getLineWithPropertiesOrDefault = function (line, objectID) {
            var result = this.cloneChartLine(line);
            result.values = ko.observableArray(ko.unwrap(line.values) || []);
            result.unit = ko.observable(ko.unwrap(line.unit) || "-");
            result.signalName = ko.observable((ko.unwrap(line.signalName) || "").stringPlaceholderResolver(objectID));
            result.logTagName = ko.observable((ko.unwrap(line.logTagName) || "").stringPlaceholderResolver(objectID));
            result.axis = ko.observable(line.axis && ko.unwrap(line.axis) && ko.unwrap(line.axis).toLowerCase() === "y2" ? "y2" : "y1");
            result.color = ko.observable(line.color ? ko.unwrap(line.color) : "#880000");
            result.type = ko.observable(ko.unwrap(line.type) || this.chartType()); //line, step, spline, bar, area, area-spline
            result.isStatic = ko.observable(ko.unwrap(line.isStatic) || false);
            result.logId = line.logId || "";
            result.legendText = ko.observable(ko.unwrap(line.legendText) || "");
            result.maxAxis = ko.observable(ko.unwrap(line.maxAxis) || null);
            result.minAxis = ko.observable(ko.unwrap(line.minAxis) || null);
            result.staticUnitText = ko.observable(ko.unwrap(line.staticUnitText) || null);
            result.staticLegendText = ko.observable(ko.unwrap(line.staticLegendText) || null);
            result.signalFactor = ko.observable(ko.unwrap(line.signalFactor) || null);
            result.hide = ko.observable(ko.unwrap(line.hide) || null);
            return result;
        };
        WfChart1Component.prototype.getLegendText = function (definition, line) {
            var isStaticText = this.showIsStaticColumn && line.isStatic ? "(" + this.connector.translate("I4SCADA_is_Static")() + ")" : "";
            if (this.legendText === "DescriptionSymbolicText")
                return (this.connector.translate(definition[this.legendText])() || definition.AliasName) + " " + isStaticText;
            //Simple property of SignalDefinitionDTO
            if (this.legendText.indexOf(".") === -1)
                return (definition[this.legendText] || definition.AliasName) + " " + isStaticText;
            var options = this.legendText.split(".");
            var object = definition[options[0]];
            if (!object)
                return definition.AliasName + " " + isStaticText;
            if (_.isArray(object)) {
                //Logs, Array property of SignalDefinitionDTO
                if (options[0] !== "Logs")
                    return "" + " " + isStaticText;
                var length_1 = object.length;
                for (var j = 0; j < length_1; j++ //search by logtagname. For situation when signalnames are equal, but logtagnames are different
                )
                    if (object[j]["LogTag"] === line.logTagName)
                        return (object[j][options[1]] || definition.AliasName) + " " + isStaticText;
            }
            return (object = (object[options[1]] || definition.AliasName) + " " + isStaticText); //DTO property of SignalDefinitionDTO
        };
        //#region methods of dialogs
        WfChart1Component.prototype.showSettings = function () {
            this.showDialog(true);
            this.timeRangeDateInput(this.startDate());
            this.selectedRangeInput(this.selectedRange());
            this.startDateInput(this.startDate());
            this.endDateInput(this.endDate());
            this.maxResultsInput(this.maxResults());
            this.x1AxisLabelInput(this.chartAxes()
                .x()
                .label());
            this.y1AxisLabelInput(this.chartAxes()
                .y1()
                .label());
            this.y1AxisMinValueInput(this.chartAxes()
                .y1()
                .minValue());
            this.y1AxisMaxValueInput(this.chartAxes()
                .y1()
                .maxValue());
            this.y1AxisMinIsSignalDependentInput(this.chartAxes()
                .y1()
                .isMinSignalDependent());
            this.y1AxisMaxIsSignalDependentInput(this.chartAxes()
                .y1()
                .isMaxSignalDependent());
            this.y2AxisLabelInput(this.chartAxes()
                .y2()
                .label());
            this.y2AxisMinValueInput(this.chartAxes()
                .y2()
                .minValue());
            this.y2AxisMaxValueInput(this.chartAxes()
                .y2()
                .maxValue());
            this.y2AxisMinIsSignalDependentInput(this.chartAxes()
                .y2()
                .isMinSignalDependent());
            this.y2AxisMaxIsSignalDependentInput(this.chartAxes()
                .y2()
                .isMaxSignalDependent());
        };
        WfChart1Component.prototype.applyFilterSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("begining :" + new Date().getTime());
                            this.isLoading(true);
                            this.closeSettings();
                            this.zoomZurueckArray = []; //lösche Array
                            this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
                            this.btnZoomZurueckEnable(false);
                            this.btnZoomZurueckBackgColor("btn btn-default");
                            console.log("closeSettings :" + new Date().getTime());
                            this.selectedRange(this.selectedRangeInput());
                            this.applySettingsInner(this.startDateInput(), this.endDateInput(), this.maxResultsInput());
                            console.log("applySettingsInner :" + new Date().getTime());
                            this.chartAxes()
                                .x()
                                .label(this.x1AxisLabelInput());
                            this.chartAxes()
                                .y1()
                                .label(this.y1AxisLabelInput());
                            this.chartAxes()
                                .y1()
                                .minValue(this.y1AxisMinValueInput());
                            this.chartAxes()
                                .y1()
                                .maxValue(this.y1AxisMaxValueInput());
                            this.chartAxes()
                                .y1()
                                .isMinSignalDependent(this.y1AxisMinIsSignalDependentInput());
                            this.chartAxes()
                                .y1()
                                .isMaxSignalDependent(this.y1AxisMaxIsSignalDependentInput());
                            this.chartAxes()
                                .y2()
                                .label(this.y2AxisLabelInput());
                            this.chartAxes()
                                .y2()
                                .minValue(this.y2AxisMinValueInput());
                            this.chartAxes()
                                .y2()
                                .maxValue(this.y2AxisMaxValueInput());
                            this.chartAxes()
                                .y2()
                                .isMinSignalDependent(this.y2AxisMinIsSignalDependentInput());
                            this.chartAxes()
                                .y2()
                                .isMaxSignalDependent(this.y2AxisMaxIsSignalDependentInput());
                            console.log("axes :" + new Date().getTime());
                            return [4 /*yield*/, this.getSignalInformations()];
                        case 1:
                            _a.sent();
                            console.log("getSignalInformations :" + new Date().getTime());
                            return [4 /*yield*/, this.getLogValues()];
                        case 2:
                            _a.sent();
                            console.log("getLogValues :" + new Date().getTime());
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.applySettingsInner = function (startDate, endDate, maxResult) {
            this.startDate(startDate);
            this.endDate(endDate);
            this.maxResults(maxResult);
            var diff = moment(this.endDate()).diff(this.startDate()) / 1000; //Diiferenz in Sekunden
            // console.log("SettingsChart");
            // console.log(diff);
            // .subtract(this.startOffsetIntervall, this.startOffset).subtract(this.endOffsetIntervall, this.endOffset).toDate()
            var startOff = "minutes";
            // if (diff > 43200){ //Über 12 Stunden
            //     startOff = "days";
            // }
            var startOffInt = 1;
            if (diff > 60) {
                startOffInt = diff / 60 + 1;
            }
            this.startOffsetIntervall = startOffInt;
            this.startOffset = startOff;
        };
        WfChart1Component.prototype.applyAxesSettingsFromConfiguration = function (content) {
            this.applyAxeSettingsFromConfiguration(content.axes.x, this.chartAxes().x());
            this.applyAxeSettingsFromConfiguration(content.axes.y1, this.chartAxes().y1());
            this.applyAxeSettingsFromConfiguration(content.axes.y2, this.chartAxes().y2());
        };
        WfChart1Component.prototype.applyAxeSettingsFromConfiguration = function (content, axe) {
            if (!content || !axe)
                return;
            axe.maxValue(content.maxValue);
            axe.isMaxSignalDependent(content.isMaxSignalDependent);
            axe.minValue(content.minValue);
            axe.isMinSignalDependent(content.isMinSignalDependent);
            axe.label(content.label);
            axe.color(content.color);
            axe.visible(content.visible);
            axe.isDisplayedInner(content.isDisplayedInner);
            axe.tickCount(content.tickCount);
            axe.tickFormat(content.tickFormat);
            axe.isGridVisible(content.isGridVisible);
        };
        WfChart1Component.prototype.closeSettings = function () {
            this.showDialog(false);
        };
        WfChart1Component.prototype.showSignalsSettings = function () {
            var _this = this;
            this.showSignalsDialog(true);
            this.selectedLines(_.map(this.lines(), function (line) { return _this.cloneChartLine(line); }));
        };
        WfChart1Component.prototype.applySignalsSettings = function () {
            this.closeSignalSettings();
            return this.applySignalsSettingsInner(this.selectedLines());
        };
        WfChart1Component.prototype.applySignalsSettingsInner = function (lines) {
            return __awaiter(this, void 0, void 0, function () {
                var tempLines, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tempLines = [];
                            if (lines.length > 0) {
                                for (i = 0; i < lines.length; i++)
                                    if (ko.unwrap(lines[i].signalName) && ko.unwrap(lines[i].logTagName))
                                        tempLines.push(this.getLineWithPropertiesOrDefault(lines[i], this.objectID));
                            }
                            if (tempLines.length === 0)
                                this.timeStamps([]); //have to nothing show
                            if (this.autoUpdate()) {
                                if (tempLines.length === 0)
                                    this.isAutoUpdating(true);
                                else
                                    this.isAutoUpdating(false);
                            }
                            this.setLines(tempLines);
                            return [4 /*yield*/, this.getSignalInformations()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.refreshChartData()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.setLines = function (lines) {
            this.lines(lines);
            this.refreshChartObject();
        };
        WfChart1Component.prototype.closeSignalSettings = function () {
            this.showSignalsDialog(false);
        };
        //#endregion
        WfChart1Component.prototype.getConfig = function () {
            var _this = this;
            var content = {
                lines: _.map(this.lines(), function (line) { return _this.createChartLineForConfiguration(line); }),
                startDate: moment(this.startDate()).toMSDate(),
                endDate: moment(this.endDate()).toMSDate(),
                maxResults: this.maxResults(),
                autoUpdate: this.autoUpdate(),
                axes: {
                    x: this.getAxisConfiguration(this.chartAxes().x()),
                    y1: this.getAxisConfiguration(this.chartAxes().y1()),
                    y2: this.getAxisConfiguration(this.chartAxes().y2())
                },
                title: this.title()
            };
            return content;
        };
        WfChart1Component.prototype.getAxisConfiguration = function (axe) {
            if (!axe)
                return {};
            return {
                maxValue: axe.maxValue(),
                isMaxSignalDependent: axe.isMaxSignalDependent(),
                minValue: axe.minValue(),
                isMinSignalDependent: axe.isMinSignalDependent(),
                label: axe.label(),
                color: axe.color(),
                visible: axe.visible(),
                isDisplayedInner: axe.isDisplayedInner(),
                tickCount: axe.tickCount(),
                tickFormat: axe.tickFormat(),
                isGridVisible: axe.isGridVisible()
            };
        };
        WfChart1Component.prototype.loadConfig = function (content) {
            return __awaiter(this, void 0, void 0, function () {
                var availableLines;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.title(content.title);
                            if (content.autoUpdate !== undefined)
                                this.autoUpdate(content.autoUpdate);
                            this.applySettingsInner(moment(content.startDate).toDate(), moment(content.endDate).toDate(), content.maxResults);
                            this.applyAxesSettingsFromConfiguration(content);
                            return [4 /*yield*/, this.checkAvailabillityOfLines(_.map(content.lines, function (line) { return _this.createChartLineFromConfiguration(line); }))];
                        case 1:
                            availableLines = _a.sent();
                            this.applySignalsSettingsInner(availableLines);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.moveTimeRangeBack = function () {
            this.endDate(this.startDate());
            this.startDate(moment(this.startDate())
                .subtract(this.startOffsetIntervall, this.startOffset)
                .subtract(this.endOffsetIntervall, this.endOffset)
                .toDate());
            this.refreshChartData();
        };
        WfChart1Component.prototype.moveTimeRangeVorward = function () {
            this.startDate(this.endDate());
            this.endDate(moment(this.endDate())
                .add(this.startOffsetIntervall, this.startOffset)
                .add(this.endOffsetIntervall, this.endOffset)
                .toDate());
            this.refreshChartData();
        };
        WfChart1Component.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, settingLines, availableLines, lines, error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType)];
                        case 1:
                            config = _a.sent();
                            if (!config) return [3 /*break*/, 2];
                            configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                            this.loadConfig(JSON.parse(configuration));
                            return [3 /*break*/, 4];
                        case 2:
                            settingLines = _.map(this.settings.lines || [], function (line) { return _this.createObservableChartLine(line); });
                            return [4 /*yield*/, this.checkAvailabillityOfLines(settingLines)];
                        case 3:
                            availableLines = _a.sent();
                            lines = _.map(availableLines, function (line) {
                                return _this.getLineWithPropertiesOrDefault(line, _this.objectID);
                            });
                            this.setLines(lines);
                            this.triggerRefreshChartData();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_3 = _a.sent();
                            this.connector.handleError(WfChart1Component)(error_3);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.handleExport = function () {
            var csvFile = this.convertCsvService.convertChartData(this.data());
            if (csvFile == null)
                return;
            this.convertCsvService.download();
        };
        WfChart1Component.prototype.showSubChart = function () {
            // alert("Hallo");
            this.activeSubchart(true);
            this.subChartConfig({ show: this.activeSubchart(), size: { height: 80 } });
            console.log(this.subChartConfig().show);
            this.refreshChartObject();
            // show: ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : true,
            // this.activeSubchart(
            //   ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : false
            // );
            // this.subChartConfig = ko.observable({
            //   show: this.activeSubchart(),
            //   size: {
            //     height: ko.unwrap(this.settings.subChartHeight) || 50
            //   },
            //   onbrush: function(domain) {
            //     self.onSubchartZoomChanged(this, domain);
            //   }
            // });
        };
        WfChart1Component.prototype.checkAvailabillityOfLines = function (lines) {
            return __awaiter(this, void 0, void 0, function () {
                var signalNames, definitions, result, _loop_2, hasLogTag, lines_1, lines_1_1, line;
                var e_6, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            signalNames = _.map(lines, function (line) { return line.signalName(); });
                            if (!lines.length)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.connector.getSignalDefinitions(signalNames)];
                        case 1:
                            definitions = _b.sent();
                            result = [];
                            _loop_2 = function (line) {
                                var definition = _.findWhere(definitions, { AliasName: line.signalName() });
                                if (!definition || !definition.Active)
                                    return "continue";
                                hasLogTag = _.any(definition.Logs, function (log) { return log && log.Active && log.LogTag === line.logTagName(); });
                                if (hasLogTag) {
                                    result.push(line);
                                }
                            };
                            try {
                                for (lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                                    line = lines_1_1.value;
                                    _loop_2(line);
                                }
                            }
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
                                }
                                finally { if (e_6) throw e_6.error; }
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        WfChart1Component.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalSettingsDialog, signalSettingsBackContainer, settingsDialog, settingsBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            if (this.pollTimer) {
                                clearTimeout(this.pollTimer);
                                this.pollTimer = null;
                            }
                            signalSettingsDialog = $(document).find("#modal-signal-settings-" + ko.unwrap(this.id));
                            signalSettingsBackContainer = $(document).find("#modal-signal-settings-back-container-" + ko.unwrap(this.id));
                            settingsDialog = $(document).find("#modal-settings-" + ko.unwrap(this.id));
                            settingsBackContainer = $(document).find("#modal-settings-back-container-" + ko.unwrap(this.id));
                            signalSettingsDialog.remove();
                            signalSettingsBackContainer.remove();
                            settingsDialog.remove();
                            settingsBackContainer.remove();
                            //clear colorpicker
                            $(document)
                                .find("body")
                                .children(".colorpicker.dropdown-menu")
                                .remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.initializeObservables = function () {
            this.chartAxes = ko.observable(new ObservableChartAxesConfiguration());
            this.chartAxes().x = ko.observable(new ObservableAxisConfigration());
            this.chartAxes().y1 = ko.observable(new ObservableAxisConfigration());
            this.chartAxes().y2 = ko.observable(new ObservableAxisConfigration());
        };
        WfChart1Component.prototype.initializeAxesConfigurationFromSettigs = function (settings) {
            this.chartAxes()
                .x()
                .visible(this.settings.x1AxisVisible !== undefined ? ko.unwrap(this.settings.x1AxisVisible) : true);
            this.chartAxes()
                .x()
                .label(ko.unwrap(this.settings.x1AxisLabel) || "");
            this.chartAxes()
                .x()
                .tickFormat(ko.unwrap(this.settings.x1AxisTickFormat) || "%H:%M:%S %d.%m.%Y");
            this.chartAxes()
                .x()
                .tickCount(ko.unwrap(this.settings.x1TickCount) || 10);
            this.chartAxes()
                .x()
                .isGridVisible(this.settings.x1GridVisible !== undefined ? ko.unwrap(this.settings.x1GridVisible) : false);
            this.chartAxes()
                .y1()
                .visible(this.settings.y1AxisVisible !== undefined ? ko.unwrap(this.settings.y1AxisVisible) : true);
            this.chartAxes()
                .y1()
                .label(ko.unwrap(this.settings.y1AxisLabel) || "");
            this.chartAxes()
                .y1()
                .color(ko.unwrap(this.settings.y1AxisColor) || "#000000");
            this.chartAxes()
                .y1()
                .isDisplayedInner(this.settings.y1AxisInner !== undefined ? ko.unwrap(this.settings.y1AxisInner) : false);
            this.chartAxes()
                .y1()
                .tickFormat(this.settings.y1TickFormat);
            this.chartAxes()
                .y1()
                .tickCount(ko.unwrap(this.settings.y1TickCount) || null);
            this.chartAxes()
                .y1()
                .isGridVisible(this.settings.y1GridVisible !== undefined ? ko.unwrap(this.settings.y1GridVisible) : false);
            this.chartAxes()
                .y1()
                .maxValue(ko.unwrap(this.settings.y1AxisMax) || null);
            this.chartAxes()
                .y1()
                .isMaxSignalDependent(this.settings.y1AxisMaxSignal !== undefined ? ko.unwrap(this.settings.y1AxisMaxSignal) : false);
            this.chartAxes()
                .y1()
                .minValue(ko.unwrap(this.settings.y1AxisMin) || null);
            this.chartAxes()
                .y1()
                .isMinSignalDependent(this.settings.y1AxisMinSignal !== undefined ? ko.unwrap(this.settings.y1AxisMinSignal) : false);
            this.chartAxes()
                .y2()
                .visible(this.settings.y2AxisVisible !== undefined ? ko.unwrap(this.settings.y2AxisVisible) : true);
            this.chartAxes()
                .y2()
                .label(ko.unwrap(this.settings.y2AxisLabel) || "");
            this.chartAxes()
                .y2()
                .color(ko.unwrap(this.settings.y2AxisColor) || "#880000");
            this.chartAxes()
                .y2()
                .isDisplayedInner(this.settings.y2AxisInner !== undefined ? ko.unwrap(this.settings.y2AxisInner) : false);
            this.chartAxes()
                .y2()
                .tickFormat(this.settings.y2TickFormat);
            this.chartAxes()
                .y2()
                .tickCount(ko.unwrap(this.settings.y2TickCount) || null);
            //this.chartAxes().y2().isGridVisible(ko.unwrap(this.settings.y2GridVisible) || false);
            this.chartAxes()
                .y2()
                .maxValue(ko.unwrap(this.settings.y2AxisMax) || null);
            this.chartAxes()
                .y2()
                .isMaxSignalDependent(this.settings.y2AxisMaxSignal !== undefined ? ko.unwrap(this.settings.y2AxisMaxSignal) : false);
            this.chartAxes()
                .y2()
                .minValue(ko.unwrap(this.settings.y2AxisMin) || null);
            this.chartAxes()
                .y2()
                .isMinSignalDependent(this.settings.y2AxisMinSignal !== undefined ? ko.unwrap(this.settings.y2AxisMinSignal) : false);
        };
        WfChart1Component.prototype.getChartLineName = function (line, index) {
            if (!line) {
                return "";
            }
            return index + "_" + ko.unwrap(line.signalName);
        };
        WfChart1Component.prototype.createObservableChartLine = function (line) {
            if (!line)
                return null;
            var result = {};
            result.signalName = ko.observable(line.signalName);
            result.logTagName = ko.observable(line.logTagName);
            result.axis = ko.observable(line.axis);
            result.color = ko.observable(line.color);
            result.type = ko.observable(line.type);
            result.staticUnitText = ko.observable(line.staticUnitText);
            result.signalFactor = ko.observable(line.signalFactor);
            result.staticLegendText = ko.observable(line.staticLegendText);
            result.hide = ko.observable(line.hide);
            return result;
        };
        WfChart1Component.prototype.cloneChartLine = function (line) {
            if (!line)
                return null;
            var result = {};
            result.signalName = ko.observable(ko.unwrap(line.signalName));
            result.logTagName = ko.observable(ko.unwrap(line.logTagName));
            result.axis = ko.observable(ko.unwrap(line.axis));
            result.color = ko.observable(ko.unwrap(line.color));
            result.unit = ko.observable(ko.unwrap(line.unit));
            result.maxAxis = ko.observable(ko.unwrap(line.maxAxis));
            result.minAxis = ko.observable(ko.unwrap(line.minAxis));
            result.legendText = ko.observable(ko.unwrap(line.legendText));
            result.values = ko.observableArray(ko.unwrap(line.values) || []);
            result.minimum = ko.observable(ko.unwrap(line.minimum));
            result.maximum = ko.observable(ko.unwrap(line.maximum));
            result.average = ko.observable(ko.unwrap(line.average));
            result.lastValue = ko.observable(ko.unwrap(line.lastValue));
            result.minimumTimestamp = ko.observable(ko.unwrap(line.minimumTimestamp));
            result.maximumTimestamp = ko.observable(ko.unwrap(line.maximumTimestamp));
            result.lastValueTimestamp = ko.observable(ko.unwrap(line.lastValueTimestamp));
            result.type = ko.observable(ko.unwrap(line.type));
            result.isStatic = ko.observable(ko.unwrap(line.isStatic));
            result.logId = line.logId;
            result.signalId = line.signalId;
            result.logTag = line.logTag;
            result.staticUnitText = ko.observable(ko.unwrap(line.staticUnitText));
            result.signalFactor = ko.observable(ko.unwrap(line.signalFactor));
            result.staticLegendText = ko.observable(ko.unwrap(line.staticLegendText));
            result.hide = ko.observable(ko.unwrap(line.hide));
            return result;
        };
        WfChart1Component.prototype.createChartLineFromConfiguration = function (configLineModel) {
            var result = {};
            result.signalName = ko.observable(configLineModel.signalName);
            result.logTagName = ko.observable(configLineModel.logTagName);
            result.color = ko.observable(configLineModel.color);
            result.axis = ko.observable(configLineModel.axis);
            result.type = ko.observable(configLineModel.type);
            result.isStatic = ko.observable(configLineModel.isStatic);
            result.staticUnitText = ko.observable(configLineModel.staticUnitText);
            result.signalFactor = ko.observable(configLineModel.signalFactor);
            result.staticLegendText = ko.observable(configLineModel.staticLegendText);
            result.hide = ko.observable(configLineModel.hide);
            return result;
        };
        WfChart1Component.prototype.createChartLineForConfiguration = function (line) {
            return {
                signalName: ko.unwrap(line.signalName),
                logTagName: ko.unwrap(line.logTagName),
                color: ko.unwrap(line.color),
                axis: ko.unwrap(line.axis),
                type: ko.unwrap(line.type),
                isStatic: ko.unwrap(line.isStatic),
                staticUnitText: ko.unwrap(line.staticUnitText),
                signalFactor: ko.unwrap(line.signalFactor),
                staticLegendText: ko.unwrap(line.staticLegendText),
                hide: ko.unwrap(line.hide)
            };
        };
        WfChart1Component.prototype.getHideConfig = function () {
            //diese Funktion wird im Takt aufgerufen, die Linien aber nur bei Initialisierung auf HIDE gestellt, damit später per Mausclick die Linie wieder sichtbar wird. 
            var self = this;
            var hideConfig = [];
            if (!this.getHideConfigInit) {
                _.each(self.lines(), function (line, index) {
                    if ((line.hide() == true)) {
                        hideConfig.push(self.getChartLineName(line, index));
                    }
                });
                this.getHideConfigInit = true;
            }
            // console.log("GetHideConfig()");
            // console.log(hideConfig);
            // console.log(self.lines());
            return hideConfig;
        };
        ;
        WfChart1Component.prototype.getC3ChartObject = function () {
            return {
                x: "x",
                columns: this.data(),
                type: this.chartType(),
                axes: this.axes(),
                colors: this.axisesColor(),
                range: { max: this.maxValueForAxises(), min: this.minValueForAxises() },
                showY: this.showFirstAxis(),
                showY2: this.showSecondAxis(),
                names: this.legendNames(),
                types: this.lineTypes(),
                axisLabels: this.axisLabels(),
                hide: this.getHideConfig()
            };
        };
        WfChart1Component.prototype.setChartObject = function () {
            var value = this.getC3ChartObject();
            //gets trigger twice if a new signal is added (once when the configuration is applied and the second when we actually have values)
            //console.log("c3chart object set: " + new Date().getTime());
            this.c3Chart(value);
        };
        WfChart1Component.prototype.triggerRefreshChartData2 = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            // console.log("Trigger Refresh Data");
                            // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
                            if (ko.unwrap(this.getLatestLogdata) === true) {
                                // this.startDate(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
                                this.startDateInput(this.startDate());
                                // this.selectedRangeInput(CalendarTimeRanges.Custom);
                                // this.timeRangeDateInput(this.startDate());
                                // this.endDate(moment().add(this.endOffsetIntervall, this.endOffset).toDate());
                                this.endDateInput(this.endDate());
                            }
                            return [4 /*yield*/, this.getSignalInformations()];
                        case 1:
                            _a.sent();
                            this.refreshChartData();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1Component.prototype.onMouseDownFunc = function (value, index) {
            console.log("OnMouseDownFunc");
            // console.log(this);
            // var elem: IZoomDTO = {
            //   //Elem erzeugen
            //   startDate: this.startDate(),
            //   endDate: this.endDate()
            // };
            // this.zoomZurueckArray.push(elem);
            // console.log(this.zoomZurueckArray);
            this.startDateOld = this.startDate();
            this.endDateOld = this.endDate();
            // console.log(value);
            var startTime = value.x;
            // console.log(startTime);
            // console.log(typeof startTime);
            this.startDate(startTime);
            // console.log(index);
            this.overlayDivWidth('0px');
            this.overlayDivShow(true);
        };
        WfChart1Component.prototype.onMouseUpFunc = function (value) {
            console.log("OnMouseUpFunc");
            // console.log(this);
            // console.log(value);
            var endTime = value.x;
            // console.log(endTime);
            this.endDate(endTime);
            this.btnZoomZurueckEnable(true);
            this.btnZoomZurueckBackgColor("btn btn-primary");
            // this.overlayDivLeft(this.overlayDivClientX1() + 'px');
            // var diffWidth = this.overlayDivClientX2() - this.overlayDivClientX1();
            // console.log('%cDiv-Width(): ' + diffWidth, 'background-color:yellow');
            // this.overlayDivWidth(diffWidth + 'px');
            this.overlayDivTop('15px');
            var time1 = this.startDate();
            var time2 = this.endDate();
            var diffSek = (time2.getTime() - time1.getTime()) / 1000;
            console.log('%cDiff Time: ' + diffSek, 'background-color:yellow');
            if (diffSek >= 10) {
                var elem = {
                    //Elem erzeugen
                    startDate: this.startDateOld,
                    endDate: this.endDateOld
                };
                this.zoomZurueckArray.push(elem);
                this.triggerRefreshChartData2();
            }
            this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
            // wenn gezoomt wird, dann das automatische Aktualisieren ausschalten
            if (this.zoomZurueckArray.length > 0) {
                this.autoUpdate(false);
            }
            this.overlayDivShow(false);
        };
        WfChart1Component.prototype.onMouseRightClick = function (e, data, event) {
        };
        WfChart1Component.prototype.zoomZurueck = function () {
            // console.log("Zoom-Zurueck");
            var lastIndex = this.zoomZurueckArray.length - 1;
            // console.log(lastIndex);
            var startTime = this.zoomZurueckArray[lastIndex].startDate;
            var endTime = this.zoomZurueckArray[lastIndex].endDate;
            // console.log(startTime);
            // console.log(endTime);
            this.zoomZurueckArray.pop(); //lösche letztes Index
            // console.log(this.zoomZurueckArray.length);
            if (this.zoomZurueckArray.length <= 0) {
                this.btnZoomZurueckEnable(false);
                this.btnZoomZurueckBackgColor("btn btn-default");
            }
            this.startDate(startTime);
            this.endDate(endTime);
            this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
            this.triggerRefreshChartData2();
            // wenn gezoomt wird, dann das automatische Aktualisieren ausschalten
            if (this.zoomZurueckArray.length == 0) {
                this.autoUpdate(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
            }
        };
        // wird von der internen HTML-Seite aufgerufen
        // Hier werden Ereignisse ermittelt und einer Funktion zugewiesen
        WfChart1Component.prototype.onRendered = function () {
            var self = this;
            //console.log("onRendered");
            this.isLoading(false);
            // Das Chart muss eindeutig sein, deshalb ist hier eine Css-Klasse erfunden, welche eindeutig zum Chart parametriert ist.
            // Die KLasse .c3-event-rect gehört zum D3-Chart
            var myClassAndId = '.' + this.chartId + ' .c3-event-rect';
            d3.selectAll(myClassAndId)
                .on('mousedown', function (value, index) {
                self.onMouseDownFunc(value, index);
            })
                .on('mouseup', function (value, index) {
                self.onMouseUpFunc(value);
            });
        };
        WfChart1Component.prototype.onClickEvent = function () {
            console.log("onClickEvent");
        };
        WfChart1Component.prototype.onMouseOverEvent = function (e) {
        };
        WfChart1Component.prototype.onMouseDownEventFromDiv = function (data, e) {
        };
        WfChart1Component.prototype.onMouseUpEventFromDiv = function (data, e) {
            this.overlayDivShow(false);
            // console.log('%cMouseUp(): ', 'background-color:yellow');
        };
        WfChart1Component.prototype.onMouseMoveEventFromDiv = function (data, e) {
            // Linke Maustaste gedrückt
            if (typeof e === 'object') {
                if (e.originalEvent.button === 0) {
                    var left = this.onMouseOverLeft; //  e.offsetX + 15; // funktioniert im Firefox nicht
                    if (!this.overlayDivShow()) {
                        this.overlayDivClientX1(left);
                        this.overlayDivClientX2(left);
                        this.overlayDivLeft(this.overlayDivClientX1() + 'px');
                        // this.overlayDivShow(true);
                        // console.log('%cMouseMove() Start: ' + left, 'background-color:orange');
                    }
                    if (this.overlayDivShow()) {
                        this.overlayDivClientX2(left);
                        // console.log('%cMouseMove(): ' + left, 'background-color:yellow');
                        var diffWidth = this.overlayDivClientX2() - this.overlayDivClientX1();
                        // console.log('%cDiv-Width(): ' + diffWidth, 'background-color:yellow');
                        this.overlayDivWidth(diffWidth + 'px');
                    }
                }
            }
        };
        // Funktion zum registrieren der Kurven-Signale, damit mit dem Connector der aktuelle Wert ausgelesen werden kann
        WfChart1Component.prototype.initSignalNamen = function (params) {
            var myL = params.lines;
            for (var index = 0; index < myL.length; index++) {
                var sigName = myL[index].signalName;
                var wert = this.connector.getSignal(sigName);
            }
        };
        WfChart1Component.prototype.setStatisticsVisibility = function () {
            // negieren der Variablen
            this.statisticsVisibilityIntern(ko.unwrap(!this.statisticsVisibilityIntern()));
        };
        WfChart1Component.prototype.getTooltipPosition = function (data, width, height, element) {
            var $$ = this;
            var erg = null;
            var chartIdHtml = "#wf-chart-" + ko.unwrap($$.id);
            $$.onMouseOverLeft = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width')) + 70;
            // Das Tooltip - Fenster verschieben
            if ((ko.unwrap($$.tooltipPosition) == "top-left") || (ko.unwrap($$.tooltipPosition) == "top-middle") || (ko.unwrap($$.tooltipPosition) == "top-right") || (ko.unwrap($$.tooltipPosition) == "bottom-left") || (ko.unwrap($$.tooltipPosition) == "bottom-middle") || (ko.unwrap($$.tooltipPosition) == "bottom-right")) {
                var chartIdHtml = "#wf-chart-" + ko.unwrap($$.id);
                var left2 = $$.onMouseOverLeft; //e.offsetX + 15;
                var left3 = 80;
                var breiteTooltipContainer = parseInt($(chartIdHtml + " .c3-tooltip-container").css("width"));
                var breiteChart = $(chartIdHtml + " .wf-chart-wrapper").width();
                var top1 = 0;
                // Tooltip - Fenster verschieben nach rechten Rand, wenn Maus auf der linken Seite ist
                if ((ko.unwrap($$.tooltipPosition) == "top-left")) {
                    if ((left2) < (70 + breiteTooltipContainer + 50)) { //70 ist auf der Höhe von der Y1-Achse; 50 noch nach rechts
                        var newLeft = this.showSecondAxis() ? (breiteChart - breiteTooltipContainer - 70) : (breiteChart - breiteTooltipContainer - 30);
                        left3 = newLeft;
                    }
                }
                // Tooltip - Fenster verschieben nach linken Rand, wenn Maus auf der rechten Seite ist
                if ((ko.unwrap($$.tooltipPosition) == "top-right")) {
                    if ((left2) > (breiteChart - breiteTooltipContainer - 50)) {
                        var newRight = 70;
                        left3 = newRight;
                    }
                    else {
                        left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() - $(chartIdHtml + " .c3-tooltip-container").width() - 20);
                    }
                }
                // Tooltip - Fenster verschieben nach linken Rand, wenn Maus in der Mitte ist
                if ((ko.unwrap($$.tooltipPosition) == "top-middle")) {
                    if (((left2) > ((breiteChart / 2) - (breiteTooltipContainer / 2) - 10)) && ((left2) < ((breiteChart / 2) + (breiteTooltipContainer / 2) + 20))) {
                        var newMiddle = 70;
                        left3 = newMiddle;
                    }
                    else {
                        left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() / 2) - ($(chartIdHtml + " .c3-tooltip-container").width() / 2) - 10;
                    }
                }
                // Tooltip - Fenster verschieben nach rechten Rand, wenn Maus auf der linken Seite ist
                if ((ko.unwrap($$.tooltipPosition) == "bottom-left")) {
                    if ((left2) < (70 + breiteTooltipContainer + 50)) { //70 ist auf der Höhe von der Y1-Achse; 50 noch nach rechts
                        var newLeft = this.showSecondAxis() ? (breiteChart - breiteTooltipContainer - 70) : (breiteChart - breiteTooltipContainer - 30);
                        left3 = newLeft;
                        top1 = $$.chartHeight();
                    }
                    else {
                        top1 = $$.chartHeight();
                    }
                }
                // Tooltip - Fenster verschieben nach linken Rand, wenn Maus auf der rechten Seite ist
                if ((ko.unwrap($$.tooltipPosition) == "bottom-right")) {
                    if ((left2) > (breiteChart - breiteTooltipContainer - 50)) {
                        var newRight = 70;
                        left3 = newRight;
                        top1 = $$.chartHeight();
                    }
                    else {
                        left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() - $(chartIdHtml + " .c3-tooltip-container").width() - 30);
                        top1 = $$.chartHeight();
                    }
                }
                // Tooltip - Fenster verschieben nach linken Rand, wenn Maus in der Mitte ist
                if ((ko.unwrap($$.tooltipPosition) == "bottom-middle")) {
                    if (((left2) > ((breiteChart / 2) - (breiteTooltipContainer / 2) - 10)) && ((left2) < ((breiteChart / 2) + (breiteTooltipContainer / 2) + 20))) {
                        var newMiddle = 70;
                        left3 = newMiddle;
                        top1 = $$.chartHeight();
                    }
                    else {
                        left3 = (($(chartIdHtml + " .wf-chart-wrapper").width() / 2) - ($(chartIdHtml + " .c3-tooltip-container").width() / 2) - 10);
                        top1 = $$.chartHeight();
                    }
                }
                return { top: top1, left: left3 };
            }
            return { top: 10, left: $$.onMouseOverLeft + 10 }; //sonst leeres Objekt zurückgeben
        };
        ;
        // wird von aussen aufgerufen
        WfChart1Component.prototype.showVersionen = function () {
            var self = this;
            $('#' + self.versionenChartId()).mouseleave(function () {
                $('#' + self.versionenChartId()).popover('hide');
            });
            $('#' + self.versionenChartId()).popover('show');
        };
        //Click auf Legende, muss noch per Item freigegeben werden, jetzt gesperrt
        WfChart1Component.prototype.onclickLegend = function (id) {
            var $$ = this;
            var erg = null;
            var indexArr = id.split("_");
            var index = parseInt(indexArr[0]);
            return null;
        };
        ;
        return WfChart1Component;
    }(ComponentBaseModel));
    return WfChart1Component;
});
//# sourceMappingURL=ccw-wf-chart-1.component.js.map