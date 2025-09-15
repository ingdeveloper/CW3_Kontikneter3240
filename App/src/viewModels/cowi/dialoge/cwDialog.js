define(
    function () {
        var dialog = require("plugins/dialog");

        var ctor = function (txJa, txNein, txHeader, txContent) {
            var self = this;
            self.modalContentID = uuid.v4();
            self.txJa = ko.observable(txJa) || undefined;
            self.txNein = ko.observable(txNein) || undefined;
            self.txHeader = ko.observable(txHeader) || undefined;
            self.txContent = ko.observable(txContent) || undefined;
        };

        ctor.prototype = {
            closeOk: function () {
                var self = this;
                dialog.close(self, "ClosedOkay");
            },
            close: function () {
                var self = this;
                dialog.close(self, "Closed");
            },
            abbruch: function () {
                var self = this;
                dialog.close(self, "");
            },
            attached: function () {
                var self = this;
                $("#" + self.modalContentID).on("click", function (event) {
                    event.stopPropagation();
                });
                $(".modalHost").on("click", function () {
                    self.close();
                });
                $(document).on("keydown", function (event) {
                    if (event.code == "Escape") {
                        self.close();
                    }
                });
            }
        };
        return ctor;
    });