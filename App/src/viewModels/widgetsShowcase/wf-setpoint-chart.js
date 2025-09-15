define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfSetpointChart";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [

                {
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
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
                },
                {
                    type: "Array",
                    name: "xAxesSignalNames",
                    defaultValue: '[]',
                    description: 'Die Namen der Signale, die für die x-Achse verwendet werden.',
                    descriptionEN: 'The names of the signals that will used for the x-axes.'
                },
                {
                    type: "Array",
                    name: "yAxesSignalNames",
                    defaultValue: '[]',
                    description: 'Die Namen der Signale, die für die y-Achse verwendet werden.',
                    descriptionEN: 'The names of the signals that will used for the y-axes.'
                },
                {
                    type: "String",
                    name: "xAxesArraySignalName",
                    defaultValue: "",
                    description: 'Der Name des Signals, das für die y-Achse verwendet wird, der Signal wert muss ein Array sein.',
                    descriptionEN: 'The name of the signal used for the y-axis, the signal value must be an array.'
                },
                {
                    type: "String",
                    name: "yAxesArraySignalName",
                    defaultValue: "",
                    description: 'Der Name des Signals, das für die x-Achse verwendet wird, der Signal wert muss ein Array sein.',
                    descriptionEN: 'The name of the signal used for the x-axis, the signal value must be an array.'
                },

                {
                    type: "Array",
                    name: "xAxesValues",
                    defaultValue: "[]",
                    description: "Statische array mit werten für die x-achse.",
                    descriptionEN: "Static array with values for the x-axis."
                },
                {
                    type: "Array",
                    name: "yAxesValues",
                    defaultValue: "[]",
                    description: "Statische array mit werten für die y-achse.",
                    descriptionEN: "Static array with values for the y-axis."
                },
 
                {
                    type: "Number",
                    name: "min",
                    defaultValue: "null",
                    description: "Y-Achse minimum.",
                    descriptionEN: "Y-axis minimum."
                },
 
                {
                    type: "Number",
                    name: "max",
                    defaultValue: "null",
                    description: "Y-Achse maximum.",
                    descriptionEN: "Y-axis maximum."
                },
 
                {
                    type: "String",
                    name: "labelSymbolicText",
                    defaultValue: "Setpoint",
                    description: "Bezeichnung.",
                    descriptionEN: "Label text."
                },
 
                {
                    type: "String",
                    name: "yAxesSymbolicText",
                    defaultValue: "",
                    description: "Bezeichnung der Y-Achse.",
                    descriptionEN: "Label of the y-axis."
                },
 
                {
                    type: "String",
                    name: "xAxesSymbolicText",
                    defaultValue: "",
                    description: "Bezeichnung der x-Achse.",
                    descriptionEN: "Label of the x-axis."
                },
 
                {
                    type: "String",
                    name: "color",
                    defaultValue: "#ff0000",
                    description: "Farbe der Kurve.",
                    descriptionEN: "Color of the graph."
                }, 
                {
                    type: "Number",
                    name: "height",
                    defaultValue: "null",
                    description: "Optionale, fixe Höhe (px) für das gesamte Widget.",
                    descriptionEN: "Optional, fix height (px) of the widget."
                },
                {
                    type: "String",
                    name: "xAxesLineSignalName",
                    defaultValue: "",
                    description: "Signalname für die x-Achsen Linie.",
                    descriptionEN: "Signalname for x-axis line"
                },
                {
                    type: "String",
                    name: "yAxesLineSignalName",
                    defaultValue: "",
                    description: "Signalname für die y-Achsen Linie.",
                    descriptionEN:  "Signalname for y-axis line"
                } ,

                {
                    type: "String",
                    name: "xAxesLineSymbolicText",
                    defaultValue: "",
                    description: "Bezeichnung der X-Achse Linie.",
                    descriptionEN: "Label of the x-axis line."
                },
                {
                    type: "String",
                    name: "yAxesLineSymbolicText",
                    defaultValue: "",
                    description: "Bezeichnung der Y-Achse Linie.",
                    descriptionEN: "Label of the y-axis line."
                },
                {
                    type: "String",
                    name: "xAxesLinePropertyName",
                    defaultValue: 'AliasName',
                    description: 'Name der Eigenschaft des x-Achsen Linien Signals* - z.B. "Unit", die als Bezeichnung verwendet wird.',
                    descriptionEN: 'Name of the property of the x-axis line signal* - for example, "Unit", used for label.'
                },
                {
                    type: "String",
                    name: "yAxesLinePropertyName",
                    defaultValue: 'AliasName',
                    description: 'Name der Eigenschaft des y-Achsen Linien Signals* - z.B. "Unit", die als Bezeichnung verwendet wird.',
                    descriptionEN: 'Name of the property of the y-axis line signal* - for example, "Unit", used for label.'
                },
                {
                    type: "String",
                    name: "xAxesPropertyName",
                    defaultValue: '',
                    description: 'Name der Eigenschaft der x-Achsen Bezeichnung* - z.B. "Unit". Wenn nicht definiert wird xAxesSymbolicText verwendet.',
                    descriptionEN: 'Name of the property for the x-axis label*. If not defined xAxesSymbolicText will be used.'
                },
                {
                    type: "String",
                    name: "yAxesPropertyName",
                    defaultValue: '',
                    description: 'Name der Eigenschaft der y-Achsen Bezeichnung* - z.B. "Unit". Wenn nicht definiert wird yAxesSymbolicText verwendet.',
                    descriptionEN: 'Name of the property for the y-axis signal* label. If not defined yAxesSymbolicText will be used.'
                },
                {
                    type: "Boolean",
                    name: "showAxesTextInTooltip",
                    defaultValue: 'false',
                    description: 'Wenn aktiviert wird die Achsenbeschreibung im Tooltip angezeigt.',
                    descriptionEN: 'If set, the axis description is displayed in tooltip.'
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