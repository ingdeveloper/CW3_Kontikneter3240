define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfRotationContainer";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    name: 'signalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signalname für die Rotationsberechnung.',
                    descriptionEN: 'Signal name for the rotation calculation.'
                },
                {
                    name: 'isArray',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert, dass der angezeigte Wert als Array behandelt wird. Wenn der Wert true ist, wird die Eigenschaft format nicht berücksichtigt.',
                    descriptionEN: 'Defines, that the displayed value is an array. If the value is true, the property format is not taken into account.'

                },
                {
                    name: 'arrayIndex',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Legt den Index des angezeigten Wertes aus dem Array fest.',
                    descriptionEN: 'Defines the index of the displayed value from the array.'

                },
                {
                    name: 'arrayDelimiter',
                    type: 'String',
                    defaultValue: ',',
                    description: 'Definiert den Separator der Werte im Array.',
                    descriptionEN: 'Defines the delimiter of the values in the array.'

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
                    name: 'minRange',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Untere Wertgrenze für die Darstellung',
                    descriptionEN: 'Lower value limit for the presentation'
                },
                {
                    name: 'maxRange',
                    type: 'Number',
                    defaultValue: '100',
                    description: 'Obere Wertgrenze für die Darstellung',
                    descriptionEN: 'Upper value limit for the presentation'
                },
                {
                    name: 'startAngle',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Startwinkel in Grad ',
                    descriptionEN: 'Start angle in degrees '
                },
                {
                    name: 'endAngle',
                    type: 'Number',
                    defaultValue: '360',
                    description: 'Maximaler Endwinkel in Grad',
                    descriptionEN: 'Maximum angle in degrees'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
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