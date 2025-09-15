define(["require", "exports"], function (require, exports) {
    "use strict";
    var TimingService = /** @class */ (function () {
        function TimingService() {
        }
        TimingService.startOfProjectTime = function () {
            return moment('2010-01-01');
        };
        TimingService.startOfPreviousMonth = function () {
            return moment().subtract(1, 'months').startOf('month');
        };
        TimingService.endOfPreviousMonth = function () {
            return moment().subtract(1, 'months').endOf('month');
        };
        TimingService.now = function () {
            return moment();
        };
        TimingService.startOfPreviousYears = function (years) {
            return moment().subtract(years, 'years').startOf('year');
        };
        TimingService.endOfPreviousYears = function (years) {
            return moment().subtract(years, 'years').endOf('year');
        };
        TimingService.startOfCurrentMonth = function () {
            return moment().startOf('month');
        };
        TimingService.endOfCurrentMonth = function () {
            return moment().endOf('month');
        };
        TimingService.startOfCurrentYear = function () {
            return moment().startOf('year');
        };
        TimingService.endOfCurrentYear = function () {
            return moment().endOf('year');
        };
        TimingService.startOfPreviousMonthYear = function () {
            return TimingService.startOfPreviousMonth().startOf('year');
        };
        TimingService.endOfPreviousMonthYear = function () {
            return TimingService.endOfPreviousMonth().endOf('year');
        };
        TimingService.startOfPreviousDay = function (days) {
            return moment().subtract(1, 'days').startOf('day');
        };
        TimingService.endOfPreviousDay = function (days) {
            return moment().subtract(1, 'days').endOf('day');
        };
        TimingService.startOfPreviousWeek = function (weeks) {
            return moment().subtract(7, 'days').startOf('week');
        };
        TimingService.endOfPreviousWeek = function (weeks) {
            return moment().subtract(7, 'days').endOf('week');
        };
        TimingService.startOfLastQuarter = function () {
            return moment().subtract(1, 'quarters').startOf('quarter');
        };
        TimingService.endOfLastQuarter = function () {
            return moment().subtract(1, 'quarters').endOf('quarter');
        };
        TimingService.startOfLastHalfYear = function () {
            var halfYearOffset = moment().subtract(6, 'months');
            var halfYear = moment(halfYearOffset).startOf('year').add(6, 'months').startOf('month');
            if (halfYearOffset.isBefore(halfYear)) {
                return moment(halfYearOffset).startOf('year');
            }
            else {
                return halfYear;
            }
        };
        TimingService.endOfLastHalfYear = function () {
            return this.startOfLastHalfYear().add(5, 'months').endOf('month');
        };
        return TimingService;
    }());
    return TimingService;
});
//# sourceMappingURL=timingService.js.map