define(
    ['plugins/dialog'],
    function (dialog) {

        var ctor = function () {
            var self = this;
        };

        ctor.prototype = {
            activate: function (settings) {
                var self = this;
                self.settings = settings;
                self.oee = ko.observable(0);
                self.availability = ko.observable(95.5);
                self.performance = ko.observable(96.8);
                self.quality = ko.observable(78.5);
                self.oee = ko.computed(function () {
                    return (self.availability() / 100 * self.performance() / 100 * self.quality() / 100) * 100;
                });
            },
            close: function () {
                var self = this;
                dialog.close(self, '');
            }
        };
        return ctor;
    });