define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wf-recipe-management";
            self.widgetCategory = "Rezepte";

            /*-------------
             * Language
             --------------*/
            self.widgetProperties = [
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
                    defaultValue: "WEBfactory Recipe Management Component",
                    description: "Text in der Kopfzeile",
                    descriptionEN: "Header text"
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
                    type: "Boolean",
                    name: "showOnlyOwnConfigurations",
                    defaultValue: "false",
                    description: 'Definiert ob nur eigene Konfigurationen angezeigt wird.',
                    descriptionEN: 'Defines whether only own configurations are displayed.'
                },
                {
                    type: 'String',
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Werte. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats are available on the documentation page of Numeral.js that you can find: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'operationButtonCssClass',
                    type: 'String',
                    defaultValue: 'btn btn-primary',
                    description: 'CSS Klasse für die Buttons mit der Funktion löschen und laden.',
                    descriptionEN: 'CSS Class for the Buttons with function delete and load.'
                },
                {
                    name: 'recipeType',
                    type: 'String',
                    defaultValue: 'Recipe',
                    description: 'Definiert die Vorauswahl mögliche werte: "Recipe" und "RecipeDefinition".',
                    descriptionEN: 'Defines the pre selection, possible values are \'Recipe\' and \'RecipeDefinition\'.'
                },
                {
                    name: 'recipeDefinitionName',
                    type: 'String',
                    defaultValue: 'null',
                    description: 'Name der Rezeptdefinion Konfiguration die geladen werden soll.',
                    descriptionEN: 'Name of recipe definition configuration which should be loaded.'
                },
                {
                    name: 'recipeName',
                    type: 'String',
                    defaultValue: 'null',
                    description: 'Name der Rezept Konfiguration die geladen werden soll.',
                    descriptionEN: 'Name of recipe configuration which should be loaded.'
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
                    type: "Boolean",
                    name: "exportButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Konfigurations Export angezeigt wird.",
                    descriptionEN: "Defines if the button for the export configuration should be shown."
                },
                {
                    type: "Boolean",
                    name: "importButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Konfigurations Import angezeigt wird.",
                    descriptionEN: "Defines if the button for the Import configuration should be shown."
                },
                {
                    type: "Boolean",
                    name: "typeSelectionButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für die Typ selection angezeigt wird.",
                    descriptionEN: "Defines if the button for the type selection should be shown."
                },
                {
                    type: "Boolean",
                    name: "headderAddButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für das Hinzufügen angezeigt wird.",
                    descriptionEN: "Defines if the button for the add should be shown."
                },
                {
                    type: "Boolean",
                    name: "headderConcatenateButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für das Verknüpfen angezeigt wird.",
                    descriptionEN: "Defines if the button for the concatenate should be shown."
                },
                {
                    type: "Boolean",
                    name: "headderLoadCurrenValuesButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für das Laden aktueller Werte angezeigt wird.",
                    descriptionEN: "Defines if the button for the load of current values should be shown."
                },
                {
                    type: "Boolean",
                    name: "contentDeleteButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für das Löschen angezeigt wird.",
                    descriptionEN: "Defines if the button for the delete should be shown."
                },
                {
                    type: "Boolean",
                    name: "contentLoadCurrenValueDeleteButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für das Laden eines aktuellen Wert angezeigt wird.",
                    descriptionEN: "Defines if the button for the load of a current value should be shown."
                },
                {
                    type: "Boolean",
                    name: "searchVisibility",
                    defaultValue: "true",
                    description: "Definiert ob die Suche angezeigt wird.",
                    descriptionEN: "Defines if the search should be shown."
                },
                {
                    type: 'Number',
                    name: 'maxSignalCount',
                    defaultValue: '50',
                    description: 'Legt maximale Anzahl für die Suchergebnisse in der Signalauswahl fest.',
                    descriptionEN: 'Set the maximum count for search results in the signal selection.'
                },
                {
                    type: 'Number',
                    name: 'maxSignalsForGroupAdd',
                    defaultValue: '500',
                    description: 'Legt maximale Anzahl an Signalen, die zur Laufzeit über beim Auswählen ganzer Signalgruppen hinzugefügt werden können.',
                    descriptionEN: 'Set the maximum count for signals which can be added at runtime when a complete signal group will be selected.'
                }
            ];
        };
        /*----------------
          * Language END
          --------------*/
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