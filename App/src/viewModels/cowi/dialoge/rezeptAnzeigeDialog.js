define(['../../../services/connector', '../../../services/usersService', "../../../components/services/secured.service", '../services/cwASPAnfrage'],
    function (signalsConnector, usersService, securedService, WebserviceAsp) {
        var dialog = require('plugins/dialog');

        var ctor = function () {
            var self = this;
            self.WebserviceAsp = new WebserviceAsp();

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

                if ((user == 'Technik') || (user == 'user') || (user == 'ihcw3')) {
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

            self.ergASPAnfrage = ko.observable('Bitte auf Ergebnis des Rezeptes warten!');  //Ergebnis in HTML-Seite anzeigen

            self.rezeptnummer = self.connector.getSignal('SahneDB461DBD0');


            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);

            //Funktion direkt ausführen
            self.oeffneLinkZumRezept();
            //self.oeffneAspLokal();
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
                    .fail(self.connector.handleError(self));
            },

            oeffneLinkZumRezept: function () {
                var self = this;
                var rezeptNr = self.rezeptnummer.value();  //302044300;
                var rezeptNrOkay = false;
                if (isFinite(rezeptNrOkay)) {
                    rezeptNrOkay = rezeptNr > 0;
                } else {
                    rezeptNrOkay = (rezeptNr.length > 0) && (rezeptNr != 0) && (rezeptNr != 'NaN');  //Länge vorhanden und Wert <> 0
                }
                console.log('Rezeptnummer: ' + rezeptNr);
                var Pfad = "http://minfo/daten/Sahne_C2/_Sahne";
                if (rezeptNrOkay) {
                    //http://minfo/AspRezeptInfo/ArtikellabfrageHTML5.asp?ArtikelNummer=300244001&Pfad_=http://minfo/daten/Sahne_C2/_Sahne
                    self.WebserviceAsp.getAspRezeptInfo("http://minfo/AspRezeptInfo/ArtikellabfrageHTML5.asp?ArtikelNummer=" + rezeptNr + "&Pfad_=" + Pfad)
                        .then(function (data) {
                            self.ergASPAnfrage(data);  //muss rein, sonst keine Anzeige
                            //console.info('%cWebService Anfrage für Rezept-Info:' + data, 'background: yellow;');

                        })
                        .catch(function (err) { //bei Fehlerfall
                            console.info(err.statusText);
                            self.ergASPAnfrage("Fehler bei Anfrage des Rezeptes. Fehler-Code="+err.statusText + ". <br> Programmierabteilung anrufen! Vielleicht Server-Zugriffsrecht 'CORS' nicht aktiviert!");  //muss rein, sonst keine Anzeige
                        });

                }

            },

            oeffneAspLokal: function () {
                var self = this;
                var rezeptNr = self.rezeptnummer.value();
                var rezeptNrOkay = false;
                if (isFinite(rezeptNrOkay)) {
                    rezeptNrOkay = rezeptNr > 0;
                } else {
                    rezeptNrOkay = (rezeptNr.length > 0) && (rezeptNr != 0) && (rezeptNr != 'NaN');  //Länge vorhanden und Wert <> 0
                }
                console.log('oeffneAspLocal -> Rezeptnummer: ' + rezeptNr);
                var Pfad = "http://minfo/daten/Sahne_C2/_Sahne";
                if (rezeptNrOkay) {
                    var queryStr = "ArtikelNummer=" + rezeptNr + ";Pfad_=" + Pfad;
                    self.WebserviceAsp.getAspLocal("http://localhost/mixer_3161/aspRequestResponse/aspReqResp.asp","http://minfo/AspRezeptInfo/ArtikellabfrageHTML5.asp", queryStr)
                        .then(function (data) {
                            self.ergASPAnfrage(data);  //muss rein, sonst keine Anzeige
                            //console.info('%cWebService Anfrage für Rezept-Info:' + data, 'background: yellow;');
                        })
                        .catch(function (err) { //bei Fehlerfall
                            //console.info(err.statusText);
                            self.ergASPAnfrage("Fehler bei Anfrage des Rezeptes. Fehler-Code=" + err.statusText + ". <br> Programmierabteilung anrufen! Vielleicht Server-Zugriffsrecht 'CORS' nicht aktiviert!");  //muss rein, sonst keine Anzeige
                        });

                }

            }
        };
        return ctor;
    });