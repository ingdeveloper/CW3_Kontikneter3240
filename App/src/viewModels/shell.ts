import system = require("durandal/system");
import router = require("plugins/router");
import ViewModelBase = require("./viewModelBase");
import signalsConnector = require("../services/connector");
import usersService = require("../../src/services/usersService");
import { ClientInfo } from "../viewModels/cowi/services/getClientInfo";
import CcwContextmenu = require("./cowi/services/ccw-contextmenu");
import { value } from "numeral";
//var cursorPositionAnzeigeEin = ko.observable(false);
declare global {
    interface Window {
        buildDate: any;
        UserLevel: KnockoutObservable < number > ;
        bereich: KnockoutObservable < number > ;
        UserLevel1: KnockoutObservable < boolean > ;
        UserLevel2: KnockoutObservable < boolean > ;
        UserLevel3: KnockoutObservable < boolean > ;
        UserLevel4: KnockoutObservable < boolean > ;
        UserLevel5: KnockoutObservable < boolean > ;
        routerConfig: KnockoutObservable < number > ;
    }

}

class Shell extends ViewModelBase {
    private router = router;
    private navbarClass = ko.observable("cw-navbar-bottom"); //"navbar-left" for left sidebar navigation is also implemented
    private virtuelleTastaturStyle = ko.observable("black");
    private watchdog = ko.observable(1);

    private connector = new signalsConnector();
    private timerID;
    private us;
    private clientZeit; //virtuelle Variable 
    private appStartZeit; //zwischen gespeicherte Zeit
    private timerIDVergleich;
    private timerIDNeustart;
    private cursorPositionAnzeigeEin = ko.observable(false);
    private showBufferTabelleToggle = ko.observable(false);
    private timerIDStoerung;
    private timerIDStoerungInterval;
    private hoeheAlarmViewerToggle = false;
    private cssBtnToggleAlarmViewerHoehe = ko.observable("wf-chevron-down");
    private alarmViewerHeaderVisibility = ko.observable(false);
    private toogleFullscreen = false;

    private RezNrValue = ko.observable(0);
    private PaNrValue = ko.observable(0);
    
    public activate() {
        this.checkLocalAppSettings();
        this.info("Application loaded!");

        this.GetVirtuelleTastatur();

        //User automatisch anmelden
        this.us = this.connector.getSignal('PC1_User').value;
        this.timerID = setTimeout(() => this.GetLocalUser(), 100);

        //Variable zum vergleichen, falls ungleich, dann ein Reload der Seite durchführen
        this.clientZeit = this.connector.getSignal('MyResetVar').value;

        if (localStorage.getItem("cursorPositionDefaultEin") === "true") { //Ausgabe toggeln
            this.cursorPositionAnzeigeEin(true);
        } else {
            this.cursorPositionAnzeigeEin(false);
        }

        this.getAnlagenStoerungVerzoegert();

        // Meldungsfenster TOASTR einstellen
        toastr.options.toastClass = 'toast';
        toastr.options.positionClass = 'toast-top-center'; //'toast-bottom-right';

        /*********************************************************************** */

        window.UserLevel = ko.observable(-1);
        window.UserLevel1 = ko.observable(false);
        window.UserLevel2 = ko.observable(false);
        window.UserLevel3 = ko.observable(false);
        window.UserLevel4 = ko.observable(false);
        window.UserLevel5 = ko.observable(false);
        window.routerConfig = ko.observable(0);

        window.UserLevel.subscribe(() => {
            this.configRouter(window.routerConfig, window.UserLevel);
        });

        window.routerConfig.subscribe(() => {
            this.configRouter(window.routerConfig, window.UserLevel);
        });

        this.configRouter(window.routerConfig, window.UserLevel);

        CcwContextmenu.AddIdent({
            wfServername: "wf-broet3240" + "\\I4SCADA",
            wfDbName: "broet3240", // anpassen..
            werk: 2,
            halle: 3,
            etage: 2,
            linie: 4,
            maschine: 11,
            anlagenNr: 7324002,
            abteiNr: 250
        });
        CcwContextmenu.AddSelector(
            [
                'wf-value',
                'wf-value-display',
                'wf-meter',
                'wf-gauge-1',
                'wf-arc',
                'wf-bargraph',
                'wf-state-indicator',
                'wf-sensor',
                'wf-state-text',
                'wf-watchdog',
                'wf-signal-information',
                'wf-signal-information-popover',
                'wf-button',
                'wf-toggle-button',
                'wf-radio-buttons',
                'wf-switch',
                'wf-input',
                'wf-slider',
                'wf-date-time-picker',
                'wf-switch-3-states',
                'ccw-wf-input-tastatur',
                'ccw-wf-value',
                'ccw-wf-date-time-picker-s7dt',
                'ccw-wf-date-time-picker-s7datetime',
                'ccw-wf-date-time-picker-s7time',
                'ccw-wf-motor0',
                'ccw-wf-motor', // ToDo - Testen
                'ccw-wf-motor0a',
                'ccw-wf-fan0',
                'ccw-wf-pump0',
                'ccw-wf-ventil2',
                'ccw-wf-weiche0',
                'ccw-wf-shape',
                'ccw-wf-on-off-switch',
                'ccw-wf-bargraph',
                'ccw-bargraph',
                'ccw-wf-action',
                'ccw-load-svg',
                'ccw-wf-fan2',
                'ccw-wf-input-tastatur-2',
                'ccw-wf-ventil2b',
                'ccw-wf-chart-1',
                'ccw-wf-motor3',
                '.ccw_context'
            ]
            
        );

        this.RezNrValue = this.connector.getSignal("VMI3240DB220DBD0").value;
        this.PaNrValue = this.connector.getSignal("VMI3240DB1DBD80").value;  //PA-Nr von der Linie

        return router.activate();
    }

