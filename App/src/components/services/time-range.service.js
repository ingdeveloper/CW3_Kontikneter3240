define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeRangeService = void 0;
    var TimeRangeService = /** @class */ (function () {
        function TimeRangeService() {
        }
        TimeRangeService.getRangeDates = function (range, timeRangeDate, startDate, endDate, startOffsetIntervall, startOffset, endOffsetIntervall, endOffset) {
            timeRangeDate = timeRangeDate || new Date();
            return {
                startDate: this.getRangeStartDate(range, timeRangeDate, startDate, startOffsetIntervall, startOffset),
                endDate: this.getRangeEndDate(range, timeRangeDate, endDate, endOffsetIntervall, endOffset),
            };
        };
        TimeRangeService.getRangeStartDate = function (range, timeRangeDate, startDate, offsetIntervall, offset) {
            switch (range) {
                case CalendarTimeRanges.Year:
                    return moment(timeRangeDate).startOf('year').toDate();
                case CalendarTimeRanges.Month:
                    return moment(timeRangeDate).startOf('month').toDate();
                case CalendarTimeRanges.Week:
                    return moment(timeRangeDate).startOf('week').toDate();
                case CalendarTimeRanges.Day:
                    return moment(timeRangeDate).startOf('day').toDate();
                case CalendarTimeRanges.Today:
                    return moment().startOf('day').toDate();
                case CalendarTimeRanges.Yesterday:
                    return moment().startOf('day').subtract({ days: 1 }).toDate();
                case CalendarTimeRanges.Actual:
                    return moment().subtract(offsetIntervall, offset).toDate();
                case CalendarTimeRanges.Custom:
                    return (startDate || moment(new Date()).startOf('day').toDate());
                default:
                    return timeRangeDate;
            }
        };
        TimeRangeService.getRangeEndDate = function (range, timeRangeDate, endDate, offsetIntervall, offset) {
            switch (range) {
                case CalendarTimeRanges.Year:
                    return moment(timeRangeDate).endOf('year').toDate();
                case CalendarTimeRanges.Month:
                    return moment(timeRangeDate).endOf('month').toDate();
                case CalendarTimeRanges.Week:
                    return moment(timeRangeDate).endOf('week').toDate();
                case CalendarTimeRanges.Day:
                    return moment(timeRangeDate).endOf('day').toDate();
                case CalendarTimeRanges.Today:
                    return moment().endOf('day').toDate();
                case CalendarTimeRanges.Yesterday:
                    return moment().endOf('day').subtract({ days: 1 }).toDate();
                case CalendarTimeRanges.Actual:
                    return moment().add(offsetIntervall, offset).toDate();
                case CalendarTimeRanges.Custom:
                    return (endDate || moment(new Date()).endOf('day').toDate());
                default:
                    return timeRangeDate;
            }
        };
        return TimeRangeService;
    }());
    exports.TimeRangeService = TimeRangeService;
});
//# sourceMappingURL=time-range.service.js.map