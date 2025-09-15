define(['../../../services/connector', 'plugins/dialog', '../../../services/usersService', "../../../components/services/secured.service", 'src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, dialog, usersService, securedService, okCancelDialog) {
        var dialog = require('plugins/dialog');

        var ctor = function (WaageCSS, WaageNr, Komponententext, index, selectedKomponente) {
            var self = this;

            self.connector = new signalsConnector();
            // self.cssWaage = waageCSS;
            self.waaageCSS = WaageCSS;
            self.waaageNr = WaageNr;
            self.komponente = Komponententext;
            var start = 270;
            self.index = index;
            self.datenbaustein = 20 + index;
            self.signal1_1 = 'TechnikDB' + self.datenbaustein + 'DBD300';
            self.signal1_2 = 'TechnikDB' + self.datenbaustein + 'DBD304';
            self.signal1_3 = 'TechnikDB' + self.datenbaustein + 'DBD308';
            self.signal1_4 = 'TechnikDB' + self.datenbaustein + 'DBD312';
            self.signal1_5 = 'TechnikDB' + self.datenbaustein + 'DBW316';
            self.signal1_6 = 'TechnikDB' + self.datenbaustein + 'DBW318';
            self.signal1_7 = 'TechnikDB' + self.datenbaustein + 'DBW320';

            self.signal2_1 = 'TechnikDB' + self.datenbaustein + 'DBD330';
            self.signal2_2 = 'TechnikDB' + self.datenbaustein + 'DBD334';
            self.signal2_3 = 'TechnikDB' + self.datenbaustein + 'DBD338';
            self.signal2_4 = 'TechnikDB' + self.datenbaustein + 'DBD342';
            self.signal2_5 = 'TechnikDB' + self.datenbaustein + 'DBW346';
            self.signal2_6 = 'TechnikDB' + self.datenbaustein + 'DBW348';
            self.signal2_7 = 'TechnikDB' + self.datenbaustein + 'DBW350';

            self.signal3_1 = 'TechnikDB' + self.datenbaustein + 'DBD360';
            self.signal3_2 = 'TechnikDB' + self.datenbaustein + 'DBD364';
            self.signal3_3 = 'TechnikDB' + self.datenbaustein + 'DBD368';
            self.signal3_4 = 'TechnikDB' + self.datenbaustein + 'DBD372';
            self.signal3_5 = 'TechnikDB' + self.datenbaustein + 'DBW376';
            self.signal3_6 = 'TechnikDB' + self.datenbaustein + 'DBW378';
            self.signal3_7 = 'TechnikDB' + self.datenbaustein + 'DBW380';

            self.signal4_1 = 'TechnikDB' + self.datenbaustein + 'DBD390';
            self.signal4_2 = 'TechnikDB' + self.datenbaustein + 'DBD394';
            self.signal4_3 = 'TechnikDB' + self.datenbaustein + 'DBD398';
            self.signal4_4 = 'TechnikDB' + self.datenbaustein + 'DBD402';
            self.signal4_5 = 'TechnikDB' + self.datenbaustein + 'DBW406';
            self.signal4_6 = 'TechnikDB' + self.datenbaustein + 'DBW408';
            self.signal4_7 = 'TechnikDB' + self.datenbaustein + 'DBW410';

            self.signalKomponente = 'VMI3240DB220DBB' + (59 + self.index);
            self.isLoaded = false;

            //------------ User ermitteln ---------------------------------------------
            self.connector.currentLoggedInUser.subscribe(function () {
                self.getCurrentUserDetails();
            });
            self.usersService = new usersService();
            self.property = 'Name'; //Eigenschaften zB. Name, active  usw. , Beschreibung in WF-App

            self.userDetails = ko.observable({});
            self.userName = ko.computed(function () {
                if (self.userDetails() && !isNullOrUndefined(self.userDetails()[self.property])) {
                    //console.log('User:' + self.userDetails()[self.property]);
                    return self.userDetails()[self.property];
                }
                return "";
            });

            self.getCurrentUserDetails(); //Funktion aufrufen (siehe unten), damit User ermittelt werden kann


            self.projectAuthorization = '';
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            //------------- User ermitteln Ende ---------------------------------------

            //------------ Buttons Freigabe je nach angemeldeten Benutzer --------------
            self.userFreigabe = ko.computed(function () {
                console.log('Anmelde-Level=' + window.UserLevel() >= 0);
                var freigabe = window.UserLevel() > 0 ? true : false;
                return freigabe; //UserLevel wird in shell.ts gesetzt; Ergebnisse -1..3  -1=nicht angemeldet
            }, self);
            //---- Sendebutton blinken lassen --------------------------------------------
            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);
            //---------------------------------------------------------------------------
        };
        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();
                // self.selectedKomponente = self.connector.getSignal(self._selectedKomponente); //Komponentennummer 10 
                // console.log(self.selectedKomponente);

                self.activeKomponente = ko.computed(function () {
                    var self = this;
                    var signal = self.connector.getSignal(self.signalKomponente);
                    var signalName = signal.signalName();
                    var value = signal.value;

                    return {
                        signalName: signalName,
                        newValue: value()
                    }
                }, self);

                return self.connector.getOnlineUpdates();
            },
            close: function () {
                var self = this;
                //beim schließen den Buffer löschen
                self.connector.clearSignalBuffer();

                dialog.close(self, "");
            },
            compositionComplete: function () {
                var self = this;
                $('#speicher_' + self.activeKomponente().newValue).tab('show'); // Select tab by name
                //console.log('%cComplete Seite Dialog', 'background:lime');
                $(document).keydown(function (e) {
                    // ESCAPE key pressed
                    if (e.keyCode == 27) {
                        self.close();
                    }
                });

            },
            getCurrentUserDetails: function () {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function (userDetails) {
                        self.userDetails(userDetails);
                    });
            },
            setBtnValueEin: function (signalName, obj, event) {
                var self = this;
                //var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    console.log('%csetBtnValue() SignalName=' + signalName, 'background:yellow');
                    dialog.show(
                        new okCancelDialog('Ja', 'Nein', 'Regelung zur Dosierung der Waage umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                    )
                        .then(function (dialogResult) {
                            console.info('%chandEischalten():' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                            if (dialogResult === 'ClosedOkay') {

                                //var signalName = signal.signalName();
                                //var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty(); //Im Zwischenpuffer?
                                var value = self.connector.getSignal(signalName).value;
                                var setWert = 0;
                                var values = {};

                                if (value() != 0) { //Wert toggeln
                                    setWert = 0;
                                } else {
                                    setWert = 1;
                                }
                                values[signalName] = setWert;
                                //self.connector.writeSignalsToBuffer(values);
                                self.connector.writeSignals(values);

                            }
                        });
                }

            },
            openDialog: function (txJa, txNein, txHeader, signal, value) { //Parameter: Text für Ja-Button, Text für Nein-Button, Text für Überschrift
                var self = this;
                dialog.show(
                    new okCancelDialog(txJa, txNein, txHeader, true)
                )
                    .then(function (dialogResult) {
                        console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                        var values = {};
                        if (dialogResult === 'ClosedOkay') {
                            console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                            values[signal] = value;
                            self.connector.writeSignals(values);
                            toastr.success('Wert geschrieben');
                        } else if (dialogResult === 'Closed') {
                            console.info('%cCancel: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                            values[signal] = 0;
                            self.connector.writeSignals(values);
                            toastr.success('Wert geschrieben');

                        }
                    });
            },
            //---------------------Werte Senden----------------------------------
            sendWerteZurSps: function () {
                var self = this;
                console.log('%cSend Werte zur SPS ', 'background:yellow');
                dialog.show(
                    new okCancelDialog('Ja', 'Nein', 'Werte zur Steuerung senden?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                )
                    .then(function (dialogResult) {
                        console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                        var values = {};
                        if (dialogResult === 'ClosedOkay') {
                            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
                            var len = bufferSignale.length;
                            var i;
                            for (i = 0; i < len; i++) {
                                console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
                            }
                            self.connector.writeSignalsFromBuffer();
                            toastr.success('Send-Werte geschrieben');
                        }
                    });
            },



        };
        return ctor;
    });