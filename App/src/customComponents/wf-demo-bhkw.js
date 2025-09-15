define(
        ["../components/services/secured.service"],
    function (securedService) {

        var bhkw = function (params) {
            var self = this;
            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(self.settings.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            self.flowView = ko.observable(false);
            self.editMode = ko.observable(false);

            self.titleText1 = ko.observable((ko.unwrap(self.settings.titleText1) || "Energieflussansicht").stringPlaceholderResolver(self.objectID));
            self.titleText2 = ko.observable((ko.unwrap(self.settings.titleText2) || "Prozessansicht").stringPlaceholderResolver(self.objectID));
        };

        bhkw.prototype = {
            
            switchView: function (flag) {
                var self = this;
                self.flowView(flag);
            },

            switchMode: function (flag) {
                var self = this;
                self.editMode(flag);
            }
        };

        return bhkw;
    });