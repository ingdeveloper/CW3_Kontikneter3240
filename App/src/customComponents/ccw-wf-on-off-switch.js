define(['../services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog'],

    function (signalsConnector, dialog, okCancelDialog) {
        var ccwwfonoffswitch = function (params) {
            var self = this;
            self.observables = [];

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalName = (ko.unwrap(self.settings.signalName) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : true;
            self.dialogText = ko.unwrap(self.settings.dialogText) !== undefined ? ko.unwrap(self.settings.dialogText) : 'Umschalten ?';
            self.cssOff = ko.unwrap(self.settings.cssOff) !== undefined ? ko.unwrap(self.settings.cssOff) : 'ccw-wf-on-off-switch-gray';
            self.cssOn = ko.unwrap(self.settings.cssOn) !== undefined ? ko.unwrap(self.settings.cssOn) : 'ccw-wf-on-off-switch-green';
            self.txtOff = ko.unwrap(self.settings.txtOff) !== undefined ? ko.unwrap(self.settings.txtOff) : 'AUS';
            self.txtOn = ko.unwrap(self.settings.txtOn) !== undefined ? ko.unwrap(self.settings.txtOn) : 'EIN';
            self.elemBreitePx = ko.unwrap(self.settings.elemBreitePx) !== undefined ? ko.unwrap(self.settings.elemBreitePx) : '64';
            self.faktorGroesse = ko.unwrap(self.settings.faktorGroesse) !== undefined ? ko.unwrap(self.settings.faktorGroesse) : '1.0';

            self.observables.push(self.freigabeBedienung = ko.computed(function () {
                var frg = false;
                var css = 'ccw-wf-on-off-switch-label-disabled';
                if (self.settings.freigabeBedienung !== undefined) {
                    frg = ko.unwrap(self.settings.freigabeBedienung);
                }
                if (frg != false) {
                    css = 'ccw-wf-on-off-switch-label-enabled';
                }
                return {
                    frg: frg,
                    css: css
                };
            }, self));

            self.observables.push(self.switchStyle = ko.computed(function () {
                var self = this;
                var width = parseInt(self.elemBreitePx);
                var scale = 'scale(' + self.faktorGroesse + ')';
                if (width < 64) {
                    width = 64;
                }
                return {
                    width: width + 'px',
                    scale: scale
                };
            }, self));

            self.observables.push(self.switchChecked = ko.computed(function () {
                var self = this;
                var chk = false;
                var css = self.cssOff;
                var txt = self.txtOff;
                var left = 4;
                var width = parseInt(self.elemBreitePx);
                var value = self.connector.getSignal(self.signalName).value() & 0x01;
                if (width < 64) {
                    width = 64;
                }
                if (value != 0) {
                    chk = true;
                    css = self.cssOn;
                    txt = self.txtOn;
                    left = width - 24;
                }
                return {
                    chk: chk,
                    css: css,
                    txt: txt,
                    left: left + 'px'
                };
            }, self));

            self.connector.getOnlineUpdates();
        };

        ccwwfonoffswitch.prototype.dispose = function () {
            var self = this;

            for (var key in self.observables) {
                if (self.observables.hasOwnProperty(key)) {
                    self.observables[key].dispose();
                }
            }

            if (!self.signalName)
                return;
            return self.connector.unregisterSignals(self.signalName);
        };

        ccwwfonoffswitch.prototype.signalInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal: " + self.signalName);
            }
        };

        ccwwfonoffswitch.prototype.setValue = function () {
            var self = this;
            var signalName = self.signalName;
            var txt = self.dialogText;
            var frg = ko.unwrap(self.settings.freigabeBedienung);
            var value = self.connector.getSignal(signalName).value() & 0x01;
            var values = {};
            if (frg == true) {
                if (self.dialogAktiv != false) {
                    dialog.show(
                            new okCancelDialog('Ja', 'Nein', txt) //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                        )
                        .then(function (dialogResult) {

                            if (dialogResult === 'ClosedOkay') {
                                var setWert;
                                if (value !== 0) {
                                    setWert = 0;
                                } else {
                                    setWert = 1;
                                }
                                values[signalName] = setWert;
                                self.connector.writeSignals(values).then(function (result) {
                                    if (result.errorMessage) {
                                        toastr.error(result.errorMessage);
                                    }
                                });
                            }
                        });
                } else {
                    var setWert;
                    if (value !== 0) {
                        setWert = 0;
                    } else {
                        setWert = 1;
                    }
                    values[signalName] = setWert;
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                }
            }
        };

        return ccwwfonoffswitch;
    });