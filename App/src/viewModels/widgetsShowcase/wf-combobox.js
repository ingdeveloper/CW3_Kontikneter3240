define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfWriteValueCombobox";
            self.widgetCategory = "Bedienen";

            self.widgetProperties =
            [
                {
                    name: 'signalNames',
                    type: 'String Array',
                    defaultValue: '',
                    description: 'Array mit Signalen für die Optionen',
                    descriptionEN: 'Array of signals for options'
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
                    name: 'signalValues',
                    type: 'String | Number Array',
                    defaultValue: '',
                    description: 'Array mit Signalwerten für die Optionen',
                    descriptionEN: 'Array of signal values for options'
                },
                {
                    name: 'dropdownAlignment',
                    type: 'String',
                    defaultValue: 'left',
                    description: 'Ausrichtung der Dropdown Elemente',
                    descriptionEN: 'Alignment of dropdown item'
                },
                {
                    name: 'symbolicTexts',
                    type: 'String Array',
                    defaultValue: '',
                    description: 'Array mit Symbolischen Texten für die Optionen',
                    descriptionEN: 'Array of symbolic texts for options'
                },
                {
                    name: 'iconClass',
                    type: 'String Array',
                    defaultValue: '',
                    description: 'Array mit CSS-Klassen für die Icon-Elemente (<i />) in den Optionen (anzuwenden z.B. mit Icon Fonts)',
                    descriptionEN: 'Array of CSS classes for the icon elements (<i />) in the options (for example, apply with icon fonts)'
                },
                {
                    name: 'symbolicTextNormalState',
                    type: 'String',
                    defaultValue: 'Select an option',
                    description: 'Standardtext, wenn keine Option aktiv / ausgewählt ist',
                    descriptionEN: 'Standard text, if no option is active / selected'
                },
                {
                    name: 'cssClassNormalState',
                    type: 'String',
                    defaultValue: '',
                    description: 'Standard CSS-Klasse für das Icon-Element, wenn keine Option aktiv / ausgewählt ist',
                    descriptionEN: 'Standard CSS class for the icon element, if no option is active / selected'
                },
                {
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: 'btn-default',
                    description: 'CSS-Klassenname für das Button-Element (siehe Buttons).',
                    descriptionEN: 'CSS class name for the button element (see Buttons).'
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
                    type: "String",
                    name: "dropdownDirection",
                    defaultValue: "down",
                    description: 'Legt die Richtung in welche das Dropdown aufklappt fest. Mögliche Werte sind: "up" für oben und "down" für unten',
                    descriptionEN: 'Defines the direction in which the dropdown will be opened, possible values are "up" and "down"'
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