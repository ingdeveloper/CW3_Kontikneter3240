define(["../../services/connector"],
    function(signalsConnector) {
        var ctor = function() {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSwitchTransformer";
            self.widgetCategory = "Visualisieren";

            
            // self.switchExamples = ko.observableArray([
            //     {switchType:'switch-gear-feed switch-gear-measuments', state1: 'in red', state2: 'out critical'},
            //     {switchType:'switch-gear-feed switch-gear-box switch-gear-switch', state1: 'closed in red', state2: 'opened out green'},
            //     {switchType:'switch-gear-base switch-gear-box switch-gear-breaker', state1: 'in closed critical', state2: 'opened out blue'},
            //     {switchType:'switch-gear-base switch-gear-box switch-gear-switch-disconector', state1: 'closed in green', state2: 'opened out red'},
            //     {switchType:'switch-gear-base switch-gear-box switch-gear-disconector', state1: 'closed in red', state2: 'opened out green'},
            //     {switchType:'switch-gear-base switch-gear-box switch-gear-fuse-disconector', state1: 'closed in red fuse-intact', state2: 'opened out green fuse-blown'},
            //     {switchType:'switch-gear-feed switch-gear-box switch-gear-fuse-switch-disconector-1', state1: 'closed in critical fuse-intact', state2: 'opened out green fuse-blown'},
            //     {switchType:'switch-gear-feed switch-gear-box-fuse switch-gear-fuse-switch-disconector-2', state1: 'closed in red fuse-intact', state2: 'opened out green fuse-intact'}
            // ]);


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
                    description: 'Standardklasse, welches zugewiesen wird, wenn keines der konfigurierten Zustände ansteht',
                    descriptionEN: 'Standard class, that will be assigned, if none of the configured condition is pending'
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
                    description: "Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, welche durch die Eigenschaften definiert sein kann: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: { conditionRule: '%Setpoint 1% == 0', cssClassName: 'red' }, { conditionRule: '%Setpoint 1% != 0', cssClassName: 'green' }.<br />Dieses Symbol besteht aus mehreren von einander unabhängigen Symbolteilen, welche wiederum unterscheidliche Zustände haben können - wie z.B. ein optionales, geschlossenes oder geöffnetes Schalterelement. Um die vordefinierten Zustände anzuwenden, können folgende Status-Klassen sinnvoll kombiniert werden: <br /><strong>closed, opened</strong>.",
                    descriptionEN: "Represents the definition of a state. Each state definition is an object that can be defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: { conditionRule: '%Setpoint 1% == 0', cssClassName: 'red' }, { conditionRule: '%Setpoint 1% != 0', cssClassName: 'green closed' }.<br />This symbol contains multiple independent symbolparts, which can have theier own states - like optional closed or opened switch element. The predefined status class names can be combined like: <br /><strong>closed, opened</strong>."
                },

                {
                    name: 'lineThickness',
                    type: 'number',
                    defaultValue: '1',
                    description: 'Strichdicke für die Symbolbestandteile.',
                    descriptionEN: 'Stroke weight for symbols parts.'
                },

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