define(['../../services/connector', 'plugins/dialog',
        'src/viewmodels/cowi/dialoge/cwDialog', '../../services/usersService', '../../components/services/secured.Service'
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

                self.auswahlTrend = ko.observable(1);
                self.projectAuthorization = '';
                self.securedService = new securedService(self.projectAuthorization);
                self.hasAuthorization = self.securedService.hasAuthorization;
                //------------- User ermitteln Ende ---------------------------------------

                //------------ Buttons Freigabe je nach angemeldeten Benutzer --------------
                self.userFreigabe = ko.pureComputed(function () {
                    var self = this;
                    var user = ko.unwrap(self.userName);
                    var erg;

                    if ((user == 'Technik') || (user == 'user') || (user == 'ihcw3') || (user != '')) {
                        erg = true;
                    } else {
                        erg = false;
                    }
                    if (erg == true) {
                        console.log('%cAngemeldeter User: ' + user + ' / Freigabe: ' + erg, 'background: lime');
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
                //---- Fenster Größe ermitteln und die Zeichnung im DIV anpassen
                $(window).resize(function () {
                    self.setZoomFaktor(document.defaultView.innerWidth, document.defaultView.innerHeight)
                });

                self.zoomFaktor = ko.observable(1.0);
                self.setZoomFaktor(document.defaultView.innerWidth, document.defaultView.innerHeight); //einmalig die Funktion ausführen

                self.wert = ko.observable(1);

                self.benutzerName = ko.observable();

                self.sekunde = self.connector.getSignal('Local Second').value; //Sekunde
                self.anlageName = 'Mixer 3161';

                self.farbeWeiss = '#000';
                self.farbeGrau = 'fuellbandAntriebeFarbeGrau';
                self.farbeSahne1 = 'fuellbandAntriebeFarbeSahne1';
                self.farbeSahne2 = 'fuellbandAntriebeFarbeSahne2';
                self.farbeMarmelade = 'fuellbandAntriebeFarbeMarmelade';
                self.farbeFluessigkeit = 'fuellbandAntriebeFarbeFluessigkeit';
                self.farbeObst = 'fuellbandAntriebeFarbeObst';
                self.farbeGelly1 = 'fuellbandAntriebeFarbeGelly1';
                self.farbeGelly2 = 'fuellbandAntriebeFarbeGelly2';



                //---- Farbe Zone 1--------------------------------------------
                self.Zone1 = ko.computed(function () {
                    var self = this;

                    var sek = self.sekunde();
                    var ele = document.getElementById("Zone1")
                    // console.log("%c---- Zone1" + ele, "background:yellow");

                    // if (sek % 2) {
                    if (sek > 20) {
                        //document.getElementById("Zone1").style.fill = "blue";
                        if (ele != undefined) {
                            ele.style.fill = "grey"; //setAttribute("style.fill", "blue");
                        }
                    } else {
                        if (ele != undefined) {
                            document.getElementById("Zone1").style.fill = "blue";
                        }
                    }
                }, self);

                self.auslaufBand = ko.computed(function () {
                    var self = this;
                    var sek = self.sekunde();
                    var ele = document.getElementById("auslaufBand")

                    // console.log("%c---- auslaufBand" + ele, "background:grey");

                    if (sek % 5) {
                        //document.getElementById("Zone1").style.fill = "blue";
                        if (ele != undefined) {
                            ele.style.fill = "green"; //setAttribute("style.fill", "blue");
                        }
                    } else {
                        if (ele != undefined) {
                            //document.getElementById("einlaufBand").style.fill = "#ffffff";//fill:#000025
                            ele.style.fill = "grey"; //setAttribute("style.fill", "blue");
                        }
                    }
                }, self);
                //Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen  Tabellen   Tabellen  Tabellen 
                self.mixerHintergrundfarbe = '#A3A58D'; //Hintergrundfarbe für Text "Anlage xx" und Tabellenkopf
                // *******************************************************************************************************
                self.aliasNameZeile1UV = {
                    kommentar: 'Entkeimung Betriebstunden',
                    format: '0,0.0',
                    einheit: 'h',
                    bargraph1: {
                        sollwert: 'GaerDB124DBD42',
                        istwert: 'GaerDB124DBD46',
                    },
                    bargraph2: {
                        sollwert: 'GaerDB124DBD78',
                        istwert: 'GaerDB124DBD82',
                    },
                    bargraph3: {
                        sollwert: 'GaerDB124DBD96',
                        istwert: 'GaerDB124DBD100',
                    }
                };
                // *******************************************************************************************************
                self.aliasNameZeile2 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Temperatur',
                    Entspannkoffer: {
                        sollwert: 'GaerDB120DBW602',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW38',
                        sichtbarIst: true,
                    },
                    VGS: {
                        sollwert: 'GaerDB120DBW646',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW70',
                        sichtbarIst: true,
                    },
                    Zone1: {
                        sollwertA: 'GaerDB120DBW718',
                        sichtbarSollA: true,
                        istwertA: 'GaerDB122DBW104',
                        sichtbarIstA: true,
                        sollwertB: '',
                        sichtbarSollB: false,
                        istwertB: '',
                        sichtbarIstB: false,                        
                    },
                    Zone2: {
                        sollwert: 'GaerDB120DBW722',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW108',
                        sichtbarIst: true,
                    },
                    format: '0,0.0',
                    einheit: '°C'
                };
                self.aliasNameZeile3 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Luftfeuchtigkeit',
                    Entspannkoffer: {
                        sollwert: 'GaerDB120DBW600',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW36',
                        sichtbarIst: true,
                    },
                    VGS: {
                        sollwert: 'GaerDB120DBW644',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW68',
                        sichtbarIst: true,
                    },
                    Zone1: {
                        sollwertA: 'GaerDB120DBW716',
                        sichtbarSollA: true,
                        istwertA: 'GaerDB122DBW102',
                        sichtbarIstA: true,
                        sollwertB: '',
                        sichtbarSollB: false,
                        istwertB: '',
                        sichtbarIstB: false,
                    },
                    Zone2: {
                        sollwert: 'GaerDB120DBW720',
                        sichtbarSoll: true,
                        istwert: 'GaerDB122DBW106',
                        sichtbarIst: true,
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameZeile4 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Stellgröße Befeuchtung',
                    Entspannkoffer: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: 'Gaer4110DB2220INT54',
                        sichtbarIst: true,
                    },
                    VGS: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: 'Gaer4110DB2220INT128',
                        sichtbarIst: true,
                    },
                    Zone1: {
                        sollwertA: '',
                        sichtbarSollA: false,
                        istwertA: 'Gaer4110DB2220INT300',
                        sichtbarIstA: true,
                        sollwertB: '',
                        sichtbarSollB: false,
                        istwertB: 'Gaer4110DB2220INT326',
                        sichtbarIstB: true,                        
                    },
                    Zone2: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: 'GaerDB2220INT442',
                        sichtbarIst: true,
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameZeile5 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Stellgröße Heizung',
                    Entspannkoffer: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: '',
                        sichtbarIst: false,
                    },
                    VGS: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: '',
                        sichtbarIst: false,
                    },
                    Zone1: {
                        sollwertA: '',
                        sichtbarSollA: false,
                        istwertA: 'Gaer4110DB2220INT302',
                        sichtbarIstA: true,
                        sollwertB: '',
                        sichtbarSollB: false,
                        istwertB: 'Gaer4110DB2220INT328',
                        sichtbarIstB: true,
                    },
                    Zone2: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: 'GaerDB2220INT444',
                        sichtbarIst: true,
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameZeile8 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Stellgröße Kühlen',
                    Entspannkoffer: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: '',
                        sichtbarIst: false,
                    },
                    VGS: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: '',
                        sichtbarIst: false,
                    },
                    Zone1: {
                        sollwertA: '',
                        sichtbarSollA: false,
                        istwertA: 'GaerDB110DBW14',
                        sichtbarIstA: true,
                        sollwertB: '',
                        sichtbarSollB: false,
                        istwertB: '',
                        sichtbarIstB: false,
                    },
                    Zone2: {
                        sollwert: '',
                        sichtbarSoll: false,
                        istwert: 'GaerDB110DBW114',
                        sichtbarIst: true,
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                // *******************************************************************************************************
                self.aliasNameZeile6 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Heizung',
                    lblStateZone1: {
                        bmk: '=01+H01-???Y?',
                        name: 'Ventil Heizung Zone 1',
                        signalNameEin: 'GaerDB110DBX986',
                        signalNameStoer: 'GaerDB110DBX985',
                        sichtbar: true
                    },
                    lblStateZone2: {
                        bmk: '=01+H01-???Y?',
                        name: 'Ventil Heizung Zone 2',
                        signalNameEin: 'GaerDB110DBX1986',
                        signalNameStoer: 'GaerDB110DBX985',
                        sichtbar: true
                    },
                };
                self.aliasNameZeile7 = {
                    cssReiheRahmen: 'jj',
                    kommentar: 'Befeuchtung',
                    lblStateZone1: {
                        bmk: '=01+H01-???Y?',
                        name: 'Ventil Befeuchtung Zone 1',
                        signalNameEin: 'GaerDB110DBX987',
                        signalNameStoer: 'GaerDB110DBX985',
                        sichtbar: true
                    },
                    lblStateZone2: {
                        bmk: '=01+H01-???Y?',
                        name: 'Ventil Befeuchtung',
                        signalNameEin: 'GaerDB110DBX1987',
                        signalNameStoer: 'GaerDB110DBX985',
                        sichtbar: true
                    },
                };
                //Anfang Funktion erzeugeZeilen() für mehrere Antriebe zeilen
                self.erzeugeZeileUV = function (strukturByte) {
                    var self = this;
                    var kommentar = strukturByte.kommentar;
                    var einheit = strukturByte.einheit;
                    var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                    var format = strukturByte.format;
                    var bargraph1 = ko.computed(function () {
                        var mySignal = ((strukturByte.bargraph1.sollwert !== undefined) && (strukturByte.bargraph1.sollwert.length > 0)) ? strukturByte.bargraph1.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraph1.istwert !== undefined) && (strukturByte.bargraph1.istwert.length > 0)) ? strukturByte.bargraph1.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value();
                        var erg = 0;
                        var title = "";
                        title = "Betriebsstunden UV-Röhren Entkeimung Entspannkoffer: " + istwert + " h von " + sollwert + " h";
                        var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                        if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                            erg = 0;
                        } else {
                            erg = ((istwert * 100) / sollwert).toFixed(1);
                            if ((erg >= 75)) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                            }
                            if (erg >= 90) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                            }
                        }
                        return {
                            title: title,
                            istwert: istwert,
                            einheit: einheit,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    var bargraph2 = ko.computed(function () {
                        var mySignal = ((strukturByte.bargraph2.sollwert !== undefined) && (strukturByte.bargraph2.sollwert.length > 0)) ? strukturByte.bargraph2.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraph2 !== undefined) && (strukturByte.bargraph2.istwert.length > 0)) ? strukturByte.bargraph2.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value();
                        var erg = 0;
                        var title = "";
                        title = "Betriebsstunden UV-Röhren Entkeimung VGS: " + istwert + " h von " + sollwert + " h";
                        var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                        if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                            erg = 0;
                        } else {
                            erg = ((istwert * 100) / sollwert).toFixed(1);
                            if ((erg >= 75)) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                            }
                            if (erg >= 90) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                            }
                        }
                        return {
                            title: title,
                            istwert: istwert,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    var bargraph3 = ko.computed(function () {
                        var mySignal = ((strukturByte.bargraph3.sollwert !== undefined) && (strukturByte.bargraph3.sollwert.length > 0)) ? strukturByte.bargraph3.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraph3 !== undefined) && (strukturByte.bargraph3.istwert.length > 0)) ? strukturByte.bargraph3.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value();
                        var erg = 0;
                        var title = "";
                        title = "Betriebsstunden UV-Röhren Entkeimung NGS: " + istwert + " h von " + sollwert + " h";
                        var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                        if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                            erg = 0;
                        } else {
                            erg = ((istwert * 100) / sollwert).toFixed(1);
                            if ((erg >= 75)) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                            }
                            if (erg >= 90) {
                                farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                            }
                        }
                        return {
                            title: title,
                            istwert: istwert,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            kommentar: kommentar,
                            bargraph1: bargraph1,
                            bargraph2: bargraph2,
                            bargraph3: bargraph3,
                            freigabe: freigabe,
                            format: format,
                            einheit: einheit,
                        };
                    };
                }
                self.erzeugeZeile1 = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var kommentar = strukturByte.kommentar;
                    var bargraphWertEK = ko.pureComputed(function () {
                        var mySignal = ((strukturByte.bargraphWertEK.sollwert !== undefined) && (strukturByte.bargraphWertEK.sollwert.length > 0)) ? strukturByte.bargraphWertEK.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraphWertEK.istwert !== undefined) && (strukturByte.bargraphWertEK.istwert.length > 0)) ? strukturByte.bargraphWertEK.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value() * 100;
                        var sichtbarSoll = strukturByte.bargraphWertEK.sichtbarSoll;
                        var sichtbarIst = strukturByte.bargraphWertEK.sichtbarIst;
                        var erg = 0;
                        if (sichtbarIst == true) {
                            var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                            if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                                erg = 0;
                            } else {
                                erg = istwert / sollwert;
                                if ((erg >= 75)) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                                }
                            }
                        }
                        return {
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    var bargraphWertVGS = ko.pureComputed(function () {
                        var mySignal = ((strukturByte.bargraphWertVGS.sollwert !== undefined) && (strukturByte.bargraphWertVGS.sollwert.length > 0)) ? strukturByte.bargraphWertVGS.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraphWertVGS.istwert !== undefined) && (strukturByte.bargraphWertVGS.istwert.length > 0)) ? strukturByte.bargraphWertVGS.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value() * 100;
                        var sichtbarSoll = strukturByte.bargraphWertVGS.sichtbarSoll;
                        var sichtbarIst = strukturByte.bargraphWertVGS.sichtbarIst;
                        var erg = 0;
                        var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                        if (sichtbarIst == true) {
                            if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                                erg = 0;
                            } else {
                                erg = istwert / sollwert;
                                if ((erg >= 75)) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                                }
                            }
                        }
                        return {
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    var bargraphWertNGS = ko.pureComputed(function () {
                        var mySignal = ((strukturByte.bargraphWertNGS.sollwert !== undefined) && (strukturByte.bargraphWertNGS.sollwert.length > 0)) ? strukturByte.bargraphWertNGS.sollwert : 'Local Second';
                        var _mySignal = self.connector.getSignal(mySignal);
                        var sollwert = _mySignal.value();
                        mySignal = ((strukturByte.bargraphWertNGS.istwert !== undefined) && (strukturByte.bargraphWertNGS.istwert.length > 0)) ? strukturByte.bargraphWertNGS.istwert : 'Local Second';
                        _mySignal = self.connector.getSignal(mySignal);
                        var istwert = _mySignal.value() * 100;
                        var sichtbarSoll = strukturByte.bargraphWertNGS.sichtbarSoll;
                        var sichtbarIst = strukturByte.bargraphWertNGS.sichtbarIst;
                        var erg = 0;
                        var farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGruen';
                        if (sichtbarIst == true) {
                            if ((sollwert == 0) || (sollwert == undefined)) { //auf Null abfragen !Division Null!
                                erg = 0;
                            } else {
                                erg = istwert / sollwert;
                                if ((erg >= 75)) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeGelb';
                                }
                                if (erg >= 90) {
                                    farbe = 'sonderfunktionWartungAntriebeBargraphFarbeRot';
                                }
                            }
                        }
                        return {
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            erg: erg,
                            farbe: farbe
                        };
                    }, self);
                    var einheit = strukturByte.einheit;
                    var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                    var format = strukturByte.format;
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            kommentar: kommentar,
                            bargraphWertEK: bargraphWertEK,
                            bargraphWertVGS: bargraphWertVGS,
                            bargraphWertNGS: bargraphWertNGS,
                            freigabe: freigabe,
                            format: format,
                            einheit: einheit,
                        };
                    };
                }
                self.erzeugeZeile2 = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var kommentar = strukturByte.kommentar;
                    var Entspannkoffer = ko.pureComputed(function () {
                        var mySignal;
                        mySignal = ((strukturByte.Entspannkoffer.sollwert !== undefined) && (strukturByte.Entspannkoffer.sollwert.length > 0)) ? strukturByte.Entspannkoffer.sollwert : 'Local Second';
                        var sollwert = self.connector.getSignal(mySignal);
                        mySignal = ((strukturByte.Entspannkoffer.istwert !== undefined) && (strukturByte.Entspannkoffer.istwert.length > 0)) ? strukturByte.Entspannkoffer.istwert : 'Local Second';
                        var istwert = self.connector.getSignal(mySignal);
                        var sichtbarSoll = strukturByte.Entspannkoffer.sichtbarSoll;
                        var sichtbarIst = strukturByte.Entspannkoffer.sichtbarIst;
                        return {
                            sollwert: sollwert,
                            istwert: istwert,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst
                        };
                    }, self);
                    var VGS = ko.pureComputed(function () {
                        var mySignal;
                        mySignal = ((strukturByte.VGS.sollwert !== undefined) && (strukturByte.VGS.sollwert.length > 0)) ? strukturByte.VGS.sollwert : 'Local Second';
                        var sollwert = self.connector.getSignal(mySignal);
                        mySignal = ((strukturByte.VGS.istwert !== undefined) && (strukturByte.VGS.istwert.length > 0)) ? strukturByte.VGS.istwert : 'Local Second';
                        var istwert = self.connector.getSignal(mySignal);
                        var sichtbarSoll = strukturByte.VGS.sichtbarSoll;
                        var sichtbarIst = strukturByte.VGS.sichtbarIst;
                        return {
                            sollwert: sollwert,
                            istwert: istwert,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst
                        };
                    }, self);
                    var Zone1 = ko.pureComputed(function () {
                        var mySignal;
                        mySignal = ((strukturByte.Zone1.sollwertA !== undefined) && (strukturByte.Zone1.sollwertA.length > 0)) ? strukturByte.Zone1.sollwertA : 'Local Second';
                        var sollwertA = self.connector.getSignal(mySignal);
                        mySignal = ((strukturByte.Zone1.istwertA !== undefined) && (strukturByte.Zone1.istwertA.length > 0)) ? strukturByte.Zone1.istwertA : 'Local Second';
                        var istwertA = self.connector.getSignal(mySignal);
                        var sichtbarSollA = strukturByte.Zone1.sichtbarSollA;
                        var sichtbarIstA = strukturByte.Zone1.sichtbarIstA;
                        mySignal = ((strukturByte.Zone1.sollwertB !== undefined) && (strukturByte.Zone1.sollwertB.length > 0)) ? strukturByte.Zone1.sollwertB : 'Local Second';
                        var sollwertB = self.connector.getSignal(mySignal);
                        mySignal = ((strukturByte.Zone1.istwertB !== undefined) && (strukturByte.Zone1.istwertB.length > 0)) ? strukturByte.Zone1.istwertB : 'Local Second';
                        var istwertB = self.connector.getSignal(mySignal);
                        var sichtbarSollB = strukturByte.Zone1.sichtbarSollB;
                        var sichtbarIstB = strukturByte.Zone1.sichtbarIstB;                        
                        return {
                            sollwertA: sollwertA,
                            istwertA: istwertA,
                            sichtbarSollA: sichtbarSollA,
                            sichtbarIstA: sichtbarIstA,
                            sollwertB: sollwertB,
                            istwertB: istwertB,
                            sichtbarSollB: sichtbarSollB,
                            sichtbarIstB: sichtbarIstB
                        };
                    }, self);
                    var Zone2 = ko.pureComputed(function () {
                        var mySignal;
                        mySignal = ((strukturByte.Zone2.sollwert !== undefined) && (strukturByte.Zone2.sollwert.length > 0)) ? strukturByte.Zone2.sollwert : 'Local Second';
                        var sollwert = self.connector.getSignal(mySignal);
                        mySignal = ((strukturByte.Zone2.istwert !== undefined) && (strukturByte.Zone2.istwert.length > 0)) ? strukturByte.Zone2.istwert : 'Local Second';
                        var istwert = self.connector.getSignal(mySignal);
                        var sichtbarSoll = strukturByte.Zone2.sichtbarSoll;
                        var sichtbarIst = strukturByte.Zone2.sichtbarIst;
                        return {
                            sollwert: sollwert,
                            istwert: istwert,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst
                        };
                    }, self);
                    var einheit = strukturByte.einheit;
                    var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                    var format = strukturByte.format;
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            kommentar: kommentar,
                            Entspannkoffer: Entspannkoffer,
                            VGS: VGS,
                            Zone1: Zone1,
                            Zone2: Zone2,
                            freigabe: freigabe,
                            format: format,
                            einheit: einheit,
                        };
                    };
                }
                self.erzeugeZeile3 = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var kommentar = strukturByte.kommentar;
                    var lblStateZone1 = ko.pureComputed(function () {
                        var bmk = strukturByte.lblStateZone1.bmk;
                        var name = strukturByte.lblStateZone1.name;
                        var signalNameEin = self.connector.getSignal(strukturByte.lblStateZone1.signalNameEin);
                        var signalNameStoer = self.connector.getSignal(strukturByte.lblStateZone1.signalNameStoer);
                        var sichtbar = strukturByte.lblStateZone1.sichtbar;
                        return {
                            bmk: bmk,
                            name: name,
                            signalNameEin: signalNameEin,
                            signalNameStoer: signalNameStoer,
                            sichtbar: sichtbar
                        };
                    }, self);
                    var lblStateZone2 = ko.pureComputed(function () {
                        var bmk = strukturByte.lblStateZone2.bmk;
                        var name = strukturByte.lblStateZone2.name;
                        var sichtbar = strukturByte.lblStateZone2.sichtbar;
                        var signalNameEin = self.connector.getSignal(strukturByte.lblStateZone2.signalNameEin);
                        var signalNameStoer = self.connector.getSignal(strukturByte.lblStateZone2.signalNameStoer);
                        return {
                            bmk: bmk,
                            name: name,
                            signalNameEin: signalNameEin,
                            signalNameStoer: signalNameStoer,
                            sichtbar: sichtbar
                        };
                    }, self);
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            kommentar: kommentar,
                            lblStateZone1: lblStateZone1,
                            lblStateZone2: lblStateZone2,
                        };
                    };
                }
                //#region Zeilen Erzeugen für Antriebe
                self.zeile1UV = self.erzeugeZeileUV(self.aliasNameZeile1UV);

                self.zeile2 = self.erzeugeZeile2(self.aliasNameZeile2);
                self.zeile3 = self.erzeugeZeile2(self.aliasNameZeile3);
                self.zeile4 = self.erzeugeZeile2(self.aliasNameZeile4);
                self.zeile5 = self.erzeugeZeile2(self.aliasNameZeile5);
                self.zeile8 = self.erzeugeZeile2(self.aliasNameZeile8);

                self.zeile6 = self.erzeugeZeile3(self.aliasNameZeile6);
                self.zeile7 = self.erzeugeZeile3(self.aliasNameZeile7);

                self.roehrenUV = ko.observableArray([
                    self.zeile1UV,
                ]);
                self.istwerteNGS = ko.observableArray([
                    self.zeile2,
                    self.zeile3,
                    // self.zeile4,
                    // self.zeile5,
                    self.zeile8
                ]);
                self.statusKlima = ko.observableArray([
                    self.zeile6,
                    self.zeile7
                ]);

                //#endregion

                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);


                // self.produktionsAuftrag = self.connector.getSignal('SahneDB1DBD232');
                // self.produktionAktiv = self.connector.getSignal('SahneDB1DBX25').value;
                //self.aktuellerProgrammschritt = self.connector.getSignal('').value;

                self.rezeptnummer = self.connector.getSignal('SahneDB461DBD0');
                self.rezeptName = self.connector.getSignal('Virtuell3161').value;

                self.eineZeileAnwahl = ko.observable(0);
                self.ergASPAnfrage = ko.observable('Ergebnis Rezept-Info'); //Ergebnis in HTML-Seite anzeigen

                self.takt = ko.computed(function () {
                    return (ko.unwrap(self.sekunde()) % 2) > 0;
                });
                self.positionSticky;

                // self.bargraphValue = self.connector.getSignal('SahneDB1630DBB6').value; //Prozent 0-100%

                self.text = ko.observable('');
                //self.ergebnisRezeptDB = ko.observable('-----');

                self.queryStringArchiv = ko.observable(''); //queryString für Aufruf von Logliste-Archiv

                self.rezeptData = []; //leeres Array erzeugen
                self.werteUngleich = false;

                return self.connector.getOnlineUpdates();
            },
            setAuswahl: function (wert) {
                var self = this;
                self.auswahlTrend(wert);
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

            setZoomFaktor: function (width, height) {
                var self = this;
                var newFaktor = 1.0;
                if ((width > 0) && (width < 1000)) {
                    newFaktor = width / 1024; //das gezeichnete Bild (SmartEditor) ist für 1024 erstellt worden
                    self.zoomFaktor(newFaktor);
                }


            }

        }

        return ctor;
    });