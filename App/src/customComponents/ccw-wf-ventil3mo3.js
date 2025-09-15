define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil3mo3 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');
            self.signalStoer = (ko.unwrap(self.settings.signalStoer) || '');
            self.signalIstwert = (ko.unwrap(self.settings.signalIstwert) || '');

            self.reverse = ko.unwrap(self.settings.reverse) !== undefined ? ko.unwrap(self.settings.reverse) : false;

            self.istwert = ko.unwrap(self.settings.signalIstwert) !== undefined ? self.connector.getSignal(self.signalIstwert).value : '';

            if (self.istwert !== '') {
                self.istwert = self.istwert.extend({
                    numeric: 1,
                    numeralNumber: '0,0.0'
                });
            }

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil3mo3-ventilAus';
                var css2 = 'ccw-wf-ventil3mo3-ventilAus';
                var css3 = 'ccw-wf-ventil3mo3-ventilAus';
                var cssC = 'ccw-wf-ventil3mo3-ventilAus';
                var cssM = 'ccw-wf-ventil3mo3-ventilAus';
                var reverse = self.reverse;
                var ein = 0;
                var stoer = 0;
                var istwert = self.istwert().replace(",", ".");

                if (self.signalEin !== '') {
                    var signalEin = self.connector.getSignal(self.signalEin).value;
                    ein = signalEin() & 0x1;
                }

                if (self.signalStoer !== '') {
                    var signalStoer = self.connector.getSignal(self.signalStoer).value;
                    stoer = signalStoer() & 0x1;
                }

                if (stoer != 0) {
                    css1 = 'ccw-wf-ventil3mo3-ventilStoerNeu';
                    css2 = 'ccw-wf-ventil3mo3-ventilStoerNeu';
                    css3 = 'ccw-wf-ventil3mo3-ventilStoerNeu';
                    cssC = 'ccw-wf-ventil3mo3-ventilStoerNeu';
                    cssM = 'ccw-wf-ventil3mo3-ventilStoerNeu';
                } else {
                    if (ein != 0) {
                        cssC = 'ccw-wf-ventil3mo3-ventilEin';
                        cssM = 'ccw-wf-ventil3mo3-ventilEin';
                    } else {
                        cssC = 'ccw-wf-ventil3mo3-ventilAus';
                        cssM = 'ccw-wf-ventil3mo3-ventilAus';
                    }

                    if (reverse == true) {
                        if (istwert <= 0) {
                            css1 = 'ccw-wf-ventil3mo3-ventilAus';
                            css2 = 'ccw-wf-ventil3mo3-ventilEin';
                            css3 = 'ccw-wf-ventil3mo3-ventilEin';
                        }

                        if ((istwert > 0) && (istwert < 100)) {
                            css1 = 'ccw-wf-ventil3mo3-ventilEin';
                            css2 = 'ccw-wf-ventil3mo3-ventilEin';
                            css3 = 'ccw-wf-ventil3mo3-ventilEin';
                        }

                        if (istwert >= 100) {
                            css1 = 'ccw-wf-ventil3mo3-ventilEin';
                            css2 = 'ccw-wf-ventil3mo3-ventilAus';
                            css3 = 'ccw-wf-ventil3mo3-ventilEin';
                        }
                    } else {
                        if (istwert <= 0) {
                            css1 = 'ccw-wf-ventil3mo3-ventilEin';
                            css2 = 'ccw-wf-ventil3mo3-ventilEin';
                            css3 = 'ccw-wf-ventil3mo3-ventilAus';
                        }

                        if ((istwert > 0) && (istwert < 100)) {
                            css1 = 'ccw-wf-ventil3mo3-ventilEin';
                            css2 = 'ccw-wf-ventil3mo3-ventilEin';
                            css3 = 'ccw-wf-ventil3mo3-ventilEin';
                        }

                        if (istwert >= 100) {
                            css1 = 'ccw-wf-ventil3mo3-ventilEin';
                            css2 = 'ccw-wf-ventil3mo3-ventilAus';
                            css3 = 'ccw-wf-ventil3mo3-ventilEin';
                        }
                    }
                }
                return {
                    css1: css1,
                    css2: css2,
                    css3: css3,
                    cssC: cssC,
                    cssM: cssM
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwventil3mo3.prototype.dispose = function () {
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
            if (self.signalIstwert) {
                self.connector.unregisterSignals(self.signalIstwert);
            };
        };

        return ccwventil3mo3;
    });