    //######### Alles was bei dem Lifecycle ATTACHED durchgeführt werden soll. Variablen haben noch keinen Wert ######
    public attached() {
        console.log('%cSHELL Attached!', 'background:lime');
    }

    //######### Alles was bei dem Lifecycle COMPOSITIONCOMPLETE durchgeführt werden soll. Variablen haben noch keinen Wert ######
    public compositionComplete() {
        console.log('%cShell: Anwendung komplett geladen!', 'background:lime');
        //Interval starten, um den Vergleich ständig durch führen zu können, alle 30 Sekunden
        this.timerIDVergleich = setInterval(() => this.vergleicheFuerNeustart(), 30000);

        //Ereignis MouseMove abfangen und X-Y-Koordinaten anzeigen
        window.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
        //Ereignis MouseClick abfangen
        window.addEventListener('click', this.mouseClickEvent.bind(this));

        //console.log(router);
        //console.log(router.navigationModel());

        //router.navigationModel()[0].title = "tt";
        $('#buildDate2').html(moment(window.buildDate).format('DD-MM-YYYY  HH:mm')); //nur für Vorlage-App, um das Datum oben in groß anzuzeigen


    }

    public setNavbarType(typeClass: string) {
        if (typeClass) {
            this.navbarClass(typeClass);
            $.cookie("wf_navbarClass", typeClass);
        } else {
            this.navbarClass(null);
            $.cookie("wf_navbarClass", null);
        }
    }

    // Check if navigation bar class is stored in cookies and use the class it is present
    public checkLocalAppSettings() {

        var storedClassName = $.cookie("wf_navbarClass");

        if (!storedClassName) {
            $.cookie("wf_navbarClass", this.navbarClass(), {
                expires: 7
            });

        } else {
            this.navbarClass(storedClassName);
        }
    }

    public navBeschr;



    public histback() {
        router.navigateBack();
    };


    public formdef2() {
        var self = this;
        self.navBeschr = ko.observableArray();
    };

    public SetVirtuelleTastatur() {

        console.info('%cLocal-Storage: Virtuelle Tastatur setzen:', 'background: lime;');
        if (localStorage.getItem("VirtuelleTastaturEIN") === "true") { //Ausgabe toggeln
            localStorage.setItem("VirtuelleTastaturEIN", "false");
            this.virtuelleTastaturStyle("black");
            toastr.success('Virtuelle Tastatur ist ausgeschaltet!');
        } else {
            localStorage.setItem("VirtuelleTastaturEIN", "true");
            this.virtuelleTastaturStyle("limegreen");
            toastr.success('Virtuelle Tastatur ist eingeschaltet!', 'Tastatur');
        }
    };

    public GetVirtuelleTastatur() {
        if (localStorage.getItem("VirtuelleTastaturEIN") === "true") { //Ausgabe toggeln
            this.virtuelleTastaturStyle("limegreen");
            return true;
        } else {
            this.virtuelleTastaturStyle("black");
            return false;
        }

    };

