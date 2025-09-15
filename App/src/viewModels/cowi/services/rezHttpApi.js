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
define(["require", "exports", "../../../services/http"], function (require, exports, HttpService) {
    "use strict";
    var RezHttpApi = /** @class */ (function () {
        function RezHttpApi() {
        }
        RezHttpApi.prototype.http = function (serviceName, methodName, method, args, timeout) {
            return __awaiter(this, void 0, void 0, function () {
                var baseUrl, params, key, call;
                return __generator(this, function (_a) {
                    baseUrl = serviceName + ".svc/js/" + methodName;
                    if (method.toLowerCase() === "get") {
                        params = new URLSearchParams();
                        for (key in args) {
                            if (args.hasOwnProperty(key)) {
                                params.append(key, args[key]);
                            }
                        }
                        baseUrl =
                            Array.from(params).length > 0
                                ? baseUrl + "?" + params.toString()
                                : baseUrl;
                        args = null;
                    }
                    call = function () {
                        return fetch(baseUrl, {
                            method: method,
                            body: args !== null && args !== void 0 ? JSON.stringify(args) : null,
                            headers: { "Content-Type": "application/json; charset=utf-8" },
                        });
                    };
                    if (this.isTimeout(timeout)) {
                        return [2 /*return*/, this.time_out({
                                ms: timeout,
                                promise: call,
                                methodName: methodName,
                            })];
                    }
                    else {
                        return [2 /*return*/, call()
                                .then(function (response) {
                                if (!response.ok) {
                                    throw new Error("Methodname: " + methodName + "; HTTP status: " + response.status);
                                }
                                return response.json();
                            })
                                .catch(function (ex) {
                                console.error("Error in " + methodName + ":", ex);
                                if (ex instanceof TypeError) {
                                    console.error("Network error or CORS issue:", ex);
                                }
                                // Ensure the rejection is an Error object
                                throw ex instanceof Error ? ex : new Error(JSON.stringify(ex));
                            })];
                    }
                    return [2 /*return*/];
                });
            });
        };
        // Diese Methode wird für den OPUS Webservice benötigt.
        // Sie darf keine try-catch-Anweisung enthalten, da OPUS keine standardmäßigen HTTP-Statuscodes verwendet.
        // Bei einem Fehler – z. B. wenn ein Produktionsauftrag (PA) ungültig ist –
        // liefert OPUS stattdessen eine 500er-Fehlermeldung (Server Error) mit einer erklärenden Nachricht im Response-Body.
        // Diese Nachricht muss ausgewertet werden, um den Fehler korrekt zu erkennen und zu behandeln.
        RezHttpApi.prototype.post = function (serviceName, methodName, args, timeout) {
            return __awaiter(this, void 0, void 0, function () {
                var url, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = serviceName + ".svc/js/" + methodName;
                            if (!this.isTimeout(timeout)) return [3 /*break*/, 1];
                            _a = this.time_out({
                                ms: timeout,
                                promise: HttpService.post(url, args),
                                methodName: methodName,
                            });
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, HttpService.post(url, args)];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                });
            });
        };
        RezHttpApi.prototype.get = function (serviceName, methodName, timeout) {
            return __awaiter(this, void 0, void 0, function () {
                var url, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = serviceName + ".svc/js/" + methodName;
                            if (!this.isTimeout(timeout)) return [3 /*break*/, 1];
                            _a = this.time_out({
                                ms: timeout,
                                promise: HttpService.get(url),
                                methodName: methodName,
                            });
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, HttpService.get(url)];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                });
            });
        };
        RezHttpApi.prototype.time_out = function (_a) {
            var ms = _a.ms, promise = _a.promise, methodName = _a.methodName;
            return __awaiter(this, void 0, void 0, function () {
                var t;
                var _this = this;
                return __generator(this, function (_b) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var response, ex_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        t = setTimeout(function () {
                                            reject(new Error("Zeit\u00FCberlauf => call method '" + methodName + "'"));
                                        }, ms);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, 4, 5]);
                                        return [4 /*yield*/, promise()];
                                    case 2:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Methodname: " + methodName + "; HTTP status: " + response.status);
                                        }
                                        resolve(response.json());
                                        return [3 /*break*/, 5];
                                    case 3:
                                        ex_1 = _a.sent();
                                        console.error("Error in " + methodName + ":", ex_1);
                                        if (ex_1.name === "AbortError") {
                                            // Anfrage wurde abgebrochen
                                            return [2 /*return*/];
                                        }
                                        reject(ex_1 instanceof Error ? ex_1 : new Error(JSON.stringify(ex_1)));
                                        return [3 /*break*/, 5];
                                    case 4:
                                        clearTimeout(t);
                                        return [7 /*endfinally*/];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        RezHttpApi.prototype.isTimeout = function (timeout) {
            return typeof timeout === "number" && timeout > 0;
        };
        return RezHttpApi;
    }());
    return RezHttpApi;
});
//# sourceMappingURL=rezHttpApi.js.map