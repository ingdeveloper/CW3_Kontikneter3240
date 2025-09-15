define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfEnableContainer";
            self.widgetCategory = "Sicherheit";

            self.widgetProperties =
                [
                    {
                        name: 'enableSignalName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Signalname für die Bedingung, wann der Inhalt des Widget bzw. der Komponente freigegeben werden soll.',
                        descriptionEN: 'Signal name for the condition if the content of the widget / component should be enabled.'
                    },
                    {
                        name: 'enableSignalValue',
                        type: 'String|Number',
                        defaultValue: '',
                        description: 'Signalwert für die Bedingung, wann der Inhalt des Widget bzw. der Komponente freigegeben werden soll.',
                        descriptionEN: 'Signal value for the condition if the content of the widget / component should be enabled.'
                    },
                    {
                        name: 'enableOperator',
                        type: 'String',
                        defaultValue: '',
                        description: 'Operator für die Bedingung, wann der Inhalt des Widget bzw. der Komponente freigegeben werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                        descriptionEN: 'Operator for the condition if the content of the widget / component should be enabled. Avalable operatoren: !=, ==, >=, <=, >, <.'
                    },
                    {
                        name: 'disableOverlayColor',
                        type: 'Color',
                        defaultValue: 'rgba(255,255,255,.5)',
                        description: 'Farbe für das Overlay, wenn der Inhalt des Widget bzw. der Komponente gesperrt ist.',
                        descriptionEN: 'Color for the overlay if the content of the widget / component is disabled.'
                    },
                    {
                        name: 'projectAuthorization',
                        type: 'String',
                        defaultValue: '',
                        description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                        descriptionEN: 'Projectauthorization of the user, which are required for showing the widget / component.'
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


