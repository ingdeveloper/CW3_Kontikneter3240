define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfAlarmStateManager";
            self.widgetCategory = "Alarme und Meldungen";

            self.widgetProperties = [{
                    type: "Number",
                    name: "height",
                    defaultValue: "null",
                    description: "Optionale, fixe Höhe (px) für das gesamte Widget.",
                    descriptionEN: "Optional, fix height (px) of the widget."
                },
                {
                    type: 'Boolean',
                    name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile angezeigt wird.',
                    descriptionEN: 'Defines whether the header is displayed.'
                },
                {
                    type: "Boolean",
                    name: "settingsButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Dialog mit Filtereinstellungen angezeigt wird.",
                    descriptionEN: "Defines if the button for the dialog with filter settings should be shown."
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
                    type: "String",
                    name: "titleText",
                    defaultValue: "WEBfactory AlarmStateManager",
                    description: "Text in der Kopfzeile",
                    descriptionEN: "Header text"
                },
                {
                    type: "Number",
                    name: "count",
                    defaultValue: "100",
                    description: "Maximale Anzahl der Einträge, die angezeigt werden",
                    descriptionEN: "Maximum number of entries that are displayed"
                },
                {
                    type: "Array",
                    name: "columns",
                    defaultValue: "['AlarmTag', 'SignalName', 'Text', 'State']",
                    description: "Definiert welche Spalten* in tabellarischer Form zeigen werden.",
                    descriptionEN: "Defines columns* in a table."
                },
                {
                    type: "String",
                    name: "tag",
                    defaultValue: "",
                    description: "Definiert einen AlarmTag Filter, dass die Alarme filtert.",
                    descriptionEN: "Defines a AlarmTag filter that filters the alarm results."
                },
                {
                    type: "Array",
                    name: "alarmGroups",
                    defaultValue: "[ ]",
                    description: "Initiale Werte beim Filter für Alarmgruppen.",
                    descriptionEN: "Initial values of the filter for alarm groups."
                },
                {
                    type: "Array",
                    name: "alarmTypes",
                    defaultValue: "[ ]",
                    description: "Initiale Werte beim Filter für Alarmtypen.",
                    descriptionEN: "Initial values of the filter for alarm types."
                },
                {
                    type: "Boolean",
                    name: "filterAlarmGroupsByUser",
                    defaultValue: "false",
                    description: 'Definiert ob die Alarme nach den konfigurierten Alarmgruppen Berechtigungen des angemeldeten Benutzers gefiltert werden.',
                    descriptionEN: 'Defines whether the alarms filtered by Alarm group rights of the logged in user.'
                },

            ];

            self.alarmColumns = [
                "AlarmTag",
                "SignalName",
                "Text",
                "State"
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