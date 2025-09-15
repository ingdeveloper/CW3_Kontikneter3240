define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil3bmo = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalStatusAutoEin = (ko.unwrap(self.settings.signalStatusAutoEin) || '');
            self.signalStatusAutoAus = (ko.unwrap(self.settings.signalStatusAutoAus) || '');
            self.signalStatusHandEin = (ko.unwrap(self.settings.signalStatusHandEin) || '');
            self.signalStatusHandAus = (ko.unwrap(self.settings.signalStatusHandAus) || '');
            self.signalStatus1 = (ko.unwrap(self.settings.signalStatus1) || '');
            self.signalStatus2 = (ko.unwrap(self.settings.signalStatus2) || '');
            self.signalStoer1 = (ko.unwrap(self.settings.signalStoer1) || '');
            self.signalStoer2 = (ko.unwrap(self.settings.signalStoer2) || '');
            self.signalSteuerAuto = (ko.unwrap(self.settings.signalSteuerAuto) || '');
            self.signalSteuerHandAus = (ko.unwrap(self.settings.signalSteuerHandAus) || '');
            self.signalSteuerHand1 = (ko.unwrap(self.settings.signalSteuerHand1) || '');
            self.signalSteuerHand2 = (ko.unwrap(self.settings.signalSteuerHand2) || '');

            self.txtBtn1 = (ko.unwrap(self.settings.txtBtn1) || '1');
            self.txtBtn2 = (ko.unwrap(self.settings.txtBtn2) || '2');
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

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogAuto = ko.observable(false);
            self.visibleDialogAus = ko.observable(false);
            self.visibleDialogST1 = ko.observable(false);
            self.visibleDialogST2 = ko.observable(false);



            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css0 = 'ccw-wf-ventil3bmo-ventilAus';
                var css1 = 'ccw-wf-ventil3bmo-ventilAus';
                var css2 = 'ccw-wf-ventil3bmo-ventilAus';
                var css3 = 'ccw-wf-ventil3bmo-ventilAus';
                var cssC = 'ccw-wf-ventil3bmo-ventilAus';
                var cssM = 'ccw-wf-ventil3bmo-ventilAus';
                var reverse = self.reverse;
                var farbStatusHand = self.farbStatusHand;
                var statusAuto = 0;
                var autoEin = 0;
                var autoAus = 0;
                var handEin = 0;
                var handAus = 0;
                var status1 = 0;
                var status2 = 0;
                var stoer1 = 0;
                var stoer2 = 0;

                if (self.signalStatusAutoEin !== '') {
                    var signalAutoEin = self.connector.getSignal(self.signalStatusAutoEin).value();
                    autoEin = signalAutoEin & 0x01;
                    statusAuto = 1;
                }
                if (self.signalStatusAutoAus !== '') {
                    var signalAutoAus = self.connector.getSignal(self.signalStatusAutoAus).value();
                    autoAus = signalAutoAus & 0x01;
                }
                if (self.signalStatusHandEin !== '') {
                    var signalHandEin = self.connector.getSignal(self.signalStatusHandEin).value();
                    handEin = signalHandEin & 0x01;
                }
                if (self.signalStatusHandAus !== '') {
                    var signalHandAus = self.connector.getSignal(self.signalStatusHandAus).value();
                    handAus = signalHandAus & 0x01;
                }
                if (self.signalStatus1 !== '') {
                    var signalST1 = self.connector.getSignal(self.signalStatus1).value();
                    status1 = signalST1 & 0x01;
                }
                if (self.signalStatus2 !== '') {
                    var signalST2 = self.connector.getSignal(self.signalStatus2).value();
                    status2 = signalST2 & 0x01;
                }
                if (self.signalStoer1 !== '') {
                    var signalStoer1 = self.connector.getSignal(self.signalStoer1).value();
                    stoer1 = signalStoer1 & 0x01;
                }
                if (self.signalStoer2 !== '') {
                    var signalStoer2 = self.connector.getSignal(self.signalStoer2).value();
                    stoer2 = signalStoer2 & 0x01;
                }

                if (statusAuto == 0) {
                    if ((status1 != 0) || (status2 != 0)) {
                        autoEin = 1;
                    }
                }

                if ((stoer1 != 0) || (stoer2 != 0)) {
                    css0 = 'ccw-wf-ventil3bmo-ventilHand';
                    css1 = 'ccw-wf-ventil3bmo-ventilStoerNeu';
                    css2 = 'ccw-wf-ventil3bmo-ventilStoerNeu';
                    css3 = 'ccw-wf-ventil3bmo-ventilStoerNeu';
                    cssC = 'ccw-wf-ventil3bmo-ventilStoerNeu';
                    cssM = 'ccw-wf-ventil3bmo-ventilStoerNeu';
                } else {
                    if (farbStatusHand == true) {
                        if (autoAus != 0) {
                            css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoAus';
                        }
                        if (handAus != 0) {
                            css1 = 'ccw-wf-ventil3bmo-ventilHandAus';
                            css2 = 'ccw-wf-ventil3bmo-ventilHandAus';
                            css3 = 'ccw-wf-ventil3bmo-ventilHandAus';
                            cssC = 'ccw-wf-ventil3bmo-ventilHandAus';
                            cssM = 'ccw-wf-ventil3bmo-ventilHandAus';
                        }
                        if (autoEin != 0) {
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            if (reverse == true) {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                            } else {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                            }
                        }
                        if (handEin != 0) {
                            cssC = 'ccw-wf-ventil3bmo-ventilHandEin';
                            cssM = 'ccw-wf-ventil3bmo-ventilHandEin';
                            if (reverse == true) {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css2 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                }
                            } else {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilHandEin';
                                }
                            }
                        }
                    } else {
                        if (autoAus != 0) {
                            css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoAus';
                        }
                        if (handAus != 0) {
                            css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoAus';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoAus';
                        }
                        if (autoEin != 0) {
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            if (reverse == true) {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                            } else {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                            }
                        }
                        if (handEin != 0) {
                            cssC = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            cssM = 'ccw-wf-ventil3bmo-ventilAutoEin';
                            if (reverse == true) {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
                            } else {
                                if ((status1 != 0) && (status2 == 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                }
                                if ((status1 == 0) && (status2 != 0)) {
                                    css1 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                    css2 = 'ccw-wf-ventil3bmo-ventilAutoAus';
                                    css3 = 'ccw-wf-ventil3bmo-ventilAutoEin';
                                }
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
                var handEin = 0;
                var handAus = 0;

                if (self.signalStatusHandEin !== '') {
                    var signalHandEin = self.connector.getSignal(self.signalStatusHandEin).value();
                    handEin = signalHandEin & 0x01;
                }
                if (self.signalStatusHandAus !== '') {
                    var signalHandAus = self.connector.getSignal(self.signalStatusHandAus).value();
                    handAus = signalHandAus & 0x01;
                }

                if (((handEin != 0) || (handAus != 0)) && (farbStatusHand == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.observables.push(self.btnAuto = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var auto = 0;

                if (self.signalSteuerAuto !== '') {
                    var signalSteuerAuto = self.connector.getSignal(self.signalSteuerAuto).value();
                    auto = signalSteuerAuto & 0x01;
                }

                if ((auto != 0)) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnAus = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var aus = 0;

                if (self.signalSteuerHandAus !== '') {
                    var signalSteuerHandAus = self.connector.getSignal(self.signalSteuerHandAus).value();
                    aus = signalSteuerHandAus & 0x01;
                }

                if (aus != 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnEin1 = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var ein = 0;

                if (self.signalSteuerHand1 !== '') {
                    var signalSteuerHand1 = self.connector.getSignal(self.signalSteuerHand1).value();
                    ein = signalSteuerHand1 & 0x01;
                }

                if (ein != 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnEin2 = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var ein = 0;

                if (self.signalSteuerHand2 !== '') {
                    var signalSteuerHand2 = self.connector.getSignal(self.signalSteuerHand2).value();
                    ein = signalSteuerHand2 & 0x01;
                }

                if (ein != 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwventil3bmo.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalStatusAutoEin) {
                self.connector.unregisterSignals(self.signalStatusAutoEin);
            };
            if (self.signalStatusAutoAus) {
                self.connector.unregisterSignals(self.signalStatusAutoAus);
            };
            if (self.signalStatusHandEin) {
                self.connector.unregisterSignals(self.signalStatusHandEin);
            };
            if (self.signalStatusHandAus) {
                self.connector.unregisterSignals(self.signalStatusHandAus);
            };
            if (self.signalStatus1) {
                self.connector.unregisterSignals(self.signalStatus1);
            };
            if (self.signalStatus2) {
                self.connector.unregisterSignals(self.signalStatus2);
            };
            if (self.signalStoer1) {
                self.connector.unregisterSignals(self.signalStoer1);
            };
            if (self.signalStoer2) {
                self.connector.unregisterSignals(self.signalStoer2);
            };
            if (self.signalSteuerAuto) {
                self.connector.unregisterSignals(self.signalSteuerAuto);
            };
            if (self.signalSteuerHandAus) {
                self.connector.unregisterSignals(self.signalSteuerHandAus);
            };
            if (self.signalSteuerHand1) {
                self.connector.unregisterSignals(self.signalSteuerHand1);
            };
            if (self.signalSteuerHand2) {
                self.connector.unregisterSignals(self.signalSteuerHand2);
            };
        };

        ccwventil3bmo.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil3bmo.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogST1(false);
            self.visibleDialogST2(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil3bmo.prototype.dialogAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAuto(true);
        };

        ccwventil3bmo.prototype.dialogAus = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAus(true);
        };

        ccwventil3bmo.prototype.dialogST1 = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogST1(true);
        };

        ccwventil3bmo.prototype.dialogST2 = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogST2(true);
        };

        ccwventil3bmo.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogST1(false);
            self.visibleDialogST2(false);
            self.show2(false);
        };

        ccwventil3bmo.prototype.setValueAuto = function () {
            var self = this;
            var signalName = self.signalSteuerAuto;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogAuto(false);
            self.show2(false);
        };

        ccwventil3bmo.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalSteuerHandAus;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogAus(false);
            self.show2(false);
        };

        ccwventil3bmo.prototype.setValueST1 = function () {
            var self = this;
            var signalName = self.signalSteuerHand1;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogST1(false);
            self.show2(false);
        };

        ccwventil3bmo.prototype.setValueST2 = function () {
            var self = this;
            var signalName = self.signalSteuerHand2;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogST2(false);
            self.show2(false);
        };

        return ccwventil3bmo;
    });