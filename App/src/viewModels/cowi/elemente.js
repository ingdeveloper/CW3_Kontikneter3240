define(['../../services/connector', 'transitions/entrance', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, entrance, dialog, okCancelDialog) {
        var ctor = function () {
            var self = this;
            self.myBeschriftung = ko.observableArray(
                [
                    "1", "2", "4"
                ]
            );
            self.neuerWert = ko.observable('3');

        };
        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();

                self.signal11 = self.connector.getSignal('Signal11').value();
                self.signal12 = self.connector.getSignal('Signal12').value();
                self.signal13 = self.connector.getSignal('Signal13').value();
                self.signal14 = self.connector.getSignal('Signal14').value();
                self.signal15 = self.connector.getSignal('Signal15').value();
                //console.info('%cNavigationsbar:' + self.shell.navBeschriftung()[0].title, 'background: yellow;');
                //self.shell.testenFunc();
                //self.shell.navBeschriftung.pop();
                //self.shell.navBeschriftung.removeAll();
                //self.testenFunc();
                console.info('%cNavigationsbar:' + self.myBeschriftung(), 'background: yellow;');

                //self.dueTimeUtc = ko.observableArray([2018,1,1]);  //Jahr, Monat, Tag 
                //self.dueTimeUtc = ko.observableArray(self.signal11, self.signal12, self.signal13, 10, 11, 12, 0); //Jahr, Monat, Tag 
                self.dueTimeUtc = ko.observable(new Date(2018, 2, 1, 10, 11, 12, 0)); //Jahr, Monat, Tag 
                self.dueTimeUtc.subscribe(function (newValue) {
                    var my = (newValue);
                    console.log("Subcribe " + my);
                    //this.value(self.ausgabe());
                });


                //self.myDateAndTime = self.connector.getSignal('TestDateAndTime').value.extend({ccwFormatS7DateAndTime: ""});
                self.myDateAndTime = self.connector.getSignal('TestDateAndTime').value.extend({
                    ccwFormatS7DateAndTime: "DD.MM.YYYY HH:mm:ss"
                });

                //self.myDateAndTime = self.connector.getSignal('TestDateAndTime').value;
                // self.myDateAndTime.subscribe(function (newValue) {
                //     var my = (newValue);
                //     console.log("SubcribeDateAndTime " + my);
                //     //this.value(self.ausgabe());
                // });
                //console.log("DateAndTime");
                //console.log(self.myDateAndTime());

                //self.buttonStyle = 

                self.sendBtnCss = ko.computed(function () {
                    var self = this;
                    var css = '';
                    var sendBufferLeer = self.connector.signalBufferIsEmpty();
                    console.log("%cSendBufferLeer()","background:yellow");
                    console.log(sendBufferLeer);
                    
                    if (!sendBufferLeer) {
                        return 'ccw-flash-bg';
                    }
                }, self);

                self.aliasNameZeile1 = {
                    Jahr: 'DB2000B900',
                    Monat: 'DB2000B901',
                    Tag: 'DB2000B902',
                    Stunde: 'DB2000B903',
                    Minute: 'DB2000B904',
                    Sekunde: 'DB2000B905'
                };
                self.aliasNameZeile2 = {
                    Jahr: 'Signal11',
                    Monat: 'Signal12',
                    Tag: 'Signal13',
                    Stunde: 'Signal14',
                    Minute: 'Signal15',
                    Sekunde: 'Signal16'
                };

                //Anfang Funktion erzeugeZeilen() für Zeitscheibe
                self.erzeugeZeilen = function (struktur) {
                    //Funktion für eine Zeile #####################################################
                    var self = this;
                    var Jahr = struktur.Jahr;
                    var Monat = struktur.Monat;
                    var Tag = struktur.Tag;
                    var Stunde = struktur.Stunde;
                    var Minute = struktur.Minute;
                    var Sekunde = struktur.Sekunde;

                    var sollwerte2 = function () {
                        var Jahr2 = struktur.Jahr;
                        var Monat2 = struktur.Monat;
                        var Tag2 = struktur.Tag;
                        var Stunde2 = struktur.Stunde;
                        var Minute2 = struktur.Minute;
                        var Sekunde2 = struktur.Sekunde;
                        return {
                            Jahr: Jahr2,
                            Monat: Monat2,
                            Tag: Tag2,
                            Stunde: Stunde2, //evtl. Btn1
                            Minute: Minute2, //evtl. Btn2
                            Sekunde: Sekunde2
                        };
                    };
                    return function erg() { //closure erzeugen um Instanzwerte zu behalten
                        return {
                            Jahr: Jahr,
                            Monat: Monat,
                            Tag: Tag,
                            Stunde: Stunde, //evtl. Btn1
                            Minute: Minute, //evtl. Btn2
                            Sekunde: Sekunde,
                            sollwerte2: sollwerte2
                        };
                    };

                };
                //Ende erzeugeZeilen ##########################################################################

                //#region Zeilen Erzeugen für Zeitscheibe
                self.zeile1 = self.erzeugeZeilen(self.aliasNameZeile1);
                self.zeile2 = self.erzeugeZeilen(self.aliasNameZeile2);
                //console.log(typeof self.zeile1().Jahr);
                self.ausgabeZeile = ko.observableArray([
                    self.zeile1(),
                    self.zeile2()
                ]);

                self.freigabe = ko.computed(function () {
                    var val = self.connector.getSignal('Local Second').value;
                    var erg = (val() & 1) != 0;
                    return erg;
                }, self);

                //console.log(self.ausgabeZeile()[0].sollwerte2().Jahr());



                return self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));

            },
            compositionComplete: function () {
                var self = this;
                //console.log("Testen geladen");



            },
            //private navBeschriftung = 'Hallo';
            testenFunc: function () {
                var self = this;
                self.myBeschriftung.push('3');
                //self.myBeschriftung().push(new self.myBeschriftung);
                console.info('%cNavigationsbar:' + this.myBeschriftung(), 'background: red;');
            },
            //Screenshot erstellen
            setScreenshot: function () {
                var self = this;

                console.info('%csetScreenshotr:', 'background: lime;');
                // html2canvas(document.getElementById("container1"), {
                //     onrendered: function (canvas) {
                //         var tempcanvas = document.createElement('canvas');
                //         tempcanvas.width = 350;
                //         tempcanvas.height = 350;
                //         var context = tempcanvas.getContext('2d');
                //         context.drawImage(canvas, 112, 0, 288, 200, 0, 0, 350, 350);
                //         var link = document.createElement("a");
                //         link.href = tempcanvas.toDataURL('image/jpg'); //function blocks CORS
                //         link.download = 'screenshot2.jpg';
                //         link.click();
                //     }
                // });

            },
            ausgabe: function () {
                console.log("Ausgabe");
                return Date(2015, 5, 6, 7, 8, 9, 0);
            },
            btnClick: function () {
                var self = this;

                var values = {};
                values["TestDateAndTime"] = [24, 2, 3, 18, 17, 18, 0, 7];
                //self.connector.writeSignals(values);

                console.log("btnClick");
                //var valueToWrite = 
                //self.myDateAndTime.value(12);
                //console.log(self.myDateAndTime());
                alert(ccwParameterFuerRezept1);
            },
            myDialog: function () {
                var self = this;

                console.log("myDialog");

                dialog.show(
                        new okCancelDialog('Ja', 'nein', 'txHeader')
                    )
                    .then(function (dialogResult) {
                        console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen
                        
                    });

            }

        };

        return ctor;
    });