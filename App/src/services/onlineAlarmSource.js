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
define(["require", "exports", "./api", "./alarmSource", "./sessionService", "./connectorService", "./logger"], function (require, exports, Api, AlarmSource, SessionService, ConnectorService, Logger) {
    "use strict";
    var OnlineAlarmSource = /** @class */ (function (_super) {
        __extends(OnlineAlarmSource, _super);
        function OnlineAlarmSource(filter, updateRate) {
            return _super.call(this, filter, updateRate) || this;
        }
        OnlineAlarmSource.prototype.getAlarms = function (token) {
            var _this = this;
            ConnectorService.connect()
                .then(function () {
                return Api.alarmsService.getOnlineAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), _this.getFilterDto(), SessionService.timeOut, token);
            })
                .then(function (alarm) {
                _this.alarms(_this.getAlarmsWithTimeFieldsAdjusted(alarm.Alarms));
                _this.pollData(false);
            })
                .catch(function (err) {
                Logger.info(_this, "Unable to get online alarms.", err);
                _this.pollData(false);
            });
        };
        return OnlineAlarmSource;
    }(AlarmSource));
    return OnlineAlarmSource;
});
//# sourceMappingURL=onlineAlarmSource.js.map