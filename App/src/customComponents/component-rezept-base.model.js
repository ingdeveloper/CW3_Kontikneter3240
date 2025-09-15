var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "knockout", "plugins/dialog", "../services/logger", "../services/usersService", "../viewModels/cowi/services/tabBuilder", "../viewModels/cowi/services/rezLog", "../viewModels/cowi/services/localStorLogWriter", "../viewModels/cowi/services/rezValues", "../viewModels/cowi/dialoge/cwRezDlg", "../viewModels/cowi/dialoge/cwRezDlgSave", "../components/component-base.model", "../viewModels/cowi/dialoge/cwRezDlgLogInOut", "../viewModels/cowi/dialoge/cwRezDlgAblieferzone", "../viewModels/cowi/dialoge/cwRezDlgAblZoneOfen", "../viewModels/cowi/dialoge/cwRezDlgPersonal", "../viewModels/cowi/services/rezService", "../viewModels/cowi/rezepturEnums", "../viewModels/cowi/services/getClientInfo", "../viewModels/cowi/services/rezUtils", "../viewModels/cowi/services/wsWatchdog", "../viewModels/cowi/dialoge/cwRezDlgLogs", "../viewModels/cowi/dialoge/cwRezDlgSetup", "../viewModels/cowi/services/rezSpsKonfigCache", "../viewModels/cowi/services/rezDlgKonfigCache"], function (require, exports, ko, dialog, Logger, UserService, Tab, Log, LocalStorLogWriter, RezValues, MsgBox, SaveDialog, ComponentBaseModel, LoginDialog, DlgAblieferZone, DlgAblZoneOfen, PersonalDialog, rezService_1, rezepturEnums_1, getClientInfo_1, rezUtils_1, WsWatchdog, cwRezDlgLogs, cwRezDlgSetup, rezSpsKonfigCache_1, rezDlgKonfigCache_1) {
    "use strict";
    ko = __importStar(ko);
    rezUtils_1 = __importDefault(rezUtils_1);
    var RezDlg = /** @class */ (function (_super) {
        __extends(RezDlg, _super);
        function RezDlg(params) {
            var _this = _super.call(this, params) || this;
            // die Vers.Nr. wird mit dem Gulp-Task 'update-version' aus der 'package.json' entnommen
            _this.kompVersion = "4.1.4";
            _this.logTyp = rezepturEnums_1.LogType.Debug;
            _this.localStorLogWriter = new LocalStorLogWriter();
            // Flag für Debugging
            _this.debugFlag = true;
            /** Anlagennummer */
            _this.anlage = ko.observable();
            /** Zählernummer */
            _this.zaehler = ko.observable();
            // protected remoteIISServer: string = window.document.location.hostname;
            /** aktuell gewählte Rezept aus der Rezeptliste-Tabelle */
            _this.rezInfo = ko.pureComputed(function () {
                var ret;
                if (!isNullOrUndefined(_this.rezVer())) {
                    ret = _this.selectedRecipe.Nr()
                        ? _this.selectedRecipe.Nr() +
                            " V" +
                            _this.selectedRecipe.Vers() +
                            " - " +
                            _this.selectedRecipe.Descrp()
                        : "";
                }
                else {
                    ret = _this.selectedRecipe.Nr()
                        ? _this.selectedRecipe.Nr() + " - " + _this.selectedRecipe.Descrp()
                        : "";
                }
                return ret;
            });
            _this.selectedRecipe = {
                /** ausgewählte RezNr. in der 'Rezept'-Tabelle Rezeptnummer */
                Nr: ko.observable(),
                /** ausgewählte RezVersion. in der 'Rezept'-Tabelle Rezeptnummer */
                Vers: ko.observable(),
                /** ausgewählte Beschrebung in der 'Rezept'-Tabelle Rezeptnummer */
                Descrp: ko.observable(),
            };
            /** ausgewählte in der 'PA-Aufträge'-Tabelle sonstige Infos wie PA-Start, PA-Stop, Planleistung ect. */
            _this.selectedPaData = {
                Status: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle PA-Nummer */
                PaNr: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Rezeptnummer */
                RezNr: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Rezeptbeschreibung */
                Name: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Produktionstyp */
                ProdTyp: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Startzeit des PA-Auftrages */
                Stop: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Stoppzeit des PA-Auftrages */
                Start: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Planleistung */
                Planleistung: ko.observable(),
                /** ausgewählte in der 'PA-Aufträge'-Tabelle Netznummer */
                NetzNr: ko.observable(),
                /** OPUS-Feld (nur als Durchreicher) */
                ActivNr: ko.observable(),
                /** OPUS-Feld (nur als Durchreicher) */
                RespnNr: ko.observable(),
            };
            /** Zeiten, die für Ofenstart und Nachlaufzeit relevant sind */
            _this.ProcessTimingData = {
                /** SPS-Value PA-Start/Stopp in DateTime-Format */
                paStart: ko.observable(null),
                paStartArr: ko.observableArray([]),
                paStop: ko.observable(null),
                paStopArr: ko.observableArray([]),
                /** SPS-Value errechnete Ofenstartzeit in DateTime-Format */
                ofenStartCalc: ko.observable(null),
                /** SPS-Value Sollnachlaufzeit in TimeOfDay-Format */
                sollNachlauf: ko.observable(null),
                /** SPS-Value Istnachlaufzeit in TimeOfDay-Format */
                istNachlauf: ko.observable(null),
            };
            /** aktuelle Rezeptnummer in der SPS */
            _this.rezNr = ko.observable(null);
            /** aktuelle Rezeptversion in der SPS */
            _this.rezVer = ko.observable(null);
            /** aktuelle Rework-Status in der SPS */
            _this.rework = ko.observable(null);
            /** aktuelle PlanLeistung in der SPS */
            _this.planLeistung = ko.observable(null);
            /** aktuelle Gebindeanzahl in der SPS */
            _this.gebindeanzahl = ko.observable(null);
            /** aktueller Faktor in der SPS */
            _this.faktor = ko.observable();
            /** aktueller Pilotlevel in der SPS */
            _this.pilotLevel = ko.observable();
            /** aktuelle Pa-Nummer in der SPS */
            _this.paNr = ko.observable(null);
            /** aktueller Pa-Status Aktiv/Inaktiv in der SPS */
            _this.paAktiv = ko.observable(null);
            /** aktueller Pa-Produktionstyp Aktiv/Inaktiv in der SPS */
            _this.paTyp = ko.observable(null);
            /** Merker Übergang von 'RR' -> 0 um die Nachlaufzeit zu setzen */
            _this.isRRToZero = false;
            /** aktuelle SPS Konfigurationswort in der SPS */
            _this.SpsCfg = ko.observable(null);
            /** aktueller Pa-Netznummer in der SPS */
            _this.netzNr = ko.observable(null);
            /** aktueller Lade/Freigabe-Status in der SPS */
            _this.freigabeLaden = ko.observable();
            /** Verbindungstatus zur WF-Datenbank */
            _this.dbState = ko.observable(false);
            /** Verbindungstatus zur DB2-Datenbank */
            _this.db2State = ko.observable(false);
            /** Verbindungstatus zu wcfSiem */
            _this.ws1State = ko.observable(false);
            _this.commonWsUISatate = ko.pureComputed(function () {
                return {
                    state: _this.ws1State() &&
                        _this.ws2State() &&
                        _this.ws3State() &&
                        _this.ws4State(),
                };
            });
            /** Status-Obj. für UI */
            _this.ws1StateUI = ko.pureComputed(function () {
                var pfad = "..wcfSiem//WcfPlcRezept.svc";
                return {
                    version: (_this.ws1State() ? "Verbunden " + pfad : "k. Verbindung " + pfad) +
                        "\n" +
                        _this.ws1Version(),
                    state: _this.ws1State(),
                };
            });
            _this.ws1Version = ko.observable("");
            /** Verbindungstatus zu WcfRezept */
            _this.ws2State = ko.observable(false);
            /** Status-Obj. für UI */
            _this.ws2StateUI = ko.pureComputed(function () {
                var pfad = "..WcfRezept//WsRezept.svc";
                return {
                    version: (_this.ws2State() ? "Verbunden " + pfad : "k. Verbindung " + pfad) +
                        "\n" +
                        _this.ws2Version(),
                    state: _this.ws2State(),
                };
            });
            _this.ws2Version = ko.observable("");
            /** Verbindungstatus zu WsCwSAP */
            _this.ws3State = ko.observable(false);
            /** Status-Obj. für UI */
            _this.ws3StateUI = ko.pureComputed(function () {
                var pfad = "..WsCwSAP//CwSAPService.svc";
                return {
                    version: (_this.ws3State() ? "Verbunden " + pfad : "k. Verbindung " + pfad) +
                        "\n" +
                        _this.ws3Version(),
                    state: _this.ws3State(),
                };
            });
            _this.ws3Version = ko.observable("");
            /** Verbindungstatus zu WsCcwBde */
            _this.ws4State = ko.observable(false);
            /** Status-Obj. für UI */
            _this.ws4StateUI = ko.pureComputed(function () {
                var pfad = "..WsCcwBde//CcwBdeService.svc";
                return {
                    version: (_this.ws4State() ? "Verbunden " + pfad : "k. Verbindung " + pfad) +
                        "\n" +
                        _this.ws4Version(),
                    state: _this.ws4State(),
                };
            });
            _this.ws4Version = ko.observable("");
            /** Status Benutzerrechte */
            _this.userState = ko.observable(false);
            /** Status Funktionsausführung */
            _this.fnExecutionTime = ko.observable(false);
            /** Status Laden beim Laden von PA-Liste */
            _this.paListStateBusy = ko.observable(false);
            /** Status Timeout beim Laden von PA-Liste */
            _this.paListStateTimeout = ko.observable(false);
            /** Status PA-Liste */
            _this.paListStateConnect = ko.pureComputed(function () {
                return {
                    text: _this.paListStateTimeout()
                        ? "Zeitüberschreitung beim Verbinden mit Webservice"
                        : "Lade die PA-Aufträge",
                    busy: _this.paListStateBusy(),
                    timeout: _this.paListStateTimeout(),
                };
            });
            /** bei Änderung des PA-Status in SPS die PA-Liste updaten */
            _this._q = ko
                .pureComputed(function () {
                var pa = _this.paNr();
                var aktiv = _this.paAktiv();
                var typ = _this.paTyp();
                // Überprüfe, ob alle Variablen gültige Werte haben
                if ((pa !== null && pa !== undefined && pa !== "n/a") ||
                    (aktiv !== null && aktiv !== undefined && aktiv !== "n/a") ||
                    (typ !== null && typ !== undefined && typ !== "n/a")) {
                    console.debug("PA-Änderung wurde registriert", "[" + moment().format("D.M.YYYY, HH:mm:ss.SSS") + "]", "- PaNr.:", pa, "; Aktiv:", aktiv, "; PA-Typ:", typ);
                    _this.makePaList();
                }
                return undefined;
            }, _this)
                .extend({ throttle: 800 });
            // #endregion Status PA-Liste
            // #region Status Rezept-Liste
            /** Status Laden beim Laden von Rezept-Liste */
            _this.rezListStateBusy = ko.observable(false);
            /** Status Timeout beim Laden von Rezept-Liste */
            _this.rezListStateTimeout = ko.observable(false);
            /** Status Rezept-Liste zusammengefasst */
            _this.rezListStateConnect = ko.pureComputed(function () {
                return {
                    text: _this.rezListStateTimeout()
                        ? "Zeitüberschreitung beim Verbinden mit Webservice"
                        : "Lade die Rezeptliste",
                    busy: _this.rezListStateBusy(),
                    timeout: _this.rezListStateTimeout(),
                };
            });
            // #endregion Status Rezept-Liste
            _this.userName = ko.observable("anonymous");
            _this.clientName = ko.observable("anonymous");
            _this.clientDescription = ko.observable("n/a");
            _this.clientIp = ko.observable("n/a");
            _this.userLevel = ko.observable();
            _this.userInfo = ko.pureComputed(function () {
                return ("UserLevel: " + _this.userLevel() +
                    "\n" +
                    ("Clientname: " + _this.clientName()) +
                    "\n" +
                    ("IP: " + _this.clientIp()));
            }, _this);
            _this._exTimer = ko.pureComputed(function () {
                if (_this.fnExecutionTime()) {
                    _this.fnExecutionTime(false);
                }
                return undefined;
            }, _this).extend({ throttle: 5000 });
            /** gemeinsame Rechte */
            _this.commonPermission = ko.pureComputed(function () {
                var ret = "";
                ret += !_this.fnExecutionTime() ? "" : "Daten werden sicher geschrieben. Bitte warten.\n";
                ret += !_this.userState() ? "Keine Benutzerrechte.\n" : "";
                ret += !_this.dbState() ? "Keine Verbindung zur WF-Datenbank.\n" : "";
                ret += !_this.db2State() ? "Keine Verbindung zur DB2-Datenbank.\n" : "";
                ret +=
                    !_this.ws1State() ||
                        !_this.ws2State() ||
                        !_this.ws3State() ||
                        !_this.ws4State()
                        ? "Webservice nicht erreichbar.\n"
                        : "";
                return ret;
            }, _this);
            /** Freigabe/Titel Button - PA-/Rez starten */
            _this.btnStartTitle = ko.pureComputed(function () {
                var ret = _this.commonPermission();
                if (_this.kennung() !== rezepturEnums_1.FnktKennung.rezOnly) {
                    ret += !_this.selectedPaData.PaNr() ? "Kein PA-Auftrag ausgewählt.\n" : "";
                }
                if (_this.kennung() !== rezepturEnums_1.FnktKennung.paOnly) {
                    ret +=
                        _this.varListeRows().length === 0
                            ? "Keine Rezeptvariablen vorhanden.\n"
                            : "";
                    ret += !_this.rezInfo() ? "Kein Rezept ausgewählt.\n" : "";
                }
                return ret || "Starten";
            }, _this);
            /** Freigabe/Titel Button - PA-Stoppen */
            _this.btnStopTitle = ko.pureComputed(function () {
                var ret = _this.commonPermission();
                if (_this.kennung() !== rezepturEnums_1.FnktKennung.rezOnly) {
                    ret += !(_this.paTyp() ||
                        _this.paAktiv() ||
                        (_this.selectedPaData.PaNr() &&
                            Number(_this.selectedPaData.Status()) === 1))
                        ? "Kein PA-Auftrag aktiv oder ausgewählt.\n"
                        : "";
                }
                return ret || "PA Stoppen";
            }, _this);
            /** Freigabe/Titel Button - Rezept Speichern */
            _this.btnSaveRecipeTitle = ko.pureComputed(function () {
                var ret = _this.commonPermission();
                ret =
                    _this.varListeRows().length === 0
                        ? ret + "Keine Rezeptvariablen vorhanden.\n"
                        : ret + "";
                return ret || "Rezept speichern";
            }, _this);
            /** Freigabe/Titel Button - Rezept Löschen */
            _this.btnDeleteTitle = ko.pureComputed(function () {
                var ret = _this.commonPermission();
                ret = !_this.rezInfo() ? ret + "Kein Rezept ausgewählt.\n" : ret + "";
                return ret || "Rezept löschen";
            }, _this);
            /** Aktueller Rezeptname, aufgelöst anhand der Rezeptnummer */
            _this.rezName = ko.observable("...");
            /** Head-Zeile für PA-Auftragstabelle */
            _this.paHead = ko.observableArray([]);
            /** Body-Zeilen für PA-Auftragstabelle */
            _this.paRows = ko.observableArray([]);
            /** bei Änderung der von PA-Daten Symbole updaten */
            _this._paRowsChanged = ko.pureComputed(function () {
                var _pa = _this.paRows();
                var _paTyp = _this.paTyp();
                var _paActiv = _this.paAktiv();
                _this.symbolStatusPa();
                return undefined;
            }, _this).extend({ throttle: 100 });
            /** Head-Zeile für Rezeptetabelle */
            _this.rezHead = ko.observableArray([]);
            /** Body-Zeilen für Rezeptetabelle */
            _this.rezRows = ko.observableArray([]);
            /** Ladestatus */
            _this.isLoading = ko.observable(false);
            /** temporäre Variablenliste wird Später in varListeRows einfliessen */
            _this.varListe = [];
            /** Head-Zeile Tabelle-Rezeptrelevantenvariablen */
            _this.varListeHead = ko.observableArray([]);
            /** Body-Zeilen Tabelle-Rezeptrelevantenvariablen */
            _this.varListeRows = ko.observableArray([]);
            _this.statusRezVarUI = {
                loaded: ko.observable(false),
                error: ko.observable(false),
                descrp: ko.observable("Status"),
            };
            _this.adminIsLogged = ko.observable(false);
            _this.adminName = ko.observable("");
            /** lebenszeichen */
            _this.isAlive = false;
            /** überwachte Knockout-Variablen */
            _this.subscriptions = [];
            _this.Tab = new Tab();
            _this.kennung = ko.observable();
            // UID für die eindeutige Identifizierung des Moduls
            _this.uid = ko.observable(uuid.v4());
            // ShortUID 3-stellig für die eindeutige Identifizierung im Logbuch.
            // Die Spalte "Altern" wird dafür verwendet um zusammenhängende Einträge gruppieren zu können.
            _this.shortUid = rezUtils_1.default.uidToShortId(_this.uid());
            _this.idPaFltr = ko.observable("idPaFilter_" + _this.uid());
            _this.idRezFltr = ko.observable("idRezFilter_" + _this.uid());
            _this.idSigFltr = ko.observable("idSigFltr_" + _this.uid());
            _this.idPaTable = ko.observable("idPaTable_" + _this.uid());
            _this.idRezTable = ko.observable("idRezTable_" + _this.uid());
            _this.idCollapseRezList = ko.observable("idCollapseRezList_" + _this.uid());
            _this.idCollapsePaList = ko.observable("idCollapsePaList_" + _this.uid());
            _this.idCountdown = ko.observable("idCountdown_" + _this.uid());
            _this.WsWatchdog = WsWatchdog.getInstance();
            _this.dynamicProdTypToSpsCfg = new Map();
            _this.lobsterServiceEnabled = ko.observable(false);
            /**
             * Ein Objekt, das eine Methode zum Schließen eines Kind-Objekts bereitstellt.
             * Die Methode überprüft, ob das Kind-Objekt existiert und eine `close`-Methode hat, bevor es geschlossen wird.
             */
            _this.closeChild = {
                /**
                 * Schließt das Kind-Objekt, wenn es existiert und eine `close`-Methode hat.
                 */
                close: function () {
                    if (this && typeof this.close === "function") {
                        this.close();
                    }
                },
            };
            _this.signalTimeouts = {};
            _this.subscribeSignal = function (signalName, callback, timeoutMs, fallback) {
                if (timeoutMs === void 0) { timeoutMs = 6000; }
                if (!!signalName.length) {
                    var signal = _this.connector.getSignal(signalName).value;
                    // Falls bereits ein Timer für dieses Signal läuft, abbrechen
                    if (_this.signalTimeouts[signalName]) {
                        clearTimeout(_this.signalTimeouts[signalName]);
                    }
                    var received_1 = false;
                    var timeout = setTimeout(function () {
                        if (!received_1) {
                            var warn = "Timeout: Signal \"" + signalName + "\" konnte nicht innerhalb von " + timeoutMs + "ms initialisiert werden.";
                            Logger.errorToast(warn);
                            _this.AddLog(warn, rezepturEnums_1.LogType.Abbruch_durch_Zeitüberschreitung);
                            if (fallback) {
                                fallback();
                            }
                        }
                    }, timeoutMs);
                    // Timer speichern
                    _this.signalTimeouts[signalName] = timeout;
                    var wrappedCallback = function (value) {
                        if (value !== undefined && value !== null && value !== "n/a") {
                            received_1 = true;
                            clearTimeout(_this.signalTimeouts[signalName]);
                            delete _this.signalTimeouts[signalName];
                            callback(value);
                        }
                    };
                    // Initialer Wert
                    wrappedCallback(signal());
                    // Subscription
                    _this.subscriptions.push(signal.subscribe(wrappedCallback));
                }
            };
            /** Funktion auf der ViewModel-Seite. PA wird für benutzerdefinierte Aktionen gestartet/gestoppt. */
            _this.paAktion = function (data) { return _this.extAction(data, "paAktiviert"); };
            /** Funktion auf der ViewModel-Seite. Rezepte werden zur SPS für benutzerdefinierte Aktionen gesendet. */
            _this.rezGesendet = function (data) { return _this.extAction(data, "rezGesendet"); };
            /** Funktion auf der ViewModel-Seite. Rezepte werden für benutzerdefinierte Aktionen gespeichert. */
            _this.rezGespeichert = function (data) {
                return _this.extAction(data, "rezGespeichert");
            };
            /**
             * Liest die aktuelle Rezeptnummer aus der SPS aus.
             * Wenn der Wert "n/a" ist oder kein numerischer Wert, wird die Funktion beendet.
             * Andernfalls wird die Rezeptnummer formatiert und gesetzt.
             *
             * @param {any} value - Der Wert, der aus der SPS gelesen wurde.
             */
            _this.getRezName = function (value) {
                if (value.toString().toLowerCase().trim() === "n/a" || typeof value !== "number")
                    return;
                var nummer = value.toString().padStart(9, "0");
                _this.rezNr(nummer);
                _this.setRezName(_this.rezNr(), _this.rezVer());
            };
            // Aktuelle Rezeptversion aus SPS auslesen
            _this.getRezVersion = function (value) {
                if (value.toString().toLowerCase().trim() === "n/a" || typeof value !== "number")
                    return;
                var nummer = value.toString();
                _this.rezVer(nummer);
                _this.setRezName(_this.rezNr(), _this.rezVer());
            };
            // Aktuelle Rezeptnummer aus SPS auslesen
            _this.setRezName = function (nr, ver) { return __awaiter(_this, void 0, void 0, function () {
                var res, vn, name_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.callService(nr, ver)];
                        case 1:
                            res = _a.sent();
                            vn = res.toString().split("|");
                            name_1 = ver && vn.length > 2
                                ? "V" + vn[1] + " - " + vn[2]
                                : vn.length > 2
                                    ? "" + vn[2]
                                    : "n/a";
                            this.rezName(name_1);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            // falls keine Zeile selektiert, dann die aktuelle PA aus der SPS nehmen
            _this.getNumber = function (selectedFn, defaultFn) {
                var value = parseFloat(selectedFn() || defaultFn());
                return isNaN(value) ? 0 : value;
            };
            // Filtere die Objekteigenschaften und prüfe die Schlüssel
            _this.filteredValues = function (obj) {
                var filteredObj = {};
                for (var key in obj) {
                    if (obj[key] !== undefined &&
                        key !== null &&
                        key !== undefined &&
                        key !== "") {
                        filteredObj[key] = obj[key];
                    }
                }
                return filteredObj;
            };
            /** fügt den Log zu dem Log-Panel auf der HTML-Testseite */
            _this.addToLogPanel = function (e) {
                var $logElem = $("#txtLog5be15bd6705");
                if ($logElem.length)
                    $logElem.prepend(e.newValue + "&#13;");
            };
            _this.loadFromLStorage = function () {
                var e_1, _a;
                // die Einträge in Array fassen um zu sortieren
                var arr = [];
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key.includes("rez_")) {
                        arr.push(key);
                    }
                }
                arr.sort(); // Array sortieren
                var url = window.location.href;
                try {
                    for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
                        var key = arr_1_1.value;
                        var nv = new StorageEvent("newValue", {
                            newValue: localStorage.getItem(key),
                            url: url,
                        });
                        _this.addToLogPanel(nv);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            };
            var self = _this;
            self.kennung(params.kennung || rezepturEnums_1.FnktKennung.standard);
            self.activate();
            // compositionComplete wird erst aufgerufen, wenn die View vollständig aufgebaut ist
            $(document).ready(function () {
                self.compositionComplete();
            });
            return _this;
        }
        RezDlg.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.filter = ko.unwrap(this.settings.filter);
            this.serverName = (ko.unwrap(this.settings.serverName) || window.rootUrlPrefix).stringPlaceholderResolver(this.objectID);
            this.databaseName = (ko.unwrap(this.settings.databaseName) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameRezNr = (ko.unwrap(this.settings.signalNameRezNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameVerNr = (ko.unwrap(this.settings.signalNameVerNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalNamePaNr = (ko.unwrap(this.settings.signalNamePaNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalNamePaAktiv = (ko.unwrap(this.settings.signalNamePaAktiv) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameProdTyp = (ko.unwrap(this.settings.signalNameProdTyp) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameSpsCnfg = (ko.unwrap(this.settings.signalNameSpsCnfg) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameRework = (ko.unwrap(this.settings.signalNameRework) || "").stringPlaceholderResolver(this.objectID);
            this.signalNamePlanLeistung = (ko.unwrap(this.settings.signalNamePlanLeistung) || "").stringPlaceholderResolver(this.objectID);
            this.signalNamePilotLevel = (ko.unwrap(this.settings.signalNamePilotLevel) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameFaktor = (ko.unwrap(this.settings.signalNameFaktor) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameGebindeanzahl = (ko.unwrap(this.settings.signalNameGebindeanzahl) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameFreigabeLaden = (ko.unwrap(this.settings.signalNameFreigabeLaden) || "").stringPlaceholderResolver(this.objectID);
            this.signalNameNetzNr = (ko.unwrap(this.settings.signalNameNetzNr) || "").stringPlaceholderResolver(this.objectID);
            this.grundFreigabeLaden = ko.unwrap(this.settings.grundFreigabeLaden) || "";
            this.werk = ko.unwrap(this.settings.werk);
            this.halle = ko.unwrap(this.settings.halle);
            this.etage = ko.unwrap(this.settings.etage);
            this.linie = ko.unwrap(this.settings.linie);
            this.maschine = ko.unwrap(this.settings.maschine);
            this.abteiNr = ko.unwrap(this.settings.abteiNr);
            this.anlagenNr = ko.unwrap(this.settings.anlagenNr);
            this.zaehlerNr = ko.unwrap(this.settings.zaehlerNr);
            this.signalNamePaStart = this.fillPaTimeStamp(ko.unwrap(this.settings.signalNamePaStart) || "");
            this.signalNamePaStop = this.fillPaTimeStamp(ko.unwrap(this.settings.signalNamePaStop) || "");
            this.signalNameOfenStartCalc = ko.unwrap(this.settings.signalNameOfenStartCalc) || "";
            this.signalNameSollNachlauf = ko.unwrap(this.settings.signalNameSollNachlauf) || "";
            this.signalNameIstNachlauf = ko.unwrap(this.settings.signalNameIstNachlauf) || "";
            /** Check Type */
            var chkType = function (obj, type) {
                return !!_this.settings.fn && !!obj && typeof ko.unwrap(obj) === type
                    ? ko.unwrap(obj)
                    : null;
            };
            // fn initialisieren
            if (!!this.settings.fn) {
                this.fn = {
                    vmContext: chkType(this.settings.fn.vmContext, "object"),
                    paAktiviert: chkType(this.settings.fn.paAktiviert, "string"),
                    rezGesendet: chkType(this.settings.fn.rezGesendet, "string"),
                    rezGespeichert: chkType(this.settings.fn.rezGespeichert, "string"),
                };
            }
        };
        /**
         * Überprüft, ob die aufgelisteten Eigenschaften im aktuellen Kontext gesetzt sind.
         * Gibt eine Warnmeldung in der Konsole aus, wenn eine Eigenschaft nicht gesetzt ist.
         * Dies dient rein informativen Zwecken für den Programmierer bei der Inbetriebnahme.
         */
        RezDlg.prototype.handleUnsetProperties = function () {
            this.rezDlgProperties = {
                signalNameRezNr: {
                    name: this.signalNameRezNr,
                    value: this.rezNr,
                },
                signalNameVerNr: {
                    name: this.signalNameVerNr,
                    value: this.rezVer,
                },
                signalNamePaNr: {
                    name: this.signalNamePaNr,
                    value: this.paNr,
                },
                signalNamePaAktiv: {
                    name: this.signalNamePaAktiv,
                    value: this.paAktiv,
                },
                signalNameProdTyp: {
                    name: this.signalNameProdTyp,
                    value: this.paTyp,
                },
                signalNameSpsCnfg: {
                    name: this.signalNameSpsCnfg,
                    value: this.SpsCfg,
                },
                signalNameRework: {
                    name: this.signalNameRework,
                    value: this.rework,
                },
                signalNamePlanLeistung: {
                    name: this.signalNamePlanLeistung,
                    value: this.planLeistung,
                },
                signalNamePilotLevel: {
                    name: this.signalNamePilotLevel,
                    value: this.pilotLevel,
                },
                signalNameFaktor: {
                    name: this.signalNameFaktor,
                    value: this.faktor,
                },
                signalNameGebindeanzahl: {
                    name: this.signalNameGebindeanzahl,
                    value: this.gebindeanzahl,
                },
                signalNameFreigabeLaden: {
                    name: this.signalNameFreigabeLaden,
                    value: this.freigabeLaden,
                },
                signalNameNetzNr: {
                    name: this.signalNameNetzNr,
                    value: this.netzNr,
                },
                grundFreigabeLaden: {
                    name: this.grundFreigabeLaden,
                    value: this.grundFreigabeLaden,
                },
                signalNameOfenStartCalc: {
                    name: this.signalNameOfenStartCalc,
                    value: this.ProcessTimingData.ofenStartCalc,
                },
                signalNameSollNachlauf: {
                    name: this.signalNameSollNachlauf,
                    value: this.ProcessTimingData.sollNachlauf,
                },
                signalNameIstNachlauf: {
                    name: this.signalNameIstNachlauf,
                    value: this.ProcessTimingData.istNachlauf,
                },
                signalNamePaStart: {
                    name: this.signalNamePaStart,
                    value: typeof this.signalNamePaStart === "string" ? this.ProcessTimingData.paStart : this.ProcessTimingData.paStartArr,
                },
                signalNamePaStop: {
                    name: this.signalNamePaStop,
                    value: typeof this.signalNamePaStop === "string" ? this.ProcessTimingData.paStop : this.ProcessTimingData.paStopArr,
                },
                filter: {
                    name: this.filter,
                    value: null,
                },
                serverName: {
                    name: this.serverName,
                    value: null,
                },
                databaseName: {
                    name: this.databaseName,
                    value: null,
                },
                werk: {
                    name: this.werk,
                    value: null,
                },
                halle: {
                    name: this.halle,
                    value: null,
                },
                etage: {
                    name: this.etage,
                    value: null,
                },
                linie: {
                    name: this.linie,
                    value: null,
                },
                abteiNr: {
                    name: this.abteiNr,
                    value: null,
                },
                maschine: {
                    name: this.maschine,
                    value: null,
                },
                anlagenNr: {
                    name: this.anlagenNr,
                    value: this.anlage,
                },
                zaehlerNr: {
                    name: this.zaehlerNr,
                    value: this.zaehler,
                },
            };
        };
        /**
         * Startet einen Countdown mit einer gegebenen Dauer in Minuten und Sekunden.
         * Wenn der Countdown abläuft, wird die Admin-Sitzung beendet und das Modalfenster (falls geöffnet) geschlossen.
         * @param {number} nMinutes - Die Anzahl der Minuten für den Countdown.
         * @param {number} nSeconds - Die Anzahl der Sekunden für den Countdown.
         */
        RezDlg.prototype.countdown = function (nMinutes, nSeconds) {
            var _this = this;
            var duration = moment.duration({ seconds: nSeconds, minutes: nMinutes });
            // Vorherigen Countdown stoppen, falls vorhanden
            if (this.nIntervId) {
                clearInterval(this.nIntervId);
            }
            this.nIntervId = setInterval(function () {
                duration = moment.duration(duration.asSeconds() - 1, "seconds");
                // Countdown am HTML-Element ausgeben
                $("#" + _this.idCountdown()).text(moment.utc(duration.asMilliseconds()).format("mm:ss"));
                if (duration.asMilliseconds() <= 0) {
                    clearInterval(_this.nIntervId);
                    _this.adminIsLogged(false);
                    _this.adminName("");
                    _this.CloseModal();
                    _this.AddLog("User-Session abgelaufen", rezepturEnums_1.LogType.Abbruch_durch_Zeitüberschreitung);
                }
            }, 1000);
        };
        /** Aktivierungslogik */
        RezDlg.prototype.activate = function () {
            this.isAlive = true;
            this.initWs();
            this.watchdog();
            this.serverStatus();
            // this.getConfig();
            /** Rez.Variablen hollen */
            this.RezValues = new RezValues(this.serverName, this.databaseName, this.filter, this.connector);
        };
        /** Komposition vollständig aufgebaut */
        RezDlg.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var handleErrors, self;
                var _this = this;
                return __generator(this, function (_a) {
                    $("#" + this.idPaFltr()).on("keyup", function () {
                        _this.changeFilter(_this.idPaFltr());
                    });
                    $("#" + this.idRezFltr()).on("keyup", function () {
                        _this.changeFilter(_this.idRezFltr());
                    });
                    $("#" + this.idSigFltr()).on("keyup", function () {
                        _this.changeFilter(_this.idSigFltr());
                    });
                    // Änderung der Amdin-Anmeldung überwachen
                    this.subscriptions.push(this.adminIsLogged.subscribe(function (state) {
                        if (state) {
                            _this.countdown(3, 0);
                            // _.throttle(() => this.countdown(1, 30), 1999)
                            $(".clRezeptDlg").on("mousemove", function () { return _this.countdown(3, 0); });
                        }
                        else {
                            _this.countdown(0, 0);
                            $(".clRezeptDlg").off("mousemove");
                        }
                    }));
                    this.initUser();
                    this.initSpsSignals();
                    this.connector.getOnlineUpdates();
                    this.localStorLogWriter.startProcessing();
                    if (this.debugFlag) {
                        this.loadFromLStorage();
                        window.addEventListener("storage", this.addToLogPanel, false);
                    }
                    handleErrors = function (promise) { return __awaiter(_this, void 0, void 0, function () {
                        var ex_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, promise];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    ex_1 = _a.sent();
                                    console.log(ex_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    // Führen die Aufgaben parallel aus
                    Promise.all([
                        // PA-Liste laden
                        // handleErrors(this.makePaList()),
                        // Rez.-Liste laden
                        handleErrors(this.loadRezList()),
                        // Variablenliste laden
                        handleErrors(this.loadVarListe()),
                    ]);
                    this.handleUnsetProperties();
                    self = this;
                    // Initialisierung SPS/Dlg.-Konfiguration
                    self.loadDlgKonfig(self.anlage() || 0).then(function (dlg) {
                        self.configDataDlgCfg = dlg;
                        // die 'lobsterServiceEnabled' Eigenschaft hat Priorität,
                        // falls die fest im HTML-Konstrukt gesetzt wird.
                        if (typeof self.settings.lobsterServiceEnabled === "boolean")
                            self.lobsterServiceEnabled(ko.unwrap(self.settings.lobsterServiceEnabled));
                        else
                            // falls nicht, wird die Konfiguration verwendet.
                            self.lobsterServiceEnabled(self.configDataDlgCfg.LbstSvc_Enabl);
                    });
                    // Initialisierung SPS/Dlg.-Konfiguration
                    self.loadSpsKonfig(self.anlage() || 0).then(function (sps) {
                        self.configDataSpsCfg = sps;
                        // Umwandlung der SPS-Konfiguration in Map für einfache Zugriffe
                        sps.forEach(function (entry) {
                            self.dynamicProdTypToSpsCfg.set(entry.ProdTyp, entry.SpsCfgLiEnd);
                        });
                    }).catch(function (err) {
                        self.AddLog(err.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                    });
                    this.AddLog("Start Dlg. \"" + this.kennung() + "\", UID: " + this.uid().slice(0, 6) + "..", rezepturEnums_1.LogType.Login);
                    return [2 /*return*/];
                });
            });
        };
        /** Rez. relevante Variablen laden */
        RezDlg.prototype.loadVarListe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            this.statusRezVarUI.descrp("Lade Rezeptvariablen…");
                            _a = this;
                            return [4 /*yield*/, this.RezValues.getVarListe()];
                        case 1:
                            _a.varListe = _b.sent();
                            return [4 /*yield*/, this.fillTable()];
                        case 2:
                            _b.sent();
                            this.statusRezVarUI.loaded(true);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            Logger.errorToast(rezUtils_1.default.msgCut(error_2.message, 100) + "...");
                            this.AddLog(error_2.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            this.statusRezVarUI.error(true);
                            this.statusRezVarUI.descrp(error_2);
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RezDlg.prototype.fillPaTimeStamp = function (paTimeStamp) {
            if (!Array.isArray(paTimeStamp)) {
                return paTimeStamp;
            }
            if (paTimeStamp.length !== 6) {
                Logger.errorToast("Abbruch! Falsche Parametrierung 'signalNamePaStart'…");
                return;
            }
            var retJson = "{\n                \"tag\":{\"name\":\"" + paTimeStamp[0] + "\",\"value\":0},\n                \"monat\":{\"name\":\"" + paTimeStamp[1] + "\", \"value\":0},\n                \"jahr\":{\"name\":\"" + paTimeStamp[2] + "\", \"value\":0},\n                \"stunde\":{\"name\":\"" + paTimeStamp[3] + "\", \"value\":0},\n                \"minute\":{\"name\":\"" + paTimeStamp[4] + "\", \"value\":0},\n                \"sekunde\":{\"name\":\"" + paTimeStamp[5] + "\", \"value\":0}\n            }";
            return JSON.parse(retJson);
        };
        /** Initialisiert den Benutzer, indem es sich auf Änderungen des aktuell angemeldeten Benutzers abonniert. */
        RezDlg.prototype.initUser = function () {
            var self = this;
            // Änderung der User-Anmeldung überwachen
            self.subscriptions.push(self.connector.currentLoggedInUser.subscribe(function (usrName) {
                self.userChanged(usrName);
            }));
            var name = self.connector.currentLoggedInUser();
            self.userChanged(name);
        };
        /** aktualisiert die Benutzerdetails basierend auf dem übergebenen Namen.
         *  Wenn ein Name vorhanden ist, werden die aktuellen Benutzerdetails abgerufen
         *  und die entsprechenden Eigenschaften des Objekts aktualisiert */
        RezDlg.prototype.userChanged = function (name) {
            var _this = this;
            if (name) {
                UserService.getCurrentUserDetails()
                    .then(function (userDetails) {
                    _this.userName(userDetails.Name);
                    _this.clientDescription(userDetails.Description);
                    _this.userLevel(userDetails.UserLevel);
                    // User-Symbol in der Statusleiste ansteuern
                    _this.userState(Number.isInteger(userDetails.UserLevel));
                })
                    .catch(function (ex) {
                    Logger.errorToast(ex);
                });
            }
            else {
                this.userName("unbekannt");
                this.clientDescription("n/a");
                this.userLevel(-1);
                this.userState(false);
            }
            Promise.all([getClientInfo_1.ClientInfo.Name(), getClientInfo_1.ClientInfo.Ip()])
                .then(function (values) {
                _this.clientName(values[0]);
                _this.clientIp(values[1]);
            })
                .catch(function (error) {
                Logger.errorToast(error);
            });
        };
        /** hollt die Versionsinfos von WebServices */
        RezDlg.prototype.initWs = function () {
            var services = [
                { service: rezepturEnums_1.ServiceWahl.wcfSiem, setVersion: this.ws1Version },
                { service: rezepturEnums_1.ServiceWahl.WcfRezept, setVersion: this.ws2Version },
                { service: rezepturEnums_1.ServiceWahl.WsCwSAP, setVersion: this.ws3Version },
                { service: rezepturEnums_1.ServiceWahl.WsCcwBde, setVersion: this.ws4Version },
            ];
            services.forEach(function (_a) {
                var service = _a.service, setVersion = _a.setVersion;
                rezService_1.rezService
                    .getVersion(service)
                    .then(function (value) {
                    setVersion("Version: " + value.GetVersionResult[0].version + "\nBuild: " + value.GetVersionResult[0].buildDate);
                })
                    .catch(function (reason) {
                    Logger.errorToast(reason);
                });
            });
        };
        RezDlg.prototype.initSpsSignals = function () {
            var _this = this;
            // Aktuelle PA-Nummer aus SPS auslesen
            this.subscribeSignal(this.signalNamePaNr, function (value) { return _this.paNr(value); });
            // PA-Nummer aktiv/inaktiv aus SPS auslesen
            this.subscribeSignal(this.signalNamePaAktiv, function (value) {
                return _this.paAktiv(value);
            });
            // ProdTyp aus SPS auslesen
            this.subscribeSignal(this.signalNameProdTyp, function (value) { return _this.paTyp(value); });
            // SPS Konfig. aus SPS auslesen
            this.subscribeSignal(this.signalNameSpsCnfg, function (value) {
                return _this.SpsCfg(value);
            });
            // Pilotlevel
            this.subscribeSignal(this.signalNamePilotLevel, function (value) {
                return _this.pilotLevel(value);
            });
            // Massenberechnungsfaktor
            this.subscribeSignal(this.signalNameFaktor, function (value) { return _this.faktor(value); });
            // externe Ladefreigabe
            this.subscribeSignal(this.signalNameFreigabeLaden, function (value) {
                return _this.freigabeLaden(value);
            });
            // Gebindeanzahl
            this.subscribeSignal(this.signalNameGebindeanzahl, function (value) { return _this.gebindeanzahl(value); });
            // PlanLeistung
            this.subscribeSignal(this.signalNamePlanLeistung, function (value) { return _this.planLeistung(value); });
            // Rework
            this.subscribeSignal(this.signalNameRework, function (value) { return _this.rework(value); });
            // Rezeptname
            this.subscribeSignal(this.signalNameRezNr, function (nr) { return _this.getRezName(nr); });
            // Rezeptversion
            this.subscribeSignal(this.signalNameVerNr, function (vers) { return _this.getRezVersion(vers); });
            // Netznummer
            this.subscribeSignal(this.signalNameNetzNr, function (nr) { return _this.netzNr(nr); });
            // DateTime - Formatierung
            var DTFormat = function (originalDT) {
                // Prüfen, ob es sich um das Microsoft JSON-Datum handelt
                var msDateMatch = originalDT.match(/\/Date\((\d+)([+-]\d{4})?\)\//);
                if (msDateMatch) {
                    var timestamp = parseInt(msDateMatch[1], 10);
                    return moment(timestamp).format("DD.MM.YYYY HH:mm:ss");
                }
                // Standardformat verarbeiten
                return moment(originalDT, "YYYY-MM-DD-HH:mm:ss.SSS").format("DD.MM.YYYY HH:mm:ss");
            };
            // TimeOfDay - Formatierung
            var TODFormat = function (originalTOD) {
                // Wenn der Wert eine Zahl oder eine Zahl als String ist, behandeln als Millisekunden
                if (!isNaN(Number(originalTOD))) {
                    return moment.utc(Number(originalTOD)).format("HH:mm:ss");
                }
                // Standardformat verarbeiten
                return moment(originalTOD, "HH:mm:ss.SSS").format("HH:mm:ss");
            };
            // PA-Start (Timestamp z.B. für Ofenstart)
            if (this.signalNamePaStart) {
                if (typeof this.signalNamePaStart === "string") {
                    this.subscribeSignal(this.signalNamePaStart, function (td) { return _this.ProcessTimingData.paStart(DTFormat(td)); });
                }
                else { // der Fall für die Zeit als Byte-Array aus der SPS
                    var setPaStart_1 = function () {
                        _this.ProcessTimingData.paStart(DTFormat(_this.ProcessTimingData.paStartArr()[0] + "-" + _this.ProcessTimingData.paStartArr()[1] + "-" + _this.ProcessTimingData.paStartArr()[2] + "-" + _this.ProcessTimingData.paStartArr()[3] + ":" + _this.ProcessTimingData.paStartArr()[4] + ":" + _this.ProcessTimingData.paStartArr()[5]));
                    };
                    this.subscribeSignal(this.signalNamePaStart.tag.name, function (tag) { _this.ProcessTimingData.paStartArr()[0] = tag; setPaStart_1(); });
                    this.subscribeSignal(this.signalNamePaStart.monat.name, function (monat) { _this.ProcessTimingData.paStartArr()[1] = monat; setPaStart_1(); });
                    this.subscribeSignal(this.signalNamePaStart.jahr.name, function (jahr) { _this.ProcessTimingData.paStartArr()[2] = jahr; setPaStart_1(); });
                    this.subscribeSignal(this.signalNamePaStart.stunde.name, function (stunde) { _this.ProcessTimingData.paStartArr()[3] = stunde; setPaStart_1(); });
                    this.subscribeSignal(this.signalNamePaStart.minute.name, function (minute) { _this.ProcessTimingData.paStartArr()[4] = minute; setPaStart_1(); });
                    this.subscribeSignal(this.signalNamePaStart.sekunde.name, function (sekunde) { _this.ProcessTimingData.paStartArr()[5] = sekunde; setPaStart_1(); });
                }
            }
            if (this.signalNamePaStop) {
                if (typeof this.signalNamePaStop === "string") {
                    this.subscribeSignal(this.signalNamePaStop, function (td) { return _this.ProcessTimingData.paStop(DTFormat(td)); });
                }
                else { // der Fall für die Zeit als Byte-Array aus der SPS
                    var setPaStop_1 = function () {
                        _this.ProcessTimingData.paStop(DTFormat(_this.ProcessTimingData.paStopArr()[0] + "-" + _this.ProcessTimingData.paStopArr()[1] + " -" + _this.ProcessTimingData.paStopArr()[2] + " -" + _this.ProcessTimingData.paStopArr()[3] + ":" + _this.ProcessTimingData.paStopArr()[4] + ":" + _this.ProcessTimingData.paStopArr()[5]));
                    };
                    this.subscribeSignal(this.signalNamePaStop.tag.name, function (tag) { _this.ProcessTimingData.paStopArr()[0] = tag; setPaStop_1(); });
                    this.subscribeSignal(this.signalNamePaStop.monat.name, function (monat) { _this.ProcessTimingData.paStopArr()[1] = monat; setPaStop_1(); });
                    this.subscribeSignal(this.signalNamePaStop.jahr.name, function (jahr) { _this.ProcessTimingData.paStopArr()[2] = jahr; setPaStop_1(); });
                    this.subscribeSignal(this.signalNamePaStop.stunde.name, function (stunde) { _this.ProcessTimingData.paStopArr()[3] = stunde; setPaStop_1(); });
                    this.subscribeSignal(this.signalNamePaStop.minute.name, function (minute) { _this.ProcessTimingData.paStopArr()[4] = minute; setPaStop_1(); });
                    this.subscribeSignal(this.signalNamePaStop.sekunde.name, function (sekunde) { _this.ProcessTimingData.paStopArr()[5] = sekunde; setPaStop_1(); });
                }
            }
            // errechnete Ofenstartzeit (Timestamp aus der SPS z.B. für Ofenstart)
            this.subscribeSignal(this.signalNameOfenStartCalc, function (td) { return _this.ProcessTimingData.ofenStartCalc(DTFormat(td)); });
            // Nachlaufzeit Soll
            this.subscribeSignal(this.signalNameSollNachlauf, function (tod) { return _this.ProcessTimingData.sollNachlauf(TODFormat(tod)); });
            // Verbliebene Zeit
            this.subscribeSignal(this.signalNameIstNachlauf, function (tod) { return _this.ProcessTimingData.istNachlauf(TODFormat(tod)); });
            // Anlagennummer
            switch (typeof this.anlagenNr) {
                case "number":
                    this.anlage(Number(this.anlagenNr));
                    break;
                case "string":
                    this.subscribeSignal(this.anlagenNr.toString(), function (nr) { return _this.anlage(Number(nr)); });
                    break;
                default:
                    this.anlage(null);
                    break;
            }
            // Zählernummer
            switch (typeof this.zaehlerNr) {
                case "number":
                    this.zaehler(Number(this.zaehlerNr));
                    break;
                case "string":
                    this.subscribeSignal(this.zaehlerNr.toString(), function (nr) { return _this.zaehler(Number(nr)); });
                    break;
                default:
                    this.zaehler(null);
                    break;
            }
        };
        /** WF-Server - Status Abfragen */
        RezDlg.prototype.serverStatus = function () {
            var _this = this;
            var keineVerbindung = function () {
                // fehelerhaftes Ansprechen nach dispose() verhindern
                if (!_this.isAlive)
                    return false;
                _this.dbState(false);
                Logger.errorToast("keine Verbindung zu WF-Server!");
            };
            var wfServerState = _.debounce(keineVerbindung, 7000);
            var timeStamp = this.connector.getSignal("WFSInternal_AliveTimeStamp");
            this.connector.getOnlineUpdates();
            this.subscriptions.push(timeStamp.value.subscribe(function () {
                _this.connector
                    .readSignals(["WFSInternal_AliveStatus"])
                    .then(function (signals) {
                    if (signals[0].Result === 0 || signals) {
                        if (signals[0].Value === 13) {
                            _this.dbState(true);
                            wfServerState();
                        }
                    }
                });
            }));
        };
        /**
         * Prüft, ob die ViewModel-Funktion erreichbar ist.
         * @param {any} data - Die Daten, die an die Funktion übergeben werden sollen.
         * @param {any} fnName - Der Name der Funktion, die aufgerufen werden soll.
         * @returns {Promise<any>} Ein Promise, das entweder den Rückgabewert der Funktion oder einen Fehler zurückgibt.
         */
        RezDlg.prototype.extAction = function (data, fnName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            try {
                                if (!_this.fn ||
                                    !_this.fn.vmContext ||
                                    typeof _this.fn.vmContext[_this.fn[fnName]] !== "function") {
                                    return resolve("ViewModel bzw. Fn. " + fnName + " n. definiert");
                                }
                                _this.fn.vmContext[_this.fn[fnName]](function (cb) {
                                    return resolve(cb);
                                }, _this.connector, data);
                                // return new Promise((resolve) => {
                                //   (this.fn.vmContext = (cb: string) => resolve(cb)), this.connector, data;
                                // });
                            }
                            catch (error) {
                                reject(error);
                            }
                        })];
                });
            });
        };
        /**
         * liefert eine Rezeptliste
         * @param rezNr optional, wenn angegeben, dann Info über gewählte Rezeptur
         * @returns string[]
         */
        RezDlg.prototype.callService = function (rezNr, rezVer) {
            return __awaiter(this, void 0, void 0, function () {
                var ret, ex_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, rezService_1.rezService.GetRezList({
                                    werk: this.werk,
                                    halle: this.halle,
                                    etage: this.etage,
                                    linie: this.linie,
                                    abteiNr: this.abteiNr,
                                    maschine: this.maschine,
                                    reznr: rezNr,
                                    rezver: rezVer,
                                })];
                        case 1:
                            ret = _a.sent();
                            this.db2State(true);
                            return [2 /*return*/, ret.GetRezListResult.Data];
                        case 2:
                            ex_2 = _a.sent();
                            this.db2State(false);
                            Logger.errorToast(rezUtils_1.default.msgCut(ex_2.message, 100) + "...");
                            this.AddLog(ex_2.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            throw ex_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Update Rezept (Datentabelle)
         * @param {number} rezNr Rezeptnummer
         * @param {number} del 0 - Update; 1 - Delete
         */
        RezDlg.prototype.updateDataTable = function (rezNr, rezVer, del) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, rezService_1.rezService.SetDeletedRez({
                                    User: this.adminName(),
                                    RezNr: rezNr,
                                    RezVer: rezVer,
                                    werk: this.werk,
                                    halle: this.halle,
                                    etage: this.etage,
                                    linie: this.linie,
                                    abteiNr: this.abteiNr,
                                    maschine: this.maschine,
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response.SetDeletedRezResult.Succeed) {
                                throw new Error(response.SetDeletedRezResult.ErrorMsg);
                            }
                            if (!response.SetDeletedRezResult.Data) {
                                throw new Error("Rezept - " + rezNr + " konnte nicht gel\u00F6scht werden.");
                            }
                            Logger.successToast("Rezept - " + rezNr + " erfolgreich gel\u00F6scht!");
                            return [2 /*return*/, "positiv"];
                        case 2:
                            error_3 = _a.sent();
                            this.showError(error_3, "Rezept - " + rezNr + " wurde nicht gel\u00F6scht!");
                            return [2 /*return*/, "negativ"];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Stoppt PA in SPS, OPUS, Lobster */
        RezDlg.prototype.stopPa = function () {
            return __awaiter(this, void 0, void 0, function () {
                var PaNr, RezNr, dauer, _eProdTyp, person, info, aktivePaOpus, _a, _b, zeile, info_1, e_2_1, error_4;
                var e_2, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 16, , 17]);
                            PaNr = this.getNumber(this.selectedPaData.PaNr, this.paNr);
                            RezNr = this.getNumber(this.selectedPaData.RezNr, this.rezNr);
                            this.paSelect(PaNr.toString(), RezNr.toString());
                            dauer = void 0;
                            _eProdTyp = rezepturEnums_1.eProdTypCode;
                            if (!(this.configDataDlgCfg.LbstRngMld_Enabl && this.paTyp() === _eProdTyp.Reinigung)) return [3 /*break*/, 2];
                            return [4 /*yield*/, dialog.show(new PersonalDialog())];
                        case 1:
                            person = _d.sent();
                            this.AddLog("Usereingabe: Personen nach 'RR' = " + person, this.logTyp);
                            if (!person || isNaN(person))
                                throw new Error("Eingabe abgebrochen. Bitte wiederholen!");
                            // Dezimalstellen verschieben um die Nachkommastellen zu entfernen
                            dauer = Math.round(Number(person) * 10000) / 100;
                            _d.label = 2;
                        case 2: 
                        // ------------------------------------------
                        // 2. - PA-Werte in der SPS auf 0 schreiben.
                        // ------------------------------------------
                        return [4 /*yield*/, this.writePaDatSps(false).catch(function (error) { throw error; })];
                        case 3:
                            // ------------------------------------------
                            // 2. - PA-Werte in der SPS auf 0 schreiben.
                            // ------------------------------------------
                            _d.sent();
                            info = "PA-Daten in SPS auf '0' gesetzt.";
                            this.AddLog(info, this.logTyp);
                            Logger.infoToast(info);
                            // -----------------------------------------------------
                            // 3. - aktive PA-Aufträge in OPUS suchen ggf. beenden.
                            // -----------------------------------------------------
                            this.AddLog("Aktive PA in OPUS-Tabelle suchen, ggf. beenden.", this.logTyp);
                            aktivePaOpus = [];
                            _d.label = 4;
                        case 4:
                            _d.trys.push([4, 9, 10, 11]);
                            _a = __values(this.paRows()), _b = _a.next();
                            _d.label = 5;
                        case 5:
                            if (!!_b.done) return [3 /*break*/, 8];
                            zeile = _b.value;
                            // zeile.cells[0] -> Status
                            if (Number(zeile.cells[0]) !== 1)
                                return [3 /*break*/, 7];
                            aktivePaOpus.push({ paNr: Number(zeile.cells[1]), rezNr: Number(zeile.cells[2]), });
                            info_1 = "Es wird versucht, aktive PA: " + zeile.cells[1] + " in OPUS zu beenden.";
                            this.AddLog(info_1, this.logTyp);
                            Logger.infoToast(info_1);
                            // --------------------
                            // PA-Stoppen in OPUS.
                            // --------------------
                            return [4 /*yield*/, this.sendPaToOpus(rezepturEnums_1.PaStatus.ende, zeile.cells[1], zeile.cells[2], zeile.cells[3]).catch(function (error) {
                                    throw error;
                                })];
                        case 6:
                            // --------------------
                            // PA-Stoppen in OPUS.
                            // --------------------
                            _d.sent();
                            _d.label = 7;
                        case 7:
                            _b = _a.next();
                            return [3 /*break*/, 5];
                        case 8: return [3 /*break*/, 11];
                        case 9:
                            e_2_1 = _d.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 11];
                        case 10:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                            return [7 /*endfinally*/];
                        case 11:
                            if (!!aktivePaOpus.length) return [3 /*break*/, 13];
                            this.AddLog("keine aktive PA in OPUS-Tabelle gefunden.", this.logTyp);
                            if (!(PaNr > 0)) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.sendPaToOpus(rezepturEnums_1.PaStatus.ende, PaNr, RezNr, "DU").catch(function (error) { throw error; })];
                        case 12:
                            _d.sent();
                            _d.label = 13;
                        case 13:
                            if (!this.lobsterServiceEnabled()) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.LobsterPaStopp(PaNr, RezNr, dauer).catch(function (error) { throw error; })];
                        case 14:
                            _d.sent();
                            _d.label = 15;
                        case 15:
                            // PA-Liste neu Laden damit man geändertes Status von PA-Aufträgen einholt
                            // await this.makePaList();
                            this.AddLog("selektiere PA: " + PaNr + ", Rez.: " + RezNr, this.logTyp);
                            // selektiert eine PA-Zeile mit zwischengespeicherten Pa-/Rez-Nr
                            this.paSelect(PaNr.toString(), RezNr.toString());
                            return [3 /*break*/, 17];
                        case 16:
                            error_4 = _d.sent();
                            throw error_4;
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) PA-Auftrag stoppen */
        RezDlg.prototype.btnStopPa = function () {
            return __awaiter(this, void 0, void 0, function () {
                var start, error_5, end;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.AddLog("*** Btn. 'PA-Stop' geklickt ***", this.logTyp);
                            start = performance.now();
                            // Lade-Spinner einblenden
                            this.isLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            // Stoppe PA in SPS, OPUS, Lobster
                            return [4 /*yield*/, this.stopPa()];
                        case 2:
                            // Stoppe PA in SPS, OPUS, Lobster
                            _a.sent();
                            this.AddLog("PA gestoppt!", this.logTyp);
                            return [3 /*break*/, 5];
                        case 3:
                            error_5 = _a.sent();
                            this.showError(error_5, "PA konnte nicht gestoppt werden.");
                            return [3 /*break*/, 5];
                        case 4:
                            // Lade-Spinner ausblenden
                            this.isLoading(false);
                            end = performance.now();
                            if (end - start <= 6000) {
                                console.log("Ausf\u00FChrungszeit: von 'btnStopPa()' " + (end - start) + " ms. Buttons blokieren f\u00FCr 5000 ms.");
                                this.fnExecutionTime(true);
                            }
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /** vergleicht die gewählte PA/Rez- Nr. mit der gewählten Rez.Nr. */
        RezDlg.prototype.RezPaPlausibility = function () {
            return __awaiter(this, void 0, void 0, function () {
                var prodTyp, paNr, info, _a, response, dispose, info, _b, response, dispose;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            prodTyp = this.selectedPaData.ProdTyp();
                            paNr = this.selectedPaData.PaNr().toString();
                            if (!(this.selectedRecipe.Nr() !== this.selectedPaData.RezNr() &&
                                !(["33333", "77777", "88888", "99999"].includes(paNr) ||
                                    ["DU", "RR"].includes(prodTyp)))) return [3 /*break*/, 2];
                            info = "(PA)Rez-Nummer passt nicht zu der gewählten Rez-Nummer!<br><br>Wählen Sie die entsprechende RezNr. aus oder legen Sie das Rezept neu an.";
                            this.AddLog(info, rezepturEnums_1.LogType.Abbruch);
                            return [4 /*yield*/, dialog.show(new MsgBox("Warnung PA-Rez(" + this.selectedPaData
                                    .RezNr()
                                    .toString() + ") <> Rez(" + this.selectedRecipe.Nr() + ")", info, "Orange"))];
                        case 1:
                            _a = __read.apply(void 0, [_c.sent(), 2]), response = _a[0], dispose = _a[1];
                            dispose();
                            if (response !== "ok") {
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            if (!("RR" !== prodTyp && // Zeitfensterwarnung bei Reinigungsauftrag nicht auswerten
                                moment(new Date()).isAfter(moment(this.selectedPaData.Stop(), "DD.MM.YYYY HH:mm:ss")))) return [3 /*break*/, 4];
                            info = "Zeitfenster des gew\u00E4hlten PA-Auftrags liegt in Vergangenheit!<br>" + this.selectedPaData.Stop() + "<br><br>Sie sind im Begriff, einen ung\u00FCltigen PA-Auftrag zu starten.";
                            return [4 /*yield*/, dialog.show(new MsgBox("PA-Auftrag abgelaufen", info, "Orange", [
                                    { name: "ok", text: "Weiter", btnClassName: "btn btn-warning" },
                                    {
                                        name: "cancel",
                                        text: "Abbrechen",
                                        btnClassName: "btn btn-default",
                                    },
                                ]))];
                        case 3:
                            _b = __read.apply(void 0, [_c.sent(), 2]), response = _b[0], dispose = _b[1];
                            dispose();
                            if (response !== "ok") {
                                this.AddLog(info, rezepturEnums_1.LogType.Abbruch_durch_Bediener);
                                return [2 /*return*/];
                            }
                            this.AddLog(info, rezepturEnums_1.LogType.OK);
                            _c.label = 4;
                        case 4: return [2 /*return*/, {
                                PaNr: this.selectedPaData.PaNr().toString(),
                                Start: this.selectedPaData.Start(),
                                Stop: this.selectedPaData.Stop(),
                                // bei Reinigungsauftrag die Planleistung mit 1 vorbelegen, ToDo - Planleistung soll von MES kommen
                                Planleistung: "RR" !== prodTyp ? this.selectedPaData.Planleistung() : "1",
                                Rezeptbeschreibung: this.selectedRecipe.Descrp(),
                            }];
                    }
                });
            });
        };
        /** prüft ob die Längen zwischen WF-Db und DB2-Db unterschiedlich sind
         * @returns {boolean} true = Freigabe
         * @returns {boolean} false = keine Freigabe
         */
        RezDlg.prototype.checkCountDataTable = function () {
            return __awaiter(this, void 0, void 0, function () {
                var infoTxt, headTxt, status, count, _a, response, dispose, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            infoTxt = "", headTxt = "";
                            status = 0;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, rezService_1.rezService.CheckRecipeDb({
                                    rezNr: this.selectedRecipe.Nr(),
                                    rezVer: this.selectedRecipe.Vers(),
                                    config: {
                                        werk: this.werk,
                                        halle: this.halle,
                                        etage: this.etage,
                                        linie: this.linie,
                                        maschine: this.maschine,
                                        abteiNr: this.abteiNr,
                                        anlagenNr: this.anlage(),
                                    },
                                })];
                        case 2:
                            count = (_b.sent()).CountDataTableResult;
                            if (!count.Succeed)
                                throw new Error("Fehler in checkCountDataTable()");
                            if (count.Data > this.varListeRows().length) {
                                headTxt = "Rezeptl\u00E4nge DB2(" + count.Data + ") gr\u00F6\u00DFer als WF-DB(" + this.varListeRows().length + ")";
                                infoTxt = "Achtung!<br><br>das Rezept " + this.rezInfo() + "<br>ist besch\u00E4digt, das Laden des Rezeptes wird verweigert.";
                                status = 2;
                            }
                            if (count.Data < this.varListeRows().length) {
                                headTxt = "Rezeptl\u00E4nge DB2(" + count.Data + ") kleiner als WF-DB(" + this.varListeRows().length + ")";
                                infoTxt = "Rezept: " + this.rezInfo() + "<br><br>Es gibt Unterschiede in der L\u00E4nge der Rezepte zwischen der Datenbank und der Anlage. Bitte \u00FCbertragen Sie das Grundrezept und speichern Sie es ab, damit das Rezept angeglichen wird.";
                                status = 3;
                            }
                            if (!(status > 0)) return [3 /*break*/, 4];
                            this.AddLog(headTxt + ", " + infoTxt, status === 3 ? rezepturEnums_1.LogType.OK : rezepturEnums_1.LogType.Abbruch);
                            return [4 /*yield*/, dialog.show(new MsgBox(headTxt, infoTxt, status === 3 ? "Orange" : "Tomato"))];
                        case 3:
                            _a = __read.apply(void 0, [_b.sent(), 2]), response = _a[0], dispose = _a[1];
                            dispose();
                            _b.label = 4;
                        case 4: return [2 /*return*/, status !== 2];
                        case 5:
                            error_6 = _b.sent();
                            headTxt = "Error";
                            infoTxt = error_6.message;
                            status = 1;
                            this.AddLog(infoTxt, rezepturEnums_1.LogType.Abbruch);
                            return [2 /*return*/, false];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) Rezept zur SPS senden */
        RezDlg.prototype.btnSendRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isCountValid, isExtFreigabeValid, isFaultReportValid, _a, paDaten, dialogResult;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
                            return [4 /*yield*/, this.checkCountDataTable()];
                        case 1:
                            isCountValid = _b.sent();
                            return [4 /*yield*/, this.checkExtFreigabe()];
                        case 2:
                            isExtFreigabeValid = _b.sent();
                            if (!(this.selectedPaData.ProdTyp() !== "RR") // bei Reinigungsauftrag kein CheckFaultReport
                            ) return [3 /*break*/, 4]; // bei Reinigungsauftrag kein CheckFaultReport
                            return [4 /*yield*/, this.checkFaultReport()];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = true;
                            _b.label = 5;
                        case 5:
                            isFaultReportValid = _a;
                            if (!isCountValid || !isExtFreigabeValid || !isFaultReportValid) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.RezPaPlausibility()];
                        case 6:
                            paDaten = _b.sent();
                            if (!paDaten)
                                return [2 /*return*/];
                            if (!(this.kennung() !== rezepturEnums_1.FnktKennung.ofen)) return [3 /*break*/, 8];
                            return [4 /*yield*/, dialog.show(new DlgAblieferZone(this.anlage().toString(), paDaten))];
                        case 7:
                            dialogResult = _b.sent();
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, dialog.show(new DlgAblZoneOfen(this.anlage().toString(), paDaten))];
                        case 9:
                            dialogResult = _b.sent();
                            _b.label = 10;
                        case 10:
                            if (!dialogResult || dialogResult.length === 0 ||
                                dialogResult[0].toString().toLowerCase() !== "accept") {
                                this.AddLog("Dlg. 'Ablieferzone' Abgebrochen/Geschlossen", rezepturEnums_1.LogType.Abbruch_durch_Bediener);
                                return [2 /*return*/];
                            }
                            // Alle Eigenschaften von dialogResult[1] loggen
                            this.AddLog("Dlg. 'Ablieferzone' akzeptiert. Eigenschaften: " + JSON.stringify(dialogResult[1]), this.logTyp);
                            this.isLoading(true); // Lade-Spinner zeigen
                            _b.label = 11;
                        case 11:
                            _b.trys.push([11, , 13, 14]);
                            // ---------------------------
                            // 4. - Rezeptsenden starten.
                            // ---------------------------
                            return [4 /*yield*/, this.sendRecipe(dialogResult[1])];
                        case 12:
                            // ---------------------------
                            // 4. - Rezeptsenden starten.
                            // ---------------------------
                            _b.sent();
                            return [3 /*break*/, 14];
                        case 13:
                            this.isLoading(false); // Lade-Spinner ausblenden
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        /** Check ob in BdeLobster-Tabelle einen nicht beendeter Auftrag existiert ggf. beenden */
        RezDlg.prototype.LobsterPaStopp = function (paNr, rezNr, dauer) {
            if (dauer === void 0) { dauer = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var PaNr, RezNr, Dauer, handleError, respLobst, _a, _b, e, error_7, e_3_1, respStopLobst, ex_3;
                var e_3, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            PaNr = paNr;
                            RezNr = rezNr;
                            Dauer = dauer;
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 16, , 17]);
                            handleError = function (resp, errorMsg) {
                                if (!resp.Succeed) {
                                    var exMsg = void 0;
                                    // ---------------------------------------------
                                    // 1. - es handelt sich um behandelten Fehler.
                                    // ---------------------------------------------
                                    if (resp.ErrorMsg) {
                                        var match = JSON.stringify(resp.ErrorMsg).match(/(?!System.*?\:)(.*?)(?=\;\\r\\n)/gm);
                                        exMsg =
                                            match && match.length >= 1
                                                ? match[0].toString().trim()
                                                : errorMsg;
                                    }
                                    // ---------------------------------------------
                                    // 2. - es handelt sich um unbehandelten Fehler
                                    //      z.B. nach try..catch exeption.
                                    // ---------------------------------------------
                                    if (resp.message) {
                                        exMsg = resp.message;
                                    }
                                    _this.AddLog(exMsg, _this.logTyp);
                                    throw new Error(exMsg);
                                }
                            };
                            if (!(PaNr > 0)) return [3 /*break*/, 13];
                            return [4 /*yield*/, rezService_1.rezService
                                    .GetBdeLobstUncomp(undefined, this.anlage())
                                    .catch(function (error) {
                                    throw error;
                                })];
                        case 2:
                            respLobst = (_d.sent()).GetBdeLobstUncompResult;
                            handleError(respLobst, "Fehler in 'GetBdeLobstUncomp'");
                            if (!(Array.isArray(respLobst.Data.Data) &&
                                respLobst.Data.Data.length > 0)) return [3 /*break*/, 12];
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 10, 11, 12]);
                            _a = __values(respLobst.Data.Data), _b = _a.next();
                            _d.label = 4;
                        case 4:
                            if (!!_b.done) return [3 /*break*/, 9];
                            e = _b.value;
                            this.AddLog("stoppe PA " + e.PaNr + " in Lobster-Tabelle", this.logTyp);
                            _d.label = 5;
                        case 5:
                            _d.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, rezService_1.rezService
                                    .SetBdeLobst({
                                    AuftArt: e.AuftArt,
                                    Fnkt: rezepturEnums_1.eAuftFn.Ende,
                                    PaNr: e.PaNr,
                                    RessNr: this.anlage(),
                                    ZaehlNr: this.zaehler() || this.anlage(),
                                    RezNr: e.RezNr,
                                    Wert: Dauer,
                                    VorgNr: e.VorgNr,
                                    RueckNr: e.RueckNr,
                                })];
                        case 6:
                            respLobst = (_d.sent()).SetBdeLobstResult;
                            handleError(respLobst, "Fehler in 'SetBdeLobst' beim PA beenden");
                            this.AddLog("PA " + e.PaNr + " in Lobster-Tabelle gestoppt", this.logTyp);
                            return [3 /*break*/, 8];
                        case 7:
                            error_7 = _d.sent();
                            handleError(error_7, "Fehler in 'SetBdeLobst' beim PA beenden");
                            return [3 /*break*/, 8];
                        case 8:
                            _b = _a.next();
                            return [3 /*break*/, 4];
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            e_3_1 = _d.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 12];
                        case 11:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 12: return [3 /*break*/, 15];
                        case 13:
                            // ---------------------------------------------------------------------
                            //  Alle gestarteten PA's unter der RessNr. in Lobster-Tabelle stoppen.
                            // ---------------------------------------------------------------------
                            this.AddLog("andere nicht beendete PAs unter RessNr. " + this.anlage() + " Z\u00E4hlNr. " + this.zaehler() + " in Lobster-Tabelle beenden", this.logTyp);
                            return [4 /*yield*/, rezService_1.rezService
                                    .StopAllBdeLobst(this.anlage(), this.zaehler())
                                    .catch(function (error) {
                                    throw error;
                                })];
                        case 14:
                            respStopLobst = (_d.sent()).StopAllBdeLobstResult;
                            handleError(respStopLobst, "Fehler in 'GetBdeLobstUncomp'");
                            if (respStopLobst.Data.length)
                                this.AddLog("PA " + respStopLobst.Data.join(", ") + " in Lobster-Tabelle gestoppt", this.logTyp);
                            else
                                this.AddLog("Keine aktiven PAs in Lobster-Tabelle gefunden.", this.logTyp);
                            _d.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            ex_3 = _d.sent();
                            throw ex_3;
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        /** sendet Rezept zur SPS */
        RezDlg.prototype.sendRecipe = function (DlgRes) {
            return __awaiter(this, void 0, void 0, function () {
                var PaNr, RezNr, RezVer, ProdTyp, RezName, VorgNr, RueckNr, format, diffInSeconds, AuftArt, respLobst, match, paToSps, sndToSpsResult, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            PaNr = this.selectedPaData.PaNr();
                            RezNr = this.selectedRecipe.Nr();
                            RezVer = this.selectedRecipe.Vers();
                            ProdTyp = this.selectedPaData.ProdTyp();
                            RezName = this.selectedRecipe.Descrp();
                            VorgNr = this.selectedPaData.ActivNr();
                            RueckNr = this.selectedPaData.RespnNr();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 12, 13, 15]);
                            // ---------------------------------------
                            // 1. - PA in SPS, OPUS, Lobster stoppen.
                            // ---------------------------------------
                            return [4 /*yield*/, this.stopPa().catch(function (error) {
                                    throw error;
                                })];
                        case 2:
                            // ---------------------------------------
                            // 1. - PA in SPS, OPUS, Lobster stoppen.
                            // ---------------------------------------
                            _a.sent();
                            if (!!DlgRes.ofenautostart) return [3 /*break*/, 5];
                            // ------------------------
                            // 2 - PA-Starten in OPUS.
                            // ------------------------
                            return [4 /*yield*/, this.sendPaToOpus(rezepturEnums_1.PaStatus.start, PaNr, RezNr, ProdTyp, DlgRes.zone, DlgRes.rework).catch(function (error) {
                                    throw error;
                                })];
                        case 3:
                            // ------------------------
                            // 2 - PA-Starten in OPUS.
                            // ------------------------
                            _a.sent();
                            if (!(this.lobsterServiceEnabled() &&
                                !["33333", "77777", "88888", "99999"].includes(PaNr)) // es dürfen keine 'dummys' behandelt werden
                            ) return [3 /*break*/, 5]; // es dürfen keine 'dummys' behandelt werden
                            format = "DD.MM.YYYY HH:mm:ss";
                            diffInSeconds = moment(DlgRes.stop, format).diff(moment(DlgRes.start, format), "seconds");
                            AuftArt = rezepturEnums_1.eAuftArt[ProdTyp] ||
                                rezepturEnums_1.eProdTyp[ProdTyp];
                            return [4 /*yield*/, rezService_1.rezService
                                    .SetBdeLobst({
                                    AuftArt: AuftArt,
                                    Fnkt: rezepturEnums_1.eAuftFn.Start,
                                    PaNr: parseFloat(PaNr.toString()),
                                    RessNr: this.anlage(),
                                    ZaehlNr: this.zaehler() || this.anlage(),
                                    RezNr: parseFloat(RezNr.toString()),
                                    Wert: diffInSeconds,
                                    VorgNr: VorgNr,
                                    RueckNr: RueckNr,
                                })
                                    .catch(function (error) { throw error; })];
                        case 4:
                            respLobst = (_a.sent()).SetBdeLobstResult;
                            if (!respLobst.Succeed) {
                                match = JSON.stringify(respLobst.ErrorMsg).match(/(?!System.*?\:)(.*?)(?=\;\\r\\n)/gm);
                                throw new Error(match && match.length >= 1 ? match[0] : "Fehler in 'SetBdeLobst'");
                            }
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.writePaDatSps(true, DlgRes.start, DlgRes.stop, DlgRes.leistung, this.kennung() === rezepturEnums_1.FnktKennung.ofen && DlgRes.ofenautostart, PaNr, RezNr).catch(function (error) {
                                throw error;
                            })];
                        case 6:
                            paToSps = _a.sent();
                            sndToSpsResult = void 0;
                            if (!DlgRes.grundrezept) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.sendToSps(RezNr, RezVer)];
                        case 7:
                            sndToSpsResult = _a.sent();
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, this.writeRezDatSps(RezNr, RezVer || 0).catch(function (error) { throw error; })];
                        case 9:
                            sndToSpsResult = _a.sent();
                            _a.label = 10;
                        case 10: return [4 /*yield*/, this.rezGesendet({
                                id: null,
                                paNr: PaNr,
                                rzNr: RezNr,
                                rzVer: RezVer,
                                rzName: RezName,
                            })];
                        case 11:
                            _a.sent();
                            Logger.successToast(paToSps[0] + sndToSpsResult[0]);
                            return [3 /*break*/, 15];
                        case 12:
                            error_8 = _a.sent();
                            this.showError(error_8, "Rezept wurde nicht zur SPS übertragen.");
                            return [3 /*break*/, 15];
                        case 13: 
                        // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
                        return [4 /*yield*/, this.makePaList()];
                        case 14:
                            // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        /** aktiviert/deaktiviert PA-Nr. */
        RezDlg.prototype.sendPaToOpus = function (status, paNummer, rezNummer, prodTyp, ablieferZone, rework) {
            return __awaiter(this, void 0, void 0, function () {
                var paNr, txt, ret, sResp_1, _t, resp, sResp, error_9, ex, msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            paNr = typeof paNummer !== "string" ? paNummer.toString() : paNummer;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!(["33333", "77777", "88888", "99999", "0"].includes(paNr) ||
                                prodTyp == "DU")) return [3 /*break*/, 3];
                            txt = "Auftrag: " + paNr + " in SPS";
                            ret = status === rezepturEnums_1.PaStatus.start
                                ? [txt + " gestartet!", "LimeGreen", rezepturEnums_1.LogType.OK]
                                : [txt + " beendet!", "Orange", rezepturEnums_1.LogType.OK];
                            this.AddLog(ret[0], status === rezepturEnums_1.PaStatus.start ? rezepturEnums_1.LogType.PA_Start : rezepturEnums_1.LogType.PA_Stopp);
                            return [4 /*yield*/, this.paAktion({ paNr: paNr, rzNr: rezNummer || 0, status: rezepturEnums_1.PaStatus[status], })];
                        case 2:
                            sResp_1 = _a.sent();
                            console.info("%c" + sResp_1, "color:orange");
                            // weil es sich um Dummy-Auftr. handelt hier ende
                            return [2 /*return*/, ret[0]];
                        case 3:
                            // -----------------------------------------------------
                            // -- Option 2 -- es handelt sich um die OPUS-Aufträge.
                            // -----------------------------------------------------
                            // optionale Parameter verarbeiten
                            rework = rework || false;
                            ablieferZone = ablieferZone || -1;
                            return [4 /*yield*/, rezService_1.rezService.PaStartStop({
                                    AnlagenNr: this.anlage(),
                                    ProdAufNummer: paNummer,
                                    Status: status,
                                    AblieferZone: ablieferZone,
                                    AnswerRework: rework,
                                    userName: this.userName(),
                                    prodTyp: prodTyp,
                                })];
                        case 4:
                            _t = _a.sent();
                            resp = _t["PaStartStopResult"] || _t["PaStartStopTestEnvResult"];
                            this.AddLog("OPUS -> UserMsg: " + resp.UserMsg + ", CallId: " + resp.CallId + ", DBRqID: " + resp.DBRqID, status === rezepturEnums_1.PaStatus.start ? rezepturEnums_1.LogType.PA_Start : rezepturEnums_1.LogType.PA_Stopp);
                            return [4 /*yield*/, this.paAktion({
                                    paNr: paNr,
                                    rzNr: rezNummer || 0,
                                    status: rezepturEnums_1.PaStatus[status],
                                })];
                        case 5:
                            sResp = _a.sent();
                            console.info("%c" + sResp, "color:orange");
                            return [2 /*return*/, "OPUS -> UserMsg: " + resp.UserMsg + ", CallId: " + resp.CallId + ", DBRqID: " + resp.DBRqID];
                        case 6:
                            error_9 = _a.sent();
                            // da OPUS bei n. gefundenen PA's Antwort 500 zurücksendet, wird an der Stelle Zusatzinfo ausgewertet
                            console.log("OPUS -> Error\n" + JSON.stringify(error_9));
                            ex = JSON.stringify(rezUtils_1.default.xmlToJson($(error_9.responseText)[0]));
                            console.log(ex);
                            msg = JSON.parse(ex).REASON.TEXT["#text"];
                            this.AddLog(msg, rezepturEnums_1.LogType.Abbruch);
                            throw new Error("OPUS -> " + msg);
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /** sendet ausgewählte Rezeptdaten zur SPS */
        RezDlg.prototype.sendToSps = function (RezNr, RezVer, fltr) {
            if (fltr === void 0) { fltr = this.filter; }
            return __awaiter(this, void 0, void 0, function () {
                var self, filter, start, response, ret, info, error_10, end;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            filter = [];
                            Array.isArray(fltr) ? (filter = filter.concat(fltr)) : filter.push(fltr);
                            start = performance.now();
                            this.AddLog("Sende " + this.varListeRows().length + " Rez. Var. \u00FCber LibNoDave zur SPS. Rez.Nr.: " + RezNr + ", Vers.: " + RezVer + ", Filter: " + filter, rezepturEnums_1.LogType.OK);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, Promise.all(filter.map(function (fltr) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, rezService_1.rezService.WriteToSpsRez({
                                                    WfServer: self.serverName,
                                                    WfDb: self.databaseName,
                                                    Werk: self.werk,
                                                    Halle: self.halle,
                                                    Etage: self.etage,
                                                    Linie: self.linie,
                                                    Abteil: self.abteiNr,
                                                    Maschine: self.maschine,
                                                    RezeptNr: RezNr,
                                                    RezeptVer: RezVer,
                                                    WfFilter: fltr,
                                                })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); }))];
                        case 2:
                            response = _a.sent();
                            response.map(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var values, _a, name_2, value, toSendValues;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!res.WriteToSpsRezResult.Succeed) {
                                                // throw new Error(res.WriteToSpsRezResult.ErrorMsg.toString());
                                                console.error(res.WriteToSpsRezResult.ErrorMsg.toString());
                                            }
                                            if (!Array.isArray(res.WriteToSpsRezResult.Data)) return [3 /*break*/, 2];
                                            values = {};
                                            _a = __read(__spread(res.WriteToSpsRezResult.Data).toString()
                                                .split("|"), 2), name_2 = _a[0], value = _a[1];
                                            values[name_2] = value;
                                            toSendValues = this.filteredValues(values);
                                            this.AddLog("Sende Virtuelle Var. | " + JSON.stringify(toSendValues), this.logTyp);
                                            return [4 /*yield*/, this.connector.writeSignals(toSendValues)];
                                        case 1:
                                            _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, self.writeRezDatSps(RezNr, RezVer)];
                        case 3:
                            ret = _a.sent();
                            info = "Rezept: " + self.rezInfo() + " erfolgreich zur SPS \u00FCbertragen!";
                            Logger.successToast(info);
                            this.AddLog(info, rezepturEnums_1.LogType.OK);
                            return [2 /*return*/, ret];
                        case 4:
                            error_10 = _a.sent();
                            Logger.error(self, error_10.message, error_10.stack);
                            self.AddLog("Fehler - " + error_10.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            throw error_10;
                        case 5:
                            end = performance.now();
                            if (end - start <= 5000) {
                                console.log("Ausf\u00FChrungszeit: von 'sendToSps()' " + (end - start) + " ms. Buttons blokieren f\u00FCr 5000 ms.");
                                this.fnExecutionTime(true);
                            }
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /** führt Login aus um die Schreibrechte für DB2(IBM) zu erlangen */
        RezDlg.prototype.userLog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, promise, dlgResult, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            if (self.adminIsLogged()) {
                                return [2 /*return*/, true]; // Promise.resolve()
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dialog.show(new LoginDialog())];
                        case 2:
                            promise = _a.sent();
                            dlgResult = promise;
                            if (dlgResult.state === 1) {
                                self.adminIsLogged(true);
                                self.adminName(dlgResult.vorname + " " + dlgResult.nachname);
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _a.sent();
                            self.showError(error_11, "Fehler beim User-Logging");
                            self.AddLog("Fehler beim Anmelden" + " - " + error_11.toString(), rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** fargt Faktor u. Pilotlevel ab um das Speichern zu erlauben/verbieten
         * @returns  true = Freigabe
         * @returns false = keine Freigabe
         */
        RezDlg.prototype.checkFactor = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, infoHead, infoTxt, showBox;
                return __generator(this, function (_a) {
                    self = this;
                    infoHead = "";
                    infoTxt = "";
                    showBox = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var info, _a, response, dispose;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        info = "Speichern untersagt! " + infoHead + "%";
                                        self.AddLog(info, rezepturEnums_1.LogType.Abbruch);
                                        return [4 /*yield*/, dialog.show(new MsgBox(info, "Die Sollwerte sind durch die \u00C4nderung des " + infoTxt + " ge\u00E4ndert.<br>Es wird empfohlen, das Rezept neu zu laden!", "Orange"))];
                                    case 1:
                                        _a = __read.apply(void 0, [_b.sent(), 2]), response = _a[0], dispose = _a[1];
                                        dispose();
                                        return [2 /*return*/, false];
                                }
                            });
                        });
                    };
                    // Check Pilotlevel
                    if (!isNullOrUndefined(self.pilotLevel()) && self.pilotLevel() !== 0) {
                        infoHead = "Pilotlevel = " + self.pilotLevel();
                        infoTxt = "Pilotlevels";
                        return [2 /*return*/, Promise.resolve(showBox())];
                    }
                    // Check Massenberechnungsfaktor
                    if (!isNullOrUndefined(self.faktor()) && self.faktor() !== 100) {
                        infoHead = "Faktor = " + self.faktor();
                        infoTxt = "Massenberechnungsfaktors";
                        return [2 /*return*/, Promise.resolve(showBox())];
                    }
                    return [2 /*return*/, Promise.resolve(true)];
                });
            });
        };
        /** Überprüft das externe Freigabebit, um das Laden zu erlauben oder zu verweigern
         * @returns {boolean} true = Freigabe
         * @returns {boolean} false = keine Freigabe
         */
        RezDlg.prototype.checkExtFreigabe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var infoTxt, info, _a, dispose;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!isNullOrUndefined(this.freigabeLaden()) && !this.freigabeLaden())) return [3 /*break*/, 2];
                            infoTxt = !this.grundFreigabeLaden
                                ? "Das Laden wird von externem Signal blockiert."
                                : this.grundFreigabeLaden;
                            info = "Laden untersagt! Freigabe Laden = " + this.freigabeLaden();
                            this.AddLog(info, rezepturEnums_1.LogType.Abbruch);
                            return [4 /*yield*/, dialog.show(new MsgBox(info, infoTxt, "Tomato"))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), dispose = _a[1];
                            dispose();
                            return [2 /*return*/, false];
                        case 2: return [2 /*return*/, Promise.resolve(true)];
                    }
                });
            });
        };
        /**
         * Überprüft, ob unkommentierte Störungen vorliegen
         * @returns {boolean} true = Freigabe
         * @returns {boolean} false = keine Freigabe
         */
        RezDlg.prototype.checkFaultReport = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ret, respFaultCount, infoTxt, info, msg, ex_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ret = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 8]);
                            return [4 /*yield*/, rezService_1.rezService.GetFaultCount(this.zaehler() || this.anlage())];
                        case 2:
                            respFaultCount = (_a.sent()).GetFaultCountResult;
                            if (!respFaultCount.Succeed) {
                                throw new Error(respFaultCount.Msg);
                            }
                            this.AddLog(respFaultCount.Data + " - unkommentierte St\u00F6rungen.", rezepturEnums_1.LogType.Debug);
                            if (!(typeof respFaultCount.Data === "number" && respFaultCount.Data !== 0)) return [3 /*break*/, 4];
                            infoTxt = "Bitte kommentieren Sie die anstehenden Störmeldungen. ";
                            info = "Laden untersagt! Anzahl unkommentierter St\u00F6rungen: " + respFaultCount.Data;
                            msg = new MsgBox(info, infoTxt, "Tomato");
                            // this.CloseModal = this.closeChild.close.bind(msg);
                            return [4 /*yield*/, dialog.show(msg)];
                        case 3:
                            // this.CloseModal = this.closeChild.close.bind(msg);
                            _a.sent();
                            ret = false;
                            return [3 /*break*/, 5];
                        case 4:
                            ret = true;
                            _a.label = 5;
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            ex_4 = _a.sent();
                            this.AddLog("Fehler: " + ex_4.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            return [4 /*yield*/, dialog.show(new MsgBox("Fehler", ex_4.message, "Tomato"))];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, ret];
                    }
                });
            });
        };
        /** (Html-Button-Action) Zeige Rez. Logs. */
        RezDlg.prototype.btnShowLogs = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var dlg, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            70;
                            e.preventDefault(); // verhindert das Standardverhalten des Buttons
                            e.target.blur(); // remove focus from button
                            if (this.CloseModal)
                                this.CloseModal();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            dlg = new cwRezDlgLogs(this.anlage());
                            // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
                            this.CloseModal = this.closeChild.close.bind(dlg);
                            return [4 /*yield*/, dialog.show(dlg)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_12 = _a.sent();
                            this.showError(error_12, "Fehler beim Anzeigen der Rezept-Logs");
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) Zeige Setup Dlg. */
        RezDlg.prototype.btnShowSetup = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var dlg, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault(); // verhindert das Standardverhalten des Buttons
                            e.target.blur(); // remove focus from button
                            if (this.CloseModal)
                                this.CloseModal();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            dlg = new cwRezDlgSetup([this.configDataSpsCfg, this.configDataDlgCfg, this.rezDlgProperties]);
                            // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
                            this.CloseModal = this.closeChild.close.bind(dlg);
                            return [4 /*yield*/, dialog.show(dlg)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_13 = _a.sent();
                            this.showError(error_13, "Fehler beim Anzeigen der Rezept-Setup");
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) schreibt Rezept (Datentabelle) */
        RezDlg.prototype.btnSaveRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, dlg, dialogResult, _b, tmpRequest, _c, _d, iVarListeRow, response, info, resp, error_14, info;
                var e_4, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            this.AddLog("*** Btn. 'Rez. Speichern' geklickt ***", this.logTyp);
                            return [4 /*yield*/, this.checkFactor()];
                        case 1:
                            _a = !(_f.sent());
                            if (_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userLog()];
                        case 2:
                            _a = !(_f.sent());
                            _f.label = 3;
                        case 3:
                            if (_a)
                                return [2 /*return*/];
                            _f.label = 4;
                        case 4:
                            _f.trys.push([4, 10, 11, 12]);
                            dlg = new SaveDialog(this.selectedRecipe.Nr(), this.selectedRecipe.Vers(), this.selectedRecipe.Descrp(), {
                                werk: this.werk,
                                halle: this.halle,
                                etage: this.etage,
                                linie: this.linie,
                                maschine: this.maschine,
                                abteiNr: this.abteiNr,
                                anlagenNr: this.anlage(),
                            }, !!this.rezVer());
                            // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
                            this.CloseModal = this.closeChild.close.bind(dlg);
                            return [4 /*yield*/, dialog.show(dlg)];
                        case 5:
                            dialogResult = _f.sent();
                            if (dialogResult.state !== "save" ||
                                !(dialogResult.rezNr || dialogResult.rezName)) {
                                Logger.warn(this, "Rezept-Dlg. Abbruch!", dialogResult.state, dialogResult.rezNr, dialogResult.rezName);
                                this.AddLog("Rezept-Dlg. wurde geschlossen, ohne zu speichern", rezepturEnums_1.LogType.Abbruch_durch_Bediener);
                                // throw new Error("Rezept-Dlg. Abbruch!")
                                return [2 /*return*/];
                            }
                            // Lade-Spinner zeigen
                            this.isLoading(true);
                            // Variablenvalues erfrischen
                            _b = this;
                            return [4 /*yield*/, this.RezValues.getRezValues(this.varListe)];
                        case 6:
                            // Variablenvalues erfrischen
                            _b.varListe = _f.sent();
                            tmpRequest = [];
                            try {
                                for (_c = __values(this.varListe), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    iVarListeRow = _d.value;
                                    // Variablen in JSON-Formatieren
                                    tmpRequest.push({
                                        // falls die globale Variable vorhanden, dann Aliasname mit der globalen Var.Namen
                                        // AliasName: iVarListeRow.AliasGlobal != "" ? iVarListeRow.AliasGlobal : iVarListeRow.Aliasname,
                                        AliasName: iVarListeRow.AliasGlobal || iVarListeRow.Aliasname,
                                        Adresse: iVarListeRow.Name,
                                        Factor: iVarListeRow.Factor,
                                        Description: iVarListeRow.Description,
                                        Value: iVarListeRow.Value,
                                    });
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [4 /*yield*/, rezService_1.rezService.WriteToDB({
                                    Data: tmpRequest,
                                    User: this.adminName(),
                                    Werk: this.werk,
                                    Halle: this.halle,
                                    Etage: this.etage,
                                    Linie: this.linie,
                                    Abteil: this.abteiNr,
                                    Maschine: this.maschine,
                                    RezeptNr: dialogResult.rezNr,
                                    RezeptVer: dialogResult.rezVer,
                                    RezeptName: dialogResult.rezName,
                                })];
                        case 7:
                            response = _f.sent();
                            if (!response.WriteToDBResult.Succeed) {
                                throw new Error(response.WriteToDBResult.ErrorMsg.toString());
                            }
                            return [4 /*yield*/, this.rezGespeichert({
                                    id: null,
                                    paNr: this.selectedPaData.PaNr() || 0,
                                    rzNr: dialogResult.rezNr,
                                    rzVer: dialogResult.rezVer,
                                    rzName: dialogResult.rezName,
                                })];
                        case 8:
                            _f.sent();
                            info = "Rezept " + dialogResult.rezNr + " - " + dialogResult.rezName + " gespeichert!";
                            Logger.successToast(info);
                            this.AddLog(info, rezepturEnums_1.LogType.OK);
                            return [4 /*yield*/, this.writeRezDatSps(dialogResult.rezNr, dialogResult.rezVer)];
                        case 9:
                            resp = _f.sent();
                            this.loadRezList(160);
                            return [2 /*return*/, resp];
                        case 10:
                            error_14 = _f.sent();
                            info = "Rezept wurde nicht gespeichert.";
                            this.showError(error_14, info);
                            this.AddLog(info + " -> " + error_14, rezepturEnums_1.LogType.Abbruch);
                            return [3 /*break*/, 12];
                        case 11:
                            // Lade-Spinner ausblenden
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        /** Fehleranzeige */
        RezDlg.prototype.showError = function (ex, msg) {
            return __awaiter(this, void 0, void 0, function () {
                var info, _a, response, dispose;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            info = rezUtils_1.default.msgCut(msg) + "<br><br>" + rezUtils_1.default.msgCut(ex) + "<br>" + rezUtils_1.default.msgCut(ex.message);
                            this.AddLog(info, rezepturEnums_1.LogType.Abbruch);
                            return [4 /*yield*/, dialog.show(new MsgBox("Vorgang abgebrochen", info, "Tomato"))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), response = _a[0], dispose = _a[1];
                            dispose();
                            this.AddLog(ex.message, this.logTyp);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** schreibt Signale mittels WF-Connector Rez.-Nr., Pilotlevel, Faktor und Gebindeanzahl in SPS */
        RezDlg.prototype.writeRezDatSps = function (rezNummer, rezVersion) {
            return __awaiter(this, void 0, void 0, function () {
                var values, toSendValues, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!rezNummer || (rezVersion !== 0 && !rezVersion)) {
                                throw new Error("Rez-/Versionsnummer fehlt.");
                            }
                            values = {};
                            // Rezeptnummer falls Var. deklariert schreiben
                            values[this.signalNameRezNr] = rezNummer;
                            // Rezeptversion falls Var. deklariert schreiben
                            values[this.signalNameVerNr] = rezVersion;
                            // Netznummer falls Var. deklariert schreiben
                            values[this.signalNameNetzNr] = this.selectedPaData.NetzNr();
                            // Pilotlevel falls eingegeben auf 0 schreiben
                            values[this.signalNamePilotLevel] = 0;
                            // Faktor falls eingegeben auf 100% schreiben
                            values[this.signalNameFaktor] = 100;
                            toSendValues = this.filteredValues(values);
                            this.AddLog("Sende Rez-/PA-/V- Nr. zur SPS: " + JSON.stringify(toSendValues), this.logTyp);
                            return [4 /*yield*/, this.connector.writeSignals(toSendValues)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_15 = _a.sent();
                            this.AddLog(error_15.message + ", " + error_15.stack, this.logTyp);
                            throw error_15;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Weist die SPS-Konfigurationsnummer basierend auf dem Produkttyp (`ProdTyp`) zu.
         *
         * Diese Methode überprüft, ob der aktuelle Produkttyp (`ProdTyp`) in der dynamischen
         * Zuordnungstabelle `dynamicProdTypToSpsCfg` vorhanden ist. Falls ja, wird die entsprechende
         * SPS-Konfigurationsnummer zusammen mit dem Produkttyp zurückgegeben.
         * Andernfalls wird ein Logeintrag mit einer Fehlermeldung erzeugt.
         *
         * @param {any} prodTyp - Der Produkttyp-Wert, der überprüft und zugeordnet werden soll.
         * @returns {{ prodTyp: number, cfg: number }} Ein Objekt mit Produkttyp und zugewiesener Konfigurationsnummer.
         */
        RezDlg.prototype.assignSpsCfg = function (rawProdTyp) {
            var result = { prodTyp: 0, cfg: 0 };
            var parsedProdTyp = Number(rawProdTyp);
            result.prodTyp = parsedProdTyp;
            if (this.dynamicProdTypToSpsCfg.has(parsedProdTyp)) {
                result.cfg = this.dynamicProdTypToSpsCfg.get(parsedProdTyp);
            }
            else {
                this.AddLog("[assignSpsCfg] Kein Eintrag f\u00FCr Produkttyp '" + parsedProdTyp + "' in der dynamischen Konfiguration gefunden.", this.logTyp);
            }
            return result;
        };
        /**
         * PA-Nr. & PA-Aktiv sowie PA-Zeitstempel (falls vorhanden) in SPS schreiben
         * @param paAktivFlag true = Aktivieren; false = Deaktivieren @example "YYY-M-DD HH:mm:ss" => "2000-01-01 00:00:00.000"
         * @param paStartDT (optional) Zeitstempel für PA-Sart in DT-Format
         * @param paStopDT (optional) Zeitstempel für PA-Sopp in DT-Format
         * @param paLeistung (optional) Planleistung
         */
        RezDlg.prototype.writePaDatSps = function (paAktivFlag, paStartDT, paStopDT, paLeistung, ofenstart, PaNr, RezNr) {
            return __awaiter(this, void 0, void 0, function () {
                var values, dt, dt, resolve, toSendValues, start, data, info, key, config, typ, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = {};
                            if (!paAktivFlag) return [3 /*break*/, 3];
                            values[this.signalNamePaNr] = this.selectedPaData.PaNr() || PaNr;
                            values[this.signalNameRezNr] = this.selectedPaData.RezNr() || RezNr;
                            values[this.signalNameNetzNr] = this.selectedPaData.NetzNr();
                            values[this.signalNamePaAktiv] = -1;
                            // optionale Parameter
                            if (paStartDT !== void 0 && this.signalNamePaStart) {
                                if (typeof this.signalNamePaStart === "string") {
                                    values[this.signalNamePaStart] = moment(paStartDT, "DD.MM.YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                                }
                                else {
                                    dt = moment(moment(paStartDT, "DD.MM.YYY HH:mm:ss"));
                                    values[this.signalNamePaStart.tag.name] = dt.date();
                                    values[this.signalNamePaStart.monat.name] = dt.month() + 1;
                                    values[this.signalNamePaStart.jahr.name] = dt.year();
                                    values[this.signalNamePaStart.stunde.name] = dt.hour();
                                    values[this.signalNamePaStart.minute.name] = dt.minute();
                                    values[this.signalNamePaStart.sekunde.name] = dt.second();
                                }
                            }
                            if (paStopDT !== void 0 && this.signalNamePaStop) {
                                if (typeof this.signalNamePaStop === "string") {
                                    values[this.signalNamePaStop] = moment(paStopDT, "DD.MM.YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                                }
                                else {
                                    dt = moment(moment(paStopDT, "DD.MM.YYY HH:mm:ss"));
                                    values[this.signalNamePaStop.tag.name] = dt.date();
                                    values[this.signalNamePaStop.monat.name] = dt.month() + 1;
                                    values[this.signalNamePaStop.jahr.name] = dt.year();
                                    values[this.signalNamePaStop.stunde.name] = dt.hour();
                                    values[this.signalNamePaStop.minute.name] = dt.minute();
                                    values[this.signalNamePaStop.sekunde.name] = dt.second();
                                }
                            }
                            if (paLeistung !== void 0 && this.signalNamePlanLeistung) {
                                values[this.signalNamePlanLeistung] = paLeistung;
                            }
                            if (!(this.signalNameGebindeanzahl != "")) return [3 /*break*/, 2];
                            return [4 /*yield*/, rezService_1.rezService.Gebindemenge(this.selectedPaData.RezNr())];
                        case 1:
                            resolve = (_a.sent()).GebindemengeResult;
                            if (!resolve.Succeed)
                                throw new Error(resolve.ErrorMsg);
                            values[this.signalNameGebindeanzahl] = resolve.Data.Stueck;
                            _a.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            // Merker Übergang Prod.Typ 'RR' -> 0 bilden.
                            this.isRRToZero =
                                this.paTyp() == 9 && this.selectedPaData.ProdTyp() == "RR";
                            if (this.isRRToZero) {
                                this.AddLog("Merker Übergang von 'RR' -> 0 für Nachlaufzeit gesetzt.", this.logTyp);
                            }
                            if (this.signalNamePaStart) {
                                if (typeof this.signalNamePaStart === "string") {
                                    values[this.signalNamePaStart] = "2000-01-01 00:00:00";
                                }
                                else {
                                    values[this.signalNamePaStart.tag.name] = "1";
                                    values[this.signalNamePaStart.monat.name] = "1";
                                    values[this.signalNamePaStart.jahr.name] = "0";
                                    values[this.signalNamePaStart.stunde.name] = "0";
                                    values[this.signalNamePaStart.minute.name] = "0";
                                    values[this.signalNamePaStart.sekunde.name] = "0";
                                }
                            }
                            if (this.signalNamePaStop) {
                                if (typeof this.signalNamePaStop === "string") {
                                    values[this.signalNamePaStop] = "2000-01-01 00:00:00";
                                }
                                else {
                                    values[this.signalNamePaStop.tag.name] = "1";
                                    values[this.signalNamePaStop.monat.name] = "1";
                                    values[this.signalNamePaStop.jahr.name] = "0";
                                    values[this.signalNamePaStop.stunde.name] = "0";
                                    values[this.signalNamePaStop.minute.name] = "0";
                                    values[this.signalNamePaStop.sekunde.name] = "0";
                                }
                            }
                            // alle PA-Values in  der SPS auf 0 schreiben
                            values[this.signalNamePaNr] = 0;
                            values[this.signalNamePaAktiv] = 0;
                            values[this.signalNameProdTyp] = 0;
                            values[this.signalNameNetzNr] = 0;
                            values[this.signalNameSpsCnfg] = 0;
                            // Rez. Nummer- Version auf 0 schreiben
                            values[this.signalNameRezNr] = 0;
                            values[this.signalNameVerNr] = 0;
                            values[this.signalNamePlanLeistung] = 0;
                            values[this.signalNameGebindeanzahl] = 0;
                            values[this.signalNamePilotLevel] = 0;
                            values[this.signalNameFaktor] = 100;
                            values[this.signalNameRework] = 0;
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 7, , 8]);
                            toSendValues = this.filteredValues(values);
                            this.AddLog("Sende " + (paAktivFlag ? "Rez. Werte" : "Default 0-Werte") + " zur SPS: " + JSON.stringify(toSendValues), this.logTyp);
                            start = performance.now();
                            return [4 /*yield*/, this.connector.writeSignals(toSendValues)];
                        case 5:
                            data = _a.sent();
                            if (!data.successful) {
                                info = "";
                                for (key in values) {
                                    if (values.hasOwnProperty(key))
                                        info += key + "=" + values[key] + "</br>";
                                }
                                // da errorMessage bei WF V3.6 keine brauchbare Infos liefert, wird hier die Custom-Info ausgeben.
                                // Um die Fehlerdetails zu sehen, WF Activity Analyser auf dem Server benutzen.
                                // throw data.errorMessage + info;
                                throw "Fehler beim Schreiben: " + "</br>" + info;
                            }
                            if (!(this.isRRToZero || paAktivFlag))
                                return [2 /*return*/, data];
                            Object.keys(values).forEach(function (key) { return delete values[key]; }); // Werte-Objekt leeren
                            config = null;
                            if (this.isRRToZero) {
                                this.isRRToZero = false;
                                config = this.assignSpsCfg(rezepturEnums_1.eProdTyp.NL);
                            }
                            else if (ofenstart) {
                                config = this.assignSpsCfg(rezepturEnums_1.eProdTyp.OF);
                            }
                            else {
                                typ = this.selectedPaData.ProdTyp();
                                config = this.assignSpsCfg(rezepturEnums_1.eProdTyp[typ]);
                            }
                            values[this.signalNameProdTyp] = config.prodTyp;
                            values[this.signalNameSpsCnfg] = config.cfg;
                            // setTimeout(async () => {
                            // Werte mittels WF-Connector in SPS schreiben
                            toSendValues = this.filteredValues(values);
                            this.AddLog("Sende Konfig. zur SPS: " + JSON.stringify(toSendValues), this.logTyp);
                            return [4 /*yield*/, this.connector.writeSignals(toSendValues)];
                        case 6:
                            _a.sent();
                            // }, 1000);
                            return [2 /*return*/, data];
                        case 7:
                            error_16 = _a.sent();
                            throw error_16;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /** füllt die Variablentabelle */
        RezDlg.prototype.fillTable = function () {
            return __awaiter(this, void 0, void 0, function () {
                var headArr, bodyArr;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headArr = { cells: this.Tab.getHeadData(this.varListe) };
                            this.varListeHead(headArr);
                            // Rows
                            this.varListeRows.removeAll();
                            bodyArr = this.Tab.getBodyData(this.varListe);
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var e_5, _a;
                                    try {
                                        var tmp = [];
                                        try {
                                            for (var bodyArr_1 = __values(bodyArr), bodyArr_1_1 = bodyArr_1.next(); !bodyArr_1_1.done; bodyArr_1_1 = bodyArr_1.next()) {
                                                var bodyCell = bodyArr_1_1.value;
                                                tmp.push({ cells: bodyCell });
                                            }
                                        }
                                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                        finally {
                                            try {
                                                if (bodyArr_1_1 && !bodyArr_1_1.done && (_a = bodyArr_1.return)) _a.call(bodyArr_1);
                                            }
                                            finally { if (e_5) throw e_5.error; }
                                        }
                                        var array = _this.varListeRows();
                                        ko.utils.arrayPushAll(array, tmp);
                                        _this.varListeRows.valueHasMutated();
                                        resolve();
                                    }
                                    catch (error) {
                                        _this.AddLog("%c" + error, _this.logTyp);
                                        reject(error);
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** erstellt Rezeptliste/Tabelle für aktuelle Anlage */
        RezDlg.prototype.makeRezList = function (row) {
            return __awaiter(this, void 0, void 0, function () {
                var head, key, splited, bodyArr, bodyArr_2, bodyArr_2_1, bodyCell;
                var e_6, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Rezept-Label Information löschen
                            this.selectedRecipe.Nr("");
                            this.selectedRecipe.Vers("");
                            this.selectedRecipe.Descrp("");
                            this.rezRows.removeAll();
                            // diese Verzögerung nur f. Animation des "badge"-Anzeige notwendig
                            return [4 /*yield*/, rezUtils_1.default.sleep(100)];
                        case 1:
                            // diese Verzögerung nur f. Animation des "badge"-Anzeige notwendig
                            _b.sent();
                            head = {
                                cells: ["Nummer", "Version", "Beschreibung", "erstellt", "geändert"],
                            };
                            this.rezHead(head);
                            // Zeilen
                            for (key in row) {
                                if (row.hasOwnProperty(key)) {
                                    splited = row[key].split("|");
                                    bodyArr = this.Tab.getBodyData([
                                        {
                                            Nummer: splited[0],
                                            Version: splited[1],
                                            Beschreibung: splited[2],
                                            erstellt: "am " + splited[3] + " von " + rezUtils_1.default.stringUgly(splited[4]),
                                            geändert: "am " + splited[5] + " von " + rezUtils_1.default.stringUgly(splited[6]),
                                        },
                                    ]);
                                    try {
                                        for (bodyArr_2 = (e_6 = void 0, __values(bodyArr)), bodyArr_2_1 = bodyArr_2.next(); !bodyArr_2_1.done; bodyArr_2_1 = bodyArr_2.next()) {
                                            bodyCell = bodyArr_2_1.value;
                                            this.rezRows.push({
                                                cells: bodyCell,
                                            });
                                        }
                                    }
                                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                    finally {
                                        try {
                                            if (bodyArr_2_1 && !bodyArr_2_1.done && (_a = bodyArr_2.return)) _a.call(bodyArr_2);
                                        }
                                        finally { if (e_6) throw e_6.error; }
                                    }
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RezDlg.prototype.columnHideShow = function (id) {
            $("#" + id + " .toggleDisplay").toggle();
        };
        /** erstellt PA-Liste/Tabelle für aktuelle Anlage */
        RezDlg.prototype.makePaList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, _t, resp, headArr, bodyArr, aDummys, ex_5;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // this.selectedPaData.PaNr(null);
                            // this.selectedPaData.RezNr(null);
                            // this.selectedPaData.Name(null);
                            this.paRows.removeAll();
                            this.selectedFltrPa(null); // Filter zurücksetzen
                            this.paListStateBusy(true);
                            this.paListStateTimeout(false);
                            self = this;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, rezService_1.rezService.PaNr(this.anlage())];
                        case 2:
                            _t = _b.sent();
                            resp = _t["PaNrResult"] || _t["PaNrTestEnvResult"];
                            if (!resp.Succeed)
                                throw resp.ErrorMsg;
                            headArr = {
                                cells: this.Tab.getHeadData(resp.Data),
                            };
                            this.paHead(headArr);
                            bodyArr = this.Tab.getBodyData(resp.Data);
                            (_a = this.paRows).push.apply(_a, __spread(bodyArr.map(function (bodyCell) { return ({ cells: bodyCell }); })));
                            // PA.Liste aufklappen
                            $("#" + this.idCollapsePaList()).collapse("show");
                            aDummys = [];
                            this.configDataDlgCfg.Auftr_33333_Enabl && aDummys.push("33333");
                            this.configDataDlgCfg.Auftr_77777_Enabl && aDummys.push("77777");
                            this.configDataDlgCfg.Auftr_88888_Enabl && aDummys.push("88888");
                            this.configDataDlgCfg.Auftr_99999_Enabl && aDummys.push("99999");
                            // Dummy-Afträge in die PA-Tabelle laden
                            if (aDummys.length !== 0) {
                                aDummys.forEach(function (paNr) {
                                    return self.addDummy(paNr, paNr === (self.paNr() && self.paNr().toString())
                                        ? self.paAktiv() || self.paTyp()
                                        : 0);
                                });
                            }
                            return [2 /*return*/];
                        case 3:
                            ex_5 = _b.sent();
                            this.paListStateTimeout(true);
                            Logger.errorToast(rezUtils_1.default.msgCut(ex_5.message, 100) + "...");
                            this.AddLog(ex_5.message, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler);
                            throw ex_5;
                        case 4:
                            this.paListStateBusy(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /** Überprüfen der relevanten Elemente und Setzen von Symbolen entsprechend ihrem Status */
        RezDlg.prototype.symbolStatusPa = function () {
            $(".clRezeptDlg [data-typ]").each(function (index, elem) {
                if (elem.getAttribute("data-typ") === "PaStatus") {
                    // Vorherige Klassen gegebenenfalls entfernen.
                    $(this).removeClass("paStart paPause paStop");
                    var sig = Number(this.innerHTML);
                    switch (sig) {
                        case -1: // PA Aktiv als Bit ausgewertet wird (alte Art und Weise)
                        case 1: // PA Aktiv als Byte ausgewertet wird (neue Art und Weise)
                        case 9:
                        case 253:
                            $(this)
                                .addClass("paStart")
                                .attr("title", "OPUS-Status: PA-gestartet. Index [" + sig + "]");
                            break;
                        case 2:
                            $(this)
                                .addClass("paPause")
                                .attr("title", "OPUS-Status: PA-pausiert. Index [" + sig + "]");
                            break;
                        case 3:
                            $(this)
                                .addClass("paStop")
                                .attr("title", "OPUS-Status: PA-gestoppt. Index [" + sig + "]");
                            break;
                        case 255:
                            $(this)
                                .addClass("paStart")
                                .attr("title", "Dummyauftrag gestartet. Index [" + sig + "]");
                            break;
                        default:
                            $(this)
                                .addClass("")
                                .attr("title", "n. in Bearbeitung. Index [" + sig + "]");
                            break;
                    }
                }
                if (elem.getAttribute("data-typ") === "ProdTyp") {
                    // Vorherige Klassen gegebenenfalls entfernen.
                    $(this).removeClass("paTypPV paTypPB paTypPF paTypPU paTypPL paTypRR paTypOF paTypDU paTypNL paTypProduktion");
                    switch (this.innerHTML) {
                        case "PV":
                            $(this)
                                .addClass("paTypPV")
                                .attr("title", "Produktion Vorprodukt. Index [1]");
                            break;
                        case "PB":
                            $(this)
                                .addClass("paTypPB")
                                .attr("title", "Produktion Basisartikel. Index [2]");
                            break;
                        case "PF":
                            $(this)
                                .addClass("paTypPF")
                                .attr("title", "Produktion Fertigartikel. Index [3]");
                            break;
                        case "PU":
                            $(this)
                                .addClass("paTypPU")
                                .attr("title", "Nachpackauftrag. Index [4]");
                            break;
                        case "PL":
                            $(this)
                                .addClass("paTypPL")
                                .attr("title", "Produktion Linie. Index [5]");
                            break;
                        case "RR":
                            $(this)
                                .addClass("paTypRR")
                                .attr("title", "Reinigungsauftrag. Index [9]");
                            break;
                        case "NL":
                            $(this)
                                .addClass("paTypNL")
                                .attr("title", "Nachlauf-/Trocknungszeit Index [253]");
                            break;
                        case "DU":
                            $(this)
                                .addClass("paTypDU")
                                .attr("title", "Dummyauftrag. Index [255]");
                            break;
                        default:
                            // Prod.Typ-Symbol für Head Infobereich
                            var sig = Number(this.innerHTML);
                            var statusText = $(this).next(".pastatus.text");
                            // Animation zurücksetzen
                            statusText.css("animation", "none");
                            switch (sig) {
                                case -1:
                                case 1:
                                case 3:
                                    $(this)
                                        .addClass("paTypProduktion")
                                        .attr("title", "Produktionsauftrag. SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Lime Green
                                    statusText.text("gestartet").css("color", "limegreen");
                                    break;
                                case 9:
                                    $(this)
                                        .addClass("paTypRR")
                                        .attr("title", "Reinigungsauftrag. SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Maya Blue
                                    statusText.text("Reinigung").css("color", "#74c0fc");
                                    break;
                                case 125:
                                    $(this)
                                        .addClass("paTypOF")
                                        .attr("title", "Produktion Ofen. SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Tenne (Tawny)
                                    statusText
                                        .text("Ofen-Autostart/Aufheizprogramm")
                                        .css("color", "#d35500")
                                        .css("animation", "animation-fade 1.75s linear infinite alternate");
                                    break;
                                case 253:
                                    $(this)
                                        .addClass("paTypNL")
                                        .attr("title", "Nachlauf-/Trocknungszeit SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Purple Heart
                                    statusText
                                        .text("Nachlauf-/Trocknungszeit")
                                        .css("color", "#672AC4")
                                        .css("animation", "animation-fade 2.0s infinite");
                                    break;
                                case 255:
                                    $(this)
                                        .addClass("paTypDU")
                                        .attr("title", "Produktion DUMMY. SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Tangerine Yellow
                                    statusText
                                        .text("Dummy")
                                        .css("color", "#ffcc00")
                                        .css("animation", "animation-fade 2.0s infinite");
                                    break;
                                default:
                                    $(this).attr("title", "Prod.Typ gestoppt. SPS-Statusbyte [" + sig + "]");
                                    // Farbe - Tomato
                                    statusText.text("gestoppt").css("color", "tomato");
                                    break;
                            }
                            break;
                    }
                }
            });
        };
        /** (Html-Button-Action) gewähltes Rezept löschen */
        RezDlg.prototype.btnDeleteRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dlg;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.rezInfo())
                                return [2 /*return*/];
                            return [4 /*yield*/, this.userLog()];
                        case 1:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            dlg = new MsgBox("Rezept löschen?", this.rezInfo(), "Tomato", [
                                { name: "delete", text: "Löschen", btnClassName: "btn btn-danger" },
                                { name: "cancel", text: "Abbrechen", btnClassName: "btn btn-default" },
                            ]);
                            // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
                            this.CloseModal = this.closeChild.close.bind(dlg);
                            dialog
                                .show(dlg)
                                .then(function (_a) {
                                var _b = __read(_a, 2), response = _b[0], dispose = _b[1];
                                if (response !== "delete") {
                                    var info = "Rezept Löschen abgebrochen!";
                                    Logger.warn(_this, info);
                                    _this.AddLog(info, rezepturEnums_1.LogType.Abbruch_durch_Bediener);
                                }
                                else {
                                    _this.updateDataTable(_this.selectedRecipe.Nr().toString(), _this.selectedRecipe.Vers().toString(), 1).then(function (success) {
                                        _this.AddLog("Rezept gelöscht!", rezepturEnums_1.LogType.OK);
                                        _this.loadRezList(999);
                                    });
                                }
                                return dispose;
                            })
                                .then(function (dispose) { return dispose(); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Lebenszeichen von Webservices */
        RezDlg.prototype.watchdog = function () {
            var _this = this;
            this.ws1CallbackId = this.WsWatchdog.addWs1Callback(function (state) {
                _this.ws1State(state);
            });
            this.ws2CallbackId = this.WsWatchdog.addWs2Callback(function (state) {
                _this.ws2State(state);
            });
            this.ws3CallbackId = this.WsWatchdog.addWs3Callback(function (state) {
                _this.ws3State(state);
            });
            this.ws4CallbackId = this.WsWatchdog.addWs4Callback(function (state) {
                _this.ws4State(state);
            });
        };
        /** erzeugt Rezeptliste
         * @param ms Verzögerungszeit in ms
         */
        RezDlg.prototype.loadRezList = function (ms) {
            if (ms === void 0) { ms = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var row, ex_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.rezListStateBusy(true);
                            this.rezListStateTimeout(false);
                            // Filter löschen
                            $("#" + this.idRezFltr()).val("");
                            // Rezeptliste wird nach 'verz'-Zeit refresht
                            return [4 /*yield*/, rezUtils_1.default.sleep(ms)];
                        case 1:
                            // Rezeptliste wird nach 'verz'-Zeit refresht
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, 5, 6]);
                            return [4 /*yield*/, this.callService()];
                        case 3:
                            row = _a.sent();
                            this.makeRezList(row);
                            return [3 /*break*/, 6];
                        case 4:
                            ex_6 = _a.sent();
                            this.rezListStateTimeout(true);
                            return [3 /*break*/, 6];
                        case 5:
                            this.rezListStateBusy(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /** Rezeptliste erfrischen */
        RezDlg.prototype.updateRez = function () {
            this.loadRezList();
        };
        /** Dummy-Eintrag in die PA-Tabelle setzten */
        RezDlg.prototype.addDummy = function (id, state) {
            var _dt = moment().format("DD.MM.YYYY HH:mm:ss");
            var tmpArr;
            // handelt es sich um Reinigungsauftrag?
            if (id === "33333") {
                tmpArr = [
                    state || 0,
                    id,
                    "000000000",
                    "RR",
                    0,
                    0,
                    moment().startOf("year").format("DD.MM.YYYY HH:mm:ss"),
                    moment().endOf("year").format("DD.MM.YYYY HH:mm:ss"),
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    _dt,
                    _dt,
                    0,
                    0,
                    0,
                    -1,
                    this.anlage().toString(),
                    0,
                    -1,
                    -1,
                    1,
                ];
            }
            else
                tmpArr = [
                    state || 0,
                    id,
                    "000000000",
                    "DU",
                    0,
                    0,
                    _dt,
                    moment().add(1, "days").format("DD.MM.YYYY HH:mm:ss"),
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    _dt,
                    _dt,
                    0,
                    0,
                    0,
                    -1,
                    this.anlage().toString(),
                    0,
                    -1,
                    -1,
                    1,
                ];
            this.paRows.push({
                cells: tmpArr,
            });
        };
        /** (Html-Table-Action) selektiert eine Zeile in der PA-Tabelle */
        RezDlg.prototype.paSelect = function (pa, rez) {
            var e_7, _a;
            // selektierte Zeilen deselektieren
            this.rowRemoveSelect("#" + this.idPaTable());
            // selektierte Zeile hervorheben
            $("#" + pa + "_" + this.uid()).toggleClass("selected");
            this.selectedPaData.PaNr(pa);
            this.selectedPaData.RezNr(rez);
            try {
                // Planleistung Informationen aus der selektierten Zeile herausholen
                for (var _b = __values(this.paRows()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var zeile = _c.value;
                    if (zeile.cells[1] === pa) {
                        this.selectedPaData.Status(zeile.cells[0]);
                        this.selectedPaData.PaNr(zeile.cells[1]);
                        this.selectedPaData.RezNr(zeile.cells[2]);
                        this.selectedPaData.ProdTyp(zeile.cells[3]);
                        this.selectedPaData.NetzNr(zeile.cells[5]);
                        this.selectedPaData.Start(zeile.cells[6]);
                        this.selectedPaData.Stop(zeile.cells[7]);
                        this.selectedPaData.Planleistung(zeile.cells[8]);
                        this.selectedPaData.ActivNr(zeile.cells[22]);
                        this.selectedPaData.RespnNr(zeile.cells[23]);
                        break;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            if (this.kennung() === rezepturEnums_1.FnktKennung.paOnly)
                return; // keine Rez. Interaktion, nur PA-Liste
            // es handelt sich um Dummy/Reinig. -Aufträg, filter löschen
            if (["RR", "DU"].includes(this.selectedPaData.ProdTyp())) {
                $("#" + this.idRezFltr()).val("");
                this.changeFilter(this.idRezFltr());
                // Rez.Liste aufklappen
                $("#" + this.idCollapseRezList()).collapse("show");
                return;
            }
            $("#" + this.idRezFltr()).val(rez);
            this.changeFilter(this.idRezFltr());
            // die Anzahl der gleichen Rezeptnummern aus einer Rezeptliste herauszufinden
            var find = this.rezRows()
                .filter(function (cells) { return cells.cells[0] == rez; })
                .map(function (cells) { return cells.cells[0] + "_" + cells.cells[1]; });
            if (find.length === 1) {
                this.rezSelect(find[find.length - 1]);
            }
            else {
                // falls mehrere Einträge gefunden, dann Rez.Liste aufklappen
                $("#" + this.idCollapseRezList()).collapse("show");
                this.rezSelect(rez);
            }
        };
        /** selektiert eine Zeile in der Rezept-Tabelle */
        RezDlg.prototype.rezSelect = function (rez) {
            this.rowRemoveSelect("#" + this.idRezTable());
            $("#" + this.idRezTable() + " tr#" + rez).toggleClass("selected focus");
            this.selectedRecipe.Nr($("#" + rez + " td:eq(0)").text());
            this.selectedRecipe.Vers($("#" + rez + " td:eq(1)").text());
            this.selectedRecipe.Descrp($("#" + rez + " td:eq(2)").text());
        };
        /** Änderung des Filters in der Rez.Listentabelle */
        RezDlg.prototype.changeFilter = function (elem) {
            var tab;
            switch (elem) {
                case this.idPaFltr():
                    tab = "#" + this.idPaTable();
                    break;
                case this.idRezFltr():
                    tab = "#" + this.idRezTable();
                    break;
                default:
                    tab = "#signalTable";
                    break;
            }
            var value = $("#" + elem)
                .val()
                .toLowerCase();
            $(tab + " tr").each(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        };
        /** Dummy-Einträge aktiv-/inaktiv schalten */
        RezDlg.prototype.subDummy = function () {
            var e_8, _a;
            var newArr = this.paRows().map(function (ipaRow) { return ipaRow.cells[1]; }); // zweite Spalte (PaNr)
            try {
                for (var _b = __values(["33333", "77777", "88888", "99999"]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var iId = _c.value;
                    var index = newArr.indexOf(iId);
                    $("#btn" + iId).prop("disabled", index > -1);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        /** sucht Class 'selected' und löscht die */
        RezDlg.prototype.rowRemoveSelect = function (elem) {
            // sucht alle Elemente in den Tabellen nach Klasse 'selected' und löscht die
            var element = elem || "tbody";
            $(element).children().removeClass("selected");
        };
        /** Logs Schreiben wärend Loader angezeigt wird.
         *  Die Logs werden im Hintergrund auch zu Localstorage hizugefügt */
        RezDlg.prototype.writeLoaderLog = function (log) {
            var date = new Date();
            var logVal = "[" + date.toLocaleString() + "." + date
                .getMilliseconds()
                .toString()
                .padStart(3, "0") + "] - " + log;
            // fügt die Log's zu LocalStorage
            var key = "rez_" + date.getTime();
            this.localStorLogWriter.addToLogQueue(key, logVal);
        };
        // Z-Ind. für Loader-Overlay löschen
        RezDlg.prototype.clearZIndexOnLoader = function () {
            // return $(".clCssloadWrapper").css("z-index", "auto");
        };
        RezDlg.prototype.setZIndexOnLoader = function () {
            // Z-Ind. für Loader-Overlay berechen
            // return $(".clCssloadWrapper").css("z-index", CcwContextmenu.zMax() + 1);
        };
        /** schreibt Log in die Datenbank
         * @param msg Log-Message
         * @param logType Meldungstyp
         */
        RezDlg.prototype.AddLog = function (msg, logType) {
            this.debugFlag && this.writeLoaderLog(msg);
            // falls debugging an, dann hier ende
            // if (this.debugFlag && logType === this.logTyp) return;
            Log.Add({
                AnlagenNr: this.anlage(),
                Anlagenname: this.databaseName,
                Zeitstempel: null,
                MeldungsTyp: logType,
                Bediener: ("v: " + this.kompVersion + "; " + this.userInfo() + ";}").replace(/[\n]/gm, "; ").slice(0, 1000),
                Meldung: msg.replace(/<[^>]*>/gm, " ").slice(0, 1000),
                PaNr: parseInt(this.selectedPaData.PaNr()) || 0,
                ArtikelNr: parseInt(this.selectedRecipe.Nr()) || 0,
                Altern: this.shortUid,
                Variante: parseInt(this.selectedRecipe.Vers()) || 0
            });
        };
        /** (Html-RadioBox-Action) vordefinierte Filter setzen */
        RezDlg.prototype.selectedFltrPa = function (radioBox) {
            // Auswahl rücksetzen
            if (!radioBox) {
                this.resetFltrPa();
                return;
            }
            // Text in Filter-Input setzen
            $("#" + this.idPaFltr()).val(radioBox.value);
            // da das checked-Event nicht gebunden werden konnte,
            // wird checked-Propery implizit eigneschaltet
            setTimeout(function () {
                $(radioBox).prop("checked", true);
            }, 10);
            // die PA-Tabelle filtern
            this.changeFilter(this.idPaFltr());
        };
        // Filter-Checkbox auf ersten Item setzen
        RezDlg.prototype.resetFltrPa = function () {
            // Text in Filter-Input auf leer setzen
            $("#" + this.idPaFltr()).val("");
            // Auswahl von Checkbox 'Alle' setzen
            $('input[name="produktion"]#pTypAlle').prop("checked", true);
            return true;
        };
        /**
         * Lädt die SPS--Konfigurationen für eine gegebene Anlagen-Nummer.
         *
         * @param {number} anlagenNr - Die Nummer der Anlage, für die die Konfigurationen geladen werden sollen.
         * @returns {Promise<any>} Ein Promise, das ein Tupel mit der SPS-Konfiguration zurückgibt.
         */
        RezDlg.prototype.loadSpsKonfig = function (anlagenNr) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, konfig, messages;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, rezSpsKonfigCache_1.getCachedSpsKonfig(anlagenNr)];
                        case 1:
                            _a = _b.sent(), konfig = _a.konfig, messages = _a.messages;
                            if (messages.length > 0) {
                                messages.forEach(function (msg) { return _this.AddLog(msg, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler); });
                            }
                            return [2 /*return*/, konfig];
                    }
                });
            });
        };
        /**
       * Lädt die Dlg.-Konfigurationen für eine gegebene Anlagen-Nummer.
       *
       * @param {number} anlagenNr - Die Nummer der Anlage, für die die Konfigurationen geladen werden sollen.
       * @returns {Promise<any>} Ein Promise, das ein Tupel mit der Dlg.-Konfiguration zurückgibt.
       */
        RezDlg.prototype.loadDlgKonfig = function (anlagenNr) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, konfig, messages;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, rezDlgKonfigCache_1.getCachedDlgKonfig(anlagenNr)];
                        case 1:
                            _a = _b.sent(), konfig = _a.konfig, messages = _a.messages;
                            if (messages.length > 0) {
                                messages.forEach(function (msg) { return _this.AddLog(msg, rezepturEnums_1.LogType.Abbruch_durch_Programmfehler); });
                            }
                            return [2 /*return*/, konfig];
                    }
                });
            });
        };
        /** Cleanup */
        RezDlg.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var observablesToDispose, registeredNames, extractNames;
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _b.sent();
                            this.WsWatchdog.removeWs1Callback(this.ws1CallbackId);
                            this.WsWatchdog.removeWs2Callback(this.ws2CallbackId);
                            this.WsWatchdog.removeWs3Callback(this.ws3CallbackId);
                            this.WsWatchdog.removeWs4Callback(this.ws4CallbackId);
                            this.isAlive = false;
                            this.localStorLogWriter.stopProcessing();
                            clearTimeout(this.nIntervId);
                            // clearAllSignalTimeouts
                            Object.keys(this.signalTimeouts).forEach(function (signalName) {
                                clearTimeout(_this.signalTimeouts[signalName]);
                                delete _this.signalTimeouts[signalName];
                            });
                            observablesToDispose = [
                                this.rezInfo,
                                this.ws1StateUI,
                                this.ws2StateUI,
                                this.ws3StateUI,
                                this.ws4StateUI,
                                this.paListStateConnect,
                                this.rezListStateConnect,
                                this.userInfo,
                                this.commonPermission,
                                // this.btnLogTitle,
                                this.btnStartTitle,
                                this.btnStopTitle,
                                this.btnSaveRecipeTitle,
                                this.btnDeleteTitle
                            ];
                            observablesToDispose.forEach(function (observable) { return observable.dispose(); });
                            this.subscriptions.forEach(function (sub) { return sub.dispose(); });
                            registeredNames = [];
                            extractNames = function (obj, recursiveCall) {
                                if (recursiveCall === void 0) { recursiveCall = false; }
                                for (var key in obj) {
                                    var prop = obj[key];
                                    // Rekursiver Aufruf, falls prop selbst ein Objekt ist (aber kein Observable)
                                    if (prop && typeof prop.name === 'object' && !ko.isObservable(prop)) {
                                        extractNames(prop.name, true);
                                    }
                                    // Prüfen, ob prop ein Objekt mit name und value ist
                                    if (prop && typeof prop === 'object' &&
                                        (ko.isObservable(prop.value) || recursiveCall) && // bei rekursivem Aufruf nicht beachten
                                        typeof prop.name === 'string' &&
                                        prop.name.trim() !== '') {
                                        registeredNames.push(prop.name);
                                    }
                                }
                            };
                            extractNames(this.rezDlgProperties);
                            (_a = this.connector).unregisterSignals.apply(_a, __spread(registeredNames)).then(function (a) { return console.log("unregisterSignals", a); })
                                .catch(function (e) { return console.error("Err.unregisterSignals", e); });
                            this.debugFlag &&
                                window.removeEventListener("storage", this.addToLogPanel, false);
                            this.AddLog("Cleanup Dlg. \"" + this.kennung() + "\", UID: " + this.uid().slice(0, 6) + "..", rezepturEnums_1.LogType.Logout);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RezDlg;
    }(ComponentBaseModel));
    return RezDlg;
});
//# sourceMappingURL=component-rezept-base.model.js.map