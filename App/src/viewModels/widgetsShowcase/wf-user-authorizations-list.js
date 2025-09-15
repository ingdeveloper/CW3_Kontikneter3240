define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfUserAuthorizationsList";
            self.widgetCategory = "Sicherheit";

            self.widgetProperties = 
            [
                {
                    name: 'showProjectAuthorizations',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Anzeige von Projektberechtigungen des eingelogten Benutzers',
                    descriptionEN: 'Display of project authorizations of the logged-in user'
        },
                {
                    name: 'showSystemAuthorizations',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Anzeige von Systemberechtigungen des eingelogten Benutzers',
                    descriptionEN: 'Display of system privileges the logged-User'
        },
                {
                    name: 'listClass',
                    type: 'String',
                    defaultValue: 'list-group',
                    description: 'CSS Klasse für die komplette Liste',
                    descriptionEN: 'CSS class for the whole list'
                },

                {
                    name: 'listItemClass',
                    type: 'String',
                    defaultValue: 'list-group-item',
                    description: 'CSS Klasse für die einzelnen Listenelemente',
                    descriptionEN: 'CSS class for the separate list items'
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

        ctor.prototype.attached = function() {
            var self = this;
            prettyPrint();
        };
      
        return ctor;
    });