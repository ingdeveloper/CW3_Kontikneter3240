define(['../services/connector'],

    function (signalsConnector) {
        var ccwmotor3 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalAntrieb = (ko.unwrap(self.settings.signalAntrieb) || '');
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
            self.linkslaufAktiv = ko.unwrap(self.settings.linkslaufAktiv) !== undefined ? ko.unwrap(self.settings.linkslaufAktiv) : false;
            self.motorRichtung = (ko.unwrap(self.settings.motorRichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : false;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

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

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.mDirection = ko.computed(function () {
                var self = this;
                var motorDirection = self.motorRichtung;
                var scaleX = '1';
                var scaleY = '1';

                if (motorDirection < 0) {
                    scaleY = '-1';
                } else {
                    scaleY = '1';
                }
                return 'rotate(' + motorDirection + 'deg) scale(' + scaleX + ',' + scaleY + ')';
            }, self));

            self.observables.push(self.mStyle = ko.computed(function () {
                var self = this;
                var css = 'ccw-wf-motor3-antriebAus';
                var farbStatusHand = self.farbStatusHand;
                var value = self.signalValue();
                var einR = ((value & 0x01) >> 0);
                var hand = ((value & 0x02) >> 1);
                var einL = ((value & 0x04) >> 2);
                var hochlauf = ((value & 0x08) >> 3);
                var ablauf = ((value & 0x10) >> 4);
                var stoerNeu = ((value & 0x20) >> 5);
                var stoer = ((value & 0x40) >> 6);

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css = 'ccw-wf-motor3-antriebStoerNeu';
                    } else {
                        css = 'ccw-wf-motor3-antriebStoer';
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if ((einR != 0) || (einL != 0)) {
                            if ((hochlauf != 0) || (ablauf != 0)) {
                                css = 'ccw-wf-motor3-antriebHochlaufHand';
                            } else {
                                css = 'ccw-wf-motor3-antriebHandEin';
                            }
                        } else {
                            css = 'ccw-wf-motor3-antriebHand';
                        }
                    } else {
                        if ((einR != 0) || (einL != 0)) {
                            if ((hochlauf != 0) || (ablauf != 0)) {
                                css = 'ccw-wf-motor3-antriebHochlauf';
                            } else {
                                css = 'ccw-wf-motor3-antriebEin';
                            }
                        } else {
                            css = 'ccw-wf-motor3-antriebAus';
                        }
                    }
                }
                return css;
            }, self));

            self.observables.push(self.visibleHand = ko.computed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var hand = ((value & 0x02) >> 1);

                if ((hand != 0) && (farbStatusHand == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.observables.push(self.btnHandAutoCss = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Hand = ((value & 0x02) >> 1);
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
            }, self));

            self.observables.push(self.btnHandAutoText = ko.computed(function () {
                var self = this;
                var btnTxt = '';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Hand = ((value & 0x02) >> 1);
                var Stoer = (((value & 0x20) >> 5) || ((value & 0x40) >> 6));

                if ((Hand != 0)) {
                    btnTxt = 'Hand';
                } else {
                    btnTxt = 'Auto';
                }
                return btnTxt;
            }, self));

            self.observables.push(self.btnEin = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.btnEinR = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = ((value & 0x01) >> 0);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.btnEinL = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalAntrieb);
                var value = signal.value();
                var Ein = ((value & 0x04) >> 2);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwmotor3.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalAntrieb) {
                self.connector.unregisterSignals(self.signalAntrieb);
            };
            if (self.signalSollwert1) {
                self.connector.unregisterSignals(self.signalSollwert1);
            };
            if (self.signalSollwert2) {
                self.connector.unregisterSignals(self.signalSollwert2);
            };
            if (self.signalIstwert) {
                self.connector.unregisterSignals(self.signalIstwert);
            };
            if (self.signalBtrStdGesamt) {
                self.connector.unregisterSignals(self.signalBtrStdGesamt);
            };
            if (self.signalBtrStdWartung) {
                self.connector.unregisterSignals(self.signalBtrStdWartung);
            };
        };

        ccwmotor3.prototype.antriebInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Antrieb : " + self.signalAntrieb, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.sollwert1Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert1 : " + self.signalSollwert1, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.sollwert2Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert2 : " + self.signalSollwert2, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.istwertInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Istwert : " + self.signalIstwert, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.btrStdGesamtInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Btr. Std. gesamt : " + self.signalBtrStdGesamt, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.btrStdWartungInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Btr. Std. n. Wartung : " + self.signalBtrStdWartung, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwmotor3.prototype.antriebDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwmotor3.prototype.antriebDialogClose1 = function () {
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

        ccwmotor3.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwmotor3.prototype.dialogEin = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEin(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.dialogEinR = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEinR(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.dialogEinL = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    self.show2(true);
                    self.visibleDialogEinL(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.dialogSenden = function () {
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

        ccwmotor3.prototype.antriebDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialogEinR(false);
            self.visibleDialogEinL(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwmotor3.prototype.setValueHand = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x02) ^ (value());
            var values = {};

            values[signalName] = setWert;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogHandAuto(false);
            self.show2(false);
        };

        ccwmotor3.prototype.setValueEinR = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);
            var setWert = (0x01) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogEin(false);
                    self.visibleDialogEinR(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.setValueEinL = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);
            var setWert = (0x04) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((EinR == 0) && (EinL == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogEinL(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalAntrieb;
            var value = self.connector.getSignal(signalName).value;
            var EinR = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var EinL = ((value() & 0x04) >> 2);
            var values = {};

            if (Hand != 0) {
                if ((EinR != 0) && (EinL == 0)) {
                    var setWert = (0x01) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((EinR == 0) && (EinL != 0)) {
                    var setWert = (0x04) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((EinR != 0) && (EinL != 0)) {
                    var setWert = (0x05) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwmotor3.prototype.sendWerte = function () {
            var self = this;
            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = bufferSignale.length;
            var i;

            for (i = 0; i < len; i++) {
                console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
            }

            self.connector.writeSignalsFromBuffer().then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            toastr.success('Send-Werte geschrieben');
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        return ccwmotor3;
    });