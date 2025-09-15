// Helper Bingind handler for formating dates with moment.js(http://momentjs.com/)
// Example: <span formattedDate: { value: date, format: 'DD.MM.YYYY', locale: 'de' }></span>

ko.bindingHandlers.formattedDate = {
    update: function (element, valueAccessor) {
        var options = ko.unwrap(valueAccessor());
        var value = ko.unwrap(options.value);
        var locale = ko.unwrap(options.locale);

        if (locale)
            moment.locale(locale);

        var format = ko.unwrap(options.format || "DD.MM.YYYY HH:mm:ss");

        if (typeof (value) === "undefined" || value === null) {
            return;
        }

        var momentDate = moment(value);
        var formattedDate = momentDate.format(format);
        $(element).text(formattedDate);
    }
};

// KO binding handlers for formating numerical values with numeral library

// Helper function for format numerical values with numeral library
// http://numeraljs.com/
var formatNumber = function (element, valueAccessor, allBindingsAccessor, format) {
    // Provide a custom text value
    var value = valueAccessor(),
        allBindings = allBindingsAccessor();
    var numeralFormat = allBindings.format || format;
    var strNumber = ko.unwrap(value);

    var language = ko.unwrap(allBindings.language);
    if (language !== undefined)
        numeral.locale(language);

    if (strNumber !== undefined && strNumber !== null) {//therefore 0 is value. But without this check not render value 
        return numeral(strNumber).format(numeralFormat);
    }
    return "";
};

// Can be used for formating values in text
ko.bindingHandlers.numeraltext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};

// Can be used for formating values in input fields
ko.bindingHandlers.numeralvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));

        //handle the field changing
        ko.utils.registerEventHandler(element,
            "change",
            function () {
                var observable = valueAccessor();
                observable($(element).val());
            });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};
// Can be used for formating percent values in text
ko.bindingHandlers.percenttext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));
    }
};
// Can be used for formating percent values in input fields
ko.bindingHandlers.percentvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));

        //handle the field changing
        ko.utils.registerEventHandler(element,
            "change",
            function () {
                var observable = valueAccessor();
                observable($(element).val());
            });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000 %"));
    }
};