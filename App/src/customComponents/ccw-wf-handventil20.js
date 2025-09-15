define(['../services/connector'],

    function (signalsConnector) {
        var ccwhandventil20 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameVentil = (ko.unwrap(self.settings.nameVentil) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');

            self.ventilInfoText = ko.observable("");

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-handventil20-ventilAus';
                var cssC = 'ccw-wf-handventil20-ventilAus';
                var reverse = self.reverse;
                var ein = 0;

                if (self.signalEin !== '') {
                    var signalEin = self.connector.getSignal(self.signalEin).value;
                    ein = signalEin() & 0x1;
                }

                if (reverse == true) {
                    if (ein != 0) {
                        css1 = 'ccw-wf-handventil20-ventilZu';
                        cssC = 'ccw-wf-handventil20-ventilZu';
                        self.ventilInfoText = "Ventil muss geschlossen sein !";
                    } else {
                        css1 = 'ccw-wf-handventil20-ventilAuf';
                        cssC = 'ccw-wf-handventil20-ventilAuf';
                        self.ventilInfoText = "Ventil muss ge&ouml;ffnet sein !";
                    }
                } else {
                    if (ein != 0) {
                        css1 = 'ccw-wf-handventil20-ventilAuf';
                        cssC = 'ccw-wf-handventil20-ventilAuf';
                        self.ventilInfoText = "Ventil muss ge&ouml;ffnet sein !";
                    } else {
                        css1 = 'ccw-wf-handventil20-ventilZu';
                        cssC = 'ccw-wf-handventil20-ventilZu';
                        self.ventilInfoText = "Ventil muss geschlossen sein !";
                    }
                }
                return {
                    css1: css1,
                    cssC: cssC
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwhandventil20.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalEin) {
                self.connector.unregisterSignals(self.signalEin);
            };
        };

        ccwhandventil20.prototype.ventilInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal Ventil : " + self.signalEin, self.bmk + " " + self.nameVentil);
            }
        };

        ccwhandventil20.prototype.ventilInfo2 = function () {
            var self = this;

            toastr.info("", self.ventilInfoText);
        };

        return ccwhandventil20;
    });