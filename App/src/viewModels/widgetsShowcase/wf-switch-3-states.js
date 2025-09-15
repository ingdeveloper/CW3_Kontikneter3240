define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSwitchValue3States";
            self.widgetCategory = "Bedienen";          

            self.widgetProperties =
            [
                {
                    name: 'signalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals dessen Wert angezeigt und geschrieben soll.',
                    descriptionEN: 'Name of the signal is displayed and written its value.'
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
                    name: 'writeToBuffer',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Der Signalwert wird nicht direkt in den Signal geschrieben, sondern lokal in einer Puffertabelle zwischengespeichert. Das Schreiben erfolgt über wf-buffer-button oder wfBufferVutton.',
                    descriptionEN: 'The signal value will not be written dicrectly into the signal, but will be buffered locally. Writing should be done via wf-buffer-button or wfBufferVutton..'
                },
                {
                    name: 'writeSecure',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Der Signalwert wird nach der Bestätigung des Passworts in den Signal geschrieben.',
                    descriptionEN: 'The signal value will be written into the signal after confirm password.'
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
                },
                 {
                     name: 'onValue',
                     type: 'Number',
                     defaultValue: '1',
                     description: 'Dieser Signalwert wird beim Umschalten in den "AN" Zustand geschrieben',
                     descriptionEN: 'This value will be written in "ON" state'
                 },
                 {
                     name: 'offValue',
                     type: 'Number',
                     defaultValue: '0',
                     description: 'Dieser Signalwert wird beim Umschalten in den "AUS" Zustand geschrieben',
                     descriptionEN: 'This value will be written in "OFF" state'
                 },
                 {
                     name: 'neutralValue',
                     type: 'Number',
                     defaultValue: '2',
                     description: 'Dieser Signalwert wird beim Umschalten in den "NEUTRAL" Zustand geschrieben',
                     descriptionEN: 'This value will be written in "NEUTRAL" state'
                 },
                 {
                     name: 'onText',
                     type: 'String',
                     defaultValue: 'ON',
                     description: 'Mouseover Labeltext für die "AN" Stellung',
                     descriptionEN: 'Mouseover label text for "ON" position'
                 },
                 {
                     name: 'offText',
                     type: 'String',
                     defaultValue: 'OFF',
                     description: 'Mouseover Labeltext für die "AUS" Stellung',
                     descriptionEN: 'Mouseover label text for "OFF" position'
                 },
                 {
                     name: 'neutralText',
                     type: 'String',
                     defaultValue: 'NEUTRAL',
                     description: 'Mouseover Labeltext für die "NEUTRAL" Stellung',
                     descriptionEN: 'Mouseover label text for "NEUTRAL" position'
                 },
                {
                    name: 'onIconClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klasse für das Icon Element im "AN" Zustand',
                    descriptionEN: 'CSS Class for Icon Element in ON state'
                },
                 {
                     name: 'offIconClass',
                     type: 'String',
                     defaultValue: '',
                     description: 'CSS Klasse für das Icon Element im "AUS" Zustand',
                     descriptionEN: 'CSS Class for Icon Element in OFF state'
                 },
                 {
                     name: 'neutralIconClass',
                     type: 'String',
                     defaultValue: '',
                     description: 'CSS Klasse für das Icon Element im "NEUTRAL" Zustand',
                     descriptionEN: 'CSS Class for Icon Element in neutral state'
                 },
                {
                    type: 'String',
                    name: 'cssClass',
                    defaultValue: 'wf-5x',
                    description: 'CSS Klasse für den gesamten Kippschalter - z.B. um die Größe vorzugeben',
                    descriptionEN: 'CSS class for the toggle switch container - e.g. for set the size'
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