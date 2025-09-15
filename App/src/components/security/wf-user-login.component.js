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
define(["require", "exports", "../../services/usersService", "../component-base.model", "../../services/logger"], function (require, exports, UsersService, ComponentBaseModel, Logger) {
    "use strict";
    var WfUserLoginComponent = /** @class */ (function (_super) {
        __extends(WfUserLoginComponent, _super);
        function WfUserLoginComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.router = {
                navigate: function (url) {
                    window.location.href = url;
                }
            };
            _this.initializeComputeds();
            return _this;
        }
        WfUserLoginComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.userName = ko.observable("");
            this.password = ko.observable("");
            this.showChangePassword = ko.observable(false);
            this.actuallyPassword = ko.observable();
            this.newPassword = ko.observable();
            this.confirmPassword = ko.observable();
            this.serverErrorText = ko.observable("");
            this.isDomainUser = ko.observable(this.settings.isDomainUser !== undefined ? this.settings.isDomainUser : false);
            this.userDetails = ko.observable({});
            this.defaultText = this.connector.translate((ko.unwrap(this.settings.defaultText) || "").stringPlaceholderResolver(this.objectID))();
            // Naviigation route where the navigation should be done to on successfull login
            this.loggedInRoute = ko.unwrap(this.settings.loggedInRoute) || "";
            // Naviigation route where the navigation should be done to on logout
            this.loggedOutRoute = ko.unwrap(this.settings.loggedOutRoute) || "";
            this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-default";
            this.iconClass = ko.unwrap(this.settings.iconClass) || "wf-lg wf-login";
            this.loggedInIconClass = ko.unwrap(this.settings.loggedInIconClass) || "wf-lg wf-logout";
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.labelOrientation = ko.unwrap(this.settings.labelOrientation) || "horizontal";
            this.popoverHeaderCssClass = ko.unwrap(this.settings.popoverHeaderCssClass) || "";
            this.position = ko.unwrap(this.settings.position) || "bottom";
            this.userProperties = ko.unwrap(this.settings.userProperties) || ["Name"];
            this.autoLogin = ko.unwrap(this.settings.autoLogin) !== undefined ? ko.unwrap(this.settings.autoLogin) : false;
            this.changePasswordVisibility = ko.unwrap(this.settings.changePasswordVisibility) !== undefined ? ko.unwrap(this.settings.changePasswordVisibility) : true;
            this.initializeRouting();
            this.subscribeToUserChangeEvent();
            this.getCurrentUserDetails();
        };
        WfUserLoginComponent.prototype.subscribeToUserChangeEvent = function () {
            var _this = this;
            this.currentLoggedInUserSubscription = this.connector.currentLoggedInUser.subscribe(function (user) {
                if (user === null) {
                    Logger.info(_this, "User has been logged out");
                    if (_this.loggedOutRoute) {
                        _this.router.navigate(_this.loggedOutRoute);
                    }
                }
            });
        };
        WfUserLoginComponent.prototype.initializeRouting = function () {
            return __awaiter(this, void 0, void 0, function () {
                var login, result, currentPage, targetPage, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.connector.getCurrentLoggedInUser()];
                        case 1:
                            login = _a.sent();
                            if (!(!login && this.autoLogin)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.connector.loginWindowsUser()];
                        case 2:
                            result = _a.sent();
                            if (result) {
                                this.isDomainUser(true);
                                this.executeAfterLogin();
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            if (!login && this.loggedOutRoute) {
                                currentPage = this.getTrimmedDownNavigationRoute(window.location.href);
                                targetPage = this.getTrimmedDownNavigationRoute(this.loggedOutRoute);
                                if (currentPage !== targetPage)
                                    this.router.navigate(this.loggedOutRoute);
                            }
                            else if (login) {
                                this.executeAfterLogin();
                            }
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            this.connector.handleError(WfUserLoginComponent)(error_1);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.getTrimmedDownNavigationRoute = function (route) {
            var index = route.lastIndexOf("/");
            var currentPage = index > -1 ? route.substr(index + 1, route.length - index) : route;
            return currentPage.replace("#", "");
        };
        WfUserLoginComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.connector.currentLoggedInUser.subscribe(function (value) {
                _this.getCurrentUserDetails();
            });
            this.logoutEnabled = ko.computed(function () {
                return Object.keys(_this.userDetails()).length > 0;
            });
            this.userIsLoggedIn = ko.computed(function () {
                return Object.keys(_this.userDetails()).length > 0;
            });
            this.iconCssclass = ko.computed(function () {
                return _this.userIsLoggedIn() ? _this.loggedInIconClass : _this.iconClass;
            }, this);
            this.loginEnabled = ko.computed(function () {
                return _this.userName() && _this.password() && !_this.userIsLoggedIn();
            });
            this.labels = ko.computed(function () {
                if (Object.keys(_this.userDetails()).length) {
                    var userPropertiesValues = [];
                    _.each(_this.userProperties, function (userProperty) {
                        userPropertiesValues.push(_this.userDetails()[userProperty]);
                    });
                    return userPropertiesValues;
                }
                return [_this.defaultText];
            });
            this.changePasswordEnabled = ko.computed(function () {
                return _this.confirmPassword() && _this.newPassword() && _this.passwordsIsIdentish();
            });
            this.passwordsIsIdentish = ko.computed(function () {
                if (!_this.newPassword() || !_this.confirmPassword())
                    return true;
                return _this.newPassword() === _this.confirmPassword();
            }, this);
            this.errorText = ko.computed(function () {
                if (!_this.passwordsIsIdentish())
                    return _this.connector.translate("I4SCADA_Passwords_are_not_the_same")();
                return _this.serverErrorText();
            });
        };
        WfUserLoginComponent.prototype.clickLogin = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.login()];
                        case 1:
                            result = _a.sent();
                            if (result) {
                                this.executeAfterLogin();
                            }
                            else {
                                this.clearCredentials();
                                this.connector.error(this, "Login failed");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.login = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.login(this.userName(), this.password(), this.isDomainUser())];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.clickLogout = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.logout()];
                        case 1:
                            _a.sent();
                            this.clearCredentials();
                            this.closeLoginDialog();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.logout = function () {
            var promise = this.connector.logout();
            return promise;
        };
        WfUserLoginComponent.prototype.clearCredentials = function () {
            this.userName("");
            this.clearPassword();
            this.clearChangePasswordCredentionals();
        };
        WfUserLoginComponent.prototype.closeLoginDialog = function () {
            $('body').trigger('click'); // close popover
        };
        WfUserLoginComponent.prototype.clearPassword = function () {
            this.password("");
        };
        WfUserLoginComponent.prototype.clearChangePasswordCredentionals = function () {
            this.actuallyPassword("");
            this.newPassword("");
            this.confirmPassword("");
            this.serverErrorText("");
        };
        WfUserLoginComponent.prototype.getCurrentUserDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                var userDetails, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, UsersService.getCurrentUserDetails()];
                        case 1:
                            userDetails = _a.sent();
                            if (!isNullOrUndefined(userDetails)) {
                                this.userDetails(userDetails);
                            }
                            else {
                                this.userDetails({});
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.connector.handleError(WfUserLoginComponent)(error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.executeAfterLogin = function () {
            //this.connector.info(this, "User has been logged in");
            console.log("User has been logged in");
            this.clearCredentials();
            this.closeLoginDialog();
            if (this.loggedInRoute) {
                this.router.navigate(this.loggedInRoute);
            }
        };
        WfUserLoginComponent.prototype.clickChangePassword = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.changeCurrentUserPassword(this.actuallyPassword(), ko.unwrap(this.newPassword))];
                        case 1:
                            result = _a.sent();
                            if (result) {
                                this.clearChangePasswordCredentionals();
                                this.showChangePassword(false);
                                this.connector.setSecurityToken(result);
                            }
                            else {
                                this.serverErrorText(this.connector.translate("I4SCADA_Change_password_failed")());
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            if (error_3.responseJSON && error_3.responseJSON.Message)
                                this.serverErrorText(error_3.responseJSON.Message);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfUserLoginComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.currentLoggedInUserSubscription.dispose();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfUserLoginComponent;
    }(ComponentBaseModel));
    return WfUserLoginComponent;
});
//# sourceMappingURL=wf-user-login.component.js.map