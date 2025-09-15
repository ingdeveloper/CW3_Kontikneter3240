define(["require", "exports"], function (require, exports) {
    "use strict";
    var SignalLogTagFilter = /** @class */ (function () {
        function SignalLogTagFilter(signalId, logTag) {
            this.signalId = ko.observable();
            this.logTag = ko.observable();
            this.signalId(signalId);
            this.logTag(logTag);
        }
        return SignalLogTagFilter;
    }());
    return SignalLogTagFilter;
});
//# sourceMappingURL=signalLogTagFilter.js.map