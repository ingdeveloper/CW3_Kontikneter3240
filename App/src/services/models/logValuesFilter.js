define(["require", "exports"], function (require, exports) {
    "use strict";
    var LogValuesFilter = /** @class */ (function () {
        function LogValuesFilter(logIds, startDate, endDate, maxResults, sortOrder) {
            if (maxResults === void 0) { maxResults = null; }
            if (sortOrder === void 0) { sortOrder = LogValuesSortOrder.DateAscending; }
            this.logIds = ko.observableArray();
            this.startDate = ko.observable();
            this.endDate = ko.observable();
            this.maxResults = ko.observable();
            this.sortOrder = ko.observable();
            this.logIds(logIds);
            this.startDate(startDate);
            this.endDate(endDate);
            this.maxResults(maxResults);
            this.sortOrder(sortOrder);
        }
        LogValuesFilter.prototype.toDto = function () {
            var dto = {
                LogIDs: this.logIds(),
                StartDate: moment(this.startDate()).toMSDateTimeOffset(),
                EndDate: moment(this.endDate()).toMSDateTimeOffset(),
                SortOrder: this.sortOrder(),
                MaxResults: this.maxResults()
            };
            return dto;
        };
        return LogValuesFilter;
    }());
    return LogValuesFilter;
});
//# sourceMappingURL=logValuesFilter.js.map