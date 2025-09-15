define(['../services/connector'],

    function (signalsConnector) {
        var ccwfan4vdk = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalStatusAutoSchnell = (ko.unwrap(self.settings.signalStatusAutoSchnell) || '');
            self.signalStatusAutoAus = (ko.unwrap(self.settings.signalStatusAutoAus) || '');
            self.signalStatusHandSchnell = (ko.unwrap(self.settings.signalStatusHandSchnell) || '');
            self.signalStatusHandAus = (ko.unwrap(self.settings.signalStatusHandAus) || '');
            self.signalStatusAutoLangsam = (ko.unwrap(self.settings.signalStatusAutoLangsam) || '');
            self.signalStatusHandLangsam = (ko.unwrap(self.settings.signalStatusHandLangsam) || '');
            self.signalStoer1 = (ko.unwrap(self.settings.signalStoer1) || '');
            self.signalStoer2 = (ko.unwrap(self.settings.signalStoer2) || '');
            self.signalStoer3 = (ko.unwrap(self.settings.signalStoer3) || '');
            self.signalSteuerAuto = (ko.unwrap(self.settings.signalSteuerAuto) || '');
            self.signalSteuerHandAus = (ko.unwrap(self.settings.signalSteuerHandAus) || '');
            self.signalSteuerHandLangsam = (ko.unwrap(self.settings.signalSteuerHandLangsam) || '');
            self.signalSteuerHandSchnell = (ko.unwrap(self.settings.signalSteuerHandSchnell) || '');
            self.signalSollwert = (ko.unwrap(self.settings.signalSollwert) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');
            self.signalBtrStdGesamt = (ko.unwrap(self.settings.signalBtrStdGesamt) || '');
            self.signalBtrStdWartung = (ko.unwrap(self.settings.signalBtrStdWartung) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameAntrieb = (ko.unwrap(self.settings.nameAntrieb) || '');
            self.txtSollwert = (ko.unwrap(self.settings.txtSollwert) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.steuerAktiv = ko.unwrap(self.settings.steuerAktiv) !== undefined ? ko.unwrap(self.settings.steuerAktiv) : true;
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.animation = ko.computed(function () {
                var erg = false;
                if (self.settings.animation !== undefined) {
                    erg = ko.unwrap(self.settings.animation);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';
            self.btrStdGesamt = ko.unwrap(self.settings.signalBtrStdGesamt) !== undefined ? self.connector.getSignal(self.signalBtrStdGesamt).value : '';
            self.btrStdWartung = ko.unwrap(self.settings.signalBtrStdWartung) !== undefined ? self.connector.getSignal(self.signalBtrStdWartung).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialog2 = ko.observable(false);
            self.visibleDialogAuto = ko.observable(false);
            self.visibleDialogAus = ko.observable(false);
            self.visibleDialogLangsam = ko.observable(false);
            self.visibleDialogSchnell = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.mStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-fan4vdk-antriebAus';
                var css2 = 'ccw-wf-fan4vdk-antriebAus';
                var autoSchnell = 0;
                var autoAus = 0;
                var handSchnell = 0;
                var handAus = 0;
                var autoLangsam = 0;
                var handLangsam = 0;
                var stoer1 = 0;
                var stoer2 = 0;
                var stoer3 = 0;

                if (self.signalStatusAutoSchnell !== '') {
                    var signalAutoSchnell = self.connector.getSignal(self.signalStatusAutoSchnell).value();
                    autoSchnell = signalAutoSchnell & 0x01;
                }
                if (self.signalStatusAutoAus !== '') {
                    var signalAutoAus = self.connector.getSignal(self.signalStatusAutoAus).value();
                    autoAus = signalAutoAus & 0x01;
                }
                if (self.signalStatusHandSchnell !== '') {
                    var signalHandSchnell = self.connector.getSignal(self.signalStatusHandSchnell).value();
                    handSchnell = signalHandSchnell & 0x01;
                }
                if (self.signalStatusHandAus !== '') {
                    var signalHandAus = self.connector.getSignal(self.signalStatusHandAus).value();
                    handAus = signalHandAus & 0x01;
                }
                if (self.signalStatusAutoLangsam !== '') {
                    var signalAutoLangsam = self.connector.getSignal(self.signalStatusAutoLangsam).value();
                    autoLangsam = signalAutoLangsam & 0x01;
                }
                if (self.signalStatusHandLangsam !== '') {
                    var signalHandLangsam = self.connector.getSignal(self.signalStatusHandLangsam).value();
                    handLangsam = signalHandLangsam & 0x01;
                }
                if (self.signalStoer1 !== '') {
                    var signalStoer1 = self.connector.getSignal(self.signalStoer1).value();
                    stoer1 = signalStoer1 & 0x01;
                }
                if (self.signalStoer2 !== '') {
                    var signalStoer2 = self.connector.getSignal(self.signalStoer2).value();
                    stoer2 = signalStoer2 & 0x01;
                }
                if (self.signalStoer3 !== '') {
                    var signalStoer3 = self.connector.getSignal(self.signalStoer3).value();
                    stoer3 = signalStoer3 & 0x01;
                }

                if ((self.signalSollwert !== '') && (self.signalSollwert !== undefined)) {
                    if ((stoer1 != 0) || (stoer2 != 0) || (stoer3 != 0)) {
                        css1 = 'ccw-wf-fan4vdk-antriebHand';
                        css2 = 'ccw-wf-fan4vdk-antriebStoerNeu';
                    } else {
                        if (autoAus != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebAutoAus';
                        }
                        if (handAus != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebHandAus';
                        }
                        if (autoSchnell != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebAutoEin';
                        }
                        if (handSchnell != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebHandEin';
                        }
                    }
                } else {
                    if ((stoer1 != 0) || (stoer2 != 0) || (stoer3 != 0)) {
                        css1 = 'ccw-wf-fan4vdk-antriebHand';
                        css2 = 'ccw-wf-fan4vdk-antriebStoerNeu';
                    } else {
                        if (autoAus != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebAutoAus';
                        }
                        if (handAus != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebHandAus';
                        }
                        if (autoSchnell != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebAutoSchnell';
                        }
                        if (handSchnell != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebHandSchnell';
                        }
                        if (autoLangsam != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebAutoLangsam';
                        }
                        if (handLangsam != 0) {
                            css2 = 'ccw-wf-fan4vdk-antriebHandLangsam';
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2
                };
            }, self));

            self.observables.push(self.mAnimation = ko.computed(function () {
                var self = this;
                var css = '';
                var animation = self.animation();
                var autoSchnell = 0;
                var handSchnell = 0;
                var autoLangsam = 0;
                var handLangsam = 0;

                if (self.signalStatusAutoSchnell !== '') {
                    var signalAutoSchnell = self.connector.getSignal(self.signalStatusAutoSchnell).value();
                    autoSchnell = signalAutoSchnell & 0x01;
                }
                if (self.signalStatusHandSchnell !== '') {
                    var signalHandSchnell = self.connector.getSignal(self.signalStatusHandSchnell).value();
                    handSchnell = signalHandSchnell & 0x01;
                }
                if (self.signalStatusAutoLangsam !== '') {
                    var signalAutoLangsam = self.connector.getSignal(self.signalStatusAutoLangsam).value();
                    autoLangsam = signalAutoLangsam & 0x01;
                }
                if (self.signalStatusHandLangsam !== '') {
                    var signalHandLangsam = self.connector.getSignal(self.signalStatusHandLangsam).value();
                    handLangsam = signalHandLangsam & 0x01;
                }

                if ((self.signalSollwert !== '') && (self.signalSollwert !== undefined)) {
                    if (((autoSchnell != 0) || (handSchnell != 0)) && (animation == true)) {
                        css = 'ccw-wf-fan4vdk-rotorAni-schnell';
                    }
                } else {
                    if (((autoSchnell != 0) || (handSchnell != 0)) && (animation == true)) {
                        css = 'ccw-wf-fan4vdk-rotorAni-schnell';
                    }
                    if (((autoLangsam != 0) || (handLangsam != 0)) && (animation == true)) {
                        css = 'ccw-wf-fan4vdk-rotorAni-langsam';
                    }
                }
                return css;
            }, self));

            self.observables.push(self.visibleHand = ko.computed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var handSchnell = 0;
                var handAus = 0;
                var handLangsam = 0;

                if (self.signalStatusHandSchnell !== '') {
                    var signalHandSchnell = self.connector.getSignal(self.signalStatusHandSchnell).value();
                    handSchnell = signalHandSchnell & 0x01;
                }
                if (self.signalStatusHandAus !== '') {
                    var signalHandAus = self.connector.getSignal(self.signalStatusHandAus).value();
                    handAus = signalHandAus & 0x01;
                }
                if (self.signalStatusHandLangsam !== '') {
                    var signalHandLangsam = self.connector.getSignal(self.signalStatusHandLangsam).value();
                    handLangsam = signalHandLangsam & 0x01;
                }

                if (((handSchnell != 0) || (handAus != 0) || (handLangsam != 0)) && (farbStatusHand == false)) {
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

            self.observables.push(self.btnLangsam = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var langsam = 0;

                if (self.signalSteuerHandLangsam !== '') {
                    var signalSteuerHandLangsam = self.connector.getSignal(self.signalSteuerHandLangsam).value();
                    langsam = signalSteuerHandLangsam & 0x01;
                }

                if (langsam != 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnSchnell = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var schnell = 0;

                if (self.signalSteuerHandSchnell !== '') {
                    var signalSteuerHandSchnell = self.connector.getSignal(self.signalSteuerHandSchnell).value();
                    schnell = signalSteuerHandSchnell & 0x01;
                }

                if (schnell != 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.stufe = ko.computed(function () {
                var self = this;
                var txt = 'Aus';
                var autoSchnell = 0;
                var autoAus = 0;
                var handSchnell = 0;
                var handAus = 0;
                var autoLangsam = 0;
                var handLangsam = 0;

                if (self.signalStatusAutoSchnell !== '') {
                    var signalAutoSchnell = self.connector.getSignal(self.signalStatusAutoSchnell).value();
                    autoSchnell = signalAutoSchnell & 0x01;
                }
                if (self.signalStatusAutoAus !== '') {
                    var signalAutoAus = self.connector.getSignal(self.signalStatusAutoAus).value();
                    autoAus = signalAutoAus & 0x01;
                }
                if (self.signalStatusHandSchnell !== '') {
                    var signalHandSchnell = self.connector.getSignal(self.signalStatusHandSchnell).value();
                    handSchnell = signalHandSchnell & 0x01;
                }
                if (self.signalStatusHandAus !== '') {
                    var signalHandAus = self.connector.getSignal(self.signalStatusHandAus).value();
                    handAus = signalHandAus & 0x01;
                }
                if (self.signalStatusAutoLangsam !== '') {
                    var signalAutoLangsam = self.connector.getSignal(self.signalStatusAutoLangsam).value();
                    autoLangsam = signalAutoLangsam & 0x01;
                }
                if (self.signalStatusHandLangsam !== '') {
                    var signalHandLangsam = self.connector.getSignal(self.signalStatusHandLangsam).value();
                    handLangsam = signalHandLangsam & 0x01;
                }

                if ((autoAus != 0) || (handAus != 0)) {
                    txt = 'Aus';
                }
                if ((autoSchnell != 0) || (handSchnell != 0)) {
                    txt = 'Schnell';
                }
                if ((autoLangsam != 0) || (handLangsam != 0)) {
                    txt = 'Langsam';
                }
                return txt;
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

        ccwfan4vdk.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalStatusAutoSchnell) {
                self.connector.unregisterSignals(self.signalStatusAutoSchnell);
            };
            if (self.signalStatusAutoAus) {
                self.connector.unregisterSignals(self.signalStatusAutoAus);
            };
            if (self.signalStatusHandSchnell) {
                self.connector.unregisterSignals(self.signalStatusHandSchnell);
            };
            if (self.signalStatusHandAus) {
                self.connector.unregisterSignals(self.signalStatusHandAus);
            };
            if (self.signalStatusAutoLangsam) {
                self.connector.unregisterSignals(self.signalStatusAutoLangsam);
            };
            if (self.signalStatusHandLangsam) {
                self.connector.unregisterSignals(self.signalStatusHandLangsam);
            };
            if (self.signalStoer1) {
                self.connector.unregisterSignals(self.signalStoer1);
            };
            if (self.signalStoer2) {
                self.connector.unregisterSignals(self.signalStoer2);
            };
            if (self.signalStoer3) {
                self.connector.unregisterSignals(self.signalStoer3);
            };
            if (self.signalSteuerAuto) {
                self.connector.unregisterSignals(self.signalSteuerAuto);
            };
            if (self.signalSteuerHandAus) {
                self.connector.unregisterSignals(self.signalSteuerHandAus);
            };
            if (self.signalSteuerHandLangsam) {
                self.connector.unregisterSignals(self.signalSteuerHandLangsam);
            };
            if (self.signalSteuerHandSchnell) {
                self.connector.unregisterSignals(self.signalSteuerHandSchnell);
            };
            if (self.signalSollwert) {
                self.connector.unregisterSignals(self.signalSollwert);
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

        ccwfan4vdk.prototype.antriebDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwfan4vdk.prototype.antriebDialogClose1 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogLangsam(false);
            self.visibleDialogSchnell(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwfan4vdk.prototype.dialogAuto = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAuto(true);
        };

        ccwfan4vdk.prototype.dialogAus = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAus(true);
        };

        ccwfan4vdk.prototype.dialogLangsam = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogLangsam(true);
        };

        ccwfan4vdk.prototype.dialogSchnell = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogSchnell(true);
        };

        ccwfan4vdk.prototype.dialogSenden = function () {
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

        ccwfan4vdk.prototype.antriebDialogClose2 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogLangsam(false);
            self.visibleDialogSchnell(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwfan4vdk.prototype.setValueAuto = function () {
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

        ccwfan4vdk.prototype.setValueAus = function () {
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

        ccwfan4vdk.prototype.setValueLangsam = function () {
            var self = this;
            var signalName = self.signalSteuerHandLangsam;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogLangsam(false);
            self.show2(false);
        };

        ccwfan4vdk.prototype.setValueSchnell = function () {
            var self = this;
            var signalName = self.signalSteuerHandSchnell;
            var values = {};

            values[signalName] = 1;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogSchnell(false);
            self.show2(false);
        };

        ccwfan4vdk.prototype.sendWerte = function () {
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

        return ccwfan4vdk;
    });