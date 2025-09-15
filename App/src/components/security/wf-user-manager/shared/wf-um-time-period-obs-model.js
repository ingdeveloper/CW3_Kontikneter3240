define(["require", "exports"], function (require, exports) {
    "use strict";
    var TimePeriodObs = /** @class */ (function () {
        function TimePeriodObs() {
            this.Start = ko.observable(moment(new Date()).add(-1, 'days').toMSDate());
            this.End = ko.observable(moment(new Date()).toMSDate());
        }
        TimePeriodObs.prototype.toDto = function () {
            var timePeriodDto = {
                Start: this.Start(),
                End: this.End()
            };
            return timePeriodDto;
        };
        TimePeriodObs.prototype.fromDto = function (timePeriod) {
            this.Start(timePeriod.Start);
            this.End(timePeriod.End);
        };
        return TimePeriodObs;
    }());
    return TimePeriodObs;
});
//# sourceMappingURL=wf-um-time-period-obs-model.js.map