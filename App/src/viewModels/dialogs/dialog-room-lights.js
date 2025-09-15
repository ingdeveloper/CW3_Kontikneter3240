define(
    function () {
        //var dialog = require(['plugins/dialog']);

        var raumDialog = function (params) {
            var self = this;
            self.signalName = params.viewModel().signalName;
            self.objectId = params.viewModel().objectId;
        };

        raumDialog.prototype = {
            close: function () {
                var self = this;
                //dialog.close(self, '');
            }
        };
        return raumDialog;
    });