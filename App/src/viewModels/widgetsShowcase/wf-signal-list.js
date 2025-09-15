define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfSignalList";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
                [
                    {
                        name: 'signals',
                        type: 'Array',
                        defaultValue: '',
                        description: 'Einstellungen für die Signale. Jede Signal muss durch ein Objekt mit folgenden Eigenschaften definiert sein: signalName, signalLabel, staticUnitText, isAlphanumeric. Nur signalName ist erforderlich. Beispiel { signalName: \'Level 1\', signalLabel: \'Temperature\', staticUnitText:\'°C\' }.',
                        descriptionEN: 'Represents the definition of the signals. Each signal definition is an object defined by the properties: signalName, signalLabel, staticUnitText, isAlphanumeric. Only signalName is mandatory. Example { signalName: \'Level 1\', signalLabel: \'Temperature\', staticUnitText:\'°C\' }.'
                    },
                    {
                        name: 'signalNamePattern',
                        type: 'String',
                        defaultValue: '',
                        description: 'Definiert eine Pattern für die Signalnamen, die automatisch angezeigt werden - z.B. "Setpoint *"',
                        descriptionEN: 'Defines a pattern for signals, which should be shown automatically - e.g. "Setpoint *".'
                    },
                    {
                        name: 'signalsFilter',
                        type: 'Array',
                        defaultValue: '',
                        description: 'Definiert welche Signalgruppen augewählt werden können.',
                        descriptionEN: 'Defines a set of the signals that can be selected.'
                    },
                    {
                        type: 'String',
                        name: 'signalFilterText',
                        defaultValue: 'AliasName',
                        description: 'Definition Signaltexte für Signaldropdown in der Signalseinstellungen. Gültige Werte sind: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\'. Wenn der Text für ausgewähltes Wert leer ist, wird der Text für Wert \'AliasName\' zeigen',
                        descriptionEN: 'Definitions signal texts for signal dropdown in the settings. Valid values are: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\'. When text for selected value is empty, thrn will show text for value  \'AliasName\' '
                    },
                    {
                        name: 'tooltipText',
                        type: 'String',
                        defaultValue: '',
                        description: 'Der Text des Tooltip.',
                        descriptionEN: 'The text of tooltip.'
                    },
                    {
                        name: 'groupsFilter',
                        type: 'Array',
                        defaultValue: '',
                        description: 'Definiert welche Signalgruppen augewählt werden können.',
                        descriptionEN: 'Defines a set of the signal groups that can be selected.'
                    },
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
                        type: 'Boolean',
                        name: 'isModalDialogsDraggable',
                        defaultValue: 'true',
                        description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                        descriptionEN: 'Defines whether the modal dialogs are draggable.'
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
                        description: 'Definiert ob der Button für den Dialog mit Signalauswahl angezeigt wird.',
                        descriptionEN: 'Defines if the button for signal selection dialog should be shown.'
                    },
                    {
                        name: 'listTemplate',
                        type: 'String',
                        defaultValue: 'wf-value-display',
                        description: 'Template für die Wertanzeigen. Verfügbaren Optionen sind wf-value-display, wf-value, wf-signal-information und wf-input.',
                        descriptionEN: 'Template for the value outputs. Available options are wf-value-display, wf-value, wf-signal-information and wf-input.'
                    },
                    {
                        name: 'signalInformationColumns',
                        type: 'Array',
                        defaultValue: '["AliasName", "Name", "Unit"]',
                        description: 'Array von den Namen der Eigenschaft des Signals* - z.B. ["Unit"]',
                        descriptionEN: 'Array of Names of the property of the signal* - for example, ["Unit"]'
                    },
                    {
                        name: 'title',
                        type: 'String',
                        defaultValue: '',
                        description: 'Titeltext',
                        descriptionEN: 'Title text.'
                    },
                    {
                        name: 'format',
                        type: 'String',
                        defaultValue: '0,0.[00]',
                        description: 'Format für die numerische Wertanzeigen. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                        descriptionEN: 'Format for the numeric value displays. Other formats can be found on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                    },
                    {
                        name: 'valueDisplayClass',
                        type: 'String',
                        defaultValue: 'label-info',
                        description: 'CSS Klasse für das Anzeigeelement. Vorgefertigten, verfügbaren Klassen sind: label-default, label-black, label-inverted, label-primary, label-success, label-danger, label-info, label-warning.',
                        descriptionEN: 'CSS class for the vaue display element. Predefined, available class names are label-default, label-black, label-inverted, label-primary, label-success, label-danger, label-info, label-warning.'
                    },
                    {
                        name: 'listButtonCssClass',
                        type: 'String',
                        defaultValue: 'btn btn-default',
                        description: 'CSS Klasse für den Signal Toggle-Button.',
                        descriptionEN: 'CSS class name for the signal toggle button.'
                    },
                    {
                        name: 'listValidationCssClass',
                        type: 'String',
                        defaultValue: 'btn btn-info',
                        description: 'CSS Klasse mit der bereits vorhandenes Signal beim Einfügen hervorgehoben wird.',
                        descriptionEN: 'CSS class name which should highlight an already selected signal if the user tries to add multiple times.'
                    },
                    {
                        name: 'addButtonCssClass',
                        type: 'String',
                        defaultValue: 'btn btn-success',
                        description: 'CSS Klasse für den Buttons zum Öffnen des "Signal hinzufügen Dialogs".',
                        descriptionEN: 'CSS class name for the button that will open the "Add signal modal dialog".'
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
                        type: "String",
                        name: "signalSelectionProjectAuthorization",
                        defaultValue: "",
                        description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Dialogs mit Signal- und LogTagauswahl mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'signalsButtonVisibility\'.',
                        descriptionEN: 'Projectauthorization of the user, which are required for showing the signal and logtags selection dialog. This option is used in combination with the option \'signalsButtonVisibility\'.'
                    },
                    {
                        type: "String",
                        name: "configurationProjectAuthorization",
                        defaultValue: "",
                        description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Konfigurations-Manager mindestens erforderlich ist. Diese Eigenschaft verwendet  sich in Kombination mit der Eigenschaft \'configurationButtonVisibility\'.',
                        descriptionEN: 'Projectauthorization of the user, which are required for showing the configuration manager. This option is used in combination with the option \'configurationButtonVisibility\'.'
                    },
                    {
                        type: 'Number',
                        name: 'maxSignalCount',
                        defaultValue: '50',
                        description: 'Legt maximale Anzahl für die Suchergebnisse (Signale und Log Tags) in der Signal- und LogTagauswahl.',
                        descriptionEN: 'Set the maximum count for search results in the signal and logtags selection.'
                    },
                    {
                        type: 'Number',
                        name: 'maxSignalsForGroupAdd',
                        defaultValue: '500',
                        description: 'Legt maximale Anzahl an Signalen, die zur Laufzeit über beim Auswählen ganzer Signalgruppen hinzugefügt werden können.',
                        descriptionEN: 'Set the maximum count for signals which can be added at runtime when a complete signal group will be selected.'
                    }

                ];

            self.signalProperties = [
                'Active',
                'AliasName',
                'AltValue',
                'Connector.Name',
                'Connector.Description',
                'Description',
                'DescriptionSymbolicText',
                'FactorX1',
                'FactorX2',
                'FactorY1',
                'FactorY2',
                'Group.Name',
                'Group.Description',
                'Hysterese',
                'HystereseAlarm',
                'HystereseAlarm_2',
                'HystereseLog',
                'HystereseLog_2',
                'Hysterese_2',
                'LogUserActivity',
                'Maximum',
                'Minimum',
                'Name',
                'OPCEnabled',
                'OPCQuality',
                'OfflineValue',
                'Server.Description',
                'Status',
                'Unit',
                'VChannel',
                'VChannelInitValue',
                'VChannelTypeID'
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