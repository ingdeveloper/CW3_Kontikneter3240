define(
    ["../components/services/secured.service"],
    function (securedService) {

        var componentshvac = function (params) {
            var self = this;
            self.id = ko.observable('demo-hvac');
            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.isModalDialogsDraggable = self.settings.isModalDialogsDraggable !== undefined ? self.settings.isModalDialogsDraggable : true;
            self.projectAuthorization = (ko.unwrap(self.settings.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            self.debug = false;
            self.showDialog = ko.observable(false);
            self.ventDialog = ko.observable(false);
            self.titleText1 = ko.observable(ko.unwrap(self.settings.titleText1) || "Lüftungsanlage");
        };

        componentshvac.prototype = {

            activateDialog: function (flag, id, statusSignal) {
                var self = this;
                self.param1 = "LU 5.1";
                self.param2 = id;
                self.statusSignal = statusSignal;
                self.showDialog(flag);
                self.ventDialog(true);

            },
            close: function () {
                var self = this;
                self.param1 = null;
                self.param2 = null;
                self.statusSignal = null;
                self.ventDialog(false);
                self.showDialog(false);
            },
            dispose: function () {
                var self = this;
                return;
            }
        };
        
        return componentshvac;
    });


