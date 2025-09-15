define(["../../services/connector"],
    function(signalsConnector) {
        var ctor = function() {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfStateCssClass";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
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
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.'
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
                    description: 'CSS Klassen, die bei jeweiligen Zuständen  zugewiesen werden. (Verwenden states)',
                    descriptionEN: 'CSS classes that are assigned in case of configured states. (Use states)'
                }
            ];
        };

        ctor.prototype.activate = function() {
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

        ctor.prototype.attached = function() {
            var self = this;
            prettyPrint();
        };

        return ctor;
    });