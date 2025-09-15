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
define(["require", "exports", "../../../component-base.model", "../../../../services/silverlightToolsService", "../../../../services/usersService", "../../../../decorators/busyIndicator", "../shared/wf-um-enyms", "../shared/utils", "../../../services/time-range.service"], function (require, exports, ComponentBaseModel, SilverlightToolsService, UsersService, BusyIndicator, wf_um_enyms_1, utils_1, time_range_service_1) {
    "use strict";
    var WfUMUserActionsComponent = /** @class */ (function (_super) {
        __extends(WfUMUserActionsComponent, _super);
        function WfUMUserActionsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.SortOrder = wf_um_enyms_1.SortOrder;
            return _this;
        }
        WfUMUserActionsComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.busyContext = new BusyIndicator(this);
            this.customSubscriptions = [];
            this.tableDS = ko.observableArray([]);
            this.tableViewDS = ko.observableArray([]);
            this.searchText = ko.observable('');
            this.sortedColumn = { name: ko.observable(''), order: ko.observable('') };
            this.userActionFilter = this.settings.userActionFilter;
            this.activeUserActionConfigName = this.settings.activeUserActionConfigName;
            this.initializeComputeds();
            this.initializeDialogsVariables();
            this.refreshPage();
            this.height = ko.observable(ko.unwrap(this.settings.height) || null);
            this.panelBodyHeight = ko.pureComputed(function () {
                if (!_this.height()) {
                    return null;
                }
                return _this.height();
            });
        };
        WfUMUserActionsComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.connector.currentLoggedInUser.subscribe(function (newValue) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (utils_1.Utils.isNullOrUndefined(newValue)) {
                        this.clearAutoRefreshInterval();
                        this.tableDS([]);
                        this.tableViewDS([]);
                        this.clearFilter();
                    }
                    else {
                        this.refreshPage();
                    }
                    return [2 /*return*/];
                });
            }); });
            this.searchText.subscribe(function (newValue) {
                _this.onSearch(newValue);
            });
            this.activeUserActionConfigName.extend({ notify: 'always' });
            var actionConfigNameSubscription = this.activeUserActionConfigName.subscribe(function (newValue) {
                _this.getAllUserActions();
            });
            this.customSubscriptions.push(actionConfigNameSubscription);
            var autoUpdateSubscription = this.userActionFilter.AutoUpdate.subscribe(function (newValue) {
                if (newValue) {
                    _this.startAutoRefreshProcess();
                }
                else {
                    _this.clearAutoRefreshInterval();
                }
            });
            this.customSubscriptions.push(autoUpdateSubscription);
        };
        WfUMUserActionsComponent.prototype.refreshPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var users, currentFilterUsers_1, onlyCurrentSelectedUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.connector.currentLoggedInUser()) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAllUsers()];
                        case 1:
                            users = _a.sent();
                            currentFilterUsers_1 = this.userActionFilter.Users().map(function (item) { return item.ID; });
                            if (currentFilterUsers_1.length > 0) {
                                onlyCurrentSelectedUsers = users.filter(function (item) { return currentFilterUsers_1.indexOf(item.ID) > -1; });
                                this.userActionFilter.Users(onlyCurrentSelectedUsers);
                            }
                            else {
                                this.userActionFilter.Users(users);
                            }
                            this.getAllUserActions();
                            if (this.userActionFilter.AutoUpdate()) {
                                this.startAutoRefreshProcess();
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        WfUMUserActionsComponent.prototype.startAutoRefreshProcess = function () {
            var _this = this;
            if (utils_1.Utils.isNullOrUndefined(this.autoRefreshInterval) || this.autoRefreshInterval === false) {
                this.autoRefreshInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.getAllUserActions();
                        return [2 /*return*/];
                    });
                }); }, this.settings.updateRate);
            }
        };
        WfUMUserActionsComponent.prototype.initializeDialogsVariables = function () {
            var _this = this;
            // time interval  
            this.timeIntervalDialog = {
                show: ko.observable(false),
                responseMethod: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.getAllUserActions();
                        return [2 /*return*/];
                    });
                }); }
            };
            this.timeIntervalDialog.show = this.settings.showTimeIntervalDialog; // use reference from main page
            // filter  
            this.filterDialog = {
                show: ko.observable(false),
                responseMethod: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.getAllUserActions();
                        return [2 /*return*/];
                    });
                }); }
            };
            this.filterDialog.show = this.settings.showfilterDialog; // use reference from main page      
        };
        WfUMUserActionsComponent.prototype.getAllUserActions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingUserActions')(), function () { return __awaiter(_this, void 0, void 0, function () {
                        var response, parsedData, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    this.adjustFilterTime();
                                    return [4 /*yield*/, SilverlightToolsService.getWFEvents(this.userActionFilter.toDto(), this.connector.currentLanguageId())];
                                case 1:
                                    response = _a.sent();
                                    if (response) {
                                        parsedData = this.parseResponseData(response);
                                        this.tableDS(parsedData);
                                        this.tableViewDS(parsedData.slice());
                                        this.applyFilters();
                                    }
                                    else {
                                        this.tableDS([]);
                                        this.tableViewDS([]);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    this.connector.handleError(WfUMUserActionsComponent)(error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            });
        };
        WfUMUserActionsComponent.prototype.getAllUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, UsersService.getAllUsers(true)];
                        case 1:
                            response = _a.sent();
                            if (!isNullOrUndefined(response)) {
                                return [2 /*return*/, response.map(function (item) {
                                        return {
                                            ID: item.ID,
                                            Name: item.Name
                                        };
                                    })];
                            }
                            else {
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfUMUserActionsComponent.prototype.parseResponseData = function (data) {
            return data.map(function (item) {
                return {
                    Icon: item.Icon,
                    Time: moment(item.Time).format('DD.MM.YYYY HH:mm:ss'),
                    Event: item.EventText,
                    Text: item.Text,
                    UserName: item.User.Name,
                    AffectedUserName: item.AffectedUserName
                };
            });
        };
        WfUMUserActionsComponent.prototype.onSearch = function (newValue) {
            this.tableViewDS(utils_1.Utils.filterArrayMultiple(this.tableDS(), ['Event', 'Text'], newValue));
        };
        WfUMUserActionsComponent.prototype.onSortClick = function (columnName) {
            this.sortedColumn.name(columnName);
            this.sortedColumn.order(this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Asc ? wf_um_enyms_1.SortOrder.Desc : wf_um_enyms_1.SortOrder.Asc);
            var desc = this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Desc;
            // always sort both array because of search which always use original array
            this.tableViewDS.sort(utils_1.Utils.sortArray(columnName, desc));
            this.tableDS.sort(utils_1.Utils.sortArray(columnName, desc));
        };
        WfUMUserActionsComponent.prototype.applyFilters = function () {
            if (!utils_1.Utils.isNullUndefOrEmpty(this.sortedColumn.name())) {
                var desc = this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Desc;
                this.tableDS.sort(utils_1.Utils.sortArray(this.sortedColumn.name(), desc));
            }
            this.onSearch(this.searchText());
        };
        WfUMUserActionsComponent.prototype.clearAutoRefreshInterval = function () {
            if (this.autoRefreshInterval !== false) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = false;
            }
        };
        WfUMUserActionsComponent.prototype.clearCustomSubscriptions = function () {
            for (var i = 0; i < this.customSubscriptions.length; i++) {
                this.customSubscriptions[i].dispose();
            }
        };
        // DIALOGS
        WfUMUserActionsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.clearAutoRefreshInterval();
                            this.clearCustomSubscriptions();
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfUMUserActionsComponent.prototype.clearFilter = function () {
            this.userActionFilter.Users([]);
        };
        WfUMUserActionsComponent.prototype.adjustFilterTime = function () {
            if (!this.userActionFilter || !this.userActionFilter.AutoUpdate) {
                return;
            }
            var range = time_range_service_1.TimeRangeService.getRangeDates(this.userActionFilter.SelectedRangeInput(), this.userActionFilter.TimeRangeDateInput(), moment(this.userActionFilter.Time().Start()).toDate(), moment(this.userActionFilter.Time().End()).toDate(), this.userActionFilter.StartOffsetIntervall(), this.userActionFilter.StartOffset(), this.userActionFilter.EndOffsetIntervall(), this.userActionFilter.EndOffset());
            this.userActionFilter.Time().Start(moment(range.startDate).toMSDate());
            this.userActionFilter.Time().End(moment(range.endDate).toMSDate());
        };
        return WfUMUserActionsComponent;
    }(ComponentBaseModel));
    return WfUMUserActionsComponent;
});
//# sourceMappingURL=wf-um-user-actions.component.js.map