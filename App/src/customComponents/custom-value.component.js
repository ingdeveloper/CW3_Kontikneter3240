define(["require", "exports", "../services/connector", "../components/services/secured.service"], function (require, exports, Connector, SecuredService) {
    "use strict";
    var CustomValueComponent = /** @class */ (function () {
        function CustomValueComponent(params) {
            this.connector = new Connector();
            this.settings = params;
            this.objectID = ko.unwrap(this.settings.objectID);
            this.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.securedService = new SecuredService(this.projectAuthorization);
            this.hasAuthorization = this.securedService.hasAuthorization;
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
            this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.signalValue = '';
            // Stop here and return if no signalName was configured
            if (!this.signalName) {
                return null;
            }
            this.signal = this.connector.getSignal(this.signalName);
            if (this.isAlphanumeric) {
                this.signalValue = this.signal.value;
            }
            else {
                this.signalValue = this.signal.value.extend({ numeralNumber: this.format });
            }
            this.connector.getOnlineUpdates();
        }
        CustomValueComponent.prototype.dispose = function () {
            if (!this.signal)
                return;
            return this.connector.unregisterSignals(this.signal);
        };
        ;
        return CustomValueComponent;
    }());
    return CustomValueComponent;
});
//# sourceMappingURL=custom-value.component.js.map