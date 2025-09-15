define(['../../../services/connector', '../../../services/usersService', "../../../components/services/secured.service", 'src/viewmodels/cowi/dialoge/cwDialog'],
    function(signalsConnector, usersService, securedService, okCancelDialog) {
        var dialog = require('plugins/dialog');

        var ctor = function(waageNr) {
            var self = this;

            self.connector = new signalsConnector();

            //------------ User ermitteln ---------------------------------------------
            self.connector.currentLoggedInUser.subscribe(function() {
                self.getCurrentUserDetails();
            });
            self.usersService = new usersService();
            self.property = 'Name'; //Eigenschaften zB. Name, active  usw. , Beschreibung in WF-App

            self.userDetails = ko.observable({});
            self.userName = ko.computed(function() {
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

            // ########################################################################################################
            // ########### User-Level ermitteln #######################################################################
            // ########### in HTML-Seite mit userFreigabe() ansprechen ################################################
            // ########################################################################################################
            self.userFreigabe = ko.computed(function() {
                console.log("Anmelde-Level=" + window.UserLevel() >= 0);
                return window.UserLevel() >= 0; //UserLevel wird in shell.ts gesetzt; Ergebnisse -1..3  -1=nicht angemeldet
            }, self);
            // ########################################################################################################

            //---------------------------------------------------------------------------

            self.sendBtnCss = ko.computed(function() {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);

            self.maxWaagen = 9;
            self.paramWaagenNr = waageNr !== undefined ? parseInt(waageNr) : 1;

            if ((self.paramWaagenNr > self.maxWaagen) || (self.paramWaagenNr < 1)) self.paramSiloNr = 1; //Überlauf verhindern, falls Parameter-Nummer nicht passt
            self.anwahlWaagenNr = ko.observable(self.paramWaagenNr); //init mit 1

            self.siloParameter = ko.observableArray([{
                    text: 'Keine Auswahl'
                },
                {
                    text: 'Waage 1',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 2',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 3',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 4',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 5',
                    btnFuellFreigabe: self.connector.getSignal('VMI3240DB25DBX10'),
                    btnMolchFreigabe: self.connector.getSignal('VMI3240DB25DBX16'),
                    // btnMolchRMFreigabe: self.connector.getSignal('VMI3240DB100DBX14'),
                },
                {
                    text: 'Waage 6',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 7',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 8',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                },
                {
                    text: 'Waage 9',
                    btnFuellFreigabe: self.connector.getSignal('NO'),
                    btnMolchFreigabe: self.connector.getSignal('NO'),
                }
            ]);

            // Werte des angewähltem Silos anzeigen, nicht des Silos, welcher gerade befüllt wird.
            self.aktuelleWaageVorwahlen = ko.computed(function() {
                var waageNr = self.anwahlWaagenNr();
                var artikelText;
                var artikelSignalName;
                var btnFuellFreigabe;
                var btnMolchFreigabe;
                var cssBtnFuellFreigabe = 'btn-default';
                var cssBtnMolchFreigabe = 'btn-default';
                artikelText = self.siloParameter()[waageNr].text;
                if (self.siloParameter()[waageNr].btnFuellFreigabe !== undefined) {
                    btnFuellFreigabe = ko.unwrap(self.siloParameter()[waageNr].btnFuellFreigabe);
                } else {
                    btnFuellFreigabe = 0;
                }
                if (self.siloParameter()[waageNr].btnMolchFreigabe !== undefined) {
                    btnMolchFreigabe = ko.unwrap(self.siloParameter()[waageNr].btnMolchFreigabe);
                } else {
                    btnMolchFreigabe = 0;
                }
                // Buttons einfärben, wenn Signal 1 ist
                if (self.siloParameter()[waageNr].btnFuellFreigabe !== undefined) {
                    if (self.siloParameter()[waageNr].btnFuellFreigabe.value() === -1) {
                        cssBtnFuellFreigabe = 'btn-success';
                        txtBtnFuellFreigabe = 'Ein';
                    }else{
                        cssBtnFuellFreigabe = 'btn-default';
                        txtBtnFuellFreigabe = 'Aus';
                    }
                }
                if (self.siloParameter()[waageNr].btnMolchFreigabe !== undefined) {
                    if (self.siloParameter()[waageNr].btnMolchFreigabe.value() === -1) {
                        cssBtnMolchFreigabe = 'btn-success';
                        txtBtnMolchFreigabe = 'Ein';
                    }else{
                        cssBtnMolchFreigabe = 'btn-default';
                        txtBtnMolchFreigabe = 'Aus';
                    }
                }

                return {
                    artikelText: artikelText,
                    artikelSignalName: artikelSignalName,
                    btnFuellFreigabe: btnFuellFreigabe,
                    btnMolchFreigabe: btnMolchFreigabe,
                    cssBtnFuellFreigabe: cssBtnFuellFreigabe,
                    txtBtnFuellFreigabe: txtBtnFuellFreigabe,
                    cssBtnMolchFreigabe: cssBtnMolchFreigabe,
                    txtBtnMolchFreigabe: txtBtnMolchFreigabe
                };

            });



            self.waageVorwahlen = ko.computed(function() {
                var self = this;
                var cssFuell = 'btn-default';
                var cssMolch = 'btn-default';
                var vorwahlFuell = self.connector.getSignal('VMI3240DB25DBX10').value();
                var vorwahlMolch = self.connector.getSignal('VMI3240DB25DBX16').value();
                var vorwahlRMMolch = self.connector.getSignal('VMI3240DB100DBX14').value();
                if (vorwahlFuell !== null) {
                    if (vorwahlFuell != 0) {
                        cssFuell = 'btn-success';
                    }
                }
                if (vorwahlRMMolch !== null) {
                    if (vorwahlRMMolch != 0) {
                        cssMolch = 'btn-success';
                    }
                }
                return {
                    cssFuell: cssFuell,
                    cssMolch: cssMolch
                };
            }, self);


        };

        ctor.prototype = {
            close: function() {
                var self = this;
                //beim schließen den Buffer löschen
                self.connector.clearSignalBuffer();

                dialog.close(self, "");
            },
            compositionComplete: function() {
                var self = this;

            },
            getCurrentUserDetails: function() {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function(userDetails) {
                        self.userDetails(userDetails);
                    });
            },
            dialogStartStopToggle: function(txJa, txNein, txHeader, signal, abfrageBeiNull) {
                // Bei AUS wird keine Abfrage gemacht, nur bei EIN
                var self = this;
                var signalName2 = signal;
                var value2 = self.connector.getSignal(signalName2).value();
                if (value2 === 0) { //Wenn Wert von 0 -> 1 gesetzt werden soll, dann Dialog anzeigen
                    dialog.show(
                            new okCancelDialog(txJa, txNein, txHeader)
                        )
                        .then(function(dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                            var setWert = 0;
                            var values = {};
                            if (dialogResult === 'ClosedOkay') {
                                console.info('%cOk: Signal=' + signal + ' Value=1', 'background: yellow;');
                                values[signal] = 1;
                                self.connector.writeSignals(values).then(function(result) {
                                    if (result.errorMessage) {
                                        toastr.error(result.errorMessage);
                                    }
                                });
                            }
                        });
                } else {

                    if (abfrageBeiNull) { //auch bei 0 den Okay-Dialog aufrufen
                        dialog.show(
                                new okCancelDialog(txJa, txNein, txHeader)
                            )
                            .then(function(dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                var values = {};
                                if (dialogResult === 'ClosedOkay') {
                                    console.info('%cOk: Signal=' + signal + ' Value=1', 'background: yellow;');
                                    values[signal] = 0;
                                    self.connector.writeSignals(values).then(function(result) {
                                        if (result.errorMessage) {
                                            toastr.error(result.errorMessage);
                                        }
                                    });
                                }
                            });
                    } else {
                        console.info('%cToogle-AUS: Signal=' + signal + ' Value=0', 'background: yellow;');
                        var values = {};
                        values[signal] = 0; //auf Null setzen
                        self.connector.writeSignals(values).then(function(result) {
                            if (result.errorMessage) {
                                toastr.error(result.errorMessage);
                            }
                        });
                    }
                }
            }


        };
        return ctor;
    });