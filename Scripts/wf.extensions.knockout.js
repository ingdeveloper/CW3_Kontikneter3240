// setup knockout plugins
ko.punches.enableAll();
ko.punches.interpolationMarkup.enable();
ko.punches.attributeInterpolationMarkup.enable();

ko.filters.numberFormat = function(value, format) {
    var unwrappedValue = ko.unwrap(value);
    return numeral(unwrappedValue).format(format);
};
ko.filters.dynamicNumberFormat = function(value) {
    var unwrappedValue = ko.unwrap(value);
    var format;
    var absValue = Math.abs(unwrappedValue);

    if (absValue === 0) {
        return "0";
    }
    else if (absValue < 0.0001 && absValue > 0) {
        return unwrappedValue.toExponential();
    } else if (absValue < 0.001) {
        format = "0,0.00000";
    } else if (absValue < 0.01) {
        format = "0,0.0000";
    } else if (absValue < 1) {
        format = "0,0.000";
    } else if (absValue < 100) {
        format = "0,0.00";
    } else {
        format = "0,0";
    }

    return numeral(unwrappedValue).format(format);
};
ko.filters.percentageFormat = function(value) {
    var unwrappedValue = ko.unwrap(value);
    return numeral(unwrappedValue).format("0.00%");
};
ko.filters.dateFormat = function(value, format) {
    var unwrappedValue = ko.unwrap(value);

    return moment(unwrappedValue).format(format);
};


//Based on Knockstrap https://github.com/faulknercs/Knockstrap
ko.utils.uniqueId = (function () {

    var prefixesCounts = {
        'ks-unique-': 0
    };

    return function (prefix) {
        prefix = prefix || 'ks-unique-';

        if (!prefixesCounts[prefix]) {
            prefixesCounts[prefix] = 0;
        }

        return prefix + prefixesCounts[prefix]++;
    };
})();


//Based on Knockstrap https://github.com/faulknercs/Knockstrap
ko.utils.unwrapProperties = function (wrappedProperies) {

    if (wrappedProperies === null || typeof wrappedProperies !== 'object') {
        return wrappedProperies;
    }

    var options = {};

    ko.utils.objectForEach(wrappedProperies, function (propertyName, propertyValue) {
        options[propertyName] = ko.unwrap(propertyValue);
    });

    return options;
};