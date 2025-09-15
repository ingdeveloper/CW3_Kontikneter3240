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
define(["require", "exports", "plugins/dialog", "src/viewModels/cowi/dialoge/cwLogInOutMsg", "../../../services/http"], function (require, exports, dialog, MsgBox, http) {
    "use strict";
    var CwLogInOut = /** @class */ (function () {
        function CwLogInOut() {
            this.user = ko.observable();
            this.pass = ko.observable();
            this.userNname = ko.observable();
            this.userVname = ko.observable();
            this.userBerRez = ko.observable();
            this.userID = ko.observable();
            /** Netzpfad zu WcfRezept */
            this.webServPath1 = window.rootUrlPrefix + "/WcfRezept/WsRezept.svc/js/";
            this.respValues = {};
        }
        CwLogInOut.prototype.compositionComplete = function () {
            var self = this;
            $("#loginoutname").focusin(function () {
                $("#loginoutname").css("background-color", "#F3F781");
            });
            $("#loginoutname").focusout(function () {
                $("#loginoutname").css("background-color", "transparent");
            });
            $("#loginoutpw").focusin(function () {
                $("#loginoutpw").css("background-color", "#F3F781");
            });
            $("#loginoutpw").focusout(function () {
                $("#loginoutpw").css("background-color", "transparent");
            });
            //--Timeout auf Focus setzen, weil sonst der Befehl zu früh gesetzt wird, Problem ist Bootstrap
            setTimeout(function () {
                $('#loginoutname').focus();
            }, 300);
            $("#form").submit(function (event) {
                event.preventDefault();
                self
                    .getUserRights()
                    .then(function (res) {
                    dialog.close(self, res);
                })
                    .catch(function (ex) {
                    dialog.show(new MsgBox("Fehler bei der Anmeldung", ex));
                });
            });
        };
        CwLogInOut.prototype.close = function () {
            var self = this;
            self.respValues.usnname = "";
            self.respValues.usvname = "";
            self.respValues.usberez = "";
            self.respValues.usid = "";
            dialog.close(self, this.respValues);
        };
        CwLogInOut.prototype.getUserRights = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, cmd, response, res, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            cmd = {
                                odbcCmd: "SELECT usnname, usvname, usberez, usid FROM cwprddta.wfuserpf1 WHERE\n      ususer = '" + self.user() + "' AND uspass = '" + self.pass() + "'"
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, http.post(self.webServPath1 + "ReadDatabase", cmd)];
                        case 2:
                            response = (_a.sent());
                            if (response.ReadDatabaseResult.length === 0) {
                                // tslint:disable-next-line:no-string-throw
                                throw "Benutzer '" + self.user() + "' bzw. Passwort ist falsch";
                            }
                            res = response.ReadDatabaseResult[0].split("|");
                            self.respValues.usnname = res[0] || "";
                            self.respValues.usvname = res[1] || "";
                            self.respValues.usberez = res[2] || "";
                            self.respValues.usid = res[3] || "";
                            return [2 /*return*/, self.respValues];
                        case 3:
                            error_1 = _a.sent();
                            // Logger.error(self, error);
                            throw new Error(error_1);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return CwLogInOut;
    }());
    return CwLogInOut;
});
//# sourceMappingURL=cwLogInOut.js.map