var _this = this;
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return this.replace(/{(\d+)}/g, function (match, placeholder) { return (typeof args[placeholder] != 'undefined' ? args[placeholder] : match); });
};
// Pad a string with defined characters to a certain length 
// For example: var str = "5";
// alert(str.lpad("0", 4)); //result "0005"
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};
String.prototype.stringPlaceholderResolver = function (OIDvalue, replaceAsLocalObjectId) {
    if (replaceAsLocalObjectId === void 0) { replaceAsLocalObjectId = true; }
    var str = ko.unwrap(this);
    if (str === undefined || str === null)
        str = "";
    if (ko.unwrap(OIDvalue)) {
        str = str.split('[OID]').join(ko.unwrap(OIDvalue));
        if (replaceAsLocalObjectId) {
            str = str.split('[LocalOID]').join(ko.unwrap(OIDvalue));
        }
    }
    return str.valueOf();
};
String.prototype.extractI4SignalDeclaration = function () {
    var deviceName = "";
    var signalName = "";
    var name = ko.unwrap(_this);
    if (name) {
        var indexOfSeparator = name.indexOf("->");
        if (indexOfSeparator === -1) {
            signalName = name;
        }
        else {
            deviceName = name.substring(0, indexOfSeparator);
            signalName = name.substring(indexOfSeparator + 2);
        }
    }
    return {
        signalName: signalName,
        deviceName: deviceName
    };
};
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}
//# sourceMappingURL=wf.extensions.string.js.map