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
define(["require", "exports", "./cwRezDlg", "plugins/dialog", "../../../services/connector", "../../../viewModels/cowi/services/rezService"], function (require, exports, MsgBox, dialog, Connector, rezService_1) {
    "use strict";
    var cwDlgRezEdit = /** @class */ (function () {
        function cwDlgRezEdit(html, item, ident) {
            /** Indikator "Beschäftigt" */
            this.busy = ko.observable(false);
            /** Datenpool für die anstehende Änderungen */
            this.changedElements = ko.observableArray([]);
            this.ident = Array.isArray(ident) ? ident[ident.length - 1] : ident;
            this.connector = new Connector();
            this.spsValue = this.connector.getSignal(item["alias"]).value().toString();
            this.txtBody = html;
            var description = item["description"] ? " - " + item["description"] : "";
            this.title = item["alias"] + description;
            this.spsAlias = item["alias"];
            this.db2Alias = item["db2Alias"];
            this.factor = item["factor"];
            this.user = item["user"];
        }
        cwDlgRezEdit.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.parseVal();
                    return [2 /*return*/];
                });
            });
        };
        // /** schreibt Log in die Datenbank
        //  * @param msg Log-Message
        //  * @param logType Meldungstyp
        //  */
        // protected AddLog(msg: string, logType: LogType): void {
        //   const self: this = this;
        //   Log.Add(
        //     parseInt(self.spsValue),
        //     JSON.stringify(self.ident),
        //     "`${self.userInfo()}; Admin: ${self.adminName()}`",
        //     logType,
        //     msg,
        //     "self.selectedPaNr()",
        //     "self.selectedRecipe.Nr()",
        //     "",
        //     "self.selectedRecipeVer()"
        //   ).catch((error) => Logger.errorToast(error));
        // }
        cwDlgRezEdit.prototype.parseVal = function () {
            var self = this;
            // SPS-Aktualwert in HTML-Konstrukt einbauen
            $("input[type='search']").after("<div class=\"pull-right\">SPS-Aktualwert: " + self.spsValue + "</div>");
            // keine Input-Elemente einbauen, wenn der Faktor von 1 abweicht
            if (self.factor !== "1") {
                // Infotext in HTML-Konstrukt einbauen
                $("input[type='search']").after("<div style=\"color:tomato;\" class=\"pull-right\">Die Bearbeitung n. m\u00F6glich, der Wert ist skaliert</div>");
                return;
            }
            $("[id^=rezVal_]").each(function (i, e) {
                var val = e.textContent;
                var title = "DB-Wert: " + val + "; SPS-Wert: " + self.spsValue;
                var discr = val !== self.spsValue ? "diff" : "equal";
                // dataset erweitern um Alias-Namen
                $(e).data("rezparam")["alias"] = self.db2Alias || self.spsAlias;
                var rezparams = JSON.stringify($(e).data("rezparam"));
                $(e).html("<input type=\"number\" class=\"editable " + discr + "\" value=\"" + val + "\" title=\"" + title + "\" data-signalinfo=" + rezparams + " data-bind=\"event:{change:function(data, event){valChanged(data, event)}}\">");
                // dynamisch erzuegte HTML-Elemente mit Bindungen aktivieren
                ko.applyBindings(self, e);
            });
        };
        cwDlgRezEdit.prototype.valChanged = function () {
            var any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                any[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var $elem, newValue, oldValue, index;
                return __generator(this, function (_a) {
                    $elem = $(any[1].currentTarget);
                    newValue = $elem.val();
                    oldValue = $elem.prop("defaultValue");
                    //  Visuelle classe 'changed' setzen/rücksetzen
                    newValue !== oldValue
                        ? $elem.addClass("changed")
                        : $elem.removeClass("changed");
                    index = this.changedElements().findIndex(function (obj) { return obj[0].dataset.signalinfo === $elem[0].dataset.signalinfo; });
                    if (index !== -1) {
                        // wenn die alt/neu -Werte übereinstimmen, dann aus dem Array löschen
                        if (newValue === oldValue)
                            this.changedElements.remove(this.changedElements()[index]);
                        // wenn alt/neu -Werte unterschiedlich, dann ersetzen
                        else
                            this.changedElements.replace($elem, $elem);
                        // wenn das changedElements-Array noch leer ist, dann push'en
                    }
                    else
                        this.changedElements.push($elem);
                    return [2 /*return*/];
                });
            });
        };
        cwDlgRezEdit.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, values, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            self.busy(true);
                            values = [];
                            self.changedElements().forEach(function (element) {
                                /** Triggerobjekt */
                                var $elem = $(element[0]);
                                var newValue = $elem.val();
                                var dataSet = $elem.data("signalinfo");
                                values.push({
                                    AliasName: dataSet.alias,
                                    Value: newValue,
                                    RezNr: dataSet.reznr,
                                    RezVer: dataSet.rezver,
                                });
                            });
                            return [4 /*yield*/, rezService_1.rezService.UpdateRezDB({
                                    Data: values,
                                    User: self.user,
                                    Werk: self.ident["werk"],
                                    Halle: self.ident["halle"],
                                    Etage: self.ident["etage"],
                                    Linie: self.ident["linie"],
                                    Abteil: self.ident["abteiNr"],
                                    Maschine: self.ident["maschine"],
                                    RezeptNr: "",
                                    RezeptVer: "",
                                    RezeptName: "",
                                })];
                        case 1:
                            response = _a.sent();
                            if (!!response.UpdateRezDBResult.Succeed) return [3 /*break*/, 3];
                            return [4 /*yield*/, dialog.show(new MsgBox("Error", response.UpdateRezDBResult.Msg, "Tomato"))];
                        case 2:
                            _a.sent();
                            this.abort();
                            _a.label = 3;
                        case 3:
                            // Eingabe auf alten ungeänderten Wert zurücksetzen
                            self.changedElements().forEach(function (element) {
                                /** Triggerobjekt */
                                var $elem = $(element[0]);
                                var newValue = $elem.val();
                                // 1. - Klasse 'changed' löschen
                                // 2. - Fokus aus den Eingabe-Elementen wegnehemen.
                                // 3. - da die Titelinformation zu kompliziert
                                //      zu refresh'en ist wird's nach dem 'Save' gelöscht.
                                $elem.removeClass("changed").blur().attr("title", "");
                                newValue !== self.spsValue
                                    ? $elem.removeClass("equal").addClass("diff")
                                    : $elem.removeClass("diff").addClass("equal");
                            });
                            self.changedElements.removeAll();
                            self.busy(false);
                            return [2 /*return*/];
                    }
                });
            });
        };
        cwDlgRezEdit.prototype.abort = function () {
            this.response = {
                state: 0,
                nachname: this.user,
                usberez: window.UserLevel().toString(),
                usid: "1",
                vorname: this.user,
            };
            this.close();
        };
        cwDlgRezEdit.prototype.close = function () {
            var self = this;
            self.connector.unregisterSignals(self.spsAlias);
            dialog.close(self, self.response);
        };
        return cwDlgRezEdit;
    }());
    return cwDlgRezEdit;
});
//# sourceMappingURL=cwDlgRezEdit.js.map