define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil2bc2 = function (params) {
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
            self.signalStoer1 = (ko.unwrap(self.settings.signalStoer1) || '');
            self.signalStoer2 = (ko.unwrap(self.settings.signalStoer2) || '');
            self.signalSteuerAuto = (ko.unwrap(self.settings.signalSteuerAuto) || '');
            self.signalSteuerHandAus = (ko.unwrap(self.settings.signalSteuerHandAus) || '');
            self.signalSteuerHandEin = (ko.unwrap(self.settings.signalSteuerHandEin) || '');
            self.signalSollwert = (ko.unwrap(self.settings.signalSollwert) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.txtSollwert = (ko.unwrap(self.settings.txtSollwert) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogAuto = ko.observable(false);
            self.visibleDialogAus = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil2bc2-ventilAus';
                var css2 = 'ccw-wf-ventil2bc2-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var autoEin = 0;
                var autoAus = 0;
                var handEin = 0;
                var handAus = 0;
                var stoer1 = 0;
                var stoer2 = 0;

                if (self.signalStatusAutoEin !== '') {
                    var signalAutoEin = self.connector.getSignal(self.signalStatusAutoEin).value();
                    autoEin = signalAutoEin & 0x01;
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
                if (self.signalStoer1 !== '') {
                    var signalStoer1 = self.connector.getSignal(self.signalStoer1).value();
                    stoer1 = signalStoer1 & 0x01;
                }
                if (self.signalStoer2 !== '') {
                    var signalStoer2 = self.connector.getSignal(self.signalStoer2).value();
                    stoer2 = signalStoer2 & 0x01;
                }

                if ((stoer1 != 0) || (stoer2 != 0)) {
                    css1 = 'ccw-wf-ventil2bc2-ventilHand';
                    css2 = 'ccw-wf-ventil2bc2-ventilStoerNeu';
                } else {
                    if (farbStatusHand == true) {
                        if (autoAus != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilAutoAus';
                        }
                        if (handAus != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilHandAus';
                        }
                        if (autoEin != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilAutoEin';
                        }
                        if (handEin != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilHandEin';
                        }
                    } else {
                        if (autoAus != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilAus';
                        }
                        if (handAus != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilAus';
                        }
                        if (autoEin != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilEin';
                        }
                        if (handEin != 0) {
                            css2 = 'ccw-wf-ventil2bc2-ventilEin';
                        }
                    }
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

            self.observables.push(self.btnEin = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var ein = 0;

                if (self.signalSteuerHandEin !== '') {
                    var signalSteuerHandEin = self.connector.getSignal(self.signalSteuerHandEin).value();
                    ein = signalSteuerHandEin & 0x01;
                }

                if (ein != 0) {
                    css = 'btn-success';
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

        ccwventil2bc2.prototype.dispose = function () {
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
            if (self.signalSteuerHandEin) {
                self.connector.unregisterSignals(self.signalSteuerHandEin);
            };
            if (self.signalSollwert) {
                self.connector.unregisterSignals(self.signalSollwert);
            };
            if (self.signalIstwert) {
                self.connector.unregisterSignals(self.signalIstwert);
            };
        };

        ccwventil2bc2.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil2bc2.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogEin(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil2bc2.prototype.dialogAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAuto(true);
        };

        ccwventil2bc2.prototype.dialogAus = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogAus(true);
        };

        ccwventil2bc2.prototype.dialogEin = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogEin(true);
        };

        ccwventil2bc2.prototype.dialogSenden = function () {
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

        ccwventil2bc2.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogEin(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwventil2bc2.prototype.setValueAuto = function () {
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

        ccwventil2bc2.prototype.setValueAus = function () {
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

        ccwventil2bc2.prototype.setValueEin = function () {
            var self = this;
            var signalName = self.signalSteuerHandEin;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogEin(false);
            self.show2(false);
        };

        ccwventil2bc2.prototype.sendWerte = function () {
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

        return ccwventil2bc2;
    });