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
define(["require", "exports", "plugins/dialog", "../services/rezService"], function (require, exports, dialog, rezService_1) {
    "use strict";
    var CwRezDlgSave = /** @class */ (function () {
        function CwRezDlgSave(rezNr, rezVer, rezName, anlKennung, versioning) {
            this.autocompleteItems = ko.observableArray([]);
            this.rezNr = ko.observable();
            this.rezVer = ko.observable();
            this.rezName = ko.observable();
            this.versionierung = ko.observable();
            this.btnDefaultState = {
                title: "",
                text: "Speichern",
                class: "btn btn-default",
            };
            this.btnSaveState = ko.observable(this.btnDefaultState);
            this.rezNr(rezNr);
            this.rezVer(rezVer || 0);
            this.rezName(rezName);
            this.anlagenKennung = anlKennung;
            this.versionierung(versioning);
        }
        CwRezDlgSave.prototype.compositionComplete = function () {
            var _this = this;
            var self = this;
            _.delay(function () {
                $("#inNum").focus();
            }, 100);
            // beim ersten Laden der Maske
            self.getAuautocompleteItems();
            var debounce = _.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    self.getAuautocompleteItems();
                    return [2 /*return*/];
                });
            }); }, 600);
            $("#inNum").on("input", function () {
                this.setCustomValidity("");
                debounce();
            });
            if (self.versionierung()) {
                $("#inVer").on("input", function () {
                    debounce();
                });
            }
        };
        // setzt führende Nullen ins Rez.Nr. Eingabefeld
        CwRezDlgSave.prototype.format = function (elem) {
            return elem.toString().trim().padStart(9, "0");
        };
        // erstellt eine Autocomplete-Rez.Namenliste
        CwRezDlgSave.prototype.getAuautocompleteItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, rzNummer, rzVer, resp, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            rzNummer = Number($("#inNum").val());
                            rzVer = Number($("#inVer").val());
                            if (rzNummer === self.lastInputRezNr && rzVer === self.lastInputVer) {
                                return [2 /*return*/];
                            }
                            if ($("#inNum").is(":invalid") || $("#inVer").is(":invalid")) {
                                self.btnSaveState(self.btnDefaultState); // Button-Speichern defaultwerte einspielen
                                return [2 /*return*/];
                            }
                            self.lastInputRezNr = rzNummer;
                            self.lastInputVer = rzVer;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, rezService_1.rezService.GetRezNamen(self.format(rzNummer))];
                        case 2:
                            resp = _a.sent();
                            self.autocompleteItems(resp.GetRezNamenResult.Data);
                            self.ctrlBtnSave(self);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1) {
                                throw error_1;
                            }
                            else {
                                throw new Error("Fehler in cwRezDlgSave/getAuautocompleteItems(obj, elem)");
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** ctrl SaveBtn */
        CwRezDlgSave.prototype.ctrlBtnSave = function (obj) {
            return __awaiter(this, void 0, void 0, function () {
                var self, state, resp, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = obj;
                            state = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, rezService_1.rezService.IstRezeptVorhanden({
                                    rezNr: self.format(self.lastInputRezNr),
                                    verNr: self.lastInputVer,
                                    werk: this.anlagenKennung.werk,
                                    abteiNr: this.anlagenKennung.abteiNr,
                                    halle: this.anlagenKennung.halle,
                                    etage: this.anlagenKennung.etage,
                                    linie: this.anlagenKennung.linie,
                                    maschine: this.anlagenKennung.maschine,
                                })];
                        case 2:
                            resp = _a.sent();
                            if (!resp.IstRezeptVorhandenResult.Succeed) {
                                throw new Error(resp.IstRezeptVorhandenResult.Msg);
                            }
                            if (!resp.IstRezeptVorhandenResult.Data) {
                                // speichern
                                state = {
                                    class: "btn btn-success",
                                    text: "Speichern",
                                    title: "Rezept wird angelegt",
                                };
                            }
                            else {
                                // überschreiben
                                state = {
                                    class: "btn btn-danger",
                                    text: "Überschreiben",
                                    title: "Rezept existiert bereits und wird überschrieben!",
                                };
                            }
                            self.btnSaveState(state);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            if (error_2) {
                                throw error_2;
                            }
                            else {
                                throw new Error("Fehler in cwRezDlgSave/ctrlBtnSave(obj)");
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CwRezDlgSave.prototype.save = function () {
            var inputElement = $("#inNum")[0];
            var pattern = /^\d[0-9]+$/; // Dein Muster hier
            if (!pattern.test(inputElement.value) || Number(inputElement.value) <= 0) {
                inputElement.setCustomValidity("Rezeptnummer 0 oder alphanumerische Zeichen sind nicht zulässig.");
                inputElement.reportValidity();
                return;
            }
            inputElement.setCustomValidity(""); // Setzt die benutzerdefinierte Fehlermeldung zurück
            dialog.close(this, {
                state: "save",
                rezNr: this.format(Number(inputElement.value)),
                rezVer: this.rezVer(),
                rezName: this.rezName().trim(),
            });
        };
        CwRezDlgSave.prototype.close = function () {
            dialog.close(this, { state: "close" });
        };
        return CwRezDlgSave;
    }());
    return CwRezDlgSave;
});
//# sourceMappingURL=cwRezDlgSave.js.map