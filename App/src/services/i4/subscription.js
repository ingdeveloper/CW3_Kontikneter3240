define(["require", "exports"], function (require, exports) {
    "use strict";
    var Subscription = /** @class */ (function () {
        function Subscription(id, observer) {
            this.state = { id: id, timestamp: ko.observable(), value: ko.observable() };
            this.observers = ko.observableArray([observer]);
        }
        Subscription.prototype.updateState = function (measurement) {
            var _this = this;
            if (!measurement)
                return;
            this.state.timestamp(moment.utc(measurement.timestamp));
            this.state.value(measurement.value);
            this.state.name = String(measurement.signalId);
            this.observers()
                .filter(_.isFunction)
                .forEach(function (observer) {
                observer(_this.state);
            });
        };
        return Subscription;
    }());
    return Subscription;
});
//# sourceMappingURL=subscription.js.map