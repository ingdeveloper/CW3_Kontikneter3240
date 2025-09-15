define(["require", "exports", "../logger", "../deferred", "./_signal"], function (require, exports, Logger, deferred_1, Signals) {
    "use strict";
    var SignalValueType = Signals.SignalValueType;
    var Signal = /** @class */ (function () {
        function Signal(name, defaultValue) {
            var _this = this;
            if (defaultValue === void 0) { defaultValue = Signal.defaultValue; }
            this.id = ko.observable();
            this.signalName = ko.observable();
            this.value = ko.observable();
            this.valueType = ko.observable(SignalValueType.Plausible)
                .extend({ notify: 'always' });
            this.hasValue = ko.pureComputed(function () {
                var value = _this.value();
                return value !== null && value !== undefined && value !== Signal.defaultValue;
            }, this);
            this.definition = ko.observable();
            this.referenceCount = 0;
            this.signalName(name);
            this.setValue(defaultValue, SignalValueType.Plausible);
            this.deferredId = new deferred_1.Deferred();
            this.definition.subscribe(function (value) {
                if (!_this.deferredDefinition) {
                    _this.deferredDefinition = new deferred_1.Deferred();
                }
                if (!_this.deferredDefinition.isResolved()) {
                    _this.deferredDefinition.resolve(value);
                }
                else {
                    Logger.info("Signal: double resolse", _this.signalName());
                }
            });
            this.id.subscribe(function (value) {
                _this.deferredId.resolve(value);
                if (!value) {
                    _this.definition(null); //setting of this to null should make the deferredDefinition be resolved with NULL
                }
            });
        }
        Signal.prototype.addSubscriber = function (runLogging) {
            //wenn Parameter leer, dann Logging auf FALSE setzen (amueller 14.11.2019)
            if ((runLogging === void 0) || (runLogging === undefined)) {
                runLogging = false;
            }
            this.referenceCount++;
            if (runLogging) { //amueller 14.11.2019 hier neue Bedingung, um das Logging zu schalten
                Logger.info(this, "Subscribed to " + this.signalName() + " [total subscriptions: " + this.referenceCount + "]");
            }
        };
        Signal.prototype.releaseSubscriber = function () {
            this.referenceCount = Math.max(this.referenceCount - 1, 0);
            Logger.info(this, "Unsubscribed from " + this.signalName() + " [total subscriptions: " + this.referenceCount + "]");
        };
        Signal.prototype.hasSubscribers = function () {
            return this.referenceCount > 0;
        };
        Signal.prototype.setValue = function (value, type) {
            if (type === void 0) { type = SignalValueType.Plausible; }
            this.value(value);
            this.valueType(type);
        };
        Signal.defaultValue = "n/a";
        return Signal;
    }());
    return Signal;
});
//# sourceMappingURL=signal.js.map