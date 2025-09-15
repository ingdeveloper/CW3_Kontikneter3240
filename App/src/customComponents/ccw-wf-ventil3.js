define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil3 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalVentil = (ko.unwrap(self.settings.signalVentil) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;
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

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogAufZu = ko.observable(false);

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil3-ventilAus';
                var css2 = 'ccw-wf-ventil3-ventilAus';
                var css3 = 'ccw-wf-ventil3-ventilAus';
                var cssC = 'ccw-wf-ventil3-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var reverse = self.reverse;
                var value = self.signalValue();
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist

                if ((value === undefined) || (value === null)) {
                    ohneSignal = true;
                    console.log("ccw-wf-ventil3 ohne Signal: " + value + " SigName: " + self.signalVentil);
                }

                if (ohneSignal) {
                    css1 = 'ccw-wf-ventil3-ohneSignal';
                    css2 = 'ccw-wf-ventil3-ohneSignal';
                    css3 = 'ccw-wf-ventil3-ohneSignal';
                    cssC = 'ccw-wf-ventil3-ohneSignal';
                } else if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css1 = 'ccw-wf-ventil3-ventilStoerNeu';
                        css2 = 'ccw-wf-ventil3-ventilStoerNeu';
                        css3 = 'ccw-wf-ventil3-ventilStoerNeu';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil3-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil3-ventilAus';
                        }
                    } else {
                        css1 = 'ccw-wf-ventil3-ventilStoer';
                        css2 = 'ccw-wf-ventil3-ventilStoer';
                        css3 = 'ccw-wf-ventil3-ventilStoer';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil3-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil3-ventilAus';
                        }
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if (reverse == true) {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilAus';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilHand';
                            } else {
                                css1 = 'ccw-wf-ventil3-ventilAus';
                                css2 = 'ccw-wf-ventil3-ventilEin';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilHand';
                            }
                        } else {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilAus';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilHand';
                            } else {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilEin';
                                css3 = 'ccw-wf-ventil3-ventilAus';
                                cssC = 'ccw-wf-ventil3-ventilHand';
                            }
                        }
                    } else {
                        if (reverse == true) {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilAus';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilEin';
                            } else {
                                css1 = 'ccw-wf-ventil3-ventilAus';
                                css2 = 'ccw-wf-ventil3-ventilEin';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilAus';
                            }
                        } else {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilAus';
                                css3 = 'ccw-wf-ventil3-ventilEin';
                                cssC = 'ccw-wf-ventil3-ventilEin';
                            } else {
                                css1 = 'ccw-wf-ventil3-ventilEin';
                                css2 = 'ccw-wf-ventil3-ventilEin';
                                css3 = 'ccw-wf-ventil3-ventilAus';
                                cssC = 'ccw-wf-ventil3-ventilAus';
                            }
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2,
                    css3: css3,
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

            self.connector.getOnlineUpdates();
        };

        ccwventil3.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalVentil) {
                self.connector.unregisterSignals(self.signalVentil);
            };
        };

        ccwventil3.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalVentil, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil3.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil3.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogAufZu(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil3.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil3.prototype.dialogAufZu = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAufZu(true);
        };

        ccwventil3.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogAufZu(false);
            self.show2(false);
        };

        ccwventil3.prototype.setValueHand = function () {
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

        ccwventil3.prototype.setValueAufZu = function () {
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

        return ccwventil3;
    });