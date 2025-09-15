define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wfModalDialog";
            self.widgetCategory = "Visualisieren";

            self.widgetProperties =
                [
                    {
                        name: 'viewName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Definiert den Namen der HTML-View, die den Inhalt des Dialogs bereitstellt. Die View muss im Ordner abgelegt sein, der über die Eigenschaft „viewPath“ definiert wird.',
                        descriptionEN: 'Defines the name of the HTML view, which provide the contents for the dialog. The HTML view must be located in the folder, that is defined by the property „viewPath“.'
                    },
                    {
                        name: 'viewPath',
                        type: 'String',
                        defaultValue: 'src/views/dialogs/',
                        description: 'Definiert den Pfad der Eigenschaft "viewName".',
                        descriptionEN: 'Defines the path of the HTML view.'
                    },
                    {
                        name: 'viewModel',
                        type: 'Object',
                        defaultValue: '',
                        description: 'Definiert ein Objekt, das alle Parameter für den Dialog enthält.',
                        descriptionEN: 'Defines an object that contains all the parameters for dialog.'
                    },
                    {
                        name: 'title',
                        type: 'String',
                        defaultValue: '',
                        description: 'Definiert den Titel des Dialogs.',
                        descriptionEN: 'Defines the title of the dialog'
                    },
                    {
                        name: 'draggable',
                        type: 'String',
                        defaultValue: 'false',
                        description: 'Definiert ob das modalen Dialog ziehbar sind.',
                        descriptionEN: 'Defines whether the modal dialog is draggable.'
                    },
                    {
                        name: 'headerClasses',
                        type: 'String',
                        defaultValue: 'modal-primary',
                        description: '',
                        descriptionEN: 'Defines the classes that will be added to the modal dialog header '
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