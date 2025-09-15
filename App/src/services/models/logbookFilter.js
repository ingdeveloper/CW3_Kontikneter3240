define(["require", "exports"], function (require, exports) {
    "use strict";
    var LogbookFilter = /** @class */ (function () {
        function LogbookFilter() {
            this.topN = ko.observable(null);
            this.topic = ko.observable(null);
            this.author = ko.observable(null);
            this.from = ko.observable();
            this.to = ko.observable();
            this.format = ko.observable(null);
        }
        LogbookFilter.prototype.toDto = function () {
            var dto = {
                TopN: this.topN(),
                Topic: this.topic(),
                Author: this.author(),
                From: this.from() ? this.from().utc().toMSDate() : null,
                To: this.to() ? this.to().utc().toMSDate() : null,
                Format: this.format()
            };
            return dto;
        };
        return LogbookFilter;
    }());
    return LogbookFilter;
});
//# sourceMappingURL=logbookFilter.js.map