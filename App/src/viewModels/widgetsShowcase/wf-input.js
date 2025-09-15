define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfInputValue";
            self.widgetCategory = "Bedienen";

            self.widgetProperties = [{
                name: 'signalName',
                type: 'string',
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
                name: 'isBufferedClass',
                type: 'String',
                defaultValue: 'label-info',
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
                name: 'valuePendingOnClass',
                type: 'String',
                defaultValue: 'wf-value-pending-on',
                description: 'CSS Klasse, die an das Anzeigeelement angewendet wird, wenn der client auf das Signal Update vom Server gewartet wird.',
                descriptionEN: 'CSS Class which applied to the output element when the client is waiting for the signal update from the server.'
            },
            {
                name: 'valuePendingOffClass',
                type: 'String',
                defaultValue: 'wf-value-pending-off',
                description: 'CSS Klasse, die an das Anzeigeelement angewendet wird, wenn der client nicht auf das Signal Update vom Server wartet.',
                descriptionEN: 'CSS Class which applied to the output element when the client is not waiting for the signal update from the server.'
            },
            {
                name: 'additionalCssForPendingAnimation',
                type: 'String',
                defaultValue: '',
                description: 'zusätzliche CSS Klasse, die an das Anzeigeelement angewendet wird, wenn der client auf das Signal Update vom Server wartet.',
                descriptionEN: 'Additional CSS Class which applied to the output element when the client is waiting for the signal update from the server.'
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
                description: 'Definiert der angezeigte Wert alphanumerisch ist. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                descriptionEN: 'Defines the displayed value is alphanumeric. If the value is true, the property format is not taken into account.'
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
                name: 'popoverPosition',
                type: 'String',
                defaultValue: 'Top',
                description: 'Definiert die Position des Validierungs-Popovers relativ zur Komponente, folgende Werte können verwendet werden: "Top", "Bottom", "Left" oder "Right"',
                descriptionEN: 'Sets the position of the validation popover to "Top", "Bottom", "Left" or "Right" relative to the component.'
            },
            {
                name: 'unitLabel',
                type: 'Boolean',
                defaultValue: 'true',
                description: 'Definiert ob die Signaleinheit angezeigt wird',
                descriptionEN: 'Defines whether the signal unit is displayed'
            },
            {
                name: 'staticUnitText',
                type: 'String',
                defaultValue: '',
                description: 'Ersetzt die Signaleinheit durch den vorgegebene statischen String. Die unitLabel Property muss auf true gesetzt sein damit staticUnitText angezeigt wird',
                descriptionEN: 'Replaces the signal unit with the defined static string. The unitLabel property has to be true to display the staticUnitText property'
            },
            {
                name: 'label',
                type: 'String',
                defaultValue: '',
                description: 'Labeltext',
                descriptionEN: 'Label text'
            },
            {
                name: 'signalNameLabel',
                type: 'Boolean',
                defaultValue: 'false',
                description: 'Definiert, ob ein Label mit dem Signalnamen vor dem Signalwert angezeigt wird',
                descriptionEN: 'Defines whether a label is displayed with the signal names before the signal value'
            },
            {
                name: 'iconClass',
                type: 'String',
                defaultValue: '',
                description: 'CSS Klasse für das Icon Element',
                descriptionEN: 'CSS Class for Icon Element'
            },
            {
                name: 'displayClass',
                type: 'String',
                defaultValue: '',
                description: 'CSS Klasse für das Anzeige/- Eingabeelement',
                descriptionEN: 'CSS class for the display / input element'
            },
            {
                name: 'inputSize',
                type: 'String',
                defaultValue: '',
                description: 'Optionale, predifinierte Größenangabe für das Widget. Vordefinierte Größen: sm, lg',
                descriptionEN: 'Optional, predefined size for the widget. Predefined sizes: sm, lg'
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