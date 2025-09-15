define(['../../../services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog', 'src/viewmodels/cowi/dialoge/cwLogInOut'],
    function (signalsConnector, dialog, okCancelDialog, cwLogInOut) {
        var ctor = function () {
            var self = this;
        };

        ctor.prototype = {
            activate: function () {
                var self = this;

                self.connector = new signalsConnector();

                self.connector.clearSignalBuffer();

                self.sendBtnCss = ko.pureComputed(function () {
                    var self = this;
                    var css = '';
                    var sendBufferLeer = self.connector.signalBufferIsEmpty();

                    if (!sendBufferLeer) {
                        return 'ccw-flash-bg';
                    }
                }, self);

                self.userLogged = ko.observable(false);
                self.userNname = ko.observable(0);
                self.userVname = ko.observable(0);
                self.userBerRez = ko.observable(0);
                self.userID = ko.observable(0);

                self.userFreigabe = ko.computed(function () {
                    return UserLevel1() && self.userLogged();
                }, self);

                self.countdown = function (nMinutes, nSeconds) {
                    var self = this;
                    var duration = moment.duration({
                        minutes: nMinutes,
                        seconds: nSeconds
                    });
                    var timestamp = new Date();
                    clearInterval(self.nIntervId);
                    self.nIntervId = setInterval(function () {
                        timestamp = new Date(timestamp.getTime() * 1000);
                        duration = moment.duration(duration.asSeconds() - 1, "seconds");
                        $("#countdown").text(moment(duration.asMilliseconds()).format("mm:ss")).css("background-color", "lime");
                        if (duration.asMilliseconds() <= 0) {
                            $("#countdown").css("background-color", "white");
                            clearInterval(self.nIntervId);
                            self.userLogged(false);
                            self.userNname(0);
                            self.userVname(0);
                            self.userBerRez(0);
                            self.userID(0);
                        }
                    }, 1000);
                };


                // Antriebe Seite 1 ###########################################################################################################################

                self.antriebeSeite_1 = ko.observableArray([{
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H01-221M1',
                        text: 'Antrieb A1',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_1()[0].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_1()[0].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_1()[0].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_1()[0].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H01-221M5',
                        text: 'Antrieb A2',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_1()[1].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_1()[1].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_1()[1].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_1()[1].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H01-222M1',
                        text: 'Antrieb A3',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_1()[2].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_1()[2].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_1()[2].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_1()[2].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H01-222M5',
                        text: 'Antrieb A4',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_1()[3].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_1()[3].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_1()[3].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_1()[3].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },

                ]);


                // Antriebe Seite 2 ###########################################################################################################################

                self.antriebeSeite_2 = ko.observableArray([{
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H02-221M1',
                        text: 'Antrieb B1',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_2()[0].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_2()[0].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_2()[0].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_2()[0].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H02-221M5',
                        text: 'Antrieb B2',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_2()[1].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_2()[1].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_2()[1].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_2()[1].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H02-222M1',
                        text: 'Antrieb B3',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_2()[2].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_2()[2].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_2()[2].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_2()[2].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H02-222M5',
                        text: 'Antrieb B4',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_2()[3].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_2()[3].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_2()[3].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_2()[3].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },

                ]);


                // Antriebe Seite 3 ###########################################################################################################################

                self.antriebeSeite_3 = ko.observableArray([{
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H03-221M1',
                        text: 'Antrieb C1',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_3()[0].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_3()[0].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_3()[0].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_3()[0].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H03-221M5',
                        text: 'Antrieb C2',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_3()[1].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_3()[1].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_3()[1].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_3()[1].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H03-222M1',
                        text: 'Antrieb C3',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_3()[2].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_3()[2].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_3()[2].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_3()[2].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H03-222M5',
                        text: 'Antrieb C4',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_3()[3].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_3()[3].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_3()[3].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_3()[3].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },

                ]);


                // Antriebe Seite 4 ###########################################################################################################################

                self.antriebeSeite_4 = ko.observableArray([{
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H04-221M1',
                        text: 'Antrieb D1',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_4()[0].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_4()[0].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_4()[0].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_4()[0].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H04-221M5',
                        text: 'Antrieb D2',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_4()[1].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_4()[1].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_4()[1].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_4()[1].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H04-222M1',
                        text: 'Antrieb D3',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_4()[2].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_4()[2].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_4()[2].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_4()[2].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },
                    {
                        anzeigeWerte: true, //wenn Wert FALSE, dann wird diese Reihe nicht angezeigt
                        bmk: '=01+H04-222M5',
                        text: 'Antrieb D4',
                        format: '0,0',
                        einheit: ' h',
                        statusByte: 'Local Second', //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden //Signalname für Anzeige Antriebsstatus steht/läuft, mit null oder '' deaktivieren/ausblenden
                        sollwert: self.connector.getSignal('Buffer 1'),
                        betriebsStdGesamt: self.connector.getSignal('Buffer 1'),
                        betriebsStdNachWartung: self.connector.getSignal('Local Second'), //Ist
                        funktionsNr: self.connector.getSignal('Buffer 2'), //FunktionsNr.für Löschung (1=Wartung,2=Reparatur,3=Austausch,4=...)
                        bargraphWert: ko.pureComputed(function () {
                            var erg1 = self.antriebeSeite_4()[3].betriebsStdNachWartung.value() * 100;
                            var erg2 = self.antriebeSeite_4()[3].sollwert.value();
                            var erg = 0;
                            var farbe = 'wartung-AntriebeBargraphFarbeGruen';
                            if ((erg2 == 0) || (erg2 == undefined)) {
                                erg = 0;
                            } else {
                                erg = (erg1 / erg2).toFixed(1);
                                if ((erg >= 75)) {
                                    farbe = 'wartung-AntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'wartung-AntriebeBargraphFarbeRot';
                                }
                            }
                            return {
                                erg: erg,
                                farbe: farbe
                            };
                        }, self),
                        antriebStatus: ko.pureComputed(function () {
                                var vis = false;
                                var css = 'wf wf-stop-round';
                                var txt = 'Antrieb steht';
                                var signalName = self.antriebeSeite_4()[3].statusByte;
                                if ((signalName != null) && (signalName != '')) {
                                    vis = true;
                                    var signal = self.connector.getSignal(signalName);
                                    var value = signal.value();
                                    var statusEin = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));
                                    if (statusEin != 0) {
                                        css = 'wf wf-play-round running';
                                        txt = 'Antrieb läuft';
                                    }
                                }
                                return {
                                    vis: vis,
                                    css: css,
                                    txt: txt
                                };
                            },
                            self),
                        resetEnable: ko.observable(false),
                        resetBtnEnable: ko.pureComputed(function () {
                            return (self.antriebeSeite_4()[3].funktionsauswahl() > 0) && self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        }, self),
                        funktionsauswahl: ko.observable(0)
                    },

                ]);


                return self.connector.getOnlineUpdates();
            },

            attached: function () {
                var self = this;
            },

            detached: function () {
                var self = this;

                self.connector.clearSignalBuffer();
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
                        } else if (dialogResult === 'Closed') {
                            console.info('%cCancel: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                            values[signal] = 0;
                            self.connector.writeSignals(values);
                        }
                    });
            },

            openDialogLogInOut: function () {
                var self = this;
                dialog.show(
                    new cwLogInOut()
                ).then(function (resp) {
                    if (resp.usnname !== "" || resp.usvname !== "" || resp.usberez !== "" || resp.usid !== "") {
                        self.userLogged(true);
                        self.userNname(resp.usnname);
                        self.userVname(resp.usvname);
                        self.userBerRez(resp.usberez);
                        self.userID(resp.usid);
                        self.countdown(1, 30);
                    }
                })
            },

            setMeldung: function (wert) {
                var self = this;
                console.log('%csetMeldung ' + wert, 'background:yellow');
                self.openDialog('OK', null, 'Bitte erst für Wartung Anmelden!', null, null); //kein Schreibvorgang, nur Anzeige
            },

            setAnzeigeAuswahl: function (arr, index, wert) {
                var self = this;
                var arrLength = arr.length;

                for (i = 0; i < arrLength; i++) {
                    if (wert != 0) {
                        arr[i].funktionsauswahl(null);
                        arr[index].funktionsauswahl(wert);
                    } else {
                        arr[i].funktionsauswahl(wert);
                    }
                }
            },

            setAuswahlAntriebeSeite_1: function (wert, index) {
                var self = this;
                console.log('%csetAuswahl ' + wert + '/' + index, 'background:yellow');
                if (self.antriebeSeite_1()[index].funktionsauswahl() > 0) {
                    dialog.show(
                            new okCancelDialog('Bestätigen', 'Nein', 'Bitte Auswahl bestätigen!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                            if (dialogResult === 'ClosedOkay') {
                                self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, wert);
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_1()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            } else {
                                self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, 0); //wieder auf Ursprung zurücksetzen
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_1()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            }
                        });
                } else {
                    self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, 0);
                }
            },

            setAuswahlAntriebeSeite_2: function (wert, index) {
                var self = this;
                console.log('%csetAuswahl ' + wert + '/' + index, 'background:yellow');
                if (self.antriebeSeite_2()[index].funktionsauswahl() > 0) {
                    dialog.show(
                            new okCancelDialog('Bestätigen', 'Nein', 'Bitte Auswahl bestätigen!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                            if (dialogResult === 'ClosedOkay') {
                                self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, wert);
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_2()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            } else {
                                self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, 0); //wieder auf Ursprung zurücksetzen
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_2()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            }
                        });
                } else {
                    self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, 0);
                }
            },

            setAuswahlAntriebeSeite_3: function (wert, index) {
                var self = this;
                console.log('%csetAuswahl ' + wert + '/' + index, 'background:yellow');
                if (self.antriebeSeite_3()[index].funktionsauswahl() > 0) {
                    dialog.show(
                            new okCancelDialog('Bestätigen', 'Nein', 'Bitte Auswahl bestätigen!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                            if (dialogResult === 'ClosedOkay') {
                                self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, wert);
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_3()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            } else {
                                self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, 0); //wieder auf Ursprung zurücksetzen
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_3()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            }
                        });
                } else {
                    self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, 0);
                }
            },

            setAuswahlAntriebeSeite_4: function (wert, index) {
                var self = this;
                console.log('%csetAuswahl ' + wert + '/' + index, 'background:yellow');
                if (self.antriebeSeite_4()[index].funktionsauswahl() > 0) {
                    dialog.show(
                            new okCancelDialog('Bestätigen', 'Nein', 'Bitte Auswahl bestätigen!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                            if (dialogResult === 'ClosedOkay') {
                                self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, wert);
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_4()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            } else {
                                self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, 0); //wieder auf Ursprung zurücksetzen
                                console.info('%cFunktionsauswahl = ' + self.antriebeSeite_4()[index].funktionsauswahl() + ' (> 0 = Button RESET ist enable!)', 'background: yellow;');
                            }
                        });
                } else {
                    self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, 0);
                }
            },

            setResetAntriebeSeite_1: function (wert, index) {
                var self = this;
                console.log('%csetReset ' + wert + '/' + index, 'background:yellow');
                if (self.userFreigabe() === true) {
                    if ((self.antriebeSeite_1()[index].funktionsauswahl() > 0) && (self.antriebeSeite_1()[index].funktionsauswahl() <= 3)) {
                        dialog.show(
                                new okCancelDialog('Bestätigen', 'Nein', 'Gewählte Aktion ausführen? Zähler wirklich zurücksetzen?  Vorgang wird gespeichert!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                                var values = {};
                                var value = wert; //Wert für AliasName
                                var signal = self.antriebeSeite_1()[index].funktionsNr.signalName(); //AliasName vom Signal
                                if (dialogResult === 'ClosedOkay') {
                                    if (self.userFreigabe() === true) {
                                        console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                                        values[signal] = value;
                                        values['Buffer 3'] = self.userID(); //userID übertragen
                                        values['Buffer 1'] = 1; //Trigger Datenspeicherung
                                        self.connector.writeSignals(values);
                                        toastr.success('Funktion ausgeführt');
                                        self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, 0); //wieder auf Ursprung zurücksetzen
                                    } else {
                                        self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, 0); //wieder auf Ursprung zurücksetzen
                                        dialog.show(
                                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                            )
                                            .then(function (dialogResult) {
                                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                            });
                                    }
                                } else {
                                    self.setAnzeigeAuswahl(self.antriebeSeite_1(), index, 0); //wieder auf Ursprung zurücksetzen
                                }
                            });
                    }
                } else {
                    dialog.show(
                            new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                        });
                }
            },

            setResetAntriebeSeite_2: function (wert, index) {
                var self = this;
                console.log('%csetReset ' + wert + '/' + index, 'background:yellow');
                if (self.userFreigabe() === true) {
                    if ((self.antriebeSeite_2()[index].funktionsauswahl() > 0) && (self.antriebeSeite_2()[index].funktionsauswahl() <= 3)) {
                        dialog.show(
                                new okCancelDialog('Bestätigen', 'Nein', 'Gewählte Aktion ausführen? Zähler wirklich zurücksetzen?  Vorgang wird gespeichert!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                                var values = {};
                                var value = wert; //Wert für AliasName
                                var signal = self.antriebeSeite_2()[index].funktionsNr.signalName(); //AliasName vom Signal
                                if (dialogResult === 'ClosedOkay') {
                                    if (self.userFreigabe() === true) {
                                        console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                                        values[signal] = value;
                                        values['Buffer 3'] = self.userID(); //userID übertragen
                                        values['Buffer 1'] = 1; //Trigger Datenspeicherung
                                        self.connector.writeSignals(values);
                                        toastr.success('Funktion ausgeführt');
                                        self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, 0); //wieder auf Ursprung zurücksetzen
                                    } else {
                                        self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, 0); //wieder auf Ursprung zurücksetzen
                                        dialog.show(
                                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                            )
                                            .then(function (dialogResult) {
                                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                            });
                                    }

                                } else {
                                    self.setAnzeigeAuswahl(self.antriebeSeite_2(), index, 0); //wieder auf Ursprung zurücksetzen
                                }
                            });
                    }
                } else {
                    dialog.show(
                            new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                        });
                }
            },

            setResetAntriebeSeite_3: function (wert, index) {
                var self = this;
                console.log('%csetReset ' + wert + '/' + index, 'background:yellow');
                if (self.userFreigabe() === true) {
                    if ((self.antriebeSeite_3()[index].funktionsauswahl() > 0) && (self.antriebeSeite_3()[index].funktionsauswahl() <= 3)) {
                        dialog.show(
                                new okCancelDialog('Bestätigen', 'Nein', 'Gewählte Aktion ausführen? Zähler wirklich zurücksetzen?  Vorgang wird gespeichert!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                                var values = {};
                                var value = wert; //Wert für AliasName
                                var signal = self.antriebeSeite_3()[index].funktionsNr.signalName(); //AliasName vom Signal
                                if (dialogResult === 'ClosedOkay') {
                                    if (self.userFreigabe() === true) {
                                        console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                                        values[signal] = value;
                                        values['Buffer 3'] = self.userID(); //userID übertragen
                                        values['Buffer 1'] = 1; //Trigger Datenspeicherung
                                        self.connector.writeSignals(values);
                                        toastr.success('Funktion ausgeführt');
                                        self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, 0); //wieder auf Ursprung zurücksetzen
                                    } else {
                                        self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, 0); //wieder auf Ursprung zurücksetzen
                                        dialog.show(
                                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                            )
                                            .then(function (dialogResult) {
                                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                            });
                                    }
                                } else {
                                    self.setAnzeigeAuswahl(self.antriebeSeite_3(), index, 0); //wieder auf Ursprung zurücksetzen
                                }
                            });
                    }
                } else {
                    dialog.show(
                            new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                        });
                }
            },

            setResetAntriebeSeite_4: function (wert, index) {
                var self = this;
                console.log('%csetReset ' + wert + '/' + index, 'background:yellow');
                if (self.userFreigabe() === true) {
                    if ((self.antriebeSeite_4()[index].funktionsauswahl() > 0) && (self.antriebeSeite_4()[index].funktionsauswahl() <= 3)) {
                        dialog.show(
                                new okCancelDialog('Bestätigen', 'Nein', 'Gewählte Aktion ausführen? Zähler wirklich zurücksetzen?  Vorgang wird gespeichert!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                                var values = {};
                                var value = wert; //Wert für AliasName
                                var signal = self.antriebeSeite_4()[index].funktionsNr.signalName(); //AliasName vom Signal
                                if (dialogResult === 'ClosedOkay') {
                                    if (self.userFreigabe() === true) {
                                        console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                                        values[signal] = value;
                                        values['Buffer 3'] = self.userID(); //userID übertragen
                                        values['Buffer 1'] = 1; //Trigger Datenspeicherung
                                        self.connector.writeSignals(values);
                                        toastr.success('Funktion ausgeführt');
                                        self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, 0); //wieder auf Ursprung zurücksetzen
                                    } else {
                                        self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, 0); //wieder auf Ursprung zurücksetzen
                                        dialog.show(
                                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                            )
                                            .then(function (dialogResult) {
                                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                            });
                                    }

                                } else {
                                    self.setAnzeigeAuswahl(self.antriebeSeite_4(), index, 0); //wieder auf Ursprung zurücksetzen
                                }
                            });
                    }
                } else {
                    dialog.show(
                            new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {
                            console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                        });
                }
            },

            clearBuffer: function () {
                var self = this;
                self.connector.clearSignalBuffer();
                self.setAnzeigeAuswahl(self.antriebeSeite_1(), 0, 0);
                self.setAnzeigeAuswahl(self.antriebeSeite_2(), 0, 0);
                self.setAnzeigeAuswahl(self.antriebeSeite_3(), 0, 0);
                self.setAnzeigeAuswahl(self.antriebeSeite_4(), 0, 0);
            },

            sendWerteZurSps: function () {
                var self = this;
                var bufferSignale = self.connector.getSignalsFromBuffer();
                var len = bufferSignale.length;
                var i;
                var values = {};

                console.log('%cSend Werte zur SPS ', 'background:yellow');

                if (len > 0) {
                    if (self.userFreigabe() === true) {
                        dialog.show(
                                new okCancelDialog('Ja', 'Nein', 'Werte zur Steuerung senden?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;');

                                if (dialogResult === 'ClosedOkay') {
                                    if (self.userFreigabe() === true) {
                                        for (i = 0; i < len; i++) {
                                            console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
                                        }
                                        self.connector.writeSignalsFromBuffer();
                                        values['Buffer 3'] = self.userID(); //userID übertragen
                                        values['Buffer 1'] = 1; //Trigger Datenspeicherung
                                        self.connector.writeSignals(values);
                                        toastr.success('Werte gesendet');
                                    } else {
                                        dialog.show(
                                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                            )
                                            .then(function (dialogResult) {
                                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                                            });
                                    }
                                }
                            });
                    } else {
                        dialog.show(
                                new okCancelDialog('OK', null, 'Bitte erst für Wartung Anmelden!') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                            )
                            .then(function (dialogResult) {
                                console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                            });
                    }
                } else {
                    toastr.warning("Es wurden keine Werte ver&auml;ndert !", "Senden nicht m&ouml;glich !");
                }
            }

        }

        return ctor;
    });