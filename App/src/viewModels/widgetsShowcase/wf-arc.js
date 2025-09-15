define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfValueArc";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    type: 'String',
                    name: 'signalName',
                    defaultValue: '',
                    description: 'Name des Signals dessen Wert angezeigt und geschrieben soll.',
                    descriptionEN: 'Name of the signal is displayed and written its value.'
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
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
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
                    type: 'String',
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Anzeige. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finde:n http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats can be find on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    type: 'Number',
                    name: 'width',
                    defaultValue: '200',
                    description: 'Breite des Widgets in Pixel',
                    descriptionEN: 'Widget width in Pixels'
                },
                {
                    type: 'Number',
                    name: 'height',
                    defaultValue: '200',
                    description: 'Höhe des Widgets in Pixel',
                    descriptionEN: 'Widget height in Pixels'
                },
                {
                    type: 'Object',
                    name: 'paddings',
                    defaultValue: '{ top: 10, right: 10, bottom: 10, left: 10 }',
                    description: 'Paddings / Innenabstände',
                    descriptionEN: 'Paddings'
                },

                {
                    type: 'Number',
                    name: 'innerRadius',
                    defaultValue: '0.7',
                    description: 'Innenradius',
                    descriptionEN: 'Inner radius'
                },
                {
                    type: 'Number',
                    name: 'marginBottom',
                    defaultValue: 'height * 25%',
                    description: 'Abstand unten in Pixel',
                    descriptionEN: 'Bottom margin in pixels'
                },
                {
                    type: 'Number',
                    name: 'startAngle',
                    defaultValue: '-120',
                    description: 'Startwinkel des Bogens in Grad ',
                    descriptionEN: 'Start angle in degrees '
                },
                {
                    type: 'Number',
                    name: 'endAngle',
                    defaultValue: '120',
                    description: 'Maximaler Endwinkel des Bogens in Grad',
                    descriptionEN: 'Maximum angle in degrees'
                },
                {
                    type: 'Number',
                    name: 'minRange',
                    defaultValue: '0',
                    description: 'Unterer Grenzwert',
                    descriptionEN: 'Minimum range value'
                },
                {
                    type: 'String',
                    name: 'minRangeSignalName',
                    defaultValue: '',
                    description: 'Signal für unterer Grenzwert, wenn nicht angegeben, dann wird minRange verwendet',
                    descriptionEN: 'Signal for minimum range value, if not declared minRange will be used'
                },
                {
                    type: 'Number',
                    name: 'maxRange',
                    defaultValue: '',
                    description: 'Oberer Grenzwert',
                    descriptionEN: 'Maximun range value'
                },
                {
                    type: 'String',
                    name: 'maxRangeSignalName',
                    defaultValue: '',
                    description: 'Signal für oberer Grenzwert, wenn nicht angegeben, dann wird maxRange verwendet',
                    descriptionEN: 'Signal for maximun range value, if not declared maxRange will be used'
                },
                {
                    type: 'Boolean',
                    name: 'showValueLabel',
                    defaultValue: 'true',
                    description: 'Definiert ob der Signalwert angezeigt wird',
                    descriptionEN: 'Defines if the signal value should be displayed'
                },
                {
                    type: 'Boolean',
                    name: 'showSignalUnit',
                    defaultValue: 'true',
                    description: 'Definiert ob die Signaleinheit angezeigt wird',
                    descriptionEN: 'Defines whether the signal unit should be displayed'
                },
                {
                    type: 'Number',
                    name: 'strokeWidth',
                    defaultValue: '1',
                    description: 'Strichstärke der Bögen',
                    descriptionEN: 'Thickness of the arc elements'
                },
                {
                    type: 'String',
                    name: 'foregroundColor',
                    defaultValue: '#880000',
                    description: 'Füllfarbe Anzeigebogen',
                    descriptionEN: 'Fill color of the value arc element'
                },
                {
                    type: 'String',
                    name: 'backgroundColor',
                    defaultValue: '#CCCCCC',
                    description: 'Hintergrundfarbe Hintergrundbogen',
                    descriptionEN: 'Fill color of the background arc element'
                },
                {
                    type: 'String',
                    name: 'foregroundStrokeColor',
                    defaultValue: '#FFFFFF',
                    description: 'Strichfarbe Anzeigebogen',
                    descriptionEN: 'Stroke color of the value arc element'
                },
                {
                    type: 'String',
                    name: 'backgroundStrokeColor',
                    defaultValue: '#FFFFFF',
                    description: 'Strichfarbe Hintergrundbogene',
                    descriptionEN: 'Stroke color of the background arc element'
                },
                {
                    type: 'String',
                    name: 'iconColor',
                    defaultValue: 'foregroundColor',
                    description: 'Farbe des Icons',
                    descriptionEN: 'Icons color'
                },
                {
                    type: 'String',
                    name: 'iconClass',
                    defaultValue: 'wf wf-speed-gauge wf-2x',
                    description: 'CSS Klasse für die Icon Anzeige',
                    descriptionEN: 'CSS Class for the icon element'
                },
                {
                    type: 'Number',
                    name: 'majorTicks',
                    defaultValue: '20',
                    description: 'Anzahl der Markierungen entlang des Hintergrundbogens. Eine sinnvolle Verteilung erfolgt automatisch analog zu dem Werte- und Winkelbereichen. Daher kann die Anzahl u.U. automatisch angepasst werden',
                    descriptionEN: 'Number of tick marks along the background arc. Suitable  number could be adjusted automatically depending on the associated value and angle scale'
                },

                {
                    type: 'Boolean',
                    name: 'showTickLines',
                    defaultValue: 'true',
                    description: 'Definiert ob Markierungen angezeigt wird',
                    descriptionEN: 'Defines whether the mark ticks should be displayed',
                },

                {
                    type: 'Boolean',
                    name: 'showTickLabels',
                    defaultValue: 'false',
                    description: 'Definiert ob Texlabels neben den Markierungen angezeigt werden',
                    descriptionEN: 'Defines whether the mark ticks labels should be displayed'
                },
                {
                    type: 'Boolean',
                    name: 'hideFirstTickLabel',
                    defaultValue: 'false',
                    description: 'Definiert ob das erste Häkchen angezeigt werden soll',
                    descriptionEN: 'Defines whether the first tick label should be displayed',
                },

                {
                    type: 'Boolean',
                    name: 'hideLastTickLabel',
                    defaultValue: 'false',
                    description: 'Definiert ob das letzte Häkchen angezeigt werden soll',
                    descriptionEN: 'Defines whether the last tick label should be displayed'
                },
                {
                    type: 'd3.format',
                    name: 'labelFormat',
                    defaultValue: "d3.format('g')",
                    description: 'Format für die Werte in den Labeltexten. Ausführliche Dokumentation zu d3.format: https://github.com/mbostock/d3/wiki/Formatting',
                    descriptionEN: 'Value format for the labels on mark ticks. Detailed documentation about d3.format https://github.com/mbostock/d3/wiki/Formatting'
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

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
        };

        return ctor;
    });