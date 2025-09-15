define(["../../services/connector"],
    function(signalsConnector) {
        var ctor = function() {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSwitchSymbol";
            self.widgetCategory = "Visualisieren";


            // self.switchTypes = ko.observableArray([
            //     {switchType:'switch-symbol-base'}, 
            //     {switchType:'switch-symbol-feed'},
            //     {switchType:'switch-symbol-measuments'},
            //     {switchType:'switch-symbol-measuments out'},
            //     {switchType:'switch-symbol-box'},
            //     {switchType:'switch-symbol-box-fuse'},
            //     {switchType:'switch-symbol-box-fuse out'},
            //     {switchType:'switch-symbol-switch closed'},
            //     {switchType:'switch-symbol-switch opened'},
            //     {switchType:'switch-symbol-breaker opened'},
            //     {switchType:'switch-symbol-breaker closed'},
            //     {switchType:'switch-symbol-disconector opened'},
            //     {switchType:'switch-symbol-disconector closed'},
            //     {switchType:'switch-symbol-switch-disconector opened'},
            //     {switchType:'switch-symbol-switch-disconector closed'},
            //     {switchType:'switch-symbol-fuse-disconector opened fuse-blown'},
            //     {switchType:'switch-symbol-fuse-disconector closed fuse-intact'}, 
            //     {switchType:'switch-symbol-fuse-switch-disconector-1 opened fuse-intact'},
            //     {switchType:'switch-symbol-fuse-switch-disconector-1 closed fuse-intact'}, 
            //     {switchType:'switch-symbol-fuse-switch-disconector-2 opened fuse-intact'},
            //     {switchType:'switch-symbol-fuse-switch-disconector-2 closed fuse-blown'}, 
            // ]);
        
            self.switchExamples = ko.observableArray([
                {switchType:'switch-symbol-feed switch-symbol-measuments', state1: 'red', state2: 'critical'},
                {switchType:'switch-symbol-feed switch-symbol-box switch-symbol-switch', state1: 'closed red', state2: 'opened green'},
                {switchType:'switch-symbol-base switch-symbol-box switch-symbol-breaker', state1: 'closed critical', state2: 'opened blue'},
                {switchType:'switch-symbol-base switch-symbol-box switch-symbol-switch-disconector', state1: 'closed green', state2: 'opened red'},
                {switchType:'switch-symbol-base switch-symbol-box switch-symbol-disconector', state1: 'closed red', state2: 'opened green'},
                {switchType:'switch-symbol-base switch-symbol-box switch-symbol-fuse-disconector', state1: 'closed red fuse-intact', state2: 'opened green fuse-blown'},
                {switchType:'switch-symbol-feed switch-symbol-box switch-symbol-fuse-switch-disconector-1', state1: 'closed critical fuse-intact', state2: 'opened green fuse-blown'},
                {switchType:'switch-symbol-feed switch-symbol-box-fuse switch-symbol-fuse-switch-disconector-2', state1: 'closed red fuse-intact', state2: 'opened green fuse-blown'}
            ]);



            self.widgetProperties = [{
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
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
                    defaultValue: "switch-symbol-box switch-symbol-breaker",
                    description: 'Über diese Eigenschaft kann das Grundsymbol festgelegt werden. Das Grundsymbol kann dabei sinnvoll aus folgenden Teilen kombiniert werden:<br /><strong>switch-symbol-base, switch-symbol-feed, switch-symbol-measument, switch-symbol-box, switch-symbol-box-fuse, switch-symbol-switch, switch-symbol-breaker, switch-symbol-switch-disconector, switch-symbol-disconector, switch-symbol-fuse-disconector, switch-symbol-fuse-switch-disconector-1, switch-symbol-fuse-switch-disconector-2</strong>.<br />Sinnvolle Kombinationen sind z.B.:<br /><ul><li>switch-symbol-feed switch-symbol-measuments</li><li>switch-symbol-feed switch-symbol-box switch-symbol-switch</li><li>switch-symbol-base switch-symbol-box switch-symbol-breaker</li><li>switch-symbol-base switch-symbol-box switch-symbol-switch-disconector</li><li>switch-symbol-base switch-symbol-box switch-symbol-disconector</li><li>switch-symbol-base switch-symbol-box switch-symbol-fuse-disconector</li><li>switch-symbol-feed switch-symbol-box switch-symbol-fuse-switch-disconector-1</li><li>switch-symbol-feed switch-symbol-box-fuse switch-symbol-fuse-switch-disconector-2</li><ul>',
                    descriptionEN: 'Over this property the definition of the base symbol can be done. The basis symbol can be any meaningfull combination of following parts:<br /><strong>switch-symbol-base, switch-symbol-feed, switch-symbol-measument, switch-symbol-box, switch-symbol-box-fuse, switch-symbol-switch, switch-symbol-breaker, switch-symbol-switch-disconector, switch-symbol-disconector, switch-symbol-fuse-disconector, switch-symbol-fuse-switch-disconector-1, switch-symbol-fuse-switch-disconector-2</strong>.<br />Meaningfull combinations could be for example: <ul><li>switch-symbol-feed switch-symbol-measuments</li><li>switch-symbol-feed switch-symbol-box switch-symbol-switch</li><li>switch-symbol-base switch-symbol-box switch-symbol-breaker</li><li>switch-symbol-base switch-symbol-box switch-symbol-switch-disconector</li><li>switch-symbol-base switch-symbol-box switch-symbol-disconector</li><li>switch-symbol-base switch-symbol-box switch-symbol-fuse-disconector</li><li>switch-symbol-feed switch-symbol-box switch-symbol-fuse-switch-disconector-1</li><li>switch-symbol-feed switch-symbol-box-fuse switch-symbol-fuse-switch-disconector-2</li><ul>'
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