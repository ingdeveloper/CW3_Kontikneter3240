/*
    ccw-wf-value.js
    Änderung:
    30.06.2018: -CSS-Klasse mit als Übergabeparameter

    */

define(['../services/connector', "../components/services/secured.service"],
    function (signalsConnector, securedService) {

        var ccwwfValue = function (params) {
            var self = this;
            self.connector = new signalsConnector();

            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || '').stringPlaceholderResolver(self.objectID); //!!!
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;

            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || '').stringPlaceholderResolver(self.objectID);

            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "0,0.0";
            self.isAlphanumeric = ko.unwrap(self.settings.isAlphanumeric) !== undefined ? ko.unwrap(self.settings.isAlphanumeric) : false;

            self.displayClass = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) : 'ccw-wf-input-tastatur ccw-wf-input-tastatur-disabledClass-xs'; //default-Vorgabe geändert am 2.02.2018
            self.css = ko.observable(self.displayClass);
            self.unitLabel = ko.unwrap(self.settings.unitLabel) !== undefined ? ko.unwrap(self.settings.unitLabel) : false;
            self.staticUnitText = (ko.unwrap(self.settings.staticUnitText) || '').stringPlaceholderResolver(self.objectID);
            self.precision = ko.unwrap(self.settings.precision) ? ko.unwrap(self.settings.precision) : 1;

            self.signalName = (ko.unwrap(self.settings.signalName) || '').stringPlaceholderResolver(self.objectID); //!!!

            self.signalFaktor = ko.unwrap(self.settings.signalFaktor) ? ko.unwrap(self.settings.signalFaktor) : 1; //2.02.2017 neu hinzugefügt AM
            self.signalValue = '';

            self.elemBreite = ko.unwrap(self.settings.elemBreite) !== undefined ? ko.unwrap(self.settings.elemBreite) : "100%";
            self.elemBreiteVal = ko.unwrap(self.settings.elemBreiteVal) !== undefined ? ko.unwrap(self.settings.elemBreiteVal) : "70%";
            self.fontSize = ko.unwrap(self.settings.fontSize) !== undefined ? ko.unwrap(self.settings.fontSize) : 'inherit';
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.isBCD = ko.unwrap(self.settings.isBCD) !== undefined ? ko.unwrap(self.settings.isBCD) : false;
            self.textAlign = ko.unwrap(self.settings.textAlign) !== undefined ? ko.unwrap(self.settings.textAlign) : 'right';

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

                //self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision, numeralNumber: self.format, fillNull: self.vorKommaStellen });
                //self.signalValue = self.signalValue2.value.extend({ pluseins: 1 });
                // self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision, ccwFormat: self.ccwFormat });//, numeric: self.precision , ccwFormat: self.ccwFormat
                //self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision });//, numeric: self.precision , ccwFormat: self.ccwFormat
                //self.signalValue = self.signal.value.extend({ numeralNumber: self.format });


            }

            self.displayClassBerechnen = ko.computed(function () {
                var self = this;
                // console.log("ccw-wf-value-log Computed");
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist
                var signal = self.signal.value;
                var css = "";
                if ((signal() === undefined) || (signal() === null)) {
                    ohneSignal = true;
                    console.log("%cccw-wf-value Ohne Signal: " + self.signal.signalName(), "background: #FA58F4");
                }
                // console.log("ccw-wf-value-log", signal(), ohneSignal);
                
                if (ohneSignal) {
                    css = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) +' ccw-wf-input-tastatur-ohneSignal' : 'ccw-wf-input-tastatur ccw-wf-input-tastatur-disabledClass-xs ccw-wf-input-tastatur-ohneSignal';
                }else{
                    css = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) : 'ccw-wf-input-tastatur ccw-wf-input-tastatur-disabledClass-xs';
                }
                self.css(css);
                return;
            }, self);

            self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
        };

        ccwwfValue.prototype.dispose = function () {
            var self = this;
            
            // self.vStyle.dispose();
            
            if (!self.signal)
                return;
            return self.connector.unregisterSignals(self.signal);
        };

        ccwwfValue.prototype.aliasInfo = function () {
            var self = this;

            if (self.infoAktiv == true) {
                toastr.info("Signal: " + self.signalName);
            }
            return false;
        };

        return ccwwfValue;

    });