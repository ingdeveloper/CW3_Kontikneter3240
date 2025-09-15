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
define(["require", "exports", "../components/services/changed-field-animation.service", "../components/services/visual-states.service", "../components/component-base.model", "../components/services/signal-array.service", "../viewModels/cowi/services/rezService"], function (require, exports, ChangedFieldAnimationService, VisualStatesService, ComponentBaseModel, SignalArrayService, rezService_1) {
    "use strict";
    var RezInfo = /** @class */ (function (_super) {
        __extends(RezInfo, _super);
        function RezInfo(params) {
            var _this = _super.call(this, params) || this;
            _this.signalRezNameValue = ko.observable();
            _this.uid = ko.observable(
            // uuid.v4()
            "uid-" + Math.random().toString(36).slice(2, 9));
            _this.signalArraySrvc = [];
            _this.signalRezNr = _this.signalNameRezNr
                ? _this.connector.getSignal(_this.signalNameRezNr)
                : null;
            _this.signalVerNr = _this.signalNameVerNr
                ? _this.connector.getSignal(_this.signalNameVerNr)
                : null;
            _this.signalPaNr = _this.signalNamePaNr
                ? _this.connector.getSignal(_this.signalNamePaNr)
                : null;
            _this.signalProdTyp = _this.signalNameProdTyp
                ? _this.connector.getSignal(_this.signalNameProdTyp)
                : null;
            _this.initializeSignalArray();
            _this.initializeSignals();
            _this.initializeStates();
            _this.initializeChangedFieldAnimation();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        RezInfo.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.signalNameRezNr = (ko.unwrap(this.settings.signalNameRezNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalRezNrValue = "";
            this.signalNameVerNr = (ko.unwrap(this.settings.signalNameVerNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalVerNrValue = "";
            this.signalNamePaNr = (ko.unwrap(this.settings.signalNamePaNr) || "").stringPlaceholderResolver(this.objectID);
            this.signalPaNrValue = "";
            this.signalNameProdTyp = (ko.unwrap(this.settings.signalNameProdTyp) || "").stringPlaceholderResolver(this.objectID);
            this.signalProdTypValue = "";
            this.werk = ko.unwrap(this.settings.werk);
            this.halle = ko.unwrap(this.settings.halle);
            this.etage = ko.unwrap(this.settings.etage);
            this.linie = ko.unwrap(this.settings.linie);
            this.maschine = ko.unwrap(this.settings.maschine);
        };
        RezInfo.prototype.initializeSignalArray = function () {
            this.signalNameRezNr
                ? (this.signalArraySrvc[this.signalNameRezNr] = new SignalArrayService(this.settings, this.signalRezNr))
                : null;
            this.signalNameVerNr
                ? (this.signalArraySrvc[this.signalNameVerNr] = new SignalArrayService(this.settings, this.signalVerNr))
                : null;
            this.signalNamePaNr
                ? (this.signalArraySrvc[this.signalNamePaNr] = new SignalArrayService(this.settings, this.signalPaNr))
                : null;
            this.signalNameProdTyp
                ? (this.signalArraySrvc[this.signalNameProdTyp] = new SignalArrayService(this.settings, this.signalProdTyp))
                : null;
        };
        RezInfo.prototype.initializeChangedFieldAnimation = function () {
            var _this = this;
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalRezNrValue, this.cssDisplayClass);
            this.cssClass = ko.computed(function () {
                return _this.changedFieldAnimationService.cssClass() || "btn btn-default";
            }, this);
        };
        RezInfo.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
            this.cssDisplayClass = this.states.css;
        };
        RezInfo.prototype.waitForElement = function (selector, callback) {
            var interval = setInterval(function () {
                var elem = $(selector);
                if (elem.length) {
                    clearInterval(interval);
                    callback(elem);
                }
            }, 500); // Überprüft alle 500ms
        };
        /** Durchlaufen der relevanten Elemente und Setzen von Symbolen entsprechend dem Status */
        RezInfo.prototype.symbolStatePaTyp = function (sig, elem) {
            // Vorherige Klassen gegebenenfalls entfernen.
            $(elem).removeClass("paTypPV paTypPB paTypPF paTypPU paTypPL paTypRR paTypOF paTypDU paTypNL paTypProduktion");
            // Prod.Typ-Symbol für Head Infobereich
            var statusText = $(elem).next(".pastatus.text");
            // Animation zurücksetzen
            statusText.css("animation", "none");
            switch (sig) {
                case -1:
                case 1:
                case 3:
                    $(elem)
                        .addClass("paTypProduktion")
                        .attr("title", "Produktionsauftrag. SPS-Statusbyte [" + sig + "]");
                    statusText.text("gestartet").css("color", "limegreen");
                    break;
                case 9:
                    $(elem)
                        .addClass("paTypRR")
                        .attr("title", "Reinigungsauftrag. SPS-Statusbyte [" + sig + "]");
                    statusText.text("Reinigung").css("color", "#74c0fc");
                    break;
                case 125:
                    $(elem)
                        .addClass("paTypOF")
                        .attr("title", "Produktion Ofen. SPS-Statusbyte [" + sig + "]");
                    statusText
                        .text("Ofen-Autostart/Aufheizprogramm")
                        .css("color", "#d35500")
                        .css("animation", "animation-fade 1.75s linear infinite alternate");
                    break;
                case 253:
                    $(elem)
                        .addClass("paTypNL")
                        .attr("title", "Nachlauf-/Trocknungszeit SPS-Statusbyte [" + sig + "]");
                    statusText
                        .text("Nachlauf-/Trocknungszeit")
                        .css("color", "#672AC4")
                        .css("animation", "animation-fade 2.0s infinite");
                    break;
                case 255:
                    $(elem)
                        .addClass("paTypDU")
                        .attr("title", "Produktion DUMMY. SPS-Statusbyte [" + sig + "]");
                    statusText
                        .text("Dummy")
                        .css("color", "#ffcc00")
                        .css("animation", "animation-fade 2.0s infinite");
                    break;
                default:
                    $(elem).attr("title", "Prod.Typ gestoppt. SPS-Statusbyte [" + sig + "]");
                    statusText.text("gestoppt").css("color", "tomato");
                    break;
            }
        };
        RezInfo.prototype.initializeSignals = function () {
            var _this = this;
            var self = this;
            // PA-Nummer
            this.signalPaNrValue = ko.computed(function () {
                return _this.signalPaNr
                    ? _this.signalPaNr.value() *
                        _this.signalArraySrvc[_this.signalNamePaNr].signalValueFactor
                    : "";
            }, this);
            // Prod.Typ
            this.signalProdTypValue = ko.computed(function () {
                var resp = _this.signalProdTyp
                    ? _this.signalProdTyp.value() *
                        _this.signalArraySrvc[_this.signalNameProdTyp].signalValueFactor
                    : 0;
                if (Number(resp) || Number(resp) == 0) {
                    /** bei Änderung des Prod.-Status CSS updaten */
                    _this.waitForElement(".clRezeptDlg #" + _this.uid(), function (elem) {
                        return _this.symbolStatePaTyp(Number(resp), elem);
                    });
                }
                return resp;
            }, this);
            // Rezeptnummer
            var setRezName = function (nr, ver) {
                var self = _this;
                // Rezeptname auflösen
                self
                    .callService(nr, ver)
                    .then(function (res) {
                    var vn = res.toString().split("|");
                    if (ver) {
                        return vn.length > 2 ? "V" + vn[1] + " - " + vn[2] : "n/a";
                    }
                    else {
                        return vn.length > 2 ? "" + vn[2] : "n/a";
                    }
                })
                    .then(function (name) { return self.signalRezNameValue(name); });
            };
            this.signalRezNrValue = ko
                .computed(function () {
                var value = _this.signalRezNr
                    ? _this.signalRezNr.value() *
                        _this.signalArraySrvc[_this.signalNameRezNr].signalValueFactor
                    : "";
                if (value) {
                    setRezName(value, ko.unwrap(_this.signalVerNrValue));
                }
                return value;
            }, this)
                .extend({ numeralNumber: "000000000" });
            this.signalVerNrValue = ko.computed(function () {
                var value = _this.signalVerNr
                    ? _this.signalVerNr.value() *
                        _this.signalArraySrvc[_this.signalNameVerNr].signalValueFactor
                    : "";
                if (value) {
                    ko.unwrap(_this.signalRezNrValue), value;
                }
                return value;
            }, this);
        };
        /**
         * Liefert eine Rezeptliste.
         * @param rezNr optional, wenn angegeben, dann Info über gewählte Rezeptur.
         * @param rezVer optional, wenn angegeben, dann Info über gewählte Rezepturversion.
         * @returns Promise<string[]> Eine Promise, die ein Array von Strings zurückgibt.
         */
        RezInfo.prototype.callService = function (rezNr, rezVer) {
            return __awaiter(this, void 0, void 0, function () {
                var ret, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, rezService_1.rezService.GetRezList({
                                    werk: this.werk,
                                    halle: this.halle,
                                    etage: this.etage,
                                    linie: this.linie,
                                    maschine: this.maschine,
                                    reznr: rezNr,
                                    rezver: rezVer,
                                })];
                        case 1:
                            ret = _a.sent();
                            return [2 /*return*/, ret.GetRezListResult.Data];
                        case 2:
                            ex_1 = _a.sent();
                            throw ex_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        RezInfo.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signals, _a, _b, iSignal;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _d.sent();
                            this.changedFieldAnimationService.dispose();
                            return [4 /*yield*/, this.states.unregisterSignals()];
                        case 2:
                            _d.sent();
                            signals = [];
                            try {
                                for (_a = __values([
                                    this.signalRezNr,
                                    this.signalPaNr,
                                    this.signalProdTyp,
                                ]), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    iSignal = _b.value;
                                    if (iSignal) {
                                        signals.push(iSignal);
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return [4 /*yield*/, this.connector.unregisterSignals(signals)];
                        case 3:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RezInfo;
    }(ComponentBaseModel));
    return RezInfo;
});
//# sourceMappingURL=rez-info.component.js.map