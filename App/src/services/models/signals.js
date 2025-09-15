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
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Signals = /** @class */ (function () {
        function Signals() {
            this.localSignals = [];
            this.remoteSignals = [];
        }
        /**
         * Creates a {Signals} object given a dictionary of signalName=>value entries.
         * @param {SignalValue} signals The signal value dictionary
         * @returns {Signals} A signals object which splits the inputs into local and remote signals.
         */
        Signals.fromSignalValues = function (signals) {
            var e_1, _a;
            var result = new Signals();
            try {
                for (var _b = __values(Object.keys(signals)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    if (Signals.isLocalSignal(key)) {
                        result.localSignals.push({
                            name: key,
                            value: signals[key]
                        });
                    }
                    else {
                        result.remoteSignals.push({
                            name: key,
                            value: signals[key]
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        };
        /**
         * Creates a new Signals object from a list of signal names.
         * @param {string[]} signalNames The signal names
         * @returns {Signals} A signals object which splits the inputs into local and remote signals.
         */
        Signals.fromSignalNames = function (signalNames) {
            var e_2, _a;
            var result = new Signals();
            try {
                for (var signalNames_1 = __values(signalNames), signalNames_1_1 = signalNames_1.next(); !signalNames_1_1.done; signalNames_1_1 = signalNames_1.next()) {
                    var name_1 = signalNames_1_1.value;
                    if (Signals.isLocalSignal(name_1)) {
                        result.localSignals.push({
                            name: name_1
                        });
                    }
                    else {
                        result.remoteSignals.push({
                            name: name_1
                        });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (signalNames_1_1 && !signalNames_1_1.done && (_a = signalNames_1.return)) _a.call(signalNames_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        };
        /**
         * Creates a {SignalValueDTO} result from a {Signals} structure in the order defined by {signalNames}
         * @param signalNames The signal names. Results will be returned exactly in this order.
         * @param {Signals} signals The {Signals] object containing the values and the results.
         * @returns {SignalValueDTO[]} An array of {SignalValueDTO} objects containing the values.
         */
        Signals.toSignalValueDTOs = function (signalNames, signals) {
            var signalMap = this.addToSignalMap(signals.localSignals, {});
            signalMap = this.addToSignalMap(signals.remoteSignals, signalMap);
            return signalNames.map(function (x) { return ({
                Result: signalMap[x].result,
                Value: signalMap[x].value
            }); });
        };
        Signals.addToSignalMap = function (signals, signalMap) {
            return signals.reduce(function (result, current) {
                result[current.name] = current;
                return result;
            }, signalMap);
        };
        /**
         * Checks whether a signal name represents a local or a remote signal.
         * @param {string} signalName The name of the signal to be checked
         * @returns {boolean} True if the signal is local.
         */
        Signals.isLocalSignal = function (signalName) {
            return signalName.indexOf("local://") === 0;
        };
        return Signals;
    }());
    return Signals;
});
//# sourceMappingURL=signals.js.map