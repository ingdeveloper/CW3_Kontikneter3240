define(
    ['../../services/connector'],
    function (signalsConnector) {

        var ctor = function () {
            var self = this;

            self.defaultSettings = {};
        };

        ctor.prototype = {
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

        return ctor;
    });