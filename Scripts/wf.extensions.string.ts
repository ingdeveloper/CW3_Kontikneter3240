interface String {
    format(...args: any[]): string;
    lpad(padString, length): string;
    stringPlaceholderResolver(OIDvalue): string;
    extractI4SignalDeclaration(): I4SignalDeclaration;
}

String.prototype.format = function (...args: any[]): string {
    return this.replace(/{(\d+)}/g, (match, placeholder) => (typeof args[placeholder] != 'undefined' ? args[placeholder] : match));
}

// Pad a string with defined characters to a certain length 
// For example: var str = "5";
// alert(str.lpad("0", 4)); //result "0005"
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

String.prototype.stringPlaceholderResolver = function (OIDvalue, replaceAsLocalObjectId: boolean=true) {
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

String.prototype.extractI4SignalDeclaration = (): I4SignalDeclaration => {
    let deviceName = "";
    let signalName = "";
    var name = (ko.unwrap(this) as any);

    if (name) {
        let indexOfSeparator = name.indexOf("->");

        if (indexOfSeparator === -1) {
            signalName = name;
        } else {
            deviceName = name.substring(0, indexOfSeparator);
            signalName = name.substring(indexOfSeparator + 2);
        }
    }

    return {
            signalName: signalName,
            deviceName: deviceName
        } as I4SignalDeclaration;
};

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}