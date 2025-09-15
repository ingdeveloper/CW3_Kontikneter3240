define(['../services/connector'],

    function (signalsConnector) {
        var ccwpump0b = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');
            self.signalHand = (ko.unwrap(self.settings.signalHand) || '');
            self.signalStoer = (ko.unwrap(self.settings.signalStoer) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameAntrieb = (ko.unwrap(self.settings.nameAntrieb) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');
            self.farbStatusHand = ko.unwrap(self.settings.farbStatusHand) !== undefined ? ko.unwrap(self.settings.farbStatusHand) : false;

            // diese Variable muss dynamisch angezeigt werden, dementsprechend die funktion "ko.unwrap" entfernen
            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var erg = false;
                if (self.settings.freigabeBedienung !== undefined) {
                    erg = ko.unwrap(self.settings.freigabeBedienung);
                }
                return erg; //eine KO-Variable wieder ausgeben
            }, self));

            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogHandAuto = ko.observable(false);
            self.visibleDialogEin = ko.observable(false);

            self.observables.push(self.mDirection = ko.computed(function () {
                var self = this;
                var motorDirection = self.ausrichtung;
                return 'rotate(' + motorDirection + 'deg)';
            }, self));

            self.observables.push(self.mStyle = ko.computed(function () {
                var self = this;
                var css = 'ccw-wf-motor1-antriebAus';
                var farbStatusHand = self.farbStatusHand;
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist
                var ein = 0;
                var hand = 0;
                var stoer = 0;

                if (((self.signalEin === undefined) || (self.signalEin === null) || (self.signalEin === '')) && ((self.signalHand === undefined) || (self.signalHand === null) || (self.signalHand === '')) && ((self.signalStoer === undefined) || (self.signalStoer === null) || (self.signalStoer === ''))) {
                    ohneSignal = true;
                }

                if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                    ein = self.connector.getSignal(self.signalEin).value() & 0x01;
                }
                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                }
                if (((self.signalStoer != undefined) && (self.signalStoer != null) && (self.signalStoer != ''))) {
                    stoer = self.connector.getSignal(self.signalStoer).value() & 0x01;
                }

                if (ohneSignal) {
                    css = 'ccw-wf-motor1-ohneSignal';
                } else if (stoer != 0) {
                    css = 'ccw-wf-motor1-antriebStoer';
                } else {
                    if ((hand != 0) && (farbStatusHand == true)) {
                        if (ein != 0) {
                            css = 'ccw-wf-motor1-antriebHandEin';
                        } else {
                            css = 'ccw-wf-motor1-antriebHand';
                        }
                    } else {
                        if (ein != 0) {
                            css = 'ccw-wf-motor1-antriebEin';
                        } else {
                            css = 'ccw-wf-motor1-antriebAus';
                        }
                    }
                }
                return css;
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

            self.observables.push(self.btnHandAutoCss = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var hand = 0;
                var stoer = 0;

                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                }
                if (((self.signalStoer != undefined) && (self.signalStoer != null) && (self.signalStoer != ''))) {
                    stoer = self.connector.getSignal(self.signalStoer).value() & 0x01;
                }

                if (stoer != 0) {
                    css = 'btn-danger';
                } else {
                    if ((hand != 0)) {
                        css = 'btn-warning';
                    } else {
                        css = 'btn-success';
                    }
                }
                return css;
            }, self));

            self.observables.push(self.btnHandAutoText = ko.computed(function () {
                var self = this;
                var btnTxt = '';
                var hand = 0;

                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                }

                if ((hand != 0)) {
                    btnTxt = 'Hand';
                } else {
                    btnTxt = 'Auto';
                }
                return btnTxt;
            }, self));

            self.observables.push(self.btnEin = ko.computed(function () {
                var self = this;
                var css = 'btn-default';
                var ein = 0;

                if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                    ein = self.connector.getSignal(self.signalEin).value() & 0x01;
                }

                if (ein != 0) {
                    css = 'btn-success';
                } else {
                    css = 'btn-default';
                }
                return css;
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwpump0b.prototype.dispose = function () {
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
            if (self.signalStoer) {
                self.connector.unregisterSignals(self.signalStoer);
            };
        };

        ccwpump0b.prototype.antriebInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal : " + self.signalEin + " " + self.signalHand + " " + self.signalStoer, self.bmk + " " + self.nameAntrieb);
            }
        };

        ccwpump0b.prototype.antriebDialog1 = function () {
            var self = this;
            if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    if (self.dialogAktiv == true) {
                        self.connector.clearSignalBuffer();
                        self.show1(true);
                        self.visibleDialog1(true);
                    }
                }
            }
        };

        ccwpump0b.prototype.antriebDialogClose1 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            self.connector.clearSignalBuffer();
        };

        ccwpump0b.prototype.dialogHandAuto = function () {
            var self = this;

            self.show2(true);
            self.visibleDialogHandAuto(true);
        };

        ccwpump0b.prototype.dialogEin = function () {
            var self = this;
            var ein = 0;
            var hand = 0;

            if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                ein = self.connector.getSignal(self.signalEin).value() & 0x01;
            }
            if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                hand = self.connector.getSignal(self.signalHand).value() & 0x01;
            }

            if (hand != 0) {
                if (ein == 0) {
                    self.show2(true);
                    self.visibleDialogEin(true);
                }
            } else {
                toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
            }
        };

        ccwpump0b.prototype.antriebDialogClose2 = function () {
            var self = this;

            self.visibleDialogHandAuto(false);
            self.visibleDialogEin(false);
            self.show2(false);
        };

        ccwpump0b.prototype.setValueHand = function () {
            var self = this;
            var hand = 0;
            var setWert;
            var values = {};

            if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                hand = self.connector.getSignal(self.signalHand).value() & 0x01;
                if (hand != 0) {
                    setWert = 0;
                } else {
                    setWert = 1;
                }
                values[self.signalHand] = setWert;
                self.connector.writeSignals(values).then(function (result) {
                    if (result.errorMessage) {
                        toastr.error(result.errorMessage);
                    }
                });
            }

            self.visibleDialogHandAuto(false);
            self.show2(false);
        };

        ccwpump0b.prototype.setValueEin = function () {
            var self = this;
            var ein = 0;
            var hand = 0;
            var values = {};

            if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                ein = self.connector.getSignal(self.signalEin).value() & 0x01;
                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;

                    if (hand != 0) {
                        if (ein == 0) {
                            values[self.signalEin] = 1;
                            self.connector.writeSignals(values).then(function (result) {
                                if (result.errorMessage) {
                                    toastr.error(result.errorMessage);
                                }
                            });
                            self.visibleDialogEin(false);
                            self.show2(false);
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            }
        };

        ccwpump0b.prototype.setValueAus = function () {
            var self = this;
            var ein = 0;
            var hand = 0;
            var values = {};

            if (((self.signalEin != undefined) && (self.signalEin != null) && (self.signalEin != ''))) {
                ein = self.connector.getSignal(self.signalEin).value() & 0x01;
                if (((self.signalHand != undefined) && (self.signalHand != null) && (self.signalHand != ''))) {
                    hand = self.connector.getSignal(self.signalHand).value() & 0x01;

                    if (hand != 0) {
                        if (ein != 0) {
                            values[self.signalEin] = 0;
                            self.connector.writeSignals(values).then(function (result) {
                                if (result.errorMessage) {
                                    toastr.error(result.errorMessage);
                                }
                            });
                        }
                    } else {
                        toastr.error("Ein / Ausschalten nur im Handbetrieb möglich !!!");
                    }
                }
            }
        };

        return ccwpump0b;
    });