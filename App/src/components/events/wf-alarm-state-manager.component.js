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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define(["require", "exports", "../component-base.model", "../../services/alarmsService", "../../services/alarmDefinitionsService", "../../services/logger"], function (require, exports, ComponentBaseModel, AlarmsService, alarmDefinitionsService, Logger) {
    "use strict";
    var WfAlarStateComponent = /** @class */ (function (_super) {
        __extends(WfAlarStateComponent, _super);
        function WfAlarStateComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.subscriptions = [];
            _this.items = ko.observableArray([]);
            _this.count = 100;
            _this.pattern = ko.observable("").extend({ throttle: 500 });
            _this.isLoading = ko.observable(false);
            _this.hasMore = ko.observable(false);
            _this.alarmGroups = ko.observableArray();
            _this.alarmTypes = ko.observableArray();
            _this.selectedAlarmTypes = ko.observableArray([]).extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });
            _this.selectedAlarmGroups = ko.observableArray([]).extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });
            _this.getAlarmsAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmProcessingAndDisplayDataPromise, alarmDefinitionsPromise, alarmProcessingAndDisplayData, alarmDefinitions, mergedAlarms, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            this.isLoading(true);
                            alarmProcessingAndDisplayDataPromise = this.getAlarmsWithChangedProcessingAndDisplayStateAsync();
                            alarmDefinitionsPromise = this.getPagedAlarms();
                            return [4 /*yield*/, alarmProcessingAndDisplayDataPromise];
                        case 1:
                            alarmProcessingAndDisplayData = _a.sent();
                            return [4 /*yield*/, alarmDefinitionsPromise];
                        case 2:
                            alarmDefinitions = _a.sent();
                            mergedAlarms = this.mergeStates(alarmProcessingAndDisplayData, alarmDefinitions.slice(0, this.count));
                            this.items(mergedAlarms);
                            this.items.valueHasMutated();
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            this.hasMore(false);
                            this.items([]);
                            this.connector.error(WfAlarStateComponent, error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            _this.getAlarmGroupsAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmGroups, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getAlarmGroups(this.connector.currentLanguageId())];
                        case 1:
                            alarmGroups = _a.sent();
                            this.alarmGroups(alarmGroups);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.alarmGroups([]);
                            this.connector.error(WfAlarStateComponent, error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            _this.getAlarmTypesAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmTypes, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getAlarmTypes(this.connector.currentLanguageId())];
                        case 1:
                            alarmTypes = _a.sent();
                            this.alarmTypes(alarmTypes);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.alarmTypes([]);
                            this.connector.error(WfAlarStateComponent, error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            _this.alarmStateUpdatesSignal = _this.connector.getSignal(WfAlarStateComponent.AlarmStateUpdates);
            _this.subscriptions.push(_this.alarmStateUpdatesSignal.value.subscribe(_this.getAlarmsAsync));
            _this.subscriptions.push(_this.pattern.subscribe(_this.getAlarmsAsync));
            _this.subscriptions.push(_this.connector.currentLanguageId.subscribe(function () {
                _this.getAlarmGroupsAsync();
                _this.getAlarmTypesAsync();
                _this.getAlarmsAsync();
            }));
            _this.subscriptions.push(_this.connector.currentLoggedInUser.subscribe(function () {
                _this.getAlarmGroupsAsync();
                _this.getAlarmTypesAsync();
                _this.getAlarmsAsync();
            }));
            _this.pattern(ko.unwrap(_this.settings.tag) !== undefined ? ko.unwrap(_this.settings.tag) : "");
            _this.count = ko.unwrap(_this.settings.count) !== undefined ? ko.unwrap(_this.settings.count) : _this.count;
            _this.selectedAlarmGroups(ko.unwrap(_this.settings.alarmGroups) !== undefined ? ko.unwrap(_this.settings.alarmGroups) : []);
            _this.selectedAlarmTypes(ko.unwrap(_this.settings.alarmTypes) !== undefined ? ko.unwrap(_this.settings.alarmTypes) : []);
            _this.subscriptions.push(_this.selectedAlarmTypes.subscribe(_this.getAlarmsAsync));
            _this.subscriptions.push(_this.selectedAlarmGroups.subscribe(_this.getAlarmsAsync));
            _this.getAlarmGroupsAsync();
            _this.getAlarmTypesAsync();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfAlarStateComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            var columns = this.getNameOfAlarmFields(ko.unwrap(this.settings.columns) || ["AlarmTag", "SignalName", "Text", "State"]); // default
            this.columns = {
                headers: ko.observableArray(this.getColumnHeaders(columns)),
                data: ko.observableArray(columns)
            };
            this.showSettingsDialog = ko.observable(false);
            this.filterAlarmGroupsByUser = ko.unwrap(this.settings.filterAlarmGroupsByUser) !== undefined ? ko.unwrap(this.settings.filterAlarmGroupsByUser) : false;
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
            this.height = ko.observable(ko.unwrap(this.settings.height) || null);
            this.panelBodyHeight = ko.pureComputed(function () {
                if (!_this.height()) {
                    return null;
                }
                if (_this.headerVisibility()) {
                    return _this.height() - 42;
                }
                return _this.height();
            });
            this.titleText = ko.observable(ko.unwrap(this.settings.titleText) || "WEBfactory AlarmStateManager");
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.sortingData = ko.observable(null);
            this.alarms = ko.pureComputed(function () {
                if (_this.sortingData()) {
                    return _this.items().sort(function (a, b) {
                        var x = a[_this.columns.data()[_this.sortingData().index]];
                        var y = b[_this.columns.data()[_this.sortingData().index]];
                        return _this.sortingData().asc ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }
                return _this.items();
            });
        };
        WfAlarStateComponent.prototype.getFilterAlarmGroupsByUser = function () {
            return {
                FilterAlarmGroupsByUser: this.filterAlarmGroupsByUser,
                UserName: this.connector.currentLoggedInUser() ? this.connector.currentLoggedInUser() : ""
            };
        };
        WfAlarStateComponent.prototype.getNameOfAlarmFields = function (columns) {
            return _.map(columns, function (column) {
                switch (column) {
                    case 'Text':
                        return "AlarmSymbolicTextTranslation";
                    case 'Name':
                        return "AlarmTag";
                    case 'SignalName':
                        return "SignalName";
                    case 'OpcItem':
                        return "OPCItemName";
                    default:
                        return column;
                }
            });
        };
        WfAlarStateComponent.prototype.getColumnHeaders = function (columns) {
            return _.map(columns, function (column) {
                switch (column) {
                    case 'AlarmSymbolicTextTranslation':
                        return "I4SCADA_Text";
                    case 'AlarmTag':
                        return "I4SCADA_Name";
                    case 'SignalName':
                        return "I4SCADA_Signal_Name";
                    case 'OPCItemName':
                        return "I4SCADA_OpcItem";
                    case 'State':
                        return "I4SCADA_State";
                }
            });
        };
        WfAlarStateComponent.prototype.showSettings = function () {
            this.showSettingsDialog(true);
        };
        WfAlarStateComponent.prototype.closeSettings = function () {
            this.showSettingsDialog(false);
        };
        WfAlarStateComponent.prototype.getAlarmsWithChangedProcessingAndDisplayStateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, AlarmsService.getAlarmsWithChangedProcessingAndDisplayState(this.connector.currentLanguageId())];
                });
            });
        };
        WfAlarStateComponent.prototype.getAlarmDefinitionsAsync = function (start, count) {
            return __awaiter(this, void 0, void 0, function () {
                var filter;
                return __generator(this, function (_a) {
                    filter = __assign({ Tag: "*" + this.pattern() + "*", Start: start, Count: count, LangID: this.connector.currentLanguageId(), 
                        // not usable because paging worke like this: it will not page after the filtered groups and types it will page after the row count, 
                        // then it could happend a item will not be shown.
                        // the tag filter will work, because it page correctly after the filtered tages.
                        Groups: this.selectedAlarmGroups(), Types: this.selectedAlarmTypes() }, this.getFilterAlarmGroupsByUser());
                    return [2 /*return*/, alarmDefinitionsService.getAlarmDefinitions(filter)];
                });
            });
        };
        WfAlarStateComponent.prototype.getRequestingSize = function () {
            if (_.any(this.selectedAlarmGroups()) || _.any(this.selectedAlarmTypes()))
                return _.max([WfAlarStateComponent.AlarmDefinitionRequestingSizeWithParams, this.count]);
            return _.max([WfAlarStateComponent.AlarmDefinitionRequestingSize, this.count]);
        };
        WfAlarStateComponent.prototype.getPagedAlarms = function () {
            return __awaiter(this, void 0, void 0, function () {
                var start, hasMore, alarms, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = 0;
                            hasMore = true;
                            alarms = [];
                            this.hasMore(true);
                            _a.label = 1;
                        case 1: return [4 /*yield*/, this.getAlarmDefinitionsAsync(start, this.getRequestingSize())];
                        case 2:
                            data = _a.sent();
                            Array.prototype.push.apply(alarms, data.Definitions);
                            hasMore = data.HasMore;
                            start += this.getRequestingSize();
                            this.hasMore(data.HasMore);
                            _a.label = 3;
                        case 3:
                            if (hasMore && alarms.length < this.count) return [3 /*break*/, 1];
                            _a.label = 4;
                        case 4: return [2 /*return*/, alarms];
                    }
                });
            });
        };
        WfAlarStateComponent.prototype.mergeStates = function (alarmProcessingAndDisplayData, alarmDefinitions) {
            return alarmDefinitions.map(function (item) {
                var state = _.find(alarmProcessingAndDisplayData, (function (alarm) { return alarm.AlarmID === item.ID; }));
                return {
                    AlarmID: item.ID,
                    AlarmSymbolicTextTranslation: item.SymbolicTextTranslation,
                    AlarmTag: item.Tag,
                    OPCItemName: item.Signal.Name,
                    SignalName: item.Signal.AliasName,
                    State: state != null ? state.State : AlarmProcessingAndDisplayState.ProcessedAndVisible
                };
            });
        };
        WfAlarStateComponent.prototype.activateOrDeactivateAlarmStateAsync = function (alarm, event) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, AlarmsService.setAlarmState(alarm.AlarmID, parseInt($(event.target).val()), moment(new Date(9999, 1, 1, 23, 59, 59)))];
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
                            error_4 = _a.sent();
                            this.connector.error(WfAlarStateComponent, error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarStateComponent.prototype.getTranslatesState = function (state) {
            return this.connector.translate("I4SCADA_" + AlarmProcessingAndDisplayState[state])();
        };
        WfAlarStateComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, subscription;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _d.sent();
                            try {
                                for (_a = __values(this.subscriptions), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    subscription = _b.value;
                                    subscription.dispose();
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            if (this.alarmStateUpdatesSignal) {
                                this.connector.unregisterSignals(this.alarmStateUpdatesSignal);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarStateComponent.AlarmStateUpdates = "WFSInternal_AlarmStateUpdates";
        WfAlarStateComponent.AlarmDefinitionRequestingSize = 100;
        WfAlarStateComponent.AlarmDefinitionRequestingSizeWithParams = 1000;
        return WfAlarStateComponent;
    }(ComponentBaseModel));
    return WfAlarStateComponent;
});
//# sourceMappingURL=wf-alarm-state-manager.component.js.map