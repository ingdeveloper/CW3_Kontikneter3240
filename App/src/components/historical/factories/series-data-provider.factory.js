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
define(["require", "exports", "../providers/series-chart-data-provider", "../providers/series-data-provider"], function (require, exports, series_chart_data_provider_1, series_data_provider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesChartDataProviderFactory = exports.SeriesDataProviderFactory = void 0;
    var SeriesDataProviderFactory = /** @class */ (function () {
        function SeriesDataProviderFactory() {
        }
        SeriesDataProviderFactory.prototype.create = function (name, configuration, configurationSettings) {
            var provider = new series_data_provider_1.SeriesDataProvider(name);
            this.update(provider, configuration);
            provider.configurationSettings(configurationSettings);
            provider.reloadHistoricalDataConfigurationService();
            return provider;
        };
        SeriesDataProviderFactory.prototype.update = function (provider, configuration) {
            provider.configuration(configuration);
            provider.timeSeriesMode(configuration.timeSeriesMode);
            provider.timeConfiguration(configuration);
        };
        return SeriesDataProviderFactory;
    }());
    exports.SeriesDataProviderFactory = SeriesDataProviderFactory;
    var SeriesChartDataProviderFactory = /** @class */ (function () {
        function SeriesChartDataProviderFactory() {
        }
        SeriesChartDataProviderFactory.prototype.createAsync = function (name, globalSeriesConnector, provider, configuration) {
            return __awaiter(this, void 0, void 0, function () {
                var chartProvider;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            chartProvider = new series_chart_data_provider_1.SeriesChartDataProvider(name, provider, globalSeriesConnector);
                            this.update(chartProvider, configuration);
                            return [4 /*yield*/, chartProvider.createSeriesAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, chartProvider];
                    }
                });
            });
        };
        SeriesChartDataProviderFactory.prototype.update = function (provider, configuration) {
            provider.configuration(configuration);
            provider.axes(configuration.axes.slice());
            provider.series(configuration.series.slice());
            provider.regions(configuration.regions.slice());
            provider.legend(configuration.legend);
            provider.export(configuration.export);
            provider.scrollbar(configuration.scrollbar);
        };
        return SeriesChartDataProviderFactory;
    }());
    exports.SeriesChartDataProviderFactory = SeriesChartDataProviderFactory;
});
//# sourceMappingURL=series-data-provider.factory.js.map