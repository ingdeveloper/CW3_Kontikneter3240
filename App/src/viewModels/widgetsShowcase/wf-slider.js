define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfSlider";
            self.widgetCategory = "Bedienen";

            self.widgetProperties = [{
                    name: 'signalName',
                    type: 'String',
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
                    type: 'Boolean',
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
                },
                {
                    name: 'tooltipText',
                    type: 'String',
                    defaultValue: '',
                    description: 'Der Text des Tooltip.',
                    descriptionEN: 'The text of tooltip.'
                },
                {
                    name: 'writeToBuffer',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Der Signalwert wird nicht direkt in den Signal geschrieben, sondern lokal in einer Puffertabelle zwischengespeichert. Das Schreiben erfolgt über wf-buffer-button oder wfBufferVutton.',
                    descriptionEN: 'The signal value will not be written dicrectly into the signal, but will be buffered locally. Writing should be done via wf-buffer-button or wfBufferVutton..'
                },
                {
                    name: 'isBufferedClass',
                    type: 'String',
                    defaultValue: 'slider-info',
                    description: 'CSS-Klasse, die angewendet wird, sobald der Signalwert in die Puffertabelle geschrieben worden ist.',
                    descriptionEN: 'CSS class that is applied when the signal value has been written to the buffer table.'
                },
                {
                    name: 'writeSecure',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Der Signalwert wird nach der Bestätigung des Passworts in den Signal geschrieben.',
                    descriptionEN: 'The signal value will be written into the signal after confirm password.'
                },
                {
                    name: 'enableSignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals, dessen Wert für die Sperre verwendet wird.',
                    descriptionEN: 'Name of the signal that will be used for disabling the widget / component.'
                },
                {
                    name: 'enableSignalValue',
                    type: 'String|Number',
                    defaultValue: '',
                    description: 'Wert der Eigenschaft "enableSignalName"',
                    descriptionEN: 'Value of "enableSignalName" option.'
                },
                {
                    name: 'enableOperator',
                    type: 'String',
                    defaultValue: '==',
                    description: 'Operator für die Bedingung, wann der Inhalt des Widget bzw. der Komponente freigegeben werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                    descriptionEN: 'Operator for the condition if the content of the widget / component should be enabled. Avalable operatoren: !=, ==, >=, <=, >, <.'
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
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klassenname um die Darstellung des Sliders zu beeinflussen. Analog zu Bootstrap Klassenneman sind folgende Klassen verwendet werden: "slider-primary", "slider-success", "slider-info", "slider-warning", "slider-danger',
                    descriptionEN: 'Affecting CSS class name for Slider appearance. Like in Bootstrap following class names could be used: "slider-primary", "slider-info",  "slider-success", "slider-warning", "slider-danger"'
                },
                {
                    name: 'unitLabel',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob die Signaleinheit im Tooltip angezeigt wird',
                    descriptionEN: 'Defines whether the signal unit is displayed in tooltip'
                },
                {
                    name: 'step',
                    type: 'Number',
                    defaultValue: '1',
                    description: 'Schrittweite des Sliders',
                    descriptionEN: 'Increment step of Slider'
                },
                {
                    name: 'majorTicks',
                    type: 'Number',
                    defaultValue: '5',
                    description: 'Anzahl der Ticks',
                    descriptionEN: 'Number of the ticks'
                },
                {
                    name: 'showTickLabels',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Markierungen mit Labels angezeigt werden',
                    descriptionEN: 'Defines whether the Ticks with labels should be shown'
                },
                {
                    name: 'height',
                    type: 'Number',
                    defaultValue: 'null',
                    description: 'Höhe des Sliders',
                    descriptionEN: 'Height of the Slider'
                },
                {
                    name: 'tooltip',
                    type: 'String',
                    defaultValue: 'show',
                    description: 'Definiert ob der Tooltip angezeigt wird: "show" zeigt den Tooltip beim verschieben des Handel an, bei "hide" wird der Tooltip nicht angezeigt und "always" zeigt das Tooltip immer an',
                    descriptionEN: 'Defines whether the tooltip is displayed : "show" displays the tooltip at shifting the handel, when "hide" is set the tooltip will not be displayed and "always" shows the tooltip always'
                },
                {
                    name: 'orientation',
                    type: 'String',
                    defaultValue: 'horizontal',
                    description: 'Definiert die Ausrichtung des Sliders. Implementiert sind folgende Optionen: "horizontal" und "vertical"',
                    descriptionEN: 'Defines the slider alignment. Implemented styles are: "horizontal", "vertical"'
                },
                {
                    name: 'reversed',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert die Ausrichtung der Skala, "true" dreht die Skala um',
                    descriptionEN: 'Defines the scale orientation. "true" reverse the scale'
                },
                {
                    name: 'handle',
                    type: 'String',
                    defaultValue: 'round',
                    description: 'Definiert den Style des Handels. Implementiert sind folgende Optionen: "round", "square", "triangle" und "custom"',
                    descriptionEN: 'Defines the style of the handel. Implemented options are: "round", "square", "triangle" and "custom"'
                },
                {
                    name: 'scale',
                    type: 'String',
                    defaultValue: 'linear',
                    description: 'Definiert die Skala des Sliders. Implementiert sind folgende Optionen: "linear" und "logarithmic"',
                    descriptionEN: 'Defines the scale of the slider. Implemented options are: "linear" and "logarithmic"'
                },
                {
                    name: 'event',
                    type: 'String',
                    defaultValue: 'slideStop',
                    description: 'Definiert welches Event für das Schreiben verwendet wird. Bei der Eigenschaft "sliderStop" wird das Schreiben durchgeführt, wenn der Handel nicht mehr bewegt wird oder der Slider geklickt wird. Bei der Eigenschaft "change" wird das Schreiben durchgeführt, wenn der Handel bewegt wird. Implementiert sind folgende Optionen: "slideStop" und "change"',
                    descriptionEN: 'Defines the event for writing values, if the property "slider stop" is set, the writing is performed when the Handle is no longer moving or the slider is clicked. If the property "change" is set, the writing is performed when the Handle moves. Implemented options are: "slideStop" and "change"'

                },
                {
                    name: 'writeDelay',
                    type: 'Number',
                    defaultValue: '100',
                    description: 'Definiert eine Schreibverzögerung in ms, diese option ist nur bei dem event change aktiv',
                    descriptionEN: 'Defines the writedelay in ms, this option is only active when the event option is set to "change"'
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
                },
                {
                    type: "String ['Hide', 'Disable']",
                    name: "securityDenyAccessBehavior",
                    defaultValue: "Hide",
                    description: "Das Verhalten des Controls, wenn der angemeldete User nicht zur Berechtigungsgruppe gehört, die von der projectAuthorization-Eigenschaft angegeben wurde. In diesem Fall kann das Control deaktiviert oder ausgeblendet werden.",
                    descriptionEN: "The behavior of the element when the logged in user doesn't belong to the project authorization indicated by the projectAuthorization property. In this case, the element can be either disabled or hidden."
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