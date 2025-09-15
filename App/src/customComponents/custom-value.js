define(['../services/connector', "../components/services/secured.service"],
    function (signalsConnector, securedService) {

        var wfValue = function (params) {
            var self = this;

            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;


            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "0,0.[00]";
            self.isAlphanumeric = ko.unwrap(self.settings.isAlphanumeric) !== undefined ? ko.unwrap(self.settings.isAlphanumeric) : false;
            self.unitLabel = ko.unwrap(self.settings.unitLabel) !== undefined ? ko.unwrap(self.settings.unitLabel) : false;

            self.signalName = (ko.unwrap(self.settings.signalName) || '').stringPlaceholderResolver(self.objectID);

            self.signalValue = '';

            // Stop here and return if no signalName was configured
            if (!self.signalName) {
                return null;
            }

            self.connector = new signalsConnector();
            self.signal = self.connector.getSignal(self.signalName);

            if (self.isAlphanumeric) {
                self.signalValue = self.signal.value;
            } else {
                self.signalValue = self.signal.value.extend({ numeralNumber: self.format });
            }

            self.connector.getOnlineUpdates();//.fail(self.connector.handleError(self));
        };

        wfValue.prototype.dispose = function () {
            var self = this;

            if (!self.signal)
                return;
            return self.connector.unregisterSignals(self.signal);
        };

        return wfValue;

    });