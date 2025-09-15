define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfBufferButton";
            self.widgetCategory = "Bedienen";

            self.widgetProperties =
            [
                {
                    name: 'clearBuffer',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
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
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
                },
                {
                    name: 'writeSecure',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Der Signalwert wird nach der Bestätigung des Passworts in den Signal geschrieben.',
                    descriptionEN: 'The signal value will be written into the signal after confirm password.'
                },
                {
                    name: 'buttonText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Buttontext',
                    descriptionEN: 'Button text'
                },
                {
                    name: 'iconClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klasse für das Icon Element',
                    descriptionEN: 'CSS Class for Icon Element'
                },
                {
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klassenname um die Darstellung des Buttons zu beeinflussen',
                    descriptionEN: 'Affecting CSS class name to the appearance of buttons'
                },
                {
                    name: 'states',
                    type: 'Array',
                    defaultValue: '[]',
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.'
                },
                {
                    name: 'cssClassNormalState',
                    type: 'String',
                    defaultValue: 'btn-default',
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
                    type: "String ['Hide', 'Disable']",
                    name: "securityDenyAccessBehavior",
                    defaultValue: "Hide",
                    description: "Das Verhalten des Controls, wenn der angemeldete User nicht zur Berechtigungsgruppe gehört, die von der projectAuthorization-Eigenschaft angegeben wurde. In diesem Fall kann das Control deaktiviert oder ausgeblendet werden.",
                    descriptionEN: "The behavior of the element when the logged in user doesn't belong to the project authorization indicated by the projectAuthorization property. In this case, the element can be either disabled or hidden."
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


