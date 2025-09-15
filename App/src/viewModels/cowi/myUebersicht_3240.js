define(['../../services/connector',
    'plugins/dialog',
    'src/viewmodels/cowi/dialoge/parameterReglerWaage',
    'src/viewmodels/cowi/dialoge/cwReglerStoerungen',
    'src/viewmodels/cowi/dialoge/parameterReglerKuehlungWaage3',
    'src/viewmodels/cowi/dialoge/parameterReglerKuehlungKneter',
    'src/viewmodels/cowi/dialoge/cwReglerTrend',
    'src/viewmodels/cowi/dialoge/cwDialog',
    '../../services/usersService',
    '../../components/services/secured.service',
    '../../services/http',
    'src/viewmodels/cowi/dialoge/cwWaageVorwahlenDialog'
],
    function (signalsConnector, dialog, parameterReglerWaage, parameterReglerStoerungen, parameterReglerKuehlungWaage3, parameterReglerKuehlungKneter, cwReglerTrend,
        okCancelDialog, usersService, securedService, HttpService, cwWaageVorwahlenDialog) {
        var ctor = function () {
            var self = this;
            self.abonenten = [];
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

                self.produktwahlWaage3 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Wasser',
                    id: 1
                }, {
                    txt: '(2) Molke',
                    id: 2
                }];
                self.produktwahlWaage5 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Vorteig',
                    id: 1
                }, {
                    txt: '(2) Körner',
                    id: 2
                }];
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
                self.reglerKneterAktiv1 = self.connector.getSignal('VMI3240DB56DBX20').value;
                self.reglerKneterAktiv2 = self.connector.getSignal('VMI3240DB57DBX20').value;
                self._statusAnlage = self.connector.getSignal('VMI3240DB1DBX05').value; // Anlage Ein/ Aus
                self._statusProduktion = self.connector.getSignal('VMI3240DB1DBX05').value; // Produktion Ein/ Aus
                self._statusProduktionsauftrag = self.connector.getSignal('VMI3240DB1DBX780').value; // Produktionsauftrag aktiv
                self._statusProduktionsauftragsnummer = self.connector.getSignal('VMI3240DB1DBD80').value; // Produktionsauftragsnummer
                self._vorwahlWaage5 = self.connector.getSignal('Buffer 1'); // Vorwahl Produkt Waage 5
                self._vorwahlWaage3 = self.connector.getSignal('Buffer 1'); // Vorwahl Produkt Waage 3


                self._vorwahlStoermelde = self.connector.getSignal('Buffer 1').value; //Vorwahl 2.Wahl Produktion

                self._komponente1 = self.connector.getSignal('VMI3240DB220DBD420'); //Komponentennummer 1
                self._komponente2 = self.connector.getSignal('VMI3240DB220DBD424'); //Komponentennummer 2
                self._komponente3 = self.connector.getSignal('VMI3240DB220DBD428'); //Komponentennummer 3
                self._komponente4 = self.connector.getSignal('VMI3240DB220DBD432'); //Komponentennummer 4
                self._komponente5 = self.connector.getSignal('VMI3240DB220DBD436'); //Komponentennummer 5
                self._komponente6 = self.connector.getSignal('VMI3240DB220DBD440'); //Komponentennummer 6
                self._komponente7 = self.connector.getSignal('VMI3240DB220DBD444'); //Komponentennummer 7
                self._komponente9 = self.connector.getSignal('VMI3240DB220DBD452'); //Komponentennummer 9
                self._komponente10 = self.connector.getSignal('VMI3240DB220DBD456'); //Komponentennummer 10

                self._vorwahlWartung = self.connector.getSignal('VMI3240DB1DBX10'); //Wartungsbetrieb Waage 5

                self.vorwahlWaage3 = ko.computed(function () {
                    var self = this;
                    var css = 'btn-default';
                    var signalName = self._vorwahlWaage3.signalName();
                    var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty();  //Im Zwischenpuffer?
                    var value = '';
                    if (isBuffered) {
                        css = 'btn-info';
                        value = self.connector.readSignalsFromBuffer([signalName]);  //Signale vom Buffer lesen
                    } else {
                        value = self._vorwahlWaage3.value();
                        //console.log(connector);
                    }
                    if (!isNaN(value)) {
                        var txt = self.produktwahlWaage3[value].txt;
                    }
                    return {
                        newCss: css,
                        newTxt: txt,
                        signal: signalName,
                        newValue: value,
                    };
                }, self);
                self.vorwahlWaage5 = ko.computed(function () {
                    var self = this;
                    var css = 'btn-default';
                    var signalName = self._vorwahlWaage5.signalName();
                    var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty();  //Im Zwischenpuffer?
                    var value = '';
                    if (isBuffered) {
                        css = 'btn-info';
                        value = self.connector.readSignalsFromBuffer([signalName]);  //Signale vom Buffer lesen
                    } else {
                        value = self._vorwahlWaage5.value();
                        //console.log(connector);
                    }
                    if (!isNaN(value)) {
                        var txt = self.produktwahlWaage5[value].txt;
                    }
                    return {
                        newCss: css,
                        newTxt: txt,
                        signal: signalName,
                        newValue: value,
                    };
                }, self);
                self.vorwahlWartung = ko.computed(function () {
                    var self = this;
                    var css = 'btn-primary';
                    var css2 = 'badge-default';
                    var text = 'Wartung AUS';
                    var sichtbar = false;
                    var signalName = self._vorwahlWartung.signalName();
                    var vorwahl = self._vorwahlWartung.value();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'btn-danger ccw-flash-bg';
                            css2 = 'badge-danger ccw-flash-bg';
                            text = 'Wartungbetrieb EIN';
                            sichtbar = true;
                        } else {
                            css = 'btn-primary';
                            css2 = 'badge-default';
                            text = 'Wartungbetrieb AUS';
                            sichtbar = false;
                        }
                    }
                    return {
                        newSichtbar: sichtbar,
                        signalName: signalName,
                        newCss: css,
                        newCss2: css2,
                        newText: text
                    };
                }, self);
                self.reglerTeigAktiv1 = ko.computed(function () {
                    var self = this;
                    var css = 'badge-default'
                    var txt = 'Auto/Aus'
                    var vorwahl = self.reglerKneterAktiv1();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'badge-success';
                            txt = 'Automatik';
                        } else {
                            css = 'badge-default';
                            txt = 'Aus';
                        }
                    }
                    return {
                        newCss: css,
                        newTxt: txt
                    };
                }, self);
                self.reglerTeigAktiv2 = ko.computed(function () {
                    var self = this;
                    var css = 'badge-default'
                    var txt = 'Auto/Aus'
                    var vorwahl = self.reglerKneterAktiv2();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'badge-success';
                            txt = 'Automatik';
                        } else {
                            css = 'badge-default';
                            txt = 'Aus';
                        }
                    }
                    return {
                        newCss: css,
                        newTxt: txt
                    };
                }, self);
                self.statusAnlage = ko.computed(function () {
                    var self = this;
                    var css = 'btn-default';
                    var text = 'Anlage AUS'
                    var vorwahl = self._statusAnlage();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'ccw-state-text-indicate';
                            text = 'Anlage EIN';
                        } else {
                            css = 'ccw-state-text-default';
                            text = 'Anlage AUS';
                        }
                    }
                    return {
                        newCss: css,
                        newText: text
                    };
                }, self);
                self.statusProduktion = ko.computed(function () {
                    var self = this;
                    var css = 'btn-default';
                    var text = 'Produktion AUS'
                    var vorwahl = self._statusProduktion();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'ccw-state-text-indicate';
                            text = 'Produktion EIN';
                        } else {
                            css = 'ccw-state-text-default';
                            text = 'Produktion AUS';
                        }
                    }
                    return {
                        newCss: css,
                        newText: text
                    };
                }, self);
                self.statusProduktionsauftrag = ko.computed(function () {
                    var self = this;
                    var css = 'btn-default';
                    var text = 'Kein Auftrag'
                    var aktiv = self._statusProduktionsauftrag();
                    if (aktiv !== null) {
                        if (aktiv != 0) {
                            css = 'ccw-state-text-indicate';
                        } else {
                            css = 'ccw-state-text-default';
                        }
                    }
                    var nummer = self._statusProduktionsauftragsnummer();
                    if (nummer !== null) {
                        if (nummer != 0) {
                            text = 'nummer';
                        } else {
                            text = 'Kein Auftrag';
                        }
                    }
                    return {
                        newCss: css,
                        newText: text
                    };
                }, self);
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


                self.waage5Vorwahlen = ko.computed(function () {
                    var self = this;
                    var cssFuell = 'badge-default';
                    var cssMolch = 'badge-default';
                    var vorwahlFuell = self.connector.getSignal('VMI3240DB25DBX10').value();
                    var vorwahlMolch = self.connector.getSignal('VMI3240DB25DBX16').value();
                    // var vorwahlRMMolch = self.connector.getSignal('VMI3240DB100DBX14').value();
                    if (vorwahlFuell !== null) {
                        if (vorwahlFuell != 0) {
                            cssFuell = 'badge-success';
                        }
                    }
                    if (vorwahlMolch !== null) {
                        if (vorwahlMolch != 0) {
                            cssMolch = 'badge-success';
                        }
                    }
                    return {
                        cssFuell: cssFuell,
                        cssMolch: cssMolch
                    };
                }, self);


                return self.connector.getOnlineUpdates();
            },
            compositionComplete: function () {
                var self = this;
                var container = $("#container");
                var svgUrl = "ContentCowi/svg/UebersichtVMI.svg";
                $.get(svgUrl)
                    .then(injectSvg)

                function injectSvg(xmlDoc) {
                    var svg = $(xmlDoc).find("svg");
                    container.append(svg);
                }

                var container5 = $("#container5");
                var svgUrl1 = "ContentCowi/svg/Fluessigkeitsbehaelter_6_Reinigung.svg";
                $.get(svgUrl1)
                    .then(injectSvg1)

                function injectSvg1(xmlDoc) {
                    var svg = $(xmlDoc).find("svg");
                    container5.append(svg);
                }

                Q.delay(3000).then(function () {
                    self.verz()
                });
            },
            verz: function () {
                var self = this;
                self.schnecke1(self.connector.getSignal('VMI3240DB41DBX20').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB41DBX20').value.subscribe(function (val) {
                    self.schnecke1(val);
                }));
                self.schnecke2(self.connector.getSignal('VMI3240DB42DBX20').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB42DBX20').value.subscribe(function (val) {
                    self.schnecke2(val);
                }));
                self.dosWaage1(self.connector.getSignal('VMI3240DB21DBX20').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB21DBX20').value.subscribe(function (val) {
                    self.dosWaage1(val);
                }));
                self.dosWaage2(self.connector.getSignal('VMI3240DB22DBX20').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB22DBX20').value.subscribe(function (val) {
                    self.dosWaage2(val);
                }));
                self.dosWaage3(self.connector.getSignal('VMI3240DB23DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB23DBB2').value.subscribe(function (val) {
                    self.dosWaage3(val);
                }));
                self.dosWaage4(self.connector.getSignal('VMI3240DB24DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB24DBB0').value.subscribe(function (val) {
                    self.dosWaage4(val);
                }));
                self.dosWaage5_1(self.connector.getSignal('VMI3240DB25DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB25DBB2').value.subscribe(function (val) {
                    self.dosWaage5_1(val);
                }));
                self.dosWaage5_2(self.connector.getSignal('VMI3240DB125DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB125DBB2').value.subscribe(function (val) {
                    self.dosWaage5_2(val);
                }));
                self.dosWaage6(self.connector.getSignal('VMI3240DB26DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB26DBB2').value.subscribe(function (val) {
                    self.dosWaage6(val);
                }));
                self.dosWaage7(self.connector.getSignal('VMI3240DB27DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB27DBB2').value.subscribe(function (val) {
                    self.dosWaage7(val);
                }));
                self.dosWaage9(self.connector.getSignal('VMI3240DB29DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB29DBB2').value.subscribe(function (val) {
                    self.dosWaage9(val);
                }));
                self.dosWaage10(self.connector.getSignal('VMI3240DB30DBB2').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB30DBB2').value.subscribe(function (val) {
                    self.dosWaage10(val);
                }));
                // self.abfrageReinigungsbogen(self.connector.getSignal('VMI3240DB2DBX1250').value());
                // self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1250').value.subscribe(function (val) {
                //     self.abfrageReinigungsbogen(val);
                // }));
                self.abfrageReinigungsbogen1(self.connector.getSignal('VMI3240DB2DBX1661').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1661').value.subscribe(function (val) {
                    self.abfrageReinigungsbogen1(val);
                }));
                self.abfrageReinigungsbogen2(self.connector.getSignal('VMI3240DB2DBX1662').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1662').value.subscribe(function (val) {
                    self.abfrageReinigungsbogen2(val);
                }));
                self.abfrageReinigungsbogen3(self.connector.getSignal('VMI3240DB2DBX1663').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1663').value.subscribe(function (val) {
                    self.abfrageReinigungsbogen3(val);
                }));
                self.abfrageReinigungsbogen4(self.connector.getSignal('VMI3240DB2DBX1664').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1664').value.subscribe(function (val) {
                    self.abfrageReinigungsbogen4(val);
                }));
                self.abfrageBogenVorteig(self.connector.getSignal('VMI3240DB2DBX1627').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1627').value.subscribe(function (val) {
                    self.abfrageBogenVorteig(val);
                }));
                self.abfrageSchlauchEntnahme(self.connector.getSignal('VMI3240DB2DBX1602').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1602').value.subscribe(function (val) {
                    self.abfrageSchlauchEntnahme(val);
                }));
                self.abfrageSchlauchReinigung(self.connector.getSignal('VMI3240DB2DBX1603').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1603').value.subscribe(function (val) {
                    self.abfrageSchlauchReinigung(val);
                }));
                self.abfrageSchlauchKoerner(self.connector.getSignal('VMI3240DB2DBX1616').value());
                self.abonenten.push(self.connector.getSignal('VMI3240DB2DBX1616').value.subscribe(function (val) {
                    self.abfrageSchlauchKoerner(val);
                }));
                self.connector.getOnlineUpdates();
            },
            // abfrageReinigungsbogen: function (newValue) {
            //     if (newValue > 0) {
            //         $('#Reinigungsbogen').css('display', 'block');
            //     } else {
            //         $('#Reinigungsbogen').css('display', 'none');
            //     }
            // },
            abfrageReinigungsbogen1: function (newValue) {
                if (newValue != 0) {
                    $('#bogen1').css('display', 'block');
                } else {
                    $('#bogen1').css('display', 'none');
                }
            },
            abfrageReinigungsbogen2: function (newValue) {
                if (newValue != 0) {
                    $('#bogen2').css('display', 'block');
                } else {
                    $('#bogen2').css('display', 'none');
                }
            },
            abfrageReinigungsbogen3: function (newValue) {
                if (newValue != 0) {
                    $('#bogen3').css('display', 'block');
                } else {
                    $('#bogen3').css('display', 'none');
                }
            },
            abfrageReinigungsbogen4: function (newValue) {
                if (newValue != 0) {
                    $('#bogen4').css('display', 'block');
                } else {
                    $('#bogen4').css('display', 'none');
                }
            },
            abfrageBogenVorteig: function (newValue) {
                if (newValue != 0) {
                    $('#bogenVorteig1').css('display', 'none');
                    $('#bogenVorteig2').css('display', 'block');
                } else {
                    $('#bogenVorteig1').css('display', 'block');
                    $('#bogenVorteig2').css('display', 'none');
                }
            },
            abfrageSchlauchEntnahme: function (newValue) {
                if (newValue != 0) {
                    $('#Schlauch_Entnahme').css('display', 'block');
                    $('#Schlauch_Reinigung').css('display', 'none');
                } else {
                    $('#Schlauch_Entnahme').css('display', 'none');
                }
            },
            abfrageSchlauchReinigung: function (newValue) {
                if (newValue != 0) {
                    $('#Schlauch_Reinigung').css('display', 'block');
                } else {
                    $('#Schlauch_Reinigung').css('display', 'none');
                }
            },
            abfrageSchlauchKoerner: function (newValue) {
                if (newValue != 0) {
                    $('#Schlauch_ReinigungKoerner').css('display', 'block');
                } else {
                    $('#Schlauch_ReinigungKoerner').css('display', 'none');
                }
            },
            schnecke1: function (newValue) {
                if (newValue != 0) {
                    $('#schnecke1').css('fill', 'lime');
                } else {
                    $('#schnecke1').css('fill', 'darkgrey');
                }
            },
            schnecke2: function (newValue) {
                if (newValue != 0) {
                    $('#schnecke2').css('fill', 'lime');
                } else {
                    $('#schnecke2').css('fill', 'darkgrey');
                }
            },
            // Dosierungen Waage 1-10
            dosWaage1: function (newValue) {
                if (newValue != 0) {
                    $('#waage1').css('fill', 'lime');
                } else {
                    $('#waage1').css('fill', 'darkgrey');
                }
            },
            dosWaage2: function (newValue) {
                if (newValue != 0) {
                    $('#waage2').css('fill', 'lime');
                } else {
                    $('#waage2').css('fill', 'darkgrey');
                }
            },
            dosWaage3: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = 'waage3';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage4: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = '.waage4';
                if (stoer) {
                    color = 'red';
                } else {
                    if (hand != 0) {
                        color = 'yellow';
                    } else {
                        if (ein != 0) {
                            color = 'green';
                        } else {
                            color = 'darkgrey';
                        }
                    }
                }
                var elements = $(weg);
                for (var i = 0; i < elements.length; i++) {
                    $('#' + elements[i].id).css('stroke', color);
                }
            },
            dosWaage5_1: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = '.waage5_pumpe1';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage5_2: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = '.waage5_pumpe2';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage6: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = 'waage6';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage7: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = 'waage7';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage9: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = 'waage9';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            dosWaage10: function (newValue) {
                var ein = (((newValue & 0x01) >> 0) || ((newValue & 0x04) >> 2));
                var hand = ((newValue & 0x02) >> 1);
                var stoer = (((newValue & 0x20) >> 5) || ((newValue & 0x40) >> 6));
                var color = 'darkgrey';
                var weg = 'waage10';
                if ($('.' + weg).css('stroke') === 'darkgrey') {
                    if (stoer) {
                        color = 'red';
                    } else {
                        if (hand != 0) {
                            color = 'yellow';
                        } else {
                            if (ein != 0) {
                                color = 'green';
                            } else {
                                color = 'darkgrey';
                            }
                        }
                    }
                    var elements = $(weg);
                    for (var i = 0; i < elements.length; i++) {
                        $('#' + elements[i].id).css('stroke', color);
                    }
                }
            },
            detached: function () {
                var self = this;
                console.info("Detaches Signal");
                for (var key in self.abonenten) {
                    if (self.abonenten.hasOwnProperty(key)) {
                        //console.log("%c---- Filter rechts über SVG 333333 anzeigen lassen" + self.abonenten[key], "background:grey");
                        self.abonenten[key].dispose();
                    }
                }
                self.connector.unregisterSignals(['VMI3240DB41DBX20']);
                self.connector.unregisterSignals(['VMI3240DB42DBX20']);
                self.connector.unregisterSignals(['VMI3240DB21DBX20']);
                self.connector.unregisterSignals(['VMI3240DB22DBX20']);
                self.connector.unregisterSignals(['VMI3240DB23DBX20']);
                self.connector.unregisterSignals(['VMI3240DB24DBX20']);
                self.connector.unregisterSignals(['VMI3240DB25DBX20']);
                self.connector.unregisterSignals(['VMI3240DB26DBX20']);
                self.connector.unregisterSignals(['VMI3240DB27DBX20']);
                self.connector.unregisterSignals(['VMI3240DB29DBX20']);
                self.connector.unregisterSignals(['VMI3240DB30DBX20']);
                self.connector.unregisterSignals(['VMI3240DB2DBX1250']);
                console.info("Detaches Signal");
            },
            getCurrentUserDetails: function () {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function (userDetails) {
                        self.userDetails(userDetails);
                    });
            },
            setAuswahlProdukt: function (wert, index, signalName, obj, event) {
                var self = this;
                var wertVorhanden = false;
                if (event.originalEvent) { //user changed
                    console.log('%csetAuswahlFunktion() SignalName=' + signalName + ' Value=' + wert + ' / Reihe=' + index, 'background:yellow');
                    var values = {};
                    values[signalName] = wert;
                    self.connector.writeSignalsToBuffer(values);
                }

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
            setBtnLink: function (link, obj, event) {
                var self = this;
                if (event.originalEvent) { //user changed
                    window.open(link, "_blank", "width=1024,height=768");
                }
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
            openDialogKuehlungWaage3: function (waageCSS, name) {
                var self = this;
                dialog.show(
                    new parameterReglerKuehlungWaage3(waageCSS, name)
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
            openDialogWaageVorwahlen: function (WaageNr) {
                var self = this;
                dialog.show(
                    new cwWaageVorwahlenDialog(WaageNr)
                )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
            }

        };
        return ctor;
    });