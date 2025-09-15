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
define(["require", "exports", "./rezService"], function (require, exports, rezService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rezDlgKonfig = void 0;
    var RezDlgKonfig = /** @class */ (function () {
        function RezDlgKonfig(anlagenNr) {
            this.anlagenNr = anlagenNr;
            this.cachedKonfig = null;
            this.messages = [];
        }
        RezDlgKonfig.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, dataArray, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.messages = [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            console.log("Lade Rez.Dlg.-Konfiguration f\u00FCr anlagenNr = " + this.anlagenNr);
                            return [4 /*yield*/, rezService_1.rezService.GetRezDlgConfig(this.anlagenNr)];
                        case 2:
                            result = (_a.sent()).GetRezDlgConfigResult;
                            if (!result.Succeed) {
                                throw new Error(result.ErrorMsg);
                            }
                            dataArray = JSON.parse(result.Data);
                            if (Array.isArray(dataArray) && dataArray.length > 0) {
                                this.cachedKonfig = result.Data;
                            }
                            else {
                                throw new Error("Die Rez.Dlg.-Konfig ist leer oder ungültig.");
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.messages.push("Fehler beim Laden der Rez.Dlg.-Konfiguration f\u00FCr anlagenNr = " + this.anlagenNr + ": " + error_1.message + ". Es wird die Default-Konfiguration verwendet.");
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RezDlgKonfig.prototype.getKonfig = function () {
            var data = this.cachedKonfig
                ? JSON.parse(this.cachedKonfig)
                : JSON.parse("[{\"LbstSvc_Enabl\":false,\"LbstRngMld_Enabl\":true,\"Auftr_33333_Enabl\":true,\"Auftr_77777_Enabl\":false,\"Auftr_88888_Enabl\":false,\"Auftr_99999_Enabl\":true,\"TestEnv_Enabl\":false,\"ServicePfad\":\"https://app-visu-01-p\",\"ExEnCr\":\"1970-01-01T00:00:00\"}]");
            return data.map(function (row) {
                var bitFields = Object.keys(row)
                    .filter(function (key) { return key.endsWith("Enabl"); })
                    .reduce(function (acc, key) {
                    acc[key] = row[key];
                    return acc;
                }, {});
                return __assign(__assign({}, bitFields), { ServicePfad: row.ServicePfad, ExEnCr: moment(row.ExEnCr).format('DD.MM.YYYY HH:mm:ss') });
            });
        };
        RezDlgKonfig.prototype.getMessages = function () {
            return this.messages;
        };
        return RezDlgKonfig;
    }());
    // Export Factory-Funktion
    function rezDlgKonfig(anlagenNr) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new RezDlgKonfig(anlagenNr);
                        return [4 /*yield*/, instance.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                konfig: instance.getKonfig()[0],
                                messages: instance.getMessages()
                            }];
                }
            });
        });
    }
    exports.rezDlgKonfig = rezDlgKonfig;
});
//# sourceMappingURL=rezDlgKonfig.js.map