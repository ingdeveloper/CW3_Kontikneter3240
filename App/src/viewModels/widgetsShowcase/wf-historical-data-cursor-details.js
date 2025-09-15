define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfHistoricalDataCursorDetails";
            self.widgetCategory = "Historische Daten";

            self.widgetProperties =
                [{
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                },
                {
                    name: 'displayMode',
                    type: 'SeriesDetailsDisplayMode',
                    defaultValue: 'SeriesDetailsDisplayMode.Row',
                    description: 'Definiert den Anzeigemodus, verfügbar sind Row, Column, Card.',
                    descriptionEN: 'Defines the display mode, available are Row, Column, Card.'
                },
                {
                    name: 'fields',
                    type: 'CursorName | CursorValue | CursorTimestamp []',
                    defaultValue: '["CursorName", "CursorValue", "CursorTimestamp"]',
                    description: 'Definiert welche Felder angezeigt werden.',
                    descriptionEN: 'Defines which fields are displayed.'
                },
                {
                    type: 'String',
                    name: 'groupName',
                    defaultValue: '',
                    description: 'Definiert einen Namensraum für den Serien Provider.',
                    descriptionEN: 'Defines a namespace for the serial provider.'
                },
                {
                    type: 'String',
                    name: 'controlName',
                    defaultValue: '',
                    description: 'Definiert einen Namensraum für den Chart Serien Provider. Die Eigenschaft ist optional.',
                    descriptionEN: 'Defines a namespace for the serial chart provider. This property is optional.'
                },
                {
                    type: 'Boolean',
                    name: 'ignoreCommonConfiguration',
                    defaultValue: 'true',
                    description: 'Ignoriert die Common-Konfiguration, um die Konfiguration beim Abonnement nicht zu überschreiben.',
                    descriptionEN: 'Will ignore the common configuration, to not overwrite configuration on subscription.'
                },
                {
                    type: 'Boolean',
                    name: 'ignoreChartConfiguration',
                    defaultValue: 'true',
                    description: 'Ignoriert die Chart-Konfiguration, um die Konfiguration beim Abonnement nicht zu überschreiben.',
                    descriptionEN: 'Will ignore the chart configuration, to not overwrite configuration on subscription.'
                },
                {
                    name: 'timeSeriesMode',
                    type: 'TimeSeriesMode',
                    defaultValue: 'TimeSeriesMode.Offline',
                    description: 'Definiert den Modus, Online oder Offline. Im Onlinemodus werden die daten Zyklisch aktualisiert, im Offlinemodus kann der Bnutzer die Daten mit einem refresh Button aktualisieren.',
                    descriptionEN: 'Defines the mode, online or offline. In online mode the data is updated cyclically, in offline mode the user can update the data with a refresh button.'
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, hours, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, hours, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '15',
                    description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start offset property.'
                },
                {
                    type: 'String',
                    name: 'endOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'endOffsetIntervall',
                    defaultValue: '0',
                    description: 'Nummerischer Wert für die endOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start end offset property.'
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
                    type: 'String | Number',
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
                ];

            self.enums = [
                {
                    name: "SeriesDetailsMode",
                    properties: [
                        'Manual',
                        'Automatic'
                    ]
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


