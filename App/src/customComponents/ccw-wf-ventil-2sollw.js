define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil2sollw = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalVentil = (ko.unwrap(self.settings.signalVentil) || ' ');
            self.signalAktiv = (ko.unwrap(self.settings.signalAktiv) || ' ');
            self.signalSollwert1 = (ko.unwrap(self.settings.signalSollwert1) || ' ');
            self.signalSollwert2 = (ko.unwrap(self.settings.signalSollwert2) || ' ');
            self.sollwert1Unit = (ko.unwrap(self.settings.sollwert1Unit) || ' ');
            self.sollwert2Unit = (ko.unwrap(self.settings.sollwert2Unit) || ' ');
            self.sollwert1Label = (ko.unwrap(self.settings.sollwert1Label) || ' ');
            self.sollwert2Label = (ko.unwrap(self.settings.sollwert2Label) || ' ');
            self.format1 = (ko.unwrap(self.settings.format1) || '0.0,[0]');
            self.format2 = (ko.unwrap(self.settings.format2) || '0.0,[0]');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : false;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.signalValue = self.connector.getSignal(self.signalVentil).value;
            self.signalValueAktiv = self.connector.getSignal(self.signalAktiv).value;

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogAufZu = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil-2sollw-ventilAus';
                var css2 = 'ccw-wf-ventil-2sollw-ventilAus';
                var cssC = 'ccw-wf-ventil-2sollw-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var value = self.signalValue();
                var valueAktiv = self.signalValueAktiv(); //das zweite Bit um den Farbumschlag zu machen
                var auf = ((value & 0x100) >> 8) || valueAktiv;
                var hand = ((value & 0x200) >> 9);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist
                // Ohne Signal auswerten
                if ((value === undefined) || (value === null) || (valueAktiv === undefined) || (valueAktiv === null)) {
                    ohneSignal = true;
                    console.log("Ohne Signal: " + value + " SigName: " + self.signalVentil);
                }

                if (ohneSignal) {
                    css1 = 'ccw-wf-ventil-2sollw-ventilOhneSignal';
                    css2 = 'ccw-wf-ventil-2sollw-ventilOhneSignal';
                    cssC = 'ccw-wf-ventil-2sollw-ventilOhneSignal';
                } else if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css1 = 'ccw-wf-ventil-2sollw-ventilStoerNeu';
                        css2 = 'ccw-wf-ventil-2sollw-ventilStoerNeu';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil-2sollw-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil-2sollw-ventilAus';
                        }
                    } else {
                        css1 = 'ccw-wf-ventil-2sollw-ventilStoer';
                        css2 = 'ccw-wf-ventil-2sollw-ventilStoer';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil-2sollw-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil-2sollw-ventilAus';
                        }
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if (auf != 0) {
                            css1 = 'ccw-wf-ventil-2sollw-ventilEin';
                            css2 = 'ccw-wf-ventil-2sollw-ventilHandEin';
                            cssC = 'ccw-wf-ventil-2sollw-ventilHand';
                        } else {
                            css1 = 'ccw-wf-ventil-2sollw-ventilAus';
                            css2 = 'ccw-wf-ventil-2sollw-ventilHand';
                            cssC = 'ccw-wf-ventil-2sollw-ventilHand';
                        }
                    } else {
                        if (auf != 0) {
                            css1 = 'ccw-wf-ventil-2sollw-ventilEin';
                            css2 = 'ccw-wf-ventil-2sollw-ventilEin';
                            cssC = 'ccw-wf-ventil-2sollw-ventilEin';
                        } else {
                            css1 = 'ccw-wf-ventil-2sollw-ventilAus';
                            css2 = 'ccw-wf-ventil-2sollw-ventilAus';
                            cssC = 'ccw-wf-ventil-2sollw-ventilAus';
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2,
                    cssC: cssC
                };
            }, self));

            self.observables.push(self.visibleHand = ko.computed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var hand = ((value & 0x200) >> 9);

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
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var hand = ((value & 0x200) >> 9);
                var stoer = (((value & 0x2000) >> 13) || ((value & 0x4000) >> 14));

                if (stoer != 0) {
                    css = 'btn-danger';
                } else {
                    if ((hand != 0)) {
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
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var hand = ((value & 0x200) >> 9);

                if ((hand != 0)) {
                    btnTxt = 'Hand';
                } else {
                    btnTxt = 'Auto';
                }
                return btnTxt;
            }, self));

            self.observables.push(self.freigabeHandBetrieb = ko.computed(function () {
                var self = this;
                var status = false;
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var hand = ((value & 0x200) >> 9);

                if ((hand != 0) && (ko.unwrap(self.freigabeBedienung) == true)) {
                    status = true;
                } else {
                    status = false;
                }
                return status;
            }, self));

            self.observables.push(self.btnStatus = ko.computed(function () {
                var self = this;
                var btnZu = 'btn-default';
                var btnAuf = 'btn-default';
                var btnReinLtg = 'btn-default';
                var btnReinTank = 'btn-default';
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var anstReinTank = ((value & 0x04) >> 2);
                var anstReinLtg = ((value & 0x08) >> 3);

                if (hand != 0) {
                    if ((anstReinTank == 0) && (anstReinLtg == 0)) {
                        if (auf != 0) {
                            btnAuf = 'btn-success';
                        } else {
                            btnZu = 'btn-success';
                        }
                    }
                    if (anstReinTank != 0) {
                        btnReinTank = 'btn-success';
                    }
                    if (anstReinLtg != 0) {
                        btnReinLtg = 'btn-success';
                    }
                }
                return {
                    btnZu: btnZu,
                    btnAuf: btnAuf,
                    btnReinLtg: btnReinLtg,
                    btnReinTank: btnReinTank
                };
            }, self));

            self.observables.push(self.sendBtnCss = ko.computed(function () {
                var self = this;
                var erg = {};
                erg.visible = true;
                erg.css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();
                if (!sendBufferLeer) {
                    erg.css = 'ccw-flash-bg';
                    erg.visible = true;
                } else {
                    erg.visible = false;
                }
                return erg;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwventil2sollw.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalVentil) {
                self.connector.unregisterSignals(self.signalVentil);
            };
            if (self.signalSollwert1) {
                self.connector.unregisterSignals(self.signalSollwert1);
            };
            if (self.signalSollwert2) {
                self.connector.unregisterSignals(self.signalSollwert2);
            };
        };

        ccwventil2sollw.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalVentil, self.bmk + " " + self.nameVentil);
            }
        };
        ccwventil2sollw.prototype.sollwert1Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert1 : " + self.signalSollwert1, self.bmk + " " + self.nameVentil);
            }
        };
        ccwventil2sollw.prototype.sollwert2Info = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert2 : " + self.signalSollwert2, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil2sollw.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil2sollw.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogSenden(false);
            self.visibleDialogAufZu(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil2sollw.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil2sollw.prototype.dialogAufZu = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAufZu(true);
        };

        ccwventil2sollw.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogAufZu(false);
            self.show2(false);
        };

        ccwventil2sollw.prototype.setValueHand = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x200) ^ (value());
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

        ccwventil2sollw.prototype.setValueAufZu = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x100) ^ (value());
            var values = {};

            values[signalName] = setWert;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogAufZu(false);
            self.show2(false);
        };

        ccwventil2sollw.prototype.dialogSenden = function () {
            var self = this;
            //var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = 1;//bufferSignale.length;
            console.log(len);
            if (len > 0) {
                self.show2(true);
                console.log("dialogSenden()");
                self.visibleDialogSenden(true);
            } else {
                toastr.warning("Es wurden keine Werte ver&auml;ndert !", "Senden nicht m&ouml;glich !");
            }
        };
        ccwventil2sollw.prototype.sendWerte = function () {
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

            self.visibleDialogSenden(false);
            self.show2(false);
        };
        return ccwventil2sollw;
    });