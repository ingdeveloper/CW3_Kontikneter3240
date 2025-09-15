﻿define(
    function () {
        //var dialog = require(['plugins/dialog']);

        var dialogRoomTemperature = function (params) {
            var self = this;
            self.signalNameBarGraph1 = params.viewModel().signalNameBarGraph1;
            self.signalNameBarGraph2 = params.viewModel().signalNameBarGraph2;
        };

        dialogRoomTemperature.prototype = {
            close: function () {
                var self = this;
                //dialog.close(self, '');
            }
        };
        return dialogRoomTemperature;
    });