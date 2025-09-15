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
define(["require", "exports", "./sessionService", "./connectorService", "./symbolicTextsService", "./api", "./logger", "./signalsService", "./errorCodeService"], function (require, exports, SessionService, ConnectorService, SymbolicTextsService, Api, Logger, SignalsService, ErrorCodeService) {
    "use strict";
    var SecurityService = /** @class */ (function () {
        function SecurityService() {
        }
        SecurityService.login = function (userName, password, isDomainUser) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            SessionService.clearSecureSession();
                            Logger.info(SecurityService, "Logging in client ID: " + SessionService.getClientId());
                            return [4 /*yield*/, SecurityService.performLogin(userName, password, isDomainUser)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SecurityService.logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                var status_1, loggedOutSuccessText, loggedOutFailedText, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Api.securityService.logout(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 1:
                            status_1 = _a.sent();
                            if (status_1) {
                                loggedOutSuccessText = SymbolicTextsService.translate("I4SCADA_User_name_successfully_logged_out")().format(SessionService.currentLoggedInUser());
                                Logger.info(SecurityService, loggedOutSuccessText);
                                Logger.successToast(loggedOutSuccessText);
                                SessionService.clearSecureSession();
                                return [2 /*return*/, true];
                            }
                            loggedOutFailedText = SymbolicTextsService.translate("I4SCADA_Failed_to_logout_user_name")().format(SessionService.currentLoggedInUser());
                            Logger.warn(SecurityService, loggedOutFailedText);
                            Logger.warnToast(loggedOutFailedText);
                            return [2 /*return*/, false];
                        case 2:
                            error_1 = _a.sent();
                            Logger.handleError(SecurityService)(error_1);
                            SessionService.clearSecureSession(); //not sure about this one
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.checkProjectAuthorizations = function (authorizations) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!SessionService.getSecurityToken() || !SessionService.currentLoggedInUser()) {
                                //Logger.info(SecurityService, "There is no user currently logged in");
                                return [2 /*return*/, null];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Api.securityService.checkProjectAuthorizations(SessionService.getSecurityToken(), authorizations, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_2 = _a.sent();
                            Logger.handleError(SecurityService)(error_2);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.checkSystemAuthorizations = function (authorizations) {
            return __awaiter(this, void 0, void 0, function () {
                var authorizationFlags, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!SessionService.getSecurityToken() || !SessionService.currentLoggedInUser()) {
                                Logger.info(SecurityService, "There is no user currently logged in");
                                return [2 /*return*/, null];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Api.securityService.checkSystemAuthorizations(SessionService.getSecurityToken(), authorizations, SessionService.timeOut)];
                        case 2:
                            authorizationFlags = _a.sent();
                            if (!authorizationFlags) {
                                Logger.info(SecurityService, "There is no user currently logged in");
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, authorizationFlags];
                        case 3:
                            error_3 = _a.sent();
                            Logger.handleError(SecurityService)(error_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.performLogin = function (userName, password, isDomainUser) {
            return __awaiter(this, void 0, void 0, function () {
                var token, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Api.securityService.login(SessionService.sessionId, SessionService.getClientId(), userName, password, isDomainUser, SessionService.timeOut)];
                        case 1:
                            token = _a.sent();
                            return [2 /*return*/, SecurityService.executeAfterLogin(token)];
                        case 2:
                            error_4 = _a.sent();
                            Logger.handleError(SecurityService)(error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.loginWindowsUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            SessionService.clearSecureSession();
                            return [4 /*yield*/, Api.securityService.loginWindowsUser(SessionService.sessionId, SessionService.getClientId(), SessionService.timeOut)];
                        case 2:
                            token = _a.sent();
                            return [4 /*yield*/, SecurityService.executeAfterLogin(token)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            error_5 = _a.sent();
                            Logger.handleError(SecurityService)(error_5);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getCallerAccountDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Api.securityService.getCallerAccountDetails()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SecurityService.getAllAuthorizationGroupDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllAuthorizationGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_6 = _a.sent();
                            Logger.handleError(SecurityService)(error_6);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllAuthorizationGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllAuthorizationGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_7 = _a.sent();
                            Logger.handleError(SecurityService)(error_7);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.insertAuthorizationGroup = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.insertAuthorizationGroup(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_8 = _a.sent();
                            Logger.handleError(SecurityService)(error_8);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.updateAuthorizationGroup = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.updateAuthorizationGroup(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_9 = _a.sent();
                            Logger.handleError(SecurityService)(error_9);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.deleteAuthorizationGroup = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.deleteAuthorizationGroup(SessionService.getSecurityToken(), id, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_10 = _a.sent();
                            Logger.handleError(SecurityService)(error_10);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllProjectAuthorization = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllProjectAuthorization(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_11 = _a.sent();
                            Logger.handleError(SecurityService)(error_11);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.insertProjectAuthorization = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.insertProjectAuthorization(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_12 = _a.sent();
                            Logger.handleError(SecurityService)(error_12);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.updateProjectAuthorization = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.updateProjectAuthorization(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_13 = _a.sent();
                            Logger.handleError(SecurityService)(error_13);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.deleteProjectAuthorization = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.deleteProjectAuthorization(SessionService.getSecurityToken(), id, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_14 = _a.sent();
                            Logger.handleError(SecurityService)(error_14);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllSystemAuthorization = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllSystemAuthorization(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_15 = _a.sent();
                            Logger.handleError(SecurityService)(error_15);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllSchedulerLocation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllSchedulerLocation(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_16 = _a.sent();
                            Logger.handleError(SecurityService)(error_16);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllAccessGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllAccessGroup(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_17 = _a.sent();
                            Logger.handleError(SecurityService)(error_17);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.getAllAccessGroupDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.getAllAccessGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_18 = _a.sent();
                            Logger.handleError(SecurityService)(error_18);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.insertAccessGroup = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.insertAccessGroup(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_19 = _a.sent();
                            Logger.handleError(SecurityService)(error_19);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.updateAccessGroup = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                var error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.updateAccessGroup(SessionService.getSecurityToken(), model, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_20 = _a.sent();
                            Logger.handleError(SecurityService)(error_20);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.deleteAccessGroup = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.securityService.deleteAccessGroup(SessionService.getSecurityToken(), id, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_21 = _a.sent();
                            Logger.handleError(SecurityService)(error_21);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SecurityService.executeAfterLogin = function (resultobject) {
            return __awaiter(this, void 0, void 0, function () {
                var token, functionResult, errorCode, errorCode, result, user, loggedInSuccessText;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = resultobject;
                            functionResult = resultobject;
                            if (resultobject && typeof (resultobject) !== "string") {
                                if (!functionResult.Succeeded) {
                                    errorCode = _.first(functionResult.ErrorCodes);
                                    SecurityService.logLoginError(errorCode ? errorCode.toString() : "-1");
                                    return [2 /*return*/, false];
                                }
                                else {
                                    token = functionResult.Result;
                                }
                            }
                            else if (!SecurityService.isSecurityToken(token)) {
                                errorCode = _.first(JSON.parse(token));
                                SecurityService.logLoginError(errorCode);
                                return [2 /*return*/, false];
                            }
                            SessionService.setSecurityToken(token);
                            return [4 /*yield*/, SessionService.updateSessionInformation()];
                        case 1:
                            result = _a.sent();
                            if (result) {
                                user = SessionService.currentLoggedInUser();
                                loggedInSuccessText = SymbolicTextsService.translate("I4SCADA_User_name_successfully_logged_in")().format(user);
                                Logger.info(SecurityService, loggedInSuccessText);
                                if (user !== "*") {
                                    Logger.successToast(loggedInSuccessText);
                                }
                                SecurityService.startSignalUpdate();
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        SecurityService.logLoginError = function (errorCode) {
            var symbolicErrorText = ErrorCodeService.loginErrorCodes[errorCode];
            var errorTranslation = ko.unwrap(SymbolicTextsService.translate(symbolicErrorText));
            Logger.warn(SecurityService, errorTranslation);
            Logger.warnToast(errorTranslation);
        };
        SecurityService.startSignalUpdate = function () {
            var projectName = "\\DefaultProject";
            SecurityService.sessionSignal = SignalsService.getSignal("WFSInternal_Session_" + SessionService.getClientId() + projectName);
            SignalsService.getOnlineUpdates();
            if (!window.shouldCheckClientSession)
                return;
            var subscription = this.sessionSignal.value.subscribe(function (newValue) {
                if (!newValue) {
                    SessionService.clearSecureSession();
                    subscription.dispose();
                    SignalsService.unregisterSignals([SecurityService.sessionSignal]);
                }
            });
        };
        SecurityService.isSecurityToken = function (token) {
            if (!token)
                return false;
            if (token.includes("[") && token.includes("]"))
                return false;
            return _.isString(token);
        };
        SecurityService.timeOut = 10000;
        return SecurityService;
    }());
    return SecurityService;
});
//# sourceMappingURL=securityService.js.map