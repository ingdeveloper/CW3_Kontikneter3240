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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "plugins/dialog", "./component-rezept-base.model", "../services/logger", "../viewModels/cowi/dialoge/cwRezDlgAblieferzone", "../viewModels/cowi/services/rezService", "../viewModels/cowi/rezepturEnums"], function (require, exports, dialog, component_rezept_base_model_1, Logger, cwRezDlgAblieferzone_1, rezService_1, rezepturEnums_1) {
    "use strict";
    dialog = __importStar(dialog);
    component_rezept_base_model_1 = __importDefault(component_rezept_base_model_1);
    cwRezDlgAblieferzone_1 = __importDefault(cwRezDlgAblieferzone_1);
    var RezeptDialogPaOnly = /** @class */ (function (_super) {
        __extends(RezeptDialogPaOnly, _super);
        function RezeptDialogPaOnly(params) {
            var _this = this;
            params.kennung = rezepturEnums_1.FnktKennung.paOnly;
            _this = _super.call(this, params) || this;
            return _this;
        }
        /** Komposition vollständig aufgebaut */
        RezeptDialogPaOnly.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                return __generator(this, function (_a) {
                    self = this;
                    $("#paFilter").on("keyup", function () {
                        self.changeFilter("#paFilter");
                    });
                    self.initUser();
                    self.initSpsSignals();
                    self.connector.getOnlineUpdates();
                    // db2Status freigeben
                    self.db2State(true);
                    self.handleUnsetProperties();
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
        /** sendet Rezept zur SPS */
        RezeptDialogPaOnly.prototype.sendRecipe = function (DlgRes) {
            return __awaiter(this, void 0, void 0, function () {
                var format, diffInSeconds, AuftArt, respLobst, match, paToSps, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, 7, 9]);
                            // ---------------------------------------
                            // 1. - PA in SPS, OPUS, Lobster stoppen.
                            // ---------------------------------------
                            return [4 /*yield*/, this.stopPa().catch(function (error) {
                                    throw error;
                                })];
                        case 1:
                            // ---------------------------------------
                            // 1. - PA in SPS, OPUS, Lobster stoppen.
                            // ---------------------------------------
                            _a.sent();
                            if (!!DlgRes.ofenautostart) return [3 /*break*/, 4];
                            // ------------------------
                            // 2 - PA-Starten in OPUS.
                            // ------------------------
                            return [4 /*yield*/, this.sendPaToOpus(rezepturEnums_1.PaStatus.start, this.selectedPaData.PaNr(), this.selectedPaData.RezNr(), this.selectedPaData.ProdTyp(), DlgRes.zone, DlgRes.rework).catch(function (error) {
                                    throw error;
                                })];
                        case 2:
                            // ------------------------
                            // 2 - PA-Starten in OPUS.
                            // ------------------------
                            _a.sent();
                            if (!(this.lobsterServiceEnabled() &&
                                !["33333", "77777", "88888", "99999"].includes(this.selectedPaData.PaNr())) // es dürfen keine 'dummys' behandelt werden
                            ) return [3 /*break*/, 4]; // es dürfen keine 'dummys' behandelt werden
                            format = "DD.MM.YYYY HH:mm:ss";
                            diffInSeconds = moment(DlgRes.stop, format).diff(moment(DlgRes.start, format), "seconds");
                            AuftArt = rezepturEnums_1.eAuftArt[this.selectedPaData.ProdTyp()] ||
                                rezepturEnums_1.eProdTyp[this.selectedPaData.ProdTyp()];
                            return [4 /*yield*/, rezService_1.rezService
                                    .SetBdeLobst({
                                    AuftArt: AuftArt,
                                    Fnkt: rezepturEnums_1.eAuftFn.Start,
                                    PaNr: parseFloat(this.selectedPaData.PaNr().toString()),
                                    RessNr: this.anlage(),
                                    ZaehlNr: this.zaehler() || this.anlage(),
                                    RezNr: parseFloat(this.selectedPaData.RezNr().toString()),
                                    Wert: diffInSeconds,
                                    VorgNr: this.selectedPaData.ActivNr(),
                                    RueckNr: this.selectedPaData.RespnNr(),
                                })
                                    .catch(function (error) { throw error; })];
                        case 3:
                            respLobst = (_a.sent()).SetBdeLobstResult;
                            if (!respLobst.Succeed) {
                                match = JSON.stringify(respLobst.ErrorMsg).match(/(?!System.*?\:)(.*?)(?=\;\\r\\n)/gm);
                                throw new Error(match && match.length >= 1 ? match[0] : "Fehler in 'SetBdeLobst'");
                            }
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.writePaDatSps(true, DlgRes.start, DlgRes.stop, DlgRes.leistung).catch(function (error) {
                                throw error;
                            })];
                        case 5:
                            paToSps = _a.sent();
                            Logger.successToast(paToSps[0]);
                            return [3 /*break*/, 9];
                        case 6:
                            error_1 = _a.sent();
                            this.showError(error_1, "Rezept wurde nicht zur SPS übertragen.");
                            return [3 /*break*/, 9];
                        case 7: 
                        // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
                        return [4 /*yield*/, this.makePaList()];
                        case 8:
                            // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) Rezept zur SPS senden */
        RezeptDialogPaOnly.prototype.btnSendRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var paDaten, dialogResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 4, 5]);
                            paDaten = {
                                PaNr: this.selectedPaData.PaNr().toString(),
                                Planleistung: this.selectedPaData.Planleistung(),
                                Start: this.selectedPaData.Start(),
                                Stop: this.selectedPaData.Stop(),
                            };
                            if (!paDaten)
                                return [2 /*return*/];
                            dialogResult = void 0;
                            return [4 /*yield*/, dialog.show(new cwRezDlgAblieferzone_1.default(this.anlage().toString(), paDaten))];
                        case 2:
                            dialogResult = _a.sent();
                            if (dialogResult[0].toString().toLowerCase() !== "accept")
                                return [2 /*return*/];
                            this.isLoading(true); // Lade-Spinner zeigen
                            // ---------------------------
                            // 4. - Rezeptsenden starten.
                            // ---------------------------
                            return [4 /*yield*/, this.sendRecipe(dialogResult[1])];
                        case 3:
                            // ---------------------------
                            // 4. - Rezeptsenden starten.
                            // ---------------------------
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false); // Lade-Spinner ausblenden
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return RezeptDialogPaOnly;
    }(component_rezept_base_model_1.default));
    return RezeptDialogPaOnly;
});
//# sourceMappingURL=rez-dlg-pa-only.component.js.map