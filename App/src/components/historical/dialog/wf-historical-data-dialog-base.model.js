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
define(["require", "exports", "../../component-base.model", "../historical-data", "../models/series.model"], function (require, exports, ComponentBaseModel, historical_data_1, series_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WfHistoricalDataBaseModel = void 0;
    var WfHistoricalDataBaseModel = /** @class */ (function (_super) {
        __extends(WfHistoricalDataBaseModel, _super);
        function WfHistoricalDataBaseModel(params) {
            var _this = _super.call(this, params) || this;
            _this.isLoading = ko.observable(false);
            _this.items = ko.observableArray([]);
            _this.item = ko.observable(null);
            _this.errors = ko.validation.group([_this.item, _this.items], { deep: true, live: true, observable: true });
            _this.dialog = ko.observable(false);
            _this.onAdd = function () {
                var item = _this.item();
                item = _this.createItem();
                _this.item(item);
                _this.items.push(item);
            };
            _this.getProvidersAsync();
            _this.dialogSubscription = _this.dialog.subscribe(function (value) {
                value ? _this.snapshotOnlineMode() : _this.restoreOnlineMode();
            });
            return _this;
        }
        WfHistoricalDataBaseModel.prototype.snapshotOnlineMode = function () {
            this.timeSeriesMode = this.provider.timeSeriesMode();
            if (this.timeSeriesMode === series_model_1.TimeSeriesMode.Online) {
                this.provider.updateTimeSeriesMode(series_model_1.TimeSeriesMode.Offline);
            }
        };
        WfHistoricalDataBaseModel.prototype.restoreOnlineMode = function () {
            this.provider.updateTimeSeriesMode(this.timeSeriesMode);
        };
        WfHistoricalDataBaseModel.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.css = this.settings.css || "btn btn-default";
            this.showLabel = this.settings.showLabel || false;
        };
        WfHistoricalDataBaseModel.prototype.getProvidersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, historical_data_1.HistoricalData.seriesConnector.subscribeAsync(this.settings.groupName, this.settings.controlName)];
                        case 1:
                            _a.provider = _b.sent();
                            this.loadingSubscription = this.provider.isLoading.subscribe(function (value) {
                                _this.isLoading(value);
                            });
                            this.isLoading(this.provider.isLoading());
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataBaseModel.prototype.onClicked = function () {
            var _this = this;
            this.dialog(true);
            this.items(this.getProviderItems().slice().map(function (item) { return _this.createItem(item, true); }));
            this.setSelectedItem();
            this.loadProviderAdditionalData();
        };
        WfHistoricalDataBaseModel.prototype.setSelectedItem = function () {
            var item = _.first(this.items());
            this.item(item);
        };
        WfHistoricalDataBaseModel.prototype.onDialog = function () {
            var _this = this;
            this.updateProviderConfiguration(this.items().map(function (item) { return _this.getConfiguration(item); }));
            this.onClose();
        };
        WfHistoricalDataBaseModel.prototype.onClose = function () {
            this.items([]);
            this.dialog(false);
        };
        WfHistoricalDataBaseModel.prototype.onSelected = function (item) {
            this.item(item);
        };
        WfHistoricalDataBaseModel.prototype.onDelete = function (item) {
            var e_1, _a;
            if (item === this.item()) {
                this.setSelectedItem();
            }
            this.items.remove(item);
            this.setSelectedItem();
            try {
                for (var _b = __values(this.items()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item_1 = _c.value;
                    item_1.notifySubscribers();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        WfHistoricalDataBaseModel.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialog;
                return __generator(this, function (_a) {
                    this.dialogSubscription.dispose();
                    historical_data_1.HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
                    dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
                    dialog.remove();
                    this.loadingSubscription.dispose();
                    return [2 /*return*/];
                });
            });
        };
        return WfHistoricalDataBaseModel;
    }(ComponentBaseModel));
    exports.WfHistoricalDataBaseModel = WfHistoricalDataBaseModel;
});
//# sourceMappingURL=wf-historical-data-dialog-base.model.js.map