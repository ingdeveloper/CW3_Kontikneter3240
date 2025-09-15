define(['../services/connector'],
    function (signalsConnector) {

        var ccwAction = function (params) {
            var self = this;

            self.connector = new signalsConnector();

            self.settings = params;
            self.rootFunctionen = self.settings.parent; //Funktionen und Eigenschaften von Root

            self.maxBuildTime = ko.unwrap(self.settings.maxBuildTime) !== undefined ? ko.unwrap(self.settings.maxBuildTime) : 3000; // 3000ms verstreicht, danach wird der Timer gestoppt
            self.funcName = ko.unwrap(self.settings.funcName) !== undefined ? ko.unwrap(self.settings.funcName) : null; // 1000ms Verzögerungszeit
            self.signalName = (ko.unwrap(self.settings.signalName) || '');
            self.signalValue = null;
            // console.log(self.signalName);
            // console.log(typeof self.signalName);
            // console.log(Array.isArray(self.signalName));

            // Abfragen, wieviele Signale abgefragt werden sollen. Ist der Parameter ein String, dann 
            if (typeof self.signalName === "string") {
                self.signal = self.connector.getSignal(self.signalName);
                self.signalValue = self.signal.value;
                self.signalValue.subscribe(function (newValue) {
                    self.rootFunctionen[self.funcName](newValue, function (cb) {
                    });
                });
                self.signalIsArray = false;

            } else if (Array.isArray(self.signalName)) {
                // mehrere Signale auswerten, Array übernehmen
                self.myComputed = ko.computed(function () {
                    self.sigArr = [];
                    self.signalName.forEach(function (element, index) {
                        // console.log(element + " | " + index);
                        var neuSignalValue = "value" + index;
                        self[neuSignalValue] = self.connector.getSignal(element).value();
                        self.sigArr.push(self[neuSignalValue]);
                    });
                    self.rootFunctionen[self.funcName](self.sigArr, function (cb) {
                    });
                });
                self.signalIsArray = true;

            }

            // Intervall alle 500ms aufrufen, um den DOM-Knoten den Wert zuzuweisen
            // Die Funktion der Übergeordneten JS-Datei wird hier aufgerufen, zurück kommt ein Callback mit dem Ergebnis
            // von der Anfrage "document.getElementById(***)". Wenn der DOM noch nicht vorhanden ist, dann kommt NULL zurück.
            // Sollte der Callback in der anderen Funktion nicht gefüttert werden, dann wird self.ti2 nach einer MAX-Zeit diesen Intervall löschen.
            self.ti = setInterval(function () {
                var sigVal = self.signalIsArray ? self.sigArr : self.signalValue();
                
                self.rootFunctionen[self.funcName](sigVal, function (cb) {
                    if (cb !== null) {
                        clearInterval(self.ti);
                    }
                });
                // console.log("ccwAction Intervall");
            }, 1000);

            // Timer einmal ausführen, um den anderen Interval-Timer anzuhalten, hier mit maxDelay-Parameter
            // zb. sollte der Timer nach DOM-Aufbau (evtl. 3000ms bei vielen Variablen) den anderen Timer stoppen.
            self.ti2 = setTimeout(function () {
                clearInterval(self.ti);
            }, self.maxBuildTime);

        };

        // Seite wird verlassen und Komponente zerstört
        ccwAction.prototype.dispose = function () {
            var self = this;
            // wenn keine Signale vorhanden, dann Signale
            if (!self.signal && !self.value0)
                return;
            if (self.signal) self.connector.unregisterSignals(self.signal);
            if (self.value0) {
                self.connector.unregisterSignals(self.sigArr);
                self.myComputed.dispose();  //wenn Computed benutzt wurde (nur bei Array), dann hier freigeben
            }
            if (self.ti) clearInterval(self.ti);
            if (self.ti2) clearTimeout(self.ti2);

            return;
        };

        return ccwAction;
    });