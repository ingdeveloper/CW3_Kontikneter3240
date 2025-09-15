define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil2mo = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalVentil = (ko.unwrap(self.settings.signalVentil) || '');
            self.signalSollwert = (ko.unwrap(self.settings.signalSollwert) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
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
            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil2mo-ventilAus';
                var cssC = 'ccw-wf-ventil2mo-ventilAus';
                var cssM = 'ccw-wf-ventil2mo-ventilAus';
                var farbStatusHand = self.farbStatusHand;
                var value = self.signalValue();
                var istwert = self.istwert().replace(",", ".");
                var auf = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css1 = 'ccw-wf-ventil2mo-ventilStoerNeu';
                        cssC = 'ccw-wf-ventil2mo-ventilStoerNeu';
                        cssM = 'ccw-wf-ventil2mo-ventilStoerNeu';
                    } else {
                        css1 = 'ccw-wf-ventil2mo-ventilStoer';
                        cssC = 'ccw-wf-ventil2mo-ventilStoer';
                        cssM = 'ccw-wf-ventil2mo-ventilStoer';
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if (auf != 0) {
                            cssC = 'ccw-wf-ventil2mo-ventilHandEin';
                            cssM = 'ccw-wf-ventil2mo-ventilHandEin';
                        } else {
                            cssC = 'ccw-wf-ventil2mo-ventilHand';
                            cssM = 'ccw-wf-ventil2mo-ventilHand';
                        }
                        if (istwert < 1) {
                            css1 = 'ccw-wf-ventil2mo-ventilHand';
                        }
                        if (istwert >= 1) {
                            css1 = 'ccw-wf-ventil2mo-ventilHandEin';
                        }
                    } else {
                        if (auf != 0) {
                            cssC = 'ccw-wf-ventil2mo-ventilEin';
                            cssM = 'ccw-wf-ventil2mo-ventilEin';
                        } else {
                            cssC = 'ccw-wf-ventil2mo-ventilAus';
                            cssM = 'ccw-wf-ventil2mo-ventilAus';
                        }
                        if (istwert < 1) {
                            css1 = 'ccw-wf-ventil2mo-ventilAus';
                        }
                        if (istwert >= 1) {
                            css1 = 'ccw-wf-ventil2mo-ventilEin';
                        }
                    }
                }
                return {
                    css1: css1,
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
                console.log("freigabeHandBetrieb " + status);
                return status;
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

        ccwventil2mo.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalVentil) {
                self.connector.unregisterSignals(self.signalVentil);
            };
            if (self.signalSollwert) {
                self.connector.unregisterSignals(self.signalSollwert);
            };
            if (self.signalIstwert) {
                self.connector.unregisterSignals(self.signalIstwert);
            };
        };

        ccwventil2mo.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalVentil, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil2mo.prototype.sollwertInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Sollwert : " + self.signalSollwert, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil2mo.prototype.istwertInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Istwert : " + self.signalIstwert, self.bmk + " " + self.nameVentil);
            }
        };

        ccwventil2mo.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil2mo.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil2mo.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwventil2mo.prototype.dialogSenden = function () {
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

        ccwventil2mo.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwventil2mo.prototype.setValueHand = function () {
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

        ccwventil2mo.prototype.sendWerte = function () {
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

        return ccwventil2mo;
    });