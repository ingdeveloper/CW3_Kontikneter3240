import Moment = moment.Moment;

class TimingService {
    static startOfProjectTime(): Moment {
        return moment('2010-01-01');
    }

    static startOfPreviousMonth(): Moment {
        return moment().subtract(1, 'months').startOf('month');
    }


    static endOfPreviousMonth(): Moment {
        return moment().subtract(1, 'months').endOf('month');
    }

    static now(): Moment {
        return moment();
    }

    static startOfPreviousYears(years: number): Moment {
        return moment().subtract(years, 'years').startOf('year');
    }

    static endOfPreviousYears(years: number): Moment {
        return moment().subtract(years, 'years').endOf('year');
    }

    static startOfCurrentMonth(): Moment {
        return moment().startOf('month');
    }

    static endOfCurrentMonth(): Moment {
        return moment().endOf('month');
    }

    static startOfCurrentYear(): Moment {
        return moment().startOf('year');
    }

    static endOfCurrentYear(): Moment {
        return moment().endOf('year');
    }

    static startOfPreviousMonthYear(): Moment {
        return TimingService.startOfPreviousMonth().startOf('year');
    }

    static endOfPreviousMonthYear(): Moment {
        return TimingService.endOfPreviousMonth().endOf('year');
    }

    static startOfPreviousDay(days: number): moment.Moment {
        return moment().subtract(1, 'days').startOf('day');
    }

    static endOfPreviousDay(days: number): moment.Moment {
        return moment().subtract(1, 'days').endOf('day');
    }

    static startOfPreviousWeek(weeks: number): moment.Moment {
        return moment().subtract(7, 'days').startOf('week');
    }

    static endOfPreviousWeek(weeks: number): moment.Moment {
        return moment().subtract(7, 'days').endOf('week');
    }

    static startOfLastQuarter(): moment.Moment {
        return moment().subtract(1, 'quarters').startOf('quarter');
    }

    static endOfLastQuarter(): moment.Moment {
        return moment().subtract(1, 'quarters').endOf('quarter');
    }

    static startOfLastHalfYear(): moment.Moment {
        var halfYearOffset = moment().subtract(6, 'months');
        var halfYear = moment(halfYearOffset).startOf('year').add(6, 'months').startOf('month');
        if (halfYearOffset.isBefore(halfYear)) {
            return moment(halfYearOffset).startOf('year');
        } else {
            return halfYear;
        }
    }

    static endOfLastHalfYear(): moment.Moment {
        return this.startOfLastHalfYear().add(5, 'months').endOf('month');        
    }
}

export = TimingService;