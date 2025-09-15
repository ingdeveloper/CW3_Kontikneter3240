define(['../services/connector'],

    function (signalsConnector) {
        var ccwsvd1b = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');
            self.signalHand = (ko.unwrap(self.settings.signalHand) || '');
            self.signalStoer1 = (ko.unwrap(self.settings.signalStoer1) || '');
            self.signalStoer2 = (ko.unwrap(self.settings.signalStoer2) || '');
            self.signalStoer1Q = (ko.unwrap(self.settings.signalStoer1Q) || '');
            self.signalStoer2Q = (ko.unwrap(self.settings.signalStoer2Q) || '');

            self.stoer1warn = ko.unwrap(self.settings.stoer1warn) !== undefined ? ko.unwrap(self.settings.stoer1warn) : false;
            self.stoer2warn = ko.unwrap(self.settings.stoer2warn) !== undefined ? ko.unwrap(self.settings.stoer2warn) : false;
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
                var css1 = 'ccw-wf-svd1b-antriebAus';
                var css2 = 'ccw-wf-svd1b-antriebAus';
                var stoer1warn = self.stoer1warn;
                var stoer2warn = self.stoer2warn;
                var farbStatusHand = self.farbStatusHand;
                var ein = 0;
                var hand = 0;
                var stoer1 = 0;
                var stoer2 = 0;
                var stoer1Q = 0;
                var stoer2Q = 0;
                var warn1 = 0;
                var warn2 = 0;

                if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                    ein = self.connector.getSignal(self.signalEin).value() & 0x01;
                }
                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                }
                if (((self.signalStoer1 != undefined) && (self.signalStoer1 != null) && (self.signalStoer1 != ''))) {
                    if (stoer1warn == true) {
                        warn1 = self.connector.getSignal(self.signalStoer1).value() & 0x01;
                    } else {
                        stoer1 = self.connector.getSignal(self.signalStoer1).value() & 0x01;
                    }
                }
                if (((self.signalStoer2 != undefined) && (self.signalStoer2 != null) && (self.signalStoer2 != ''))) {
                    if (stoer2warn == true) {
                        warn2 = self.connector.getSignal(self.signalStoer2).value() & 0x01;
                    } else {
                        stoer2 = self.connector.getSignal(self.signalStoer2).value() & 0x01;
                    }
                }
                if (((self.signalStoer1Q != undefined) && (self.signalStoer1Q != null) && (self.signalStoer1Q != ''))) {
                    stoer1Q = self.connector.getSignal(self.signalStoer1Q).value() & 0x01;
                }
                if (((self.signalStoer2Q != undefined) && (self.signalStoer2Q != null) && (self.signalStoer2Q != ''))) {
                    stoer2Q = self.connector.getSignal(self.signalStoer2Q).value() & 0x01;
                }

                if ((stoer1 != 0) || (stoer2 != 0) || (stoer1Q != 0) || (stoer2Q != 0)) {
                    if ((stoer1Q == 0) && (stoer2Q == 0)) {
                        css1 = 'ccw-wf-svd1b-antriebHand';
                        css2 = 'ccw-wf-svd1b-antriebStoerNeu';
                    } else {
                        css2 = 'ccw-wf-svd1b-antriebStoer';
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if (ein != 0) {
                            css2 = 'ccw-wf-svd1b-antriebHandEin';
                        } else {
                            css2 = 'ccw-wf-svd1b-antriebHand';
                        }
                    } else {
                        if (ein != 0) {
                            css2 = 'ccw-wf-svd1b-antriebEin';
                        } else {
                            css2 = 'ccw-wf-svd1b-antriebAus';
                        }
                    }
                    if ((warn1 != 0) || (warn2 != 0)) {
                        css1 = css2;
                        css2 = 'ccw-wf-svd1b-antriebWarn';
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
                var hand = 0;

                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                }

                if ((hand != 0) && (farbStatusHand == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwsvd1b.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalEin) {
                self.connector.unregisterSignals(self.signalEin);
            };
            if (self.signalHand) {
                self.connector.unregisterSignals(self.signalHand);
            };
            if (self.signalStoer1) {
                self.connector.unregisterSignals(self.signalStoer1);
            };
            if (self.signalStoer2) {
                self.connector.unregisterSignals(self.signalStoer2);
            };
            if (self.signalStoer1Q) {
                self.connector.unregisterSignals(self.signalStoer1Q);
            };
            if (self.signalStoer2Q) {
                self.connector.unregisterSignals(self.signalStoer2Q);
            };
        };

        return ccwsvd1b;
    });