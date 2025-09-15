define(['../services/connector'],

    function (signalsConnector) {
        var ccwpump0 = function (params) {
            var self = this;

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalAntrieb = (ko.unwrap(self.settings.signalWeiche) || '');
            self.linksStattRechts = (ko.unwrap(self.settings.linksStattRechts) || false);
            self.signalSollwert1 = (ko.unwrap(self.settings.signalSollwert1) || '');
            self.signalSollwert2 = (ko.unwrap(self.settings.signalSollwert2) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');
            self.signalBtrStdGesamt = (ko.unwrap(self.settings.signalBtrStdGesamt) || '');
            self.signalBtrStdWartung = (ko.unwrap(self.settings.signalBtrStdWartung) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameAntrieb = (ko.unwrap(self.settings.nameAntrieb) || '');
            self.txtSollwert1 = (ko.unwrap(self.settings.txtSollwert1) || '');
            self.txtSollwert2 = (ko.unwrap(self.settings.txtSollwert2) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.steuerAktiv = ko.unwrap(self.settings.steuerAktiv) !== undefined ? ko.unwrap(self.settings.steuerAktiv) : true;
            self.linkslaufAktiv = ko.unwrap(self.settings.linkslaufAktiv) !== undefined ? ko.unwrap(self.settings.linkslaufAktiv) : true;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : false;
            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self);

            self.signalValue = self.connector.getSignal(self.signalAntrieb).value;
            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';
            self.btrStdGesamt = ko.unwrap(self.settings.signalBtrStdGesamt) !== undefined ? self.connector.getSignal(self.signalBtrStdGesamt).value : '';
            self.btrStdWartung = ko.unwrap(self.settings.signalBtrStdWartung) !== undefined ? self.connector.getSignal(self.signalBtrStdWartung).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialog2 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);
            self.visibleDialogEinR = ko.observable(false);
            self.visibleDialogEinL = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            self.txtBtnEin = (ko.unwrap(self.settings.txtBtnEin) || 'Ein');
            self.txtBtnSpule1 = (ko.unwrap(self.settings.txtBtnSpule1) || 'Spule 1');
            self.txtBtnSpule2 = (ko.unwrap(self.settings.txtBtnSpule2) || 'Spule 2');
            self.txtBtnAus = (ko.unwrap(self.settings.txtBtnAus) || 'Aus');

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.mDirection = ko.computed(function () {
                var self = this;
                var motorDirection = self.ausrichtung;

                return 'rotate(' + motorDirection + 'deg)';
            }, self);

            self.mStyle = ko.computed(function () {
                var self = this;
                var css = 'ccw-wf-weiche0-antriebAus';
                var cssGerade = '';
                var cssLinks = '';
                var cssRechts = '';
                var farbStatusHand = self.farbStatusHand;
                var value = self.signalValue(); //das WORD ist geswappt
                // console.log("Spule " + self.signalAntrieb);
                // console.log(value);

                //WICHTIG: das WORD ist geswappt
                var spule1_ein = ((value & 0x100) >> 8); //Befehl ein Richtung Spule 1
                var hand = ((value & 0x200) >> 9);
                var spule2_ein = ((value & 0x400) >> 10); //Befehl ein Richtung Spule 2
                var faehrtRichtungSpule1 = ((value & 0x800) >> 11);
                var faehrtRichtungSpule2 = ((value & 0x1000) >> 12);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);
                var rmSpule1 = ((value & 0x01) !== 0); //Ventil steht Richtung Spule 1
                var rmSpule2 = ((value & 0x02) !== 0); //Ventil steht Richtung Spule 2
                // console.log((value & 0x01) !== 0);

                var visibleAnfang = (rmSpule1) || (rmSpule2) || spule1_ein || spule2_ein;
                var visibleGerade = rmSpule1 || faehrtRichtungSpule1;

                var visibleLinks = false;
                var visibleRechts = false;

                var visibleSpuleGerade = spule1_ein;
                var visibleSpuleRechts = false;
                var visibleSpuleLinks = false;

                var ohneSignal = false; //wenn Signalname nicht vorhanden ist

                if (self.linksStattRechts) {
                    visibleLinks = rmSpule2 || spule2_ein;
                    visibleSpuleLinks = spule2_ein;
                } else {
                    visibleRechts = rmSpule2 || spule2_ein;
                    visibleSpuleRechts = spule2_ein;
                }
                // console.log("Weiche ---");
                // console.log(stoer);

                if ((value === undefined) || (value === null)) {
                    ohneSignal = true;
                    console.log("Ohne Signal: " + value + " SigName: " + self.signalAntrieb);
                }

                // Wenn Störung
                if (ohneSignal) {
                    css = 'ccw-wf-weiche0-ohneSignal';
                } else if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css = 'ccw-wf-weiche0-antriebStoerNeu';
                    } else {
                        css = 'ccw-wf-weiche0-antriebStoer';
                    }
                    //console.log("Weiche Störung");

                    //    keine Störung
                } else {
                    // Handbetrieb und 
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if ((spule1_ein != 0) || (spule2_ein != 0)) {
                            if ((faehrtRichtungSpule1 != 0) || (faehrtRichtungSpule2 != 0)) {
                                css = 'ccw-wf-weiche0-lauf';
                            } else {
                                css = 'ccw-wf-weiche0-lauf';
                            }
                        } else {
                            css = 'ccw-wf-weiche0-antriebHand';
                        }
                        // Normalbetrieb
                    } else {
                        // Einbefehl in irgendeine Richtung
                        if ((spule1_ein != 0) && (faehrtRichtungSpule1 != 0)) {
                            cssGerade = 'ccw-flash-bg';
                        }
                        if ((spule2_ein != 0) && (faehrtRichtungSpule2 != 0)) {
                            if (self.linksStattRechts) {
                                cssLinks = 'ccw-flash-bg';
                            } else {
                                cssRechts = 'ccw-flash-bg';
                            }
                        }
                
                    }
                }
                return {
                    css: css,
                    cssGerade: cssGerade,
                    cssLinks: cssLinks,
                    cssRechts: cssRechts,
                    visibleAnfang: visibleAnfang,
                    visibleGerade: visibleGerade,
                    visibleLinks: visibleLinks,
                    visibleRechts: visibleRechts,
                    visibleSpuleGerade: visibleSpuleGerade,
                    visibleSpuleRechts: visibleSpuleRechts,
                    visibleSpuleLinks: visibleSpuleLinks
                };
            }, self);

            self.visibleHand = ko.pureComputed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var hand = ((value & 0x200) >> 9);

                if ((hand != 0) && (farbStatusHand == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self);

            self.btnHandAutoCss = ko.pureComputed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Hand = ((value & 0x200) >> 9);
                var Stoer = (((value & 0x20) >> 5) || ((value & 0x40) >> 6));

                if (Stoer != 0) {
                    css = 'btn-danger';
                } else {
                    if ((Hand != 0)) {
                        css = 'btn-warning';
                    } else {
                        css = 'btn-success';
                    }
                }
                return css;
            }, self);

            self.btnHandAutoText = ko.pureComputed(function () {
                var self = this;
                var btnTxt = '';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Hand = ((value & 0x200) >> 9);
                var Stoer = (((value & 0x20) >> 5) || ((value & 0x40) >> 6));

                if ((Hand != 0)) {
                    btnTxt = 'Hand';
                } else {
                    btnTxt = 'Auto';
                }
                return btnTxt;
            }, self);

            self.btnEin = ko.pureComputed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = (((value & 0x100) >> 8) || ((value & 0x400) >> 10));

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self);

            self.btnEinR = ko.pureComputed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = ((value & 0x100) >> 8);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self);

            self.btnEinL = ko.pureComputed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = ((value & 0x400) >> 10);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self);

            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);

            self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
        };

        ccwpump0.prototype.dispose = function () {
            var self = this;

            if (!self.signal)
                return;
            return self.connector.unregisterSignals(self.signal);
        };

        ccwpump0.prototype.antriebInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Antrieb : " + self.signalAntrieb, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.sollwert1Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert1 : " + self.signalSollwert1, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.sollwert2Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert2 : " + self.signalSollwert2, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.istwertInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Istwert : " + self.signalIstwert, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.btrStdGesamtInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Btr. Std. gesamt : " + self.signalBtrStdGesamt, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.btrStdWartungInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Btr. Std. n. Wartung : " + self.signalBtrStdWartung, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0.prototype.antriebDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwpump0.prototype.antriebDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialogEinR(false);
            self.visibleDialogEinL(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwpump0.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwpump0.prototype.dialogEin = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEin(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.dialogEinR = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEinR(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.dialogEinL = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEinL(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.dialogSenden = function () {
            var self = this;
            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = bufferSignale.length;

            if (len > 0) {
                self.show2(true);
                self.visibleDialogSenden(true);
            } else {
                toastr.warning("Es wurden keine Werte ver&auml;ndert !", "Senden nicht m&ouml;glich !");
            }
        };

        ccwpump0.prototype.antriebDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialogEinR(false);
            self.visibleDialogEinL(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwpump0.prototype.setValueHand = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x200) ^ (value());
            var values = {};

            values[signalName] = setWert;
            self.connector.writeSignals(values);
            self.visibleDialogHandAuto(false);
            self.show2(false);
        };

        ccwpump0.prototype.setValueEinR = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);
            var setWert = (0x100) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values);
                    self.visibleDialogEin(false);
                    self.visibleDialogEinR(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.setValueEinL = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);
            var setWert = (0x400) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values);
                    self.visibleDialogEinL(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var EinL = ((value() & 0x400) >> 10);
            var values = {};

            if (Hand != 0) {
                if ((EinR != 0) && (EinL == 0)) {
                    var setWert = (0x100) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values);
                }
                if ((EinR == 0) && (EinL != 0)) {
                    var setWert = (0x400) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values);
                }
                if ((EinR != 0) && (EinL != 0)) {
                    var setWert = (0x500) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0.prototype.sendWerte = function () {
            var self = this;
            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = bufferSignale.length;
            var i;

            for (i = 0; i < len; i++) {
                console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
            }

            self.connector.writeSignalsFromBuffer();
            toastr.success('Send-Werte geschrieben');
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        return ccwpump0;
    });