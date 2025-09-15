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
define(["require", "exports", "./sessionService", "./logger", "./api", "./symbolicTextsService"], function (require, exports, SessionService, Logger, Api, SymbolicTextsService) {
    "use strict";
    var SilverlightToolsService = /** @class */ (function () {
        function SilverlightToolsService() {
        }
        SilverlightToolsService.getWFEvents = function (filter, languageId) {
            return __awaiter(this, void 0, void 0, function () {
                var internalFilter, events;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!filter)
                                return [2 /*return*/, null];
                            internalFilter = SilverlightToolsService.getWFEventsFilter(filter, languageId);
                            Logger.info(SilverlightToolsService, "getWFEvents");
                            return [4 /*yield*/, Api.silverlightTools.getWFEventsByToken(SessionService.getSecurityToken(), internalFilter, SilverlightToolsService.timeOut)];
                        case 1:
                            events = _a.sent();
                            return [2 /*return*/, _.map(events, function (event) { return SilverlightToolsService.createVisualEvent(event); })];
                    }
                });
            });
        };
        SilverlightToolsService.logUserActivity = function (eventDataDTO) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!eventDataDTO)
                                return [2 /*return*/, null];
                            Logger.info(SilverlightToolsService, "logUserActivity");
                            return [4 /*yield*/, Api.silverlightTools.logUserActivityByToken(SessionService.getSecurityToken(), eventDataDTO, SilverlightToolsService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SilverlightToolsService.getUserActivityEvents = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!filter)
                                return [2 /*return*/, null];
                            Logger.info(SilverlightToolsService, "getUserActivityEvents");
                            return [4 /*yield*/, Api.silverlightTools.getUserActivityEventsByToken(SessionService.getSecurityToken(), filter, SilverlightToolsService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SilverlightToolsService.createVisualEvent = function (event) {
            var result = {};
            result.ID = event.ID;
            result.Version = event.Version;
            result.Type = event.Type;
            result.Time = event.Time;
            result.SystemTime = event.SystemTime;
            result.Alarm = event.Alarm;
            result.ClientMachine = event.ClientMachine;
            result.Server = event.Server;
            result.Signal = event.Signal;
            result.User = event.User;
            result.SignalOldValue = event.SignalOldValue;
            result.SignalNewValue = event.SignalNewValue;
            result.AlarmAcknoledgeText = event.AlarmAcknoledgeText;
            result.ResultCode = event.ResultCode;
            result.AffectedUserName = event.AffectedUserName;
            result.EventData = event.EventData;
            var textMap = _.find(SilverlightToolsService.eventTextMap, function (map) { return map.type === result.Type; });
            if (textMap) {
                result.Icon = textMap.icon;
                result.EventText = SymbolicTextsService.translate(textMap.symbolicText);
                result.Text = ko.pureComputed(function () {
                    var unresolvedText = SymbolicTextsService.translate(result.ResultCode === 0
                        ? textMap.successfullSymbolicText
                        : textMap.failedSymbolicText);
                    return SilverlightToolsService.resolvePlaceholders(unresolvedText(), result);
                });
            }
            return result;
        };
        SilverlightToolsService.getWFEventsFilter = function (filter, languageId) {
            var result = {
                AlarmFilter: {
                    Action: FilterAction.IncludeNone
                },
                ServerFilter: {
                    Action: FilterAction.IncludeNone
                },
                LanguageID: languageId,
                MaxEvents: filter.MaximumCount,
                TimePeriod: filter.Time,
                AffectedUserFilter: SilverlightToolsService.getAffectedUserEventFilter(filter.EventTypes, filter.Users, filter.ShouldFilterByUsers),
                UserFilter: SilverlightToolsService.getUserEventCategoryFilter(filter.EventTypes, filter.Users, filter.ShouldFilterByUsers)
            };
            return result;
        };
        SilverlightToolsService.getUserEventCategoryFilter = function (eventTypes, users, shouldFilterByUsers) {
            var usersFilter = shouldFilterByUsers
                ? {
                    Items: _.map(users, function (dto) {
                        return {
                            ID: dto.ID,
                            Name: dto.Name,
                            Version: 0
                        };
                    }),
                    Action: FilterAction.IncludeSome
                }
                : { Items: [], Action: FilterAction.IncludeAll };
            return {
                UserFilter: usersFilter,
                Action: FilterAction.IncludeSome,
                EventResultFilter: { Action: FilterAction.IncludeAll, Items: [] },
                EventTypeFilter: {
                    Items: eventTypes,
                    Action: FilterAction.IncludeSome
                }
            };
        };
        SilverlightToolsService.getAffectedUserEventFilter = function (eventTypes, users, shouldFilterByUsers) {
            var result = SilverlightToolsService.getUserEventCategoryFilter(eventTypes, users, shouldFilterByUsers);
            result.CustomUserNameFilter = null;
            return result;
        };
        SilverlightToolsService.resolvePlaceholders = function (unresolvedText, event) {
            var e_1, _a;
            var result = ko.unwrap(unresolvedText);
            if (!result)
                return "";
            var existingPlaceholderList = _.filter(SilverlightToolsService.placeholderList, function (placeholder) {
                return result.indexOf(placeholder) > -1;
            });
            try {
                for (var existingPlaceholderList_1 = __values(existingPlaceholderList), existingPlaceholderList_1_1 = existingPlaceholderList_1.next(); !existingPlaceholderList_1_1.done; existingPlaceholderList_1_1 = existingPlaceholderList_1.next()) {
                    var placeholder = existingPlaceholderList_1_1.value;
                    var replacementValue = SilverlightToolsService.resolvePlaceholder(placeholder, event);
                    result = result.replace(new RegExp(placeholder, "g"), replacementValue);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (existingPlaceholderList_1_1 && !existingPlaceholderList_1_1.done && (_a = existingPlaceholderList_1.return)) _a.call(existingPlaceholderList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        };
        SilverlightToolsService.resolvePlaceholder = function (placeholder, event) {
            switch (placeholder) {
                case SilverlightToolsService.eventTypePlaceholder:
                    return event.EventText();
                case SilverlightToolsService.eventTimePlaceholder:
                    return event.Time;
                case SilverlightToolsService.eventTime2Placeholder:
                    return event.SystemTime;
                case SilverlightToolsService.userNamePlaceholder:
                    return event.User.Name;
                case SilverlightToolsService.clientMachinePlaceholder:
                    return event.ClientMachine;
                case SilverlightToolsService.serverNamePlaceholder:
                    return event.Server.Name;
                case SilverlightToolsService.signalNamePlaceholder:
                    return event.Signal.AliasName;
                case SilverlightToolsService.signalDescriptionPlaceholder:
                    return event.Signal.Description;
                case SilverlightToolsService.signalUnitPlaceholder:
                    return event.Signal.Unit;
                //case SilverlightToolsService.opcItemNamePlaceholder:
                //    return visualEvent.Signal.OpcItemName;
                case SilverlightToolsService.connectorPlaceholder:
                    return event.Signal.Group.Connector.Descriptio;
                case SilverlightToolsService.signalGroupPlaceholder:
                    return event.Signal.Group.Name;
                case SilverlightToolsService.alarmTextPlaceholder:
                    return event.Alarm.Text.Translation;
                case SilverlightToolsService.alarmGroupPlaceholder:
                    return event.Alarm.Group.Text.Translation;
                case SilverlightToolsService.alarmTypePlaceholder:
                    return event.Alarm.Type.Text.Translation;
                case SilverlightToolsService.alarmAcknowledgeTextPlaceholder:
                    return event.AlarmAcknoledgeText;
                case SilverlightToolsService.signalNewValuePlaceholder:
                    return event.SignalNewValue;
                case SilverlightToolsService.signalOldValuePlaceholder:
                    return event.SignalOldValue;
                case SilverlightToolsService.resultCodePlaceholder:
                    return event.ResultCode.toString();
                default:
                    return "";
            }
        };
        SilverlightToolsService.timeOut = 10000;
        SilverlightToolsService.eventTypePlaceholder = "##EVENTTYPE##";
        SilverlightToolsService.eventTimePlaceholder = "##EVENTTIME##";
        SilverlightToolsService.eventTime2Placeholder = "##EVENTTIME2##";
        SilverlightToolsService.userNamePlaceholder = "##USERNAME##";
        SilverlightToolsService.clientMachinePlaceholder = "##CLIENTMACHINE##";
        SilverlightToolsService.serverNamePlaceholder = "##SERVERNAME##";
        SilverlightToolsService.signalNamePlaceholder = "##SIGNALNAME##";
        SilverlightToolsService.signalDescriptionPlaceholder = "##SIGNALDESCRIPTION##";
        SilverlightToolsService.signalUnitPlaceholder = "##SIGNALUNIT##";
        SilverlightToolsService.opcItemNamePlaceholder = "##OPCITEMNAME##";
        SilverlightToolsService.connectorPlaceholder = "##CONNECTOR##";
        SilverlightToolsService.signalGroupPlaceholder = "##SIGNALGROUP##";
        SilverlightToolsService.alarmTextPlaceholder = "##ALARMTEXT##";
        SilverlightToolsService.alarmGroupPlaceholder = "##ALARMGROUP##";
        SilverlightToolsService.alarmTypePlaceholder = "##ALARMTYPE##";
        SilverlightToolsService.alarmAcknowledgeTextPlaceholder = "##ACKNOWLEDGETEXT##";
        SilverlightToolsService.signalNewValuePlaceholder = "##SIGNALNEWVALUE##";
        SilverlightToolsService.signalOldValuePlaceholder = "##SIGNALOLDVALUE##";
        SilverlightToolsService.resultCodePlaceholder = "##RESULTCODE##";
        SilverlightToolsService.placeholderList = [
            SilverlightToolsService.eventTypePlaceholder,
            SilverlightToolsService.eventTimePlaceholder,
            SilverlightToolsService.eventTime2Placeholder,
            SilverlightToolsService.userNamePlaceholder,
            SilverlightToolsService.clientMachinePlaceholder,
            SilverlightToolsService.serverNamePlaceholder,
            SilverlightToolsService.signalNamePlaceholder,
            SilverlightToolsService.signalDescriptionPlaceholder,
            SilverlightToolsService.signalUnitPlaceholder,
            SilverlightToolsService.opcItemNamePlaceholder,
            SilverlightToolsService.connectorPlaceholder,
            SilverlightToolsService.signalGroupPlaceholder,
            SilverlightToolsService.alarmTextPlaceholder,
            SilverlightToolsService.alarmGroupPlaceholder,
            SilverlightToolsService.alarmTypePlaceholder,
            SilverlightToolsService.alarmAcknowledgeTextPlaceholder,
            SilverlightToolsService.signalNewValuePlaceholder,
            SilverlightToolsService.signalOldValuePlaceholder,
            SilverlightToolsService.resultCodePlaceholder
        ];
        SilverlightToolsService.eventTextMap = [
            { type: WFEventType.AlarmOn, icon: "wf wf-alarm running", symbolicText: "I4SCADA_UM_EventAlarmOn", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmOnEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmOnEvent" },
            { type: WFEventType.AlarmOff, icon: "wf wf-alarm red", symbolicText: "I4SCADA_UM_EventAlarmOff", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmOffEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmOffEvent" },
            { type: WFEventType.AlarmAcknowledged, icon: "wf wf-alarm orange", symbolicText: "I4SCADA_UM_EventAlarmAcknowledged", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmAcknowledgedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmAcknowledgedEvent" },
            { type: WFEventType.AlarmActivated, icon: "wf wf-alarm", symbolicText: "I4SCADA_UM_EventAlarmActivated", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmActivatedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmActivatedEvent" },
            { type: WFEventType.AlarmDeactivated, icon: "wf wf-alarm-o", symbolicText: "I4SCADA_UM_EventAlarmDeactivated", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmDeactivatedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmDeactivatedEvent" },
            { type: WFEventType.ServerStarted, icon: "wf wf-play-round", symbolicText: "I4SCADA_UM_ServerStarted", successfullSymbolicText: "I4SCADA_UM_SuccessfulServerStartedEvent", failedSymbolicText: "I4SCADA_UM_FailedServerStartedEvent" },
            { type: WFEventType.ServerStopped, icon: "wf wf-stop-round", symbolicText: "I4SCADA_UM_ServerStopped", successfullSymbolicText: "I4SCADA_UM_SuccessfulServerStoppedEvent", failedSymbolicText: "I4SCADA_UM_FailedServerStoppedEvent" },
            { type: WFEventType.UserLoggedIn, icon: "wf wf-login text-info", symbolicText: "I4SCADA_UM_UserLoggedIn", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserLoggedInEvent", failedSymbolicText: "I4SCADA_UM_FailedUserLoggedInEvent" },
            { type: WFEventType.UserLoggedOut, icon: "wf wf-logout orange", symbolicText: "I4SCADA_UM_UserLoggedOut", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserLoggedOutEvent", failedSymbolicText: "I4SCADA_UM_FailedUserLoggedOutEvent" },
            { type: WFEventType.UserWroteSignal, icon: "wf wf-sine-wave", symbolicText: "I4SCADA_UM_UserWroteSignal", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserWroteSignalEvent", failedSymbolicText: "I4SCADA_UM_FailedUserWroteSignalEvent" },
            { type: WFEventType.UserPasswordChanged, icon: "wf wf-password-field-1", symbolicText: "I4SCADA_UM_UserPasswordChanged", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserPasswordChangedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserPasswordChangedEvent" },
            { type: WFEventType.UserCreated, icon: "wf wf-user running", symbolicText: "I4SCADA_UM_UserCreated", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserCreatedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserCreatedEvent" },
            { type: WFEventType.UserDeleted, icon: "wf wf-user error", symbolicText: "I4SCADA_UM_UserDeleted", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserDeletedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserDeletedEvent" },
            { type: WFEventType.UserModified, icon: "wf wf-user-log", symbolicText: "I4SCADA_UM_UserModified", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserModifiedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserModifiedEvent" },
        ];
        return SilverlightToolsService;
    }());
    return SilverlightToolsService;
});
//# sourceMappingURL=silverlightToolsService.js.map