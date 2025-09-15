define(['../services/connector', "../components/services/states.service", "../components/services/secured.service"],
    function (signalsConnector, statesService, securedService) {

        var wfButton = function (params) {
            var self = this;
            self.connector = new signalsConnector();

            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);
            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || "").stringPlaceholderResolver(self.objectID);

            //#region Properties
            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
          
            self.buttonText = (ko.unwrap(self.settings.buttonText) || '').stringPlaceholderResolver(self.objectID);

            self.enableSignalName = (ko.unwrap(self.settings.enableSignalName) || '').stringPlaceholderResolver(self.objectID);
            self.visibilitySignalName = (ko.unwrap(self.settings.visibilitySignalName) || '').stringPlaceholderResolver(self.objectID);

            self.enableSignalValue = ko.unwrap(self.settings.enableSignalValue) !== undefined ? ko.unwrap(self.settings.enableSignalValue) : '';
            self.visibilitySignalValue = ko.unwrap(self.settings.visibilitySignalValue) !== undefined ? ko.unwrap(self.settings.visibilitySignalValue) : '';

            self.enableOperator = ko.unwrap(self.settings.enableOperator) || "==";
            self.visibilityOperator = ko.unwrap(self.settings.visibilityOperator) || "==";

            self.cssClass = ko.unwrap(self.settings.cssClass) || 'btn-default';
            self.iconClass = ko.unwrap(self.settings.iconClass) || '';
            self.buttonStyle = ko.unwrap(self.settings.buttonStyle) || '';
            self.iconStyle = ko.unwrap(self.settings.iconStyle) || '';
            self.textStyle = ko.unwrap(self.settings.textStyle) || '';

            self.cssClassNames = [
                self.settings.cssClassNormalState || "normal",
                self.settings.cssClassState1 || "state1",
                self.settings.cssClassState2 || "state2",
                self.settings.cssClassState3 || "state3",
                self.settings.cssClassState4 || "state4",
                self.settings.cssClassState5 || "state5",
                self.settings.cssClassState6 || "state6",
                self.settings.cssClassState7 || "state7",
                self.settings.cssClassState8 || "state8"
            ];

            self.states = new statesService(self.settings);
            self.statusCssClass = ko.computed(function () {
                for (var i = 1; i < self.cssClassNames.length; i++) {
                    if (ko.unwrap(self.states.currentState).match("state" + i)) {
                        return self.cssClassNames[i];
                    }
                }
                return self.cssClassNames[0];
            }, self);

            self.visibilitySignal = self.visibilitySignalName ? self.connector.getSignal(self.visibilitySignalName) : null;
            self.isVisible = ko.computed(function () {
                var self = this;

                if (!self.visibilitySignal || !self.visibilitySignalValue)
                    return true;

                return evaluateCondition(self.visibilitySignal.value(), self.visibilitySignalValue, self.visibilityOperator);
            }, self);

            self.enableSignal = self.enableSignalName ? self.connector.getSignal(self.enableSignalName) : null;
            self.isDisabled = ko.computed(function () {
                var self = this;

                if (!self.enableSignal || !self.enableSignalValue)
                    return false;

                return !evaluateCondition(self.enableSignal.value(), self.enableSignalValue, self.enableOperator);
            }, self);
            self.clearBuffer = ko.unwrap(self.settings.clearBuffer) !== undefined ? ko.unwrap(self.settings.clearBuffer) : false;

            //#endregion

            // Stop here and return if no signalName was configured
            if (!ko.unwrap(self.signalName)) {
                return null;
            }

        }


        wfButton.prototype = {

            writeFromBuffer: function () {
                var self = this;
                self.clearBuffer ? self.connector.clearSignalBuffer() : self.connector.writeSignalsFromBuffer();
            },

            evaluateCondition: function (param1, param2, operator) {
                switch (operator) {
                    case "==":
                        return param1 == param2;
                    case "!=":
                        return param1 != param2;
                    case "<":
                        return param1 < param2;
                    case ">":
                        return param1 > param2;
                    case "<=":
                        return param1 <= param2;
                    case ">=":
                        return param1 >= param2;
                    default:
                        return false;
                }
            }
        }

        return wfButton;
    });