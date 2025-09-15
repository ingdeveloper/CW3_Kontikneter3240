define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSwitchValue";
            self.widgetCategory = "Bedienen";

            /*------------------------
             * Translation texts
             *------------------------*/

            self.widgetProperties = [{
                    type: 'String',
                    name: 'signalName',
                    defaultValue: '',
                    description: 'Name des Signals welches mit den beiden Werten geschrieben wird.',
                    descriptionEN: 'The name of the signal to which the two values will be written.'
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
                    name: 'isBufferedClass',
                    type: 'String',
                    defaultValue: 'btn-info',
                    description: 'CSS-Klasse, die angewendet wird, sobald der Signalwert in die Puffertabelle geschrieben worden ist.',
                    descriptionEN: 'CSS class that is applied when the signal value has been written to the buffer table.'
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
                    type: 'Number',
                    name: 'onValue',
                    defaultValue: '1',
                    description: 'Signalwert welches den ersten Zustand (ON) representiert und beim Klick auf den ersten Button geschrieben wird.',
                    descriptionEN: 'The signal value which represents the first state (ON) of the button and will be written on click to the first button.'
                },
                {
                    type: 'Number',
                    name: 'offValue',
                    defaultValue: '0',
                    description: 'Signalwert welches den zweiten Zustand (OFF) representiert und beim Klick auf den zweiten Button geschrieben wird.',
                    descriptionEN: 'The signal value which represents the second state (OFF) of the button and will be written on click to the second button.'
                },
                {
                    type: 'String',
                    name: 'onLabelText',
                    defaultValue: 'I4SCADA_ON',
                    description: 'Übersetzbarer Text für den linken Button.',
                    descriptionEN: 'Translateable text for the left button.'
                },
                {
                    type: 'String',
                    name: 'offLabelText',
                    defaultValue: 'I4SCADA_OFF',
                    description: 'Übersetzbarer Text für den rechten Button.',
                    descriptionEN: 'Translateable text for the right button.'
                },
                {
                    type: 'String',
                    name: 'defaultCssClass',
                    defaultValue: 'btn-default',
                    description: 'CSS Klasse für den nicht aktiven Button.',
                    descriptionEN: 'CSS class for non active button.'
                },
                {
                    type: 'String',
                    name: 'activeCssClass',
                    defaultValue: 'btn-primary',
                    description: 'CSS Klasse für einen aktiven Button.',
                    descriptionEN: 'CSS class for an active button.'
                },
                {
                    type: 'String',
                    name: 'onIconClass',
                    defaultValue: 'wf wf-light-bulb',
                    description: 'Icon Klassenname für den linken Button.',
                    descriptionEN: 'Icon class name for the left button.'
                },
                {
                    type: 'String',
                    name: 'offIconClass',
                    defaultValue: 'wf wf-light-bulb-o',
                    description: 'Icon Klassenname für den rechten Button.',
                    descriptionEN: 'Icon class name for the right button.'
                },
                {
                    type: 'Boolean',
                    name: 'btnGroupJustified',
                    defaultValue: 'true',
                    description: 'Legt fest, ob die Buttons gleichmäßig über die gesamte, vorhandene Breite aufgeteilt werden sollen.',
                    descriptionEN: 'Determines whether the button should be stretched to equal width over the available space.'
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