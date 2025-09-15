define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSignalInformationPopover";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
                [
                    {
                        name: 'signalName',
                        type: 'string',
                        defaultValue: '',
                        description: 'Name des Signals, dessen informationen angezeogt werden sollen.',
                        descriptionEN: 'Name of the signal whose characteristics or information should be displayed.'
                    },
                    {
                        name: 'label',
                        type: 'String',
                        defaultValue: '',
                        description: 'Übersetzbarer Labeltext.',
                        descriptionEN: 'Translateable label text.'
                    },
                    {
                        name: 'properties',
                        type: '[]',
                        defaultValue: '',
                        description: 'Stellt die Definition der Signalseigenschaften dar. Jede Eigenschaftdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: name, label. Beispiel { name: \'Name\', text: \'Name des Signals \'}.',
                        descriptionEN: 'Represents the definition of the signal properties. Each property definition is an object defined by the properties: name, label. Example { name: \'Name\', text: \'Name des Signals \'}.'
                    },
                    {
                        name: 'popoverTitle',
                        type: 'String',
                        defaultValue: '',
                        description: 'Text in der Kopfzeile des Popovers.',
                        descriptionEN: 'Text inside the popover header.'
                    },
                    {
                        name: 'headerCssClass',
                        type: 'String',
                        defaultValue: '',
                        description: 'CSS Klasse für die Kopfzeile des Popover.',
                        descriptionEN: 'CSS class for the popover header.'
                    },
                    {
                        name: 'position',
                        type: 'String',
                        defaultValue: 'right',
                        description: 'Definiert wie das Popover positioniert wird - top|bottom|left|right|auto. Wenn "auto" angegeben ist, wird das Popover dynamisch neu ausgerichtet. Wenn zum Beispiel die Position "auto left" ist, wird das Popover nach links angezeigt, ansonsten wird es rechts angezeigt.',
                        descriptionEN: 'Defines how to position the popover - top|bottom|left|right|auto. When "auto" is specified, it will dynamically reorient the popover. For example, if position is "auto left", the popover will display to the left when possible, otherwise it will display right.'
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
                        description: 'Definiert, dass der angezeigte Wert alphanumerisch ist. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                        descriptionEN: 'Defines, that the displayed value is alphanumeric. If the value is true, the property format is not taken into account.'

                    },
                    {
                        name: 'iconClass',
                        type: 'String',
                        defaultValue: 'wf wf-info',
                        description: 'CSS Klasse für das Icon Element',
                        descriptionEN: 'CSS Class for Icon Element'
                    },
                    {
                        name: 'objectID',
                        type: 'String',
                        defaultValue: '',
                        description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                        descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
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
                }
                ];

            self.signalProperties =
                [
                    "Active",
                    "AliasName",
                    "AltValue",
                    "AltValue_1",
                    "AltValue_2",
                    "AltValue_3",
                    "AltValue_4",
                    "Connector.ID",
                    "Connector.Name",
                    "Connector.Description",
                    "CurrentValue",
                    "DataTypeID",
                    "Description",
                    "DescriptionSymbolicText",
                    "DiscreteValues",
                    "FactorX1",
                    "FactorX2",
                    "FactorY1",
                    "FactorY2",
                    "Group.ID",
                    "Group.Name",
                    "Group.Description",
                    "Hysterese",
                    "HystereseAlarm",
                    "HystereseAlarm_2",
                    "HystereseLog",
                    "HystereseLog_2",
                    "Hysterese_2",
                    "LogUserActivity",
                    "Logs",
                    "Maximum",
                    "Minimum",
                    "Name",
                    "OPCEnabled",
                    "OPCQuality",
                    "OfflineValue",
                    "Server.ID",
                    "Server.Name",
                    "Server.Description",
                    "Status",
                    "Unit",
                    "VChannel",
                    "VChannelInitValue",
                    "VChannelTypeID"
                    //"WriteGroup"
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