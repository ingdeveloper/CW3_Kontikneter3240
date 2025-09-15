define(['../../services/connector', 'plugins/dialog',
    'src/viewmodels/cowi/dialoge/cwDialog', '../../services/usersService', '../../components/services/secured.service'
],
    function (signalsConnector, dialog,
        okCancelDialog, usersService, securedService) {
        var ctor = function () { };
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
                    return '';
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

                self.farbeWeiss = '#000';
                self.farbeGrau = 'fuellbandAntriebeFarbeGrau';
                self.farbeSahne1 = 'fuellbandAntriebeFarbeSahne1';
                self.farbeSahne2 = 'fuellbandAntriebeFarbeSahne2';
                self.farbeMarmelade = 'fuellbandAntriebeFarbeMarmelade';
                self.farbeFluessigkeit = 'fuellbandAntriebeFarbeFluessigkeit';
                self.farbeObst = 'fuellbandAntriebeFarbeObst';
                self.farbeGelly1 = 'fuellbandAntriebeFarbeGelly1';
                self.farbeGelly2 = 'fuellbandAntriebeFarbeGelly2';
                //Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen   Tabellen  Tabellen   Tabellen  Tabellen 
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

                self.mixerHintergrundfarbe = '#A3A58D'; //Hintergrundfarbe für Text "Anlage xx" und Tabellenkopf
                // *******************************************************************************************************
                // Dosierantriebe
                self.aliasNameByteZeile1Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-221TA5',
                    kommentar: 'Dosierantrieb Waage 1',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB21DBW18',
                    istwert: 'VMI3240DB21DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD420',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB21DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-222TA5',
                    kommentar: 'Dosierantrieb Waage 2',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB22DBW18',
                    istwert: 'VMI3240DB22DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD424',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB22DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-223TA5',
                    kommentar: 'Dosierantrieb Waage 3',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB23DBW18',
                    istwert: 'VMI3240DB23DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD428',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB23DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-223TA5',
                    kommentar: 'Dosierantrieb Waage 4',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB24DBW18',
                    istwert: 'VMI3240DB24DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD432',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB24DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-224TA5',
                    kommentar: 'Dosierantrieb Waage 5',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB25DBW18',
                    istwert: 'VMI3240DB25DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD436',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB25DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-225TA5',
                    kommentar: 'Dosierantrieb Waage 6',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB26DBW18',
                    istwert: 'VMI3240DB26DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD440',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB26DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile7Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-226TA5',
                    kommentar: 'Dosierantrieb Waage 7',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB27DBW18',
                    istwert: 'VMI3240DB27DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD444',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB27DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile8Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                self.aliasNameByteZeile9Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-227TA5',
                    kommentar: 'Dosierantrieb Waage 9',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB29DBW18',
                    istwert: 'VMI3240DB29DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD452',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB29DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile10Dosieren = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-228TA5',
                    kommentar: 'Dosierantrieb Waage 10',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB30DBW18',
                    istwert: 'VMI3240DB30DBW4',
                    komponente: {
                        nummer: 'VMI3240DB220DBD456',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB30DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
              
                // Rührwerksantriebe
                self.aliasNameByteZeile1Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-221TA1',
                    kommentar: 'Rührwerk Waage 1',
                    sollwertAuto: '',//VMI3240DB220DBW510
                    sollwert: '',//VMI3240DB21DBW48
                    istwert: '',//VMI3240DB21DBW34
                    komponente: {
                        nummer: 'VMI3240DB220DBD420',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB21DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-222TA1',
                    kommentar: 'Rührwerk Waage 2',
                    sollwertAuto: 'VMI3240DB220DBW512',
                    sollwert: 'VMI3240DB22DBW48',//
                    istwert: 'VMI3240DB22DBW34',//
                    komponente: {
                        nummer: 'VMI3240DB220DBD424',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB22DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                    bmk: '=01+H01-223TA5',
                    kommentar: 'Rührwerk Waage 4',
                    sollwertAuto: 'VMI3240DB220DBW516',
                    sollwert: 'VMI3240DB24DBW48',//
                    istwert: 'VMI3240DB24DBW34',//
                    komponente: {
                        nummer: 'VMI3240DB220DBD432',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB24DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-224TA1',
                    kommentar: 'Rührwerk Waage 5',
                    sollwertAuto: '',//VMI3240DB220DBW518
                    sollwert: '',//VMI3240DB25DBW48
                    istwert: '',//VMI3240DB25DBW34
                    komponente: {
                        nummer: 'VMI3240DB220DBD436',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB25DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                    bmk: '=01+H01-226TA1',
                    kommentar: 'Rührwerk Waage 7',
                    sollwertAuto: 'VMI3240DB220DBW522',
                    sollwert: 'VMI3240DB27DBW48',// Hand ?
                    istwert: 'VMI3240DB27DBW34',//VMI3240DB27DBW4
                    komponente: {
                        nummer: 'VMI3240DB220DBD444',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB27DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile8Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '.',
                    kommentar: '',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                    bmk: '=01+H01-227TA1',
                    kommentar: 'Rührwerk Waage 9',
                    sollwertAuto: 'VMI3240DB220DBW526',
                    sollwert: 'VMI3240DB29DBW48',//
                    istwert: 'VMI3240DB29DBW34',//
                    komponente: {
                        nummer: 'VMI3240DB220DBD452',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB29DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile10Ruehrwerke = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-228TA1',
                    kommentar: 'Rührwerk Waage 10',
                    sollwertAuto: 'VMI3240DB220DBW528',
                    sollwert: 'VMI3240DB30DBW48',//
                    istwert: 'VMI3240DB30DBW34',//
                    komponente: {
                        nummer: 'VMI3240DB220DBD456',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB30DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
               
                // Kneterantriebe
                self.aliasNameByteZeile1Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-229TA1',
                    kommentar: 'Vormischschnecke',
                    sollwertAuto: 'VMI3240DB220DBW340',
                    sollwert: 'VMI3240DB41DBW18',
                    istwert: 'VMI3240DB41DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW380',
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
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB41DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-229TA5',
                    kommentar: 'Vormischhebeschnecke',
                    sollwertAuto: 'VMI3240DB220DBW342',
                    sollwert: 'VMI3240DB42DBW18',
                    istwert: 'VMI3240DB42DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW382',
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
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB42DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-229TA1',
                    kommentar: 'Vormischschnecke 3',
                    sollwertAuto: 'VMI3240DB220DBW410',
                    sollwert: 'VMI3240DB43DBW18',
                    istwert: 'VMI3240DB43DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220INT466',
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
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-241TA5',
                    kommentar: 'Vorkneter Knetschnecke',
                    sollwertAuto: 'VMI3240DB220DBW320',
                    sollwert: 'VMI3240DB44DBW18',
                    istwert: 'VMI3240DB44DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW360',
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
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB44DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-241TA1',
                    kommentar: 'Vorkneter Knetflügel',
                    sollwertAuto: 'VMI3240DB220DBW322',
                    sollwert: 'VMI3240DB43DBW18',
                    istwert: 'VMI3240DB43DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW362',
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
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB43DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-250TA1',
                    kommentar: 'Hauptkneter',
                    sollwertAuto: 'VMI3240DB220DBW324',
                    sollwert: 'VMI3240DB45DBW18',
                    istwert: 'VMI3240DB45DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW364',
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
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB45DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile7Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-20QA5',
                    kommentar: 'Massensperre Kneter',
                    sollwertAuto: '',
                    sollwert: 'VMI3240DB220DBW404',
                    istwert: 'VMI3240DB45DBW44',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: false
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: true
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB45DBB22',
                        sichtbar: true
                    },
                    format: '0,0',
                    einheit: 'mm'
                };
                self.aliasNameByteZeile8Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-20QA5',
                    kommentar: 'Guillotine',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile9Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-20QA1',
                    kommentar: 'Schwenkmotor',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
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
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile10Kneter = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-20QA5',
                    kommentar: 'Pumpe Wasserkühlung',
                    sollwertAuto: '',
                    sollwert: '',
                    istwert: '',
                    komponente: {
                        nummer: '',
                    },
                    steigung: '',
                    lblState: {
                        lblTextDefault: 'Regler in Betrieb',
                        lblText1: 'Regler gestoppt',
                        lblText2: '',
                        lblText3: '',
                        cssTextDefault: '',
                        cssText1: '',
                        cssText2: '',
                        cssText3: '',
                        cssDefault: 'ccw-bg-success',
                        css1: 'ccw-bg-default',
                        css2: '',
                        css3: '',
                        signalName: 'VMI3240DB23DBX330',
                        sichtbar: true                        
                    },
                    btnHandAuto: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB23DBB32',
                        sichtbar: true
                    },
                    format: '0,0',
                    einheit: 'mm'
                };
                // Abfuhrbänder                                                                                                                                                                                                             
                self.aliasNameByteZeile1Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-230TA1',
                    kommentar: 'Abfuhrband 1 - mobil',
                    sollwertAuto: 'VMI3240DB220DBW326',
                    sollwert: 'VMI3240DB48DBW18',
                    istwert: 'VMI3240DB48DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW366',
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
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB48DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile2Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-230TA5',
                    kommentar: 'Abfuhrband 2',
                    sollwertAuto: 'VMI3240DB220DBW328',
                    sollwert: 'VMI3240DB49DBW18',
                    istwert: 'VMI3240DB49DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW368',
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
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB49DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile3Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-231TA1',
                    kommentar: 'Abfuhrband 3',
                    sollwertAuto: 'VMI3240DB220DBW330',
                    sollwert: 'VMI3240DB50DBW18',
                    istwert: 'VMI3240DB50DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW370',
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
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB50DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile4Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-231TA5',
                    kommentar: 'Abfuhrband 4',
                    sollwertAuto: 'VMI3240DB220DBW332',
                    sollwert: 'VMI3240DB51DBW18',
                    istwert: 'VMI3240DB51DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW372',
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
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB51DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile5Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-232TA1',
                    kommentar: 'Abfuhrband 5',
                    sollwertAuto: 'VMI3240DB220DBW334',
                    sollwert: 'VMI3240DB52DBW18',
                    istwert: 'VMI3240DB52DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW374',
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
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB52DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile6Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-232TA5',
                    kommentar: 'Abfuhrband 6',
                    sollwertAuto: 'VMI3240DB220DBW336',
                    sollwert: 'VMI3240DB53DBW18',
                    istwert: 'VMI3240DB53DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW376',
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
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB53DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                self.aliasNameByteZeile7Baender = {
                    cssReiheRahmen: 'jj',
                    bmk: '=01+H01-232TA5',
                    kommentar: 'Abfuhrband 7',
                    sollwertAuto: 'VMI3240DB220DBW336',
                    sollwert: 'VMI3240DB54DBW18',
                    istwert: 'VMI3240DB54DBW4',
                    komponente: {
                        nummer: '',
                    },
                    steigung: 'VMI3240DB220DBW378',
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
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: true
                    },
                    btnByteEin: {
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: true
                    },
                    btnEinByteLinks: {
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: false
                    },
                    btnEinByteRechts: {
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: false
                    },
                    btnAus: {
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: true
                    },
                    lblByteError: {
                        signalName: 'VMI3240DB54DBB2',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'
                };
                                                
                //Anfang Funktion erzeugeZeilen() für mehrere Antriebe zeilen
                self.erzeugeZeilenByte = function (strukturByte) {
                    var self = this;
                    var cssTrRahmen = '';
                    var bmk = strukturByte.bmk;
                    var kommentar = strukturByte.kommentar;
                    // var mySignal = ((strukturByte.sollwertAuto !== undefined) && (strukturByte.sollwertAuto.length > 0)) ? strukturByte.sollwertAuto : 'Local Second';
                    var sollwertAuto = self.connector.getSignal(strukturByte.sollwertAuto);
                    // mySignal = ((strukturByte.sollwert !== undefined) && (strukturByte.sollwert.length > 0)) ? strukturByte.sollwert : 'Local Second';
                    var sollwert = self.connector.getSignal(strukturByte.sollwert);
                    // mySignal = ((strukturByte.istwert !== undefined) && (strukturByte.istwert.length > 0)) ? strukturByte.istwert : 'Local Second';
                    var istwert = self.connector.getSignal(strukturByte.istwert);
                    // mySignal = ((strukturByte.steigung !== undefined) && (strukturByte.steigung.length > 0)) ? strukturByte.steigung : 'Local Second';
                    var steigung = self.connector.getSignal(strukturByte.steigung);
                    var sichtbarSollAuto = (strukturByte.sollwertAuto.length > 0) ? true : false;
                    var sichtbarSoll = (strukturByte.sollwert.length > 0) ? true : false;
                    var sichtbarIst = (strukturByte.istwert.length > 0) ? true : false;
                    var sichtbarSteigung = (strukturByte.steigung.length > 0) ? true : false;

                    var komponente = ko.computed(function () {
                        var signal = self.connector.getSignal(strukturByte.komponente.nummer);
                        var value = signal.value;
                        return {
                            newValue: value()
                        };
                    }, self);
                    var lblState = ko.computed(function () {
                        var css = strukturByte.lblState.cssTextDefault;
                        var sichtbar = strukturByte.lblState.sichtbar;
                        if (sichtbar == true) {
                            var sichtbar = strukturByte.lblState.sichtbar;
                            css = strukturByte.lblState.cssDefault;
                            var lblState = strukturByte.lblState.lblTextDefault;
                            var signal = self.connector.getSignal(strukturByte.lblState.signalName);
                            var value = signal.value;
                            if (value() != 0) {
                                css = strukturByte.lblState.css1;
                                lblState = strukturByte.lblState.lblText1;
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

                        var freigabe = self.userFreigabe; //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
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
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            bmk: bmk,
                            kommentar: kommentar,
                            sollwertAuto: sollwertAuto,
                            sollwert: sollwert,
                            istwert: istwert,
                            steigung: steigung,
                            sichtbarSollAuto: sichtbarSollAuto,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            sichtbarSteigung: sichtbarSteigung,
                            einheit: einheit,
                            freigabe: freigabe,
                            format: format, //'0,0.[0]'
                            komponente: komponente,
                            lblState: lblState,
                            lblByteError: lblByteError,
                            btnHandAuto: btnHandAuto,
                            btnByteEin: btnByteEin,
                            btnEinByteLinks: btnEinByteLinks,
                            btnEinByteRechts: btnEinByteRechts,
                            btnAus: btnAus
                        };
                    };
                };
                //#region Zeilen Erzeugen für Antriebe
                self.zeile1Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile1Dosieren);
                self.zeile2Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile2Dosieren);
                self.zeile3Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile3Dosieren);
                self.zeile4Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile4Dosieren);
                self.zeile5Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile5Dosieren);
                self.zeile6Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile6Dosieren);
                self.zeile7Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile7Dosieren);
                self.zeile8Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile8Dosieren);
                self.zeile9Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile9Dosieren);
                self.zeile10Dosieren = self.erzeugeZeilenByte(self.aliasNameByteZeile10Dosieren);

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

                self.zeile1Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile1Kneter);
                self.zeile2Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile2Kneter);
                // self.zeile3Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile3Kneter);
                self.zeile4Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile4Kneter);
                self.zeile5Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile5Kneter);
                self.zeile6Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile6Kneter);
                self.zeile7Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile7Kneter);
                self.zeile8Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile8Kneter);
                self.zeile9Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile9Kneter);
                self.zeile10Kneter = self.erzeugeZeilenByte(self.aliasNameByteZeile10Kneter);

                self.zeile1Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile1Baender);
                self.zeile2Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile2Baender);
                self.zeile3Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile3Baender);
                self.zeile4Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile4Baender);
                self.zeile5Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile5Baender);
                self.zeile6Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile6Baender);
                self.zeile7Baender = self.erzeugeZeilenByte(self.aliasNameByteZeile7Baender);


                self.antriebeDosieren = ko.observableArray([
                    self.zeile1Dosieren,
                    self.zeile2Dosieren,
                    self.zeile3Dosieren,
                    self.zeile4Dosieren,
                    self.zeile5Dosieren,
                    self.zeile6Dosieren,
                    self.zeile7Dosieren,
                    self.zeile8Dosieren,
                    self.zeile9Dosieren,
                    self.zeile10Dosieren,
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
                    self.zeile10Ruehrwerke,
                ]);
                self.antriebeKneter = ko.observableArray([
                    self.zeile1Kneter,
                    self.zeile2Kneter,
                    // self.zeile3Kneter,
                    self.zeile4Kneter,
                    self.zeile5Kneter,
                    self.zeile6Kneter,
                    self.zeile7Kneter,
                    // self.zeile9Kneter,
                    // self.zeile8Kneter,
                    self.zeile10Kneter,
                ]);
                self.antriebeBaender = ko.observableArray([
                    self.zeile1Baender,
                    self.zeile2Baender,
                    self.zeile3Baender,
                    self.zeile4Baender,
                    self.zeile5Baender,
                    self.zeile6Baender,
                    self.zeile7Baender,
                ]);
                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);


                self.rezeptnummer = self.connector.getSignal('SahneDB461DBD0');
                self.rezeptName = self.connector.getSignal('Virtuell3161').value;

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
            detached: function () {
                var self = this;
                self.connector.unregisterSignals(self.restzeit_min);
                self.connector.unregisterSignals(self.restzeit_sek);
                console.info('Detaches Signal');
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
                        // var value = self.connector.getSignal(signalName).value;
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
                        toastr.error('Ein / Ausschalten nur im Handbetrieb möglich !!!');
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
                        toastr.error('Ein / Ausschalten nur im Handbetrieb möglich !!!');
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
                        toastr.error('Ein / Ausschalten nur im Handbetrieb möglich !!!');
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
                            values[signalName] = (0x01) ^ (value());
                            self.connector.writeSignals(values);
                        }
                        if ((EinR == 0) && (EinL != 0)) {
                            values[signalName] = (0x04) ^ (value());
                            self.connector.writeSignals(values);
                        }
                        if ((EinR != 0) && (EinL != 0)) {
                            values[signalName] = (0x05) ^ (value());
                            self.connector.writeSignals(values);
                        }
                    } else {
                        toastr.error('Ein / Ausschalten nur im Handbetrieb möglich !!!');
                    }
                }
            },
            sendWerteZurSps: function () {
                var self = this;
                console.log('%cSend Werte zur SPS ', 'background:yellow');
                $('#myModal').modal('show');
                $('#lblModalHeaderBG').addClass('modal-warning');
                $('#lblModalHeader').text('Werte senden');
                $('#iconModalHeader').addClass('wf wf-upload');
                $('#lblModalBody').text('Werte zur Steuerung senden?');
                $('#modal-btn-Ok').on('click', function () {
                    $('#myModal').modal('hide');
                    var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
                    var len = bufferSignale.length;
                    var i;
                    for (i = 0; i < len; i++) {
                        console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
                    }
                    self.connector.writeSignalsFromBuffer();
                    toastr.success('Send-Werte geschrieben');
                });
            },
        };
        return ctor;
    });