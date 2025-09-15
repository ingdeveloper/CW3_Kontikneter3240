define(['../../../services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, dialog, okCancelDialog) {
        var ctor = function () {
            var self = this;
            self.observables = [];
        };

        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();

                self.connector.clearSignalBuffer();
                self.connector.clearListenRegisterTable(); // Liste registrierter Signale löschen
                self.connector.startListenRegisterTable(); // Überwachung Signalregistrierung starten

                // Blinken Sendebutton ######################################################################
                self.observables.push(self.sendBtnCss = ko.computed(function () {
                    var self = this;
                    var css = '';
                    var sendBufferLeer = self.connector.signalBufferIsEmpty();

                    if (!sendBufferLeer) {
                        return 'ccw-flash-bg';
                    }
                }, self));
                // ##########################################################################################

                // Signalnamen sammeln ######################################################################
                // Signal zum Reload der Clients
                self.signalReloadTime = 'ReloadTime';
                // ##########################################################################################

                // Werte / Status ###########################################################################
                // Ausgabe Reload Zeitstempel
                self.observables.push(self.wertReloadTime = ko.computed(function () {
                    var self = this;
                    var value = self.connector.getSignal(self.signalReloadTime).value();
                    return value;
                }, self));
                // ##########################################################################################

                self.connector.stopListenRegisterTable(); // Überwachung Signalregistrierung stoppen
                console.info('%c__________Registrierte Signale__________', 'background: tomato;');
                console.info(self.connector.getAllListenRegisteredSignals()); // Alle registrierten Signale ausgeben

                return self.connector.getOnlineUpdates();
            },

            compositionComplete: function () {
                var self = this;

            },

            attached: function () {
                var self = this;

            },

            detached: function () {
                var self = this;
                var registeredSignals = self.connector.getAllListenRegisteredSignals(); // Alle registrierten Signale ausgeben

                for (var key in self.observables) {
                    if (self.observables.hasOwnProperty(key)) {
                        self.observables[key].dispose();
                    }
                }

                self.connector.clearSignalBuffer();
                self.connector.unregisterSignals(registeredSignals);
            },

            close: function () {
                var self = this;
                self.connector.clearSignalBuffer();
                dialog.close(self, "");
            },

            setReloadTime: function () {
                var self = this;
                var values = {};
                dialog.show(
                    new okCancelDialog('Ja', 'Nein', 'Reload alle Clients ?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                )
                    .then(function (dialogResult) {
                        if (dialogResult === 'ClosedOkay') {
                            values[self.signalReloadTime] = new Date().toLocaleString();
                            self.connector.writeSignals(values).then(function (result) {
                                if (result.errorMessage) {
                                    toastr.error(result.errorMessage);
                                }
                            });
                        }
                    });
            },

            sendWerteZurSps: function () {
                var self = this;
                var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
                var len = bufferSignale.length;
                var i;
                var values = {};

                console.log('%cSend Werte zur SPS ', 'background:orange');

                if (len > 0) {
                    dialog.show(
                        new okCancelDialog('Ja', 'Nein', 'Werte zur Steuerung senden ?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                    )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: orange;'); //Dialog-Fenster geschlossen

                            if (dialogResult === 'ClosedOkay') {

                                for (i = 0; i < len; i++) {
                                    console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: orange;');
                                }
                                self.connector.writeSignalsFromBuffer().then(function (result) {
                                    if (result.errorMessage) {
                                        toastr.error(result.errorMessage);
                                    }
                                });
                                toastr.success('Send-Werte geschrieben');
                            }
                        });
                } else {
                    toastr.warning("Es wurden keine Werte ver&auml;ndert !", "Senden nicht m&ouml;glich !");
                }
            },

        }

        return ctor;
    });