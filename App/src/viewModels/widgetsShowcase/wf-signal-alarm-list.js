define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSignalAlarmList";
            self.widgetCategory = "Bedienen";

            self.widgetProperties = [
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
                    type: 'Boolean',
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
                },
                {
                    type: "String",
                    name: "titleText",
                    defaultValue: "WEBfactory SignalAlarmList",
                    description: "Text in der Kopfzeile",
                    descriptionEN: "Header text"
                },
                {
                    type: 'Array',
                    name: 'aliasNames',
                    defaultValue: '',
                    description: 'Definiert welche signale in der tabelle angezeigt werden, es können auch wildcards mit \'*\' verwendet werden.',
                    descriptionEN: 'Defines which signals are displayed in the table; wildcards with \'*\' can also be used.'
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
                    description: 'Systemberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
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
                    type: "String",
                    name: "exportProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Exportbutton mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'exportButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the export button. This option is used in combination with the option \'exportButtonVisibility\'.'
                },
                {
                    type: 'String',
                    name: 'exportFileName',
                    defaultValue: 'export.csv',
                    description: 'Definiert den Name der Exportdatei.',
                    descriptionEN: 'Defines the name of the export file.'
                },
                {
                    type: 'String',
                    name: 'exportColumnDelimiter',
                    defaultValue: ';',
                    description: 'Definiert das Trennzeichen der Spalten in der Exportdatei.',
                    descriptionEN: 'Defines the delimiter of the columns in the export file.'
                },
                {
                    type: 'String',
                    name: 'exportDateTimeFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel in der Exportdatei. Zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Specifies optional date and time format for timestaps in the export file. For example: DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'Boolean', name: 'patternVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Signalname- und Signal- beschreibungssuche angezeigt wird.',
                    descriptionEN: 'Defines whether the signal name and signal description search are displayed.'
                },
                {
                    type: 'Boolean', name: 'unitVisibility',
                    defaultValue: 'false',
                    description: 'Definiert ob die Einheitensuche angezeigt wird.',
                    descriptionEN: 'Defines whether the unit search is displayed.'
                },
                {
                    type: 'Boolean', name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile angezeigt wird.',
                    descriptionEN: 'Defines whether the header is displayed.'
                },
                {
                    type: 'Boolean',
                    name: 'configurationButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Konfigurations-Manager angezeigt wird.',
                    descriptionEN: 'Defines if the button for the configuration manager should be shown.'
                },
                {
                    type: "String",
                    name: "configurationProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Konfigurations-Manager mindestens erforderlich ist. Diese Eigenschaft verwendet  sich in Kombination mit der Eigenschaft \'configurationButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the configuration manager. This option is used in combination with the option \'configurationButtonVisibility\'.'
                },

                {
                    type: 'Boolean',
                    name: 'signalsButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Dialog mit Signalauswahl angezeigt wird.',
                    descriptionEN: 'Defines if the button for signal selection dialog should be shown.'
                },
                {
                    type: "String",
                    name: "signalSelectionProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Dialogs mit Signalauswahl mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'signalsButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the signal selection dialog. This option is used in combination with the option \'signalsButtonVisibility\'.'
                },
                {
                    type: "Boolean",
                    name: "settingsButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Dialog mit Filtereinstellungen angezeigt wird.",
                    descriptionEN: "Defines if the button for the dialog with filter settings should be shown."
                },
                {
                    type: "String",
                    name: "initialConfiguration",
                    defaultValue: "",
                    description: 'Der Name einer Konfiguration, welche automatisch initial geladen wird.',
                    descriptionEN: 'The name of the configuration to be loaded by default.'
                },
                {
                    type: "String",
                    name: "configurationNamespace",
                    defaultValue: "",
                    description: 'Der Namensraum für die Konfiguration.',
                    descriptionEN: 'The namespace for the configuration.'
                },
                {
                    type: "Boolean",
                    name: "showOnlyOwnConfigurations",
                    defaultValue: "false",
                    description: 'Definiert ob nur eigene Konfigurationen angezeigt wird.',
                    descriptionEN: 'Defines whether only own configurations are displayed.'
                },
                {
                    type: 'String',
                    name: 'cssClass',
                    defaultValue: '',
                    description: 'CSS Klasse für die Tabelle',
                    descriptionEN: 'CSS class for the table'
                },
                {
                    type: 'String',
                    name: 'buttonBarCssClass ',
                    defaultValue: 'btn btn-default',
                    description: 'CSS Klasse für die Buttons in der Kopfleiste',
                    descriptionEN: 'CSS class for buttons in the header toolbar'
                },
                {
                    type: 'String',
                    name: 'panelBarCssClass ',
                    defaultValue: 'panel panel-default',
                    description: 'CSS Klasse für die Kopfleiste.',
                    descriptionEN: 'CSS class for the header toolbar.'
                },
                {
                    type: 'String',
                    name: 'configurationButtonIconClass ',
                    defaultValue: 'wf wf-cog',
                    description: 'CSS Klasse für das Icon des Konfigurationsbutton',
                    descriptionEN: 'CSS Class for configuration button'
                },
                {
                    type: 'String',
                    name: 'rowItemCssClass ',
                    defaultValue: 'wf wf-cog',
                    description: 'CSS Klasse für das Row Alarm Element.',
                    descriptionEN: 'CSS Class for the row alarm element.'
                },

                {
                    type: "String",
                    name: "inactiveAlarmForeground",
                    defaultValue: "",
                    description: 'Textfarbe für inaktive Alarme.',
                    descriptionEN: 'Sets the inactive alarms foreground color.'
                },
                {
                    type: "String",
                    name: "inactiveAlarmBackground",
                    defaultValue: "",
                    description: 'Hintergrundfarbe für inaktive Alarme. Gilt als Textfarbe in der tabellarischen Darstellung. ',
                    descriptionEN: 'Sets the inactive background color.'
                },
                {
                    type: "String",
                    name: "acknowledgedAlarmForeground",
                    defaultValue: "",
                    description: 'Textfarbe für quittierte Alarme.',
                    descriptionEN: 'Sets the acknowledged alarms foreground color.'
                },
                {
                    type: "String",
                    name: "acknowledgedAlarmBackground",
                    defaultValue: "",
                    description: 'Hintergrundfarbe für quittierte Alarme. Gilt als Textfarbe in der tabellarischen Darstellung. ',
                    descriptionEN: 'Sets the acknowledged background color.'
                },
                {
                    type: "String",
                    name: "onAlarmForeground",
                    defaultValue: "",
                    description: 'Textfarbe für aktive Alarme.',
                    descriptionEN: 'Sets the active alarms foreground color.'
                },
                {
                    type: "String",
                    name: "onAlarmBackground",
                    defaultValue: "",
                    description: 'Hintergrundfarbe für aktive Alarme. Gilt als Textfarbe in der tabellarischen Darstellung. ',
                    descriptionEN: 'Sets the active background color.'
                },
                {
                    type: "String",
                    name: "offAlarmForeground",
                    defaultValue: "",
                    description: 'Textfarbe für gegangene Alarme.',
                    descriptionEN: 'Sets the gone alarms foreground color.'
                },
                {
                    type: "String",
                    name: "offAlarmBackground",
                    defaultValue: "",
                    description: 'Hintergrundfarbe für gegangene Alarme. Gilt als Textfarbe in der tabellarischen Darstellung. ',
                    descriptionEN: 'Sets the gone background color.'
                },

                {
                    type: "ISignalAlarmListColumnParams[]",
                    name: "columns",
                    defaultValue: "['AliasName', 'Description', 'Value', 'Unit', 'AlarmStatus', 'AlarmProcessingAndDisplayStatus']",
                    description: "Definiert welche Spalten* und  Texte in tabellarischer Form zeigen werden.",
                    descriptionEN: "Defines columns* in a table, with texts as well."
                },
                {
                    type: 'Number',
                    name: 'maxSignalPageCount ',
                    defaultValue: '50',
                    description: 'Maximale Anzahl für die Suchergebnisse (Signale) in der Signaltabelle.',
                    descriptionEN: 'Set the maximum count for search results in the signal table.'
                },
                {
                    type: 'String',
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Anzeige. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finde:n http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats can be find on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'dateTimeFormat',
                    type: 'String',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Datumzeitformat für die Ausgabe. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel an, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Datetimeformat for the output. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'Number',
                    name: 'maxSignalCount',
                    defaultValue: '100',
                    description: 'Maximale Anzahl für die Suchergebnisse (Signale) in der Signalauswahl.',
                    descriptionEN: 'Set the maximum count for search results in the signal selection.'
                },
                {
                    type: 'Number',
                    name: 'maxSignalsForGroupAdd',
                    defaultValue: '500',
                    description: 'Maximale Anzahl an Signalen, die zur Laufzeit über beim Auswählen ganzer Signalgruppen hinzugefügt werden können.',
                    descriptionEN: 'Set the maximum count for signals which can be added at runtime when a complete signal group will be selected.'
                },
                {
                    name: 'groupsFilter',
                    type: 'Array',
                    defaultValue: '',
                    description: 'Definiert welche Signalgruppen augewählt werden können.',
                    descriptionEN: 'Defines a set of the signal groups that can be selected.'
                },
                {
                    name: 'signalsFilter',
                    type: 'Array',
                    defaultValue: '',
                    description: 'Definiert welche Signale, augewählt werden können.',
                    descriptionEN: 'Defines a set of the signals that can be selected.'
                },
                {
                    name: 'signalNamePattern',
                    type: 'String',
                    defaultValue: '',
                    description: 'Definiert eine Pattern für die Signalnamen, die automatisch angezeigt werden - z.B. "Setpoint *"',
                    descriptionEN: 'Defines a pattern for signals, which should be shown automatically - e.g. "Setpoint *".'
                },
                {
                    name: 'pattern',
                    type: 'String',
                    defaultValue: '',
                    description: 'Definiert eine filter Pattern für die Signalnamen oder Signalbeschreibungen.',
                    descriptionEN: 'Defines a filter pattern for the signal names or signal descriptions.'
                },
                {
                    name: 'unit',
                    type: 'String',
                    defaultValue: '',
                    description: 'Definiert eine filter für die Einheit.',
                    descriptionEN: 'Defines a filter for the unit.'
                }
            ];

            self.columns = [
                "AliasName",
                "Description",
                "Value",
                "Unit",
                "AlarmStatus",
                "AlarmProcessingAndDisplayStatus"
            ];

            self.parameters =
            [
                [
                    {
                        name: "ISignalAlarmListColumnParams",
                        properties: [
                            { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger spaltenname.', descriptionEN: 'Unique column name.' },
                            { name: 'text', type: 'String', defaultValue: '', description: 'Spalten Anzeige Text.', descriptionEN: 'Column display text.' },

                        ]
                    },
                ],
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