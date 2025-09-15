define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfLogbook";
            self.widgetCategory = "Alarme und Meldungen";

            self.widgetProperties =
            [
                {
                    type: 'Boolean',
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
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
                    name: 'buttonBarCssClass ',
                    defaultValue: 'btn btn-default',
                    description: 'CSS Klasse für die Buttons in der Kopfleiste.',
                    descriptionEN: 'CSS class for buttons in the header toolbar.'
                },
                {
                    type: 'String',
                    name: 'configurationButtonIconClass ',
                    defaultValue: 'wf wf-cog',
                    description: 'CSS Klasse für das Icon des Konfigurationsbutton',
                    descriptionEN: 'CSS Class for configuration button'
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
                    descriptionEN: "'Defines if the button for the dialog with filter settings should be shown."
                },
                {
                    type: 'Boolean', name: 'configurationButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Konfigurations-Manager angezeigt wird.',
                    descriptionEN: 'Defines if the button for the configuration manager should be shown.'
                },
                {
                    type: "String",
                    name: "defaultItemClass",
                    defaultValue: "wf-callout-box wf-callout-box-info",
                    description: "Verfügbare Klassen mit vordefinierten Styles sind: 'wf-callout-box wf-callout-box-info', 'wf-callout-box wf-callout-box-success', 'wf-callout-box wf-callout-box-danger', 'wf-callout-box wf-callout-box-warning', 'wf-callout-box wf-callout-box-primary'.",
                    descriptionEN: "Available class names with predefined styles are: 'wf-callout-box wf-callout-box-info', 'wf-callout-box wf-callout-box-success', 'wf-callout-box wf-callout-box-danger', 'wf-callout-box wf-callout-box-warning', 'wf-callout-box wf-callout-box-primary'."
                },

                {
                    type: "String",
                    name: "titleText",
                    defaultValue: "Alarme",
                    description: "WEBfactory i4SCADA Logbook.",
                    descriptionEN: "Header text."
                },
                {
                    type: "String",
                    name: "defaultEntryTopic",
                    defaultValue: "Info",
                    description: "Standard Thema für die Einträge. Verfügbare Themen mit vordefinierten Styles sind: Warning, Danger, Error, Critical, Info, Maintenance.",
                    descriptionEN: "Default topic for the entries. Available topics with predefined styles are: Warning, Danger, Error, Critical, Info, Maintenance."
                },
                {
                    type: "String",
                    name: "defaultEntrySubject",
                    defaultValue: "",
                    description: "Standard Überschrift für die Einträge.",
                    descriptionEN: "Default subject for the entries."
                },
                {
                    type: "Number",
                    name: "height",
                    defaultValue: "auto",
                    description: "Panel Höhe in px. Wenn die Eigenschaft nicht gesetzt ist, wird die Höhe automatisch ermittelt.",
                    descriptionEN: "Panel height in px. If this property is not set, the height will be calculated automatically."
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
                    description: "Vorselektiertes Thema im Filter.",
                    descriptionEN: "Preselected topic in topic filter."
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
                    type: "String", name: "initialConfiguration", defaultValue: "",
                    description: 'Der Name einer Konfiguration, welche automatisch initial geladen wird.',
                    descriptionEN: 'The name of the configuration to be loaded by default.'
                },
                {
                    type: "String", name: "configurationNamespace", defaultValue: "",
                    description: 'Der Namensraum für die Konfiguration.',
                    descriptionEN: 'The namespace for the configuration.'
                },
                {
                    type: "Boolean",
                    name: "showOnlyOwnConfigurations",
                    defaultValue: "false",
                    description: 'Definiert ob nur eigene Konfigurationen angezeigt wird.',
                    descriptionEN: 'Defines whether only own configurations are displayed.'
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