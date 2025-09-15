define(
    function () {
        var dialog = require('plugins/dialog');

        var ctor = function (param1, param2) {
            var self = this;
            self.param1 = ko.observable(param1);
            self.param2 = ko.observable(param2);

            self.statusSignal = "Setpoint " + self.param1();
        };

        ctor.prototype = {
            close: function () {
                var self = this;
                dialog.close(self, '');
            }
        };
        return ctor;
    });