define(
    function () {
        var dialog = require('plugins/dialog');

        var ctor = function (param1, param2) {
            var self = this;
            self.param1 = param1;
            self.param2 = param2;

            self.statusSignal = "OperationMode" + param1;

        };

        ctor.prototype = {
            close: function () {
                var self = this;
                dialog.close(self, "");
            }
        };
        return ctor;
    });