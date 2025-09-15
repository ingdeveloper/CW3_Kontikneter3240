define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfVisibilityContainer";
            self.widgetCategory = "Sicherheit";

            self.widgetProperties =
            [
                {
                    name: 'visibilitySignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signalname für die Bedingung, wann das Widget bzw. die Komponente angezeigt werden soll.',
                    descriptionEN: 'Signal name for the condition if the widget / component should be shown.'
                },
                {
                    name: 'visibilitySignalValue',
                    type: 'String|Number',
                    defaultValue: '',
                    description: 'Signalwert für die Bedingung, wann das Widget bzw. die Komponente angezeigt werden soll.',
                    descriptionEN: 'Signal value for the condition if the widget / component should be shown.'
                },
                {
                    name: 'visibilityOperator',
                    type: 'String',
                    defaultValue: '',
                    description: 'Operator für die Bedingung, wann das Widget bzw. die Komponente angezeigt werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                    descriptionEN: 'Operator for the condition if the widget / component should be shown. Avalable operatoren: !=, ==, >=, <=, >, <.'
                },
                {
                    name: 'projectAuthorization',
                    type: 'String',
                    defaultValue: '',
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the widget.'
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


