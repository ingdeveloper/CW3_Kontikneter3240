define(
    ["../components/services/secured.service"],
    function (securedService) {

        var componentsbuilding = function (params) {
            var self = this;
            self.settings = params;
            self.objectID = ko.unwrap(self.settings.objectID);

            self.isModalDialogsDraggable = self.settings.isModalDialogsDraggable !== undefined ? self.settings.isModalDialogsDraggable : true;
            self.projectAuthorization = (ko.unwrap(self.settings.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            self.debug = false;
        };

        componentsbuilding.prototype = {
            activate: function (settings) {
                var self = this;
                self.connector = new signalsConnector();
            },

            centralOff: function () {
                var self = this;
                self.connector.writeSignals({
                    "Setpoint 1": 0,
                    "Setpoint 2": 0,
                    "Setpoint 3": 0,
                    "OperationMode1": 0,
                    "OperationMode2": 0,
                    "OperationMode3": 0
                });

            },
            attached: function () {
                $(".collapse").collapse({
                    toggle: false
                });
            }
        };
        
        return componentsbuilding;
    });