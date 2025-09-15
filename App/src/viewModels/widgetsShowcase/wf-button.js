define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfWriteValueButton";
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
                    name: 'isBufferedClass',
                    type: 'String',
                    defaultValue: 'btn-info',
                    description: 'CSS-Klasse, die angewendet wird, sobald der Signalwert in die Puffertabelle geschrieben worden ist.',
                    descriptionEN: 'CSS class that is applied when the signal value has been written to the buffer table.'
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
                    name: 'writeValue',
                    type: 'Number',
                    defaultValue: '',
                    description: 'Wert, mit dem das Signal beschrieben wird',
                    descriptionEN: 'Value with which the signal is described'
                },
                {
                    name: 'minValue',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'minimaler Wert, mit dem das Signal beschrieben wird',
                    descriptionEN: 'Min value with which the signal is described'
                },
                {
                    name: 'maxValue',
                    type: 'Number',
                    defaultValue: '100',
                    description: 'maximaler Wert, mit dem das Signal beschrieben wird',
                    descriptionEN: 'Max value with which the signal is described'
                },
                {
                    name: 'buttonText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Buttontext',
                    descriptionEN: 'Button text'
                },
                {
                    name: 'isTipModeEnabled',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Lässt den Button als Taster fungieren',
                    descriptionEN: 'Button behaves as a Push-button. writeUpValue property is considered'
                },
                {
                    name: 'writeUpValue',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Wert, auf den das Signal nach dem Loslassen des Buttons gesetzt wird. Gilt nur wenn isTipModeEnabled aktiviert ist.',
                    descriptionEN: 'Value that will be set to the signal value after the buttons will be released. This propertie will be considered only if isTipModeEnabled is enabled.'
                },
                {
                    name: 'writeUpDelay',
                    type: 'Number',
                    defaultValue: '500',
                    description: 'Zeitspanne in Millisekunden, nachder der Signalwert mit WriteUpValue gesetzt wird. Gilt nur wenn isTipModeEnabled aktiviert ist.',
                    descriptionEN: 'Time period in milliseconds after MouseUp, when the signal value will be set to WriteUpValue. This propertie will be considered only if isTipModeEnabled is enabled.'
                },
                {
                    name: 'incrementMode',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Aktiviert den Inkrement-Modus. Beim Schreiben wird der aktuelle Signalwert um den Wert der Eigenschaft "writeValue" addiert.',
                    descriptionEN: 'Activates the increment mode of the button. On writing the value of the property "writeValue" will be added to the current signal value.'
                },
                {
                    name: 'resetOnOverflow',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Beim Schreiben wird der aktuelle Signalwert auf den Wert der Eigenschaft "minValue" (wenn der aktuelle Signalwert größer als der Wert der Eigenschaft "maxValue" ist) oder "maxValue" (wenn der aktuelle Signalwert weniger als der Wert der Eigenschaft "minValue" ist) zurückgestellt. Gilt nur wenn incrementMode aktiviert ist.',
                    descriptionEN: 'On writing the value of signal will be reset to the "minValue" (when the current value of signal is greater than the value of option "maxValue" ) or "maxValue" (when the current value of signal is smaller than the value of option "minValue" ). This property will be considered only if incrementMode is enabled.'
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
                },
                {
                    name: "writeItems",
                    type: "Array",
                    defaultValue: "",
                    description: 'Zusätzliche Signal/Werte Objekte für das gleichzeitige Schreiben von Signalen. Beispiel: writeItems: [{name:\'Setpoint 2\', value: 2},{name:\'Setpoint 3\', value: 3}]. Wenn diese Eigenschaft verwendet wird ist das Incrementieren und das Schreiben von Arrays nicht möglich',
                    descriptionEN: 'Additional items for writing multiple signals. E.g. : writeItems: [{name:\'Setpoint 2\', value: 2},{name:\'Setpoint 3\', value: 3}]. If this property is used following Operations are not possible, increment and arra writing'
                    
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


