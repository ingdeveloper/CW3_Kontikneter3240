define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wf-local-script";
            self.widgetCategory = "Utility";

            self.widgetProperties =
                [
                    {
                        name: 'inputSignalNames',
                        type: 'String[]',
                        defaultValue: '[]',
                        description: 'Die Namen der Signale, die die Eingabewerte des Skripts bereitstellen',
                        descriptionEN: 'The names of the signals that will provide the input values of the script'
                    },
                    {
                        name: 'outputSignalName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Der Name des Signals, in das das Skript Werte schreibt',
                        descriptionEN: 'The name of the signal to which the script will write values to'
                    },
                    {
                        name: 'objectID',
                        type: 'String',
                        defaultValue: '',
                        description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                        descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                    },
                    {
                        type: 'Boolean',
                        name: 'isAsync',
                        defaultValue: 'false',
                        description: 'Wenn die Eigenschaft auf "false" gesetzt ist, wird das Skript synchron ausgeführt und es wird der Ausgabewert zurückgegeben der in das Ausgabesignal geschrieben wird. Wenn die Eigenschaft auf "true" gesetzt ist, wird das Script einen Promis zurückgeben, welcher awaited wird. Wenn der Promise auflösst, wird der Wert des Promise in das Ausgabesignal geschrieben.',
                        descriptionEN: 'If set to "false", the script runs synchronously and it should return the value that will be written to the output signal. If set to "true", the script should return a Promise which will be awaited. When the Promise resolves, the value of the promise will be written to the output signal.'
                    },
                    {
                        name: '[script]',
                        type: 'String',
                        defaultValue: '',
                        description: 'Der JavaScript-Funktionskörper, der die Eingaben verarbeitet. Die Funktion erhält drei Parameter, die im Skript verwendet werden können:<ul>'
                        + '<li>values - ein Objekt, das den Signalnamen einem Wert zuordnet (zB. values["Local Second"] gibt den aktuellen Wert der lokalen Sekunde zurück)</li>'
                        + '<li>valuesArray - ein Array, das die Werte jedes Signals von InputSignalNames in der gleichen Reihenfolge enthält (zB. valuesArray [0] enthält den Wert des Signals InputSignalNames [0])</li>'
                        + '<li>connector - die Connector-Instanz, die im Skript verwendet werden kann, um vollen Zugriff auf die Connector-API zu erhalten. Der von der Funktion zurückgegebene Wert wird in das Signal OutputSignalName geschrieben, falls angegeben</li></ul>',
                        descriptionEN: 'The JavaScript function body that will process the inputs. The function will receive three parameters that can be used in the script:<ul>'
                        + '<li>values – an object which maps the signal name to a value (ex. values["Local Second"] returns the current value of the local second)</li>'
                        + '<li>valuesArray – an array which contains the values of each signal from the InputSignalNames in the same order (ex. valuesArray[0] contains the value of the InputSignalNames[0] signal)</li>'
                        + '<li>connector – the connector instance which can be used in the script to gain full access to the connector API. The value returned by the function will be written to the OutputSignalName, if provided</li></ul>'
                    }
                ];

        };

        ctor.prototype.activate = function () {
            var self = this;
            var connector = self.connector = new signalsConnector();
            switch (connector.currentLanguageId()) {
                case -1:
                    self.selectedLanguageId(7); // Fall back to german language ID if no language ID available
                    break;
                default:
                    self.selectedLanguageId = connector.currentLanguageId;
                    break;
            }

        };

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
        };


        return ctor;
    });


