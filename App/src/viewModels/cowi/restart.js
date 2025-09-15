define(['../../services/connector'],
function (signalsConnector) {
    var ctor = function () {
        var self = this;
        var timeoutID;

        myreload = function () {
            location.reload(true);      //Browser-Seite neu laden vom Server
            clearTimeout(timeoutID);    //Timer wieder löschen
            //console.info(">>>>>>>>>>>>>>>> Neustart von Seite #restart ausgeführt <<<<<<<<<<<<<<<<");
        }

        //{"signalName":"Local Time","value":"/Date(1488278262000+0100)/", ..... so ist die Antwort vom Server
        myTimeFormat = function (str) {
            //console.log(">>>>>>>>>>>>>DateStr=" + str);
            var indexStr1 = str.indexOf("(") + 1;
            var indexStr2 = str.indexOf("+");
            var dateInt = parseInt(str.slice(indexStr1,indexStr2),10);
            var d = new Date(dateInt);
            //console.log(">>>>>>>>>>>>>IndexOf="+dateInt);
            //var newSignalValue = 1488268151000;//self.signalZeitValue;//parseInt(self.signalZeitValue,10);

            return d.toLocaleString();

        }
    };

    ctor.prototype = {
        //Aufruf dieser Funktion, wenn DOM-Elemente aktiviert werden, die Werte der WF-DB sind nicht vorhanden
        activate: function () {
            var self = this;

            self.signalNameZeit = 'Local Time';
            self.signalNameBuffer = 'MyResetVar';
            self.buttonText = ko.observable('Neustart aller Clients ausführen');

            self.connector = new signalsConnector();
            
            self.signalZeit = self.connector.getSignal(self.signalNameZeit);
            self.signalZeitValue = self.signalZeit.value;

            self.signalBuffer = self.connector.getSignal(self.signalNameBuffer);
            self.signalBufferValue = self.signalBuffer.value;//self.signalBuffer.value;

            self.statusStyle = ko.observable('btn btn-danger wf wf-alert');
            
            return self.connector.getOnlineUpdates().fail(self.connector.handleError(self));
        },
        //Aufruf dieser Funktion, wenn DOM-Elemente verfügbar sind, die Werte der WF-DB sind nicht vorhanden bzw. Null
        attached: function () {
            var self = this;

            self.speicher = ko.unwrap(self.signalBufferValue);
            
            //console.log(">>>> attached ausgeführt <<<<<<");
        },
        //Aufruf dieser Funktion, wenn DOM-Elemente verfügbar sind mit knockout-Bindung, die Werte der WF-DB sind hier vorhanden
        compositionComplete: function () {
            var self = this;
            //console.log(">>>> Composition Complete ausgeführt <<<<<<");
            self._statusStyle = ko.computed(
                function () {

                    var test = ko.unwrap(self.signalBufferValue);
                    var test2 = self.speicher;

                    if (test !== test2) {
                        //console.info("Farbe geändert >>>>> " + typeof (test) + typeof (self.speicher));
                        console.log("DB-Wert =   " + self.speicher + "/   " + test);
                        ko.unwrap(self.statusStyle('btn btn-warning wf wf-alert'));
                        self.buttonText('Neustart wird ausgeführt in ca. 3s');

                        timeoutID = window.setTimeout('myreload()', 3000);
                        self.speicher = test;
                    } else {
                        ko.unwrap(self.statusStyle('btn btn-danger wf wf-alert'));

                        var mystr = test.slice(0, 5);
                        if (mystr == '/Date') {  //von Position 0 bis 4 lesen, wenn /Date dann ist es der Now()-String in WF-Datenbank nach einem Neustart
                            test = myTimeFormat(test)
                        }
                        self.buttonText('Neustart wurde ausgeführt am ' + test);
                    }
                    console.log("Speicher = " + self.speicher + " / " + test);
                }
            );

        },
        //Aufruf dieser Funktion, wenn Seite verlassen wird
        detached: function () {
            var self = this;

            self.connector.unregisterSignals(self.signalZeit);
            self.connector.unregisterSignals(self.signalBuffer);
            console.info("Detached Signal auf Seite Restart");
        },
        //eigene Funktion, aufrufbar in der HTML-Seite mit Button "click"
        writeSignal: function (newValue) {
            var self = this;
            var values = {};
            var dateStr = self.signalZeitValue();

            var newSignalValue = myTimeFormat(dateStr);

            values[self.signalNameBuffer] = newSignalValue;
            self.connector.writeSignals(values);

            //self.buttonText('Neustart wird ausgeführt!');
        }
    }

    return ctor;
});