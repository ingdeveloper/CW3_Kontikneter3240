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
define(["require", "exports", "./httpApi"], function (require, exports, HttpApi) {
    "use strict";
    var AlarmServiceApi = /** @class */ (function (_super) {
        __extends(AlarmServiceApi, _super);
        function AlarmServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getOnlineAlarmsByToken = function (securityToken, filter, timeOut) { return _this.post("AlarmsService", "GetOnlineAlarmsByToken", {
                securityToken: securityToken,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getOnlineAlarms = function (sessionId, clientId, userName, isDomainUser, filter, timeOut, token) { return _this.post("AlarmsService", "GetOnlineAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }, token); };
            _this.getOfflineAlarms = function (sessionId, clientId, userName, isDomainUser, filter, timeOut, token) { return _this.post("AlarmsService", "GetOfflineAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }, token); };
            _this.getOfflineAlarmsByToken = function (securityToken, filter, timeOut) { return _this.post("AlarmsService", "GetOfflineAlarmsByToken", {
                securityToken: securityToken,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmGroupsByToken = function (securityToken, languageId, timeOut) { return _this.post("AlarmsService", "GetAlarmGroupsByToken", {
                securityToken: securityToken,
                languageID: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmGroups = function (sessionId, clientId, userName, isDomainUser, languageId, timeOut) { return _this.post("AlarmsService", "GetAlarmGroups", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                languageID: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmTypesByToken = function (securityToken, languageId, timeOut) { return _this.post("AlarmsService", "GetAlarmTypesByToken", {
                securityToken: securityToken,
                languageID: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmTypes = function (sessionId, clientId, userName, isDomainUser, languageId, timeOut) { return _this.post("AlarmsService", "GetAlarmTypes", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                languageID: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmsByToken = function (securityToken, alarmIds, languageId, timeZone, timeOut, shouldResolvePlaceholders) { return _this.post("AlarmsService", "GetAlarmsByToken", {
                securityToken: securityToken,
                alarmsID: alarmIds,
                languageID: languageId,
                timeZoneID: timeZone,
                millisecondsTimeOut: timeOut,
                shouldResolvePlaceholders: shouldResolvePlaceholders
            }); };
            _this.getAlarms = function (sessionId, clientId, userName, isDomainUser, alarmIds, languageId, timeZone, timeOut, shouldResolvePlaceholders) { return _this.post("AlarmsService", "GetAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                alarmsID: alarmIds,
                languageID: languageId,
                timeZoneID: timeZone,
                millisecondsTimeOut: timeOut,
                shouldResolvePlaceholders: shouldResolvePlaceholders
            }); };
            _this.acknowledgeAlarms = function (sessionId, clientId, userName, isDomainUser, alarmIds, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                alarmIds: alarmIds,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAlarmsByToken = function (securityToken, alarmIds, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAlarmsByToken", {
                securityToken: securityToken,
                alarmIds: alarmIds,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAllAlarms = function (sessionId, clientId, userName, isDomainUser, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAllAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAllAlarmsByToken = function (securityToken, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAllAlarmsByToken", {
                securityToken: securityToken,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAllGoneAlarms = function (sessionId, clientId, userName, isDomainUser, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAllGoneAlarms", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAllGoneAlarmsByToken = function (securityToken, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAllGoneAlarmsByToken", {
                securityToken: securityToken,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAlarmsByGroup = function (sessionId, clientId, userName, isDomainUser, groupName, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAlarmsByGroup", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                groupName: groupName,
                comment: comment,
                millisecondsTimeOut: timeOut
            }); };
            _this.acknowledgeAlarmsByGroupByToken = function (securityToken, groupName, comment, timeOut) { return _this.post("AlarmsService", "AcknowledgeAlarmsByGroupByToken", {
                securityToken: securityToken,
                comment: comment,
                groupName: groupName,
                millisecondsTimeOut: timeOut
            }); };
            _this.setAlarmState = function (securityToken, alarmId, state, reactivation, timeOut) { return _this.post("AlarmsService", "SetAlarmState", {
                securityToken: securityToken,
                alarmId: alarmId,
                state: state,
                reactivation: reactivation,
                millisecondsTimeOut: timeOut
            }); };
            _this.setAlarmStates = function (securityToken, alarmIds, states, reactivations, timeOut) { return _this.post("AlarmsService", "SetAlarmStates", {
                securityToken: securityToken,
                alarmIds: alarmIds,
                states: states,
                reactivations: reactivations,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAlarmsWithChangedProcessingAndDisplayState = function (sessionId, clientId, userName, isDomainUser, languageID, timeOut) { return _this.post("AlarmsService", "GetAlarmsWithChangedProcessingAndDisplayState", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                languageID: languageID,
                millisecondsTimeOut: timeOut
            }); };
            _this.getExtendedAlarmProperties = function (sessionId, clientId, userName, isDomainUser, timeOut) { return _this.post("AlarmsService", "GetExtendedAlarmProperties", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                millisecondsTimeOut: timeOut
            }); };
            _this.getExtendedAlarmPropertiesByToken = function (securityToken, timeOut) { return _this.post("AlarmsService", "GetExtendedAlarmPropertiesByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            return _this;
        }
        return AlarmServiceApi;
    }(HttpApi));
    return AlarmServiceApi;
});
//# sourceMappingURL=alarmServiceApi.js.map