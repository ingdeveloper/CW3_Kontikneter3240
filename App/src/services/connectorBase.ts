class ConnectorBase {

    protected static DeviceSignalDelimitter = "::";

    protected extractI4SignalDeclaration(name: string): I4SignalDeclaration {
        let deviceName = "";
        let signalName = "";
        name = ko.unwrap(name);

        if (name) {
            let indexOfSeparator = name.indexOf(ConnectorBase.DeviceSignalDelimitter);

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
    }

    protected getSignalNameFromDeclaration(declaration: I4SignalDeclaration): any {
        if (!declaration)
            return "";

        return declaration.deviceName !== ""
                   ? declaration.deviceName + ConnectorBase.DeviceSignalDelimitter + declaration.signalName
                   : declaration.signalName;
    }

    protected static isGuid = (value: string): boolean => {
        let regex = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");

        return value && regex.test(value);
    }

    public static getOrCreateClientConfiguration(): any {
        window.clientConfiguration = window.clientConfiguration ||
            {
                useVirtualKeyboard: false,
                languageCode: "en",
                updateRate: 500
            };

        return window.clientConfiguration;
    }
}
export = ConnectorBase;