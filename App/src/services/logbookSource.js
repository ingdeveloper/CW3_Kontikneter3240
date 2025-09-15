define(["require", "exports", "./api"], function (require, exports, Api) {
    "use strict";
    var LogbookSource = /** @class */ (function () {
        function LogbookSource(filter, updateRate) {
            this.filter = filter;
            this.updateRate = updateRate;
            this.isPollingEnabled = false;
            this.logsEntries = ko.observableArray([]);
            this.filterDto = filter.toDto();
            this.updateRate = updateRate;
        }
        LogbookSource.prototype.startPolling = function () {
            if (this.isPollingEnabled) {
                return;
            }
            this.filterDto = this.filter.toDto();
            this.isPollingEnabled = true;
            this.pollData(true);
        };
        LogbookSource.prototype.stopPolling = function () {
            this.isPollingEnabled = false;
        };
        LogbookSource.prototype.pollData = function (immediate) {
            var _this = this;
            if (immediate === void 0) { immediate = true; }
            if (!this.isPollingEnabled) {
                return;
            }
            var timeOut = immediate ? 0 : this.updateRate;
            _.delay(function () { return _this.getLogbookEntries(); }, timeOut);
        };
        LogbookSource.prototype.getLogbookEntries = function () {
            var _this = this;
            Api.logbookService.getLogbookEntries(this.filterDto)
                .then(function (logsEntries) {
                _this.logsEntries(logsEntries);
                _this.pollData(false);
            });
        };
        LogbookSource.prototype.getEntries = function () {
            var _this = this;
            Api.logbookService.getLogbookEntries(this.filterDto)
                .then(function (logsEntries) {
                _this.logsEntries(logsEntries);
            });
        };
        LogbookSource.prototype.getFilterDto = function () {
            var filter = this.filter;
            return filter.toDto();
        };
        return LogbookSource;
    }());
    return LogbookSource;
});
//# sourceMappingURL=logbookSource.js.map