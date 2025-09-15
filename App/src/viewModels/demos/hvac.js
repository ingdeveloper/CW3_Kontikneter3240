define(
    ['plugins/dialog', 'src/viewmodels/dialogs/dialog-hvac-fan'],
    function (dialog, fanDialog) {

        var ctor = function () {
            var self = this;
        };

        ctor.prototype = {
            activate: function (settings) {
                var self = this;
            },

            openDialog: function (param1) {
                var self = this;
                var param2 = "LU 5.1"; // Example for additional parameter

                dialog.show(
                    new fanDialog(param1, param2)
                    )
                      .then(function (dialogResult) {
                          console.log(dialogResult);
                      });
            }
        };

        return ctor;
    });