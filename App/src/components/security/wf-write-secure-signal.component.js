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
define(["require", "exports", "../component-base.model"], function (require, exports, ComponentBaseModel) {
    "use strict";
    var WfWriteSecureSignalComponent = /** @class */ (function (_super) {
        __extends(WfWriteSecureSignalComponent, _super);
        function WfWriteSecureSignalComponent(params) {
            return _super.call(this, params) || this;
        }
        WfWriteSecureSignalComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.showWriteSecure = this.settings.show !== undefined ? this.settings.show : ko.observable(false);
            this.draggable = this.settings.isModalDialogsDraggable !== undefined ? ko.observable(this.settings.isModalDialogsDraggable) : ko.observable(false);
            this.signalNames = this.settings.signalNames !== undefined ? this.settings.signalNames : null;
            this.signalValues = this.settings.signalValues !== undefined ? this.settings.signalValues : null;
            this.writeFromBuffer = this.settings.writeFromBuffer !== undefined ? this.settings.writeFromBuffer : false;
            this.successCalback = this.settings.successCalback !== undefined ? this.settings.successCalback : null;
            this.cancelCalback = this.settings.cancelCalback !== undefined ? this.settings.cancelCalback : null;
            this.reinforcementPassword = ko.observable();
            this.isUserLoggedIn = ko.observable(true);
            this.checkUserIsLoggedIn();
        };
        WfWriteSecureSignalComponent.prototype.handleCancelWriteSecure = function () {
            this.closeWriteSecure();
            if (this.cancelCalback)
                this.cancelCalback();
        };
        WfWriteSecureSignalComponent.prototype.closeWriteSecure = function () {
            this.reinforcementPassword(null);
            this.showWriteSecure(false);
        };
        WfWriteSecureSignalComponent.prototype.checkUserIsLoggedIn = function () {
            return __awaiter(this, void 0, void 0, function () {
                var userName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getCurrentLoggedInUser()];
                        case 1:
                            userName = _a.sent();
                            return [2 /*return*/, userName ? this.isUserLoggedIn(true) : this.isUserLoggedIn(false)];
                    }
                });
            });
        };
        WfWriteSecureSignalComponent.prototype.writeSignalsFromBufferSecure = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.writeSignalsFromBufferSecure(this.reinforcementPassword())];
                        case 1:
                            result = _a.sent();
                            if (result) {
                                this.closeWriteSecure();
                                if (this.successCalback)
                                    this.successCalback();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfWriteSecureSignalComponent.prototype.writeSignalsSecure = function () {
            return __awaiter(this, void 0, void 0, function () {
                var values, signalValues, signalNames, i, signalName, signalValue, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = {};
                            signalValues = ko.unwrap(this.signalValues);
                            signalNames = ko.unwrap(this.signalNames);
                            for (i = 0; i < signalNames.length; i++) {
                                signalName = ko.unwrap(signalNames[i]);
                                signalValue = ko.unwrap(signalValues[i]);
                                if (signalName && (signalValue !== undefined))
                                    values[signalName] = signalValue;
                            }
                            return [4 /*yield*/, this.connector.writeSignalsSecure(this.reinforcementPassword(), values)];
                        case 1:
                            response = _a.sent();
                            if (response !== undefined) {
                                this.closeWriteSecure();
                                if (this.successCalback)
                                    this.successCalback();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfWriteSecureSignalComponent.prototype.handleWriteSecure = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.writeFromBuffer) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.writeSignalsFromBufferSecure()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            if (!this.signalNames || !this.signalValues)
                                return [2 /*return*/, this.closeWriteSecure()];
                            return [4 /*yield*/, this.writeSignalsSecure()];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         *
         *
         * @protected
         *
         * @memberOf WfWriteSecureSignalComponent
         */
        WfWriteSecureSignalComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configDialog, configBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            configDialog = $(document).find('#wf-write-secure-dialog-' + ko.unwrap(this.id));
                            configBackContainer = $(document).find('#wf-write-secure-dialog-back-container-' + ko.unwrap(this.id));
                            configDialog.remove();
                            configBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfWriteSecureSignalComponent;
    }(ComponentBaseModel));
    return WfWriteSecureSignalComponent;
});
//# sourceMappingURL=wf-write-secure-signal.component.js.map