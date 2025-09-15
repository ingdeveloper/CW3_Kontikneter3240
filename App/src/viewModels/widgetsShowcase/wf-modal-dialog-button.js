define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfModalDialogButton";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
            [
                {
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description:
                        'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN:
                        'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
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
                    description:
                        'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the widget.'
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
                    name: 'cssClass',
                    type: 'string',
                    defaultValue: 'btn-default',
                    description: 'CSS Klassenname um die Darstellung des Buttons zu beeinflussen',
                    descriptionEN: 'Affecting CSS class name to the appearance of buttons'
                },
                {
                    name: 'flat',
                    type: 'boolean',
                    defaultValue: 'false',
                    description: '',
                    descriptionEN: 'Toggles the flat appearance of the button.'
                },
                {
                    name: 'headerClass',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    descriptionEN: 'Defines the classes that will be added to the modal dialog header.'
                },
                {
                    name: 'showModal',
                    type: 'boolean',
                    defaultValue: 'true',
                    description: '',
                    descriptionEN: 'Allows the button to open a modal dialog.'
                },
                {
                    name: 'dialogClassName',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    descriptionEN: 'Sets the class name of the modal dialog window panel.'
                },
                {
                    name: 'modalSource',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    descriptionEN: 'Specifies the page that will be opened inside the modal dialog.'
                },
                {
                    name: 'modalParameters',
                    type: 'any',
                    defaultValue: 'null',
                    description: '',
                    descriptionEN: 'Sets the parameters of the navigation.'
                },
                {
                    name: 'bodyHeight',
                    type: 'number',
                    defaultValue: '250',
                    description: '',
                    descriptionEN: 'Sets the height of the modal dialog window in px.'
                },
                {
                    name: 'bodyWidth',
                    type: 'number',
                    defaultValue: '300',
                    description: '',
                    descriptionEN: 'Sets the width of the modal dialog window in px.'
                },
                {
                    name: 'modalTitle',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    descriptionEN: 'Sets the text of the modal dialog title.'
                },
                {
                    name: 'modalDialogPlacement',
                    type: 'string',
                    defaultValue: 'center',
                    description: '',
                    descriptionEN: 'Sets the placement of the modal dialog window relative to the browser window.'
                },
                {
                    name: 'iconCustomCss',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    descriptionEN: 'Allows adding optional custom css rules for the button icon.'
                },
                {
                    name: 'showIcon',
                    type: 'boolean',
                    defaultValue: 'true',
                    description: '',
                    descriptionEN: 'Changes the visibility of the button icon. By default the icon is set to visible.'
                },
                {
                    name: 'fontSize',
                    type: 'number',
                    defaultValue: '14',
                    description: '',
                    descriptionEN: 'Sets the font size of the button text.'
                },
                {
                    name: 'fontFamily',
                    type: 'string',
                    defaultValue: 'Arial',
                    description: '',
                    descriptionEN: 'Sets the font family of the button text.'
                },
                {
                    name: 'fontBold',
                    type: 'boolean',
                    defaultValue: 'false',
                    description: '',
                    descriptionEN: 'Sets the font weight of the button text.'
                },
                {
                    name: 'buttonText',
                    type: 'string',
                    defaultValue: 'Modal Dialog Button',
                    description: '',
                    descriptionEN: 'Sets the button text.'
                },
                {
                    name: 'states',
                    type: 'Array',
                    defaultValue: '[]',
                    description: 'Stellt die Definition eines Zustands dar. Jede Zustandsdefinition ist ein Objekt, das durch die Eigenschaften definiert ist: signalName, maskSignal, conditionRule, operator, cssClassName. Beispiele: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.',
                    descriptionEN: 'Represents the definition of a state. Each state definition is an object defined by the properties: signalName, maskSignal, conditionRule, operator, cssClassName. Examples: {signalName:\'Setpoint 1\', maskSignal:1, operator: \'>\', cssClassName: \'wf wf-light-bulb-o\'}, { conditionRule: \'%Setpoint 1% > 1\', cssClassName: \'wf wf-light-bulb-o\' }.'
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