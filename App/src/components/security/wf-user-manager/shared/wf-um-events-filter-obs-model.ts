import TimePeriodObs = require("./wf-um-time-period-obs-model");
import { EventsFilterExtended } from "./wf-um-interfaces";

class EventsFilterObs {
    Users: KnockoutObservableArray<NameDTO>;
    MaximumCount: KnockoutObservable<number>;
    EventTypes: KnockoutObservableArray<WFEventType>;
    AutoUpdate: KnockoutObservable<boolean>;
    ShouldFilterByUsers: KnockoutObservable<boolean>;

    Time: KnockoutObservable<TimePeriodObs>;
    TimeRangeDateInput: KnockoutObservable<Date>;
    SelectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
    StartOffsetIntervall: KnockoutObservable<number>;
    StartOffset: KnockoutObservable<string>;
    EndOffset: KnockoutObservable<string>;
    EndOffsetIntervall: KnockoutObservable<number>;

    constructor() {
        this.Users = ko.observableArray([]);
        this.MaximumCount = ko.observable(0);
        this.EventTypes = ko.observableArray([]);
        this.AutoUpdate = ko.observable(false);
        this.ShouldFilterByUsers = ko.observable(true);

        this.Time = ko.observable(new TimePeriodObs());
        this.TimeRangeDateInput = ko.observable(new Date());
        this.SelectedRangeInput = ko.observable(CalendarTimeRanges.Today);
        this.StartOffsetIntervall = ko.observable(30);
        this.StartOffset = ko.observable("minutes");
        this.EndOffset = ko.observable("minutes");
        this.EndOffsetIntervall = ko.observable(0);
    }

    toDto(): EventsFilterExtended {
        let eventsFilterDto: EventsFilterExtended = {
            Users: this.Users(),
            MaximumCount: this.MaximumCount(),           
            EventTypes: this.EventTypes(),
            AutoUpdate: this.AutoUpdate(),

            Time: this.Time().toDto(),
            ShouldFilterByUsers: this.ShouldFilterByUsers(),
            SelectedRangeInput: this.SelectedRangeInput(),
            TimeRangeDateInput: this.TimeRangeDateInput(),
            StartOffsetIntervall: this.StartOffsetIntervall(),
            StartOffset: this.StartOffset(),
            EndOffset: this.EndOffset(),
            EndOffsetIntervall: this.EndOffsetIntervall(),
        }

        return eventsFilterDto;
    }

    fromDto(eventsFilter: EventsFilterExtended) {
        
        this.Users(eventsFilter.Users);
        this.MaximumCount(eventsFilter.MaximumCount);
        this.EventTypes(eventsFilter.EventTypes);
        this.AutoUpdate(eventsFilter.AutoUpdate);
        this.ShouldFilterByUsers(eventsFilter.ShouldFilterByUsers);

        const timePeriod = new TimePeriodObs();
        timePeriod.fromDto(eventsFilter.Time);
        this.Time(timePeriod);

        this.SelectedRangeInput(eventsFilter.SelectedRangeInput);
        this.TimeRangeDateInput(eventsFilter.TimeRangeDateInput);
        this.StartOffsetIntervall(eventsFilter.StartOffsetIntervall);
        this.StartOffset(eventsFilter.StartOffset);
        this.EndOffset(eventsFilter.EndOffset);
        this.EndOffsetIntervall(eventsFilter.EndOffsetIntervall);
    }
}

export = EventsFilterObs;