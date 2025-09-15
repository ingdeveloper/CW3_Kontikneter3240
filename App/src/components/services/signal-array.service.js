define(["require", "exports", "../../services/logger"], function (require, exports, Logger) {
    "use strict";
    var SignalArrayService = /** @class */ (function () {
        function SignalArrayService(settings, signal) {
            this.settings = settings;
            this.signal = signal;
            this.signalValueFactor = ko.unwrap(this.settings.signalValueFactor) || 1;
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.isArray = ko.unwrap(this.settings.isArray) !== undefined ? ko.unwrap(this.settings.isArray) : false;
            this.arrayIndex = ko.unwrap(this.settings.arrayIndex) || 0;
            this.arrayDelimiter = ko.unwrap(this.settings.arrayDelimiter) || ",";
        }
        Object.defineProperty(SignalArrayService.prototype, "signalValue", {
            get: function () {
                var _this = this;
                return ko.computed(function () {
                    try {
                        var value = ko.unwrap(_this.signal.value);
                        var array = value.toString().split(_this.arrayDelimiter);
                        if (array.length < _this.arrayIndex + 1) {
                            Logger.warn(_this, "The array index is invalid.");
                            return "n/a";
                        }
                        var result = !isNaN(parseFloat(array[_this.arrayIndex]))
                            ? numeral(array[_this.arrayIndex]).multiply(_this.signalValueFactor).format(_this.format)
                            : array[_this.arrayIndex];
                        return result;
                    }
                    catch (error) {
                        Logger.error(_this, error);
                    }
                }, this);
            },
            enumerable: false,
            configurable: true
        });
        SignalArrayService.prototype.getWriteValues = function (writeValue) {
            if (this.signal === undefined || this.signal === null) {
                Logger.warn(this, "The signal is not available.");
                return;
            }
            var currentSignalValue = this.signal.value() || [];
            var array = (Array.isArray(currentSignalValue) ? currentSignalValue : currentSignalValue.split(this.arrayDelimiter)) || [];
            if (array.length > 0 && this.arrayIndex > 0 && array.length < this.arrayIndex + 1) {
                Logger.warn(this, "The array index is invalid.");
                return;
            }
            array[this.arrayIndex] = writeValue;
            writeValue = Array.isArray(currentSignalValue) ? array : array.join();
            return writeValue;
        };
        return SignalArrayService;
    }());
    return SignalArrayService;
});
//# sourceMappingURL=signal-array.service.js.map