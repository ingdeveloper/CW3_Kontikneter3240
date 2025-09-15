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
    var OfflineAlarmSource = /** @class */ (function (_super) {
        __extends(OfflineAlarmSource, _super);
        function OfflineAlarmSource(filter, updateRate) {
            var _this = _super.call(this, filter, updateRate) || this;
            _this.resetIdentity = true;
            _this.identityNumber = 0;
            _this.rowNumber = 0;
            _this.hasMore = true;
            return _this;
        }
        OfflineAlarmSource.prototype.clearPolling = function () {
            if (ko.unwrap(this.isPollingEnabled)) {
                return;
            }
            this.alarms([]);
            this.identityNumber = 0;
            this.rowNumber = 0;
            this.hasMore = true;
        };
        OfflineAlarmSource.prototype.startPolling = function () {
            if (ko.unwrap(this.isPollingEnabled) || !this.hasMore) {
                return;
            }
            _super.prototype.startPolling.call(this);
        };
        OfflineAlarmSource.prototype.getAlarms = function (token) {
            var _this = this;
            var filterDto = this.getFilterDto();
            filterDto.IdentityNumber = this.identityNumber;
            filterDto.RowNumber = this.rowNumber;
            ConnectorService.connect()
                .then(function () { return Api.alarmsService.getOfflineAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filterDto, SessionService.timeOut, token); })
                .then(function (alarm) {
                _this.identityNumber = alarm.IdentityNumber;
                _this.rowNumber = alarm.RowNumber;
                _this.hasMore = alarm.HasMore;
                Array.prototype.push.apply(_this.alarms(), _this.getAlarmsWithTimeFieldsAdjusted(alarm.Alarms)); // this works faster as js concat
                _this.alarms.valueHasMutated();
                _this.stopPolling();
            })
                .catch(function (err) {
                Logger.info(_this, "Unable to get offline alarms.", err);
            });
        };
        OfflineAlarmSource.prototype.pollData = function (immediate) {
            if (immediate === void 0) { immediate = true; }
            if (!ko.unwrap(this.isPollingEnabled)) {
                return;
            }
            this.getAlarms(this.cancellationTokenSource.token);
        };
        return OfflineAlarmSource;
    }(AlarmSource));
    return OfflineAlarmSource;
});
//# sourceMappingURL=offlineAlarmSource.js.map