    public SetFullscreen() {

        console.info('%cFullscreen setzen:', 'background: lime;');
        //var element = document.getElementById("inhalt");
        //var f = window.fullScreenApi.isFullScreen();
        //console.info(window.fullScreenApi);

        console.log(window.innerHeight);
    };


    public GetLocalUserVerzoegert() {
        this.timerID = setTimeout(() => this.GetLocalUser, 5000);
        //this.timerID = setTimeout(function () { alert("Hello") }, 10000);
    };

    //---- Funktion identifiziert diesen Rechner als schreibberechtigter Client-Rechner ----
    public async GetLocalUser() {
        //var us = this.connector.getSignal('PC1_User').value;
        //console.info(this.us());
        // var anmelden = false;
        // var localStorageAbfragen = true;  //wenn TRUE, dann wird LocalStorage vom Browser abgefragt.
        // if (localStorageAbfragen) {
        //     if (localStorage.getItem("UserAutoAnmelden") === "true") {  //Ausgabe toggeln
        //         anmelden = true;
        //     }
        // } else {
        //     if (this.us() == "PC-IP") {  //steht in der WF-Variablen der String 'PC-IP'
        //         anmelden = true;
        //         console.info('%cPC-IP auf WF-DB lesen:' + this.us(), 'background: yellow;');
        //     }
        //     //console.info('%cLocal-Storage: User lesen2:', 'background: lime;');
        // }

        // if (anmelden == true) {
        //     this.connector.login('user', 'technik', false);
        //     console.info('%cUser angemeldet', 'background: yellow;');
        // } else {
        //     console.info('%cUser Anmeldung nicht möglich.', 'background: yellow;');
        // }
        // clearTimeout(this.timerID);  //Timer-Instanz wieder löschen
        // try {
        //     const name = await ClientInfo.Name();
        //     // user anhand von Clientnamen automatisch anmelden
        //     await this.connector.login(name.toLowerCase(), "cowie\\" + name.toLowerCase(), false);
        //     // const userDetails = await usersService.getCurrentUserDetails();
        //     // console.info(`%c Username = ${userDetails.Name}
        //     //             UserLevel = ${userDetails.UserLevel}`, "background: yellow;");
        // } catch (error) {
        //     // tslint:disable-next-line:no-console
        //     console.log(`%c${error}`, "background: pink;");
        // }


        // Änderung der User-Anmeldung überwachen
        this.connector.currentLoggedInUser.subscribe(() => {
            usersService.getCurrentUserDetails().then((userDetails) => {
                //window.Eugen = userDetails ? userDetails.UserLevel : -1;
                // window.UserLevel(userDetails ? userDetails.UserLevel : -1);
                window.UserLevel(userDetails ? userDetails.UserLevel : 0);
                // window.userLevel = 1;
                window.UserLevel1(window.UserLevel() >= 1 ? true : false);
                window.UserLevel2(window.UserLevel() >= 2 ? true : false);
                window.UserLevel3(window.UserLevel() >= 3 ? true : false);
                window.UserLevel4(window.UserLevel() >= 4 ? true : false);
                window.UserLevel5(window.UserLevel() >= 5 ? true : false);
            });
        });

        // Clientname ermitteln
        try {
            const name = await ClientInfo.Name();
            // user anhand von Clientnamen automatisch anmelden
            await this.connector.login(name.toLowerCase(), "cowie\\" + name.toLowerCase(), false);
            console.log('%cUser angemeldet mit Level ' + window.UserLevel(), 'background: green;');

        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(`%c${error}`, "background: pink;");
        }

    };

    //Eine WF-Variable (virtuell) wird verglichen und wenn diese ungleich ist, dann wird ein Reload der Browser-Seite durchgeführt
    public vergleicheFuerNeustart() {
        //var anmelden = false;
        //console.log('%c---------------------', 'background:lime');
        //console.log(this.appStartZeit);
        //console.log('%cappStartZeit=' + this.appStartZeit + ' | clientZeit=' + this.clientZeit(), 'background:yellow'); 

        if (this.appStartZeit == undefined) {
            this.appStartZeit = this.clientZeit(); //initialisieren
        }

        if ((this.appStartZeit !== this.clientZeit()) && (this.clientZeit().length > 6)) { //Der Zeitstempel in der WF-DB sollte eingetragen sein mit mindestens 6 Zeichen
            toastr.error('Neustart der Seite wegen Neugestaltung der Seite!');
            console.log('%c---------------------', 'background:lime');
            console.log('%cappStartZeit=' + this.appStartZeit + ' | clientZeit=' + this.clientZeit(), 'background:yellow');
            this.appStartZeit = this.clientZeit();
            //window.document.location.reload(true);      //Browser-Seite vom Server neu laden 
            this.timerIDNeustart = setTimeout(() => this.neustart(), 4000);
        }
    };
    public neustart() {
        clearInterval(this.timerIDVergleich); //Timer löschen
        clearTimeout(this.timerIDNeustart); //Timer löschen

        window.document.location.reload(true); //Browser-Seite vom Server neu laden 
    };

