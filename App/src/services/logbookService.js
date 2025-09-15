define(["require", "exports", "./logbookSource", "./api"], function (require, exports, LogbookSource, Api) {
    "use strict";
    var LogbookService = /** @class */ (function () {
        function LogbookService() {
        }
        LogbookService.getLogbookEntries = function (filter) {
            return new LogbookSource(filter, LogbookService.UpdateRate);
        };
        LogbookService.getLogbookTopics = function () {
            return Api.logbookService.getLogbookTopics();
        };
        LogbookService.addLogbookEntry = function (logbookEntry) {
            return Api.logbookService.addLogbookEntry(logbookEntry);
        };
        LogbookService.UpdateRate = 5000;
        return LogbookService;
    }());
    return LogbookService;
});
//# sourceMappingURL=logbookService.js.map