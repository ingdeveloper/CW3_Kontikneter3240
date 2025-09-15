define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil3mr2 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalVentil = (ko.unwrap(self.settings.signalVentil) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;
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
            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogAuf = ko.observable(false);
            self.visibleDialogZu = ko.observable(false);

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css0 = 'ccw-wf-ventil3mr2-ventilAus';
                var css1 = 'ccw-wf-ventil3mr2-ventilAus';
                var css2 = 'ccw-wf-ventil3mr2-ventilAus';
                var css3 = 'ccw-wf-ventil3mr2-ventilAus';
                var cssC = 'ccw-wf-ventil3mr2-ventilAus';
                var cssM = 'ccw-wf-ventil3mr2-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var reverse = self.reverse;
                var value = self.signalValue();
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var zu = ((value & 0x400) >> 10);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css0 = 'ccw-wf-ventil3mr2-ventilHand';
                        css1 = 'ccw-wf-ventil3mr2-ventilStoerNeu';
                        css2 = 'ccw-wf-ventil3mr2-ventilStoerNeu';
                        css3 = 'ccw-wf-ventil3mr2-ventilStoerNeu';
                        cssC = 'ccw-wf-ventil3mr2-ventilStoerNeu';
                        cssM = 'ccw-wf-ventil3mr2-ventilStoerNeu';
                    } else {
                        css1 = 'ccw-wf-ventil3mr2-ventilStoer';
                        css2 = 'ccw-wf-ventil3mr2-ventilStoer';
                        css3 = 'ccw-wf-ventil3mr2-ventilStoer';
                        cssC = 'ccw-wf-ventil3mr2-ventilStoer';
                        cssM = 'ccw-wf-ventil3mr2-ventilStoer';
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if ((auf != 0) || (zu != 0)) {
                            cssC = 'ccw-wf-ventil3mr2-ventilHandEin';
                            cssM = 'ccw-wf-ventil3mr2-ventilHandEin';
                        } else {
                            css1 = 'ccw-wf-ventil3mr2-ventilHand';
                            css2 = 'ccw-wf-ventil3mr2-ventilHand';
                            css3 = 'ccw-wf-ventil3mr2-ventilHand';
                            cssC = 'ccw-wf-ventil3mr2-ventilHand';
                            cssM = 'ccw-wf-ventil3mr2-ventilHand';
                        }
                        if (reverse == true) {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilHandEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilAus';
                                css3 = 'ccw-wf-ventil3mr2-ventilHandEin';
                            }
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilAus';
                                css2 = 'ccw-wf-ventil3mr2-ventilHandEin';
                                css3 = 'ccw-wf-ventil3mr2-ventilHandEin';
                            }
                        } else {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilHandEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilAus';
                                css3 = 'ccw-wf-ventil3mr2-ventilHandEin';
                            }
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilHandEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilHandEin';
                                css3 = 'ccw-wf-ventil3mr2-ventilAus';
                            }
                        }
                    } else {
                        if ((auf != 0) || (zu != 0)) {
                            cssC = 'ccw-wf-ventil3mr2-ventilEin';
                            cssM = 'ccw-wf-ventil3mr2-ventilEin';
                        } else {
                            cssC = 'ccw-wf-ventil3mr2-ventilAus';
                            cssM = 'ccw-wf-ventil3mr2-ventilAus';
                        }
                        if (reverse == true) {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilAus';
                                css3 = 'ccw-wf-ventil3mr2-ventilEin';
                            }
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilAus';
                                css2 = 'ccw-wf-ventil3mr2-ventilEin';
                                css3 = 'ccw-wf-ventil3mr2-ventilEin';
                            }
                        } else {
                            if (auf != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilAus';
                                css3 = 'ccw-wf-ventil3mr2-ventilEin';
                            }
                            if (zu != 0) {
                                css1 = 'ccw-wf-ventil3mr2-ventilEin';
                                css2 = 'ccw-wf-ventil3mr2-ventilEin';
                                css3 = 'ccw-wf-ventil3mr2-ventilAus';
                            }
                        }
                    }
                }
                return {
                    css0: css0,
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

            self.observables.push(self.btnAuf = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var auf = ((value & 0x100) >> 8);

                if (auf != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.btnZu = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalVentil);
                var value = signal.value();
                var zu = ((value & 0x400) >> 10);

                if (zu != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
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

            self.connector.getOnlineUpdates();
        };

        ccwventil3mr2.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalVentil) {
                self.connector.unregisterSignals(self.signalVentil);
            };
            if (self.signalIstwert) {
                self.connector.unregisterSignals(self.signalIstwert);
            };
        };

        ccwventil3mr2.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil3mr2.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogAuf(false);
            self.visibleDialogZu(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil3mr2.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil3mr2.prototype.dialogAuf = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Auf = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Zu = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((Auf == 0) && (Zu == 0)) {
                    self.show2(true);
                    self.visibleDialogAuf(true);
                }
            } else {
                toastr.error("Steuerung nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3mr2.prototype.dialogZu = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Auf = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Zu = ((value() & 0x400) >> 10);

            if (Hand != 0) {
                if ((Auf == 0) && (Zu == 0)) {
                    self.show2(true);
                    self.visibleDialogZu(true);
                }
            } else {
                toastr.error("Steuerung nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3mr2.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogAuf(false);
            self.visibleDialogZu(false);
            self.show2(false);
        };

        ccwventil3mr2.prototype.setValueHand = function () {
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

        ccwventil3mr2.prototype.setValueAuf = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Auf = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Zu = ((value() & 0x400) >> 10);
            var setWert = (0x100) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Auf == 0) && (Zu == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogAuf(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Steuerung nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3mr2.prototype.setValueZu = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Auf = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Zu = ((value() & 0x400) >> 10);
            var setWert = (0x400) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Auf == 0) && (Zu == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogZu(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Steuerung nur im Handbetrieb möglich !!!");
            }
        };

        ccwventil3mr2.prototype.setValueStop = function () {
            var self = this;
            var signalName = self.signalVentil;
            var value = self.connector.getSignal(signalName).value;
            var Auf = ((value() & 0x100) >> 8);
            var Hand = ((value() & 0x200) >> 9);
            var Zu = ((value() & 0x400) >> 10);
            var values = {};

            if (Hand != 0) {
                if ((Auf != 0) && (Zu == 0)) {
                    var setWert = (0x100) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Auf == 0) && (Zu != 0)) {
                    var setWert = (0x400) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Auf != 0) && (Zu != 0)) {
                    var setWert = (0x500) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
            } else {
                toastr.error("Steuerung nur im Handbetrieb möglich !!!");
            }
        };

        return ccwventil3mr2;
    });