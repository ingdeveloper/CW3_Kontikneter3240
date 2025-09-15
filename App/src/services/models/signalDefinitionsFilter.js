define(["require", "exports"], function (require, exports) {
    "use strict";
    var SignalDefinitionsFilter = /** @class */ (function () {
        function SignalDefinitionsFilter(serverNames, aliasNames, logTags, resultsFilter) {
            this.serverNames = ko.observableArray([]);
            this.aliasNames = ko.observableArray([]);
            this.logTags = ko.observableArray([]);
            this.resultsFilter = ko.observable();
            this.serverNames(serverNames);
            this.aliasNames(aliasNames);
            this.logTags(logTags);
            this.resultsFilter(resultsFilter);
        }
        SignalDefinitionsFilter.prototype.toDto = function () {
            var dto = {
                AliasNames: this.aliasNames(),
                LogTags: this.logTags(),
                ResultsFilter: this.resultsFilter(),
                ServerNames: this.serverNames()
            };
            return dto;
        };
        return SignalDefinitionsFilter;
    }());
    return SignalDefinitionsFilter;
});
//# sourceMappingURL=signalDefinitionsFilter.js.map