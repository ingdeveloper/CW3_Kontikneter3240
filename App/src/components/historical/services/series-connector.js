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
define(["require", "exports", "../../../services/connector", "../factories/series-data-provider.factory", "../factories/series-configuration.factory", "../../services/time-range.service", "../../../services/logger", "../../../services/models/logValuesFilter", "../models/series.model", "../factories/series-configuration-settings.factory", "../providers/series-chart-data-provider.facade"], function (require, exports, Connector, series_data_provider_factory_1, series_configuration_factory_1, time_range_service_1, Logger, LogValuesFilter, series_model_1, series_configuration_settings_factory_1, series_chart_data_provider_facade_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesConnector = void 0;
    var SeriesConnector = /** @class */ (function () {
        function SeriesConnector() {
            this.connector = new Connector();
            this.providers = {};
            this.controlProviders = {};
            this.refreshSubscriptions = {};
            this.seriesConfigurationFactory = new series_configuration_factory_1.SeriesConfigurationFactory();
            this.seriesChartConfigurationFactory = new series_configuration_factory_1.SeriesChartConfigurationFactory();
            this.seriesConfigurationSettingsFactory = new series_configuration_settings_factory_1.SeriesConfigurationSettingsFactory();
            this.seriesDataProviderFactory = new series_data_provider_factory_1.SeriesDataProviderFactory();
            this.seriesChartDataProviderFactory = new series_data_provider_factory_1.SeriesChartDataProviderFactory();
            this.timer = null;
            this.polling = true;
            this.lock = false;
            this.start();
        }
        SeriesConnector.prototype.subscribeAsync = function (name, comtrolName, configuration, configurationSettings) {
            if (configuration === void 0) { configuration = null; }
            if (configurationSettings === void 0) { configurationSettings = null; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.subscribeAsyncByConfiguration(name, comtrolName, configuration, configuration, configurationSettings)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesConnector.prototype.subscribeAsyncByConfiguration = function (name, comtrolName, commonConfiguration, chartConfiguration, configurationSettings) {
            if (commonConfiguration === void 0) { commonConfiguration = null; }
            if (chartConfiguration === void 0) { chartConfiguration = null; }
            if (configurationSettings === void 0) { configurationSettings = null; }
            return __awaiter(this, void 0, void 0, function () {
                var promise, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (name === undefined)
                                throw new Error("Subscription failed, name is not defined.");
                            if (comtrolName === undefined)
                                throw new Error("Subscription failed, comtrolName is not defined.");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.subscribePromise];
                        case 2:
                            _a.sent();
                            promise = this.subscribePromise = this.subscribeAsyncBase(name, comtrolName, commonConfiguration, chartConfiguration, configurationSettings);
                            return [4 /*yield*/, promise];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.subscribeAsyncBase = function (name, comtrolName, commonConfiguration, chartConfiguration, configurationSettings) {
            if (commonConfiguration === void 0) { commonConfiguration = null; }
            if (chartConfiguration === void 0) { chartConfiguration = null; }
            if (configurationSettings === void 0) { configurationSettings = null; }
            return __awaiter(this, void 0, void 0, function () {
                var defaultConfiguration, defaultSeriesChartConfiguration, defaultConfigurationSettings, provider, controlProvider, _a, _b, configuration;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            defaultConfiguration = this.seriesConfigurationFactory.create(commonConfiguration);
                            defaultSeriesChartConfiguration = this.seriesChartConfigurationFactory.create(chartConfiguration);
                            defaultConfigurationSettings = this.seriesConfigurationSettingsFactory.create(configurationSettings);
                            provider = null;
                            controlProvider = null;
                            if (name in this.providers) {
                                if (configurationSettings && defaultConfigurationSettings) {
                                    this.providers[name].configurationSettings(defaultConfigurationSettings);
                                    this.providers[name].reloadHistoricalDataConfigurationService();
                                }
                                if (commonConfiguration && defaultConfiguration) {
                                    this.providers[name].configuration(defaultConfiguration);
                                    this.seriesDataProviderFactory.update(this.providers[name], defaultConfiguration);
                                }
                            }
                            else {
                                this.providers[name] = this.seriesDataProviderFactory.create(name, defaultConfiguration, defaultConfigurationSettings);
                                this.refreshSubscriptions[name] = this.providers[name].requestRefresh.subscribe(function () {
                                    _this.requestDataAsync(_this.providers[name]);
                                });
                            }
                            if (this.providers[name]) {
                                this.providers[name].addSubscriber();
                            }
                            provider = this.providers[name];
                            return [4 /*yield*/, this.subscribePromise];
                        case 1:
                            _c.sent();
                            if (!(comtrolName in this.controlProviders)) return [3 /*break*/, 2];
                            if (chartConfiguration && defaultSeriesChartConfiguration) {
                                this.validateAndCleanSeriesConfiguration(defaultSeriesChartConfiguration);
                                this.controlProviders[comtrolName].configuration(defaultSeriesChartConfiguration);
                                this.seriesChartDataProviderFactory.update(this.controlProviders[comtrolName], defaultSeriesChartConfiguration);
                            }
                            return [3 /*break*/, 7];
                        case 2:
                            this.validateAndCleanSeriesConfiguration(defaultSeriesChartConfiguration);
                            _a = this.controlProviders;
                            _b = comtrolName;
                            return [4 /*yield*/, this.seriesChartDataProviderFactory.createAsync(comtrolName, this, provider, defaultSeriesChartConfiguration)];
                        case 3:
                            _a[_b] = _c.sent();
                            if (!(provider.initialConfiguration !== null)) return [3 /*break*/, 7];
                            return [4 /*yield*/, provider.getConfigurationAsync(provider.initialConfiguration, provider.configurationNamespace)];
                        case 4:
                            configuration = _c.sent();
                            if (!configuration) return [3 /*break*/, 7];
                            provider.updateConfigurationTarget(configuration.name, provider.configurationNamespace);
                            return [4 /*yield*/, provider.loadNewConfigurationAsync(configuration.configuration)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, this.controlProviders[comtrolName].loadNewConfigurationAsync(configuration.configuration)];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7:
                            if (this.controlProviders[comtrolName]) {
                                this.controlProviders[comtrolName].addSubscriber();
                            }
                            controlProvider = this.controlProviders[comtrolName];
                            return [2 /*return*/, new series_chart_data_provider_facade_1.SeriesChartDataProviderFacade(provider, controlProvider)];
                    }
                });
            });
        };
        SeriesConnector.prototype.unSubscribe = function (name, controlName) {
            if (name in this.providers) {
                this.providers[name].releaseSubscriber();
                if (!this.providers[name].hasSubscribers()) {
                    this.providers[name].dispose();
                    delete this.providers[name];
                    this.refreshSubscriptions[name].dispose();
                    delete this.refreshSubscriptions[name];
                }
            }
            if (controlName in this.controlProviders) {
                this.controlProviders[controlName].releaseSubscriber();
                if (!this.controlProviders[controlName].hasSubscribers()) {
                    this.controlProviders[controlName].dispose();
                    delete this.controlProviders[controlName];
                }
            }
        };
        SeriesConnector.prototype.start = function () {
            Logger.info(this, "Starting historical data connector.");
            this.polling = true;
            this.pollDataAsync();
        };
        SeriesConnector.prototype.stop = function () {
            Logger.info(this, "Stopping historical data connector.");
            clearTimeout(this.timer);
            this.timer = null;
            this.polling = false;
        };
        SeriesConnector.prototype.validateAndCleanSeriesConfiguration = function (configuration) {
            var isValid = this.validateSeriesConfiguration(configuration);
            if (isValid === false) {
                this.cleanSeriesConfiguration(configuration);
            }
        };
        SeriesConnector.prototype.validateSeriesConfiguration = function (configuration) {
            Logger.info(this, "Validate series configuration.");
            if (!configuration.series) {
                return true;
            }
            var seriesNames = _.uniq(_.pluck(configuration.series, "name"));
            if (configuration.series.length !== seriesNames.length) {
                Logger.warn(this, "Duplicate series names.");
                return false;
            }
            var axesNames = _.uniq(_.pluck(configuration.axes, "name"));
            if (configuration.axes.length !== axesNames.length) {
                Logger.warn(this, "Duplicate axis names.");
                return false;
            }
            var regionNames = _.uniq(_.pluck(configuration.regions, "name"));
            if (configuration.regions.length !== regionNames.length) {
                Logger.warn(this, "Duplicate range names.");
                return false;
            }
            return true;
        };
        SeriesConnector.prototype.cleanSeriesConfiguration = function (configuration) {
            configuration.series = _.uniq(configuration.series, _.property("name"));
            configuration.axes = _.uniq(configuration.axes, _.property("name"));
            configuration.regions = _.uniq(configuration.regions, _.property("name"));
        };
        SeriesConnector.prototype.pollDataAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.polling)
                                return [2 /*return*/];
                            if (!(Object.keys(this.providers).length > 0)) return [3 /*break*/, 2];
                            // Logger.info(this, `Start requesting historical data.`);
                            return [4 /*yield*/, this.requestOnlineDataAsync()];
                        case 1:
                            // Logger.info(this, `Start requesting historical data.`);
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!this.polling)
                                return [2 /*return*/];
                            clearTimeout(this.timer);
                            this.timer = null;
                            this.timer = window.setTimeout(function () {
                                _this.pollDataAsync();
                            }, SeriesConnector.PollInterval);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestCountAsync = function (provider, start, end) {
            return __awaiter(this, void 0, void 0, function () {
                var filter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = this.getHistoricalStatisticsFilterModel(provider.ids, start, end);
                            return [4 /*yield*/, this.connector.getLogValuesCount(filter)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestSpecificDataAsync = function (provider, start, end) {
            return __awaiter(this, void 0, void 0, function () {
                var filter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.lock) {
                                Logger.info(this, "Skipped requesting historical data because request is running.");
                                return [2 /*return*/];
                            }
                            if (!provider.isUpdating) {
                                Logger.info(this, "Skipped requesting historical data because updating is not enabled.");
                                return [2 /*return*/];
                            }
                            filter = this.getHistoricalDataFilterModel(provider.ids, start, end, null);
                            if (filter.logIds().length === 0) {
                                Logger.info(this, "Skipped requesting historical data because log IDs specified.");
                                return [2 /*return*/];
                            }
                            Logger.info(this, "Request specific historical data for provider " + provider.name + ", start: " + moment(filter.startDate()).format() + ", end: " + moment(filter.endDate()).format());
                            return [4 /*yield*/, this.connector.getPeekLogValues(filter, provider.resolution())];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestDataAsync = function (provider, forceRefresh) {
            if (forceRefresh === void 0) { forceRefresh = true; }
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, 5, 6]);
                            provider.isLoading(true);
                            if (!this.requestPromise) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.requestPromise];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.requestPromise = this.requestDataAsyncBase(provider, forceRefresh);
                            return [4 /*yield*/, this.requestPromise];
                        case 3:
                            _a.sent();
                            this.requestPromise = null;
                            return [3 /*break*/, 6];
                        case 4:
                            error_2 = _a.sent();
                            Logger.error(this, error_2);
                            return [3 /*break*/, 6];
                        case 5:
                            provider.isLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestDataAsyncBase = function (provider, forceRefresh) {
            if (forceRefresh === void 0) { forceRefresh = true; }
            return __awaiter(this, void 0, void 0, function () {
                var statisticsPromise, lastValueBeforePromise, dataPromise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.lock) {
                                Logger.info(this, "Skipped requesting historical data because request is running.");
                                return [2 /*return*/];
                            }
                            if (!provider.isUpdating) {
                                Logger.info(this, "Skipped requesting historical data because updating is not enabled.");
                                return [2 /*return*/];
                            }
                            this.setDates(provider);
                            statisticsPromise = this.requestLogStatisticsAsync(provider);
                            lastValueBeforePromise = this.requestCursorDataAsync(provider);
                            dataPromise = this.requestLogDataAsync(provider, forceRefresh);
                            return [4 /*yield*/, statisticsPromise];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, lastValueBeforePromise];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, dataPromise];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestLogStatisticsAsync = function (provider) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, statisticsFilter, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = this.getHistoricalStatisticsFilter(provider);
                            if (filter.LogIDs.length === 0)
                                return [2 /*return*/];
                            Logger.info(this, "Request historical data statistics for provider " + provider.name + ", start: " + moment(filter.StartDate).format() + ", end: " + moment(filter.EndDate).format());
                            statisticsFilter = this.getHistoricalStatisticsFilter(provider);
                            return [4 /*yield*/, this.connector.getLogStatistics(statisticsFilter)];
                        case 1:
                            data = _a.sent();
                            this.updateStatisticsData(provider, data);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestLastValuesBeforeDateAsync = function (provider) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, promises, filters_1, filters_1_1, filter, i, filter, data;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            filters = this.getLastValuesBeforeDateFilters(provider);
                            if (filters.length === 0)
                                return [2 /*return*/];
                            Logger.info(this, "Request historical cursor data for provider " + provider.name);
                            promises = [];
                            try {
                                for (filters_1 = __values(filters), filters_1_1 = filters_1.next(); !filters_1_1.done; filters_1_1 = filters_1.next()) {
                                    filter = filters_1_1.value;
                                    promises.push(this.connector.getLastValuesBeforeDate([filter.filter], filter.date));
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (filters_1_1 && !filters_1_1.done && (_a = filters_1.return)) _a.call(filters_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            i = 0;
                            _b.label = 1;
                        case 1:
                            if (!(i < filters.length)) return [3 /*break*/, 4];
                            filter = filters[i];
                            return [4 /*yield*/, promises[i]];
                        case 2:
                            data = _b.sent();
                            this.updateCursorData(provider, filter.series, filter.coursor, data[0].Values[0], moment(filter.date).toDate());
                            _b.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestLogDataAsync = function (provider, forceRefresh) {
            if (forceRefresh === void 0) { forceRefresh = true; }
            return __awaiter(this, void 0, void 0, function () {
                var filter, data, timeRangeDates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = this.getHistoricalDataFilter(provider, forceRefresh);
                            if (filter.logIds().length === 0)
                                return [2 /*return*/];
                            Logger.info(this, "Request historical data for provider " + provider.name + ", start: " + moment(filter.startDate()).format() + ", end: " + moment(filter.endDate()).format());
                            if (!(provider.resolution() === null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connector.getLogValues(filter)];
                        case 1:
                            data = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.connector.getPeekLogValues(filter, provider.resolution())];
                        case 3:
                            data = _a.sent();
                            _a.label = 4;
                        case 4:
                            this.addDataToProvider(provider, data, true);
                            timeRangeDates = this.getRangeDates(provider.configuration());
                            provider.removeData(timeRangeDates.startDate);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestOnlineDataAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filters, _a, _b, _i, name_1, filter, promise, statisticsPromise, lastValueBeforePromise, data, provider, timeRangeDates, error_3;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.lock = true;
                            filters = this.getHistoricalDataFilters(true);
                            _a = [];
                            for (_b in filters)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            name_1 = _a[_i];
                            filter = filters[name_1];
                            if (filter.logIds().length === 0) {
                                Logger.info(this, "Skipped requesting online data for provider " + name_1 + " because provider filter has no logs for signals.");
                                return [3 /*break*/, 8];
                            }
                            if (this.providers[name_1].lock === true) {
                                Logger.info(this, "Skipped requesting online data for provider " + name_1 + " because provider is changing configuration.");
                                return [3 /*break*/, 8];
                            }
                            if (!this.providers[name_1].isUpdating) {
                                Logger.info(this, "Skipped requesting online data for provider " + name_1 + " because updating is not enabled.");
                                return [3 /*break*/, 8];
                            }
                            if (this.providers[name_1].isLoading() === true) {
                                Logger.info(this, "Skipped requesting online data for provider " + name_1 + " because chart is loading.");
                                return [3 /*break*/, 8];
                            }
                            Logger.info(this, "Request online data for provider " + name_1 + ", start: " + moment(filter.startDate()).format() + ", end: " + moment(filter.endDate()).format());
                            this.setDates(this.providers[name_1]);
                            promise = this.connector.getLogValues(filter);
                            statisticsPromise = this.requestLogStatisticsAsync(this.providers[name_1]);
                            lastValueBeforePromise = this.requestCursorDataAsync(this.providers[name_1]);
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 6, 7, 8]);
                            return [4 /*yield*/, promise];
                        case 3:
                            data = _c.sent();
                            return [4 /*yield*/, statisticsPromise];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, lastValueBeforePromise];
                        case 5:
                            _c.sent();
                            if (name_1 in this.providers) {
                                provider = this.providers[name_1];
                                this.addDataToProvider(provider, data);
                                timeRangeDates = this.getRangeDates(provider.configuration());
                                provider.removeData(timeRangeDates.startDate);
                            }
                            return [3 /*break*/, 8];
                        case 6:
                            error_3 = _c.sent();
                            console.error(error_3);
                            return [3 /*break*/, 8];
                        case 7:
                            this.lock = false;
                            return [7 /*endfinally*/];
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9:
                            this.lock = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.requestCursorDataAsync = function (provider) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            for (key in this.controlProviders) {
                                if (this.controlProviders[key].provider === provider) {
                                    promises.push(this.requestLastValuesBeforeDateAsync(this.controlProviders[key]));
                                }
                            }
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesConnector.prototype.updateStatisticsData = function (provider, data) {
            Logger.info(this, "Adding statistics data to provider " + provider.name + ".");
            provider.updateStatisticsData(data, provider.seriesDataKeys);
        };
        SeriesConnector.prototype.updateCursorData = function (provider, series, coursor, data, date) {
            Logger.info(this, "Adding coursor data to provider " + provider.name + ", series " + series + ", coursor " + coursor + ".");
            provider.updateCursorData(series, coursor, data, date);
        };
        SeriesConnector.prototype.addDataToProvider = function (provider, data, foreceReset) {
            if (foreceReset === void 0) { foreceReset = false; }
            if (data.length === 0)
                return;
            Logger.info(this, "Adding " + data.length + " intervals to historical data from provider " + provider.name + ".");
            if (foreceReset == true) {
                provider.removeAllData();
            }
            provider.addData(data, provider.seriesDataKeys);
        };
        SeriesConnector.prototype.getLastValuesBeforeDateFilters = function (provider) {
            var e_2, _a;
            var filters = [];
            var filterData = provider.getCursorFilterData();
            try {
                for (var filterData_1 = __values(filterData), filterData_1_1 = filterData_1.next(); !filterData_1_1.done; filterData_1_1 = filterData_1.next()) {
                    var filter = filterData_1_1.value;
                    var date = filter.cursor.timestamp;
                    if (filter.cursor.offsetInterval) {
                        date = moment().subtract(filter.cursor.offset || "minutes", 0 || filter.cursor.offsetInterval).toDate();
                    }
                    filters.push({
                        filter: this.getLastValuesBeforeDateModel(filter.series.signal.ID, filter.series.tag),
                        date: moment(date),
                        series: filter.name,
                        coursor: filter.cursor.name
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (filterData_1_1 && !filterData_1_1.done && (_a = filterData_1.return)) _a.call(filterData_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return filters;
        };
        SeriesConnector.prototype.getHistoricalStatisticsFilter = function (provider) {
            var timeRangeDates = this.getRangeDates(provider.configuration());
            return this.getHistoricalStatisticsFilterModel(provider.ids, timeRangeDates.startDate, timeRangeDates.endDate);
        };
        SeriesConnector.prototype.getLastValuesBeforeDateModel = function (ids, logTag) {
            return {
                SignalID: ids,
                LogTag: logTag
            };
        };
        SeriesConnector.prototype.getHistoricalStatisticsFilterModel = function (ids, start, end) {
            return {
                LogIDs: ids,
                StartDate: moment(start).toMSDateTimeOffset(),
                EndDate: moment(end).toMSDateTimeOffset(),
            };
        };
        SeriesConnector.prototype.getHistoricalDataFilterModel = function (ids, start, end, count) {
            return new LogValuesFilter(ids, moment(start), moment(end), count, LogValuesSortOrder.DateAscending);
        };
        SeriesConnector.prototype.getHistoricalDataFilter = function (provider, forceRefresh) {
            if (forceRefresh === void 0) { forceRefresh = false; }
            var configuration = provider.configuration();
            var timeRangeDates = this.getRangeDates(configuration);
            var start = this.getNextStartDate(configuration.timeSeriesMode, provider.lastTimestamp, timeRangeDates.startDate, forceRefresh);
            return this.getHistoricalDataFilterModel(provider.ids, start, timeRangeDates.endDate, configuration.count);
        };
        SeriesConnector.prototype.getNextStartDate = function (timeSeriesMode, lastTimestamp, startDate, forceRefresh) {
            if (timeSeriesMode === series_model_1.TimeSeriesMode.Online && !forceRefresh) {
                if (lastTimestamp) {
                    return moment(lastTimestamp).add(1, "milliseconds").toDate();
                }
            }
            return startDate;
        };
        SeriesConnector.prototype.getHistoricalDataFilters = function (online) {
            var filters = {};
            for (var name_2 in this.providers) {
                var provider = this.providers[name_2];
                var configuration = provider.configuration();
                if (online && configuration.timeSeriesMode === series_model_1.TimeSeriesMode.Offline) {
                    continue;
                }
                var filter = this.getHistoricalDataFilter(provider);
                filters[name_2] = filter;
            }
            return filters;
        };
        SeriesConnector.prototype.setDates = function (provider) {
            var timeRangeDates = this.getRangeDates(provider.configuration());
            provider.start(timeRangeDates.startDate);
            provider.end(timeRangeDates.endDate);
        };
        SeriesConnector.prototype.getRangeDates = function (configuration) {
            return time_range_service_1.TimeRangeService.getRangeDates(configuration.timeRanges, configuration.timeRange, configuration.start, configuration.end, configuration.startOffsetInterval, configuration.startOffset, configuration.endOffsetInterval, configuration.endOffset);
        };
        SeriesConnector.PollInterval = 3000;
        return SeriesConnector;
    }());
    exports.SeriesConnector = SeriesConnector;
});
//# sourceMappingURL=series-connector.js.map