define(['../services/connector'],

    function (signalsConnector) {
        var ccwStDialogLayer1w = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalStatus = (ko.unwrap(self.settings.signalStatus) || '');
            self.signalSteuer = (ko.unwrap(self.settings.signalSteuer) || '');
            self.signalSollwert = (ko.unwrap(self.settings.signalSollwert) || '');
            self.signalIstwert1 = (ko.unwrap(self.settings.signalIstwert1) || '');
            self.signalIstwert2 = (ko.unwrap(self.settings.signalIstwert2) || '');
            self.signalIstwert3 = (ko.unwrap(self.settings.signalIstwert3) || '');
            self.signalIstwert4 = (ko.unwrap(self.settings.signalIstwert4) || '');
            self.signalBtrStdGesamt = (ko.unwrap(self.settings.signalBtrStdGesamt) || '');
            self.signalBtrStdWartung = (ko.unwrap(self.settings.signalBtrStdWartung) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameObjekt = (ko.unwrap(self.settings.nameObjekt) || '');
            self.txtSollwert = (ko.unwrap(self.settings.txtSollwert) || '');
            self.staticUnitTextSoll = (ko.unwrap(self.settings.staticUnitTextSoll) || '');
            self.staticUnitText1 = (ko.unwrap(self.settings.staticUnitText1) || '');
            self.staticUnitText2 = (ko.unwrap(self.settings.staticUnitText2) || '');
            self.staticUnitText3 = (ko.unwrap(self.settings.staticUnitText3) || '');
            self.staticUnitText4 = (ko.unwrap(self.settings.staticUnitText4) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.steuerAktiv = ko.unwrap(self.settings.steuerAktiv) !== undefined ? ko.unwrap(self.settings.steuerAktiv) : true;
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.istwert1 = ko.unwrap(self.settings.signalIstwert1) !== undefined ? self.connector.getSignal(self.signalIstwert1).value : '';
            self.istwert2 = ko.unwrap(self.settings.signalIstwert2) !== undefined ? self.connector.getSignal(self.signalIstwert2).value : '';
            self.istwert3 = ko.unwrap(self.settings.signalIstwert3) !== undefined ? self.connector.getSignal(self.signalIstwert3).value : '';
            self.istwert4 = ko.unwrap(self.settings.signalIstwert4) !== undefined ? self.connector.getSignal(self.signalIstwert4).value : '';
            self.btrStdGesamt = ko.unwrap(self.settings.signalBtrStdGesamt) !== undefined ? self.connector.getSignal(self.signalBtrStdGesamt).value : '';
            self.btrStdWartung = ko.unwrap(self.settings.signalBtrStdWartung) !== undefined ? self.connector.getSignal(self.signalBtrStdWartung).value : '';

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialog2 = ko.observable(false);
            self.visibleDialogAuto = ko.observable(false);
            self.visibleDialogAus = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);

            if (self.istwert1 !== '') {
                self.istwert1 = self.istwert1.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            if (self.istwert2 !== '') {
                self.istwert2 = self.istwert2.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            if (self.istwert3 !== '') {
                self.istwert3 = self.istwert3.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            if (self.istwert4 !== '') {
                self.istwert4 = self.istwert4.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.visibleHand = ko.computed(function () {
                var self = this;
                var state = false;
                var farbStatusHand = self.farbStatusHand;
                var statusOnly = true;
                var steuer = 0;

                if (self.signalSteuer !== '') {
                    statusOnly = false;
                    steuer = self.connector.getSignal(self.signalSteuer).value();
                }

                if (((steuer == 0) || (steuer == 2)) && (farbStatusHand == false) && (statusOnly == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.observables.push(self.btnAuto = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var steuer = 0;

                if (self.signalSteuer !== '') {
                    steuer = self.connector.getSignal(self.signalSteuer).value();
                }

                if ((steuer == 1)) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnAus = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var steuer = 0;

                if (self.signalSteuer !== '') {
                    steuer = self.connector.getSignal(self.signalSteuer).value();
                }

                if (steuer == 0) {
                    css = 'btn-success';
                }
                return css;
            }, self));

            self.observables.push(self.btnEin = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var steuer = 0;

                if (self.signalSteuer !== '') {
                    steuer = self.connector.getSignal(self.signalSteuer).value();
                }

                if (steuer == 2) {
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

        ccwStDialogLayer1w.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalStatus) {
                self.connector.unregisterSignals(self.signalStatus);
            };
            if (self.signalSteuer) {
                self.connector.unregisterSignals(self.signalSteuer);
            };
            if (self.signalSollwert) {
                self.connector.unregisterSignals(self.signalSollwert);
            };
            if (self.signalIstwert1) {
                self.connector.unregisterSignals(self.signalIstwert1);
            };
            if (self.signalIstwert2) {
                self.connector.unregisterSignals(self.signalIstwert2);
            };
            if (self.signalIstwert3) {
                self.connector.unregisterSignals(self.signalIstwert3);
            };
            if (self.signalIstwert4) {
                self.connector.unregisterSignals(self.signalIstwert4);
            };
            if (self.signalBtrStdGesamt) {
                self.connector.unregisterSignals(self.signalBtrStdGesamt);
            };
            if (self.signalBtrStdWartung) {
                self.connector.unregisterSignals(self.signalBtrStdWartung);
            };
        };

        ccwStDialogLayer1w.prototype.objektDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwStDialogLayer1w.prototype.objektDialogClose1 = function () {
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

        ccwStDialogLayer1w.prototype.dialogAuto = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAuto(true);
        };

        ccwStDialogLayer1w.prototype.dialogAus = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAus(true);
        };

        ccwStDialogLayer1w.prototype.dialogEin = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogEin(true);
        };

        ccwStDialogLayer1w.prototype.dialogSenden = function () {
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

        ccwStDialogLayer1w.prototype.objektDialogClose2 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogEin(false);
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwStDialogLayer1w.prototype.setValueAuto = function () {
            var self = this;
            var signalName = self.signalSteuer;
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

        ccwStDialogLayer1w.prototype.setValueAus = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var values = {};

            values[signalName] = 0;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogAus(false);
            self.show2(false);
        };

        ccwStDialogLayer1w.prototype.setValueEin = function () {
            var self = this;
            var signalName = self.signalSteuer;
            var values = {};

            values[signalName] = 2;
            self.connector.writeSignals(values).then(function (result) {
                if (result.errorMessage) {
                    toastr.error(result.errorMessage);
                }
            });
            self.visibleDialogEin(false);
            self.show2(false);
        };

        ccwStDialogLayer1w.prototype.sendWerte = function () {
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

        return ccwStDialogLayer1w;
    });