define(['../../../services/connector', '../../../services/usersService', "../../../components/services/secured.service"],
    function (signalsConnector, usersService, securedService) {
        var dialog = require('plugins/dialog');

        var ctor = function (header, komponente, quit) { 
            var self = this;

            self.connector = new signalsConnector();

            //------------ User ermitteln ---------------------------------------------
            self.connector.currentLoggedInUser.subscribe(function () {
                self.getCurrentUserDetails();
            });
            self.usersService = new usersService();
            self.property = 'Name';  //Eigenschaften zB. Name, active  usw. , Beschreibung in WF-App

            self.userDetails = ko.observable({});
            self.userName = ko.computed(function () {
                if (self.userDetails() && !isNullOrUndefined(self.userDetails()[self.property])) {
                    //console.log('User:' + self.userDetails()[self.property]);
                    return self.userDetails()[self.property];
                }
                return "";
            });

            self.getCurrentUserDetails();  //Funktion aufrufen (siehe unten), damit User ermittelt werden kann


            self.projectAuthorization = '';
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            //------------- User ermitteln Ende ---------------------------------------

            //------------ Buttons Freigabe je nach angemeldeten Benutzer --------------
            self.userFreigabe = ko.computed(function () {
                console.log('Anmelde-Level=' + window.UserLevel() >= 0);
                var freigabe = window.UserLevel() >= 0 ? true : false;
                return freigabe; //UserLevel wird in shell.ts gesetzt; Ergebnisse -1..3  -1=nicht angemeldet
            }, self);
            //---------------------------------------------------------------------------

            self.header = header;  
            self.komponente = komponente;
            self.quit = quit; 
            
            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);
        };

        ctor.prototype = {
            close: function () {
                var self = this;
                //beim schließen den Buffer löschen
                self.connector.clearSignalBuffer();

                dialog.close(self, "");
            },
            compositionComplete: function () {
                var self = this;
                //console.log('%cComplete Seite Dialog', 'background:lime');
                $(document).keydown(function (e) {
                    // ESCAPE key pressed
                    if (e.keyCode == 27) {
                        self.close();
                    }
                });

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
            },
            getCurrentUserDetails: function () {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function (userDetails) {
                        self.userDetails(userDetails);
                    });
            }


        };
        return ctor;
    });