define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSignalInformation";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
                [
                    {
                        name: 'signalName',
                        type: 'string',
                        defaultValue: '',
                        description: 'Name des Signals, dessen informationen angezeigt werden sollen.',
                        descriptionEN: 'Name of the signal whose characteristics or information should be displayed.'
                    },
                    {
                        name: 'logTagName',
                        type: 'string',
                        defaultValue: '',
                        description: 'Name des LogTag, dessen informationen angezeigt werden sollen. Es wird verwendet, wenn die Eigenschaft "propertyName" gleich "Logs.Description", "Logs.LogTag" oder "Logs.Active" ist.',
                        descriptionEN: 'Name of the logtag whose characteristics or information should be displayed. It will be used when the "propertyName" is equal to "Logs.Description", "Logs.LogTag", or "Logs.Active".'
                    },
                    {
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
                        name: 'propertyName',
                        type: 'String',
                        defaultValue: 'Unit',
                        description: 'Name der Eigenschaft des Signals* - z.B. "Unit"',
                        descriptionEN: 'Name of the property of the signal* - for example, "Unit"'
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
                    "VChannelTypeID",
                    "Logs.Description",
                    "Logs.LogTag",
                    "Logs.Active"
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