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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "../../models/series-configuration.model", "./charts-update.service", "../../../../services/connector"], function (require, exports, series_configuration_model_1, charts_update_service_1, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartsConfigurationService = void 0;
    var ChartsConfigurationService = /** @class */ (function () {
        function ChartsConfigurationService(provider, id) {
            this.provider = provider;
            this.id = id;
            this.connector = new Connector();
            this.isLoading = provider.isLoading;
            this.chartsUpdateService = new charts_update_service_1.ChartsUpdateService(this, provider);
            this.chartLoading = this.chartsUpdateService.chartLoading;
            this.chartsUpdateService.subscribe();
        }
        ChartsConfigurationService.prototype.removeAxisRangeBase = function (name, axis) {
            this.chart.yAxes.each(function (yAxis) {
                var range = _.find(yAxis.axisRanges.values, function (item) { return item.id === name; });
                if (range) {
                    yAxis.axisRanges.removeValue(range);
                    range.dispose();
                }
            });
            return this;
        };
        ChartsConfigurationService.prototype.removeRange = function (name, axis) {
            return this.removeAxisRangeBase(name, axis);
        };
        ChartsConfigurationService.prototype.updateEndRanges = function (name, value, axis) {
            var e_1, _a;
            var yAxes = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + axis; });
            if (yAxes) {
                try {
                    for (var _b = __values(yAxes.axisRanges.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var range = _c.value;
                        if (name === range.id) {
                            range.endValue = numeral(value).value();
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return this;
        };
        ChartsConfigurationService.prototype.updateStartRanges = function (name, value, axis) {
            var e_2, _a;
            var yAxes = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + axis; });
            if (yAxes) {
                try {
                    for (var _b = __values(yAxes.axisRanges.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var range = _c.value;
                        if (name === range.id) {
                            range.value = numeral(value).value();
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return this;
        };
        ChartsConfigurationService.prototype.updateHorizontalLines = function (name, value, axis) {
            var id = "horizontalLine-" + name;
            return this.updateStartRanges(id, value, axis);
        };
        ChartsConfigurationService.prototype.updateVerticalLine = function (id, name, date) {
            var verticalLineId = "verticalLine-" + id;
            if (!this.dateAxis)
                return;
            var range = _.find(this.dateAxis.axisRanges.values, function (item) { return item.id === verticalLineId; });
            if (range && date) {
                range.grid.strokeOpacity = 0.6;
                range.label.fillOpacity = 0.8;
                range.label.strokeOpacity = 0.8;
                range.label.text = name;
                range.date = date;
                //  range.grid.tooltipText = value;
            }
            return this;
        };
        ChartsConfigurationService.prototype.addHorizontalLine = function (configuration, axis, staticValue) {
            if (staticValue === void 0) { staticValue = null; }
            var id = "horizontalLine-" + configuration.name;
            var yAxis = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + axis; });
            var range = yAxis.axisRanges.create();
            range.id = id;
            var value = configuration.type === series_configuration_model_1.HorizontalLineConfigurationType.Value ? (numeral(configuration.value).value() + numeral((configuration.offset || 0)).value()) : null;
            if (configuration.type === series_configuration_model_1.HorizontalLineConfigurationType.SignalMax || configuration.type === series_configuration_model_1.HorizontalLineConfigurationType.SignalMin) {
                range.value = numeral(staticValue).value() + numeral((configuration.offset || 0)).value();
            }
            else {
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
        };
        ChartsConfigurationService.prototype.addVerticalLine = function (id) {
            var verticalLineId = "verticalLine-" + id;
            var range = this.dateAxis.axisRanges.create();
            range.id = verticalLineId;
            range.grid.strokeDasharray = "5,2";
            range.label.inside = true;
            range.label.rotation = 90;
            range.label.horizontalCenter = "right";
            range.label.verticalCenter = "bottom";
            return this;
        };
        ChartsConfigurationService.prototype.addRange = function (configuration) {
            var yAxis = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + configuration.axis; });
            var range = yAxis.axisRanges.create();
            range.id = configuration.name;
            var startValue = configuration.startType == series_configuration_model_1.RangeConfigurationType.Value ? numeral(configuration.start).value() : null;
            var endValue = configuration.endType == series_configuration_model_1.RangeConfigurationType.Value ? numeral(configuration.end).value() : null;
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
        };
        ChartsConfigurationService.prototype.addLegend = function (configuration) {
            var e_3, _a;
            if (configuration.show === true) {
                var legend = new am4charts.Legend();
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
                    try {
                        for (var _b = __values(this.chart.series.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var series = _c.value;
                            series.legendSettings.valueText = "{valueY.close}";
                            series.legendSettings.itemValueText = "[bold]{valueY}[/bold]";
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                this.chart.legend = legend;
            }
            return this;
        };
        ChartsConfigurationService.prototype.createChart = function () {
            var e_4, _a, e_5, _b, e_6, _c;
            var _this = this;
            am4core.options.minPolylineStep = this.provider.minPolylineStep;
            am4core.options.commercialLicense = true;
            this.chartLoading(true);
            if (this.chart) {
                this.chart.dispose();
            }
            if (this.languageSubscription) {
                this.languageSubscription.dispose();
            }
            this.chart = am4core.create("wf-historical-data-chart-" + ko.unwrap(this.id), am4charts.XYChart);
            this.languageSubscription = this.connector.currentLanguageId.subscribe(function (lang) {
                var id = _this.connector.getAmchartsLanguage(lang);
                _this.chart.language.locale = window["am4lang_" + id];
            });
            var id = this.connector.getAmchartsLanguage(this.connector.currentLanguageId());
            this.chart.language.locale = window["am4lang_" + id];
            // this.chart.preloader.disabled = true;
            this.chart.preloader.hidden = true;
            this.chart.modal.events.on("closed", function () {
                _this.chartLoading(false);
            }, this);
            this.chart.preloader.events.on("shown", function () {
                _this.chartLoading(true);
            }, this);
            this.chart.events.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.provider.resolution(Math.max(this.chart.pixelWidth, 5000));
                    this.chart.events.on("sizechanged", function () {
                        _this.provider.resolution(Math.max(_this.chart.pixelWidth, 5000));
                    });
                    //startchanged
                    this.dateAxis.events.on("startendchanged", _.debounce(this.chartsUpdateService.dateAxisChanged, 10));
                    this.provider.startGettingUpdates();
                    return [2 /*return*/];
                });
            }); }, this);
            this.chart.events.on("beforedatavalidated", function () {
                _this.disableStartendchanged();
                _this.chartLoading(true);
            }, this);
            this.chart.events.on("datavalidated", function () {
                _this.chartLoading(false);
                _this.enableStartendchanged();
            }, this);
            this.addDateAxis()
                .addScrollbarX(this.provider.scrollbar())
                .addScrollbarY(this.provider.scrollbar());
            if (this.provider.layoutVertical === true) {
                this.chart.leftAxesContainer.layout = "vertical";
            }
            try {
                for (var _d = __values(this.provider.axes()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var axis = _e.value;
                    this.addValueAxis(axis);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var _f = __values(this.provider.series()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var series = _g.value;
                    this.addSeries(series);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                for (var _h = __values(this.provider.regions()), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var range = _j.value;
                    this.addRange(range);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_6) throw e_6.error; }
            }
            this
                .addCursor()
                .addLegend(this.provider.legend())
                .addSubscriptions();
            this.resetData(this.provider.seriesUpdates);
            this.chartsUpdateService.addHorizontalLines();
            this.chartsUpdateService.addVerticalLines();
            return this;
        };
        ChartsConfigurationService.prototype.disableStartendchanged = function () {
            this.dateAxis.events.disableType("startendchanged");
        };
        ChartsConfigurationService.prototype.enableStartendchanged = function () {
            this.dateAxis.events.enableType("startendchanged");
        };
        ChartsConfigurationService.prototype.addDateAxis = function () {
            // Create axes
            this.dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
            this.dateAxis.keepSelection = true;
            var dateTimeTooltipFormat = this.provider.chartDataProvider.configuration().dateTimeTooltipFormat || "M/d/yyyy";
            this.dateAxis.tooltipDateFormat = dateTimeTooltipFormat.replace(/DD/g, 'dd');
            return this;
        };
        ChartsConfigurationService.prototype.addCursor = function () {
            this.chart.cursor = new am4charts.XYCursor();
            return this;
        };
        ChartsConfigurationService.prototype.addValueAxis = function (configuration) {
            // Create value axis
            var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.id = "valueAxis-" + configuration.name;
            valueAxis.marginTop = 10;
            valueAxis.marginBottom = 10;
            valueAxis.align = "right";
            valueAxis.renderer.line.strokeOpacity = 1;
            if (configuration.color !== undefined) {
                valueAxis.renderer.line.stroke = am4core.color(configuration.color);
                valueAxis.renderer.labels.template.fill = am4core.color(configuration.color);
                valueAxis.title.fill = am4core.color(configuration.color);
            }
            valueAxis.renderer.grid.template.stroke = configuration.gridThickness == undefined ? valueAxis.renderer.grid.template.stroke : am4core.color(configuration.gridColor);
            ;
            valueAxis.renderer.opposite = false;
            valueAxis.renderer.line.strokeWidth = configuration.thickness == undefined ? valueAxis.renderer.line.strokeWidth : configuration.thickness;
            valueAxis.renderer.grid.template.strokeWidth = configuration.gridThickness == undefined ? valueAxis.renderer.grid.template.strokeWidth : configuration.gridThickness;
            if (configuration.minGridDistance != undefined) {
                valueAxis.renderer.minGridDistance = configuration.minGridDistance;
            }
            if (valueAxis.renderer.grid.template.strokeWidth <= 0) {
                valueAxis.renderer.grid.template.disabled = false;
            }
            if (configuration.valuePosition == undefined || configuration.valuePosition === series_configuration_model_1.ValuePosition.Outside) {
                valueAxis.renderer.inside = false;
            }
            if (configuration.valuePosition === series_configuration_model_1.ValuePosition.Inside) {
                valueAxis.renderer.inside = true;
            }
            if (configuration.showLabels === false) {
                valueAxis.renderer.labels.template.adapter.add("text", function () {
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
                var format = "#,###.";
                for (var index = 0; index < configuration.digits; index++) {
                    format = format + "#";
                }
                valueAxis.numberFormatter.numberFormat = format;
            }
            if (configuration.scientific === true) {
                valueAxis.numberFormatter.numberFormat = valueAxis.numberFormatter.numberFormat + "e";
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
                valueAxis.min = configuration.min;
            }
            if (configuration.max != undefined) {
                valueAxis.max = configuration.max;
            }
            this.linkSeries(valueAxis);
            return this;
        };
        ChartsConfigurationService.prototype.removeHorizontalLine = function (name, axis) {
            name = "horizontalLine-" + name;
            return this.removeAxisRangeBase(name, axis);
        };
        ChartsConfigurationService.prototype.removeValueAxis = function (name) {
            var axis = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + name; });
            if (axis) {
                this.chart.yAxes.removeValue(axis);
                axis.dispose();
            }
            return this;
        };
        ChartsConfigurationService.prototype.addSeries = function (configuration) {
            var series = null;
            switch (configuration.chartType) {
                case series_configuration_model_1.ChartType.Step:
                    series = this.chart.series.push(new am4charts.StepLineSeries());
                    break;
                case series_configuration_model_1.ChartType.Bar:
                    series = this.chart.series.push(new am4charts.ColumnSeries());
                    break;
                case series_configuration_model_1.ChartType.StackedBar:
                    series = this.chart.series.push(new am4charts.ColumnSeries());
                    series.stacked = true;
                    break;
                case series_configuration_model_1.ChartType.StackedLine:
                    series = this.chart.series.push(new am4charts.LineSeries());
                    series.stacked = true;
                    break;
                case series_configuration_model_1.ChartType.Dots:
                    series = this.chart.series.push(new am4charts.LineSeries());
                    var dots = series.bullets.push(new am4charts.CircleBullet());
                    dots.circle.strokeWidth = 0;
                    dots.circle.radius = 3;
                    if (configuration.strokeColor != undefined) {
                        dots.circle.fill = am4core.color(configuration.strokeColor);
                    }
                    series.strokeOpacity = 0;
                    break;
                case series_configuration_model_1.ChartType.LineDots:
                    series = this.chart.series.push(new am4charts.LineSeries());
                    var lineDots = series.bullets.push(new am4charts.CircleBullet());
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
            var valueAxis = _.find(this.chart.yAxes.values, function (item) { return item.id === "valueAxis-" + configuration.axis; });
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
                var format = "#,###.";
                for (var index = 0; index < configuration.digits; index++) {
                    format += "#";
                }
                series.tooltipText = "[#000]{name}: {valueY.formatNumber('" + format + "')}[/]";
            }
            else {
                series.tooltipText = "[#000]{name}: {valueY}[/]";
            }
            series.tooltip.background.fill = am4core.color("#FFF");
            series.tooltip.getStrokeFromObject = true;
            series.tooltip.getFillFromObject = false;
            if (configuration.fillColor != undefined && configuration.fillColor !== "transparent") {
                series.fillOpacity = 1;
                series.fill = am4core.color(configuration.fillColor);
            }
            else {
                series.fillOpacity = 0;
            }
            if (configuration.chartType !== series_configuration_model_1.ChartType.Dots) {
                if (configuration.strokeColor != undefined && configuration.strokeColor !== "transparent") {
                    series.strokeOpacity = 1;
                    series.stroke = am4core.color(configuration.strokeColor);
                }
                else {
                    series.strokeOpacity = 0;
                }
            }
            var seriesData = this.provider.getSeriesData(configuration.signalName + "/" + configuration.tag);
            if (!seriesData)
                return this;
            var signal = seriesData.signal;
            switch (configuration.display) {
                case series_configuration_model_1.SeriesDisplayType.Alias:
                    series.name = signal.Alias || signal.AliasName;
                    break;
                case series_configuration_model_1.SeriesDisplayType.Description:
                    series.name = signal.Description;
                    break;
                default:
                    series.name = configuration.name;
                    break;
            }
            return this;
        };
        ChartsConfigurationService.prototype.addScrollbarX = function (configuration) {
            if (configuration.showX !== true) {
                return this;
            }
            var scrollbarX = new am4core.Scrollbar();
            scrollbarX.updateWhileMoving = false;
            this.chart.scrollbarX = scrollbarX;
            return this;
        };
        ChartsConfigurationService.prototype.addScrollbarY = function (configuration) {
            if (configuration.showY !== true) {
                return this;
            }
            var scrollbarY = new am4core.Scrollbar();
            this.chart.scrollbarY = scrollbarY;
            return this;
        };
        ChartsConfigurationService.prototype.addSubscriptions = function () {
            var _this = this;
            if (!this.seriesUpdatesSubscription)
                this.seriesUpdatesSubscription = this.provider.updates.subscribe(function (x) {
                    // some workaround to get the startEnd date correctly set
                    if (_this.chart.data.length <= 2) {
                        _this.resetData(_this.provider.seriesUpdates);
                    }
                    else if (x.length > 0) {
                        _this.chart.addData(x, 0);
                    }
                    else {
                        _this.resetData();
                    }
                    if (!_this.chartsUpdateService.isHidden) {
                        var toRemove = _this.chart.data.length - _this.provider.timestamps().length - 2;
                        if (toRemove > 0) {
                            _this.chart.removeData(toRemove);
                        }
                    }
                });
            return this;
        };
        ChartsConfigurationService.prototype.addStartEndDate = function (cartData) {
            var dummyItems = _.filter(cartData, function (x) { return Object.keys(x).length === 1; });
            if (dummyItems.length < 2) {
                var data = [];
                if (this.provider.start()) {
                    data.push({ timestamp: moment(this.provider.start()).toDate() });
                }
                if (this.provider.end()) {
                    data.push({ timestamp: moment(this.provider.end()).toDate() });
                }
                cartData.push.apply(cartData, __spread(data));
                cartData.sort(function (a, b) {
                    return (new Date(a.timestamp).getTime()) - (new Date(b.timestamp).getTime());
                });
            }
        };
        ChartsConfigurationService.prototype.dispose = function () {
            this.languageSubscription.dispose();
            this.chartsUpdateService.dispose();
            this.seriesUpdatesSubscription.dispose();
            this.chart.dispose();
        };
        ChartsConfigurationService.prototype.resetData = function (cartData) {
            if (cartData === void 0) { cartData = []; }
            this.disableStartendchanged();
            this.addStartEndDate(cartData);
            this.chart.data = cartData;
        };
        ChartsConfigurationService.prototype.getData = function () {
            return this.chart.data;
        };
        ChartsConfigurationService.prototype.linkSeries = function (valueAxis) {
            var e_7, _a;
            var seriesConfiguration = _.filter(this.provider.series(), function (item) { return "valueAxis-" + item.axis === valueAxis.id; });
            var _loop_1 = function (series) {
                if (valueAxis) {
                    var cartSeries = _.find(this_1.chart.series.values, function (item) { return item.id === series.name; });
                    if (cartSeries)
                        cartSeries.yAxis = valueAxis;
                }
            };
            var this_1 = this;
            try {
                for (var seriesConfiguration_1 = __values(seriesConfiguration), seriesConfiguration_1_1 = seriesConfiguration_1.next(); !seriesConfiguration_1_1.done; seriesConfiguration_1_1 = seriesConfiguration_1.next()) {
                    var series = seriesConfiguration_1_1.value;
                    _loop_1(series);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (seriesConfiguration_1_1 && !seriesConfiguration_1_1.done && (_a = seriesConfiguration_1.return)) _a.call(seriesConfiguration_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        };
        return ChartsConfigurationService;
    }());
    exports.ChartsConfigurationService = ChartsConfigurationService;
});
//# sourceMappingURL=charts-configuration.service.js.map