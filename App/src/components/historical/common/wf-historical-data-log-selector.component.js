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
define(["require", "exports", "../../component-base.model", "../../../services/signalsService"], function (require, exports, ComponentBaseModel, SignalsService) {
    "use strict";
    var WfHistoricalDataLogSelectorComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataLogSelectorComponent, _super);
        function WfHistoricalDataLogSelectorComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.dialog = ko.observable(false);
            _this.maxSignalCount = 25;
            _this.groupItems = ko.observableArray([]);
            _this.selectedGroupId = ko.observable(null);
            _this.signalItems = ko.observableArray([]);
            _this.logs = ko.observableArray([]);
            _this.signalDefinitions = ko.observableArray([]);
            _this.selectedSignalDefinition = ko.observable();
            _this.pattern = ko.observable("");
            _this.delayedPattern = ko.computed(_this.pattern).extend({ throttle: 500 });
            _this.hasMoreSignals = ko.observable(false);
            _this.isLoading = ko.observable(false);
            _this.getDataAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            return [4 /*yield*/, this.getSignalNamesAsync()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.getSignalDefinitionsAsync()];
                        case 2:
                            _a.sent();
                            this.setSelected();
                            this.isLoading(false);
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.initializeComputeds();
            if (_this.settings.signal && ko.isObservable(_this.settings.signal)) {
                _this.signal = _this.settings.signal;
            }
            else {
                _this.signal = ko.observable(null);
            }
            if (_this.settings.tag && ko.isObservable(_this.settings.tag)) {
                _this.tag = _this.settings.tag;
            }
            else {
                _this.tag = ko.observable(null);
            }
            _this.value = ko.computed(function () {
                if (_this.signal() && _this.tag())
                    return _this.signal() + "\\" + _this.tag();
                else
                    return null;
            });
            return _this;
        }
        WfHistoricalDataLogSelectorComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
        };
        WfHistoricalDataLogSelectorComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.delayedPatternSubscription = this.delayedPattern.subscribe(this.getDataAsync);
            this.selectedGroupIdSubscription = this.selectedGroupId.subscribe(this.getDataAsync);
            this.selectedSignalDefinitionSubscription = this.selectedSignalDefinition.subscribe(function () { _this.getLogsAsync(); });
        };
        WfHistoricalDataLogSelectorComponent.prototype.setSelected = function () {
            this.selectedSignalDefinition(_.first(this.signalDefinitions()));
        };
        WfHistoricalDataLogSelectorComponent.prototype.populateItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getGroupNamesAsync()];
                        case 1:
                            _a.sent();
                            this.selectedGroupId(null);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.getSignalNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, filter, signalItems, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*" + this.pattern() + "*";
                            filter = {
                                ServerNames: [],
                                AliasNames: [],
                                Pattern: pattern,
                                GroupIds: this.selectedGroupId() ? [this.selectedGroupId()] : [],
                                WithLogs: true
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1)];
                        case 2:
                            signalItems = _a.sent();
                            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
                            if (signalItems.length > this.maxSignalCount) {
                                signalItems.pop();
                            }
                            this.signalItems(signalItems);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.error(WfHistoricalDataLogSelectorComponent, error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.getSignalDefinitionsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signals, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                ServerNames: [],
                                AliasNames: this.signalItems().map(function (x) { return x.Name; }),
                                LogTags: [],
                                ResultsFilter: SignalDefinitionResultsFilter.Basic | SignalDefinitionResultsFilter.Group | SignalDefinitionResultsFilter.Logs
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, SignalsService.getSignalDefinitions(filter, 0, this.maxSignalCount)];
                        case 2:
                            signals = _a.sent();
                            this.signalDefinitions(signals);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.error(WfHistoricalDataLogSelectorComponent, error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.getGroupNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, groupItems, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            filter = {
                                ServerNames: [],
                                GroupNames: [],
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getGroupNames(filter, 0, 500)];
                        case 1:
                            groupItems = _a.sent();
                            this.groupItems(groupItems);
                            this.groupItems.unshift({ Name: "*", ID: null });
                            this.selectedGroupId.notifySubscribers();
                            return [3 /*break*/, 4];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfHistoricalDataLogSelectorComponent)(error_3);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.getLogsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var logs, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, SignalsService.getLogs(this.selectedSignalDefinition().ID)];
                        case 1:
                            logs = _a.sent();
                            this.logs(logs);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            this.connector.handleError(WfHistoricalDataLogSelectorComponent)(error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.onSelectSignal = function (signal) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.selectedSignalDefinition(signal);
                    return [2 /*return*/];
                });
            });
        };
        WfHistoricalDataLogSelectorComponent.prototype.onSelect = function (log) {
            if (this.settings.onSelect) {
                this.settings.onSelect(this.selectedSignalDefinition(), log);
            }
            this.signal(this.selectedSignalDefinition().AliasName);
            this.tag(log.LogTag);
            this.onClose();
        };
        WfHistoricalDataLogSelectorComponent.prototype.onClicked = function () {
            this.dialog(true);
            this.populateItems();
        };
        WfHistoricalDataLogSelectorComponent.prototype.onClose = function () {
            this.dialog(false);
        };
        WfHistoricalDataLogSelectorComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialog;
                return __generator(this, function (_a) {
                    this.delayedPatternSubscription.dispose();
                    this.selectedGroupIdSubscription.dispose();
                    this.selectedSignalDefinitionSubscription.dispose();
                    dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
                    dialog.remove();
                    return [2 /*return*/];
                });
            });
        };
        return WfHistoricalDataLogSelectorComponent;
    }(ComponentBaseModel));
    return WfHistoricalDataLogSelectorComponent;
});
//# sourceMappingURL=wf-historical-data-log-selector.component.js.map