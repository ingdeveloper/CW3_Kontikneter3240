define(["require", "exports"], function (require, exports) {
    "use strict";
    var OperationDiaryFilter = /** @class */ (function () {
        function OperationDiaryFilter() {
            this.affectedUserFilter = null;
            this.alarmFilter = null;
            this.languageId = null;
            this.maxEvents = null;
            this.serverFilter = null;
            this.timePeriod = null;
            this.userFilter = null;
            this.getTimePeriode = function () {
                return {
                    Start: moment().subtract("hours", 1).toMSDate(),
                    End: moment().toMSDate()
                };
            };
        }
        OperationDiaryFilter.prototype.toDto = function () {
            var dto = {
                AffectedUserFilter: this.affectedUserFilter,
                AlarmFilter: this.alarmFilter,
                LanguageID: this.languageId,
                MaxEvents: this.maxEvents,
                ServerFilter: this.serverFilter,
                TimePeriod: this.timePeriod ? this.timePeriod : this.getTimePeriode(),
                UserFilter: this.userFilter,
            };
            return dto;
        };
        return OperationDiaryFilter;
    }());
    return OperationDiaryFilter;
});
//# sourceMappingURL=operationDiaryFilter.js.map