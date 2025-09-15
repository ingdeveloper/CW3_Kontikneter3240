define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil2wc = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalZustand = (ko.unwrap(self.settings.signalZustand) || '');
            self.signalSteuer = (ko.unwrap(self.settings.signalSteuer) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.steuerAktiv = ko.unwrap(self.settings.steuerAktiv) !== undefined ? ko.unwrap(self.settings.steuerAktiv) : true;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialog2 = ko.observable(false);
            self.visibleDialogAuto = ko.observable(false);
            self.visibleDialogAus = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil2wc-ventilAus';
                var css2 = 'ccw-wf-ventil2wc-ventilAus';
                var statusOnly = true;
                var status = 0;
                var steuer = 0;

                if (self.signalZustand !== '') {
                    status = self.connector.getSignal(self.signalZustand).value();
                }
                if (self.signalSteuer !== '') {
                    statusOnly = false;
                    steuer = self.connector.getSignal(self.signalSteuer).value();
                }

                if (status == 1) {
                    css1 = 'ccw-wf-ventil2wc-ventilHand';
                    css2 = 'ccw-wf-ventil2wc-ventilStoerNeu';
                } else {
                    if (statusOnly == false) {
                        if ((steuer == 0) || (steuer == 2)) {
                            css2 = 'ccw-wf-ventil2wc-ventilHandAus';
                        }
                        if ((status == 2) && (steuer == 1)) {
                            css2 = 'ccw-wf-ventil2wc-ventilAutoEin';
                        }
                        if (((status == 2) || (status == 9)) && (steuer != 1)) {
                            css2 = 'ccw-wf-ventil2wc-ventilHandEin';
                        }
                    } else {
                        if ((status == 2)) {
                            css2 = 'ccw-wf-ventil2wc-ventilEin';
                        }
                        if ((status == 9)) {
                            css2 = 'ccw-wf-ventil2wc-ventilHandEin';
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2
                };
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

            self.connector.getOnlineUpdates();
        };

        ccwventil2wc.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalZustand) {
                self.connector.unregisterSignals(self.signalZustand);
            };
            if (self.signalSteuer) {
                self.connector.unregisterSignals(self.signalSteuer);
            };
        };

        ccwventil2wc.prototype.ventilDialog1 = function () {
            var self = this;

            if (self.dialogAktiv == true) {
                self.connector.clearSignalBuffer();
                self.show1(true);
                self.visibleDialog1(true);
            }
        };

        ccwventil2wc.prototype.ventilDialogClose1 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogEin(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwventil2wc.prototype.dialogAuto = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAuto(true);
        };

        ccwventil2wc.prototype.dialogAus = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogAus(true);
        };

        ccwventil2wc.prototype.dialogEin = function () {
            var self = this;
            self.show2(true);
            self.visibleDialogEin(true);
        };

        ccwventil2wc.prototype.ventilDialogClose2 = function () {
            var self = this;

            self.visibleDialogAuto(false);
            self.visibleDialogAus(false);
            self.visibleDialogEin(false);
            self.show2(false);
        };

        ccwventil2wc.prototype.setValueAuto = function () {
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

        ccwventil2wc.prototype.setValueAus = function () {
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

        ccwventil2wc.prototype.setValueEin = function () {
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

        return ccwventil2wc;
    });