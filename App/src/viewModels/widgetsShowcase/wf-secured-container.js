define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSecuredContainer";
            self.widgetCategory = "Sicherheit";

            self.widgetProperties =
                [
                    {
                        name: 'projectAuthorization',
                        type: 'String',
                        defaultValue: '',
                        description:
                            'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                        descriptionEN: 'Projectauthorization of the user, which are required for showing the widget.'
                    }, {
                        name: 'projectAuthorizations',
                        type: 'String[]',
                        defaultValue: '',
                        description: '',
                        descriptionEN:
                            'The list of project authorizations from which it will use the projectAuthorizationIndex element as the projectAuthorization. This will be taken into consideration only if the projectAuthorization is not set'
                    },
                    {
                        name: 'projectAuthorizationIndex',
                        type: 'Number',
                        defaultValue: '',
                        description: 'Legt den Index des angezeigten aus dem Projektberechtigung Array fest.',
                        descriptionEN:
                            'Defines the index of the project authorization from the projectAuthorizations array. It will be taken into consideration only if the projectAuthorization is not set and the value of it is between 0 and the lenght of the projectAuthorizations array.'
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
                        name: 'systemAuthorizations',
                        type: 'String[]',
                        defaultValue: '',
                        description: '',
                        descriptionEN:
                            'The list of system authorizations from which it will use the systemAuthorizationIndex element as the systemAuthorization. This will be taken into consideration only if the systemAuthorization is not set'
                    },
                    {
                        name: 'systemAuthorizationIndex',
                        type: 'Number',
                        defaultValue: '',
                        description: 'Legt den Index des angezeigten aus dem Systemberechtigung Array fest.',
                        descriptionEN:
                            'Defines the index of the system authorization from the systemAuthorizations array. It will be taken into consideration only if the systemAuthorization is not set and the value of it is between 0 and the lenght of the systemAuthorizations array.'
                    }
                ];

        };

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
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
            };

        };

        return ctor;
    });


