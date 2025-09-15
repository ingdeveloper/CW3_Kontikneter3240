export class TimeRangeService {
    public static getRangeDates(range: CalendarTimeRanges,
        timeRangeDate: Date,
        startDate: Date,
        endDate: Date,
        startOffsetIntervall: number,
        startOffset: string,
        endOffsetIntervall: number,
        endOffset: string): { startDate: Date, endDate: Date } {

        timeRangeDate = timeRangeDate || new Date();
        return {
            startDate: this.getRangeStartDate(range, timeRangeDate, startDate, startOffsetIntervall, startOffset),
            endDate: this.getRangeEndDate(range, timeRangeDate, endDate, endOffsetIntervall, endOffset),
        };
    }

    public static getRangeStartDate(range: CalendarTimeRanges,
        timeRangeDate: Date,
        startDate: Date,
        offsetIntervall: number,
        offset: string): Date {
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
    }

    public static getRangeEndDate(range: CalendarTimeRanges,
        timeRangeDate: Date,
        endDate: Date,
        offsetIntervall: number,
        offset: string): Date {
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
    }
}