define(['plugins/dialog'],
    function (dialog) {
        var dialog = require('plugins/dialog');

        var ctor = function () { //siloNr=Silo-Nummer;
            var self = this;

            self.id = ko.observable(uuid.v4());

            self.user = ko.observable("");
            self.pass = ko.observable("");

            self.isSelectedUser = ko.observable(false);
            self.isSelectedPass = ko.observable(false);

            // //--Timeout auf Focus setzen, weil sonst der Befehl zu früh gesetzt wird, Problem ist Bootstrap
            setTimeout(function () {
                self.isSelectedUser(true); //Focus auf Eingabefeld USER setzen
            }, 400);

        };

        ctor.prototype = {
            close: function (text,obj) {
                var self = this;
                dialog.close(self, text, obj);
            },

            requestLogIn: function () {
                var self = this;

                var obj = {};
                obj.user = self.user();
                obj.pw = self.pass();

                $.ajax({
                    method: "POST",
                    url: window.resolveUrl("/WsCcw/WsCcw.svc/js/ccwGetUserPermissions"),
                    // url: "http://localhost/WsCcw/WsCcw.svc/js/ccwGetUserPermissions",
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        // console.log(data.ccwGetUserPermissionsResult);

                        var val = data.ccwGetUserPermissionsResult.UserValues;
                        if (val.UserId != undefined) {
                            if (val.UserId > 0) {
                                console.log("Angemeldet");
                                self.close("Okay",val);
                            } else {
                                toastr.error("Anmeldedaten nicht korrekt!");
                            }


                        }

                    },
                    error: function () {
                        console.log("Anfrage gescheitert!");
                        toastr.error("Anfrage zum Server gescheitert!");

                    }
                });



                return 0;
                dialog.show(
                    new cwLogInOut()
                ).then(function (resp) {
                    if (resp.usnname !== "" || resp.usvname !== "" || resp.usberez !== "" || resp.usid !== "") {
                        self.userLogged(true);
                        self.userNname(resp.usnname);
                        self.userVname(resp.usvname);
                        self.userBerRez(resp.usberez);
                        self.userID(resp.usid);
                        self.countdown_ccw_user_login(self.minuten(), self.sekunden());
                        var dur = self.minuten() * 60 + self.sekunden();
                        window.userDuration(dur);
                        self.settings.userLogged(self.userLogged());
                        self.settings.userNname(self.userNname());
                        self.settings.userVname(self.userVname());
                        //self.settings.userBerRez(self.userBerRez());
                        self.settings.userID(self.userID());

                        // set up mouse movement
                        // das Event wird nach Ablauf der Zeit gelöscht, siehe Timer oben im Quelltext
                        $(window).on('mousedown', function (e) {
                            if (self.userLogged() === true) self.countdown_ccw_user_login(self.minuten(), self.sekunden());
                            //console.log("mousemove");
                        });
                    }
                })


            },

        };
        return ctor;
    });