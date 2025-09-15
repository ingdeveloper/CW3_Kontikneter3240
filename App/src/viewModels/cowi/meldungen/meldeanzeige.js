define([    '../../../services/connector', 
            'plugins/dialog', 
            'src/viewmodels/cowi/dialoge/cwDialog', 
            '../../../services/usersService', 
            '../../../components/services/secured.service'],
function (signalsConnector, dialog, okCancelDialog, usersService, securedService) {
    var ctor = function () {
        var self = this;
        //Example for a viewmodel
    };

    ctor.prototype = {
        activate: function () {
            var self = this;
            self.connector = new signalsConnector();
            self.signalQuitFrost3041 = 'VMI3240DB1X3000';
            return self.connector.getOnlineUpdates();//.fail(self.connector.handleError(self));
        },
        openDialog: function (txJa, txNein, txHeader, signal, value) {  //Parameter: Text für Ja-Button, Text für Nein-Button, Text für Überschrift
            var self = this;
            dialog.show(
                new okCancelDialog(txJa, txNein, txHeader)
                )
                  .then(function (dialogResult) {
                      console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;');  //Dialog-Fenster geschlossen

                      var values = {};
                      if (dialogResult === 'ClosedOkay') {
                          console.info('%cOk: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                          values[signal] = value;
                          self.connector.writeSignals(values);
                          toastr.success('Wert geschrieben');
                      } else if (dialogResult === 'Closed') {
                          console.info('%cCancel: Signal=' + signal + ' Value=' + value, 'background: yellow;');
                          values[signal] = 0;
                          self.connector.writeSignals(values);
                          toastr.success('Wert geschrieben');

                      }
                  });
        }
    }
    return ctor;
});

