define(["require", "exports"], function (require, exports) {
    "use strict";
    var ConnectorBase = /** @class */ (function () {
        function ConnectorBase() {
        }
        ConnectorBase.prototype.extractI4SignalDeclaration = function (name) {
            var deviceName = "";
            var signalName = "";
            name = ko.unwrap(name);
            if (name) {
                var indexOfSeparator = name.indexOf(ConnectorBase.DeviceSignalDelimitter);
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
        ConnectorBase.prototype.getSignalNameFromDeclaration = function (declaration) {
            if (!declaration)
                return "";
            return declaration.deviceName !== ""
                ? declaration.deviceName + ConnectorBase.DeviceSignalDelimitter + declaration.signalName
                : declaration.signalName;
        };
        ConnectorBase.getOrCreateClientConfiguration = function () {
            window.clientConfiguration = window.clientConfiguration ||
                {
                    useVirtualKeyboard: false,
                    languageCode: "en",
                    updateRate: 500
                };
            return window.clientConfiguration;
        };
        ConnectorBase.DeviceSignalDelimitter = "::";
        ConnectorBase.isGuid = function (value) {
            var regex = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");
            return value && regex.test(value);
        };
        return ConnectorBase;
    }());
    return ConnectorBase;
});
//# sourceMappingURL=connectorBase.js.map