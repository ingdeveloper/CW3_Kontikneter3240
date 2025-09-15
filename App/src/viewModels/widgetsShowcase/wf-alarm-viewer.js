define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfAlarmViewer";
            self.widgetCategory = "Alarme und Meldungen";

            self.widgetProperties = [{
                    type: 'Boolean',
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
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
                    name: "titleText",
                    defaultValue: "WEBfactory AlarmViewer",
                    description: "Text in der Kopfzeile",
                    descriptionEN: "Header text"
                },
                {
                    type: "Boolean",
                    name: "onlineAlarmsMode",
                    defaultValue: "true",
                    description: "Wenn diese Eingeschaft mit Default-Wert true bealssen wird, werden zyklisch aktuell anstehenden Alarme (online) abgerufen und angezeigt. Wenn der Wert auf false parametriert wird, werden hystorische Alarme (offline) abgerufen und angezeigt.",
                    descriptionEN: "If this is provided with default value false, cyclically current alarms (online) are retrieved and displayed. If the value is configured to false alarms are historically (offline) retrieved and displayed."
                },
                {
                    type: 'Number',
                    name: 'updateRate',
                    defaultValue: '2000',
                    description: 'Das Aktualisierungsgeschwindigkeit des AlarmViewer in Millisekunden. Diese Eigenschaft wird nur berücksichtigt, wenn die Eigenschaft onlineAlarmsMode auf den Wert true gesetzt ist. ',
                    descriptionEN: 'The update rate in milliseconds. This property will be taken into consideration only if the onlineAlarmsMode is true.'
                },
                {
                    name: 'dateTimeFormat',
                    type: 'String',
                    defaultValue: '',
                    description: 'Datumzeitformat für die Ausgabe. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel an, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Datetimeformat for the output. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'

                },
                {
                    type: "Boolean",
                    name: "tableView",
                    defaultValue: "false",
                    description: "Ausgabe der Alarmliste in tabellarischer Form. Wenn der Wert auf false belassen wird, werden die Einträge als Kacheln ausgegeben.",
                    descriptionEN: "Show alarm list entries in a table. If the value is left to false, the alarm entries will be shown as tiles / boxes."
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '30',
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
                    type: 'Boolean',
                    name: 'isRollingTimeWindow',
                    defaultValue: 'false',
                    description: 'Boolescher Wert, der angibt, ob das Zeitfenster läuft und nicht fixiert ist',
                    descriptionEN: 'Boolean value that shows if the time window is rolling and it is not fixed'
                },
                {
                    type: "Array",
                    name: "columns",
                    defaultValue: "['Priority', 'StatusText', 'Active', 'Group', 'Type', 'Text']",
                    description: "Definiert welche Spalten* in tabellarischer Form zeigen werden.",
                    descriptionEN: "Defines columns* in a table."
                },
                {
                    type: "Array",
                    name: "fields",
                    defaultValue: "['Priority', 'Type', 'Text', 'Active', 'Acknowledged', 'Gone']",
                    description: "Definiert welche Felder* in Kachelnform zeigen werden.",
                    descriptionEN: "Defines fields* in a tiles / boxes view."
                },
                {
                    type: "",
                    name: "alarmStatusFilter",
                    defaultValue: "All",
                    description: "Filter für Alarmstatus. Verfügbare Statusfilter Werte:  All, Gone, Active, NotAcknowledged, ActiveOrNotAcknowledged",
                    descriptionEN: "Filter for alarm status. Available status filter values: All, Gone, Active, NotAcknowledged, ActiveOrNotAcknowledged"
                },
                {
                    type: "Array",
                    name: "alarmGroups",
                    defaultValue: "['*']",
                    description: "Initiale Werte beim Filter für Alarmgruppen.",
                    descriptionEN: "Initial values of the filter for alarm groups."
                },
                {
                    type: "Array",
                    name: "alarmTypes",
                    defaultValue: "['*']",
                    description: "Initiale Werte beim Filter für Alarmtypen.",
                    descriptionEN: "Initial values of the filter for alarm types."
                },
                {
                    type: "",
                    name: "sortOrder",
                    defaultValue: "DateDescending",
                    description: "Sortierreihenfolge für die Ausgabe der Einträge. Verfügbare Statusfilter: DateDescending, PriorityDescending",
                    descriptionEN: "Sort order for the output of messages. Available Status Filter:  DateDescending, PriorityDescending </ strong>"
                },
                {
                    type: "Number",
                    name: "maxRowCount",
                    defaultValue: "100",
                    description: "Maximale Anzahl der Einträge, die angezeigt werden",
                    descriptionEN: "Maximum number of entries that are displayed"
                },
                {
                    type: "Number",
                    name: "minimumPriority",
                    defaultValue: "0",
                    description: "Niedrigste Priorität der angezeiten Einträge",
                    descriptionEN: "Lowest priority is the time entries"
                },
                {
                    type: "Number",
                    name: "maximumPriority",
                    defaultValue: "100",
                    description: "Höchste Priorität der angezeiten Einträge",
                    descriptionEN: "The highest priority is the time entries"
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
                    type: 'String',
                    name: 'tileItemsCssClass ',
                    defaultValue: 'wf wf-cog',
                    description: 'CSS Klasse für das Tile Alarm Element.',
                    descriptionEN: 'CSS Class for the tile alarm element.'
                },
                {
                    type: 'Boolean',
                    name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile angezeigt wird.',
                    descriptionEN: 'Defines whether the header is displayed.'
                },
                {
                    type: 'Boolean',
                    name: 'columnsHeaderVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Tabellenkopfzeile angezeigt wird.',
                    descriptionEN: 'Defines whether the table header is displayed.'
                },

                {
                    type: 'Boolean',
                    name: 'rowNumberVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Zeilennummer in der Tabelle angezeigt wird.',
                    descriptionEN: 'Defines whether the table row number is displayed.'
                },

                {
                    type: "Boolean",
                    name: "ackButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den quittieren Dialog angezeigt wird.",
                    descriptionEN: "Defines if the button for acknowledgement dialog should be shown."
                },
                {
                    type: "Boolean",
                    name: "groupAcknowledgementVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den gruppe quittieren Dialog angezeigt wird.",
                    descriptionEN: "Defines if the button for group acknowledgement dialog should be shown."
                },
                {
                    type: "Boolean",
                    name: "settingsButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Dialog mit Filtereinstellungen angezeigt wird.",
                    descriptionEN: "Defines if the button for the dialog with filter settings should be shown."
                },
                {
                    type: 'Boolean',
                    name: 'configurationButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Konfigurations-Manager angezeigt wird.',
                    descriptionEN: 'Defines if the button for the configuration manager should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'templateSwitchVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Schalter für die Kachel und Tabellenansicht angezeigt wird.',
                    descriptionEN: 'Defines if the switch for the tiles and table view should be shown.'
                },
                {
                    type: "Boolean",
                    name: "groupFilterVisibility",
                    defaultValue: "true",
                    description: "Anzeige des Auswahlfelds für die Gruppen im Bereich Einstellungen.",
                    descriptionEN: "Display the group selection box in filter Settings"
                },
                {
                    type: "Boolean",
                    name: "typeFilterVisibility",
                    defaultValue: "true",
                    description: "Anzeige des Alarmtypen Auswahlfelds / Filters im Bereich Einstellungen.",
                    descriptionEN: "Display of alarm types selection box in filter Settings area."
                },
                {
                    type: "Boolean",
                    name: "stateFilterVisibility",
                    defaultValue: "true",
                    description: "Anzeige des Alarmstatus Auswahlfelds / Filters im Bereich Einstellungen.",
                    descriptionEN: "Display of alarm state selection box in filter Settings"
                },
                {
                    type: "Boolean",
                    name: "priorityFilterVisibility",
                    defaultValue: "true",
                    description: "Anzeige des Alarmpriorität Auswahlfelds / Filters im Bereich Einstellungen.",
                    descriptionEN: "Display of alarm priority selection box in filter Settings"
                },
                {
                    type: "Boolean",
                    name: "columnFilterVisibility",
                    defaultValue: "true",
                    description: "Anzeige der Spalten Filters Auswahlfelds und des Eingabefeldes im Bereich Einstellungen.",
                    descriptionEN: "Display of column filter selection box and imput field in filter Settings"
                },
                {
                    type: 'Boolean',
                    name: 'exportButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Export der Daten ins CSV-Format angezeigt wird.',
                    descriptionEN: 'Defines if the button ffor exporting the data to CSV format should be shown.'
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
                    type: "String",
                    name: "exportProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Exportbutton mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'exportButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the export button. This option is used in combination with the option \'exportButtonVisibility\'.'
                },
                {
                    type: "String",
                    name: "acknowledgedAlarmBackground",
                    defaultValue: "#E08F00",
                    description: 'Hintergrundfarbe für quittierte Alarme.',
                    descriptionEN: 'Sets the acknowledged alarms background color.'
                },
                {
                    type: "String",
                    name: "acknowledgedAlarmForeground",
                    defaultValue: "#FFFFFF",
                    description: 'Textfarbe für quittierte Alarme.',
                    descriptionEN: 'Sets the acknowledged alarms foreground color.'
                },
                {
                    type: "String",
                    name: "acknowledgedAndGoneAlarmBackground",
                    defaultValue: "#00CC66",
                    description: 'Hintergrundfarbe für quittierte und gegangene Alarme. Gilt als Textfarbe in der tabellarischen Darstellung. ',
                    descriptionEN: 'Sets the acknowledged and gone alarms background color.'
                },
                {
                    type: "String",
                    name: "acknowledgedAndGoneAlarmForeground",
                    defaultValue: "#FFFFFF",
                    description: 'Textfarbe für quittierte und gegangene Alarme.',
                    descriptionEN: 'Sets the acknowledged and gone alarms foreground color.'
                },
                {
                    type: "String",
                    name: "activeAlarmBackground",
                    defaultValue: "#990100",
                    description: 'Hintergrundfarbe für aktive Alarme. Gilt als Textfarbe in der tabellarischen Darstellung.',
                    descriptionEN: 'Sets the active alarms background color.'
                },
                {
                    type: "String",
                    name: "activeAlarmForeground",
                    defaultValue: "#FFFFFF",
                    description: 'Textfarbe für aktive Alarme.',
                    descriptionEN: 'Sets the active alarms foreground color.'
                },
                {
                    type: "String",
                    name: "inactiveAlarmBackground",
                    defaultValue: "#0c9900",
                    description: 'Hintergrundfarbe für inaktive Alarme. Gilt als Textfarbe in der tabellarischen Darstellung.',
                    descriptionEN: 'Sets the inactive alarms background color.'
                },
                {
                    type: "String",
                    name: "inactiveAlarmForeground",
                    defaultValue: "#FFFFFF",
                    description: 'Textfarbe für inaktive Alarme.',
                    descriptionEN: 'Sets the inactive alarms foreground color.'
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
                    type: "Boolean",
                    name: "filterAlarmGroupsByUser",
                    defaultValue: "false",
                    description: 'Definiert ob die Alarme nach den konfigurierten Alarmgruppen Berechtigungen des angemeldeten Benutzers gefiltert werden.',
                    descriptionEN: 'Defines whether the alarms filtered by Alarm group rights of the logged in user.'
                },
                {
                    type: "String",
                    name: "columnFilter",
                    defaultValue: "None",
                    description: 'Definiert nach welcher Spalte* gefiltert wird.',
                    descriptionEN: 'Defines the filtered column*.'
                },
                {
                    type: "String",
                    name: "columnFilterPattern",
                    defaultValue: 'empty String',
                    description: 'Definiert das Spalten Pattern nach dem gefiltert wird. Es kann das Asterisk als Platzhalter verwendet werden.',
                    descriptionEN: 'Defines the pattern for filtering the specified column. The Asterisk could be used as placholder.'
                },
                {
                    type: "Boolean",
                    name: "playSound",
                    defaultValue: 'false',
                    description: 'Definiert ob ein Sound abgespielt werden soll wenn ein neuer Alarm kommt.',
                    descriptionEN: 'Defines if a sound should be played if a new alarm exist.'
                },
                {
                    type: "String",
                    name: "soundFilePath",
                    defaultValue: 'HornAlarm.mp3',
                    description: 'Definiert den Namen bzw. den Pfad des zu spielenden Sounds. Ausgehend vom Hostnamen des Webservices.',
                    descriptionEN: 'Defines the Name or Path of the Sound which should played. Based on the hostname of the Webservice.'
                },
                {
                    type: "Boolean",
                    name: "loop",
                    defaultValue: 'false',
                    description: 'Definiert ob der Sound in einer Endlosschleife abgespielt werden soll, bis dieser gegangen ist oder quittiert wurde.',
                    descriptionEN: 'Defines if the sound should played in a loop till the alarm is acknowledged or gone.'
                },
                {
                    type: "string",
                    name: "linkTarget",
                    defaultValue: '_self',
                    description: 'Definiert wie das verlinkte Dokument geöffnet wird. Mögliche Eigenschaften sind: _blank, _self, _parent, _top.',
                    descriptionEN: 'The linkTarget specifies where to open the linked document. Possible properties are: _blank, _self, _parent, _top.'
                },
                {
                    deprecated: true,
                    type: "String",
                    name: "alarmGroup",
                    defaultValue: "",
                    description: "Neue Eigenschaft: 'alarmGroups'. Initialer Wert beim Filter für Alarmgruppen.",
                    descriptionEN: "New property: 'alarmGroups'. Initial value of the filter for alarm groups."
                },
                {
                    deprecated: true,
                    type: "String",
                    name: "alarmType",
                    defaultValue: "",
                    description: "Neue Eigenschaft: 'alarmTypes'. Initialer Wert beim Filter für Alarmtypen.",
                    descriptionEN: "New property: 'alarmTypes'. Initial value of the filter for alarm types."
                }
            ];

            self.alarmColumns = [
                "Priority",
                "StatusText",
                "Group",
                "Type",
                "Text",
                "Name",
                "Active",
                "Gone",
                "Acknowledged",
                "SystemTime",
                "HelpCause",
                "HelpEffect",
                "HelpRepair",
                "GeneralComment",
                "OccurrenceComment",
                "AcknowledgeComment",
                "NavigationSource",
                "NavigationTarget",
                "SignalName",
                "ServerName",
                "HttpLink",
                "OccurrenceCount",
                "OpcItem",
                "Duration",
                "AcknowledgedWithComment",
                "AcknowledgeUserName",
                "ExtendedProperty1 - ExtendedProperty32"
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