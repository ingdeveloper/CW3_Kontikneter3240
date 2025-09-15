define(['../../../services/connector', '../../../services/usersService', "../../../components/services/secured.service", 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, usersService, securedService, dialog, okCancelDialog) {
        var dialog = require('plugins/dialog');

        var ctor = function (arrayObjekt, rezNr, rezName) {  //Objekt, Rezeptnummer, RezeptName übernehmen
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
            self.userFreigabe = ko.pureComputed(function () {
                var self = this;
                var user = ko.unwrap(self.userName);
                var erg;
                if (user !== '') {
                // if ((user == 'Technik') || (user == 'user') || (user == 'ihcw3')) {
                    erg = true;
                } else {
                    erg = false;
                }
                if (erg == true) {
                    console.log('%cAngemeldeter User: ' + user + ' / Freigabe: ' + erg, 'background: lime');
                }
                return erg;
            }, self);
            //---------------------------------------------------------------------------


            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);

            self.tabelleZeilen = ko.observableArray(arrayObjekt);  //Übergabe des Ergebnisses an die Tabelle; Eigenschaften= 'beschreibung','alias','valueSps','valueDb'
            self.rezeptNr = ko.observable(rezNr);
            self.rezeptName = ko.observable(rezName);
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
            getCurrentUserDetails: function () {
                var self = this;
                usersService.getCurrentUserDetails()
                    .then(function (userDetails) {
                        self.userDetails(userDetails);
                    })
                //     .fail(self.connector.handleError(self));
            },
            sendWerteZurSps: function () {
                var self = this;
                console.log('%cSend Werte zur SPS ', 'background:yellow');
                dialog.show(
                    new okCancelDialog('Ja', 'Nein', 'Soll wirklich zum angegebenen Schritt gesprungen werden?')  //Rückmeldung: 'ClosedOkay','Closed','ClosedAbbruch'
                    )
                      .then(function (dialogResult) {
                          console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;');  //Dialog-Fenster geschlossen

                          var values = {};
                          if (dialogResult === 'ClosedOkay') {

                                  var bufferSignale = self.connector.getSignalsFromBuffer();  //Signale vom Buffer lesen
                                  var len = bufferSignale.length;
                                  var i;
                                  for (i = 0; i < len; i++) {
                                      console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
                                      if (bufferSignale[i].key === self.sollIstSchritt.signalName()) {  //wenn SignalName passt..
                                          if ((bufferSignale[i].value < 15) && (bufferSignale[i].value !== "")) {  //..und Schritt < 15 ...
                                              self.connector.writeSignalsFromBuffer();  //... dann übertragen
                                              toastr.success('Schritt eingestellt!');
                                          } else {
                                              toastr.error('Das angegebene Sprungziel ist nicht erreichbar!');
                                          }
                                      }
                                  }

                                  
                          }
                      });
            }


        };
        return ctor;
    });