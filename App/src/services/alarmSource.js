define(["require", "exports", "./models/cancellation-token-source"], function (require, exports, cancellation_token_source_1) {
    "use strict";
    var AlarmSource = /** @class */ (function () {
        function AlarmSource(filter, updateRate) {
            var _this = this;
            this.filter = filter;
            this.updateRate = updateRate;
            this.isPollingEnabled = ko.observable(false);
            this.alarms = ko.observableArray([]);
            this.timeoutId = -1;
            this.cancellationTokenSource = new cancellation_token_source_1.CancellationTokenSource();
            this.isPolling = ko.computed(function () {
                return _this.isPollingEnabled();
            });
        }
        AlarmSource.prototype.clearPolling = function () { };
        AlarmSource.prototype.startPolling = function () {
            if (ko.unwrap(this.isPollingEnabled)) {
                return;
            }
            this.cancellationTokenSource = new cancellation_token_source_1.CancellationTokenSource();
            this.isPollingEnabled(true);
            this.pollData(true);
        };
        AlarmSource.prototype.stopPolling = function () {
            this.isPollingEnabled(false);
            this.clearTimer();
            this.cancellationTokenSource.cancel();
        };
        AlarmSource.prototype.pollData = function (immediate) {
            if (immediate === void 0) { immediate = true; }
            if (!ko.unwrap(this.isPollingEnabled)) {
                return;
            }
            var timeout = immediate ? 0 : this.updateRate;
            this.triggerTimer(timeout);
        };
        AlarmSource.prototype.triggerTimer = function (timeout) {
            var _this = this;
            if (this.timeoutId !== -1) {
                return;
            }
            this.timeoutId = window.setTimeout(function () {
                _this.clearTimer();
                return _this.getAlarms(_this.cancellationTokenSource.token);
            }, timeout);
        };
        AlarmSource.prototype.clearTimer = function () {
            clearTimeout(this.timeoutId);
            this.timeoutId = -1;
        };
        AlarmSource.prototype.getFilterDto = function () {
            return this.filter.toDto();
        };
        AlarmSource.prototype.getAlarmsWithTimeFieldsAdjusted = function (alarms) {
            var _this = this;
            if (!alarms)
                return alarms;
            return _.map(alarms, function (alarm) {
                _this.adjustAlarmTimeFields(alarm);
                return alarm;
            });
        };
        AlarmSource.prototype.adjustAlarmTimeFields = function (alarm) {
            if (!alarm)
                return;
            alarm.DateOn = this.adjustDateToTimezone(alarm.DateOn);
            alarm.DateOff = this.adjustDateToTimezone(alarm.DateOff);
            alarm.DateAck = this.adjustDateToTimezone(alarm.DateAck);
            alarm.SysTime = this.adjustDateToTimezone(alarm.SysTime);
        };
        AlarmSource.prototype.adjustDateToTimezone = function (date) {
            if (!date)
                return null;
            var momentDate = moment(date);
            momentDate.add(momentDate.utcOffset(), "minutes");
            return momentDate.local().toDate();
        };
        return AlarmSource;
    }());
    return AlarmSource;
});
//# sourceMappingURL=alarmSource.js.map