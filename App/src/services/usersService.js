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
define(["require", "exports", "./sessionService", "./logger", "./api", "./connectorService"], function (require, exports, SessionService, Logger, Api, ConnectorService) {
    "use strict";
    var UsersService = /** @class */ (function () {
        function UsersService() {
        }
        UsersService.getCurrentUserDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "getCurrentUserDetails");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.getCurrentUserDetails(SessionService.sessionId, SessionService.getClientId())];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.changeUserPassword = function (affectedUserId, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "changeUserPassword");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.changeUserPasswordByToken(SessionService.getSecurityToken(), affectedUserId, newPassword, UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.changeCurrentUserPassword = function (currentPassword, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "changeCurrentUserPassword");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.changeCurrentUserPasswordByToken(SessionService.getSecurityToken(), currentPassword, newPassword, UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.getAllUsers = function (keepAnonymousUser) {
            if (keepAnonymousUser === void 0) { keepAnonymousUser = false; }
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "getAllUsers");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.getAllUsersByToken(SessionService.getSecurityToken(), UsersService.timeOut)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response && !keepAnonymousUser ? response.filter(function (x) { return x.ID && x.ID !== "00000000-0000-0000-0000-000000000000"; }) : response];
                    }
                });
            });
        };
        UsersService.getAllUserDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "getAllUserDetails");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.getAllUserDetailsByToken(SessionService.getSecurityToken(), UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.deleteUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "deleteUser");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.deleteUserByToken(SessionService.getSecurityToken(), id, UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.updateUser = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "updateUser");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.updateUserByToken(SessionService.getSecurityToken(), model, UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.insertUser = function (model) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(UsersService, "insertUser");
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.usersService.insertUserByToken(SessionService.getSecurityToken(), model, UsersService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService.timeOut = 10000;
        return UsersService;
    }());
    return UsersService;
});
//# sourceMappingURL=usersService.js.map