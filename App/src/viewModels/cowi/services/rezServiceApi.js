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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
define(["require", "exports", "./rezHttpApi", "../rezepturEnums"], function (require, exports, RezHttpApi, rezepturEnums_1) {
    "use strict";
    // hier Flag setzten, ob es sich um eine Testumgebung handelt z.B. Testphase OPUS/SAP usw.
    var isTestEnv = false;
    // const rootUrl = window.rootUrlPrefix; // lokaler Server
    var rootUrl = "https://app-visu-01-p"; // z.B. zentraler Server
    // const rootUrl = "https://wf-ersatz-w2k-1"; // z.B. zentraler Server
    var RezServiceApi = /** @class */ (function (_super) {
        __extends(RezServiceApi, _super);
        function RezServiceApi() {
            var _a;
            var _this = _super.call(this) || this;
            _this.timeout = 15000;
            // Mapping-Tabelle
            _this.WsPfad = (_a = {},
                // [ServiceWahl.wcfSiem]: "http://localhost:22284/WcfPlcRezept",
                _a[rezepturEnums_1.ServiceWahl.wcfSiem] = rootUrl + "/wcfSiemV2/WcfPlcRezept",
                // [ServiceWahl.wcfSiem]: `${rootUrl}/wcfSiem/V2/WcfPlcRezept`,
                // [ServiceWahl.WcfRezept]: "http://localhost:22284/WsRezept",
                _a[rezepturEnums_1.ServiceWahl.WcfRezept] = rootUrl + "/WcfRezeptV2/WsRezept",
                // [ServiceWahl.WcfRezept]: `${rootUrl}/WcfRezept/V2/WsRezept`,
                // [ServiceWahl.WsCwSAP]: "http://localhost:21240/CwSAPService",
                _a[rezepturEnums_1.ServiceWahl.WsCwSAP] = rootUrl + "/WsCwSAPV2/CwSAPService",
                // [ServiceWahl.WsCwSAP]: `${rootUrl}/WsCwSAP/V2/CwSAPService`,
                // [ServiceWahl.WsCcwBde]: "http://localhost:18713/CcwBdeService",
                _a[rezepturEnums_1.ServiceWahl.WsCcwBde] = rootUrl + "/WsCcwBdeV2/CcwBdeService",
                _a);
            /** liefert Versionsinfo vom jeweiligen Webservice */
            _this.getVersion = function (Pfad) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[Pfad], "GetVersion", "GET", null, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** getServerTime liefert aktuelle Serverzeit */
            _this.getServerTime = function (Pfad) { return __awaiter(_this, void 0, void 0, function () {
                var resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[Pfad], "serverTime", "GET"
                            // null,
                            // this.timeout
                            )];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            // Zufällige Verzögerung für Testzwecke
            // private getDelay(info: string): number {
            //   // var t = Math.round(Math.random() * 2);
            //   var t = Math.random() > 0.5 ? 1 : 0;
            //   console.log(info + ": " + t);
            //   return t;
            // }
            /** liefert Konfigurationsdaten für Rez.Dlg. */
            _this.getRezConfig = function (AnlagenNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "getRezConfig", "GET", { AnlagenNr: AnlagenNr }
                            // this.timeout
                            )];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.Ablieferzone = function (AnlagenNr, PaNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "Ablieferzone", "GET", {
                                AnlagenNr: AnlagenNr,
                                PaNr: PaNr,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * liefert eine Liste mit entsprechenden PA-Aufträgen
             * @param AnlagenNr Anlagennummer
             */
            _this.PaNr = function (AnlagenNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], isTestEnv ? "PaNrTestEnv" : "PaNr", "GET", {
                                AnlagenNr: AnlagenNr,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            // /** @param Command SQL-Befehl */
            // public ReadDatabase = async (Command: string) => {
            //   const resp = await this.http(this.WsPfad.WcfRezept, "ReadDatabase", "GET", {
            //     odbcCmd: Command,
            //   });
            //   return resp;
            // };
            /** Überprüft, ob ein Rezept vorhanden ist. */
            _this.IstRezeptVorhanden = function (param) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "IstRezeptVorhanden", "GET", {
                                RezNr: param.rezNr,
                                RezVer: param.verNr,
                                Abteilung: param.abteiNr,
                                Werk: param.werk,
                                Halle: param.halle,
                                Etage: param.etage,
                                Linie: param.linie,
                                Maschine: param.maschine,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** liefert Userlevel */
            _this.GetUserRights = function (user, pass) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "GetUserRights", "GET", { user: user, pass: pass }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** gibt eine Liste von Rezepten (RezList) zurück */
            _this.GetRezList = function (Command) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "GetRezList", "GET", Command, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** gibt den Namen eines Rezepts zurück */
            _this.GetRezNamen = function (reznr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "GetRezNamen", "GET", reznr)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * @param Command SQL-Befehl
             */
            _this.WriteDatabase = function (Command) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "WriteDatabase", "POST", {
                                odbcCmd: Command,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.SetDeletedRez = function (param) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "SetDeletedRez", "PUT", {
                                User: param.User,
                                RezNr: param.RezNr,
                                RezVer: param.RezVer,
                                Werk: param.werk,
                                Halle: param.halle,
                                Etage: param.etage,
                                Linie: param.linie,
                                Abteilung: param.abteiNr,
                                Maschine: param.maschine,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.WriteToSpsRez = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "WriteToSpsRez", "POST", {
                                asWfServer: args.WfServer,
                                asWfDb: args.WfDb,
                                aiWerk: args.Werk,
                                aiHalle: args.Halle,
                                aiEtage: args.Etage,
                                aiLinie: args.Linie,
                                aiAbteil: args.Abteil,
                                aiMasch: args.Maschine,
                                asRezNr: args.RezeptNr,
                                asRezVer: args.RezeptVer,
                                asWfFilter: args.WfFilter,
                            }, this.timeout)];
                        case 1: 
                        // ------------------------------
                        // Ausführung mit remote Service
                        // ------------------------------
                        return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.WriteToDB = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "WriteToDB", "POST", {
                                aData: args.Data,
                                asUserName: args.User,
                                aiWerk: args.Werk,
                                aiHalle: args.Halle,
                                aiEtage: args.Etage,
                                aiLinie: args.Linie,
                                aiAbteil: args.Abteil,
                                aiMasch: args.Maschine,
                                asRezNr: args.RezeptNr,
                                asRezVer: args.RezeptVer,
                                asRezName: args.RezeptName,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.UpdateRezDB = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "UpdateRezDB", "POST", {
                                aData: args.Data,
                                asUserName: args.User,
                                aiWerk: args.Werk,
                                aiHalle: args.Halle,
                                aiEtage: args.Etage,
                                aiLinie: args.Linie,
                                aiAbteil: args.Abteil,
                                aiMasch: args.Maschine,
                                asRezNr: args.RezeptNr,
                                asRezVer: args.RezeptVer,
                                asRezName: args.RezeptName,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** startet bzw. stoppt die Produktionsaufträge */
            // hier eine Ausnahme: da OPUS auch 500-er Status zurücksendet wird es weitergeleitet
            // bitte nicht auf Standardmethode wie this.http umstellen
            _this.PaStartStop = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.post(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], isTestEnv ? "PaStartStopTestEnv" : "PaStartStop", {
                                aAnlagenNr: args.AnlagenNr,
                                aProdAufNummer: args.ProdAufNummer,
                                aStatus: args.Status,
                                aAblieferZone: args.AblieferZone,
                                aAnswerRework: args.AnswerRework,
                                userName: args.userName,
                                callId: "OPUSDATA->OP " + moment().format("DD.MM.YYYY HH:mm:ss"),
                                prodTyp: args.prodTyp,
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** liest Rez.Log. aus DB */
            _this.ReadRezActivity2 = function (args) { return __awaiter(_this, void 0, void 0, function () {
                var AnlagenNr, startDt, stopDt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            AnlagenNr = args.AnlagenNr, startDt = args.startDt, stopDt = args.stopDt;
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "ReadRezActivity2", "GET", {
                                    AnlagenNr: AnlagenNr,
                                    startDt: startDt,
                                    stopDt: stopDt,
                                }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** hollt die Gebindemenge */
            _this.Gebindemenge = function (ArtikelNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "Gebindemenge", "GET", {
                                ArtikelNr: ArtikelNr,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** schreibt Rez.Log. in DB */
            _this.WriteRezActivity = function (_a) {
                var Zeitstempel = _a.Zeitstempel, _b = _a.AnlagenNr, AnlagenNr = _b === void 0 ? 0 : _b, _c = _a.AnlagenName, AnlagenName = _c === void 0 ? "undefiniert" : _c, _d = _a.Bediener, Bediener = _d === void 0 ? "unbekannt" : _d, _e = _a.MldTyp, MldTyp = _e === void 0 ? 0 : _e, _f = _a.Meldung, Meldung = _f === void 0 ? "undefiniert" : _f, _g = _a.PaNr, PaNr = _g === void 0 ? 0 : _g, _h = _a.ArtNr, ArtNr = _h === void 0 ? 0 : _h, _j = _a.Altern, Altern = _j === void 0 ? 0 : _j, _k = _a.Variant, Variant = _k === void 0 ? 0 : _k;
                return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "WriteRezActivity", "POST", {
                                    Zeitstempel: Zeitstempel,
                                    AnlagenNr: AnlagenNr,
                                    AnlagenName: AnlagenName,
                                    Bediener: Bediener.replace(/[\n]/gm, "; ").slice(0, 1000),
                                    MldTyp: MldTyp,
                                    Meldung: Meldung.slice(0, 1000),
                                    PaNr: PaNr,
                                    ArtNr: ArtNr,
                                    Altern: Altern,
                                    Variant: Variant,
                                }, this.timeout)];
                            case 1: return [2 /*return*/, _l.sent()];
                        }
                    });
                });
            };
            /** schreibt Rez.Log. in DB */
            _this.WriteRezActivity2 = function (data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "WriteRezActivity2", "POST", data, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
            _this.GetSortedRezVarnames = function (args) { return __awaiter(_this, void 0, void 0, function () {
                var WfServer, WfDb, WfFilter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            WfServer = args.WfServer, WfDb = args.WfDb, WfFilter = args.WfFilter;
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetSortedRezVarnames", "GET", {
                                    asWfServer: WfServer,
                                    asWfDb: WfDb,
                                    asWfFilter: WfFilter,
                                }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
            _this.GetVirtualRezVarnames = function (args) { return __awaiter(_this, void 0, void 0, function () {
                var WfServer, WfDb, WfFilter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            WfServer = args.WfServer, WfDb = args.WfDb, WfFilter = args.WfFilter;
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetVirtualRezVarnames", "GET", {
                                    asWfServer: WfServer,
                                    asWfDb: WfDb,
                                    asWfFilter: WfFilter,
                                }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.GetClientIP = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetClientIP", "GET", null, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            _this.GetClientName = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetClientName", "GET", null, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Schreibt Daten in SPS (direkte Verbindung)
             * @param WfDb DB-Name
             * @param Data Nutzdaten, die geschrieben werden sollen
             * @param WfServPath Server\DBPfad (optional) z.B. 'WF-Verp3250\\I4SCADA',
             * bei nicht Vergabe des Parameters wird der lokaler Servernamen und als
             * Pfad 'WEBFACTORY2010' eingesetzt
             * @returns IWriteToSpsTransl
             */
            _this.WriteToSpsTransl = function (args) { return __awaiter(_this, void 0, void 0, function () {
                var pfad;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pfad = !args.WfServPath ? window.location.hostname : args.WfServPath;
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "WriteToSpsTransl", "POST", {
                                    // asWfServer: 'WF-Verp3250\\I4SCADA',
                                    asWfServer: pfad,
                                    asWfDb: args.WfDb,
                                    aData: args.Data,
                                }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** Betriebsdatenerfassung (BDE)*/
            _this.AddBetriebsdaten = function (args) { return __awaiter(_this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = args.config;
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "AddBetriebsdaten", "POST", {
                                    // obwohl die WebMethode "AddBetriebsdaten" mehrere configs verarbeiten kann
                                    // wird es an der Stelle nur einmal realisiert
                                    config: [__assign({}, config)],
                                }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * gibt die Länge von DB2-DB zurück
             * @example {Promise}
             * <CountDataTableResponse xmlns="http://tempuri.org/">
             * <CountDataTableResult>620</CountDataTableResult>
             * </CountDataTableResponse>
             * @returns {Promise} Anzahl Zeilen
             */
            _this.checkRecipeDb = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "CountDataTable", "GET", {
                                RezNr: args.rezNr,
                                RezVer: args.rezVer,
                                Werk: args.config.werk,
                                Halle: args.config.halle,
                                Etage: args.config.etage,
                                Linie: args.config.linie,
                                Maschine: args.config.maschine,
                                Abteilung: args.config.abteiNr,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * liefert Assembly Version u. BuildDate
             * @returns {Promise}
             */
            _this.GetWsSapVer = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "GetVersion", "GET", null, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /** Ruft die BDE_Lobster-Tabelle ab.
             * @returns {Promise} GetBdeLobstResult
             */
            _this.GetBdeLobst = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "GetBdeLobst", "GET", null, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Setzt die BdeLobsterData-Daten basierend auf den bereitgestellten BdeLobsterValues-Daten.
             * @returns {Promise} SetBdeLobstResult
             */
            _this.SetBdeLobst = function (data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "SetBdeLobst", "POST", {
                                data: data,
                            }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Setzt die Werte für StoerBdeLobst.
             * @returns {Promise} SetBdeLobstResult
             */
            _this.SetStoerBdeLobst = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "SetStoerBdeLobst", "POST", { data: { args: args } }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Beendet alle nicht abgeschlossenen Aufträge unter einer bestimmten Ressourcennummer.
             * @param {number} RessNr - Die Ressourcennummer, unter der die Aufträge laufen.
             * @param {number} ZaehlNr - Die Zählernummer, unter der die BDE läuft.
             * @returns {Promise<IStopAllBdeLobstResponse>} Ein Promise, das ein IStopAllBdeLobstResponse-Objekt zurückgibt, das den Erfolgsstatus, die verstrichene Zeit und eine Liste der beendeten Auftragsnummern enthält.
             */
            _this.StopAllBdeLobst = function (RessNr, ZaehlNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "StopAllBdeLobst", "POST", { ressNr: RessNr, zaehlNr: ZaehlNr }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Ruft gestartete und nicht abgeschlossene PA-Aufträge ab, basierend auf der bereitgestellten PaNr.
             * @returns {Promise} Gibt ein WsCwSAPResult-Objekt zurück, das die abgerufenen BdeLobsterData-Daten enthält.
             */
            _this.GetBdeLobstUncomp = function (PaNr, RessNr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCwSAP], "GetBdeLobstUncomp", "GET", { PaNr: PaNr, RessNr: RessNr }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Diese Methode liefert liefert Anzahl nicht kommentierten Störungsmeldungen
             * Sie führt eine gespeicherte Prozedur in der Datenbank aus und gibt das Ergebnis zurück.
             * Im Falle eines Fehlers während der Ausführung wird eine Fehlermeldung zurückgegeben.
             * @returns {Promise} GetFaultDurationResult
             */
            // public GetFaultCount = async (ressnr: number): Promise<any> => {
            // await rezUtils.sleep(100); // Simuliert eine Verzögerung für Testzwecke
            // return {
            //   "GetFaultCountResult": {
            //     "Data": Math.random() < 0.5 ? 0 : 1,
            //     "ErrorMsg": ressnr,
            //     "ErrorNr": 0,
            //     "Msg": "00:00:00",
            //     "Succeed": true
            //   }
            // };
            _this.GetFaultCount = function (ressnr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCcwBde], "GetFaultCount", "GET", { ressnr: ressnr }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            /**
             * Diese Methode liefert die Dauer aufsummierten Störungen basierend auf der Ressourcen-ID, der PaNr und der RezNr.
             * Sie führt eine gespeicherte Prozedur in der Datenbank aus und gibt das Ergebnis zurück.
             * Im Falle eines Fehlers während der Ausführung wird eine Fehlermeldung zurückgegeben.
             * @returns {Promise} GetFaultDurationResult
             */
            _this.GetFaultDuration = function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WsCcwBde], "GetFaultDuration", "GET", { data: { args: args } }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            return _this;
        }
        /** liest die angefragten Daten aus der SPS (direkte Verbindung)*/
        RezServiceApi.prototype.ReadFromSpsTransl = function (WfDb, Data) {
            return __awaiter(this, void 0, void 0, function () {
                var requestData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requestData = {
                                asWfServer: window.location.hostname,
                                asWfDb: WfDb,
                                aData: Data,
                            };
                            return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "ReadFromSpsTransl", "GET", requestData, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RezServiceApi.prototype.GetSignRecipeDifferences = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetSignalRezInfo", "GET", config, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RezServiceApi.prototype.GetSignRecipeValues = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetSignalRezValue", "GET", config, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RezServiceApi.prototype.GetSignalProperty = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.wcfSiem], "GetSignalProperty", "GET", config, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RezServiceApi.prototype.GetRezSpsConfig = function (AnlagenNr) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "GetRezSpsConfig", "GET", { AnlagenNr: AnlagenNr }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        RezServiceApi.prototype.GetRezDlgConfig = function (AnlagenNr) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http(this.WsPfad[rezepturEnums_1.ServiceWahl.WcfRezept], "GetRezDlgConfig", "GET", { AnlagenNr: AnlagenNr }, this.timeout)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return RezServiceApi;
    }(RezHttpApi));
    return RezServiceApi;
});
//# sourceMappingURL=rezServiceApi.js.map