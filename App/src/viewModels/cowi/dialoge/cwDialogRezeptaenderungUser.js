//###########################################################################################################################################
// Überprüfung des Benutzers, ob Berechtigung vorhanden sind (Berechtigung von RezeptDatenbank WEBF).
// Danach wird die Änderung des Rezeptes mit Angabe eines Grundes in ein Archiv geschrieben (app-visu-01-p\RezeptaenderungenUser\Archiv).
//###########################################################################################################################################

define(['../../../services/connector', "src/services/http"],
    function (signalsConnector, HttpService) {
        var dialog = require('plugins/dialog');

        var ctor = function (params) {   //Übergabe ist ein JSON-Objekt
            var self = this;
            self.params = params;
            self.connector = new signalsConnector();
            self.rezeptData = []; // leeres Array erzeugen
            self.anlage = params.anlageId == undefined ? '_noName' : params.anlageId;
            self.rezeptnummer = params.rezeptnummer == undefined ? 0 : params.rezeptnummer;
            self.rezeptName = params.rezeptName == undefined ? '' : params.rezeptName;

            self.rezeptAbfrageIds = params.rezeptAbfrageIds == undefined ? {} : params.rezeptAbfrageIds;  //Übergabe ist ein JSON-Obj

            self.userName = ko.observable('');
            self.userPassword = ko.observable('');
            self.userGrund = ko.observable('');
            self.saveValues = {};
        };

        ctor.prototype = {
            compositionComplete: function () {
                var self = this;
                self.getRezeptFromServer();
            },
            close: function () {
                var self = this;
                dialog.close(self, 'Closed');
            },
            closeOk: function () {
                var self = this;
                dialog.close(self, 'ClosedOkay');
            },
            anmelden: function () {
                var self = this;

                self.getUserRightsOkay = false;
                self.userIdFromRezeptBerechtigungen = 0;
                var cmd = {
                    odbcCmd: "SELECT usvname, usnname, usberez, usid FROM cwprddta.wfuserpf1 WHERE ususer = '" + self.userName() + "' AND uspass = '" + self.userPassword() + "' AND usberez > 1"
                };
                //#######################################################################################################
                // ... hier Benutzer abfragen, ob Berechtigung gegeben ist ... 
                //#######################################################################################################
                HttpService.post(window.rootUrlPrefix + "/WcfRezept/WsRezept.svc/js/ReadDatabase", cmd)
                    .then(function (response) {
                        var empfArray = response.ReadDatabaseResult;  //Array bestehend aus Vor- und Nachname (je nach Select-Anfrage)

                        var res = [];
                        var usnname = "";
                        var usvname = "";
                        var usberez = "";
                        var usid = "";
                        if (empfArray.length > 0) {
                            res = empfArray[0].split("|");
                            usnname = res[0] || "";
                            usvname = res[1] || "";
                            usberez = res[2] || "";
                            usid = res[3] || "";

                        }
                        console.log(res);
                        self.getUserRightsOkay = empfArray.length > 0;  //wenn Array gefüllt, dann ist Benutzer berechtigt
                        self.userIdFromRezeptBerechtigungen = usid;
                    })
                    .then(function () {

                        //#######################################################################################################
                        // wenn Benutzer vorhanden, kommt ein Array mit Vor- und Nachname zurück 
                        //#######################################################################################################
                        if (self.getUserRightsOkay) {

                            if (self.userGrund().length > 0) {
                                console.log("Grund ist eingetragen: " + self.userGrund());

                                //#######################################################################################################
                                // wenn Grund eingetragen ist, dann Daten übertragen in die Archiv-Datei 
                                //#######################################################################################################
                                var sendData = {
                                    user: self.userIdFromRezeptBerechtigungen,//self.userName(),
                                    grund: self.userGrund(),
                                    werte: self.saveValues
                                };
                                console.log(self.saveValues);

                                var myJSON = JSON.stringify(sendData);  //wandeln in String für Server
                                var urlHost = "https://app-visu-01-p/RezeptaenderungUser/";
                                var urlQuery = "SendAenderunUserHTML5JSON.asp?werte=" + myJSON + "&anlage=" + self.anlage;
                                var url = urlHost + urlQuery;

                                var http = new XMLHttpRequest();
                                http.open("GET", url, true);
                                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=iso-8859-15");

                                http.onreadystatechange = function () {
                                    if (http.readyState == 4) {
                                        if ((http.status >= 200) && (http.status < 300)) {
                                            console.log(http.responseText);
                                            // toastr.warning(http.responseText);
                                        } else {
                                            console.log("Server Fehler!");
                                            console.warn(http.statusText, http.responseText);
                                            toastr.error(http.responseText);
                                        }
                                    }
                                };
                                http.send();

                                // wenn Logs gesendet sind, dann Okay zum schließen des Dialogs
                                self.closeOk();
                            } else {
                                toastr.error("Bitte den Grund eintragen!");
                            }
                        } else {
                            toastr.error("Fehler in der Benutzeranmeldung!");
                        }

                    });

            },

            // ##########################################################################################################
            // Die Buffer-Variablen werden gesammelt und der Kommentar aus dem Rezept-Werten werden ihnen zugewiesen
            // Gleichzeitig wird auch der aktuelle Wert aus der SPS gelesen.
            // Nach dem Vergleich sollte das Ergebnis in ein Archiv gespeichert werden.
            // ##########################################################################################################
            controllBuffer: function () {
                var self = this;
                var ergArr = [];

                var sendValues = self.connector.getSignalsFromBuffer();

                ergArr = [];
                for (var k = 0; k < sendValues.length; k++) {
                    var wertRezeptDB = '';//self.rezeptData[k].wert;
                    var aliasKommentarRezeptDb = '';
                    var alias = sendValues[k].key;
                    var wertSps = self.connector.getSignal(alias).value();
                    var wertNeu = sendValues[k].value;
                    // Den SPS Wert nach String wandeln
                    var ergNummer = wertSps;
                    if (typeof (wertSps) === 'number') {
                        var str = wertSps.toString();
                        ergNummer = str
                    }

                    // innerhalb vom Rezept-Ergebnis die VAriable suchen und den aliasKommentar und Rezept-Wert auslesen
                    for (var n = 0; n < self.rezeptData.length; n++) {
                        if (alias == self.rezeptData[n].aliasVariable) {
                            wertRezeptDB = self.rezeptData[n].wert;
                            aliasKommentarRezeptDb = self.rezeptData[n].beschreibung;
                            break;
                        }

                    }
                    var ergArrJson = {};

                    ergArrJson['aliaskommentar'] = aliasKommentarRezeptDb;//self.rezeptData[k].beschreibung;
                    ergArrJson['alias'] = alias;
                    ergArrJson['valueSps'] = wertSps;
                    ergArrJson['valueNeu'] = wertNeu;
                    ergArrJson['valueRezept'] = wertRezeptDB;
                    ergArr.push(ergArrJson);
                    console.log(alias + '  ;  SPS:' + wertSps + '  ;  Neu:' + wertNeu + '  ;  Rezept:' + wertRezeptDB + '  ;  Replace:' + ergNummer);
                }

                var myJSON = JSON.stringify(ergArr); // wandeln in String für Server
                var myObj = {
                    varArray: ergArr,
                    varRezeptNr: self.rezeptnummer,
                    varRezeptname: self.rezeptName,
                    varAnlage: self.anlageIDFuerArchiv
                }

                console.log(myObj);
                self.saveValues = (myObj);
                console.log("%c-----------------LINK------------------", "background:red");
                console.log(self.saveValues);

            },

            getRezeptFromServer: function () {

                var self = this;

                var aktWerk = 2;
                var aktHalle = 4;
                var aktEtage = 0;
                var aktLinie = 1;
                var aktAbteilung = 200;
                var aktMaschine = 21;
                var aktRezeptNr = self.rezeptnummer;
                var aktRezeptVersion = 0;
                var Wert = '';
                var rueckgabewert = '';

                var urlHost = 'https://app-visu-01-p/DatenRezeptspeicherungPaNr/';
                var urlQuery = 'rezeptLaden.asp?Werk=' + aktWerk + '&Halle=' + aktHalle + '&Etage=' + aktEtage + '&Linie=' + aktLinie + '&Abteilung=' + aktAbteilung + '&Maschine=' + aktMaschine + '&RezeptNr=' + aktRezeptNr + '&RezeptVersion=' + aktRezeptVersion;
                var url = urlHost + urlQuery;

                HttpService.get(url)
                    .then(function (response) {
                        rueckgabewert = response;
                        rueckgabewert = rueckgabewert.replace(/\r\n/g, "<br />\r\n");
                        var ergArray = rueckgabewert.split("<br />\r\n");

                        var pos;
                        var kopfData = {}; //leeres Objekt erzeugen

                        //======bei den Kopfdaten die Daten formatieren. Alt [0] "Werk:2" -> "Werk":"2"  ; Das Ergebnis kann dann in eine JSON-Obj geladen werden
                        for (var i = 0; i < ergArray.length - 1; i++) {
                            //ergArray[i] = ergArray[i].replace(":", "\":\"");
                            //console.log(ergArray[i]);
                            pos = ergArray[i].indexOf(':');
                            kopfData[ergArray[i].slice(0, pos)] = ergArray[i].substring(pos + 1); //den Rest nach dem ":" in das JSON-Objekt kopieren
                        }

                        //=======im letztem Array steht das Rezept
                        pos = ergArray[i].indexOf(':');
                        var tmpStr = ergArray[i].substring(pos + 1); //rezeptData.Rezept.[]   den Rest nach dem ":" in das JSON-Objekt kopieren
                        self.rezeptData = tmpStr.split('<br>'); //rezeptData.Rezept.[]   den Rest nach dem ":" in das JSON-Objekt kopieren

                        var tmpArr = [];

                        for (var j = 0; j < self.rezeptData.length; j++) {
                            tmpArr = self.rezeptData[j].split(';');
                            var zeile = {
                                zeile: 0,
                                beschreibung: '',
                                wert: 0,
                                aliasVariable: ''
                            };

                            zeile.zeile = j + 1;
                            zeile.beschreibung = tmpArr[0];
                            zeile.wert = tmpArr[1];
                            zeile.aliasVariable = tmpArr[2];
                            self.rezeptData[j] = zeile; //den Rest nach dem ":" in das JSON-Objekt kopieren
                        }

                        //erst einmal die Anfrage an WF senden, damit die Variablen die noch nicht im Projekt verwendet sind, registriert werden
                        var wertSPSArr = [];

                        for (var k = 0; k < self.rezeptData.length; k++) {
                            var alias = self.rezeptData[k].aliasVariable;
                            // console.log(alias);
                            var wertSps3 = self.connector.getSignal(alias).value();
                            //wertSPSArr.push(alias);  //Array mit Alias-Namen erstellen
                        }

                        self.controllBuffer();
                        
                    });
                return;
            }


        };
        return ctor;
    });