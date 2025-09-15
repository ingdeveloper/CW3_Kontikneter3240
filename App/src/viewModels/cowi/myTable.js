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

                self.aliasNameZeile1 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 1',
                    sollwert: 'VMI3210DB21DBW18',
                    istwert: 'VMI3210DB21DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB21DBX21',
                        signalNameStoer1: 'VMI3210DB21DBX25',
                        signalNameStoer2: 'VMI3210DB21DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB21DBX21',
                        signalNameEinR: 'VMI3210DB21DBX20',
                        signalNameEinL: 'VMI3210DB21DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB21DBX21',
                        signalNameEinR: 'VMI3210DB21DBX20',
                        signalNameEinL: 'VMI3210DB21DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile2 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 2',
                    sollwert: 'VMI3210DB22DBW18',
                    istwert: 'VMI3210DB22DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB22DBX21',
                        signalNameStoer1: 'VMI3210DB22DBX25',
                        signalNameStoer2: 'VMI3210DB22DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB22DBX21',
                        signalNameEinR: 'VMI3210DB22DBX20',
                        signalNameEinL: 'VMI3210DB22DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB22DBX21',
                        signalNameEinR: 'VMI3210DB22DBX20',
                        signalNameEinL: 'VMI3210DB22DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile3 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 3',
                    sollwert: 'VMI3210DB23DBW18',
                    istwert: 'VMI3210DB23DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB23DBX21',
                        signalNameStoer1: 'VMI3210DB23DBX25',
                        signalNameStoer2: 'VMI3210DB23DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB23DBX21',
                        signalNameEinR: 'VMI3210DB23DBX20',
                        signalNameEinL: 'VMI3210DB23DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB23DBX21',
                        signalNameEinR: 'VMI3210DB23DBX20',
                        signalNameEinL: 'VMI3210DB23DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile4 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 4',
                    sollwert: 'VMI3210DB24DBW18',
                    istwert: 'VMI3210DB24DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB24DBX21',
                        signalNameStoer1: 'VMI3210DB24DBX25',
                        signalNameStoer2: 'VMI3210DB24DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB24DBX21',
                        signalNameEinR: 'VMI3210DB24DBX20',
                        signalNameEinL: 'VMI3210DB24DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB24DBX21',
                        signalNameEinR: 'VMI3210DB24DBX20',
                        signalNameEinL: 'VMI3210DB24DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile5 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 5',
                    sollwert: 'VMI3210DB25DBW18',
                    istwert: 'VMI3210DB25DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB25DBX21',
                        signalNameStoer1: 'VMI3210DB25DBX25',
                        signalNameStoer2: 'VMI3210DB25DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB25DBX21',
                        signalNameEinR: 'VMI3210DB25DBX20',
                        signalNameEinL: 'VMI3210DB25DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB25DBX21',
                        signalNameEinR: 'VMI3210DB25DBX20',
                        signalNameEinL: 'VMI3210DB25DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile6 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 6',
                    sollwert: 'VMI3210DB26DBW18',
                    istwert: 'VMI3210DB26DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB26DBX21',
                        signalNameStoer1: 'VMI3210DB26DBX25',
                        signalNameStoer2: 'VMI3210DB26DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB26DBX21',
                        signalNameEinR: 'VMI3210DB26DBX20',
                        signalNameEinL: 'VMI3210DB26DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB26DBX21',
                        signalNameEinR: 'VMI3210DB26DBX20',
                        signalNameEinL: 'VMI3210DB26DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile7 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 7',
                    sollwert: 'VMI3210DB27DBW18',
                    istwert: 'VMI3210DB27DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB27DBX21',
                        signalNameStoer1: 'VMI3210DB27DBX25',
                        signalNameStoer2: 'VMI3210DB27DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB27DBX21',
                        signalNameEinR: 'VMI3210DB27DBX20',
                        signalNameEinL: 'VMI3210DB27DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB27DBX21',
                        signalNameEinR: 'VMI3210DB27DBX20',
                        signalNameEinL: 'VMI3210DB27DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile9 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 9',
                    sollwert: 'VMI3210DB29DBW18',
                    istwert: 'VMI3210DB29DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB29DBX21',
                        signalNameStoer1: 'VMI3210DB29DBX25',
                        signalNameStoer2: 'VMI3210DB29DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB29DBX21',
                        signalNameEinR: 'VMI3210DB29DBX20',
                        signalNameEinL: 'VMI3210DB29DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB29DBX21',
                        signalNameEinR: 'VMI3210DB29DBX20',
                        signalNameEinL: 'VMI3210DB29DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile10 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Dosierantrieb Waage 10',
                    sollwert: 'VMI3210DB30DBW18',
                    istwert: 'VMI3210DB30DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB30DBX21',
                        signalNameStoer1: 'VMI3210DB30DBX25',
                        signalNameStoer2: 'VMI3210DB30DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB30DBX21',
                        signalNameEinR: 'VMI3210DB30DBX20',
                        signalNameEinL: 'VMI3210DB30DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB30DBX21',
                        signalNameEinR: 'VMI3210DB30DBX20',
                        signalNameEinL: 'VMI3210DB30DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile11 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 1',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB21DBX321',
                        signalNameStoer1: 'VMI3210DB21DBX325',
                        signalNameStoer2: 'VMI3210DB21DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB21DBX321',
                        signalNameEinR: 'VMI3210DB21DBX320',
                        signalNameEinL: 'VMI3210DB21DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB21DBX321',
                        signalNameEinR: 'VMI3210DB21DBX320',
                        signalNameEinL: 'VMI3210DB21DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile12 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 2',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB22DBX321',
                        signalNameStoer1: 'VMI3210DB22DBX325',
                        signalNameStoer2: 'VMI3210DB22DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB22DBX321',
                        signalNameEinR: 'VMI3210DB22DBX320',
                        signalNameEinL: 'VMI3210DB22DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB22DBX321',
                        signalNameEinR: 'VMI3210DB22DBX320',
                        signalNameEinL: 'VMI3210DB22DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile14 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 4',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB24DBX321',
                        signalNameStoer1: 'VMI3210DB24DBX325',
                        signalNameStoer2: 'VMI3210DB24DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB24DBX321',
                        signalNameEinR: 'VMI3210DB24DBX320',
                        signalNameEinL: 'VMI3210DB24DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB24DBX321',
                        signalNameEinR: 'VMI3210DB24DBX320',
                        signalNameEinL: 'VMI3210DB24DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile15 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 5',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB25DBX321',
                        signalNameStoer1: 'VMI3210DB25DBX325',
                        signalNameStoer2: 'VMI3210DB25DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB25DBX321',
                        signalNameEinR: 'VMI3210DB25DBX320',
                        signalNameEinL: 'VMI3210DB25DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB25DBX321',
                        signalNameEinR: 'VMI3210DB25DBX320',
                        signalNameEinL: 'VMI3210DB25DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile17 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 7',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB27DBX321',
                        signalNameStoer1: 'VMI3210DB27DBX325',
                        signalNameStoer2: 'VMI3210DB27DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB27DBX321',
                        signalNameEinR: 'VMI3210DB27DBX320',
                        signalNameEinL: 'VMI3210DB27DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB27DBX321',
                        signalNameEinR: 'VMI3210DB27DBX320',
                        signalNameEinL: 'VMI3210DB27DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };   
                self.aliasNameZeile19 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 9',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB29DBX321',
                        signalNameStoer1: 'VMI3210DB29DBX325',
                        signalNameStoer2: 'VMI3210DB29DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB29DBX321',
                        signalNameEinR: 'VMI3210DB29DBX320',
                        signalNameEinL: 'VMI3210DB29DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB29DBX321',
                        signalNameEinR: 'VMI3210DB29DBX320',
                        signalNameEinL: 'VMI3210DB29DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };   
                self.aliasNameZeile20 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Rührwerk Waage 10',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB30DBX321',
                        signalNameStoer1: 'VMI3210DB30DBX325',
                        signalNameStoer2: 'VMI3210DB30DBX326',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB30DBX321',
                        signalNameEinR: 'VMI3210DB30DBX320',
                        signalNameEinL: 'VMI3210DB30DBX322',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB30DBX321',
                        signalNameEinR: 'VMI3210DB30DBX320',
                        signalNameEinL: 'VMI3210DB30DBX322',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };  
                self.aliasNameZeile21 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 1',
                    sollwert: 'VMI3210DB48DBW18',
                    istwert: 'VMI3210DB48DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB48DBX21',
                        signalNameStoer1: 'VMI3210DB48DBX25',
                        signalNameStoer2: 'VMI3210DB48DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB48DBX21',
                        signalNameEinR: 'VMI3210DB48DBX20',
                        signalNameEinL: 'VMI3210DB48DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB48DBX21',
                        signalNameEinR: 'VMI3210DB48DBX20',
                        signalNameEinL: 'VMI3210DB48DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                }; 
                self.aliasNameZeile22 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 2',
                    sollwert: 'VMI3210DB49DBW18',
                    istwert: 'VMI3210DB49DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB49DBX21',
                        signalNameStoer1: 'VMI3210DB49DBX25',
                        signalNameStoer2: 'VMI3210DB49DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB49DBX21',
                        signalNameEinR: 'VMI3210DB49DBX20',
                        signalNameEinL: 'VMI3210DB49DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB49DBX21',
                        signalNameEinR: 'VMI3210DB49DBX20',
                        signalNameEinL: 'VMI3210DB49DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };  
                self.aliasNameZeile23 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 3',
                    sollwert: 'VMI3210DB50DBW18',
                    istwert: 'VMI3210DB50DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB50DBX21',
                        signalNameStoer1: 'VMI3210DB50DBX25',
                        signalNameStoer2: 'VMI3210DB50DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB50DBX21',
                        signalNameEinR: 'VMI3210DB50DBX20',
                        signalNameEinL: 'VMI3210DB50DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB50DBX21',
                        signalNameEinR: 'VMI3210DB50DBX20',
                        signalNameEinL: 'VMI3210DB50DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                }; 
                self.aliasNameZeile24 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 4',
                    sollwert: 'VMI3210DB51DBW18',
                    istwert: 'VMI3210DB51DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB51DBX21',
                        signalNameStoer1: 'VMI3210DB51DBX25',
                        signalNameStoer2: 'VMI3210DB51DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB51DBX21',
                        signalNameEinR: 'VMI3210DB51DBX20',
                        signalNameEinL: 'VMI3210DB51DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB51DBX21',
                        signalNameEinR: 'VMI3210DB51DBX20',
                        signalNameEinL: 'VMI3210DB51DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };     
                self.aliasNameZeile25 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 5',
                    sollwert: 'VMI3210DB52DBW18',
                    istwert: 'VMI3210DB52DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB52DBX21',
                        signalNameStoer1: 'VMI3210DB52DBX25',
                        signalNameStoer2: 'VMI3210DB52DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB52DBX21',
                        signalNameEinR: 'VMI3210DB52DBX20',
                        signalNameEinL: 'VMI3210DB52DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB52DBX21',
                        signalNameEinR: 'VMI3210DB52DBX20',
                        signalNameEinL: 'VMI3210DB52DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };    
                self.aliasNameZeile26 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Abfuhrband 6',
                    sollwert: 'VMI3210DB53DBW18',
                    istwert: 'VMI3210DB53DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB53DBX21',
                        signalNameStoer1: 'VMI3210DB53DBX25',
                        signalNameStoer2: 'VMI3210DB53DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB53DBX21',
                        signalNameEinR: 'VMI3210DB53DBX20',
                        signalNameEinL: 'VMI3210DB53DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB53DBX21',
                        signalNameEinR: 'VMI3210DB53DBX20',
                        signalNameEinL: 'VMI3210DB53DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };  
                self.aliasNameZeile30 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Vormischschnecke 1',
                    sollwert: 'VMI3210DB41DBW18',
                    istwert: 'VMI3210DB41DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB41DBX21',
                        signalNameStoer1: 'VMI3210DB41DBX25',
                        signalNameStoer2: 'VMI3210DB41DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB41DBX21',
                        signalNameEinR: 'VMI3210DB41DBX20',
                        signalNameEinL: 'VMI3210DB41DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB41DBX21',
                        signalNameEinR: 'VMI3210DB41DBX20',
                        signalNameEinL: 'VMI3210DB41DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };
                self.aliasNameZeile31 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Vormischschnecke 2',
                    sollwert: 'VMI3210DB42DBW18',
                    istwert: 'VMI3210DB42DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB42DBX21',
                        signalNameStoer1: 'VMI3210DB42DBX25',
                        signalNameStoer2: 'VMI3210DB42DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB42DBX21',
                        signalNameEinR: 'VMI3210DB42DBX20',
                        signalNameEinL: 'VMI3210DB42DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB42DBX21',
                        signalNameEinR: 'VMI3210DB42DBX20',
                        signalNameEinL: 'VMI3210DB42DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };  
                self.aliasNameZeile32 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Vormischschnecke 2',
                    sollwert: 'VMI3210DB43DBW18',
                    istwert: 'VMI3210DB43DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB43DBX21',
                        signalNameStoer1: 'VMI3210DB43DBX25',
                        signalNameStoer2: 'VMI3210DB43DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB43DBX21',
                        signalNameEinR: 'VMI3210DB43DBX20',
                        signalNameEinL: 'VMI3210DB43DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB43DBX21',
                        signalNameEinR: 'VMI3210DB43DBX20',
                        signalNameEinL: 'VMI3210DB43DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };  
                self.aliasNameZeile33 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Vorkneter Knetschnecke',
                    sollwert: 'VMI3210DB44DBW18',
                    istwert: 'VMI3210DB44DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB44DBX21',
                        signalNameStoer1: 'VMI3210DB44DBX25',
                        signalNameStoer2: 'VMI3210DB44DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB44DBX21',
                        signalNameEinR: 'VMI3210DB44DBX20',
                        signalNameEinL: 'VMI3210DB44DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB44DBX21',
                        signalNameEinR: 'VMI3210DB44DBX20',
                        signalNameEinL: 'VMI3210DB44DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };   
                self.aliasNameZeile34 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Vorkneter Knetflügel',
                    sollwert: 'VMI3210DB45DBW18',
                    istwert: 'VMI3210DB45DBW4',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB45DBX21',
                        signalNameStoer1: 'VMI3210DB45DBX25',
                        signalNameStoer2: 'VMI3210DB45DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB45DBX21',
                        signalNameEinR: 'VMI3210DB45DBX20',
                        signalNameEinL: 'VMI3210DB45DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB45DBX21',
                        signalNameEinR: 'VMI3210DB45DBX20',
                        signalNameEinL: 'VMI3210DB45DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };   
                self.aliasNameZeile35 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Guillotine',
                    sollwert: '',
                    istwert: '',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB46DBX35',
                        signalNameStoer1: '',
                        signalNameStoer2: '',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB46DBX35',
                        signalNameEinR: 'VMI3210DB46DBX34',
                        signalNameEinL: '',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB46DBX35',
                        signalNameEinR: 'VMI3210DB46DBX34',
                        signalNameEinL: '',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };   
                self.aliasNameZeile36 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Umwälzpumpe Solekühlung',
                    sollwert: '',
                    istwert: '',
                    lblState:{
                        signalNameState: 'VMI3210DB23DBX330',
                        sichtbar: true
                    },
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB23DBX321',
                        signalNameStoer1: 'VMI3210DB23DBX326',
                        signalNameStoer2: '',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB23DBX321',
                        signalNameEinR: 'VMI3210DB23DBX320',
                        signalNameEinL: '',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB23DBX321',
                        signalNameEinR: 'VMI3210DB23DBX321',
                        signalNameEinL: '',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };

                self.aliasNameZeile37 = {
                    cssReiheRahmen: 'jj',
                    bmk: '=H01+xxxUX',
                    kommentar: 'Massensperre Kneter',
                    sollwert: 'VMI3210DB220DBW404',
                    istwert: 'VMI3210DB46DBW44',
                    btnHandAuto: {
                        signalNameHand:   'VMI3210DB46DBX21',
                        signalNameStoer1: 'VMI3210DB46DBX25',
                        signalNameStoer2: 'VMI3210DB46DBX26',
                        sichtbar: true
                    },
                    btnEin: {
                        signalNameHand: 'VMI3210DB45DBX21',
                        signalNameEinR: 'VMI3210DB45DBX20',
                        signalNameEinL: 'VMI3210DB45DBX22',
                        sichtbar: true
                    },
                    btnAus: {
                        signalNameHand: 'VMI3210DB45DBX21',
                        signalNameEinR: 'VMI3210DB45DBX20',
                        signalNameEinL: 'VMI3210DB45DBX22',
                        sichtbar: true
                    },
                    format: '0,0.0',
                    einheit: '%'

                };                                                                                                                                                                                                        
                //Anfang Funktion erzeugeZeilen() für Hand/Auto-Betrieb Antriebe
                self.erzeugeZeilen = function (struktur) {
                    //Funktion für eine Zeile #####################################################
                    var self        = this;
                    var cssTrRahmen = ''; //struktur.cssReiheRahmen !== undefined ? struktur.cssReiheRahmen : '';  //wenn cssReiheRahmen vorhanden ist, dann den Wert übernehmen
                    var bmk         = struktur.bmk;
                    var kommentar   = struktur.kommentar;
                    var sollwert    = self.connector.getSignal(struktur.sollwert);
                    var istwert     = self.connector.getSignal(struktur.istwert);
                    var status      = self.connector.getSignal(struktur.state);

                    var lblState = ko.pureComputed(function () {
                        var value;
                        var css              = 'btn-default';
                        var lblText          = '';
                        var signalState      = self.connector.getSignal(struktur.lblState.signalNameState);
                        var signalNameState  = signalState.signalName();
                        var state             = signalState.value();

                        if ((state & 1) > 0) {
                            css = 'label-success';
                            lblTxt = 'Regler in Automatik';
                        }else{
                            css = 'label-danger';
                            lblTxt = 'Regler ist Aus';
                        }
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = struktur.btnHandAuto.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalNameState: signalNameState,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: lblTxt
                        };
                    }, self);

                    var btnHandAuto = ko.pureComputed(function () {
                        var value;
                        var css              = 'btn-default';
                        var btnTxt           = '';
                        var signalHand       = self.connector.getSignal(struktur.btnHandAuto.signalNameHand);
                        var signalStoer1     = self.connector.getSignal(struktur.btnHandAuto.signalNameStoer1);
                        var signalStoer2     = self.connector.getSignal(struktur.btnHandAuto.signalNameStoer2);
                        var signalNameHand   = signalHand.signalName();
                        var signalNameStoer1 = signalStoer1.signalName();
                        var signalNameStoer2 = signalStoer2.signalName();
                        var Hand             = signalHand.value();
                        var Stoer            = (signalStoer1.value() || signalStoer2.value());
                        console.log(signalStoer1.value());
                        if ((Stoer & 1) > 0) {
                            console.log(Stoer);
                            console.log("%c-----------------------------", "background:yellow");
                            css = 'btn-danger';
                            if (Hand != 0) {
                                btnTxt = 'Hand';
                            } else {
                                btnTxt = 'Auto';
                            }
                        }else{
                            if (Hand != 0) {
                                css    = 'btn-warning';
                                btnTxt = 'Hand';
                            } else {
                                css    = 'btn-success';
                                btnTxt = 'Auto';
                            }
                        }
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = struktur.btnHandAuto.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalNameHand: signalNameHand,
                            signalNameStoer1: signalNameStoer1,
                            signalNameStoer2: signalNameStoer2,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnEin = ko.pureComputed(function () {
                        var value;
                        var css            = 'btn-default';
                        var signalHand     = self.connector.getSignal(struktur.btnEin.signalNameHand);
                        var signalEinR     = self.connector.getSignal(struktur.btnEin.signalNameEinR);
                        var signalEinL     = self.connector.getSignal(struktur.btnEin.signalNameEinL);
                        var signalNameHand = signalHand.signalName();
                        var signalNameEinR = signalEinR.signalName();
                        var signalNameEinL = signalEinL.signalName();
                        var Hand           = signalHand.value();
                        var Ein            = (signalEinR.value() || signalEinL.value());

                        if ((Ein & 1) > 0) {
                            css = 'btn-success';
                        }else{
                            css = 'btn-default';
                        }
                        var freigabe = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar = struktur.btnEin.sichtbar;
                        return {
                            newValue: value,
                            newCss: css,
                            signalNameHand: signalNameHand,
                            signalNameEinR: signalNameEinR,
                            signalNameEinL: signalNameEinL,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                        };
                    }, self);

                    var btnAus = ko.pureComputed(function () {
                        var value;
                        var signalHand     = self.connector.getSignal(struktur.btnAus.signalNameHand);
                        var signalEinR     = self.connector.getSignal(struktur.btnAus.signalNameEinR);
                        var signalEinL     = self.connector.getSignal(struktur.btnAus.signalNameEinL);
                        var signalNameHand = signalHand.signalName();
                        var signalNameEinR = signalEinR.signalName();
                        var signalNameEinL = signalEinL.signalName();
                        var freigabe       = self.userFreigabe(); //Enable, wenn Auswahlfeld geändert und Berechtigung vorhanden ist
                        var sichtbar       = struktur.btnAus.sichtbar;
                        return {
                            newValue: value,
                            signalNameHand: signalNameHand,
                            signalNameEinR: signalNameEinR,
                            signalNameEinL: signalNameEinL,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                        };
                    }, self)

                    var einheit = struktur.einheit;
                    var format = struktur.format;

                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            cssTrRahmen: cssTrRahmen,
                            bmk: bmk,
                            kommentar: kommentar,
                            sollwert: sollwert,
                            istwert: istwert,
                            einheit: einheit,
                            format: format, //'0,0.[0]'
                            btnHandAuto: btnHandAuto,
                            btnEin: btnEin,
                            btnAus: btnAus
                        };
                    };

                }
                //Ende erzeugeZeilen ##########################################################################

                //#region Zeilen erzeugen Antriebe
                // Dosierantriebe
                self.Zeile1 = self.erzeugeZeilen(self.aliasNameZeile1);
                self.Zeile2 = self.erzeugeZeilen(self.aliasNameZeile2);
                self.Zeile3 = self.erzeugeZeilen(self.aliasNameZeile3);
                self.Zeile4 = self.erzeugeZeilen(self.aliasNameZeile4);
                self.Zeile5 = self.erzeugeZeilen(self.aliasNameZeile5);
                self.Zeile6 = self.erzeugeZeilen(self.aliasNameZeile6);
                self.Zeile7 = self.erzeugeZeilen(self.aliasNameZeile7);

                self.Zeile9 = self.erzeugeZeilen(self.aliasNameZeile9);
                self.Zeile10 = self.erzeugeZeilen(self.aliasNameZeile10);
                // Rührwerke
                self.Zeile11 = self.erzeugeZeilen(self.aliasNameZeile11);
                self.Zeile12 = self.erzeugeZeilen(self.aliasNameZeile12);
                
                self.Zeile14 = self.erzeugeZeilen(self.aliasNameZeile14);
                self.Zeile15 = self.erzeugeZeilen(self.aliasNameZeile15);
                
                self.Zeile17 = self.erzeugeZeilen(self.aliasNameZeile17);

                self.Zeile19 = self.erzeugeZeilen(self.aliasNameZeile19);
                self.Zeile20 = self.erzeugeZeilen(self.aliasNameZeile20);
                // Abfuhrbänder
                self.Zeile21 = self.erzeugeZeilen(self.aliasNameZeile21);
                self.Zeile22 = self.erzeugeZeilen(self.aliasNameZeile22);
                self.Zeile23 = self.erzeugeZeilen(self.aliasNameZeile23);
                self.Zeile24 = self.erzeugeZeilen(self.aliasNameZeile24);
                self.Zeile25 = self.erzeugeZeilen(self.aliasNameZeile25);
                self.Zeile26 = self.erzeugeZeilen(self.aliasNameZeile26);
                // Kneter Schnecken etc
                self.Zeile31 = self.erzeugeZeilen(self.aliasNameZeile31);
                self.Zeile32 = self.erzeugeZeilen(self.aliasNameZeile32);
                self.Zeile33 = self.erzeugeZeilen(self.aliasNameZeile33);
                self.Zeile34 = self.erzeugeZeilen(self.aliasNameZeile34);
                self.Zeile35 = self.erzeugeZeilen(self.aliasNameZeile35);
                self.Zeile36 = self.erzeugeZeilen(self.aliasNameZeile36);
                self.Zeile37 = self.erzeugeZeilen(self.aliasNameZeile37);
                console.log("------------------------------------------hallo");
                self.dosierAntriebe = ko.observableArray([
                    self.Zeile1,
                    self.Zeile2,
                    self.Zeile3,
                    self.Zeile4,
                    self.Zeile5,
                    self.Zeile6,
                    self.Zeile7,

                    self.Zeile9,
                    self.Zeile10
                ]);
                console.log("Array Dosierantriebe" + self.dosierAntriebe);
                self.ruehrAntriebe = ko.observableArray([
                    self.Zeile11,
                    self.Zeile12,

                    self.Zeile14,
                    self.Zeile15,

                    self.Zeile17,

                    self.Zeile19,
                    self.Zeile20
                ]);
                console.log("Array Rührantriebe" + self.ruehrAntriebe);
                self.baenderAntriebe = ko.observableArray([
                    self.Zeile21,
                    self.Zeile22,
                    self.Zeile23,
                    self.Zeile24,
                    self.Zeile25,
                    self.Zeile26
                ]);
                console.log("Array Abfuhrbaender" + self.baenderAntriebe);                
                self.baenderAntriebe = ko.observableArray([
                    self.Zeile21,
                    self.Zeile22,
                    self.Zeile23,
                    self.Zeile24,
                    self.Zeile25,
                    self.Zeile26
                ]);
                console.log("Array Abfuhrbaender" + self.baenderAntriebe);
                self.kneterAntriebe = ko.observableArray([
                    self.Zeile31,
                    self.Zeile32,
                    self.Zeile33,
                    self.Zeile34,
                    self.Zeile35,
                    self.Zeile36,
                    self.Zeile37
                ]);
                console.log("Array Abfuhrbaender" + self.baenderAntriebe);
                //#endregion

                //---- Input-Felder bei Fehler-Hinweis für den Bediener einfärben
                self.sollInputMarkieren = ko.observableArray([
                    false, true, false, false, false, false, false, false, false, false, false, false
                ]);

                self.anzeigeHandAuto = ko.pureComputed(function () {
                    //var self = this;
                    var css = 'ccw-bg-transparent';
                    var text = 'AUS';
                    //console.log('%c### cssReferenzBtn3 = ' + self.zeile1().station_led(), 'background:yellow');
                    var hand = self.connector.getSignal('SahneDB1630DBX10').value(); //Servo Refernez Okay 
                    var auto = self.connector.getSignal('SahneDB1630DBX11').value(); //Servo Aktiviert 
                    var stoerung = self.connector.getSignal('SahneDB1630DBX16').value(); //Servo Refernez Okay

                    if (stoerung & 1) {
                        css = 'bg-danger';
                        text = 'Störung';
                    } else if (hand & 1) {
                        css = 'ccw-bg-yellow';
                        text = 'Hand EIN';
                    } else if (auto & 1) {
                        css = 'ccw-bg-lime';
                        text = 'Auto EIN';
                    }
                    return {
                        newCss: css,
                        text: text
                    };
                });

                self.handzugabeStoerung = ko.pureComputed(function () {

                    var css = 'ccw-bg-transparent';
                    var text = '&nbsp;';

                    var handzugabeStoerung = self.connector.getSignal('SahneDB1630DBX14').value();

                    if (handzugabeStoerung & 1) {
                        css = 'bg-danger';
                        text = 'Handzugabe fehlt';
                    }
                    return {
                        newCss: css,
                        text: text
                    };
                });

                self.restlaufzeit = ko.pureComputed(function () {

                    var css = 'ccw-bg-transparent';

                    var restlaufzeitMinuten = self.connector.getSignal('SahneDB1630DBB4').value();
                    var restlaufzeitSekunden = self.connector.getSignal('SahneDB1630DBB5').value();

                    if ((restlaufzeitMinuten > 0) || (restlaufzeitSekunden != 0)) {
                        text = 'Restlaufzeit: ' + restlaufzeitMinuten + ' m ' + restlaufzeitSekunden + ' s';
                    } else {
                        text = 'Programm nicht gestartet';
                    }
                    return {
                        newCss: css,
                        text: text
                    };
                });

                self.automatikAktiv = ko.pureComputed(function () {

                    var css = 'ccw-bg-transparent';
                    var text = '&nbsp';
                    var programmLaeuft = self.connector.getSignal('SahneDB1630DBX13').value();
                    var automatikGestartet = self.connector.getSignal('SahneDB1630DBX12').value();

                    if (programmLaeuft & 1) {
                        text = 'Programm läuft';
                        css = 'ccw-bg-lime';
                    } else if (automatikGestartet & 1) {
                        text = 'Auto. gestartet';
                        css = 'bg-info';
                    }
                    return {
                        newCss: css,
                        text: text
                    };
                });

                self.komponenteFehlt = ko.pureComputed(function () {

                    var css = 'ccw-bg-transparent';
                    var text = '&nbsp;';

                    var kompoStoer = self.connector.getSignal('SahneDB1630DBX15').value();

                    if (kompoStoer & 1) {
                        css = 'ccw-bg-yellow';
                        text = 'Komponente fehlt';
                    }
                    return {
                        newCss: css,
                        text: text
                    };
                });

                self.bargraphValue = self.connector.getSignal('SahneDB1630DBB6').value; //Prozent 0-100%

                self.text = ko.observable('');
                //self.ergebnisRezeptDB = ko.observable('-----');

                self.queryStringArchiv = ko.observable(''); //queryString für Aufruf von Logliste-Archiv

                self.rezeptData = []; //leeres Array erzeugen
                self.werteUngleich = false;

                return self.connector.getOnlineUpdates().fail(self.connector.handleError(self));
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
                    })
                    .fail(self.connector.handleError(self));
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
            setBtnValueHand: function (signalNameHand, signalNameStoer1, signalNameStoer2, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var valueHand   = self.connector.getSignal(signalNameHand).value;
                    var valueStoer1 = self.connector.getSignal(signalNameStoer1).value;
                    var valueStoer2 = self.connector.getSignal(signalNameStoer2).value;
                    var Hand        = valueHand();
                    var Stoer1      = valueStoer1();
                    var Stoer2      = valueStoer2();
                    var values      = {};
                    var setWert;

                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', 'Hand/Auto umschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {

                            if (dialogResult === 'ClosedOkay') {
                                
                                if (Hand != 0) {
                                    setWert = 0;
                                }else{
                                    setWert = 1;
                                }
                                values[signalNameHand] = setWert;
                                self.connector.writeSignals(values);
                            }
                        });
                }
            },
            setBtnValueEin: function (signalNameHand, signalNameEinR, signalNameEinL, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var valueHand = self.connector.getSignal(signalNameHand).value;
                    var valueEinR = self.connector.getSignal(signalNameEinR).value;
                    var valueEinL = self.connector.getSignal(signalNameEinL).value;
                    var Hand      = valueHand();
                    var EinR      = valueEinR();
                    var EinL      = valueEinL();
                    var values    = {};
                    
                    if (Hand != 0) {
                        if ((EinR == 0) && (EinL == 0)) {
                            dialog.show(
                                    new okCancelDialog('Ja', 'Nein', 'Im Handbetrieb einschalten?') //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                                )
                                .then(function (dialogResult) {

                                    if (dialogResult === 'ClosedOkay') {
                                        values[signalNameEinR] = 1; //Rechtslauf einschalten
                                        //values[signalNameEinL] = 1; //Linkslauf einschalten
                                        self.connector.writeSignals(values);
                                    }
                                });
                        }        
                    }else{
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }    
                }
            },
            setBtnValueAus: function (signalNameHand, signalNameEinR, signalNameEinL, obj, event) {
                var self = this;
                if (event.originalEvent) {
                    var valueHand = self.connector.getSignal(signalNameHand).value;
                    var valueEinR = self.connector.getSignal(signalNameEinR).value;
                    var valueEinL = self.connector.getSignal(signalNameEinL).value;
                    var Hand      = valueHand();
                    var EinR      = valueEinR();
                    var EinL      = valueEinL();
                    var values    = {};
                    
                    if (Hand != 0) {
                        values[signalNameEinR] = 0;
                        values[signalNameEinL] = 0;
                        self.connector.writeSignals(values);
                    }else{
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
        }

        return ctor;
    });