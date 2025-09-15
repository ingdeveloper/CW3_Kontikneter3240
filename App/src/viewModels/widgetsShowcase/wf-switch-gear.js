define(["../../services/connector"],
    function(signalsConnector) {
        var ctor = function() {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSwitchGear";
            self.widgetCategory = "Visualisieren";


            // self.switchTypes = ko.observableArray([
            //     {switchType:'switch-gear-base'},
            //     {switchType:'switch-gear-feed'},
            //     {switchType:'switch-gear-measuments'},
            //     {switchType:'switch-gear-measuments out'},
            //     {switchType:'switch-gear-box'},
            //     {switchType:'switch-gear-box-fuse'},
            //     {switchType:'switch-gear-box-fuse out'},
            //     {switchType:'switch-gear-switch closed'},
            //     {switchType:'switch-gear-switch opened'},
            //     {switchType:'switch-gear-breaker opened'},
            //     {switchType:'switch-gear-breaker closed'},
            //     {switchType:'switch-gear-disconector opened'},
            //     {switchType:'switch-gear-disconector closed'},
            //     {switchType:'switch-gear-switch-disconector opened'},
            //     {switchType:'switch-gear-switch-disconector closed'},
            //     {switchType:'switch-gear-fuse-disconector opened fuse-blown'},
            //     {switchType:'switch-gear-fuse-disconector closed fuse-intact'}, 
            //     {switchType:'switch-gear-fuse-switch-disconector-1 opened fuse-intact'},
            //     {switchType:'switch-gear-fuse-switch-disconector-1 closed fuse-intact'}, 
            //     {switchType:'switch-gear-fuse-switch-disconector-2 opened fuse-intact'},
            //     {switchType:'switch-gear-fuse-switch-disconector-2 closed fuse-blown'}, 
            // ]);
        
            self.switchExamples = ko.observableArray([
                {switchType:'switch-gear-feed switch-gear-measuments', state1: 'in red', state2: 'out critical'},
                {switchType:'switch-gear-feed switch-gear-box switch-gear-switch', state1: 'closed in red', state2: 'opened out green'},
                {switchType:'switch-gear-base switch-gear-box switch-gear-breaker', state1: 'in closed critical', state2: 'opened out blue'},
                {switchType:'switch-gear-base switch-gear-box switch-gear-switch-disconector', state1: 'closed in green', state2: 'opened out red'},
                {switchType:'switch-gear-base switch-gear-box switch-gear-disconector', state1: 'closed in red', state2: 'opened out green'},
                {switchType:'switch-gear-base switch-gear-box switch-gear-fuse-disconector', state1: 'closed in red fuse-intact', state2: 'opened out green fuse-blown'},
                {switchType:'switch-gear-feed switch-gear-box switch-gear-fuse-switch-disconector-1', state1: 'closed in critical fuse-intact', state2: 'opened out green fuse-blown'},
                {switchType:'switch-gear-feed switch-gear-box-fuse switch-gear-fuse-switch-disconector-2', state1: 'closed in red fuse-intact', state2: 'opened out green fuse-intact'}
            ]);



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
                    description: "Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, welche durch die Eigenschaften definiert sein kann: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: { conditionRule: '%Setpoint 1% == 0', cssClassName: 'green openned out' }, { conditionRule: '%Setpoint 1% != 0', cssClassName: 'error closed in' }.<br />Dieses Symbol besteht aus mehreren von einander unabhängigen Symbolteilen, welche wiederum unterscheidliche Zustände haben können - wie z.B. Sicherung, geschlossenes und geöffnetes Schalterelement. Um die vordefinierten Zustände anzuwenden, können folgende Status-Klassen sinnvoll kombiniert werden: <br /><strong>in, out, closed, opened, fuse-intact, fuse-blown</strong>.",
                    descriptionEN: "Represents the definition of a state. Each state definition is an object that can be defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: { conditionRule: '%Setpoint 1% == 0', cssClassName: 'green opened out' }, { conditionRule: '%Setpoint 1% != 0', cssClassName: 'error closed in' }.<br />This symbol contains multiple independent symbol parts, which can have theier own states - like fuse, opened or closed switch element. The predefined status class names can be combined like: <br /><strong>in, out, closed, opened, fuse-intact, fuse-blown</strong>."
                },
                {
                    type: "String",
                    name: "switchType",
                    defaultValue: "switch-gear-box switch-gear-breaker",
                    description: 'Über diese Eigenschaft kann das Grundsymbol festgelegt werden. Das Grundsymbol kann dabei sinnvoll aus folgenden Teilen kombiniert werden:<br /><strong>switch-gear-base, switch-gear-feed, switch-gear-measument, switch-gear-box, switch-gear-box-fuse, switch-gear-switch, switch-gear-breaker, switch-gear-switch-disconector, switch-gear-disconector, switch-gear-fuse-disconector, switch-gear-fuse-switch-disconector-1, switch-gear-fuse-switch-disconector-2</strong>.<br />Sinnvolle Kombinationen sind z.B.:<br /><ul><li>switch-gear-feed switch-gear-measuments</li><li>switch-gear-feed switch-gear-box switch-gear-switch</li><li>switch-gear-base switch-gear-box switch-gear-breaker</li><li>switch-gear-base switch-gear-box switch-gear-switch-disconector</li><li>switch-gear-base switch-gear-box switch-gear-disconector</li><li>switch-gear-base switch-gear-box switch-gear-fuse-disconector</li><li>switch-gear-feed switch-gear-box switch-gear-fuse-switch-disconector-1</li><li>switch-gear-feed switch-gear-box-fuse switch-gear-fuse-switch-disconector-2</li><ul>',
                    descriptionEN: 'Over this property the definition of the base symbol can be done. The basis symbol can be any meaningfull combination of following parts:<br /><strong>switch-gear-base, switch-gear-feed, switch-gear-measument, switch-gear-box, switch-gear-box-fuse, switch-gear-switch, switch-gear-breaker, switch-gear-switch-disconector, switch-gear-disconector, switch-gear-fuse-disconector, switch-gear-fuse-switch-disconector-1, switch-gear-fuse-switch-disconector-2</strong>.<br />Meaningfull combinations could be for example: <ul><li>switch-gear-feed switch-gear-measuments</li><li>switch-gear-feed switch-gear-box switch-gear-switch</li><li>switch-gear-base switch-gear-box switch-gear-breaker</li><li>switch-gear-base switch-gear-box switch-gear-switch-disconector</li><li>switch-gear-base switch-gear-box switch-gear-disconector</li><li>switch-gear-base switch-gear-box switch-gear-fuse-disconector</li><li>switch-gear-feed switch-gear-box switch-gear-fuse-switch-disconector-1</li><li>switch-gear-feed switch-gear-box-fuse switch-gear-fuse-switch-disconector-2</li><ul>'
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