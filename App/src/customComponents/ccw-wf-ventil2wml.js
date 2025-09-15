define(['../services/connector'],

    function (signalsConnector) {
        var ccwventil2wml = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalZustand = (ko.unwrap(self.settings.signalZustand) || '');

            self.observables.push(self.vStyle = ko.computed(function () {
                var self = this;
                var css1 = 'ccw-wf-ventil2wml-ventilAus';
                var css2 = 'ccw-wf-ventil2wml-ventilAus';
                var value = self.connector.getSignal(self.signalZustand).value();
                switch (value) {
                    case 0:
                        css2 = 'ccw-wf-ventil2wml-ventilAus';
                        break;
                    case 1:
                        css1 = 'ccw-wf-ventil2wml-ventilHand';
                        css2 = 'ccw-wf-ventil2wml-ventilStoerNeu';
                        break;
                    case 2:
                        css2 = 'ccw-wf-ventil2wml-ventilEin';
                        break;
                    case 3:
                        css2 = 'ccw-wf-ventil2wml-ventilEin';
                        break;
                    default:
                        css2 = 'ccw-wf-ventil2wml-ventilAus';
                }
                return {
                    css1: css1,
                    css2: css2
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwventil2wml.prototype.dispose = function () {
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

        return ccwventil2wml;
    });