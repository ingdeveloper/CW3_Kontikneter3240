define(["require", "exports", "./services/logonHandling", "../../../src/viewModels/cowi/services/ccw-contextmenu", "../../services/connector"], function (require, exports, logonHandling_1, CcwContextmenu, Connector) {
    "use strict";
    var rezepturVMI = /** @class */ (function () {
        function rezepturVMI() {
            var _this = this;
            this.signalName = "VMI3240DB580B17";
            this.connector = new Connector();
            this.alarmCount = ko.observable(0);
            this.alarmTxt = ko.pureComputed(function () {
                return Number(_this.alarmCount()) > 0 ? _this.alarmCount() + " unkommentierten St\u00F6rungen" : 'Keine unkommentierten Störungen';
            });
            try {
                this.signal = this.connector.getSignal(this.signalName); //Signal-Objekt mit dem SignalName erstellen
            }
            catch (error) {
                console.log("Error: " + error);
                this.alarmCount("Signal '" + this.signalName + "' konnte nicht initialisiert werden!"); //Knockout-Computed-Variable aktualisieren
            }
            this.alarmCount(this.signal.value()); //Knockout-Computed-Variable aktualisieren
            this.signal.value.subscribe(function (val) {
                _this.alarmCount(val);
            }); //SignalValue abonnieren und den Button-Text aktualisieren
            this.connector.getOnlineUpdates(); //Online-Updates von der WF-Datenbank abrufen
        }
        rezepturVMI.prototype.activate = function (ub) {
            logonHandling_1.userLogHandle.login(ub);
            CcwContextmenu.AddIdent({
                wfServername: window.rootUrlPrefix + "\\I4SCADA",
                wfDbName: "broet3240",
                werk: 2,
                halle: 3,
                etage: 2,
                linie: 4,
                abteiNr: 250,
                maschine: 11,
                anlagenNr: 7324020,
            });
        };
        rezepturVMI.prototype.deactivate = function () {
            if (!this.signal)
                return;
            return this.connector.unregisterSignals(this.signal);
        };
        ;
        return rezepturVMI;
    }());
    return rezepturVMI;
});
//# sourceMappingURL=rezepturVMI.js.map