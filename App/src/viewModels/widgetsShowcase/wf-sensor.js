define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSensorValue";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    name: 'signalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signalname',
                    descriptionEN: 'Signal name'
                },
                {
                    name: 'setpointSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Sollwert Signalname - zweite Wertanzeige',
                    descriptionEN: 'Setpoint signal name - second value label.'
                },
                {
                    name: 'isArray',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert, dass der angezeigte Wert als Array behandelt wird. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                    descriptionEN: 'Defines, that the displayed value is an array. If the value is true, the property format is not taken into account.'

                },
                {
                    name: 'arrayIndex',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Legt den Index des angezeigten Wertes aus dem Array fest.',
                    descriptionEN: 'Defines the index of the displayed value from the array.'

                },
                {
                    name: 'arrayDelimiter',
                    type: 'String',
                    defaultValue: ',',
                    description: 'Definiert den Separator der Werte im Array.',
                    descriptionEN: 'Defines the delimiter of the values in the array.'

                },
                {
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
                },
                {
                    name: 'visibilitySignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals, dessen Wert für das verstecken verwendet wird.',
                    descriptionEN: 'The name of the signal which is used for to hide the widget/component.'
                },
                {
                    name: 'visibilitySignalValue',
                    type: 'String|Number',
                    defaultValue: '',
                    description: 'Wert der Eigenschaft "visibilitySignalName"',
                    descriptionEN: 'Value of "visibilitySignalName" option.'
                },
                {
                    name: 'visibilityOperator',
                    type: 'String',
                    defaultValue: '==',
                    description: 'Operator für die Bedingung, wann der Inhalt des Widget bzw. der Komponente sichtbar sein werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                    descriptionEN: 'Operator for the condition if the content of the widget / component should be visible. Avalable operatoren: !=, ==, >=, <=, >, <.'
                },
                {
                    name: 'sensorShape',
                    type: 'String',
                    defaultValue: 'circle',
                    description: 'Form für das Sensorelement. Mögliche vordefinierten Typen: "circle", "square", "pin".',
                    descriptionEN: 'Shape for the sensor element. Possible designed types: "circle", "square", "pin"'
                },
                {
                    name: 'signalChangedClass',
                    type: 'String',
                    defaultValue: 'bg-changed',
                    description: 'CSS Klasse, die an das Anzeigeelement angewendet wird, wenn der Signalwert sich ändert.',
                    descriptionEN: 'CSS Class which applied to the output element when the signal value has been changed.'
                },
                {
                    name: 'changedCssDuration',
                    type: 'Number',
                    defaultValue: '1000',
                    description: 'Dauer in Millisekunden für die Anwendung von signalChangedClass.',
                    descriptionEN: 'Duration in millisecond how long the signalChangedClass will be applied.'
                },
                {
                    name: 'format',
                    type: 'String',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Anzeige. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats can be found on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'valueLabelPosition',
                    type: 'String',
                    defaultValue: 'right',
                    description: 'Position für die Signalwert Anzeige.',
                    descriptionEN: 'Position for signal value.'
                },
                {
                    name: 'unitLabel',
                    type: 'Boolean',
                    defaultValue: '',
                    description: 'Gibt vor, ob die Signal EInheit angezeigt wird.',
                    descriptionEN: 'Defines whether the signal unit text should be shown.'
                },
                {
                    name: 'staticUnitText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Wenn statischer Einheittext nicht gesetzt bleibt, wird die Einheit aus der WEBfactory Projektdatenbank geladen. ',
                    descriptionEN: "If static unit text is not set, the unit will be loaded from WEBfactory project database."
                },
                {
                    name: 'sensorText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Sensor Text.',
                    descriptionEN: 'Sensor Text.'
                },
                {
                    name: 'pointerLength',
                    type: 'Number',
                    defaultValue: '20',
                    description: 'Länge von der Pointerlinie',
                    descriptionEN: 'Length of the pointer line'
                },
                {
                    name: 'pointerRotation',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Winkel für den Pointer',
                    descriptionEN: 'Angle for the Pointer'
                },
                {
                    name: 'cssClassNormalState',
                    type: 'String',
                    defaultValue: '',
                    description: 'Standardklasse, welches zugewiesen wird, wenn keines der Zustände (1-8) ansteht',
                    descriptionEN: 'Standard class, that will be assigned, if none of the condition (1-8) is pending'
                },
                {
                    type: "String",
                    name: "projectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird das Widget standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the widget. The widget will be shown by default, if this property is not set.'
                },
                {
                    name: 'systemAuthorization',
                    type: 'String',
                    defaultValue: '',
                    description:
                        'Systemberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                    descriptionEN: 'Systemauthorization of the user, which are required for showing the widget.'
                },
                {
                    name: 'states',
                    type: 'Array',
                    defaultValue: '[]',
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf-sensor-warning\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf-sensor-warning\' }.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf-sensor-warning\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf-sensor-warning\' }'
                },
                {
                    deprecated: true,
                    name: 'stateSignalName[1]…[8]',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signalnamen für den jeweiligen Zustand. (Verwenden states)',
                    descriptionEN: 'Signal names for each state. (Use states)'
                },
                {
                    deprecated: true,
                    name: 'maskSignal[1]…[8]',
                    type: 'Number | String',
                    defaultValue: '',
                    description: 'Signalwerte als Bedingung für den jeweiligen Zustand. (Verwenden states)',
                    descriptionEN: 'Signal values as a condition of the respective state. (Use states)'
                },
                {
                    deprecated: true,
                    name: 'operator[1]…[8]',
                    type: 'String',
                    defaultValue: '==',
                    description: 'Operator für die Bedingung. Verfügbare Operatoren sind <, >, <=, >=, !=, &, |. (Verwenden states)',
                    descriptionEN: 'Operator for the condition. Available operators are <,>, <=,> =, =, &,! |. (Use states)'
                },
                {
                    deprecated: true,
                    name: 'conditionRule[1]…[8]',
                    type: 'String',
                    defaultValue: '',
                    description: "Bedingung als Logische Verknüpfung(en). Achtung Syntax: Signalnamen müssen zwingend von %-Zeichen umgeben werden. " + "Beispiel: ''%Setpoint 1% > %Setpoint 2%'. (Verwenden states)",
                    descriptionEN: "Condition as (a) logical link(s). Attention Syntax: signal names must be absolutely surrounded by % characters. " + " Example: '%Setpoint 1% > %Setpoint 2%'. (Use states)"
                },
                {
                    deprecated: true,
                    name: 'cssClassState[1]…[8]',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klassen, die bei jeweiligen Zuständen  zugewiesen werden. Vordefinierte Klassen sind direkt verfügbar: wf-sensor-normal, wf-sensor-ok, wf-sensor-warning, wf-sensor-error, wf-sensor-critical. (Verwenden states)',
                    descriptionEN: 'CSS classes that are assigned in case of configured states. Predefined classnames are out of the box available: wf-sensor-normal, wf-sensor-ok, wf-sensor-warning, wf-sensor-error, wf-sensor-critical. (Use states)'
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