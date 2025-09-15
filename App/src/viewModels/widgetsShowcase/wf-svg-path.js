define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSvgPath";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [

                {
                    name: 'viewBox',
                    type: 'String',
                    defaultValue: '0 0 200 100',
                    description: '',
                    descriptionEN: ''
                },
                {
                    name: 'pathData',
                    type: 'String',
                    defaultValue: 'M0 0 H 200 V 100 H 200 V 0 Z',
                    description: 'Vektordaten für den Pfad.',
                    descriptionEN: 'Vector data for the path.'
                },
                {
                    name: 'navigationUrl',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Navigationsroute bzw. URL.',
                    descriptionEN: 'Optional navigation route respectively URL.'
                },
                {
                    name: 'pathCssClass',
                    type: 'String',
                    defaultValue: 'wf-svg-path',
                    description: 'Optionaler Klassenname für den Pfad.',
                    descriptionEN: 'Optional class name for the path.'
                },
                {
                    name: 'signalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals dessen Wert angezeigt werden soll.',
                    descriptionEN: 'Name of the signal is displayed its value.'
                },
                {
                    name: 'signalValueFactor',
                    type: 'Number',
                    defaultValue: '1',
                    description: 'Der Signalwert wird mit diesem Wert multiplizieren.',
                    descriptionEN: 'The signal value is multiplied by this value.'
                },
                {
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                },
                {
                    name: 'labelText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Primärer Labeltext.',
                    descriptionEN: 'Main label text.'
                },
                {
                    name: 'subLabelText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Sekundärer Labeltext.',
                    descriptionEN: 'Secondary label text.'
                },
                {
                    name: 'tooltipEnabled',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Aktiviert den optionalen Tooltip mit einer Wertanzeige und Titeltext.',
                    descriptionEN: 'Enable optional tooltip with signal value and title texts.'
                },
                {
                    name: 'tooltipTitle',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip Titels.',
                    descriptionEN: 'The text of tooltip title.'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
                },
                {
                    name: 'format',
                    type: 'String',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Anzeige. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats can be found on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'isAlphanumeric',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert, dass der angezeigte Wert alphanumerisch ist. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                    descriptionEN: 'Defines, that the displayed value is alphanumeric. If the value is true, the property format is not taken into account.'

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
                    name: 'isDateTime',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob der Signalwert als Typ Datumzeit ausgegeben werden soll.',
                    descriptionEN: 'Defines if the signal value should be shown as a dateTime type.'
                },
                {
                    name: 'dateTimeFormat',
                    type: 'String',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Datumzeitformat für die Ausgabe.  Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel an, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Datetimeformat for the output. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'

                },
                {
                    name: 'unitLabel',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Signaleinheit als Textlabel angezeigt wird',
                    descriptionEN: 'Defines whether the signal unit should be shown as a text label.'
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
                    name: 'enableSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals, dessen Wert für die Sperre verwendet wird.',
                    descriptionEN: 'Name of the signal that will be used for disabling the widget / component.'
                },
                {
                    name: 'enableSignalValue',
                    type: 'String|Number',
                    defaultValue: '',
                    description: 'Wert der Eigenschaft "enableSignalName"',
                    descriptionEN: 'Value of "enableSignalName" option.'
                },
                {
                    name: 'enableOperator',
                    type: 'String',
                    defaultValue: '==',
                    description: 'Operator für die Bedingung, wann der Inhalt des Widget bzw. der Komponente freigegeben werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                    descriptionEN: 'Operator for the condition if the content of the widget / component should be enabled. Avalable operatoren: !=, ==, >=, <=, >, <.'
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
                }, {
                    name: 'states',
                    type: 'Array',
                    defaultValue: '[]',
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.'
                }, {
                    name: 'cssClassNormalState',
                    type: 'String',
                    defaultValue: '',
                    description: 'Standardklasse, welches zugewiesen wird, wenn keines der Zustände (1-8) ansteht',
                    descriptionEN: 'Standard class, that will be assigned, if none of the condition (1-8) is pending'
                },
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