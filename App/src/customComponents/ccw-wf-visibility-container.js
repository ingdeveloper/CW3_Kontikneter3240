/*
    ccw-wf-visibility-container.js
    Änderung:
    20.10.2020: -Erstelldatum   amueller

    */

define(['../services/connector', "../components/services/secured.service"],
    function (signalsConnector, securedService) {

        var ccwwfVisibilityContainer = function (params) {
            var self = this;
            self.connector = new signalsConnector();

            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || '').stringPlaceholderResolver(self.objectID); //!!!
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;

            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "0,0.0";
            self.isAlphanumeric = ko.unwrap(self.settings.isAlphanumeric) !== undefined ? ko.unwrap(self.settings.isAlphanumeric) : false;

            self.signalName = (ko.unwrap(self.settings.signalName) || '').stringPlaceholderResolver(self.objectID); //!!!
            self.signalMask = ko.unwrap(self.settings.signalMask) !== undefined ? ko.unwrap(self.settings.signalMask) : -1;
            self.signalOperator = ko.unwrap(self.settings.signalOperator) !== undefined ? ko.unwrap(self.settings.signalOperator) : '===';

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
                //console.info("Type vom Value.extend=" + (self.signal.value));//2.02.2017  "* self.signalFaktor" neu hinzugefügt AM
                if (self.isBCD) {
                    self.signalValue = self.signal.value.extend({
                        isBCD: self.format
                    });
                } else {
                    self.signalValue = self.signal.value.extend({
                        numeralNumber: self.format
                    });

                }

            }

            self.anzeigen = ko.computed(function () {
                var self = this;
                var value = self.signal.value();
                var mask = self.signalMask;

                if (value == null) return false;
                switch (self.signalOperator) {
                    case ">":
                        return value > mask;
                    case ">=":
                        return value >= mask;
                    case "<":
                        return value < mask;
                    case "<=":
                        return value <= mask;
                    case "!=":
                        return value != mask;
                    case "!==":
                        return value !== mask;
                    case "&":
                        return (value & mask) === mask;
                    //OR bit link the signal with the mask, the condition is TRUE if the linking equals the mask
                    //ex.: stateSignalValue1: 1, maskSignal1: 3 =>  1|3=3 => 3==3 => true
                    //ex.: stateSignalValue1: 2, maskSignal1: 3 =>  2|3=3 => 3==3 => true
                    //ex.: stateSignalValue1: 4, maskSignal1: 3 =>  4|3=7 => 7==3 => false
                    case "|":
                        return (value | mask) === mask;
                    default:
                        return value === mask;
                }
            }, self);

            self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
        };

        ccwwfVisibilityContainer.prototype.dispose = function () {
            var self = this;

            if (!self.signal)
                return;
            self.connector.unregisterSignals(self.signal);
            self.anzeigen.dispose();
        };


        return ccwwfVisibilityContainer;

    });