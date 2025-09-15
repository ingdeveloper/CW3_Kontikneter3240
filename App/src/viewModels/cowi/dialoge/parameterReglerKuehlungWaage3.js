define(['../../../services/connector', 
        'plugins/dialog',
        '../../../services/usersService',
        '../../../components/services/secured.service',
        'src/viewmodels/cowi/dialoge/cwDialog'
    ],
    function (signalsConnector, dialog, usersService, securedService, okCancelDialog) {
        var dialog = require('plugins/dialog');

        var ctor = function (waageCSS) {
            var self = this;
            self.cssWaage = waageCSS;
            self.connector = new signalsConnector();

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
            //---- Sendebutton blinken lassen --------------------------------------------
            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);
            self.reglerWasser = self.connector.getSignal('VMI3240DB23DBX330').value; //Teigtemperaturregler (0=Ein, 1=Aus)   
            self.reglerWasserEinAus = ko.computed(function() {
                var self = this;
                var css1 = 'bg-default'
                var css2 = 'bg-default'
                var vorwahl = self.reglerWasser();
                if (vorwahl !== null) {
                    if (vorwahl == 0) {
                        css1 = 'btn-default';
                        css2 = 'btn-success';
                    } else {
                        css1 = 'btn-success';
                        css2 = 'btn-default';
                    }
                }
                return {
                    newCss1: css1,
                    newCss2: css2
                };
            }, self);

            //---------------------------------------------------------------------------
            self.aliasNameByteZeilePumpe1 = {
                cssReiheRahmen: 'jj',
                bmk: '=01+H01-224TA5',
                kommentar: 'Pumpe Solekühlung Primärkreislauf',
                sollwert: '',
                istwert: '',
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
                format: '0,0.0',
                einheit: '%'
            };  
                //Anfang Funktion erzeugeZeilen() für mehrere Antriebe zeilen
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
                    var sichtbarSoll = (strukturByte.sollwert.length > 0) ? true : false;
                    var sichtbarIst = (strukturByte.istwert.length > 0) ? true : false;

                    var lblState = ko.pureComputed(function () {
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

                    var btnHandAuto = ko.pureComputed(function () {
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
                            signalName: signalName,
                            freigabe: freigabe,
                            sichtbar: sichtbar,
                            text: btnTxt
                        };
                    }, self);

                    var btnByteEin = ko.pureComputed(function () {
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

                    var btnEinByteLinks = ko.pureComputed(function () {
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

                    var btnEinByteRechts = ko.pureComputed(function () {
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

                    var btnAus = ko.pureComputed(function () {
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

                    var lblByteError = ko.pureComputed(function () {
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
                            sollwert: sollwert,
                            istwert: istwert,
                            sichtbarSoll: sichtbarSoll,
                            sichtbarIst: sichtbarIst,
                            einheit: einheit,
                            freigabe: freigabe,
                            format: format, //'0,0.[0]'
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
                self.zeilePumpe1 = self.erzeugeZeilenByte(self.aliasNameByteZeilePumpe1);
                self.antriebePumpe = ko.observableArray([
                    self.zeilePumpe1
                ]);                        
        };
        ctor.prototype = {
            close: function () {
                var self = this;
                //beim schließen den Buffer löschen
                self.connector.clearSignalBuffer();

                dialog.close(self, "");
            },
            compositionComplete: function () {
                var self = this;
                //console.log('%cComplete Seite Dialog', 'background:lime');
                $(document).keydown(function (e) {
                    // ESCAPE key pressed
                    if (e.keyCode == 27) {
                        self.close();
                    }
                });
                var containerSole = $("#containerSole1");
                var svgUrl = "ContentCowi/svg/VMI3240_Solekuehlung.svg";
                $.get(svgUrl)
                    .then(injectSvgSole)

                function injectSvgSole(xmlDoc) {
                    var svg = $(xmlDoc).find("svg");
                    containerSole.append(svg);
                }
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