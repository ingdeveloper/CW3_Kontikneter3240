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
define(["require", "exports", "./component-base.model", "../services/signalsService"], function (require, exports, ComponentBaseModel, SignalsService) {
    "use strict";
    var WfLogBrowserComponent = /** @class */ (function (_super) {
        __extends(WfLogBrowserComponent, _super);
        function WfLogBrowserComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.signals = ko.observableArray([]);
            _this.logs = ko.observableArray([]);
            _this.pattern = ko.observable("");
            _this.delayedPattern = ko.computed(_this.pattern).extend({ throttle: 500 });
            _this.selectedSignal = ko.observable(null);
            _this.hasMoreSignals = ko.observable(false);
            _this.isLoading = ko.observable(false);
            _this.getSignalDefinitionsAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var filter, signals, validSignals, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.selectedSignal(null);
                            this.isLoading(true);
                            filter = {
                                ServerNames: [],
                                AliasNames: ["*" + this.pattern() + "*"],
                                LogTags: [],
                                ResultsFilter: SignalDefinitionResultsFilter.Logs | SignalDefinitionResultsFilter.Group
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, SignalsService.getSignalDefinitions(filter, 0, this.signalCount + 1)];
                        case 2:
                            signals = _a.sent();
                            this.hasMoreSignals(signals.length >= this.signalCount + 1);
                            if (signals.length >= this.signalCount)
                                signals.pop();
                            return [4 /*yield*/, this.validateSignals(signals)];
                        case 3:
                            validSignals = _a.sent();
                            this.signals(validSignals);
                            return [3 /*break*/, 6];
                        case 4:
                            error_1 = _a.sent();
                            this.connector.error(WfLogBrowserComponent, error_1);
                            return [3 /*break*/, 6];
                        case 5:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            _this.onSignalClicked = function (item) {
                _this.selectedSignal(item);
            };
            //problem with this, it or the color picker caused: [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
            _this.onLogClicked = function (item) {
                _this.addItem(_this.selectedSignal().AliasName, item.item.LogTag);
                _this.setSelectedLog();
            };
            _this.removeItem = function (context) {
                _this.settings.items.remove(context);
                _this.setSelectedLog();
            };
            _this.initializeComputeds();
            _this.populateItemsInitialAsync();
            return _this;
        }
        WfLogBrowserComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.availableAxis = ['y1', 'y2'];
            this.showColor = this.settings.showColor !== undefined ? this.settings.showColor : false;
            this.showAxis = this.settings.showAxis !== undefined ? this.settings.showAxis : false;
            this.showType = this.settings.showType !== undefined ? this.settings.showType : false;
            this.showIsAlphanumeric = this.settings.showIsAlphanumeric !== undefined ? this.settings.showIsAlphanumeric : false;
            this.isMultipleMode = this.settings.isMultipleMode !== undefined ? this.settings.isMultipleMode : true;
            this.labelCssClass = this.settings.labelCssClass !== undefined ? this.settings.labelCssClass : "";
            this.showIsStaticColumn = this.settings.showIsStaticColumn || false;
            this.signalCount = ko.unwrap(this.settings.signalCount) || 50;
            this.signalText = ko.unwrap(this.settings.signalText) || "AliasName"; //'Name', 'Description', 'DescriptionSymbolicText',
            this.availableTypes = ['line', 'step', 'spline', 'bar', 'area', 'area-spline', 'area-step'];
        };
        WfLogBrowserComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.hasItems = ko.computed(function () {
                return _this.settings.items && _this.settings.items().length > 0;
            });
            this.delayedPattern.subscribe(this.getSignalDefinitionsAsync);
            this.selectedSignal.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
                var selectedSignal, logs, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            selectedSignal = this.selectedSignal();
                            if (!selectedSignal) {
                                this.logs([]);
                                return [2 /*return*/];
                            }
                            this.isLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, SignalsService.getLogs(selectedSignal.ID)];
                        case 2:
                            logs = _a.sent();
                            this.logs(logs.map(function (log) {
                                return {
                                    selected: ko.observable(_this.isLogTagSelected(log)),
                                    item: log
                                };
                            }));
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.error(WfLogBrowserComponent, error_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfLogBrowserComponent.prototype.populateItemsInitialAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.settings.beginLoadSignalsFunc)
                                this.settings.beginLoadSignalsFunc();
                            return [4 /*yield*/, this.getSignalDefinitionsAsync()];
                        case 1:
                            _a.sent();
                            if (this.settings.endLoadSignalsFunc)
                                this.settings.endLoadSignalsFunc();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogBrowserComponent.prototype.validateSignals = function (signals) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.resolve(signals)];
                });
            });
        };
        WfLogBrowserComponent.prototype.isLogTagSelected = function (item) {
            var _this = this;
            var signal = _.find(this.settings.items(), function (x) { return ko.unwrap(x.logTagName) === item.LogTag && ko.unwrap(x.signalName) === _this.selectedSignal().AliasName; });
            return !!signal;
        };
        WfLogBrowserComponent.prototype.setSelectedLog = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.logs()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    item.selected(this.isLogTagSelected(item.item));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        WfLogBrowserComponent.prototype.addItem = function (signalName, logTagName) {
            if (_.any(this.settings.items(), function (item) {
                return ko.unwrap(item.signalName) === signalName && ko.unwrap(item.logTagName) === logTagName;
            })) {
                return;
            }
            var newItem = {
                signalName: ko.observable(signalName),
                logTagName: ko.observable(logTagName),
                type: ko.observable("line")
            };
            if (this.showColor)
                newItem.color = ko.observable("#880000");
            if (this.showAxis)
                newItem.axis = ko.observable();
            if (this.showIsStaticColumn)
                newItem.isStatic = ko.observable(false);
            if (this.showIsAlphanumeric)
                newItem.isAlphanumeric = ko.observable(false);
            this.settings.items.push(newItem);
        };
        WfLogBrowserComponent.prototype.dispose = function () {
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
        return WfLogBrowserComponent;
    }(ComponentBaseModel));
    return WfLogBrowserComponent;
});
//# sourceMappingURL=wf-log-browser.component.js.map