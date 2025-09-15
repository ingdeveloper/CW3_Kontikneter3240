define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfMotionContainer";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    name: 'signalNameX',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal name for the X axis translation calculation.',
                    descriptionEN: 'Signal name for the X axis translation calculation.'
                },
                {
                    name: 'signalNameY',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal name for the Y axis translation calculation.',
                    descriptionEN: 'Signal name for the Y axis translation calculation.'
                },
                {
                    name: 'startOffsetX',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Startgrenze für den X- Signalwert',
                    descriptionEN: 'Start limit for the X signal value.'
                },
                {
                    name: 'startOffsetY',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Startgrenze für den Y- Signalwert',
                    descriptionEN: 'Start limit for the Y signal value.'
                },
                {
                    name: 'signalValueFactor',
                    type: 'Number',
                    defaultValue: '1',
                    description: 'Der Signalwert wird mit diesem Wert multiplizieren.',
                    descriptionEN: 'The signal value is multiplied by this value.'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
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