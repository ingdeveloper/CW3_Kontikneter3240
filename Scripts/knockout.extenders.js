ko.extenders.logChange = function (target, option) {
    target.subscribe(function (newValue) {
        console.log(option + ": " + newValue);
    });
    return target;
};

ko.extenders.numeric = function (target, precision) {

    var result = ko.computed(function () {
        var current = target();
        var roundingMultiplier = Math.pow(10, precision);
        var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(+current);

        if (newValueAsNum !== "NaN") {
            var roundedValue = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            return roundedValue;
        }

        return newValueAsNum;
    });

    //return the new computed observable
    return result;
};

//ko.extenders.numeralNumber = function (target, format) {

//    var result = ko.computed(function () {
//        var current = target();
//        var numeralFormat = format || "0,0.00";
        
//        var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(+current);

//        if (newValueAsNum !== "NaN") {
//            return numeral(newValueAsNum).format(numeralFormat);
//        }

//        return newValueAsNum;
//    });

//    //return the new computed observable
//    return result;
//};

//ko.extenders.fullPartOfNumber = function (target, format) {

//    var result = ko.computed(function () {
//        var current = target();
//        var numeralFormat = format || "0.00";

//        var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : current;

//        if (newValueAsNum !== "NaN") {
//            return numeral(newValueAsNum).format(numeralFormat).split(",")[0];
//        }

//        return newValueAsNum;
//    });
//    return result;
//};

//ko.extenders.decimalPartOfNumber = function (target) {

//    var result = ko.computed(function () {
//        var current = target();
//        var numeralFormat = "0.00";

//        var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(+current);

//        if (newValueAsNum !== "NaN") {
//            return numeral(newValueAsNum).format(numeralFormat).split(",")[1];
//        }

//        return newValueAsNum;
//    });
//    return result;
//};

// extension for wf-value date
ko.extenders.date = function (target, options) {

    var result = ko.computed(function () {
        var current = target();

        var locale = ko.unwrap(options.locale) || 'de';
        var format = ko.unwrap(options.format || "DD.MM.YYYY HH:mm:ss");
        moment.locale(locale);

        var newValueAsNum = current === null || typeof (current) === "undefined" || current === "n/a" ? "" : current;
        if (newValueAsNum !== "") {
            return moment(current).format(format);
        }
        return newValueAsNum;
    });

    //return the new computed observable
    return result;
};
//ko.extenders.persist = function (target, option) {
//    target.subscribe(function (newValue) {
//        window.localStorage.setItem(option, newValue);
//    });
//    return target;
//};

//ko.extenders.previousValue = function (target, propertyName) {
//    var previousValue = ko.observable(null);

//    target[propertyName] = ko.computed(previousValue);

//    target.subscribe(function (oldValue) {
//        previousValue(oldValue);
//    }, target, "beforeChange");

//    return target;
//};