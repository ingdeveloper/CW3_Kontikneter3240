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
define(["require", "exports", "plugins/dialog", "../services/logger", "../viewModels/cowi/dialoge/cwRezDlg", "./component-rezept-base.model", "../viewModels/cowi/rezepturEnums"], function (require, exports, dialog, Logger, MsgBox, RezBase, rezepturEnums_1) {
    "use strict";
    var RezeptDialogRezOnly = /** @class */ (function (_super) {
        __extends(RezeptDialogRezOnly, _super);
        function RezeptDialogRezOnly(params) {
            var _this = this;
            params.kennung = rezepturEnums_1.FnktKennung.rezOnly;
            _this = _super.call(this, params) || this;
            return _this;
        }
        RezeptDialogRezOnly.prototype.makeRezList = function (row) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.makeRezList.call(this, row)];
                        case 1:
                            _a.sent();
                            // Rez.Liste aufklappen
                            setTimeout(function () {
                                $("#" + _this.idCollapseRezList()).collapse("show");
                            }, 200);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** (Html-Button-Action) Rezept zur SPS senden */
        RezeptDialogRezOnly.prototype.btnSendRecipe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, paDaten, sResp, error_1, _b, response, dispose;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.isLoading(true); // Lade-Spinner zeigen
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, 12, 13]);
                            this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
                            return [4 /*yield*/, this.checkCountDataTable()];
                        case 2:
                            _a = !(_c.sent());
                            if (_a) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.checkExtFreigabe()];
                        case 3:
                            _a = !(_c.sent());
                            _c.label = 4;
                        case 4:
                            // -----------------------
                            // 1. - Freigaben prüfen.
                            // -----------------------
                            if (_a) {
                                return [2 /*return*/];
                            }
                            // -------------------------------------------------
                            // 2. - gewählte PA/Rez- Nr. Plausibilitätsprüfung.
                            // -------------------------------------------------
                            this.selectedPaData.ProdTyp("DU");
                            this.selectedPaData.RezNr(this.selectedRecipe.Nr());
                            this.selectedPaData.PaNr("99999");
                            return [4 /*yield*/, this.RezPaPlausibility()];
                        case 5:
                            paDaten = _c.sent();
                            if (!paDaten)
                                return [2 /*return*/];
                            // -----------------------------------
                            // 3. - Rezeptvariablen -> SPS senden
                            // -----------------------------------
                            return [4 /*yield*/, this.sendToSps(this.selectedRecipe.Nr(), this.selectedRecipe.Vers())];
                        case 6:
                            // -----------------------------------
                            // 3. - Rezeptvariablen -> SPS senden
                            // -----------------------------------
                            _c.sent();
                            return [4 /*yield*/, this.rezGesendet({
                                    id: null,
                                    paNr: this.selectedPaData.RezNr(),
                                    rzNr: this.selectedRecipe.Nr(),
                                    rzVer: this.selectedRecipe.Vers(),
                                    rzName: this.selectedRecipe.Descrp(),
                                })];
                        case 7:
                            sResp = _c.sent();
                            return [3 /*break*/, 13];
                        case 8:
                            error_1 = _c.sent();
                            if (!error_1) return [3 /*break*/, 10];
                            Logger.errorToast(error_1);
                            return [4 /*yield*/, dialog.show(new MsgBox("Error", "Vorgang abgebrochen", "Tomato"))];
                        case 9:
                            _b = __read.apply(void 0, [_c.sent(), 2]), response = _b[0], dispose = _b[1];
                            dispose();
                            return [3 /*break*/, 11];
                        case 10:
                            Logger.errorToast("Fehler in sendRecipe()");
                            Logger.error(this, "Fehler in sendRecipe()");
                            _c.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            this.isLoading(false); // Lade-Spinner ausblenden
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        return RezeptDialogRezOnly;
    }(RezBase));
    return RezeptDialogRezOnly;
});
//# sourceMappingURL=rez-dlg-rez-only.component.js.map