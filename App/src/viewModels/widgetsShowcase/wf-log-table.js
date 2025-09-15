define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfLogTagTable";
            self.widgetCategory = "Historische Daten";

            self.connector = new signalsConnector();
            self.columnTitlePatternDevaultValue = ko.computed(function () {
                return self.connector.translate('I4SCADA_Value')() + " [%Unit%]";
            }, self);

            self.widgetProperties = [{
                    type: 'Array',
                    name: 'logTags',
                    defaultValue: '[]',
                    description: 'Einstellungen für die Spalten in der Tabelle. Jede Spalte muss durch ein Objekt mit folgenden Eigenschaften definiert sein: signalName, logTagName, isAlphanumeric. Beispiel { signalName: \'Level 1\', logTagName: \'LogTagLevel1\', isAlphanumeric: false }.',
                    descriptionEN: 'Represents the definition of the columns in the table. Each column definition is an object defined by the properties: signalName, logTagName, isAlphanumeric. Example { signalName: \'Level 1\', logTagName: \'LogTagLevel1\', isAlphanumeric: false }.'
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
                    type: 'String',
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Werte. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats are available on the documentation page of Numeral.js that you can find: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'isAlphanumeric',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert, dass die angezeigte Werte alphanumerisch sind. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                    descriptionEN: 'Defines, that the displayed values are alphanumeric. If the value is true, the property format is not taken into account.'

                },
                {
                    type: 'String',
                    name: 'title',
                    defaultValue: '',
                    description: 'Überschrift über der Tabelle',
                    descriptionEN: 'Heading above the table'
                },
                {
                    type: 'String',
                    name: 'columnTitleTemplate',
                    defaultValue: self.columnTitlePatternDevaultValue,
                    description: 'Definiert das Template für die Spalteüberschrift. Das Template kann Texte oder einen Namen einer Signaleigenschaft enthalten*. Für jeden Namen einer Signaleigenschaft ist ein Platzhalter erforderlich. Zum Beispiel  %AliasName%<br/>%Logs.LogTag%',
                    descriptionEN: 'Defines template for title of the column header. The template can contain text and names of signal properties*. For each signal property name a placeholder is required. For example: %AliasName%<br/>%Logs.LogTag%'
                },
                {
                    type: 'Number',
                    name: 'maxResults',
                    defaultValue: '100',
                    description: 'Maximale Anzahl der Einträge',
                    descriptionEN: 'Maximum number of entries'
                },
                {
                    type: 'Number',
                    name: 'itemsPerPage',
                    defaultValue: '20',
                    description: 'Maximale Anzahl der Einträge pro Seite, wenn pagingControlEnabled aktiv ist',
                    descriptionEN: 'Maximum number of entries per page, if pagingControlEnabled is active'
                },
                {
                    type: 'String',
                    name: 'emptyValueSymbol',
                    defaultValue: '-',
                    description: 'Dieses Symbol wird in der Tabelle zeigen, wo es kein Wert für LogTag gibt',
                    descriptionEN: 'This symbol show in cell without value'
                },
                {
                    type: 'Number',
                    name: 'tableHeight',
                    defaultValue: '300',
                    description: 'Tabellenhöhe in Pixel.',
                    descriptionEN: 'Table height in pixels.'
                },
                {
                    type: 'Boolean',
                    name: 'pagingControlEnabled',
                    defaultValue: 'true',
                    description: 'Aufteilung der Einträge auf Seiten, sowie Amzeige der Navigationselemente unter der Tabelle',
                    descriptionEN: 'Distribution of items on pages, and display the navigation elements under the table'
                },
                {
                    type: 'Boolean',
                    name: 'getLatestLogdata',
                    defaultValue: 'true',
                    description: 'Wenn diese Eigenschaft aktiv ist, werden beim Aktualisieren stets die letzten Log-Daten (maxResults) abgerufen.',
                    descriptionEN: 'When this property is active, the last log data (maxResults) be accessed when updating constantly.'
                },
                {
                    type: 'Boolean',
                    name: 'autoUpdate',
                    defaultValue: 'false',
                    description: 'Wenn diese Eigenschaft mit dem Wert true gesetzt ist, wird die Tabelle zyklisch automatisch aktualisiert. Bei der Aktualisierung des Tabelle wird die Eigenschaften endDate auf den aktuellen Zeitpunkt gesetzt, während die Eigenschaften startDate durch die Eigenschaften startOffset and startOffsetInterval deklariert werden.',
                    descriptionEN: 'When this property is active, then table will auto update the data. The refresh will be done with the endDate now and the startDate determined by the startOffset and startOffsetInterva.l'
                },
                {
                    type: 'Number',
                    name: 'updateRate',
                    defaultValue: '2000',
                    description: 'Das Aktualisierungsgeschwindigkeit der Tabelle in Millisekunden. Diese Eigenschaft wird nur berücksichtigt, wenn die Eigenschaft autoUpdate auf den Wert true gesetzt ist. Minimumwert ist ',
                    descriptionEN: 'The update rate in milliseconds. This property will be taken into consideration only if the autoUpdate is true.'
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '1',
                    description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start offset property'
                },
                {
                    type: "Boolean",
                    name: "settingsButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Dialog mit der Auswahl des Zeitbereich angezeigt wird.",
                    descriptionEN: "'Defines if the button for the dialog with time range selection should be shown."
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
                    name: 'signalsButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Dialog mit Signal- und LogTagauswahl angezeigt wird.',
                    descriptionEN: 'Defines if the button for signal and logtags selection dialog should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile angezeigt wird',
                    descriptionEN: 'Defines whether the header is displayed'
                },
                {
                    type: 'Boolean',
                    name: 'footerVisibility',
                    defaultValue: 'True',
                    description: 'Definiert ob die Fusszeile angezeigt wird',
                    descriptionEN: 'Defines whether the footer is displayed'
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
                    name: 'columnTooltipIconVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob das Symbol mit dem Tooltip im titel der Spalte angezeigt wird.',
                    descriptionEN: 'Defines whether the symbol with the tooltip is displayed in the title of the column'
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
                    description: 'CSS Klasse für die Button Leiste',
                    descriptionEN: 'CSS class for the Button bar'
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
                    name: "signalSelectionProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Dialogs mit Signal- und LogTagauswahl mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'signalsButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the signal and logtags selection dialog. This option is used in combination with the option \'signalsButtonVisibility\'.'
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
                    name: "configurationProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Konfigurations-Manager mindestens erforderlich ist. Diese Eigenschaft verwendet  sich in Kombination mit der Eigenschaft \'configurationButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the configuration manager. This option is used in combination with the option \'configurationButtonVisibility\'.'
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
                    name: "showDateTimeTooltip",
                    defaultValue: "false",
                    description: 'Definiert wie der Zeitbereich angezeigt werden soll, wenn aktiviert wird der Zeitbereich als Tooltip angezeigt',
                    descriptionEN: 'Defines whether the time range should be displayed. If enabled the time range will be displayed as a tooltip'
                },
                {
                    type: 'String',
                     name: 'dateTimeTooltipFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das Format des Zeitbereich Tooltips und des Zeitbereich Badge. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Defines the format of the datetime in the tooltip and badge. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'String',
                     name: 'dateTimeFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das Format des Zeitbereichs in den Zeilen und legt das datumszeitTooltipFormat fest, wenn es nicht angegeben wird. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Defines the format of the datetime in the rows and it will set the datetimeTooltipFormat if it is not specified. Specifies optional date and time format for timestamps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'String',
                    name: 'dateTimeFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das Format des Zeitbereichs in den Zeilen und legt das datumszeitTooltipFormat fest, wenn es nicht angegeben wird. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Defines the format of the datetime in the rows and it will set the datetimeTooltipFormat if it is not specified. Specifies optional date and time format for timestamps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'Number',
                    name: 'maxSignalCount',
                    defaultValue: '50',
                    description: 'Legt maximale Anzahl für die Suchergebnisse (Signale und Log Tags) in der Signal- und LogTagauswahl.',
                    descriptionEN: 'Set the maximum count for search results in the signal and logtags selection.'
                },
                {
                    type: 'Boolean',
                    name: 'showUnitLabel',
                    defaultValue: 'true',
                    description: 'Definiert ob die Einheit angezeigt wird.',
                    descriptionEN: 'Defines whether the Unit are displayed.'
                }

            ];

            self.signalProperties = [
                "Active",
                "AliasName",
                "AltValue",
                "AltValue_1",
                "AltValue_2",
                "AltValue_3",
                "AltValue_4",
                "Connector.Name",
                "Connector.Description",
                "DataTypeID",
                "Description",
                "DescriptionSymbolicText",
                "FactorX1",
                "FactorX2",
                "FactorY1",
                "FactorY2",
                "Group.Name",
                "Group.Description",
                "Hysterese",
                "HystereseAlarm",
                "HystereseAlarm_2",
                "HystereseLog",
                "HystereseLog_2",
                "Hysterese_2",
                "LogUserActivity",
                "Logs.Description",
                "Logs.LogTag",
                "Logs.Active",
                "Maximum",
                "Minimum",
                "Name",
                "OPCEnabled",
                "OPCQuality",
                "OfflineValue",
                "Server.Name",
                "Server.Description",
                "Status",
                "Unit",
                "VChannel",
                "VChannelInitValue",
                "VChannelTypeID",
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