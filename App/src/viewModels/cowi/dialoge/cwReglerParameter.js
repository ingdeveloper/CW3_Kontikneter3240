define(['../../../services/connector', '../../../services/usersService', "../../../components/services/secured.service"],
    function (signalsConnector, usersService, securedService) {
        var dialog = require('plugins/dialog');

        var ctor = function (header, komponente, signal1, signal2, signal3, signal4, signal5, signal6, signal7) { 
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
            self.selectedKomponente = komponente;
            self.signalName1 = signal1; 
            self.signalName2 = signal2; 
            self.signalName3 = signal3; 
            self.signalName4 = signal4; 
            self.signalName5 = signal5; 
            self.signalName6 = signal6; 
            self.signalName7 = signal7; 
            
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