interface IWFFilters {
    dateFormat: (value: any, format: string) => string;
    numberFormat: (value: number, format: string) => string;
    dynamicNumberFormat: (value: number) => string;
    percentageFormat: (value: number) => string;
}

interface KnockoutStatic {
    filters: IWFFilters;
}
//ko.filters.numberFormat = function (value, format) {
//    var unwrappedValue = ko.unwrap(value);
//    return numeral(unwrappedValue).format(format);
//}

//ko.filters.dynamicNumberFormat = function (value) {
//    var unwrappedValue = ko.unwrap(value);
//    var format = Math.abs(unwrappedValue) < 100 ? "0,0.00" : "0,0";
//    return numeral(unwrappedValue).format(format);
//}

//ko.filters.percentageFormat = function (value) {
//    var unwrappedValue = ko.unwrap(value);
//    return numeral(unwrappedValue).format("0.00%");
//}

//ko.filters.dateFormat = function (value, format) {
//    var unwrappedValue = ko.unwrap(value);

//    return moment(unwrappedValue).format(format);
//}
