define(['../services/connector'],

    function (signalsConnector) {
        var ccwkvd1 = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalKVD = (ko.unwrap(self.settings.signalKVD) || '');

            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : true;
            self.statusService = ko.unwrap(self.settings.statusService) !== undefined ? ko.unwrap(self.settings.statusService) : true;
            self.statusZwangslauf = ko.unwrap(self.settings.statusZwangslauf) !== undefined ? ko.unwrap(self.settings.statusZwangslauf) : true;

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
                var css1 = 'ccw-wf-kvd1-antriebAus';
                var css2 = 'ccw-wf-kvd1-antriebAus';
                var farbStatusHand = self.farbStatusHand;
                var value = self.connector.getSignal(self.signalKVD).value();
                var ein = ((value & 0x100) >> 8);
                var hand = ((value & 0x200) >> 9);
                var hochlauf = ((value & 0x800) >> 11);
                var ablauf = ((value & 0x1000) >> 12);
                var stoerNeu = ((value & 0x2000) >> 13);
                var stoer = ((value & 0x4000) >> 14);
                var warn = ((value & 0x8000) >> 15);

                if ((stoerNeu != 0) || (stoer != 0)) {
                    if (stoerNeu != 0) {
                        css1 = 'ccw-wf-kvd1-antriebHand';
                        css2 = 'ccw-wf-kvd1-antriebStoerNeu';
                    } else {
                        css2 = 'ccw-wf-kvd1-antriebStoer';
                    }
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if ((hochlauf != 0) || (ablauf != 0)) {
                            css2 = 'ccw-wf-kvd1-antriebHochlaufHand';
                        } else {
                            if (ein != 0) {
                                css2 = 'ccw-wf-kvd1-antriebHandEin';
                            } else {
                                css2 = 'ccw-wf-kvd1-antriebHand';
                            }
                        }
                    } else {
                        if ((hochlauf != 0) || (ablauf != 0)) {
                            css2 = 'ccw-wf-kvd1-antriebHochlauf';
                        } else {
                            if (ein != 0) {
                                css2 = 'ccw-wf-kvd1-antriebEin';
                            } else {
                                css2 = 'ccw-wf-kvd1-antriebAus';
                            }
                        }
                    }
                    if (warn != 0) {
                        css1 = css2;
                        css2 = 'ccw-wf-kvd1-antriebWarn';
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
                var value = self.connector.getSignal(self.signalKVD).value();
                var hand = ((value & 0x200) >> 9);

                if ((hand != 0) && (farbStatusHand == false)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.observables.push(self.visibleService = ko.computed(function () {
                var self = this;
                var state = false;
                var statusService = self.statusService;
                var value = self.connector.getSignal(self.signalKVD).value();
                var service = ((value & 0x04) >> 2);

                if ((service != 0) && (statusService == true)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.observables.push(self.visibleZwangslauf = ko.computed(function () {
                var self = this;
                var state = false;
                var statusService = self.statusService;
                var statusZwangslauf = self.statusZwangslauf;
                var value = self.connector.getSignal(self.signalKVD).value();
                var service = ((value & 0x04) >> 2);
                var zwangslauf = ((value & 0x08) >> 3);

                if (((service == 0) || (statusService == false)) && (zwangslauf != 0) && (statusZwangslauf == true)) {
                    state = true;
                } else {
                    state = false;
                }
                return state;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwkvd1.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (self.signalKVD) {
                self.connector.unregisterSignals(self.signalKVD);
            };
        };

        return ccwkvd1;
    });