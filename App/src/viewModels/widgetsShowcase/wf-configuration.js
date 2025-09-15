define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfConfiguration";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
            [
                {
                    name: 'controlType',
                    type: 'Number',
                    defaultValue: '-1',
                    description: 'Soll einzig sein und in src/service/connectorEnums hinzugefügt werden. Die exestierte Zahlen kann man in src/service/connectorEnumsansehen',
                    descriptionEN: ''
                },
                {
                    name: 'getConfiguration',
                    type: 'Function',
                    defaultValue: '',
                    description: 'Definiert die Funktion, die ein Objekt zurückgeben soll. Das Objekt soll aus alle Eigenschaften bestehen, die in DB speicher werden sollen. Diese Funktion wird rufen, wenn eine Konfiguration speichert wird.',
                    descriptionEN: 'List of Signal names'
                },
                {
                    name: 'loadConfiguration',
                    type: 'Function',
                    defaultValue: '',
                    description: 'Definiert die Funktion, die eine Logik für die Arbeit mit den Daten aus DB umfasst. Diese Funktion bekommt ein Objekt mit den Informationen aus DB als Parameter. Nachdem eine Konfiguration aus DB bekommt worden hat, wird diese Funktion rufen.',
                    descriptionEN: ''
                },
                {
                    name: 'namespace',
                    type: 'String',
                    defaultValue: '',
                    description: 'Definiert Eingeschaft \'Namensraum\' für Konfiguation',
                    descriptionEN: ''
                },
                {
                    name: 'buttonBarCssClass',
                    type: 'String',
                    defaultValue: 'btn btn-default',
                    description: 'CSS Klasse für die Buttons in der Kopfleiste.',
                    descriptionEN: ''
                },
                {
                    name: 'selectedRowCssClass',
                    type: 'String',
                    defaultValue: 'active',
                    description: 'CSS Klasse für die ausgewählten Reihe in der Tabelle',
                    descriptionEN: ''
                },
                {
                    name: 'operationButtonCssClass',
                    type: 'String',
                    defaultValue: 'btn btn-primary',
                    description: 'CSS Klasse für die Buttons mit der Funktion(Speicher, Löschen, Ändern, Laden)',
                    descriptionEN: ''
                },
                {
                    name: 'buttonIconClass',
                    type: 'String',
                    defaultValue: 'wf wf-archive',
                    description: 'CSS Klasse für das Icon des Buttons in der Kopfleiste.',
                    descriptionEN: ''
                },
                {
                    name: 'tableMaxHeight',
                    type: 'Number',
                    defaultValue: '350',
                    description: 'Definiert die maximale Größe der Tabelle',
                    descriptionEN: ''
                },
            ];
        };

        ctor.prototype.activate = function () {
            var self = this;

            self.connector = new signalsConnector();

            switch (self.connector.currentLanguageId()) {
                case -1:
                    self.selectedLanguageId(7); // Fall back to german language ID if no language ID available 
                    break;
                default:
                    self.selectedLanguageId = self.connector.currentLanguageId;
                    break;
            }

        };

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
        };

        return ctor;
    });