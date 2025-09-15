define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfValueGauge";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    name: 'signalName',
                    type: 'string',
                    defaultValue: '',
                    description: 'Signalname',
                    descriptionEN: 'Signal name'
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
                    name: 'format',
                    type: 'String',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Anzeige. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats can be found on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    name: 'width',
                    type: 'Number',
                    defaultValue: '200',
                    description: 'Breite des Widgets',
                    descriptionEN: 'Width of the widget in pixels'
                },
                {
                    name: 'showValueLabel',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob der Signalwert angezeigt wird.',
                    descriptionEN: 'Defines if the signal value is displayed.'
                },
                {
                    name: 'innerRadius',
                    type: 'Double',
                    defaultValue: '0.55',
                    description: 'Innenradius des Bogens. Die Dicke des Bogens ergibt sich dadurch wie folgt: 1 - innerRadius',
                    descriptionEN: 'Inner radius of the arc. The thickness of the sheet results from following calculation: 1 - inner radius'
                },
                {
                    name: 'iconClass',
                    type: 'String',
                    defaultValue: 'wf wf-speed-gauge wf-2x',
                    description: 'CSS-Klassen für das Icon-Element',
                    descriptionEN: 'CSS-Class for Icon-Element'
                },
                {
                    name: 'majorTicks',
                    type: 'Number',
                    defaultValue: '5',
                    description: 'Definiert die Anzahl der Hauptsegmente auf der Skala, welche durch große Striche markiert werden',
                    descriptionEN: 'Defines the number of major segments on the scale, which are marked by large strokes'
                },
                {
                    name: 'majorTicksSignalName',
                    type: 'String',
                    defaultValue: '5',
                    description: 'Name des Signals, dessen Wert für die Anzahl der Hauptsegmente verwendet wird',
                    descriptionEN: 'The name of the signal which is used for the number of major segments on the scale'
                },
                {
                    name: 'minorTicks',
                    type: 'Number',
                    defaultValue: '',
                    description: 'Definiert die Anzahl der kleineren Segmente innerhalb der Hauptsegmente. Diese Segmente werden durch kleine Striche markiert.',
                    descriptionEN: 'Defines the number of smaller segments within the main segments. These segments are marked by small strokes.'
                },
                {
                    name: 'minorTicksSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals, dessen Wert für die Anzahl der kleineren Segmente innerhalb der Hauptsegmente verwendet wird',
                    descriptionEN: 'The name of the signal which is used for the number of smaller segments within the main segments'
                },
                {
                    name: 'minRange',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Unterer Grenzwert',
                    descriptionEN: 'lower limit'
                },
                {
                    type: 'String',
                    name: 'minRangeSignalName',
                    defaultValue: '',
                    description: 'Signal für unterer Grenzwert, wenn nicht angegeben, dann wird minRange verwendet',
                    descriptionEN: 'Signal for minimum range value, if not declared minRange will be used'
                },
                {
                    name: 'maxRange',
                    type: 'Number',
                    defaultValue: '100',
                    description: 'Oberer Granzwert',
                    descriptionEN: 'higher limit'
                },
                {
                    type: 'String',
                    name: 'maxRangeSignalName',
                    defaultValue: '',
                    description: 'Signal für oberer Grenzwert, wenn nicht angegeben, dann wird maxRange verwendet',
                    descriptionEN: 'Signal for maximun range value, if not declared maxRange will be used'
                },
                {
                    name: 'lowRangeStart',
                    type: 'Number',
                    defaultValue: 'maxRange * 0.6',
                    description: 'Unterer Grenzwert für den "Niedrigwert"-Bogen bereich (Low)',
                    descriptionEN: 'Lower limit of the "low-value"-bent range (Low)'
                },
                {
                    name: 'lowRangeStartSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal für unterer Grenzwert für den "Niedrigwert"-Bogen bereich, wenn nicht angegeben, dann wird lowRangeStart verwendet',
                    descriptionEN: 'Signal for lower limit of the "low-value"-bent range, if not declared lowRangeStart will be used'
                },
                {
                    name: 'lowRangeEnd',
                    type: 'Number',
                    defaultValue: 'maxRange * 0.8',
                    description: 'Oberer Grenzwert für den "Niedrigwert"-Bogen bereich (Low)',
                    descriptionEN: 'Upper limit for the "low-value" bend range (Low)'
                },
                {
                    name: 'lowRangeEndSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal für oberer Grenzwert für den "Niedrigwert"-Bogen bereich, wenn nicht angegeben, dann wird lowRangeEnd verwendet',
                    descriptionEN: 'Signal for upper limit for the "low-value" bend range, if not declared lowRangeEnd will be used'
                },
                {
                    name: 'highRangeStart',
                    type: 'Number',
                    defaultValue: 'maxRange * 0.8',
                    description: 'Unterer Grenzwert für den "Hochwert"-Bogen bereich (High)',
                    descriptionEN: 'Lower limit of the "high value" bend range (High)'
                },
                {
                    name: 'highRangeStartSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal für unterer Grenzwert für den "Hochwert"-Bogen bereich, wenn nicht angegeben, dann wird highRangeStart verwendet',
                    descriptionEN: 'Signal for lower limit of the "high value" bend range, if not declared highRangeStart will be used'
                },
                {
                    name: 'highRangeEnd',
                    type: 'Number',
                    defaultValue: 'maxRange',
                    description: 'Oberer Grenzwert für den "Hochwert"-Bogen bereich (High)',
                    descriptionEN: 'Upper limit for the "high value" bend range (High)'
                },
                {
                    name: 'highRangeEndSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Signal für oberer Grenzwert für den "Hochwert"-Bogen bereich, wenn nicht angegeben, dann wird highRangeEnd verwendet',
                    descriptionEN: 'Signal for upper limit of the "high value" bend range, if not declared highRangeEnd will be used'
                },
                {
                    name: 'iconColor',
                    type: 'String',
                    defaultValue: '#ffffff',
                    description: 'Farbe des Icons',
                    descriptionEN: 'Icons color'
                },
                {
                    name: 'iconBackgroundColor',
                    type: 'String',
                    defaultValue: '#999999',
                    description: 'Farbe des Icons Kontainers',
                    descriptionEN: 'Icons container color'
                },
                {
                    name: 'lowRangeFillColor',
                    type: 'String',
                    defaultValue: '#f0ad4e',
                    description: 'Füllfarbe für den "Niedrigwert"-Bogen bereich (Low)',
                    descriptionEN: 'Fill in the "low-value" bend range (Low)'
                },
                {
                    name: 'highRangeFillColor',
                    type: 'String',
                    defaultValue: '#d9534f',
                    description: 'Füllfarbe für den "Hochwert"-Bogenbereich (High)',
                    descriptionEN: 'Fill in the "high value" bend range (High)'
                },
                {
                    name: 'backgroundFillColor',
                    type: 'String',
                    defaultValue: '#5cb85c',
                    description: 'Füllfarbe für den Hintergrundbogen',
                    descriptionEN: 'Arc fill color for the background'
                },
                {
                    name: 'needleFillColor',
                    type: 'String',
                    defaultValue: '#555555',
                    description: 'Füllfarbe des Zeigers',
                    descriptionEN: 'Pointer filling color'
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