    // wenn Ereignis MouseMove, dann wird eine DIV-Box angezeigt mit den X/Y-Koordinaten
    public mouseMoveEvent(e: MouseEvent) {
        //console.log(e);
        //console.log('%c--------- ' + e.view.parent.innerWidth, 'background:lime');
        var elem = document.getElementById('positionAnzeige');
        var xelem = document.getElementById('positionAnzeigeX');
        var yelem = document.getElementById('positionAnzeigeY');

        var x = e.pageX,
            y = e.pageY; //e.clientY;

        var xoff = 15; //offset
        var yoff = 15; //offset

        //console.log(cursorPositionAnzeigeEin);
        if (this.cursorPositionAnzeigeEin() == true) {

            if (x > (e.view.parent.innerWidth - 120)) xoff = -100;
            if (y > (e.view.parent.innerHeight - 20 - 50)) yoff = -50;

            elem.style.top = (y + yoff) + 'px';
            elem.style.left = (x + xoff) + 'px';
            elem.style.visibility = 'visible';

            // xelem.innerHTML = x.toString() + ' (' + e.layerX + ')';
            // yelem.innerHTML = y.toString() + ' (' + e.layerY + ')';

            //console.log(e);

            //var elemHtml = e.srcElement;
            //console.log(elemHtml.clientHeight);
            //console.log(e.layerX);

        } else {
            elem.style.visibility = 'hidden';
        }


    };

    public SetCursorPositionAnzeige() {
        if (this.cursorPositionAnzeigeEin() == true) { //Ausgabe toggeln
            this.cursorPositionAnzeigeEin(false);
            //toastr.success('Corsor Position Anzeige ist ausgeschaltet!', 'Cursor');
        } else {
            this.cursorPositionAnzeigeEin(true);
            //toastr.success('Corsor Position Anzeige ist eingeschaltet!', 'Cursor');
        }
        //console.log('%cLocal-Storage: Position Anzeige des Cursors setzen:' + this.cursorPositionAnzeigeEin(), 'background: lime');
    };

    // wenn Ereignis MouseMove, dann wird eine DIV-Box angezeigt mit den X/Y-Koordinaten
    public mouseClickEvent(e: MouseEvent) {
        var x = e.clientX,
            y = e.clientY,
            screenX = e.screenX,
            screenY = e.screenY;

        //Abfrage, ob Screen ermittelt worden ist. Teilweise (zB Auswahlliste "DropDown") reagiert etwas anders. Es wird x und y als 0 angezeigt.
        if ((screenX > 0) && (screenY > 0)) {
            //nur oben Links in der Ecke reagieren
            if ((x < 10) && (y < 10)) {
                console.log('%cCLICK oben Links ', 'background:lime');
                //console.log(e);
                this.SetCursorPositionAnzeige();
            }
        }
    };

    public showBufferTabelle() {
        //console.log("%cshowBufferTabelle in shell.ts", "background: lime");
        if (this.showBufferTabelleToggle() == true) { //Ausgabe toggeln
            this.showBufferTabelleToggle(false);
            //toastr.success('Corsor Position Anzeige ist ausgeschaltet!', 'Cursor');
        } else {
            this.showBufferTabelleToggle(true);
            //toastr.success('Corsor Position Anzeige ist eingeschaltet!', 'Cursor');
        }
    };


    public getAnlagenStoerungVerzoegert() {
        var self = this;
        this.timerIDStoerung = setTimeout(() => {
            this.getAnlagenStoerung();
            this.getAnlagenStoerungInterval();
        }, 5000);
    };

