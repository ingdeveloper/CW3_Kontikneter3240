define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil3wmu = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalVentil = (ko.unwrap(self.settings.signalVentil) || '');

            self.txtBtn1 = (ko.unwrap(self.settings.txtBtn1) || 'Auf');
            self.txtBtn2 = (ko.unwrap(self.settings.txtBtn2) || 'Zu');
            self.txtBtn3 = (ko.unwrap(self.settings.txtBtn2) || 'Stop');
            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;
            self.anzRM = ko.unwrap(self.settings.anzRM) !== undefined ? ko.unwrap(self.settings.anzRM) : false;
            self.typRM = ko.unwrap(self.settings.typRM) !== undefined ? ko.unwrap(self.settings.typRM) : 1;
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

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
            self.visibleDialogST1 = ko.observable(false);
            self.visibleDialogST2 = ko.observable(false);

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil3wmu-ventilAus';
                var css2 = 'ccw-wf-ventil3wmu-ventilAus';
                var css3 = 'ccw-wf-ventil3wmu-ventilAus';
                var cssC = 'ccw-wf-ventil3wmu-ventilAus';
                var cssM = 'ccw-wf-ventil3wmu-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var reverse = self.reverse;
                var anzRM = self.anzRM;
                var typRM = self.typRM;
                var value = self.signalValue();
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var zu = ((value & 0x400) >> 10);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);
                var RMauf = ((value & 0x01) >> 0);
                switch (typRM) {
                    case 1:
                        var RMzu = ((value & 0x02) >> 1);
                        break;
                    case 2:
                        var RMzu = ((value & 0x04) >> 2);
                        break;
                    default:
                        var RMzu = ((value & 0x02) >> 1);
                }

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css1 = 'ccw-wf-ventil3wmu-ventilStoerNeu';
                        css2 = 'ccw-wf-ventil3wmu-ventilStoerNeu';
                        css3 = 'ccw-wf-ventil3wmu-ventilStoerNeu';
                        cssM = 'ccw-wf-ventil3wmu-ventilStoerNeu';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil3wmu-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil3wmu-ventilAus';
                        }
                    } else {
                        css1 = 'ccw-wf-ventil3wmu-ventilStoer';
                        css2 = 'ccw-wf-ventil3wmu-ventilStoer';
                        css3 = 'ccw-wf-ventil3wmu-ventilStoer';
                        cssM = 'ccw-wf-ventil3wmu-ventilStoer';
                        if (hand != 0) {
                            cssC = 'ccw-wf-ventil3wmu-ventilHand';
                        } else {
                            cssC = 'ccw-wf-ventil3wmu-ventilAus';
                        }
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if ((auf != 0) || (zu != 0)) {
                            cssC = 'ccw-wf-ventil3wmu-ventilHand';
                            cssM = 'ccw-wf-ventil3wmu-ventilHandEin';
                        } else {
                            cssC = 'ccw-wf-ventil3wmu-ventilHand';
                            cssM = 'ccw-wf-ventil3wmu-ventilHand';
                        }
                    } else {
                        if ((auf != 0) || (zu != 0)) {
                            cssC = 'ccw-wf-ventil3wmu-ventilEin';
                            cssM = 'ccw-wf-ventil3wmu-ventilEin';
                        } else {
                            cssC = 'ccw-wf-ventil3wmu-ventilAus';
                            cssM = 'ccw-wf-ventil3wmu-ventilAus';
                        }
                    }
                    if (anzRM == true) {
                        if (reverse == true) {
                            if (RMzu != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilAus';
                                css2 = 'ccw-wf-ventil3wmu-ventilEin';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                            if (RMauf != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilAus';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                        } else {
                            if (RMzu != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilEin';
                                css3 = 'ccw-wf-ventil3wmu-ventilAus';
                            }
                            if (RMauf != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilAus';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                        }
                    } else {
                        if (reverse == true) {
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilAus';
                                css2 = 'ccw-wf-ventil3wmu-ventilEin';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilAus';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                        } else {
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilEin';
                                css3 = 'ccw-wf-ventil3wmu-ventilAus';
                            }
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3wmu-ventilEin';
                                css2 = 'ccw-wf-ventil3wmu-ventilAus';
                                css3 = 'ccw-wf-ventil3wmu-ventilEin';
                            }
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2,
                    css3: css3,
                    cssC: cssC,
                    cssM: cssM
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

            self.observables.push(self.btnEin1 = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var Ein = ((value & 0x100) >> 8);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.btnEin2 = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var Ein = ((value & 0x400) >> 10);

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwventil3wmu.prototype.dispose = function () {
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

        ccwventil3wmu.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil3wmu.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogST1(false);
            self.visibleDialogST2(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil3wmu.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil3wmu.prototype.dialogST1 = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Ein2 = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    self.show2(true);
                    self.visibleDialogST1(true);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!" + value);
            }
        };

        ccwventil3wmu.prototype.dialogST2 = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Ein2 = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    self.show2(true);
                    self.visibleDialogST2(true);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3wmu.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogST1(false);
            self.visibleDialogST2(false);
            self.show2(false);
        };

        ccwventil3wmu.prototype.setValueHand = function () {
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

        ccwventil3wmu.prototype.setValueST1 = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Ein2 = ((value() & 0x400) >> 10);
            var setWert = (0x100) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogST1(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3wmu.prototype.setValueST2 = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Ein2 = ((value() & 0x400) >> 10);
            var setWert = (0x400) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogST2(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3wmu.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Ein2 = ((value() & 0x400) >> 10);
            var values = {};

            if (Hand != 0) {
                if ((Ein1 != 0) && (Ein2 == 0)) {
                    var setWert = (0x100) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Ein1 == 0) && (Ein2 != 0)) {
                    var setWert = (0x400) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Ein1 != 0) && (Ein2 != 0)) {
                    var setWert = (0x500) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        return ccwventil3wmu;
    });