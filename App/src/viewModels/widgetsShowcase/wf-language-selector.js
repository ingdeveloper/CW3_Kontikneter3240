define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfLanguageDropdown";
            self.widgetCategory = "Internationalisierung";
           
            self.widgetProperties =
            [
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
                    name: 'iconClass',
                    type: 'String',
                    defaultValue: 'wf wf-language',
                    description: 'CSS Klasse für das Icon Element. Direkt verfügbar sind alle Bootstrap Icons, FontAwesome Icons sowie WEBfactory IconFont Icons.',
                    descriptionEN: 'CSS class for the icon element. Immediately available are all Bootstrap icons, icons and FontAwesome WEBfactory IconFont icons.'
                },

                {
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: 'btn btn-variant-dark',
                    description: 'CSS Klassenname um die Darstellung des Buttons zu beeinflussen',
                    descriptionEN: 'CSS class name for the button'
                },
                {
                    name: 'dropdownAlignment',
                    type: 'String',
                    defaultValue: 'left',
                    description: 'Ausrichtung der Dropdown Elemente',
                    descriptionEN: 'Alignment of dropdown item'
                },
                {
                    name: "projectAuthorization",
                    type: "String",
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


