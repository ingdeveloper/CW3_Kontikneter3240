define(['src/services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialog', 'src/viewmodels/cowi/dialoge/cwLogInOut'],
    function (signalsConnector, dialog, okCancelDialog, cwLogInOut) {
        // var dialog = require('plugins/dialog');

        var ctor = function (insertData) {
            var self = this;

            self.connector = new signalsConnector();

            var settings = insertData;

            self.anlage = settings.anlage;
            self.title = settings.title;
            self.auswahlliste = ko.observableArray(insertData.auswahlliste);
            self.kommentarInit = ko.observable(insertData.kommentarInit);
            self.kommentar = ko.observable();
            self.grund = ko.observable();
            self.data = settings.data;
            self.format = settings.format || 0;

            self.logTyp = ko.observable(settings.logTyp);
            self.usid = ko.observable("");

            self.closeText = "";

        };

        ctor.prototype = {
            close: function () {
                var self = this;


                dialog.close(self, self.closeText);
            },
            compositionComplete: function () {
                var self = this;

                dialog.show(
                    new cwLogInOut()
                ).then(function (resp) {
                    if (resp.usnname !== "" || resp.usvname !== "" || resp.usberez !== "" || resp.usid !== "") {
                        console.log("eingeloggt");
                        self.usid(resp.usid);
                    } else {
                        self.close();
                    }
                })

            },
            checkInputs: function () {
                var self = this;
                self.fnAddLogBookEntry();
            },


            fnAddLogBookEntry: function () {
                var self = this;

                var obj = {};
                obj.anlage = self.anlage;
                obj.kommentar = self.kommentar();
                obj.data = self.data;

                var entry = {
                    Body: JSON.stringify(obj),
                    Subject: self.grund(),
                    Format: self.format,
                    CreatedOn: moment().utc().toMSDate(),
                    ID: uuid.v4(),
                    Author: self.usid(),
                    Topic: self.anlage
                };

                console.log(entry);
                self.fnAddLog(entry).then(function (data) {
                    // console.log(data);
                    self.closeText = "ClosedOkay";
                    self.close();
                });


            },
            fnAddLog: function (entry) {
                var self = this;
                var r = $.Deferred();



                var item = self.connector.addLogbookEntry(entry);

                r.resolve(item);  //Ergebnis positiv "success", Rezept ist schon vorhanden
                //r.reject(null);   //Ergebnis negativ "error", Rezept ist nicht vorhanden
                return r.promise();
            },




        };
        return ctor;
    });