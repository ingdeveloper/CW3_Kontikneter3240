define(['../services/connector'],

    function (signalsConnector) {
        var ccwkvd1w = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalZustand = (ko.unwrap(self.settings.signalZustand) || '');
            self.signalBetriebsart = (ko.unwrap(self.settings.signalBetriebsart) || '');

            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;

            self.observables.push(self.vDirection = ko.computed(function () {
                var self = this;
                var ausrichtung = self.ausrichtung;
                var scaleX = '1';
                var scaleY = '1';

                if (ausrichtung < 0) {
                    scaleY = '-1';
                } else {
                    scaleY = '1';
                }
                return 'rotate(' + ausrichtung + 'deg) scale(' + scaleX + ',' + scaleY + ')';
            }, self));

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-kvd1w-antriebAus';
                var css2 = 'ccw-wf-kvd1w-antriebAus';
                var farbStatusHand = self.farbStatusHand;
                var zustandOnly = true;
                var zustand = 0;
                var betriebsart = 0;

                if (self.signalZustand !== '') {
                    zustand = self.connector.getSignal(self.signalZustand).value();
                }
                if (self.signalBetriebsart !== '') {
                    zustandOnly = false;
                    betriebsart = self.connector.getSignal(self.signalBetriebsart).value();
                }

                if (zustand == 1) {
                    css1 = 'ccw-wf-kvd1w-antriebHand';
                    css2 = 'ccw-wf-kvd1w-antriebStoerNeu';
                } else {
                    if ((farbStatusHand == true) && (zustandOnly == false)) {
                        if ((betriebsart == 0) || (betriebsart == 2)) {
                            css2 = 'ccw-wf-kvd1w-antriebHand';
                        }
                        if ((zustand == 2) && (betriebsart == 1)) {
                            css2 = 'ccw-wf-kvd1w-antriebEin';
                        }
                        if ((zustand == 2) && (betriebsart != 1)) {
                            css2 = 'ccw-wf-kvd1w-antriebHandEin';
                        }
                    } else {
                        if ((zustand == 2)) {
                            css2 = 'ccw-wf-kvd1w-antriebEin';
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
                var zustandOnly = true;
                var betriebsart = 0;

                if (self.signalBetriebsart !== '') {
                    zustandOnly = false;
                    betriebsart = self.connector.getSignal(self.signalBetriebsart).value();
                }

                if (((betriebsart == 0) || (betriebsart == 2)) && (farbStatusHand == false) && (zustandOnly == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwkvd1w.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalZustand) {
                self.connector.unregisterSignals(self.signalZustand);
            };
            if (self.signalBetriebsart) {
                self.connector.unregisterSignals(self.signalBetriebsart);
            };
        };

        return ccwkvd1w;
    });