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
define(["require", "exports", "./rezService"], function (require, exports, rezService_1) {
    "use strict";
    var RezValues = /** @class */ (function () {
        /**
         * liefert Rezeptvariablen und Aktualwerte
         * @param {string} _remoteIISServer Pfad zum WF-Server
         * @param {string} _databaseName Name der WF-Datenbank
         * @param {string} _filter Filtername (Markierung der Rezeptrelevanten-Variablen)
         * @param {Connector} _connector aktueller WF-Connector
         */
        function RezValues(_remoteIISServer, _databaseName, _filter, _connector) {
            var _this = this;
            this.cmd = { asWfDb: "", asWfFilter: "", asWfServer: "" };
            /** liefert die Variablenliste Alphabetisch sortiert */
            this.getVarListe = function () { return __awaiter(_this, void 0, void 0, function () {
                var NameList_1, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!Array.isArray(this.cmd.asWfFilter)) return [3 /*break*/, 2];
                            NameList_1 = [];
                            return [4 /*yield*/, Promise.all(this.cmd.asWfFilter.map(function (filter) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, error_1;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _c.trys.push([0, 2, , 3]);
                                                _b = (_a = NameList_1).concat;
                                                return [4 /*yield*/, this.getSortedRezVarnames(filter)];
                                            case 1:
                                                NameList_1 = _b.apply(_a, [_c.sent()]);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_1 = _c.sent();
                                                console.error(error_1);
                                                throw error_1;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, this.getRezValues(NameList_1)];
                        case 2:
                            _a = this.getRezValues;
                            return [4 /*yield*/, this.getSortedRezVarnames(this.cmd.asWfFilter)];
                        case 3: 
                        // falls kein Array, dann einmalig aufrufen
                        return [2 /*return*/, _a.apply(this, [_b.sent()])];
                    }
                });
            }); };
            this.cmd.asWfDb = _databaseName;
            this.cmd.asWfFilter = _filter;
            this.cmd.asWfServer = _remoteIISServer;
            this.connector = _connector;
        }
        /** Values einlesen */
        RezValues.prototype.getRezValues = function (VarListe) {
            return __awaiter(this, void 0, void 0, function () {
                var aliases, VarListe_1, VarListe_1_1, iVar, data, i, error_2;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.start = performance.now();
                            aliases = [];
                            try {
                                for (VarListe_1 = __values(VarListe), VarListe_1_1 = VarListe_1.next(); !VarListe_1_1.done; VarListe_1_1 = VarListe_1.next()) {
                                    iVar = VarListe_1_1.value;
                                    aliases.push(iVar.Aliasname);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (VarListe_1_1 && !VarListe_1_1.done && (_a = VarListe_1.return)) _a.call(VarListe_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.readSignals(aliases)];
                        case 2:
                            data = _b.sent();
                            if (data.length !== VarListe.length) {
                                throw new Error("Fehler beim Var.Initialisieren, this.data.length = " + data.length + "; varListe.length = " + VarListe.length);
                            }
                            for (i = 0; i < VarListe.length; i++) {
                                VarListe[i].Value = data[i].Value;
                            }
                            // Dauer des Datenabrufs ausgeben
                            // console.log(
                            //   "%cgetRezValues() - " +
                            //   (performance.now() - this.start).toFixed(2) +
                            //   " ms.",
                            //   "color:red"
                            // );
                            return [2 /*return*/, VarListe];
                        case 3:
                            error_2 = _b.sent();
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RezValues.prototype.getSortedRezVarnames = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, resp, respV, combinedData, VarNameLst, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    rezService_1.rezService.GetRezVarnames({
                                        WfServer: this.cmd.asWfServer,
                                        WfDb: this.cmd.asWfDb,
                                        WfFilter: filter,
                                    }),
                                    new Promise(function (resolve, reject) {
                                        var q = {
                                            GetVirtualRezVarnamesResult: {
                                                Data: null,
                                                ErrorMsg: "",
                                                ErrorNr: 0,
                                                Msg: "",
                                                Succeed: true,
                                            },
                                        };
                                        resolve(q);
                                    }),
                                ])];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), resp = _a[0], respV = _a[1];
                            if (!resp.GetSortedRezVarnamesResult.Succeed ||
                                !respV.GetVirtualRezVarnamesResult.Succeed) {
                                console.error("Fehler beim Abrufen der RezVarnames/VirtRezVarnames:", resp.GetSortedRezVarnamesResult.ErrorMsg, respV.GetVirtualRezVarnamesResult.ErrorMsg);
                                throw new Error(resp.GetSortedRezVarnamesResult.ErrorMsg +
                                    "/" +
                                    respV.GetVirtualRezVarnamesResult.ErrorMsg);
                            }
                            combinedData = __spread(resp.GetSortedRezVarnamesResult.Data);
                            VarNameLst = combinedData.map(function (row) {
                                var rowArr = row.split("|");
                                if (rowArr.length !== 5) {
                                    throw new Error("'GetSortedRezVarnames' - Anzahl Elemente entspricht nicht.. erwartet 5, bekommen: " + rowArr.length);
                                }
                                return {
                                    Name: rowArr[0],
                                    Aliasname: rowArr[1],
                                    Description: rowArr[2],
                                    Value: null,
                                    Factor: rowArr[4],
                                    AliasGlobal: rowArr[3],
                                };
                            });
                            return [2 /*return*/, VarNameLst];
                        case 2:
                            error_3 = _b.sent();
                            console.error("Fehler in getSortedRezVarnames:", error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RezValues;
    }());
    return RezValues;
});
//# sourceMappingURL=rezValues.js.map