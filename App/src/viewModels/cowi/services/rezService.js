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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./rezServiceApi", "./CryptoJS"], function (require, exports, rezServiceApi_1, CryptoJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rezService = void 0;
    rezServiceApi_1 = __importDefault(rezServiceApi_1);
    var RezService = /** @class */ (function () {
        function RezService() {
        }
        RezService.getVersion = function (ws) {
            return this.serviceApi.getVersion(ws);
        };
        RezService.getServerTime = function (ws) {
            return this.serviceApi.getServerTime(ws);
        };
        RezService.Ablieferzone = function (AnlagenNr, PaNr) {
            return this.serviceApi.Ablieferzone(AnlagenNr, PaNr);
        };
        /**
         * liefert eine Liste mit entsprechenden PA-Aufträgen
         * @param AnlagenNr Anlagennummer
         */
        RezService.PaNr = function (AnlagenNr) {
            return this.serviceApi.PaNr(AnlagenNr);
        };
        RezService.Encrypte = function (plaintext, _key) {
            var key = CryptoJS.enc.Utf8.parse(_key);
            // Verschlüsseln
            var iv = CryptoJS.lib.WordArray.random(16); // Generiere einen 16-Byte-IV Initialisierungsvektor
            var encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
            return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64); // IV + Chiffretext
        };
        /** liefert Userrechte */
        RezService.GetUserRights = function (user, pass) {
            var key = "gpV4tPzwMhuoZBf1";
            return this.serviceApi.GetUserRights(this.Encrypte(user, key), this.Encrypte(pass, key));
        };
        /** Überprüft, ob ein Rezept vorhanden ist. */
        RezService.IstRezeptVorhanden = function (param) {
            return this.serviceApi.IstRezeptVorhanden(param);
        };
        // /** @param Command SQL-Befehl */
        // public static ReadDatabase(Command: string) {
        //   return this.serviceApi.ReadDatabase(Command);
        // }
        // /** @param Command SQL-Befehl */
        // public static WriteDatabase(Command: string) {
        //   return this.serviceApi.WriteDatabase(Command);
        // }
        /** liefert Rezeptliste */
        RezService.SetDeletedRez = function (args) {
            return this.serviceApi.SetDeletedRez(args);
        };
        /** liefert Rezeptliste */
        RezService.WriteToSpsRez = function (args) {
            return this.serviceApi.WriteToSpsRez(args);
        };
        /** gibt eine Liste von Rezepten (RezList) zurück */
        RezService.GetRezList = function (args) {
            return this.serviceApi.GetRezList({
                Werk: args.werk,
                Halle: args.halle,
                Etage: args.etage,
                Linie: args.linie,
                Maschine: args.maschine,
                RezNr: args.reznr ? args.reznr.toString().trim().padStart(9, "0") : "",
                RezVer: args.rezver ? args.rezver : -1,
                Abteilung: args.abteiNr ? args.abteiNr : -1,
            });
        };
        /** gibt den Namen eines Rezepts zurück */
        RezService.GetRezNamen = function (renNr) {
            return this.serviceApi.GetRezNamen({ RezNr: renNr });
        };
        RezService.WriteToDB = function (args) {
            return this.serviceApi.WriteToDB(args);
        };
        RezService.UpdateRezDB = function (args) {
            return this.serviceApi.UpdateRezDB(args);
        };
        /** Stoppt/Startet PA-Aufträge */
        RezService.PaStartStop = function (args) {
            return this.serviceApi.PaStartStop(args);
        };
        /** Liest Log-Eintrag */
        RezService.ReadActivity = function (arg) {
            return this.serviceApi.ReadRezActivity2(arg);
        };
        /** Gebindemenge */
        RezService.Gebindemenge = function (ArtikelNr) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceApi.Gebindemenge(ArtikelNr)];
                });
            });
        };
        /** Schreibt Log-Eintrag */
        RezService.WriteActivity = function (args) {
            return this.serviceApi.WriteRezActivity(args);
        };
        /** Schreibt Log-Eintrag */
        RezService.WriteActivity2 = function (args) {
            return this.serviceApi.WriteRezActivity2(args);
        };
        /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
        RezService.GetRezVarnames = function (args) {
            return this.serviceApi.GetSortedRezVarnames(args);
        };
        /** Liest virtuelle rezeptrelevante Variablen aus WF-Datenbank */
        RezService.GetVirtRezVarnames = function (args) {
            return this.serviceApi.GetVirtualRezVarnames(args);
        };
        /** Client IP */
        RezService.GetClentIp = function () {
            return this.serviceApi.GetClientIP();
        };
        /** Client Name */
        RezService.GetClientName = function () {
            return this.serviceApi.GetClientName();
        };
        /** liest die angefragten Daten aus der SPS (direkte Verbindung)*/
        RezService.ReadFromSps = function (WfDb, Data) {
            return this.serviceApi.ReadFromSpsTransl(WfDb, Data);
        };
        /** schreibt Daten in SPS (direkte Verbindung E.Siem. WS)*/
        RezService.WriteToSpsTransl = function (args) {
            return this.serviceApi.WriteToSpsTransl(args);
        };
        /** Betriebsdatenerfassung (DBE)*/
        RezService.AddBetriebsdaten = function (config) {
            return this.serviceApi.AddBetriebsdaten(config);
        };
        /**
         * gibt die Länge von DB2-DB zurück
         * @example {Promise}
         * <CountDataTableResponse xmlns="http://tempuri.org/">
         * <CountDataTableResult>620</CountDataTableResult>
         * </CountDataTableResponse>
         * @returns {Promise} Anzahl Zeilen
         */
        RezService.CheckRecipeDb = function (args) {
            return this.serviceApi.checkRecipeDb(args);
        };
        /** liefert Assembly Version u. BuildDate */
        RezService.GetWsSapVer = function () {
            return this.serviceApi.GetWsSapVer();
        };
        /** Ruft die BDE_Lobster-Tabelle ab. */
        RezService.GetBdeLobst = function () {
            return this.serviceApi.GetBdeLobst();
        };
        /** Setzt die BdeLobsterData-Daten basierend auf den bereitgestellten BdeLobsterValues-Daten. */
        RezService.SetBdeLobst = function (args) {
            return this.serviceApi.SetBdeLobst(args);
        };
        /** Setzt die Werte für StoerBdeLobst. */
        RezService.SetStoerBdeLobst = function (data) {
            return this.serviceApi.SetBdeLobst(data);
        };
        /** liefert die Daten für n. beendete PA's in Lobster-Tabelle
         * @param {number} [PaNr=0] - Der erste Parameter für die `GetBdeLobstUncomp`-Methode.
         * @param {number} [RessNr=0] - Der zweite Parameter für die `GetBdeLobstUncomp`-Methode.
         * @returns {any} Das Ergebnis der `GetBdeLobstUncomp`-Methode des `serviceApi`-Objekts.
         */
        RezService.GetBdeLobstUncomp = function (PaNr, RessNr) {
            if (PaNr === void 0) { PaNr = 0; }
            if (RessNr === void 0) { RessNr = 0; }
            return this.serviceApi.GetBdeLobstUncomp(PaNr, RessNr);
        };
        /**
         * Beendet alle nicht abgeschlossenen Aufträge unter einer bestimmten Ressourcennummer.
         * @param {number} RessNr - Die Ressourcennummer, unter der die Aufträge laufen.
         * @returns {Promise<IStopAllBdeLobstResponse>} Ein Promise, das ein IStopAllBdeLobstResponse-Objekt zurückgibt, das den Erfolgsstatus, die verstrichene Zeit und eine Liste der beendeten Auftragsnummern enthält.
         */
        RezService.StopAllBdeLobst = function (RessNr, ZaehlNr) {
            return this.serviceApi.StopAllBdeLobst(RessNr, ZaehlNr);
        };
        /** Diese Methode liefert liefert Anzahl nicht kommentierten Störungsmeldungen */
        RezService.GetFaultCount = function (args) {
            return this.serviceApi.GetFaultCount(args);
        };
        /** Diese Methode liefert die SPS-Konfiguration. Abhängigkeiten von der PA-Typ->SPS-Bitspur */
        RezService.GetRezSpsConfig = function (AnlagenNr) {
            return this.serviceApi.GetRezSpsConfig(AnlagenNr);
        };
        /** Diese Methode liefert die Rez.Dlg.-Konfiguration. */
        RezService.GetRezDlgConfig = function (AnlagenNr) {
            return this.serviceApi.GetRezDlgConfig(AnlagenNr);
        };
        RezService.GetSignRecipeDifferences = function (config) {
            return this.serviceApi.GetSignRecipeDifferences(config);
        };
        RezService.GetSignalProperty = function (config) {
            return this.serviceApi.GetSignalProperty(config);
        };
        RezService.GetSignRecipeValues = function (config) {
            return this.serviceApi.GetSignRecipeValues(config);
        };
        RezService.serviceApi = new rezServiceApi_1.default();
        return RezService;
    }());
    exports.rezService = RezService;
});
//# sourceMappingURL=rezService.js.map