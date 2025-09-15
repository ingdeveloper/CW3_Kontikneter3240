define(["require", "exports"], function (require, exports) {
    "use strict";
    var NumeralNumber = /** @class */ (function () {
        function NumeralNumber() {
        }
        NumeralNumber.init = function (connector) {
            ko.extenders['numeralNumber'] = function (target, format) {
                var result = ko.computed(function () {
                    var languageId = connector.currentLanguageId();
                    var current = target();
                    var numeralFormat = format || "0,0.00";
                    var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(current);
                    if (newValueAsNum !== "NaN") {
                        return numeral(newValueAsNum).format(numeralFormat);
                    }
                    return newValueAsNum;
                });
                //return the new computed observable
                return result;
            };
        };
        return NumeralNumber;
    }());
    return NumeralNumber;
});
//# sourceMappingURL=numeralNumber.js.map