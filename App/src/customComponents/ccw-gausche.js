/*
    ccw-gausche.js
    Änderung:
    - Juni 2019: - Erstellung Komponente hSchortemeyer
*/

define(['../services/connector', '../components/services/secured.service'],
    function (signalsConnector, securedService) {

        var ccwwfValue = function (params) {
            var self = this;
            self.connector = new signalsConnector();

            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || '').stringPlaceholderResolver(self.objectID); //!!!
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;

            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || '').stringPlaceholderResolver(self.objectID);

            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "0,0.0";
            self.isAlphanumeric = ko.unwrap(self.settings.isAlphanumeric) !== undefined ? ko.unwrap(self.settings.isAlphanumeric) : false;

            self.displayClass = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) : 'ccw-wf-input-tastatur-disabledClass-xs'; //default-Vorgabe geändert am 2.02.2018

            self.unitLabel = ko.unwrap(self.settings.unitLabel) !== undefined ? ko.unwrap(self.settings.unitLabel) : false;
            self.staticUnitText = (ko.unwrap(self.settings.staticUnitText) || '').stringPlaceholderResolver(self.objectID);
            self.precision = ko.unwrap(self.settings.precision) ? ko.unwrap(self.settings.precision) : 1;

            self.breite = ko.unwrap(self.settings.breite) !== undefined ? ko.unwrap(self.settings.breite) : "100%";

            self.anzWert = ko.computed(function () {
                var erg = ko.unwrap(self.settings.anzWert);
                if (ko.unwrap(self.settings.anzWert) > self.anzBildpunkte) {
                    erg = (self.anzBildpunkte);
                }
                return erg;
            });

            self.anzBildpunkte = ko.unwrap(self.settings.anzBildpunkte) !== undefined ? ko.unwrap(self.settings.anzBildpunkte) : 50;


            self.hoehe = ko.unwrap(self.settings.hoehe) !== undefined ? ko.unwrap(self.settings.hoehe) : "100%";
            self.startrot = ko.unwrap(self.settings.startrot) !== undefined ? ko.unwrap(self.settings.startrot) : 20;
            self.elemBreiteVal = ko.unwrap(self.settings.elemBreiteVal) !== undefined ? ko.unwrap(self.settings.elemBreiteVal) : "70%";
            self.fontSize = ko.unwrap(self.settings.fontSize) !== undefined ? ko.unwrap(self.settings.fontSize) : 'inherit';

            self.value = ko.unwrap(self.settings.value) !== undefined ? ko.unwrap(self.settings.value) : null;
            self.min = ko.unwrap(self.settings.min) !== undefined ? ko.unwrap(self.settings.min) : 0;
            self.max = ko.unwrap(self.settings.min) !== undefined ? ko.unwrap(self.settings.max) : 100;

            self.hoeheRect = (parseInt(self.hoehe) / self.anzBildpunkte) + 'px';

            self.jsStatusBtn = function (anzahl, varSichtbar) {
                var varcss = 'grey';
                var varSichtbar = false;

                //console.log(self.anzWert());
                if (self.anzBildpunkte > 0) {
                    if ((self.anzBildpunkte < anzahl) || (self.anzWert() > self.anzBildpunkte)) {
                        varSichtbar = false;
                    } else {
                        if (self.anzWert() >= anzahl) {
                            varSichtbar = true;
                            if (anzahl >= self.startrot) {
                                varcss = 'red';
                                varSichtbar = true;
                            } else {
                                if ((self.anzBildpunkte > 0) && (anzahl > 0)) {
                                    varcss = 'lime';
                                    varSichtbar = true;
                                } else {
                                    varSichtbar = false;
                                }
                            }
                        } else {
                            varcss = 'white';
                            varSichtbar = true;
                        }
                    }
                } else {
                    if ((self.anzBildpunkte > anzahl) || (self.anzWert() < self.anzBildpunkte)) {
                        varSichtbar = false;
                    } else {
                        if (self.anzWert() <= anzahl) {
                            varSichtbar = true;
                            if (anzahl <= self.startrot) {
                                varcss = 'red';
                                varSichtbar = true;
                            } else {
                                if ((self.anzBildpunkte < 0) && (anzahl < 0)) {
                                    varcss = 'lime';
                                    varSichtbar = true;
                                } else {
                                    varSichtbar = false;
                                }
                            }
                        } else {
                            varcss = 'white';
                            varSichtbar = true;
                        }
                    }
                }
                return {
                    css: varcss,
                    sichtbar: varSichtbar
                };
            };

            // Anfang Funktion erzeugeZeilen() für Zeitscheibe
            self.erzeugeZeilen = function (anzahl, sichtbar) {
                // Funktion für eine Zeile #####################################################
                var self = this;
                var y = 0;
                y = (anzahl * (parseInt(self.hoeheRect))) + anzahl + 'px';
                var btn = ko.computed(function () {
                    var btnReturn = self.jsStatusBtn(anzahl, sichtbar);
                    return {
                        newCss: btnReturn.css,
                        sichtbar: btnReturn.sichtbar
                    };
                }, self);

                // hier alle internen Funktionen reinnehmen, damit diese mit einem Befehl (nach verlassen der Seite)
                // von aussen gelöscht werden können
                var loescheAllFn = function () {
                    btn.dispose();
                }

                return function erg() {
                    return {
                        btn: btn,
                        y: y,
                        loescheAllFn: loescheAllFn
                    };
                };
            };

            self.anzahlPunkte = ko.observableArray([

                self.erzeugeZeilen(50, true),
                self.erzeugeZeilen(49, true),
                self.erzeugeZeilen(48, true),
                self.erzeugeZeilen(47, true),
                self.erzeugeZeilen(46, true),
                self.erzeugeZeilen(45, true),
                self.erzeugeZeilen(44, true),
                self.erzeugeZeilen(43, true),
                self.erzeugeZeilen(42, true),
                self.erzeugeZeilen(41, true),
                self.erzeugeZeilen(40, true),
                self.erzeugeZeilen(39, true),
                self.erzeugeZeilen(38, true),
                self.erzeugeZeilen(37, true),
                self.erzeugeZeilen(36, true),
                self.erzeugeZeilen(35, true),
                self.erzeugeZeilen(34, true),
                self.erzeugeZeilen(33, true),
                self.erzeugeZeilen(32, true),
                self.erzeugeZeilen(31, true),
                self.erzeugeZeilen(30, true),
                self.erzeugeZeilen(28, true),
                self.erzeugeZeilen(27, true),
                self.erzeugeZeilen(26, true),
                self.erzeugeZeilen(25, true),
                self.erzeugeZeilen(24, true),
                self.erzeugeZeilen(23, true),
                self.erzeugeZeilen(22, true),
                self.erzeugeZeilen(21, true),
                self.erzeugeZeilen(20, true),
                self.erzeugeZeilen(19, true),
                self.erzeugeZeilen(18, true),
                self.erzeugeZeilen(17, true),
                self.erzeugeZeilen(16, true),
                self.erzeugeZeilen(15, true),
                self.erzeugeZeilen(14, true),
                self.erzeugeZeilen(13, true),
                self.erzeugeZeilen(12, true),
                self.erzeugeZeilen(11, true),
                self.erzeugeZeilen(10, true),
                self.erzeugeZeilen(9, true),
                self.erzeugeZeilen(8, true),
                self.erzeugeZeilen(7, true),
                self.erzeugeZeilen(6, true),
                self.erzeugeZeilen(5, true),
                self.erzeugeZeilen(4, true),
                self.erzeugeZeilen(3, true),
                self.erzeugeZeilen(2, true),
                self.erzeugeZeilen(1, true),

                self.erzeugeZeilen(-1, true),
                self.erzeugeZeilen(-2, true),
                self.erzeugeZeilen(-3, true),
                self.erzeugeZeilen(-4, true),
                self.erzeugeZeilen(-5, true),
                self.erzeugeZeilen(-6, true),
                self.erzeugeZeilen(-7, true),
                self.erzeugeZeilen(-8, true),
                self.erzeugeZeilen(-9, true),
                self.erzeugeZeilen(-10, true),
                self.erzeugeZeilen(-11, true),
                self.erzeugeZeilen(-12, true),
                self.erzeugeZeilen(-13, true),
                self.erzeugeZeilen(-14, true),
                self.erzeugeZeilen(-15, true),
                self.erzeugeZeilen(-16, true),
                self.erzeugeZeilen(-17, true),
                self.erzeugeZeilen(-18, true),
                self.erzeugeZeilen(-19, true),
                self.erzeugeZeilen(-20, true),
                self.erzeugeZeilen(-21, true),
                self.erzeugeZeilen(-22, true),
                self.erzeugeZeilen(-23, true),
                self.erzeugeZeilen(-24, true),
                self.erzeugeZeilen(-25, true),
                self.erzeugeZeilen(-26, true),
                self.erzeugeZeilen(-27, true),
                self.erzeugeZeilen(-28, true),
                self.erzeugeZeilen(-29, true),
                self.erzeugeZeilen(-30, true),
                self.erzeugeZeilen(-40, true),
                self.erzeugeZeilen(-41, true),
                self.erzeugeZeilen(-42, true),
                self.erzeugeZeilen(-43, true),
                self.erzeugeZeilen(-44, true),
                self.erzeugeZeilen(-45, true),
                self.erzeugeZeilen(-46, true),
                self.erzeugeZeilen(-47, true),
                self.erzeugeZeilen(-48, true),
                self.erzeugeZeilen(-49, true),
                self.erzeugeZeilen(-50, true)

            ]);

            // Stop here and return if no signalName was configured
            if (!self.signalName) {
                return null;
            }

            self.connector = new signalsConnector();
            self.signal = self.connector.getSignal(self.signalName);

            if (self.isAlphanumeric) {
                self.signalValue = self.signal.value;
            } else {
                self.signalValue = self.signal.value.extend({
                    numeralNumber: self.format
                });
            }

            self.connector.getOnlineUpdates();
        };

        ccwwfValue.prototype.dispose = function () {
            var self = this;

            if (!self.signal)
                return;
            return self.connector.unregisterSignals(self.signal);
        };

        ccwwfValue.prototype.aliasInfo = function () {
            var self = this;

            if (self.infoAktiv == true) {
                toastr.info("Signal: " + self.signalName);
            }
            return false;
        };

        return ccwwfValue;

    });