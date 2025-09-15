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
define(["require", "exports", "../../../../services/alarmsService", "../../../../services/connector", "../../../../services/signalsService", "../models/signal-with-alarm-info.model", "../../../../services/logger", "../../../../decorators/busyIndicator", "../models/signal-alarm-list-header.model", "../models/signal-alarm-list-fields.model"], function (require, exports, AlarmsService, Connector, SignalsService, signal_with_alarm_info_model_1, Logger, BusyIndicator, signal_alarm_list_header_model_1, signal_alarm_list_fields_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalAlarmListService = void 0;
    var SignalAlarmListService = /** @class */ (function () {
        function SignalAlarmListService(signalAlarmColumnNameService) {
            var _this = this;
            this.signalAlarmColumnNameService = signalAlarmColumnNameService;
            this.connector = new Connector();
            this.items = ko.observableArray([]);
            this.signalAlarmListHeaders = ko.observableArray([]);
            this.subscriptions = [];
            this.maxSignalCount = ko.observable(50);
            this.hasMoreSignals = ko.observable(false);
            this.aliasNames = ko.observableArray([]);
            this.updatePromise = null;
            this.update = ko.observable(false).extend({ notify: 'always', rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
            this.activateOrDeactivateAlarmStateAsync = function (ids, state) { return __awaiter(_this, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, AlarmsService.setAlarmStates(ids, ids.map(function (_) { return state; }), ids.map(function (x) { return moment(new Date(9999, 1, 1, 23, 59, 59)).toMSDate(); }))];
                        case 1:
                            result = _a.sent();
                            if (result === false) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Change_alarm_state_failed")());
                            }
                            if (result === true) {
                                Logger.successToast(this.connector.translate("I4SCADA_Change_alarm_state_successful")());
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.error(SignalAlarmListService, error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.updateAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var signalsWithAlarms, promises, chunk, i, j, temporary, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            if (this.updatePromise) {
                                Logger.warn(this, "Unable to update update is running.");
                                return [2 /*return*/];
                            }
                            if (!this.items()) return [3 /*break*/, 2];
                            signalsWithAlarms = this.items().filter(function (x) { return x.alarmInfos != null && x.alarmInfos.length > 0; });
                            if (!signalsWithAlarms.length)
                                return [2 /*return*/];
                            promises = [];
                            chunk = 500;
                            for (i = 0, j = signalsWithAlarms.length; i < j; i += chunk) {
                                temporary = signalsWithAlarms.slice(i, i + chunk);
                                promises.push(this.getSignals(temporary));
                                ;
                            }
                            this.updatePromise = Promise.all(promises);
                            return [4 /*yield*/, this.updatePromise];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            Logger.error(this, "Unable to update signals ", error_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.updatePromise = null;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            this.order = function (order, sortItem) {
                var e_1, _a;
                try {
                    for (var _b = __values(_this.signalAlarmListHeaders()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var iterator = _c.value;
                        iterator.sortOrder(null);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                sortItem.sortOrder(order);
                if (sortItem.propertyName != "Value") {
                    _this.getDataAsync();
                }
                else {
                    _this.items.sort(function (a, b) {
                        var x = a.value();
                        var y = b.value();
                        if ($.isNumeric(x))
                            x = numeral(x).value();
                        if ($.isNumeric(y))
                            y = numeral(y).value();
                        return sortItem.sortOrder() === SortOrder.ASC ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }
            };
            this.busyContext = new BusyIndicator(this);
            this.alarmStateUpdatesSignal = this.connector.getSignal(SignalAlarmListService.AlarmStateUpdates);
            this.alarmUpdatesSignal = this.connector.getSignal(SignalAlarmListService.AlarmUpdates);
            this.subscriptions.push(this.alarmStateUpdatesSignal.value.subscribe(function () { return _this.update(true); }));
            this.subscriptions.push(this.alarmUpdatesSignal.value.subscribe(function () { return _this.update(true); }));
            this.subscriptions.push(this.update.subscribe(this.updateAsync));
            this.subscriptions.push(this.connector.currentLanguageId.subscribe(function () {
                _this.getDataAsync();
            }));
            this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(function () {
                _this.getDataAsync();
            }));
        }
        SignalAlarmListService.prototype.dispose = function () {
            var e_2, _a;
            try {
                for (var _b = __values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var subscription = _c.value;
                    subscription.dispose();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.connector.unregisterSignals(this.alarmStateUpdatesSignal, this.alarmUpdatesSignal);
        };
        SignalAlarmListService.prototype.onSignalsSelected = function (aliasNames) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.pattern = null;
                    this.unit = null;
                    this.aliasNames(aliasNames);
                    this.getDataAsync();
                    return [2 /*return*/];
                });
            });
        };
        SignalAlarmListService.prototype.onSettingsApplied = function (columnsOrder, maxSignalPageCount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.maxSignalCount(maxSignalPageCount);
                            this.setSignalInformationColumns(columnsOrder);
                            return [4 /*yield*/, this.getDataAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SignalAlarmListService.prototype.getDataAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.busyContext.runLongAction("Getting Signals", function () { return __awaiter(_this, void 0, void 0, function () {
                                var pattern, unit, items, discreteValueSignals, signals, _loop_1, this_1, _a, _b, signal, error_3;
                                var e_3, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            pattern = this.pattern ? "*" + this.pattern + "*" : null;
                                            unit = this.unit || null;
                                            _d.label = 1;
                                        case 1:
                                            _d.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, SignalsService.getSignalsWithAlarmInfo({
                                                    Pattern: pattern,
                                                    Unit: unit,
                                                    AliasNames: this.aliasNames(),
                                                    Order: this.getOrderFragments()
                                                }, 0, Math.max(Math.min(this.maxSignalCount(), 2147483647), 1))];
                                        case 2:
                                            items = _d.sent();
                                            return [4 /*yield*/, this.connector.getSignalDefinitions(items.Data.filter(function (x) { return x.DiscreteValueTypeID != null; }).map(function (x) { return x.AliasName; }))];
                                        case 3:
                                            discreteValueSignals = (_d.sent());
                                            signals = [];
                                            _loop_1 = function (signal) {
                                                var discreteValueSignal = discreteValueSignals.find(function (x) { return x.ID === signal.SignalId; });
                                                var discreteValues = null;
                                                if (discreteValueSignal) {
                                                    discreteValues = discreteValueSignal.DiscreteValues;
                                                }
                                                var item = this_1.createSignalWithAlarmInfoItem(signal, discreteValues, this_1.colors);
                                                signals.push(item);
                                            };
                                            this_1 = this;
                                            try {
                                                for (_a = __values(items.Data), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                    signal = _b.value;
                                                    _loop_1(signal);
                                                }
                                            }
                                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                            finally {
                                                try {
                                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                                }
                                                finally { if (e_3) throw e_3.error; }
                                            }
                                            this.items(signals);
                                            this.hasMoreSignals(items.Count > items.Data.length);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            error_3 = _d.sent();
                                            this.connector.handleError(SignalAlarmListService)(error_3);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SignalAlarmListService.prototype.getSignals = function (signalsWithAlarms) {
            return __awaiter(this, void 0, void 0, function () {
                var items, _loop_2, this_2, _a, _b, item, error_4;
                var e_4, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, SignalsService.getSignalsWithAlarmInfo({
                                    AliasNames: signalsWithAlarms.map(function (x) { return x.aliasName; })
                                }, 0, signalsWithAlarms.length)];
                        case 1:
                            items = _d.sent();
                            _loop_2 = function (item) {
                                var signal = this_2.items().find(function (x) { return x.signalId === item.SignalId; });
                                if (signal) {
                                    signal.updateCounts(item);
                                }
                            };
                            this_2 = this;
                            try {
                                for (_a = __values(items.Data), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    item = _b.value;
                                    _loop_2(item);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _d.sent();
                            Logger.error(this, "Unable to get signal update", error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /*
         * header functionality
         */
        SignalAlarmListService.prototype.setSignalInformationColumns = function (columns) {
            var e_5, _a;
            this.signalAlarmListHeaders([]);
            try {
                for (var columns_1 = __values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
                    var item = columns_1_1.value;
                    this.signalAlarmListHeaders.push(this.createSignalAlarmListHeaderItem(item));
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        SignalAlarmListService.prototype.createSignalAlarmListHeaderItem = function (name) {
            return new signal_alarm_list_header_model_1.SignalAlarmListHeader(this.getOrderItems(name), this.getPropertyName(name), this.getDisplayName(name), this.order, this.getDefaultSortOrder(name));
        };
        SignalAlarmListService.prototype.getDefaultSortOrder = function (name) {
            if (name === signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AliasName)
                return SortOrder.ASC;
            return null;
        };
        SignalAlarmListService.prototype.getOrderItems = function (name) {
            if (name === signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmStatus)
                return [signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.OnCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AcknowledgedCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.OffCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.InactiveCount];
            if (name === signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus)
                return [signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.ProcessedButNotVisibleCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.NotProcessedAndNotVisibleCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.ProcessedAndVisibleCount, signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.NotProcessedButVisibleCount];
            return [name];
        };
        SignalAlarmListService.prototype.getPropertyName = function (name) {
            return name;
        };
        SignalAlarmListService.prototype.getDisplayName = function (name) {
            return this.signalAlarmColumnNameService.getSymbolicText(name);
        };
        SignalAlarmListService.prototype.getOrderFragments = function () {
            var e_6, _a;
            var orderItems = [];
            try {
                for (var _b = __values(this.signalAlarmListHeaders()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var iterator = _c.value;
                    orderItems.push.apply(orderItems, __spread(iterator.getOrderFragment()));
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            if (!orderItems.find(function (x) { return x.Key === signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AliasName; }) && orderItems.length === 0) {
                orderItems.push({
                    Key: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AliasName,
                    Value: SortOrder.ASC
                });
            }
            return orderItems;
        };
        SignalAlarmListService.prototype.createSignalWithAlarmInfoItem = function (item, discreteValues, colors) {
            var signal = this.connector.getSignal(item.AliasName, false);
            return new signal_with_alarm_info_model_1.SignalWithAlarmInfo(item, discreteValues, colors, this.activateOrDeactivateAlarmStateAsync).updateValue(signal.value);
        };
        SignalAlarmListService.AlarmStateUpdates = "WFSInternal_AlarmStateUpdates";
        SignalAlarmListService.AlarmUpdates = "WFSInternal_AlarmUpdates";
        return SignalAlarmListService;
    }());
    exports.SignalAlarmListService = SignalAlarmListService;
});
//# sourceMappingURL=signal-alarm-list.service.js.map