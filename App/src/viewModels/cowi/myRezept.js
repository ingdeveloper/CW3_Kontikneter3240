define(['../../services/connector',
    'plugins/dialog',
    'src/viewmodels/cowi/dialoge/cwDialog',
    'src/viewmodels/cowi/dialoge/parameterReglerWaage',
    '../../services/usersService',
    '../../components/services/secured.service',
    '../../services/http',
    'src/viewmodels/cowi/dialoge/parameterReglerKuehlungKneter',
    'src/viewmodels/cowi/dialoge/parameterReglerKuehlungWaage3'
],
    function (signalsConnector, dialog,
        okCancelDialog, parameterReglerWaage, usersService, securedService, HttpService, parameterReglerKuehlungKneter, parameterReglerKuehlungWaage3) {
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

                self.produktwahlWaage1 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Weizenmehl',
                    id: 1
                }, {
                    txt: '(2) Strudelmehl',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 3
                }]; 
                self.produktwahlWaage2 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Salz',
                    id: 1
                }, {
                    txt: '(2) Biosalz',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 2
                }];                                 
                self.produktwahlWaage3 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Wasser',
                    id: 1
                }, {
                    txt: '(2) Molke',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 3
                }]; 
                self.produktwahlWaage4 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Hefe',
                    id: 1
                }, {
                    txt: '(2) Biohefe',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 3
                }];                                
                self.produktwahlWaage5 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Vorteig Pumpe 1',
                    id: 1
                }, {
                    txt: '(2) Körner 602 Pumpe 1',
                    id: 2
                }, {
                    txt: '(3) Mischung Pumpe 1',
                    id: 3
                }, {
                    txt: '(4) Vorteig Pumpe 2',
                    id: 4
                }];
                self.produktwahlWaage6 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Öl',
                    id: 1
                }, {
                    txt: '(2) Mischung',
                    id: 2
                }];
                self.produktwahlWaage7 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Zucker',
                    id: 1
                }, {
                    txt: '(2) Mischung',
                    id: 2
                }];
                self.produktwahlWaage9 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Malz 1',
                    id: 1
                }, {
                    txt: '(2) B-Malz 1',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 3
                }];  
                self.produktwahlWaage10 = [{
                    txt: '-',
                    id: 0
                }, {
                    txt: '(1) Malz 2',
                    id: 1
                }, {
                    txt: '(2) B-Malz 2',
                    id: 2
                }, {
                    txt: '(3) Mischung',
                    id: 3
                }];                                                
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

                self.reglerKneterAktiv = self.connector.getSignal('VMI3240DB56DBX02').value; //Teigtemperaturregler (0=Automatik, 1=Handbetrieb feste Temperatur)   

                self.reglerTeigAktiv = ko.computed(function() {
                    var self = this;
                    var sichtbar = false;
                    var css1 = 'bg-default'
                    var css2 = 'bg-default'
                    var vorwahl = self.reglerKneterAktiv();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            sichtbar = true;
                            css1 = 'bg-default';
                            css2 = 'bg-success';
                        } else {
                            sichtbar = false;
                            css1 = 'bg-warning';
                            css2 = 'bg-default';
                        }
                    }
                    return {
                        sichtbar:  sichtbar,
                        newCss1: css1,
                        newCss2: css2
                    };
                }, self);


                self._vorwahlWartung = self.connector.getSignal('VMI3240DB1DBX10'); //Wartungsbetrieb Waage 5
                self.vorwahlWartung = ko.computed(function () {
                    var self = this;
                    var css = 'btn-primary';
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
                            css = 'btn-default';
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
                // Rezept
                self.aliasNameZeile1Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '1',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB60',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD420',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB21DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB21DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW20',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD160',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD80',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD240',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB21DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB60',
                        vorwahl: self.produktwahlWaage1,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile2Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '2',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB61',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD424',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB22DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB22DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW22',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD164',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD84',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD244',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB22DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB61',
                        vorwahl: self.produktwahlWaage2,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile3Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '3',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB62',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD428',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB23DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB23DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW24',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD168',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD88',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD248',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB23DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB62',
                        vorwahl: self.produktwahlWaage3,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile4Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '4',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB63',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD432',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB24DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB24DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW26',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD172',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD92',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD252',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB24DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB63',
                        vorwahl: self.produktwahlWaage4,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile5Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '5',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB64',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD436',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB25DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB25DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW28',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD176',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD96',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD256',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB25DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB64',
                        vorwahl: self.produktwahlWaage5,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile6Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '6',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB65',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD440',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB26DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB26DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW30',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD180',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD100',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD260',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB26DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB26DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB26DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB26DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB65',
                        vorwahl: self.produktwahlWaage6,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile7Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '7',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB66',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD444',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB27DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB27DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW32',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD184',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD104',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD264',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB27DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: 'VMI3240DB220REAL624',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: 'VMI3240DB27REAL4',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB66',
                        vorwahl: self.produktwahlWaage7,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile9Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '9',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB68',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD452',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB29DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB29DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW36',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD192',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD112',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD272',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB30DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB68',
                        vorwahl: self.produktwahlWaage9,
                        sichtbar: true
                    },
                };
                self.aliasNameZeile10Rezept = {
                    cssReiheRahmen: 'jj',
                    waageNr: '10',
                    parameterRegler: {
                        komponentenNr: 'VMI3240DB220DBB69',
                    },
                    komponenteNr: {
                        signalName: 'VMI3240DB220DBD456',
                        einheit: ' ',
                        format: '0,0',
                        sichtbar: true
                    },
                    berLeistung: {
                        signalName: 'VMI3240DB30DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxLeistung: {
                        signalName: 'VMI3240DB30DBW112',
                        einheit: 'kg/h',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    sollMenge: {
                        signalName: 'VMI3240DB220DBW38',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    minFuellstand: {
                        signalName: 'VMI3240DB220DBD196',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    masseAnforderung: {
                        signalName: 'VMI3240DB220DBD116',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    maxFuellstand: {
                        signalName: 'VMI3240DB220DBD276',
                        einheit: 'kg',
                        format: '0,0.00',
                        sichtbar: true
                    },
                    dosierHandAuto: {
                        //signalName: '',
                        signalNameHandAuto: 'VMI3240DB30DBX01',
                        sichtbar: true
                    },
                    ruehrSollwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrIstwert: {
                        signalName: '',
                        einheit: '%',
                        format: '0,0.0',
                        sichtbar: false
                    },
                    ruehrHandAuto: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: false
                    },
                    ruehrByteEin: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: false
                    },
                    ruehrAus: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: false
                    },
                    produkt: {
                        signalName: 'VMI3240DB220DBB69',
                        vorwahl: self.produktwahlWaage10,
                        sichtbar: true
                    },
                };
             
                // *******************************************************************************************************
                // Abfuhrbänder                                                                                                                                                                                                             
                self.aliasNameByteZeile1Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-221TA1',
                    kommentar: 'Abfuhrband 1',
                    sollwert: 'VMI3240DB220REAL374',
                    istwert: 'VMI3240DB48REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT448',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB48B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-221TA5',
                    kommentar: 'Abfuhrband 2',
                    sollwert: 'VMI3240DB220REAL378',
                    istwert: 'VMI3240DB49REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT450',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB49B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-222TA1',
                    kommentar: 'Abfuhrband 3',
                    sollwert: 'VMI3240DB220REAL382',
                    istwert: 'VMI3240DB50REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT452',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB50B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-222TA5',
                    kommentar: 'Abfuhrband 4',
                    sollwert: 'VMI3240DB220REAL386',
                    istwert: 'VMI3240DB51REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT454',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB51B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-223TA1',
                    kommentar: 'Abfuhrband 5',
                    sollwert: 'VMI3240DB220REAL390',
                    istwert: 'VMI3240DB52REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT456',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB52B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                // Rührwerksantriebe
                self.aliasNameByteZeile1Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-21QA1',
                    kommentar: 'Rührwerk Waage 1',
                    sollwert: 'VMI3240DB220REAL600',
                    istwert: 'VMI3240DB21REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB21B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-21QA5',
                    kommentar: 'Rührwerk Waage 2',
                    sollwert: 'VMI3240DB220REAL604',
                    istwert: 'VMI3240DB22REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB22B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwert: '',
                    istwert: '',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnByteEin: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteLinks: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: '',
                        sichtbar: false
                    },
                    lblByteError: {
                        signalName: '',
                        sichtbar: false
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-22QA1',
                    kommentar: 'Rührwerk Waage 4',
                    sollwert: 'VMI3240DB220REAL612',
                    istwert: 'VMI3240DB24REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB24B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-22QA5',
                    kommentar: 'Rührwerk Waage 5',
                    sollwert: 'VMI3240DB220REAL616',
                    istwert: 'VMI3240DB25REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB25B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwert: '',
                    istwert: '',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnByteEin: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteLinks: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: '',
                        sichtbar: false
                    },
                    lblByteError: {
                        signalName: '',
                        sichtbar: false
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile7Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-23QA1',
                    kommentar: 'Rührwerk Waage 7',
                    sollwert: 'VMI3240DB220REAL624',
                    istwert: 'VMI3240DB27REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB27B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile8Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwert: '',
                    istwert: '',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnByteEin: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteLinks: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: '',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: '',
                        sichtbar: false
                    },
                    lblByteError: {
                        signalName: '',
                        sichtbar: false
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile9Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-23QA5',
                    kommentar: 'Rührwerk Waage 9',
                    sollwert: 'VMI3240DB220REAL632',
                    istwert: 'VMI3240DB29REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB29B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile10Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-24QA1',
                    kommentar: 'Rührwerk Waage 10',
                    sollwert: 'VMI3240DB220REAL636',
                    istwert: 'VMI3240DB30REAL4',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB30B32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                // Kneterantriebe
                self.aliasNameByteZeile1Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-228TA1',
                    kommentar: 'Vormischschnecke 1',
                    sollwert: 'VMI3240DB220REAL402',
                    istwert: 'VMI3240DB41REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT462',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB41B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-228TA5',
                    kommentar: 'Vormischschnecke 2',
                    sollwert: 'VMI3240DB220REAL406',
                    istwert: 'VMI3240DB42REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT464',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB42B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-229TA1',
                    kommentar: 'Vormischschnecke 3',
                    sollwert: 'VMI3240DB220REAL410',
                    istwert: 'VMI3240DB43REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT466',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB43B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-240TA5',
                    kommentar: 'Vorkneter Knetschnecke',
                    sollwert: 'VMI3240DB220REAL362',
                    istwert: 'VMI3240DB44REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT442',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB44B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-240TA1',
                    kommentar: 'Vorkneter Knetflügel',
                    sollwert: 'VMI3240DB220REAL366',
                    istwert: 'VMI3240DB45REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT444',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB45B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-241TA1',
                    kommentar: 'Hauptkneter',
                    sollwert: 'VMI3240DB220REAL370',
                    istwert: 'VMI3240DB46REAL4',
                    drehzahlSteigung: 'VMI3240DB220INT446',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB46B2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile7Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-241TA1',
                    kommentar: 'Massensperre Kneter',
                    sollwert: 'VMI3240DB220REAL490',
                    istwert: 'VMI3240DB46REAL54',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: false
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: true
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: true
                    },
                    btnAus: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB46B28',
                        sichtbar: true
                    },
                    format: '0,0',
                    einheit: 'mm'
                };
                self.aliasNameByteZeile8Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-xxxTAx',
                    kommentar: 'Guillotine',
                    sollwert: '',
                    istwert: '',
                    drehzahlSteigung: '',
                    lblState: {
                        lblTextDefault: '',
                        lblText1: '',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: '',
                        css1: '',
                        css2: '',
                        css3: '',
                        signalName: '',
                        sichtbar: false
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB23B32',
                        sichtbar: true
                    },
                    format: '0,0',
                    einheit: 'mm'
                };
                //Anfang Funktion erzeugeZeilen() für mehrere Antriebe zeilen
                self.erzeugenZeile = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var waageNr = strukturByte.waageNr;
                    var parameterRegler = ko.computed(function () {
                        var mySignal = (strukturByte.parameterRegler.komponentenNr !== undefined) && (strukturByte.parameterRegler.komponentenNr.length > 0) ? strukturByte.parameterRegler.komponentenNr : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var komponente = signal.signalName();
                        return {
                            komponente: komponente,
                        }
                    }, self);
                    var komponenteNr = ko.computed(function () {
                        self = this;
                        var css = 'default';
                        var mySignal = (strukturByte.komponenteNr.signalName !== undefined) && (strukturByte.komponenteNr.signalName.length > 0) ? strukturByte.komponenteNr.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.komponenteNr.einheit;
                        var format = strukturByte.komponenteNr.format;
                        var sichtbar = strukturByte.komponenteNr.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            // myText: text,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var produkt = ko.computed(function () {
                        self = this;
                        var listeProdukt = strukturByte.produkt.vorwahl;
                        var css = 'btn-default';
                        var sichtbar = strukturByte.produkt.sichtbar;
                        var mySignal = (strukturByte.produkt.signalName !== undefined) && (strukturByte.produkt.signalName.length > 0) ? strukturByte.produkt.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var isBuffered = self.connector.existSignalInBuffer(signalName) && !self.connector.signalBufferIsEmpty();  //Im Zwischenpuffer?
                        if (isBuffered) {
                            css = 'btn-info';
                            value = self.connector.readSignalsFromBuffer([signalName]);  //Signale vom Buffer lesen
                        } else {
                            value = signal.value();
                            //console.log(connector);
                        }
                        return {
                            newListe: listeProdukt,
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var berLeistung = ko.computed(function () {
                        var css = 'btn-default';
                        var mySignal = (strukturByte.berLeistung.signalName !== undefined) && (strukturByte.berLeistung.signalName.length > 0) ? strukturByte.berLeistung.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.berLeistung.einheit;
                        var format = strukturByte.berLeistung.format;
                        var sichtbar = strukturByte.berLeistung.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        };
                    }, self);
                    var maxLeistung = ko.computed(function () {
                        var css = 'default';
                        var mySignal = (strukturByte.maxLeistung.signalName !== undefined) && (strukturByte.maxLeistung.signalName.length > 0) ? strukturByte.maxLeistung.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.maxLeistung.einheit;
                        var format = strukturByte.maxLeistung.format;
                        var sichtbar = strukturByte.maxLeistung.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var sollMenge = ko.computed(function () {
                        var css = 'default';
                        var mySignal = (strukturByte.sollMenge.signalName !== undefined) && (strukturByte.sollMenge.signalName.length > 0) ? strukturByte.sollMenge.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.sollMenge.einheit;
                        var format = strukturByte.sollMenge.format;
                        var sichtbar = strukturByte.sollMenge.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var minFuellstand = ko.computed(function () {
                        var css = 'default';
                        var mySignal = (strukturByte.minFuellstand.signalName !== undefined) && (strukturByte.minFuellstand.signalName.length > 0) ? strukturByte.minFuellstand.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.minFuellstand.einheit;
                        var format = strukturByte.minFuellstand.format;
                        var sichtbar = strukturByte.minFuellstand.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var masseAnforderung = ko.computed(function () {
                        var css = 'default';
                        var mySignal = (strukturByte.masseAnforderung.signalName !== undefined) && (strukturByte.masseAnforderung.signalName.length > 0) ? strukturByte.masseAnforderung.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.masseAnforderung.einheit;
                        var format = strukturByte.masseAnforderung.format;
                        var sichtbar = strukturByte.masseAnforderung.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var maxFuellstand = ko.computed(function () {
                        var css = 'default';
                        var sichtbar = strukturByte.ruehrSollwert.sichtbar;
                        var mySignal = (strukturByte.maxFuellstand.signalName !== undefined) && (strukturByte.maxFuellstand.signalName.length > 0) ? strukturByte.maxFuellstand.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var einheit = strukturByte.maxFuellstand.einheit;
                        var format = strukturByte.maxFuellstand.format;
                        var sichtbar = strukturByte.maxFuellstand.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var dosierHandAuto = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = '';
                        var signal;
                        var mySignal = (strukturByte.dosierHandAuto.signalName !== undefined) && (strukturByte.dosierHandAuto.signalName.length > 0) ? strukturByte.dosierHandAuto.signalName : strukturByte.dosierHandAuto.signalNameHandAuto;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        if (strukturByte.dosierHandAuto.signalName != undefined) {
                            var Hand = ((value & 0x02) >> 1);
                            var Stoer = ((value & 0x20) >> 5) || ((value & 0x40) >> 6);
                            if ((Stoer & 1) > 0) {
                                css = 'btn-danger';
                                if ((Hand != 0)) {
                                    btnTxt = 'Hand';
                                } else {
                                    btnTxt = 'Auto';
                                }
                            } else {
                                if ((Hand != 0)) {
                                    css = 'btn-warning';
                                    btnTxt = 'Hand';
                                } else {
                                    css = 'btn-success';
                                    btnTxt = 'Auto';
                                }
                            }
                        } else {
                            if ((value != 0)) {
                                css = 'btn-warning';
                                btnTxt = 'Hand';
                            } else {
                                css = 'btn-success';
                                btnTxt = 'Auto';
                            }
                        }

                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.dosierHandAuto.sichtbar;
                        //console.log("%c---- teil2---" + Hand, "background:yellow");
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);
                    var ruehrSollwert = ko.computed(function () {
                        var css = 'default';
                        var einheit = strukturByte.ruehrSollwert.einheit;
                        var format = strukturByte.ruehrSollwert.format;
                        var sichtbar = strukturByte.ruehrSollwert.sichtbar;
                        var mySignal = (strukturByte.ruehrSollwert.signalName !== undefined) && (strukturByte.ruehrSollwert.signalName.length > 0) ? strukturByte.ruehrSollwert.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var ruehrIstwert = ko.computed(function () {
                        var css = 'default';
                        var einheit = strukturByte.ruehrIstwert.einheit;
                        var format = strukturByte.ruehrIstwert.format;
                        var sichtbar = strukturByte.ruehrIstwert.sichtbar;
                        var mySignal = (strukturByte.ruehrIstwert.signalName !== undefined) && (strukturByte.ruehrIstwert.signalName.length > 0) ? strukturByte.ruehrIstwert.signalName : 'Local Second';
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            einheit: einheit,
                            format: format,
                            sichtbar: sichtbar
                        }
                    }, self);
                    var btnHandAuto = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = '';
                        var mySignal = (strukturByte.ruehrHandAuto.signalName !== undefined) && (strukturByte.ruehrHandAuto.signalName.length > 0) ? strukturByte.ruehrHandAuto.signalName : strukturByte.ruehrHandAuto.signalNameHandAuto;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        if (strukturByte.ruehrHandAuto.signalName != undefined) {
                            var Hand = ((value & 0x02) >> 1);
                            var Stoer = ((value & 0x20) >> 5) || ((value & 0x40) >> 6);
                            if ((Stoer & 1) > 0) {
                                css = 'btn-danger';
                                if ((Hand != 0)) {
                                    btnTxt = 'Hand';
                                } else {
                                    btnTxt = 'Auto';
                                }
                            } else {
                                if ((Hand != 0)) {
                                    css = 'btn-warning';
                                    btnTxt = 'Hand';
                                } else {
                                    css = 'btn-success';
                                    btnTxt = 'Auto';
                                }
                            }
                        } else {
                            if ((value != 0)) {
                                css = 'btn-warning';
                                btnTxt = 'Hand';
                            } else {
                                css = 'btn-success';
                                btnTxt = 'Auto';
                            }
                        }

                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.ruehrHandAuto.sichtbar;
                        //console.log("%c---- teil2---" + Hand, "background:yellow");
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);
                    var btnByteEin = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = 'Ein';
                        var mySignal = (strukturByte.ruehrByteEin.signalName !== undefined) && (strukturByte.ruehrByteEin.signalName.length > 0) ? strukturByte.ruehrByteEin.signalName : strukturByte.ruehrByteEin.signalNameEin;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        if (strukturByte.ruehrByteEin.signalName != undefined) {
                            var Ein = ((value & 0x01) >> 0) || ((value & 0x04) >> 2);
                            if (Ein != 0) {
                                css = 'btn-success';
                            } else {
                                css = 'btn-default';
                            }
                        } else {
                            if (value != 0) {
                                css = 'btn-success';
                            } else {
                                css = 'btn-default';
                            }
                        }
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.ruehrByteEin.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalName: signalName,
                            signal: signal,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);
                    var btnAus = ko.computed(function () {
                        var mySignal = (strukturByte.ruehrAus.signalName !== undefined) && (strukturByte.ruehrAus.signalName.length > 0) ? strukturByte.ruehrAus.signalName : strukturByte.ruehrAus.signalNameAus;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var btnTxt = 'Aus';
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.ruehrAus.sichtbar;
                        return {
                            newValue: value,
                            signalName: signalName,
                            signal: signal,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            waageNr: waageNr,
                            parameterRegler: parameterRegler,
                            komponenteNr: komponenteNr,
                            produkt: produkt,
                            berLeistung: berLeistung,
                            maxLeistung: maxLeistung,
                            sollMenge: sollMenge,
                            minFuellstand: minFuellstand,
                            masseAnforderung: masseAnforderung,
                            maxFuellstand: maxFuellstand,
                            dosierHandAuto: dosierHandAuto,
                            ruehrSollwert: ruehrSollwert,
                            ruehrIstwert: ruehrIstwert,
                            btnHandAuto: btnHandAuto,
                            btnByteEin: btnByteEin,
                            btnAus: btnAus,
                        };
                    };
                }
                self.erzeugeZeilenByte = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var bmk = strukturByte.bmk;
                    var kommentar = strukturByte.kommentar;
                    var mySignal;
                    mySignal = ((strukturByte.sollwert !== undefined) && (strukturByte.sollwert.length > 0)) ? strukturByte.sollwert : 'Local Second';
                    var sollwert = self.connector.getSignal(strukturByte.sollwert);
                    mySignal = ((strukturByte.istwert !== undefined) && (strukturByte.istwert.length > 0)) ? strukturByte.istwert : 'Local Second';
                    var istwert = self.connector.getSignal(strukturByte.istwert);
                    mySignal = ((strukturByte.drehzahlSteigung !== undefined) && (strukturByte.drehzahlSteigung.length > 0)) ? strukturByte.drehzahlSteigung : 'Local Second';
                    var steigung = self.connector.getSignal(strukturByte.drehzahlSteigung);
                    var sichtbarSoll = (strukturByte.sollwert.length > 0) ? true : false;
                    var sichtbarIst = (strukturByte.istwert.length > 0) ? true : false;
                    var sichtbarSteigung = (strukturByte.drehzahlSteigung.length > 0) ? true : false;

                    var lblState = ko.computed(function () {
                        css = strukturByte.lblState.cssTextDefault;
                        lblState = strukturByte.lblState.lblTextDefault;
                        var sichtbar = strukturByte.lblState.sichtbar;
                        if (sichtbar == true) {
                            var css = strukturByte.lblState.cssTextDefault;
                            var lblState = strukturByte.lblState.lblTextDefault;
                            var signal1 = self.connector.getSignal(strukturByte.lblState.signalName1);
                            var value1 = signal1.value();
                            var signal2 = self.connector.getSignal(strukturByte.lblState.signalName2);
                            var value2 = signal2.value();
                            var sichtbar = strukturByte.lblState.sichtbar;
                            var faehrtauf = ((value1 & 0x01) >> 0); // fährt auf
                            var faehrtzu = ((value1 & 0x04) >> 2); // fährt zu
                            var offen = ((value2 & 0x01) >> 0); // Ventil offen
                            var geschlossen = ((value2 & 0x04) >> 2); // Ventil geschlossen
                            if (((offen & 1) == 0) && ((geschlossen & 1) > 0)) {
                                css = strukturByte.lblState.cssText2;
                                lblState = strukturByte.lblState.lblText2;
                            } else {
                                if (((geschlossen & 1) == 0) && ((offen & 1) > 0)) {
                                    css = strukturByte.lblState.cssText1;
                                    lblState = strukturByte.lblState.lblText1;
                                } else {
                                    if ((faehrtzu & 1) > 0) {
                                        css = strukturByte.lblState.cssText3;
                                        lblState = strukturByte.lblState.lblText3;
                                    } else {
                                        if ((faehrtauf & 1) > 0) {
                                            css = strukturByte.lblState.cssText4;
                                            lblState = strukturByte.lblState.lblText4;
                                        } else {
                                            css = strukturByte.lblState.cssTextDefault;
                                            lblState = strukturByte.lblState.lblTextDefault;
                                        }
                                    }
                                }
                            }
                        }
                        return {
                            newCss: css,
                            sichtbar: sichtbar,
                            state: lblState
                        };
                    }, self);

                    var btnHandAuto = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = '';
                        var signal;
                        var mySignal = (strukturByte.btnHandAuto.signalName !== undefined) ? strukturByte.btnHandAuto.signalName : strukturByte.btnHandAuto.signalNameHandAuto;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        if (strukturByte.btnHandAuto.signalName != undefined) {
                            var Hand = ((value & 0x02) >> 1);
                            var Stoer = ((value & 0x20) >> 5) || ((value & 0x40) >> 6);
                            if ((Stoer & 1) > 0) {
                                css = 'btn-danger';
                                if ((Hand & 1) > 0) {
                                    btnTxt = 'Hand';
                                } else {
                                    btnTxt = 'Auto';
                                }
                            } else {
                                if ((Hand & 1) > 0) {
                                    css = 'btn-warning';
                                    btnTxt = 'Hand';
                                } else {
                                    css = 'btn-success';
                                    btnTxt = 'Auto';
                                }
                            }
                        } else {
                            if ((value != 0)) {
                                css = 'btn-warning';
                                btnTxt = 'Hand';
                            } else {
                                css = 'btn-success';
                                btnTxt = 'Auto';
                            }
                        }

                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.btnHandAuto.sichtbar;
                        //console.log("%c---- teil2---" + Hand, "background:yellow");
                        return {
                            newValue: value,
                            newCss: css,
                            freigabe: freigabe,
                            signalName: signalName,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnByteEin = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = 'Ein';
                        var mySignal = (strukturByte.btnByteEin.signalName !== undefined) && (strukturByte.btnByteEin.signalName.length > 0) ? strukturByte.btnByteEin.signalName : strukturByte.btnByteEin.signalNameEin;
                        var signal = self.connector.getSignal(mySignal);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var Hand = ((value & 0x02) >> 1);
                        var Ein = ((value & 0x01) >> 0);
                        if (signal.signalName() != undefined) {
                            // if ((Hand & 1) > 0 && (Ein & 1) > 0) {   //geändert amueller 
                            if ((Ein & 1) > 0) {
                                css = 'btn-success';
                            } else {
                                css = 'btn-default';
                            }
                        } else {
                            if (value != 0) {
                                css = 'btn-success';
                            } else {
                                css = 'btn-default';
                            }
                        }
                        var title = '';
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        if ((Hand & 1) > 0) {
                            title = 'Antrieb einschalten';
                            freigabe = true && self.userFreigabe();
                        } else {
                            title = 'Antrieb einschalten nur im Handbetrieb möglich!';
                            freigabe = false;
                        }
                        var sichtbar = strukturByte.btnByteEin.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            newTitle: title,
                            signalName: signalName,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnEinByteLinks = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = '';
                        var signal = self.connector.getSignal(strukturByte.btnEinByteLinks.signalName);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var Hand = ((value & 0x02) >> 1);
                        var einLinks = ((value & 0x04) >> 2); //|| ((value & 0x40) >> 6);
                        var einRechts = ((value & 0x01) >> 0); // || ((value & 0x40) >> 6);

                        btnTxt = '<';
                        css = 'btn-default';
                        //console.log("%c--Teil111Hand:  " + Hand + " //links  " + einLinks + " //Rechts  " + einRechts, "background:yellow");

                        //css = 'btn-danger';
                        if ((einLinks == 1)) {
                            css = 'btn-success';
                        }

                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.btnEinByteLinks.sichtbar;
                        var title = '';
                        if ((Hand & 1) > 0) {
                            title = 'Antrieb einschalten';
                            freigabe = true && self.userFreigabe();
                        } else {
                            title = 'Antrieb einschalten nur im Handbetrieb möglich!';
                            freigabe = false;
                        }
                        return {
                            newValue: value,
                            newCss: css,
                            newTitle: title,
                            signalName: signalName,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnEinByteRechts = ko.computed(function () {
                        var css = 'btn-default';
                        var btnTxt = '';
                        var signal = self.connector.getSignal(strukturByte.btnEinByteRechts.signalName);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var Hand = ((value & 0x02) >> 1);
                        var einLinks = ((value & 0x04) >> 2); //|| ((value & 0x40) >> 6);
                        var einRechts = ((value & 0x01) >> 0); // || ((value & 0x40) >> 6);

                        btnTxt = '>';
                        css = 'btn-default';
                        //console.log("%c--TeilRechtsHand:  " + Hand + " //links  " + einLinks + " //Rechts  " + einRechts, "background:yellow");

                        //css = 'btn-danger';
                        if ((einRechts == 1)) {
                            css = 'btn-success';
                        }

                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.btnEinByteRechts.sichtbar;
                        var title = '';
                        if ((Hand & 1) > 0) {
                            title = 'Antrieb einschalten';
                            freigabe = true && self.userFreigabe();
                        } else {
                            title = 'Antrieb einschalten nur im Handbetrieb möglich!';
                            freigabe = false;
                        }
                        return {
                            newValue: value,
                            newCss: css,
                            newTitle: title,
                            signalName: signalName,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnAus = ko.computed(function () {
                        var signal = self.connector.getSignal(strukturByte.btnAus.signalName);
                        var btnTxt = 'Aus';
                        if (signal.signalName() != undefined) {
                            var signalName = signal.signalName();
                            var value = signal.value();
                        } else {
                            var signal = self.connector.getSignal(strukturByte.btnAus.signalNameAus);
                            var signalName = signal.signalName();
                            var value = signal.value();
                        }
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = strukturByte.btnAus.sichtbar;
                        return {
                            newValue: value,
                            signalName: signalName,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var lblByteError = ko.computed(function () {
                        var css = '';
                        var cssText = 'Alles OK!';
                        var cssTd = 'default';
                        var signal = self.connector.getSignal(strukturByte.lblByteError.signalName);
                        var signalName = signal.signalName();
                        var value = signal.value();
                        var neueStörung = ((value & 0x32) >> 5);
                        var störung = ((value & 0x64) >> 6);
                        var sichtbar = strukturByte.lblByteError.sichtbar;
                        if ((störung & 1) > 0) {
                            css = 'wf wf-alarm error';
                            cssText = 'Störung von Antrieb: ' + strukturByte.kommentar + '(' + strukturByte.kommentar + ')';
                            cssTd = 'bg-warning';
                        }
                        if ((neueStörung & 1) > 0) {
                            css = 'wf wf-alarm critical';
                            cssText = 'Neue Störung von Antrieb: ' + strukturByte.kommentar + '(' + strukturByte.bmk + ')';
                            cssTd = 'bg-danger';
                        }
                        return {
                            newCss: css,
                            newcssTd: cssTd,
                            newCssText: cssText,
                            sichtbar: sichtbar,
                        };
                    }, self);

                    var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                    var einheit = strukturByte.einheit;
                    var format = strukturByte.format;
                    var formatSteigung = '0,0.00';
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            bmk: bmk,
                            kommentar: kommentar,
                            sollwert: sollwert,
                            istwert: istwert,
                            steigung: steigung,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            sichtbarSteigung: sichtbarSteigung,
                            einheit: einheit,
                            freigabe: freigabe,
                            format: format, //'0,0.[0]'
                            formatSteigung: formatSteigung,
                            lblState: lblState,
                            lblByteError: lblByteError,
                            btnHandAuto: btnHandAuto,
                            btnByteEin: btnByteEin,
                            btnEinByteLinks: btnEinByteLinks,
                            btnEinByteRechts: btnEinByteRechts,
                            btnAus: btnAus
                        };
                    };
                }
                //#region Zeilen Erzeugen für Antriebe

                self.zeile1Rezept = self.erzeugenZeile(self.aliasNameZeile1Rezept);
                self.zeile2Rezept = self.erzeugenZeile(self.aliasNameZeile2Rezept);
                self.zeile3Rezept = self.erzeugenZeile(self.aliasNameZeile3Rezept);
                self.zeile4Rezept = self.erzeugenZeile(self.aliasNameZeile4Rezept);
                self.zeile5Rezept = self.erzeugenZeile(self.aliasNameZeile5Rezept);
                self.zeile6Rezept = self.erzeugenZeile(self.aliasNameZeile6Rezept);
                self.zeile7Rezept = self.erzeugenZeile(self.aliasNameZeile7Rezept);
                self.zeile9Rezept = self.erzeugenZeile(self.aliasNameZeile9Rezept);
                self.zeile10Rezept = self.erzeugenZeile(self.aliasNameZeile10Rezept);

                self.zeile1Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile1Ruehrwerke);
                self.zeile2Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile2Ruehrwerke);
                self.zeile3Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile3Ruehrwerke);
                self.zeile4Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile4Ruehrwerke);
                self.zeile5Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile5Ruehrwerke);
                self.zeile6Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile6Ruehrwerke);
                self.zeile7Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile7Ruehrwerke);
                self.zeile8Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile8Ruehrwerke);
                self.zeile9Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile9Ruehrwerke);
                self.zeile10Ruehrwerke = self.erzeugeZeilenByte(self.aliasNameByteZeile10Ruehrwerke);

                self.zeile1Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile1Baender);
                self.zeile2Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile2Baender);
                self.zeile3Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile3Baender);
                self.zeile4Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile4Baender);
                self.zeile5Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile5Baender);

                self.zeile1Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile1Kneter);
                self.zeile2Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile2Kneter);
                // self.zeile3Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile3Kneter);
                self.zeile4Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile4Kneter);
                self.zeile5Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile5Kneter);
                self.zeile6Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile6Kneter);
                self.zeile7Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile7Kneter);
                self.zeile8Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile8Kneter);

                self.rezeptVMI = ko.observableArray([
                    self.zeile1Rezept,
                    self.zeile2Rezept,
                    self.zeile3Rezept,
                    self.zeile4Rezept,
                    self.zeile5Rezept,
                    self.zeile6Rezept,
                    self.zeile7Rezept,
                    self.zeile9Rezept,
                    self.zeile10Rezept
                ]);

                self.antriebeBaender = ko.observableArray([
                    self.zeile1Baender,
                    self.zeile2Baender,
                    self.zeile3Baender,
                    self.zeile4Baender,
                    self.zeile5Baender
                ]);

                self.antriebeRuehrwerke = ko.observableArray([
                    self.zeile1Ruehrwerke,
                    self.zeile2Ruehrwerke,
                    self.zeile3Ruehrwerke,
                    self.zeile4Ruehrwerke,
                    self.zeile5Ruehrwerke,
                    self.zeile6Ruehrwerke,
                    self.zeile7Ruehrwerke,
                    self.zeile8Ruehrwerke,
                    self.zeile9Ruehrwerke,
                    self.zeile10Ruehrwerke
                ]);

                self.antriebeKneter = ko.observableArray([
                    self.zeile1Kneter,
                    self.zeile2Kneter,
                    // self.zeile3Kneter,
                    self.zeile4Kneter,
                    self.zeile5Kneter,
                    self.zeile6Kneter,
                    self.zeile7Kneter,
                    self.zeile8Kneter
                ]);
                //#endregion

                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);


                // self.produktionsAuftrag = self.connector.getSignal('SahneDB1REAL232');
                // self.produktionAktiv = self.connector.getSignal('SahneDB1DBX25').value;
                //self.aktuellerProgrammschritt = self.connector.getSignal('').value;

                self.rezeptnummer = self.connector.getSignal('SahneDB461REAL0');
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
            openDialogKuehlungKneter: function(waageCSS) {
                var self = this;
                dialog.show(
                        new parameterReglerKuehlungKneter(waageCSS)
                    )
                    .then(function(dialogResult) {
                        console.log(dialogResult);
                    });
            },
            openDialogKuehlungWaage3: function(waageCSS) {
                var self = this;
                dialog.show(
                        new parameterReglerKuehlungWaage3(waageCSS)
                    )
                    .then(function(dialogResult) {
                        console.log(dialogResult);
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
            setModalRegler: function (WaageCSS, WaageNr, Komponententext, index, selectedKomponente) {
                var self = this;
                dialog.show(
                    new parameterReglerWaage(WaageCSS, WaageNr, Komponententext, parseInt(index), selectedKomponente)
                )
                    .then(function (dialogResult) {
                        console.log(dialogResult);
                    });
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
            httpGet: function (url) {
                // return new Promise(function (resolve, reject) {
                //     const request = new XMLHttpRequest();
                //     request.open('GET', url);
                //     request.addEventListener('load', function (event) {
                //         // console.log(request);
                //         if (request.status >= 200 && request.status < 300) {
                //             // console.log(request.responseText);
                //             return resolve(request.responseText);
                //         } else {
                //             // console.warn(request.statusText, request.responseText);
                //             return reject("Fehler");
                //         }
                //     });
                //     request.send();
                // });
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