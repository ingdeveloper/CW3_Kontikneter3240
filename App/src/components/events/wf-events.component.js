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
define(["require", "exports", "../../services/models/operationDiaryFilter", "../component-base.model"], function (require, exports, OperationDiaryFilter, ComponentBaseModel) {
    "use strict";
    var WfEventsComponent = /** @class */ (function (_super) {
        __extends(WfEventsComponent, _super);
        function WfEventsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.subscriptions = [];
            _this.alarmGroups = ko.observableArray();
            _this.alarmTypes = ko.observableArray();
            _this.selectedAlarmTypes = ko.observableArray([]);
            _this.selectedAlarmGroups = ko.observableArray([]);
            _this.users = ko.observableArray();
            _this.showAlarmSettingsDialog = ko.observable(false);
            _this.showTimeSettingsDialog = ko.observable(false);
            _this.showServerSettingsDialog = ko.observable(false);
            _this.showUserSettingsDialog = ko.observable(false);
            _this.showAffectedUserSettingsDialog = ko.observable(false);
            _this.resetSource = function () {
                _this.setFilter();
                _this.source.getWFEvents();
            };
            _this.getAlarmGroupsAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmGroups;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getAlarmGroups(this.connector.currentLanguageId())];
                        case 1:
                            alarmGroups = _a.sent();
                            this.alarmGroups(alarmGroups);
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.getAlarmTypesAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmTypes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getAlarmTypes(this.connector.currentLanguageId())];
                        case 1:
                            alarmTypes = _a.sent();
                            this.alarmTypes(alarmTypes);
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.setEvents();
            _this.initializeFilterAsync();
            _this.subscriptions.push(_this.connector.currentLoggedInUser.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.connector.currentLanguageId.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.selectedAlarmTypes.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.selectedAlarmGroups.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterAlarmOn.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterAlarmOff.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterAlarmAcknowledged.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterAlarmActivated.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterAlarmDeactivated.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterServerStarted.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterServerStopped.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserLoggedIn.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserLoggedOut.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserWroteSignal.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserCreated.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserDeleted.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserModified.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.filterUserPasswordChanged.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.alarmPriorityFrom.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.alarmPriorityTo.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.customUserNameFilter.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.maxEvents.subscribe(_this.resetSource));
            _this.subscriptions.push(_this.connector.currentLanguageId.subscribe(_this.getAlarmGroupsAsync));
            _this.subscriptions.push(_this.connector.currentLanguageId.subscribe(_this.getAlarmTypesAsync));
            _this.subscriptions.push(_this.connector.currentLoggedInUser.subscribe(_this.getAlarmGroupsAsync));
            _this.subscriptions.push(_this.connector.currentLoggedInUser.subscribe(_this.getAlarmTypesAsync));
            _this.getAlarmGroupsAsync();
            _this.getAlarmTypesAsync();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfEventsComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            // this.showAlarmSettingsDialog = ko.observable(false);
            // this.showTimeSettingsDialog = ko.observable(false);
            // this.showServerSettingsDialog = ko.observable(false);
            // this.showUserSettingsDialog = ko.observable(false);
            // this.showAffectedUserSettingsDialog = ko.observable(false);
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
            this.settingsTimeButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsTimeButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsTimeButtonVisibility) : true);
            this.settingsAlarmButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsAlarmButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsAlarmButtonVisibility) : true);
            this.settingsServerButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsServerButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsServerButtonVisibility) : true);
            this.settingsUserButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsUserButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsUserButtonVisibility) : true);
            this.settingsAffectedUserButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsAffectedUserButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsAffectedUserButtonVisibility) : true);
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
            this.titleText = ko.observable(ko.unwrap(this.settings.titleText) || "WEBfactory Events Component Beta");
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 30;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
            this.startDate = ko.observable(moment().subtract(this.startOffsetIntervall, this.startOffset));
            this.endDate = ko.observable(moment().add(this.endOffsetIntervall, this.endOffset));
            this.startDateInput = ko.observable(moment(this.startDate()));
            this.endDateInput = ko.observable(moment(this.endDate()));
            this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
            this.selectedRangeInput = ko.observable(this.selectedRange());
            this.timeRangeDateInput = ko.observable();
            this.filterAlarmOn = ko.observable(ko.unwrap(this.settings.filterAlarmOn) !== undefined ? ko.unwrap(this.settings.filterAlarmOn) : true);
            this.filterAlarmOff = ko.observable(ko.unwrap(this.settings.filterAlarmOff) !== undefined ? ko.unwrap(this.settings.filterAlarmOff) : true);
            this.filterAlarmAcknowledged = ko.observable(ko.unwrap(this.settings.filterAlarmAcknowledged) !== undefined ? ko.unwrap(this.settings.filterAlarmAcknowledged) : true);
            this.filterAlarmActivated = ko.observable(ko.unwrap(this.settings.filterAlarmActivated) !== undefined ? ko.unwrap(this.settings.filterAlarmActivated) : true);
            this.filterAlarmDeactivated = ko.observable(ko.unwrap(this.settings.filterAlarmDeactivated) !== undefined ? ko.unwrap(this.settings.filterAlarmDeactivated) : true);
            this.filterServerStarted = ko.observable(ko.unwrap(this.settings.filterServerStarted) !== undefined ? ko.unwrap(this.settings.filterServerStarted) : true);
            this.filterServerStopped = ko.observable(ko.unwrap(this.settings.filterServerStopped) !== undefined ? ko.unwrap(this.settings.filterServerStopped) : true);
            this.filterUserLoggedIn = ko.observable(ko.unwrap(this.settings.filterUserLoggedIn) !== undefined ? ko.unwrap(this.settings.filterUserLoggedIn) : true);
            this.filterUserLoggedOut = ko.observable(ko.unwrap(this.settings.filterUserLoggedOut) !== undefined ? ko.unwrap(this.settings.filterUserLoggedOut) : true);
            this.filterUserWroteSignal = ko.observable(ko.unwrap(this.settings.filterUserWroteSignal) !== undefined ? ko.unwrap(this.settings.filterUserWroteSignal) : true);
            this.filterUserCreated = ko.observable(ko.unwrap(this.settings.filterUserCreated) !== undefined ? ko.unwrap(this.settings.filterUserCreated) : true);
            this.filterUserDeleted = ko.observable(ko.unwrap(this.settings.filterUserDeleted) !== undefined ? ko.unwrap(this.settings.filterUserDeleted) : true);
            this.filterUserModified = ko.observable(ko.unwrap(this.settings.filterUserModified) !== undefined ? ko.unwrap(this.settings.filterUserModified) : true);
            this.filterUserPasswordChanged = ko.observable(ko.unwrap(this.settings.filterUserPasswordChanged) !== undefined ? ko.unwrap(this.settings.filterUserPasswordChanged) : true);
            this.alarmPriorityFrom = ko.observable(ko.unwrap(this.settings.alarmPriorityFrom) !== undefined ? ko.unwrap(this.settings.alarmPriorityFrom) : 0).extend({ throttle: 500 });
            this.alarmPriorityTo = ko.observable(ko.unwrap(this.settings.alarmPriorityTo) !== undefined ? ko.unwrap(this.settings.alarmPriorityTo) : 100).extend({ throttle: 500 });
            this.maxEvents = ko.observable(ko.unwrap(this.settings.maxEvents) !== undefined ? ko.unwrap(this.settings.maxEvents) : 50).extend({ throttle: 500 });
            this.customUserNameFilter = ko.observable(ko.unwrap(this.settings.customUserNameFilter) !== undefined ? ko.unwrap(this.settings.customUserNameFilter) : "").extend({ throttle: 500 });
            this.filter = new OperationDiaryFilter();
            this.filter.getTimePeriode = function () {
                var start = _this.startDate().toMSDate();
                var end = _this.endDate().toMSDate();
                if (_this.selectedRange() === CalendarTimeRanges.Actual) {
                    start = moment().subtract(_this.startOffsetIntervall, _this.startOffset).toMSDate();
                    end = moment().add(_this.endOffsetIntervall, _this.endOffset).toMSDate();
                }
                if (_this.selectedRange() === CalendarTimeRanges.Today) {
                    start = moment().startOf('day').toMSDate();
                    end = moment().endOf('day').toMSDate();
                }
                if (_this.selectedRange() === CalendarTimeRanges.Yesterday) {
                    start = moment().startOf('day').subtract({ days: 1 }).toMSDate();
                    end = moment().endOf('day').subtract({ days: 1 }).toMSDate();
                }
                return {
                    Start: start,
                    End: end
                };
            };
        };
        WfEventsComponent.prototype.initializeFilterAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.setFilter()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.source.startPolling()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfEventsComponent.prototype.setFilter = function () {
            this.filter.languageId = this.connector.currentLanguageId();
            this.filter.maxEvents = this.maxEvents();
            this.filter.affectedUserFilter = {
                Action: 1,
                EventResultFilter: { Items: [0, 1], Action: 1 },
                EventTypeFilter: { Items: this.getAffectedUserFilter(), Action: 1 },
                UserFilter: { Items: [], Action: 0 },
                CustomUserNameFilter: this.customUserNameFilter() || null
            };
            this.filter.alarmFilter = {
                Action: 1,
                EventResultFilter: { Items: [0, 1], Action: 1 },
                EventTypeFilter: { Items: this.getAlarmFilter(), Action: 1 },
                AlarmTypeFilter: { Items: this.selectedAlarmTypes().map(function (item) { return { ID: item }; }), Action: _.any(this.selectedAlarmTypes()) ? 1 : 0 },
                AlarmGroupFilter: { Items: this.selectedAlarmGroups().map(function (item) { return { ID: item }; }), Action: _.any(this.selectedAlarmGroups()) ? 1 : 0 },
                AlarmPriorityFilter: { Action: 1, From: this.alarmPriorityFrom(), To: this.alarmPriorityTo() },
            };
            this.filter.serverFilter = {
                Action: 1,
                EventResultFilter: { Items: [0, 1], Action: 1 },
                EventTypeFilter: { Items: this.getServerFilter(), Action: 1 },
            };
            this.filter.userFilter = {
                Action: 1,
                EventResultFilter: { Items: [0, 1], Action: 1 },
                EventTypeFilter: { Items: this.getUserFilter(), Action: 1 },
                UserFilter: { Items: [], Action: 0 }
            };
        };
        WfEventsComponent.prototype.getServerFilter = function () {
            var eventTypeFilter = [];
            if (this.filterServerStarted() === true)
                eventTypeFilter.push(4);
            if (this.filterServerStopped() === true)
                eventTypeFilter.push(5);
            return eventTypeFilter;
        };
        WfEventsComponent.prototype.getAlarmFilter = function () {
            var eventTypeFilter = [];
            if (this.filterAlarmOn() === true)
                eventTypeFilter.push(1);
            if (this.filterAlarmOff() === true)
                eventTypeFilter.push(2);
            if (this.filterAlarmAcknowledged() === true)
                eventTypeFilter.push(3);
            if (this.filterAlarmActivated() === true)
                eventTypeFilter.push(9);
            if (this.filterAlarmDeactivated() === true)
                eventTypeFilter.push(10);
            return eventTypeFilter;
        };
        WfEventsComponent.prototype.getUserFilter = function () {
            var eventTypeFilter = [];
            if (this.filterUserLoggedIn() === true)
                eventTypeFilter.push(6);
            if (this.filterUserLoggedOut() === true)
                eventTypeFilter.push(7);
            if (this.filterUserWroteSignal() === true)
                eventTypeFilter.push(8);
            return eventTypeFilter;
        };
        WfEventsComponent.prototype.getAffectedUserFilter = function () {
            var eventTypeFilter = [];
            if (this.filterUserCreated() === true)
                eventTypeFilter.push(11);
            if (this.filterUserModified() === true)
                eventTypeFilter.push(12);
            if (this.filterUserDeleted() === true)
                eventTypeFilter.push(13);
            if (this.filterUserPasswordChanged() === true)
                eventTypeFilter.push(14);
            return eventTypeFilter;
        };
        WfEventsComponent.prototype.setEvents = function () {
            this.source = this.connector.getWFEvents(this.filter);
            this.events = this.source.events;
        };
        WfEventsComponent.prototype.getUsersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getAllUsers()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        WfEventsComponent.prototype.getEventType = function (eventType) {
            var eventTypeString = WFEventType[eventType].toString();
            var translation = this.connector.translate("I4SCADA_" + eventTypeString);
            return translation;
        };
        WfEventsComponent.prototype.getIds = function (items) {
            return _.map(items, function (item) {
                return {
                    ID: item.ID
                };
            });
        };
        WfEventsComponent.prototype.showAlarmSettings = function () {
            this.showAlarmSettingsDialog(true);
        };
        WfEventsComponent.prototype.closeAlarmSettings = function () {
            this.showAlarmSettingsDialog(false);
        };
        WfEventsComponent.prototype.showTimeSettings = function () {
            this.showTimeSettingsDialog(true);
            this.startDateInput(moment(this.startDate()));
            this.endDateInput(moment(this.endDate()));
            this.timeRangeDateInput(moment(this.startDate()));
            this.selectedRangeInput(this.selectedRange());
        };
        WfEventsComponent.prototype.closeTimeSettings = function () {
            this.showTimeSettingsDialog(false);
        };
        WfEventsComponent.prototype.showServerSettings = function () {
            this.showServerSettingsDialog(true);
        };
        WfEventsComponent.prototype.closeServerSettings = function () {
            this.showServerSettingsDialog(false);
        };
        WfEventsComponent.prototype.showUserSettings = function () {
            this.showUserSettingsDialog(true);
        };
        WfEventsComponent.prototype.closeUserSettings = function () {
            this.showUserSettingsDialog(false);
        };
        WfEventsComponent.prototype.showAffectedUserSettings = function () {
            this.showAffectedUserSettingsDialog(true);
        };
        WfEventsComponent.prototype.closeAffectedUserSettings = function () {
            this.showAffectedUserSettingsDialog(false);
        };
        WfEventsComponent.prototype.applyTimeFilterSettings = function () {
            this.closeTimeSettings();
            this.startDate(moment(this.startDateInput()));
            this.endDate(moment(this.endDateInput()));
            this.selectedRange(this.selectedRangeInput());
            this.setFilter();
            this.source.getWFEvents();
        };
        WfEventsComponent.prototype.dispose = function () {
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
                            return [4 /*yield*/, this.source.stopPolling()];
                        case 2:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfEventsComponent;
    }(ComponentBaseModel));
    return WfEventsComponent;
});
//# sourceMappingURL=wf-events.component.js.map