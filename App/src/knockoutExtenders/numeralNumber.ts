import Connector = require("../services/connector");

declare var numeral;

class NumeralNumber {
    public static init(connector: Connector) {
        ko.extenders['numeralNumber'] = (target: any, format: string) => {

            var result = ko.computed(() => {
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
    }
}

export = NumeralNumber;