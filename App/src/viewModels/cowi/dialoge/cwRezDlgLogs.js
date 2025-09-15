//  *********************************************
//  * Model für das modale Fenster RFID History *
//  *********************************************
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "plugins/dialog", "../services/rezUtils", "../../../viewModels/cowi/services/rezLog", "../../../viewModels/cowi/services/tabBuilder", "../../../viewModels/cowi/services/dtHandle"], function (require, exports, dialog, rezUtils_1, Log, Tab, DateTimeUtil) {
    "use strict";
    rezUtils_1 = __importDefault(rezUtils_1);
    var cwRezDlgLogs = /** @class */ (function () {
        function cwRezDlgLogs(anlagen_nr) {
            // UID für die eindeutige Identifizierung des Moduls
            this.uid = ko.observable(uuid.v4());
            this.idDtPickerLogStart = ko.observable("idDtPickerLogStart_" + this.uid());
            this.idDtPickerLogStop = ko.observable("idDtPickerLogStop_" + this.uid());
            this.idLogTable = ko.observable("idLogTable_" + this.uid());
            /** Status Log Lesen/Schreiben */
            this.logBusy = ko.observable(false);
            /** Head-Zeile Tabelle-Logs */
            this.logListeHead = ko.observableArray([]);
            /** Body-Zeilen Tabelle-Logs */
            this.logListeRows = ko.observableArray([]);
            this.Tab = new Tab();
            this.AnlagenNr = anlagen_nr;
        }
        cwRezDlgLogs.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.initDT();
                    this.GetLog();
                    return [2 /*return*/];
                });
            });
        };
        /** Lädt die Rez.Logbuch */
        cwRezDlgLogs.prototype.GetLog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var list, head, rows, rows_1, rows_1_1, bodyCell, e_1_1;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logBusy(true);
                            if (this.logListeRows().length) {
                                this.logListeRows.removeAll();
                            }
                            return [4 /*yield*/, Log.Get(this.AnlagenNr, this.DateTimeUtil.startZeit, this.DateTimeUtil.stoppZeit)];
                        case 1:
                            list = _b.sent();
                            // Log-Einträge zählen -> anzeigen
                            $("#LogRange").text(Object.keys(list).length + " Einträge ");
                            // Abfrage ob Rückgabeobj. leer ist
                            if (!Object.keys(list).length) {
                                this.logBusy(false);
                                $(".fallout").css("visibility", "visible");
                                return [2 /*return*/];
                            }
                            else
                                $(".fallout").css("visibility", "hidden");
                            head = { cells: this.Tab.getHeadData(list) };
                            this.logListeHead(head);
                            rows = this.Tab.getBodyData(list);
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 7, 8, 9]);
                            rows_1 = __values(rows), rows_1_1 = rows_1.next();
                            _b.label = 3;
                        case 3:
                            if (!!rows_1_1.done) return [3 /*break*/, 6];
                            bodyCell = rows_1_1.value;
                            // Bediener Information unleserlich machen
                            bodyCell[8] = rezUtils_1.default.stringUgly(bodyCell[8]);
                            this.logListeRows.push({ cells: bodyCell });
                            // künstlich bremsen damit UI nicht einfriert bei großen Datenmengen
                            return [4 /*yield*/, rezUtils_1.default.sleep(1)];
                        case 4:
                            // künstlich bremsen damit UI nicht einfriert bei großen Datenmengen
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            rows_1_1 = rows_1.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) _a.call(rows_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 9:
                            // Tabelle einfärben
                            $("#" + this.idLogTable() + " tbody tr").each(function () {
                                var td2 = $(this).find('td').eq(2); // Zugriff auf die 2. Spalte 'Meldung'
                                var td7 = $(this).find('td').eq(7); // Zugriff auf die 7. Spalte 'MeldungsTyp'
                                // Button-Events Hintergrund einfärben
                                if (td2.text().trim().startsWith('***')) {
                                    $(this)
                                        .css('font-weight', 600) // Text fett darstellen
                                        .css('color', 'dodgerblue'); // ganze Zeile einfärben
                                }
                                var mldTyp = td7.text().trim().toLowerCase();
                                switch (true) {
                                    case mldTyp.startsWith('abbruch'): // Abbruch Rot einfärben
                                        $(this).css('color', 'tomato');
                                        break;
                                    case mldTyp.startsWith('login'): // Login Grün einfärben
                                        $(this).css('color', 'green');
                                        break;
                                    case mldTyp.startsWith('logout'): // Logout Oliv einfärben
                                        $(this).css('color', 'olive');
                                        break;
                                    default:
                                        break;
                                }
                            });
                            this.logBusy(false);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** DateAndTime Elemente initialisieren */
        cwRezDlgLogs.prototype.initDT = function () {
            this.DateTimeUtil = new DateTimeUtil(this.idDtPickerLogStart(), this.idDtPickerLogStop());
        };
        cwRezDlgLogs.prototype.activate = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        cwRezDlgLogs.prototype.detached = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        cwRezDlgLogs.prototype.close = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Unregister Signals
                    this.detached();
                    dialog.close(this, Promise.resolve());
                    return [2 /*return*/];
                });
            });
        };
        return cwRezDlgLogs;
    }());
    return cwRezDlgLogs;
});
//# sourceMappingURL=cwRezDlgLogs.js.map