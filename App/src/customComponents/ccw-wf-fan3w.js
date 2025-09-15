define(['../services/connector'],

    function (signalsConnector) {
        var ccwfan3w = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalZustand = (ko.unwrap(self.settings.signalZustand) || '');

            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');

            self.observables.push(self.mDirection = ko.computed(function () {
                var self = this;
                var motorDirection = self.ausrichtung;
                var scaleX = '-1';
                var scaleY = '-1';

                if (motorDirection < 0) {
                    scaleY = '1';
                } else {
                    scaleY = '-1';
                }
                return 'rotate(' + motorDirection + 'deg) scale(' + scaleX + ',' + scaleY + ')';
            }, self));

            self.observables.push(self.mStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-fan3w-antriebAus';
                var css2 = 'ccw-wf-fan3w-antriebAus';
                var value = self.connector.getSignal(self.signalZustand).value();
                switch (value) {
                    case 0:
                        css2 = 'ccw-wf-fan3w-antriebAus';
                        break;
                    case 1:
                        css1 = 'ccw-wf-fan3w-antriebHand';
                        css2 = 'ccw-wf-fan3w-antriebStoerNeu';
                        break;
                    case 2:
                        css2 = 'ccw-wf-fan3w-antriebEin';
                        break;
                    default:
                        css2 = 'ccw-wf-fan3w-antriebAus';
                }
                return {
                    css1: css1,
                    css2: css2
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwfan3w.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalZustand) {
                self.connector.unregisterSignals(self.signalZustand);
            };
        };

        return ccwfan3w;
    });