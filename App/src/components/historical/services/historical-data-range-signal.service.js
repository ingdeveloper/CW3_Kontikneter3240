var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "../../../services/connector"], function (require, exports, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalDataRangeSignalService = void 0;
    var HistoricalDataRangeSignalService = /** @class */ (function () {
        function HistoricalDataRangeSignalService() {
            this.connector = new Connector();
            this.startSignals = [];
            this.endSignals = [];
            this.startSubscriptions = [];
            this.endSubscriptions = [];
            this.startValueUpdates = ko.observable();
            this.endValueUpdates = ko.observable();
        }
        HistoricalDataRangeSignalService.prototype.subscribeStartValues = function (callback, target, event) {
            return this.startValueUpdates.subscribe(callback, target, event);
        };
        HistoricalDataRangeSignalService.prototype.subscribeEndValues = function (callback, target, event) {
            return this.endValueUpdates.subscribe(callback, target, event);
        };
        HistoricalDataRangeSignalService.prototype.addStartSignal = function (name) {
            this.add(name, this.startSignals, this.startSubscriptions, this.startValueUpdates);
        };
        HistoricalDataRangeSignalService.prototype.removeAllStartSignals = function () {
            this.removeAll(this.startSignals, this.startSubscriptions);
            this.startSignals = [];
            this.startSubscriptions = [];
        };
        HistoricalDataRangeSignalService.prototype.addEndSignal = function (name) {
            this.add(name, this.endSignals, this.endSubscriptions, this.endValueUpdates);
        };
        HistoricalDataRangeSignalService.prototype.removeAllEndSignals = function () {
            this.removeAll(this.endSignals, this.endSubscriptions);
            this.endSignals = [];
            this.endSubscriptions = [];
        };
        HistoricalDataRangeSignalService.prototype.add = function (name, signals, subscriptions, updater) {
            var signal = _.find(signals, function (item) { return item.signalName() === name; });
            if (!signal) {
                signal = this.connector.getSignal(name);
                signals.push(signal);
                this.connector.getOnlineUpdates();
                this.addSubscription(signal, subscriptions, updater);
            }
            updater({
                name: signal.signalName(),
                value: signal.value()
            });
        };
        HistoricalDataRangeSignalService.prototype.removeAll = function (signals, subscriptions) {
            var e_1, _a, _b;
            try {
                for (var subscriptions_1 = __values(subscriptions), subscriptions_1_1 = subscriptions_1.next(); !subscriptions_1_1.done; subscriptions_1_1 = subscriptions_1.next()) {
                    var subscription = subscriptions_1_1.value;
                    subscription.dispose();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (subscriptions_1_1 && !subscriptions_1_1.done && (_a = subscriptions_1.return)) _a.call(subscriptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            (_b = this.connector).unregisterSignals.apply(_b, __spread(signals));
        };
        HistoricalDataRangeSignalService.prototype.addSubscription = function (signal, subscriptions, updater) {
            var subscription = signal.value.subscribe(function () {
                updater({
                    name: signal.signalName(),
                    value: signal.value()
                });
            });
            subscriptions.push(subscription);
        };
        HistoricalDataRangeSignalService.prototype.dispose = function () {
            this.removeAllStartSignals();
            this.removeAllEndSignals();
        };
        return HistoricalDataRangeSignalService;
    }());
    exports.HistoricalDataRangeSignalService = HistoricalDataRangeSignalService;
});
//# sourceMappingURL=historical-data-range-signal.service.js.map