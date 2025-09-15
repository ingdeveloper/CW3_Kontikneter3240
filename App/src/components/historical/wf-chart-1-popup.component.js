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
define(["require", "exports", "../component-base.model", "../../services/signalsService"], function (require, exports, ComponentBaseModel, SignalsService) {
    "use strict";
    var WfChart1PopupComponent = /** @class */ (function (_super) {
        __extends(WfChart1PopupComponent, _super);
        function WfChart1PopupComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.logs = ko.observableArray();
            _this.setTimeRange();
            _this.getDataAsync();
            return _this;
        }
        WfChart1PopupComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.objectSettings = (ko.unwrap(this.settings.objectSettings) || "").stringPlaceholderResolver(this.objectID);
            this.signalPrefix = (ko.unwrap(this.settings.signalPrefix) || "").stringPlaceholderResolver(this.objectID);
            this.objectNameID = (ko.unwrap(this.settings.objectNameID) || "").stringPlaceholderResolver(this.objectNameID);
            this.timeRange = ko.unwrap(this.settings.timeRange) || "1h";
        };
        WfChart1PopupComponent.prototype.setTimeRange = function () {
            var startOffsetIntervall = 1;
            switch (this.timeRange) {
                case "2h":
                    startOffsetIntervall = 2;
                    break;
                case "8h":
                    startOffsetIntervall = 8;
                    break;
                case "12h":
                    startOffsetIntervall = 12;
                    break;
                case "24h":
                    startOffsetIntervall = 24;
                    break;
            }
            this.timeSettings = {
                startOffset: "hours",
                startOffsetIntervall: startOffsetIntervall
            };
        };
        WfChart1PopupComponent.prototype.getDataAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalNames, signalDefinitions, logs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signalNames = [];
                            signalDefinitions = [];
                            if (this.objectSettings.length > 0) {
                                signalNames = this.getSignalNamesFromPartameter();
                            }
                            if (!(signalNames.length === 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getLogTagDefinitionsAsync()];
                        case 1:
                            signalDefinitions = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.resolveLogTagDefinitionsAsync(signalNames)];
                        case 3:
                            signalDefinitions = _a.sent();
                            _a.label = 4;
                        case 4:
                            logs = this.buildSignalLogTag(signalDefinitions);
                            this.logs(logs);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfChart1PopupComponent.prototype.resolveLogTagDefinitionsAsync = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getSignalDefinitions(signalNames)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        WfChart1PopupComponent.prototype.getLogTagDefinitionsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                ServerNames: [],
                                AliasNames: [this.signalPrefix + "*"],
                                LogTags: [],
                                ResultsFilter: SignalDefinitionResultsFilter.Logs
                            };
                            return [4 /*yield*/, SignalsService.getSignalDefinitions(filter, 0, 250)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        WfChart1PopupComponent.prototype.buildSignalLogTag = function (signalDefinitions) {
            var e_1, _a, e_2, _b;
            var logs = [];
            try {
                for (var _c = __values(signalDefinitions), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var signalDefinition = _d.value;
                    if (signalDefinition.Logs != null) {
                        try {
                            for (var _e = (e_2 = void 0, __values(signalDefinition.Logs)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var log = _f.value;
                                logs.push({
                                    signalName: signalDefinition.AliasName,
                                    logTagName: log.LogTag
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return logs;
        };
        WfChart1PopupComponent.prototype.getSignalNamesFromPartameter = function () {
            var _this = this;
            return this.objectSettings
                .replace(/;\s*$/, "")
                .split(";")
                .map(function (objectName) { return "" + _this.signalPrefix + objectName; });
        };
        WfChart1PopupComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfChart1PopupComponent;
    }(ComponentBaseModel));
    return WfChart1PopupComponent;
});
//# sourceMappingURL=wf-chart-1-popup.component.js.map