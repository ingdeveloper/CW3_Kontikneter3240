﻿define(
    function () {
        //var dialog = require(['plugins/dialog']);

        var jalousieDialog = function (params) {
            var self = this;
            self.signalName = params.viewModel().signalName;
            self.jalousieUpValue = params.viewModel().jalousieUpValue;
            self.jalousieDownValue = params.viewModel().jalousieDownValue;
        };

        jalousieDialog.prototype = {
            close: function () {
                var self = this;
                //dialog.close(self, '');
            }
        };
        return jalousieDialog;
    });