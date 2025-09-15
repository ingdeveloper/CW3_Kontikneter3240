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
define(["require", "exports", "../../services/connector"], function (require, exports, Connector) {
    "use strict";
    var VisualSecurityService = /** @class */ (function () {
        function VisualSecurityService(settings) {
            var _this = this;
            this.settings = settings;
            this.connector = new Connector();
            var objectID = ko.unwrap(this.settings.objectID);
            this.enableSignalName = (ko.unwrap(this.settings.enableSignalName) || "").stringPlaceholderResolver(objectID);
            this.visibilitySignalName = (ko.unwrap(this.settings.visibilitySignalName) || "").stringPlaceholderResolver(objectID);
            this.enableSignalValue = ko.unwrap(this.settings.enableSignalValue);
            this.visibilitySignalValue = ko.unwrap(this.settings.visibilitySignalValue);
            this.enableOperator = ko.unwrap(this.settings.enableOperator) || "==";
            this.visibilityOperator = ko.unwrap(this.settings.visibilityOperator) || "==";
            this.visibilitySignal = this.visibilitySignalName ? this.connector.getSignal(this.visibilitySignalName) : null;
            this.enableSignal = this.enableSignalName ? this.connector.getSignal(this.enableSignalName) : null;
            this.isExistVisibleSignalDefinition = ko.observable(false);
            this.isExistEnableSignalDefinition = ko.observable(false);
            this.isVisible = ko.computed(function () {
                if (!_this.visibilitySignal)
                    return true;
                if (!_this.isExistVisibleSignalDefinition())
                    return false;
                if (_this.visibilitySignalValue === undefined || _this.visibilitySignalValue === null)
                    return true;
                return evaluateCondition(_this.visibilitySignal.value(), _this.visibilitySignalValue, _this.visibilityOperator);
            });
            this.isDisabled = ko.computed(function () {
                if (!_this.enableSignal)
                    return false;
                if (!_this.isExistEnableSignalDefinition())
                    return true;
                if (_this.enableSignalValue === undefined || _this.enableSignalValue === null)
                    return false;
                return !evaluateCondition(_this.enableSignal.value(), _this.enableSignalValue, _this.enableOperator);
            });
            this.checkVisibilitySignalName();
            this.checkEnableSignalName();
        }
        VisualSecurityService.prototype.checkVisibilitySignalName = function () {
            return __awaiter(this, void 0, void 0, function () {
                var definition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.visibilitySignalName != null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connector.getSignalDefinition(this.visibilitySignalName)];
                        case 1:
                            definition = _a.sent();
                            this.isExistVisibleSignalDefinition(!!definition);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        VisualSecurityService.prototype.checkEnableSignalName = function () {
            return __awaiter(this, void 0, void 0, function () {
                var definition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.enableSignalName != null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connector.getSignalDefinition(this.enableSignalName)];
                        case 1:
                            definition = _a.sent();
                            this.isExistEnableSignalDefinition(!!definition);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        VisualSecurityService.prototype.dispose = function () {
            if (this.visibilitySignal !== null) {
                this.connector.unregisterSignals(this.visibilitySignal);
            }
            if (this.enableSignal !== null) {
                this.connector.unregisterSignals(this.enableSignal);
            }
        };
        return VisualSecurityService;
    }());
    return VisualSecurityService;
});
//# sourceMappingURL=visual-security.service.js.map