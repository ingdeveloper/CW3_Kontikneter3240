define(['../services/connector'],

    function (signalsConnector) {
        var ccwspsstoer = function (params) {
            var self = this;

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalName = (ko.unwrap(self.settings.signalName) || '');
            self.text = (ko.unwrap(self.settings.text) || 'Fehler SPS Störung');
            self.zaehler = (ko.unwrap(self.settings.zaehler) || 5);
            self.localStorageActive = (ko.unwrap(self.settings.localStorageActive) || false);
            self.localStorageAlias = (ko.unwrap(self.settings.localStorageAlias) || 'Stoerung');

            self.visible = ko.observable(false);

            self.signal = self.connector.getSignal(self.signalName);
            self.valueOld = -999;
            self.zaehlerstand = 0;

            if (self.localStorageActive) {
                if (localStorage.getItem(self.localStorageAlias + "Aktiv") == undefined) localStorage.setItem(self.localStorageAlias + "Aktiv", "false");
                if (localStorage.getItem(self.localStorageAlias + "Counter") == undefined) localStorage.setItem(self.localStorageAlias + "Counter", "0");
                if (localStorage.getItem(self.localStorageAlias + "ManuellDeaktivieren") == undefined) localStorage.setItem(self.localStorageAlias + "ManuellDeaktivieren", "false");
            }

            self.timer1 = setInterval(function () {
                var val = self.signal.value();
                if (val == self.valueOld) {
                    self.zaehlerstand++;
                    if (self.zaehlerstand > self.zaehler) self.zaehlerstand = self.zaehler; //Überlauf verhindern
                } else {
                    self.zaehlerstand = 0;
                }
                self.valueOld = val;
                //roten Balken anzeigen, wenn Zählerstand erreicht
                self.visible(self.zaehlerstand >= self.zaehler);
                //Meldung in localStorage ausgeben
                var manuellDeaktivieren = localStorage.getItem(self.localStorageAlias + "ManuellDeaktivieren") == "true";
                if (self.localStorageActive && !manuellDeaktivieren) {
                    var today = new Date();
                    if (self.zaehlerstand >= self.zaehler) {
                        if (localStorage.getItem(self.localStorageAlias + "Aktiv") == "false") {
                            localStorage.setItem(self.localStorageAlias + "Aktiv", "true");
                            localStorage.setItem(self.localStorageAlias + localStorage.getItem(self.localStorageAlias + "Counter") + "On", today.toLocaleString("de-DE"));
                        }
                    } else {
                        if (localStorage.getItem(self.localStorageAlias + "Aktiv") == "true") {
                            localStorage.setItem(self.localStorageAlias + "Aktiv", "false");
                            localStorage.setItem(self.localStorageAlias + localStorage.getItem(self.localStorageAlias + "Counter") + "Off", today.toLocaleString("de-DE"));
                            var n = parseInt(localStorage.getItem(self.localStorageAlias + 'Counter')) + 1;
                            localStorage.setItem(self.localStorageAlias + "Counter", n.toString());
                        }
                    }
                }
            }, 1000);

            self.connector.getOnlineUpdates();
        };

        ccwspsstoer.prototype.dispose = function () {
            var self = this;

            if (!self.signalName)
                return;
            if (self.signalName) self.connector.unregisterSignals(self.signalName);
            clearInterval(self.timer1);
            return;
        };


        return ccwspsstoer;
    });