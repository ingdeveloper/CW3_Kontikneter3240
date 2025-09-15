define(["require", "exports", "./wf-um-time-period-obs-model"], function (require, exports, TimePeriodObs) {
    "use strict";
    var EventsFilterObs = /** @class */ (function () {
        function EventsFilterObs() {
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
        EventsFilterObs.prototype.toDto = function () {
            var eventsFilterDto = {
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
            };
            return eventsFilterDto;
        };
        EventsFilterObs.prototype.fromDto = function (eventsFilter) {
            this.Users(eventsFilter.Users);
            this.MaximumCount(eventsFilter.MaximumCount);
            this.EventTypes(eventsFilter.EventTypes);
            this.AutoUpdate(eventsFilter.AutoUpdate);
            this.ShouldFilterByUsers(eventsFilter.ShouldFilterByUsers);
            var timePeriod = new TimePeriodObs();
            timePeriod.fromDto(eventsFilter.Time);
            this.Time(timePeriod);
            this.SelectedRangeInput(eventsFilter.SelectedRangeInput);
            this.TimeRangeDateInput(eventsFilter.TimeRangeDateInput);
            this.StartOffsetIntervall(eventsFilter.StartOffsetIntervall);
            this.StartOffset(eventsFilter.StartOffset);
            this.EndOffset(eventsFilter.EndOffset);
            this.EndOffsetIntervall(eventsFilter.EndOffsetIntervall);
        };
        return EventsFilterObs;
    }());
    return EventsFilterObs;
});
//# sourceMappingURL=wf-um-events-filter-obs-model.js.map