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
    var SignalsServiceApi = /** @class */ (function (_super) {
        __extends(SignalsServiceApi, _super);
        function SignalsServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.connect = function (clientId, requestedLicenses) {
                if (clientId === void 0) { clientId = null; }
                if (requestedLicenses === void 0) { requestedLicenses = null; }
                return _this.post("SignalsService", "Connect", {
                    clientId: clientId,
                    requestedLicenses: requestedLicenses
                });
            };
            _this.registerSignals = function (sessionId, clientId, signalNames) { return _this.post("SignalsService", "RegisterSignals", {
                sessionId: sessionId,
                clientId: clientId,
                signalNames: signalNames
            }); };
            _this.unregisterSignals = function (sessionId, clientId, signalNames) { return _this.post("SignalsService", "UnregisterSignals", {
                sessionId: sessionId,
                clientId: clientId,
                signalNames: signalNames
            }); };
            _this.getUpdates = function (sessionId, clientId, requestId) { return _this.post("SignalsService", "GetUpdates", {
                sessionId: sessionId,
                clientId: clientId,
                requestId: requestId
            }); };
            _this.readSignals = function (sessionId, clientId, signalNames) { return _this.post("SignalsService", "ReadSignals", {
                sessionId: sessionId,
                clientId: clientId,
                signalNames: signalNames
            }); };
            _this.writeUnsecuredSignals = function (values, sessionId, clientId) { return _this.post("SignalsService", "WriteUnsecuredSignals", {
                sessionId: sessionId,
                clientId: clientId,
                values: values
            }); };
            _this.writeSecuredSignals = function (values, securityToken, clientId) { return _this.post("SignalsService", "WriteSecuredSignalsByToken", {
                securityToken: securityToken,
                clientId: clientId,
                values: values
            }); };
            _this.writeSignalsSecure = function (securityToken, userPassword, values) { return _this.post("SignalsService", "WriteSecuredSignalValuesWithPasswordReinforcement", {
                securityToken: securityToken,
                password: userPassword,
                values: values
            }); };
            _this.updateLogValueByToken = function (securityToken, logId, date, value, value2, timeOut) { return _this.post("SignalsService", "UpdateLogValueByToken", {
                securityToken: securityToken,
                logId: logId,
                entryDate: date.toMSDateTimeOffset(),
                value: value || null,
                value2: value2 || null,
                millisecondsTimeOut: timeOut
            }); };
            _this.updateLogValue = function (sessionId, clientId, userName, isDomainUser, logId, date, value, value2, timeOut) { return _this.post("SignalsService", "UpdateLogValue", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                logId: logId,
                entryDate: date.toMSDateTimeOffset(),
                value: value || null,
                value2: value2 || null,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLastValuesBeforeDateByToken = function (securityToken, logTags, date, timeOut) { return _this.post("SignalsService", "GetUTCLastValuesBeforeDateByToken", {
                securityToken: securityToken,
                signalLogTags: logTags,
                date: date,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLastValuesBeforeDate = function (sessionId, clientId, userName, isDomainUser, logTags, date, timeOut) { return _this.post("SignalsService", "GetUTCLastValuesBeforeDate", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                signalLogTags: logTags,
                date: date,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLastValuesAfterDateByToken = function (securityToken, logTags, date, timeOut) { return _this.post("SignalsService", "GetUTCLastValuesAfterDateByToken", {
                securityToken: securityToken,
                signalLogTags: logTags,
                date: date,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLastValuesAfterDate = function (sessionId, clientId, userName, isDomainUser, logTags, date, timeOut) { return _this.post("SignalsService", "GetUTCLastValuesAfterDate", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                signalLogTags: logTags,
                date: date,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalDefinitionsByToken = function (securityToken, filter, languageId, start, count, timeOut) { return _this.post("SignalsService", "GetSignalDefinitionsByToken", {
                securityToken: securityToken,
                filter: filter,
                languageId: languageId,
                startIndex: start,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalDefinitions = function (sessionId, clientId, userName, isDomainUser, filter, languageId, start, count, timeOut) { return _this.post("SignalsService", "GetSignalDefinitions", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                languageId: languageId,
                startIndex: start,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogIdsByToken = function (securityToken, logTags, timeOut) { return _this.post("SignalsService", "GetLogIDsByToken", {
                securityToken: securityToken,
                signalLogTags: logTags,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogIds = function (sessionId, clientId, userName, isDomainUser, logTags, timeOut) { return _this.post("SignalsService", "GetLogIDs", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                signalLogTags: logTags,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogValuesByToken = function (securityToken, filter, timeOut) { return _this.post("SignalsService", "GetUTCLogValuesByToken", {
                securityToken: securityToken,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogValues = function (sessionId, clientId, userName, isDomainUser, filter, timeOut) { return _this.post("SignalsService", "GetUTCLogValues", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogValuesCountByToken = function (securityToken, filter, timeOut) { return _this.post("SignalsService", "GetLogValuesCountByToken", {
                securityToken: securityToken,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogValuesCount = function (sessionId, clientId, userName, isDomainUser, filter, timeOut) { return _this.post("SignalsService", "GetLogValuesCount", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getPeekLogValuesByToken = function (securityToken, filter, resolution, timeOut) { return _this.post("SignalsService", "GetPeekUTCLogValuesByToken", {
                securityToken: securityToken,
                filter: filter,
                resolution: resolution,
                millisecondsTimeOut: timeOut
            }); };
            _this.getPeekLogValues = function (sessionId, clientId, userName, isDomainUser, filter, resolution, timeOut) { return _this.post("SignalsService", "GetPeekUTCLogValues", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                resolution: resolution,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogStatistics = function (sessionId, clientId, userName, isDomainUser, filter, timeOut) { return _this.post("SignalsService", "GetUTCLogStatistics", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogStatisticsByToken = function (securityToken, filter, timeOut) { return _this.post("SignalsService", "GetUTCLogStatisticsByToken", {
                securityToken: securityToken,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalNames = function (sessionId, clientId, userName, isDomainUser, filter, languageId, startIndex, count, timeOut) { return _this.post("SignalsService", "GetSignalNames", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                languageId: languageId,
                startIndex: startIndex,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalNamesByToken = function (securityToken, filter, languageId, startIndex, count, timeOut) { return _this.post("SignalsService", "GetSignalNamesByToken", {
                securityToken: securityToken,
                filter: filter,
                languageId: languageId,
                startIndex: startIndex,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getGroupNames = function (sessionId, clientId, userName, isDomainUser, filter, languageId, startIndex, count, timeOut) { return _this.post("SignalsService", "GetGroupNames", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                languageId: languageId,
                startIndex: startIndex,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getGroupNamesByToken = function (securityToken, filter, languageId, startIndex, count, timeOut) { return _this.post("SignalsService", "GetGroupNamesByToken", {
                securityToken: securityToken,
                filter: filter,
                languageId: languageId,
                startIndex: startIndex,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogs = function (sessionId, clientId, userName, isDomainUser, signalId, languageId, timeOut) { return _this.post("SignalsService", "GetLogs", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                signalId: signalId,
                languageId: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getLogsByToken = function (securityToken, signalId, languageId, timeOut) { return _this.post("SignalsService", "GetLogsByToken", {
                securityToken: securityToken,
                signalId: signalId,
                languageId: languageId,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllWriteGroup = function (securityToken, timeOut) { return _this.post("SignalsService", "GetAllWriteGroupByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalsWithAlarmInfo = function (sessionId, clientId, userName, isDomainUser, filter, languageId, start, count, timeOut) { return _this.post("SignalsService", "GetSignalsWithAlarmInfo", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                languageId: languageId,
                startIndex: start,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            _this.getSignalsWithAlarmInfoByToken = function (securityToken, filter, languageId, start, count, timeOut) { return _this.post("SignalsService", "GetSignalsWithAlarmInfoByToken", {
                securityToken: securityToken,
                filter: filter,
                languageId: languageId,
                startIndex: start,
                count: count,
                millisecondsTimeOut: timeOut
            }); };
            return _this;
        }
        return SignalsServiceApi;
    }(HttpApi));
    return SignalsServiceApi;
});
//# sourceMappingURL=signalsServiceApi.js.map