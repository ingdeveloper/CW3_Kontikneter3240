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
define(["require", "exports", "plugins/dialog", "../services/logger", "./component-rezept-base.model", "../viewModels/cowi/dialoge/cwRezDlgAblReimelt", "../viewModels/cowi/rezepturEnums"], function (require, exports, dialog, Logger, RezBase, cwRezDlgAblReimelt, rezepturEnums_1) {
    "use strict";
    var RezeptDialogReimelt = /** @class */ (function (_super) {
        __extends(RezeptDialogReimelt, _super);
        function RezeptDialogReimelt(params) {
            var _this = this;
            params.kennung = rezepturEnums_1.FnktKennung.standard;
            _this = _super.call(this, params) || this;
            return _this;
        }
        /** sendet Rezept zur SPS */
        RezeptDialogReimelt.prototype.sendRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, paDaten, dialogResult, DlgRes, fltr, start, paToSps, sndToSps, _a, paData, dat, sResp, error_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            self = this;
                            return [4 /*yield*/, self.checkCountDataTable()];
                        case 1:
                            if (!(_b.sent()))
                                return [2 /*return*/];
                            return [4 /*yield*/, this.RezPaPlausibility()];
                        case 2:
                            paDaten = _b.sent();
                            if (!paDaten)
                                return [2 /*return*/];
                            return [4 /*yield*/, dialog.show(new cwRezDlgAblReimelt(self.anlage().toString(), paDaten, self.freigabeLaden))];
                        case 3:
                            dialogResult = _b.sent();
                            if (dialogResult[0] !== "accept")
                                return [2 /*return*/];
                            DlgRes = dialogResult[1];
                            // Lade-Spinner zeigen
                            self.isLoading(true);
                            fltr = "";
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 10, 11, 12]);
                            start = performance.now();
                            if (!self.paAktiv()) return [3 /*break*/, 6];
                            return [4 /*yield*/, self.stopPa()];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            console.info("%cAusführung in " + (performance.now() - start).toFixed(2) + " ms.", "color:blue");
                            // 1 - PA-Starten -> OPUS(WebService)
                            return [4 /*yield*/, self.sendPaToOpus(rezepturEnums_1.PaStatus.start, self.selectedPaData.PaNr(), self.selectedPaData.RezNr(), self.selectedPaData.ProdTyp(), DlgRes.zone, DlgRes.rework)];
                        case 7:
                            // 1 - PA-Starten -> OPUS(WebService)
                            _b.sent();
                            paToSps = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, self.writePaDatSps(true, DlgRes.start, DlgRes.stop, DlgRes.leistung)];
                            }); }); };
                            fltr = Array.isArray(self.filter) ? __spread(self.filter) : self.filter; // Original beibehalten
                            if (!self.freigabeLaden() && Array.isArray(fltr))
                                fltr.pop(); // falls keine Freigabe -> Reimelt Block löschen
                            DlgRes.grundrezept &&
                                !self.freigabeLaden() &&
                                self.AddLog("Option Rezept übertragen ohne Reimelt/Schüttgut gewählt!", rezepturEnums_1.LogType.OK);
                            sndToSps = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, DlgRes.grundrezept
                                            ? self.sendToSps(self.selectedRecipe.Nr(), self.selectedRecipe.Vers(), fltr)
                                            : self.writeRezDatSps(self.selectedRecipe.Nr(), self.selectedRecipe.Vers())];
                                });
                            }); };
                            return [4 /*yield*/, Promise.all([paToSps(), sndToSps()])];
                        case 8:
                            _a = __read.apply(void 0, [_b.sent(), 2]), paData = _a[0], dat = _a[1];
                            Logger.successToast(paData[0] + dat[0]);
                            return [4 /*yield*/, self.rezGesendet({
                                    id: null,
                                    paNr: self.selectedPaData.PaNr(),
                                    rzNr: self.selectedRecipe.Nr(),
                                    rzVer: self.selectedRecipe.Vers(),
                                    rzName: "",
                                })];
                        case 9:
                            sResp = _b.sent();
                            console.info("%c" + sResp, "background:purple");
                            return [3 /*break*/, 12];
                        case 10:
                            error_1 = _b.sent();
                            self.showError(error_1, "Rezept wurde nicht zur SPS übetragen.");
                            return [3 /*break*/, 12];
                        case 11:
                            // PA-Tabelle refreshen
                            this.makePaList();
                            // Lade-Spinner ausblenden
                            self.isLoading(false);
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        return RezeptDialogReimelt;
    }(RezBase));
    return RezeptDialogReimelt;
});
//# sourceMappingURL=rez-dlg-reimelt.component.js.map