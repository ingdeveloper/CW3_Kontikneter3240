define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wf-recipe";
            self.widgetCategory = "Rezepte";

            /*-------------
             * Language
             --------------*/
            self.widgetProperties = [{
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
                    name: "projectAuthorizationSelection",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige der Auswahl mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird die Auswahl standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the selection. The selection will be shown by default, if this property is not set.'
                },
                {
                    type: "String",
                    name: "projectAuthorizationSave",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Speichern Button mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird der Button standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the save button. The button will be shown by default, if this property is not set.'
                },
                {
                    type: "String",
                    name: "projectAuthorizationWrite",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Schrieb Buttons mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird der Button standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the write button. The button will be shown by default, if this property is not set.'
                },
                {
                    type: "Boolean",
                    name: "showOnlyOwnConfigurations",
                    defaultValue: "false",
                    description: 'Definiert ob nur eigene Konfigurationen angezeigt wird.',
                    descriptionEN: 'Defines whether only own configurations are displayed.'
                },
                {
                    name: 'recipeName',
                    type: 'String',
                    defaultValue: 'null',
                    description: 'Name der Rezept Konfiguration die geladen werden soll.',
                    descriptionEN: 'Name of recipe configuration which should be loaded.'
                },

                {
                    type: "Boolean",
                    name: "saveButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Rezept Werte Speicher Button angezeigt wird.",
                    descriptionEN: "Defines if the recipe save button should be shown."
                },
                {
                    type: "Boolean",
                    name: "writeButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Rezept Werte Schreib Button angezeigt wird.",
                    descriptionEN: "Defines if the recipe write value button should be shown."
                },
                {
                    type: "Boolean",
                    name: "receipeButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob die Rezeptauswahl angezeigt wird.",
                    descriptionEN: "Defines if the recipe selection should be shown."
                },
                {
                    type: "Boolean",
                    name: "refreshButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Aktualisieren Button angezeigt wird.",
                    descriptionEN: "Defines if the refresh button should be shown."
                },


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