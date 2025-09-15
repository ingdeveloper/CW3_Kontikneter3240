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
define(["require", "exports", "../../../component-base.model", "../../../../services/authorizationGroupService", "../../../../decorators/busyIndicator", "../../../../services/logger", "../shared/wf-um-enyms", "../shared/utils"], function (require, exports, ComponentBaseModel, AuthorizationGroupService, BusyIndicator, Logger, wf_um_enyms_1, utils_1) {
    "use strict";
    var WfUMAuthorizationGroupsComponent = /** @class */ (function (_super) {
        __extends(WfUMAuthorizationGroupsComponent, _super);
        function WfUMAuthorizationGroupsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.SortOrder = wf_um_enyms_1.SortOrder;
            _this.initializeComputeds();
            return _this;
        }
        WfUMAuthorizationGroupsComponent.prototype.initializeSettings = function () {
            var _this = this;
            this.settings.systemAuthorization = "UserManager Operator";
            _super.prototype.initializeSettings.call(this);
            this.busyContext = new BusyIndicator(this);
            this.customSubscriptions = [];
            this.tableDS = ko.observableArray([]);
            this.tableViewDS = ko.observableArray([]);
            this.searchText = ko.observable('');
            this.sortedColumn = { name: ko.observable(''), order: ko.observable('') };
            this.refreshPageTrigger = this.settings.refreshPageTrigger;
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
        WfUMAuthorizationGroupsComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.connector.currentLoggedInUser.subscribe(function (value) {
                _this.refreshPage();
            });
            this.refreshPageTrigger.extend({ notify: 'always' });
            var refreshPageSubscription = this.refreshPageTrigger.subscribe(function (newValue) {
                if (wf_um_enyms_1.Pages.AuthorizationGroups === newValue) {
                    _this.refreshPage();
                }
            });
            this.customSubscriptions.push(refreshPageSubscription);
            this.searchText.subscribe(function (newValue) {
                _this.onSearch(newValue);
            });
        };
        WfUMAuthorizationGroupsComponent.prototype.initializeDialogsVariables = function () {
            var _this = this;
            // confirm
            this.confirmDialog = {
                selectedItem: null,
                show: ko.observable(false),
                responseMethod: function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyDeletingAuthGroup')(), function () { return __awaiter(_this, void 0, void 0, function () {
                            var newToken, itemToRemove, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, AuthorizationGroupService.deleteAuthorizationGroup(this.confirmDialog.selectedItem.ID)];
                                    case 1:
                                        newToken = _a.sent();
                                        if (newToken) {
                                            //this.connector.setSecurityToken(newToken);
                                            Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyDeleted')().replace(new RegExp("##name##", "ig"), this.confirmDialog.selectedItem.Name));
                                        }
                                        itemToRemove = utils_1.Utils.findObjInArray(this.tableDS(), 'ID', this.confirmDialog.selectedItem.ID);
                                        this.tableDS.remove(itemToRemove);
                                        this.tableViewDS.remove(itemToRemove);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        this.connector.handleError(WfUMAuthorizationGroupsComponent)(error_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); }
            };
            // clone name
            this.cloneNameDialog = {
                selectedItem: ko.observable(),
                tableData: ko.observableArray([]),
                show: ko.observable(false),
                responseMethod: function (cloneName) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyCloningAuthGroup')(), function () { return __awaiter(_this, void 0, void 0, function () {
                            var authorizationGroupClone, isInserted, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        authorizationGroupClone = JSON.parse(JSON.stringify(this.cloneNameDialog.selectedItem()));
                                        authorizationGroupClone.Name = cloneName;
                                        authorizationGroupClone.ID = uuid.v4();
                                        return [4 /*yield*/, AuthorizationGroupService.insertAuthorizationGroup(authorizationGroupClone)];
                                    case 1:
                                        isInserted = _a.sent();
                                        if (isInserted) {
                                            Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyCloned')().replace(new RegExp("##name##", "ig"), this.cloneNameDialog.selectedItem().Name));
                                            this.tableDS.push(authorizationGroupClone);
                                            this.applyFilters();
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_2 = _a.sent();
                                        this.connector.handleError(WfUMAuthorizationGroupsComponent)(error_2);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); }
            };
            // add/edit
            this.addEditDialog = {
                show: ko.observable(false),
                actionType: ko.observable(''),
                selectedItem: ko.observable(),
                responseMethod: function (authorizationGroup) {
                    // remove item and add it again how we can refresh table with updated value
                    if (_this.addEditDialog.actionType() === wf_um_enyms_1.Action.Edit) {
                        var indexOfEditedItem = utils_1.Utils.findIndexInArray(_this.tableDS(), 'ID', authorizationGroup.ID);
                        _this.tableDS()[indexOfEditedItem] = authorizationGroup;
                    }
                    else {
                        _this.tableDS.push(authorizationGroup);
                    }
                    _this.applyFilters();
                }
            };
        };
        WfUMAuthorizationGroupsComponent.prototype.refreshPage = function () {
            this.getAuthorizationGroups();
            this.applyFilters();
        };
        WfUMAuthorizationGroupsComponent.prototype.getAuthorizationGroups = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingAuthGroup')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, AuthorizationGroupService.getAllAuthorizationGroup()];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.tableDS(response);
                                this.tableViewDS(response.slice());
                            }
                            else {
                                this.tableDS([]);
                                this.tableViewDS([]);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfUMAuthorizationGroupsComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAuthorizationGroupsComponent.prototype.onSearch = function (newValue) {
            this.tableViewDS(utils_1.Utils.filterArray(this.tableDS(), 'Name', newValue));
        };
        WfUMAuthorizationGroupsComponent.prototype.onSortClick = function (columnName) {
            this.sortedColumn.name(columnName);
            this.sortedColumn.order(this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Asc ? wf_um_enyms_1.SortOrder.Desc : wf_um_enyms_1.SortOrder.Asc);
            var desc = this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Desc;
            // always sort both array because of search which always use original array
            this.tableViewDS.sort(utils_1.Utils.sortArray(columnName, desc));
            this.tableDS.sort(utils_1.Utils.sortArray(columnName, desc));
        };
        WfUMAuthorizationGroupsComponent.prototype.applyFilters = function () {
            if (!utils_1.Utils.isNullUndefOrEmpty(this.sortedColumn.name())) {
                var desc = this.sortedColumn.order() === wf_um_enyms_1.SortOrder.Desc;
                this.tableDS.sort(utils_1.Utils.sortArray(this.sortedColumn.name(), desc));
            }
            this.onSearch(this.searchText());
        };
        // DIALOGS
        // delete -------------------------------------------------------------------
        WfUMAuthorizationGroupsComponent.prototype.onDeleteClick = function (authorizationGroup) {
            this.confirmDialog.selectedItem = authorizationGroup;
            this.confirmDialog.show(true);
        };
        // clone --------------------------------------------------------------------
        WfUMAuthorizationGroupsComponent.prototype.onCloneClick = function (authorizationGroup) {
            this.cloneNameDialog.selectedItem(authorizationGroup);
            this.cloneNameDialog.tableData(this.tableDS());
            this.cloneNameDialog.show(true);
        };
        // add/edit -----------------------------------------------------
        WfUMAuthorizationGroupsComponent.prototype.onEditClick = function (authorizationGroup) {
            this.addEditDialog.actionType(wf_um_enyms_1.Action.Edit);
            this.addEditDialog.selectedItem(authorizationGroup);
            this.addEditDialog.show(true);
        };
        WfUMAuthorizationGroupsComponent.prototype.onAddClick = function () {
            this.addEditDialog.actionType(wf_um_enyms_1.Action.Add);
            this.addEditDialog.selectedItem(null);
            this.addEditDialog.show(true);
        };
        WfUMAuthorizationGroupsComponent.prototype.clearCustomSubscriptions = function () {
            for (var i = 0; i < this.customSubscriptions.length; i++) {
                this.customSubscriptions[i].dispose();
            }
        };
        WfUMAuthorizationGroupsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.clearCustomSubscriptions();
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfUMAuthorizationGroupsComponent;
    }(ComponentBaseModel));
    return WfUMAuthorizationGroupsComponent;
});
//# sourceMappingURL=wf-um-authorization-groups.component.js.map