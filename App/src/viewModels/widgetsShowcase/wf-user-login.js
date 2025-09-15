define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfUserLogin";
            self.widgetCategory = "Sicherheit";

            self.widgetProperties = [{
                    name: 'autoLogin',
                    type: 'Boolean',
                    defaultValue: "false",
                    description: 'Wenn diese Eigenschaft true ist, wird automatisch der aktuelle Windows-Benutzer eingeloggt.',
                    descriptionEN: 'If this option is set to true, then the current Windows user will be logged in automatically.'
                },
                {
                    name: 'userProperties',
                    type: 'Array',
                    defaultValue: "['Name']",
                    description: 'Dieses Arry mit String legt fest, welche Informationen* von dem angemeldeten Benutzer als Labels angezeigt werden.',
                    descriptionEN: 'This array of strings defines, which information of logged in user should be shown as labels.'
                },
                {
                    name: 'defaultText',
                    type: 'String',
                    defaultValue: "",
                    description: 'Dieser Text als Labels wird angezeigt, wenn der Benutzer nicht angemeldet ist.',
                    descriptionEN: 'This text should be shown as label when user is not logged.'
                },
                {
                    name: 'iconClass',
                    type: 'String',
                    defaultValue: 'wf-lg wf-login',
                    description: 'CSS Klasse für das Icon Element. Direkt verfügbar sind alle Bootstrap Icons, FontAwesome Icons sowie WEBfactory IconFont Icons.',
                    descriptionEN: 'CSS class for the icon element. Immediately available are all Bootstrap icons, icons and FontAwesome WEBfactory IconFont icons.'
                },
                {
                    name: 'loggedInIconClass',
                    type: 'String',
                    defaultValue: 'wf-lg wf-logout',
                    description: 'CSS Klasse für das Icon Element, wenn User eingeloggt ist. Direkt verfügbar sind alle Bootstrap Icons, FontAwesome Icons sowie WEBfactory IconFont Icons.',
                    descriptionEN: 'CSS class for the icon element when user is logged in. Immediately available are all Bootstrap icons, icons and FontAwesome WEBfactory IconFont icons.'
                },
                {
                    name: 'cssClass',
                    type: 'String',
                    defaultValue: 'btn btn-default',
                    description: 'CSS Klassenname um die Darstellung des Buttons zu beeinflussen',
                    descriptionEN: 'CSS class name for the button'
                },
                {
                    name: 'loggedInRoute',
                    type: 'String',
                    defaultValue: '',
                    description: 'Navigationsroute, zu welcher unmittelbar nach dem Login automatisch navigiert werden soll',
                    descriptionEN: 'Navigation route, where redirect should be happen to after login.'
                },
                {
                    name: 'loggedOutRoute',
                    type: 'String',
                    defaultValue: '',
                    description: 'Navigationsroute, zu welcher unmittelbar nach dem Logout automatisch navigiert werden soll',
                    descriptionEN: 'Navigation route, where redirect should be happen to after logout.'
                },
                {
                    name: 'labelOrientation',
                    type: 'String',
                    defaultValue: 'horizontal',
                    description: 'Definiert ob die Benutzerinformationen Labels horizontal (inline) oder mit Zeilenumbrüchen dargestellt werden.',
                    descriptionEN: 'Defines if the user information labels should be shown horizontal (inline) or with linebreaks.'
                },
                {
                    name: 'popoverHeaderCssClass',
                    type: 'String',
                    defaultValue: '',
                    description: 'CSS Klasse für den Title des Popover. z.B. "popover-variant-dark", "popover-primary", "popover-info", "popover-danger", "popover-warning", "popover-success" ',
                    descriptionEN: 'CSS class for the title of popover. e.g. "popover-variant-dark", "popover-primary", "popover-info", "popover-danger", "popover-warning", "popover-success" '
                },
                {
                    name: 'position',
                    type: 'String',
                    defaultValue: 'bottom',
                    description: 'Definiert wie das Popover positioniert wird - top|bottom|left|right|auto. Wenn "auto" angegeben ist, wird das Popover dynamisch neu ausgerichtet.',
                    descriptionEN: 'Defines how to position the popover - top|bottom|left|right|auto. When "auto" is specified, it will dynamically reorient the popover.'
                },
                {
                    name: 'changePasswordVisibility',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob der Passwort ändern Link angezeigt wird.',
                    descriptionEN: 'Defines whether the password change link is displayed.'
                }
            ];

            self.userProperties = [
                "Active",
                "Company",
                "Name",
                "FirstName",
                "LastName",
                "IsADUser",
                "LogActivities",
                "Plant",
                "RFIDSerialNo",
                "UserLevel",
                "Description"
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