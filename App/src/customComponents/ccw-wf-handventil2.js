define(['../services/connector'],

    function (signalsConnector) {
        var ccwhandventil2 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');
            self.signalStoer = (ko.unwrap(self.settings.signalStoer) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-handventil2-ventilAus';
                var cssC = 'ccw-wf-handventil2-ventilAus';
                var ein = 0;
                var stoer = 0;
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist

                if (self.signalEin !== '') {
                    var signalEin = self.connector.getSignal(self.signalEin).value;
                    ein = signalEin() & 0x1;
                    // Ohne Signal auswerten
                    if ((signalEin() === undefined) || (signalEin() === null)) {
                        ohneSignal = true;
                        console.log("Ohne Signal: " + self.signalEin);
                    }
                }

                if (self.signalStoer !== '') {
                    var signalStoer = self.connector.getSignal(self.signalStoer).value;
                    stoer = signalStoer() & 0x1;
                }

                if (ohneSignal) {
                    css1 = 'ccw-wf-handventil2-ventilOhneSignal';
                    cssC = 'ccw-wf-handventil2-ventilOhneSignal';
                } else if (stoer != 0) {
                    css1 = 'ccw-wf-handventil2-ventilStoerNeu';
                    cssC = 'ccw-wf-handventil2-ventilStoer';
                } else {
                    if ((ein != 0) && !self.reverse) { //geändert amueller 13.07.2018
                        css1 = 'ccw-wf-handventil2-ventilEin';
                        cssC = 'ccw-wf-handventil2-ventilEin';
                    }
                    if ((ein == 0) && self.reverse) { //geändert amueller 13.07.2018
                        css1 = 'ccw-wf-handventil2-ventilEin';
                        cssC = 'ccw-wf-handventil2-ventilEin';
                    }
                }
                return {
                    css1: css1,
                    cssC: cssC
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwhandventil2.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalEin) {
                self.connector.unregisterSignals(self.signalEin);
            };
            if (self.signalStoer) {
                self.connector.unregisterSignals(self.signalStoer);
            };
        };

        ccwhandventil2.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalEin + " " + self.signalStoer, self.bmk + " " + self.nameVentil);
            }
        };

        return ccwhandventil2;
    });