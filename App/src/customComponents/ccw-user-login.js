// User-Login in die Rezept-Datenbank Cowie
// User-Anmeldung (Rezept-Datenbank) im Header-Bereich: Login-Fenster öffnet sich und über die window-Variablen kommen die Benutzerdaten zurück und werden in die shell-Variablen gespeichert. Mit diesen Variablen kann im Projekt weiter gearbeitet werden -->
// @minuten/sekunden=Vorgabe Zeit; @userLogged/userNname/userVname/userID=KO-Variablen in der shell.ts; @height=Höhe des Buttons; @width=Breite des Buttons; @fontSize1=Schriftgröße Button; @fontSize2=Schriftgröße Zeitanzeige

// Beispiel für HTML: <ccw-user-login params="minuten: 0, sekunden: 60, userLogged: window.userLogged, userNname: window.userNname, userVname: window.userVname, userID: window.userID, height: '29px', width: '100%', fontSize2: 'x-small'"> </ccw-user-login>

// Variablen in shell.ts:

// interface Window {
//     ....
//      userLogged: KnockoutObservable<boolean>;
//      userNname: KnockoutObservable<string>;
//      userVname: KnockoutObservable<string>;
//      userID: KnockoutObservable<number>;
//      userBerechtigungRezept: KnockoutObservable<number>;
//      userDuration: KnockoutObservable<number>;
//      userTimerCountdown: any;
//      userTimerId: number;
// }

// window.userLogged = ko.observable(false);
// window.userNname = ko.observable("");
// window.userVname = ko.observable("");
// window.userID = ko.observable(0);
// window.userBerechtigungRezept = ko.observable(0);
// window.userDuration = ko.observable(0);
// window.userTimerId = 0;
// window.userTimerCountdown = function () {
//             clearInterval(window.userTimerId);
//             window.userTimerId = setInterval(function () {
//                 // console.log(window.userDuration());
//                 window.userDuration(window.userDuration() - 1);
//             }, 1000);
// };

// Verknüpfung in Javascript:
// die Observable-Funktion übergeben, damit der Button mit "enable" funktioniert
// self.bedienfreigabe = window.userLogged;

define(['plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialogKompoCcwUserLogin'],
    function (dialog, cwDialogKompoCcwUserLogin) {

        var ccwUserLogin = function (params) {
            var self = this;

            self.settings = params;
            self.minuten = ko.unwrap(self.settings.minuten) !== undefined ? ko.observable(ko.unwrap(self.settings.minuten)) : ko.observable(1);
            self.sekunden = ko.unwrap(self.settings.sekunden) !== undefined ? ko.observable(ko.unwrap(self.settings.sekunden)) : ko.observable(0);
            self.height = ko.unwrap(self.settings.height) !== undefined ? ko.observable(ko.unwrap(self.settings.height)) : ko.observable('29px');
            self.width = ko.unwrap(self.settings.width) !== undefined ? ko.observable(ko.unwrap(self.settings.width)) : ko.observable('100%');
            self.fontSize1 = ko.unwrap(self.settings.fontSize1) !== undefined ? ko.observable(ko.unwrap(self.settings.fontSize1)) : ko.observable('inherit');
            self.fontSize2 = ko.unwrap(self.settings.fontSize2) !== undefined ? ko.observable(ko.unwrap(self.settings.fontSize2)) : ko.observable('x-small');
            // ########################################################################################################
            // ########### User-Level ermitteln #######################################################################
            // ########### in HTML-Seite mit userFreigabe() ansprechen ################################################
            // ########################################################################################################
            self.userFreigabe = ko.computed(function () {
                console.log("Anmelde-Level=" + window.UserLevel() >= 0);
                return window.UserLevel() >= 0; //UserLevel wird in shell.ts gesetzt; Ergebnisse -1..3  -1=nicht angemeldet
            }, self);

            self.user = ko.observable("");
            self.pass = ko.observable("");


            self.userLogged = window.userLogged;
            self.userNname = window.userNname;
            self.userVname = window.userVname;
            self.userBerRez = ko.observable(0);
            self.userID = window.userID;
            self.userDuration = window.userDuration;

            self.countdown_ccwuserlogin = ko.observable();

            console.log("%cUser-Duration=", "background:yellow", self.userDuration());

            window.userDuration.subscribe(function (newValue) {
                // console.log("%cUser-Duration2=", "background:yellow", newValue);
                var min = Math.floor(newValue / 60);
                var sek = newValue % 60;
                self.countdown_ccwuserlogin(numeral(min).format("0") + ":" + numeral(sek).format("00"));//.css("background-color", "lime");

                if (newValue <= 0) {
                    clearInterval(window.userTimerId);
                    self.userLogged(false);
                    self.userNname("");
                    self.userVname("");
                    self.userBerRez("");
                    self.userID(0);

                    window.userLogged(false);
                    window.userNname("");
                    window.userVname("");
                    window.userID(0);

                    $(window).off('mousedown'); //wenn Zeit abgelaufen, dann das Ereignis löschen

                }
            });

            self.isSelectedUser = ko.observable(false);
            self.isSelectedPass = ko.observable(false);




        };

        // Seite wird verlassen und Komponente zerstört
        ccwUserLogin.prototype.dispose = function () {
            var self = this;
            return;
        };

        ccwUserLogin.prototype.openDialogLogInOut = function () {
            var self = this;
            dialog.show(
                new cwDialogKompoCcwUserLogin()
            ).then(function (text, obj) {
                console.log(text, obj);
                if (text == "Okay") {
                    if (obj.UserId > 0) {
                        self.userLogged(true);
                        self.userNname(obj.Name);
                        self.userVname(obj.Vorname);
                        self.userBerRez(obj.Berechtigung_Rezept);
                        self.userID(obj.UserId);

                        var dur = self.minuten() * 60 + self.sekunden();
                        window.userDuration(dur);
                        window.userLogged(true);
                        window.userNname(obj.Name);
                        window.userVname(obj.Vorname);
                        window.userID(obj.UserId);
                        window.userBerechtigungRezept(obj.Berechtigung_Rezept);

                        window.userTimerCountdown();
                        // set up mouse movement
                        // das Event wird nach Ablauf der Zeit gelöscht, siehe Timer oben im Quelltext
                        $(window).on('mousedown', function (e) {
                            if (window.userLogged() === true) {
                                var dur = self.minuten() * 60 + self.sekunden();
                                window.userDuration(dur);
                            }
                            //console.log("mousemove");
                        });
                    }
                }
            })


        };

   

        ccwUserLogin.prototype.LogOut = function () {
            var self = this;
            clearInterval(window.userTimerId);
            self.userLogged(false);
            self.userNname("");
            self.userVname("");
            self.userBerRez("");
            self.userID(0);

            window.userLogged(false);
            window.userNname("");
            window.userVname("");
            window.userID(0);

            $(window).off('mousedown'); //wenn Zeit abgelaufen, dann das Ereignis löschen
        };

        ccwUserLogin.prototype.DialogClose1 = function () {
            var self = this;
            self.user("");
            self.pass("");
           
        };

        return ccwUserLogin;
    });