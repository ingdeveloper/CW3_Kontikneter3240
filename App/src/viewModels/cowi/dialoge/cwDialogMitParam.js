define(
    function () {
        var dialog = require('plugins/dialog');

        var ctor = function (txtInhalt, txtKopf, txtFuss) {
            var self = this;
            self.txtKopf = ko.observable(txtKopf) || undefined;
            self.txtInhalt = ko.observable(txtInhalt) || undefined;
            self.txtFuss = ko.observable(txtFuss) || undefined;
        };

        ctor.prototype = {
            close: function () {
                var self = this;
                dialog.close(self, 'Closed');
            }
        };
        return ctor;
    });