    public getAnlagenStoerungInterval() {
        this.timerIDStoerungInterval = setInterval(() => this.getAnlagenStoerung(), 60000); //alle 60 Sekunden
    };
    public getAnlagenStoerung() {
        var obj = {
            url: 'https://app-visu-02-p/WsCcwBde/CcwBdeService.svc/js/GetFaultCount?ressnr=7324120',
            parameter: 'n.c.'
        };
        $.ajax({
            method: "POST",
            url: window.resolveUrl("/WsCcw/WsCcw.svc/js/ccwProxy"),
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.ccwProxyResult.ResponseData.length > 0) {
                    console.log(data.ccwProxyResult.ResponseData);
                    var erg = JSON.parse(data.ccwProxyResult.ResponseData);
                    console.log(erg);
                    var count = erg.GetFaultCountResult.Data;
    
                    $("#btnStoerungenAnz").html(count);
                    if (parseInt(count) > 0) {
                        // $("#btnStoerungen").addClass("ccw-flash-bg");
                        $("#btnStoerungen").removeClass("btn-default");
                        $("#btnStoerungen").addClass("btn-success");
    
                        //NEU von amueller: Blinken für den Button erstellen
                        //AddEntry erstellt ein Attribut vom Namen "blinker"
                        //console.log($("#btnStoerungen").attr("blinker"));
                        // var uu = CcwBlinker.AddEntry($("#btnStoerungen").attr("blinker")); //wenn in HTML das Attribut "data-blinker" vorhanden ist, dann wird der Wert zurückgegeben, ansonsten undefined
                        // console.log(uu);
                        // $("#btnStoerungen").attr("blinker", uu);
    
    
    
                    } else {
                        // $("#btnStoerungen").removeClass("ccw-flash-bg");
                        $("#btnStoerungen").addClass("btn-default");
                        $("#btnStoerungen").removeClass("btn-success");
    
                        // NEU von amueller
                        //CcwBlinker.RemoveEntry($("#btnStoerungen").attr("blinker"));
                    }
    
                } else {
                    console.log("Keine Daten vorhanden");
                }
            },
            error: function () {
                $("#btnStoerungenAnz").html("?"); //Im Fehlerfall ausgeben
            }
        });
    
    };
    public goToStoerungen() {
        //router.navigate("ergStoerungen");
        var editUrl =
            "https://app-visu-02-p/ccwfaultcommit/index.html?";
        var resid = 7324120;
        var panr = this.PaNrValue();
        var reznr = this.RezNrValue();
        var option =
            "width=" +
            (screen.availWidth - 200) +
            ",height=" +
            (screen.availHeight - 200) +
            ",top=100" +
            ",left=50" +
    
            ",resizeable=yes,scrollable=yes";
        var Url = editUrl + "resid=" + resid + "&panr=" + panr + "&reznr=" + reznr;
        window.open(Url, "_blank", option);
    }

    public goToMTInfo() {
        var editUrl = "http://mt-info/info.htm";
        var Url = editUrl;
        var option = 'width=' + (screen.availWidth - 100) + ',height=' + (screen.availHeight - 100) + ',resizeable=yes,scrollable=yes';
        window.open(Url, "_blank", option);
    };

    public toggleAlarmViewerHoehe() {
        var hoehe = 48; //normale Höhe
        if (this.hoeheAlarmViewerToggle == false) {
            this.hoeheAlarmViewerToggle = true;
            hoehe = 160;
            this.cssBtnToggleAlarmViewerHoehe("wf-chevron-up"); //Button Icon
            this.alarmViewerHeaderVisibility(true); //funktioniert nicht 1.03.2018 amueller
        } else {
            this.hoeheAlarmViewerToggle = false;
            this.cssBtnToggleAlarmViewerHoehe("wf-chevron-down"); //Button Icon
            this.alarmViewerHeaderVisibility(false);
        }
        //$(".wf-alarm-viewer").css("height", hoehe+"px");
        //$(".wf-alarm-viewer .p-a-md").css("height", hoehe + "px");
        $("#idAlarmViewerImHeader .wf-alarm-viewer").animate({
            "height": hoehe + "px"
        }, "slow");
        $("#idAlarmViewerImHeader .wf-alarm-viewer .p-a-md").animate({
            "height": hoehe + "px"
        }, "slow"); //bei App-Version 47
        $("#idAlarmViewerImHeader .wf-alarm-viewer .p-x-md").animate({
            "height": hoehe + "px"
        }, "slow"); //bei App-Version 67
        //$(".wf-alarm-viewer").css('z-index', 2);

    };
    public seiteDrucken() {
        (window as any).print(); //Verwenden Sie die Zeile, wenn Sie kein Typescript 2.8.2 verwenden.
        //self.close();
    };

    public setFuellscreen() {
        console.log("setFullscreen()");
        // console.log($.fullscreen.isNativelySupported() ? 'supports' : 'doesn\'t support');
        // if ($.fullscreen._fullScreenElement == null) {
        //     console.log("Fullscreen ON");
        //         console.log("setFullscreen() -- Befehl");
        //         $('#main-wrapper').fullscreen();
        // } else {
        //     // exit fullscreen
        //     console.log("Fullscreen OFF");
        //     $.fullscreen.exit();
        // }

    };
    public windowClose() {
        //alert("Close");
        window.close();
    };
    public configRouter(configNr, userLevel) {
        console.log("%cRouterkonfiguration", "background:violet");
        console.log("%cConfig Nr.: " + configNr(), "background:violet");
        console.log("%cUserLevel: " + userLevel(), "background:violet");

        var routerConfig;
        var aktHash = window.location.hash;
        var newHash = "#noPermission";
        routerConfig = [
            { route: "", title: "Start", moduleId: "src/viewModels/home", nav: true, settings: { iconClass: "fa fa-home ccw-color-green" } },
            // { route: "charts2", title: "Charts Widgets for historical Data", moduleId: "src/viewModels/examples/examplesCharts", nav: false, settings: { iconClass: "" } },
            // { route: "elemente", title: "Elemente", moduleId: "src/viewModels/cowi/elemente", nav: false, settings: {} },
            // { route: "myUebersicht", title: "Übersicht", moduleId: "src/viewModels/cowi/myUebersicht_3240", nav: true, settings: { iconClass: "" } },
            // { route: "myRezept", title: "Aktuelles Rezept", moduleId: "src/viewModels/cowi/myRezept", nav: true, settings: { iconClass: "" } },
            // { route: "myNGS", title: "Gärschrank 3240", moduleId: "src/viewModels/cowi/myNGS", nav: true, settings: { iconClass: "" } },
            // { route: "myAntriebe", title: "Antriebe", moduleId: "src/viewModels/cowi/myAntriebe", nav: true, settings: { iconClass: "" } },
            // { route: "myWartung", title: "Wartung", moduleId: "src/viewModels/cowi/wartung/myWartung", nav: true, settings: { iconClass: "" } },
            // { route: "charts(/:id)", title: "Trend", moduleId: "src/viewModels/cowi/charts", nav: true, hash: '#charts',settings: { iconClass: "wf wf-analysis ccw-color-magenta" } },
            { route: "rezepturVMI", title: "Rezepte Kontikneter", moduleId: "src/viewModels/cowi/rezeptur_VMI", nav: false, settings: { iconClass: "wf wf-logtag-1 ccw-color-light-blue" } },
            { route: "rezepturLinie", title: "Rezepte Linie", moduleId: "src/viewModels/cowi/rezeptur_Linie", nav: false, settings: { iconClass: "wf wf-logtag-1 ccw-color-light-blue" } },
            // { route: "meldeanzeige", title: "Meldungen", moduleId: "src/viewModels/cowi/meldungen/meldeanzeige", nav: true, settings: { iconClass: "wf-lg wf-alarm ccw-color-yellow" } },
            // { route: "historischeMeldeanzeige", title: "Historische Meldungen", moduleId: "src/viewModels/cowi/meldungen/historischeMeldeanzeige", nav: false, settings: { iconClass: "" } },            
            // { route: "bindinghandler", title: "bindings", moduleId: "src/viewModels/cowi/bindingHandler", nav: false, settings: { iconClass: "wf wf-attach" } },
        ];
        router.reset();
        router
            .map(routerConfig)
            .buildNavigationModel()
            .mapUnknownRoutes("src/viewModels/notfound", "notfound");

        // dynamischer Seitenwechsel
        if (userLevel() < 3 && aktHash == "#userManager") {
            window.location.hash = newHash;
        }
        // ----------

        // Zuweisung Anlagenname zur Routerkonfiguration
        switch (configNr()) {
            case 0:
                $("#anlagenname").text("Kontikneter 3240");
                break;

            case 1:
                $("#anlagenname").text("Kontikneter 3240");
                break;

            case 2:
                $("#anlagenname").text("Kontikneter 3240");
                break;

            case 3:
                $("#anlagenname").text("Kontikneter 3240");
                break;

            default:
                $("#anlagenname").text("Kontikneter 3240");
                break;
        }
        // ----------
    }
}

export = Shell;