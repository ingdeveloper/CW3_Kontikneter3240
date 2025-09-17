define(['../../services/connector',
'plugins/dialog',
        'src/viewmodels/cowi/dialoge/parameterReglerWaage',
        'src/viewmodels/cowi/dialoge/cwReglerStoerungen',
        'src/viewmodels/cowi/dialoge/parameterReglerKuehlungWaage3',
        'src/viewmodels/cowi/dialoge/parameterReglerKuehlungKneter',
        'src/viewmodels/cowi/dialoge/cwReglerTrend',
        'src/viewmodels/cowi/dialoge/cwDialog',
        '../../services/usersService',
        "../../components/services/secured.service",
        '../../services/http'
    ],
    function (signalsConnector, dialog, parameterReglerWaage, parameterReglerStoerungen, parameterReglerKuehlungWaage3, parameterReglerKuehlungKneter, cwReglerTrend,
        okCancelDialog, usersService, securedService, HttpService) {
        var ctor = function () {
            var self = this;
        };
        ctor.prototype = {
            activate: function () {
                var self = this;

                self.connector = new signalsConnector();
                //beim ersten öffnen der Seite den Zwischenspeicher (Buffer) löschen, damit nicht ausversehen Daten übertragen werden
                self.connector.clearSignalBuffer();

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
                    var freigabe = window.UserLevel() >= 0 ? true : false;
                    return freigabe; //UserLevel wird in shell.ts gesetzt; Ergebnisse -1..3  -1=nicht angemeldet
                }, self);
                //------------ Buttons Freigabe je nach angemeldeten Benutzer: Spezielle Anmeldung für Miwe--------------
                self.userFreigabeMiwe = ko.computed(function () {
                    var self = this;
                    var user = ko.unwrap(self.userName);
                    var erg;

                    if (user == 'miwe') {
                        erg = true;
                    } else {
                        erg = false;
                    }
                    if (erg == true) {
                        console.log('%cAngemeldeter User: ' + user + ' / Freigabe: ' + erg, 'background: orange');
                    }
                    return erg;
                }, self);
                //---------------------------------------------------------------------------

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
                self.wert = ko.observable(1);

                self.benutzerName = ko.observable();

                //Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen  Tabellen   Tabellen  Tabellen 

                self.mixerHintergrundfarbe = '#A3A58D'; //Hintergrundfarbe für Text "Anlage xx" und Tabellenkopf
                // *******************************************************************************************************


                //Anfang Funktion erzeugeZeilen() für mehrere Antriebe zeilen

                //#region Zeilen Erzeugen für Antriebe

                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);


                // self.produktionsAuftrag = self.connector.getSignal('SahneDB1DBD232');
                // self.produktionAktiv = self.connector.getSignal('SahneDB1DBX25').value;
                //self.aktuellerProgrammschritt = self.connector.getSignal('').value;

                // self.bargraphValue = self.connector.getSignal('SahneDB1630DBB6').value; //Prozent 0-100%

                self.text = ko.observable('');
                //self.ergebnisRezeptDB = ko.observable('-----');

                self.queryStringArchiv = ko.observable(''); //queryString für Aufruf von Logliste-Archiv

                self.rezeptData = []; //leeres Array erzeugen
                self.werteUngleich = false;

                return self.connector.getOnlineUpdates();
            },
            compositionComplete: function () {
                var self = this;
            },
                                                                              
            detached: function () {
                var self = this;
                console.info("Detaches Signal");
            },
            getCurrentUserDetails: function () {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function (userDetails) {
                        self.userDetails(userDetails);
                    });
            },
            openDialog: function (txJa, txNein, txHeader, signal, value) { //Parameter: Text für Ja-Button, Text für Nein-Button, Text für Überschrift
                var self = this;
                dialog.show(
                        new okCancelDialog(txJa, txNein, txHeader)
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
            setBtnVorwahl: function (signalName, obj, event) {
                var self = this;
                //var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    console.log('%csetBtnValue() SignalName=' + signalName, 'background:yellow');
                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', 'Vorwahl umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%chandAutoUmschaltung():' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                            if (dialogResult === 'ClosedOkay') {

                                //var signalName = signal.signalName();
                                //var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty(); //Im Zwischenpuffer?
                                var value = self.connector.getSignal(signalName).value();
                                var setWert = 0;
                                var values = {};

                                if (value != 0) { //Wert toggeln
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
            openDialogWaage6Reinigung: function (waageCSS) {
                var self = this;
                dialog.show(
                        new ventileWaage6Reinigung()
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogKuehlungWaage3: function (waageCSS) {
                var self = this;
                dialog.show(
                        new parameterReglerKuehlungWaage3(waageCSS)
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogKuehlungKneter: function (waageCSS) {
                var self = this;
                dialog.show(
                        new parameterReglerKuehlungKneter(waageCSS)
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogTrend: function (waageCSS, index) {
                var self = this;
                dialog.show(
                        new cwReglerTrend(waageCSS, index)
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogParameter: function (WaageCSS, WaageNr, Komponententext, index, selectedKomponente) {
                var self = this;
                dialog.show(
                        new parameterReglerWaage(WaageCSS, WaageNr, Komponententext, parseInt(index), selectedKomponente)
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogStoerung: function (WaageNr, Komponententext, Quit) {
                var self = this;
                dialog.show(
                        new parameterReglerStoerungen(WaageNr, Komponententext, Quit)
                    )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            },
            setMeldung: function (wert) {
                var self = this;
                console.log('%csetMeldung ' + wert, 'background:yellow');
                self.openDialog('OK', null, 'Bitte anmelden!', null, null); //kein Schreibvorgang, nur Anzeige
            },
            setBtnValue: function (signalName, obj, event) {
                var self = this;
                //var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    //console.log('%csetBtnValue() SignalName=' + signalName, 'background:yellow');
                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', 'Hand/ Auto umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%chandAutoUmschaltung():' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
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
            setBtnValueEin: function (signalName, obj, event) {
                var self = this;
                //var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    //console.log('%csetBtnValue() SignalName=' + signalName, 'background:yellow');
                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', 'Ein / Ausschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
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
            setBtnValueAus: function (signalName, obj, event) {
                var self = this;
                //var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    //console.log('%csetBtnValue() SignalName=' + signalName, 'background:yellow');
                    {

                        //var signalName = signal.signalName();
                        //var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty(); //Im Zwischenpuffer?
                        var value = self.connector.getSignal(signalName).value;
                        var setWert = 0;
                        var values = {};

                        values[signalName] = setWert;
                        //self.connector.writeSignalsToBuffer(values);
                        self.connector.writeSignals(values);
                    }

                }

            },
            setBtnValueByteHand: function (signalName, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var value = self.connector.getSignal(signalName).value;
                    var setWert = (0x02) ^ (value());
                    var values = {};
                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', 'Hand/Auto umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {

                            if (dialogResult === 'ClosedOkay') {
                                values[signalName] = setWert;
                                self.connector.writeSignals(values);
                            }
                        });
                }
            },
            setBtnValueByteEin: function (signalName, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var value = self.connector.getSignal(signalName).value;
                    var Hand = ((value() & 0x02) >> 1);
                    var Ein = ((value() & 0x01) >> 0);
                    var values = {};
                    if (Hand != 0) {
                        if (Ein == 0) {
                            dialog.show(
                                    new okCancelDialog('Ja', 'Nein', 'Im Handbetrieb einschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                )
                                .then(function (dialogResult) {

                                    if (dialogResult === 'ClosedOkay') {
                                        var setWert = (0x01) ^ (value()); //Rechtslauf einschalten

                                        values[signalName] = setWert;
                                        self.connector.writeSignals(values);
                                    }
                                });
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            },
            setBtnValueLinksEin: function (signalName, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var value = self.connector.getSignal(signalName).value;
                    var Hand = ((value() & 0x02) >> 1);
                    var EinR = ((value() & 0x01) >> 0);
                    var EinL = ((value() & 0x04) >> 2);
                    var values = {};

                    if ((Hand & 1) > 0) {
                        if ((EinR == 0) && (EinL == 0)) {
                            dialog.show(
                                    new okCancelDialog('Ja', 'Nein', 'Im Handbetrieb Links einschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                )
                                .then(function (dialogResult) {

                                    if (dialogResult === 'ClosedOkay') {
                                        //var setWert = (0x01) ^ (value()); //Rechtslauf einschalten
                                        var setWert = (0x04) ^ (value()); //Linkslauf einschalten
                                        values[signalName] = setWert;
                                        self.connector.writeSignals(values);
                                    }
                                });
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            },
            setBtnValueRechtsEin: function (signalName, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var value = self.connector.getSignal(signalName).value;
                    var Hand = ((value() & 0x02) >> 1);
                    var EinR = ((value() & 0x01) >> 0);
                    var EinL = ((value() & 0x04) >> 2);
                    var values = {};

                    if ((Hand & 1) > 0) {
                        if ((EinR == 0) && (EinL == 0)) {
                            dialog.show(
                                    new okCancelDialog('Ja', 'Nein', 'Im Handbetrieb rechts einschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                )
                                .then(function (dialogResult) {

                                    if (dialogResult === 'ClosedOkay') {
                                        //var setWert = (0x01) ^ (value()); //Rechtslauf einschalten
                                        var setWert = (0x01) ^ (value()); //Linkslauf einschalten
                                        values[signalName] = setWert;
                                        self.connector.writeSignals(values);
                                    }
                                });
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            },
            setBtnValueByteAus: function (signalName, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var value = self.connector.getSignal(signalName).value;
                    var Hand = ((value() & 0x02) >> 1);
                    var EinR = ((value() & 0x01) >> 0);
                    var EinL = ((value() & 0x04) >> 2);
                    var values = {};

                    if (Hand != 0) {
                        if ((EinR != 0) && (EinL == 0)) {
                            var setWert = (0x01) ^ (value());
                            values[signalName] = setWert;
                            self.connector.writeSignals(values);
                        }
                        if ((EinR == 0) && (EinL != 0)) {
                            var setWert = (0x04) ^ (value());
                            values[signalName] = setWert;
                            self.connector.writeSignals(values);
                        }
                        if ((EinR != 0) && (EinL != 0)) {
                            var setWert = (0x05) ^ (value());
                            values[signalName] = setWert;
                            self.connector.writeSignals(values);
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            },
            httpGet: function (url) {
                //     return new Promise(
                //         function (resolve, reject) {const request = new XMLHttpRequest();
                //             request.onload = function () {
                //                 if (this.status === 200) {
                //                     // Success
                //                     resolve(this.response);

                //                 } else {
                //                     // Something went wrong (404 etc.)
                //                     reject(new Error(this.statusText));
                //                 }
                //             };
                //             request.onerror = function () {
                //                 reject(new Error(
                //                     'XMLHttpRequest Error: ' + this.statusText));
                //             };
                //             request.open('GET', url);
                //             request.send();
                //         });
            },
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
        }
        return ctor;
    });