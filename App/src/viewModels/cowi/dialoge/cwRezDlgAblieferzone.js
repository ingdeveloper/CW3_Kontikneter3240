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
define(["require", "exports", "plugins/dialog", "../../../services/logger", "../services/tabBuilder", "../services/rezService", "../../../viewModels/cowi/services/dtHandle"], function (require, exports, dialog, Logger, Tab, rezService_1, DateTimeUtil) {
    "use strict";
    var CwRezDlgAblieferzone = /** @class */ (function () {
        /** Dialog mit der Eingabe von:
         * - Ablieferzone
         * - Produktion Start/Stopp -Zeiten
         * - Produktionsmenge
         * - Rezeptbeschreibung
         */
        function CwRezDlgAblieferzone(AnlagenNr, PaData) {
            var _this = this;
            this.PaData = {};
            this.checkParams = function (val) { return (!isNullOrUndefined(val) ? val : 0); };
            this.close = function () { return dialog.close(_this, ["close"]); };
            this.AnlagenNr = AnlagenNr;
            this.PaData.paNr = this.checkParams(PaData.PaNr); // .PaNr
            this.PaData.paPlan = this.checkParams(PaData.Planleistung);
            this.PaData.rezInfo = !isNullOrUndefined(PaData.Rezeptbeschreibung)
                ? "Grundrezept: " + this.checkParams(PaData.Rezeptbeschreibung)
                : null;
            this.PaData.startDt = PaData.Start;
            this.PaData.stopDt = PaData.Stop;
            this.ablieferNr = 0;
            this.init();
        }
        CwRezDlgAblieferzone.prototype.init = function () {
            this.ablieferHead = ko.observableArray([]);
            this.ablieferRows = ko.observableArray([]);
            this.Tab = new Tab();
        };
        CwRezDlgAblieferzone.prototype.compositionComplete = function () {
            var _this = this;
            this.getDeliver().then(function (count) {
                if (!count || count === 1) {
                    _this.zoneSelect(null, true);
                }
            });
            this.DateTimeUtil = new DateTimeUtil("dtPickerStart", "dtPickerStop", this.PaData.startDt, this.PaData.stopDt);
            this.initPaLeistung();
        };
        CwRezDlgAblieferzone.prototype.checkZone = function () {
            var ablZone = document.getElementById("ablZonenValid");
            if (!this.ablieferNr) {
                ablZone.setCustomValidity("bitte wählen Sie die Ablieferzone aus");
            }
            else {
                ablZone.setCustomValidity("");
            }
        };
        CwRezDlgAblieferzone.prototype.initPaLeistung = function () {
            $("#inPaLeistung")
                .val(this.PaData.paPlan)
                .prop("disabled", this.PaData.paPlan > 0 ? true : false);
        };
        CwRezDlgAblieferzone.prototype.accept = function () {
            dialog.close(this, [
                "accept",
                {
                    start: this.DateTimeUtil.startZeit,
                    stop: this.DateTimeUtil.stoppZeit,
                    leistung: $("#inPaLeistung").val(),
                    zone: this.ablieferNr,
                    grundrezept: $("#sendRezept").is(":checked"),
                    rework: false,
                },
            ]);
        };
        /** selektiert eine Zeile in der PA-Tabelle */
        CwRezDlgAblieferzone.prototype.zoneSelect = function (zone, selectFirst) {
            // sucht alle Elemente in den Tabellen nach Klasse 'selected' und löscht die
            $("#ablieferZonen")
                .children()
                .each(function () {
                $(this).removeClass("selected");
            });
            if (selectFirst) {
                zone = $("#ablieferZonen")
                    .children()
                    .first()
                    .toggleClass("selected")
                    .attr("id");
            }
            else {
                $("#" + zone).toggleClass("selected");
            }
            this.ablieferNr = zone;
        };
        /** Ablieferzonen einlesen */
        CwRezDlgAblieferzone.prototype.getDeliver = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, response, headArr, bodyArr, bodyArr_1, bodyArr_1_1, bodyCell, error_1;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            self = this;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, rezService_1.rezService.Ablieferzone(self.AnlagenNr, self.PaData.paNr)];
                        case 2:
                            response = _b.sent();
                            headArr = void 0;
                            bodyArr = void 0;
                            if (response.AblieferzoneResult.length > 0) {
                                headArr = self.Tab.getHeadData(response.AblieferzoneResult);
                                bodyArr = self.Tab.getBodyData(response.AblieferzoneResult);
                            }
                            else {
                                headArr = ["Ablieferzone", "Bezeichnung"];
                                bodyArr = [["-1", "Default - Ablieferzone"]];
                            }
                            // Head
                            self.ablieferHead.push({ cells: headArr });
                            try {
                                // Zeilen
                                for (bodyArr_1 = __values(bodyArr), bodyArr_1_1 = bodyArr_1.next(); !bodyArr_1_1.done; bodyArr_1_1 = bodyArr_1.next()) {
                                    bodyCell = bodyArr_1_1.value;
                                    self.ablieferRows.push({ cells: bodyCell });
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (bodyArr_1_1 && !bodyArr_1_1.done && (_a = bodyArr_1.return)) _a.call(bodyArr_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return [2 /*return*/, response.AblieferzoneResult.length];
                        case 3:
                            error_1 = _b.sent();
                            if (error_1) {
                                throw error_1;
                            }
                            else {
                                Logger.error(self, error_1.message, error_1.stack);
                                throw new Error("Fehler in Ablieferzone()");
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return CwRezDlgAblieferzone;
    }());
    return CwRezDlgAblieferzone;
});
//# sourceMappingURL=cwRezDlgAblieferzone.js.map