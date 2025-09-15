define(['../../services/connector', 'plugins/dialog',
        'src/viewmodels/cowi/dialoge/cwDialog', '../../services/usersService', "../../components/services/secured.service"
    ],
    function (signalsConnector, dialog,
        okCancelDialog, usersService, securedService) {
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
                //---------------------------------------------------------------------------
                self.betriebsArt = ko.computed(function () {
                    var self = this;
                    var css = '';
                    var sendBufferLeer = self.connector.signalBufferIsEmpty();

                    if (!sendBufferLeer) {
                        return 'ccw-flash-bg';
                    }
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
                //---- Fenster Größe ermitteln und die Zeichnung im DIV anpassen
                $(window).resize(function () {
                    self.setZoomFaktor(document.defaultView.innerWidth, document.defaultView.innerHeight)
                });

                self.zoomFaktor = ko.observable(1.0);
                self.setZoomFaktor(document.defaultView.innerWidth, document.defaultView.innerHeight); //einmalig die Funktion ausführen

                self.wert = ko.observable(1);

                self.benutzerName = ko.observable();

                self.vernebelungAktiv = self.connector.getSignal('Verp2510DB1DBX04').value; // Betriebsart Vernebelung
                self.betriebsArtAktuell = self.connector.getSignal('Verp2510DB102DBB73').value; //Betriebsart





                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);



                self.eineZeileAnwahl = ko.observable(0);
                self.ergASPAnfrage = ko.observable('Ergebnis Rezept-Info'); //Ergebnis in HTML-Seite anzeigen

                self.positionSticky;

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
                self.connector.unregisterSignals(self.restzeit_min);
                self.connector.unregisterSignals(self.restzeit_sek);
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
            setFunctionHKZ: function (value) {
                alert(value);
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
                    var EinR = ((value() & 0x01) >> 0);
                    var EinL = ((value() & 0x04) >> 2);
                    var values = {};

                    if (Hand != 0) {
                        if ((EinR == 0) && (EinL == 0)) {
                            dialog.show(
                                    new okCancelDialog('Ja', 'Nein', 'Im Handbetrieb einschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                )
                                .then(function (dialogResult) {

                                    if (dialogResult === 'ClosedOkay') {
                                        var setWert = (0x01) ^ (value()); //Rechtslauf einschalten
                                        //var setWert = (0x04)^(value()); //Linkslauf einschalten

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
            // setBtnValueRechtsEin
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
            handAutoUmschaltung: function () {
                var self = this;
                console.log('%cHand/ Auto umschalten ', 'background:yellow');
                dialog.show(
                        new okCancelDialog('Ja', 'Nein', 'Hand/ Auto umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                    )
                    .then(function (dialogResult) {
                        console.info('%chandAutoUmschaltung():' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                    });
            },
            setFunctionHKZ: function (value) {
                switch (value) {
                    case '0': //  Keine Funktion
                        $("#ventileFüllpumpeVentil1").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil2").css("background-color", "transparent");
                        ventileSekundärkreisVentil5
                        break;
                    case '1': //  Auto
                        $("#ventileFüllpumpeVentil1").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil2").css("background-color", "transparent");
                        break;
                    case '2': //  Füllen Sammelbehälter aus Fass
                        $("#ventileFüllpumpeVentil1").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil2").css("background-color", "transparent");
                        break;
                    case '3': //  Füllen Anlagenteile aus Fass
                        $("#ventileFüllpumpeVentil1").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil4").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil5").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil1").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil2").css("background-color", "lime");
                        break;
                    case '4': //  Füllen Anlagenteile aus Sammelbehälter
                        $("#ventileFüllpumpeVentil1").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil2").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil4").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil5").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil1").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil2").css("background-color", "lime");
                        break;
                    case '5': //  Entleeren Sammelbehälter in Fass
                        $("#ventileFüllpumpeVentil1").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil2").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil2").css("background-color", "transparent");
                        break;
                    case '6': //  Entleeren Anlagenteile in Fass
                        $("#ventileFüllpumpeVentil1").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil2").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil2").css("background-color", "lime");
                        break;
                        case '7': //  Entleeren Anlagenteile in Sammelbehälter
                        $("#ventileFüllpumpeVentil1").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil4").css("background-color", "lime");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil2").css("background-color", "lime");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "lime");
                        $("#ventilePrimärkreisVentil2").css("background-color", "lime");
                        break;                        
                    default: //  default
                        $("#ventileFüllpumpeVentil1").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil2").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil3").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil4").css("background-color", "transparent");
                        $("#ventileFüllpumpeVentil5").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil1").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil2").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil3").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil4").css("background-color", "transparent");
                        $("#ventileSekundärkreisVentil5").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil1").css("background-color", "transparent");
                        $("#ventilePrimärkreisVentil2").css("background-color", "transparent");
                        break;
                }
                // alert("Hier ist der Wert: " + value);
            },

            setZoomFaktor: function (width, height) {
                var self = this;
                console.log("Breite:" + width + " und Höhe:" + height);
                var newFaktor = 1.0;
                if (width > 0) {
                    newFaktor = width / 1360; //das gezeichnete Bild (SmartEditor) ist für 2100 erstellt worden
                    console.log("newFaktor: " + newFaktor);
                    // newFaktor = 0.64 * width; //das gezeichnete Bild (SmartEditor) ist für 3800 erstellt worden
                    self.zoomFaktor(newFaktor);
                }


            }

        }

        return ctor;
    });