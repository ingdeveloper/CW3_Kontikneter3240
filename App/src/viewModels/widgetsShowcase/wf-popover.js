define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfPopover";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
                [
                    {
                        name: 'viewName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Definiert den Namen der HTML-View, die den Inhalt des Popover bereitstellt. Die View muss im Ordner abgelegt sein, der über die Eigenschaft „viewPath“ definiert wird.',
                        descriptionEN: 'Defines the name of the HTML view, which provide the contents for the popover. The HTML view must be located in the folder, that is defined by the property „viewPath“.'
                    },
                    {
                        name: 'viewPath',
                        type: 'String',
                        defaultValue: 'src/views/popovers/',
                        description: 'Definiert den Pfad der Eigenschaft "viewName".',
                        descriptionEN: 'Defines the path of the HTML view.'
                    },
                    {
                        name: 'viewModel',
                        type: 'Object',
                        defaultValue: '',
                        description: 'Definiert ein Objekt, das alle Parameter für den Popover enthält.',
                        descriptionEN: 'Defines an object that contains all the parameters for popover.'
                    },
                    {
                        name: 'width',
                        type: 'Number',
                        defaultValue: '',
                        description: 'Definiert die Breite des Popover.',
                        descriptionEN: 'Defines the width of popover.'
                    },
                    {
                        name: 'height',
                        type: 'Number',
                        defaultValue: '',
                        description: 'Definiert die Höhe des Popover.',
                        descriptionEN: 'Defines the height of popover.'
                    },
                    {
                        name: 'title',
                        type: 'String',
                        defaultValue: '',
                        description: 'Text in der Kopfzeile des Popovers.',
                        descriptionEN: 'Text inside the popover header.'
                    },
                    {
                        name: 'tooltipText',
                        type: 'String',
                        defaultValue: '',
                        description: 'Der Text des Tooltip.',
                        descriptionEN: 'The text of tooltip.'
                    },
                    {
                        name: 'container',
                        type: 'String',
                        defaultValue: '',
                        description: 'Fügt den Popover an ein bestimmtes Element an. Beispiel: container: "body" oder container: "#containerId".',
                        descriptionEN: 'Appends the popover to a specific element. Example: container: "body" or container: "#containerId".'
                    },
                    {
                        name: 'content',
                        type: 'String',
                        defaultValue: '',
                        description: 'Definiert den statischen Inhalt des Popover, wenn die Eigenschaft „viewName“ leer ist.',
                        descriptionEN: 'Defines the static content of the popover when the "viewName" property is empty.'
                    },
                    {
                        name: 'delay',
                        type: 'Number',
                        defaultValue: '0',
                        description: 'Verzögerung zeigt und versteckt das Popover (ms) - gilt nicht für manuelle Trigger-Typ. Wenn eine Nummer geliefert wird, wird die Verzögerung sowohl beim Ausblenden / Zeigen als auch angezeigt.',
                        descriptionEN: 'Delay showing and hiding the popover (ms) - does not apply to manual trigger type. If a number is supplied, delay is applied to both hide/ show.'
                    },
                    {
                        name: 'html',
                        type: 'Boolean',
                        defaultValue: 'false',
                        description: 'Definiert ob die Eigenschaft „content“ als HTML angezeigt wird. Wenn die Eigenschaft „viewName“ gibt, ist immer "true"',
                        descriptionEN: 'Defines whether the "content" property is displayed as HTML. If the property "viewName" is, always "true".'
                    },
                    {
                        name: 'position',
                        type: 'String',
                        defaultValue: 'right',
                        description: 'Definiert wie das Popover positioniert wird - top|bottom|left|right|auto. Wenn "auto" angegeben ist, wird das Popover dynamisch neu ausgerichtet.',
                        descriptionEN: 'Defines how to position the popover - top|bottom|left|right|auto. When "auto" is specified, it will dynamically reorient the popover.'
                    },
                    {
                        name: 'trigger',
                        type: 'String',
                        defaultValue: 'click',
                        description: 'Definiert wie popover ausgelöst wird - click|hover|focus|manual. Man kann  mehrere Auslöser eingeben, die sie mit einem "Leerzeichen" getrennt wird. "manual" kann nicht mit anderen Auslösern kombiniert werden.',
                        descriptionEN: 'Defines how popover is triggered-click|hover|focus|manual. It can enter multiple triggers, separated by a "space". "manual" cannot be combined with any other trigger.'
                    },
                    {
                        name: 'singleMode',
                        type: 'Boolean',
                        defaultValue: 'false',
                        description: 'Definiert ob nur ein Popover auf der Seite angezeigt werden kann.',
                        descriptionEN: 'Defines whether only one popover can be displayed on the page.'
                    },
                    {
                        name: 'states',
                        type: 'Array',
                        defaultValue: '[]',
                        description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'btn-variant-dark\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.',
                        descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'btn-variant-dark\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.'
                    },
                    {
                        name: 'closeButton',
                        type: 'Boolean',
                        defaultValue: 'true',
                        description: 'Definiert ob den Closebutton in der Title des Popovers angezeigt wird.',
                        descriptionEN: 'Defines whether the close button is displayed in the title of the popover.'
                    },
                    {
                        name: 'closeButtonCssClass',
                        type: 'String',
                        defaultValue: '',
                        description: 'CSS Klasse für den Closebutton.',
                        descriptionEN: 'CSS class for the close button.'
                    },
                    {
                        name: 'headerCssClass',
                        type: 'String',
                        defaultValue: '',
                        description: 'CSS Klasse für den Title des Popover.',
                        descriptionEN: 'CSS class for the title of popover.'
                    },
                    {
                        name: 'contentCssClass',
                        type: 'String',
                        defaultValue: '',
                        description: 'CSS Klasse für den Inhalt des Popover.',
                        descriptionEN: 'CSS class for the content of popover.'
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

            self.connector = new signalsConnector();

            switch (self.connector.currentLanguageId()) {
                case -1:
                    self.selectedLanguageId(7); // Fall back to german language ID if no language ID available 
                    break;
                default:
                    self.selectedLanguageId = self.connector.currentLanguageId;
                    break;
            }

        };

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
        };

        return ctor;
    });