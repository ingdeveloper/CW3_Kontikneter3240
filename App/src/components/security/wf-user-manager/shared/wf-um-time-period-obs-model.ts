class TimePeriodObs {
    public Start: KnockoutObservable<DateTime>;
    public End: KnockoutObservable<DateTime>;
    
    constructor() {
        this.Start = ko.observable(moment(new Date()).add(-1, 'days').toMSDate());
        this.End = ko.observable(moment(new Date()).toMSDate());
    }
    
    public toDto() {
        const timePeriodDto: TimePeriod = {
                Start: this.Start(),
                End: this.End()           
            };

        return timePeriodDto;
    }

    public fromDto(timePeriod: TimePeriod) {
        this.Start(timePeriod.Start);
        this.End(timePeriod.End);
    }
}

export = TimePeriodObs;