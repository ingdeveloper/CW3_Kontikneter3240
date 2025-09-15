define(['../../../services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, dialog, okCancelDialog) {
        var ctor = function () {
            var self = this;
            //Example for a viewmodel
        };

        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();

                self.connector.clearSignalBuffer();


                return self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
            },

        }

        return ctor;
    });