define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil4 = function (params) {
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
            self.versionAlt = ko.unwrap(self.settings.versionAlt) !== undefined ? ko.unwrap(self.settings.versionAlt) : false;
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
            self.visibleDialogZu = ko.observable(false);
            self.visibleDialogAuf = ko.observable(false);
            self.visibleDialogReinLtg = ko.observable(false);
            self.visibleDialogReinTank = ko.observable(false);

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var cssH = 'ccw-wf-ventil4-ventilAus';
                var cssV = 'ccw-wf-ventil4-ventilAus';
                var cssC = 'ccw-wf-ventil4-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var reverse = self.reverse;
                var versionAlt = self.versionAlt;
                var value = self.signalValue();
                var auf = ((value & 0x01) >> 0);
                var rmReinTank = ((value & 0x04) >> 2);
                var rmReinLtg = ((value & 0x08) >> 3);
                var hand = ((value & 0x200) >> 9);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);

                if (versionAlt == true) {
                    var auf = ((value & 0x100) >> 8);
                    var rmReinTank = ((value & 0x01) >> 0);
                    var rmReinLtg = ((value & 0x02) >> 1);
                }

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        cssH = 'ccw-wf-ventil4-ventilStoerNeu';
                        cssV = 'ccw-wf-ventil4-ventilStoerNeu';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil4-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil4-ventilAus';
                        }
                    } else {
                        cssH = 'ccw-wf-ventil4-ventilStoer';
                        cssV = 'ccw-wf-ventil4-ventilStoer';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil4-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil4-ventilAus';
                        }
                    }
                } else {
                    if ((rmReinTank != 0) && (rmReinLtg != 0)) {
                        cssH = 'ccw-wf-ventil4-hellBlau';
                        cssV = 'ccw-wf-ventil4-hellBlau';
                        if ((hand != 0) && (farbStatusHand == true)) {
                            cssC = 'ccw-wf-ventil4-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil4-hellBlau';
                        }
                    } else {
                        if (reverse == true) {
                            if (rmReinTank != 0) {
                                cssH = 'ccw-wf-ventil4-hellBlau';
                                cssV = 'ccw-wf-ventil4-ventilAusGn';
                                if ((hand != 0) && (farbStatusHand == true)) {
                                    cssC = 'ccw-wf-ventil4-ventilHand';
                                } else {
                                    cssC = 'ccw-wf-ventil4-hellBlau';
                                }
                            } else {
                                if (rmReinLtg != 0) {
                                    cssH = 'ccw-wf-ventil4-ventilAusGn';
                                    cssV = 'ccw-wf-ventil4-hellBlau';
                                    if ((hand != 0) && (farbStatusHand == true)) {
                                        cssC = 'ccw-wf-ventil4-ventilHand';
                                    } else {
                                        cssC = 'ccw-wf-ventil4-hellBlau';
                                    }
                                } else {
                                    if ((hand != 0) && (farbStatusHand == true)) {
                                        if (auf != 0) {
                                            cssH = 'ccw-wf-ventil4-ventilEin';
                                            cssV = 'ccw-wf-ventil4-ventilEin';
                                            cssC = 'ccw-wf-ventil4-ventilHand';
                                        } else {
                                            cssH = 'ccw-wf-ventil4-ventilAusGn';
                                            cssV = 'ccw-wf-ventil4-ventilAusGn';
                                            cssC = 'ccw-wf-ventil4-ventilHand';
                                        }
                                    } else {
                                        if (auf != 0) {
                                            cssH = 'ccw-wf-ventil4-ventilEin';
                                            cssV = 'ccw-wf-ventil4-ventilEin';
                                            cssC = 'ccw-wf-ventil4-ventilEin';
                                        } else {
                                            cssH = 'ccw-wf-ventil4-ventilAusGn';
                                            cssV = 'ccw-wf-ventil4-ventilAusGn';
                                            cssC = 'ccw-wf-ventil4-ventilAus';
                                        }
                                    }
                                }
                            }
                        } else {
                            if (rmReinTank != 0) {
                                cssH = 'ccw-wf-ventil4-ventilAusGn';
                                cssV = 'ccw-wf-ventil4-hellBlau';
                                if ((hand != 0) && (farbStatusHand == true)) {
                                    cssC = 'ccw-wf-ventil4-ventilHand';
                                } else {
                                    cssC = 'ccw-wf-ventil4-hellBlau';
                                }
                            } else {
                                if (rmReinLtg != 0) {
                                    cssH = 'ccw-wf-ventil4-hellBlau';
                                    cssV = 'ccw-wf-ventil4-ventilAusGn';
                                    if ((hand != 0) && (farbStatusHand == true)) {
                                        cssC = 'ccw-wf-ventil4-ventilHand';
                                    } else {
                                        cssC = 'ccw-wf-ventil4-hellBlau';
                                    }
                                } else {
                                    if ((hand != 0) && (farbStatusHand == true)) {
                                        if (auf != 0) {
                                            cssH = 'ccw-wf-ventil4-ventilEin';
                                            cssV = 'ccw-wf-ventil4-ventilEin';
                                            cssC = 'ccw-wf-ventil4-ventilHand';
                                        } else {
                                            cssH = 'ccw-wf-ventil4-ventilAusGn';
                                            cssV = 'ccw-wf-ventil4-ventilAusGn';
                                            cssC = 'ccw-wf-ventil4-ventilHand';
                                        }
                                    } else {
                                        if (auf != 0) {
                                            cssH = 'ccw-wf-ventil4-ventilEin';
                                            cssV = 'ccw-wf-ventil4-ventilEin';
                                            cssC = 'ccw-wf-ventil4-ventilEin';
                                        } else {
                                            cssH = 'ccw-wf-ventil4-ventilAusGn';
                                            cssV = 'ccw-wf-ventil4-ventilAusGn';
                                            cssC = 'ccw-wf-ventil4-ventilAus';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    cssH: cssH,
                    cssV: cssV,
                    cssC: cssC
                };
            }, self));

            self.observables.push(self.vStyleDemo = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil4-hellBlau';
                var css2 = 'ccw-wf-ventil4-ventilAusGn';
                var value = self.reverse;

                if (value == true) {
                    css1 = 'ccw-wf-ventil4-ventilAusGn';
                    css2 = 'ccw-wf-ventil4-hellBlau';
                }
                return {
                    css1: css1,
                    css2: css2
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
                var versionAlt = self.versionAlt;
                var value = signal.value();
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var anstReinTank = ((value & 0x400) >> 10);
                var anstReinLtg = ((value & 0x800) >> 11);

                if (versionAlt == true) {
                    var anstReinTank = ((value & 0x04) >> 2);
                    var anstReinLtg = ((value & 0x08) >> 3);
                }

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

        ccwventil4.prototype.dispose = function () {
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

        ccwventil4.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalVentil, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil4.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil4.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogZu(false);
            self.visibleDialogAuf(false);
            self.visibleDialogReinLtg(false);
            self.visibleDialogReinTank(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil4.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil4.prototype.dialogZu = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;

            if (versionAlt == true) {
                var auf = (((value() & 0x04) >> 2) || ((value() & 0x08) >> 3) || ((value() & 0x100) >> 8));

                if (auf != 0) {
                    self.show2(true);
                    self.visibleDialogZu(true);
                }
            } else {
                var auf = (((value() & 0x100) >> 8) || ((value() & 0x400) >> 10) || ((value() & 0x800) >> 11));

                if (auf != 0) {
                    self.show2(true);
                    self.visibleDialogZu(true);
                }
            }
        };

        ccwventil4.prototype.dialogAuf = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;

            if (versionAlt == true) {
                var auf = (((value() & 0x04) >> 2) || ((value() & 0x08) >> 3) || ((value() & 0x100) >> 8));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogAuf(true);
                }
            } else {
                var auf = (((value() & 0x100) >> 8) || ((value() & 0x400) >> 10) || ((value() & 0x800) >> 11));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogAuf(true);
                }
            }
        };

        ccwventil4.prototype.dialogReinLtg = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;

            if (versionAlt == true) {
                var auf = (((value() & 0x04) >> 2) || ((value() & 0x08) >> 3) || ((value() & 0x100) >> 8));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogReinLtg(true);
                }
            } else {
                var auf = (((value() & 0x100) >> 8) || ((value() & 0x400) >> 10) || ((value() & 0x800) >> 11));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogReinLtg(true);
                }
            }
        };

        ccwventil4.prototype.dialogReinTank = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;

            if (versionAlt == true) {
                var auf = (((value() & 0x04) >> 2) || ((value() & 0x08) >> 3) || ((value() & 0x100) >> 8));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogReinTank(true);
                }
            } else {
                var auf = (((value() & 0x100) >> 8) || ((value() & 0x400) >> 10) || ((value() & 0x800) >> 11));

                if (auf == 0) {
                    self.show2(true);
                    self.visibleDialogReinTank(true);
                }
            }
        };

        ccwventil4.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogZu(false);
            self.visibleDialogAuf(false);
            self.visibleDialogReinLtg(false);
            self.visibleDialogReinTank(false);
            self.show2(false);
        };

        ccwventil4.prototype.setValueHand = function () {
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

        ccwventil4.prototype.setValueZu = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;
            var setWert;
            var values = {};

            if (versionAlt == true) {
                var auf = ((value() & 0x100) >> 8);
                var anstReinTank = ((value() & 0x04) >> 2);
                var anstReinLtg = ((value() & 0x08) >> 3);

                if (auf != 0) {
                    setWert = (0x100) ^ (value());
                }
                if (anstReinTank != 0) {
                    setWert = (0x04) ^ (value());
                }
                if (anstReinLtg != 0) {
                    setWert = (0x08) ^ (value());
                }
            } else {
                var auf = ((value() & 0x100) >> 8);
                var anstReinTank = ((value() & 0x400) >> 10);
                var anstReinLtg = ((value() & 0x800) >> 11);

                if (auf != 0) {
                    setWert = (0x100) ^ (value());
                }
                if (anstReinTank != 0) {
                    setWert = (0x400) ^ (value());
                }
                if (anstReinLtg != 0) {
                    setWert = (0x800) ^ (value());
                }
            }

            values[signalName] = setWert;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogZu(false);
            self.show2(false);
        };

        ccwventil4.prototype.setValueAuf = function () {
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
            self.visibleDialogAuf(false);
            self.show2(false);
        };

        ccwventil4.prototype.setValueReinLtg = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x800) ^ (value());
            var values = {};

            if (versionAlt == true) {
                var setWert = (0x08) ^ (value());
            }

            values[signalName] = setWert;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogReinLtg(false);
            self.show2(false);
        };

        ccwventil4.prototype.setValueReinTank = function () {
            var self = this;
            var signalName = self.signalVentil;
            var versionAlt = self.versionAlt;
            var value = self.connector.getSignal(signalName).value;
            var setWert = (0x400) ^ (value());
            var values = {};

            if (versionAlt == true) {
                var setWert = (0x04) ^ (value());
            }

            values[signalName] = setWert;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogReinTank(false);
            self.show2(false);
        };

        return ccwventil4;
    });