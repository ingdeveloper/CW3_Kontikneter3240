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
define(["require", "exports", "./logger", "./api", "./cookieService"], function (require, exports, Logger, Api, CookieService) {
    "use strict";
    var SessionService = /** @class */ (function () {
        function SessionService() {
        }
        /**
             * Creates a simple V4 UUID. This should not be used as a PK in your database. It can be used to generate internal, unique ids. For a more robust solution see [node-uuid](https://github.com/broofa/node-uuid).
             * @method guid
             * @return {string} The guid.
             */
        SessionService.guid = function () {
            return uuid.v4();
        };
        SessionService.getClientId = function () {
            var clientId = CookieService.get(SessionService.clientIdCookieName);
            if (!clientId) {
                clientId = SessionService.guid();
                Logger.info(SessionService, "Generated client ID: " + clientId);
                CookieService.set(SessionService.clientIdCookieName, clientId, { expires: 7 });
            }
            return clientId;
        };
        SessionService.setClientId = function (clientId) {
            if (clientId) {
                CookieService.set(SessionService.clientIdCookieName, clientId, { expires: 7 });
            }
        };
        SessionService.getSecurityToken = function () {
            return CookieService.get(SessionService.securityTokenCookieName); //, (value) => { return value.replace(/\s/g, "+")}) as string;
            //return Cookies.get(SessionService.securityTokenCookieName) || null;
        };
        SessionService.setSecurityToken = function (token) {
            CookieService.set(SessionService.securityTokenCookieName, token, {
                expires: 7
            });
        };
        SessionService.clearSecureSession = function () {
            CookieService.remove(SessionService.securityTokenCookieName);
            SessionService.currentLoggedInUser(null);
            SessionService.currentLoggedInUserIsDomainUser(false);
            SessionService.currentUserProjectAuthorizations([]);
            SessionService.currentUserSystemAuthorizations([]);
        };
        SessionService.updateSessionInformation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var login, authorizations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SessionService.getCurrentLoggedInUser()];
                        case 1:
                            login = _a.sent();
                            if (!login)
                                return [2 /*return*/, false];
                            return [4 /*yield*/, SessionService.getCurrentUserAuthorizations()];
                        case 2:
                            authorizations = _a.sent();
                            return [2 /*return*/, !!authorizations];
                    }
                });
            });
        };
        SessionService.getCurrentLoggedInUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, isLoggedIn, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) {
                                //Logger.warn(SecurityService, "User not logged in in the current session");
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, Api.securityService.isUserLoggedIn(securityToken, SessionService.timeOut)];
                        case 1:
                            isLoggedIn = _a.sent();
                            if (!isLoggedIn) {
                                SessionService.clearSecureSession();
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, Api.securityService.getCurrentLoggedInUser(securityToken, SessionService.timeOut)];
                        case 2:
                            user = _a.sent();
                            if (SessionService.currentLoggedInUser() !== user.Name) {
                                SessionService.currentLoggedInUser(user.Name);
                            }
                            else {
                                SessionService.currentLoggedInUser.valueHasMutated();
                            }
                            SessionService.currentLoggedInUserIsDomainUser(user.IsADUser);
                            return [2 /*return*/, user.Name];
                    }
                });
            });
        };
        SessionService.getCurrentUserAuthorizations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, authorizations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken || !SessionService.currentLoggedInUser()) {
                                //Logger.info(SecurityService, "There is no user currently logged in");
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, Api.securityService.getCurrentUserAuthorizations(securityToken, SessionService.timeOut)];
                        case 1:
                            authorizations = _a.sent();
                            if (!authorizations) {
                                SessionService.clearSecureSession();
                                return [2 /*return*/, null];
                            }
                            SessionService.currentUserProjectAuthorizations(authorizations.ProjectAuthorizations);
                            SessionService.currentUserSystemAuthorizations(authorizations.SystemAuthorizations);
                            return [2 /*return*/, authorizations];
                    }
                });
            });
        };
        SessionService.isUserLoggedIn = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Api.securityService.isUserLoggedIn(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SessionService.clientIdCookieName = "wf_clientID";
        SessionService.securityTokenCookieName = "wf_stk";
        SessionService.timeOut = 10000;
        SessionService.currentLoggedInUser = ko.observable(null);
        SessionService.currentLoggedInUserIsDomainUser = ko.observable(false);
        SessionService.currentUserProjectAuthorizations = ko.observableArray([]);
        SessionService.currentUserSystemAuthorizations = ko.observableArray([]);
        return SessionService;
    }());
    return SessionService;
});
//# sourceMappingURL=sessionService.js.map