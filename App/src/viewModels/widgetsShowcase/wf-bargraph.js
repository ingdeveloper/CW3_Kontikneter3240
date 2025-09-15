define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfValueBarGraph";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties = [{
                    name: 'signalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals dessen Wert als Fortschrittanzeige dargestellt werden soll.',
                    descriptionEN: 'Name of the signal whose value is to be displayed as a progress indicator.'
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
                    name: 'valueLabel ',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob die Signalwert angezeigt wird',
                    descriptionEN: 'Defines whether the signal value is displayed'
                },
                {
                    name: 'unitLabel',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob die Signaleinheit angezeigt wird',
                    descriptionEN: 'Defines whether the signal unit is displayed'
                },
                {
                    name: 'titleText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Labeltext',
                    descriptionEN: 'Label text'
                },
                {
                    name: 'minRange',
                    type: 'Number',
                    defaultValue: '0',
                    description: 'Untere Wertgrenze für die Darstellung',
                    descriptionEN: 'Lower value limit for the presentation'
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
                    description: 'Obere Wertgrenze für die Darstellung',
                    descriptionEN: 'Upper value limit for the presentation'
                },
                {
                    type: 'String',
                    name: 'maxRangeSignalName',
                    defaultValue: '',
                    description: 'Signal für oberer Grenzwert, wenn nicht angegeben, dann wird maxRange verwendet',
                    descriptionEN: 'Signal for maximun range value, if not declared maxRange will be used'
                },
                {
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: 'primary',
                    description: 'CSS Klassenname um die Darstellung der Fortschrittsanzeige zu beeinflussen. Analog zu Bootstrap Klassenneman sind folgende Klassen verwendet werden: "progress-bar-primary", "progress-bar-info", "progress-bar-warning", "progress-bar-danger".',
                    descriptionEN: 'Affecting CSS class name for progress bar appearance. Like in Bootstrap following class names could be used: "progress-bar-primary", "progress-bar-info", "progress-bar-warning", "progress-bar-danger"'
                },
                {
                    name: 'progressBarSize',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klassenname um die Dicke der Fortschrittsanzeige zu beeinflussen. Folgende Klassen verwendet werden: "progress-lg", "progress-sm", "progress-xs"',
                    descriptionEN: 'Affecting CSS class name for thickness of the progressbar. Following class names could be used: "progress-lg", "progress-sm", "progress-xs'
                },
                {
                    name: 'iconClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klasse für das Icon Element',
                    descriptionEN: 'CSS Class for Icon Element'
                },
                {
                    name: 'orientation',
                    type: 'String',
                    defaultValue: 'horizontal left',
                    description: 'Definiert die Ausrichtung des Balkens. Implementiert sind folgende Styles:<br />"horizontal left", "horizontal right", "vertical top" und "vertical bottom". Für vertikale Ausrichtung mit flexibler Breite, ist zusätzlich die Angabe "block" erforderlich.',
                    descriptionEN: 'Defines the progress bar alignment.<br />Implemented styles are: "horizontal left", "horizontal right", "vertical top" and "vertical bottom". For vertikal alignment with flexible width the "block" class is also needed.'
                },
                {
                    name: 'height',
                    type: 'Number',
                    defaultValue: 'null',
                    description: 'Höhe des Fortschrittsbalkens"',
                    descriptionEN: 'Height of the progressbar'
                },

                {
                    name: 'showTickLabels',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Markierungen mit Labels angezeigt werden',
                    descriptionEN: 'Defines whether the Ticks with labels should be shown'
                },
                {
                    type: "String",
                    name: "projectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird das Widget standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the widget. The widget will be shown by default, if this property is not set.'
                }, {
                    name: 'systemAuthorization',
                    type: 'String',
                    defaultValue: '',
                    description:
                        'Systemberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                    descriptionEN: 'Systemauthorization of the user, which are required for showing the widget.'
                },
                {
                    name: 'states',
                    type: 'Array',
                    defaultValue: '[]',
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, symbolicText. Beispiele: { signalName:\'Setpoint 1\', maskSignal:1,, operator:\'>\', cssClassName:\'warning\'}, {conditionRule:\'%Setpoint 1% > 1\', cssClassName:\'error\'}.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, symbolicText. Examples: { signalName:\'Setpoint 1\', maskSignal:1,, operator:\'>\', cssClassName:\'warning\'}, {conditionRule:\'%Setpoint 1% > 1\', cssClassName:\'error\'}.'
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