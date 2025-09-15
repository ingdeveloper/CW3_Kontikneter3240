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
define(["require", "exports", "../../../services/connector", "../../../services/signalsService", "../../component-base.model"], function (require, exports, Connector, SignalsService, ComponentBaseModel) {
    "use strict";
    var WfSignalAlarmListSignalsBrowserDialogComponent = /** @class */ (function (_super) {
        __extends(WfSignalAlarmListSignalsBrowserDialogComponent, _super);
        function WfSignalAlarmListSignalsBrowserDialogComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.emptyGuid = "00000000-0000-0000-0000-000000000000";
            _this.dialog = ko.observable(false);
            _this.isSignalLoading = ko.observable(false);
            _this.connector = new Connector();
            _this.pattern = ko.observable("");
            _this.delayedPattern = ko.computed(_this.pattern).extend({ throttle: 500 });
            _this.isLoading = ko.observable(false);
            _this.selectedGroupId = ko.observable(_this.emptyGuid);
            _this.groupItems = ko.observableArray([]);
            _this.signalItems = ko.observableArray([]);
            _this.selectedItems = ko.observableArray([]);
            _this.hasMoreSignals = ko.observable(false);
            _this.onSignalClicked = function (item) {
                if (_this.isSignalSelected(item.item)) {
                    _this.selectedItems.remove(function (x) { return x.ID === item.item.ID; });
                    item.selected(false);
                }
                else {
                    _this.addItem(item.item);
                    item.selected(true);
                }
            };
            _this.pattern(ko.unwrap(_this.settings.filterPattern) || "");
            _this.initializeComputeds();
            return _this;
        }
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.populateItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getGroupNamesAsync()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.getSignalNamesAsync()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.delayedPatternSubscription = this.delayedPattern.subscribe(function () { return _this.getSignalNamesAsync(); });
            this.selectedGroupIdSubscription = this.selectedGroupId.subscribe(function () { return _this.getSignalNamesAsync(); });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount);
            this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd);
            this.groupsFilter = ko.unwrap(this.settings.groupsFilter) || [];
            this.signalsFilter = ko.unwrap(this.settings.signalsFilter) || [];
            this.onSignalsSelected = this.settings.onSignalsSelected || (function (aliasNames) { });
            this.isModalDialogsDraggable = this.settings.isModalDialogsDraggable !== undefined ? this.settings.isModalDialogsDraggable : true;
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.getSignalNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, filter, signalItems, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*" + this.pattern() + "*";
                            filter = {
                                ServerNames: [],
                                AliasNames: this.signalsFilter,
                                Pattern: pattern,
                                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emptyGuid) ? [this.selectedGroupId()] : []
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1)];
                        case 2:
                            signalItems = _a.sent();
                            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
                            if (signalItems.length >= this.maxSignalCount) {
                                signalItems.pop();
                            }
                            this.signalItems(signalItems.map(function (signal) {
                                return {
                                    item: signal,
                                    selected: ko.observable(_this.isSignalSelected(signal))
                                };
                            }));
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.error(WfSignalAlarmListSignalsBrowserDialogComponent, error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.getGroupNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, groupItems, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            filter = {
                                ServerNames: [],
                                GroupNames: [].concat(this.groupsFilter)
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getGroupNames(filter, 0, 1000)];
                        case 1:
                            groupItems = _a.sent();
                            this.groupItems(groupItems);
                            if (!_.any(this.groupsFilter)) {
                                this.groupItems.unshift({ Name: "*", ID: this.emptyGuid });
                            }
                            else {
                                if (_.any(groupItems)) {
                                    this.selectedGroupId(_.first(groupItems).ID);
                                }
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            error_2 = _a.sent();
                            this.connector.handleError(WfSignalAlarmListSignalsBrowserDialogComponent)(error_2);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.addGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signals, signals_1, signals_1_1, signal, error_3;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            filter = {
                                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emptyGuid) ? [this.selectedGroupId()] : [],
                                AliasNames: this.signalsFilter,
                                ServerNames: []
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd)];
                        case 1:
                            signals = _b.sent();
                            this.selectedItems.valueWillMutate();
                            try {
                                for (signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                                    signal = signals_1_1.value;
                                    this.addItem(signal);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            this.setSelceted();
                            this.selectedItems.valueHasMutated();
                            return [3 /*break*/, 4];
                        case 2:
                            error_3 = _b.sent();
                            this.connector.handleError(WfSignalAlarmListSignalsBrowserDialogComponent)(error_3);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.addSignals = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, signal;
                var e_2, _c;
                return __generator(this, function (_d) {
                    this.isLoading(true);
                    this.selectedItems.valueWillMutate();
                    try {
                        for (_a = __values(this.signalItems()), _b = _a.next(); !_b.done; _b = _a.next()) {
                            signal = _b.value;
                            this.addItem(signal.item);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    this.setSelceted();
                    this.selectedItems.valueHasMutated();
                    this.isLoading(false);
                    return [2 /*return*/];
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.isSignalSelected = function (item) {
            var signal = _.find(this.selectedItems(), function (x) { return x.Name === item.Name; });
            return !!signal;
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.removeItem = function (item) {
            this.selectedItems.remove(item);
            this.setSelceted();
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.addItem = function (item) {
            if (_.find(this.selectedItems(), function (signal) { return signal.Name === item.Name; })) {
                return;
            }
            this.selectedItems.push(item);
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.setSelceted = function () {
            var e_3, _a;
            try {
                for (var _b = __values(this.signalItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    item.selected(this.isSignalSelected(item.item));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.onClose = function () {
            this.dialog(false);
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.onDialog = function () {
            this.onSignalsSelected(this.selectedItems().map(function (x) { return x.Name; }));
            this.onClose();
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.onReset = function () {
            this.selectedItems([]);
            this.onSignalsSelected([]);
            this.setSelceted();
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.onOpen = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.dialog(true);
                            this.selectedItems([]);
                            this.aliasNames = ko.unwrap(this.settings.aliasNames) || [];
                            if (!(this.aliasNames.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.resolveSelectedItems(this.aliasNames)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.populateItems()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.resolveSelectedItems = function (aliasNames) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signals, _loop_1, this_1, signals_2, signals_2_1, signal, aliasNames_1, aliasNames_1_1, signal, error_4;
                var e_4, _a, e_5, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            filter = {
                                ServerNames: [],
                                AliasNames: aliasNames,
                                GroupIds: []
                            };
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, 4, 5]);
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, 2147483647)];
                        case 2:
                            signals = _c.sent();
                            this.selectedItems.valueWillMutate();
                            _loop_1 = function (signal) {
                                if (aliasNames.find(function (x) { return x === signal.Name; })) {
                                    this_1.addItem(signal);
                                }
                            };
                            this_1 = this;
                            try {
                                for (signals_2 = __values(signals), signals_2_1 = signals_2.next(); !signals_2_1.done; signals_2_1 = signals_2.next()) {
                                    signal = signals_2_1.value;
                                    _loop_1(signal);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (signals_2_1 && !signals_2_1.done && (_a = signals_2.return)) _a.call(signals_2);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            try {
                                for (aliasNames_1 = __values(aliasNames), aliasNames_1_1 = aliasNames_1.next(); !aliasNames_1_1.done; aliasNames_1_1 = aliasNames_1.next()) {
                                    signal = aliasNames_1_1.value;
                                    this.addItem({
                                        ID: null,
                                        Name: signal,
                                        Description: null
                                    });
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (aliasNames_1_1 && !aliasNames_1_1.done && (_b = aliasNames_1.return)) _b.call(aliasNames_1);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                            this.setSelceted();
                            this.selectedItems.valueHasMutated();
                            return [3 /*break*/, 5];
                        case 3:
                            error_4 = _c.sent();
                            this.connector.error(WfSignalAlarmListSignalsBrowserDialogComponent, error_4);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalAlarmListSignalsBrowserDialogComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialog;
                return __generator(this, function (_a) {
                    dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
                    dialog.remove();
                    this.delayedPatternSubscription.dispose();
                    this.selectedGroupIdSubscription.dispose();
                    return [2 /*return*/];
                });
            });
        };
        return WfSignalAlarmListSignalsBrowserDialogComponent;
    }(ComponentBaseModel));
    return WfSignalAlarmListSignalsBrowserDialogComponent;
});
//# sourceMappingURL=wf-signal-alarm-list-signals-browser-dialog.component.js.map