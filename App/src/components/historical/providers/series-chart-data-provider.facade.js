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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesChartDataProviderFacade = void 0;
    var SeriesChartDataProviderFacade = /** @class */ (function () {
        function SeriesChartDataProviderFacade(provider, chartDataProvider) {
            this.provider = provider;
            this.chartDataProvider = chartDataProvider;
            this.resolution = provider.resolution;
            this.timeSeriesMode = provider.timeSeriesMode;
            this.isLoading = provider.isLoading;
            this.updates = chartDataProvider.updates;
            this.start = this.provider.start;
            this.end = this.provider.end;
            this.timestamps = this.provider.timestamps;
            this.timeConfiguration = this.provider.timeConfiguration;
            this.legend = this.chartDataProvider.legend;
            this.export = this.chartDataProvider.export;
            this.scrollbar = this.chartDataProvider.scrollbar;
            this.axes = this.chartDataProvider.axes;
            this.regions = this.chartDataProvider.regions;
            this.series = this.chartDataProvider.series;
        }
        SeriesChartDataProviderFacade.prototype.getSeriesData = function (key) {
            return this.provider.getSeriesData(key);
        };
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "seriesDataKeys", {
            get: function () {
                return this.provider.seriesDataKeys;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "seriesUpdates", {
            get: function () {
                return this.chartDataProvider.seriesUpdates;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "minPolylineStep", {
            get: function () {
                return this.chartDataProvider.configuration().minPolylineStep;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "layoutVertical", {
            get: function () {
                return this.chartDataProvider.configuration().layoutVertical;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "configurationName", {
            get: function () {
                return this.provider.configurationName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "configurationNamespace", {
            get: function () {
                return this.provider.configurationNamespace;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "initialConfiguration", {
            get: function () {
                return this.provider.initialConfiguration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "controlName", {
            get: function () {
                return this.chartDataProvider.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "name", {
            get: function () {
                return this.provider.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProviderFacade.prototype, "lock", {
            get: function () {
                return this.provider.lock;
            },
            enumerable: false,
            configurable: true
        });
        SeriesChartDataProviderFacade.prototype.filter = function (data) {
            return this.chartDataProvider.filter(data);
        };
        SeriesChartDataProviderFacade.prototype.updateTimeSeriesMode = function (timeSeriesMode) {
            this.provider.updateTimeSeriesMode(timeSeriesMode);
        };
        SeriesChartDataProviderFacade.prototype.updateSeriesTimeConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.updateSeriesTimeConfigurationAsync(configuration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.backAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.backAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.forwardAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.forwardAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.loadConfigurationAsync = function (name, namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                var configuration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.getConfigurationAsync(name, namespace)];
                        case 1:
                            configuration = _a.sent();
                            this.provider.updateConfigurationTarget(name, namespace);
                            return [4 /*yield*/, this.provider.loadNewConfigurationAsync(configuration.configuration)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.chartDataProvider.loadNewConfigurationAsync(configuration.configuration)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.listConfigurationsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.listConfigurationsAsync()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.deleteConfigurationAsync = function (id, name) {
            if (name === void 0) { name = null; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.deleteConfigurationAsync(id, name)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.updateConfigurationAsync = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var configuration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            configuration = _.extend({}, this.provider.configuration(), this.chartDataProvider.configuration());
                            return [4 /*yield*/, this.provider.updateConfigurationAsync(name, configuration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.getConfigurationAsync = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.getConfigurationAsync(name)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.createConfigurationAsync = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var configuration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            configuration = _.extend({}, this.provider.configuration(), this.chartDataProvider.configuration());
                            return [4 /*yield*/, this.provider.createConfigurationAsync(name, configuration)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.subscribeStartValues = function (callback, target, event) {
            return this.chartDataProvider.subscribeStartValues(callback, target, event);
        };
        SeriesChartDataProviderFacade.prototype.subscribeEndValues = function (callback, target, event) {
            return this.chartDataProvider.subscribeEndValues(callback, target, event);
        };
        SeriesChartDataProviderFacade.prototype.requestCountAsync = function (start, end) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.chartDataProvider.requestCountAsync(start, end)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.requestZoomUpdateAsync = function (start, end) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.chartDataProvider.requestZoomUpdateAsync(start, end)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.updateAxesConfiguration = function (configuration) {
            this.chartDataProvider.updateAxesConfiguration(configuration);
        };
        SeriesChartDataProviderFacade.prototype.updateCursorData = function (series, coursor, data, date) {
            this.chartDataProvider.updateCursorData(series, coursor, data, date);
        };
        SeriesChartDataProviderFacade.prototype.updateSeriesConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.chartDataProvider.updateSeriesConfigurationAsync(configuration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProviderFacade.prototype.updateRegionConfiguration = function (configuration) {
            this.chartDataProvider.updateRegionConfiguration(configuration);
        };
        SeriesChartDataProviderFacade.prototype.startGettingUpdates = function () {
            this.provider.startGettingUpdates();
        };
        SeriesChartDataProviderFacade.prototype.addData = function (data, seriesNames) {
            this.provider.addData(data, seriesNames);
        };
        SeriesChartDataProviderFacade.prototype.updateStatisticsData = function (data, seriesNames) {
            this.provider.updateStatisticsData(data, seriesNames);
        };
        SeriesChartDataProviderFacade.prototype.requestData = function () {
            this.provider.requestData();
        };
        return SeriesChartDataProviderFacade;
    }());
    exports.SeriesChartDataProviderFacade = SeriesChartDataProviderFacade;
});
//# sourceMappingURL=series-chart-data-provider.facade.js.map