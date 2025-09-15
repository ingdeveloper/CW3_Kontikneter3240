define(['../services/connector'],

    function (signalsConnector) {
        var ccwStDialogLayer1b = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalSteuer = (ko.unwrap(self.settings.signalSteuer) || '');
            self.signalSollwert1 = (ko.unwrap(self.settings.signalSollwert1) || '');
            self.signalSollwert2 = (ko.unwrap(self.settings.signalSollwert2) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');
            self.signalBtrStdGesamt = (ko.unwrap(self.settings.signalBtrStdGesamt) || '');
            self.signalBtrStdWartung = (ko.unwrap(self.settings.signalBtrStdWartung) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameObjekt = (ko.unwrap(self.settings.nameObjekt) || '');
            self.txtSollwert1 = (ko.unwrap(self.settings.txtSollwert1) || '');
            self.txtSollwert2 = (ko.unwrap(self.settings.txtSollwert2) || '');
            self.txtBtnEin = (ko.unwrap(self.settings.txtBtnEin) || 'Ein');
            self.txtBtnEin1 = (ko.unwrap(self.settings.txtBtnEin1) || 'Rechts');
            self.txtBtnEin2 = (ko.unwrap(self.settings.txtBtnEin2) || 'Links');
            self.txtBtnAus = (ko.unwrap(self.settings.txtBtnAus) || 'Aus');
            self.txtEin = (ko.unwrap(self.settings.txtEin) || 'Einschalten');
            self.txtEin1 = (ko.unwrap(self.settings.txtEin1) || 'Rechtslauf einschalten');
            self.txtEin2 = (ko.unwrap(self.settings.txtEin2) || 'Linkslauf einschalten');
            self.txtAus = (ko.unwrap(self.settings.txtAus) || 'Ausschalten');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.steuerAktiv = ko.unwrap(self.settings.steuerAktiv) !== undefined ? ko.unwrap(self.settings.steuerAktiv) : true;
            self.linkslaufAktiv = ko.unwrap(self.settings.linkslaufAktiv) !== undefined ? ko.unwrap(self.settings.linkslaufAktiv) : false;
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.signalValue = self.connector.getSignal(self.signalSteuer).value;
            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';
            self.btrStdGesamt = ko.unwrap(self.settings.signalBtrStdGesamt) !== undefined ? self.connector.getSignal(self.signalBtrStdGesamt).value : '';
            self.btrStdWartung = ko.unwrap(self.settings.signalBtrStdWartung) !== undefined ? self.connector.getSignal(self.signalBtrStdWartung).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialog2 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);
            self.visibleDialogEin1 = ko.observable(false);
            self.visibleDialogEin2 = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.visibleHand = ko.computed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var signal = self.connector.getSignal(self.signalSteuer);
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
                var signal = self.connector.getSignal(self.signalSteuer);
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
                var signal = self.connector.getSignal(self.signalSteuer);
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
                var signal = self.connector.getSignal(self.signalSteuer);
                var value = signal.value();
                var Ein = (((value & 0x01) >> 0) || ((value & 0x04) >> 2));

                if (Ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.observables.push(self.btnEin1 = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var signal = self.connector.getSignal(self.signalSteuer);
                var value = signal.value();
                var Ein = ((value & 0x01) >> 0);

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
                var signal = self.connector.getSignal(self.signalSteuer);
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

        ccwStDialogLayer1b.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalSteuer) {
                self.connector.unregisterSignals(self.signalSteuer);
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

        ccwStDialogLayer1b.prototype.objektDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwStDialogLayer1b.prototype.objektDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialogEin1(false);
            self.visibleDialogEin2(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwStDialogLayer1b.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwStDialogLayer1b.prototype.dialogEin = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    self.show2(true);
                    self.visibleDialogEin(true);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwStDialogLayer1b.prototype.dialogEin1 = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    self.show2(true);
                    self.visibleDialogEin1(true);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwStDialogLayer1b.prototype.dialogEin2 = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    self.show2(true);
                    self.visibleDialogEin2(true);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwStDialogLayer1b.prototype.dialogSenden = function () {
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

        ccwStDialogLayer1b.prototype.objektDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialogEin1(false);
            self.visibleDialogEin2(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwStDialogLayer1b.prototype.setValueHand = function () {
            var self = this;
            var signalName = self.signalSteuer;
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

        ccwStDialogLayer1b.prototype.setValueEin1 = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);
            var setWert = (0x01) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogEin(false);
                    self.visibleDialogEin1(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwStDialogLayer1b.prototype.setValueEin2 = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);
            var setWert = (0x04) ^ (value());
            var values = {};

            if (Hand != 0) {
                if ((Ein1 == 0) && (Ein2 == 0)) {
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.visibleDialogEin2(false);
                    self.show2(false);
                }
            } else {
                toastr.error("Schalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwStDialogLayer1b.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var value = self.connector.getSignal(signalName).value;
            var Ein1 = ((value() & 0x01) >> 0);
            var Hand = ((value() & 0x02) >> 1);
            var Ein2 = ((value() & 0x04) >> 2);
            var values = {};

            if (Hand != 0) {
                if ((Ein1 != 0) && (Ein2 == 0)) {
                    var setWert = (0x01) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Ein1 == 0) && (Ein2 != 0)) {
                    var setWert = (0x04) ^ (value());
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
                if ((Ein1 != 0) && (Ein2 != 0)) {
                    var setWert = (0x05) ^ (value());
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

        ccwStDialogLayer1b.prototype.sendWerte = function () {
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

        return ccwStDialogLayer1b;
    });