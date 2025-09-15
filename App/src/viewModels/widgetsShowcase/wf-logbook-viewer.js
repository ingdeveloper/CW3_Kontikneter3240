define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfLogbookViewer";
            self.widgetCategory = "Alarme und Meldungen";

            self.widgetProperties =
                [
                    {
                        type: "String",
                        name: "defaultItemClass",
                        defaultValue: "wf-callout-box wf-callout-box-info",
                        description: "Verfügbare Klassen mit vordefinierten Styles sind: 'wf-callout-box wf-callout-box-info', 'wf-callout-box wf-callout-box-success', 'wf-callout-box wf-callout-box-danger', 'wf-callout-box wf-callout-box-warning', 'wf-callout-box wf-callout-box-primary'.",
                        descriptionEN: "Available class names with predefined styles are: 'wf-callout-box wf-callout-box-info', 'wf-callout-box wf-callout-box-success', 'wf-callout-box wf-callout-box-danger', 'wf-callout-box wf-callout-box-warning', 'wf-callout-box wf-callout-box-primary'."
                    },
                    {
                        type: "Number",
                        name: "height",
                        defaultValue: "auto",
                        description: "Panel Höhe in px",
                        descriptionEN: "Panel height in px."
                    },
                    {
                        type: "Number",
                        name: "updateRate",
                        defaultValue: "5000",
                        description: "Das Aktualisierungsgeschwindigkeit des Widgets in Millisekunden. ",
                        descriptionEN: "The update rate in milliseconds."
                    },
                    {
                        type: "Number",
                        name: "maxResults",
                        defaultValue: "5",
                        description: "Maximale Anzahl der abgerufenen Einträge.",
                        descriptionEN: "Maximum count for the returned entries."
                    },
                    {
                        type: 'String',
                        name: 'startOffset',
                        defaultValue: 'days',
                        description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                        descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years.'
                    },
                    {
                        type: 'Number',
                        name: 'startOffsetIntervall',
                        defaultValue: '7',
                        description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                        descriptionEN: 'Numeric value for the start offset property.'
                    },
                    {
                        type: 'Boolean',
                        name: 'getLatestLogdata',
                        defaultValue: 'true',
                        description: 'Wenn diese Eigenschaft aktiv ist, werden beim Aktualisieren stets die letzten Log-Daten (maxResults) aus der Datenbank abgerufen.',
                        descriptionEN: 'When this property is active, the last log data (maxResults) are retrieved from the database.'
                    },
                    {
                        type: "String",
                        name: "selectedTopic",
                        defaultValue: "",
                        description: "Vorselektiertes Thema.",
                        descriptionEN: "Preselected topic."
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